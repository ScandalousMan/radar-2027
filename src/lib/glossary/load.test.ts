// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchGlossary, GLOSSARY_URL, resetGlossaryCache } from './load';

const GLOSSARY = {
  updatedAt: '2026-11-22',
  terms: [{ id: 'droit-du-sol', label: 'droit du sol', forms: ['droit du sol'], definition: 'Définition.', sources: [{ url: 'https://www.vie-publique.fr/', title: 'T', publisher: 'P' }] }],
};

const respond = (body: unknown, ok = true) => vi.fn(async () => ({ ok, json: async () => body }) as Response);

afterEach(() => resetGlossaryCache());

describe('fetchGlossary', () => {
  it('renvoie le glossaire validé et le met en cache', async () => {
    const fetcher = respond(GLOSSARY);
    expect(await fetchGlossary(fetcher)).toEqual(GLOSSARY);
    expect(await fetchGlossary(fetcher)).toEqual(GLOSSARY);
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(fetcher).toHaveBeenCalledWith(GLOSSARY_URL);
  });

  it('fichier invalide → null', async () => {
    expect(await fetchGlossary(respond({ updatedAt: 'x', terms: 'rien' }))).toBeNull();
  });

  it('fichier absent (404) → null', async () => {
    expect(await fetchGlossary(respond(null, false))).toBeNull();
  });

  it('échec réseau → null', async () => {
    expect(
      await fetchGlossary(
        vi.fn(async () => {
          throw new TypeError('réseau');
        }),
      ),
    ).toBeNull();
  });
});
