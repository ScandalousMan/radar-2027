// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { FR_012 } from './FR-012';
import { ids, minimalContext, questionsOf } from './testing';

describe('FR-012', () => {
  it('fixture minimale conforme (seul BANK-SIZE avertit)', () => {
    const ctx = minimalContext();
    expect(ids(FR_012, ctx)).toEqual([]);
    expect(ids(FR_012, ctx, 'warning')).toEqual(['banque']);
  });
  it('polarités 70 / 30', () => {
    const ctx = minimalContext();
    const qs = questionsOf(ctx, 'economie');
    qs[1]!.polarity = '+';
    qs[3]!.polarity = '+';
    const [v] = FR_012.run(ctx).filter((x) => x.severity === 'error');
    expect(v?.entity.id).toBe('economie');
    expect(v?.message).toBe("economie : 7 '+' / 3 '-' (70 % / 30 %), attendu 40 %–60 %");
  });
  it('9 questions actives', () => {
    const ctx = minimalContext();
    questionsOf(ctx, 'sante')[9]!.status = 'draft';
    expect(ids(FR_012, ctx)).toEqual(['sante']);
  });
  it('thème vide : avertissement THEME-EMPTY, pas de violation', () => {
    const ctx = minimalContext();
    for (const q of questionsOf(ctx, 'environnement')) q.status = 'draft';
    expect(ids(FR_012, ctx)).toEqual([]);
    const warnings = FR_012.run(ctx).filter((v) => v.severity === 'warning');
    expect(warnings.map((w) => [w.rule, w.entity.id])).toContainEqual(['THEME-EMPTY', 'environnement']);
  });
});
