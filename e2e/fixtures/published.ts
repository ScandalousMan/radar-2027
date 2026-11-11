// Banque fictive servie aux tests e2e par interception de route (R6 de la 004, R11 de la 005) :
// rien de fictif n'est publié sous public/data. Même jeu que les tests du domaine (16 thèmes ×
// 20 questions). Version 2 (005) : le candidat c21 ne se présente plus, c22 est ajouté et la
// position de c05 sur t04-q02 change ; fichiers de détail par candidat générés.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Page } from '@playwright/test';
import { bankFromDataset } from '../../src/core/bank/bank';
import { syntheticDataset } from '../../src/core/bank/fixtures';
import { encodeFragment } from '../../src/core/codec/encode';
import type { CandidateDetail, MainDataset, PositionCell } from '../../src/core/dataset/types';
import { scoreCandidates } from '../../src/core/score/score';
import { selectQuestions } from '../../src/core/selection/select';
import type { Mode, ResultState } from '../../src/core/types';

export const PUBLISHED_AT: Record<number, string> = { 1: '2026-11-08', 2: '2026-11-15' };

export const WITHDRAWN_IN_V2 = 'c21';
export const ADDED_IN_V2 = 'c22';

export function dataset(version = 1): MainDataset {
  const base = syntheticDataset({ themes: 16, perTheme: 20, version, publishedAt: PUBLISHED_AT[version] ?? '2026-11-08' });
  if (version < 2) return base;
  // Versions ≥ 2 : c21 retiré, c22 ajouté (positions de c20 décalées), une position changée.
  const positions: Record<string, PositionCell[]> = { ...base.positions };
  delete positions[WITHDRAWN_IN_V2];
  positions[ADDED_IN_V2] = base.positions['c20']!.map((cell, i) => (i % 3 === 0 ? cell : null));
  const changed = base.questions.findIndex((q) => q.id === 't04-q02');
  positions['c05'] = base.positions['c05']!.map((cell, i) => (i === changed ? ([2, 'p'] as const) : cell));
  const candidates = [...base.candidates.filter((c) => c.id !== WITHDRAWN_IN_V2), { id: ADDED_IN_V2, name: ADDED_IN_V2, party: 'Parti', status: 'declared' as const, coverage: 0 }];
  return { ...base, candidates, withdrawn: [{ id: WITHDRAWN_IN_V2, name: WITHDRAWN_IN_V2, withdrawnAt: '2026-11-14', criterion: 'declaration' }], positions };
}

export const bankOf = (version = 1) => bankFromDataset(dataset(version));

export function registry(current: number) {
  return {
    current,
    versions: Array.from({ length: current }, (_, i) => ({
      number: i + 1,
      publishedAt: PUBLISHED_AT[i + 1] ?? '2026-11-08',
      questionCount: 320,
      candidateCount: 22,
      mainHash: `sha256:${'0'.repeat(64)}`,
      detailHashes: {},
    })),
  };
}

/** Questions dont le fichier de détail omet la position (cas « citation indisponible »). */
export const missingQuote = (questionIndex: number) => questionIndex % 11 === 5;

/** Fichier de détail fictif d'un candidat (citations et sources en `https://exemple.invalid/…`). */
export function detail(version: number, candidateId: string): CandidateDetail | null {
  const ds = dataset(version);
  const candidate = ds.candidates.find((c) => c.id === candidateId);
  if (!candidate) return null;
  const sources: CandidateDetail['sources'] = {
    programme: { url: `https://exemple.invalid/${candidateId}/programme`, title: `Programme de ${candidate.name}`, kind: 'programme', publishedAt: { date: '2026-03-14', precision: 'day' }, accessedAt: '2026-11-01' },
    livre: { url: `https://exemple.invalid/${candidateId}/livre`, title: `Livre de ${candidate.name}`, kind: 'livre_plateforme', publishedAt: { date: '2025-09', precision: 'month' }, accessedAt: '2026-11-01' },
    declaration: { url: `https://exemple.invalid/${candidateId}/declaration`, title: `Déclaration de ${candidate.name}`, kind: 'declaration_vote', publishedAt: { date: '2026', precision: 'year' }, accessedAt: '2026-11-01' },
  };
  const sourceOf = { p: 'programme', l: 'livre', d: 'declaration' } as const;
  const positions: CandidateDetail['positions'] = {};
  ds.questions.forEach((q, i) => {
    const cell = ds.positions[candidateId]![i];
    if (!cell || missingQuote(i)) return;
    const source = sourceOf[cell[1]];
    positions[q.id] = { value: cell[0], level: cell[1], quote: `Citation de ${candidate.name} sur ${q.id}.`, quoteSource: source, justification: 'Justification fictive.', sources: [source] };
  });
  return { version, candidate: { id: candidate.id, name: candidate.name, party: candidate.party }, sources, positions };
}

/** Répond aux requêtes du jeu publié : registre `{ current }`, `main.json` et fichiers de détail de chaque version. */
export async function servePublished(page: Page, { current = 1 }: { current?: number } = {}) {
  await page.route('**/data/versions.json', (route) => route.fulfill({ json: registry(current) }));
  await page.route('**/data/versions/*/main.json', (route) => {
    const version = Number(/versions\/(\d+)\/main\.json/.exec(route.request().url())?.[1]);
    if (!version || version > current) return route.fulfill({ status: 404, body: '' });
    return route.fulfill({ json: dataset(version) });
  });
  await page.route('**/data/versions/*/candidates/*.json', (route) => {
    const m = /versions\/(\d+)\/candidates\/([a-z0-9-]+)\.json$/.exec(route.request().url());
    const version = Number(m?.[1]);
    const body = m && version <= current ? detail(version, m[2]!) : null;
    return body ? route.fulfill({ json: body }) : route.fulfill({ status: 404, body: '' });
  });
}

/** Lien `/resultats#1.…` d'un état, encodé avec la banque de sa version. */
export function linkFor(state: ResultState): string {
  return `/resultats${encodeFragment(state, bankOf(state.bankVersion))}`;
}

/** État de résultat sur la banque fictive : réponses données par une fonction de l'indice. */
export function stateFor(mode: Mode, priorities: readonly string[], answerAt: (i: number) => ResultState['answers'][number], version = 1): ResultState {
  const n = selectQuestions(bankOf(version), mode, priorities).items.length;
  return { bankVersion: version, mode, priorities: [...priorities], answers: Array.from({ length: n }, (_, i) => answerAt(i)) };
}

/** Classement attendu, calculé par le cœur avec la seule version du lien. */
export function expectedBoard(state: ResultState, current = state.bankVersion) {
  const bank = bankOf(state.bankVersion);
  return scoreCandidates({ bank, selection: selectQuestions(bank, state.mode, state.priorities), state, versionCount: current });
}

/** Sélection attendue, calculée par le cœur à partir du même jeu. */
export function expectedSelection(mode: Mode, priorities: readonly string[], version = 1) {
  return selectQuestions(bankOf(version), mode, priorities);
}

type Messages = Record<string, unknown>;

/** Messages `fr` (lus depuis le fichier, comme dans home.spec.ts). */
export const fr = JSON.parse(readFileSync(join(__dirname, '../../src/i18n/messages/fr.json'), 'utf8')) as Messages;

/** Valeur d'une clé `a.b.c` de fr.json, espaces insécables remplacés par des espaces simples. */
export function msg(key: string, values: Record<string, string | number> = {}): string {
  let value = key.split('.').reduce<unknown>((node, part) => (node as Messages)[part], fr);
  if (typeof value !== 'string') throw new Error(`clé absente : ${key}`);
  for (const [name, v] of Object.entries(values)) value = (value as string).replaceAll(`{${name}}`, String(v));
  return (value as string).replace(/[  ]/g, ' ');
}
