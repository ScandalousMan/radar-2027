// Types de sortie du score (data-model.md § 6, research.md R8).
import type { BankCandidate } from '../bank';
import type { EvidenceCode, PositionCell } from '../dataset';
import type { Ratio } from '../ratio';
import type { Answer, Band } from '../types';

/** Grandeur de score : exacte, affichée (tronquée, 0 … 100) et approchée (pourcentage flottant, pour une barre). */
export type Score = { readonly ratio: Ratio; readonly percent: number; readonly approx: number };

export type Coverage = { readonly known: number; readonly answered: number; readonly ratio: Ratio; readonly percent: number };

export type ThemeScore =
  | { readonly kind: 'theme'; readonly themeIndex: number; readonly themeId: string; readonly priority: boolean; readonly count: number; readonly score: Score | null }
  | { readonly kind: 'others'; readonly count: number; readonly score: Score | null };

export type QuestionScore = {
  readonly position: number;
  readonly questionId: string;
  readonly answer: Answer;
  readonly candidatePosition: PositionCell;
} & ({ readonly concordance: Ratio; readonly level: EvidenceCode } | { readonly excluded: 'skipped' | 'unanswered' | 'unknown-position' });

export type CandidateStatus = 'ranked' | 'insufficient-data';

export type CandidateScore = {
  readonly candidate: BankCandidate;
  readonly status: CandidateStatus;
  readonly rank: number | null;
  readonly band: Band | null;
  readonly global: Score | null;
  readonly priority: Score | null;
  readonly weighted: Score | null;
  readonly coverage: Coverage | null;
  readonly themes: readonly ThemeScore[];
  readonly questions: readonly QuestionScore[];
};

export type Scoreboard = {
  readonly ranked: readonly CandidateScore[];
  readonly insufficient: readonly CandidateScore[];
  /** Questions à réponse numérique (dénominateur de la couverture). */
  readonly answeredCount: number;
  /** Vrai si le résultat repose sur une version antérieure de la banque (FR-040). */
  readonly priorVersion: boolean;
  readonly bankPublishedAt: string;
};
