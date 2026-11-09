// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';
import { bankFromDataset, encodeFragment, selectQuestions, type MainDataset, type Mode, type ResultState } from '@/core';
import { syntheticDataset } from '@/core/bank/fixtures';
import { decodeBase64Url, encodeBase64Url } from '@/core/codec/base64url';
import { answerToCode } from '@/core/codec/bits';
import { buildPayload } from '@/core/codec/payload';
import { clearDatasetCache } from '@/lib/dataset-client';
import { loadResults } from './load';

const ORIGIN = 'https://radar.exemple';
const PRIORITIES = ['t01', 't04', 't07', 't10'];

function v1(): MainDataset {
  return syntheticDataset({ version: 1, publishedAt: '2026-11-08' });
}

/** Version 2 : le candidat c21 n'est plus inclus. */
function v2(): MainDataset {
  const d = syntheticDataset({ version: 2, publishedAt: '2026-11-15' });
  const positions = { ...d.positions };
  delete positions.c21;
  return { ...d, candidates: d.candidates.filter((c) => c.id !== 'c21'), positions };
}

function registry(current: number) {
  return {
    current,
    versions: Array.from({ length: current }, (_, i) => ({ number: i + 1, publishedAt: '2026-11-08', questionCount: 320, candidateCount: 22, mainHash: `sha256:${'0'.repeat(64)}`, detailHashes: {} })),
  };
}

function fetcherFor(current: number, mains: Record<number, unknown> = { 1: v1(), 2: v2() }) {
  return vi.fn<typeof fetch>(async (input) => {
    const url = String(input);
    if (url === '/data/versions.json') return Response.json(registry(current));
    const m = /^\/data\/versions\/(\d+)\/main\.json$/.exec(url);
    if (m && mains[Number(m[1])]) return Response.json(mains[Number(m[1])]);
    return new Response('', { status: 404 });
  });
}

function linkOf(version: number, mode: Mode = 'short', priorities = PRIORITIES) {
  const bank = bankFromDataset(version === 1 ? v1() : v2());
  const n = selectQuestions(bank, mode, priorities).items.length;
  const state: ResultState = { bankVersion: version, mode, priorities, answers: Array.from({ length: n }, (_, i) => ([-2, -1, 0, 1, 2, 'skipped'] as const)[i % 6]!) };
  return { state, hash: encodeFragment(state, bank) };
}

afterEach(() => clearDatasetCache());

describe('loadResults — états sans résultat (R2)', () => {
  it.each(['', '#'])('« %s » ⇒ no-fragment, aucune requête', async (hash) => {
    const f = fetcherFor(1);
    expect(await loadResults(hash, ORIGIN, f)).toEqual({ status: 'no-fragment' });
    expect(f).not.toHaveBeenCalled();
  });

  it('current = 0 ⇒ no-version', async () => {
    expect(await loadResults(linkOf(1).hash, ORIGIN, fetcherFor(0))).toEqual({ status: 'no-version' });
  });

  it('préfixe faux ⇒ invalid unsupported-link-version', async () => {
    expect(await loadResults(linkOf(1).hash.replace('#1.', '#2.'), ORIGIN, fetcherFor(1))).toEqual({ status: 'invalid', reason: 'unsupported-link-version' });
  });

  it('caractère hors alphabet ⇒ invalid-content', async () => {
    const hash = linkOf(1).hash;
    expect(await loadResults(`${hash.slice(0, 8)}*${hash.slice(9)}`, ORIGIN, fetcherFor(1))).toEqual({ status: 'invalid', reason: 'invalid-content' });
  });

  it('CRC faux ⇒ invalid-checksum', async () => {
    const hash = linkOf(1).hash;
    const bytes = decodeBase64Url(hash.slice(3))!;
    bytes[6] = bytes[6]! ^ 0b00100100;
    expect(await loadResults(`#1.${encodeBase64Url(bytes)}`, ORIGIN, fetcherFor(1))).toEqual({ status: 'invalid', reason: 'invalid-checksum' });
  });

  it('longueur fausse ⇒ invalid-length', async () => {
    expect(await loadResults(`${linkOf(1).hash}AAAA`, ORIGIN, fetcherFor(1))).toEqual({ status: 'invalid', reason: 'invalid-length' });
  });

  it('2 sujets ⇒ invalid-content', async () => {
    const payload = buildPayload(1, 'short', [1, 4], Array.from({ length: 25 }, () => answerToCode(1)));
    expect(await loadResults(`#1.${encodeBase64Url(payload)}`, ORIGIN, fetcherFor(1))).toEqual({ status: 'invalid', reason: 'invalid-content' });
  });

  it('10 000 caractères ⇒ invalid sans exception', async () => {
    const state = await loadResults(`#1.${'A'.repeat(10_000)}`, ORIGIN, fetcherFor(1));
    expect(state.status).toBe('invalid');
  });

  it('version > current ⇒ unknown-version, aucun main.json', async () => {
    const f = fetcherFor(1);
    expect(await loadResults(linkOf(2).hash, ORIGIN, f)).toEqual({ status: 'unknown-version' });
    expect(f.mock.calls.map((c) => c[0])).toEqual(['/data/versions.json']);
  });

  it('échec réseau ⇒ error network', async () => {
    const f = vi.fn<typeof fetch>(async () => Promise.reject(new TypeError('hors ligne')));
    expect(await loadResults(linkOf(1).hash, ORIGIN, f)).toEqual({ status: 'error', reason: 'network' });
  });

  it('main.json absent ⇒ error network', async () => {
    expect(await loadResults(linkOf(1).hash, ORIGIN, fetcherFor(1, {}))).toEqual({ status: 'error', reason: 'network' });
  });

  it('jeu invalide ⇒ error invalid-data', async () => {
    expect(await loadResults(linkOf(1).hash, ORIGIN, fetcherFor(1, { 1: { version: 1 } }))).toEqual({ status: 'error', reason: 'invalid-data' });
  });

  it('en-tête accepté mais banque incohérente (unknown-bank-version au décodage complet) ⇒ error internal', async () => {
    // main.json de la version 1 qui se déclare version 3 : decodeFragment refuse la version.
    expect(await loadResults(linkOf(1).hash, ORIGIN, fetcherFor(1, { 1: { ...v1(), version: 3 } }))).toEqual({ status: 'error', reason: 'internal' });
  });
});

describe('loadResults — ready', () => {
  it('v = current : une seule version chargée, aucun prior, lien normalisé', async () => {
    const { state, hash } = linkOf(1);
    const f = fetcherFor(1);
    const result = await loadResults(hash, ORIGIN, f);
    expect(result.status).toBe('ready');
    if (result.status !== 'ready') return;
    expect(f.mock.calls.map((c) => c[0])).toEqual(['/data/versions.json', '/data/versions/1/main.json']);
    expect(result.data.state).toEqual(state);
    expect(result.data.prior).toBeNull();
    expect(result.data.shareUrl).toBe(`${ORIGIN}/resultats${hash}`);
    expect(result.data.shareUrl).not.toContain('?');
    expect(result.data.currentBank.version).toBe(1);
    expect(result.data.board.ranked.length + result.data.board.insufficient.length).toBe(22);
  });

  it('fragment sans « # » accepté', async () => {
    const { hash } = linkOf(1);
    expect((await loadResults(hash.slice(1), ORIGIN, fetcherFor(1))).status).toBe('ready');
  });

  it('v < current : calcul avec v seulement, prior daté de v, retirés corrects, currentBank = courante', async () => {
    const { hash } = linkOf(1);
    const f = fetcherFor(2);
    const result = await loadResults(hash, ORIGIN, f);
    expect(result.status).toBe('ready');
    if (result.status !== 'ready') return;
    expect(f.mock.calls.map((c) => c[0]).sort()).toEqual(['/data/versions.json', '/data/versions/1/main.json', '/data/versions/2/main.json']);
    expect(result.data.bank.version).toBe(1);
    expect(result.data.board.priorVersion).toBe(true);
    expect(result.data.prior).toEqual({ publishedAt: '2026-11-08', withdrawnIds: ['c21'] });
    expect(result.data.currentBank.version).toBe(2);
    // Le candidat retiré reste calculé avec les données de sa version (FR-033).
    const all = [...result.data.board.ranked, ...result.data.board.insufficient].map((s) => s.candidate.id);
    expect(all).toContain('c21');
  });

  it('jamais d’exception', async () => {
    const f = vi.fn<typeof fetch>(async () => {
      throw new Error('inattendu');
    });
    await expect(loadResults(linkOf(1).hash, ORIGIN, f)).resolves.toMatchObject({ status: 'error' });
  });
});
