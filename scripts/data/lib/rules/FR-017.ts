// FR-017 : une valeur connue est sourcée, citée (citation retrouvée), justifiée, et son niveau de
// preuve est exactement le plus fort des sources.
import { EVIDENCE_LEVELS } from '@/core/dataset';
import { allPositions, positionId } from '../corpus';
import { quoteFound, sourceIndex, strongestEvidence } from '../positions';
import { violation, warning, type Rule, type Violation } from './types';

export const FR_017: Rule = {
  code: 'FR-017',
  run({ corpus, cache, thresholds }) {
    const out: Violation[] = [];
    const index = sourceIndex(corpus);
    for (const { candidate, position: p } of allPositions(corpus)) {
      if (p.value === 'unknown') continue;
      const id = positionId(candidate, p.question);
      const v = (message: string) => out.push(violation('FR-017', 'position', id, message));
      if (p.sources.length === 0) v('valeur connue sans source');
      if (!p.quote) v('valeur connue sans citation');
      else if (p.quote.length > thresholds.maxQuoteLength) v(`citation de ${p.quote.length} caractères (maximum ${thresholds.maxQuoteLength})`);
      if (!p.quoteSource) v('source de la citation (quoteSource) absente');
      else if (!p.sources.includes(p.quoteSource)) v(`quoteSource ${p.quoteSource} absente de sources`);
      if (!p.justification?.trim()) v('justification absente');
      const kinds = p.sources.map((s) => index.get(s)?.kind).filter((k) => k !== undefined);
      const strongest = strongestEvidence(kinds);
      if (!p.evidence) v('niveau de preuve (evidence) absent');
      else if (strongest && p.evidence !== strongest) {
        const over = EVIDENCE_LEVELS.indexOf(p.evidence) < EVIDENCE_LEVELS.indexOf(strongest);
        v(`niveau ${over ? 'surévalué' : 'sous-évalué'} : ${p.evidence} déclaré, ${strongest} d'après les sources`);
      }
      const found = quoteFound(p, corpus, cache);
      if (found === false) v(`citation introuvable dans le texte de ${p.quoteSource}`);
      else if (found === null && cache && p.quote && p.quoteSource) out.push(warning('CACHE-MISSING', 'position', id, `citation non vérifiée : texte de ${p.quoteSource} absent du cache`));
    }
    return out;
  },
};
