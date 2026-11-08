// FR-009 : énoncé court, sans double négation simple, grille de neutralité complète avant `active`.
import { allQuestions } from '../corpus';
import { violation, type Rule, type Violation } from './types';

/**
 * Heuristique de double négation (documentée comme telle) : une négation `ne … pas`, `pas`
 * ou `jamais` suivie, dans la même phrase, d'une seconde négation (`ni`, `sans`, `aucun`,
 * `jamais`, `rien`, `personne`). Elle ne prétend pas à l'exhaustivité ; la grille
 * `single-claim` relue par une personne reste la garantie.
 */
const DOUBLE_NEGATION = [
  /\b(?:ne|n')\s*[^.!?]*?\b(?:pas|plus|jamais)\b[^.!?]*?\b(?:ni|sans|aucune?|jamais|rien|personne)\b/i,
  /\bpas\b[^.!?]*?\bsans\b/i,
  /\bjamais\b[^.!?]*?\baucune?\b/i,
];

export function hasDoubleNegation(text: string): boolean {
  return DOUBLE_NEGATION.some((re) => re.test(text.replace(/[’]/g, "'")));
}

export const FR_009: Rule = {
  code: 'FR-009',
  run({ corpus, thresholds }) {
    const out: Violation[] = [];
    const keys = (corpus.governance?.neutralityChecklist ?? []).map((c) => c.id);
    for (const { question: q } of allQuestions(corpus)) {
      const v = (message: string) => out.push(violation('FR-009', 'question', q.id, message));
      if (q.text.length > thresholds.maxStatementLength) v(`énoncé de ${q.text.length} caractères (maximum ${thresholds.maxStatementLength})`);
      if (hasDoubleNegation(q.text)) v('double négation probable (heuristique) : reformuler en une affirmation simple');
      if (q.status === 'active') {
        const unchecked = keys.filter((k) => q.neutralityChecklist[k] !== true);
        if (unchecked.length > 0) v(`grille de neutralité incomplète : ${unchecked.join(', ')}`);
      }
      for (const k of Object.keys(q.neutralityChecklist)) if (!keys.includes(k)) v(`critère de neutralité inconnu : ${k}`);
    }
    return out;
  },
};
