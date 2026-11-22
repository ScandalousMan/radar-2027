// Positions manquantes classées par gain attendu (spec 009 FR-009, R6, data-model § 5).
// Lignes : candidats déclarés × questions `active` du corpus sans position connue. Banque de
// simulation : banque active de la prochaine version (R4). Gain d'une question active :
//   gain(c, q) = Σ 1 / m(c, S)  sur les sélections S (816 combinaisons de 3 thèmes × 2 modes, répondant
//   qui répond à tout) qui contiennent q et où c n'est pas classé, m = positions manquantes à c dans S.
// Une question de réserve à c_q = k − 1 est promue dans une banque simulée ; les autres valent 0.
// Un couple consigné en lacune NOT_FOUND / NO_PERSONAL_POSITION par un journal 008 est « déjà cherché ».
import { bankFromDataset, missingForThreshold, selectQuestions, type BankVersion, type Mode } from '@/core';
import type { MainDataset, PositionCell } from '@/core/dataset';
import { computeActiveBank, type ActiveBank } from './publish/active-bank';
import { combinations } from './publish/coverage-report';
import type { RuleContext } from './rules/types';
import type { Research } from './schema';
import { knownMatrix } from './stats';

export type GapBank = 'active' | 'reserve-promotable' | 'reserve';

export type GapRow = {
  rank: number;
  candidate: string;
  question: string;
  theme: string;
  bank: GapBank;
  questionCoverage: number;
  candidateCoverage: number;
  gain: number;
  searched?: { journal: string; kind: 'NOT_FOUND' | 'NO_PERSONAL_POSITION' };
};

export type GapsResult = { k: number; activeCount: number; rows: GapRow[] };

type Ctx = Pick<RuleContext, 'corpus' | 'cache' | 'thresholds'>;

const MODES: readonly Mode[] = ['short', 'full'];
const cmpId = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);

/** Banque simulée en règles 3 sur les questions données (sans contrôle du plafond). */
function simulatedBank(ctx: Ctx, bank: ActiveBank, ids: readonly string[]): BankVersion {
  const { declared, known } = knownMatrix(ctx as RuleContext);
  const byId = new Map([...bank.activeQuestions, ...bank.reserveQuestions].map((q) => [q.id, q]));
  const questions = [...ids].sort(cmpId).map((id) => byId.get(id)!);
  const positions: Record<string, PositionCell[]> = {};
  for (const c of declared) positions[c] = questions.map((q) => (known.get(c)!.has(q.id) ? ([known.get(c)!.get(q.id)!, 'p'] as const) : null));
  const themes = [...ctx.corpus.themes].filter((t) => t.status === 'active').sort((a, b) => a.order - b.order);
  const ds: MainDataset = {
    version: 0,
    publishedAt: '1970-01-01',
    selectionRules: 3,
    minQuestionCoverage: bank.k,
    themes: themes.map((t, i) => ({ id: t.id, label: t.label, description: '', axis: { negative: t.axis.negative, positive: t.axis.positive }, order: i })),
    candidates: declared.map((id) => ({ id, name: id, party: '-', status: 'declared' as const, coverage: 0 })),
    withdrawn: [],
    questions: questions.map((q) => ({ id: q.id, text: q.text, themes: [...q.themes], polarity: q.polarity, discriminant: bank.discriminant.get(q.id)!, subject: q.subject!, coverage: bank.coverage.get(q.id)! })),
    positions,
    governance: { inclusionCriteria: [], neutralityChecklist: [], evidenceLevels: [], reportIssueUrl: 'https://exemple.invalid/{title}' },
  };
  return bankFromDataset(ds);
}

/** Ajoute à `gain` les contributions des sélections de la banque ; `only` restreint aux questions données. */
function accumulate(bank: BankVersion, gain: Map<string, number>, only?: ReadonlySet<string>): void {
  for (const prio of combinations(bank.themes.length, [3])) {
    const ids = prio.map((i) => bank.themes[i]!.id);
    for (const mode of MODES) {
      const s = selectQuestions(bank, mode, ids);
      for (const c of bank.candidates) {
        const m = missingForThreshold(bank, s, c.id);
        if (m === 0 || !Number.isFinite(m)) continue;
        const row = bank.positions.get(c.id)!;
        for (const item of s.items) {
          if (row[item.question.index] != null) continue;
          if (only && !only.has(item.question.id)) continue;
          const key = `${c.id}\u0000${item.question.id}`;
          gain.set(key, (gain.get(key) ?? 0) + 1 / m);
        }
      }
    }
  }
}

/** Lacunes « déjà cherché » des journaux 008, par couple candidat × question (premier journal par ordre d'identifiant). */
export function searchedPairs(research: Research | undefined): Map<string, NonNullable<GapRow['searched']>> {
  const out = new Map<string, NonNullable<GapRow['searched']>>();
  for (const [id, journal] of [...(research?.journals ?? new Map())].sort(([a], [b]) => cmpId(a, b))) {
    for (const g of journal.gaps ?? []) {
      if ((g.kind !== 'NOT_FOUND' && g.kind !== 'NO_PERSONAL_POSITION') || !g.question) continue;
      const key = `${g.personality}\u0000${g.question}`;
      if (!out.has(key)) out.set(key, { journal: id, kind: g.kind });
    }
  }
  return out;
}

const round4 = (x: number) => Math.round(x * 10_000) / 10_000;

export function computeGaps(
  ctx: Ctx,
  research: Research | undefined,
  options: { candidates?: readonly string[]; themes?: readonly string[]; minCoverage?: number } = {},
): GapsResult {
  const bank = computeActiveBank(ctx, { minCoverage: options.minCoverage });
  const { declared, known } = knownMatrix(ctx as RuleContext);
  const activeIds = new Set(bank.active);
  const gain = new Map<string, number>();

  accumulate(simulatedBank(ctx, bank, bank.active), gain);
  const promotable = bank.reserveQuestions.filter((q) => bank.coverage.get(q.id) === bank.k - 1);
  for (const q of promotable) accumulate(simulatedBank(ctx, bank, [...bank.active, q.id]), gain, new Set([q.id]));
  const promotableIds = new Set(promotable.map((q) => q.id));

  const searched = searchedPairs(research);
  const candidateCoverage = new Map(declared.map((c) => [c, bank.active.length ? bank.active.filter((q) => known.get(c)!.has(q)).length / bank.active.length : 0]));
  const wantC = options.candidates?.length ? new Set(options.candidates) : null;
  const wantT = options.themes?.length ? new Set(options.themes) : null;

  const rows: Omit<GapRow, 'rank'>[] = [];
  for (const c of declared) {
    if (wantC && !wantC.has(c)) continue;
    for (const q of [...bank.activeQuestions, ...bank.reserveQuestions]) {
      if (known.get(c)!.has(q.id)) continue;
      const theme = q.themes[0]!;
      if (wantT && !wantT.has(theme)) continue;
      const kind: GapBank = activeIds.has(q.id) ? 'active' : promotableIds.has(q.id) ? 'reserve-promotable' : 'reserve';
      const s = searched.get(`${c}\u0000${q.id}`);
      rows.push({
        candidate: c,
        question: q.id,
        theme,
        bank: kind,
        questionCoverage: bank.coverage.get(q.id)!,
        candidateCoverage: round4(candidateCoverage.get(c)!),
        gain: kind === 'reserve' ? 0 : round4(gain.get(`${c}\u0000${q.id}`) ?? 0),
        ...(s ? { searched: s } : {}),
      });
    }
  }
  rows.sort(
    (a, b) =>
      Number(a.searched !== undefined) - Number(b.searched !== undefined) ||
      b.gain - a.gain ||
      b.candidateCoverage - a.candidateCoverage ||
      b.questionCoverage - a.questionCoverage ||
      cmpId(a.candidate, b.candidate) ||
      cmpId(a.question, b.question),
  );
  return { k: bank.k, activeCount: bank.active.length, rows: rows.map((r, i) => ({ rank: i + 1, ...r })) };
}

export type Mission = { candidate: string; theme: string; gain: number; rows: GapRow[] };

/** Missions candidat × thème (lignes non cherchées), triées par gain cumulé décroissant. */
export function missionsOf(rows: readonly GapRow[]): Mission[] {
  const byKey = new Map<string, Mission>();
  for (const r of rows) {
    if (r.searched) continue;
    const key = `${r.candidate}\u0000${r.theme}`;
    const m = byKey.get(key) ?? { candidate: r.candidate, theme: r.theme, gain: 0, rows: [] };
    m.rows.push(r);
    m.gain += r.gain;
    byKey.set(key, m);
  }
  return [...byKey.values()]
    .map((m) => ({ ...m, gain: round4(m.gain) }))
    .sort((a, b) => b.gain - a.gain || cmpId(a.candidate, b.candidate) || cmpId(a.theme, b.theme));
}

const fr = (x: number, digits = 1) => x.toFixed(digits).replace('.', ',');

/** Markdown des missions, borné à `limit` lignes de trous ; les couples déjà cherchés à la fin. */
export function renderGapsMarkdown(result: GapsResult, options: { limit?: number; date: string; labels?: ReadonlyMap<string, string>; declaredCount: number }): string {
  const name = (id: string) => options.labels?.get(id) ?? id;
  const limit = options.limit ?? Infinity;
  const searched = result.rows.filter((r) => r.searched);
  const lines = [
    `# Positions manquantes — ${options.date}`,
    '',
    `Banque active simulée : k = ${result.k}, ${result.activeCount} questions. ${result.rows.length} trous, dont ${searched.length} déjà cherchés.`,
    '',
    'Gain d’une position : somme, sur les sélections simulées (816 combinaisons de 3 thèmes × 2 modes, répondant qui répond à tout) où elle figure et où le candidat n’est pas classé, de 1 / (positions qui lui manquent pour atteindre 60 %).',
    '',
  ];
  let budget = limit;
  let n = 0;
  for (const m of missionsOf(result.rows)) {
    if (budget <= 0) break;
    n++;
    lines.push(`## Mission ${n} — ${name(m.candidate)} × ${name(m.theme)} (gain cumulé ${fr(m.gain)})`, '', '| # | Question | Banque | Couv. question | Couv. candidat | Gain |', '|---|---|---|---|---|---|');
    for (const r of m.rows.slice(0, budget)) {
      lines.push(`| ${r.rank} | ${r.question} | ${r.bank} | ${r.questionCoverage}/${options.declaredCount} | ${Math.round(r.candidateCoverage * 100)} % | ${fr(r.gain)} |`);
    }
    budget -= m.rows.length;
    lines.push('');
  }
  if (searched.length > 0) {
    lines.push('## Déjà cherchés', '', '| Candidat | Question | Constat | Journal |', '|---|---|---|---|');
    for (const r of searched) lines.push(`| ${name(r.candidate)} | ${r.question} | ${r.searched!.kind} | ${r.searched!.journal} |`);
    lines.push('');
  }
  return lines.join('\n');
}
