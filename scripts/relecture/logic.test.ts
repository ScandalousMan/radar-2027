// @vitest-environment node
import { describe, expect, it } from 'vitest';
import {
  applyChange,
  buildExport,
  c5Status,
  canKeep,
  computeBalances,
  effectiveAssignment,
  emptyRecord,
  EXPORT_SCHEMA,
  fr012Overall,
  groupByEffectiveTheme,
  isActive,
  isReviewComplete,
  MAX_HISTORY,
  methodologyStatus,
  needsConfirmation,
  normalizeRecord,
  optimisticBalances,
  toDocument,
  type EvidenceRef,
  type Question,
  type ReviewRecord,
} from './logic';

const CRIT = ['c1', 'c2', 'c3', 'c4', 'c5'];
const THEMES = ['securite', 'institutions', 'justice'];
const T0 = '2026-11-10T10:00:00.000Z';
const T1 = '2026-11-10T10:01:00.000Z';
const T2 = '2026-11-10T12:00:00.000Z';

function ev(side: 'for' | 'against', over: Partial<EvidenceRef> = {}): EvidenceRef {
  return {
    side,
    candidate: side === 'for' ? 'cand-a' : 'cand-b',
    positionValue: side === 'for' ? 2 : -2,
    sourceId: `src-${side}`,
    url: `https://example.org/${side}`,
    title: `Programme ${side}`,
    quote: `Citation ${side}`,
    publishedAt: '2026-01-01',
    accessedAt: '2026-11-08',
    verificationStatus: 'reviewed',
    verifiedAt: '2026-11-10',
    verifiedBy: 'adrien',
    ...over,
  };
}
const VERIFIED_BOTH = [ev('for'), ev('against')];
const DRAFT_BOTH = [ev('for', { verificationStatus: 'draft', verifiedAt: null, verifiedBy: null }), ev('against', { verificationStatus: 'draft', verifiedAt: null, verifiedBy: null })];

function q(over: Partial<Question> & { id: string }): Question {
  return {
    finalId: `${over.id}-v2`,
    originalText: `Texte ${over.id}.`,
    finalText: `Texte ${over.id}.`,
    finalTextBasis: 'original',
    firstReviewProposal: `Proposition ${over.id}.`,
    firstReviewMotif: 'motif de la 1re relecture',
    fidelity: 'SEMANTIC_DRIFT',
    explanation: 'explication',
    originalAssignment: { theme: 'securite', polarity: '-' },
    previousClaudeProposal: null,
    proposedAssignment: { theme: 'securite', polarity: '-' },
    secondaryTheme: null,
    axisOutcome: 'VALID_AXIS_AND_POLARITY',
    axisExplanation: "explication de l'axe",
    pFlag: false,
    status: 'PENDING_HUMAN_VALIDATION',
    auditCriteria: { C1: 'satisfied', C2: 'satisfied', C3: 'satisfied', C4: 'satisfied', C5: 'documented_both_ends' },
    evidence: VERIFIED_BOTH,
    c5Note: '',
    ...over,
  };
}

const satisfied = Object.fromEntries(CRIT.map((c) => [c, 'satisfied' as const]));
function kept(question: Question, over: Partial<ReviewRecord> = {}): ReviewRecord {
  return { ...emptyRecord(question, CRIT), decision: 'keep', criteria: { ...satisfied }, ...over };
}
const confirmAs = (a: { theme: string; polarity: '+' | '-' }) => ({ chosen: a, confirmed: { ...a, at: T0 } });

describe('canKeep et isActive', () => {
  const plain = q({ id: 'a' });
  it('exige les cinq critères « satisfait »', () => {
    const rec = kept(plain, { criteria: { ...satisfied, c5: 'needs_verification' } });
    expect(canKeep(plain, rec, CRIT).ok).toBe(false);
    expect(isActive(plain, rec, CRIT)).toBe(false);
    expect(isActive(plain, kept(plain), CRIT)).toBe(true);
  });
  it('refuse une formulation de plus de 200 caractères sans la tronquer', () => {
    const long = 'x'.repeat(201);
    const rec = kept(plain, { finalText: long });
    const check = canKeep(plain, rec, CRIT);
    expect(check.ok).toBe(false);
    expect(check.reasons.join()).toContain('201 caractères');
    expect(rec.finalText).toHaveLength(201);
  });
  it.each(['rework', 'drop', 'out_of_scope', 'arbitration', 'polarity_unknown', null] as const)('ne compte jamais une décision « %s » comme active', (decision) => {
    expect(isActive(plain, kept(plain, { decision }), CRIT)).toBe(false);
  });
});

describe('Bloquant 1 : garde-fous d\'activation selon le statut d\'audit', () => {
  const oos = q({ id: 'oos', pFlag: true, status: 'OUT_OF_SCOPE', axisOutcome: 'OUT_OF_SCOPE', proposedAssignment: null });
  const arb = q({ id: 'arb', pFlag: true, status: 'NEEDS_HUMAN_ARBITRATION', axisOutcome: 'NEEDS_HUMAN_ARBITRATION', proposedAssignment: null });
  const move = q({ id: 'mv', pFlag: true, axisOutcome: 'CHANGE_AXIS', proposedAssignment: { theme: 'institutions', polarity: '+' } });

  it('1. un énoncé hors périmètre ne peut pas être activé, même avec tous les critères satisfaits', () => {
    const rec = kept(oos);
    expect(canKeep(oos, rec, CRIT).ok).toBe(false);
    expect(canKeep(oos, rec, CRIT).reasons.join()).toContain('hors périmètre');
    expect(isActive(oos, rec, CRIT)).toBe(false);
  });
  it("2. un énoncé hors périmètre ne peut pas être activé après confirmation de l'affectation d'origine, ni même avec un arbitrage", () => {
    const confirmed = kept(oos, confirmAs(oos.originalAssignment));
    expect(isActive(oos, confirmed, CRIT)).toBe(false);
    const resolved = { ...confirmed, resolution: { ...oos.originalAssignment, rationale: 'je le garde', at: T0 } };
    expect(isActive(oos, resolved, CRIT)).toBe(false);
    expect(methodologyStatus(oos, resolved)).toBe('excluded_out_of_scope');
  });
  it('3. un énoncé en arbitrage ne peut pas être activé avec tous les critères satisfaits, ni sur simple confirmation', () => {
    expect(isActive(arb, kept(arb), CRIT)).toBe(false);
    const confirmed = kept(arb, confirmAs(arb.originalAssignment));
    expect(isActive(arb, confirmed, CRIT)).toBe(false);
    expect(methodologyStatus(arb, confirmed)).toBe('unresolved_arbitration');
    expect(canKeep(arb, confirmed, CRIT).reasons.join()).toContain('arbitrage requis');
  });
  it("3 bis. un arbitrage sans motif, ou portant sur une autre affectation, ne lève pas le blocage", () => {
    const noReason = kept(arb, { ...confirmAs(arb.originalAssignment), resolution: { ...arb.originalAssignment, rationale: '  ', at: T0 } });
    expect(isActive(arb, noReason, CRIT)).toBe(false);
    const other = kept(arb, { ...confirmAs(arb.originalAssignment), resolution: { theme: 'justice', polarity: '+', rationale: 'motif', at: T0 } });
    expect(isActive(arb, other, CRIT)).toBe(false);
  });
  it('4. un changement d\'axe ne peut pas être activé avant confirmation explicite de la nouvelle affectation', () => {
    expect(isActive(move, kept(move), CRIT)).toBe(false);
    expect(methodologyStatus(move, kept(move))).toBe('unresolved_axis_change');
    // Confirmer l'affectation d'origine ne vaut pas résolution du changement d'axe.
    const original = kept(move, confirmAs(move.originalAssignment));
    expect(isActive(move, original, CRIT)).toBe(false);
    expect(methodologyStatus(move, original)).toBe('unresolved_axis_change');
    const proposed = kept(move, confirmAs(move.proposedAssignment!));
    expect(methodologyStatus(move, proposed)).toBe('axis_change_confirmed');
    expect(isActive(move, proposed, CRIT)).toBe(true);
  });
  it("5. un énoncé correctement résolu devient éligible si toutes les autres conditions sont réunies", () => {
    const resolved = kept(arb, { ...confirmAs({ theme: 'securite', polarity: '-' }), resolution: { theme: 'securite', polarity: '-', rationale: "mesure l'axe autorité", at: T0 } });
    expect(methodologyStatus(arb, resolved)).toBe('resolved_arbitration');
    expect(canKeep(arb, resolved, CRIT)).toEqual({ ok: true, reasons: [] });
    expect(isActive(arb, resolved, CRIT)).toBe(true);
    // Changer ensuite l'affectation invalide l'arbitrage.
    expect(isActive(arb, { ...resolved, confirmed: { theme: 'justice', polarity: '-', at: T1 } }, CRIT)).toBe(false);
    // Résolution d'un refus de changement d'axe, avec motif.
    const rejected = kept(move, { ...confirmAs(move.originalAssignment), resolution: { ...move.originalAssignment, rationale: "l'axe d'origine est le bon", at: T0 } });
    expect(methodologyStatus(move, rejected)).toBe('axis_change_rejected_resolved');
    expect(isActive(move, rejected, CRIT)).toBe(true);
  });
});

describe('Bloquant 2 : état des preuves C5', () => {
  it('1. des positions sourcées « brouillons non relus » des deux côtés ne valent pas « documenté des deux côtés »', () => {
    const draft = q({ id: 'd', evidence: DRAFT_BOTH, c5Note: 'Positions sourcées des deux côtés (brouillons non relus).', auditCriteria: { C1: 'satisfied', C5: 'documented_both_ends' } });
    expect(c5Status(draft.evidence)).toBe('sources_to_verify');
    const parsed = JSON.parse(buildExport([draft], {}, CRIT)).questions[0];
    expect(parsed.c5.status).toBe('sources_to_verify');
    expect(parsed.c5.auditLabel).toBe('documented_both_ends');
  });
  it('2. « documenté des deux côtés » exige une preuve relue de chaque côté', () => {
    expect(c5Status(VERIFIED_BOTH)).toBe('documented_both_ends');
    expect(c5Status([ev('for'), ev('for', { candidate: 'x' })])).toBe('one_end_documented');
    expect(c5Status([ev('for'), DRAFT_BOTH[1]!])).toBe('sources_to_verify');
    expect(c5Status([ev('for'), ev('against', { verificationStatus: 'contested' })])).toBe('one_end_documented');
    expect(c5Status([ev('for'), ev('against', { verifiedAt: null })])).toBe('one_end_documented');
    expect(c5Status([])).toBe('needs_verification');
    expect(c5Status([ev('against', { verificationStatus: 'contested' })])).toBe('needs_verification');
  });
  it('3. une URL ou une citation manquante reste visiblement manquante et empêche la vérification', () => {
    const gap = ev('against', { url: null, quote: null, publishedAt: null });
    expect(c5Status([ev('for'), gap])).toBe('one_end_documented');
    const row = JSON.parse(buildExport([q({ id: 'g', evidence: [ev('for'), gap] })], {}, CRIT)).questions[0];
    const against = row.c5.evidence.find((e: { side: string }) => e.side === 'against');
    expect(against).toMatchObject({ url: null, quote: null, publishedAt: null, verified: false, missing: ['url', 'quote', 'publishedAt'] });
  });
  it('4. preuves vérifiées et brouillons sont distingués dans l\'export', () => {
    const row = JSON.parse(buildExport([q({ id: 'm', evidence: [ev('for'), DRAFT_BOTH[1]!] })], {}, CRIT)).questions[0];
    expect(row.c5.evidence.map((e: { side: string; verified: boolean; verificationStatus: string }) => [e.side, e.verified, e.verificationStatus])).toEqual([
      ['against', false, 'draft'],
      ['for', true, 'reviewed'],
    ]);
  });
  it('5. C5 ne peut pas être satisfait tant que ses preuves ne sont pas vérifiées, même coché par le relecteur', () => {
    const draft = q({ id: 'd', evidence: DRAFT_BOTH });
    const rec = kept(draft);
    expect(rec.criteria.c5).toBe('satisfied');
    expect(isActive(draft, rec, CRIT)).toBe(false);
    expect(canKeep(draft, rec, CRIT).reasons.join()).toContain('C5 : preuves non vérifiées des deux côtés (état : sources_to_verify)');
  });
});

describe('confirmation explicite des affectations', () => {
  const pq = q({ id: 'p', pFlag: true, proposedAssignment: { theme: 'institutions', polarity: '+' } });
  it("une proposition pré-remplie n'est pas une confirmation", () => {
    const rec = kept(pq);
    expect(needsConfirmation(pq, rec)).toBe(true);
    expect(canKeep(pq, rec, CRIT).reasons).toContain('affectation (thème et polarité) non confirmée');
  });
  it("la confirmation doit porter sur l'affectation effective actuelle", () => {
    const rec = kept(pq, { confirmed: { theme: 'institutions', polarity: '+', at: T0 } });
    expect(isActive(pq, rec, CRIT)).toBe(true);
    const changed = { ...rec, chosen: { theme: 'justice', polarity: '-' as const }, confirmed: rec.confirmed };
    // `confirmed` l'emporte dans l'affectation effective : changer la liste ne contourne pas la confirmation.
    expect(effectiveAssignment(pq, changed)).toEqual({ theme: 'institutions', polarity: '+' });
  });
  it("un changement de polarité choisi par l'humain exige aussi une confirmation", () => {
    const rec = kept(q({ id: 'b' }), { chosen: { theme: 'securite', polarity: '+' } });
    expect(needsConfirmation(q({ id: 'b' }), rec)).toBe(true);
  });
});

describe('FR-012', () => {
  const base = { securite: { plus: 5, minus: 4 }, institutions: { plus: 6, minus: 4 } };
  const qs = [q({ id: 'k1' }), q({ id: 'k2' }), q({ id: 't1' }), q({ id: 'r1' }), q({ id: 'd1' })];
  const recs = { k1: kept(qs[0]!), k2: kept(qs[1]!), r1: kept(qs[3]!, { decision: 'rework' }), d1: kept(qs[4]!, { decision: 'drop' }) };

  it('1. se calcule sur les énoncés validés actifs uniquement', () => {
    const [sec] = computeBalances(THEMES, base, qs, recs, CRIT);
    expect(sec).toMatchObject({ theme: 'securite', active: 11, plus: 5, minus: 6, awaiting: 3, excluded: 0, arbitration: 0 });
    expect(sec!.compliant).toBe(true);
  });
  it('2. ne compte ni les hors périmètre ni les arbitrages, même « gardés » et confirmés', () => {
    const oos = q({ id: 'o', status: 'OUT_OF_SCOPE', axisOutcome: 'OUT_OF_SCOPE', proposedAssignment: null });
    const arb = q({ id: 'a', status: 'NEEDS_HUMAN_ARBITRATION', axisOutcome: 'NEEDS_HUMAN_ARBITRATION', proposedAssignment: null });
    const r = { o: kept(oos, confirmAs(oos.originalAssignment)), a: kept(arb, confirmAs(arb.originalAssignment)) };
    const [sec] = computeBalances(THEMES, base, [oos, arb], r, CRIT);
    expect(sec).toMatchObject({ active: 9, excluded: 1, arbitration: 1, awaiting: 0 });
  });
  it('3. la projection optimiste signale Sécurité (13, 62 %) et Institutions (15, 67 %)', () => {
    // Reproduit les effectifs du jeu réel : 188 gardés + « à valider » confirmés tels que proposés.
    const b = { securite: { plus: 6, minus: 3 }, institutions: { plus: 8, minus: 4 }, justice: { plus: 5, minus: 5 } };
    const pending = (id: string, theme: string, polarity: '+' | '-') => q({ id, originalAssignment: { theme, polarity }, proposedAssignment: { theme, polarity } });
    const qs2 = [
      pending('s1', 'securite', '+'), pending('s2', 'securite', '+'), pending('s3', 'securite', '-'), pending('s4', 'securite', '-'),
      pending('i1', 'institutions', '+'),
      q({ id: 'mv', axisOutcome: 'CHANGE_AXIS', originalAssignment: { theme: 'justice', polarity: '+' }, proposedAssignment: { theme: 'institutions', polarity: '+' } }),
      pending('i2', 'institutions', '-'),
      q({ id: 'o1', status: 'OUT_OF_SCOPE', axisOutcome: 'OUT_OF_SCOPE', originalAssignment: { theme: 'securite', polarity: '-' }, proposedAssignment: null }),
      q({ id: 'a1', status: 'NEEDS_HUMAN_ARBITRATION', axisOutcome: 'NEEDS_HUMAN_ARBITRATION', originalAssignment: { theme: 'securite', polarity: '-' }, proposedAssignment: null }),
    ];
    const [sec, inst] = optimisticBalances(THEMES, b, qs2);
    expect(sec).toMatchObject({ active: 13, plus: 8, minus: 5, compliant: false, excluded: 1, arbitration: 1 });
    expect(Math.round(sec!.plusShare * 100)).toBe(62);
    expect(inst).toMatchObject({ active: 15, plus: 10, minus: 5, compliant: false });
    expect(Math.round(inst!.plusShare * 100)).toBe(67);
    expect(fr012Overall(optimisticBalances(THEMES, b, qs2), true)).toEqual({ state: 'fail', failing: ['securite', 'institutions'] });
  });
  it("4. l'indicateur global ne peut pas afficher un succès quand un thème échoue, et signale une revue incomplète", () => {
    const even = { securite: { plus: 5, minus: 5 }, institutions: { plus: 6, minus: 4 } };
    const ok = computeBalances(THEMES, { ...even, justice: { plus: 5, minus: 5 } }, [], {}, CRIT);
    expect(fr012Overall(ok, false).state).toBe('satisfied_review_incomplete');
    expect(fr012Overall(ok, true).state).toBe('satisfied');
    const bad = computeBalances(THEMES, even, [], {}, CRIT);
    expect(fr012Overall(bad, true)).toEqual({ state: 'fail', failing: ['justice'] });
    expect(isReviewComplete(qs, recs, CRIT)).toBe(false);
    expect(isReviewComplete([qs[0]!, qs[4]!], recs, CRIT)).toBe(true);
  });
  it("5. aucun calcul ne modifie la polarité ou le thème d'un énoncé", () => {
    const frozen = qs.map((x) => JSON.stringify(x));
    computeBalances(THEMES, base, qs, recs, CRIT);
    optimisticBalances(THEMES, base, qs);
    buildExport(qs, recs, CRIT);
    expect(qs.map((x) => JSON.stringify(x))).toEqual(frozen);
  });
  it("suit l'affectation effective : un changement de thème confirmé déplace le compte", () => {
    const mover = q({ id: 'm', pFlag: true, proposedAssignment: { theme: 'institutions', polarity: '+' } });
    const rec = kept(mover, { confirmed: { theme: 'institutions', polarity: '+', at: T0 } });
    const [sec, inst] = computeBalances(THEMES, base, [mover], { m: rec }, CRIT);
    expect(sec!.active).toBe(9);
    expect(inst).toMatchObject({ active: 11, plus: 7 });
  });
});

describe('groupByEffectiveTheme', () => {
  it('regroupe et filtre selon le thème effectif, choisi ou confirmé', () => {
    const a = q({ id: 'a' });
    const b = q({ id: 'b' });
    const groups = groupByEffectiveTheme(THEMES, [b, a], { b: { ...emptyRecord(b, CRIT), chosen: { theme: 'justice', polarity: '+' } } }, CRIT);
    expect(groups).toEqual({ securite: ['a'], institutions: [], justice: ['b'] });
  });
});

describe('historique', () => {
  const a = q({ id: 'a' });
  it('conserve chaque changement de décision et d\'affectation avec la valeur précédente', () => {
    let rec = emptyRecord(a, CRIT);
    rec = applyChange(rec, { decision: 'keep' }, T0);
    rec = applyChange(rec, { decision: 'rework' }, T1);
    rec = applyChange(rec, { confirmed: { theme: 'securite', polarity: '-', at: T1 } }, T1);
    rec = applyChange(rec, { criteria: { ...rec.criteria, c2: 'satisfied' } }, T1);
    expect(rec.history.map((h) => [h.field, h.from, h.to])).toEqual([
      ['decision', null, 'keep'],
      ['decision', 'keep', 'rework'],
      ['confirmed', null, { theme: 'securite', polarity: '-', at: T1 }],
      ['criteria.c2', 'not_reviewed', 'satisfied'],
    ]);
    expect(rec.updatedAt).toBe(T1);
  });
  it('regroupe les frappes rapprochées mais garde le texte de départ', () => {
    let rec = emptyRecord(a, CRIT);
    rec = applyChange(rec, { finalText: 'Texte a. modifié' }, T0);
    rec = applyChange(rec, { finalText: 'Texte a. modifié deux fois' }, T1);
    expect(rec.history).toEqual([{ at: T1, field: 'finalText', from: 'Texte a.', to: 'Texte a. modifié deux fois' }]);
    rec = applyChange(rec, { finalText: 'Troisième version' }, T2);
    expect(rec.history).toHaveLength(2);
  });
  it('compte les entrées retirées au-delà de la limite', () => {
    let rec = emptyRecord(a, CRIT);
    for (let i = 0; i < MAX_HISTORY + 5; i++) rec = applyChange(rec, { decision: i % 2 ? 'keep' : 'drop' }, T0);
    expect(rec.history).toHaveLength(MAX_HISTORY);
    expect(rec.historyDropped).toBe(5);
  });
});

describe('persistance et migration', () => {
  const pq = q({ id: 'p', pFlag: true, proposedAssignment: { theme: 'institutions', polarity: '+' } });
  it("relit à l'identique un document de forme 3", () => {
    let rec = kept(pq, { comment: 'ok', confirmed: { theme: 'institutions', polarity: '+', at: T0 }, resolution: { theme: 'institutions', polarity: '+', rationale: 'motif', at: T0 } });
    rec = applyChange(rec, { comment: 'ok, vu' }, T1);
    expect(normalizeRecord(JSON.parse(JSON.stringify(toDocument(rec))), pq, CRIT)).toEqual(rec);
  });
  it('relit un document de forme 2 (V3) sans arbitrage ni historique', () => {
    const v3 = { schema: 2, decision: 'keep', criteria: satisfied, finalText: 'Texte.', comment: '', chosen: null, confirmed: { theme: 'institutions', polarity: '+', at: T0 }, updatedAt: T0 };
    const rec = normalizeRecord(v3, pq, CRIT);
    expect(rec).toMatchObject({ schema: 3, decision: 'keep', confirmed: { theme: 'institutions', polarity: '+', at: T0 }, resolution: null, history: [], historyDropped: 0 });
  });
  it('migre un document de la première page sans le considérer comme confirmé', () => {
    const old = { decision: 'keep', checks: { c1: true, c2: true }, newText: 'Nouveau texte.', comment: 'vu', theme: 'institutions', polarity: '+', updatedAt: '2026-11-09' };
    const rec = normalizeRecord(old, pq, CRIT);
    expect(rec.criteria).toEqual({ c1: 'satisfied', c2: 'satisfied', c3: 'not_reviewed', c4: 'not_reviewed', c5: 'not_reviewed' });
    expect(rec.finalText).toBe('Nouveau texte.');
    expect(rec.chosen).toEqual({ theme: 'institutions', polarity: '+' });
    expect(rec.confirmed).toBeNull();
    expect(isActive(pq, rec, CRIT)).toBe(false);
  });
  it('ignore un document illisible et repart de zéro', () => {
    expect(normalizeRecord('n/a', pq, CRIT)).toEqual(emptyRecord(pq, CRIT));
  });
});

describe('Bloquant 3 : export de la piste d\'audit', () => {
  const pq = q({
    id: 'p',
    pFlag: true,
    axisOutcome: 'CHANGE_AXIS',
    previousClaudeProposal: { theme: 'justice', polarity: '+' },
    proposedAssignment: { theme: 'institutions', polarity: '+' },
    finalTextBasis: 'corrected',
    finalText: 'Texte corrigé.',
    evidence: [ev('for'), DRAFT_BOTH[1]!],
    c5Note: 'note C5',
  });
  let rec = emptyRecord(pq, CRIT);
  rec = applyChange(rec, { finalText: 'Texte du relecteur.' }, T0);
  rec = applyChange(rec, { chosen: { theme: 'institutions', polarity: '+' }, confirmed: { theme: 'institutions', polarity: '+', at: T1 } }, T1);
  rec = applyChange(rec, { decision: 'keep', comment: 'à revoir' }, T2);
  const out = buildExport([pq], { p: rec }, CRIT);
  const row = JSON.parse(out).questions[0];

  it('1. conserve les métadonnées d\'audit de l\'énoncé', () => {
    expect(row.audit).toEqual({
      fidelity: 'SEMANTIC_DRIFT', explanation: 'explication', axisOutcome: 'CHANGE_AXIS', axisExplanation: "explication de l'axe",
      status: 'PENDING_HUMAN_VALIDATION', pFlag: true, secondaryTheme: null, criteria: pq.auditCriteria,
    });
    expect(row.review).toEqual({ criteria: rec.criteria, decision: 'keep', comment: 'à revoir', updatedAt: T2 });
    expect(row.methodology).toEqual({ status: 'axis_change_confirmed', resolution: null });
  });
  it('2. garde le texte d\'origine et la 1re proposition après modification', () => {
    expect(row.text).toEqual({
      original: 'Texte p.', firstReviewProposal: 'Proposition p.', firstReviewMotif: 'motif de la 1re relecture',
      auditFinal: 'Texte corrigé.', auditFinalBasis: 'corrected', reviewerFinal: 'Texte du relecteur.',
    });
    expect(row.finalId).toBe('p-v2');
  });
  it('3. distingue affectations d\'origine, proposées, choisies et confirmées', () => {
    expect(row.assignment).toEqual({
      original: { theme: 'securite', polarity: '-' },
      previousClaudeProposal: { theme: 'justice', polarity: '+' },
      proposed: { theme: 'institutions', polarity: '+' },
      chosen: { theme: 'institutions', polarity: '+' },
      confirmed: { theme: 'institutions', polarity: '+', at: T1 },
      confirmation: { required: true, status: 'confirmed', provenance: 'human_explicit' },
      effective: { theme: 'institutions', polarity: '+' },
    });
  });
  it('4. inclut les preuves C5 et leur état de vérification', () => {
    expect(row.c5.status).toBe('sources_to_verify');
    expect(row.c5.note).toBe('note C5');
    expect(row.c5.evidence).toHaveLength(2);
    expect(row.c5.evidence[1]).toMatchObject({ side: 'for', sourceId: 'src-for', url: 'https://example.org/for', quote: 'Citation for', verifiedAt: '2026-11-10', verified: true, missing: [] });
    expect(row.outcome).toMatchObject({ active: false, eligibleToKeep: false });
    expect(row.outcome.outstandingConcerns).toContain('c5:sources_to_verify');
  });
  it('5. produit un JSON valide, au schéma documenté, identique quel que soit l\'ordre d\'entrée', () => {
    const parsed = JSON.parse(out);
    expect(parsed.schema).toBe(EXPORT_SCHEMA);
    expect(Object.keys(row)).toEqual(['assignment', 'audit', 'c5', 'finalId', 'history', 'historyDropped', 'id', 'methodology', 'outcome', 'review', 'text']);
    const a = q({ id: 'a' });
    expect(buildExport([pq, a], { p: rec }, CRIT)).toBe(buildExport([a, pq], { p: rec }, CRIT));
    const withFr = JSON.parse(buildExport([pq], { p: rec }, CRIT, { balances: computeBalances(THEMES, {}, [pq], { p: rec }, CRIT), overall: { state: 'fail', failing: THEMES } }));
    expect(withFr.fr012.thresholds).toEqual({ min: 10, low: 0.4, high: 0.6 });
    expect(withFr.fr012.themes).toHaveLength(3);
  });
  it("6. permet de reconstituer l'historique des décisions sans l'interface", () => {
    expect(row.history.map((h: { field: string; to: unknown }) => h.field)).toEqual(['finalText', 'chosen', 'confirmed', 'decision', 'comment']);
    expect(row.history[0]).toEqual({ at: T0, field: 'finalText', from: 'Texte corrigé.', to: 'Texte du relecteur.' });
    expect(row.historyDropped).toBe(0);
  });
});
