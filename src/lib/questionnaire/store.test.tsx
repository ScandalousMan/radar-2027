import { act, render, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { syntheticDataset } from '@/core/bank/fixtures';
import { clearDatasetCache } from '@/lib/dataset-client';
import { PRIORITIES, testDraft } from './fixtures';
import { DRAFT_STORAGE_KEY, type StorageLike } from './storage';
import { QuestionnaireProvider, useQuestionnaire, type QuestionnaireContext } from './store';

const registry = (current: number) => ({
  current,
  versions: Array.from({ length: current }, (_, i) => ({ number: i + 1, publishedAt: '2026-11-08', questionCount: 320, candidateCount: 22, mainHash: `sha256:${'0'.repeat(64)}`, detailHashes: {} })),
});

function fakeFetch({ current = 1, registryStatus = 200, mainBody }: { current?: number; registryStatus?: number; mainBody?: unknown } = {}) {
  return vi.fn<typeof fetch>(async (input) => {
    const url = String(input);
    if (url === '/data/versions.json') return new Response(JSON.stringify(registry(current)), { status: registryStatus });
    const m = /^\/data\/versions\/(\d+)\/main\.json$/.exec(url);
    if (m) return new Response(JSON.stringify(mainBody ?? syntheticDataset({ version: Number(m[1]) })), { status: 200 });
    return new Response('', { status: 404 });
  });
}

function memory(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  const storage: StorageLike & { data: Map<string, string>; setItem: ReturnType<typeof vi.fn> } = {
    data,
    getItem: (k) => data.get(k) ?? null,
    setItem: vi.fn((k: string, v: string) => void data.set(k, v)),
    removeItem: (k) => void data.delete(k),
  };
  return storage;
}

let clock = 0;
const now = () => new Date(Date.UTC(2026, 10, 8, 18, 0, clock++)).toISOString();

type MemoryStorage = ReturnType<typeof memory>;

function setup(options: { fetcher?: typeof fetch; storage?: MemoryStorage } = {}) {
  const fetcher = options.fetcher ?? fakeFetch();
  const storage = options.storage ?? memory();
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QuestionnaireProvider fetcher={fetcher} storage={storage} now={now}>
      {children}
    </QuestionnaireProvider>
  );
  const hook = renderHook(() => useQuestionnaire(), { wrapper });
  return { ...hook, storage, fetcher, ctx: () => hook.result.current as QuestionnaireContext };
}

async function ready(ctx: () => QuestionnaireContext) {
  await waitFor(() => expect(ctx().load.status).toBe('ready'));
}

async function startShort(ctx: () => QuestionnaireContext) {
  await ready(ctx);
  act(() => ctx().setPriorities([...PRIORITIES]));
  act(() => ctx().setMode('short'));
  let result: string | undefined;
  act(() => {
    result = ctx().start();
  });
  return result;
}

afterEach(() => {
  clearDatasetCache();
});

describe('QuestionnaireProvider : chargement et parcours (US1)', () => {
  it('passe de loading à ready avec 16 thèmes', async () => {
    const { ctx } = setup();
    expect(ctx().load.status).toBe('loading');
    await ready(ctx);
    const load = ctx().load;
    expect(load.status === 'ready' && load.bank.themes).toHaveLength(16);
  });

  it('no-version quand current = 0', async () => {
    const { ctx } = setup({ fetcher: fakeFetch({ current: 0 }) });
    await waitFor(() => expect(ctx().load.status).toBe('no-version'));
  });

  it('error.network et error.invalid, puis retry', async () => {
    const a = setup({ fetcher: fakeFetch({ registryStatus: 500 }) });
    await waitFor(() => expect(a.ctx().load).toEqual({ status: 'error', reason: 'network' }));
    a.unmount();
    clearDatasetCache();
    const b = setup({ fetcher: fakeFetch({ mainBody: { version: 1 } }) });
    await waitFor(() => expect(b.ctx().load).toEqual({ status: 'error', reason: 'invalid' }));
    act(() => b.ctx().retry());
    await waitFor(() => expect(b.ctx().load).toEqual({ status: 'error', reason: 'invalid' }));
    expect(b.fetcher).toHaveBeenCalledTimes(4);
  });

  it('setPriorities normalise en ordre canonique et calcule les deux sélections dès 3 sujets', async () => {
    const { ctx } = setup();
    await ready(ctx);
    act(() => ctx().setPriorities(['t07', 't01']));
    expect(ctx().load.status === 'ready' && (ctx().load as { selections: unknown }).selections).toBeNull();
    act(() => ctx().setPriorities(['t07', 't01', 't04']));
    expect(ctx().choice.priorities).toEqual(['t01', 't04', 't07']);
    const load = ctx().load;
    if (load.status !== 'ready' || !load.selections) throw new Error('sélections attendues');
    expect(load.selections.short.items).toHaveLength(25);
    expect(load.selections.full.items).toHaveLength(100);
  });

  it('start() crée un brouillon de N réponses et resultHref commence par /resultats#1.', async () => {
    const { ctx } = setup();
    expect(await startShort(ctx)).toBe('started');
    expect(ctx().draft?.answers).toHaveLength(25);
    expect(ctx().draft?.position).toBe(0);
    expect(ctx().selection?.items).toHaveLength(25);
    expect(ctx().resultHref?.startsWith('/resultats#1.')).toBe(true);
  });

  it('start() avec le même triplet reprend sans modifier ; triplet différent demande confirmation (R13)', async () => {
    const { ctx } = setup();
    await startShort(ctx);
    act(() => ctx().dispatch({ type: 'answer', position: 0, answer: 2 }));
    act(() => ctx().dispatch({ type: 'next' }));
    const before = ctx().draft;
    let result: string | undefined;
    act(() => {
      result = ctx().start();
    });
    expect(result).toBe('resumed');
    expect(ctx().draft).toBe(before);

    act(() => ctx().setMode('full'));
    act(() => {
      result = ctx().start();
    });
    expect(result).toBe('needs-confirmation');
    expect(ctx().draft).toBe(before);
    act(() => ctx().confirmStart());
    expect(ctx().draft?.answers).toHaveLength(100);
    expect(ctx().draft?.answers.every((a) => a === 'unanswered')).toBe(true);
  });

  it('useQuestionnaire lève hors du fournisseur', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    function Orphan() {
      useQuestionnaire();
      return null;
    }
    expect(() => render(<Orphan />)).toThrow(/QuestionnaireProvider/);
    spy.mockRestore();
  });
});

describe('QuestionnaireProvider : persistance (US3)', () => {
  it('aucune écriture avant start ; écriture complète après chaque action', async () => {
    const { ctx, storage } = setup();
    await ready(ctx);
    act(() => ctx().setPriorities([...PRIORITIES]));
    act(() => ctx().setMode('short'));
    expect(storage.data.has(DRAFT_STORAGE_KEY)).toBe(false);
    act(() => {
      ctx().start();
    });
    const read = () => JSON.parse(storage.data.get(DRAFT_STORAGE_KEY)!);
    expect(read()).toEqual(ctx().draft);
    act(() => ctx().dispatch({ type: 'answer', position: 0, answer: -1 }));
    expect(read().answers[0]).toBe(-1);
    act(() => ctx().dispatch({ type: 'next' }));
    expect(read().position).toBe(1);
    act(() => ctx().dispatch({ type: 'goTo', position: 5 }));
    expect(read().position).toBe(5);
    act(() => ctx().dispatch({ type: 'previous' }));
    expect(read().position).toBe(4);
    expect(read()).toEqual(ctx().draft);
  });

  it('stockage indisponible : aucune écriture, statut unavailable, parcours en mémoire', async () => {
    const storage = memory();
    storage.setItem.mockImplementation(() => {
      throw new Error('quota');
    });
    const { ctx } = setup({ storage });
    expect(await startShort(ctx)).toBe('started');
    expect(ctx().storage).toBe('unavailable');
    act(() => ctx().dispatch({ type: 'answer', position: 0, answer: 1 }));
    act(() => ctx().dispatch({ type: 'next' }));
    expect(ctx().draft?.position).toBe(1);
    expect(storage.data.size).toBe(0);
  });

  it('reprend au montage un brouillon stocké de la version courante et présélectionne le choix', async () => {
    const draft = testDraft({ position: 3, answers: testDraft().answers.map((a, i) => (i < 3 ? 1 : a)) });
    const { ctx } = setup({ storage: memory({ [DRAFT_STORAGE_KEY]: JSON.stringify(draft) }) });
    await waitFor(() => expect(ctx().draft).toEqual(draft));
    expect(ctx().choice).toEqual({ priorities: draft.priorities, mode: 'short' });
  });

  it('ne reprend pas un brouillon d’une autre version et demande confirmation avant de l’écraser', async () => {
    const draft = testDraft({ bankVersion: 1 });
    const storage = memory({ [DRAFT_STORAGE_KEY]: JSON.stringify(draft) });
    const { ctx } = setup({ fetcher: fakeFetch({ current: 2 }), storage });
    expect(await startShort(ctx)).toBe('needs-confirmation');
    expect(ctx().draft).toBeNull();
    expect(JSON.parse(storage.data.get(DRAFT_STORAGE_KEY)!)).toEqual(draft);
  });

  it('adopte un brouillon plus récent écrit par un autre onglet, ignore un plus ancien', async () => {
    const storage = memory();
    const { ctx } = setup({ storage });
    await startShort(ctx);
    const current = ctx().draft!;
    const fire = (d: unknown) => {
      storage.data.set(DRAFT_STORAGE_KEY, JSON.stringify(d));
      act(() => {
        window.dispatchEvent(Object.assign(new Event('storage'), { key: DRAFT_STORAGE_KEY }));
      });
    };
    fire({ ...current, position: 9, updatedAt: '2000-01-01T00:00:00.000Z' });
    expect(ctx().draft?.position).toBe(0);
    fire({ ...current, position: 7, updatedAt: '2099-01-01T00:00:00.000Z' });
    await waitFor(() => expect(ctx().draft?.position).toBe(7));
  });

  it('reset et clear effacent la clé ; reset garde la présélection, clear la vide', async () => {
    const { ctx, storage } = setup();
    await startShort(ctx);
    expect(storage.data.has(DRAFT_STORAGE_KEY)).toBe(true);
    act(() => ctx().dispatch({ type: 'reset' }));
    expect(storage.data.has(DRAFT_STORAGE_KEY)).toBe(false);
    expect(ctx().draft).toBeNull();
    expect(ctx().choice).toEqual({ priorities: [...PRIORITIES], mode: 'short' });
    act(() => {
      ctx().start();
    });
    expect(storage.data.has(DRAFT_STORAGE_KEY)).toBe(true);
    act(() => ctx().dispatch({ type: 'clear' }));
    expect(storage.data.has(DRAFT_STORAGE_KEY)).toBe(false);
    expect(ctx().choice).toEqual({ priorities: [], mode: null });
  });
});
