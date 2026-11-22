// Sélection déterministe des questions (FR-018 → FR-027).
// Ne reçoit aucune réponse : même triplet (version, mode, sujets) ⇒ même liste, partout.
import { priorityIndicesOf, type BankVersion } from '../bank';
import { MODES, StateError, TARGET_COUNT, type Mode } from '../types';
import { byCoverage, byDiscriminant, fillQuotas, rotationOrder } from './fill';
import { fillQuotasBySubject } from './fill-subject';
import { roundRobin } from './order';
import { computeQuotas } from './quotas';
import type { Selection } from './types';

export function selectQuestions(bank: BankVersion, mode: Mode, priorities: readonly string[]): Selection {
  if (!MODES.includes(mode)) throw new StateError('bad-mode', String(mode));
  const priorityIndices = priorityIndicesOf(bank, priorities);
  const quotas = computeQuotas(bank, mode, priorityIndices);
  // Règles versionnées avec la donnée (007 R1, 009 R1) : 1 = 003 inchangées, 2 = par enjeu et par
  // ancrage, 3 = idem avec la couverture comme premier critère de préférence dans un thème.
  const target = TARGET_COUNT[mode];
  const picked =
    bank.selectionRules === 3
      ? fillQuotasBySubject(bank, quotas, priorityIndices, target, byCoverage)
      : bank.selectionRules === 2
        ? fillQuotasBySubject(bank, quotas, priorityIndices, target, byDiscriminant)
        : fillQuotas(bank, quotas, priorityIndices, target);
  const items = roundRobin(picked, rotationOrder(bank.themes.length, priorityIndices));
  return { mode, priorityIndices, quotas, items };
}
