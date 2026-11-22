// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { REF_EXISTS } from './REF-EXISTS';
import { ids, minimalContext, questionsOf, researchContext } from './testing';

describe('REF-EXISTS', () => {
  it('fixture minimale conforme', () => expect(ids(REF_EXISTS, minimalContext())).toEqual([]));
  it('thème inconnu sur une question', () => {
    const ctx = minimalContext();
    questionsOf(ctx, 'sante')[1]!.themes = ['sante', 'inconnu'];
    expect(ids(REF_EXISTS, ctx)).toEqual(['sante-q02']);
  });
  it('source, relecteur et candidat inconnus', () => {
    const ctx = minimalContext();
    const p = ctx.corpus.positions.get('martin')![0]!;
    p.sources = ['absente'];
    p.reviewer = 'fantome';
    ctx.corpus.positions.set('inconnu', []);
    expect(ids(REF_EXISTS, ctx).sort()).toEqual(['inconnu', 'martin/environnement-q01', 'martin/environnement-q01']);
  });
  it('source visant une personnalité du registre de recherche acceptée (spec 008, R4)', () => {
    const ctx = researchContext();
    ctx.corpus.sources.get('dupont')![0]!.candidates = ['jean-exemple'];
    expect(ids(REF_EXISTS, ctx)).toEqual([]);
  });
  it('source visant une personnalité inconnue des deux registres refusée', () => {
    const ctx = researchContext();
    ctx.corpus.sources.get('dupont')![0]!.candidates = ['inconnue'];
    expect(ids(REF_EXISTS, ctx)).toEqual(['dupont-programme-2027']);
  });
  it('position d’une personnalité hors liste refusée même si elle est suivie', () => {
    const ctx = researchContext();
    ctx.corpus.positions.set('jean-exemple', []);
    expect(ids(REF_EXISTS, ctx)).toEqual(['jean-exemple']);
  });
});
