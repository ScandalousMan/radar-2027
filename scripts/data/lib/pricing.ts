// Prix par modèle (research.md R7, relevés le 2026-11-07), en dollars par million de jetons.
// Écriture et lecture de cache dérivées (1,25× et 0,10× l'entrée) quand le prix n'est pas précisé.
import type { Usage } from './schema';

export type Price = { input: number; output: number; cacheWrite: number; cacheRead: number };

const derived = (input: number, output: number): Price => ({ input, output, cacheWrite: input * 1.25, cacheRead: input * 0.1 });

export const PRICES: Readonly<Record<string, Price>> = {
  'claude-opus-5-5': { input: 4, output: 20, cacheWrite: 5, cacheRead: 0.2 },
  'claude-sonnet-5-5': derived(2, 10),
  'claude-haiku-5-5': derived(0.1, 0.5),
};

export function priceOf(model: string): Price {
  const price = PRICES[model];
  if (!price) throw new Error(`modèle sans prix connu : ${model} (compléter scripts/data/lib/pricing.ts)`);
  return price;
}

const round4 = (n: number) => Math.round(n * 10_000) / 10_000;

/** Coût d'une réponse à partir de son `usage`, arrondi à 4 décimales. */
export function costFromUsage(model: string, usage: Usage): number {
  const p = priceOf(model);
  return round4((usage.inputTokens * p.input + usage.outputTokens * p.output + usage.cacheWriteTokens * p.cacheWrite + usage.cacheReadTokens * p.cacheRead) / 1_000_000);
}

/** Coût maximal d'une requête : jetons d'entrée comptés et sortie au plafond `max_tokens`. */
export function estimateCost(model: string, inputTokens: number, maxOutputTokens: number): number {
  const p = priceOf(model);
  return round4((inputTokens * p.input + maxOutputTokens * p.output) / 1_000_000);
}
