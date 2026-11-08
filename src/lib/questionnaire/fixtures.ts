// Banque fictive partagée par les tests du parcours (16 thèmes × 20 questions, version 1).
import { syntheticDataset } from '@/core/bank/fixtures';
import { questionnaireBankFrom } from './bank-view';
import type { Draft } from './types';
import type { Mode } from '@/core';

export function testBank(version = 1) {
  return questionnaireBankFrom(syntheticDataset({ themes: 16, perTheme: 20, version }));
}

export const PRIORITIES = ['t01', 't04', 't07', 't10'] as const;

export function testDraft(overrides: Partial<Draft> & { mode?: Mode } = {}): Draft {
  const mode = overrides.mode ?? 'short';
  const total = mode === 'short' ? 25 : 100;
  return {
    format: 1,
    bankVersion: 1,
    mode,
    priorities: [...PRIORITIES],
    answers: Array.from({ length: total }, () => 'unanswered' as const),
    position: 0,
    updatedAt: '2026-11-08T17:42:10.000Z',
    ...overrides,
  };
}
