// @vitest-environment node
import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { add, cmp, div, floorPercentSigned, floorPercentUnit, mean, min, mul, ONE, ratio, sub, toNumber, weightedMean, ZERO } from './ratio';

const arbRatio = fc.tuple(fc.integer({ min: -1000, max: 1000 }), fc.integer({ min: 1, max: 64 })).map(([n, d]) => ratio(n, d));

describe('ratio', () => {
  it('réduit par le pgcd et normalise le signe', () => {
    expect(ratio(6, 8)).toEqual({ num: 3n, den: 4n });
    expect(ratio(3, -6)).toEqual({ num: -1n, den: 2n });
    expect(ratio(0, 7)).toEqual(ZERO);
    expect(() => ratio(1, 0)).toThrow(RangeError);
    expect(() => ratio(0.5)).toThrow(RangeError);
  });

  it('add, sub, mul, div', () => {
    expect(add(ratio(1, 2), ratio(1, 3))).toEqual(ratio(5, 6));
    expect(sub(ratio(1, 2), ratio(1, 3))).toEqual(ratio(1, 6));
    expect(mul(ratio(2, 3), ratio(3, 4))).toEqual(ratio(1, 2));
    expect(div(ratio(1, 2), ratio(1, 4))).toEqual(ratio(2));
    expect(() => div(ONE, ZERO)).toThrow(RangeError);
  });

  it('cmp, min, mean, weightedMean', () => {
    expect(cmp(ratio(5, 8), ratio(61, 100))).toBe(1);
    expect(cmp(ratio(2, 4), ratio(1, 2))).toBe(0);
    expect(min(ratio(2, 5), ZERO)).toEqual(ZERO);
    expect(mean([ratio(1, 2), ZERO])).toEqual(ratio(1, 4));
    expect(weightedMean([{ value: ZERO, weight: 3 }, { value: ONE, weight: 1 }, { value: ONE, weight: 1 }])).toEqual(ratio(2, 5));
    expect(() => mean([])).toThrow(RangeError);
  });

  it('troncatures en pourcentage (FR-011)', () => {
    expect(floorPercentSigned(ratio(1, 4))).toBe(62);
    expect(floorPercentSigned(ZERO)).toBe(50);
    expect(floorPercentSigned(ONE)).toBe(100);
    expect(floorPercentSigned(ratio(-1))).toBe(0);
    expect(floorPercentSigned(ratio(2, 5))).toBe(70);
    expect(floorPercentUnit(ratio(3, 4))).toBe(75);
    expect(floorPercentUnit(ratio(1, 2))).toBe(50);
    expect(floorPercentUnit(ratio(3, 5))).toBe(60);
  });

  it('propriété : cmp antisymétrique et transitif', () => {
    fc.assert(
      fc.property(arbRatio, arbRatio, arbRatio, (a, b, c) => {
        expect(cmp(a, b)).toBe(-cmp(b, a) || 0);
        if (cmp(a, b) <= 0 && cmp(b, c) <= 0) expect(cmp(a, c)).toBeLessThanOrEqual(0);
      }),
    );
  });

  it('propriété : toNumber monotone', () => {
    fc.assert(
      fc.property(arbRatio, arbRatio, (a, b) => {
        if (cmp(a, b) < 0) expect(toNumber(a)).toBeLessThan(toNumber(b));
      }),
    );
  });

  it('propriété : floorPercent* = Math.floor à petit dénominateur', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 40 }), fc.nat(80), (den, k) => {
        const n = Math.min(k, 2 * den) - den; // x ∈ [−1, +1]
        expect(floorPercentSigned(ratio(n, den))).toBe(Math.floor(((n + den) * 100) / (2 * den)));
        const u = Math.min(k, den); // x ∈ [0, 1]
        expect(floorPercentUnit(ratio(u, den))).toBe(Math.floor((u * 100) / den));
      }),
    );
  });
});
