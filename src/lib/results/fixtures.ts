// Données de test de la page de résultats : `ReadyData` construites avec le cœur (jamais à la main
// pour les scores, sauf `fakeBoard` qui fabrique des classements aux rangs voulus).
import { scoreCandidates, selectQuestions, type Answer, type BankVersion, type CandidateScore, type Mode, type ResultState, type Scoreboard, type Selection } from '@/core';
import { syntheticDataset } from '@/core/bank/fixtures';
import { questionnaireBankFrom } from '@/lib/questionnaire/bank-view';
import type { QuestionnaireBank } from '@/lib/questionnaire/types';
import type { ReadyData } from './types';

function questionnaireBankOf(bank: BankVersion): QuestionnaireBank {
  return { version: bank.version, publishedAt: bank.publishedAt, themes: bank.themes.map((t) => ({ ...t, description: '' })), bank };
}

export function readyFrom(
  bank: BankVersion,
  selection: Selection,
  state: ResultState,
  options: { prior?: ReadyData['prior']; versionCount?: number; board?: Scoreboard } = {},
): ReadyData {
  return {
    state,
    board: options.board ?? scoreCandidates({ bank, selection, state, versionCount: options.versionCount ?? bank.version }),
    bank,
    themes: bank.themes,
    prior: options.prior ?? null,
    currentBank: questionnaireBankOf(bank),
    shareUrl: 'https://exemple.test/resultats#1.x',
  };
}

export const SYNTH_PRIORITIES = ['t01', 't04', 't07', 't10'];

export function syntheticQuestionnaireBank(version = 1): QuestionnaireBank {
  return questionnaireBankFrom(syntheticDataset({ themes: 16, perTheme: 20, version }));
}

/** Résultat sur la banque synthétique : réponses données par une fonction de l'indice. */
export function syntheticReady(mode: Mode, answerAt: (i: number) => Answer, priorities = SYNTH_PRIORITIES, version = 1): ReadyData {
  const qb = syntheticQuestionnaireBank(version);
  const selection = selectQuestions(qb.bank, mode, priorities);
  const state: ResultState = { bankVersion: version, mode, priorities, answers: selection.items.map((_, i) => answerAt(i)) };
  return { ...readyFrom(qb.bank, selection, state), currentBank: qb };
}

/** Classement fabriqué : pourcentages globaux donnés, rangs attribués comme le cœur (1, 1, 3). */
export function fakeBoard(base: Scoreboard, percents: readonly number[]): Scoreboard {
  const template = base.ranked[0] ?? base.insufficient[0]!;
  const sorted = [...percents].sort((a, b) => b - a);
  let rank = 0;
  const ranked: CandidateScore[] = sorted.map((percent, i) => {
    if (i === 0 || percent !== sorted[i - 1]) rank = i + 1;
    const id = `k${String(i).padStart(2, '0')}`;
    return { ...template, candidate: { id, name: `Nom ${id}`, party: 'Parti' }, status: 'ranked', rank, band: percent >= 80 ? 'very-aligned' : percent >= 60 ? 'rather-aligned' : percent >= 40 ? 'mixed' : 'distant', global: { ...template.global!, percent } };
  });
  return { ...base, ranked, insufficient: [] };
}
