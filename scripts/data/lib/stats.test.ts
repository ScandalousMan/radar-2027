// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { minimalContext } from './rules/testing';
import { bankStats, themeStats } from './stats';

describe('statistiques', () => {
  it('effectifs par thème et polarité sur la fixture minimale', () => {
    const ctx = minimalContext();
    const stats = themeStats(ctx.corpus);
    expect(stats.map((t) => t.id)).toEqual(['economie', 'sante', 'environnement']);
    expect(stats[0]).toMatchObject({ active: 10, plus: 5, minus: 5, plusShare: 0.5, draft: 0, retired: 0 });
    expect(bankStats(ctx.corpus, ctx.thresholds)).toEqual({ active: 30, draft: 0, retired: 0, targetMin: 250, targetMax: 300 });
  });
});

describe('couverture, positions et pouvoir discriminant', () => {
  it('fixture minimale', async () => {
    const { computeStats, distribution } = await import('./stats');
    const stats = computeStats(minimalContext());
    expect(stats.positions?.byStatus).toEqual({ reviewed: 4, draft: 1, contested: 1 });
    expect(stats.positions?.byEvidence).toEqual({ programme: 2, declaration_vote: 1 });
    expect(stats.positions?.unknown).toBe(1);
    // dupont : 2 connues sur 30 ; martin : 1 sur 30 (brouillon, contestée et inconnue exclues).
    expect(stats.coverageByCandidate).toEqual([
      { id: 'dupont', known: 2, active: 30, coverage: 2 / 30 },
      { id: 'martin', known: 1, active: 30, coverage: 1 / 30 },
    ]);
    expect(stats.coverageByTheme?.[0]).toEqual({ id: 'economie', known: 2, cells: 20, coverage: 0.1 });
    expect(stats.discriminant).toMatchObject({ questions: 30, min: 0, max: 0 });
    expect(stats.unreachableSources).toEqual([]);
    expect(distribution([0, 1, 2, 3, 4]).median).toBe(2);
  });
});
