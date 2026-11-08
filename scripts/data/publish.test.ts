// @vitest-environment node
import { cp, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parse, stringify } from 'yaml';
import { CandidateDetailSchema, MainDatasetSchema, VersionRegistrySchema } from '@/core/dataset';
import { resolvePaths } from './lib/cli';
import { publish } from './publish';
import { validate } from './validate';

async function tempFixture() {
  const dir = await mkdtemp(join(tmpdir(), 'radar-publish-'));
  await cp(join(process.cwd(), 'data', 'fixtures', 'minimal'), dir, { recursive: true });
  return resolvePaths({ corpus: dir });
}

const json = async (file: string) => JSON.parse(await readFile(file, 'utf8'));

describe('data:publish', () => {
  it('première publication : différence sans --next refusée, --dry-run sans écriture, puis --next', async () => {
    const paths = await tempFixture();
    await expect(publish(paths, { date: '2026-11-10' })).rejects.toThrow(/--next/);
    const dry = await publish(paths, { dryRun: true, date: '2026-11-10' });
    expect(dry.kind).toBe('dry-run');
    expect(existsSync(join(paths.publishedDir, 'versions', '1'))).toBe(false);

    const r = await publish(paths, { next: true, date: '2026-11-10' });
    expect(r).toMatchObject({ kind: 'published', version: 1 });
    const registry = VersionRegistrySchema.parse(await json(join(paths.publishedDir, 'versions.json')));
    expect(registry.current).toBe(1);
    const main = MainDatasetSchema.parse(await json(join(paths.publishedDir, 'versions', '1', 'main.json')));
    expect(main.candidates).toHaveLength(2);
    CandidateDetailSchema.parse(await json(join(paths.publishedDir, 'versions', '1', 'candidates', 'dupont.json')));
    const eco = parse(await readFile(join(paths.corpusDir, 'questions', 'economie.yaml'), 'utf8'));
    expect(eco[0].introducedIn).toBe(1);
    expect((await validate(paths)).violations).toEqual([]);

    // Rien à publier ensuite.
    await expect(publish(paths, { next: true, date: '2026-11-11' })).rejects.toThrow(/Rien à publier/);
  });

  it('un octet modifié dans une version publiée ⇒ PUB-IMMUTABLE', async () => {
    const paths = await tempFixture();
    await publish(paths, { next: true, date: '2026-11-10' });
    const file = join(paths.publishedDir, 'versions', '1', 'main.json');
    await writeFile(file, (await readFile(file, 'utf8')).replace('"version":1', '"version":1 '));
    expect((await validate(paths)).violations.map((v) => v.rule)).toContain('PUB-IMMUTABLE');
  });

  it('nouvelle version après retrait d’une question : retiredIn posé, refus d’écrasement', async () => {
    const paths = await tempFixture();
    await publish(paths, { next: true, date: '2026-11-10' });
    const file = join(paths.corpusDir, 'questions', 'economie.yaml');
    const qs = parse(await readFile(file, 'utf8'));
    qs.push({ ...qs[9], id: 'economie-q11', polarity: '-', text: 'Énoncé de test numéro 11 du thème Économie.', introducedIn: undefined });
    qs.push({ ...qs[0], id: 'economie-q12', polarity: '+', text: 'Énoncé de test numéro 12 du thème Économie.', introducedIn: undefined });
    qs[9].status = 'retired';
    await writeFile(file, stringify(qs));
    const r = await publish(paths, { next: true, date: '2026-11-12' });
    expect(r.version).toBe(2);
    const after = parse(await readFile(file, 'utf8'));
    expect(after[9].retiredIn).toBe(2);
    expect(after.find((q: { id: string }) => q.id === 'economie-q11').introducedIn).toBe(2);

    // Le dossier de la version suivante existe déjà ⇒ refus.
    const { mkdir } = await import('node:fs/promises');
    await mkdir(join(paths.publishedDir, 'versions', '3'), { recursive: true });
    qs[8].status = 'draft';
    await writeFile(file, stringify(parse(await readFile(file, 'utf8')).map((q: { id: string; status: string }) => (q.id === 'economie-q12' ? { ...q, status: 'draft' } : q))));
    await expect(publish(paths, { next: true, date: '2026-11-13' })).rejects.toThrow();
  });

  it('refuse sans cache ou avec un texte manquant', async () => {
    const paths = await tempFixture();
    await rm(join(paths.cacheDir, 'fb53cdcf9ca10dcabaf9bb3bffb22249dd397d7583638c030014b92d3cafa8b2.txt'));
    await expect(publish(paths, { next: true })).rejects.toThrow(/martin-declaration-candidature/);
    await rm(paths.cacheDir, { recursive: true });
    await expect(publish(paths, { next: true })).rejects.toThrow(/cache des sources absent/);
  });

  it('refuse au-delà de 256 versions', async () => {
    const paths = await tempFixture();
    const entry = (n: number) => ({ number: n, publishedAt: '2026-11-10', questionCount: 1, candidateCount: 1, mainHash: `sha256:${'a'.repeat(64)}`, detailHashes: {} });
    await writeFile(join(paths.publishedDir, 'versions.json'), JSON.stringify({ current: 256, versions: Array.from({ length: 256 }, (_, i) => entry(i + 1)) }));
    await expect(publish(paths, { next: true })).rejects.toThrow();
  });
});
