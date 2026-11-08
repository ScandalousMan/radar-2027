// @vitest-environment node
import { cp, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { formatPublishedAt, loadCurrentMain, loadDetail, loadRegistry } from './dataset';

const PUB = join(process.cwd(), 'data', 'fixtures', 'violations', 'PUB-BUDGET', 'published');

describe('lecture du jeu publié', () => {
  it('aucune version : registre vide, pas de jeu', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'radar-ds-'));
    expect(loadRegistry(dir)).toEqual({ current: 0, versions: [] });
    expect(loadCurrentMain(dir)).toBeNull();
    expect(loadDetail('dupont', dir)).toBeNull();
  });

  it('lit et valide la version courante publiée', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'radar-ds-'));
    await cp(PUB, dir, { recursive: true });
    const main = loadCurrentMain(dir);
    expect(main?.version).toBe(1);
    expect(main?.candidates.map((c) => c.id)).toEqual(['dupont', 'martin']);
    expect(Object.keys(loadDetail('dupont', dir)?.positions ?? {})).toEqual(['economie-q01', 'economie-q02']);
    expect(loadDetail('inconnu', dir)).toBeNull();
  });

  it('met en forme une date selon sa précision', () => {
    const fmt = (d: Date, o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('fr-FR', { ...o, timeZone: 'Europe/Paris' }).format(d);
    expect(formatPublishedAt({ date: '2026-03-14', precision: 'day' }, fmt)).toBe('14 mars 2026');
    expect(formatPublishedAt({ date: '2026-03', precision: 'month' }, fmt)).toBe('mars 2026');
    expect(formatPublishedAt({ date: '2026', precision: 'year' }, fmt)).toBe('2026');
  });
});
