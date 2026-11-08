// @vitest-environment node
// SC-001 : exemples A et B de la spec, champ par champ.
import { describe, expect, it } from 'vitest';
import { StateError } from '../types';
import { EXAMPLE_A, EXAMPLE_B, type ScoreExample } from './examples';
import { scoreCandidates } from './score';

describe.each([EXAMPLE_A, EXAMPLE_B])('$title', (example: ScoreExample) => {
  const board = scoreCandidates({ bank: example.bank, selection: example.selection, state: example.state, versionCount: 1 });
  const c = board.ranked[0]!;
  const e = example.expected;

  it('candidat classé, bande attendue', () => {
    expect(board.ranked).toHaveLength(1);
    expect(board.insufficient).toEqual([]);
    expect(c.status).toBe('ranked');
    expect(c.rank).toBe(1);
    expect(c.band).toBe(e.band);
    expect(board.priorVersion).toBe(false);
  });

  it('agrégats exacts et affichés', () => {
    expect(c.weighted).toMatchObject(e.weighted);
    expect(c.priority).toMatchObject(e.priority);
    expect(c.global).toMatchObject(e.global);
    expect(c.coverage).toMatchObject(e.coverage);
  });

  it('scores de thème', () => {
    expect(
      c.themes.map((t) => ({ themeId: t.kind === 'theme' ? t.themeId : 'others', ratio: t.score?.ratio ?? null, percent: t.score?.percent ?? null })),
    ).toEqual(e.themes);
  });

  it('détail par question', () => {
    expect(c.questions.map((q) => ('concordance' in q ? q.concordance : null))).toEqual(e.concordances);
    c.questions.forEach((q, i) => expect(q.position).toBe(i));
  });
});

describe('exemple A, détails', () => {
  const board = scoreCandidates({ bank: EXAMPLE_A.bank, selection: EXAMPLE_A.selection, state: EXAMPLE_A.state, versionCount: 1 });
  const c = board.ranked[0]!;

  it('q4 exclue pour position inconnue, niveau de preuve transmis', () => {
    expect(c.questions[3]).toMatchObject({ questionId: 'q4', answer: 0, candidatePosition: null, excluded: 'unknown-position' });
    expect(c.questions[0]).toMatchObject({ level: 'p', candidatePosition: [1, 'p'] });
  });

  it('santé indéfinie avec une seule question exploitable', () => {
    expect(c.themes[1]).toMatchObject({ kind: 'theme', themeId: 'sante', count: 1, score: null, priority: false });
    expect(board.answeredCount).toBe(4);
  });

  it('pourcentage approché', () => {
    expect(c.global!.approx).toBeCloseTo(62.5);
  });
});

describe('erreurs d’appel', () => {
  const { bank, selection, state } = EXAMPLE_A;

  it('nombre de réponses incorrect', () => {
    expect(() => scoreCandidates({ bank, selection, state: { ...state, answers: [2] }, versionCount: 1 })).toThrow(StateError);
  });

  it('version incohérente', () => {
    expect(() => scoreCandidates({ bank, selection, state: { ...state, bankVersion: 2 }, versionCount: 2 })).toThrow(StateError);
  });

  it('sujet inconnu, réponse hors domaine', () => {
    expect(() => scoreCandidates({ bank, selection, state: { ...state, priorities: ['inconnu'] }, versionCount: 1 })).toThrow(StateError);
    expect(() => scoreCandidates({ bank, selection, state: { ...state, answers: [3, 0, 0, 0] as never }, versionCount: 1 })).toThrow(StateError);
  });
});
