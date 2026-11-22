// @vitest-environment node
// Règles de sélection 2 (007 FR-008 à FR-012, SC-001 à SC-004) : propriétés sur des banques
// générées, cas d'exemple et cas de référence sur la banque v2 réelle étiquetée en mémoire.
import { readFileSync } from 'node:fs';
import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import type { BankQuestion, BankVersion } from '../bank';
import { bankFromDataset } from '../bank';
import type { MainDataset } from '../dataset';
import { QUOTA_FLOOR, TARGET_COUNT, type Mode } from '../types';
import { byCoverage } from './fill';
import { fillQuotasBySubject } from './fill-subject';
import { computeQuotas } from './quotas';
import { selectQuestions } from './select';

type Spec = readonly (readonly [id: string, themes: readonly number[], subject: string, discriminant: number, coverage?: number])[];

/** Banque à règles 2 écrite à la main : `themeCount` thèmes `t00…`, questions `[id, thèmes, enjeu, D_q]`. */
function bankOf(themeCount: number, questions: Spec, selectionRules: 2 | 3 = 2): BankVersion {
  const themes = Array.from({ length: themeCount }, (_, index) => ({ id: `t${String(index).padStart(2, '0')}`, label: `T${index}`, index }));
  const sorted = [...questions].sort((a, b) => (a[0] < b[0] ? -1 : 1));
  const qs: BankQuestion[] = sorted.map(([id, themeIndices, subject, discriminant, coverage = 0], index) => ({ id, text: id, themeIndices, discriminant, subject, coverage, index }));
  return {
    version: 3,
    publishedAt: '2026-11-21',
    selectionRules,
    minQuestionCoverage: selectionRules === 3 ? 1 : null,
    themes,
    themeIndexById: new Map(themes.map((t) => [t.id, t.index])),
    questions: qs,
    questionById: new Map(qs.map((q) => [q.id, q])),
    candidates: [],
    positions: new Map(),
  };
}

const MODES: readonly Mode[] = ['full', 'short'];

/** Banque générée : 3 à 20 thèmes ; `own` questions propres par thème, plus des questions à deux thèmes ; `subjects` enjeux au plus. */
const bankArb = (opts: { distinct: boolean; minOwn: number }) =>
  fc
    .record({
      T: fc.integer({ min: 3, max: 20 }),
      subjectPool: fc.integer({ min: 4, max: 60 }),
      seed: fc.integer({ min: 0, max: 2 ** 30 }),
    })
    .chain(({ T, subjectPool, seed }) =>
      fc
        .record({
          own: fc.array(fc.integer({ min: opts.minOwn, max: 12 }), { minLength: T, maxLength: T }),
          shared: fc.array(fc.tuple(fc.integer({ min: 0, max: T - 1 }), fc.integer({ min: 0, max: T - 1 }), fc.integer({ min: 0, max: 1000 })), { maxLength: 30 }),
          d: fc.array(fc.integer({ min: 0, max: 200 }), { minLength: 400, maxLength: 400 }),
        })
        .map(({ own, shared, d }) => {
          const questions: [string, number[], string, number][] = [];
          let n = 0;
          const subj = (i: number) => (opts.distinct ? `s${i}` : `s${(i * 7919 + seed) % subjectPool}`);
          own.forEach((count, t) => {
            for (let k = 0; k < count; k++, n++) questions.push([`q${String(n).padStart(4, '0')}`, [t], subj(n), d[n % d.length]! / 100]);
          });
          for (const [a, b] of shared) {
            if (a === b) continue;
            questions.push([`q${String(n).padStart(4, '0')}`, [a, b], subj(n), d[n % d.length]! / 100]);
            n++;
          }
          return { T, own, bank: bankOf(T, questions) };
        }),
    );

const prioritiesArb = (T: number) => fc.uniqueArray(fc.integer({ min: 0, max: T - 1 }), { minLength: 3, maxLength: Math.min(5, T) }).map((a) => [...a].sort((x, y) => x - y));

function run(bank: BankVersion, mode: Mode, prio: readonly number[]) {
  const quotas = computeQuotas(bank, mode, prio);
  return { quotas, picked: fillQuotasBySubject(bank, quotas, prio, TARGET_COUNT[mode]) };
}

describe('fillQuotasBySubject : propriétés (US1)', () => {
  it('aucune paire de même enjeu, longueur min(N, enjeux distincts), ancrage valide, déterminisme', () => {
    fc.assert(
      fc.property(bankArb({ distinct: false, minOwn: 0 }), fc.constantFrom(...MODES), fc.nat(), ({ T, bank }, mode, salt) => {
        fc.pre(bank.themes.length === T);
        const prio = fc.sample(prioritiesArb(T), { numRuns: 1, seed: salt })[0]!;
        const { picked } = run(bank, mode, prio);
        const subjects = picked.map((p) => p.question.subject);
        expect(new Set(subjects).size).toBe(subjects.length);
        expect(new Set(picked.map((p) => p.question.id)).size).toBe(picked.length);
        const distinct = new Set(bank.questions.map((q) => q.subject)).size;
        expect(picked.length).toBe(Math.min(TARGET_COUNT[mode], distinct));
        for (const p of picked) expect(p.question.themeIndices).toContain(p.anchorThemeIndex);
        expect(run(bank, mode, prio).picked).toEqual(picked);
      }),
      { numRuns: 200 },
    );
  });

  it('selectQuestions en règles 2 ne contient aucun doublon d’enjeu', () => {
    fc.assert(
      fc.property(bankArb({ distinct: false, minOwn: 3 }), fc.constantFrom(...MODES), ({ bank }, mode) => {
        const prio = bank.themes.slice(0, 3).map((t) => t.id);
        const items = selectQuestions(bank, mode, prio).items;
        expect(new Set(items.map((i) => i.question.subject)).size).toBe(items.length);
      }),
      { numRuns: 100 },
    );
  });
});

describe('fillQuotasBySubject : couverture (US2)', () => {
  it('enjeux distincts et thèmes assez fournis : ancrées = quota exactement', () => {
    fc.assert(
      fc.property(bankArb({ distinct: true, minOwn: 12 }), fc.nat(), ({ T, bank }, salt) => {
        const prio = fc.sample(prioritiesArb(T), { numRuns: 1, seed: salt })[0]!;
        const { quotas, picked } = run(bank, 'short', prio);
        const anchored = bank.themes.map((t) => picked.filter((p) => p.anchorThemeIndex === t.index).length);
        // Les thèmes du second passage peuvent s'ajouter seulement si la somme des quotas < N, jamais ici.
        expect(anchored).toEqual(quotas);
      }),
      { numRuns: 100 },
    );
  });

  it('chaque thème a au moins min(plancher, questions propres) questions ancrées', () => {
    fc.assert(
      fc.property(bankArb({ distinct: true, minOwn: 0 }), fc.constantFrom(...MODES), fc.nat(), ({ T, own, bank }, mode, salt) => {
        const prio = fc.sample(prioritiesArb(T), { numRuns: 1, seed: salt })[0]!;
        const { picked } = run(bank, mode, prio);
        for (let t = 0; t < T; t++) {
          const anchored = picked.filter((p) => p.anchorThemeIndex === t).length;
          expect(anchored).toBeGreaterThanOrEqual(Math.min(QUOTA_FLOOR[mode], own[t]!));
        }
      }),
      { numRuns: 150 },
    );
  });

  it('une question à deux thèmes ne compte que pour son ancrage', () => {
    // t0 : une question propre et une partagée avec t1 ; quota 2 chacun ; la partagée ancrée sur t0 ne crédite pas t1.
    const bank = bankOf(2, [
      ['a-shared', [0, 1], 's-shared', 2],
      ['a-own0', [0], 's0', 1],
      ['b-own1', [1], 's1', 1.5],
      ['b-own1bis', [1], 's1bis', 1],
    ]);
    const picked = fillQuotasBySubject(bank, [2, 2], [0], 4);
    const byAnchor = (t: number) => picked.filter((p) => p.anchorThemeIndex === t).map((p) => p.question.id);
    expect(byAnchor(0)).toEqual(['a-shared', 'a-own0']);
    expect(byAnchor(1)).toEqual(['b-own1', 'b-own1bis']);
  });
});

describe('fillQuotasBySubject : exemples', () => {
  it('même enjeu sur deux thèmes : la plus discriminante est retenue, l’autre thème en prend une autre', () => {
    const bank = bankOf(2, [
      ['a-uniforme', [0], 'uniforme', 0.9],
      ['a-autre', [0], 'autre-a', 0.1],
      ['b-uniforme', [1], 'uniforme', 0.5],
      ['b-autre', [1], 'autre-b', 0.4],
    ]);
    const picked = fillQuotasBySubject(bank, [1, 1], [], 2);
    expect(picked.map((p) => p.question.id)).toEqual(['a-uniforme', 'b-autre']);
  });

  it('thème épuisé : reliquat réparti une question par thème et par tour, dans l’ordre de rotation', () => {
    // t0 prioritaire (rotation : t0, t1, t2) ; t2 n'a qu'une question ; quotas 1/1/1, cible 7.
    const bank = bankOf(3, [
      ...['a', 'b', 'c', 'd'].map((x, i) => [`x0-${x}`, [0], `s0${x}`, 1 - i / 10] as const),
      ...['a', 'b', 'c', 'd'].map((x, i) => [`x1-${x}`, [1], `s1${x}`, 1 - i / 10] as const),
      ['x2-a', [2], 's2a', 1],
    ]);
    const picked = fillQuotasBySubject(bank, [1, 1, 1], [0], 7);
    expect(picked.map((p) => p.question.id)).toEqual(['x0-a', 'x1-a', 'x2-a', 'x0-b', 'x1-b', 'x0-c', 'x1-c']);
    expect(picked.map((p) => p.pass)).toEqual([1, 1, 1, 2, 2, 2, 2]);
  });

  it('moins d’enjeux que N : la liste s’arrête à l’épuisement', () => {
    const bank = bankOf(2, [
      ['a', [0], 's', 1],
      ['b', [1], 's', 1],
    ]);
    expect(fillQuotasBySubject(bank, [3, 3], [], 6)).toHaveLength(1);
  });
});

describe('cas de référence sur la banque v2 étiquetée (US2 scénario 1, SC-003)', () => {
  const ds = JSON.parse(readFileSync('public/data/versions/2/main.json', 'utf8')) as MainDataset;
  const PAIRS: Record<string, string> = {
    'education-uniforme-obligatoire': 'uniforme-ecole',
    'societe-uniforme-ecole-publique': 'uniforme-ecole',
    'travail-retraite-62-ans': 'retraite-age-legal',
    'travail-retraite-au-dela-64-ans': 'retraite-age-legal',
    'societe-signes-religieux-sorties-scolaires': 'signes-religieux',
    'societe-signes-religieux-universite': 'signes-religieux',
  };
  const bank = bankFromDataset({
    ...ds,
    selectionRules: 2,
    questions: ds.questions.map((q) => ({ ...q, subject: PAIRS[q.id] ?? q.id })),
  });
  const idx = (id: string) => bank.themeIndexById.get(id)!;

  it('mode court, Éducation + Fiscalité + Immigration : Fiscalité 4 ancrées, 18 thèmes au moins 1', () => {
    const s = selectQuestions(bank, 'short', ['education', 'fiscalite', 'immigration']);
    expect(s.items).toHaveLength(25);
    const anchored = bank.themes.map((t) => s.items.filter((i) => i.anchorThemeIndex === t.index).length);
    expect(anchored[idx('fiscalite')]).toBe(4);
    expect(Math.min(...anchored)).toBeGreaterThanOrEqual(1);
  });

  it('Société + Travail + Éducation : une seule question par paire du constat', () => {
    for (const mode of MODES) {
      const s = selectQuestions(bank, mode, ['societe', 'travail', 'education']);
      for (const subject of new Set(Object.values(PAIRS))) {
        const n = s.items.filter((i) => i.question.subject === subject).length;
        expect(n).toBeLessThanOrEqual(1);
      }
    }
  });
});

/** Même banque, en règles 3, avec une couverture par question. */
function withCoverage(bank: BankVersion, coverage: readonly number[]): BankVersion {
  const questions = bank.questions.map((q, i) => ({ ...q, coverage: coverage[i % coverage.length]! }));
  return { ...bank, selectionRules: 3, minQuestionCoverage: 1, questions, questionById: new Map(questions.map((q) => [q.id, q])) };
}

const bank3Arb = (opts: { distinct: boolean; minOwn: number }) =>
  bankArb(opts).chain(({ T, own, bank }) =>
    fc.array(fc.integer({ min: 0, max: 18 }), { minLength: 1, maxLength: 60 }).map((coverage) => ({ T, own, bank: withCoverage(bank, coverage) })),
  );

function run3(bank: BankVersion, mode: Mode, prio: readonly number[]) {
  const quotas = computeQuotas(bank, mode, prio);
  return { quotas, picked: fillQuotasBySubject(bank, quotas, prio, TARGET_COUNT[mode], byCoverage) };
}

describe('règles 3 (009 US1) : propriétés', () => {
  it('une question par enjeu, N ou épuisement, ancrage valide, déterminisme', () => {
    fc.assert(
      fc.property(bank3Arb({ distinct: false, minOwn: 0 }), fc.constantFrom(...MODES), fc.nat(), ({ T, bank }, mode, salt) => {
        const prio = fc.sample(prioritiesArb(T), { numRuns: 1, seed: salt })[0]!;
        const { picked } = run3(bank, mode, prio);
        const subjects = picked.map((p) => p.question.subject);
        expect(new Set(subjects).size).toBe(subjects.length);
        expect(picked.length).toBe(Math.min(TARGET_COUNT[mode], new Set(bank.questions.map((q) => q.subject)).size));
        for (const p of picked) expect(p.question.themeIndices).toContain(p.anchorThemeIndex);
        expect(run3(bank, mode, prio).picked).toEqual(picked);
      }),
      { numRuns: 200 },
    );
  });

  it('quota d’ancrage atteint tant qu’il reste des questions éligibles', () => {
    fc.assert(
      fc.property(bank3Arb({ distinct: true, minOwn: 0 }), fc.constantFrom(...MODES), fc.nat(), ({ T, own, bank }, mode, salt) => {
        const prio = fc.sample(prioritiesArb(T), { numRuns: 1, seed: salt })[0]!;
        const { picked } = run3(bank, mode, prio);
        for (let t = 0; t < T; t++) {
          const anchored = picked.filter((p) => p.anchorThemeIndex === t).length;
          expect(anchored).toBeGreaterThanOrEqual(Math.min(QUOTA_FLOOR[mode], own[t]!));
        }
      }),
      { numRuns: 150 },
    );
  });

  it('monotonie : au premier passage, aucune question éligible non retenue du thème n’a une couverture supérieure', () => {
    fc.assert(
      fc.property(bank3Arb({ distinct: false, minOwn: 0 }), fc.constantFrom(...MODES), fc.nat(), ({ T, bank }, mode, salt) => {
        const prio = fc.sample(prioritiesArb(T), { numRuns: 1, seed: salt })[0]!;
        const { picked } = run3(bank, mode, prio);
        const selected = new Set<string>();
        const used = new Set<string | null>();
        for (const p of picked) {
          if (p.pass === 1) {
            for (const q of bank.questions) {
              if (!q.themeIndices.includes(p.anchorThemeIndex) || q.id === p.question.id) continue;
              if (selected.has(q.id) || used.has(q.subject)) continue;
              expect(q.coverage).toBeLessThanOrEqual(p.question.coverage);
            }
          }
          selected.add(p.question.id);
          used.add(p.question.subject);
        }
      }),
      { numRuns: 200 },
    );
  });

  it('selectQuestions en règles 3 suit la couverture et garde une question par enjeu', () => {
    fc.assert(
      fc.property(bank3Arb({ distinct: false, minOwn: 3 }), fc.constantFrom(...MODES), ({ bank }, mode) => {
        const prio = bank.themes.slice(0, 3).map((t) => t.id);
        const items = selectQuestions(bank, mode, prio).items;
        expect(new Set(items.map((i) => i.question.subject)).size).toBe(items.length);
        const { picked } = run3(bank, mode, [0, 1, 2]);
        expect(new Set(items.map((i) => i.question.id))).toEqual(new Set(picked.map((p) => p.question.id)));
      }),
      { numRuns: 100 },
    );
  });
});

describe('règles 3 (009 US1) : cas d’acceptation', () => {
  it('n° 1 : couvertures 13 contre 7, enjeux différents → 13, quel que soit D_q', () => {
    for (const [d13, d7] of [
      [0.1, 1.9],
      [1.9, 0.1],
    ] as const) {
      const bank = bankOf(
        1,
        [
          ['q-couverte', [0], 's-a', d13, 13],
          ['q-peu-couverte', [0], 's-b', d7, 7],
        ],
        3,
      );
      expect(fillQuotasBySubject(bank, [1], [0], 1, byCoverage).map((p) => p.question.id)).toEqual(['q-couverte']);
    }
  });

  it('n° 2 : couvertures égales → D_q, puis identifiant', () => {
    const byD = bankOf(
      1,
      [
        ['q-a', [0], 's-a', 0.5, 9],
        ['q-b', [0], 's-b', 1.2, 9],
      ],
      3,
    );
    expect(fillQuotasBySubject(byD, [1], [0], 1, byCoverage).map((p) => p.question.id)).toEqual(['q-b']);
    const byId = bankOf(
      1,
      [
        ['q-b', [0], 's-b', 1, 9],
        ['q-a', [0], 's-a', 1, 9],
      ],
      3,
    );
    expect(fillQuotasBySubject(byId, [1], [0], 1, byCoverage).map((p) => p.question.id)).toEqual(['q-a']);
  });

  it('selectQuestions branche les règles 3 sur la couverture et les règles 2 sur D_q', () => {
    const spec: Spec = [
      ['a-couverte', [0], 's-a', 0.1, 13],
      ['a-discriminante', [0], 's-a', 1.9, 7],
      ['b-1', [1], 's-c', 1, 1],
      ['c-1', [2], 's-d', 1, 1],
    ];
    // Même enjeu : une seule des deux questions du thème t00 peut être retenue.
    const first = (rules: 2 | 3) => selectQuestions(bankOf(3, spec, rules), 'short', ['t00', 't01', 't02']).items.find((i) => i.anchorThemeIndex === 0)!.question.id;
    expect(first(3)).toBe('a-couverte');
    expect(first(2)).toBe('a-discriminante');
  });
});
