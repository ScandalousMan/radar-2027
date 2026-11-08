// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { costFromUsage, estimateCost, priceOf } from './pricing';

describe('prix et coûts (R7)', () => {
  it('coût depuis usage', () => {
    expect(costFromUsage('claude-opus-5-5', { inputTokens: 1_000_000, outputTokens: 100_000, cacheWriteTokens: 200_000, cacheReadTokens: 1_000_000 })).toBe(4 + 2 + 1 + 0.2);
    expect(costFromUsage('claude-sonnet-5-5', { inputTokens: 1_000_000, outputTokens: 0, cacheWriteTokens: 1_000_000, cacheReadTokens: 1_000_000 })).toBe(2 + 2.5 + 0.2);
  });
  it('estimation et arrondi', () => {
    expect(estimateCost('claude-haiku-5-5', 12_345, 16_000)).toBe(0.0092);
  });
  it('modèle inconnu ⇒ erreur explicite', () => {
    expect(() => priceOf('modele-inconnu')).toThrow(/modèle sans prix connu/);
  });
});
