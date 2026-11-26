// Banque active d'une publication (009 R4, FR-005 à FR-007). Dérivée à chaque publication, sans
// statut dans le corpus : les questions `active` du corpus non retenues forment la réserve.
//   1. A_k = questions de couverture c_q ≥ k (candidats déclarés, positions connues).
//   2. Chaque thème actif dont les questions de A_k, rattachées par leur thème principal, couvrent
//      moins de QUOTA_FLOOR.full enjeux distincts est complété hors A_k (couverture ↓, D_q ↓, id ↑),
//      par des enjeux nouveaux seulement, jusqu'au plancher ou à l'épuisement.
//   3. k = plus petit minimum dont le total après compléments ne dépasse pas MAX_ACTIVE_QUESTIONS.
//   4. Aucun k ne convient : erreur, sans repli silencieux.
import { MAX_ACTIVE_QUESTIONS, QUOTA_FLOOR } from '@/core';
import { discriminant, round4 } from '@/core/dataset';
import type { RuleContext } from '../rules/types';
import type { Question } from '../schema';
import { knownMatrix } from '../stats';

/** Question candidate à la banque active, réduite à ce que le calcul lit. */
export type BankCandidateQuestion = { id: string; theme: string; subject: string; coverage: number; discriminant: number };

export type CompletedTheme = {
  theme: string;
  /** Enjeux distincts sous `k` avant complément. */
  before: number;
  /** Enjeux distincts après complément (< plancher si le thème est épuisé). */
  subjects: number;
  /** Questions ajoutées, dans l'ordre de préférence. */
  added: string[];
};

export type ActiveSelection = {
  k: number;
  /** Identifiants des questions actives, triés. */
  active: string[];
  /** Identifiants des questions de réserve, triés. */
  reserve: string[];
  completed: CompletedTheme[];
  warnings: string[];
};

export class ActiveBankError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ActiveBankError';
  }
}

const byId = (a: { id: string }, b: { id: string }) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
/** Ordre de préférence des compléments : couverture ↓, D_q ↓, identifiant ↑. */
const byPreference = (a: BankCandidateQuestion, b: BankCandidateQuestion) => b.coverage - a.coverage || b.discriminant - a.discriminant || byId(a, b);

function atK(questions: readonly BankCandidateQuestion[], themes: readonly string[], k: number) {
  const floor = QUOTA_FLOOR.full;
  const chosen = new Set(questions.filter((q) => q.coverage >= k).map((q) => q.id));
  const completed: CompletedTheme[] = [];
  for (const theme of themes) {
    const own = questions.filter((q) => q.theme === theme);
    const subjects = new Set(own.filter((q) => chosen.has(q.id)).map((q) => q.subject));
    if (subjects.size >= floor) continue;
    const before = subjects.size;
    const added: string[] = [];
    for (const q of own.filter((x) => !chosen.has(x.id)).sort(byPreference)) {
      if (subjects.size >= floor) break;
      if (subjects.has(q.subject)) continue;
      subjects.add(q.subject);
      chosen.add(q.id);
      added.push(q.id);
    }
    completed.push({ theme, before, subjects: subjects.size, added });
  }
  return { chosen, completed };
}

function warningsOf(completed: readonly CompletedTheme[], k: number): string[] {
  return completed.map((c) =>
    c.subjects < QUOTA_FLOOR.full
      ? `Thème ${c.theme} épuisé : ${c.subjects} enjeu(x) distinct(s) au total, sous le plancher de ${QUOTA_FLOOR.full} (${c.before} à k = ${k}, ${c.added.length} question(s) ajoutée(s)).`
      : `Thème ${c.theme} complété : ${c.before} enjeu(x) à k = ${k}, ${c.added.length} question(s) ajoutée(s) sous le minimum pour atteindre ${QUOTA_FLOOR.full} enjeux.`,
  );
}

/**
 * Calcul pur de la banque active. `themes` : thèmes actifs, dans l'ordre éditorial.
 * `minCoverage` force un `k` plus grand que le minimum calculé, jamais plus petit.
 */
export function selectActiveBank(questions: readonly BankCandidateQuestion[], themes: readonly string[], options: { minCoverage?: number; max?: number } = {}): ActiveSelection {
  const max = options.max ?? MAX_ACTIVE_QUESTIONS;
  const top = Math.max(1, ...questions.map((q) => q.coverage));
  let kMin: number | null = null;
  let lastCompleted: CompletedTheme[] = [];
  let lastTotal = 0;
  for (let k = 1; k <= top; k++) {
    const { chosen, completed } = atK(questions, themes, k);
    lastCompleted = completed;
    lastTotal = chosen.size;
    if (chosen.size <= max) {
      kMin = k;
      break;
    }
  }
  if (kMin === null) {
    const names = lastCompleted.map((c) => c.theme).join(', ') || 'aucun';
    throw new ActiveBankError(
      `Aucun minimum de couverture ne laisse au plus ${max} questions : au plus grand k utile (${top}), ${lastTotal} questions après compléments (thèmes complétés : ${names}). Décision du propriétaire requise (plafond ou plancher).`,
    );
  }
  let k = kMin;
  if (options.minCoverage !== undefined) {
    if (!Number.isInteger(options.minCoverage) || options.minCoverage < kMin)
      throw new ActiveBankError(`--min-coverage ${options.minCoverage} refusé : le minimum calculé est ${kMin}.`);
    k = options.minCoverage;
  }
  const { chosen, completed } = atK(questions, themes, k);
  if (chosen.size > max) throw new ActiveBankError(`--min-coverage ${k} refusé : ${chosen.size} questions après compléments, plus de ${max}.`);
  const sorted = [...questions].sort(byId);
  return {
    k,
    active: sorted.filter((q) => chosen.has(q.id)).map((q) => q.id),
    reserve: sorted.filter((q) => !chosen.has(q.id)).map((q) => q.id),
    completed,
    warnings: warningsOf(completed, k),
  };
}

export type ActiveBank = ActiveSelection & {
  /** Questions actives du corpus, dans l'ordre des identifiants. */
  activeQuestions: Question[];
  reserveQuestions: Question[];
  /** Couverture c_q de chaque question `active` du corpus. */
  coverage: Map<string, number>;
  /** Pouvoir discriminant arrondi (tel que publié) de chaque question `active` du corpus. */
  discriminant: Map<string, number>;
};

type Ctx = Pick<RuleContext, 'corpus' | 'cache' | 'thresholds'>;

/** Entrées du calcul tirées du corpus : couverture et D_q sur les candidats déclarés et les positions connues. */
export function bankInputs(ctx: Ctx) {
  const { declared, active, known } = knownMatrix(ctx as RuleContext);
  const coverage = new Map<string, number>();
  const disc = new Map<string, number>();
  for (const q of active) {
    const values = declared.flatMap((c) => {
      const v = known.get(c)!.get(q.id);
      return v === undefined ? [] : [v];
    });
    coverage.set(q.id, values.length);
    disc.set(q.id, round4(discriminant(values, declared.length)));
  }
  const themes = [...ctx.corpus.themes].filter((t) => t.status === 'active').sort((a, b) => a.order - b.order).map((t) => t.id);
  return { declared, active, known, coverage, discriminant: disc, themes };
}

/** Banque active de la prochaine publication ; lève `ActiveBankError` (R4 étape 4, `--min-coverage` refusé). */
export function computeActiveBank(ctx: Ctx, options: { minCoverage?: number } = {}): ActiveBank {
  const inputs = bankInputs(ctx);
  for (const q of inputs.active) if (q.subject === undefined) throw new Error(`${q.id} : enjeu manquant (règle SUBJECT)`);
  const candidates = inputs.active.map((q) => ({ id: q.id, theme: q.themes[0]!, subject: q.subject!, coverage: inputs.coverage.get(q.id)!, discriminant: inputs.discriminant.get(q.id)! }));
  const selection = selectActiveBank(candidates, inputs.themes, options);
  const byQuestion = new Map(inputs.active.map((q) => [q.id, q]));
  return {
    ...selection,
    activeQuestions: selection.active.map((id) => byQuestion.get(id)!),
    reserveQuestions: selection.reserve.map((id) => byQuestion.get(id)!),
    coverage: inputs.coverage,
    discriminant: inputs.discriminant,
  };
}
