// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { testDraft } from './fixtures';
import { isChoiceValid, requiredStep, ROUTES } from './guards';

const none = { priorities: [], mode: null };
const three = { priorities: ['t01', 't02', 't03'], mode: null };
const full = { priorities: ['t01', 't02', 't03'], mode: 'short' as const };

describe('requiredStep', () => {
  it.each([
    ['themes', none, null],
    ['mode', none, ROUTES.themes],
    ['mode', three, null],
    ['questions', none, ROUTES.themes],
    ['questions', { priorities: ['t01'], mode: 'short' as const }, ROUTES.themes],
    ['questions', three, ROUTES.mode],
    ['questions', full, null],
    ['end', full, ROUTES.themes],
  ] as const)('%s avec %j → %s', (step, choice, expected) => {
    expect(requiredStep(step, { choice, draft: null })).toBe(expected);
  });

  it('un brouillon présent autorise toutes les étapes', () => {
    for (const step of ['themes', 'mode', 'questions', 'end'] as const) expect(requiredStep(step, { choice: none, draft: testDraft() })).toBeNull();
  });

  it('isChoiceValid applique les bornes du cœur', () => {
    expect(isChoiceValid({ priorities: ['a', 'b'] })).toBe(false);
    expect(isChoiceValid({ priorities: ['a', 'b', 'c'] })).toBe(true);
    expect(isChoiceValid({ priorities: ['a', 'b', 'c', 'd', 'e'] })).toBe(true);
    expect(isChoiceValid({ priorities: ['a', 'b', 'c', 'd', 'e', 'f'] })).toBe(false);
  });
});
