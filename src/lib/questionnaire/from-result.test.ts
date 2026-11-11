// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { bankFromDataset, decodeFragment, selectQuestions, StateError, type MainDataset, type ResultState } from '@/core';
import { syntheticDataset } from '@/core/bank/fixtures';
import { questionnaireBankFrom } from './bank-view';
import { PRIORITIES, testBank, testDraft } from './fixtures';
import { carryOver, draftFromResultState, needsConfirmation } from './from-result';
import { resultHref } from './summary';

const NOW = '2026-11-09T10:00:00.000Z';

function stateOf(answers: ResultState['answers'], priorities: readonly string[] = PRIORITIES, version = 1): ResultState {
  return { bankVersion: version, mode: 'short', priorities, answers };
}

const full = Array.from({ length: 25 }, (_, i) => ([-2, -1, 0, 1, 2, 'skipped'] as const)[i % 6]!);

describe('draftFromResultState', () => {
  const bank = testBank();

  it('même version : brouillon identique, position 0 si tout est traité', () => {
    const draft = draftFromResultState(stateOf(full), bank, NOW);
    expect(draft).toEqual({ format: 1, bankVersion: 1, mode: 'short', priorities: [...PRIORITIES], answers: full, position: 0, updatedAt: NOW });
  });

  it('position = première question non répondue', () => {
    const answers = full.map((a, i) => (i === 7 || i === 12 ? 'unanswered' : a));
    expect(draftFromResultState(stateOf(answers), bank, NOW).position).toBe(7);
  });

  it('aller-retour : decodeFragment(resultHref(draft)) = état', () => {
    const state = stateOf(full.map((a, i) => (i % 4 === 0 ? 'unanswered' : a)));
    const href = resultHref(draftFromResultState(state, bank, NOW), bank);
    const decoded = decodeFragment(href.split('#')[1]!, bank.bank);
    expect(decoded).toEqual({ ok: true, value: state });
  });

  it('version différente ⇒ StateError', () => {
    expect(() => draftFromResultState(stateOf(full, PRIORITIES, 2), bank, NOW)).toThrow(StateError);
  });
});

/** Version 2 : le thème t04 disparaît (questions retirées), une question de t01 est ajoutée. */
function v2Without(themesRemoved: readonly string[]): MainDataset {
  const d = syntheticDataset({ version: 2, publishedAt: '2026-11-15' });
  const keep = d.questions.map((q, i) => ({ q, i })).filter(({ q }) => !q.themes.some((t) => themesRemoved.includes(t)));
  const themes = d.themes.filter((t) => !themesRemoved.includes(t.id)).map((t, order) => ({ ...t, order }));
  const positions = Object.fromEntries(Object.entries(d.positions).map(([c, row]) => [c, keep.map(({ i }) => row[i] ?? null)]));
  return { ...d, themes, questions: keep.map(({ q }) => q), positions };
}

describe('carryOver (version antérieure)', () => {
  const linkBank = testBank(1).bank;

  it('report par identifiant ; questions nouvelles non répondues ; aucune réponse inventée', () => {
    const current = questionnaireBankFrom(v2Without(['t13']));
    const state = stateOf(full);
    const result = carryOver(state, linkBank, current, NOW);
    expect(result.kind).toBe('draft');
    if (result.kind !== 'draft') return;
    const { draft } = result;
    expect(draft.bankVersion).toBe(2);
    expect(draft.priorities).toEqual([...PRIORITIES]);
    const oldItems = selectQuestions(linkBank, 'short', PRIORITIES).items;
    const byId = new Map(oldItems.map((it, i) => [it.question.id, state.answers[i]]));
    const newItems = selectQuestions(current.bank, 'short', draft.priorities).items;
    expect(draft.answers).toHaveLength(newItems.length);
    newItems.forEach((it, i) => expect(draft.answers[i]).toBe(byId.get(it.question.id) ?? 'unanswered'));
    expect(draft.answers.filter((a) => a !== 'unanswered').length).toBeGreaterThan(0);
  });

  it('même version que la courante ⇒ brouillon identique', () => {
    const result = carryOver(stateOf(full), linkBank, testBank(1), NOW);
    expect(result).toEqual({ kind: 'draft', draft: draftFromResultState(stateOf(full), testBank(1), NOW) });
  });

  it('moins de 3 sujets subsistants ⇒ choose-themes avec les restants présélectionnés', () => {
    const current = questionnaireBankFrom(v2Without(['t01', 't07']));
    expect(carryOver(stateOf(full), linkBank, current, NOW)).toEqual({ kind: 'choose-themes', preselected: ['t04', 't10'] });
  });

  it('3 sujets subsistants sur 4 ⇒ brouillon avec ces 3 sujets', () => {
    const current = questionnaireBankFrom(v2Without(['t07']));
    const result = carryOver(stateOf(full), linkBank, current, NOW);
    expect(result.kind === 'draft' && result.draft.priorities).toEqual(['t01', 't04', 't10']);
    expect(bankFromDataset(v2Without(['t07'])).themes).toHaveLength(15);
  });
});

describe('needsConfirmation (data-model § 9)', () => {
  const draft = testDraft({ answers: full });

  it('aucun brouillon stocké ⇒ false', () => {
    expect(needsConfirmation(null, draft)).toBe(false);
  });

  it('ignore position et date', () => {
    expect(needsConfirmation({ ...draft, position: 12, updatedAt: '2026-01-01T00:00:00.000Z' }, draft)).toBe(false);
  });

  it.each([
    ['version', { bankVersion: 2 }],
    ['mode', { mode: 'full' as const }],
    ['sujets', { priorities: ['t01', 't04', 't08'] }],
    ['réponses', { answers: full.map((a, i) => (i === 3 ? 'skipped' : a)) }],
  ])('%s différent(e)s ⇒ true', (_, change) => {
    expect(needsConfirmation({ ...draft, ...change }, draft)).toBe(true);
  });
});
