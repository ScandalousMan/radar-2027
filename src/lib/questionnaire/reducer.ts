// Transitions pures du brouillon (data-model.md § 4, contracts/routes-and-state.md § Réducteur, R3).
// FR-012 à FR-015, FR-018, FR-020 : réponses à des positions et curseur ; aucune règle de
// sélection ni de score. L'horodatage est porté par l'action, jamais lu ici.
import { isAnswer, type Selection } from '@/core';
import type { Action, Draft } from './types';

export type ReduceContext = { readonly selection: Selection | null };

const sameList = (a: readonly string[], b: readonly string[]) => a.length === b.length && a.every((v, i) => v === b[i]);

/** Vrai si le brouillon correspond au triplet (version, mode, sujets clés). */
export function sameTriplet(draft: Draft, bankVersion: number, mode: Draft['mode'], priorities: readonly string[]): boolean {
  return draft.bankVersion === bankVersion && draft.mode === mode && sameList(draft.priorities, priorities);
}

export function reduce(draft: Draft | null, action: Action, ctx: ReduceContext): Draft | null {
  switch (action.type) {
    case 'start': {
      // Même triplet qu'un brouillon existant : reprise implicite (R13).
      if (draft && sameTriplet(draft, action.bank.version, action.mode, action.priorities)) return draft;
      const selection = ctx.selection;
      if (!selection || selection.mode !== action.mode || selection.items.length === 0) return draft;
      return {
        format: 1,
        bankVersion: action.bank.version,
        mode: action.mode,
        priorities: [...action.priorities],
        answers: selection.items.map(() => 'unanswered' as const),
        position: 0,
        updatedAt: action.now,
      };
    }
    case 'answer': {
      // Une réponse visant une autre position (double activation) est ignorée.
      if (!draft || action.position !== draft.position || !isAnswer(action.answer) || (action.answer as string) === 'unanswered') return draft;
      const answers = draft.answers.map((a, i) => (i === action.position ? action.answer : a));
      return { ...draft, answers, updatedAt: action.now };
    }
    case 'next': {
      if (!draft || draft.position >= draft.answers.length - 1) return draft;
      return { ...draft, position: draft.position + 1, updatedAt: action.now };
    }
    case 'previous': {
      if (!draft || draft.position <= 0) return draft;
      return { ...draft, position: draft.position - 1, updatedAt: action.now };
    }
    case 'goTo': {
      if (!draft || !Number.isInteger(action.position) || action.position < 0 || action.position >= draft.answers.length) return draft;
      if (action.position === draft.position) return draft;
      return { ...draft, position: action.position, updatedAt: action.now };
    }
    case 'resume':
      return action.draft;
    case 'reset':
    case 'clear':
      return null;
  }
}

/** Vrai sur la dernière question : `next` y mène à l'écran de fin. */
export function isCompleted(draft: Draft): boolean {
  return draft.position === draft.answers.length - 1;
}

/** Première position non traitée, sinon la dernière (FR-014, R14). */
export function firstUnanswered(draft: Pick<Draft, 'answers'>): number {
  const i = draft.answers.indexOf('unanswered');
  return i === -1 ? Math.max(0, draft.answers.length - 1) : i;
}
