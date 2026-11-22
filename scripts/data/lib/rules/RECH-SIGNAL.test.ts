// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { RECH_SIGNAL } from './RECH-SIGNAL';
import { evidenceOf, journalOf, minimalContext, researchContext } from './testing';

const codes = (ctx: ReturnType<typeof researchContext>, severity: 'error' | 'warning' = 'error') =>
  RECH_SIGNAL.run(ctx)
    .filter((v) => v.severity === severity)
    .map((v) => `${v.entity.id} ${/^\(\d+\)/.exec(v.message)?.[0]}`);
const SIG = 'sig-2026-11-22-dupont-smic';

describe('RECH-SIGNAL', () => {
  it('fixture minimale conforme, sans avertissement', () => {
    const ctx = researchContext();
    expect(codes(ctx)).toEqual([]);
    expect(codes(ctx, 'warning')).toEqual([]);
  });
  it('muette sans corpus de preuves', () => expect(RECH_SIGNAL.run(minimalContext())).toEqual([]));

  it('champs requis selon le type (1)', () => {
    const ctx = researchContext();
    const s = ctx.research.signals[0]!;
    delete s.position;
    expect(codes(ctx)).toEqual([`${SIG} (1)`]);
    s.kind = 'POSSIBLE_DUPLICATE';
    expect(codes(ctx)).toEqual([`${SIG} (1)`]);
    s.kind = 'QUOTE_DISCREPANCY';
    s.position = { candidate: 'dupont', question: 'economie-q01' };
    s.evidence = [];
    expect(codes(ctx)).toEqual([]);
  });

  it('résolution absente, inattendue ou attribuée à claude (2)', () => {
    const ctx = researchContext();
    const s = ctx.research.signals[0]!;
    s.state = 'resolved';
    expect(codes(ctx)).toEqual([`${SIG} (2)`]);
    s.resolution = { at: '2026-11-25', by: 'claude', decision: 'Position confirmée.' };
    expect(codes(ctx)).toEqual([`${SIG} (2)`]);
    s.resolution.by = 'adrien';
    expect(codes(ctx)).toEqual([]);
    s.state = 'open';
    expect(codes(ctx)).toEqual([`${SIG} (2)`]);
  });

  it('preuve de signe contraire à une position sans POSITION_REVIEW (3)', () => {
    const ctx = researchContext();
    ctx.research.signals = [];
    journalOf(ctx).signals = [];
    expect(codes(ctx)).toEqual([]); // soutien conforme à une valeur positive
    evidenceOf(ctx, 'dupont-economie-001').qualification = 'QUALIFIED_OPPOSITION';
    expect(codes(ctx)).toEqual(['dupont-economie-001 (3)']);
  });

  it('preuve contraire couverte par un signalement POSITION_REVIEW, ou position contestée ignorée', () => {
    const ctx = researchContext();
    evidenceOf(ctx, 'dupont-economie-001').qualification = 'EXPLICIT_OPPOSITION';
    expect(codes(ctx)).toEqual([]);
    ctx.research.signals = [];
    ctx.corpus.positions.get('dupont')!.find((p) => p.question === 'economie-q01')!.status = 'contested';
    expect(codes(ctx)).toEqual([]);
  });

  it('contradiction non tracée : avertissement (4)', () => {
    const ctx = researchContext();
    const e = evidenceOf(ctx, 'dupont-economie-001');
    e.qualification = 'CONTRADICTORY_EVIDENCE';
    expect(codes(ctx, 'warning')).toEqual(['dupont-economie-001 (4)']);
    journalOf(ctx).contradictions = [{ evidence: ['dupont-economie-001'], note: 'Deux versions du programme.' }];
    expect(codes(ctx, 'warning')).toEqual([]);
  });
});
