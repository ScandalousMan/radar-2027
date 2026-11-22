// @vitest-environment node
import { cp, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parse, stringify } from 'yaml';
import { CandidateDetailSchema, MainDatasetSchema, VersionRegistrySchema } from '@/core/dataset';
import { openCache } from './lib/cache';
import { resolvePaths } from './lib/cli';
import { loadCorpus } from './lib/corpus';
import { buildDetail, buildMain, serialize } from './lib/publish/build';
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

  it('conserve commentaires, guillemets et lignes vides des fichiers de questions : seules les lignes introducedIn sont ajoutées', async () => {
    const paths = await tempFixture();
    const file = join(paths.corpusDir, 'questions', 'economie.yaml');
    const original = (await readFile(file, 'utf8'))
      .replace('- id: economie-q01', '# En-tête de traçabilité.\n\n# Relecture du 2026-11-10 : validé.\n- id: economie-q01')
      .replace('  text: Énoncé de test numéro 1 du thème Économie.', '  text: "Énoncé de test numéro 1 du thème Économie."')
      .replace('- id: economie-q02', '\n# Texte d’origine : ancien énoncé.\n- id: economie-q02');
    await writeFile(file, original);

    await publish(paths, { next: true, date: '2026-11-10' });
    const after = await readFile(file, 'utf8');
    // Retirer les lignes ajoutées redonne exactement le fichier d'origine.
    expect(after.split('\n').filter((l) => l !== '  introducedIn: 1').join('\n')).toBe(original);
    expect(after).toContain('# Relecture du 2026-11-10 : validé.\n- id: economie-q01');
    expect(after).toContain('  introducedIn: 1\n\n# Texte d’origine : ancien énoncé.\n- id: economie-q02');
    // 009 : seules les questions de la banque active reçoivent introducedIn.
    const main = await json(join(paths.publishedDir, 'versions', '1', 'main.json'));
    const published = new Set(main.questions.map((q: { id: string }) => q.id));
    for (const q of parse(after) as { id: string; introducedIn?: number }[]) expect(q.introducedIn).toBe(published.has(q.id) ? 1 : undefined);
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
    const v1 = await json(join(paths.publishedDir, 'versions', '1', 'main.json'));
    const file = join(paths.corpusDir, 'questions', 'economie.yaml');
    const qs = parse(await readFile(file, 'utf8'));
    // Question publiée en v1 sans position connue (complément de plancher) : on la retire du corpus.
    const retiredIdx = qs.findIndex((q: { id: string }) => q.id !== 'economie-q01' && q.id !== 'economie-q02' && v1.questions.some((p: { id: string }) => p.id === q.id));
    // Question publiée en v1 qui passera en réserve : aucune, la fixture n'en a pas ; une question absente reste sans retiredIn.
    const unpublishedIdx = qs.findIndex((q: { id: string }) => !v1.questions.some((p: { id: string }) => p.id === q.id));
    qs.push({ ...qs[9], id: 'economie-q11', polarity: '-', text: 'Énoncé de test numéro 11 du thème Économie.', introducedIn: undefined });
    qs.push({ ...qs[0], id: 'economie-q12', polarity: '+', text: 'Énoncé de test numéro 12 du thème Économie.', introducedIn: undefined });
    qs[retiredIdx].status = 'retired';
    await writeFile(file, stringify(qs));
    const r = await publish(paths, { next: true, date: '2026-11-12' });
    expect(r.version).toBe(2);
    const after = parse(await readFile(file, 'utf8'));
    expect(after[retiredIdx].retiredIn).toBe(2);
    expect(after[unpublishedIdx].retiredIn).toBeUndefined();
    const v2 = await json(join(paths.publishedDir, 'versions', '2', 'main.json'));
    for (const q of after as { id: string; introducedIn?: number }[])
      if (v2.questions.some((p: { id: string }) => p.id === q.id) && !v1.questions.some((p: { id: string }) => p.id === q.id)) expect(q.introducedIn).toBe(2);

    // Le dossier de la version suivante existe déjà ⇒ refus.
    const { mkdir } = await import('node:fs/promises');
    await mkdir(join(paths.publishedDir, 'versions', '3'), { recursive: true });
    qs[8].status = 'draft';
    await writeFile(file, stringify(parse(await readFile(file, 'utf8')).map((q: { id: string; status: string }) => (q.id === 'economie-q12' ? { ...q, status: 'draft' } : q))));
    await expect(publish(paths, { next: true, date: '2026-11-13' })).rejects.toThrow();
  });

  it('009 : --dry-run écrit le rapport de couverture et n’écrit rien sous public/data', async () => {
    const paths = await tempFixture();
    const dry = await publish(paths, { dryRun: true, date: '2026-11-10' });
    expect(dry.activeBank.k).toBe(1);
    expect(dry.report.version).toBe(1);
    expect(existsSync(join(paths.reportsDir, 'couverture-v1.json'))).toBe(true);
    expect(await readFile(join(paths.reportsDir, 'couverture-v1.md'), 'utf8')).toMatch(/^# Rapport de couverture — version 1/);
    expect(existsSync(join(paths.publishedDir, 'versions', '1'))).toBe(false);
    const report = await json(join(paths.reportsDir, 'couverture-v1.json'));
    expect(report.minQuestionCoverage).toBe(1);
    expect(report.themes).toHaveLength(3);
  });

  it('009 : --min-coverage sous le minimum calculé refusé ; au-dessus accepté', async () => {
    const paths = await tempFixture();
    await expect(publish(paths, { dryRun: true, minCoverage: 0 })).rejects.toThrow(/min-coverage 0 refusé/);
    const dry = await publish(paths, { dryRun: true, minCoverage: 2, date: '2026-11-10' });
    expect(dry.activeBank.k).toBe(2);
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

describe('projection publiée (006 contracts/corpus-delta.md)', () => {
  it('ni dimensions ni dimension dans main.json et les fichiers de détail', () => {
    const root = join(process.cwd(), 'data', 'fixtures', 'minimal');
    const { corpus } = loadCorpus(join(root, 'corpus'));
    corpus.themes[0]!.dimensions = [
      { id: 'choix', label: 'Choix', negative: 'a', positive: 'b' },
      { id: 'moyens', label: 'Moyens', negative: 'c', positive: 'd' },
    ];
    for (const q of corpus.questions.get(corpus.themes[0]!.id)!) q.dimension = 'choix';
    const options = { version: 1, publishedAt: '2026-11-15', cache: openCache(join(root, 'cache')) };
    const main = serialize(buildMain(corpus, options));
    expect(main).toContain(`"${corpus.themes[0]!.id}"`);
    expect(main).not.toMatch(/"dimensions?"/);
    for (const c of corpus.candidates) expect(serialize(buildDetail(corpus, c.id, options))).not.toMatch(/"dimensions?"/);
  });
});
