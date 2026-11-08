// FR-005 : tout changement de statut cite un critère de governance.yaml, du bon type.
import { violation, type Rule, type Violation } from './types';

export const FR_005: Rule = {
  code: 'FR-005',
  run({ corpus }) {
    const out: Violation[] = [];
    const criteria = new Map((corpus.governance?.inclusionCriteria ?? []).map((c) => [c.id, c.kind]));
    const expected = { declared: 'inclusion', withdrawn: 'withdrawal' } as const;
    for (const c of corpus.candidates) {
      const v = (message: string) => out.push(violation('FR-005', 'candidate', c.id, message));
      if (!c.statusCriterion) v('critère de statut (statusCriterion) absent');
      const entries = [
        ...(c.statusCriterion ? [{ status: c.status, criterion: c.statusCriterion, where: 'statusCriterion' }] : []),
        ...c.history.map((h, i) => ({ status: h.status, criterion: h.criterion, where: `history[${i}]` })),
      ];
      for (const e of entries) {
        const kind = criteria.get(e.criterion);
        if (!kind) v(`${e.where} : critère inconnu ${e.criterion}`);
        else if (kind !== expected[e.status]) v(`${e.where} : critère ${e.criterion} (${kind}) incompatible avec le statut ${e.status}`);
      }
    }
    return out;
  },
};
