// RECH-REF (spec 008) : tout renvoi du corpus de preuves vise un élément existant — personnalité,
// thème, question, source du registre, journal, preuve, contributeur, position, signalement.
import { allPositions, allQuestions, allSources, positionId } from '../corpus';
import { allEvidence } from '../research';
import { violation, type EntityKind, type Rule, type Violation } from './types';

export const RECH_REF: Rule = {
  code: 'RECH-REF',
  run({ corpus, research }) {
    if (!research) return [];
    const out: Violation[] = [];
    const personalities = new Set(research.personalities.map((p) => p.id));
    const themes = new Set(corpus.themes.map((t) => t.id));
    const questionThemes = new Map(allQuestions(corpus).map(({ question }) => [question.id, question.themes]));
    const sources = new Set(allSources(corpus).map(({ source }) => source.id));
    const journals = new Set([...research.journals.values()].map((j) => j.id));
    const evidence = new Set(allEvidence(research).map(({ evidence: e }) => e.id));
    const contributors = new Set(corpus.contributors.map((c) => c.id));
    const positions = new Set(allPositions(corpus).map(({ candidate, position }) => positionId(candidate, position.question)));
    const signals = new Set(research.signals.map((s) => s.id));

    const check = (set: Set<string>, what: string) => (kind: EntityKind, id: string, ref: string | undefined) => {
      if (ref !== undefined && !set.has(ref)) out.push(violation('RECH-REF', kind, id, `${what} : ${ref}`));
    };
    const personality = check(personalities, 'personnalité inconnue');
    const theme = check(themes, 'thème inconnu');
    const question = check(new Set(questionThemes.keys()), 'question inconnue');
    const source = check(sources, 'source inconnue');
    const journal = check(journals, 'journal inconnu');
    const proof = check(evidence, 'preuve inconnue');
    const contributor = check(contributors, 'contributeur inconnu');
    const signal = check(signals, 'signalement inconnu');

    for (const p of research.personalities) for (const s of p.statuses) for (const e of s.evidence) proof('personality', p.id, e);

    for (const { evidence: e } of allEvidence(research)) {
      personality('evidence', e.id, e.personality);
      theme('evidence', e.id, e.theme);
      question('evidence', e.id, e.question);
      if (e.question && e.theme && questionThemes.has(e.question) && !questionThemes.get(e.question)!.includes(e.theme))
        out.push(violation('RECH-REF', 'evidence', e.id, `le thème ${e.theme} ne figure pas parmi les thèmes de la question ${e.question}`));
      source('evidence', e.id, e.source);
      journal('evidence', e.id, e.journal);
      for (const c of e.corroborations ?? []) {
        source('evidence', e.id, c.source);
        journal('evidence', e.id, c.journal);
      }
      for (const h of e.history ?? []) journal('evidence', e.id, h.journal);
    }

    for (const j of research.journals.values()) {
      contributor('journal', j.id, j.author);
      for (const p of j.scope.personalities) personality('journal', j.id, p);
      for (const t of j.scope.themes) theme('journal', j.id, t);
      for (const q of j.scope.questions) question('journal', j.id, q);
      for (const s of j.sourcesConsulted) source('journal', j.id, s.source);
      for (const e of [...(j.evidenceAdded ?? []), ...(j.evidenceCorroborated ?? []), ...(j.evidenceCorrected ?? [])]) proof('journal', j.id, e);
      for (const d of j.duplicatesAvoided ?? []) proof('journal', j.id, d.evidence);
      for (const c of j.contradictions ?? []) for (const e of c.evidence) proof('journal', j.id, e);
      for (const g of j.gaps ?? []) {
        personality('journal', j.id, g.personality);
        theme('journal', j.id, g.theme);
        question('journal', j.id, g.question);
        for (const e of g.evidence ?? []) proof('journal', j.id, e);
      }
      for (const s of j.signals ?? []) signal('journal', j.id, s);
    }

    for (const s of research.signals) {
      journal('signal', s.id, s.journal);
      personality('signal', s.id, s.personality);
      for (const e of s.evidence) proof('signal', s.id, e);
      contributor('signal', s.id, s.resolution?.by);
      if (s.position && !positions.has(positionId(s.position.candidate, s.position.question)))
        out.push(violation('RECH-REF', 'signal', s.id, `position inconnue : ${positionId(s.position.candidate, s.position.question)}`));
    }
    return out;
  },
};
