// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { FR_004 } from './FR-004';
import { ids, minimalContext } from './testing';

describe('FR-004', () => {
  it('fixture minimale conforme', () => expect(ids(FR_004, minimalContext())).toEqual([]));
  it('candidat sans statusSource', () => {
    const ctx = minimalContext();
    delete ctx.corpus.candidates[0]!.statusSource;
    expect(ids(FR_004, ctx)).toEqual(['dupont']);
  });
  it('historique incohérent et étiquette vide', () => {
    const ctx = minimalContext();
    const c = ctx.corpus.candidates[1]!;
    c.party = ' ';
    c.status = 'withdrawn';
    expect(ids(FR_004, ctx)).toEqual(['martin', 'martin']);
    c.history = [];
    expect(ids(FR_004, ctx)).toContain('martin');
  });
});
