// Couverture et pouvoir discriminant (research.md R9, FR-033, FR-034). Fonctions pures.
import type { ScaleValue } from './types';

/** Part des questions actives ayant une position connue, dans [0, 1] ; 0 sans question active. */
export function coverage(known: number, activeQuestions: number): number {
  if (activeQuestions <= 0) return 0;
  return Math.min(1, Math.max(0, known / activeQuestions));
}

/**
 * Pouvoir discriminant d'une question : écart-type de population des `k` valeurs connues,
 * multiplié par `k / n` (`n` candidats inclus). Vaut 0 si `k < 2`. Dans [0, 2] sur l'échelle −2…+2.
 */
export function discriminant(values: ReadonlyArray<ScaleValue>, includedCandidates: number): number {
  const k = values.length;
  if (k < 2 || includedCandidates <= 0) return 0;
  const mean = values.reduce<number>((s, v) => s + v, 0) / k;
  const variance = values.reduce<number>((s, v) => s + (v - mean) ** 2, 0) / k;
  const sigma = Math.sqrt(variance);
  return Math.min(2, sigma * Math.min(1, k / includedCandidates));
}

export function round3(n: number): number {
  return Math.round(n * 1000) / 1000;
}

export function round4(n: number): number {
  return Math.round(n * 10000) / 10000;
}
