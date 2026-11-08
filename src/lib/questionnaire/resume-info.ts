// Ce que voit le répondant à l'accueil (data-model § 6). FR-021, FR-024.
import type { VersionRegistry } from '@/core';
import type { Draft, ResumeInfo } from './types';

export function resumeInfoFrom(draft: Draft, registry: Pick<VersionRegistry, 'current'> | null): ResumeInfo {
  return {
    mode: draft.mode,
    done: draft.answers.filter((a) => a !== 'unanswered').length,
    total: draft.answers.length,
    updatedAt: draft.updatedAt,
    status: registry === null ? 'unavailable' : draft.bankVersion === registry.current ? 'resumable' : 'version-changed',
  };
}
