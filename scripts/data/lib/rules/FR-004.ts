// FR-004 : chaque candidat porte statut, date et source de statut, une étiquette, un historique cohérent.
import { violation, type Rule, type Violation } from './types';

export const FR_004: Rule = {
  code: 'FR-004',
  run({ corpus }) {
    const out: Violation[] = [];
    for (const c of corpus.candidates) {
      const v = (message: string) => out.push(violation('FR-004', 'candidate', c.id, message));
      if (!c.statusChangedAt) v('date de changement de statut (statusChangedAt) absente');
      if (!c.statusSource) v('source de statut (statusSource) absente');
      if (c.party.trim() === '') v('étiquette (party) vide : indiquer le parti ou « Sans étiquette »');
      if (c.history.length === 0) {
        v('historique de statut (history) vide');
        continue;
      }
      for (let i = 1; i < c.history.length; i++) {
        if (c.history[i]!.at < c.history[i - 1]!.at) v(`historique non chronologique (entrée ${i})`);
      }
      const last = c.history.at(-1)!;
      if (last.status !== c.status) v(`dernière entrée d’historique (${last.status}) incohérente avec le statut ${c.status}`);
      if (c.statusChangedAt && last.at !== c.statusChangedAt) v(`statusChangedAt ${c.statusChangedAt} différent de la dernière entrée d’historique (${last.at})`);
      if (c.statusSource && last.source !== c.statusSource) v(`statusSource ${c.statusSource} différente de la dernière entrée d’historique (${last.source})`);
    }
    return out;
  },
};
