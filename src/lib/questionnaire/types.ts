// Types du parcours questionnaire (data-model.md § 1 à § 8 de la 004).
// FR-015, FR-020, FR-024, FR-028 : brouillon, étapes, projection de la banque, résumé de fin.
// Les entités métier (Mode, Answer, Selection, BankVersion) viennent de `@/core`.
import type { Answer, BankVersion, Mode, Selection } from '@/core';

/** Thème affiché par le parcours, en ordre canonique (`index = i`). */
export type QuestionnaireTheme = { readonly id: string; readonly label: string; readonly description: string; readonly index: number };

/** Projection de la version courante du jeu publié, figée pour toute la durée du questionnaire. */
export type QuestionnaireBank = {
  readonly version: number;
  readonly publishedAt: string;
  readonly themes: readonly QuestionnaireTheme[];
  readonly bank: BankVersion;
};

/** Brouillon persisté : n'existe qu'à partir de la première question (action `start`). */
export type Draft = {
  readonly format: 1;
  readonly bankVersion: number;
  readonly mode: Mode;
  /** 3 à 5 identifiants distincts, en ordre canonique. */
  readonly priorities: readonly string[];
  /** Une réponse par question de la sélection, dans l'ordre de présentation. */
  readonly answers: readonly Answer[];
  /** Question affichée : `0 ≤ position < answers.length`. */
  readonly position: number;
  /** ISO 8601, fourni par l'action (jamais lu dans le réducteur). */
  readonly updatedAt: string;
};

/** Présélection en cours, non persistée, avant la première question. */
export type Choice = { readonly priorities: readonly string[]; readonly mode: Mode | null };

export type Step = 'themes' | 'mode' | 'questions' | 'end';

/** Réponse effectivement donnée (une action `answer` n'écrit jamais `'unanswered'`). */
export type GivenAnswer = Exclude<Answer, 'unanswered'>;

export type Action =
  | { readonly type: 'start'; readonly bank: QuestionnaireBank; readonly priorities: readonly string[]; readonly mode: Mode; readonly now: string }
  | { readonly type: 'answer'; readonly position: number; readonly answer: GivenAnswer; readonly now: string }
  | { readonly type: 'next'; readonly now: string }
  | { readonly type: 'previous'; readonly now: string }
  | { readonly type: 'goTo'; readonly position: number; readonly now: string }
  | { readonly type: 'resume'; readonly draft: Draft }
  | { readonly type: 'reset' }
  | { readonly type: 'clear' };

/** Action envoyée par une vue : le fournisseur y ajoute `now`. */
export type ViewAction =
  | { readonly type: 'answer'; readonly position: number; readonly answer: GivenAnswer }
  | { readonly type: 'next' }
  | { readonly type: 'previous' }
  | { readonly type: 'goTo'; readonly position: number }
  | { readonly type: 'reset' }
  | { readonly type: 'clear' };

/** Thème d'une question tel que l'affiche `QuestionCard`. */
export type QuestionTheme = { readonly id: string; readonly label: string; readonly priority: boolean };

export type StorageStatus = 'available' | 'unavailable';

export type LoadState =
  | { readonly status: 'loading' }
  | { readonly status: 'no-version' }
  | { readonly status: 'error'; readonly reason: 'network' | 'invalid' }
  | { readonly status: 'ready'; readonly bank: QuestionnaireBank; readonly selections: Readonly<Record<Mode, Selection>> | null };

/** Ce que voit le répondant à l'accueil (data-model § 6). */
export type ResumeInfo = {
  readonly mode: Mode;
  readonly done: number;
  readonly total: number;
  readonly updatedAt: string;
  readonly status: 'resumable' | 'version-changed' | 'unavailable';
};

export type ThemeSummary = {
  readonly themeId: string;
  readonly label: string;
  readonly answered: number;
  readonly skipped: number;
  readonly unanswered: number;
  readonly reliable: boolean;
};

export type EndSummary = {
  readonly themes: readonly ThemeSummary[];
  readonly warning: boolean;
  readonly totalAnswered: number;
  readonly totalSkipped: number;
};
