// Statistiques du rapport de validation (FR-035) : effectifs par thème et polarité, banque.
import { coverage, discriminant, type ScaleValue } from '@/core/dataset';
import { allPositions, allQuestions, allSources } from './corpus';
import { isKnown, isScaleValue } from './positions';
import type { Distribution, Stats, ThemeStat } from './report';
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

export function positionStats(ctx: RuleContext): NonNullable<Stats['positions']> {
  const byStatus: Record<string, number> = {};
  const byEvidence: Record<string, number> = {};
  let unknown = 0;
  for (const { position: p } of allPositions(ctx.corpus)) {
    byStatus[p.status] = (byStatus[p.status] ?? 0) + 1;
    if (p.value === 'unknown') unknown++;
    else if (isKnown(p, ctx) && p.evidence) byEvidence[p.evidence] = (byEvidence[p.evidence] ?? 0) + 1;
  }
  return { byStatus, byEvidence, unknown };
}

/** Valeurs connues par question active et par candidat déclaré (base de la couverture et de D_q). */
export function knownMatrix(ctx: RuleContext) {
  const declared = ctx.corpus.candidates.filter((c) => c.status === 'declared').map((c) => c.id);
  const active = allQuestions(ctx.corpus)
    .map(({ question }) => question)
    .filter((q) => q.status === 'active');
  const activeIds = new Set(active.map((q) => q.id));
  const known = new Map<string, Map<string, ScaleValue>>(declared.map((c) => [c, new Map()]));
  for (const { candidate, position: p } of allPositions(ctx.corpus)) {
    const row = known.get(candidate);
    if (row && activeIds.has(p.question) && isScaleValue(p.value) && isKnown(p, ctx)) row.set(p.question, p.value);
  }
  return { declared, active, known };
}

function quantile(sorted: number[], q: number): number {
  if (sorted.length === 0) return 0;
  const pos = (sorted.length - 1) * q;
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  return sorted[lo]! + (sorted[hi]! - sorted[lo]!) * (pos - lo);
}

export function distribution(values: number[]): Distribution {
  const sorted = [...values].sort((a, b) => a - b);
  return {
    min: sorted[0] ?? 0,
    median: quantile(sorted, 0.5),
    max: sorted.at(-1) ?? 0,
    deciles: [1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => quantile(sorted, d / 10)),
  };
}

/** Couverture par candidat et par thème, distribution du pouvoir discriminant (FR-033, FR-034). */
export function coverageStats(ctx: RuleContext): Pick<Stats, 'coverageByCandidate' | 'coverageByTheme' | 'discriminant'> {
  const { declared, active, known } = knownMatrix(ctx);
  const coverageByCandidate = declared.map((id) => {
    const k = known.get(id)!.size;
    return { id, known: k, active: active.length, coverage: coverage(k, active.length) };
  });
  const coverageByTheme = [...ctx.corpus.themes]
    .filter((t) => t.status === 'active')
    .sort((a, b) => a.order - b.order)
    .map((t) => {
      const qs = active.filter((q) => q.themes[0] === t.id);
      const cells = qs.length * declared.length;
      const k = qs.reduce((sum, q) => sum + declared.filter((c) => known.get(c)!.has(q.id)).length, 0);
      return { id: t.id, known: k, cells, coverage: coverage(k, cells) };
    });
  const ds = active.map((q) => discriminant(declared.flatMap((c) => (known.get(c)!.has(q.id) ? [known.get(c)!.get(q.id)!] : [])), declared.length));
  return { coverageByCandidate, coverageByTheme, discriminant: { ...distribution(ds), questions: active.length } };
}

export function unreachableStats(ctx: RuleContext): NonNullable<Stats['unreachableSources']> {
  return allSources(ctx.corpus)
    .filter(({ source }) => source.unreachableSince)
    .map(({ source }) => ({ id: source.id, since: source.unreachableSince! }));
}

/** Toutes les sections de statistiques disponibles pour un contexte. */
export function computeStats(ctx: RuleContext): Stats {
  return {
    themes: themeStats(ctx.corpus),
    bank: bankStats(ctx.corpus, ctx.thresholds),
    positions: positionStats(ctx),
    ...coverageStats(ctx),
    unreachableSources: unreachableStats(ctx),
    ...(ctx.published && ctx.published.registry.current > 0 ? { publishedSizes: publishedSizes(ctx) } : {}),
  };
}

/** Tailles des fichiers de la version courante, avec leur budget. */
export function publishedSizes(ctx: RuleContext): NonNullable<Stats['publishedSizes']> {
  const version = ctx.published!.registry.current;
  const prefix = `versions/${version}/`;
  const files = [...ctx.published!.files]
    .filter(([path]) => path.startsWith(prefix) || path === 'versions.json')
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([path, { bytes }]) => ({
      path,
      bytes,
      budget: path === 'versions.json' ? 20_479 : path.endsWith('/main.json') ? ctx.thresholds.mainBudgetBytes : ctx.thresholds.detailBudgetBytes,
    }));
  return { version, files };
}
