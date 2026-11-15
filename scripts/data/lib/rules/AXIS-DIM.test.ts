// @vitest-environment node
import { describe, expect, it } from 'vitest';
import type { Question, Theme } from '../schema';
import { bankFromCorpus } from '../bank';
import { AXIS_DIM, maxPriorityQuota } from './AXIS-DIM';
import { ids, minimalContext, questionsOf } from './testing';
import type { RuleContext } from './types';

const DIMS: Theme['dimensions'] = [
  { id: 'choix', label: 'Choix', negative: 'Choix des familles', positive: 'École commune' },
  { id: 'moyens', label: 'Moyens', negative: 'Dépense maîtrisée', positive: 'Moyens accrus' },
];

/** Ajoute des thèmes actifs vides jusqu'à `total` thèmes (banque réaliste : 18). */
function padThemes(ctx: RuleContext, total: number) {
  for (let i = ctx.corpus.themes.length; i < total; i++)
    ctx.corpus.themes.push({ id: `vide-${i}`, label: `Vide ${i}`, description: '', axis: { negative: 'a', positive: 'b' }, order: 100 + i, status: 'active' });
}

/** Ajoute `n` questions actives au thème, réparties par dimension. */
function addQuestions(ctx: RuleContext, theme: string, dims: string[]) {
  const qs = questionsOf(ctx, theme);
  const base = qs[0]!;
  dims.forEach((d, i) => qs.push({ ...base, id: `${theme}-extra-${i}`, dimension: d } as Question));
}

/** Contexte conforme : `economie` à 2 dimensions, 13 questions actives (7 choix, 6 moyens), 18 thèmes. */
function conformingContext(): RuleContext {
  const ctx = minimalContext({ cache: false });
  ctx.corpus.themes.find((t) => t.id === 'economie')!.dimensions = DIMS;
  questionsOf(ctx, 'economie').forEach((q, i) => (q.dimension = i % 2 === 0 ? 'choix' : 'moyens'));
  addQuestions(ctx, 'economie', ['choix', 'choix', 'moyens']);
  padThemes(ctx, 18);
  return ctx;
}

describe('AXIS-DIM', () => {
  it('corpus sans thème à dimensions : rien (non-régression)', () => {
    expect(AXIS_DIM.run(minimalContext({ cache: false }))).toEqual([]);
  });

  it('corpus conforme à dimensions : rien', () => {
    expect(AXIS_DIM.run(conformingContext())).toEqual([]);
  });

  it('cas 1 : dimension sans dimensions déclarées', () => {
    const ctx = minimalContext({ cache: false });
    const q = questionsOf(ctx, 'sante')[0]!;
    q.status = 'draft';
    q.dimension = 'choix';
    const [v] = AXIS_DIM.run(ctx);
    expect(v).toMatchObject({ severity: 'error', entity: { kind: 'question', id: q.id } });
    expect(v?.message).toBe(`${q.id} : dimension « choix » sans dimensions déclarées sur sante`);
  });

  it('cas 2 : dimension inconnue', () => {
    const ctx = conformingContext();
    const q = questionsOf(ctx, 'economie')[0]!;
    q.dimension = 'pedagogie';
    const vs = AXIS_DIM.run(ctx).filter((v) => v.entity.kind === 'question');
    expect(vs.map((v) => v.message)).toEqual([`${q.id} : dimension « pedagogie » inconnue de economie (attendu : choix, moyens)`]);
  });

  it('cas 3 : question active sans dimension ; brouillon sans dimension accepté', () => {
    const ctx = conformingContext();
    const qs = questionsOf(ctx, 'economie');
    delete qs[0]!.dimension;
    qs[1]!.status = 'draft';
    delete qs[1]!.dimension;
    const vs = AXIS_DIM.run(ctx).filter((v) => v.entity.kind === 'question');
    expect(vs).toHaveLength(1);
    expect(vs[0]).toMatchObject({ entity: { kind: 'question', id: qs[0]!.id }, message: `${qs[0]!.id} : dimension manquante (attendu : choix, moyens)` });
  });

  it('cas 4 : dimension avec moins de 3 questions actives', () => {
    const ctx = conformingContext();
    const qs = questionsOf(ctx, 'economie').filter((q) => q.dimension === 'moyens');
    for (const q of qs.slice(2)) q.dimension = 'choix';
    const vs = AXIS_DIM.run(ctx);
    expect(vs).toHaveLength(1);
    expect(vs[0]).toMatchObject({ entity: { kind: 'theme', id: 'economie' }, message: 'economie : dimension moyens : 2 questions actives, minimum 3' });
  });

  it('cas 5 : thème sous le quota maximal d’un thème prioritaire', () => {
    const ctx = conformingContext();
    questionsOf(ctx, 'economie').find((q) => q.dimension === 'choix')!.status = 'draft';
    const vs = AXIS_DIM.run(ctx);
    expect(vs).toHaveLength(1);
    expect(vs[0]).toMatchObject({
      entity: { kind: 'theme', id: 'economie' },
      message: "economie : 12 questions actives, minimum 13 (quota maximal d'un thème prioritaire en mode complet, 18 thèmes)",
    });
  });

  it('thème à dimensions sans question active : ni cas 4 ni cas 5', () => {
    const ctx = conformingContext();
    for (const q of questionsOf(ctx, 'economie')) q.status = 'draft';
    expect(AXIS_DIM.run(ctx)).toEqual([]);
  });

  it('maxPriorityQuota vaut 13 pour 18 thèmes et ≈ 310 questions', () => {
    const ctx = minimalContext({ cache: false });
    padThemes(ctx, 18);
    for (const t of ctx.corpus.themes.slice(3)) {
      const base = questionsOf(ctx, 'economie')[0]!;
      ctx.corpus.questions.set(
        t.id,
        Array.from({ length: 17 }, (_, i) => ({ ...base, id: `${t.id}-q${i}`, themes: [t.id] })),
      );
    }
    const bank = bankFromCorpus(ctx.corpus);
    expect(bank.themes).toHaveLength(18);
    expect(bank.questions.length).toBeGreaterThan(280);
    for (let t = 0; t < 18; t++) expect(maxPriorityQuota(bank, t)).toBe(13);
  });

  it('désigne les thèmes et questions fautifs par leur identifiant', () => {
    const ctx = conformingContext();
    delete questionsOf(ctx, 'economie')[0]!.dimension;
    expect(ids(AXIS_DIM, ctx)).toEqual(['economie-q01']);
  });
});
