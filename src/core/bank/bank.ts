// Vue « version de banque » dérivée d'un jeu publié (data-model.md § 3, research.md R1, R7).
// FR-018, FR-020, FR-036, FR-037, FR-039, FR-041 : une version est immuable et se suffit à
// elle-même ; sélection, score et codec ne lisent jamais la forme des fichiers.
import type { MainDataset, PositionCell } from '../dataset';
import { MAX_THEMES } from '../dataset';
import { MAX_PRIORITIES, MIN_PRIORITIES, StateError } from '../types';

export type BankTheme = { readonly id: string; readonly label: string; readonly index: number };

export type BankQuestion = {
  readonly id: string;
  readonly text: string;
  /** Indices canoniques de ses 1 ou 2 thèmes (le premier est le thème principal éditorial). */
  readonly themeIndices: readonly number[];
  /** Pouvoir discriminant `D_q` figé par la 002, dans [0, 2] (FR-020). */
  readonly discriminant: number;
  /** Rang dans `BankVersion.questions` (et donc dans chaque ligne de `positions`). */
  readonly index: number;
};

export type BankCandidate = { readonly id: string; readonly name: string; readonly party: string };

export type BankVersion = {
  readonly version: number;
  readonly publishedAt: string;
  readonly themes: readonly BankTheme[];
  readonly themeIndexById: ReadonlyMap<string, number>;
  readonly questions: readonly BankQuestion[];
  readonly questionById: ReadonlyMap<string, BankQuestion>;
  readonly candidates: readonly BankCandidate[];
  /** Positions alignées sur `questions` ; `null` = inconnue. */
  readonly positions: ReadonlyMap<string, readonly PositionCell[]>;
};

export type BankErrorCode = 'too-many-themes' | 'duplicate-theme' | 'bad-theme-ref' | 'misaligned-positions' | 'too-many-themes-for-quotas';

/** Version de banque incompatible avec les invariants du domaine (erreur de configuration). */
export class BankError extends Error {
  readonly code: BankErrorCode;

  constructor(code: BankErrorCode, detail?: string) {
    super(detail ? `${code} : ${detail}` : code);
    this.name = 'BankError';
    this.code = code;
  }
}

/** Construit la vue d'une version ; lève `BankError` si un invariant de la 002 est violé. */
export function bankFromDataset(ds: MainDataset): BankVersion {
  if (ds.themes.length > MAX_THEMES) throw new BankError('too-many-themes', `${ds.themes.length} > ${MAX_THEMES}`);
  const themeIndexById = new Map<string, number>();
  const themes = ds.themes.map((t, index): BankTheme => {
    if (themeIndexById.has(t.id)) throw new BankError('duplicate-theme', t.id);
    themeIndexById.set(t.id, index);
    return { id: t.id, label: t.label, index };
  });

  const questionById = new Map<string, BankQuestion>();
  const questions = ds.questions.map((q, index): BankQuestion => {
    if (q.themes.length < 1 || q.themes.length > 2) throw new BankError('bad-theme-ref', `${q.id} : ${q.themes.length} thèmes`);
    const themeIndices = q.themes.map((id) => {
      const i = themeIndexById.get(id);
      if (i === undefined) throw new BankError('bad-theme-ref', `${q.id} : thème inconnu ${id}`);
      return i;
    });
    if (new Set(themeIndices).size !== themeIndices.length) throw new BankError('bad-theme-ref', `${q.id} : thème en double`);
    const question: BankQuestion = { id: q.id, text: q.text, themeIndices, discriminant: q.discriminant, index };
    questionById.set(q.id, question);
    return question;
  });

  const positions = new Map<string, readonly PositionCell[]>();
  const candidates = ds.candidates.map((c): BankCandidate => {
    const row = ds.positions[c.id];
    if (!row || row.length !== questions.length) throw new BankError('misaligned-positions', c.id);
    positions.set(c.id, row);
    return { id: c.id, name: c.name, party: c.party };
  });

  return { version: ds.version, publishedAt: ds.publishedAt, themes, themeIndexById, questions, questionById, candidates, positions };
}

/** Indices canoniques croissants de sujets prioritaires valides (3 à 5, distincts, connus). */
export function priorityIndicesOf(bank: BankVersion, ids: readonly string[]): readonly number[] {
  if (ids.length < MIN_PRIORITIES || ids.length > MAX_PRIORITIES) throw new StateError('bad-priorities', `${ids.length} sujets`);
  const indices = ids.map((id) => {
    const i = bank.themeIndexById.get(id);
    if (i === undefined) throw new StateError('bad-priorities', `thème inconnu ${id}`);
    return i;
  });
  if (new Set(indices).size !== indices.length) throw new StateError('bad-priorities', 'sujet en double');
  return [...indices].sort((a, b) => a - b);
}

/** Sujets prioritaires en ordre canonique ; lève `StateError('bad-priorities')` si invalides. */
export function normalizePriorities(bank: BankVersion, ids: readonly string[]): readonly string[] {
  return priorityIndicesOf(bank, ids).map((i) => bank.themes[i]!.id);
}
