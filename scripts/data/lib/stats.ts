// Statistiques du rapport de validation (FR-035) : effectifs par thème et polarité, banque.
import { allQuestions } from './corpus';
import type { Stats, ThemeStat } from './report';
import type { RuleContext } from './rules/types';
import type { Corpus } from './schema';

export function themeStats(corpus: Corpus): ThemeStat[] {
  const questions = allQuestions(corpus).map(({ question }) => question);
  return [...corpus.themes]
    .sort((a, b) => a.order - b.order)
    .map((t) => {
      const own = questions.filter((q) => q.themes[0] === t.id);
      const active = own.filter((q) => q.status === 'active');
      const plus = active.filter((q) => q.polarity === '+').length;
      const minus = active.length - plus;
      return {
        id: t.id,
        order: t.order,
        status: t.status,
        active: active.length,
        plus,
        minus,
        plusShare: active.length ? plus / active.length : 0,
        minusShare: active.length ? minus / active.length : 0,
        draft: own.filter((q) => q.status === 'draft').length,
        retired: own.filter((q) => q.status === 'retired').length,
      };
    });
}

export function bankStats(corpus: Corpus, thresholds: RuleContext['thresholds']): NonNullable<Stats['bank']> {
  const questions = allQuestions(corpus).map(({ question }) => question);
  const count = (s: string) => questions.filter((q) => q.status === s).length;
  return { active: count('active'), draft: count('draft'), retired: count('retired'), targetMin: thresholds.bankMin, targetMax: thresholds.bankMax };
}

/** Toutes les sections de statistiques disponibles pour un contexte. */
export function computeStats(ctx: RuleContext): Stats {
  return { themes: themeStats(ctx.corpus), bank: bankStats(ctx.corpus, ctx.thresholds) };
}
