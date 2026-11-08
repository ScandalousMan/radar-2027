// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { bankFromDataset } from '../bank';
import { syntheticBank, syntheticDataset } from '../bank/fixtures';
import type { MainDataset } from '../dataset';
import { StateError } from '../types';
import { fillQuotas } from './fill';
import { selectQuestions } from './select';
import type { Selection } from './types';

const bank = syntheticBank();

/** Tant qu'au moins deux thèmes ont encore des questions, deux ancrages consécutifs diffèrent. */
function expectAlternation(selection: Selection): void {
  const anchors = selection.items.map((i) => i.anchorThemeIndex);
  for (let i = 0; i + 1 < anchors.length; i++) {
    if (anchors[i] === anchors[i + 1]) {
      // Seul ce thème reste à présenter.
      expect(new Set(anchors.slice(i + 1)).size).toBe(1);
    }
  }
}

function filtered(keep: (id: string) => boolean): MainDataset {
  const ds = syntheticDataset();
  const kept = ds.questions.map((q, i) => ({ q, i })).filter(({ q }) => keep(q.id));
  return {
    ...ds,
    questions: kept.map(({ q }) => q),
    positions: Object.fromEntries(Object.entries(ds.positions).map(([c, row]) => [c, kept.map(({ i }) => row[i]!)])),
  };
}

describe('selectQuestions (US2)', () => {
  it('scénario 1 : complet + 3 sujets → 100 questions distinctes, quotas attendus', () => {
    const s = selectQuestions(bank, 'full', ['t00', 't01', 't02']);
    expect(s.items).toHaveLength(100);
    expect(new Set(s.items.map((i) => i.question.id)).size).toBe(100);
    expect(s.quotas).toEqual([14, 14, 14, 5, 5, 5, 5, 5, 5, 4, 4, 4, 4, 4, 4, 4]);
    s.items.forEach((item, i) => expect(item.position).toBe(i));
  });

  it('scénario 2 : court + 5 sujets → 25 questions', () => {
    const s = selectQuestions(bank, 'short', ['t04', 't00', 't01', 't02', 't03']);
    expect(s.items).toHaveLength(25);
    expect(s.priorityIndices).toEqual([0, 1, 2, 3, 4]);
    expect(s.quotas.slice(0, 5)).toEqual([3, 3, 3, 3, 2]);
  });

  it('scénario 4 : deux appels identiques', () => {
    expect(selectQuestions(bank, 'full', ['t09', 't02', 't07'])).toEqual(selectQuestions(bank, 'full', ['t02', 't07', 't09']));
  });

  it('scénario 5 : D_q 0,9 / 0,9 / 0,4 et quota 2 → les deux à 0,9, égalité par identifiant', () => {
    const ds = syntheticDataset({ themes: 1, perTheme: 3, candidates: 0 });
    ds.questions = [
      { ...ds.questions[0]!, id: 'a-a', discriminant: 0.9 },
      { ...ds.questions[1]!, id: 'a-b', discriminant: 0.4 },
      { ...ds.questions[2]!, id: 'a-c', discriminant: 0.9 },
    ];
    const picked = fillQuotas(bankFromDataset(ds), [2], [], 2);
    expect(picked.map((p) => p.question.id)).toEqual(['a-a', 'a-c']);
  });

  it('scénario 6 : alternance des ancrages, trois premières questions = trois sujets en ordre canonique', () => {
    const s = selectQuestions(bank, 'full', ['t09', 't02', 't07']);
    expect(s.items.slice(0, 3).map((i) => i.anchorThemeIndex)).toEqual([2, 7, 9]);
    expectAlternation(s);
  });

  it('scénario 7 : un sujet à 6 questions, déficit comblé d’abord par les autres sujets', () => {
    const small = bankFromDataset(filtered((id) => !id.startsWith('t00-') || Number(id.slice(5)) < 6));
    const s = selectQuestions(small, 'full', ['t00', 't01', 't02']);
    expect(s.items).toHaveLength(100);
    const second = s.items.filter((i) => i.pass === 2);
    expect(second.length).toBeGreaterThan(0);
    // Les sujets sont épuisés avant de puiser dans le reste de la banque (FR-023).
    const chosen = new Set(s.items.map((i) => i.question.id));
    for (const q of small.questions) if (q.themeIndices.some((t) => t <= 2)) expect(chosen.has(q.id)).toBe(true);
    expect(second.some((i) => !i.question.themeIndices.some((t) => t <= 2))).toBe(true);
    expectAlternation(s);
  });

  it('scénario 8 : une question à deux thèmes crédite aussi le quota du second', () => {
    const s = selectQuestions(bank, 'full', ['t00', 't01', 't02']);
    const q = s.items.find((i) => i.question.id === 't02-q00')!;
    expect(q.anchorThemeIndex).toBe(2);
    expect(q.question.themeIndices).toEqual([2, 3]);
    const first = s.items.filter((i) => i.pass === 1);
    expect(first.filter((i) => i.question.themeIndices.includes(3))).toHaveLength(s.quotas[3]!);
    expect(first.filter((i) => i.anchorThemeIndex === 3).length).toBeLessThan(s.quotas[3]!);
  });

  it('banque de 96 questions : toutes retenues en mode complet', () => {
    const s = selectQuestions(syntheticBank({ perTheme: 6 }), 'full', ['t00', 't01', 't02']);
    expect(s.items).toHaveLength(96);
    expect(new Set(s.items.map((i) => i.question.id)).size).toBe(96);
  });

  it('banque à 24 thèmes acceptée en mode complet', () => {
    expect(selectQuestions(syntheticBank({ themes: 24 }), 'full', ['t00', 't10', 't23']).items).toHaveLength(100);
  });

  it.each([[['t00', 't01']], [['t00', 't01', 't02', 't03', 't04', 't05']]])('StateError pour %j', (ids) => {
    expect(() => selectQuestions(bank, 'full', ids)).toThrow(StateError);
  });

  it('StateError pour un mode inconnu', () => {
    expect(() => selectQuestions(bank, 'moyen' as never, ['t00', 't01', 't02'])).toThrow(StateError);
  });
});
