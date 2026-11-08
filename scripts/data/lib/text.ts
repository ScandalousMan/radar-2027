// Normalisation de texte, empreinte et recherche de citation (research.md R5).
import { createHash } from 'node:crypto';

/**
 * Normalisation appliquée à l'identique au texte en cache et aux citations : NFC, apostrophes
 * et guillemets typographiques ramenés à leur forme ASCII, tirets demi-cadratin et cadratin
 * ramenés à `-`, toute suite d'espaces (insécables et sauts de ligne compris) réduite à une
 * espace, espaces de bord retirées. La casse est conservée. Idempotente.
 */
export function normalize(text: string): string {
  return text
    .normalize('NFC')
    .replace(/[’‘ʼ′]/g, "'")
    .replace(/[«»“”„]/g, '"')
    .replace(/[–—]/g, '-')
    .replace(/[\s     ]+/g, ' ')
    .trim();
}

/** Empreinte `sha256:<hex>` d'un texte (déjà normalisé par l'appelant). */
export function sha256(text: string): string {
  return `sha256:${createHash('sha256').update(text, 'utf8').digest('hex')}`;
}

/** Position de la citation dans un texte normalisé, par inclusion stricte ; `null` si absente. */
export function findQuote(normalizedText: string, quote: string): { start: number; end: number } | null {
  const q = normalize(quote);
  if (q.length === 0) return null;
  const start = normalizedText.indexOf(q);
  return start < 0 ? null : { start, end: start + q.length };
}

/** Distance d'édition de Levenshtein. */
export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(prev[j]! + 1, cur[j - 1]! + 1, prev[j - 1]! + cost);
    }
    prev = cur;
  }
  return prev[b.length]!;
}

function words(text: string): string[] {
  return normalize(text)
    .normalize('NFD')
    .replace(/\p{Mn}/gu, '')
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean);
}

/**
 * Vrai si les deux énoncés ont la même suite de mots, aux accents, à la casse, à la
 * ponctuation et aux espaces près : c'est la définition d'une correction typographique (FR-011).
 */
export function sameWords(a: string, b: string): boolean {
  const wa = words(a);
  const wb = words(b);
  return wa.length === wb.length && wa.every((w, i) => w === wb[i]);
}
