'use client';
// Redirection silencieuse vers l'étape manquante (data-model § 3).
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { requiredStep } from '@/lib/questionnaire/guards';
import { useQuestionnaire } from '@/lib/questionnaire/store';
import type { Step } from '@/lib/questionnaire/types';

/** Vrai quand l'étape est accessible ; sinon redirige et renvoie faux. */
export function useStepGuard(step: Step, enabled = true): boolean {
  const router = useRouter();
  const { choice, draft } = useQuestionnaire();
  const target = requiredStep(step, { choice, draft });
  useEffect(() => {
    if (enabled && target) router.replace(target);
  }, [enabled, target, router]);
  return target === null;
}
