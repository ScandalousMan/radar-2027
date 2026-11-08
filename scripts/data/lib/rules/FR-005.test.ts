// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { FR_005 } from './FR-005';
import { ids, minimalContext } from './testing';

describe('FR-005', () => {
  it('fixture minimale conforme', () => expect(ids(FR_005, minimalContext())).toEqual([]));
  it('critère inconnu', () => {
    const ctx = minimalContext();
    ctx.corpus.candidates[0]!.history[0]!.criterion = 'critere-invente';
    expect(ids(FR_005, ctx)).toEqual(['dupont']);
  });
  it('critère de retrait pour un candidat déclaré', () => {
    const ctx = minimalContext();
    ctx.corpus.candidates[1]!.statusCriterion = 'renoncement-public';
    expect(ids(FR_005, ctx)).toEqual(['martin']);
  });
});
