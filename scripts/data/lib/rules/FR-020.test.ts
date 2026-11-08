// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { FR_020 } from './FR-020';
import { ids, minimalContext } from './testing';

describe('FR-020', () => {
  it('fixture minimale conforme', () => expect(ids(FR_020, minimalContext())).toEqual([]));
  it('contestée à une source', () => {
    const ctx = minimalContext();
    ctx.corpus.positions.get('dupont')!.find((p) => p.status === 'contested')!.sources = ['dupont-programme-2027'];
    expect(ids(FR_020, ctx)).toEqual(['dupont/sante-q01']);
  });
});
