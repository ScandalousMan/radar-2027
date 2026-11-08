// Sélection déterministe des questions (FR-018 → FR-027).
// Ne reçoit aucune réponse : même triplet (version, mode, sujets) ⇒ même liste, partout.
import { priorityIndicesOf, type BankVersion } from '../bank';
import { MODES, StateError, TARGET_COUNT, type Mode } from '../types';
import { fillQuotas, rotationOrder } from './fill';
import { roundRobin } from './order';
import { computeQuotas } from './quotas';
import type { Selection } from './types';

export function selectQuestions(bank: BankVersion, mode: Mode, priorities: readonly string[]): Selection {
  if (!MODES.includes(mode)) throw new StateError('bad-mode', String(mode));
  const priorityIndices = priorityIndicesOf(bank, priorities);
  const quotas = computeQuotas(bank, mode, priorityIndices);
  const picked = fillQuotas(bank, quotas, priorityIndices, TARGET_COUNT[mode]);
  const items = roundRobin(picked, rotationOrder(bank.themes.length, priorityIndices));
  return { mode, priorityIndices, quotas, items };
}
