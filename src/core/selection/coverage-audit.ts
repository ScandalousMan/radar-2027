// Audit de couverture (009 R5, contrat core-selection-delta § Audit de couverture).
// Candidats classés pour un répondant qui répond à toutes les questions de la sélection, selon la
// règle de `scoreCandidate` (003 FR-005, FR-008), qui ne dépend pas de la valeur des réponses :
//   1. couverture (positions connues / questions répondues) ≥ `COVERAGE_THRESHOLD` ;
//   2. score des thèmes prioritaires `P` défini, c'est-à-dire au moins un thème prioritaire avec
//      `MIN_THEME_QUESTIONS` positions connues (une question compte dans chacun de ses thèmes).
//      `W` est alors défini aussi, puisque les thèmes prioritaires y entrent.
// Pur.
import type { BankVersion } from '../bank';
import { COVERAGE_THRESHOLD, MIN_THEME_QUESTIONS } from '../types';
import type { Selection } from './types';

/** Positions connues nécessaires sur `n` questions : plus petit `k` tel que `k / n ≥ seuil` (arithmétique entière). */
function required(n: number): number {
  return Math.ceil((COVERAGE_THRESHOLD * n) / 100);
}

/**
 * Positions qui manquent au candidat dans la sélection pour être classé (0 s'il l'est) :
 * `max(manque de couverture, manque du meilleur thème prioritaire)`, puisque les positions ajoutées
 * dans ce thème comptent aussi pour la couverture. `Infinity` si aucun thème prioritaire n'a assez
 * de questions dans la sélection, ou si la sélection est vide.
 */
export function missingForThreshold(bank: BankVersion, selection: Selection, candidateId: string): number {
  const row = bank.positions.get(candidateId);
  if (!row) throw new RangeError(`candidat inconnu ${candidateId}`);
  const n = selection.items.length;
  if (n === 0) return Infinity;
  const priority = new Set(selection.priorityIndices);
  const count = new Map<number, number>();
  const knownIn = new Map<number, number>();
  let known = 0;
  for (const item of selection.items) {
    const isKnown = row[item.question.index] != null;
    if (isKnown) known++;
    for (const t of item.question.themeIndices) {
      if (!priority.has(t)) continue;
      count.set(t, (count.get(t) ?? 0) + 1);
      if (isKnown) knownIn.set(t, (knownIn.get(t) ?? 0) + 1);
    }
  }
  let themeGap = Infinity;
  for (const [t, c] of count) if (c >= MIN_THEME_QUESTIONS) themeGap = Math.min(themeGap, Math.max(0, MIN_THEME_QUESTIONS - (knownIn.get(t) ?? 0)));
  return Math.max(Math.max(0, required(n) - known), themeGap);
}

/** Candidats classés pour un répondant qui répond à tout, dans l'ordre de la version. */
export function rankedCandidates(bank: BankVersion, selection: Selection): readonly string[] {
  return bank.candidates.filter((c) => missingForThreshold(bank, selection, c.id) === 0).map((c) => c.id);
}
