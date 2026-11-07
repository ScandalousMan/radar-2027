import { describe, expect, it } from 'vitest';
import {
  APPEARANCE_ATTRIBUTE,
  APPEARANCE_STORAGE_KEY,
  appearanceInitScript,
  applyAppearance,
  oppositeAppearance,
  readAppliedAppearance,
  readStoredAppearance,
  resolveInitialAppearance,
  systemAppearance,
  writeStoredAppearance,
} from './appearance';

function memoryStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
    removeItem: (key: string) => void data.delete(key),
    data,
  };
}

const brokenStorage = {
  getItem: () => {
    throw new Error('stockage indisponible');
  },
  setItem: () => {
    throw new Error('stockage indisponible');
  },
  removeItem: () => {
    throw new Error('stockage indisponible');
  },
};

const prefersDark = () => ({ matches: true });
const prefersLight = () => ({ matches: false });

describe('apparence : préférence système seule', () => {
  it('suit le système quand rien n’est mémorisé', () => {
    expect(resolveInitialAppearance({ storage: memoryStorage(), matchMedia: prefersDark })).toEqual({
      appearance: 'dark',
      source: 'system',
    });
    expect(resolveInitialAppearance({ storage: memoryStorage(), matchMedia: prefersLight })).toEqual({
      appearance: 'light',
      source: 'system',
    });
  });

  it('retombe sur clair sans requête média', () => {
    expect(systemAppearance(null)).toBe('light');
  });
});

describe('apparence : choix explicite prioritaire', () => {
  it('lit un choix mémorisé valide et ignore une valeur invalide', () => {
    expect(readStoredAppearance(memoryStorage({ [APPEARANCE_STORAGE_KEY]: 'dark' }))).toBe('dark');
    expect(readStoredAppearance(memoryStorage({ [APPEARANCE_STORAGE_KEY]: 'bleu' }))).toBeNull();
  });

  it('prévaut sur la préférence système', () => {
    const storage = memoryStorage({ [APPEARANCE_STORAGE_KEY]: 'light' });
    expect(resolveInitialAppearance({ storage, matchMedia: prefersDark })).toEqual({
      appearance: 'light',
      source: 'explicit',
    });
  });

  it('écrit puis efface le choix', () => {
    const storage = memoryStorage();
    expect(writeStoredAppearance('dark', storage)).toBe(true);
    expect(storage.data.get(APPEARANCE_STORAGE_KEY)).toBe('dark');
    expect(writeStoredAppearance(null, storage)).toBe(true);
    expect(storage.data.has(APPEARANCE_STORAGE_KEY)).toBe(false);
  });

  it('alterne entre les deux apparences', () => {
    expect(oppositeAppearance('light')).toBe('dark');
    expect(oppositeAppearance('dark')).toBe('light');
  });
});

describe('apparence : stockage local indisponible', () => {
  it('ne lève pas d’erreur et suit le système', () => {
    expect(() => readStoredAppearance(brokenStorage)).not.toThrow();
    expect(writeStoredAppearance('dark', brokenStorage)).toBe(false);
    expect(writeStoredAppearance('dark', null)).toBe(false);
    expect(resolveInitialAppearance({ storage: brokenStorage, matchMedia: prefersDark })).toEqual({
      appearance: 'dark',
      source: 'system',
    });
  });
});

describe('apparence : application sur la racine', () => {
  it('pose data-theme et color-scheme', () => {
    const root = document.createElement('html');
    applyAppearance('dark', root);
    expect(root.getAttribute(APPEARANCE_ATTRIBUTE)).toBe('dark');
    expect(root.style.colorScheme).toBe('dark');
    expect(readAppliedAppearance(root)).toBe('dark');
    expect(readAppliedAppearance(document.createElement('html'))).toBe('light');
  });
});

describe('apparence : script d’initialisation en ligne', () => {
  function runScript(options: { stored?: string | null; dark: boolean; storageThrows?: boolean }) {
    const root = document.createElement('html');
    const fakeWindow = {
      localStorage: options.storageThrows
        ? brokenStorage
        : memoryStorage(options.stored ? { [APPEARANCE_STORAGE_KEY]: options.stored } : {}),
      matchMedia: () => ({ matches: options.dark }),
    };
    const fakeDocument = { documentElement: root };
    // Le script est autonome : on l'exécute dans un contexte où `window` et `document` sont contrôlés.
    new Function('window', 'document', appearanceInitScript)(fakeWindow, fakeDocument);
    return root;
  }

  it('applique le système, puis le choix mémorisé, sans clignotement ni erreur', () => {
    expect(runScript({ dark: true }).getAttribute(APPEARANCE_ATTRIBUTE)).toBe('dark');
    expect(runScript({ dark: false }).getAttribute(APPEARANCE_ATTRIBUTE)).toBe('light');
    expect(runScript({ stored: 'light', dark: true }).getAttribute(APPEARANCE_ATTRIBUTE)).toBe('light');
    expect(runScript({ stored: 'rouge', dark: true }).getAttribute(APPEARANCE_ATTRIBUTE)).toBe('dark');
    expect(() => runScript({ dark: true, storageThrows: true })).not.toThrow();
    expect(runScript({ dark: true, storageThrows: true }).getAttribute(APPEARANCE_ATTRIBUTE)).toBe('dark');
  });

  it('ne contient aucun saut de ligne (injection en attribut sûre)', () => {
    expect(appearanceInitScript).not.toMatch(/\n/);
  });
});
