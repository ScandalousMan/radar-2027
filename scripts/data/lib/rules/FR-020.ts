// FR-020 : une position contestée s'appuie sur au moins deux sources et explique la contradiction.
import { allPositions, positionId } from '../corpus';
import { violation, type Rule, type Violation } from './types';

export const FR_020: Rule = {
  code: 'FR-020',
  run({ corpus }) {
    const out: Violation[] = [];
    for (const { candidate, position: p } of allPositions(corpus)) {
      if (p.status !== 'contested') continue;
      const id = positionId(candidate, p.question);
      if (p.sources.length < 2) out.push(violation('FR-020', 'position', id, `position contestée avec ${p.sources.length} source(s), au moins 2 attendues`));
      if (!p.justification?.trim()) out.push(violation('FR-020', 'position', id, 'position contestée sans justification de la contradiction'));
    }
    return out;
  },
};
