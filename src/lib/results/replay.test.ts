// @vitest-environment node
// SC-006, FR-013 (006), R8 : les liens de partage v1 et v2, figés avant la publication de la
// version suivante, sont rejoués par le chemin réel (`loadResults` : version choisie par
// l'en-tête du fragment, jeu lu dans `public/data/versions/` sur le disque) et donnent le même
// résultat. Les règles de sélection de 007 ne doivent jamais les modifier.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { decodeHeader } from '@/core';
import { clearDatasetCache } from '@/lib/dataset-client';
import { loadResults } from './load';
import { diskFetcher, snapshotBoard, type BoardSnapshot } from './replay-snapshot';

type ReplayCase = { readonly id: string; readonly fragment: string; readonly mode: string; readonly priorities: readonly string[]; readonly expected: BoardSnapshot };

const ROOT = process.cwd();
const registry = JSON.parse(readFileSync(path.join(ROOT, 'public/data/versions.json'), 'utf8')) as { current: number };
const fetcher = diskFetcher(ROOT);
const VERSIONS = [
  { version: 1, themes: 17 },
  { version: 2, themes: 18 },
] as const;

afterEach(() => clearDatasetCache());

describe.each(VERSIONS)('rejeu des liens de partage v$version (SC-006)', ({ version, themes }) => {
  const fixture = JSON.parse(readFileSync(path.join(ROOT, `src/lib/results/replay-v${version}.fixture.json`), 'utf8')) as { bankVersion: number; cases: ReplayCase[] };

  it(`la fixture contient 20 liens v${version}, modes complet et court, avec « sans avis »`, () => {
    expect(fixture.bankVersion).toBe(version);
    expect(fixture.cases).toHaveLength(20);
    expect(new Set(fixture.cases.map((c) => c.mode))).toEqual(new Set(['full', 'short']));
    expect(new Set(fixture.cases.map((c) => c.priorities.length))).toEqual(new Set([3, 4, 5]));
  });

  it.each(fixture.cases.map((c) => [c.id, c] as const))('%s : résultat identique', async (_id, c) => {
    const header = decodeHeader(c.fragment, registry.current);
    expect(header.ok && header.value.bankVersion).toBe(version);

    const page = await loadResults(c.fragment, 'https://radar.exemple', fetcher);
    expect(page.status).toBe('ready');
    if (page.status !== 'ready') return;
    expect(page.data.bank.version).toBe(version);
    expect(page.data.themes).toHaveLength(themes);
    expect(page.data.board.priorVersion).toBe(registry.current > version);
    expect(snapshotBoard(page.data.board)).toEqual(c.expected);
  });
});
