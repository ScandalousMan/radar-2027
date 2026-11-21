// @vitest-environment node
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { loadCorpus } from '../corpus';
import { DEFAULT_THRESHOLDS } from '../schema';
import { SUBJECT } from './SUBJECT';
import { minimalContext, questionsOf } from './testing';
import type { RuleContext } from './types';

/** Contexte conforme : chaque question active porte un enjeu propre. */
function labelled(): RuleContext {
  const ctx = minimalContext({ cache: false });
  for (const qs of ctx.corpus.questions.values()) qs.forEach((q) => (q.subject = `enjeu-${q.id}`));
  return ctx;
}

const errors = (ctx: RuleContext) => SUBJECT.run(ctx).filter((v) => v.severity === 'error');
const warnings = (ctx: RuleContext) => SUBJECT.run(ctx).filter((v) => v.severity === 'warning');

describe('SUBJECT', () => {
  it('corpus étiqueté : aucune erreur', () => {
    expect(errors(labelled())).toEqual([]);
  });

  it('erreur : question active sans enjeu, brouillon accepté', () => {
    const ctx = labelled();
    const qs = questionsOf(ctx, 'sante');
    delete qs[0]!.subject;
    qs[1]!.status = 'draft';
    delete qs[1]!.subject;
    const vs = errors(ctx);
    expect(vs).toHaveLength(1);
    expect(vs[0]).toMatchObject({ rule: 'SUBJECT', entity: { kind: 'question', id: qs[0]!.id }, message: `${qs[0]!.id} : enjeu manquant (champ subject)` });
  });

  it('avertissement informatif par enjeu partagé', () => {
    const ctx = labelled();
    const [a, b] = questionsOf(ctx, 'sante');
    b!.subject = a!.subject;
    const shared = warnings(ctx).filter((w) => w.entity.kind === 'bank');
    expect(shared).toHaveLength(1);
    expect(shared[0]).toMatchObject({ entity: { id: a!.subject }, message: `enjeu ${a!.subject} partagé par 2 questions : ${a!.id}, ${b!.id}` });
  });

  it('avertissement : thème avec moins d’enjeux distincts que le quota maximal', () => {
    const ctx = labelled();
    const w = warnings(ctx).filter((x) => x.entity.kind === 'theme');
    expect(w.length).toBeGreaterThan(0);
    expect(w[0]!.message).toMatch(/enjeux distincts, quota maximal \d+/);
  });

  it('fixture de violation : toutes les questions actives sans enjeu', () => {
    const { corpus, violations } = loadCorpus(join(process.cwd(), 'data', 'fixtures', 'violations', 'SUBJECT', 'corpus'));
    expect(violations).toEqual([]);
    const vs = errors({ corpus, thresholds: corpus.governance?.thresholds ?? DEFAULT_THRESHOLDS });
    expect(vs.length).toBeGreaterThan(0);
    expect(vs.every((v) => v.entity.kind === 'question')).toBe(true);
  });
});
