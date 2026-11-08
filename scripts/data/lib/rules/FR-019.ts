// FR-019 : une position relue n'a pas été modifiée depuis sa relecture.
import { allPositions, positionId } from '../corpus';
import { positionHash } from '../positions';
import { violation, type Rule, type Violation } from './types';

export const FR_019: Rule = {
  code: 'FR-019',
  run({ corpus }) {
    const out: Violation[] = [];
    for (const { candidate, position: p } of allPositions(corpus)) {
      if (p.status !== 'reviewed') continue;
      const id = positionId(candidate, p.question);
      // Une inconnue explicite sans empreinte est admise (contracts/corpus-files.md) ; toute empreinte présente est vérifiée.
      if (!p.reviewedHash) {
        if (p.value !== 'unknown') out.push(violation('FR-019', 'position', id, 'empreinte de relecture (reviewedHash) absente : relire avec pnpm data:review'));
        continue;
      }
      if (p.reviewedHash !== positionHash(p)) out.push(violation('FR-019', 'position', id, 'modifiée depuis la relecture : repasser en draft'));
    }
    return out;
  },
};
