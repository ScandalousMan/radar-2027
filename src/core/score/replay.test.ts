// @vitest-environment node
// SC-009, US4 scénario 3 : un lien émis en version 1 et rejoué après publication de la version 2
// reproduit exactement scores, rangs, bandes et couvertures.
import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { bankPair } from '../bank/fixtures';
import { decodeFragment, encodeFragment } from '../codec';
import { selectQuestions } from '../selection';
import type { Answer, Mode, ResultState } from '../types';
import { scoreCandidates } from './score';

const { v1, v2 } = bankPair();
const ids = v1.themes.map((t) => t.id);

const arbState = fc
  .tuple(
    fc.constantFrom<Mode>('full', 'short'),
    fc.uniqueArray(fc.constantFrom(...ids), { minLength: 3, maxLength: 5 }),
    fc.infiniteStream(fc.constantFrom<Answer>(-2, -1, 0, 1, 2, 2, 1, 'skipped')),
  )
  .map(([mode, priorities, stream]): ResultState => {
    const n = selectQuestions(v1, mode, priorities).items.length;
    return { bankVersion: 1, mode, priorities: [...priorities].sort(), answers: [...stream.take(n)] };
  });

describe('rejeu inter-versions (SC-009)', () => {
  it('200 états : Scoreboard identique avant et après publication de la version 2', { timeout: 60_000 }, () => {
    fc.assert(
      fc.property(arbState, (state) => {
        // Le jour du partage : seule la version 1 existe.
        const before = scoreCandidates({ bank: v1, selection: selectQuestions(v1, state.mode, state.priorities), state, versionCount: 1 });
        const link = encodeFragment(state, v1);

        // Après publication de la version 2 : la 005 charge la version désignée par le lien.
        const decoded = decodeFragment(link, v1);
        expect(decoded.ok).toBe(true);
        if (!decoded.ok) return;
        const after = scoreCandidates({ bank: v1, selection: selectQuestions(v1, decoded.value.mode, decoded.value.priorities), state: decoded.value, versionCount: 2 });

        expect(after.ranked).toEqual(before.ranked);
        expect(after.insufficient).toEqual(before.insufficient);
        expect(after.answeredCount).toBe(before.answeredCount);
        expect(before.priorVersion).toBe(false);
        expect(after.priorVersion).toBe(true);
        expect(after.bankPublishedAt).toBe('2026-11-08');

        // Contre-épreuve : les mêmes réponses scorées sur la version 2 ne donnent pas le même résultat
        // (c21 retiré, position de c05 modifiée).
        const s2 = selectQuestions(v2, state.mode, state.priorities);
        if (s2.items.length === state.answers.length) {
          const wrong = scoreCandidates({ bank: v2, selection: s2, state: { ...state, bankVersion: 2 }, versionCount: 2 });
          expect([...wrong.ranked, ...wrong.insufficient].some((c) => c.candidate.id === 'c21')).toBe(false);
          expect([...after.ranked, ...after.insufficient].some((c) => c.candidate.id === 'c21')).toBe(true);
        }
      }),
      { numRuns: 200 },
    );
  });
});
