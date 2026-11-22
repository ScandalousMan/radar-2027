// RECH-EVIDENCE (spec 008, FR-015 à FR-036) : format et cohérence de chaque preuve — champs requis
// selon le type, la citation et l'attribution, ordre des dates, corroborations et doublons.
// Contrôles 1 à 14 en erreur ; 15 (doublon possible) et 16 (actualité douteuse) en avertissement.
import { sourceIndex } from '../positions';
import { allEvidence, comparableName, compareDates, moreThanTwelveMonths } from '../research';
import type { Evidence, Personality } from '../schema';
import { normalize, words } from '../text';
import { violation, warning, type Rule, type Violation } from './types';

const TIMESTAMP = /^(\d{1,2}:)?[0-5]\d:[0-5]\d$/;
const PERSONAL = new Set(['PERSONAL_DIRECT', 'PERSONAL_DOCUMENT']);

function statedDate(e: Evidence): string | undefined {
  return e.statedAt === 'unknown' ? undefined : e.statedAt.date;
}

export const RECH_EVIDENCE: Rule = {
  code: 'RECH-EVIDENCE',
  run({ corpus, research, thresholds }) {
    if (!research) return [];
    const out: Violation[] = [];
    const sources = sourceIndex(corpus);
    const personalities = new Map<string, Personality>(research.personalities.map((p) => [p.id, p]));
    const duplicateSignals = research.signals.filter((s) => s.kind === 'POSSIBLE_DUPLICATE').map((s) => new Set(s.evidence));

    for (const { evidence: e } of allEvidence(research)) {
      const v = (n: number, message: string) => out.push(violation('RECH-EVIDENCE', 'evidence', e.id, `(${n}) ${message}`));

      // 1. Type de preuve.
      if (e.kind === 'POSITION' && !e.theme) v(1, 'preuve POSITION sans thème');
      if (e.kind === 'CANDIDACY' && (e.theme || e.question || e.qualification)) v(1, 'preuve CANDIDACY rattachée à un thème, une question ou une qualification');
      // 2. Question et qualification vont ensemble.
      if (Boolean(e.question) !== Boolean(e.qualification)) v(2, e.question ? 'question sans qualification' : 'qualification sans question');
      // 3. Citation ou paraphrase selon le statut.
      const quoted = e.quoteStatus === 'VERIFIED_QUOTE' || e.quoteStatus === 'UNVERIFIED_QUOTE';
      if (quoted && !e.quote?.trim()) v(3, `${e.quoteStatus} sans citation`);
      if (e.quote && e.quote.length > thresholds.maxQuoteLength) v(3, `citation de ${e.quote.length} caractères (maximum ${thresholds.maxQuoteLength})`);
      if (e.quoteStatus === 'PARAPHRASE') {
        if (!e.paraphrase?.trim()) v(3, 'PARAPHRASE sans paraphrase');
        if (e.quote) v(3, 'PARAPHRASE accompagnée d’une citation entre guillemets');
      }
      if (e.quoteStatus === 'VERIFIED_QUOTE' && e.paraphrase) v(3, 'VERIFIED_QUOTE accompagnée d’une paraphrase');
      // 4. Citation vérifiée : source du registre, localisation, qualité A ou B, transcription non automatique.
      if (e.quoteStatus === 'VERIFIED_QUOTE') {
        if (!e.source) v(4, 'VERIFIED_QUOTE sans source du registre');
        if (!e.locator) v(4, 'VERIFIED_QUOTE sans localisation (locator)');
        if (e.sourceQuality !== 'A_PRIMARY_VERIFIED' && e.sourceQuality !== 'B_RELIABLE_SECONDARY') v(4, `VERIFIED_QUOTE de qualité ${e.sourceQuality} (A ou B attendue)`);
        if (e.transcript === 'automatic') v(4, 'VERIFIED_QUOTE sur une transcription automatique');
      }
      // 5. Source primaire vérifiée : jamais non vérifiée ni inaccessible.
      if (e.sourceQuality === 'A_PRIMARY_VERIFIED' && (e.quoteStatus === 'UNVERIFIED_QUOTE' || e.quoteStatus === 'SOURCE_INACCESSIBLE'))
        v(5, `qualité A_PRIMARY_VERIFIED incompatible avec ${e.quoteStatus}`);
      // 6. Source non enregistrée : seulement pour une source inaccessible de qualité D, et jamais avec une source.
      if (Boolean(e.source) === Boolean(e.unregisteredSource)) v(6, e.source ? 'source et unregisteredSource à la fois' : 'ni source ni unregisteredSource');
      if (e.unregisteredSource && (e.quoteStatus !== 'SOURCE_INACCESSIBLE' || e.sourceQuality !== 'D_UNVERIFIED_OR_INACCESSIBLE'))
        v(6, 'unregisteredSource admis seulement avec SOURCE_INACCESSIBLE et D_UNVERIFIED_OR_INACCESSIBLE');
      // 7. Localisation.
      if (!e.locator && e.quoteStatus !== 'SOURCE_INACCESSIBLE') v(7, 'localisation (locator) absente');
      if (e.locator?.kind === 'timestamp' && !TIMESTAMP.test(e.locator.value)) v(7, `horodatage ${e.locator.value} : format [HH:]MM:SS attendu`);
      // 8. Action personnelle : portée décrite.
      if (e.attribution === 'PERSONAL_ACTION' && !e.actionScope?.trim()) v(8, 'PERSONAL_ACTION sans portée (actionScope)');
      // 9. Auteur des propos différent de la personnalité : pas d'attribution personnelle.
      const p = personalities.get(e.personality);
      if (p && PERSONAL.has(e.attribution)) {
        const names = new Set([p.name, ...(p.aliases ?? [])].map(comparableName));
        if (!names.has(comparableName(e.speaker))) v(9, `propos de « ${e.speaker} » attribués personnellement (${e.attribution}) à ${p.name}`);
      }
      // 10. Date inconnue ⇔ actualité indéterminée.
      if ((e.statedAt === 'unknown') !== (e.temporalRelevance === 'UNDETERMINED'))
        v(10, e.statedAt === 'unknown' ? 'date des propos inconnue : temporalRelevance UNDETERMINED attendue' : 'UNDETERMINED réservé à une date des propos inconnue');
      // 11. Ordre des dates.
      const stated = statedDate(e);
      const published = e.publishedAt?.date ?? (e.source ? sources.get(e.source)?.publishedAt.date : undefined);
      if (stated && published && compareDates(stated, published) > 0) v(11, `propos datés du ${stated}, après leur publication (${published})`);
      if (published && compareDates(published, e.verifiedAt) > 0) v(11, `publication (${published}) postérieure à la vérification (${e.verifiedAt})`);
      if (stated && compareDates(stated, e.verifiedAt) > 0) v(11, `propos (${stated}) postérieurs à la vérification (${e.verifiedAt})`);
      if (e.researchedAt > e.verifiedAt) v(11, `recherche (${e.researchedAt}) postérieure à la vérification (${e.verifiedAt})`);
      if (e.createdAt > e.updatedAt) v(11, `création (${e.createdAt}) postérieure à la mise à jour (${e.updatedAt})`);
      // 12. Toute mise à jour est tracée.
      if (e.updatedAt > e.createdAt) {
        const traced = (e.history ?? []).some((h) => h.at === e.updatedAt) || (e.corroborations ?? []).some((c) => c.verifiedAt === e.updatedAt);
        if (!traced) v(12, `mise à jour du ${e.updatedAt} sans entrée d’historique ni corroboration à cette date`);
      }
      // 13. Corroborations : sources distinctes.
      const seen = new Set(e.source ? [e.source] : []);
      for (const c of e.corroborations ?? []) {
        if (seen.has(c.source)) v(13, `corroboration par la source ${c.source}, déjà citée par la preuve`);
        seen.add(c.source);
      }
      // 16. Propos ancien présenté comme actuel : une corroboration est récente si sa source a été
      // publiée moins de 12 mois avant la vérification.
      if (e.temporalRelevance === 'CURRENT' && stated && moreThanTwelveMonths(stated, e.verifiedAt)) {
        const recent = (e.corroborations ?? []).some((c) => {
          const date = sources.get(c.source)?.publishedAt.date;
          return date !== undefined && !moreThanTwelveMonths(date, e.verifiedAt);
        });
        if (!recent) out.push(warning('RECH-EVIDENCE', 'evidence', e.id, `(16) propos du ${stated} présentés comme actuels (CURRENT) sans corroboration récente`));
      }
    }

    // 14 et 15. Doublons, par personnalité.
    for (const [, list] of research.evidence) {
      const exact = new Map<string, string>();
      const byWords = new Map<string, Evidence[]>();
      for (const e of list) {
        if (!e.quote?.trim()) continue;
        if (e.source) {
          const key = `${e.personality}\u0000${e.source}\u0000${normalize(e.quote)}`;
          const first = exact.get(key);
          if (first) out.push(violation('RECH-EVIDENCE', 'evidence', e.id, `(14) même source et même citation que ${first} : en faire une corroboration`));
          else exact.set(key, e.id);
        }
        const key = `${e.personality}\u0000${words(e.quote).join(' ')}`;
        byWords.set(key, [...(byWords.get(key) ?? []), e]);
      }
      for (const group of byWords.values()) {
        for (let i = 0; i < group.length; i++) {
          for (let j = i + 1; j < group.length; j++) {
            const a = group[i]!;
            const b = group[j]!;
            if (a.source === b.source) continue;
            if (duplicateSignals.some((s) => s.has(a.id) && s.has(b.id))) continue;
            out.push(warning('RECH-EVIDENCE', 'evidence', b.id, `(15) même citation que ${a.id} sur une autre source : doublon possible sans signalement POSSIBLE_DUPLICATE`));
          }
        }
      }
    }
    return out;
  },
};
