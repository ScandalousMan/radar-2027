// FR-008 : une question a 1 ou 2 thèmes distincts, est rangée dans le fichier de son thème principal.
import { allQuestions } from '../corpus';
import { violation, type Rule, type Violation } from './types';

export const FR_008: Rule = {
  code: 'FR-008',
  run({ corpus }) {
    const out: Violation[] = [];
    for (const { file, question: q } of allQuestions(corpus)) {
      const v = (message: string) => out.push(violation('FR-008', 'question', q.id, message));
      if (q.themes.length < 1 || q.themes.length > 2) v(`${q.themes.length} thèmes (1 ou 2 attendus)`);
      if (new Set(q.themes).size !== q.themes.length) v('thèmes en double');
      if (q.themes[0] !== file) v(`rangée dans questions/${file}.yaml alors que son thème principal est ${q.themes[0]}`);
      if (q.introducedIn !== undefined && q.retiredIn !== undefined && q.retiredIn < q.introducedIn)
        v(`retiredIn ${q.retiredIn} antérieur à introducedIn ${q.introducedIn}`);
      if (q.status === 'retired' && q.introducedIn === undefined && q.retiredIn !== undefined) v('retiredIn sans introducedIn');
    }
    return out;
  },
};
