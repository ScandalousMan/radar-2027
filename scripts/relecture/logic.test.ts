// @vitest-environment node
import { describe, expect, it } from 'vitest';
import {
  buildExport,
  canKeep,
  computeBalances,
  effectiveAssignment,
  emptyRecord,
  groupByEffectiveTheme,
  isActive,
  needsConfirmation,
  normalizeRecord,
  toDocument,
  type Question,
  type ReviewRecord,
} from './logic';

const CRIT = ['c1', 'c2', 'c3', 'c4', 'c5'];
const THEMES = ['securite', 'institutions', 'justice'];

function q(over: Partial<Question> & { id: string }): Question {
  return {
    finalId: `${over.id}-v2`,
    originalText: `Texte ${over.id}.`,
    finalText: `Texte ${over.id}.`,
    originalAssignment: { theme: 'securite', polarity: '-' },
    proposedAssignment: { theme: 'securite', polarity: '-' },
    axisOutcome: 'VALID_AXIS_AND_POLARITY',
    pFlag: false,
    status: 'PENDING_HUMAN_VALIDATION',
    ...over,
  };
}

const satisfied = Object.fromEntries(CRIT.map((c) => [c, 'satisfied' as const]));
function kept(question: Question, over: Partial<ReviewRecord> = {}): ReviewRecord {
  return { ...emptyRecord(question, CRIT), decision: 'keep', criteria: { ...satisfied }, ...over };
}

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

describe('confirmation explicite des affectations', () => {
  const pq = q({ id: 'p', pFlag: true, proposedAssignment: { theme: 'institutions', polarity: '+' } });
  it("une proposition pré-remplie n'est pas une confirmation", () => {
    const rec = kept(pq);
    expect(needsConfirmation(pq, rec)).toBe(true);
    expect(canKeep(pq, rec, CRIT).reasons).toContain('affectation (thème et polarité) non confirmée');
  });
  it("la confirmation doit porter sur l'affectation effective actuelle", () => {
    const rec = kept(pq, { confirmed: { theme: 'institutions', polarity: '+', at: '2026-11-10' } });
    expect(isActive(pq, rec, CRIT)).toBe(true);
    const changed = { ...rec, chosen: { theme: 'justice', polarity: '-' as const }, confirmed: rec.confirmed };
    // `confirmed` l'emporte dans l'affectation effective : changer la liste ne contourne pas la confirmation.
    expect(effectiveAssignment(pq, changed)).toEqual({ theme: 'institutions', polarity: '+' });
  });
  it('un énoncé hors axe sans proposition garde son affectation d\'origine tant que rien n\'est confirmé', () => {
    const oos = q({ id: 'o', pFlag: true, axisOutcome: 'OUT_OF_SCOPE', proposedAssignment: null });
    expect(effectiveAssignment(oos, emptyRecord(oos, CRIT))).toEqual(oos.originalAssignment);
    expect(isActive(oos, kept(oos), CRIT)).toBe(false);
  });
  it("un changement de polarité choisi par l'humain exige aussi une confirmation", () => {
    const rec = kept(q({ id: 'b' }), { chosen: { theme: 'securite', polarity: '+' } });
    expect(needsConfirmation(q({ id: 'b' }), rec)).toBe(true);
  });
});

describe('computeBalances (FR-012)', () => {
  const base = { securite: { plus: 5, minus: 4 }, institutions: { plus: 6, minus: 4 } };
  const qs = [q({ id: 'k1' }), q({ id: 'k2' }), q({ id: 't1' }), q({ id: 'r1' }), q({ id: 'd1' })];
  const recs = { k1: kept(qs[0]!), k2: kept(qs[1]!), r1: kept(qs[3]!, { decision: 'rework' }), d1: kept(qs[4]!, { decision: 'drop' }) };
  it('ne compte que les gardés de la 1re passe et les « garder » valides de la 2de', () => {
    const [sec] = computeBalances(THEMES, base, qs, recs, CRIT);
    expect(sec).toMatchObject({ theme: 'securite', active: 11, plus: 5, minus: 6, pending: 3 });
    expect(sec!.compliant).toBe(true);
  });
  it('signale un thème hors règle', () => {
    const [, inst] = computeBalances(THEMES, { institutions: { plus: 7, minus: 2 } }, [], {}, CRIT);
    expect(inst).toMatchObject({ active: 9, compliant: false });
  });
  it("suit l'affectation effective : un changement de thème confirmé déplace le compte", () => {
    const mover = q({ id: 'm', pFlag: true, proposedAssignment: { theme: 'institutions', polarity: '+' } });
    const rec = kept(mover, { confirmed: { theme: 'institutions', polarity: '+', at: '2026-11-10' } });
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

describe('persistance et migration', () => {
  const pq = q({ id: 'p', pFlag: true, proposedAssignment: { theme: 'institutions', polarity: '+' } });
  it('relit à l\'identique un document de forme 2', () => {
    const rec = kept(pq, { comment: 'ok', confirmed: { theme: 'institutions', polarity: '+', at: '2026-11-10T10:00:00Z' }, updatedAt: '2026-11-10T10:00:00Z' });
    expect(normalizeRecord(JSON.parse(JSON.stringify(toDocument(rec))), pq, CRIT)).toEqual(rec);
  });
  it('migre un document de la page précédente sans le considérer comme confirmé', () => {
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

describe('buildExport', () => {
  it("est déterministe quel que soit l'ordre d'entrée", () => {
    const a = q({ id: 'a' });
    const b = q({ id: 'b', finalText: 'Autre texte.' });
    const recs = { a: kept(a), b: kept(b, { decision: 'rework' }) };
    const one = buildExport([a, b], recs, CRIT);
    expect(buildExport([b, a], { b: recs.b, a: recs.a }, CRIT)).toBe(one);
    const parsed = JSON.parse(one);
    expect(parsed.questions.map((r: { id: string }) => r.id)).toEqual(['a', 'b']);
    expect(parsed.questions[0]).toMatchObject({ active: true, finalId: 'a', originalAssignment: { theme: 'securite', polarity: '-' } });
    expect(parsed.questions[1]).toMatchObject({ active: false, finalId: 'b-v2', decision: 'rework' });
  });
});
