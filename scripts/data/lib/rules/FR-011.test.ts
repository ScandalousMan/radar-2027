// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { minimalMainDataset } from '@/core/dataset/fixture';
import { FR_011 } from './FR-011';
import { ids, minimalContext, questionsOf } from './testing';

function withPublished() {
  const ctx = minimalContext();
  const current = minimalMainDataset();
  current.questions = [{ id: 'economie-q01', text: 'Énoncé de test numéro 1 du thème Économie.', themes: ['economie'], polarity: '+', discriminant: 0 }];
  current.positions = { dupont: [null], martin: [null] };
  ctx.published = { registry: { current: 1, versions: [] }, current, files: new Map() };
  return ctx;
}

describe('FR-011', () => {
  it('sans version publiée : sans effet', () => expect(ids(FR_011, minimalContext())).toEqual([]));
  it('texte identique ou corrigé typographiquement', () => {
    const ctx = withPublished();
    expect(ids(FR_011, ctx)).toEqual([]);
    questionsOf(ctx, 'economie')[0]!.text = 'Enoncé de test numéro 1 du thème Économie !';
    expect(ids(FR_011, ctx)).toEqual([]);
  });
  it('mot changé', () => {
    const ctx = withPublished();
    questionsOf(ctx, 'economie')[0]!.text = 'Énoncé de test numéro 2 du thème Économie.';
    expect(ids(FR_011, ctx)).toEqual(['economie-q01']);
  });
  it('question publiée supprimée', () => {
    const ctx = withPublished();
    questionsOf(ctx, 'economie').shift();
    expect(ids(FR_011, ctx)).toEqual(['economie-q01']);
  });
});
