// Score d'un candidat (FR-005 → FR-011, FR-014 → FR-016).
// P = moyenne des thèmes prioritaires définis ; W pondéré 3/1 ; couverture par répondant ;
// statut par seuil inclusif de 60 % et P défini ; G = min(W, P) (plafond strict).
import type { BankCandidate, BankVersion } from '../bank';
import { cmp, floorPercentUnit, mean, min, ratio, weightedMean, type Ratio } from '../ratio';
import type { Selection } from '../selection';
import { bandOf, COVERAGE_THRESHOLD, OTHER_WEIGHT, PRIORITY_WEIGHT, type ResultState } from '../types';
import { concordance, signedScore } from './concordance';
import { themeScores } from './themes';
import type { CandidateScore, Coverage, QuestionScore } from './types';

const THRESHOLD = ratio(COVERAGE_THRESHOLD, 100);

export function scoreCandidate(bank: BankVersion, selection: Selection, state: ResultState, priority: ReadonlySet<number>, candidate: BankCandidate): CandidateScore {
  const row = bank.positions.get(candidate.id)!;
  let answered = 0;
  let known = 0;
  const questions = selection.items.map((item, i): QuestionScore => {
    const answer = state.answers[i]!;
    const candidatePosition = row[item.question.index] ?? null;
    if (typeof answer === 'number') {
      answered++;
      if (candidatePosition !== null) known++;
    }
    return { position: item.position, questionId: item.question.id, answer, candidatePosition, ...concordance(answer, candidatePosition) };
  });

  const themes = themeScores(bank, selection, state.mode, priority, questions);
  const prio: Ratio[] = [];
  const weighted: { value: Ratio; weight: number }[] = [];
  for (const t of themes) {
    if (!t.score) continue;
    const isPriority = t.kind === 'theme' && t.priority;
    if (isPriority) prio.push(t.score.ratio);
    weighted.push({ value: t.score.ratio, weight: isPriority ? PRIORITY_WEIGHT : OTHER_WEIGHT });
  }

  const P = prio.length > 0 ? signedScore(mean(prio)) : null;
  const W = weighted.length > 0 ? signedScore(weightedMean(weighted)) : null;
  let coverage: Coverage | null = null;
  if (answered > 0) {
    const r = ratio(known, answered);
    coverage = { known, answered, ratio: r, percent: floorPercentUnit(r) };
  }

  const insufficient = coverage === null || cmp(coverage.ratio, THRESHOLD) < 0 || P === null || W === null;
  if (insufficient) {
    return { candidate, status: 'insufficient-data', rank: null, band: null, global: null, priority: P, weighted: W, coverage, themes, questions };
  }
  const G = signedScore(min(W.ratio, P.ratio));
  return { candidate, status: 'ranked', rank: null, band: bandOf(G.percent), global: G, priority: P, weighted: W, coverage, themes, questions };
}
