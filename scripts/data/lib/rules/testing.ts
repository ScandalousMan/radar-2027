// Aide aux tests des règles : contexte frais construit sur la fixture minimale.
import { join } from 'node:path';
import { openCache } from '../cache';
import { loadCorpus } from '../corpus';
import { loadResearch } from '../research';
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

/** Contexte de la fixture minimale complété de son corpus de preuves (`minimal/recherche/`). */
export function researchContext(options: { cache?: boolean } = {}): RuleContext & { research: NonNullable<RuleContext['research']> } {
  const ctx = minimalContext(options);
  const { research, violations } = loadResearch(join(MINIMAL_DIR, 'recherche'));
  if (violations.length > 0) throw new Error(`recherche de la fixture minimale invalide : ${JSON.stringify(violations)}`);
  return { ...ctx, research };
}

/** Preuve de la fixture minimale (mutable par le test). */
export function evidenceOf(ctx: RuleContext, id: string) {
  for (const list of ctx.research?.evidence.values() ?? []) {
    const found = list.find((e) => e.id === id);
    if (found) return found;
  }
  throw new Error(`preuve ${id} absente`);
}

/** Personnalité de la fixture minimale (mutable par le test). */
export function personalityOf(ctx: RuleContext, id: string) {
  const found = ctx.research?.personalities.find((p) => p.id === id);
  if (!found) throw new Error(`personnalité ${id} absente`);
  return found;
}

/** Journal unique de la fixture minimale (mutable par le test). */
export const FIXTURE_JOURNAL = '2026-11-22-fixture-minimale';
export function journalOf(ctx: RuleContext, id: string = FIXTURE_JOURNAL) {
  const found = ctx.research?.journals.get(id);
  if (!found) throw new Error(`journal ${id} absent`);
  return found;
}
