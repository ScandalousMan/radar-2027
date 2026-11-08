// Types et constantes partagés du domaine (data-model.md § 1 et § 4, contracts/core-api.md).
// FR-008, FR-014, FR-018, FR-019, FR-021, FR-028, FR-030, FR-034, FR-036.
import type { ScaleValue } from './dataset';

/** Mode du questionnaire : complet (100 questions) ou court (25). */
export type Mode = 'full' | 'short';

export const MODES: readonly Mode[] = ['full', 'short'];

/** Réponse à une question : valeur −2 … +2, passée ou non répondue. */
export type Answer = ScaleValue | 'skipped' | 'unanswered';

/** État complet d'un résultat, encodé dans le fragment d'URL. */
export type ResultState = {
  /** Numéro de version publié (≥ 1), codé `bankVersion − 1` dans la charge. */
  readonly bankVersion: number;
  readonly mode: Mode;
  /** 3 à 5 identifiants de thème distincts, en ordre canonique après normalisation. */
  readonly priorities: readonly string[];
  /** Une réponse par question de la sélection, dans l'ordre de présentation. */
  readonly answers: readonly Answer[];
};

/** Bande d'alignement d'un candidat classé (FR-014). */
export type Band = 'very-aligned' | 'rather-aligned' | 'mixed' | 'distant';

/** Motif de rejet d'un lien (FR-034). */
export type RejectionReason =
  | 'unsupported-link-version'
  | 'invalid-content'
  | 'unknown-bank-version'
  | 'invalid-length'
  | 'invalid-checksum';

/** Motif d'exclusion d'une question du calcul de score (FR-002). */
export type ExclusionReason = 'skipped' | 'unanswered' | 'unknown-position';

/** Résultat d'un décodage : jamais d'exception pour une donnée venue d'un lien. */
export type DecodeResult<T> = { readonly ok: true; readonly value: T } | { readonly ok: false; readonly reason: RejectionReason };

export type StateErrorCode = 'bad-priorities' | 'bad-mode' | 'bad-answer-count' | 'bad-answer' | 'version-mismatch';

/** Erreur de programmation : état construit par l'application incohérent avec la banque (FR-036). */
export class StateError extends Error {
  readonly code: StateErrorCode;

  constructor(code: StateErrorCode, detail?: string) {
    super(detail ? `${code} : ${detail}` : code);
    this.name = 'StateError';
    this.code = code;
  }
}

/** Nombre cible de questions par mode (FR-019). */
export const TARGET_COUNT: Readonly<Record<Mode, number>> = { full: 100, short: 25 };

/** Plancher de quota par thème (FR-021). */
export const QUOTA_FLOOR: Readonly<Record<Mode, number>> = { full: 3, short: 1 };

/** Poids d'un thème prioritaire et d'un autre thème (FR-006, FR-021). */
export const PRIORITY_WEIGHT = 3;
export const OTHER_WEIGHT = 1;

/** Bornes du nombre de sujets prioritaires (FR-018, FR-036). */
export const MIN_PRIORITIES = 3;
export const MAX_PRIORITIES = 5;

/** Nombre minimal de questions exploitables pour qu'un score de thème soit défini (FR-004, FR-013). */
export const MIN_THEME_QUESTIONS = 2;

/** Seuil de couverture, en pourcentage, inclusif (FR-008). */
export const COVERAGE_THRESHOLD = 60;

/** Version du format de lien écrite en clair dans le fragment (FR-028). */
export const LINK_FORMAT_VERSION = 1;

/** Bandes d'alignement par seuil inférieur décroissant (FR-014). */
export const BANDS: readonly { readonly band: Band; readonly min: number }[] = [
  { band: 'very-aligned', min: 80 },
  { band: 'rather-aligned', min: 60 },
  { band: 'mixed', min: 40 },
  { band: 'distant', min: 0 },
];

/** Bande correspondant à un pourcentage affiché (tronqué). */
export function bandOf(percent: number): Band {
  for (const b of BANDS) if (percent >= b.min) return b.band;
  return 'distant';
}

/** Vrai si la valeur est une réponse admise. */
export function isAnswer(value: unknown): value is Answer {
  return value === 'skipped' || value === 'unanswered' || value === -2 || value === -1 || value === 0 || value === 1 || value === 2;
}
