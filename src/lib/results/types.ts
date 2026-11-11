// Types de la page de résultats (data-model.md § 1 à § 7, contracts/results-model.md de la 005).
// FR-001 à FR-022, FR-031 à FR-035 : états de la page, modèle d'affichage, vues historisées.
// Les entités métier (ResultState, Scoreboard, Band, …) viennent de `@/core`.
import type { Band, BankVersion, EvidenceLevel, Mode, RejectionReason, ResultState, ScaleValue, Scoreboard } from '@/core';
import type { QuestionnaireBank } from '@/lib/questionnaire/types';

/** Palier d'accord : lecture directe de la concordance exacte (R3). */
export type AgreementLevel = 'identical' | 'close' | 'intermediate' | 'distant' | 'opposite';

export const AGREEMENT_LEVELS: readonly AgreementLevel[] = ['identical', 'close', 'intermediate', 'distant', 'opposite'];

/** Thème de la version du lien, en ordre canonique. */
export type ResultTheme = { readonly id: string; readonly label: string; readonly index: number };

/** Données d'un résultat calculé (statut `ready`). */
export type ReadyData = {
  readonly state: ResultState;
  readonly board: Scoreboard;
  /** Version du lien (jamais la courante, sauf si c'est la même). */
  readonly bank: BankVersion;
  readonly themes: readonly ResultTheme[];
  /** Lien d'une version antérieure : date de sa version et candidats absents de la courante. */
  readonly prior: null | { readonly publishedAt: string; readonly withdrawnIds: readonly string[] };
  /** Projection de la version courante : « Modifier mes réponses » et « Refaire » (R7). */
  readonly currentBank: QuestionnaireBank;
  /** `origin + '/resultats#1.…'`, jamais de query string. */
  readonly shareUrl: string;
};

export type PageState =
  | { readonly status: 'loading' }
  | { readonly status: 'no-fragment' }
  | { readonly status: 'no-version' }
  | { readonly status: 'invalid'; readonly reason: Exclude<RejectionReason, 'unknown-bank-version'> }
  | { readonly status: 'unknown-version' }
  | { readonly status: 'error'; readonly reason: 'network' | 'invalid-data' | 'internal' }
  | { readonly status: 'ready'; readonly data: ReadyData };

export type RankingRow = {
  readonly candidateId: string;
  readonly name: string;
  readonly rank: number;
  readonly tied: boolean;
  readonly percent: number;
  readonly band: Band;
  readonly withdrawn: boolean;
};

export type InsufficientRow = {
  readonly candidateId: string;
  readonly name: string;
  /** Positions inconnues parmi les questions répondues. */
  readonly unknown: number;
  readonly answered: number;
  readonly withdrawn: boolean;
};

export type ResultsHeaderView = {
  /** Libellés des sujets clés, en ordre canonique. */
  readonly priorities: readonly string[];
  readonly mode: Mode;
  readonly answeredCount: number;
  readonly totalCount: number;
};

export type ResultsView = {
  readonly header: ResultsHeaderView;
  readonly ranking: readonly RankingRow[];
  readonly insufficient: readonly InsufficientRow[];
  readonly noneRanked: boolean;
  readonly prior: null | { readonly publishedAt: string; readonly withdrawnCount: number };
};

/** Clé de ligne de thème : identifiant de thème, ou `others` (mode court). */
export type ThemeKey = string;

export const OTHERS_KEY = 'others';

export type ThemeRow = {
  readonly key: ThemeKey;
  /** Libellé du thème ; vide pour `others` (traduit par l'interface). */
  readonly label: string;
  readonly priority: boolean;
  readonly percent: number | null;
  /** Questions répondues du thème à position connue. */
  readonly known: number;
  /** Questions répondues (valeur numérique) du thème. */
  readonly answered: number;
};

export type QuestionRow = {
  readonly questionId: string;
  readonly text: string;
  readonly themeLabels: readonly string[];
  readonly answer: ScaleValue;
  readonly position: ScaleValue | null;
  readonly agreement: AgreementLevel | null;
  readonly evidence: EvidenceLevel | null;
};

export type QuestionGroup = { readonly key: ThemeKey; readonly label: string; readonly priority: boolean; readonly questions: readonly QuestionRow[] };

export type SkippedRow = {
  readonly questionId: string;
  readonly text: string;
  readonly themeLabels: readonly string[];
  readonly position: ScaleValue | null;
  readonly evidence: EvidenceLevel | null;
};

export type CandidateSheet = {
  readonly candidateId: string;
  readonly name: string;
  readonly party: string;
  readonly status: 'ranked' | 'insufficient-data';
  readonly rank: number | null;
  readonly tied: boolean;
  readonly band: Band | null;
  readonly percent: number | null;
  readonly withdrawn: boolean;
  readonly themes: readonly ThemeRow[];
  /** Questions répondues, regroupées par thème principal dans l'ordre de `themes`. */
  readonly groups: readonly QuestionGroup[];
  readonly skipped: readonly SkippedRow[];
  readonly unansweredCount: number;
};

export type ComparisonColumn = { readonly candidateId: string; readonly name: string; readonly slot: 1 | 2 | 3; readonly global: number | null };

export type ComparisonRow = { readonly key: ThemeKey; readonly label: string; readonly priority: boolean; readonly values: readonly (number | null)[] };

export type ComparisonView = { readonly columns: readonly ComparisonColumn[]; readonly rows: readonly ComparisonRow[] };

/** Vue affichée, portée par `history.state.radarResults` (R1). */
export type ViewState =
  | { readonly view: 'ranking' }
  | { readonly view: 'candidate'; readonly candidateId: string }
  | { readonly view: 'compare'; readonly candidateIds: readonly string[] };

export const MAX_COMPARED = 3;
export const MIN_COMPARED = 2;
