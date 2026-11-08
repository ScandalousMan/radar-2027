// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { FR_018 } from './FR-018';
import { ids, minimalContext } from './testing';

describe('FR-018', () => {
  it('fixture minimale conforme', () => expect(ids(FR_018, minimalContext())).toEqual([]));
  it('auto-relecture', () => {
    const ctx = minimalContext();
    ctx.corpus.positions.get('martin')![0]!.reviewer = 'adrien';
    expect(ids(FR_018, ctx)).toEqual(['martin/environnement-q01']);
  });
  it('extraction marquée relue sans data:review', () => {
    const ctx = minimalContext();
    const p = ctx.corpus.positions.get('martin')![0]!;
    p.provenance = { kind: 'extraction', run: 'r', affirmation: '0123456789abcdef', model: 'm' };
    delete p.reviewedHash;
    expect(ids(FR_018, ctx)).toEqual(['martin/environnement-q01']);
  });
});
