// pnpm data:costs : cumul des coûts d'extraction par modèle et par candidat (SC-006).
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { info, parseCli, resolvePaths, runCli, type DataPaths } from './lib/cli';
import { CostsSchema, EMPTY_COSTS, RunSchema, type Costs, type Run } from './lib/schema';

const HELP = 'Usage : pnpm data:costs [--corpus <dossier>]';

export function readCosts(paths: DataPaths): { costs: Costs; runs: Run[] } {
  const file = join(paths.extractionsDir, 'costs.json');
  const costs = existsSync(file) ? CostsSchema.parse(JSON.parse(readFileSync(file, 'utf8'))) : EMPTY_COSTS;
  const dir = join(paths.extractionsDir, 'runs');
  const runs = existsSync(dir)
    ? readdirSync(dir)
        .filter((f) => f.endsWith('.json'))
        .sort()
        .map((f) => RunSchema.parse(JSON.parse(readFileSync(join(dir, f), 'utf8'))))
    : [];
  return { costs, runs };
}

async function main(argv: string[]): Promise<number> {
  const { values } = parseCli(argv, { corpus: { type: 'string' } }, HELP);
  const { costs, runs } = readCosts(resolvePaths({ corpus: values.corpus }));
  info(`Coût total : ${costs.totalUsd.toFixed(4)} $ sur ${costs.runs} exécution(s).`);
  for (const [model, usd] of Object.entries(costs.byModel)) info(`  modèle ${model} : ${usd.toFixed(4)} $`);
  for (const [candidate, usd] of Object.entries(costs.byCandidate)) info(`  candidat ${candidate} : ${usd.toFixed(4)} $`);
  if (runs.length > 0) {
    info('Dernières exécutions :');
    for (const r of runs.slice(-10)) info(`  ${r.id} ${r.candidate} ${r.status} ${r.costUsd.toFixed(4)} $`);
  }
  return 0;
}

if (process.argv[1] && /costs\.ts$/.test(process.argv[1])) void runCli(() => main(process.argv.slice(2)));
