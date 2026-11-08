// @vitest-environment node
// SC-008 : classement de 22 candidats × 100 questions × 16 thèmes, seuil bloquant de 500 ms.
import { describe, expect, it } from 'vitest';
import { syntheticBank } from '../bank/fixtures';
import { decodeFragment, FRAGMENT_FULL_EXAMPLE } from '../codec';
import { selectQuestions } from '../selection';
import { scoreCandidates } from './score';

describe('budget temps du classement (SC-008)', () => {
  it('sélection + classement complet en moins de 500 ms', () => {
    const bank = syntheticBank();
    const priorities = ['t01', 't06', 't11', 't12', 't15'];
    const started = performance.now();
    const selection = selectQuestions(bank, 'full', priorities);
    const answers = selection.items.map((_, i) => ([-2, -1, 0, 1, 2, 'skipped'] as const)[i % 6]!);
    const board = scoreCandidates({ bank, selection, state: { bankVersion: 1, mode: 'full', priorities, answers }, versionCount: 1 });
    const elapsed = performance.now() - started;
    console.info(`SC-008 : classement de ${bank.candidates.length} candidats × ${selection.items.length} questions en ${elapsed.toFixed(1)} ms`);
    expect(board.ranked.length + board.insufficient.length).toBe(22);
    expect(selection.items).toHaveLength(100);
    expect(elapsed).toBeLessThan(500);
  });

  it('décodage d’un lien en moins de 500 ms', () => {
    const bank = syntheticBank();
    const started = performance.now();
    const decoded = decodeFragment(FRAGMENT_FULL_EXAMPLE.fragment, bank);
    const elapsed = performance.now() - started;
    console.info(`SC-008 : décodage d’un lien complet en ${elapsed.toFixed(1)} ms`);
    expect(decoded.ok).toBe(true);
    expect(elapsed).toBeLessThan(500);
  });
});
