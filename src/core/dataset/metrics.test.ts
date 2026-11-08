// @vitest-environment node
import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { coverage, discriminant, round3, round4 } from './metrics';
import type { ScaleValue } from './types';

const scale = fc.constantFrom<ScaleValue>(-2, -1, 0, 1, 2);

describe('coverage (FR-033)', () => {
  it('rapport connu / actives', () => {
    expect(coverage(6, 10)).toBe(0.6);
    expect(coverage(0, 10)).toBe(0);
  });
  it('0 sans question active', () => {
    expect(coverage(3, 0)).toBe(0);
  });
  it('reste dans [0, 1]', () => {
    fc.assert(
      fc.property(fc.nat(500), fc.nat(500), (known, active) => {
        const c = coverage(Math.min(known, active), active);
        return c >= 0 && c <= 1;
      }),
    );
  });
});

describe('discriminant (FR-034, US3 scénario 6)', () => {
  it('11/22 dispersés > 20/22 tous à +2', () => {
    const dispersed: ScaleValue[] = [-2, -2, -1, -1, 0, 0, 1, 1, 2, 2, 2];
    const unanimous: ScaleValue[] = Array.from({ length: 20 }, () => 2 as const);
    expect(discriminant(unanimous, 22)).toBe(0);
    expect(discriminant(dispersed, 22)).toBeGreaterThan(discriminant(unanimous, 22));
  });
  it('0 si moins de deux valeurs connues', () => {
    expect(discriminant([], 22)).toBe(0);
    expect(discriminant([2], 22)).toBe(0);
  });
  it('écart-type de population × k/n', () => {
    // valeurs −2 et +2 : σ = 2 ; k/n = 2/4
    expect(discriminant([-2, 2], 4)).toBe(1);
  });
  it('propriété : 0 ≤ D ≤ 2', () => {
    fc.assert(
      fc.property(fc.array(scale, { maxLength: 30 }), fc.integer({ min: 0, max: 30 }), (values, extra) => {
        const d = discriminant(values, values.length + extra);
        return d >= 0 && d <= 2;
      }),
    );
  });
  it('propriété : D = 0 si toutes les valeurs sont égales', () => {
    fc.assert(fc.property(scale, fc.integer({ min: 0, max: 30 }), (v, k) => discriminant(Array(k).fill(v), 30) === 0));
  });
  it('propriété : monotone en k à dispersion fixée', () => {
    fc.assert(
      fc.property(fc.array(scale, { minLength: 2, maxLength: 10 }), fc.integer({ min: 1, max: 4 }), (base, reps) => {
        // Répéter la même distribution conserve σ et augmente k.
        const small = base;
        const large = Array.from({ length: reps + 1 }, () => base).flat();
        const n = large.length;
        return discriminant(large, n) >= discriminant(small, n) - 1e-12;
      }),
    );
  });
});

describe('arrondis', () => {
  it('round3 / round4', () => {
    expect(round3(0.12345)).toBe(0.123);
    expect(round4(0.12345)).toBe(0.1235);
  });
});
