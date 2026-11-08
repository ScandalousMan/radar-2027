// FR-003 : un thème retiré ne porte plus de question active ; un thème publié n'est jamais supprimé.
import { allQuestions } from '../corpus';
import { violation, type Rule, type Violation } from './types';

export const FR_003: Rule = {
  code: 'FR-003',
  run({ corpus, published }) {
    const out: Violation[] = [];
    const retired = new Set(corpus.themes.filter((t) => t.status === 'retired').map((t) => t.id));
    const offending = new Map<string, string[]>();
    for (const { question: q } of allQuestions(corpus)) {
      const primary = q.themes[0];
      if (q.status === 'active' && primary && retired.has(primary)) offending.set(primary, [...(offending.get(primary) ?? []), q.id]);
    }
    for (const [theme, qs] of offending) out.push(violation('FR-003', 'theme', theme, `thème retiré portant ${qs.length} question(s) active(s) : ${qs.join(', ')}`));
    const ids = new Set(corpus.themes.map((t) => t.id));
    for (const t of published?.current?.themes ?? []) {
      if (!ids.has(t.id)) out.push(violation('FR-003', 'theme', t.id, `thème publié en version ${published?.current?.version} supprimé du corpus (le passer en retired)`));
    }
    return out;
  },
};
