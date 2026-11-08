// @vitest-environment node
import { mkdir, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { CliError, EXIT_FAILURE, EXIT_USAGE, fail, parseCli, resolvePaths, usage } from './cli';

describe('resolvePaths', () => {
  it('donne les dossiers du dépôt par défaut', () => {
    const p = resolvePaths({}, {}, '/depot');
    expect(p).toMatchObject({
      corpusDir: '/depot/data/corpus',
      publishedDir: '/depot/public/data',
      cacheDir: '/depot/.cache/sources',
      extractionsDir: '/depot/data/extractions',
      fixture: false,
    });
  });

  it('honore RADAR_SOURCE_CACHE_DIR pour le dépôt', () => {
    expect(resolvePaths({}, { RADAR_SOURCE_CACHE_DIR: 'ailleurs/cache' }, '/depot').cacheDir).toBe('/depot/ailleurs/cache');
  });

  it('reconnaît un dossier de fixture', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'radar-cli-'));
    await mkdir(join(dir, 'corpus'));
    const p = resolvePaths({ corpus: dir }, { RADAR_SOURCE_CACHE_DIR: '/ignore' }, '/depot');
    expect(p).toMatchObject({
      corpusDir: join(dir, 'corpus'),
      publishedDir: join(dir, 'published'),
      cacheDir: join(dir, 'cache'),
      fixture: true,
    });
  });

  it('accepte un dossier de corpus direct', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'radar-cli-'));
    const p = resolvePaths({ corpus: dir }, {}, '/depot');
    expect(p.corpusDir).toBe(dir);
    expect(p.publishedDir).toBe('/depot/public/data');
  });
});

describe('codes de sortie', () => {
  it('usage ⇒ 2, fail ⇒ 1', () => {
    expect(() => usage('x')).toThrow(CliError);
    try {
      usage('x');
    } catch (e) {
      expect((e as CliError).exitCode).toBe(EXIT_USAGE);
    }
    try {
      fail('y');
    } catch (e) {
      expect((e as CliError).exitCode).toBe(EXIT_FAILURE);
    }
  });

  it('une option inconnue est une erreur d’usage', () => {
    expect(() => parseCli(['--inconnue'], { corpus: { type: 'string' } }, 'aide')).toThrow(/aide/);
  });
});
