// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { ratio } from '@/core';
import { agreementOf } from './agreement';

// Concordance du cœur : s = 1 − |u − c| / 2, écart 0 … 4 ⇒ 1, 1/2, 0, −1/2, −1.
describe('agreementOf (R3, FR-015)', () => {
  it.each([
    [ratio(1), 'identical'],
    [ratio(1, 2), 'close'],
    [ratio(0), 'intermediate'],
    [ratio(-1, 2), 'distant'],
    [ratio(-1), 'opposite'],
  ] as const)('%o ⇒ %s', (r, level) => {
    expect(agreementOf(r)).toBe(level);
  });

  it.each([ratio(3, 4), ratio(1, 4), ratio(-2), ratio(5, 4)])('autre valeur %o ⇒ erreur de programmation', (r) => {
    expect(() => agreementOf(r)).toThrow();
  });
});
