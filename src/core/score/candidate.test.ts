// @vitest-environment node
// Scénarios 3 à 7 de l'US1.
import { describe, expect, it } from 'vitest';
import { selectionOf, tinyBank } from '../bank/fixtures';
import type { PositionCell } from '../dataset';
import type { Answer, Mode } from '../types';
import { scoreCandidates } from './score';

const K: PositionCell = [0, 'p'];
const ids = (prefix: string, n: number) => Array.from({ length: n }, (_, i) => `${prefix}${i + 1}`);

function board(themes: string[], questions: [string, string[]][], positions: Record<string, PositionCell[]>, answers: Answer[], priorities: string[], mode: Mode = 'full') {
  const bank = tinyBank(themes, questions, positions);
  const selection = selectionOf(bank, questions.map(([id]) => id), mode);
  return scoreCandidates({ bank, selection, state: { bankVersion: 1, mode, priorities, answers }, versionCount: 1 });
}

const tenQuestions: [string, string[]][] = [...ids('a', 5).map((id): [string, string[]] => [id, ['a']]), ...ids('b', 5).map((id): [string, string[]] => [id, ['b']])];

describe('statut et couverture (FR-007, FR-008)', () => {
  it('scénario 3 : couverture 5/10 → données insuffisantes, scores de thème fournis', () => {
    const b = board(['a', 'b'], tenQuestions, { cand: [K, K, null, null, null, K, K, K, null, null] }, Array(10).fill(0), ['a']);
    expect(b.ranked).toEqual([]);
    const c = b.insufficient[0]!;
    expect(c).toMatchObject({ status: 'insufficient-data', rank: null, band: null, global: null });
    expect(c.coverage).toMatchObject({ known: 5, answered: 10, percent: 50 });
    expect(c.themes[0]).toMatchObject({ themeId: 'a', count: 2 });
    expect(c.themes[0]!.score?.percent).toBe(100);
    expect(c.themes[1]!.score?.percent).toBe(100);
  });

  it('scénario 4 : P indéfini malgré 90 % de couverture → insuffisant', () => {
    const b = board(['a', 'b'], [['a1', ['a']], ['a2', ['a']], ...ids('b', 8).map((id): [string, string[]] => [id, ['b']])], { cand: [K, null, K, K, K, K, K, K, K, K] }, Array(10).fill(0), ['a']);
    const c = b.insufficient[0]!;
    expect(c.coverage?.percent).toBe(90);
    expect(c.priority).toBeNull();
    expect(c.rank).toBeNull();
  });

  it('couverture exactement 60 % → classé (seuil inclusif)', () => {
    const b = board(['a', 'b'], [['a1', ['a']], ['a2', ['a']], ['a3', ['a']], ['b1', ['b']], ['b2', ['b']]], { cand: [K, K, null, K, null] }, [0, 0, 0, 0, 0], ['a']);
    expect(b.ranked[0]?.coverage).toMatchObject({ known: 3, answered: 5, percent: 60 });
    expect(b.ranked[0]?.status).toBe('ranked');
  });

  it('aucune réponse numérique → couverture nulle, tous insuffisants', () => {
    const b = board(['a', 'b'], tenQuestions, { x: Array(10).fill(K), y: Array(10).fill(K) }, Array(10).fill('skipped'), ['a']);
    expect(b.ranked).toEqual([]);
    expect(b.insufficient.map((c) => c.candidate.id)).toEqual(['x', 'y']);
    expect(b.insufficient.every((c) => c.coverage === null)).toBe(true);
    expect(b.answeredCount).toBe(0);
  });
});

describe('plafond strict et bandes (FR-010, FR-014)', () => {
  it('scénario 6 (analogue) : W ≥ 80 % mais P 75 % → G 75 %, pas « très aligné »', () => {
    // a prioritaire : s = 1/2 sur deux questions ; b, c, d : s = 1.
    const qs: [string, string[]][] = [['a1', ['a']], ['a2', ['a']], ['b1', ['b']], ['b2', ['b']], ['c1', ['c']], ['c2', ['c']], ['d1', ['d']], ['d2', ['d']]];
    const b = board(['a', 'b', 'c', 'd'], qs, { cand: Array(8).fill(K) }, [1, 1, 0, 0, 0, 0, 0, 0], ['a']);
    const c = b.ranked[0]!;
    expect(c.weighted?.percent).toBe(87);
    expect(c.priority?.percent).toBe(75);
    expect(c.global?.percent).toBe(75);
    expect(c.band).toBe('rather-aligned');
  });

  it('thème à exactement 2 questions exploitables → défini', () => {
    const b = board(['a'], [['a1', ['a']], ['a2', ['a']]], { cand: [K, K] }, [2, 0], ['a']);
    expect(b.ranked[0]!.themes[0]).toMatchObject({ count: 2 });
    expect(b.ranked[0]!.themes[0]!.score?.ratio).toEqual({ num: 1n, den: 2n });
  });
});

describe('niveau de preuve (FR-015)', () => {
  it('scénario 7 : seul le niveau de preuve diffère → scores identiques', () => {
    const b = board(['a', 'b'], tenQuestions, { prog: Array(10).fill([1, 'p']), decl: Array(10).fill([1, 'd']) }, [2, 1, 0, -1, -2, 2, 1, 0, -1, -2], ['a']);
    const [x, y] = b.ranked;
    expect(x!.global).toEqual(y!.global);
    expect(x!.weighted).toEqual(y!.weighted);
    expect(x!.themes).toEqual(y!.themes);
    expect(x!.rank).toBe(y!.rank);
  });
});
