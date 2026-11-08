// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { syntheticDataset } from '@/core/bank/fixtures';
import { questionnaireBankFrom, selectionsFor, themesOf } from './bank-view';
import { PRIORITIES } from './fixtures';

const main = syntheticDataset({ themes: 16, perTheme: 20 });
const bank = questionnaireBankFrom(main);

describe('bank-view', () => {
  it('projette 16 thèmes avec libellé, description et index canonique', () => {
    expect(bank.themes).toHaveLength(16);
    bank.themes.forEach((t, i) => {
      expect(t.index).toBe(i);
      expect(t.id).toBe(main.themes[i]!.id);
      expect(t.label).toBe(main.themes[i]!.label);
      expect(t.description).toBe(main.themes[i]!.description);
    });
    expect(bank.version).toBe(main.version);
    expect(bank.bank.version).toBe(main.version);
    expect(bank.publishedAt).toBe(main.publishedAt);
  });

  it('selectionsFor renvoie 100 et 25 questions pour 4 sujets', () => {
    const s = selectionsFor(bank, PRIORITIES);
    expect(s.full.items).toHaveLength(100);
    expect(s.short.items).toHaveLength(25);
    expect(s.full.mode).toBe('full');
    expect(s.short.mode).toBe('short');
  });

  it('themesOf renvoie 1 ou 2 thèmes et marque exactement les sujets clés', () => {
    for (const item of selectionsFor(bank, PRIORITIES).full.items) {
      const themes = themesOf(bank, item.question, PRIORITIES);
      expect(themes.length).toBeGreaterThanOrEqual(1);
      expect(themes.length).toBeLessThanOrEqual(2);
      for (const t of themes) expect(t.priority).toBe((PRIORITIES as readonly string[]).includes(t.id));
    }
    const twoThemes = bank.bank.questions.find((q) => q.themeIndices.length === 2)!;
    expect(themesOf(bank, twoThemes, [])).toHaveLength(2);
  });
});
