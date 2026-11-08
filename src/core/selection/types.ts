// Types de la sélection (data-model.md § 5).
import type { BankQuestion } from '../bank';
import type { Mode } from '../types';

export type SelectedQuestion = {
  readonly question: BankQuestion;
  /** Thème au titre duquel la question a été retenue (FR-024). */
  readonly anchorThemeIndex: number;
  /** Index de présentation, à partir de 0 ; index de la réponse dans la charge (FR-026). */
  readonly position: number;
  /** Passage de remplissage (diagnostic et tests). */
  readonly pass: 1 | 2;
};

export type Selection = {
  readonly mode: Mode;
  /** Indices canoniques croissants des sujets prioritaires. */
  readonly priorityIndices: readonly number[];
  /** Quota par thème, longueur `T`, somme `N` (FR-021). */
  readonly quotas: readonly number[];
  /** Questions dans l'ordre de présentation. */
  readonly items: readonly SelectedQuestion[];
};
