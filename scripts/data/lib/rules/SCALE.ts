// SCALE : valeur dans l'échelle −2…+2 ou `unknown` (défense en profondeur après le schéma).
import { allPositions, positionId } from '../corpus';
import { isScaleValue } from '../positions';
import { violation, type Rule, type Violation } from './types';

export const SCALE: Rule = {
  code: 'SCALE',
  run({ corpus }) {
    const out: Violation[] = [];
    for (const { candidate, position: p } of allPositions(corpus)) {
      if (p.value !== 'unknown' && !isScaleValue(p.value))
        out.push(violation('SCALE', 'position', positionId(candidate, p.question), `valeur ${String(p.value)} hors de l'échelle −2…+2`));
    }
    return out;
  },
};
