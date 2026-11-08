// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { decodeFragment, MIN_THEME_QUESTIONS, type Answer } from '@/core';
import { selectionsFor } from './bank-view';
import { PRIORITIES, testBank, testDraft } from './fixtures';
import { resultHref, resultStateFromDraft, summarize } from './summary';

const bank = testBank();
const selections = selectionsFor(bank, PRIORITIES);

describe('summarize', () => {
  it('compte une question à deux thèmes dans chacun de ses deux thèmes clés', () => {
    // t01-q00 porte t01 et t02 dans la banque fictive.
    const priorities = ['t01', 't02', 't05'];
    const sel = selectionsFor(bank, priorities).full;
    const target = sel.items.findIndex((i) => i.question.id === 't01-q00');
    expect(target).toBeGreaterThanOrEqual(0);
    const answers = sel.items.map((_, i): Answer => (i === target ? 1 : 'unanswered'));
    const s = summarize(testDraft({ mode: 'full', priorities, answers }), bank, sel);
    expect(s.themes.find((t) => t.themeId === 't01')!.answered).toBe(1);
    expect(s.themes.find((t) => t.themeId === 't02')!.answered).toBe(1);
    expect(s.themes.find((t) => t.themeId === 't05')!.answered).toBe(0);
    expect(s.totalAnswered).toBe(1);
  });

  it('fiable seulement à partir de MIN_THEME_QUESTIONS réponses numériques (« passée » ne compte pas)', () => {
    const sel = selections.short;
    const t01 = bank.bank.themeIndexById.get('t01')!;
    const positions = sel.items.map((it, i) => (it.question.themeIndices.includes(t01) ? i : -1)).filter((i) => i >= 0);
    expect(positions.length).toBeGreaterThanOrEqual(MIN_THEME_QUESTIONS);
    const allSkipped = testDraft({ answers: sel.items.map(() => 'skipped' as Answer) });
    const s1 = summarize(allSkipped, bank, sel);
    expect(s1.themes.every((t) => !t.reliable)).toBe(true);
    expect(s1.warning).toBe(true);
    expect(s1.totalSkipped).toBe(25);
    expect(s1.totalAnswered).toBe(0);

    const oneAnswer = allSkipped.answers.map((a, i) => (i === positions[0] ? (2 as Answer) : a));
    expect(summarize({ ...allSkipped, answers: oneAnswer }, bank, sel).themes.find((t) => t.themeId === 't01')!.reliable).toBe(false);
    const enough = oneAnswer.map((a, i) => (positions.slice(0, MIN_THEME_QUESTIONS).includes(i) ? (0 as Answer) : a));
    expect(summarize({ ...allSkipped, answers: enough }, bank, sel).themes.find((t) => t.themeId === 't01')!.reliable).toBe(true);
  });

  it('tout répondu : aucun avertissement, sujets en ordre canonique', () => {
    const sel = selections.short;
    const s = summarize(testDraft({ answers: sel.items.map(() => 1 as Answer) }), bank, sel);
    expect(s.warning).toBe(false);
    expect(s.themes.map((t) => t.themeId)).toEqual([...PRIORITIES]);
    expect(s.totalAnswered).toBe(25);
  });
});

describe('remise aux résultats', () => {
  it('resultStateFromDraft normalise les sujets et garde « unanswered »', () => {
    const d = testDraft({ priorities: ['t10', 't01', 't07', 't04'] });
    const state = resultStateFromDraft(d, bank);
    expect(state.priorities).toEqual([...PRIORITIES]);
    expect(state.answers.every((a) => a === 'unanswered')).toBe(true);
    expect(state).toMatchObject({ bankVersion: 1, mode: 'short' });
  });

  it.each([
    ['complet', (i: number): Answer => ([-2, -1, 0, 1, 2, 'skipped'] as const)[i % 6]!],
    ['partiel', (i: number): Answer => (i < 10 ? 1 : 'unanswered')],
    ['toutes passées', (): Answer => 'skipped'],
  ])('decodeFragment(resultHref) redonne l’état exact : brouillon %s', (_, answerAt) => {
    for (const mode of ['short', 'full'] as const) {
      const n = selections[mode].items.length;
      const d = testDraft({ mode, answers: Array.from({ length: n }, (_, i) => answerAt(i)) });
      const href = resultHref(d, bank);
      expect(href.startsWith('/resultats#1.')).toBe(true);
      const decoded = decodeFragment(href.split('#')[1]!, bank.bank);
      expect(decoded).toEqual({ ok: true, value: resultStateFromDraft(d, bank) });
    }
  });
});
