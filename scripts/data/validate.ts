// pnpm data:validate [--corpus <dir>] [--no-cache] [--json <out>] (FR-031 à FR-035, SC-010).
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { info, parseCli, resolvePaths, runCli, usage, warn, type DataPaths } from './lib/cli';
import { buildContext, type ContextOptions } from './lib/context';
import { writeReport, type Report } from './lib/report';
import { runRules } from './lib/rules';
import type { RuleContext, Warning } from './lib/rules/types';
import { computeStats } from './lib/stats';

const HELP = 'Usage : pnpm data:validate [--corpus <dossier>] [--no-cache] [--json <fichier>]';

/** Valide le corpus et retourne le rapport (sans l'écrire) ; utilisé par les tests et par publish. */
export async function validate(paths: DataPaths, options: ContextOptions = {}): Promise<Report & { ctx: RuleContext }> {
  const started = performance.now();
  const { ctx, loadViolations } = buildContext(paths, options);
  const { violations, warnings } = runRules(ctx);
  const stats = computeStats(ctx);
  stats.durationMs = Math.round(performance.now() - started);
  return {
    violations: [...loadViolations.filter((v) => v.severity === 'error'), ...violations],
    warnings: [...(loadViolations.filter((v) => v.severity === 'warning') as Warning[]), ...warnings],
    stats,
    ctx,
  };
}

function summary(report: Report): string[] {
  const byRule = new Map<string, number>();
  for (const v of report.violations) byRule.set(v.rule, (byRule.get(v.rule) ?? 0) + 1);
  const lines = [...byRule].map(([rule, n]) => `  ${rule} : ${n}`);
  const warnRules = new Map<string, number>();
  for (const w of report.warnings) warnRules.set(w.rule, (warnRules.get(w.rule) ?? 0) + 1);
  return [
    report.violations.length === 0 ? 'Corpus conforme : 0 violation.' : `Corpus non conforme : ${report.violations.length} violation(s).`,
    ...lines,
    `Avertissements : ${report.warnings.length}${warnRules.size ? ` (${[...warnRules].map(([r, n]) => `${r} ${n}`).join(', ')})` : ''}.`,
  ];
}

async function main(argv: string[]): Promise<number> {
  const { values, positionals } = parseCli(argv, { corpus: { type: 'string' }, 'no-cache': { type: 'boolean' }, json: { type: 'string' } }, HELP);
  if (positionals.length > 0) usage(HELP);
  const paths = resolvePaths({ corpus: values.corpus });
  const { violations, warnings, stats } = await validate(paths, { noCache: values['no-cache'] });
  const report: Report = { violations, warnings, stats };
  const files = writeReport(paths.reportsDir, report);
  if (values.json) {
    const out = resolve(values.json);
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  }
  for (const v of report.violations) warn(`✗ ${v.rule} ${v.entity.id} : ${v.message}`);
  for (const line of summary(report)) info(line);
  info(`Rapport : ${relative(process.cwd(), files.markdown)} (${((report.stats.durationMs ?? 0) / 1000).toFixed(2)} s).`);
  return report.violations.length > 0 ? 1 : 0;
}

if (process.argv[1] && /validate\.ts$/.test(process.argv[1])) void runCli(() => main(process.argv.slice(2)));
