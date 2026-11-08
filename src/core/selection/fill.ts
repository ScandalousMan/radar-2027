// Remplissage des quotas (FR-022, FR-023, FR-024).
// Premier passage glouton (prioritaires puis autres, ordre canonique ; `D_q` décroissant puis
// identifiant croissant ; une question retenue crédite tous ses thèmes), puis second passage
// (restantes des prioritaires, puis de toute la banque) jusqu'à `N` ou épuisement.
import type { BankQuestion, BankVersion } from '../bank';

export type Picked = { readonly question: BankQuestion; readonly anchorThemeIndex: number; readonly pass: 1 | 2 };

/** Ordre de préférence : `D_q` décroissant, puis identifiant croissant (FR-022). */
export function byDiscriminant(a: BankQuestion, b: BankQuestion): number {
  return b.discriminant - a.discriminant || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
}

/** Questions de chaque thème, triées par préférence. */
export function questionsByTheme(bank: BankVersion): readonly (readonly BankQuestion[])[] {
  const lists: BankQuestion[][] = bank.themes.map(() => []);
  for (const q of bank.questions) for (const t of q.themeIndices) lists[t]!.push(q);
  for (const list of lists) list.sort(byDiscriminant);
  return lists;
}

/** Ordre de rotation : prioritaires puis autres, chacun en ordre canonique (FR-025). */
export function rotationOrder(themeCount: number, priorityIndices: readonly number[]): readonly number[] {
  const prio = new Set(priorityIndices);
  const others = Array.from({ length: themeCount }, (_, t) => t).filter((t) => !prio.has(t));
  return [...[...prio].sort((a, b) => a - b), ...others];
}

export function fillQuotas(bank: BankVersion, quotas: readonly number[], priorityIndices: readonly number[], target: number): readonly Picked[] {
  const byTheme = questionsByTheme(bank);
  const rotation = rotationOrder(bank.themes.length, priorityIndices);
  const rank = new Map(rotation.map((t, i) => [t, i]));
  const selected = new Set<string>();
  const counts = bank.themes.map(() => 0);
  const picked: Picked[] = [];

  const take = (question: BankQuestion, anchorThemeIndex: number, pass: 1 | 2) => {
    selected.add(question.id);
    for (const t of question.themeIndices) counts[t]! += 1;
    picked.push({ question, anchorThemeIndex, pass });
  };

  // Premier passage.
  for (const t of rotation) {
    const list = byTheme[t]!;
    let i = 0;
    while (counts[t]! < quotas[t]! && picked.length < target) {
      while (i < list.length && selected.has(list[i]!.id)) i++;
      if (i >= list.length) break;
      take(list[i]!, t, 1);
    }
  }

  // Second passage : ancrage = premier thème de la question dans l'ordre de rotation.
  const anchorOf = (q: BankQuestion) => [...q.themeIndices].sort((a, b) => rank.get(a)! - rank.get(b)!)[0]!;
  const second = (candidates: readonly BankQuestion[]) => {
    for (const q of candidates) {
      if (picked.length >= target) return;
      if (!selected.has(q.id)) take(q, anchorOf(q), 2);
    }
  };
  for (const t of [...priorityIndices].sort((a, b) => a - b)) second(byTheme[t]!);
  second([...bank.questions].sort(byDiscriminant));

  return picked;
}
