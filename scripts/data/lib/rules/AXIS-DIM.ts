// AXIS-DIM (spec 006 FR-002a, contracts/corpus-delta.md) : axe composite à dimensions.
// Chaque question d'un thème à dimensions est rattachée à une dimension connue ; chaque
// dimension compte au moins 3 questions actives ; le thème a au moins autant de questions
// actives que le quota maximal qu'il peut recevoir comme sujet prioritaire en mode complet.
import type { BankVersion } from '@/core/bank';
import { computeQuotas } from '@/core/selection';
import { MIN_PRIORITIES } from '@/core/types';
import { bankFromCorpus } from '../bank';
import { allQuestions } from '../corpus';
import { violation, type Rule, type Violation } from './types';

export const MIN_QUESTIONS_PER_DIMENSION = 3;

/** Quota maximal du thème d'indice `t` sur toutes les combinaisons de 3 sujets prioritaires qui le contiennent. */
export function maxPriorityQuota(bank: BankVersion, t: number): number {
  const T = bank.themes.length;
  const others = [...Array(T).keys()].filter((i) => i !== t);
  const k = Math.min(MIN_PRIORITIES, T) - 1;
  let best = 0;
  const visit = (start: number, picked: number[]) => {
    if (picked.length === k) {
      best = Math.max(best, computeQuotas(bank, 'full', [t, ...picked].sort((a, b) => a - b))[t]!);
      return;
    }
    for (let i = start; i < others.length; i++) visit(i + 1, [...picked, others[i]!]);
  };
  visit(0, []);
  return best;
}

export const AXIS_DIM: Rule = {
  code: 'AXIS-DIM',
  run({ corpus }) {
    const out: Violation[] = [];
    const themes = new Map(corpus.themes.map((t) => [t.id, t]));
    const questions = allQuestions(corpus).map(({ question }) => question);

    for (const q of questions) {
      const theme = themes.get(q.themes[0]!);
      if (!theme) continue; // REF-EXISTS
      const dims = theme.dimensions?.map((d) => d.id) ?? [];
      const expected = dims.join(', ');
      if (q.dimension !== undefined) {
        if (dims.length === 0) out.push(violation('AXIS-DIM', 'question', q.id, `${q.id} : dimension « ${q.dimension} » sans dimensions déclarées sur ${theme.id}`));
        else if (!dims.includes(q.dimension)) out.push(violation('AXIS-DIM', 'question', q.id, `${q.id} : dimension « ${q.dimension} » inconnue de ${theme.id} (attendu : ${expected})`));
      } else if (dims.length > 0 && q.status === 'active') {
        out.push(violation('AXIS-DIM', 'question', q.id, `${q.id} : dimension manquante (attendu : ${expected})`));
      }
    }

    let bank: BankVersion | undefined;
    for (const theme of corpus.themes) {
      if (theme.status !== 'active' || !theme.dimensions) continue;
      const active = questions.filter((q) => q.status === 'active' && q.themes[0] === theme.id);
      if (active.length === 0) continue; // THEME-EMPTY
      for (const d of theme.dimensions) {
        const n = active.filter((q) => q.dimension === d.id).length;
        if (n < MIN_QUESTIONS_PER_DIMENSION)
          out.push(violation('AXIS-DIM', 'theme', theme.id, `${theme.id} : dimension ${d.id} : ${n} questions actives, minimum ${MIN_QUESTIONS_PER_DIMENSION}`));
      }
      bank ??= bankFromCorpus(corpus);
      const t = bank.themeIndexById.get(theme.id)!;
      const q = maxPriorityQuota(bank, t);
      if (active.length < q)
        out.push(
          violation('AXIS-DIM', 'theme', theme.id, `${theme.id} : ${active.length} questions actives, minimum ${q} (quota maximal d'un thème prioritaire en mode complet, ${bank.themes.length} thèmes)`),
        );
    }
    return out;
  },
};
