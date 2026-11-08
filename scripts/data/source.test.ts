// @vitest-environment node
import { cp, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { resolvePaths } from './lib/cli';
import { addSource, checkSources, precisionOf, slugify, type FetchLike } from './source';

async function tempFixture() {
  const dir = await mkdtemp(join(tmpdir(), 'radar-source-'));
  await cp(join(process.cwd(), 'data', 'fixtures', 'minimal'), dir, { recursive: true });
  return resolvePaths({ corpus: dir });
}

const fakeFetch = (status: number): FetchLike => async () => ({
  ok: status < 400,
  status,
  headers: { get: () => 'text/plain' },
  arrayBuffer: async () => new TextEncoder().encode('Texte téléchargé suffisamment long pour être conservé.').buffer as ArrayBuffer,
});

describe('data:source', () => {
  it('déduit la précision et l’identifiant', () => {
    expect(precisionOf('2026')).toBe('year');
    expect(precisionOf('2026-03')).toBe('month');
    expect(precisionOf('2026-03-14')).toBe('day');
    expect(() => precisionOf('14/03/2026')).toThrow();
    expect(slugify('Entretien à « RTL » — 2026')).toBe('entretien-a-rtl-2026');
  });

  it('fetch --from-file : cache, empreinte et entrée YAML', async () => {
    const paths = await tempFixture();
    const txt = join(paths.rootDir, 'texte.txt');
    await writeFile(txt, 'Je propose  d’augmenter le budget de la santé de 10 % par an.');
    const added = await addSource(paths, {
      url: 'https://exemple.fr/martin/tribune',
      candidates: ['martin'],
      kind: 'declaration_vote',
      title: 'Tribune santé',
      published: '2026-10',
      fromFile: txt,
      now: new Date('2026-11-08T10:00:00Z'),
    });
    expect(added.id).toBe('martin-tribune-sante');
    const list = parse(await readFile(join(paths.corpusDir, 'sources', 'martin.yaml'), 'utf8'));
    expect(list.at(-1)).toMatchObject({
      id: 'martin-tribune-sante',
      publishedAt: { date: '2026-10', precision: 'month' },
      accessedAt: '2026-11-08',
      contentHash: added.contentHash,
    });
    const cached = await readFile(join(paths.cacheDir, `${added.contentHash.slice(7)}.txt`), 'utf8');
    expect(cached).toBe("Je propose d'augmenter le budget de la santé de 10 % par an.");
  });

  it('crée le dossier sources/ s’il n’existe pas encore', async () => {
    const paths = await tempFixture();
    const { rm } = await import('node:fs/promises');
    await rm(join(paths.corpusDir, 'sources'), { recursive: true });
    const added = await addSource(paths, { url: 'https://exemple.fr/x', candidates: ['dupont'], kind: 'declaration_vote', title: 'X', published: '2026' }, fakeFetch(200));
    expect(added.file.endsWith(join('sources', 'dupont.yaml'))).toBe(true);
  });

  it('plusieurs candidats ⇒ commun.yaml ; téléchargement via fetch', async () => {
    const paths = await tempFixture();
    const added = await addSource(
      paths,
      { url: 'https://exemple.fr/debat', candidates: ['dupont', 'martin'], kind: 'declaration_vote', title: 'Débat', published: '2026-11-01' },
      fakeFetch(200),
    );
    expect(added.file.endsWith(join('sources', 'commun.yaml'))).toBe(true);
  });

  it('refuse une adresse déjà présente et un téléchargement en échec', async () => {
    const paths = await tempFixture();
    const opts = { url: 'https://exemple.fr/dupont/programme-2027', candidates: ['dupont'], kind: 'programme' as const, title: 'X', published: '2026' };
    await expect(addSource(paths, opts, fakeFetch(200))).rejects.toThrow(/déjà enregistrée/);
    await expect(addSource(paths, { ...opts, url: 'https://exemple.fr/404' }, fakeFetch(404))).rejects.toThrow(/--from-file/);
  });

  it('check : empreintes, puis adresses inaccessibles en ligne', async () => {
    const paths = await tempFixture();
    expect(await checkSources(paths)).toEqual({ mismatches: [], missing: [], unreachable: [], recovered: [] });
    const r = await checkSources(paths, { online: true, now: new Date('2026-11-08T00:00:00Z') }, fakeFetch(404));
    expect(r.unreachable).toHaveLength(3);
    const list = parse(await readFile(join(paths.corpusDir, 'sources', 'martin.yaml'), 'utf8'));
    expect(list[0].unreachableSince).toBe('2026-11-08');
    const again = await checkSources(paths, { online: true }, fakeFetch(200));
    expect(again.recovered).toHaveLength(3);
  });

  it('check : détecte un texte de cache modifié', async () => {
    const paths = await tempFixture();
    const hash = 'e7b60efd322103d49ec2cc0fca9fb189337a2667aa3f20d6c35fca43f8bad10b';
    await writeFile(join(paths.cacheDir, `${hash}.txt`), 'texte modifié');
    const r = await checkSources(paths);
    expect(r.mismatches.map((m) => m.id)).toEqual(['dupont-programme-2027']);
  });
});
