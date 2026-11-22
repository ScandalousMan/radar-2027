// RECH-STATUS (spec 008, FR-008 à FR-012) : historique daté et prouvé des statuts de candidature ;
// une rumeur n'est jamais une déclaration ; tout écart avec la liste publiée est signalé (R10).
// Contrôles 1 à 5 en erreur ; 6 (candidat publié absent du registre) en avertissement.
import { compareDates, evidenceIndex } from '../research';
import type { CandidacyStatusValue } from '../schema';
import { violation, warning, type Rule, type Violation } from './types';

const PERSONAL = new Set(['PERSONAL_DIRECT', 'PERSONAL_DOCUMENT']);
const INDIRECT = new Set(['THIRD_PARTY_ATTRIBUTION', 'UNKNOWN_ATTRIBUTION']);
const NEEDS_PERSONAL = new Set<CandidacyStatusValue>(['DECLARED', 'INTENTION_EXPRESSED']);
const ALLOWED_INDIRECT = new Set<CandidacyStatusValue>(['REPORTED_UNCONFIRMED', 'POTENTIAL', 'NOT_A_CANDIDATE']);
/** Équivalent, dans le registre de recherche, du statut de la liste publiée. */
const PUBLISHED_EQUIVALENT: Record<'declared' | 'withdrawn', CandidacyStatusValue> = { declared: 'DECLARED', withdrawn: 'WITHDRAWN' };

export const RECH_STATUS: Rule = {
  code: 'RECH-STATUS',
  run({ corpus, research }) {
    if (!research) return [];
    const out: Violation[] = [];
    const evidence = evidenceIndex(research);
    const published = new Map(corpus.candidates.map((c) => [c.id, c]));
    const statusSignals = new Set(research.signals.filter((s) => s.kind === 'CANDIDATE_STATUS').map((s) => s.personality));

    for (const p of research.personalities) {
      const v = (n: number, message: string) => out.push(violation('RECH-STATUS', 'personality', p.id, `(${n}) ${message}`));
      // 1. Historique non vide et ordonné.
      if (p.statuses.length === 0) {
        v(1, 'aucun statut de candidature');
        continue;
      }
      p.statuses.forEach((s, i) => {
        const previous = p.statuses[i - 1];
        if (previous && compareDates(previous.at.date, s.at.date) > 0) v(1, `statut ${s.status} du ${s.at.date} placé après un statut du ${previous.at.date} : ordre chronologique attendu`);
        // 2. Chaque statut est prouvé par une preuve CANDIDACY de la même personnalité.
        const proofs = s.evidence.map((id) => evidence.get(id)).filter((e) => e !== undefined);
        for (const e of proofs) {
          if (e.kind !== 'CANDIDACY') v(2, `statut ${s.status} (${s.at.date}) appuyé sur la preuve ${e.id}, qui n'est pas de type CANDIDACY`);
          if (e.personality !== p.id) v(2, `statut ${s.status} (${s.at.date}) appuyé sur la preuve ${e.id} d'une autre personnalité (${e.personality})`);
        }
        const valid = proofs.filter((e) => e.kind === 'CANDIDACY' && e.personality === p.id);
        if (valid.length === 0) {
          v(2, `statut ${s.status} (${s.at.date}) sans preuve CANDIDACY de cette personnalité`);
          return;
        }
        // 3. Déclaration ou intention : propos personnels exigés.
        if (NEEDS_PERSONAL.has(s.status) && !valid.some((e) => PERSONAL.has(e.attribution)))
          v(3, `statut ${s.status} (${s.at.date}) sans preuve PERSONAL_DIRECT ou PERSONAL_DOCUMENT : une rumeur n'est pas une déclaration`);
        // 4. Preuves seulement indirectes : statuts prudents seulement.
        else if (valid.every((e) => INDIRECT.has(e.attribution)) && !ALLOWED_INDIRECT.has(s.status))
          v(4, `statut ${s.status} (${s.at.date}) appuyé seulement sur des attributions indirectes : REPORTED_UNCONFIRMED, POTENTIAL ou NOT_A_CANDIDATE attendu`);
      });
      // 5. Écart avec la liste publiée sans signalement CANDIDATE_STATUS.
      const current = p.statuses.at(-1)!.status;
      const candidate = published.get(p.id);
      const gap = candidate ? PUBLISHED_EQUIVALENT[candidate.status] !== current : current === 'DECLARED';
      if (gap && !statusSignals.has(p.id))
        v(5, candidate
          ? `statut courant ${current} différent de la liste publiée (${candidate.status}) sans signalement CANDIDATE_STATUS`
          : `personnalité hors liste publiée au statut courant DECLARED sans signalement CANDIDATE_STATUS`);
    }

    // 6. Candidat publié absent du registre.
    const tracked = new Set(research.personalities.map((p) => p.id));
    for (const c of corpus.candidates)
      if (!tracked.has(c.id)) out.push(warning('RECH-STATUS', 'candidate', c.id, '(6) candidat publié absent du registre de recherche (personnalites.yaml)'));
    return out;
  },
};
