// Rationnels exacts en BigInt (research.md R2, data-model.md § 2).
// Toute grandeur de score est un `Ratio` réduit ; les troncatures en pourcentage (FR-011) et les
// comparaisons (FR-010, FR-012) se font en entiers, jamais en flottants.

/** Fraction réduite : `den > 0`, pgcd(|num|, den) = 1, zéro représenté `0/1`. */
export type Ratio = { readonly num: bigint; readonly den: bigint };

function abs(n: bigint): bigint {
  return n < 0n ? -n : n;
}

function gcd(a: bigint, b: bigint): bigint {
  let x = abs(a);
  let y = abs(b);
  while (y !== 0n) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x;
}

/** Division entière arrondie vers −∞ (`den > 0`). */
function floorDiv(num: bigint, den: bigint): bigint {
  const q = num / den;
  return num % den !== 0n && num < 0n ? q - 1n : q;
}

function toBig(n: bigint | number): bigint {
  if (typeof n === 'bigint') return n;
  if (!Number.isInteger(n)) throw new RangeError(`entier attendu : ${n}`);
  return BigInt(n);
}

/** Construit une fraction réduite. */
export function ratio(num: bigint | number, den: bigint | number = 1n): Ratio {
  let n = toBig(num);
  let d = toBig(den);
  if (d === 0n) throw new RangeError('dénominateur nul');
  if (d < 0n) {
    n = -n;
    d = -d;
  }
  if (n === 0n) return { num: 0n, den: 1n };
  const g = gcd(n, d);
  return { num: n / g, den: d / g };
}

export const ZERO: Ratio = ratio(0);
export const ONE: Ratio = ratio(1);

export function add(a: Ratio, b: Ratio): Ratio {
  return ratio(a.num * b.den + b.num * a.den, a.den * b.den);
}

export function sub(a: Ratio, b: Ratio): Ratio {
  return ratio(a.num * b.den - b.num * a.den, a.den * b.den);
}

export function mul(a: Ratio, b: Ratio): Ratio {
  return ratio(a.num * b.num, a.den * b.den);
}

export function div(a: Ratio, b: Ratio): Ratio {
  if (b.num === 0n) throw new RangeError('division par zéro');
  return ratio(a.num * b.den, a.den * b.num);
}

/** Comparaison exacte par produit en croix : −1, 0 ou 1. */
export function cmp(a: Ratio, b: Ratio): -1 | 0 | 1 {
  const l = a.num * b.den;
  const r = b.num * a.den;
  return l < r ? -1 : l > r ? 1 : 0;
}

export function min(a: Ratio, b: Ratio): Ratio {
  return cmp(a, b) <= 0 ? a : b;
}

export function equals(a: Ratio, b: Ratio): boolean {
  return a.num === b.num && a.den === b.den;
}

/** Moyenne arithmétique d'une liste non vide. */
export function mean(list: readonly Ratio[]): Ratio {
  if (list.length === 0) throw new RangeError('moyenne d’une liste vide');
  let sum = ZERO;
  for (const x of list) sum = add(sum, x);
  return div(sum, ratio(list.length));
}

/** Moyenne pondérée `Σ w·v / Σ w` (poids entiers strictement positifs, liste non vide). */
export function weightedMean(pairs: readonly { readonly value: Ratio; readonly weight: number }[]): Ratio {
  if (pairs.length === 0) throw new RangeError('moyenne pondérée d’une liste vide');
  let sum = ZERO;
  let weights = 0;
  for (const { value, weight } of pairs) {
    sum = add(sum, mul(value, ratio(weight)));
    weights += weight;
  }
  return div(sum, ratio(weights));
}

/** Pourcentage tronqué d'une valeur de [−1, +1] : `⌊(x + 1) / 2 · 100⌋` (FR-001, FR-011). */
export function floorPercentSigned(x: Ratio): number {
  return Number(floorDiv((x.num + x.den) * 100n, 2n * x.den));
}

/** Pourcentage tronqué d'une valeur de [0, 1] : `⌊x · 100⌋` (couverture). */
export function floorPercentUnit(x: Ratio): number {
  return Number(floorDiv(x.num * 100n, x.den));
}

/** Valeur approchée, pour l'affichage seulement (jamais pour une décision). */
export function toNumber(x: Ratio): number {
  return Number(x.num) / Number(x.den);
}
