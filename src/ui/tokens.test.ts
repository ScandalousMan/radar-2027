import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { contrastRatio, parseTokens } from '@/lib/design-tokens';

const css = readFileSync(join(__dirname, 'tokens.css'), 'utf8');
const tokens = parseTokens(css);

/** Couples (premier plan, fond) et seuils de contracts/tokens.md. */
const PAIRS: Array<[string, string, number]> = [
  ['--color-fg', '--color-bg', 4.5],
  ['--color-fg', '--color-surface', 4.5],
  ['--color-fg-muted', '--color-bg', 4.5],
  ['--color-fg-muted', '--color-surface', 4.5],
  ['--color-accent-fg', '--color-accent', 4.5],
  ['--color-focus', '--color-bg', 3],
  ['--color-focus', '--color-surface', 3],
  ['--color-danger', '--color-bg', 4.5],
  ['--color-success', '--color-bg', 4.5],
  ['--color-fg', '--color-accent-soft', 4.5],
];

const SEMANTIC_COLORS = [
  '--color-bg',
  '--color-surface',
  '--color-fg',
  '--color-fg-muted',
  '--color-border',
  '--color-accent',
  '--color-accent-fg',
  '--color-focus',
  '--color-danger',
  '--color-success',
];

function resolve(theme: 'light' | 'dark', name: string): string {
  const value = theme === 'dark' ? (tokens.dark[name] ?? tokens.light[name]) : tokens.light[name];
  if (!value) throw new Error(`token absent : ${name}`);
  return value;
}

describe('tokens.css', () => {
  it('déclare chaque couleur sémantique dans les deux apparences', () => {
    for (const name of SEMANTIC_COLORS) {
      expect(tokens.light[name], `${name} manquant en clair`).toMatch(/^#[0-9a-f]{6}$/i);
      expect(tokens.dark[name], `${name} manquant en sombre`).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it('n’expose aucune couleur descriptive (teinte-nuance)', () => {
    for (const name of Object.keys(tokens.light).filter((n) => n.startsWith('--color-'))) {
      expect(name, `couleur descriptive interdite : ${name}`).not.toMatch(/-(\d{2,3})$/);
    }
  });

  it('retire la palette par défaut de Tailwind', () => {
    expect(css).toMatch(/--color-\*:\s*initial/);
  });

  it('fournit la cible tactile de 44 px et une pile de polices système', () => {
    expect(tokens.light['--spacing-touch']).toBe('2.75rem');
    expect(tokens.light['--font-sans']).toMatch(/system-ui/);
    expect(tokens.light['--font-sans']).not.toMatch(/url\(/);
  });

  describe.each(['light', 'dark'] as const)('contrastes WCAG en apparence %s', (theme) => {
    it.each(PAIRS)('%s sur %s ≥ %s:1', (fg, bg, threshold) => {
      const ratio = contrastRatio(resolve(theme, fg), resolve(theme, bg));
      expect(ratio, `${fg} sur ${bg} (${theme}) = ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(threshold);
    });
  });
});
