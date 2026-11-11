// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';
import { syntheticDataset } from '@/core/bank/fixtures';
import { clearDatasetCache, loadDetail, loadMain, loadRegistry } from './dataset-client';

const REGISTRY = { current: 1, versions: [{ number: 1, publishedAt: '2026-11-08', questionCount: 320, candidateCount: 22, mainHash: `sha256:${'0'.repeat(64)}`, detailHashes: {} }] };

function fakeFetch(body: unknown, init: { status?: number } = {}) {
  return vi.fn<typeof fetch>(async () => new Response(JSON.stringify(body), { status: init.status ?? 200 }));
}

afterEach(() => clearDatasetCache());

describe('dataset-client', () => {
  it('loadRegistry : URL exacte, cache no-cache, aucun en-tête ni paramètre', async () => {
    const f = fakeFetch(REGISTRY);
    expect(await loadRegistry(f)).toEqual(REGISTRY);
    expect(f).toHaveBeenCalledTimes(1);
    expect(f.mock.calls[0]).toEqual(['/data/versions.json', { cache: 'no-cache' }]);
  });

  it('loadMain : URL exacte, cache force-cache, mémoïsé par version', async () => {
    const main = syntheticDataset();
    const f = fakeFetch(main);
    const a = await loadMain(1, f);
    const b = await loadMain(1, f);
    expect(a).toEqual(main);
    expect(b).toBe(a);
    expect(f).toHaveBeenCalledTimes(1);
    expect(f.mock.calls[0]).toEqual(['/data/versions/1/main.json', { cache: 'force-cache' }]);
    clearDatasetCache();
    await loadMain(1, f);
    expect(f).toHaveBeenCalledTimes(2);
  });

  it('erreur network sur réponse non 2xx ou exception', async () => {
    await expect(loadRegistry(fakeFetch({}, { status: 404 }))).rejects.toEqual({ kind: 'network', status: 404 });
    await expect(loadMain(1, vi.fn(async () => Promise.reject(new TypeError('hors ligne'))))).rejects.toEqual({ kind: 'network' });
  });

  it('un échec n’est pas mémorisé', async () => {
    await expect(loadMain(1, fakeFetch({}, { status: 500 }))).rejects.toMatchObject({ kind: 'network' });
    await expect(loadMain(1, fakeFetch(syntheticDataset()))).resolves.toMatchObject({ version: 1 });
  });

  it('erreur invalid sur schéma refusé', async () => {
    await expect(loadRegistry(fakeFetch({ current: 'un' }))).rejects.toMatchObject({ kind: 'invalid' });
    await expect(loadMain(1, fakeFetch({ version: 1 }))).rejects.toMatchObject({ kind: 'invalid' });
  });

  describe('loadDetail (005, contracts/data-and-share.md § 1)', () => {
    const detail = {
      version: 2,
      candidate: { id: 'c01', name: 'c01', party: 'Parti' },
      sources: { s1: { url: 'https://exemple.invalid/s1', title: 'Source 1', kind: 'programme', publishedAt: { date: '2026-03', precision: 'month' }, accessedAt: '2026-11-01' } },
      positions: { 't01-q01': { value: 1, level: 'p', quote: 'Citation.', quoteSource: 's1', justification: 'Justification.', sources: ['s1'] } },
    };

    it('URL exacte sans paramètre, force-cache, validé, mémoïsé par (version, id)', async () => {
      const f = fakeFetch(detail);
      const a = await loadDetail(2, 'c01', f);
      expect(a).toEqual(detail);
      expect(await loadDetail(2, 'c01', f)).toBe(a);
      expect(f).toHaveBeenCalledTimes(1);
      expect(f.mock.calls[0]).toEqual(['/data/versions/2/candidates/c01.json', { cache: 'force-cache' }]);
      await loadDetail(1, 'c01', fakeFetch({ ...detail, version: 1 }));
      await loadDetail(2, 'c02', fakeFetch({ ...detail, candidate: { ...detail.candidate, id: 'c02' } }));
      expect(f).toHaveBeenCalledTimes(1);
    });

    it('un échec n’est pas mémorisé', async () => {
      await expect(loadDetail(2, 'c01', fakeFetch({}, { status: 404 }))).rejects.toEqual({ kind: 'network', status: 404 });
      await expect(loadDetail(2, 'c01', fakeFetch(detail))).resolves.toEqual(detail);
    });

    it('schéma refusé ⇒ invalid', async () => {
      await expect(loadDetail(2, 'c01', fakeFetch({ version: 2 }))).rejects.toMatchObject({ kind: 'invalid' });
    });

    it.each(['../main', 'C01', 'c01?x=1', 'c01#a', '', 'c01/..'])('refuse l’identifiant « %s » sans requête', async (id) => {
      const f = fakeFetch(detail);
      await expect(loadDetail(2, id, f)).rejects.toMatchObject({ kind: 'invalid' });
      expect(f).not.toHaveBeenCalled();
    });
  });
});
