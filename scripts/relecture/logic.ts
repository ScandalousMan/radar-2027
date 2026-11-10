// Logique pure de la page de relecture des énoncés (seconde passe, 2026-11-10 ; correctifs V4).
// Ce module est transpilé puis intégré tel quel dans la page par `build.ts` : il ne dépend
// d'aucune bibliothèque et n'accède ni au DOM ni au stockage. Les tests (`logic.test.ts`)
// couvrent les garde-fous d'activation, l'état des preuves C5, le comptage FR-012, le thème
// effectif, la confirmation des affectations, l'historique, la migration et l'export.

export type Polarity = '+' | '-';
export type Assignment = { theme: string; polarity: Polarity };

/** Décisions possibles pour un énoncé de seconde passe. Seule `keep` peut rendre un énoncé actif. */
export const DECISIONS = ['keep', 'rework', 'drop', 'out_of_scope', 'arbitration', 'polarity_unknown'] as const;
export type Decision = (typeof DECISIONS)[number];

/** États d'un critère de la grille : non examiné, satisfait, non satisfait, à vérifier. */
export const CRITERION_STATES = ['not_reviewed', 'satisfied', 'not_satisfied', 'needs_verification'] as const;
export type CriterionState = (typeof CRITERION_STATES)[number];

export const MAX_TEXT_LENGTH = 200;
/** Le 5e critère de la grille de neutralité est C5 (deux extrémités défendables). */
export const C5_INDEX = 4;
/**
 * Nombre maximal d'entrées d'historique conservées par énoncé (taille du document enregistré).
 * Au-delà, seules les plus anciennes entrées de texte, de commentaire ou de critère sont retirées
 * (et comptées) ; les décisions, affectations, confirmations et arbitrages ne le sont jamais.
 */
export const MAX_HISTORY = 150;
const PROTECTED_HISTORY = new Set(['decision', 'chosen', 'confirmed', 'resolution']);

/** Statuts et issues d'axe connus ; toute autre valeur bloque l'activation (échec fermé). */
const KNOWN_STATUS = new Set(['PENDING_HUMAN_VALIDATION', 'NEEDS_HUMAN_ARBITRATION', 'OUT_OF_SCOPE']);
const KNOWN_AXIS = new Set(['VALID_AXIS_AND_POLARITY', 'CHANGE_AXIS', 'NEEDS_HUMAN_ARBITRATION', 'OUT_OF_SCOPE']);

/** Tri par identifiant indépendant de la langue du navigateur. */
const compareById = (a: { id: string }, b: { id: string }) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);

// ---------- preuves C5 ----------

/**
 * État des preuves C5.
 * - `documented_both_ends` : chaque extrémité est soutenue par au moins une position relue.
 * - `one_end_documented` : une seule extrémité a une preuve relue, et aucune source n'attend de relecture.
 * - `sources_to_verify` : des sources existent, mais au moins une extrémité ne repose que sur des brouillons.
 * - `needs_verification` : aucune source, ou seulement des sources contestées ou incomplètes.
 */
export const C5_STATES = ['documented_both_ends', 'one_end_documented', 'sources_to_verify', 'needs_verification'] as const;
export type C5State = (typeof C5_STATES)[number];

/** Statut de relecture de la position qui fournit la preuve (`status` du corpus). */
export type VerificationStatus = 'reviewed' | 'draft' | 'contested';

/** Une preuve : une position de candidat, sa source et sa citation. Un champ inconnu vaut `null`. */
export type EvidenceRef = {
  side: 'for' | 'against';
  candidate: string;
  positionValue: number | null;
  sourceId: string;
  url: string | null;
  title: string | null;
  quote: string | null;
  publishedAt: string | null;
  accessedAt: string | null;
  verificationStatus: VerificationStatus;
  verifiedAt: string | null;
  verifiedBy: string | null;
  /** Énoncé sur lequel la position a été évaluée, et sa formulation à ce moment ; `null` si inconnus. */
  scoredQuestionId: string | null;
  scoredText: string | null;
};

/**
 * Une preuve n'est directe que si la position porte sur cet énoncé (identifiant d'origine ou final).
 * Une position sur un autre énoncé, même voisin, est conservée pour la traçabilité mais ne compte
 * jamais pour C5.
 */
export function isDirectEvidence(e: EvidenceRef, q: Pick<Question, 'id' | 'finalId'>): boolean {
  return e.scoredQuestionId === q.id || e.scoredQuestionId === q.finalId;
}

/** Champs manquants d'une preuve, affichés tels quels (rien n'est complété). */
export function missingEvidenceFields(e: EvidenceRef): string[] {
  const out: string[] = [];
  if (!e.url) out.push('url');
  if (!e.title) out.push('title');
  if (!e.quote) out.push('quote');
  if (!e.publishedAt) out.push('publishedAt');
  if (e.verificationStatus === 'reviewed' && !e.verifiedAt) out.push('verifiedAt');
  if (!e.scoredQuestionId) out.push('scoredQuestionId');
  if (!e.scoredText) out.push('scoredText');
  return out;
}

const norm = (t: string | null | undefined) => (t ?? '').trim();

/** La position a-t-elle été évaluée sur cette formulation exactement ? */
export function matchesWording(e: EvidenceRef, text: string): boolean {
  return !!e.scoredText && norm(e.scoredText) === norm(text);
}

/**
 * Une preuve n'est vérifiée, pour une formulation donnée, que si la position est relue et datée,
 * avec URL et citation, ET qu'elle a été évaluée sur cette formulation. Une position relue sur un
 * autre texte doit être réévaluée : elle compte comme source à vérifier.
 */
export function isVerifiedEvidence(e: EvidenceRef, text: string): boolean {
  return e.verificationStatus === 'reviewed' && !!e.verifiedAt && !!e.url && !!e.quote && matchesWording(e, text);
}

/** Preuve existante mais pas encore exploitable : brouillon, ou relue sur une autre formulation. */
const isPending = (e: EvidenceRef, text: string) =>
  e.verificationStatus === 'draft' || (e.verificationStatus === 'reviewed' && !isVerifiedEvidence(e, text));

export type C5Sides = Record<'for' | 'against', { verified: number; pending: number; contested: number }>;

export function c5Sides(evidence: readonly EvidenceRef[], text: string): C5Sides {
  const side = (s: EvidenceRef['side']) => {
    const es = evidence.filter((e) => e.side === s);
    return {
      verified: es.filter((e) => isVerifiedEvidence(e, text)).length,
      pending: es.filter((e) => isPending(e, text)).length,
      contested: es.filter((e) => e.verificationStatus === 'contested').length,
    };
  };
  return { for: side('for'), against: side('against') };
}

export function c5Status(evidence: readonly EvidenceRef[], text: string): C5State {
  const sides = c5Sides(evidence, text);
  if (sides.for.verified && sides.against.verified) return 'documented_both_ends';
  if (sides.for.pending || sides.against.pending) return 'sources_to_verify';
  if (sides.for.verified || sides.against.verified) return 'one_end_documented';
  return 'needs_verification';
}

// ---------- énoncés et enregistrements ----------

export type Question = {
  id: string;
  finalId: string;
  originalText: string;
  /** Formulation finale proposée par l'audit. */
  finalText: string;
  /** Base de cette formulation : `original`, `first_review_proposal` ou `corrected`. */
  finalTextBasis: string;
  firstReviewProposal: string | null;
  firstReviewMotif: string | null;
  fidelity: string;
  explanation: string;
  originalAssignment: Assignment;
  /** Proposition faite par Claude avant l'audit final (énoncés P!), conservée pour l'historique. */
  previousClaudeProposal: Assignment | null;
  /** Affectation proposée par l'audit ; `null` quand l'énoncé est hors axe ou en arbitrage. */
  proposedAssignment: Assignment | null;
  secondaryTheme: string | null;
  axisOutcome: string;
  axisExplanation: string;
  pFlag: boolean;
  status: string;
  /** Avis de l'audit sur C1 à C5, tel qu'il a été produit (indicatif, ne coche rien). */
  auditCriteria: Record<string, string>;
  evidence: EvidenceRef[];
  c5Note: string;
};

/** Arbitrage humain explicite d'une question méthodologique ouverte, lié à une affectation précise. */
export type Resolution = Assignment & { rationale: string; at: string };

/** `open` : entrée de texte pas encore enregistrée, que les frappes suivantes prolongent. */
export type HistoryEntry = { at: string; field: string; from: unknown; to: unknown; open?: boolean };

/** Enregistrement d'une décision humaine, tel qu'il est conservé (collection `passe2`). */
export type ReviewRecord = {
  schema: 3;
  decision: Decision | null;
  criteria: Record<string, CriterionState>;
  /** Formulation finale proposée par le relecteur (par défaut, celle de l'audit). */
  finalText: string;
  comment: string;
  /** Affectation choisie dans les listes, pas encore confirmée. */
  chosen: Assignment | null;
  /** Affectation confirmée explicitement par un humain. */
  confirmed: (Assignment & { at: string }) | null;
  /** Arbitrage humain (motif obligatoire) ; seul moyen de lever un arbitrage ou de refuser un changement d'axe. */
  resolution: Resolution | null;
  history: HistoryEntry[];
  /** Entrées d'historique retirées faute de place (les plus anciennes). */
  historyDropped: number;
  updatedAt: string | null;
};

const isPolarity = (v: unknown): v is Polarity => v === '+' || v === '-';
const isAssignment = (v: unknown): v is Assignment =>
  typeof v === 'object' && v !== null && typeof (v as Assignment).theme === 'string' && isPolarity((v as Assignment).polarity);
const sameAssignment = (a: Assignment | null | undefined, b: Assignment | null | undefined) =>
  !!a && !!b && a.theme === b.theme && a.polarity === b.polarity;

export function emptyRecord(q: Question, criteriaIds: readonly string[]): ReviewRecord {
  return {
    schema: 3,
    decision: null,
    criteria: Object.fromEntries(criteriaIds.map((c) => [c, 'not_reviewed' as CriterionState])),
    finalText: q.finalText,
    comment: '',
    chosen: null,
    confirmed: null,
    resolution: null,
    history: [],
    historyDropped: 0,
    updatedAt: null,
  };
}

/**
 * Lit un document enregistré, quelle que soit sa forme.
 * - Formes 3 et 2 : relues telles quelles ; la forme 2 n'a ni arbitrage ni historique.
 * - Forme 1 (première page) : `checks` {id: true} devient « satisfait » ; `newText` devient la
 *   formulation finale ; `theme`/`polarity` deviennent une affectation **choisie mais non
 *   confirmée**, car cette page les pré-remplissait sans confirmation humaine.
 */
export function normalizeRecord(raw: unknown, q: Question, criteriaIds: readonly string[]): ReviewRecord {
  const base = emptyRecord(q, criteriaIds);
  if (typeof raw !== 'object' || raw === null) return base;
  const r = raw as Record<string, unknown>;
  const modern = r.schema === 2 || r.schema === 3;
  const decision = DECISIONS.includes(r.decision as Decision) ? (r.decision as Decision) : null;
  const criteria = { ...base.criteria };
  if (modern && typeof r.criteria === 'object' && r.criteria !== null) {
    for (const c of criteriaIds) {
      const v = (r.criteria as Record<string, unknown>)[c];
      if (CRITERION_STATES.includes(v as CriterionState)) criteria[c] = v as CriterionState;
    }
  } else if (typeof r.checks === 'object' && r.checks !== null) {
    for (const c of criteriaIds) if ((r.checks as Record<string, unknown>)[c] === true) criteria[c] = 'satisfied';
  }
  // Forme 2 ou 3 : le texte est relu tel quel, même vide. Forme 1 : `newText`, sinon le texte de l'audit.
  const finalText =
    modern && typeof r.finalText === 'string'
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
    modern && isAssignment(r.confirmed) && typeof rawConfirmed?.at === 'string'
      ? { theme: r.confirmed.theme, polarity: r.confirmed.polarity, at: rawConfirmed.at }
      : null;
  const rawRes = r.resolution as { rationale?: unknown; at?: unknown } | null | undefined;
  const resolution =
    r.schema === 3 && isAssignment(r.resolution) && typeof rawRes?.rationale === 'string' && typeof rawRes.at === 'string'
      ? { theme: r.resolution.theme, polarity: r.resolution.polarity, rationale: rawRes.rationale, at: rawRes.at }
      : null;
  const history =
    r.schema === 3 && Array.isArray(r.history)
      ? (r.history as unknown[]).filter(
          (h): h is HistoryEntry => typeof h === 'object' && h !== null && typeof (h as HistoryEntry).at === 'string' && typeof (h as HistoryEntry).field === 'string',
        ).map((h) => ({ at: h.at, field: h.field, from: h.from ?? null, to: h.to ?? null }))
      : [];
  return {
    schema: 3,
    decision,
    criteria,
    finalText,
    comment: typeof r.comment === 'string' ? r.comment : '',
    chosen,
    confirmed,
    resolution,
    history,
    historyDropped: r.schema === 3 && typeof r.historyDropped === 'number' ? r.historyDropped : 0,
    updatedAt: typeof r.updatedAt === 'string' ? r.updatedAt : null,
  };
}

/** Document à enregistrer : la forme 3 complète, sans perte. */
export function toDocument(rec: ReviewRecord): Record<string, unknown> {
  return {
    schema: 3,
    decision: rec.decision,
    criteria: rec.criteria,
    finalText: rec.finalText,
    comment: rec.comment,
    chosen: rec.chosen,
    confirmed: rec.confirmed,
    resolution: rec.resolution,
    history: closeHistory(rec).history,
    historyDropped: rec.historyDropped,
    updatedAt: rec.updatedAt,
  };
}

export type RecordPatch = Partial<Pick<ReviewRecord, 'decision' | 'criteria' | 'finalText' | 'comment' | 'chosen' | 'confirmed' | 'resolution'>>;
const TEXT_FIELDS = new Set(['finalText', 'comment']);
const json = (v: unknown) => JSON.stringify(v ?? null);

/**
 * Applique une modification et l'inscrit dans l'historique (valeur avant, valeur après, date).
 * - Les frappes dans un même champ texte prolongent l'entrée ouverte de ce champ ; l'entrée est
 *   fermée à chaque enregistrement (`closeHistory`). Une valeur enregistrée n'est donc jamais
 *   effacée de l'historique ; seule une entrée ouverte revenue à sa valeur de départ disparaît.
 * - Modifier la formulation finale invalide l'examen fait sur l'ancien texte : les critères
 *   repassent à « non examiné » et une décision « garder » est retirée.
 */
export function applyChange(rec: ReviewRecord, patch: RecordPatch, at: string): ReviewRecord {
  const effective: RecordPatch = { ...patch };
  if ('finalText' in patch && patch.finalText !== rec.finalText) {
    effective.criteria = Object.fromEntries(Object.keys({ ...rec.criteria, ...patch.criteria }).map((c) => [c, 'not_reviewed' as CriterionState]));
    if ((patch.decision ?? rec.decision) === 'keep') effective.decision = null;
  }
  const next: ReviewRecord = { ...rec, ...effective, updatedAt: at };
  const history = [...rec.history];
  const push = (field: string, from: unknown, to: unknown) => {
    if (json(from) === json(to)) return;
    const last = history[history.length - 1];
    if (TEXT_FIELDS.has(field) && last && last.open && last.field === field) {
      if (json(last.from) === json(to)) history.pop();
      else history[history.length - 1] = { ...last, at, to };
      return;
    }
    history.push({ at, field, from: from ?? null, to: to ?? null, ...(TEXT_FIELDS.has(field) ? { open: true } : {}) });
  };
  for (const k of ['decision', 'finalText', 'comment', 'chosen', 'confirmed', 'resolution'] as const) {
    if (k in effective) push(k, rec[k], next[k]);
  }
  if (effective.criteria) {
    for (const c of Object.keys(effective.criteria).sort()) push(`criteria.${c}`, rec.criteria[c] ?? null, effective.criteria[c]);
  }
  // Au-delà de la limite, retirer les plus anciennes entrées non protégées.
  let dropped = 0;
  while (history.length > MAX_HISTORY) {
    const i = history.findIndex((h) => !PROTECTED_HISTORY.has(h.field) && !h.open);
    if (i < 0) break;
    history.splice(i, 1);
    dropped += 1;
  }
  return { ...next, history, historyDropped: rec.historyDropped + dropped };
}

/** Ferme les entrées de texte ouvertes : appelé avant chaque enregistrement. */
export function closeHistory(rec: ReviewRecord): ReviewRecord {
  if (!rec.history.some((h) => h.open)) return rec;
  return { ...rec, history: rec.history.map((h) => ({ at: h.at, field: h.field, from: h.from, to: h.to })) };
}

// ---------- affectation, confirmation, statut méthodologique ----------

/**
 * Affectation effective, la seule utilisée pour grouper, filtrer, compter et exporter :
 * confirmée, sinon choisie par le relecteur, sinon d'origine. Une proposition de l'audit n'est
 * jamais effective tant qu'un humain ne l'a pas adoptée.
 */
export function effectiveAssignment(q: Question, rec: ReviewRecord): Assignment {
  if (rec.confirmed) return { theme: rec.confirmed.theme, polarity: rec.confirmed.polarity };
  if (rec.chosen) return rec.chosen;
  return q.originalAssignment;
}

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

/** Un arbitrage n'est valable que s'il a un motif et porte sur l'affectation effective, elle-même confirmée. */
export function isResolved(q: Question, rec: ReviewRecord): boolean {
  return !!rec.resolution && rec.resolution.rationale.trim().length > 0 && sameAssignment(rec.resolution, effectiveAssignment(q, rec)) && isConfirmed(q, rec);
}

/**
 * Statut méthodologique d'un énoncé, indépendant de la décision :
 * - `none` : aucune question ouverte (axe validé tel quel) ;
 * - `excluded_out_of_scope` : hors périmètre selon l'audit, jamais activable ici ;
 * - `unresolved_arbitration` / `resolved_arbitration` ;
 * - `unresolved_axis_change` : changement d'axe proposé, pas encore confirmé ;
 * - `axis_change_confirmed` : la nouvelle affectation proposée est confirmée ;
 * - `axis_change_rejected_resolved` : une autre affectation a été arbitrée, avec un motif ;
 * - `unknown_audit_status` : statut ou issue d'axe inconnus, non activable (échec fermé).
 */
export type MethodologyStatus =
  | 'none'
  | 'excluded_out_of_scope'
  | 'unresolved_arbitration'
  | 'resolved_arbitration'
  | 'unresolved_axis_change'
  | 'axis_change_confirmed'
  | 'axis_change_rejected_resolved'
  | 'unknown_audit_status';

export function methodologyStatus(q: Question, rec: ReviewRecord): MethodologyStatus {
  if (!KNOWN_STATUS.has(q.status) || !KNOWN_AXIS.has(q.axisOutcome)) return 'unknown_audit_status';
  if (q.status === 'OUT_OF_SCOPE' || q.axisOutcome === 'OUT_OF_SCOPE') return 'excluded_out_of_scope';
  if (q.status === 'NEEDS_HUMAN_ARBITRATION' || q.axisOutcome === 'NEEDS_HUMAN_ARBITRATION') return isResolved(q, rec) ? 'resolved_arbitration' : 'unresolved_arbitration';
  if (q.axisOutcome === 'CHANGE_AXIS') {
    if (q.proposedAssignment && isConfirmed(q, rec) && sameAssignment(effectiveAssignment(q, rec), q.proposedAssignment)) return 'axis_change_confirmed';
    return isResolved(q, rec) ? 'axis_change_rejected_resolved' : 'unresolved_axis_change';
  }
  return 'none';
}

const BLOCKING_METHODOLOGY: Partial<Record<MethodologyStatus, string>> = {
  excluded_out_of_scope: "hors périmètre selon l'audit : non activable ; le réintégrer exige une nouvelle formulation, auditée à nouveau",
  unresolved_arbitration: "arbitrage requis : choisis l'affectation, donne un motif et enregistre l'arbitrage (une simple confirmation ne suffit pas)",
  unresolved_axis_change: "changement d'axe proposé : confirme la nouvelle affectation proposée, ou arbitre une autre affectation avec un motif",
  unknown_audit_status: "statut d'audit inconnu : non activable",
};

/** État C5 tel qu'il découle des preuves, pour la formulation retenue par le relecteur (jamais de l'étiquette d'audit). */
export function questionC5(q: Question, rec: ReviewRecord): C5State {
  return c5Status(directEvidence(q), rec.finalText);
}

/** Preuves portant sur cet énoncé ; les positions sur d'autres énoncés sont écartées. */
export function directEvidence(q: Question): EvidenceRef[] {
  return q.evidence.filter((e) => isDirectEvidence(e, q));
}

export type KeepCheck = { ok: boolean; reasons: string[] };

/** Conditions pour qu'un énoncé puisse être gardé (et donc compter comme actif). */
export function canKeep(q: Question, rec: ReviewRecord, criteriaIds: readonly string[]): KeepCheck {
  const reasons: string[] = [];
  const methodology = BLOCKING_METHODOLOGY[methodologyStatus(q, rec)];
  if (methodology) reasons.push(methodology);
  const notSatisfied = criteriaIds.filter((c) => rec.criteria[c] !== 'satisfied');
  if (notSatisfied.length) reasons.push(`critères non satisfaits : ${notSatisfied.join(', ')}`);
  const c5 = questionC5(q, rec);
  if (c5 !== 'documented_both_ends') reasons.push(`C5 : preuves non vérifiées des deux côtés (état : ${c5})`);
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

// ---------- FR-012 ----------

export const FR012 = { min: 10, low: 0.4, high: 0.6 } as const;

export type ThemeBalance = {
  theme: string;
  /** Énoncés validés actifs : gardés en première passe + « garder » valides ici. */
  active: number;
  plus: number;
  minus: number;
  plusShare: number;
  compliant: boolean;
  /**
   * Énoncés de seconde passe rattachés au thème, non actifs, par catégorie :
   * en attente (sans décision, ou « garder » encore bloqué), à reformuler, retirés,
   * exclus (hors périmètre selon l'audit ou le relecteur), en arbitrage (audit ou relecteur, y compris polarité indéterminée).
   */
  awaiting: number;
  rework: number;
  dropped: number;
  excluded: number;
  arbitration: number;
};

export type BaseCounts = Record<string, { plus: number; minus: number }>;

type Buckets = Pick<ThemeBalance, 'awaiting' | 'rework' | 'dropped' | 'excluded' | 'arbitration'>;
const emptyBuckets = (): Buckets => ({ awaiting: 0, rework: 0, dropped: 0, excluded: 0, arbitration: 0 });

function balanceRow(theme: string, plus: number, minus: number, extra: Buckets): ThemeBalance {
  const active = plus + minus;
  const plusShare = active ? plus / active : 0;
  return { theme, active, plus, minus, plusShare, compliant: active >= FR012.min && plusShare >= FR012.low && plusShare <= FR012.high, ...extra };
}

/**
 * Équilibre FR-012 par thème, sur les seuls énoncés validés actifs : énoncés gardés en première
 * passe (`base`) + énoncés de seconde passe actifs, comptés sous leur affectation effective. Les
 * autres sont répartis entre « en attente de validation », « hors périmètre » et « arbitrage ».
 */
export function computeBalances(
  themeIds: readonly string[],
  base: BaseCounts,
  questions: readonly Question[],
  records: Readonly<Record<string, ReviewRecord>>,
  criteriaIds: readonly string[],
): ThemeBalance[] {
  return themeIds.map((t) => {
    let plus = base[t]?.plus ?? 0;
    let minus = base[t]?.minus ?? 0;
    const extra = emptyBuckets();
    for (const q of questions) {
      const rec = records[q.id] ?? emptyRecord(q, criteriaIds);
      const a = effectiveAssignment(q, rec);
      if (a.theme !== t) continue;
      if (isActive(q, rec, criteriaIds)) {
        if (a.polarity === '+') plus += 1;
        else minus += 1;
        continue;
      }
      const m = methodologyStatus(q, rec);
      if (m === 'excluded_out_of_scope' || rec.decision === 'out_of_scope') extra.excluded += 1;
      else if (rec.decision === 'drop') extra.dropped += 1;
      else if (rec.decision === 'rework') extra.rework += 1;
      else if (m === 'unresolved_arbitration' || rec.decision === 'arbitration' || rec.decision === 'polarity_unknown') extra.arbitration += 1;
      else extra.awaiting += 1;
    }
    return balanceRow(t, plus, minus, extra);
  });
}

/**
 * Projection optimiste : tous les énoncés « à valider » de l'audit gardés avec l'affectation
 * proposée ; hors périmètre et arbitrages exclus. Borne haute, qui ignore les critères et C5.
 */
export function optimisticBalances(themeIds: readonly string[], base: BaseCounts, questions: readonly Question[]): ThemeBalance[] {
  return themeIds.map((t) => {
    let plus = base[t]?.plus ?? 0;
    let minus = base[t]?.minus ?? 0;
    const extra = emptyBuckets();
    for (const q of questions) {
      if (q.status === 'OUT_OF_SCOPE' || q.axisOutcome === 'OUT_OF_SCOPE') {
        if (q.originalAssignment.theme === t) extra.excluded += 1;
      } else if (q.status === 'NEEDS_HUMAN_ARBITRATION' || q.axisOutcome === 'NEEDS_HUMAN_ARBITRATION' || !q.proposedAssignment) {
        if (q.originalAssignment.theme === t) extra.arbitration += 1;
      } else if (q.proposedAssignment.theme === t) {
        if (q.proposedAssignment.polarity === '+') plus += 1;
        else minus += 1;
      }
    }
    return balanceRow(t, plus, minus, extra);
  });
}

/** Revue terminée = chaque énoncé est actif, retiré ou écarté hors périmètre. */
export function isReviewComplete(questions: readonly Question[], records: Readonly<Record<string, ReviewRecord>>, criteriaIds: readonly string[]): boolean {
  return questions.every((q) => {
    const rec = records[q.id] ?? emptyRecord(q, criteriaIds);
    return isActive(q, rec, criteriaIds) || rec.decision === 'drop' || rec.decision === 'out_of_scope';
  });
}

export type Fr012Overall = { state: 'fail' | 'satisfied_review_incomplete' | 'satisfied'; failing: string[] };

/** Indicateur global : jamais « satisfait » si un thème échoue ; « revue incomplète » tant qu'il reste des énoncés ouverts. */
export function fr012Overall(balances: readonly ThemeBalance[], reviewComplete: boolean): Fr012Overall {
  const failing = balances.filter((b) => !b.compliant).map((b) => b.theme);
  if (failing.length) return { state: 'fail', failing };
  return { state: reviewComplete ? 'satisfied' : 'satisfied_review_incomplete', failing };
}

/** Regroupe les identifiants par thème effectif, dans l'ordre canonique des thèmes. */
export function groupByEffectiveTheme(
  themeIds: readonly string[],
  questions: readonly Question[],
  records: Readonly<Record<string, ReviewRecord>>,
  criteriaIds: readonly string[],
): Record<string, string[]> {
  const out: Record<string, string[]> = Object.fromEntries(themeIds.map((t) => [t, [] as string[]]));
  for (const q of [...questions].sort(compareById)) {
    const t = effectiveAssignment(q, records[q.id] ?? emptyRecord(q, criteriaIds)).theme;
    (out[t] ??= []).push(q.id);
  }
  return out;
}

// ---------- export ----------

function sortKeys(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(sortKeys);
  if (v && typeof v === 'object') return Object.fromEntries(Object.keys(v as object).sort().map((k) => [k, sortKeys((v as Record<string, unknown>)[k])]));
  return v;
}

/** Questions encore ouvertes pour un énoncé, quelle que soit la décision prise. */
export function outstandingConcerns(q: Question, rec: ReviewRecord): string[] {
  const out: string[] = [];
  const m = methodologyStatus(q, rec);
  if (BLOCKING_METHODOLOGY[m]) out.push(`methodology:${m}`);
  const c5 = questionC5(q, rec);
  if (c5 !== 'documented_both_ends') out.push(`c5:${c5}`);
  const sides = c5Sides(directEvidence(q), rec.finalText);
  for (const side of ['for', 'against'] as const) if (!sides[side].verified && !sides[side].pending) out.push(`c5:no_source_${side}`);
  for (const [k, v] of Object.entries(q.auditCriteria).sort()) if (k !== 'C5' && v !== 'satisfied') out.push(`audit:${k}:${v}`);
  if (q.fidelity === 'AMBIGUOUS') out.push('fidelity:AMBIGUOUS');
  if (needsConfirmation(q, rec) && !isConfirmed(q, rec)) out.push('assignment:not_confirmed');
  return out;
}

export const EXPORT_SCHEMA = 'radar-2027/relecture-seconde-passe-decisions@2';

/**
 * Export déterministe et autosuffisant (énoncés triés par identifiant, clés triées, aucune donnée
 * dépendant de l'heure de l'export). Structure d'un énoncé :
 * - `id`, `finalId` : identifiant stable, identifiant final (`-v2` dès que le texte du relecteur diffère de l'origine) ;
 * - `text` : `original`, `firstReviewProposal`, `firstReviewMotif`, `auditFinal`, `auditFinalBasis`, `reviewerFinal` ;
 * - `audit` : `fidelity`, `explanation`, `axisOutcome`, `axisExplanation`, `status`, `pFlag`, `secondaryTheme`,
 *   `criteria` (C1 à C5 tels que produits par l'audit, indicatifs) ;
 * - `assignment` : `original`, `previousClaudeProposal`, `proposed`, `chosen`, `confirmed` (avec date), `confirmation`
 *   (`required`, `status` = not_required | missing | confirmed, `provenance` = human_explicit | null), `effective` ;
 * - `methodology` : `status` (voir `MethodologyStatus`), `resolution` (affectation, motif, date) ;
 * - `c5` : `status` (calculé depuis les preuves pour la formulation du relecteur), `sides` (preuves vérifiées,
 *   en attente, contestées de chaque côté, preuves directes seulement), `indirectCount`, `auditLabel`, `note`,
 *   `evidence` (preuves avec énoncé et formulation évalués, `direct`, `matchesFinalText`, `verified`, champs
 *   manquants à `null` et liste `missing`) ;
 * - `review` : `criteria` (états saisis), `decision`, `comment`, `updatedAt` ;
 * - `outcome` : `active`, `eligibleToKeep`, `blockingReasons`, `outstandingConcerns` ;
 * - `history` : modifications horodatées (champ, avant, après), `historyDropped` (entrées de texte ou de critère
 *   retirées faute de place ; jamais de décision, d'affectation, de confirmation ni d'arbitrage).
 */
export function buildExport(
  questions: readonly Question[],
  records: Readonly<Record<string, ReviewRecord>>,
  criteriaIds: readonly string[],
  fr012?: { balances: readonly ThemeBalance[]; overall: Fr012Overall },
): string {
  const rows = [...questions]
    .sort(compareById)
    .map((q) => {
      const rec = records[q.id] ?? emptyRecord(q, criteriaIds);
      const check = canKeep(q, rec, criteriaIds);
      const need = needsConfirmation(q, rec);
      const confirmationStatus = isConfirmed(q, rec) ? 'confirmed' : need ? 'missing' : 'not_required';
      const changed = rec.finalText.trim() !== q.originalText.trim();
      return {
        id: q.id,
        finalId: !changed ? q.id : q.finalId !== q.id ? q.finalId : `${q.id}-v2`,
        text: {
          original: q.originalText,
          firstReviewProposal: q.firstReviewProposal,
          firstReviewMotif: q.firstReviewMotif,
          auditFinal: q.finalText,
          auditFinalBasis: q.finalTextBasis,
          reviewerFinal: rec.finalText,
        },
        audit: {
          fidelity: q.fidelity,
          explanation: q.explanation,
          axisOutcome: q.axisOutcome,
          axisExplanation: q.axisExplanation,
          status: q.status,
          pFlag: q.pFlag,
          secondaryTheme: q.secondaryTheme,
          criteria: q.auditCriteria,
        },
        assignment: {
          original: q.originalAssignment,
          previousClaudeProposal: q.previousClaudeProposal,
          proposed: q.proposedAssignment,
          chosen: rec.chosen,
          confirmed: rec.confirmed,
          confirmation: { required: need, status: confirmationStatus, provenance: rec.confirmed ? 'human_explicit' : null },
          effective: effectiveAssignment(q, rec),
        },
        methodology: { status: methodologyStatus(q, rec), resolution: rec.resolution },
        c5: {
          status: questionC5(q, rec),
          sides: c5Sides(directEvidence(q), rec.finalText),
          indirectCount: q.evidence.length - directEvidence(q).length,
          auditLabel: q.auditCriteria.C5 ?? null,
          note: q.c5Note,
          evidence: [...q.evidence]
            .map((e) => ({ e, key: `${e.side}|${e.candidate}|${e.sourceId}|${e.quote ?? ''}` }))
            .sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0))
            .map(({ e }) => {
              const direct = isDirectEvidence(e, q);
              return { ...e, direct, matchesFinalText: matchesWording(e, rec.finalText), verified: direct && isVerifiedEvidence(e, rec.finalText), missing: missingEvidenceFields(e) };
            }),
        },
        review: { criteria: rec.criteria, decision: rec.decision, comment: rec.comment, updatedAt: rec.updatedAt },
        outcome: {
          active: rec.decision === 'keep' && check.ok,
          eligibleToKeep: check.ok,
          blockingReasons: check.reasons,
          outstandingConcerns: outstandingConcerns(q, rec),
        },
        history: closeHistory(rec).history,
        historyDropped: rec.historyDropped,
      };
    });
  const doc: Record<string, unknown> = { schema: EXPORT_SCHEMA, questions: rows };
  if (fr012) {
    doc.fr012 = {
      thresholds: FR012,
      overall: fr012.overall,
      themes: fr012.balances.map((b) => ({ ...b, plusShare: Math.round(b.plusShare * 10000) / 10000 })),
    };
  }
  return JSON.stringify(sortKeys(doc), null, 2);
}
