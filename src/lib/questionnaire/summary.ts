// Résumé de l'écran de fin et remise aux résultats (contracts/storage-and-data.md § 4, R9, R10).
// FR-027 à FR-030 : comptes par sujet clé, seuil de fiabilité du cœur, état complet transmis
// dans le fragment par le codec de la 003. Aucun calcul de score ici.
import { encodeFragment, MIN_THEME_QUESTIONS, normalizePriorities, type ResultState, type Selection } from '@/core';
import type { Draft, EndSummary, QuestionnaireBank, ThemeSummary } from './types';

export function summarize(draft: Draft, bank: QuestionnaireBank, selection: Selection): EndSummary {
  const priorities = normalizePriorities(bank.bank, draft.priorities);
  const themes: ThemeSummary[] = priorities.map((id) => {
    const index = bank.bank.themeIndexById.get(id)!;
    let answered = 0;
    let skipped = 0;
    let unanswered = 0;
    selection.items.forEach((item, position) => {
      if (!item.question.themeIndices.includes(index)) return;
      const a = draft.answers[position];
      if (a === 'skipped') skipped++;
      else if (a === 'unanswered' || a === undefined) unanswered++;
      else answered++;
    });
    return { themeId: id, label: bank.themes[index]!.label, answered, skipped, unanswered, reliable: answered >= MIN_THEME_QUESTIONS };
  });
  return {
    themes,
    warning: themes.some((t) => !t.reliable),
    totalAnswered: draft.answers.filter((a) => typeof a === 'number').length,
    totalSkipped: draft.answers.filter((a) => a === 'skipped').length,
  };
}

export function resultStateFromDraft(draft: Draft, bank: QuestionnaireBank): ResultState {
  return {
    bankVersion: draft.bankVersion,
    mode: draft.mode,
    priorities: normalizePriorities(bank.bank, draft.priorities),
    answers: [...draft.answers],
  };
}

/** Lien vers les résultats portant l'état complet dans le fragment (`/resultats#1.…`). */
export function resultHref(draft: Draft, bank: QuestionnaireBank): string {
  return `/resultats${encodeFragment(resultStateFromDraft(draft, bank), bank.bank)}`;
}
