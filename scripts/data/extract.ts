// pnpm data:extract --candidate <id> [--sources a,b] [--max-cost <usd>] [--model <id>] [--dry-run]
// (FR-023 à FR-030). Jamais exécutée en CI ; `--dry-run` fonctionne sans clé (estimation locale).
import { fail, info, parseCli, resolvePaths, runCli, usage } from './lib/cli';
import { loadCorpus } from './lib/corpus';
import { anthropicClient, estimatingClient } from './lib/extraction/client';
import { runExtraction } from './lib/extraction/run';
import { readRegistry } from './lib/publish/registry';
import { priceOf } from './lib/pricing';

const HELP = 'Usage : pnpm data:extract --candidate <id> [--sources a,b] [--max-cost <usd>] [--model <id>] [--dry-run] [--corpus <dossier>]';

export const DEFAULT_MODEL = 'claude-opus-5-5';

async function main(argv: string[]): Promise<number> {
  const { values, positionals } = parseCli(
    argv,
    {
      candidate: { type: 'string' },
      sources: { type: 'string' },
      'max-cost': { type: 'string' },
      model: { type: 'string' },
      'dry-run': { type: 'boolean' },
      corpus: { type: 'string' },
    },
    HELP,
  );
  if (!values.candidate || positionals.length > 0) usage(HELP);
  const maxCost = values['max-cost'] !== undefined ? Number(values['max-cost']) : null;
  if (maxCost !== null && !(maxCost >= 0)) usage(`--max-cost invalide : ${values['max-cost']}`);
  const model = values.model ?? process.env.RADAR_EXTRACTION_MODEL ?? DEFAULT_MODEL;
  try {
    priceOf(model);
  } catch (error) {
    usage(error instanceof Error ? error.message : String(error));
  }
  const dryRun = values['dry-run'] === true;
  if (!dryRun && !process.env.ANTHROPIC_API_KEY) fail('ANTHROPIC_API_KEY absente : définir la clé dans .env.local ou l’environnement (ou utiliser --dry-run).');

  const paths = resolvePaths({ corpus: values.corpus });
  const { corpus, violations } = loadCorpus(paths.corpusDir);
  if (violations.length > 0) fail(`Corpus invalide (${violations.length} erreur(s) de forme) : lancer pnpm data:validate.`);
  const result = await runExtraction({
    corpus,
    cacheDir: paths.cacheDir,
    extractionsDir: paths.extractionsDir,
    candidateId: values.candidate,
    sourceIds: values.sources?.split(',').map((s) => s.trim()).filter(Boolean),
    model,
    maxCostUsd: maxCost,
    dryRun,
    client: dryRun ? estimatingClient() : anthropicClient(model),
    bankVersion: readRegistry(paths.publishedDir).current,
  });
  if (result.dryRun) {
    info(`Simulation (${model}) : ${result.sources.length} source(s), ${result.chunks} tranche(s), ~${result.estimatedTokens} jetons d'entrée.`);
    info(`Coût maximal estimé (sortie au plafond) : ${result.estimatedCostUsd.toFixed(4)} $. Aucun appel effectué.`);
    return 0;
  }
  const { run, added } = result;
  info(`Exécution ${run.id} (${run.model}) : ${run.status}.`);
  info(`Tranches : ${run.sources.reduce((n, s) => n + s.chunks, 0)} (${run.sources.reduce((n, s) => n + s.failedChunks, 0)} échouée(s)).`);
  info(`Affirmations : ${run.counts.produced} produites, ${run.counts.verifiable} vérifiables, ${run.counts.unverifiable} non vérifiables, ${run.counts.duplicates} doublons, ${added} nouvelles.`);
  info(`Coût : ${run.costUsd.toFixed(4)} $${run.maxCostUsd !== null ? ` (plafond ${run.maxCostUsd} $)` : ''}.`);
  return run.status === 'failed' ? 1 : 0;
}

if (process.argv[1] && /extract\.ts$/.test(process.argv[1])) void runCli(() => main(process.argv.slice(2)));
