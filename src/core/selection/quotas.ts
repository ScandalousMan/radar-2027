// Quotas par thème (FR-021).
// Part exacte `e_t = N·w_t/Σw` en rationnel, quota initial `max(plancher, ⌊e_t⌋)`, puis reste
// distribué une unité par thème par `(e_t − q_t)` décroissant, puis ordre canonique.
import { BankError, type BankVersion } from '../bank';
import { cmp, ratio, sub, type Ratio } from '../ratio';
import { OTHER_WEIGHT, PRIORITY_WEIGHT, QUOTA_FLOOR, TARGET_COUNT, type Mode } from '../types';

export function computeQuotas(bank: BankVersion, mode: Mode, priorityIndices: readonly number[]): readonly number[] {
  const T = bank.themes.length;
  const N = TARGET_COUNT[mode];
  const floor = QUOTA_FLOOR[mode];
  const prio = new Set(priorityIndices);
  const sumW = PRIORITY_WEIGHT * prio.size + OTHER_WEIGHT * (T - prio.size);

  const exact: Ratio[] = [];
  const quotas: number[] = [];
  for (let t = 0; t < T; t++) {
    const e = ratio(N * (prio.has(t) ? PRIORITY_WEIGHT : OTHER_WEIGHT), sumW);
    exact.push(e);
    quotas.push(Math.max(floor, Number(e.num / e.den)));
  }

  const total = quotas.reduce((a, b) => a + b, 0);
  if (total > N) throw new BankError('too-many-themes-for-quotas', `${T} thèmes, ${prio.size} sujets, mode ${mode} : ${total} > ${N}`);

  const remainder = N - total;
  const order = quotas
    .map((q, t) => ({ t, gap: sub(exact[t]!, ratio(q)) }))
    .sort((a, b) => cmp(b.gap, a.gap) || a.t - b.t);
  if (remainder > order.length) throw new BankError('too-many-themes-for-quotas', `reste ${remainder} pour ${T} thèmes`);
  for (let i = 0; i < remainder; i++) quotas[order[i]!.t]! += 1;
  return quotas;
}
