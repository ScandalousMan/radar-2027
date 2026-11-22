// pnpm data:gaps [--date] [--candidate]… [--theme]… [--limit] [--min-coverage] [--corpus] (spec 009
// FR-009, R6, contracts/data-commands.md) : positions manquantes classées par gain attendu.
// Écrit data/reports/trous/<date>.json (toutes les lignes) et .md (missions bornées par --limit).
// Lecture seule sur le corpus ; déterministe à corpus et date égaux.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fail, info, parseCli, resolvePaths, runCli, today, usage, versionedReportsDir, type DataPaths } from './lib/cli';
import { buildContext } from './lib/context';
import { computeGaps, missionsOf, renderGapsMarkdown, type GapsResult } from './lib/gaps';
import { ActiveBankError } from './lib/publish/active-bank';

const HELP = 'Usage : pnpm data:gaps [--date <YYYY-MM-DD>] [--candidate <id>]… [--theme <id>]… [--limit <n>] [--min-coverage <k>] [--corpus <dossier>]';

export type GapsOptions = { date?: string; candidates?: string[]; themes?: string[]; limit?: number; minCoverage?: number };

export type GapsRun = GapsResult & { files: string[]; date: string; labels: Map<string, string> };

export function gaps(paths: DataPaths, opts: GapsOptions = {}): GapsRun {
  const date = opts.date ?? today();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) usage(`Date invalide : ${date}.`);
  const { ctx } = buildContext(paths);
  const known = { candidates: new Set(ctx.corpus.candidates.map((c) => c.id)), themes: new Set(ctx.corpus.themes.map((t) => t.id)) };
  for (const c of opts.candidates ?? []) if (!known.candidates.has(c)) usage(`Candidat inconnu : ${c}.`);
  for (const t of opts.themes ?? []) if (!known.themes.has(t)) usage(`Thème inconnu : ${t}.`);
  let result: GapsResult;
  try {
    result = computeGaps(ctx, ctx.research, { candidates: opts.candidates, themes: opts.themes, minCoverage: opts.minCoverage });
  } catch (e) {
    if (e instanceof ActiveBankError) fail(e.message);
    throw e;
  }
  const labels = new Map<string, string>([...ctx.corpus.themes.map((t) => [t.id, t.label] as const), ...ctx.corpus.candidates.map((c) => [c.id, c.name] as const)]);
  const dir = join(versionedReportsDir(paths), 'trous');
  mkdirSync(dir, { recursive: true });
  const json = join(dir, `${date}.json`);
  const md = join(dir, `${date}.md`);
  writeFileSync(json, `${JSON.stringify({ date, k: result.k, activeCount: result.activeCount, rows: result.rows }, null, 2)}\n`, 'utf8');
  const declaredCount = ctx.corpus.candidates.filter((c) => c.status === 'declared').length;
  writeFileSync(md, renderGapsMarkdown(result, { limit: opts.limit, date, labels, declaredCount }), 'utf8');
  return { ...result, files: [json, md], date, labels };
}

async function main(argv: string[]): Promise<number> {
  const { values, positionals } = parseCli(
    argv,
    {
      date: { type: 'string' },
      candidate: { type: 'string', multiple: true },
      theme: { type: 'string', multiple: true },
      limit: { type: 'string' },
      'min-coverage': { type: 'string' },
      corpus: { type: 'string' },
    },
    HELP,
  );
  if (positionals.length > 0) usage(HELP);
  const int = (name: string, raw: string | undefined) => {
    if (raw === undefined) return undefined;
    if (!/^\d+$/.test(raw)) usage(`--${name} attend un entier : ${raw}.`);
    return Number(raw);
  };
  const r = gaps(resolvePaths({ corpus: values.corpus }), {
    date: values.date,
    candidates: values.candidate,
    themes: values.theme,
    limit: int('limit', values.limit),
    minCoverage: int('min-coverage', values['min-coverage']),
  });
  const searched = r.rows.filter((x) => x.searched).length;
  info(`Banque active simulée : k = ${r.k}, ${r.activeCount} questions.`);
  info(`${r.rows.length} trous, dont ${searched} déjà cherchés.`);
  const name = (id: string) => r.labels.get(id) ?? id;
  missionsOf(r.rows)
    .slice(0, 10)
    .forEach((m, i) => info(`  ${i + 1}. ${name(m.candidate)} × ${name(m.theme)} : ${m.rows.length} question(s), gain cumulé ${m.gain}`));
  info(`Listes : ${r.files.join(', ')}.`);
  return 0;
}

if (process.argv[1] && /gaps\.ts$/.test(process.argv[1])) void runCli(() => main(process.argv.slice(2)));
