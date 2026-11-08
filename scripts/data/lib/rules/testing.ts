// Aide aux tests des règles : contexte frais construit sur la fixture minimale.
import { join } from 'node:path';
import { openCache } from '../cache';
import { loadCorpus } from '../corpus';
import { DEFAULT_THRESHOLDS } from '../schema';
import type { Rule, RuleContext } from './types';

export const MINIMAL_DIR = join(process.cwd(), 'data', 'fixtures', 'minimal');

/** Corpus de la fixture minimale (nouvel objet à chaque appel, mutable par le test), cache inclus. */
export function minimalContext(options: { cache?: boolean } = {}): RuleContext {
  const { corpus, violations } = loadCorpus(join(MINIMAL_DIR, 'corpus'));
  if (violations.length > 0) throw new Error(`fixture minimale invalide : ${JSON.stringify(violations)}`);
  return {
    corpus,
    cache: options.cache === false ? undefined : openCache(join(MINIMAL_DIR, 'cache')),
    thresholds: corpus.governance?.thresholds ?? DEFAULT_THRESHOLDS,
  };
}

/** Identifiants des éléments désignés par une règle (violations et avertissements). */
export function ids(rule: Rule, ctx: RuleContext, severity: 'error' | 'warning' = 'error'): string[] {
  return rule
    .run(ctx)
    .filter((v) => v.severity === severity)
    .map((v) => v.entity.id);
}

export function questionsOf(ctx: RuleContext, theme: string) {
  const qs = ctx.corpus.questions.get(theme);
  if (!qs) throw new Error(`thème ${theme} absent`);
  return qs;
}
