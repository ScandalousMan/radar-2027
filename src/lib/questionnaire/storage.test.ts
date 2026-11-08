// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';
import { testDraft } from './fixtures';
import { clearDraft, DRAFT_STORAGE_KEY, probeStorage, readDraft, subscribeDraft, writeDraft, type StorageLike } from './storage';

function memory(initial: Record<string, string> = {}): StorageLike & { data: Map<string, string> } {
  const data = new Map(Object.entries(initial));
  return {
    data,
    getItem: (k) => data.get(k) ?? null,
    setItem: (k, v) => void data.set(k, v),
    removeItem: (k) => void data.delete(k),
  };
}

const throwing: StorageLike = {
  getItem: () => {
    throw new Error('refusé');
  },
  setItem: () => {
    throw new Error('plein');
  },
  removeItem: () => {
    throw new Error('refusé');
  },
};

describe('storage du brouillon', () => {
  it.each([
    ['absente', undefined],
    ['JSON invalide', '{pas du json'],
    ['format 0', JSON.stringify({ ...testDraft(), format: 0 })],
    ['réponse 7', JSON.stringify({ ...testDraft(), answers: [7, ...testDraft().answers.slice(1)] })],
    ['sujets en double', JSON.stringify({ ...testDraft(), priorities: ['t01', 't01', 't04'] })],
    ['position hors bornes', JSON.stringify({ ...testDraft(), position: 25 })],
  ])('readDraft rend null sur valeur %s', (_, value) => {
    expect(readDraft(memory(value === undefined ? {} : { [DRAFT_STORAGE_KEY]: value }))).toBeNull();
  });

  it('readDraft rend null si le stockage lève ou est absent', () => {
    expect(readDraft(throwing)).toBeNull();
    expect(readDraft(null)).toBeNull();
  });

  it('aller-retour writeDraft → readDraft exact', () => {
    const s = memory();
    const d = testDraft({ answers: testDraft().answers.map((a, i) => (i === 0 ? 2 : i === 1 ? 'skipped' : i === 2 ? -1 : a)), position: 3 });
    expect(writeDraft(d, s)).toBe(true);
    expect(readDraft(s)).toEqual(d);
  });

  it('writeDraft rend false sans lever si setItem lève', () => {
    expect(writeDraft(testDraft(), throwing)).toBe(false);
    expect(writeDraft(testDraft(), null)).toBe(false);
  });

  it('clearDraft supprime la clé du brouillon et aucune autre', () => {
    const s = memory({ [DRAFT_STORAGE_KEY]: JSON.stringify(testDraft()), 'radar-appearance': 'dark' });
    expect(clearDraft(s)).toBe(true);
    expect([...s.data.keys()]).toEqual(['radar-appearance']);
  });

  it('probeStorage : disponible sans clé d’essai résiduelle, indisponible si le stockage lève', () => {
    const s = memory();
    expect(probeStorage(s)).toBe('available');
    expect(s.data.size).toBe(0);
    expect(probeStorage(throwing)).toBe('unavailable');
    expect(probeStorage(null)).toBe('unavailable');
    const partial = memory();
    partial.removeItem = () => {
      throw new Error('refusé');
    };
    expect(probeStorage({ ...partial, setItem: () => { throw new Error('plein'); } })).toBe('unavailable');
  });

  it('subscribeDraft ne réagit qu’à la clé du brouillon et se désabonne', () => {
    const target = new EventTarget();
    const listener = vi.fn();
    const unsubscribe = subscribeDraft(listener, target as unknown as Window);
    const fire = (key: string) => {
      const event = new Event('storage') as Event & { key: string };
      Object.defineProperty(event, 'key', { value: key });
      target.dispatchEvent(event);
    };
    fire('radar-appearance');
    expect(listener).not.toHaveBeenCalled();
    fire(DRAFT_STORAGE_KEY);
    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
    fire(DRAFT_STORAGE_KEY);
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
