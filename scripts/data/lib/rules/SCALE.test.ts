// @vitest-environment node
import { describe, expect, it } from 'vitest';
import type { Position } from '../schema';
import { SCALE } from './SCALE';
import { ids, minimalContext } from './testing';

describe('SCALE', () => {
  it('fixture minimale conforme', () => expect(ids(SCALE, minimalContext())).toEqual([]));
  it('valeur hors échelle', () => {
    const ctx = minimalContext();
    ctx.corpus.positions.get('martin')![0]!.value = 3 as Position['value'];
    expect(ids(SCALE, ctx)).toEqual(['martin/environnement-q01']);
  });
});
