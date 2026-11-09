// Pré-remplissage du questionnaire depuis un état de résultats (point d'extension R14 de la 004 ;
// 005 : contracts/data-and-share.md § 4, data-model § 8 et § 9, R7).
// FR-028 et FR-010 de la 005 : « Modifier mes réponses » ; FR-032 : « Refaire le questionnaire
// avec les données actuelles ». Un nouveau résultat s'encode toujours avec la version courante
// (FR-038 de la 003) ; une réponse n'est reportée que vers une question de même identifiant.
import { MIN_PRIORITIES, normalizePriorities, selectQuestions, StateError, type Answer, type BankVersion, type ResultState } from '@/core';
import { DRAFT_FORMAT } from './storage';
import type { Draft, QuestionnaireBank } from './types';

export type CarryResult = { readonly kind: 'draft'; readonly draft: Draft } | { readonly kind: 'choose-themes'; readonly preselected: readonly string[] };

function firstUnanswered(answers: readonly Answer[]): number {
  const i = answers.indexOf('unanswered');
  return i === -1 ? 0 : i;
}

/** Brouillon identique à l'état (même version que la banque courante). */
export function draftFromResultState(state: ResultState, bank: QuestionnaireBank, now: string): Draft {
  if (state.bankVersion !== bank.version) throw new StateError('version-mismatch', `état ${state.bankVersion}, banque ${bank.version}`);
  const priorities = normalizePriorities(bank.bank, state.priorities);
  const answers = [...state.answers];
  if (selectQuestions(bank.bank, state.mode, priorities).items.length !== answers.length) throw new StateError('bad-answer-count');
  return { format: DRAFT_FORMAT, bankVersion: bank.version, mode: state.mode, priorities, answers, position: firstUnanswered(answers), updatedAt: now };
}

/**
 * Report d'un état d'une version antérieure vers la version courante : sujets clés encore
 * présents, sélection recalculée, réponses reportées par identifiant de question. Moins de trois
 * sujets subsistants ⇒ choix des sujets, avec ceux qui restent présélectionnés.
 */
export function carryOver(state: ResultState, linkBank: BankVersion, current: QuestionnaireBank, now: string): CarryResult {
  if (state.bankVersion === current.version) return { kind: 'draft', draft: draftFromResultState(state, current, now) };
  const kept = state.priorities.filter((id) => current.bank.themeIndexById.has(id));
  if (kept.length < MIN_PRIORITIES) return { kind: 'choose-themes', preselected: kept.length === 0 ? [] : normalizePrioritiesLoose(current, kept) };
  const priorities = normalizePriorities(current.bank, kept);
  const previous = new Map<string, Answer>();
  selectQuestions(linkBank, state.mode, state.priorities).items.forEach((item, i) => previous.set(item.question.id, state.answers[i] ?? 'unanswered'));
  const answers = selectQuestions(current.bank, state.mode, priorities).items.map((item) => previous.get(item.question.id) ?? 'unanswered');
  return { kind: 'draft', draft: { format: DRAFT_FORMAT, bankVersion: current.version, mode: state.mode, priorities, answers, position: firstUnanswered(answers), updatedAt: now } };
}

/** Ordre canonique d'une présélection incomplète (moins de trois sujets). */
function normalizePrioritiesLoose(current: QuestionnaireBank, ids: readonly string[]): string[] {
  return [...ids].sort((a, b) => current.bank.themeIndexById.get(a)! - current.bank.themeIndexById.get(b)!);
}

/** Vrai si un brouillon stocké diffère de celui qu'on s'apprête à écrire (position et date ignorées). */
export function needsConfirmation(stored: Draft | null, next: Draft): boolean {
  if (stored === null) return false;
  const same =
    stored.bankVersion === next.bankVersion &&
    stored.mode === next.mode &&
    stored.priorities.length === next.priorities.length &&
    stored.priorities.every((id, i) => id === next.priorities[i]) &&
    stored.answers.length === next.answers.length &&
    stored.answers.every((a, i) => a === next.answers[i]);
  return !same;
}
