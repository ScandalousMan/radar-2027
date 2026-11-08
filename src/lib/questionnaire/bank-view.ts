// Projection du jeu publié pour le parcours (contracts/storage-and-data.md § 3, R8).
// FR-003 (thèmes avec description, ordre canonique), FR-015 (N connu dès le choix du mode),
// FR-016 (ordre fourni par la sélection du cœur, jamais recalculé ici).
import { bankFromDataset, MODES, selectQuestions, type BankQuestion, type MainDataset, type Mode, type Selection } from '@/core';
import type { QuestionnaireBank, QuestionTheme } from './types';

export function questionnaireBankFrom(main: MainDataset): QuestionnaireBank {
  const bank = bankFromDataset(main);
  return {
    version: main.version,
    publishedAt: main.publishedAt,
    themes: main.themes.map((t, index) => ({ id: t.id, label: t.label, description: t.description, index })),
    bank,
  };
}

/** Sélection des deux modes pour des sujets clés valides (deux appels purs au cœur). */
export function selectionsFor(bank: QuestionnaireBank, priorities: readonly string[]): Record<Mode, Selection> {
  const entries = MODES.map((mode) => [mode, selectQuestions(bank.bank, mode, priorities)] as const);
  return Object.fromEntries(entries) as Record<Mode, Selection>;
}

/** Thèmes d'une question, sujet clé marqué. */
export function themesOf(bank: QuestionnaireBank, question: BankQuestion, priorities: readonly string[]): QuestionTheme[] {
  return question.themeIndices.map((i) => {
    const theme = bank.themes[i]!;
    return { id: theme.id, label: theme.label, priority: priorities.includes(theme.id) };
  });
}
