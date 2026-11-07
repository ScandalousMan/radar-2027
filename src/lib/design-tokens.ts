/**
 * Lecture du fichier de tokens (`src/ui/tokens.css`) et calcul de contraste WCAG 2.
 * Utilisé par `tokens.test.ts` et par la page Storybook « Fondations/Tokens ».
 */

export type TokenFamily =
  | 'color'
  | 'spacing'
  | 'container'
  | 'font'
  | 'font-size'
  | 'font-weight'
  | 'line-height'
  | 'radius'
  | 'shadow'
  | 'other';

export type ParsedTokens = {
  /** Valeurs déclarées dans `@theme` (apparence claire). */
  light: Record<string, string>;
  /** Redéfinitions sous `[data-theme="dark"]`. */
  dark: Record<string, string>;
};

const DECLARATION = /(--[a-zA-Z0-9_-]+)\s*:\s*([^;]+);/g;

function stripComments(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

function extractBlock(css: string, opener: RegExp): string {
  const match = opener.exec(css);
  if (!match) return '';
  let depth = 0;
  for (let i = match.index + match[0].length - 1; i < css.length; i += 1) {
    if (css[i] === '{') depth += 1;
    if (css[i] === '}') {
      depth -= 1;
      if (depth === 0) return css.slice(match.index + match[0].length, i);
    }
  }
  return '';
}

function readDeclarations(block: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [, name, value] of block.matchAll(DECLARATION)) {
    if (!name || !value || name.endsWith('-*')) continue;
    out[name] = value.trim();
  }
  return out;
}

export function parseTokens(css: string): ParsedTokens {
  const clean = stripComments(css);
  return {
    light: readDeclarations(extractBlock(clean, /@theme\s*\{/)),
    dark: readDeclarations(extractBlock(clean, /\[data-theme="dark"\]\s*\{/)),
  };
}

export function tokenFamily(name: string): TokenFamily {
  if (name.startsWith('--color-')) return 'color';
  if (name.startsWith('--spacing-')) return 'spacing';
  if (name.startsWith('--container-')) return 'container';
  if (name.startsWith('--font-weight-')) return 'font-weight';
  if (name.startsWith('--font-')) return 'font';
  if (name.startsWith('--text-') && name.includes('--line-height')) return 'line-height';
  if (name.startsWith('--text-')) return 'font-size';
  if (name.startsWith('--leading-')) return 'line-height';
  if (name.startsWith('--radius-')) return 'radius';
  if (name.startsWith('--shadow-')) return 'shadow';
  return 'other';
}

export function hexToRgb(hex: string): [number, number, number] | null {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!match?.[1]) return null;
  const raw = match[1].length === 3 ? match[1].split('').map((c) => c + c).join('') : match[1];
  const n = Number.parseInt(raw, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function channel(c: number): number {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) throw new Error(`Couleur hexadécimale attendue, reçu : ${hex}`);
  const [r, g, b] = rgb;
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** Ratio de contraste WCAG 2 (1 à 21). */
export function contrastRatio(foreground: string, background: string): number {
  const l1 = relativeLuminance(foreground);
  const l2 = relativeLuminance(background);
  const [light, dark] = l1 >= l2 ? [l1, l2] : [l2, l1];
  return (light + 0.05) / (dark + 0.05);
}
