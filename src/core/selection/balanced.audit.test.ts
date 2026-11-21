// @vitest-environment node
// Audit exhaustif des critères de succès de 007 (SC-001 à SC-004, R8) sur la dernière version
// publiée qui déclare `selectionRules: 2` : les 12 444 combinaisons de 3 à 5 thèmes prioritaires
// parmi 18, dans les deux modes. Sauté tant qu'aucune version publiée ne déclare les règles 2.
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { bankFromDataset, type BankVersion } from '../bank';
import type { MainDataset } from '../dataset';
import { QUOTA_FLOOR, TARGET_COUNT, type Mode } from '../types';
import { computeQuotas } from './quotas';
import { selectQuestions } from './select';

const ROOT = process.cwd();

function latestRules2(): BankVersion | null {
  const registry = JSON.parse(readFileSync(path.join(ROOT, 'public/data/versions.json'), 'utf8')) as { current: number };
  for (let v = registry.current; v >= 1; v--) {
    const file = path.join(ROOT, `public/data/versions/${v}/main.json`);
    if (!existsSync(file)) continue;
    const ds = JSON.parse(readFileSync(file, 'utf8')) as MainDataset;
    if (ds.selectionRules === 2) return bankFromDataset(ds);
  }
  return null;
}

function* combinations(n: number, sizes: readonly number[]): Generator<number[]> {
  for (const k of sizes) {
    const pick: number[] = [];
    function* rec(start: number): Generator<number[]> {
      if (pick.length === k) {
        yield [...pick];
        return;
      }
      for (let i = start; i < n; i++) {
        pick.push(i);
        yield* rec(i + 1);
        pick.pop();
      }
    }
    yield* rec(0);
  }
}

const bank = latestRules2();

describe.skipIf(bank === null)('audit exhaustif des règles 2 (SC-001 à SC-004)', () => {
  it('12 444 combinaisons × 2 modes', () => {
    const b = bank!;
    expect(b.themes).toHaveLength(18);
    let combos = 0;
    for (const prio of combinations(b.themes.length, [3, 4, 5])) {
      combos++;
      const ids = prio.map((i) => b.themes[i]!.id);
      for (const mode of ['full', 'short'] as Mode[]) {
        const s = selectQuestions(b, mode, ids);
        const tag = `${mode} ${ids.join('+')}`;
        // SC-004
        if (s.items.length !== TARGET_COUNT[mode]) throw new Error(`${tag} : ${s.items.length} questions`);
        // SC-001
        if (new Set(s.items.map((i) => i.question.subject)).size !== s.items.length) throw new Error(`${tag} : enjeu en double`);
        const anchored = b.themes.map((t) => s.items.filter((i) => i.anchorThemeIndex === t.index).length);
        // SC-002
        for (const t of b.themes) if (anchored[t.index]! < QUOTA_FLOOR[mode]) throw new Error(`${tag} : ${t.id} a ${anchored[t.index]} question(s) ancrée(s)`);
        // SC-003 : aucun thème au-dessus de son quota de plus d'une question, sauf si un autre n'a pas atteint le sien.
        const quotas = computeQuotas(b, mode, s.priorityIndices);
        const shortfall = b.themes.some((t) => anchored[t.index]! < quotas[t.index]!);
        if (!shortfall) for (const t of b.themes) if (anchored[t.index]! > quotas[t.index]! + 1) throw new Error(`${tag} : ${t.id} dépasse son quota`);
      }
    }
    expect(combos).toBe(12444);
  });
});
