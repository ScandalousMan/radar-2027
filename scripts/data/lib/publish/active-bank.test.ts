// @vitest-environment node
// Banque active (009 R4, US2) : minimum, plafond, compléments, erreurs, promotion.
import { describe, expect, it } from 'vitest';
import { minimalContext } from '../rules/testing';
import { ActiveBankError, computeActiveBank, selectActiveBank, type BankCandidateQuestion } from './active-bank';

/** `n` questions du thème `theme`, enjeux distincts, couverture donnée par `cov(i)`. */
function many(theme: string, n: number, cov: (i: number) => number, prefix = theme): BankCandidateQuestion[] {
  return Array.from({ length: n }, (_, i) => ({ id: `${prefix}-${String(i).padStart(3, '0')}`, theme, subject: `${prefix}-s${i}`, coverage: cov(i), discriminant: 1 }));
}

describe('selectActiveBank', () => {
  it('retient le plus petit k qui laisse au plus 120 questions', () => {
    // 4 thèmes × 40 questions : couvertures 0 à 9 (4 questions par niveau).
    const qs = ['a', 'b', 'c', 'd'].flatMap((t) => many(t, 40, (i) => i % 10));
    // k = 3 : 4 × 28 = 112 ≤ 120 ; k = 2 : 4 × 32 = 128.
    const r = selectActiveBank(qs, ['a', 'b', 'c', 'd']);
    expect(r.k).toBe(3);
    expect(r.active).toHaveLength(112);
    expect(r.reserve).toHaveLength(48);
    expect(r.completed).toEqual([]);
    expect(r.warnings).toEqual([]);
  });

  it('complète un thème sous 3 enjeux (thème principal, couverture puis D_q puis id, enjeux nouveaux seulement)', () => {
    const qs: BankCandidateQuestion[] = [
      ...many('a', 10, () => 9),
      { id: 'b-1', theme: 'b', subject: 'b-x', coverage: 9, discriminant: 1 },
      { id: 'b-2', theme: 'b', subject: 'b-x', coverage: 5, discriminant: 1 }, // même enjeu que b-1 : écartée
      { id: 'b-3', theme: 'b', subject: 'b-y', coverage: 4, discriminant: 0.5 },
      { id: 'b-4', theme: 'b', subject: 'b-z', coverage: 4, discriminant: 1.5 }, // D_q plus fort que b-3
      { id: 'b-5', theme: 'b', subject: 'b-w', coverage: 4, discriminant: 1.5 },
    ];
    const r = selectActiveBank(qs, ['a', 'b'], { max: 13 });
    expect(r.k).toBe(6);
    expect(r.completed).toEqual([{ theme: 'b', before: 1, subjects: 3, added: ['b-4', 'b-5'] }]);
    expect(r.active).toEqual([...many('a', 10, () => 9).map((q) => q.id), 'b-1', 'b-4', 'b-5'].sort());
    expect(r.warnings).toHaveLength(1);
    expect(r.warnings[0]).toMatch(/Thème b complété/);
  });

  it('thème épuisé avant 3 enjeux : avertissement, pas d’erreur', () => {
    const qs = [...many('a', 5, () => 4), { id: 'b-1', theme: 'b', subject: 'b-x', coverage: 0, discriminant: 0 }];
    const r = selectActiveBank(qs, ['a', 'b', 'c']);
    expect(r.k).toBe(1);
    expect(r.completed.map((c) => [c.theme, c.subjects])).toEqual([
      ['b', 1],
      ['c', 0],
    ]);
    expect(r.warnings.every((w) => /épuisé/.test(w))).toBe(true);
    expect(r.active).toContain('b-1');
  });

  it('--min-coverage plus petit que le minimum calculé : erreur ; plus grand : accepté', () => {
    const qs = ['a', 'b', 'c', 'd'].flatMap((t) => many(t, 40, (i) => i % 10));
    expect(() => selectActiveBank(qs, ['a', 'b', 'c', 'd'], { minCoverage: 2 })).toThrow(ActiveBankError);
    expect(() => selectActiveBank(qs, ['a', 'b', 'c', 'd'], { minCoverage: 2 })).toThrow(/minimum calculé est 3/);
    expect(selectActiveBank(qs, ['a', 'b', 'c', 'd'], { minCoverage: 5 }).k).toBe(5);
  });

  it('aucun k ne tient sous 120 après compléments : erreur qui nomme les thèmes et le total', () => {
    // 41 thèmes à couverture nulle : 3 enjeux chacun après complément = 123 > 120, quel que soit k.
    const themes = Array.from({ length: 41 }, (_, i) => `t${i}`);
    const qs = themes.flatMap((t) => many(t, 3, () => 0));
    expect(() => selectActiveBank(qs, themes)).toThrow(ActiveBankError);
    try {
      selectActiveBank(qs, themes);
    } catch (e) {
      expect((e as Error).message).toMatch(/123 questions après compléments/);
      expect((e as Error).message).toMatch(/t0, t1/);
    }
  });

  it('promotion (US2 n° 3) : une question de réserve qui passe à c_q = k devient active', () => {
    const base = ['a', 'b', 'c', 'd'].flatMap((t) => many(t, 40, (i) => i % 10));
    const before = selectActiveBank(base, ['a', 'b', 'c', 'd']);
    const reserve = base.find((q) => q.coverage === 2)!;
    expect(before.reserve).toContain(reserve.id);
    // Une position de plus : couverture 3 = k, 113 questions ≤ 120.
    const after = selectActiveBank(
      base.map((q) => (q.id === reserve.id ? { ...q, coverage: 3 } : q)),
      ['a', 'b', 'c', 'd'],
    );
    expect(after.k).toBe(3);
    expect(after.active).toContain(reserve.id);
  });
});

describe('computeActiveBank sur la fixture minimale', () => {
  it('couverture calculée sur les seuls candidats déclarés et positions connues', () => {
    const ctx = minimalContext();
    const bank = computeActiveBank(ctx);
    expect(bank.coverage.get('economie-q01')).toBe(1); // dupont, relue
    expect(bank.coverage.get('economie-q03')).toBe(0); // brouillon
    expect(bank.coverage.get('sante-q01')).toBe(0); // contestée
    expect(bank.coverage.get('environnement-q01')).toBe(1); // martin
    expect(bank.k).toBe(1);
    expect(bank.active.length + bank.reserve.length).toBe(bank.coverage.size);
    // Chaque thème atteint 3 enjeux (10 questions par thème dans la fixture).
    for (const theme of ['economie', 'environnement', 'sante']) {
      const subjects = new Set(bank.activeQuestions.filter((q) => q.themes[0] === theme).map((q) => q.subject));
      expect(subjects.size).toBe(3);
    }
  });

  it('candidat retiré : ses positions ne comptent pas', () => {
    const ctx = minimalContext();
    ctx.corpus.candidates.find((c) => c.id === 'martin')!.status = 'withdrawn';
    expect(computeActiveBank(ctx).coverage.get('environnement-q01')).toBe(0);
  });
});
