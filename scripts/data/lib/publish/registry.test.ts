// @vitest-environment node
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { appendVersion, readRegistry } from './registry';

const entry = { publishedAt: '2026-11-10', questionCount: 1, candidateCount: 1, mainHash: `sha256:${'a'.repeat(64)}`, detailHashes: {} };

describe('registre des versions', () => {
  it('registre vide si absent', async () => {
    expect(readRegistry(await mkdtemp(join(tmpdir(), 'radar-reg-')))).toEqual({ current: 0, versions: [] });
  });
  it('numérote à la suite', () => {
    const { registry } = appendVersion({ current: 0, versions: [] }, entry);
    expect(registry.current).toBe(1);
    expect(registry.versions[0]!.number).toBe(1);
  });
  it('avertit dès 200 et refuse au-delà de 256', () => {
    const many = (n: number) => ({ current: n, versions: Array.from({ length: n }, (_, i) => ({ number: i + 1, ...entry })) });
    expect(appendVersion(many(198), entry).warnings).toEqual([]);
    expect(appendVersion(many(199), entry).warnings[0]).toMatch(/VERSIONS-NEAR-LIMIT/);
    expect(() => appendVersion(many(256), entry)).toThrow(/256/);
  });
});
