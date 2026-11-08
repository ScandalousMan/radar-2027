// FR-016 : au plus une position par couple (candidat, question) ; provenance d'extraction existante.
import { allPositions, positionId } from '../corpus';
import { violation, type Rule, type Violation } from './types';

export const FR_016: Rule = {
  code: 'FR-016',
  run({ corpus, extractions }) {
    const out: Violation[] = [];
    const seen = new Set<string>();
    for (const { candidate, position: p } of allPositions(corpus)) {
      const id = positionId(candidate, p.question);
      if (seen.has(id)) out.push(violation('FR-016', 'position', id, 'plusieurs positions pour ce couple candidat / question'));
      seen.add(id);
      if (p.provenance.kind === 'extraction' && extractions) {
        if (!extractions.runs.has(p.provenance.run)) out.push(violation('FR-016', 'position', id, `exécution d'extraction inconnue : ${p.provenance.run}`));
        const affirmations = extractions.affirmations.get(candidate) ?? [];
        if (!affirmations.some((a) => a.id === (p.provenance as { affirmation: string }).affirmation))
          out.push(violation('FR-016', 'position', id, `affirmation inconnue : ${p.provenance.affirmation}`));
      }
    }
    return out;
  },
};
