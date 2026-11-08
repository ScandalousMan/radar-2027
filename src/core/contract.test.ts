// @vitest-environment node
// Contrat d'export de `@/core` (contracts/core-api.md), consommé par les fonctionnalités 004 et 005.
import { describe, expect, expectTypeOf, it } from 'vitest';
import * as core from '@/core';
import type { BankVersion, DecodeResult, DecodedHeader, Mode, ResultState, Scoreboard, Selection } from '@/core';

describe('API publique de src/core', () => {
  it('fonctions et constantes exportées', () => {
    expectTypeOf(core.selectQuestions).toEqualTypeOf<(bank: BankVersion, mode: Mode, priorities: readonly string[]) => Selection>();
    expectTypeOf(core.scoreCandidates).parameter(0).toMatchTypeOf<{ bank: BankVersion; selection: Selection; state: ResultState; versionCount: number }>();
    expectTypeOf(core.scoreCandidates).returns.toEqualTypeOf<Scoreboard>();
    expectTypeOf(core.encodeFragment).toEqualTypeOf<(state: ResultState, bank: BankVersion) => string>();
    expectTypeOf(core.decodeHeader).toEqualTypeOf<(fragment: string, versionCount: number) => DecodeResult<DecodedHeader>>();
    expectTypeOf(core.decodeFragment).toEqualTypeOf<(fragment: string, bank: BankVersion) => DecodeResult<ResultState>>();
    expectTypeOf(core.expectedPayloadLength).toEqualTypeOf<(selectionSize: number) => number>();
    expectTypeOf(core.normalizePriorities).toEqualTypeOf<(bank: BankVersion, ids: readonly string[]) => readonly string[]>();

    for (const fn of [core.selectQuestions, core.computeQuotas, core.scoreCandidates, core.encodeFragment, core.decodeHeader, core.decodeFragment, core.bankFromDataset, core.normalizePriorities])
      expect(typeof fn).toBe('function');
    expect(core.TARGET_COUNT).toEqual({ full: 100, short: 25 });
    expect([core.MIN_PRIORITIES, core.MAX_PRIORITIES]).toEqual([3, 5]);
    expect(core.EXAMPLE_A.expected.global.percent).toBe(62);
    expect(core.EXAMPLE_B.expected.global.percent).toBe(50);
    expect(core.FRAGMENT_FULL_EXAMPLE.fragment).toMatch(/^#1\./);
    expect(core.FRAGMENT_SHORT_EXAMPLE.fragment).toMatch(/^#1\./);
    expect(new core.StateError('bad-mode')).toBeInstanceOf(Error);
    expect(new core.BankError('too-many-themes').code).toBe('too-many-themes');
  });

  it('les banques fictives de test ne sont pas exportées', () => {
    expect('syntheticBank' in core).toBe(false);
    expect('bankPair' in core).toBe(false);
    expect('selectionOf' in core).toBe(false);
  });
});
