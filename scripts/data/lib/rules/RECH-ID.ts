// RECH-ID (spec 008) : identifiants du corpus de preuves uniques et cohérents avec leurs fichiers ;
// une personnalité qui porte le nom d'un candidat publié reprend son identifiant (FR-011, FR-040).
import { allEvidence, comparableName } from '../research';
import { violation, type EntityKind, type Rule, type Violation } from './types';

const JOURNAL_ID = /^\d{4}-\d{2}-\d{2}-[a-z0-9]+(-[a-z0-9]+)*$/;

export const RECH_ID: Rule = {
  code: 'RECH-ID',
  run({ corpus, research }) {
    if (!research) return [];
    const out: Violation[] = [];
    const v = (kind: EntityKind, id: string, message: string) => out.push(violation('RECH-ID', kind, id, message));
    const unique = (kind: EntityKind, label: string, values: string[]) => {
      const seen = new Set<string>();
      for (const id of values) {
        if (seen.has(id)) v(kind, id, `identifiant de ${label} en double`);
        seen.add(id);
      }
    };

    unique('personality', 'personnalité', research.personalities.map((p) => p.id));
    unique('evidence', 'preuve', allEvidence(research).map(({ evidence }) => evidence.id));
    unique('journal', 'journal', [...research.journals.values()].map((j) => j.id));
    unique('signal', 'signalement', research.signals.map((s) => s.id));

    for (const { file, evidence: e } of allEvidence(research)) {
      if (e.personality !== file) v('evidence', e.id, `personnalité ${e.personality} rangée dans preuves/${file}.yaml`);
      if (!e.id.startsWith(`${e.personality}-`)) v('evidence', e.id, `l'identifiant doit commencer par « ${e.personality}- »`);
    }
    for (const [file, j] of research.journals) {
      if (j.id !== file) v('journal', j.id, `identifiant différent du nom de fichier journaux/${file}.yaml`);
      if (!JOURNAL_ID.test(j.id)) v('journal', j.id, 'identifiant de journal de la forme YYYY-MM-DD-<slug> attendu');
    }

    const candidateByName = new Map(corpus.candidates.map((c) => [comparableName(c.name), c.id]));
    for (const p of research.personalities) {
      const candidate = candidateByName.get(comparableName(p.name));
      if (candidate && candidate !== p.id) v('personality', p.id, `porte le nom du candidat publié ${candidate} : reprendre son identifiant`);
    }
    return out;
  },
};
