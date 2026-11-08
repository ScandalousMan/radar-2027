// pnpm data:review <candidat> <question> --by <contributeur> [--contest] [--date <YYYY-MM-DD>]
// (FR-018 à FR-020, US2 scénario 4).
import { join } from 'node:path';
import { fail, info, parseCli, resolvePaths, runCli, today, usage, type DataPaths } from './lib/cli';
import { buildContext } from './lib/context';
import { positionId, readYamlRaw, writeYaml } from './lib/corpus';
import { positionHash } from './lib/positions';
import { POSITION_RULES, runRules } from './lib/rules';

const HELP = 'Usage : pnpm data:review <candidat> <question> --by <contributeur> [--contest] [--date <YYYY-MM-DD>] [--corpus <dossier>]';

export type ReviewOptions = { candidate: string; question: string; by: string; contest?: boolean; date?: string };

/** Relit une position : `draft` → `reviewed` (ou `contested`), `contested` → `reviewed` (arbitrage). */
export function reviewPosition(paths: DataPaths, opts: ReviewOptions): { status: 'reviewed' | 'contested'; file: string } {
  const { ctx } = buildContext(paths);
  const id = positionId(opts.candidate, opts.question);
  const list = ctx.corpus.positions.get(opts.candidate);
  const position = list?.find((p) => p.question === opts.question);
  if (!position) fail(`Position introuvable : ${id}.`);
  if (!ctx.corpus.contributors.some((c) => c.id === opts.by)) fail(`Contributeur inconnu : ${opts.by}.`);
  if (opts.by === position.author) fail(`Le relecteur ne peut pas être l'auteur (${position.author}).`);
  if (position.status === 'reviewed') fail(`Position déjà relue : ${id}. La modifier la repasse en draft.`);
  if (position.status === 'contested' && opts.contest) fail(`Position déjà contestée : ${id}. Relire sans --contest pour trancher.`);

  const status = opts.contest ? 'contested' : 'reviewed';
  const reviewedAt = opts.date ?? today();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(reviewedAt)) usage(`Date invalide : ${reviewedAt} (YYYY-MM-DD attendu).`);
  const reviewedHash = positionHash(position);

  // Simulation : les règles de la position doivent passer avec le nouvel état.
  Object.assign(position, { status, reviewer: opts.by, reviewedAt, reviewedHash });
  const concerned = new Set([id, ...position.sources]);
  const { violations } = runRules(ctx, POSITION_RULES);
  const blocking = violations.filter((v) => concerned.has(v.entity.id));
  if (blocking.length > 0) fail(`Relecture refusée pour ${id} :\n${blocking.map((v) => `  ✗ ${v.rule} ${v.entity.id} : ${v.message}`).join('\n')}`);

  const file = join(paths.corpusDir, 'positions', `${opts.candidate}.yaml`);
  const raw = readYamlRaw(file) as Record<string, unknown>[];
  const entry = raw.find((p) => p.question === opts.question);
  if (!entry) fail(`Position introuvable dans ${file}.`);
  Object.assign(entry, { status, reviewer: opts.by, reviewedAt, reviewedHash });
  writeYaml(file, raw);
  return { status, file };
}

async function main(argv: string[]): Promise<number> {
  const { values, positionals } = parseCli(
    argv,
    { by: { type: 'string' }, contest: { type: 'boolean' }, date: { type: 'string' }, corpus: { type: 'string' } },
    HELP,
  );
  const [candidate, question] = positionals;
  if (!candidate || !question || !values.by || positionals.length > 2) usage(HELP);
  const r = reviewPosition(resolvePaths({ corpus: values.corpus }), { candidate, question, by: values.by, contest: values.contest, date: values.date });
  info(`Position ${positionId(candidate, question)} passée en ${r.status} par ${values.by}.`);
  return 0;
}

if (process.argv[1] && /review\.ts$/.test(process.argv[1])) void runCli(() => main(process.argv.slice(2)));
