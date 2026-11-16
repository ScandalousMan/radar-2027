// @vitest-environment node
// SC-007 (006) : sur la banque publiée `public/data/versions/2` (18 thèmes), toutes les
// combinaisons de 3 à 5 sujets prioritaires (12 444) dans les deux modes atteignent dès le premier
// passage les quotas de `computeQuotas` ; Éducation reçoit sa part.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { bankFromDataset, computeQuotas, scoreCandidates, selectQuestions, TARGET_COUNT, type MainDataset, type Mode, type ResultState } from '@/core';

const bank = bankFromDataset(JSON.parse(readFileSync(path.join(process.cwd(), 'public/data/versions/2/main.json'), 'utf8')) as MainDataset);
const ids = bank.themes.map((t) => t.id);
const EDU = ids.indexOf('education');
/** Énoncés disponibles par thème : un quota supérieur se comble au second passage (003 FR-023). */
const available = ids.map((_, t) => bank.questions.filter((q) => q.themeIndices.includes(t)).length);

function* subsets(n: number, k: number, start = 0, acc: number[] = []): Generator<number[]> {
  if (acc.length === k) {
    yield acc;
    return;
  }
  for (let i = start; i < n; i++) yield* subsets(n, k, i + 1, [...acc, i]);
}

describe('banque v2 : quotas (SC-007)', () => {
  it('18 thèmes, Éducation en dernier', () => {
    expect(ids).toHaveLength(18);
    expect(ids.at(-1)).toBe('education');
  });

  it('12 444 combinaisons × 2 modes : quotas respectés sans débordement', { timeout: 60_000 }, () => {
    let count = 0;
    let short = 0;
    for (const mode of ['full', 'short'] as Mode[]) {
      for (const k of [3, 4, 5]) {
        for (const subset of subsets(18, k)) {
          const s = selectQuestions(bank, mode, subset.map((i) => ids[i]!));
          const quotas = computeQuotas(bank, mode, subset);
          const N = TARGET_COUNT[mode];
          if (s.quotas.join() !== quotas.join()) expect.fail(`quotas différents pour ${mode} ${subset}`);
          if (s.items.length !== N || new Set(s.items.map((i) => i.question.id)).size !== N) expect.fail(`sélection incorrecte pour ${mode} ${subset}`);
          // 003 FR-022 : un énoncé retenu crédite tous ses thèmes ; chaque thème atteint son quota
          // dès le premier passage (aucun quota reporté sur un autre thème), sauf épuisement de ses énoncés.
          const credited = new Array<number>(ids.length).fill(0);
          for (const item of s.items.filter((i) => i.pass === 1)) for (const t of item.question.themeIndices) credited[t]! += 1;
          if (quotas.some((q, t) => q > available[t]!)) short++;
          if (credited.some((n, t) => n < Math.min(quotas[t]!, available[t]!))) expect.fail(`quota non atteint pour ${mode} ${subset} : ${credited} < ${quotas}`);
          count++;
        }
      }
    }
    expect(count).toBe(2 * 12_444);
    console.info(`SC-007 : ${count} sélections, dont ${short} avec un thème à court d'énoncés (comblé au second passage)`);
  });

  it('Éducation prioritaire, mode complet, 3 sujets : 12 ou 13 énoncés', () => {
    for (const others of subsets(17, 2)) {
      const s = selectQuestions(bank, 'full', [...others.map((i) => ids[i]!), 'education']);
      const edu = s.items.filter((i) => i.question.themeIndices.includes(EDU)).length;
      expect([12, 13]).toContain(s.quotas[EDU]);
      expect([12, 13]).toContain(edu);
    }
  });

  it('mode court, Éducation non prioritaire : comptée dans « autres thèmes »', () => {
    const priorities = ['economie', 'sante', 'securite'];
    const s = selectQuestions(bank, 'short', priorities);
    const eduItems = s.items.filter((i) => i.question.themeIndices.includes(EDU));
    expect(eduItems.length).toBeGreaterThan(0);
    const state: ResultState = { bankVersion: 2, mode: 'short', priorities, answers: s.items.map(() => 2 as const) };
    const board = scoreCandidates({ bank, selection: s, state, versionCount: 2 });
    const candidate = [...board.ranked, ...board.insufficient][0]!;
    expect(candidate.themes.some((t) => t.kind === 'theme' && t.themeId === 'education')).toBe(false);
    expect(candidate.themes.some((t) => t.kind === 'others' && t.count > 0)).toBe(true);
  });
});
