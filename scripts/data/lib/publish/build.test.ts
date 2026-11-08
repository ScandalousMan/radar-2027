// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { minimalContext } from '../rules/testing';
import { buildDetail, buildMain, serialize } from './build';

const opts = (ctx: ReturnType<typeof minimalContext>) => ({ version: 1, publishedAt: '2026-11-10', cache: ctx.cache! });

describe('buildMain (US3 scénario 1, FR-036 à FR-038)', () => {
  it('publie la relue, jamais le brouillon ni la contestée ni l’inconnue', () => {
    const ctx = minimalContext();
    const main = buildMain(ctx.corpus, opts(ctx));
    const idx = (id: string) => main.questions.findIndex((q) => q.id === id);
    expect(main.positions.dupont![idx('economie-q01')]).toEqual([1, 'p']);
    expect(main.positions.dupont![idx('economie-q02')]).toEqual([-1, 'p']);
    expect(main.positions.dupont![idx('economie-q03')]).toBeNull(); // draft +2
    expect(main.positions.dupont![idx('sante-q01')]).toBeNull(); // contested
    expect(main.positions.dupont![idx('sante-q02')]).toBeNull(); // unknown
    expect(main.positions.martin![idx('environnement-q01')]).toEqual([2, 'd']);
    expect(main.candidates.map((c) => [c.id, c.coverage])).toEqual([
      ['dupont', 0.067],
      ['martin', 0.033],
    ]);
    expect(main.questions.map((q) => q.id)).toEqual([...main.questions.map((q) => q.id)].sort());
    expect(main.themes.map((t) => t.order)).toEqual([0, 1, 2]);
  });

  it('aucun contributeur, citation ni justification dans main', () => {
    const ctx = minimalContext();
    const text = serialize(buildMain(ctx.corpus, opts(ctx)));
    for (const forbidden of ['author', 'reviewer', 'quote', 'justification', 'adrien', 'relecteur-1', 'thresholds']) expect(text).not.toContain(forbidden);
  });

  it('candidat retiré : absent des candidats, présent dans withdrawn ; candidat sans position : couverture 0', () => {
    const ctx = minimalContext();
    const dupont = ctx.corpus.candidates[0]!;
    dupont.status = 'withdrawn';
    dupont.statusChangedAt = '2026-11-09';
    dupont.statusCriterion = 'renoncement-public';
    ctx.corpus.positions.delete('martin');
    const main = buildMain(ctx.corpus, opts(ctx));
    expect(main.candidates.map((c) => c.id)).toEqual(['martin']);
    expect(main.candidates[0]!.coverage).toBe(0);
    expect(main.withdrawn).toEqual([{ id: 'dupont', name: 'Jeanne Dupont', withdrawnAt: '2026-11-09', criterion: 'renoncement-public' }]);
    expect(Object.keys(main.positions)).toEqual(['martin']);
  });
});

describe('buildDetail', () => {
  it('positions connues seulement, sources dédupliquées', () => {
    const ctx = minimalContext();
    const detail = buildDetail(ctx.corpus, 'dupont', opts(ctx));
    expect(Object.keys(detail.positions)).toEqual(['economie-q01', 'economie-q02']);
    expect(Object.keys(detail.sources)).toEqual(['dupont-programme-2027']);
    expect(detail.positions['economie-q01']).toMatchObject({ value: 1, level: 'p', quoteSource: 'dupont-programme-2027' });
    expect(serialize(detail)).not.toContain('adrien');
  });
});
