// FR-014 : empreinte du texte présente et, cache disponible, égale à celle du fichier en cache.
import { allSources } from '../corpus';
import { sha256 } from '../text';
import { violation, warning, type Rule, type Violation } from './types';

export const FR_014: Rule = {
  code: 'FR-014',
  run({ corpus, cache }) {
    const out: Violation[] = [];
    for (const { source: s } of allSources(corpus)) {
      if (!s.contentHash) {
        out.push(violation('FR-014', 'source', s.id, 'empreinte du texte (contentHash) absente : enregistrer la source avec pnpm data:source fetch'));
        continue;
      }
      if (!cache) continue;
      const text = cache.read(s.contentHash);
      if (text === null) out.push(warning('CACHE-MISSING', 'source', s.id, `texte absent du cache (${s.contentHash})`));
      else if (sha256(text) !== s.contentHash) out.push(violation('FR-014', 'source', s.id, `texte en cache modifié : empreinte ${sha256(text)} au lieu de ${s.contentHash}`));
    }
    return out;
  },
};
