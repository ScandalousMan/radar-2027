// REF-EXISTS : tout thème, question, candidat, source ou contributeur référencé existe.
// (Les critères de gouvernance sont vérifiés par FR-005.)
import { allPositions, allQuestions, allSources, positionId } from '../corpus';
import { violation, type Rule, type Violation } from './types';

export const REF_EXISTS: Rule = {
  code: 'REF-EXISTS',
  run({ corpus }) {
    const out: Violation[] = [];
    const themes = new Set(corpus.themes.map((t) => t.id));
    const contributors = new Set(corpus.contributors.map((c) => c.id));
    const candidates = new Set(corpus.candidates.map((c) => c.id));
    const questions = new Set(allQuestions(corpus).map(({ question }) => question.id));
    const sources = new Set(allSources(corpus).map(({ source }) => source.id));
    const missing = (kind: Parameters<typeof violation>[1], id: string, what: string, ref: string) =>
      out.push(violation('REF-EXISTS', kind, id, `${what} inconnu : ${ref}`));

    for (const { question: q } of allQuestions(corpus)) {
      for (const t of q.themes) if (!themes.has(t)) missing('question', q.id, 'thème', t);
      if (!contributors.has(q.author)) missing('question', q.id, 'auteur', q.author);
      if (q.reviewer && !contributors.has(q.reviewer)) missing('question', q.id, 'relecteur', q.reviewer);
    }
    for (const c of corpus.candidates) {
      if (c.statusSource && !sources.has(c.statusSource)) missing('candidate', c.id, 'source de statut', c.statusSource);
      for (const h of c.history) if (!sources.has(h.source)) missing('candidate', c.id, 'source d’historique', h.source);
    }
    for (const { source: s } of allSources(corpus)) {
      for (const c of s.candidates) if (!candidates.has(c)) missing('source', s.id, 'candidat', c);
    }
    for (const candidate of corpus.positions.keys()) {
      if (!candidates.has(candidate)) missing('candidate', candidate, 'candidat (fichier positions)', `positions/${candidate}.yaml`);
    }
    for (const { candidate, position: p } of allPositions(corpus)) {
      const id = positionId(candidate, p.question);
      if (!questions.has(p.question)) missing('position', id, 'question', p.question);
      for (const s of p.sources) if (!sources.has(s)) missing('position', id, 'source', s);
      if (p.quoteSource && !sources.has(p.quoteSource)) missing('position', id, 'source de citation', p.quoteSource);
      if (!contributors.has(p.author)) missing('position', id, 'auteur', p.author);
      if (p.reviewer && !contributors.has(p.reviewer)) missing('position', id, 'relecteur', p.reviewer);
    }
    return out;
  },
};
