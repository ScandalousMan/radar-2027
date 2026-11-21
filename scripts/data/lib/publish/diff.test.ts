// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { minimalMainDataset, minimalMainDatasetV2 } from '@/core/dataset/fixture';
import { diffAgainstCurrent } from './diff';

describe('diffAgainstCurrent', () => {
  it('première version', () => {
    expect(diffAgainstCurrent(minimalMainDataset(), null)).toEqual(['première version : aucune version publiée']);
  });
  it('identique hors numéro et date ⇒ null', () => {
    const b = { ...minimalMainDataset(), version: 2, publishedAt: '2026-12-01' };
    expect(diffAgainstCurrent(b, minimalMainDataset())).toBeNull();
  });
  it('liste questions, candidats et positions changés', () => {
    const b = minimalMainDataset();
    b.questions.push({ id: 'sante-c', text: 'C.', themes: ['sante'], polarity: '+', discriminant: 0 });
    b.positions.dupont = [[2, 'p'], null, null];
    b.positions.martin = [null, null, null];
    b.candidates.push({ id: 'zoe', name: 'Zoé', party: 'X', status: 'declared', coverage: 0 });
    b.positions.zoe = [null, null, null];
    expect(diffAgainstCurrent(b, minimalMainDataset())).toEqual(['questions ajoutées (1) : sante-c', 'candidats ajoutés : zoe', 'positions changées pour dupont : 1']);
  });
});

describe('diffAgainstCurrent : enjeux (007)', () => {
  it('l’ajout des enjeux et de selectionRules est un changement de contenu des questions', () => {
    const v2 = minimalMainDatasetV2();
    const lines = diffAgainstCurrent({ ...v2, questions: v2.questions.slice(0, 2), positions: minimalMainDataset().positions }, minimalMainDataset());
    expect(lines?.some((l) => l.startsWith('questions modifiées (2)'))).toBe(true);
  });
});
