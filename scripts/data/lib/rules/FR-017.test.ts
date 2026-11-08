// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { FR_017 } from './FR-017';
import { ids, minimalContext } from './testing';

const first = (ctx: ReturnType<typeof minimalContext>) => ctx.corpus.positions.get('martin')![0]!;

describe('FR-017', () => {
  it('fixture minimale conforme', () => expect(ids(FR_017, minimalContext())).toEqual([]));
  it('valeur connue sans source', () => {
    const ctx = minimalContext();
    first(ctx).sources = [];
    expect(ids(FR_017, ctx)).toContain('martin/environnement-q01');
  });
  it('citation introuvable', () => {
    const ctx = minimalContext();
    first(ctx).quote = 'Je veux autoriser tous les vols intérieurs.';
    const [v] = FR_017.run(ctx);
    expect(v?.message).toMatch(/citation introuvable/);
  });
  it('niveau surévalué', () => {
    const ctx = minimalContext();
    first(ctx).evidence = 'programme';
    expect(FR_017.run(ctx)[0]?.message).toMatch(/surévalué/);
  });
  it('citation trop longue, justification absente', () => {
    const ctx = minimalContext();
    first(ctx).justification = ' ';
    first(ctx).quote = 'x'.repeat(301);
    expect(ids(FR_017, ctx).length).toBeGreaterThanOrEqual(2);
  });
  it('sans cache : pas de vérification de citation ni d’avertissement par position', () => {
    const ctx = minimalContext({ cache: false });
    first(ctx).quote = 'Citation inventée.';
    expect(FR_017.run(ctx)).toEqual([]);
  });
});
