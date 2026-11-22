// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { minimalContext } from '../rules/testing';
import { bankFromDataset } from '@/core';
import { MainDatasetSchema } from '@/core/dataset';
import { buildDetail, buildMain, serialize } from './build';

const opts = (ctx: ReturnType<typeof minimalContext>) => ({ version: 1, publishedAt: '2026-11-10', cache: ctx.cache! });

describe('buildMain (US3 scénario 1, FR-036 à FR-038)', () => {
  it('publie la relue, jamais le brouillon ni la contestée ni l’inconnue', () => {
    const ctx = minimalContext();
    const main = buildMain(ctx.corpus, opts(ctx));
    const idx = (id: string) => main.questions.findIndex((q) => q.id === id);
    // Case d'une question hors banque active : absente, donc jamais publiée.
    const cell = (c: string, id: string) => (idx(id) < 0 ? null : main.positions[c]![idx(id)]);
    expect(cell('dupont', 'economie-q01')).toEqual([1, 'p']);
    expect(cell('dupont', 'economie-q02')).toEqual([-1, 'p']);
    expect(cell('dupont', 'economie-q03')).toBeNull(); // draft +2
    expect(cell('dupont', 'sante-q01')).toBeNull(); // contested
    expect(cell('dupont', 'sante-q02')).toBeNull(); // unknown
    expect(cell('martin', 'environnement-q01')).toEqual([2, 'd']);
    // 009 : banque active de 9 questions (k = 1, trois thèmes complétés à 3 enjeux).
    expect(main.questions).toHaveLength(9);
    expect(main.candidates.map((c) => [c.id, c.coverage])).toEqual([
      ['dupont', 0.222],
      ['martin', 0.111],
    ]);
    expect(main.questions.map((q) => q.id)).toEqual([...main.questions.map((q) => q.id)].sort());
    expect(main.themes.map((t) => t.order)).toEqual([0, 1, 2]);
  });

  it('009 : forme règles 3, enjeu et couverture sur chaque question', () => {
    const ctx = minimalContext();
    const main = buildMain(ctx.corpus, opts(ctx));
    expect(main.selectionRules).toBe(3);
    expect(main.minQuestionCoverage).toBe(1);
    expect(main.questions.find((q) => q.id === 'economie-q01')!.coverage).toBe(1);
    expect(main.questions.every((q) => Number.isInteger(q.coverage))).toBe(true);
    expect(main.questions.every((q) => typeof q.subject === 'string' && q.subject.length > 0)).toBe(true);
    expect(main.questions.find((q) => q.id === 'economie-q01')!.subject).toBe('enjeu-economie-q01');
    expect(Object.keys(main).slice(0, 3)).toEqual(['version', 'publishedAt', 'selectionRules']);
  });

  it('007 : refuse une question active sans enjeu', () => {
    const ctx = minimalContext();
    delete ctx.corpus.questions.get('economie')![0]!.subject;
    expect(() => buildMain(ctx.corpus, opts(ctx))).toThrow(/enjeu manquant/);
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

describe('buildMain, banque active (009 US2)', () => {
  it('le jeu produit passe MainDatasetSchema et bankFromDataset', () => {
    const ctx = minimalContext();
    const main = buildMain(ctx.corpus, opts(ctx));
    expect(MainDatasetSchema.safeParse(main).error).toBeUndefined();
    const bank = bankFromDataset(main);
    expect(bank.selectionRules).toBe(3);
    expect(bank.questions.map((q) => q.coverage)).toEqual(main.questions.map((q) => q.coverage));
  });

  it('--min-coverage plus petit que le minimum : refusé ; banque active fournie : réutilisée', () => {
    const ctx = minimalContext();
    expect(() => buildMain(ctx.corpus, { ...opts(ctx), minCoverage: 0 })).toThrow(/min-coverage/);
    const strict = buildMain(ctx.corpus, { ...opts(ctx), minCoverage: 2 });
    expect(strict.minQuestionCoverage).toBe(2);
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
