// Logique pure de la page de relecture des énoncés (seconde passe, 2026-11-10).
// Ce module est transpilé puis intégré tel quel dans la page par `build.ts` : il ne dépend
// d'aucune bibliothèque et n'accède ni au DOM ni au stockage. Les tests (`logic.test.ts`)
// couvrent le comptage FR-012, le thème effectif, la confirmation des affectations, la
// migration des enregistrements et l'export.

export type Polarity = '+' | '-';
export type Assignment = { theme: string; polarity: Polarity };

/** Décisions possibles pour un énoncé de seconde passe. Seule `keep` peut rendre un énoncé actif. */
export const DECISIONS = ['keep', 'rework', 'drop', 'out_of_scope', 'arbitration', 'polarity_unknown'] as const;
export type Decision = (typeof DECISIONS)[number];

/** États d'un critère de la grille : non examiné, satisfait, non satisfait, à vérifier. */
export const CRITERION_STATES = ['not_reviewed', 'satisfied', 'not_satisfied', 'needs_verification'] as const;
export type CriterionState = (typeof CRITERION_STATES)[number];

export const MAX_TEXT_LENGTH = 200;

export type Question = {
  id: string;
  finalId: string;
  originalText: string;
  finalText: string;
  originalAssignment: Assignment;
  /** Affectation proposée par Claude ; `null` quand l'énoncé est hors axe ou en arbitrage. */
  proposedAssignment: Assignment | null;
  axisOutcome: string;
  pFlag: boolean;
  status: string;
};

/** Enregistrement d'une décision humaine, tel qu'il est conservé (collection `passe2`). */
export type ReviewRecord = {
  schema: 2;
  decision: Decision | null;
  criteria: Record<string, CriterionState>;
  /** Formulation finale proposée par le relecteur (par défaut, celle de l'audit). */
  finalText: string;
  comment: string;
  /** Affectation choisie dans les listes, pas encore confirmée. */
  chosen: Assignment | null;
  /** Affectation confirmée explicitement par un humain. */
  confirmed: (Assignment & { at: string }) | null;
  updatedAt: string | null;
};

const isPolarity = (v: unknown): v is Polarity => v === '+' || v === '-';
const isAssignment = (v: unknown): v is Assignment =>
  typeof v === 'object' && v !== null && typeof (v as Assignment).theme === 'string' && isPolarity((v as Assignment).polarity);

export function emptyRecord(q: Question, criteriaIds: readonly string[]): ReviewRecord {
  return {
    schema: 2,
    decision: null,
    criteria: Object.fromEntries(criteriaIds.map((c) => [c, 'not_reviewed' as CriterionState])),
    finalText: q.finalText,
    comment: '',
    chosen: null,
    confirmed: null,
    updatedAt: null,
  };
}

/**
 * Lit un document enregistré, quelle que soit sa forme.
 * - Forme 2 (cette page) : relue telle quelle, champs inconnus ignorés.
 * - Forme 1 (page précédente) : `checks` {id: true} devient « satisfait » ; `newText` devient la
 *   formulation finale ; `theme`/`polarity` deviennent une affectation **choisie mais non
 *   confirmée**, car la page précédente les pré-remplissait sans confirmation humaine.
 */
export function normalizeRecord(raw: unknown, q: Question, criteriaIds: readonly string[]): ReviewRecord {
  const base = emptyRecord(q, criteriaIds);
  if (typeof raw !== 'object' || raw === null) return base;
  const r = raw as Record<string, unknown>;
  const decision = DECISIONS.includes(r.decision as Decision) ? (r.decision as Decision) : null;
  const criteria = { ...base.criteria };
  if (r.schema === 2 && typeof r.criteria === 'object' && r.criteria !== null) {
    for (const c of criteriaIds) {
      const v = (r.criteria as Record<string, unknown>)[c];
      if (CRITERION_STATES.includes(v as CriterionState)) criteria[c] = v as CriterionState;
    }
  } else if (typeof r.checks === 'object' && r.checks !== null) {
    for (const c of criteriaIds) if ((r.checks as Record<string, unknown>)[c] === true) criteria[c] = 'satisfied';
  }
  const finalText =
    typeof r.finalText === 'string' && r.finalText.trim() !== ''
      ? r.finalText
      : typeof r.newText === 'string' && r.newText.trim() !== ''
        ? r.newText
        : base.finalText;
  const chosen = isAssignment(r.chosen)
    ? { theme: r.chosen.theme, polarity: r.chosen.polarity }
    : typeof r.theme === 'string' && isPolarity(r.polarity)
      ? { theme: r.theme, polarity: r.polarity }
      : null;
  const rawConfirmed = r.confirmed as { at?: unknown } | null | undefined;
  const confirmed =
    r.schema === 2 && isAssignment(r.confirmed) && typeof rawConfirmed?.at === 'string'
      ? { theme: r.confirmed.theme, polarity: r.confirmed.polarity, at: rawConfirmed.at }
      : null;
  return {
    schema: 2,
    decision,
    criteria,
    finalText,
    comment: typeof r.comment === 'string' ? r.comment : '',
    chosen,
    confirmed,
    updatedAt: typeof r.updatedAt === 'string' ? r.updatedAt : null,
  };
}

/** Document à enregistrer : la forme 2 complète, sans perte. */
export function toDocument(rec: ReviewRecord): Record<string, unknown> {
  return {
    schema: 2,
    decision: rec.decision,
    criteria: rec.criteria,
    finalText: rec.finalText,
    comment: rec.comment,
    chosen: rec.chosen,
    confirmed: rec.confirmed,
    updatedAt: rec.updatedAt,
  };
}

/**
 * Affectation effective, la seule utilisée pour grouper, filtrer, compter et exporter :
 * confirmée, sinon choisie, sinon proposée, sinon d'origine.
 */
export function effectiveAssignment(q: Question, rec: ReviewRecord): Assignment {
  if (rec.confirmed) return { theme: rec.confirmed.theme, polarity: rec.confirmed.polarity };
  if (rec.chosen) return rec.chosen;
  return q.proposedAssignment ?? q.originalAssignment;
}

const sameAssignment = (a: Assignment | null, b: Assignment | null) =>
  !!a && !!b && a.theme === b.theme && a.polarity === b.polarity;

/**
 * Une confirmation humaine explicite est exigée pour garder un énoncé quand :
 * il est marqué P!, ou son axe n'est pas validé tel quel, ou l'affectation effective diffère de
 * l'affectation d'origine.
 */
export function needsConfirmation(q: Question, rec: ReviewRecord): boolean {
  return q.pFlag || q.axisOutcome !== 'VALID_AXIS_AND_POLARITY' || !sameAssignment(effectiveAssignment(q, rec), q.originalAssignment);
}

/** La confirmation enregistrée porte-t-elle sur l'affectation effective actuelle ? */
export function isConfirmed(q: Question, rec: ReviewRecord): boolean {
  return !!rec.confirmed && sameAssignment(rec.confirmed, effectiveAssignment(q, rec));
}

export type KeepCheck = { ok: boolean; reasons: string[] };

/** Conditions pour qu'un énoncé puisse être gardé (et donc compter comme actif). */
export function canKeep(q: Question, rec: ReviewRecord, criteriaIds: readonly string[]): KeepCheck {
  const reasons: string[] = [];
  const notSatisfied = criteriaIds.filter((c) => rec.criteria[c] !== 'satisfied');
  if (notSatisfied.length) reasons.push(`critères non satisfaits : ${notSatisfied.join(', ')}`);
  const len = [...rec.finalText.trim()].length;
  if (len === 0) reasons.push('formulation vide');
  if (len > MAX_TEXT_LENGTH) reasons.push(`formulation de ${len} caractères (maximum ${MAX_TEXT_LENGTH}, FR-009)`);
  if (needsConfirmation(q, rec) && !isConfirmed(q, rec)) reasons.push('affectation (thème et polarité) non confirmée');
  return { ok: reasons.length === 0, reasons };
}

/** Actif = décision « garder » ET toutes les conditions de `canKeep` réunies. */
export function isActive(q: Question, rec: ReviewRecord, criteriaIds: readonly string[]): boolean {
  return rec.decision === 'keep' && canKeep(q, rec, criteriaIds).ok;
}

export type ThemeBalance = {
  theme: string;
  active: number;
  plus: number;
  minus: number;
  plusShare: number;
  compliant: boolean;
  /** Énoncés de seconde passe rattachés au thème mais pas (encore) actifs. */
  pending: number;
};

export type BaseCounts = Record<string, { plus: number; minus: number }>;

/**
 * Équilibre FR-012 par thème. Énoncés actifs = énoncés gardés en première passe (`base`) +
 * énoncés de seconde passe actifs, comptés sous leur affectation effective. Tous les autres
 * (à décider, à reformuler, retirés, hors axe, arbitrage, polarité indéterminée) sont exclus.
 */
export function computeBalances(
  themeIds: readonly string[],
  base: BaseCounts,
  questions: readonly Question[],
  records: Readonly<Record<string, ReviewRecord>>,
  criteriaIds: readonly string[],
  thresholds = { min: 10, low: 0.4, high: 0.6 },
): ThemeBalance[] {
  return themeIds.map((t) => {
    let plus = base[t]?.plus ?? 0;
    let minus = base[t]?.minus ?? 0;
    let pending = 0;
    for (const q of questions) {
      const rec = records[q.id] ?? emptyRecord(q, criteriaIds);
      const a = effectiveAssignment(q, rec);
      if (a.theme !== t) continue;
      if (isActive(q, rec, criteriaIds)) {
        if (a.polarity === '+') plus += 1;
        else minus += 1;
      } else pending += 1;
    }
    const active = plus + minus;
    const plusShare = active ? plus / active : 0;
    return { theme: t, active, plus, minus, plusShare, pending, compliant: active >= thresholds.min && plusShare >= thresholds.low && plusShare <= thresholds.high };
  });
}

/** Regroupe les identifiants par thème effectif, dans l'ordre canonique des thèmes. */
export function groupByEffectiveTheme(
  themeIds: readonly string[],
  questions: readonly Question[],
  records: Readonly<Record<string, ReviewRecord>>,
  criteriaIds: readonly string[],
): Record<string, string[]> {
  const out: Record<string, string[]> = Object.fromEntries(themeIds.map((t) => [t, [] as string[]]));
  for (const q of [...questions].sort((a, b) => a.id.localeCompare(b.id))) {
    const t = effectiveAssignment(q, records[q.id] ?? emptyRecord(q, criteriaIds)).theme;
    (out[t] ??= []).push(q.id);
  }
  return out;
}

function sortKeys(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(sortKeys);
  if (v && typeof v === 'object') return Object.fromEntries(Object.keys(v as object).sort().map((k) => [k, sortKeys((v as Record<string, unknown>)[k])]));
  return v;
}

/**
 * Export déterministe : énoncés triés par identifiant, clés triées, aucune donnée dépendant de
 * l'heure de l'export. Contient l'affectation d'origine, la proposition de Claude, l'affectation
 * confirmée, l'affectation effective, les critères, la décision et le statut actif.
 */
export function buildExport(
  questions: readonly Question[],
  records: Readonly<Record<string, ReviewRecord>>,
  criteriaIds: readonly string[],
): string {
  const rows = [...questions]
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((q) => {
      const rec = records[q.id] ?? emptyRecord(q, criteriaIds);
      const check = canKeep(q, rec, criteriaIds);
      return {
        id: q.id,
        finalId: rec.finalText.trim() === q.originalText ? q.id : q.finalId,
        originalText: q.originalText,
        auditFinalText: q.finalText,
        reviewerFinalText: rec.finalText,
        decision: rec.decision,
        active: rec.decision === 'keep' && check.ok,
        blockingReasons: rec.decision === 'keep' ? check.reasons : [],
        criteria: rec.criteria,
        originalAssignment: q.originalAssignment,
        claudeProposedAssignment: q.proposedAssignment,
        humanConfirmedAssignment: rec.confirmed,
        effectiveAssignment: effectiveAssignment(q, rec),
        axisOutcome: q.axisOutcome,
        auditStatus: q.status,
        comment: rec.comment,
        updatedAt: rec.updatedAt,
      };
    });
  return JSON.stringify(sortKeys({ schema: 'radar-2027/relecture-seconde-passe-decisions@1', questions: rows }), null, 2);
}
