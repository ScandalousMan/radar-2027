// @vitest-environment node
// Audit de couverture (009, contrat core-selection-delta § Audit de couverture) : propriétés sur des
// banques et sélections générées, cas fixes et test croisé avec `scoreCandidates`.
import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { bankFromDataset, type BankVersion } from '../bank';
import { selectionOf, syntheticBank } from '../bank/fixtures';
import type { MainDataset, PositionCell } from '../dataset';
import { minimalMainDataset } from '../dataset/fixture';
import { scoreCandidates } from '../score';
import { missingForThreshold, rankedCandidates } from './coverage-audit';
import { selectQuestions } from './select';
import type { Selection } from './types';

/** Banque générée : `T` thèmes, questions `[thèmes]`, candidats avec cellules connues ou non. */
function bankFrom(T: number, questionThemes: readonly (readonly number[])[], known: readonly (readonly boolean[])[]): BankVersion {
  const base = minimalMainDataset();
  const themes = Array.from({ length: T }, (_, i) => ({ id: `t${i}`, label: `T${i}`, description: '', axis: { negative: 'm', positive: 'p' }, order: i }));
  const questions = questionThemes.map((ts, i) => ({ id: `q${String(i).padStart(2, '0')}`, text: 'É.', themes: ts.map((t) => `t${t}`), polarity: '+' as const, discriminant: 1 }));
  const candidates = known.map((_, k) => ({ id: `c${k}`, name: 'N', party: 'P', status: 'declared' as const, coverage: 0 }));
  const positions: Record<string, PositionCell[]> = Object.fromEntries(known.map((row, k) => [`c${k}`, questions.map((_, i) => (row[i] ? ([1, 'p'] as const) : null))]));
  return bankFromDataset({ ...base, themes, questions, candidates, positions } satisfies MainDataset);
}

const caseArb = fc
  .record({ T: fc.integer({ min: 3, max: 5 }), Q: fc.integer({ min: 1, max: 9 }), C: fc.integer({ min: 1, max: 4 }), seed: fc.nat() })
  .chain(({ T, Q, C }) =>
    fc.record({
      T: fc.constant(T),
      themes: fc.array(fc.uniqueArray(fc.integer({ min: 0, max: T - 1 }), { minLength: 1, maxLength: 2 }), { minLength: Q, maxLength: Q }),
      known: fc.array(fc.array(fc.boolean(), { minLength: Q, maxLength: Q }), { minLength: C, maxLength: C }),
      chosen: fc.array(fc.boolean(), { minLength: Q, maxLength: Q }),
      prio: fc.uniqueArray(fc.integer({ min: 0, max: T - 1 }), { minLength: 1, maxLength: 3 }),
    }),
  )
  .map(({ T, themes, known, chosen, prio }) => {
    const bank = bankFrom(T, themes, known);
    const ids = bank.questions.filter((_, i) => chosen[i]).map((q) => q.id);
    return { bank, ids, prio: [...prio].sort((a, b) => a - b), known };
  });

const sel = (bank: BankVersion, ids: readonly string[], prio: readonly number[]): Selection => selectionOf(bank, ids, 'full', prio);

/** Oracle : candidats classés par le vrai score pour un répondant qui répond `+1` partout. */
function scoredRanked(bank: BankVersion, s: Selection): string[] {
  if (s.items.length === 0) return [];
  const priorities = s.priorityIndices.map((i) => bank.themes[i]!.id);
  const board = scoreCandidates({ bank, selection: s, state: { bankVersion: bank.version, mode: s.mode, priorities, answers: s.items.map(() => 1) }, versionCount: bank.version });
  return board.ranked.map((r) => r.candidate.id).sort();
}

describe('rankedCandidates et missingForThreshold : propriétés', () => {
  it('classé ⇔ aucune position manquante ; égal au classement du vrai score', () => {
    fc.assert(
      fc.property(caseArb, ({ bank, ids, prio }) => {
        const s = sel(bank, ids, prio);
        const ranked = rankedCandidates(bank, s);
        for (const c of bank.candidates) expect(ranked.includes(c.id)).toBe(missingForThreshold(bank, s, c.id) === 0);
        // L'oracle exige au moins 3 thèmes prioritaires seulement dans `selectQuestions` ; `scoreCandidates` les accepte tous.
        expect([...ranked].sort()).toEqual(scoredRanked(bank, s));
      }),
      { numRuns: 300 },
    );
  });

  it('monotonie : rendre connue une position ne retire aucun classé et ne fait pas croître le manque', () => {
    fc.assert(
      fc.property(caseArb, fc.nat(), fc.nat(), ({ bank, ids, prio, known }, ci, qi) => {
        fc.pre(ids.length > 0);
        const c = ci % known.length;
        const q = bank.questionById.get(ids[qi % ids.length]!)!;
        fc.pre(!known[c]![q.index]);
        const more = known.map((row, k) => row.map((v, i) => v || (k === c && i === q.index)));
        const bank2 = bankFrom(bank.themes.length, bank.questions.map((x) => x.themeIndices), more);
        const s1 = sel(bank, ids, prio);
        const s2 = sel(bank2, ids, prio);
        for (const id of rankedCandidates(bank, s1)) expect(rankedCandidates(bank2, s2)).toContain(id);
        for (const cand of bank.candidates) expect(missingForThreshold(bank2, s2, cand.id)).toBeLessThanOrEqual(missingForThreshold(bank, s1, cand.id));
      }),
      { numRuns: 300 },
    );
  });

  it('minimalité : le manque est le plus petit nombre de positions à rendre connues pour être classé', () => {
    fc.assert(
      fc.property(caseArb, ({ bank, ids, prio, known }) => {
        const s = sel(bank, ids, prio);
        for (let c = 0; c < known.length; c++) {
          const unknown = s.items.map((it) => it.question.index).filter((i) => !known[c]![i]);
          let best = Infinity;
          for (let mask = 0; mask < 1 << unknown.length; mask++) {
            const size = unknown.filter((_, b) => mask & (1 << b)).length;
            if (size >= best) continue;
            const more = known.map((row, k) => row.map((v, i) => v || (k === c && unknown.some((u, b) => u === i && mask & (1 << b)))));
            const bank2 = bankFrom(bank.themes.length, bank.questions.map((x) => x.themeIndices), more);
            if (scoredRanked(bank2, sel(bank2, ids, prio)).includes(`c${c}`)) best = size;
          }
          expect(missingForThreshold(bank, s, `c${c}`)).toBe(best);
        }
      }),
      { numRuns: 120 },
    );
  });

  it('déterminisme et indépendance de l’ordre des questions', () => {
    fc.assert(
      fc.property(caseArb, fc.nat(), ({ bank, ids, prio }, seed) => {
        const shuffled = [...ids].sort((a, b) => ((a.charCodeAt(1) * 31 + seed) % 17) - ((b.charCodeAt(1) * 31 + seed) % 17) || (a < b ? -1 : 1));
        const s1 = sel(bank, ids, prio);
        const s2 = sel(bank, shuffled, prio);
        expect(rankedCandidates(bank, s2)).toEqual(rankedCandidates(bank, s1));
        expect(rankedCandidates(bank, s1)).toEqual(rankedCandidates(bank, s1));
        for (const c of bank.candidates) expect(missingForThreshold(bank, s2, c.id)).toBe(missingForThreshold(bank, s1, c.id));
      }),
      { numRuns: 200 },
    );
  });
});

describe('rankedCandidates et missingForThreshold : cas fixes', () => {
  // 27 questions du thème prioritaire t0 : 16/27 ≈ 59 %, 17/27 ≈ 63 %, 0/27.
  const known = (n: number) => Array.from({ length: 27 }, (_, i) => i < n);
  const bank = bankFrom(
    3,
    Array.from({ length: 27 }, () => [0]),
    [known(16), known(17), known(0)],
  );
  const s = sel(
    bank,
    bank.questions.map((q) => q.id),
    [0],
  );

  it('59 % : 1 manquante ; ≥ 60 % : classé ; 0 % : 17 manquantes', () => {
    expect(rankedCandidates(bank, s)).toEqual(['c1']);
    expect(missingForThreshold(bank, s, 'c0')).toBe(1);
    expect(missingForThreshold(bank, s, 'c1')).toBe(0);
    expect(missingForThreshold(bank, s, 'c2')).toBe(17);
  });

  it('exactement 60 % (3/5) est classé (seuil inclusif)', () => {
    const b = bankFrom(3, Array.from({ length: 5 }, () => [0]), [[true, true, true, false, false]]);
    expect(rankedCandidates(b, sel(b, b.questions.map((q) => q.id), [0]))).toEqual(['c0']);
  });

  it('couverture atteinte mais aucun thème prioritaire avec deux positions connues : non classé', () => {
    // t0 prioritaire : q0 connue seule ; t1 : q1, q2 connues ; 3/4 = 75 % mais P indéfini.
    const b = bankFrom(3, [[0], [0], [1], [1]], [[true, false, true, true]]);
    const s2 = sel(b, b.questions.map((q) => q.id), [0]);
    expect(rankedCandidates(b, s2)).toEqual([]);
    expect(missingForThreshold(b, s2, 'c0')).toBe(1);
  });
});

describe('test croisé avec scoreCandidates sur la banque synthétique', () => {
  it('20 combinaisons : classés par le score = rankedCandidates', () => {
    const bank = syntheticBank();
    const T = bank.themes.length;
    for (let k = 0; k < 20; k++) {
      const prio = [k % T, (k * 5 + 3) % T, (k * 11 + 7) % T];
      if (new Set(prio).size < 3) prio[2] = (prio[2]! + 1) % T;
      if (new Set(prio).size < 3) continue;
      const ids = prio.map((i) => bank.themes[i]!.id);
      for (const mode of ['full', 'short'] as const) {
        const s = selectQuestions(bank, mode, ids);
        expect([...rankedCandidates(bank, s)].sort()).toEqual(scoredRanked(bank, s));
      }
    }
  });
});
