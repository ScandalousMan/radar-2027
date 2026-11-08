// Types du jeu de données publié (contracts/published-dataset.md, data-model.md § 10–12).
// Module pur : consommé par les scripts de données, la page Méthodologie et la fonctionnalité 003.

/** Niveau de preuve codé sur un caractère dans `main.json` : programme, livre/plateforme, déclaration/vote. */
export type EvidenceCode = 'p' | 'l' | 'd';

/** Niveaux de preuve, du plus fort au plus faible ; identique au type de `src/ui/EvidenceBadge`. */
export type EvidenceLevel = 'programme' | 'livre_plateforme' | 'declaration_vote';

/** Ordre de force des niveaux (le premier est le plus fort). */
export const EVIDENCE_LEVELS: readonly EvidenceLevel[] = ['programme', 'livre_plateforme', 'declaration_vote'];

export const evidenceLevelFromCode: Readonly<Record<EvidenceCode, EvidenceLevel>> = {
  p: 'programme',
  l: 'livre_plateforme',
  d: 'declaration_vote',
};

export const evidenceCodeFromLevel: Readonly<Record<EvidenceLevel, EvidenceCode>> = {
  programme: 'p',
  livre_plateforme: 'l',
  declaration_vote: 'd',
};

/** Échelle d'accord −2 … +2. */
export type ScaleValue = -2 | -1 | 0 | 1 | 2;

export const SCALE_VALUES: readonly ScaleValue[] = [-2, -1, 0, 1, 2];

/** Case du tableau de positions : `null` = inconnue, sinon valeur et niveau de preuve. */
export type PositionCell = null | readonly [value: ScaleValue, level: EvidenceCode];

export type DatePrecision = 'day' | 'month' | 'year';

/** Date à précision variable : `2026`, `2026-03` ou `2026-03-14`. */
export type DateWithPrecision = { date: string; precision: DatePrecision };

export type Polarity = '+' | '-';

/** Gouvernance publiée telle quelle (FR-044), sans les seuils internes de validation. */
export type Governance = {
  inclusionCriteria: { id: string; kind: 'inclusion' | 'withdrawal'; text: string }[];
  neutralityChecklist: { id: string; text: string }[];
  evidenceLevels: { id: EvidenceLevel; label: string; definition: string }[];
  /** Gabarit d'URL de signalement ; `{title}` est remplacé par le titre encodé. */
  reportIssueUrl: string;
};

export type PublishedTheme = {
  id: string;
  label: string;
  description: string;
  axis: { negative: string; positive: string };
  order: number;
};

export type PublishedCandidate = {
  id: string;
  name: string;
  party: string;
  status: 'declared';
  /** Couverture FR-033, arrondie à 3 décimales. */
  coverage: number;
};

export type WithdrawnCandidate = {
  id: string;
  name: string;
  withdrawnAt: string;
  /** Identifiant du critère de retrait de `governance.inclusionCriteria`. */
  criterion: string;
};

export type PublishedQuestion = {
  id: string;
  text: string;
  /** Un ou deux thèmes ; le premier est le thème principal. */
  themes: string[];
  polarity: Polarity;
  /** Pouvoir discriminant FR-034, arrondi à 4 décimales. */
  discriminant: number;
};

/** `public/data/versions/<n>/main.json`. */
export type MainDataset = {
  version: number;
  publishedAt: string;
  themes: PublishedTheme[];
  candidates: PublishedCandidate[];
  withdrawn: WithdrawnCandidate[];
  questions: PublishedQuestion[];
  /** Pour chaque candidat inclus, un tableau aligné sur `questions`. */
  positions: Record<string, PositionCell[]>;
  governance: Governance;
};

export type PublishedSource = {
  url: string;
  title: string;
  kind: EvidenceLevel;
  publishedAt: DateWithPrecision;
  accessedAt: string;
  archiveUrl?: string;
};

export type PublishedPosition = {
  value: ScaleValue;
  level: EvidenceCode;
  quote: string;
  quoteSource: string;
  justification: string;
  old?: true;
  sources: string[];
};

/** `public/data/versions/<n>/candidates/<id>.json`. */
export type CandidateDetail = {
  version: number;
  candidate: { id: string; name: string; party: string };
  sources: Record<string, PublishedSource>;
  positions: Record<string, PublishedPosition>;
};

export type VersionEntry = {
  number: number;
  publishedAt: string;
  questionCount: number;
  candidateCount: number;
  mainHash: string;
  detailHashes: Record<string, string>;
};

/** `public/data/versions.json`. */
export type VersionRegistry = {
  current: number;
  versions: VersionEntry[];
};

/** Nombre maximal de versions (format de lien de la 003, FR-040). */
export const MAX_VERSIONS = 256;

/** Nombre maximal de thèmes publiés. */
export const MAX_THEMES = 24;
