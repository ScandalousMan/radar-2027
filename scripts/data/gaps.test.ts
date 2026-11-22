// @vitest-environment node
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { resolvePaths } from './lib/cli';
import { gaps } from './gaps';

const MINIMAL = join(process.cwd(), 'data', 'fixtures', 'minimal');

describe('data:gaps sur la fixture minimale', () => {
  it('écrit trous/<date>.json et .md dans le dossier des rapports de fixture, sans toucher au corpus', () => {
    const paths = resolvePaths({ corpus: MINIMAL });
    const before = readFileSync(join(paths.corpusDir, 'positions', 'dupont.yaml'), 'utf8');
    const r = gaps(paths, { date: '2026-11-22', limit: 4 });
    const dir = join(paths.reportsDir, 'fixtures', 'trous');
    expect(r.files).toEqual([join(dir, '2026-11-22.json'), join(dir, '2026-11-22.md')]);
    const json = JSON.parse(readFileSync(r.files[0]!, 'utf8'));
    expect(json.rows).toHaveLength(57);
    expect(json.k).toBe(1);
    expect(readFileSync(r.files[1]!, 'utf8')).toContain('## Mission 1 — ');
    expect(readFileSync(join(paths.corpusDir, 'positions', 'dupont.yaml'), 'utf8')).toBe(before);
    expect(existsSync(join(paths.reportsDir, 'trous', '2026-11-22.json')) && JSON.parse(readFileSync(join(paths.reportsDir, 'trous', '2026-11-22.json'), 'utf8')).rows.length === 57).toBe(false);
  });

  it('refuse un candidat ou un thème inconnu et une date invalide', () => {
    const paths = resolvePaths({ corpus: MINIMAL });
    expect(() => gaps(paths, { candidates: ['inconnu'] })).toThrow(/Candidat inconnu/);
    expect(() => gaps(paths, { themes: ['inconnu'] })).toThrow(/Thème inconnu/);
    expect(() => gaps(paths, { date: '22/11/2026' })).toThrow(/Date invalide/);
  });
});
