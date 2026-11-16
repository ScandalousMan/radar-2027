// @vitest-environment node
// SC-006, FR-013 (006), R8 : les 20 liens de partage v1 figés avant la publication de la
// version 2 sont rejoués par le chemin réel (`loadResults` : version choisie par l'en-tête du
// fragment, jeu lu dans `public/data/versions/` sur le disque) et donnent le même résultat.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { decodeHeader } from '@/core';
import { clearDatasetCache } from '@/lib/dataset-client';
import { loadResults } from './load';
import { diskFetcher, snapshotBoard, type BoardSnapshot } from './replay-snapshot';

type ReplayCase = { readonly id: string; readonly fragment: string; readonly mode: string; readonly priorities: readonly string[]; readonly expected: BoardSnapshot };

const ROOT = process.cwd();
const fixture = JSON.parse(readFileSync(path.join(ROOT, 'src/lib/results/replay-v1.fixture.json'), 'utf8')) as { bankVersion: number; cases: ReplayCase[] };
const registry = JSON.parse(readFileSync(path.join(ROOT, 'public/data/versions.json'), 'utf8')) as { current: number };
const fetcher = diskFetcher(ROOT);

afterEach(() => clearDatasetCache());

describe('rejeu des liens de partage v1 (SC-006)', () => {
  it('la fixture contient 20 liens v1, modes complet et court, avec « sans avis »', () => {
    expect(fixture.bankVersion).toBe(1);
    expect(fixture.cases).toHaveLength(20);
    expect(new Set(fixture.cases.map((c) => c.mode))).toEqual(new Set(['full', 'short']));
    expect(new Set(fixture.cases.map((c) => c.priorities.length))).toEqual(new Set([3, 4, 5]));
  });

  it.each(fixture.cases.map((c) => [c.id, c] as const))('%s : résultat identique', async (_id, c) => {
    const header = decodeHeader(c.fragment, registry.current);
    expect(header.ok && header.value.bankVersion).toBe(1);

    const page = await loadResults(c.fragment, 'https://radar.exemple', fetcher);
    expect(page.status).toBe('ready');
    if (page.status !== 'ready') return;
    expect(page.data.bank.version).toBe(1);
    expect(page.data.themes).toHaveLength(17);
    expect(page.data.board.priorVersion).toBe(registry.current > 1);
    expect(snapshotBoard(page.data.board)).toEqual(c.expected);
  });
});
