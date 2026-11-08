// ID-UNIQUE : identifiants uniques par type et au format kebab-case.
import { allQuestions, allSources } from '../corpus';
import { ID_PATTERN } from '../schema';
import { violation, type EntityKind, type Rule, type Violation } from './types';

function check(kind: EntityKind, label: string, entries: { id: string; where: string }[], out: Violation[]) {
  const seen = new Map<string, string>();
  for (const { id, where } of entries) {
    if (!ID_PATTERN.test(id)) out.push(violation('ID-UNIQUE', kind, id, `identifiant de ${label} au mauvais format (kebab-case ASCII attendu)`));
    const first = seen.get(id);
    if (first !== undefined) out.push(violation('ID-UNIQUE', kind, id, `identifiant de ${label} dupliqué (${first} et ${where})`));
    else seen.set(id, where);
  }
}

export const ID_UNIQUE: Rule = {
  code: 'ID-UNIQUE',
  run({ corpus }) {
    const out: Violation[] = [];
    check('theme', 'thème', corpus.themes.map((t) => ({ id: t.id, where: 'themes.yaml' })), out);
    check('contributor', 'contributeur', corpus.contributors.map((c) => ({ id: c.id, where: 'contributors.yaml' })), out);
    check('candidate', 'candidat', corpus.candidates.map((c) => ({ id: c.id, where: 'candidates.yaml' })), out);
    check('question', 'question', allQuestions(corpus).map(({ file, question }) => ({ id: question.id, where: `questions/${file}.yaml` })), out);
    check('source', 'source', allSources(corpus).map(({ file, source }) => ({ id: source.id, where: `sources/${file}.yaml` })), out);
    if (corpus.governance) {
      check('criterion', 'critère', corpus.governance.inclusionCriteria.map((c) => ({ id: c.id, where: 'inclusionCriteria' })), out);
      check('criterion', 'critère de neutralité', corpus.governance.neutralityChecklist.map((c) => ({ id: c.id, where: 'neutralityChecklist' })), out);
    }
    return out;
  },
};
