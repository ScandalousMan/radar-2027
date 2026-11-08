// Exécution d'une extraction (FR-023 à FR-029) : tranches, plafond de coût vérifié avant chaque
// requête, citations vérifiées par nous, fusion idempotente, journal et cumul des coûts.
// N'écrit jamais dans data/corpus/positions.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { readCached } from '../cache';
import { fail } from '../cli';
import { allSources } from '../corpus';
import { costFromUsage, estimateCost } from '../pricing';
import { AffirmationsFileSchema, CostsSchema, EMPTY_COSTS, type Affirmation, type Corpus, type Costs, type Run, type Usage } from '../schema';
import { sha256 } from '../text';
import { chunkText } from './chunk';
import type { ExtractionClient } from './client';
import { idFor, mergeAffirmations, verifyAffirmation } from './merge';
import { activeQuestions, loadPrompt, renderSystem, type Prompt } from './prompt';

export const MAX_TOKENS = 16_000;
const FAILED_STOP_REASONS = new Set(['refusal', 'max_tokens']);

export type RunOptions = {
  corpus: Corpus;
  cacheDir: string;
  extractionsDir: string;
  candidateId: string;
  sourceIds?: string[];
  model: string;
  maxCostUsd?: number | null;
  dryRun?: boolean;
  client: ExtractionClient;
  now?: Date;
  bankVersion?: number;
  prompt?: Prompt;
  chunkSize?: number;
};

export type DryRunResult = { dryRun: true; chunks: number; estimatedTokens: number; estimatedCostUsd: number; sources: string[] };
export type RunResult = { dryRun: false; run: Run; added: number; file: string };

const round4 = (n: number) => Math.round(n * 10_000) / 10_000;

export function runIdFor(now: Date, hashes: string[], bankVersion: number, model: string, promptHash: string): string {
  const stamp = now.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  return `${stamp}-${sha256([...hashes].sort().join(',') + `|${bankVersion}|${model}|${promptHash}`).slice(7, 15)}`;
}

function readJson<T>(file: string, parse: (v: unknown) => T, fallback: T): T {
  return existsSync(file) ? parse(JSON.parse(readFileSync(file, 'utf8'))) : fallback;
}

const writeJson = (file: string, value: unknown) => writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');

export async function runExtraction(opts: RunOptions): Promise<DryRunResult | RunResult> {
  const { corpus, candidateId, model, client } = opts;
  const now = opts.now ?? new Date();
  if (!corpus.candidates.some((c) => c.id === candidateId)) fail(`Candidat inconnu : ${candidateId}.`);
  const bank = activeQuestions(corpus);
  if (bank.length === 0) fail('Extraction refusée : la banque ne contient aucune question active.');
  const activeIds = new Set(bank.map((q) => q.id));
  const themeIds = new Set(corpus.themes.map((t) => t.id));

  const candidateSources = allSources(corpus)
    .map(({ source }) => source)
    .filter((s) => s.candidates.includes(candidateId));
  const selected = opts.sourceIds ? opts.sourceIds.map((id) => candidateSources.find((s) => s.id === id) ?? fail(`Source inconnue pour ${candidateId} : ${id}.`)) : candidateSources;
  if (selected.length === 0) fail(`Aucune source enregistrée pour ${candidateId}.`);
  const texts = new Map<string, string>();
  for (const s of selected) {
    const text = s.contentHash ? readCached(opts.cacheDir, s.contentHash) : null;
    if (text === null) fail(`Extraction refusée : texte de la source ${s.id} absent du cache (${opts.cacheDir}).`);
    texts.set(s.id, text);
  }

  const prompt = opts.prompt ?? loadPrompt();
  const system = renderSystem(prompt, corpus);
  const bankVersion = opts.bankVersion ?? 0;
  const runId = runIdFor(now, selected.map((s) => s.contentHash!), bankVersion, model, prompt.hash);
  const maxCost = opts.maxCostUsd ?? null;

  const usage: Usage = { inputTokens: 0, outputTokens: 0, cacheWriteTokens: 0, cacheReadTokens: 0 };
  const counts = { produced: 0, verifiable: 0, unverifiable: 0, duplicates: 0 };
  const sources: Run['sources'] = [];
  const incoming: Affirmation[] = [];
  let cost = 0;
  let interrupted = false;
  let estimatedTokens = 0;
  let estimatedCost = 0;
  let totalChunks = 0;
  let failedTotal = 0;

  for (const s of selected) {
    const text = texts.get(s.id)!;
    const chunks = chunkText(text, { size: opts.chunkSize ?? 12_000, overlap: 500 });
    totalChunks += chunks.length;
    if (interrupted) {
      sources.push({ id: s.id, contentHash: s.contentHash!, chunks: chunks.length, failedChunks: 0, status: 'skipped' });
      continue;
    }
    let failed = 0;
    for (const [index, chunk] of chunks.entries()) {
      const req = { system, chunk: { text: chunk.text, index, total: chunks.length }, sourceId: s.id, model, maxTokens: MAX_TOKENS };
      const tokens = await client.countTokens(req);
      const estimate = estimateCost(model, tokens, MAX_TOKENS);
      if (opts.dryRun) {
        estimatedTokens += tokens;
        estimatedCost += estimate;
        continue;
      }
      if (maxCost !== null && cost + estimate > maxCost) {
        interrupted = true;
        break;
      }
      const response = await client.extract(req);
      usage.inputTokens += response.usage.inputTokens;
      usage.outputTokens += response.usage.outputTokens;
      usage.cacheWriteTokens += response.usage.cacheWriteTokens;
      usage.cacheReadTokens += response.usage.cacheReadTokens;
      cost = round4(cost + costFromUsage(model, response.usage));
      if (FAILED_STOP_REASONS.has(response.stopReason) || !response.output) {
        failed++;
        continue;
      }
      for (const raw of response.output.affirmations) {
        counts.produced++;
        const verified = verifyAffirmation(raw, text);
        const question = raw.question && activeIds.has(raw.question) ? raw.question : null;
        const themes = raw.themes.filter((t) => themeIds.has(t)).slice(0, 2);
        if (verified.state === 'verifiable') counts.verifiable++;
        else counts.unverifiable++;
        incoming.push({
          id: idFor(s.id, verified, question),
          run: runId,
          source: s.id,
          location: verified.location,
          quote: verified.quote.slice(0, 300),
          summary: raw.summary,
          themes: themes.length > 0 ? themes : [bank.find((q) => q.id === question)?.themes[0] ?? corpus.themes[0]!.id],
          question,
          proposedValue: raw.proposedValue,
          confidence: raw.confidence,
          state: verified.state,
        });
      }
    }
    failedTotal += failed;
    const processed = interrupted ? 'skipped' : failed === chunks.length ? 'failed' : 'done';
    sources.push({ id: s.id, contentHash: s.contentHash!, chunks: chunks.length, failedChunks: failed, status: processed });
  }

  if (opts.dryRun) return { dryRun: true, chunks: totalChunks, estimatedTokens, estimatedCostUsd: round4(estimatedCost), sources: selected.map((s) => s.id) };

  // Fusion idempotente dans affirmations/<candidat>.json.
  const affDir = join(opts.extractionsDir, 'affirmations');
  mkdirSync(affDir, { recursive: true });
  const file = join(affDir, `${candidateId}.json`);
  const existing = readJson(file, (v) => AffirmationsFileSchema.parse(v), []);
  const { merged, added, duplicates } = mergeAffirmations(existing, incoming);
  counts.duplicates = duplicates;
  if (added > 0 || !existsSync(file)) writeJson(file, merged);

  const status: Run['status'] = interrupted ? 'interrupted' : totalChunks > 0 && failedTotal === totalChunks ? 'failed' : 'completed';
  const run: Run = {
    id: runId,
    startedAt: now.toISOString(),
    endedAt: new Date(Math.max(Date.now(), now.getTime())).toISOString(),
    candidate: candidateId,
    model,
    promptVersion: { name: prompt.name, hash: prompt.hash },
    bankVersion,
    sources,
    counts,
    usage,
    costUsd: cost,
    maxCostUsd: maxCost,
    status,
    ...(interrupted ? { error: `plafond de coût atteint (${maxCost} $) avant la tranche suivante` } : {}),
    ...(status === 'failed' ? { error: 'toutes les tranches ont échoué (refus ou réponse tronquée)' } : {}),
  };
  const runsDir = join(opts.extractionsDir, 'runs');
  mkdirSync(runsDir, { recursive: true });
  writeJson(join(runsDir, `${runId}.json`), run);

  const costsFile = join(opts.extractionsDir, 'costs.json');
  const costs: Costs = readJson(costsFile, (v) => CostsSchema.parse(v), { ...EMPTY_COSTS, byModel: {}, byCandidate: {} });
  costs.runs += 1;
  costs.totalUsd = round4(costs.totalUsd + cost);
  costs.byModel[model] = round4((costs.byModel[model] ?? 0) + cost);
  costs.byCandidate[candidateId] = round4((costs.byCandidate[candidateId] ?? 0) + cost);
  writeJson(costsFile, costs);

  return { dryRun: false, run, added, file };
}
