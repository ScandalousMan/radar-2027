// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { FR_013 } from './FR-013';
import { ids, minimalContext } from './testing';

describe('FR-013', () => {
  it('fixture minimale conforme', () => expect(ids(FR_013, minimalContext())).toEqual([]));
  it('deux sources de même adresse', () => {
    const ctx = minimalContext();
    ctx.corpus.sources.get('martin')![0]!.url = 'https://exemple.fr/dupont/programme-2027';
    expect(ids(FR_013, ctx)).toEqual(['martin-declaration-candidature']);
  });
  it('consultée avant publication ; sans candidat', () => {
    const ctx = minimalContext();
    const s = ctx.corpus.sources.get('dupont')![0]!;
    s.accessedAt = '2026-09-30';
    s.candidates = [];
    expect(ids(FR_013, ctx)).toEqual(['dupont-programme-2027', 'dupont-programme-2027']);
  });
});
