// FR-011 : le texte d'une question publiée ne change plus, hors correction typographique.
import { allQuestions } from '../corpus';
import { levenshtein, normalize, sameWords } from '../text';
import { violation, type Rule, type Violation } from './types';

export const MAX_TYPO_DISTANCE = 3;

export const FR_011: Rule = {
  code: 'FR-011',
  run({ corpus, published }) {
    const current = published?.current;
    if (!current) return [];
    const out: Violation[] = [];
    const byId = new Map(allQuestions(corpus).map(({ question }) => [question.id, question]));
    for (const pq of current.questions) {
      const q = byId.get(pq.id);
      if (!q) {
        out.push(violation('FR-011', 'question', pq.id, `question publiée en version ${current.version} absente du corpus (la passer en retired)`));
        continue;
      }
      const a = normalize(pq.text);
      const b = normalize(q.text);
      if (a === b) continue;
      const d = levenshtein(a, b);
      if (d > MAX_TYPO_DISTANCE || !sameWords(a, b))
        out.push(violation('FR-011', 'question', q.id, `texte modifié depuis la version ${current.version} (distance ${d}, mots changés : créer un nouvel identifiant)`));
    }
    return out;
  },
};
