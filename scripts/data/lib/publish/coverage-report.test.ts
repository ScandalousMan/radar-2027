// @vitest-environment node
// Rapport de couverture (009 FR-008, R5) : structure, statistiques, critères de succès, Markdown.
import { describe, expect, it } from 'vitest';
import { syntheticDatasetRules3 } from '@/core/bank/fixtures';
import { buildCoverageReport, combinations, renderCoverageMarkdown, successCriteria } from './coverage-report';

describe('combinations', () => {
  it('816 triplets et 12 444 combinaisons de 3 à 5 parmi 18', () => {
    expect([...combinations(18, [3])]).toHaveLength(816);
    expect([...combinations(18, [3, 4, 5])]).toHaveLength(12_444);
    expect([...combinations(4, [3, 4, 5])]).toHaveLength(5);
  });
});

describe('buildCoverageReport', () => {
  const main = syntheticDatasetRules3({ themes: 4, perTheme: 6, candidates: 5, version: 5 });
  const report = buildCoverageReport({
    main,
    generatedAt: '2026-11-22',
    reserve: [
      { id: 'r1', theme: 't00' },
      { id: 'r2', theme: 't00' },
      { id: 'r3', theme: 't02' },
    ],
    completed: [{ theme: 't01', before: 1, subjects: 3, added: ['t01-q05'] }],
    warnings: ['Thème t01 complété.'],
  });

  it('suit la structure de data-model § 4', () => {
    expect(Object.keys(report)).toEqual(['version', 'generatedAt', 'minQuestionCoverage', 'maxActiveQuestions', 'themes', 'warnings', 'candidates', 'ranked', 'successCriteria']);
    expect(report.version).toBe(5);
    expect(report.minQuestionCoverage).toBe(2);
    expect(report.maxActiveQuestions).toBe(120);
    expect(report.themes.find((t) => t.id === 't00')).toMatchObject({ active: 6, reserve: 2, subjects: 6, completed: false });
    expect(report.themes.find((t) => t.id === 't01')!.completed).toBe(true);
    expect(report.warnings).toEqual([{ theme: 't01', subjects: 3, message: 'Thème t01 complété.' }]);
    expect(report.candidates).toHaveLength(5);
    expect(report.ranked.byTriple).toHaveLength(4);
    expect(report.ranked.byTriple[0]!.priorities).toEqual(['t00', 't01', 't02']);
  });

  it('min ≤ médiane ≤ max, bornés par le nombre de candidats', () => {
    for (const mode of ['short', 'full'] as const) {
      const s = report.ranked[mode];
      expect(s.min).toBeLessThanOrEqual(s.median);
      expect(s.median).toBeLessThanOrEqual(s.max);
      expect(s.max).toBeLessThanOrEqual(5);
    }
  });

  it('Markdown en français avec ses tableaux', () => {
    const md = renderCoverageMarkdown(report, new Map([['t00', 'Économie']]));
    expect(md).toMatch(/^# Rapport de couverture — version 5/);
    expect(md).toContain('k = 2');
    expect(md).toContain('| Économie | 6 | 2 | 6 |  |');
    expect(md).toContain('## Combinaisons de 3 thèmes');
    expect(md).toContain('| SC-001 (court) |');
    expect(md).toContain('- Thème t01 complété.');
  });

  it('refuse une version hors règles 3', () => {
    const { selectionRules: _r, minQuestionCoverage: _k, ...rest } = main;
    expect(() => buildCoverageReport({ main: { ...rest, questions: rest.questions.map(({ coverage: _c, ...q }) => q) }, generatedAt: 'x', reserve: [], completed: [], warnings: [] })).toThrow(/règles 3/);
  });
});

describe('successCriteria aux bornes', () => {
  const at = (sMin: number, sMed: number, fMin: number, fMed: number) => successCriteria({ short: { min: sMin, median: sMed, max: 18 }, full: { min: fMin, median: fMed, max: 18 } });
  it('10/12 en court et 8/10 en complet sont atteints, une unité de moins ne l’est pas', () => {
    expect(at(10, 12, 8, 10)).toEqual({ sc001: true, sc002: true });
    expect(at(9, 12, 7, 10)).toEqual({ sc001: false, sc002: false });
    expect(at(10, 11.5, 8, 9.5)).toEqual({ sc001: false, sc002: false });
  });
});
