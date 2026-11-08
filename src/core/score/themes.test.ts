// @vitest-environment node
// FR-003, FR-004, FR-013 : comptage par thème et pseudo-thème « autres » en mode court.
import { describe, expect, it } from 'vitest';
import { selectionOf, tinyBank } from '../bank/fixtures';
import type { PositionCell } from '../dataset';
import type { Answer, Mode } from '../types';
import { scoreCandidates } from './score';

const K: PositionCell = [0, 'p'];

// a, b prioritaires ; c, d non prioritaires.
const bank = tinyBank(
  ['a', 'b', 'c', 'd'],
  [
    ['q1', ['a', 'b']],
    ['q2', ['a']],
    ['q3', ['b']],
    ['q4', ['c', 'd']],
    ['q5', ['c']],
    ['q6', ['a', 'd']],
  ],
  { cand: [K, K, K, K, K, null] },
);

function themesOf(mode: Mode, answers: Answer[] = [0, 0, 0, 2, 0, 0]) {
  const selection = selectionOf(bank, ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'], mode);
  const board = scoreCandidates({ bank, selection, state: { bankVersion: 1, mode, priorities: ['a', 'b'], answers }, versionCount: 1 });
  return [...board.ranked, ...board.insufficient][0]!.themes;
}

describe('themeScores', () => {
  it('mode complet : un ThemeScore par thème, question à deux thèmes comptée dans les deux', () => {
    const t = themesOf('full');
    expect(t.map((x) => (x.kind === 'theme' ? [x.themeId, x.priority, x.count] : null))).toEqual([
      ['a', true, 2],
      ['b', true, 2],
      ['c', false, 2],
      ['d', false, 1],
    ]);
    expect(t[3]!.score).toBeNull();
    // c : s(q4) = 0 (|2 − 0| = 2), s(q5) = 1 → moyenne 1/2.
    expect(t[2]!.score?.ratio).toEqual({ num: 1n, den: 2n });
  });

  it('mode court : prioritaires puis « autres », chaque question comptée une fois', () => {
    const t = themesOf('short');
    expect(t).toHaveLength(3);
    expect(t[0]).toMatchObject({ kind: 'theme', themeId: 'a', count: 2 });
    expect(t[1]).toMatchObject({ kind: 'theme', themeId: 'b', count: 2 });
    // q4 (c, d) une seule fois, q5 (c) ; q6 (a, d) est inconnue.
    expect(t[2]).toMatchObject({ kind: 'others', count: 2 });
    expect(t[2]!.score?.ratio).toEqual({ num: 1n, den: 2n });
  });

  it('« autres » indéfini sous 2 questions exploitables', () => {
    const t = themesOf('short', [0, 0, 0, 'skipped', 0, 0]);
    expect(t[2]).toMatchObject({ kind: 'others', count: 1, score: null });
  });
});
