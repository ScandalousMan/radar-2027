// @vitest-environment node
import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { BankError } from '../bank';
import { syntheticBank } from '../bank/fixtures';
import { QUOTA_FLOOR, TARGET_COUNT, type Mode } from '../types';
import { computeQuotas } from './quotas';

const bank16 = syntheticBank({ perTheme: 2 });

describe('computeQuotas (FR-021)', () => {
  it('complet + sujets {0, 1, 2}', () => {
    expect(computeQuotas(bank16, 'full', [0, 1, 2])).toEqual([14, 14, 14, 5, 5, 5, 5, 5, 5, 4, 4, 4, 4, 4, 4, 4]);
  });

  it('court + 5 sujets', () => {
    const q = computeQuotas(bank16, 'short', [0, 1, 2, 3, 4]);
    expect(q.slice(0, 5)).toEqual([3, 3, 3, 3, 2]);
    expect(q.slice(5)).toEqual(Array(11).fill(1));
  });

  it('complet + 5 sujets', () => {
    const q = computeQuotas(bank16, 'full', [0, 1, 2, 3, 4]);
    expect(q.slice(0, 5)).toEqual([12, 11, 11, 11, 11]);
    expect(q.slice(5)).toEqual(Array(11).fill(4));
  });

  it('sujets non contigus : le reste suit l’ordre canonique', () => {
    const q = computeQuotas(bank16, 'full', [2, 7, 9]);
    expect([q[2], q[7], q[9]]).toEqual([14, 14, 14]);
    expect(q.reduce((a, b) => a + b, 0)).toBe(100);
    expect(q.filter((x) => x === 5)).toHaveLength(6);
    expect(q[0]).toBe(5);
    expect(q[15]).toBe(4);
  });

  it('propriété : Σ = N et chaque quota ≥ plancher pour T ∈ [8, 20]', () => {
    const arb = fc
      .integer({ min: 8, max: 20 })
      .chain((T) => fc.tuple(fc.constant(T), fc.uniqueArray(fc.integer({ min: 0, max: T - 1 }), { minLength: 3, maxLength: 5 }), fc.constantFrom<Mode>('full', 'short')));
    fc.assert(
      fc.property(arb, ([T, prio, mode]) => {
        const q = computeQuotas(syntheticBank({ themes: T, perTheme: 1, candidates: 0 }), mode, prio);
        expect(q).toHaveLength(T);
        expect(q.reduce((a, b) => a + b, 0)).toBe(TARGET_COUNT[mode]);
        for (const x of q) expect(x).toBeGreaterThanOrEqual(QUOTA_FLOOR[mode]);
      }),
      { numRuns: 300 },
    );
  });

  it('refuse le mode court avec 21 thèmes et 5 sujets', () => {
    const bank = syntheticBank({ themes: 21, perTheme: 1, candidates: 0 });
    expect(() => computeQuotas(bank, 'short', [0, 1, 2, 3, 4])).toThrow(BankError);
    try {
      computeQuotas(bank, 'short', [0, 1, 2, 3, 4]);
    } catch (e) {
      expect((e as BankError).code).toBe('too-many-themes-for-quotas');
    }
  });
});
