// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { isKnown, isOldSource, positionHash, strongestEvidence } from './positions';
import { minimalContext } from './rules/testing';

const pos = (ctx: ReturnType<typeof minimalContext>, candidate: string, question: string) =>
  ctx.corpus.positions.get(candidate)!.find((p) => p.question === question)!;

describe('interprétation des positions', () => {
  it('isKnown : relue, valeur connue, citation retrouvée', () => {
    const ctx = minimalContext();
    expect(isKnown(pos(ctx, 'dupont', 'economie-q01'), ctx)).toBe(true);
    expect(isKnown(pos(ctx, 'dupont', 'economie-q03'), ctx)).toBe(false); // draft
    expect(isKnown(pos(ctx, 'dupont', 'sante-q01'), ctx)).toBe(false); // contested
    expect(isKnown(pos(ctx, 'dupont', 'sante-q02'), ctx)).toBe(false); // unknown
  });

  it('isKnown : citation introuvable ⇒ inconnue ; sans cache ⇒ non vérifiée', () => {
    const ctx = minimalContext();
    const p = pos(ctx, 'dupont', 'economie-q01');
    p.quote = 'Citation inventée.';
    expect(isKnown(p, ctx)).toBe(false);
    expect(isKnown(p, { corpus: ctx.corpus })).toBe(true);
  });

  it('positionHash : indépendant de l’ordre des sources, sensible à la valeur', () => {
    const a = positionHash({ value: 1, sources: ['a', 'b'], quote: 'q' });
    expect(positionHash({ value: 1, sources: ['b', 'a'], quote: 'q' })).toBe(a);
    expect(positionHash({ value: 2, sources: ['a', 'b'], quote: 'q' })).not.toBe(a);
  });

  it('strongestEvidence et isOldSource', () => {
    expect(strongestEvidence(['declaration_vote', 'programme'])).toBe('programme');
    expect(strongestEvidence(['declaration_vote', 'livre_plateforme'])).toBe('livre_plateforme');
    expect(strongestEvidence([])).toBeNull();
    expect(isOldSource({ publishedAt: { date: '2021-12-31', precision: 'day' } }, '2022-01-01')).toBe(true);
    expect(isOldSource({ publishedAt: { date: '2021', precision: 'year' } }, '2022-01-01')).toBe(true);
    expect(isOldSource({ publishedAt: { date: '2022', precision: 'year' } }, '2022-01-01')).toBe(false);
    expect(isOldSource({ publishedAt: { date: '2022-01', precision: 'month' } }, '2022-01-01')).toBe(false);
  });
});
