// FR-018 : une position relue l'a été par une personne distincte de son auteur, via data:review.
import { allPositions, positionId } from '../corpus';
import { violation, type Rule, type Violation } from './types';

export const FR_018: Rule = {
  code: 'FR-018',
  run({ corpus }) {
    const out: Violation[] = [];
    for (const { candidate, position: p } of allPositions(corpus)) {
      if (p.status !== 'reviewed') continue;
      const id = positionId(candidate, p.question);
      const v = (message: string) => out.push(violation('FR-018', 'position', id, message));
      if (!p.reviewer) v('position relue sans relecteur');
      else if (p.reviewer === p.author) v(`position relue par son auteur (${p.author})`);
      if (!p.reviewedAt) v('position relue sans date de relecture');
      if (p.provenance.kind === 'extraction' && !p.reviewedHash) v('position issue d’une extraction marquée relue sans passer par pnpm data:review');
    }
    return out;
  },
};
