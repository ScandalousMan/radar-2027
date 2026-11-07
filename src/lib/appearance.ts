/**
 * Apparence clair / sombre (FR-010, data-model § Apparence).
 *
 * Le mot « apparence » est réservé à ce réglage visuel ; « thème » désigne les sujets de
 * l'ontologie politique (ThemeChip, ThemePicker). L'attribut HTML `data-theme` reste la
 * convention Tailwind pour la variante sombre.
 */

export type Appearance = 'light' | 'dark';

export type AppearanceSource = 'system' | 'explicit';

export const APPEARANCE_STORAGE_KEY = 'radar-appearance';

export const APPEARANCE_ATTRIBUTE = 'data-theme';

const DARK_QUERY = '(prefers-color-scheme: dark)';

type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

type MatchMediaLike = (query: string) => { matches: boolean };

export function isAppearance(value: unknown): value is Appearance {
  return value === 'light' || value === 'dark';
}

function defaultStorage(): StorageLike | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage;
  } catch {
    return null;
  }
}

function defaultMatchMedia(): MatchMediaLike | null {
  return typeof window === 'undefined' || typeof window.matchMedia !== 'function'
    ? null
    : (query) => window.matchMedia(query);
}

/** Lit le choix explicite mémorisé ; `null` si absent, invalide ou stockage indisponible. */
export function readStoredAppearance(storage: StorageLike | null = defaultStorage()): Appearance | null {
  try {
    const value = storage?.getItem(APPEARANCE_STORAGE_KEY) ?? null;
    return isAppearance(value) ? value : null;
  } catch {
    return null;
  }
}

/** Mémorise un choix explicite (`null` l'efface). Renvoie `false` si le stockage est indisponible. */
export function writeStoredAppearance(
  appearance: Appearance | null,
  storage: StorageLike | null = defaultStorage(),
): boolean {
  try {
    if (!storage) return false;
    if (appearance === null) storage.removeItem(APPEARANCE_STORAGE_KEY);
    else storage.setItem(APPEARANCE_STORAGE_KEY, appearance);
    return true;
  } catch {
    return false;
  }
}

/** Préférence système ; `light` si la requête média est indisponible. */
export function systemAppearance(matchMedia: MatchMediaLike | null = defaultMatchMedia()): Appearance {
  try {
    return matchMedia?.(DARK_QUERY).matches ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

/** Apparence initiale : choix explicite mémorisé, sinon préférence système. */
export function resolveInitialAppearance(options: {
  storage?: StorageLike | null;
  matchMedia?: MatchMediaLike | null;
} = {}): { appearance: Appearance; source: AppearanceSource } {
  const stored = readStoredAppearance(options.storage ?? defaultStorage());
  if (stored) return { appearance: stored, source: 'explicit' };
  return { appearance: systemAppearance(options.matchMedia ?? defaultMatchMedia()), source: 'system' };
}

/** Lit l'apparence courante sur l'élément racine (`light` par défaut). */
export function readAppliedAppearance(root: Element | null = typeof document === 'undefined' ? null : document.documentElement): Appearance {
  const value = root?.getAttribute(APPEARANCE_ATTRIBUTE);
  return isAppearance(value) ? value : 'light';
}

/** Applique l'apparence sur l'élément racine (`data-theme` et `color-scheme`). */
export function applyAppearance(
  appearance: Appearance,
  root: HTMLElement | null = typeof document === 'undefined' ? null : document.documentElement,
): void {
  if (!root) return;
  root.setAttribute(APPEARANCE_ATTRIBUTE, appearance);
  root.style.colorScheme = appearance;
}

export function oppositeAppearance(appearance: Appearance): Appearance {
  return appearance === 'dark' ? 'light' : 'dark';
}

/**
 * Script d'initialisation injecté en ligne dans `<head>`, exécuté avant le premier rendu pour
 * éviter tout clignotement. Autonome (aucun import), tolérant à un stockage indisponible.
 */
export const appearanceInitScript = [
  '(function(){try{',
  `var k=${JSON.stringify(APPEARANCE_STORAGE_KEY)};var s=null;`,
  'try{s=window.localStorage.getItem(k)}catch(e){}',
  `var a=(s==='light'||s==='dark')?s:(window.matchMedia&&window.matchMedia(${JSON.stringify(DARK_QUERY)}).matches?'dark':'light');`,
  `var d=document.documentElement;d.setAttribute(${JSON.stringify(APPEARANCE_ATTRIBUTE)},a);d.style.colorScheme=a;`,
  '}catch(e){}})();',
].join('');
