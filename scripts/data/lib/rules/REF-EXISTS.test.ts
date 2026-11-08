// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { REF_EXISTS } from './REF-EXISTS';
import { ids, minimalContext, questionsOf } from './testing';

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
});
