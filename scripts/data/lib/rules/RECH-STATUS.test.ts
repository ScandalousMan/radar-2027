// @vitest-environment node
import { describe, expect, it } from 'vitest';
import type { Evidence } from '../schema';
import { RECH_STATUS } from './RECH-STATUS';
import { evidenceOf, minimalContext, personalityOf, researchContext } from './testing';

const J = '2026-11-22-fixture-minimale';
const codes = (ctx: ReturnType<typeof researchContext>, severity: 'error' | 'warning' = 'error') =>
  RECH_STATUS.run(ctx)
    .filter((v) => v.severity === severity)
    .map((v) => `${v.entity.id} ${/^\(\d+\)/.exec(v.message)?.[0]}`);

function addCandidacy(ctx: ReturnType<typeof researchContext>, base: string, id: string, patch: Partial<Evidence>) {
  const e = { ...evidenceOf(ctx, base), id, ...patch };
  ctx.research.evidence.get(e.personality)!.push(e);
  return e;
}

describe('RECH-STATUS', () => {
  it('fixture minimale conforme, sans avertissement', () => {
    const ctx = researchContext();
    expect(codes(ctx)).toEqual([]);
    expect(codes(ctx, 'warning')).toEqual([]);
  });
  it('muette sans corpus de preuves', () => expect(RECH_STATUS.run(minimalContext())).toEqual([]));

  it('statuts dans le désordre (1)', () => {
    const ctx = researchContext();
    const p = personalityOf(ctx, 'jean-exemple');
    p.statuses.unshift({ ...p.statuses[0]!, at: { date: '2026-10-02', precision: 'day' } });
    expect(codes(ctx)).toEqual(['jean-exemple (1)']);
  });

  it('statut sans preuve CANDIDACY de la même personnalité (2)', () => {
    const ctx = researchContext();
    personalityOf(ctx, 'martin').statuses[0]!.evidence = ['dupont-sante-001'];
    expect(codes(ctx).sort()).toEqual(['martin (2)', 'martin (2)', 'martin (2)']);
    personalityOf(ctx, 'martin').statuses[0]!.evidence = [];
    expect(codes(ctx)).toEqual(['martin (2)']);
  });

  it('déclaration appuyée sur un tiers seulement (3)', () => {
    const ctx = researchContext();
    const e = evidenceOf(ctx, 'martin-candidature-001');
    e.attribution = 'THIRD_PARTY_ATTRIBUTION';
    expect(codes(ctx)).toEqual(['martin (3)']);
    personalityOf(ctx, 'martin').statuses[0]!.status = 'INTENTION_EXPRESSED';
    expect(codes(ctx)).toContain('martin (3)');
  });

  it('statut affirmatif appuyé sur des attributions indirectes (4)', () => {
    const ctx = researchContext();
    personalityOf(ctx, 'jean-exemple').statuses[0]!.status = 'ATTEMPTED';
    expect(codes(ctx)).toEqual(['jean-exemple (4)']);
    personalityOf(ctx, 'jean-exemple').statuses[0]!.status = 'POTENTIAL';
    expect(codes(ctx)).toEqual([]);
  });

  it('renoncement puis nouvelle annonce : trois statuts conservés, conformes', () => {
    const ctx = researchContext();
    addCandidacy(ctx, 'martin-candidature-001', 'martin-candidature-002', { candidacyStatus: 'WITHDRAWN', statedAt: { date: '2026-10-20', precision: 'day' } });
    addCandidacy(ctx, 'martin-candidature-001', 'martin-candidature-003', { candidacyStatus: 'DECLARED', statedAt: { date: '2026-11-10', precision: 'day' } });
    const p = personalityOf(ctx, 'martin');
    p.statuses.push(
      { status: 'WITHDRAWN', at: { date: '2026-10-20', precision: 'day' }, observedAt: '2026-11-22', evidence: ['martin-candidature-002'] },
      { status: 'DECLARED', at: { date: '2026-11-10', precision: 'day' }, observedAt: '2026-11-22', evidence: ['martin-candidature-003'] },
    );
    expect(codes(ctx)).toEqual([]);
  });

  it('écart avec la liste publiée sans signalement (5), levé par un signalement CANDIDATE_STATUS', () => {
    const ctx = researchContext();
    addCandidacy(ctx, 'martin-candidature-001', 'martin-candidature-002', { candidacyStatus: 'WITHDRAWN', statedAt: { date: '2026-10-20', precision: 'day' } });
    personalityOf(ctx, 'martin').statuses.push({ status: 'WITHDRAWN', at: { date: '2026-10-20', precision: 'day' }, observedAt: '2026-11-22', evidence: ['martin-candidature-002'] });
    expect(codes(ctx)).toEqual(['martin (5)']);
    ctx.research.signals.push({ id: 'sig-x', kind: 'CANDIDATE_STATUS', raisedAt: '2026-11-22', journal: J, personality: 'martin', evidence: ['martin-candidature-002'], reason: 'x', state: 'open' });
    expect(codes(ctx)).toEqual([]);
  });

  it('personnalité hors liste déclarée sans signalement (5)', () => {
    const ctx = researchContext();
    const e = evidenceOf(ctx, 'jean-exemple-candidature-001');
    Object.assign(e, { attribution: 'PERSONAL_DIRECT', speaker: 'Jean Exemple' });
    personalityOf(ctx, 'jean-exemple').statuses[0]!.status = 'DECLARED';
    expect(codes(ctx)).toEqual(['jean-exemple (5)']);
  });

  it('candidat publié absent du registre : avertissement (6)', () => {
    const ctx = researchContext();
    ctx.research.personalities = ctx.research.personalities.filter((p) => p.id !== 'martin');
    expect(codes(ctx, 'warning')).toEqual(['martin (6)']);
    expect(codes(ctx)).toEqual([]);
  });
});
