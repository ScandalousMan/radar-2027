// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { ID_UNIQUE } from './ID-UNIQUE';
import { ids, minimalContext, questionsOf } from './testing';

describe('ID-UNIQUE', () => {
  it('fixture minimale conforme', () => expect(ids(ID_UNIQUE, minimalContext())).toEqual([]));
  it('question dupliquée entre deux fichiers', () => {
    const ctx = minimalContext();
    questionsOf(ctx, 'sante').push({ ...questionsOf(ctx, 'economie')[0]! });
    expect(ids(ID_UNIQUE, ctx)).toEqual(['economie-q01']);
  });
  it('critère de gouvernance dupliqué', () => {
    const ctx = minimalContext();
    ctx.corpus.governance!.inclusionCriteria.push({ ...ctx.corpus.governance!.inclusionCriteria[0]! });
    expect(ids(ID_UNIQUE, ctx)).toEqual(['declaration-publique-personnelle']);
  });
});
