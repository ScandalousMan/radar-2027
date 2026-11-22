// RECH-QUOTE (spec 008, FR-019, SC-005) : une citation VERIFIED_QUOTE est retrouvée mot pour mot
// (après normalisation) dans le texte en cache de sa source, comme FR-017 pour les positions.
// Cache présent mais texte absent : avertissement CACHE-MISSING ; cache absent (CI) : l'avertissement
// global de chargement suffit.
import { sourceIndex } from '../positions';
import { allEvidence } from '../research';
import { findQuote } from '../text';
import { violation, warning, type Rule, type Violation } from './types';

export const RECH_QUOTE: Rule = {
  code: 'RECH-QUOTE',
  run({ corpus, research, cache }) {
    if (!research) return [];
    const out: Violation[] = [];
    const sources = sourceIndex(corpus);

    const check = (evidenceId: string, quote: string, sourceId: string, label: string) => {
      const source = sources.get(sourceId);
      if (!source) return; // renvoi contrôlé par RECH-REF
      if (!source.contentHash) {
        out.push(violation('RECH-QUOTE', 'evidence', evidenceId, `${label} : la source ${sourceId} n’a pas d’empreinte (contentHash)`));
        return;
      }
      if (!cache) return;
      const text = cache.read(source.contentHash);
      if (text === null) out.push(warning('CACHE-MISSING', 'evidence', evidenceId, `${label} non vérifiée : texte de ${sourceId} absent du cache`));
      else if (!findQuote(text, quote)) out.push(violation('RECH-QUOTE', 'evidence', evidenceId, `${label} introuvable dans le texte de ${sourceId}`));
    };

    for (const { evidence: e } of allEvidence(research)) {
      if (!e.quote?.trim()) continue;
      if (e.quoteStatus === 'VERIFIED_QUOTE' && e.source) check(e.id, e.quote, e.source, 'citation');
      for (const c of e.corroborations ?? []) if (c.quoteStatus === 'VERIFIED_QUOTE') check(e.id, e.quote, c.source, `citation corroborée par ${c.source}`);
    }
    return out;
  },
};
