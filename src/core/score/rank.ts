// Classement (FR-011, FR-012) : G affiché ↓, P exact ↓, couverture ↓, identifiant ↑ ;
// les candidats au même G affiché partagent le rang, le suivant saute (1, 1, 3).
import { cmp } from '../ratio';
import type { CandidateScore } from './types';

export function compareRanked(a: CandidateScore, b: CandidateScore): number {
  return (
    b.global!.percent - a.global!.percent ||
    cmp(b.priority!.ratio, a.priority!.ratio) ||
    cmp(b.coverage!.ratio, a.coverage!.ratio) ||
    (a.candidate.id < b.candidate.id ? -1 : a.candidate.id > b.candidate.id ? 1 : 0)
  );
}

/** Trie des candidats classés et leur attribue un rang. */
export function rankCandidates(scores: readonly CandidateScore[]): readonly CandidateScore[] {
  const sorted = [...scores].sort(compareRanked);
  let rank = 0;
  return sorted.map((s, i) => {
    if (i === 0 || s.global!.percent !== sorted[i - 1]!.global!.percent) rank = i + 1;
    return { ...s, rank };
  });
}
