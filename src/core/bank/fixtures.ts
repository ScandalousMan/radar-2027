// Banques fictives pour les tests du domaine (data-model.md § 8, research.md R11).
// Entièrement déterministes (formules, aucun aléatoire) ; la banque réelle n'est jamais lue.
// Non réexporté par `bank/index.ts`, sauf les banques des exemples A et B, utilisées par
// `score/examples.ts`.
import type { EvidenceCode, MainDataset, PositionCell, PublishedQuestion, ScaleValue } from '../dataset';
import type { Selection } from '../selection/types';
import type { Mode } from '../types';
import { bankFromDataset, type BankVersion } from './bank';

const LEVELS: readonly EvidenceCode[] = ['p', 'l', 'd'];

const pad = (n: number) => String(n).padStart(2, '0');

const GOVERNANCE: MainDataset['governance'] = {
  inclusionCriteria: [{ id: 'declaration', kind: 'inclusion', text: 'Déclaration.' }],
  neutralityChecklist: [{ id: 'single-claim', text: 'Une seule affirmation.' }],
  evidenceLevels: [{ id: 'programme', label: 'Programme', definition: 'Programme officiel.' }],
  reportIssueUrl: 'https://example.org/issues/new?title={title}',
};

function theme(id: string, order: number): MainDataset['themes'][number] {
  return { id, label: id, description: '', axis: { negative: 'moins', positive: 'plus' }, order };
}

function candidate(id: string): MainDataset['candidates'][number] {
  return { id, name: id, party: 'Parti', status: 'declared', coverage: 0 };
}

/** Position synthétique : `((NN + MM + k) mod 5) − 2`, inconnue quand `(NN + MM + k) mod 7 = 0`. */
function syntheticCell(nn: number, mm: number, k: number): PositionCell {
  const s = nn + mm + k;
  if (s % 7 === 0) return null;
  return [((s % 5) - 2) as ScaleValue, LEVELS[s % 3]!];
}

function syntheticQuestion(nn: number, mm: number, themes: number, perTheme: number): PublishedQuestion {
  const ids = [`t${pad(nn)}`];
  if (mm % 5 === 0 && themes > 1) ids.push(`t${pad((nn + 1) % themes)}`);
  return { id: `t${pad(nn)}-q${pad(mm)}`, text: `Énoncé ${nn}-${mm}.`, themes: ids, polarity: '+', discriminant: 2 - mm / perTheme };
}

export type SyntheticOptions = {
  themes?: number;
  perTheme?: number;
  version?: number;
  candidates?: number;
  publishedAt?: string;
};

/** Jeu publié synthétique (avant transformation en `BankVersion`). */
export function syntheticDataset({ themes = 16, perTheme = 20, version = 1, candidates = 22, publishedAt = '2026-11-08' }: SyntheticOptions = {}): MainDataset {
  const questions: PublishedQuestion[] = [];
  const coords: [number, number][] = [];
  for (let nn = 0; nn < themes; nn++)
    for (let mm = 0; mm < perTheme; mm++) {
      questions.push(syntheticQuestion(nn, mm, themes, perTheme));
      coords.push([nn, mm]);
    }
  const cands = Array.from({ length: candidates }, (_, k) => candidate(`c${pad(k)}`));
  const positions: Record<string, PositionCell[]> = {};
  cands.forEach((c, k) => {
    positions[c.id] = coords.map(([nn, mm]) => syntheticCell(nn, mm, k));
  });
  return {
    version,
    publishedAt,
    themes: Array.from({ length: themes }, (_, i) => theme(`t${pad(i)}`, i)),
    candidates: cands,
    withdrawn: [],
    questions,
    positions,
    governance: GOVERNANCE,
  };
}

/** Banque synthétique : `T` thèmes de `perTheme` questions, `D_q = 2 − MM/perTheme`. */
export function syntheticBank(options: SyntheticOptions = {}): BankVersion {
  return bankFromDataset(syntheticDataset(options));
}

/**
 * Deux versions successives (US4, SC-009) : la version 2 retire `t03-q07`, ajoute `t03-q20`,
 * change la position de `c05` sur `t04-q02` (−1 → +2) et retire le candidat `c21`.
 */
export function bankPair(): { v1: BankVersion; v2: BankVersion } {
  const d1 = syntheticDataset({ version: 1, publishedAt: '2026-11-08' });
  const d2 = syntheticDataset({ version: 2, publishedAt: '2026-11-15' });
  const added = syntheticQuestion(3, 20, 16, 20);
  const entries = d2.questions.map((q, i) => ({ q, i })).filter(({ q }) => q.id !== 't03-q07');
  const insertAt = entries.findIndex(({ q }) => q.id > added.id);
  const rows = (k: number, cid: string) => {
    const row: PositionCell[] = entries.map(({ i }) => d2.positions[cid]![i] ?? null);
    row.splice(insertAt, 0, syntheticCell(3, 20, k));
    return row;
  };
  const questions = entries.map(({ q }) => q);
  questions.splice(insertAt, 0, added);
  const candidates = d2.candidates.filter((c) => c.id !== 'c21');
  const positions: Record<string, PositionCell[]> = {};
  candidates.forEach((c) => {
    positions[c.id] = rows(Number(c.id.slice(1)), c.id);
  });
  const changed = questions.findIndex((q) => q.id === 't04-q02');
  positions['c05']![changed] = [2, 'p'];
  return { v1: bankFromDataset(d1), v2: bankFromDataset({ ...d2, questions, candidates, positions }) };
}

/**
 * Petite banque écrite à la main : thèmes, questions `[id, thèmes]` (D_q = 1) et positions par
 * candidat, alignées sur l'ordre des questions donné (qui doit être trié par identifiant).
 */
export function tinyBank(themes: readonly string[], questions: readonly (readonly [id: string, themes: readonly string[]])[], positions: Readonly<Record<string, readonly PositionCell[]>>): BankVersion {
  return bankFromDataset({
    version: 1,
    publishedAt: '2026-11-08',
    themes: themes.map((id, i) => theme(id, i)),
    candidates: Object.keys(positions).map(candidate),
    withdrawn: [],
    questions: questions.map(([id, ts]) => ({ id, text: `Énoncé ${id}.`, themes: [...ts], polarity: '+', discriminant: 1 })),
    positions: Object.fromEntries(Object.entries(positions).map(([c, row]) => [c, [...row]])),
    governance: GOVERNANCE,
  });
}

/** Exemple A de la spec : économie (q1, q2), santé (q3, q4), candidat aux positions +1, +1, +2, inconnue. */
export function exampleABank(): BankVersion {
  return tinyBank(
    ['economie', 'sante'],
    [
      ['q1', ['economie']],
      ['q2', ['economie']],
      ['q3', ['sante']],
      ['q4', ['sante']],
    ],
    { cand: [[1, 'p'], [1, 'p'], [2, 'p'], null] },
  );
}

/** Exemple B de la spec : trois thèmes de deux questions, candidat à 0 partout. */
export function exampleBBank(): BankVersion {
  return tinyBank(
    ['t1', 't2', 't3'],
    [
      ['q1', ['t1']],
      ['q2', ['t1']],
      ['q3', ['t2']],
      ['q4', ['t2']],
      ['q5', ['t3']],
      ['q6', ['t3']],
    ],
    { cand: [[0, 'p'], [0, 'p'], [0, 'p'], [0, 'p'], [0, 'p'], [0, 'p']] },
  );
}

/** Sélection littérale (tests de score) : ordre donné, thème d'ancrage = premier thème. */
export function selectionOf(bank: BankVersion, questionIds: readonly string[], mode: Mode = 'full', priorityIndices: readonly number[] = []): Selection {
  return {
    mode,
    priorityIndices,
    quotas: bank.themes.map(() => 0),
    items: questionIds.map((id, position) => {
      const question = bank.questionById.get(id);
      if (!question) throw new RangeError(`question inconnue ${id}`);
      return { question, anchorThemeIndex: question.themeIndices[0]!, position, pass: 1 as const };
    }),
  };
}
