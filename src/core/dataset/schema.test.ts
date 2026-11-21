// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { minimalMainDataset, minimalMainDatasetV2 } from './fixture';
import { CandidateDetailSchema, MainDatasetSchema, VersionRegistrySchema } from './schema';
import type { MainDataset } from './types';

const ok = (ds: unknown) => MainDatasetSchema.safeParse(ds).success;

describe('MainDatasetSchema', () => {
  it('accepte le jeu minimal', () => {
    expect(MainDatasetSchema.safeParse(minimalMainDataset()).error).toBeUndefined();
  });

  it.each<[string, (ds: MainDataset) => void]>([
    ['ordre de thème non contigu', (ds) => void (ds.themes[1]!.order = 5)],
    ['plus de 24 thèmes', (ds) => void (ds.themes = Array.from({ length: 25 }, (_, i) => ({ ...ds.themes[0]!, id: `t-${i}`, order: i })))],
    ['questions non triées', (ds) => void ds.questions.reverse()],
    ['ligne de positions trop courte', (ds) => void (ds.positions.dupont = [null])],
    ['positions manquantes', (ds) => void delete ds.positions.martin],
    ['candidat non déclaré', (ds) => void ((ds.candidates[0] as { status: string }).status = 'withdrawn')],
    ['clé inconnue', (ds) => void ((ds as Record<string, unknown>).extra = 1)],
    ['valeur hors échelle', (ds) => void ((ds.positions.dupont as unknown[])[0] = [3, 'p'])],
  ])('rejette : %s', (_, mutate) => {
    const ds = minimalMainDataset();
    mutate(ds);
    expect(ok(ds)).toBe(false);
  });
});

describe('MainDatasetSchema, règles de sélection 2 (007)', () => {
  it('accepte la forme règles 2', () => {
    expect(MainDatasetSchema.safeParse(minimalMainDatasetV2()).error).toBeUndefined();
  });

  it.each<[string, (ds: MainDataset) => void]>([
    ['règles 3', (ds) => void ((ds as { selectionRules: number }).selectionRules = 3)],
    ['règles 2 avec une question sans enjeu', (ds) => void delete ds.questions[1]!.subject],
    ['forme mixte : enjeu sans selectionRules', (ds) => void delete ds.selectionRules],
    ['enjeu mal formé', (ds) => void (ds.questions[0]!.subject = 'Impôt Revenu')],
  ])('rejette : %s', (_, mutate) => {
    const ds = minimalMainDatasetV2();
    mutate(ds);
    expect(ok(ds)).toBe(false);
  });

  it('accepte les versions 1 et 2 réelles', async () => {
    const { readFileSync } = await import('node:fs');
    for (const v of [1, 2]) {
      const ds = JSON.parse(readFileSync(`public/data/versions/${v}/main.json`, 'utf8'));
      expect(MainDatasetSchema.safeParse(ds).error).toBeUndefined();
    }
  });
});

describe('VersionRegistrySchema', () => {
  const entry = (number: number) => ({
    number,
    publishedAt: '2026-11-08',
    questionCount: 2,
    candidateCount: 2,
    mainHash: `sha256:${'a'.repeat(64)}`,
    detailHashes: { dupont: `sha256:${'b'.repeat(64)}` },
  });
  it('accepte un registre vide et un registre contigu', () => {
    expect(VersionRegistrySchema.safeParse({ current: 0, versions: [] }).success).toBe(true);
    expect(VersionRegistrySchema.safeParse({ current: 2, versions: [entry(1), entry(2)] }).success).toBe(true);
  });
  it('rejette des numéros non contigus ou au-delà de 256', () => {
    expect(VersionRegistrySchema.safeParse({ current: 2, versions: [entry(1), entry(3)] }).success).toBe(false);
    const many = Array.from({ length: 257 }, (_, i) => entry(i + 1));
    expect(VersionRegistrySchema.safeParse({ current: 257, versions: many }).success).toBe(false);
  });
});

describe('CandidateDetailSchema', () => {
  it('accepte un détail et rejette une position sans source', () => {
    const detail = {
      version: 1,
      candidate: { id: 'dupont', name: 'Jeanne Dupont', party: 'Parti A' },
      sources: {
        'dupont-prog': {
          url: 'https://exemple.fr/p.pdf',
          title: 'Programme',
          kind: 'programme',
          publishedAt: { date: '2026-10', precision: 'month' },
          accessedAt: '2026-11-07',
        },
      },
      positions: {
        'economie-a': { value: -1, level: 'p', quote: 'Citation.', quoteSource: 'dupont-prog', justification: 'J.', sources: ['dupont-prog'] },
      },
    };
    expect(CandidateDetailSchema.safeParse(detail).error).toBeUndefined();
    (detail.positions['economie-a'] as { sources: string[] }).sources = [];
    expect(CandidateDetailSchema.safeParse(detail).success).toBe(false);
  });
});
