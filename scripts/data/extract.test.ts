// @vitest-environment node
// Extraction avec client factice sur la fixture minimale (SC-005, FR-026, FR-027, FR-029).
import { cp, mkdtemp, readFile, readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { resolvePaths } from './lib/cli';
import { loadCorpus } from './lib/corpus';
import { fakeClient, type FakeReply } from './lib/extraction/client';
import { runExtraction, type RunResult } from './lib/extraction/run';
import { RunSchema } from './lib/schema';

async function setup() {
  const dir = await mkdtemp(join(tmpdir(), 'radar-extract-'));
  await cp(join(process.cwd(), 'data', 'fixtures', 'minimal'), dir, { recursive: true });
  const paths = resolvePaths({ corpus: dir });
  return { paths, corpus: loadCorpus(paths.corpusDir).corpus };
}

const reply: FakeReply = {
  output: {
    affirmations: [
      { quote: 'Nous réduirons les impôts de production des entreprises industrielles.', summary: 'Baisse des impôts de production.', themes: ['economie'], question: 'economie-q02', proposedValue: -1, confidence: 'high' },
      { quote: "L'hôpital public recevra cinq milliards d'euros supplémentaires par an.", summary: "Hausse du budget de l'hôpital.", themes: ['sante'], question: 'sante-q03', proposedValue: 2, confidence: 'medium' },
      { quote: 'Nous nationaliserons toutes les banques.', summary: 'Citation inventée.', themes: ['economie'], question: 'economie-q04', proposedValue: 2, confidence: 'low' },
    ],
  },
};
const script = { 'dupont-programme-2027:0': reply };

async function run(env: Awaited<ReturnType<typeof setup>>, client = fakeClient(script), extra: Partial<Parameters<typeof runExtraction>[0]> = {}, at = '2026-11-08T10:00:00Z') {
  return (await runExtraction({
    corpus: env.corpus,
    cacheDir: env.paths.cacheDir,
    extractionsDir: env.paths.extractionsDir,
    candidateId: 'dupont',
    model: 'claude-opus-5-5',
    client,
    now: new Date(at),
    ...extra,
  })) as RunResult;
}

const snapshot = async (dir: string) => {
  const out: Record<string, string> = {};
  for (const f of await readdir(dir)) out[f] = await readFile(join(dir, f), 'utf8');
  return out;
};

describe('data:extract (client factice)', () => {
  it('(a, b) affirmations vérifiées et journal complet', async () => {
    const env = await setup();
    const r = await run(env);
    const affs = JSON.parse(await readFile(r.file, 'utf8'));
    expect(affs.map((a: { state: string }) => a.state)).toEqual(['verifiable', 'verifiable', 'unverifiable']);
    expect(affs[0].location).toEqual({ start: expect.any(Number), end: expect.any(Number) });
    const log = RunSchema.parse(JSON.parse(await readFile(join(env.paths.extractionsDir, 'runs', `${r.run.id}.json`), 'utf8')));
    expect(log).toMatchObject({ candidate: 'dupont', model: 'claude-opus-5-5', promptVersion: { name: 'extraction.v1' }, bankVersion: 0, status: 'completed', counts: { produced: 3, verifiable: 2, unverifiable: 1, duplicates: 0 } });
    expect(log.sources.map((s) => [s.id, s.contentHash.startsWith('sha256:'), s.status])).toEqual([
      ['dupont-programme-2027', true, 'done'],
      ['dupont-declaration-candidature', true, 'done'],
    ]);
    expect(log.usage.inputTokens).toBe(2000);
    expect(log.costUsd).toBeGreaterThan(0);
    const costs = JSON.parse(await readFile(join(env.paths.extractionsDir, 'costs.json'), 'utf8'));
    expect(costs).toMatchObject({ runs: 1, byModel: { 'claude-opus-5-5': log.costUsd }, byCandidate: { dupont: log.costUsd } });
  });

  it('(c, g) trois relances : 0 affirmation nouvelle, affirmations et positions inchangées', async () => {
    const env = await setup();
    const positionsBefore = await snapshot(join(env.paths.corpusDir, 'positions'));
    await run(env);
    const affBefore = await snapshot(join(env.paths.extractionsDir, 'affirmations'));
    for (const at of ['2026-11-08T11:00:00Z', '2026-11-08T12:00:00Z', '2026-11-08T13:00:00Z']) {
      const r = await run(env, fakeClient(script), {}, at);
      expect(r.added).toBe(0);
      expect(r.run.counts.duplicates).toBe(3);
    }
    expect(await snapshot(join(env.paths.extractionsDir, 'affirmations'))).toEqual(affBefore);
    expect(await snapshot(join(env.paths.corpusDir, 'positions'))).toEqual(positionsBefore);
    expect(await readdir(join(env.paths.extractionsDir, 'runs'))).toHaveLength(4);
  });

  it('(d) plafond minuscule : interruption propre après la première tranche', async () => {
    const env = await setup();
    // Estimation par tranche : (1000 × 4 + 16000 × 20) / 1e6 = 0,324 $ ; coût réel de la première :
    // 0,008 $. Avec un plafond de 0,33 $, la seconde requête (0,008 + 0,324 > 0,33) n'est pas envoyée.
    const r = await run(env, fakeClient(script), { maxCostUsd: 0.33 });
    expect(r.run.status).toBe('interrupted');
    expect(r.run.sources.map((s) => s.status)).toEqual(['done', 'skipped']);
    expect(r.added).toBe(3);
  });

  it('(e) refus sur une tranche : tranche échouée, exécution terminée', async () => {
    const env = await setup();
    const client = fakeClient({ ...script, 'dupont-declaration-candidature:0': { output: null, stopReason: 'refusal' } });
    const r = await run(env, client);
    expect(r.run.status).toBe('completed');
    expect(r.run.sources[1]).toMatchObject({ status: 'failed', failedChunks: 1 });
  });

  it('(f) --dry-run : aucun appel extract, estimation retournée, rien d’écrit', async () => {
    const env = await setup();
    const client = fakeClient(script);
    const r = await runExtraction({ corpus: env.corpus, cacheDir: env.paths.cacheDir, extractionsDir: env.paths.extractionsDir, candidateId: 'dupont', model: 'claude-opus-5-5', client, dryRun: true });
    expect(client.calls.extract).toBe(0);
    expect(r).toMatchObject({ dryRun: true, chunks: 2, estimatedTokens: 2000 });
    await expect(readdir(env.paths.extractionsDir)).rejects.toThrow();
  });

  it('préconditions : source absente du cache, banque vide', async () => {
    const env = await setup();
    await expect(run(env, fakeClient(script), { cacheDir: join(env.paths.rootDir, 'vide') })).rejects.toThrow(/absent du cache/);
    for (const qs of env.corpus.questions.values()) for (const q of qs) q.status = 'draft';
    await expect(run(env)).rejects.toThrow(/aucune question active/);
  });
});
