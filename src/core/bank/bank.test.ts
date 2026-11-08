// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { minimalMainDataset } from '../dataset/fixture';
import type { MainDataset } from '../dataset';
import { StateError } from '../types';
import { BankError, bankFromDataset, normalizePriorities } from './bank';
import { bankPair, syntheticBank } from './fixtures';

function codeOf(fn: () => unknown): string | undefined {
  try {
    fn();
  } catch (e) {
    return (e as BankError | StateError).code;
  }
  return undefined;
}

describe('bankFromDataset', () => {
  it('construit la vue d’un jeu minimal', () => {
    const bank = bankFromDataset(minimalMainDataset());
    expect(bank.version).toBe(1);
    expect(bank.themes.map((t) => [t.id, t.index])).toEqual([
      ['economie', 0],
      ['sante', 1],
    ]);
    expect(bank.themeIndexById.get('sante')).toBe(1);
    expect(bank.questionById.get('sante-b')?.themeIndices).toEqual([1, 0]);
    expect(bank.questionById.get('sante-b')?.index).toBe(1);
    expect(bank.positions.get('dupont')).toEqual([[-1, 'p'], null]);
    expect(bank.candidates.map((c) => c.id)).toEqual(['dupont', 'martin']);
  });

  const mutate = (f: (ds: MainDataset) => void) => {
    const ds = minimalMainDataset();
    f(ds);
    return () => bankFromDataset(ds);
  };

  it('refuse un jeu à 25 thèmes', () => {
    expect(
      codeOf(
        mutate((ds) => {
          ds.themes = Array.from({ length: 25 }, (_, i) => ({ ...ds.themes[0]!, id: `t${i}`, order: i }));
        }),
      ),
    ).toBe('too-many-themes');
  });

  it('refuse un thème dupliqué, une référence inconnue, des positions désalignées', () => {
    expect(codeOf(mutate((ds) => ds.themes.push({ ...ds.themes[0]!, order: 2 })))).toBe('duplicate-theme');
    expect(codeOf(mutate((ds) => (ds.questions[0]!.themes = ['inconnu'])))).toBe('bad-theme-ref');
    expect(codeOf(mutate((ds) => (ds.questions[0]!.themes = ['economie', 'economie'])))).toBe('bad-theme-ref');
    expect(codeOf(mutate((ds) => (ds.positions['dupont'] = [null])))).toBe('misaligned-positions');
  });
});

describe('normalizePriorities', () => {
  const bank = syntheticBank();

  it('trie en ordre canonique', () => {
    expect(normalizePriorities(bank, ['t09', 't02', 't07'])).toEqual(['t02', 't07', 't09']);
  });

  it.each([[['t00', 't01']], [['t00', 't01', 't02', 't03', 't04', 't05']], [['t00', 't01', 'inconnu']], [['t00', 't01', 't01']]])('refuse %j', (ids) => {
    expect(codeOf(() => normalizePriorities(bank, ids))).toBe('bad-priorities');
  });
});

describe('banques fictives', () => {
  it('syntheticBank : 16 × 20, D_q décroissant, second thème une fois sur cinq', () => {
    const bank = syntheticBank();
    expect(bank.questions).toHaveLength(320);
    expect(bank.candidates).toHaveLength(22);
    const q = bank.questionById.get('t15-q05')!;
    expect(q.themeIndices).toEqual([15, 0]);
    expect(q.discriminant).toBeCloseTo(1.75);
    expect(bank.questions.map((x) => x.id)).toEqual([...bank.questions.map((x) => x.id)].sort());
  });

  it('bankPair : la version 2 diffère comme annoncé', () => {
    const { v1, v2 } = bankPair();
    expect(v2.version).toBe(2);
    expect(v1.questionById.has('t03-q07')).toBe(true);
    expect(v2.questionById.has('t03-q07')).toBe(false);
    expect(v2.questionById.has('t03-q20')).toBe(true);
    expect(v2.questions.map((x) => x.id)).toEqual([...v2.questions.map((x) => x.id)].sort());
    expect(v2.candidates.some((c) => c.id === 'c21')).toBe(false);
    const i1 = v1.questionById.get('t04-q02')!.index;
    const i2 = v2.questionById.get('t04-q02')!.index;
    expect(v1.positions.get('c05')![i1]).toEqual([-1, 'd']);
    expect(v2.positions.get('c05')![i2]).toEqual([2, 'p']);
    // Les autres cases sont inchangées.
    const j1 = v1.questionById.get('t10-q10')!.index;
    const j2 = v2.questionById.get('t10-q10')!.index;
    expect(v2.positions.get('c03')![j2]).toEqual(v1.positions.get('c03')![j1]);
  });
});
