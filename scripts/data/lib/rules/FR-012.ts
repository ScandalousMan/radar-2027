// FR-012 : par thème actif, assez de questions actives et des polarités équilibrées.
import { allQuestions } from '../corpus';
import { violation, warning, type Rule, type Violation } from './types';

const pct = (n: number) => `${Math.round(n * 100)} %`;

export const FR_012: Rule = {
  code: 'FR-012',
  run({ corpus, published, thresholds }) {
    const out: Violation[] = [];
    const active = allQuestions(corpus).filter(({ question }) => question.status === 'active');
    for (const theme of corpus.themes) {
      if (theme.status !== 'active') continue;
      const qs = active.filter(({ question }) => question.themes[0] === theme.id);
      if (qs.length === 0) {
        out.push(warning('THEME-EMPTY', 'theme', theme.id, `${theme.id} : aucune question active (bloquant pour la publication)`));
        continue;
      }
      const plus = qs.filter(({ question }) => question.polarity === '+').length;
      const minus = qs.length - plus;
      const ps = plus / qs.length;
      const ms = minus / qs.length;
      const counts = `${plus} '+' / ${minus} '-' (${pct(ps)} / ${pct(ms)})`;
      if (qs.length < thresholds.minQuestionsPerTheme)
        out.push(violation('FR-012', 'theme', theme.id, `${theme.id} : ${qs.length} questions actives, minimum ${thresholds.minQuestionsPerTheme} ; ${counts}`));
      const outOfRange = (s: number) => s < thresholds.polarityMin - 1e-9 || s > thresholds.polarityMax + 1e-9;
      if (outOfRange(ps) || outOfRange(ms))
        out.push(violation('FR-012', 'theme', theme.id, `${theme.id} : ${counts}, attendu ${pct(thresholds.polarityMin)}–${pct(thresholds.polarityMax)}`));
    }
    const versions = published?.registry.current ?? 0;
    if (versions === 0 && (active.length < thresholds.bankMin || active.length > thresholds.bankMax))
      out.push(warning('BANK-SIZE', 'bank', 'banque', `${active.length} questions actives, cible ${thresholds.bankMin}–${thresholds.bankMax} avant la première publication`));
    return out;
  },
};
