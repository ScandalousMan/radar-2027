// Rapport de couverture d'une publication (009 FR-008, R5, data-model § 4).
// Pour la banque produite : questions actives et en réserve par thème, couverture de chaque
// candidat, candidats classés pour un répondant qui répond à tout, en modes court et complet, sur
// toutes les combinaisons de 3 à 5 thèmes prioritaires (min, médiane, max), et détail des
// combinaisons de 3 thèmes. Écrit `data/reports/couverture-v<n>.{json,md}`.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { bankFromDataset, MAX_ACTIVE_QUESTIONS, rankedCandidates, selectQuestions, type BankVersion, type Mode } from '@/core';
import type { MainDataset } from '@/core/dataset';
import type { CompletedTheme } from './active-bank';

export type RankedStats = { min: number; median: number; max: number };

export type CoverageReport = {
  version: number;
  generatedAt: string;
  minQuestionCoverage: number;
  maxActiveQuestions: number;
  themes: { id: string; active: number; reserve: number; subjects: number; completed: boolean }[];
  warnings: { theme: string; subjects: number; message: string }[];
  candidates: { id: string; coverage: number }[];
  ranked: {
    short: RankedStats;
    full: RankedStats;
    byTriple: { priorities: [string, string, string]; short: number; full: number }[];
  };
  successCriteria: { sc001: boolean; sc002: boolean };
};

export type ReportInput = {
  main: MainDataset;
  generatedAt: string;
  /** Questions de réserve avec leur thème principal. */
  reserve: readonly { id: string; theme: string }[];
  completed: readonly CompletedTheme[];
  warnings: readonly string[];
};

/** Combinaisons de `k` indices parmi `n`, en ordre lexicographique. */
export function* combinations(n: number, sizes: readonly number[]): Generator<number[]> {
  for (const k of sizes) {
    if (k > n) continue;
    const pick: number[] = [];
    function* rec(start: number): Generator<number[]> {
      if (pick.length === k) {
        yield [...pick];
        return;
      }
      for (let i = start; i < n; i++) {
        pick.push(i);
        yield* rec(i + 1);
        pick.pop();
      }
    }
    yield* rec(0);
  }
}

function median(sorted: readonly number[]): number {
  if (sorted.length === 0) return 0;
  const mid = (sorted.length - 1) / 2;
  return (sorted[Math.floor(mid)]! + sorted[Math.ceil(mid)]!) / 2;
}

function stats(values: number[]): RankedStats {
  const sorted = [...values].sort((a, b) => a - b);
  return { min: sorted[0] ?? 0, median: median(sorted), max: sorted.at(-1) ?? 0 };
}

/** Candidats classés par mode sur toutes les combinaisons de 3 à 5 thèmes. */
export function rankedAudit(bank: BankVersion) {
  const values: Record<Mode, number[]> = { short: [], full: [] };
  const byTriple: CoverageReport['ranked']['byTriple'] = [];
  for (const prio of combinations(bank.themes.length, [3, 4, 5])) {
    const ids = prio.map((i) => bank.themes[i]!.id);
    const counts = { short: 0, full: 0 };
    for (const mode of ['short', 'full'] as const) {
      counts[mode] = rankedCandidates(bank, selectQuestions(bank, mode, ids)).length;
      values[mode].push(counts[mode]);
    }
    if (ids.length === 3) byTriple.push({ priorities: ids as [string, string, string], ...counts });
  }
  return { short: stats(values.short), full: stats(values.full), byTriple };
}

/** Seuils de SC-001 (court) et SC-002 (complet). */
export const SUCCESS = { sc001: { min: 10, median: 12 }, sc002: { min: 8, median: 10 } } as const;

export function successCriteria(ranked: Pick<CoverageReport['ranked'], 'short' | 'full'>): CoverageReport['successCriteria'] {
  return {
    sc001: ranked.short.min >= SUCCESS.sc001.min && ranked.short.median >= SUCCESS.sc001.median,
    sc002: ranked.full.min >= SUCCESS.sc002.min && ranked.full.median >= SUCCESS.sc002.median,
  };
}

export function buildCoverageReport(input: ReportInput): CoverageReport {
  const { main } = input;
  if (main.minQuestionCoverage === undefined) throw new Error('rapport de couverture : version hors règles 3');
  const bank = bankFromDataset(main);
  const completed = new Map(input.completed.map((c) => [c.theme, c]));
  const themes = main.themes.map((t) => {
    const own = main.questions.filter((q) => q.themes[0] === t.id);
    return {
      id: t.id,
      active: own.length,
      reserve: input.reserve.filter((q) => q.theme === t.id).length,
      subjects: new Set(own.map((q) => q.subject)).size,
      completed: completed.has(t.id),
    };
  });
  const ranked = rankedAudit(bank);
  return {
    version: main.version,
    generatedAt: input.generatedAt,
    minQuestionCoverage: main.minQuestionCoverage,
    maxActiveQuestions: MAX_ACTIVE_QUESTIONS,
    themes,
    warnings: input.completed.map((c, i) => ({ theme: c.theme, subjects: c.subjects, message: input.warnings[i] ?? '' })),
    candidates: main.candidates.map((c) => ({ id: c.id, coverage: c.coverage })),
    ranked,
    successCriteria: successCriteria(ranked),
  };
}

const pct = (x: number) => `${Math.round(x * 1000) / 10} %`.replace('.', ',');
const num = (x: number) => String(x).replace('.', ',');
const yes = (b: boolean) => (b ? 'atteint' : '**non atteint**');

export function renderCoverageMarkdown(r: CoverageReport, labels: ReadonlyMap<string, string> = new Map()): string {
  const name = (id: string) => labels.get(id) ?? id;
  const active = r.themes.reduce((s, t) => s + t.active, 0);
  const reserve = r.themes.reduce((s, t) => s + t.reserve, 0);
  const lines = [
    `# Rapport de couverture — version ${r.version}`,
    '',
    `Généré le ${r.generatedAt}. Minimum de couverture de la banque active : **k = ${r.minQuestionCoverage}** ; ${active} questions actives (plafond ${r.maxActiveQuestions}), ${reserve} en réserve.`,
    '',
    '## Critères de succès',
    '',
    `| Critère | Seuil | Obtenu | Statut |`,
    `|---|---|---|---|`,
    `| SC-001 (court) | min ≥ ${SUCCESS.sc001.min}, médiane ≥ ${SUCCESS.sc001.median} | min ${r.ranked.short.min}, médiane ${num(r.ranked.short.median)} | ${yes(r.successCriteria.sc001)} |`,
    `| SC-002 (complet) | min ≥ ${SUCCESS.sc002.min}, médiane ≥ ${SUCCESS.sc002.median} | min ${r.ranked.full.min}, médiane ${num(r.ranked.full.median)} | ${yes(r.successCriteria.sc002)} |`,
    '',
    `## Candidats classés (répondant qui répond à tout, ${r.ranked.byTriple.length} combinaisons de 3 thèmes et toutes les combinaisons de 4 et 5)`,
    '',
    '| Mode | Minimum | Médiane | Maximum |',
    '|---|---|---|---|',
    `| Court | ${r.ranked.short.min} | ${num(r.ranked.short.median)} | ${r.ranked.short.max} |`,
    `| Complet | ${r.ranked.full.min} | ${num(r.ranked.full.median)} | ${r.ranked.full.max} |`,
    '',
    '## Banque par thème',
    '',
    '| Thème | Actives | Réserve | Enjeux | Complété |',
    '|---|---|---|---|---|',
    ...r.themes.map((t) => `| ${name(t.id)} | ${t.active} | ${t.reserve} | ${t.subjects} | ${t.completed ? 'oui' : ''} |`),
    '',
  ];
  if (r.warnings.length > 0) lines.push('## Avertissements', '', ...r.warnings.map((w) => `- ${w.message}`), '');
  lines.push(
    '## Couverture des candidats sur la banque active',
    '',
    '| Candidat | Couverture |',
    '|---|---|',
    ...[...r.candidates].sort((a, b) => b.coverage - a.coverage || (a.id < b.id ? -1 : 1)).map((c) => `| ${name(c.id)} | ${pct(c.coverage)} |`),
    '',
    '## Combinaisons de 3 thèmes',
    '',
    '| Thèmes prioritaires | Court | Complet |',
    '|---|---|---|',
    ...r.ranked.byTriple.map((t) => `| ${t.priorities.map(name).join(', ')} | ${t.short} | ${t.full} |`),
    '',
  );
  return lines.join('\n');
}

/** Écrit `couverture-v<n>.json` et `.md` dans `dir` ; renvoie les chemins. */
export function writeCoverageReport(dir: string, report: CoverageReport, labels?: ReadonlyMap<string, string>): string[] {
  mkdirSync(dir, { recursive: true });
  const base = join(dir, `couverture-v${report.version}`);
  writeFileSync(`${base}.json`, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  writeFileSync(`${base}.md`, renderCoverageMarkdown(report, labels), 'utf8');
  return [`${base}.json`, `${base}.md`];
}
