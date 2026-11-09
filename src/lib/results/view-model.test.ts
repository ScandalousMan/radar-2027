// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { EXAMPLE_A, EXAMPLE_B, type ScoreExample } from '@/core';
import { fakeBoard, readyFrom, SYNTH_PRIORITIES, syntheticReady } from './fixtures';
import { OTHERS_KEY } from './types';
import { candidateSheet, comparisonView, orderedThemeKeys, resultsView } from './view-model';

const fromExample = (ex: ScoreExample) => readyFrom(ex.bank, ex.selection, ex.state);

describe('resultsView — exemples chiffrés de la 003 (SC-001)', () => {
  it.each([EXAMPLE_A, EXAMPLE_B])('$title : rang, pourcentage tronqué et bande du cœur', (ex) => {
    const view = resultsView(fromExample(ex));
    expect(view.ranking).toEqual([{ candidateId: 'cand', name: 'cand', rank: 1, tied: false, percent: ex.expected.global.percent, band: ex.expected.band, withdrawn: false }]);
    expect(view.insufficient).toEqual([]);
    expect(view.noneRanked).toBe(false);
    expect(view.header).toEqual({ priorities: [ex.state.priorities[0]], mode: 'full', answeredCount: ex.expected.coverage.answered, totalCount: ex.state.answers.length });
  });

  it('exemple A : la fiche reprend les thèmes, la couverture et les paliers', () => {
    const sheet = candidateSheet(fromExample(EXAMPLE_A), 'cand')!;
    expect(sheet.themes).toEqual([
      { key: 'economie', label: 'economie', priority: true, percent: 62, known: 2, answered: 2 },
      { key: 'sante', label: 'sante', priority: false, percent: null, known: 1, answered: 2 },
    ]);
    const rows = sheet.groups.flatMap((g) => g.questions);
    expect(rows.map((r) => [r.questionId, r.agreement, r.position])).toEqual([
      ['q1', 'close', 1],
      ['q2', 'intermediate', 1],
      ['q3', 'identical', 2],
      ['q4', null, null],
    ]);
    expect(rows[0]!.evidence).toBe('programme');
    expect(sheet.percent).toBe(62);
    expect(sheet.band).toBe('rather-aligned');
  });
});

describe('resultsView — classements construits', () => {
  const base = syntheticReady('short', () => 1);
  const withBoard = (percents: number[]) => ({ ...base, board: fakeBoard(base.board, percents) });

  it('ex æquo 1, 1, 3', () => {
    const rows = resultsView(withBoard([70, 70, 50])).ranking;
    expect(rows.map((r) => [r.rank, r.tied])).toEqual([
      [1, true],
      [1, true],
      [3, false],
    ]);
  });

  it('tous ex æquo', () => {
    expect(resultsView(withBoard([55, 55, 55])).ranking.every((r) => r.rank === 1 && r.tied)).toBe(true);
  });

  it('un seul classé', () => {
    expect(resultsView(withBoard([81])).ranking).toMatchObject([{ rank: 1, tied: false, band: 'very-aligned' }]);
  });

  it('aucun classé ⇒ noneRanked', () => {
    expect(resultsView(withBoard([])).noneRanked).toBe(true);
  });

  it('pourcentage jamais recalculé : identique à global.percent', () => {
    for (const row of resultsView(base).ranking) {
      const score = base.board.ranked.find((s) => s.candidate.id === row.candidateId)!;
      expect(row.percent).toBe(score.global!.percent);
      expect(row.band).toBe(score.band);
      expect(row.rank).toBe(score.rank);
    }
  });
});

describe('données insuffisantes', () => {
  // Trois réponses seulement : aucun sujet clé n'a deux questions exploitables.
  const data = syntheticReady('short', (i) => (i < 3 ? 1 : 'unanswered'));

  it('unknown = answered − known, aucun classé', () => {
    const view = resultsView(data);
    expect(view.noneRanked).toBe(true);
    expect(view.insufficient.length).toBe(22);
    for (const row of view.insufficient) {
      const score = data.board.insufficient.find((s) => s.candidate.id === row.candidateId)!;
      expect(row.answered).toBe(3);
      expect(row.unknown).toBe(3 - (score.coverage?.known ?? 0));
    }
  });

  it('fiche d’un insuffisant : ni rang ni pourcentage global', () => {
    const sheet = candidateSheet(data, data.board.insufficient[0]!.candidate.id)!;
    expect(sheet).toMatchObject({ status: 'insufficient-data', rank: null, percent: null, band: null, unansweredCount: 22 });
  });
});

describe('fiche et ordre des thèmes', () => {
  it('mode court : sujets clés puis la ligne others', () => {
    const data = syntheticReady('short', () => 2);
    expect(orderedThemeKeys(data)).toEqual([...SYNTH_PRIORITIES, OTHERS_KEY]);
    const sheet = candidateSheet(data, 'c00')!;
    expect(sheet.themes.map((t) => [t.key, t.priority])).toEqual([...SYNTH_PRIORITIES.map((id) => [id, true]), [OTHERS_KEY, false]]);
    expect(sheet.themes.at(-1)!.label).toBe('');
  });

  it('mode complet : sujets clés puis les 12 autres en ordre canonique', () => {
    const data = syntheticReady('full', () => 0, ['t02', 't05', 't08']);
    const keys = orderedThemeKeys(data);
    expect(keys.slice(0, 3)).toEqual(['t02', 't05', 't08']);
    expect(keys.slice(3)).toEqual(Array.from({ length: 16 }, (_, i) => `t${String(i).padStart(2, '0')}`).filter((id) => !['t02', 't05', 't08'].includes(id)));
  });

  it('chaque question répondue apparaît une seule fois (y compris à deux thèmes)', () => {
    const data = syntheticReady('full', (i) => ([-2, -1, 0, 1, 2] as const)[i % 5]!, ['t02', 't05', 't08']);
    const sheet = candidateSheet(data, 'c03')!;
    const ids = sheet.groups.flatMap((g) => g.questions.map((q) => q.questionId));
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.length).toBe(100);
    const twoThemes = sheet.groups.flatMap((g) => g.questions).filter((q) => q.themeLabels.length === 2);
    expect(twoThemes.length).toBeGreaterThan(0);
    // Groupes dans l'ordre des thèmes de la fiche.
    const order = sheet.themes.map((t) => t.key);
    const groupOrder = sheet.groups.map((g) => order.indexOf(g.key));
    expect([...groupOrder].sort((a, b) => a - b)).toEqual(groupOrder);
  });

  it('couverture par thème : known = questions exploitables, answered = questions répondues du thème', () => {
    const data = syntheticReady('full', () => 1, ['t02', 't05', 't08']);
    const score = data.board.ranked.concat(data.board.insufficient).find((s) => s.candidate.id === 'c01')!;
    const sheet = candidateSheet(data, 'c01')!;
    for (const row of sheet.themes) {
      const theme = score.themes.find((t) => t.kind === 'theme' && t.themeId === row.key)!;
      expect(row.known).toBe(theme.count);
      expect(row.known).toBeLessThanOrEqual(row.answered);
    }
  });

  it('questions passées et non répondues', () => {
    const data = syntheticReady('short', (i) => (i < 5 ? 'skipped' : i < 8 ? 'unanswered' : 1));
    const sheet = candidateSheet(data, 'c02')!;
    expect(sheet.skipped).toHaveLength(5);
    expect(sheet.unansweredCount).toBe(3);
    expect(sheet.groups.flatMap((g) => g.questions)).toHaveLength(17);
    expect(sheet.skipped.every((s) => !('agreement' in s))).toBe(true);
  });

  it('candidat inconnu ⇒ null', () => {
    expect(candidateSheet(syntheticReady('short', () => 1), 'zz')).toBeNull();
  });
});

describe('comparaison', () => {
  const data = syntheticReady('short', () => 1);

  it('2 colonnes, emplacements dans l’ordre d’ajout, lignes dans l’ordre de la fiche', () => {
    const view = comparisonView(data, ['c05', 'c01']);
    expect(view.columns.map((c) => [c.candidateId, c.slot])).toEqual([
      ['c05', 1],
      ['c01', 2],
    ]);
    expect(view.rows.map((r) => r.key)).toEqual([...SYNTH_PRIORITIES, OTHERS_KEY]);
    expect(view.rows[0]!.values).toEqual([candidateSheet(data, 'c05')!.themes[0]!.percent, candidateSheet(data, 'c01')!.themes[0]!.percent]);
  });

  it('3 colonnes ; global null pour un insuffisant', () => {
    const few = syntheticReady('short', (i) => (i < 3 ? 1 : 'unanswered'));
    const view = comparisonView(few, ['c00', 'c01', 'c02']);
    expect(view.columns.map((c) => c.slot)).toEqual([1, 2, 3]);
    expect(view.columns.every((c) => c.global === null)).toBe(true);
  });
});

describe('ancienne version', () => {
  it('withdrawn d’après prior.withdrawnIds, compte dans prior', () => {
    const base = syntheticReady('short', () => 1);
    const data = { ...base, prior: { publishedAt: '2026-11-08', withdrawnIds: ['c21'] } };
    const view = resultsView(data);
    const all = [...view.ranking, ...view.insufficient];
    expect(all.filter((r) => r.withdrawn).map((r) => r.candidateId)).toEqual(['c21']);
    expect(view.prior).toEqual({ publishedAt: '2026-11-08', withdrawnCount: 1 });
    expect(candidateSheet(data, 'c21')!.withdrawn).toBe(true);
  });
});
