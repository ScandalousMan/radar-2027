// Exemples chiffrés A et B de la spec (SC-001, research.md R9).
// Fixtures partagées entre les tests et la page Méthodologie (005) : les valeurs publiées sont
// celles que le code reproduit.
import type { BankVersion } from '../bank';
import { exampleABank, exampleBBank, selectionOf } from '../bank/fixtures';
import { ratio, type Ratio } from '../ratio';
import type { Selection } from '../selection';
import type { Band, ResultState } from '../types';

export type ScoreExample = {
  readonly title: string;
  readonly bank: BankVersion;
  readonly selection: Selection;
  readonly state: ResultState;
  /** Valeurs attendues pour le candidat unique `cand` (ratios exacts et pourcentages tronqués). */
  readonly expected: {
    readonly concordances: readonly (Ratio | null)[];
    readonly themes: readonly { readonly themeId: string; readonly ratio: Ratio | null; readonly percent: number | null }[];
    readonly weighted: { readonly ratio: Ratio; readonly percent: number };
    readonly priority: { readonly ratio: Ratio; readonly percent: number };
    readonly global: { readonly ratio: Ratio; readonly percent: number };
    readonly coverage: { readonly known: number; readonly answered: number; readonly percent: number };
    readonly band: Band;
  };
};

const bankA = exampleABank();
const bankB = exampleBBank();

/** Exemple A : priorité économie ; s = 1/2, 0, 1 ; q4 exclue ; G 62 %, couverture 75 %. */
export const EXAMPLE_A: ScoreExample = {
  title: 'Exemple A',
  bank: bankA,
  selection: selectionOf(bankA, ['q1', 'q2', 'q3', 'q4'], 'full', [0]),
  state: { bankVersion: 1, mode: 'full', priorities: ['economie'], answers: [2, -1, 2, 0] },
  expected: {
    concordances: [ratio(1, 2), ratio(0), ratio(1), null],
    themes: [
      { themeId: 'economie', ratio: ratio(1, 4), percent: 62 },
      { themeId: 'sante', ratio: null, percent: null },
    ],
    weighted: { ratio: ratio(1, 4), percent: 62 },
    priority: { ratio: ratio(1, 4), percent: 62 },
    global: { ratio: ratio(1, 4), percent: 62 },
    coverage: { known: 3, answered: 4, percent: 75 },
    band: 'rather-aligned',
  },
};

/** Exemple B : un sujet à S = 0, deux autres thèmes à S = 1 ; W 70 %, P 50 %, G 50 % (plafond strict). */
export const EXAMPLE_B: ScoreExample = {
  title: 'Exemple B',
  bank: bankB,
  selection: selectionOf(bankB, ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'], 'full', [0]),
  state: { bankVersion: 1, mode: 'full', priorities: ['t1'], answers: [2, 2, 0, 0, 0, 0] },
  expected: {
    concordances: [ratio(0), ratio(0), ratio(1), ratio(1), ratio(1), ratio(1)],
    themes: [
      { themeId: 't1', ratio: ratio(0), percent: 50 },
      { themeId: 't2', ratio: ratio(1), percent: 100 },
      { themeId: 't3', ratio: ratio(1), percent: 100 },
    ],
    weighted: { ratio: ratio(2, 5), percent: 70 },
    priority: { ratio: ratio(0), percent: 50 },
    global: { ratio: ratio(0), percent: 50 },
    coverage: { known: 6, answered: 6, percent: 100 },
    band: 'mixed',
  },
};
