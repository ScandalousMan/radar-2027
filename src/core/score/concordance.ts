// Concordance par question (FR-001, FR-002, FR-015).
// `s = 1 − |u − c| / 2` ; le niveau de preuve est transmis sans intervenir dans le calcul.
import type { EvidenceCode, PositionCell } from '../dataset';
import { floorPercentSigned, ratio, toNumber, type Ratio } from '../ratio';
import type { Answer, ExclusionReason } from '../types';
import type { Score } from './types';

export type Concordance = { readonly concordance: Ratio; readonly level: EvidenceCode } | { readonly excluded: ExclusionReason };

export function concordance(u: Answer, c: PositionCell): Concordance {
  if (u === 'skipped' || u === 'unanswered') return { excluded: u };
  if (c === null) return { excluded: 'unknown-position' };
  return { concordance: ratio(2 - Math.abs(u - c[0]), 2), level: c[1] };
}

/** Grandeur de [−1, +1] sous ses trois formes (R8). */
export function signedScore(r: Ratio): Score {
  return { ratio: r, percent: floorPercentSigned(r), approx: (toNumber(r) + 1) * 50 };
}
