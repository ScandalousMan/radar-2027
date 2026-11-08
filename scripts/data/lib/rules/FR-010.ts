// FR-010 : une question active a été relue par une personne distincte de son auteur.
import { allQuestions } from '../corpus';
import { violation, type Rule, type Violation } from './types';

export const FR_010: Rule = {
  code: 'FR-010',
  run({ corpus }) {
    const out: Violation[] = [];
    for (const { question: q } of allQuestions(corpus)) {
      if (q.status !== 'active') continue;
      const v = (message: string) => out.push(violation('FR-010', 'question', q.id, message));
      if (!q.reviewer) v('question active sans relecteur');
      else if (q.reviewer === q.author) v(`question active relue par son auteur (${q.author})`);
      if (!q.reviewedAt) v('question active sans date de relecture (reviewedAt)');
    }
    return out;
  },
};
