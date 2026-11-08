// @vitest-environment node
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { cachePath, hasCache, openCache, readCached, writeCached } from './cache';
import { sha256 } from './text';

describe('cache des sources', () => {
  it('écrit, relit et retrouve par empreinte', async () => {
    const dir = join(await mkdtemp(join(tmpdir(), 'radar-cache-')), 'sources');
    expect(hasCache(dir)).toBe(false);
    const hash = writeCached(dir, 'Texte normalisé.');
    expect(hash).toBe(sha256('Texte normalisé.'));
    expect(hasCache(dir)).toBe(true);
    expect(cachePath(dir, hash)).toBe(join(dir, `${hash.slice(7)}.txt`));
    expect(readCached(dir, hash)).toBe('Texte normalisé.');
    expect(readCached(dir, sha256('autre'))).toBeNull();
    expect(openCache(dir).read(hash)).toBe('Texte normalisé.');
  });
});
