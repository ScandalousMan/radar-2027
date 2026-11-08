// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { FR_019 } from './FR-019';
import { ids, minimalContext } from './testing';

describe('FR-019', () => {
  it('fixture minimale conforme', () => expect(ids(FR_019, minimalContext())).toEqual([]));
  it('valeur modifiée après relecture', () => {
    const ctx = minimalContext();
    ctx.corpus.positions.get('martin')![0]!.value = 1;
    const [v] = FR_019.run(ctx);
    expect(v?.entity.id).toBe('martin/environnement-q01');
    expect(v?.message).toBe('modifiée depuis la relecture : repasser en draft');
  });
  it('relue sans empreinte', () => {
    const ctx = minimalContext();
    delete ctx.corpus.positions.get('martin')![0]!.reviewedHash;
    expect(ids(FR_019, ctx)).toEqual(['martin/environnement-q01']);
  });
});
