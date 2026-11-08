// FR-013 : source complète, adresse unique dans tout le corpus, dates cohérentes.
import { allSources } from '../corpus';
import { violation, type Rule, type Violation } from './types';

export const FR_013: Rule = {
  code: 'FR-013',
  run({ corpus }) {
    const out: Violation[] = [];
    const urls = new Map<string, string>();
    for (const { source: s } of allSources(corpus)) {
      const v = (message: string) => out.push(violation('FR-013', 'source', s.id, message));
      const first = urls.get(s.url);
      if (first) v(`adresse déjà utilisée par la source ${first} : ${s.url}`);
      else urls.set(s.url, s.id);
      if (s.candidates.length === 0) v('aucun candidat concerné');
      if (s.title.trim() === '') v('titre vide');
      const published = s.publishedAt.date;
      if (s.accessedAt.slice(0, published.length) < published) v(`consultée le ${s.accessedAt}, avant sa publication (${published})`);
    }
    return out;
  },
};
