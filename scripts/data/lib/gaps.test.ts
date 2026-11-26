// @vitest-environment node
// data:gaps (009 FR-009, R6) : trous listés, statut de banque, gain calculé à la main, départage,
// couples déjà cherchés, déterminisme et regroupement en missions.
import { describe, expect, it } from 'vitest';
import { computeGaps, missionsOf, renderGapsMarkdown } from './gaps';
import { computeActiveBank } from './publish/active-bank';
import { journalOf, researchContext } from './rules/testing';

describe('computeGaps sur la fixture minimale', () => {
  it('seuls les candidats déclarés × questions active sans position connue', () => {
    const ctx = researchContext();
    const { rows } = computeGaps(ctx, ctx.research);
    // 2 candidats × 30 questions actives − 3 positions connues.
    expect(rows).toHaveLength(57);
    expect(rows.some((r) => r.candidate === 'dupont' && r.question === 'economie-q01')).toBe(false);
    expect(rows.some((r) => r.candidate === 'martin' && r.question === 'environnement-q01')).toBe(false);
    expect(new Set(rows.map((r) => r.candidate))).toEqual(new Set(['dupont', 'martin']));
    expect(rows.map((r) => r.rank)).toEqual(rows.map((_, i) => i + 1));
  });

  it('gain Σ 1/m calculé à la main : banque de 9 questions sélectionnée entière dans les deux modes', () => {
    const ctx = researchContext();
    const bank = computeActiveBank(ctx);
    expect(bank.active).toHaveLength(9);
    const { rows } = computeGaps(ctx, ctx.research);
    // dupont : 2 connues sur 9, il en faut 6 (60 %) → m = 4 ; 2 sélections → gain 2 × 1/4.
    // martin : 1 connue sur 9 → m = 5 → gain 2 × 1/5.
    for (const r of rows.filter((x) => x.bank === 'active')) expect(r.gain).toBe(r.candidate === 'dupont' ? 0.5 : 0.4);
    // Réserve promouvable (c_q = k − 1 = 0) : banque de 10 questions, il en faut 6 → dupont m = 4, martin m = 5.
    for (const r of rows.filter((x) => x.bank === 'reserve-promotable')) expect(r.gain).toBe(r.candidate === 'dupont' ? 0.5 : 0.4);
    expect(rows.filter((r) => r.bank === 'reserve')).toEqual([]);
  });

  it('réserve non promouvable : gain nul, listée après', () => {
    const ctx = researchContext();
    const { k, rows } = computeGaps(ctx, ctx.research, { minCoverage: 2 });
    expect(k).toBe(2);
    const reserve = rows.filter((r) => r.bank === 'reserve');
    expect(reserve.length).toBeGreaterThan(0);
    for (const r of reserve) expect(r.gain).toBe(0);
    const lastPositive = rows.findLastIndex((r) => r.gain > 0);
    expect(rows.findIndex((r) => r.bank === 'reserve')).toBeGreaterThan(lastPositive);
  });

  it('départage : gain, couverture du candidat, couverture de la question, identifiants', () => {
    const ctx = researchContext();
    const { rows } = computeGaps(ctx, ctx.research);
    for (let i = 1; i < rows.length; i++) {
      const a = rows[i - 1]!;
      const b = rows[i]!;
      const key = (r: typeof a) => [r.searched ? 1 : 0, -r.gain, -r.candidateCoverage, -r.questionCoverage];
      const [ka, kb] = [key(a), key(b)];
      const cmp = ka.findIndex((v, j) => v !== kb[j]);
      if (cmp >= 0) expect(ka[cmp]!).toBeLessThan(kb[cmp]!);
      else expect(`${a.candidate} ${a.question}` < `${b.candidate} ${b.question}`).toBe(true);
    }
  });

  it('couple consigné en lacune NOT_FOUND avec question : déjà cherché, relégué en fin de liste', () => {
    const ctx = researchContext();
    const target = computeGaps(ctx, ctx.research).rows[0]!;
    journalOf(ctx).gaps!.push({ kind: 'NOT_FOUND', personality: target.candidate, question: target.question, note: 'Rien trouvé.' });
    const { rows } = computeGaps(ctx, ctx.research);
    const last = rows.at(-1)!;
    expect(last).toMatchObject({ candidate: target.candidate, question: target.question, searched: { journal: '2026-11-22-fixture-minimale', kind: 'NOT_FOUND' } });
    // Une lacune sans question ou d'un autre type ne compte pas.
    expect(rows.filter((r) => r.searched)).toHaveLength(1);
  });

  it('déterministe et filtrable par candidat et par thème', () => {
    const ctx = researchContext();
    expect(computeGaps(ctx, ctx.research)).toEqual(computeGaps(ctx, ctx.research));
    const only = computeGaps(ctx, ctx.research, { candidates: ['martin'], themes: ['sante'] }).rows;
    expect(only.length).toBe(10);
    expect(only.every((r) => r.candidate === 'martin' && r.theme === 'sante')).toBe(true);
  });
});

describe('missions et Markdown', () => {
  it('missions candidat × thème triées par gain cumulé, Markdown borné par --limit', () => {
    const ctx = researchContext();
    const result = computeGaps(ctx, ctx.research);
    const missions = missionsOf(result.rows);
    for (let i = 1; i < missions.length; i++) expect(missions[i - 1]!.gain).toBeGreaterThanOrEqual(missions[i]!.gain);
    expect(missions[0]!.rows.every((r) => r.candidate === missions[0]!.candidate && r.theme === missions[0]!.theme)).toBe(true);
    const md = renderGapsMarkdown(result, { limit: 5, date: '2026-11-22', declaredCount: 2, labels: new Map([['dupont', 'Jeanne Dupont']]) });
    expect(md).toMatch(/^# Positions manquantes — 2026-11-22/);
    expect(md).toContain('## Mission 1 — Jeanne Dupont ×');
    expect(md.split('\n').filter((l) => /^\| \d+ \|/.test(l))).toHaveLength(5);
  });
});
