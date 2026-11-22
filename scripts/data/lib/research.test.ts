// @vitest-environment node
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { compareDates, level2Headings, loadResearch, moreThanTwelveMonths } from './research';
import { MINIMAL_DIR } from './rules/testing';

async function tempDir() {
  return mkdtemp(join(tmpdir(), 'radar-recherche-'));
}

describe('loadResearch', () => {
  it('dossier absent ou vide : corpus vide, aucune violation', async () => {
    const dir = await tempDir();
    for (const d of [join(dir, 'absent'), dir]) {
      const { research, violations } = loadResearch(d);
      expect(violations).toEqual([]);
      expect(research.personalities).toEqual([]);
      expect(research.evidence.size).toBe(0);
      expect(research.journals.size).toBe(0);
      expect(research.signals).toEqual([]);
    }
  });

  it('fixture minimale : chargée sans violation, comptes rendus relevés', () => {
    const { research, violations } = loadResearch(join(MINIMAL_DIR, 'recherche'));
    expect(violations).toEqual([]);
    expect(research.personalities.map((p) => p.id)).toEqual(['dupont', 'martin', 'jean-exemple']);
    expect([...research.evidence.keys()]).toEqual(['dupont', 'jean-exemple', 'martin']);
    expect(research.reports.get('2026-11-22-fixture-minimale')).toHaveLength(13);
  });

  it('élément fautif isolé : violation SCHEMA désignant le fichier et le chemin, le reste chargé', async () => {
    const dir = await tempDir();
    await writeFile(
      join(dir, 'personnalites.yaml'),
      `- id: a-b\n  name: A B\n  party: ""\n  statuses: []\n  createdAt: 2026-11-22\n  updatedAt: 2026-11-22\n- id: c-d\n  name: C D\n  party: ""\n  statuses:\n    - { status: POTENTIAL, at: { date: 2026, precision: year }, observedAt: 2026-11-22, evidence: [c-d-1] }\n  createdAt: 2026-11-22\n  updatedAt: 2026-11-22\n`,
    );
    await mkdir(join(dir, 'journaux'));
    await writeFile(join(dir, 'journaux', '2026-11-22-x.yaml'), 'id: 2026-11-22-x\nmode: AUTRE\n');
    const { research, violations } = loadResearch(dir);
    expect(research.personalities.map((p) => p.id)).toEqual(['c-d']);
    expect(violations.every((v) => v.rule === 'SCHEMA')).toBe(true);
    expect(violations.map((v) => v.entity.id)).toContain('recherche/personnalites.yaml:[0].statuses');
    expect(violations.some((v) => v.entity.id.startsWith('recherche/journaux/2026-11-22-x.yaml:.mode'))).toBe(true);
    expect(research.journals.size).toBe(0);
  });

  it('YAML illisible : violation SCHEMA', async () => {
    const dir = await tempDir();
    await writeFile(join(dir, 'signalements.yaml'), '- id: [\n');
    expect(loadResearch(dir).violations.map((v) => v.entity.id)).toEqual(['recherche/signalements.yaml']);
  });
});

describe('outils de dates et de titres', () => {
  it('titres de niveau 2', () => expect(level2Headings('# T\n## 1. A\n### x\n## 2. B\n')).toEqual(['1. A', '2. B']));
  it('comparaison au préfixe de précision', () => {
    expect(compareDates('2026-10', '2026-10-05')).toBe(0);
    expect(compareDates('2026-09-30', '2026-10')).toBe(-1);
    expect(compareDates('2027', '2026-12-31')).toBe(1);
  });
  it('plus de douze mois', () => {
    expect(moreThanTwelveMonths('2025-11-22', '2026-11-22')).toBe(false);
    expect(moreThanTwelveMonths('2025-11-21', '2026-11-22')).toBe(true);
    expect(moreThanTwelveMonths('2025-11', '2026-11-22')).toBe(false);
    expect(moreThanTwelveMonths('2024', '2025-12-31')).toBe(false);
    expect(moreThanTwelveMonths('2024', '2026-01-01')).toBe(true);
  });
});
