// RECH-SIGNAL (spec 008, FR-012, FR-033, FR-036, FR-044) : signalements complets, résolus seulement
// par un humain ; toute preuve de signe contraire à une position existante est signalée (R10).
// Contrôles 1 à 3 en erreur ; 4 (contradiction non tracée) en avertissement.
import { allPositions } from '../corpus';
import { allEvidence } from '../research';
import { violation, warning, type Rule, type Violation } from './types';

const SUPPORT = new Set(['EXPLICIT_SUPPORT', 'QUALIFIED_SUPPORT']);
const OPPOSITION = new Set(['EXPLICIT_OPPOSITION', 'QUALIFIED_OPPOSITION']);

export const RECH_SIGNAL: Rule = {
  code: 'RECH-SIGNAL',
  run({ corpus, research }) {
    if (!research) return [];
    const out: Violation[] = [];

    for (const s of research.signals) {
      const v = (n: number, message: string) => out.push(violation('RECH-SIGNAL', 'signal', s.id, `(${n}) ${message}`));
      // 1. Champs requis selon le type.
      if ((s.kind === 'POSITION_REVIEW' || s.kind === 'QUOTE_DISCREPANCY') && !s.position) v(1, `${s.kind} sans position visée`);
      const minimum = s.kind === 'POSSIBLE_DUPLICATE' ? 2 : s.kind === 'QUOTE_DISCREPANCY' ? 0 : 1;
      if (s.evidence.length < minimum) v(1, `${s.kind} avec ${s.evidence.length} preuve(s) : au moins ${minimum} attendue(s)`);
      // 2. Résolution humaine.
      if (s.state === 'resolved' && !s.resolution) v(2, 'signalement résolu sans résolution (date, auteur, décision)');
      if (s.state === 'open' && s.resolution) v(2, 'signalement ouvert portant une résolution');
      if (s.resolution?.by === 'claude') v(2, 'un signalement ne peut être résolu que par un humain');
    }

    // 3. Preuve de signe contraire à une position existante.
    const values = new Map<string, number>();
    for (const { candidate, position: p } of allPositions(corpus))
      if ((p.status === 'draft' || p.status === 'reviewed') && typeof p.value === 'number') values.set(`${candidate}/${p.question}`, p.value);
    const reviewed = new Set(research.signals.filter((s) => s.kind === 'POSITION_REVIEW').flatMap((s) => s.evidence));
    const contradictionSignals = new Set(research.signals.filter((s) => s.kind === 'UNRESOLVED_CONTRADICTION').flatMap((s) => s.evidence));
    const journalContradictions = new Set([...research.journals.values()].flatMap((j) => (j.contradictions ?? []).flatMap((c) => c.evidence)));

    for (const { evidence: e } of allEvidence(research)) {
      if (e.question && e.qualification) {
        const value = values.get(`${e.personality}/${e.question}`);
        const contrary = value !== undefined && ((SUPPORT.has(e.qualification) && value < 0) || (OPPOSITION.has(e.qualification) && value > 0));
        if (contrary && !reviewed.has(e.id))
          out.push(violation('RECH-SIGNAL', 'evidence', e.id, `(3) ${e.qualification} contraire à la position ${e.personality}/${e.question} (valeur ${value}) sans signalement POSITION_REVIEW`));
      }
      // 4. Contradiction non tracée.
      if (e.qualification === 'CONTRADICTORY_EVIDENCE' && !contradictionSignals.has(e.id) && !journalContradictions.has(e.id))
        out.push(warning('RECH-SIGNAL', 'evidence', e.id, '(4) CONTRADICTORY_EVIDENCE sans signalement UNRESOLVED_CONTRADICTION ni entrée contradictions d’un journal'));
    }
    return out;
  },
};
