// @vitest-environment node
// SC-004 et SC-006 : énumération des 6 748 sous-ensembles de 3 à 5 thèmes parmi 16, dans les
// deux modes (13 496 sélections).
import { describe, expect, it } from 'vitest';
import { syntheticBank } from '../bank/fixtures';
import { TARGET_COUNT, type Mode } from '../types';
import { selectQuestions } from './select';
import type { Selection } from './types';

/** SC-006 : un même ancrage consécutif n'est admis que lorsqu'un seul thème reste à présenter. */
function alternates(selection: Selection): boolean {
  const anchors = selection.items.map((i) => i.anchorThemeIndex);
  for (let i = 0; i + 1 < anchors.length; i++) if (anchors[i] === anchors[i + 1] && new Set(anchors.slice(i + 1)).size > 1) return false;
  return true;
}

function* subsets(n: number, k: number, start = 0, acc: number[] = []): Generator<number[]> {
  if (acc.length === k) {
    yield acc;
    return;
  }
  for (let i = start; i < n; i++) yield* subsets(n, k, i + 1, [...acc, i]);
}

describe('énumération exhaustive (SC-004, SC-006)', () => {
  it('13 496 combinaisons : Σ quotas = N, N questions distinctes, alternance, idempotence', { timeout: 120_000 }, () => {
    const bank = syntheticBank();
    const started = performance.now();
    let count = 0;
    for (const mode of ['full', 'short'] as Mode[]) {
      for (const k of [3, 4, 5]) {
        for (const subset of subsets(16, k)) {
          const ids = subset.map((i) => bank.themes[i]!.id);
          const s = selectQuestions(bank, mode, ids);
          const N = TARGET_COUNT[mode];
          if (s.quotas.reduce((a, b) => a + b, 0) !== N) expect.fail(`Σ quotas ≠ ${N} pour ${mode} ${ids}`);
          if (s.items.length !== N || new Set(s.items.map((i) => i.question.id)).size !== N) expect.fail(`sélection incorrecte pour ${mode} ${ids}`);
          if (!alternates(s)) expect.fail(`alternance rompue pour ${mode} ${ids}`);
          const again = selectQuestions(bank, mode, ids).items;
          if (again.some((item, i) => item.question.id !== s.items[i]!.question.id || item.anchorThemeIndex !== s.items[i]!.anchorThemeIndex)) expect.fail(`sélection instable pour ${mode} ${ids}`);
          count++;
        }
      }
    }
    const elapsed = performance.now() - started;
    console.info(`SC-004 : ${count} sélections en ${Math.round(elapsed)} ms`);
    expect(count).toBe(13_496);
  });
});
