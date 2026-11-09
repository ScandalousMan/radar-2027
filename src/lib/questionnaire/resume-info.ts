// Ce que voit le répondant à l'accueil (data-model § 6). FR-021, FR-024 ; 005 : FR-035a, un
// brouillon complet (aucune question non répondue) devient « terminé » et mène aux résultats.
import type { VersionRegistry } from '@/core';
import type { Draft, ResumeInfo } from './types';

export function resumeInfoFrom(draft: Draft, registry: Pick<VersionRegistry, 'current'> | null): ResumeInfo {
  const versionChanged = registry !== null && draft.bankVersion !== registry.current;
  const complete = !draft.answers.includes('unanswered');
  return {
    mode: draft.mode,
    done: draft.answers.filter((a) => a !== 'unanswered').length,
    total: draft.answers.length,
    updatedAt: draft.updatedAt,
    status: registry === null ? 'unavailable' : complete ? 'complete' : versionChanged ? 'version-changed' : 'resumable',
    versionChanged,
  };
}
