export * from './common';
export * from './themes';
export * from './contributors';
export * from './candidates';
export * from './governance';
export * from './questions';
export * from './sources';
export * from './positions';
export * from './affirmations';
export * from './runs';
export * from './costs';

import type { Candidate } from './candidates';
import type { Contributor } from './contributors';
import type { GovernanceFile } from './governance';
import type { Position } from './positions';
import type { Question } from './questions';
import type { Source } from './sources';
import type { Theme } from './themes';

/** Corpus chargé : fichiers simples et listes regroupées par fichier (nom sans extension). */
export type Corpus = {
  themes: Theme[];
  contributors: Contributor[];
  candidates: Candidate[];
  /** `null` si `governance.yaml` est absent ou invalide (violation SCHEMA). */
  governance: GovernanceFile | null;
  /** Fichier `questions/<theme>.yaml` → questions. */
  questions: Map<string, Question[]>;
  /** Fichier `sources/<nom>.yaml` → sources. */
  sources: Map<string, Source[]>;
  /** Fichier `positions/<candidat>.yaml` → positions. */
  positions: Map<string, Position[]>;
};
