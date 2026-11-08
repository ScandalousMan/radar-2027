// Accès aux positions d'un jeu publié (contracts/published-dataset.md).
import type { MainDataset, PositionCell } from './types';

const indexCache = new WeakMap<MainDataset, ReadonlyMap<string, number>>();

/** Index `questionId → rang dans questions[]`, mémorisé par jeu. */
export function questionIndex(ds: MainDataset): ReadonlyMap<string, number> {
  let index = indexCache.get(ds);
  if (!index) {
    index = new Map(ds.questions.map((q, i) => [q.id, i]));
    indexCache.set(ds, index);
  }
  return index;
}

/** Position publiée d'un candidat sur une question ; `null` si inconnue ou candidat absent. */
export function positionOf(ds: MainDataset, candidateId: string, questionId: string): PositionCell {
  const row = ds.positions[candidateId];
  const i = questionIndex(ds).get(questionId);
  if (!row || i === undefined) return null;
  return row[i] ?? null;
}
