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
