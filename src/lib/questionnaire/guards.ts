// Gardes d'accès aux étapes (data-model § 3, contracts/routes-and-state.md § Routes).
// Un accès direct sans prérequis redirige silencieusement vers l'étape manquante (FR-022).
import { MAX_PRIORITIES, MIN_PRIORITIES } from '@/core';
import type { Choice, Draft, Step } from './types';

export const ROUTES: Readonly<Record<Step, string>> = {
  themes: '/questionnaire',
  mode: '/questionnaire/mode',
  questions: '/questionnaire/questions',
  end: '/questionnaire/fin',
};

export function isChoiceValid(choice: Pick<Choice, 'priorities'>): boolean {
  return choice.priorities.length >= MIN_PRIORITIES && choice.priorities.length <= MAX_PRIORITIES;
}

/** `null` si l'étape est accessible, sinon la route vers laquelle rediriger. */
export function requiredStep(step: Step, state: { choice: Choice; draft: Draft | null }): string | null {
  if (state.draft) return null;
  const valid = isChoiceValid(state.choice);
  switch (step) {
    case 'themes':
      return null;
    case 'mode':
      return valid ? null : ROUTES.themes;
    case 'questions':
      if (!valid) return ROUTES.themes;
      return state.choice.mode ? null : ROUTES.mode;
    case 'end':
      return ROUTES.themes;
  }
}
