// @vitest-environment node
// FR-011, FR-012 : scénario 5 de l'US1 et départages.
import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { ratio, type Ratio } from '../ratio';
import { signedScore } from './concordance';
import { rankCandidates } from './rank';
import type { CandidateScore } from './types';

/** Candidat classé ; G et P donnés en valeur de [−1, +1]. */
function cs(id: string, G: Ratio, P: Ratio, coverage: Ratio = ratio(1)): CandidateScore {
  return {
    candidate: { id, name: id, party: 'p' },
    status: 'ranked',
    rank: null,
    band: null,
    global: signedScore(G),
    priority: signedScore(P),
    weighted: signedScore(G),
    coverage: { known: 1, answered: 1, ratio: coverage, percent: 100 },
    themes: [],
    questions: [],
  };
}

describe('rankCandidates', () => {
  it('scénario 5 : X 62,5 %, Y 62,2 %, Z 58 % → rangs 1, 1, 3, Y avant X', () => {
    const X = cs('x', ratio(1, 4), ratio(1, 4)); // 62,5 %
    const Y = cs('y', ratio(61, 250), ratio(3, 10)); // 62,2 %, P 65 %
    const Z = cs('z', ratio(4, 25), ratio(4, 25)); // 58 %
    expect([X, Y, Z].map((c) => c.global!.percent)).toEqual([62, 62, 58]);
    const ranked = rankCandidates([X, Z, Y]);
    expect(ranked.map((c) => [c.candidate.id, c.rank])).toEqual([
      ['y', 1],
      ['x', 1],
      ['z', 3],
    ]);
  });

  it('départage par couverture puis par identifiant croissant', () => {
    const a = cs('b', ratio(0), ratio(0), ratio(4, 5));
    const b = cs('a', ratio(0), ratio(0), ratio(4, 5));
    const c = cs('c', ratio(0), ratio(0), ratio(9, 10));
    expect(rankCandidates([a, b, c]).map((x) => [x.candidate.id, x.rank])).toEqual([
      ['c', 1],
      ['a', 1],
      ['b', 1],
    ]);
  });

  it('propriété : tri déterministe et idempotent, rangs cohérents', () => {
    const arb = fc.uniqueArray(
      fc.record({ id: fc.stringMatching(/^[a-z]{1,4}$/), g: fc.integer({ min: -20, max: 20 }), p: fc.integer({ min: -20, max: 20 }) }),
      { selector: (r) => r.id, maxLength: 25 },
    );
    fc.assert(
      fc.property(arb, (rows) => {
        const list = rows.map((r) => cs(r.id, ratio(Math.min(r.g, r.p), 20), ratio(r.p, 20)));
        const once = rankCandidates(list);
        expect(rankCandidates([...list].reverse())).toEqual(once);
        expect(rankCandidates(once)).toEqual(once);
        once.forEach((c, i) => {
          const better = once.filter((o) => o.global!.percent > c.global!.percent).length;
          expect(c.rank).toBe(better + 1);
          if (i > 0) expect(once[i - 1]!.global!.percent).toBeGreaterThanOrEqual(c.global!.percent);
        });
      }),
    );
  });
});
