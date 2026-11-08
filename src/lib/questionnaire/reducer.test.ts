// @vitest-environment node
import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { isAnswer } from '@/core';
import { selectionsFor } from './bank-view';
import { PRIORITIES, testBank, testDraft } from './fixtures';
import { firstUnanswered, isCompleted, reduce } from './reducer';
import type { Action, Draft } from './types';

const bank = testBank();
const selections = selectionsFor(bank, PRIORITIES);
const ctx = { selection: selections.short };
const NOW = '2026-11-08T18:00:00.000Z';

const start = (): Draft => reduce(null, { type: 'start', bank, priorities: PRIORITIES, mode: 'short', now: NOW }, ctx)!;

describe('reduce : cas unitaires', () => {
  it('start crée N réponses « unanswered » en position 0', () => {
    const d = start();
    expect(d.answers).toHaveLength(25);
    expect(d.answers.every((a) => a === 'unanswered')).toBe(true);
    expect(d).toMatchObject({ format: 1, bankVersion: 1, mode: 'short', position: 0, updatedAt: NOW });
    expect(d.priorities).toEqual([...PRIORITIES]);
  });

  it('start sans sélection ou de mode incohérent ne crée rien', () => {
    expect(reduce(null, { type: 'start', bank, priorities: PRIORITIES, mode: 'short', now: NOW }, { selection: null })).toBeNull();
    expect(reduce(null, { type: 'start', bank, priorities: PRIORITIES, mode: 'full', now: NOW }, ctx)).toBeNull();
  });

  it('start avec le même triplet qu’un brouillon existant le reprend tel quel (R13)', () => {
    const d = { ...start(), position: 7, answers: start().answers.map((a, i) => (i < 7 ? 1 : a)) } as Draft;
    expect(reduce(d, { type: 'start', bank, priorities: PRIORITIES, mode: 'short', now: 'plus tard' }, ctx)).toBe(d);
  });

  it('start avec un autre triplet repart de zéro', () => {
    const d = { ...start(), position: 7 };
    const other = reduce(d, { type: 'start', bank, priorities: PRIORITIES, mode: 'full', now: NOW }, { selection: selections.full })!;
    expect(other.answers).toHaveLength(100);
    expect(other.position).toBe(0);
  });

  it('answer enregistre à la position courante, ignore les autres positions', () => {
    const d = start();
    const a = reduce(d, { type: 'answer', position: 0, answer: 2, now: 'n1' }, ctx)!;
    expect(a.answers[0]).toBe(2);
    expect(a.updatedAt).toBe('n1');
    expect(reduce(a, { type: 'answer', position: 1, answer: -1, now: 'n2' }, ctx)).toBe(a);
  });

  it('next est borné à N − 1, previous à 0', () => {
    let d = start();
    expect(reduce(d, { type: 'previous', now: NOW }, ctx)).toBe(d);
    for (let i = 0; i < 40; i++) d = reduce(d, { type: 'next', now: NOW }, ctx)!;
    expect(d.position).toBe(24);
    expect(isCompleted(d)).toBe(true);
    d = reduce(d, { type: 'previous', now: NOW }, ctx)!;
    expect(d.position).toBe(23);
    expect(isCompleted(d)).toBe(false);
  });

  it('goTo est idempotent et ignore les positions hors bornes', () => {
    const d = start();
    const g = reduce(d, { type: 'goTo', position: 5, now: 'n' }, ctx)!;
    expect(g.position).toBe(5);
    expect(reduce(g, { type: 'goTo', position: 5, now: 'n' }, ctx)).toEqual(g);
    expect(reduce(g, { type: 'goTo', position: 25, now: 'n' }, ctx)).toBe(g);
    expect(reduce(g, { type: 'goTo', position: -1, now: 'n' }, ctx)).toBe(g);
  });

  it('resume remplace ; reset et clear rendent null', () => {
    const other = testDraft({ position: 3 });
    expect(reduce(start(), { type: 'resume', draft: other }, ctx)).toBe(other);
    expect(reduce(start(), { type: 'reset' }, ctx)).toBeNull();
    expect(reduce(start(), { type: 'clear' }, ctx)).toBeNull();
  });

  it('firstUnanswered rend la première position non traitée, sinon la dernière', () => {
    expect(firstUnanswered(testDraft())).toBe(0);
    expect(firstUnanswered(testDraft({ answers: testDraft().answers.map((a, i) => (i < 4 ? 'skipped' : a)) }))).toBe(4);
    expect(firstUnanswered(testDraft({ answers: testDraft().answers.map(() => 0) }))).toBe(24);
  });
});

describe('reduce : propriétés', () => {
  const answerArb = fc.constantFrom(-2, -1, 0, 1, 2, 'skipped' as const);
  const actionArb = (n: number): fc.Arbitrary<Action> =>
    fc.oneof(
      fc.record({ type: fc.constant('answer' as const), position: fc.integer({ min: -2, max: n + 2 }), answer: answerArb, now: fc.string() }),
      fc.record({ type: fc.constant('next' as const), now: fc.string() }),
      fc.record({ type: fc.constant('previous' as const), now: fc.string() }),
      fc.record({ type: fc.constant('goTo' as const), position: fc.integer({ min: -2, max: n + 2 }), now: fc.string() }),
    ) as fc.Arbitrary<Action>;

  it('conserve longueur, bornes, réponses admises, réponses non visées et horodatage', () => {
    fc.assert(
      fc.property(fc.array(actionArb(25), { maxLength: 80 }), (actions) => {
        let d = start();
        let lastWrite = d.updatedAt;
        for (const action of actions) {
          const before = d;
          d = reduce(d, action, ctx)!;
          expect(d.answers).toHaveLength(25);
          expect(d.position).toBeGreaterThanOrEqual(0);
          expect(d.position).toBeLessThan(25);
          expect(d.answers.every(isAnswer)).toBe(true);
          const target = action.type === 'answer' ? action.position : -1;
          d.answers.forEach((a, i) => {
            if (i !== target) expect(a).toBe(before.answers[i]);
          });
          if (d !== before) lastWrite = (action as { now: string }).now;
          expect(d.updatedAt).toBe(lastWrite);
        }
      }),
      { numRuns: 300 },
    );
  });
});
