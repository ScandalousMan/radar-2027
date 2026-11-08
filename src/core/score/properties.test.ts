// @vitest-environment node
// SC-005 : plafond strict, bande « très aligné » impossible sans P ≥ 80, partition, déterminisme.
import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { syntheticBank } from '../bank/fixtures';
import { selectQuestions } from '../selection';
import type { Answer, Mode, ResultState } from '../types';
import { scoreCandidates } from './score';

const bank = syntheticBank();
const themeIds = bank.themes.map((t) => t.id);
const arbAnswer = fc.constantFrom<Answer>(-2, -1, 0, 1, 2, 'skipped', 'unanswered');

const arbInput = fc
  .tuple(fc.constantFrom<Mode>('full', 'short'), fc.uniqueArray(fc.constantFrom(...themeIds), { minLength: 3, maxLength: 5 }), fc.infiniteStream(arbAnswer))
  .map(([mode, priorities, stream]) => {
    const selection = selectQuestions(bank, mode, priorities);
    const answers = [...stream.take(selection.items.length)];
    const state: ResultState = { bankVersion: 1, mode, priorities, answers };
    return { selection, state };
  });

describe('propriétés du score (SC-005)', () => {
  it('plafond strict, bandes, partition, détail complet, déterminisme', () => {
    fc.assert(
      fc.property(arbInput, ({ selection, state }) => {
        const board = scoreCandidates({ bank, selection, state, versionCount: 1 });
        expect(board.ranked.length + board.insufficient.length).toBe(bank.candidates.length);
        for (const c of board.ranked) {
          expect(c.global!.percent).toBeLessThanOrEqual(c.priority!.percent);
          expect(c.global!.percent).toBeLessThanOrEqual(c.weighted!.percent);
          if (c.band === 'very-aligned') expect(c.priority!.percent).toBeGreaterThanOrEqual(80);
          expect(c.coverage!.percent).toBeGreaterThanOrEqual(60);
        }
        for (const c of [...board.ranked, ...board.insufficient]) expect(c.questions).toHaveLength(selection.items.length);
        expect(scoreCandidates({ bank, selection, state, versionCount: 1 })).toEqual(board);
      }),
      { numRuns: 100 },
    );
  });

  it('réponses majoritairement numériques : des candidats sont classés', () => {
    const selection = selectQuestions(bank, 'full', ['t00', 't05', 't10']);
    const answers = selection.items.map((_, i) => ([-2, -1, 0, 1, 2] as const)[i % 5]!);
    const board = scoreCandidates({ bank, selection, state: { bankVersion: 1, mode: 'full', priorities: ['t00', 't05', 't10'], answers }, versionCount: 1 });
    expect(board.ranked.length).toBeGreaterThan(0);
  });
});
