// FR-015 : une position fondée uniquement sur des sources antérieures au seuil porte `old: true`,
// et seulement elle ; avertissement si une source plus récente du candidat contient la citation.
import { allPositions, allSources, positionId } from '../corpus';
import { isOldSource, sourceIndex } from '../positions';
import { findQuote } from '../text';
import { violation, warning, type Rule, type Violation } from './types';

export const FR_015: Rule = {
  code: 'FR-015',
  run({ corpus, cache, thresholds }) {
    const out: Violation[] = [];
    const index = sourceIndex(corpus);
    for (const { candidate, position: p } of allPositions(corpus)) {
      if (p.value === 'unknown' || p.sources.length === 0) continue;
      const sources = p.sources.map((id) => index.get(id)).filter((s) => s !== undefined);
      if (sources.length === 0) continue;
      const id = positionId(candidate, p.question);
      const allOld = sources.every((s) => isOldSource(s, thresholds.oldSourceBefore));
      if (allOld && p.old !== true) out.push(violation('FR-015', 'position', id, `toutes les sources sont antérieures au ${thresholds.oldSourceBefore} : marquer old: true`));
      if (!allOld && p.old === true) out.push(violation('FR-015', 'position', id, `old: true alors qu'au moins une source est postérieure au ${thresholds.oldSourceBefore}`));
      if (allOld && cache && p.quote) {
        const newer = allSources(corpus).find(
          ({ source: s }) => s.candidates.includes(candidate) && !isOldSource(s, thresholds.oldSourceBefore) && s.contentHash && findQuote(cache.read(s.contentHash) ?? '', p.quote!) !== null,
        );
        if (newer) out.push(warning('OLD-NEWER-SOURCE', 'position', id, `position « ancienne » alors que la source récente ${newer.source.id} contient la citation`));
      }
    }
    return out;
  },
};
