// Banque fictive servie aux tests e2e par interception de route (R6) : rien de fictif n'est
// publié sous public/data. Même jeu que les tests du domaine (16 thèmes × 20 questions).
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Page } from '@playwright/test';
import { bankFromDataset } from '../../src/core/bank/bank';
import { syntheticDataset } from '../../src/core/bank/fixtures';
import { selectQuestions } from '../../src/core/selection/select';
import type { Mode } from '../../src/core/types';

export const dataset = (version = 1) => syntheticDataset({ themes: 16, perTheme: 20, version });

export const bankOf = (version = 1) => bankFromDataset(dataset(version));

export function registry(current: number) {
  return {
    current,
    versions: Array.from({ length: current }, (_, i) => ({
      number: i + 1,
      publishedAt: '2026-11-08',
      questionCount: 320,
      candidateCount: 22,
      mainHash: `sha256:${'0'.repeat(64)}`,
      detailHashes: {},
    })),
  };
}

/** Répond aux requêtes du jeu publié : registre `{ current }` et `main.json` de chaque version. */
export async function servePublished(page: Page, { current = 1 }: { current?: number } = {}) {
  await page.route('**/data/versions.json', (route) => route.fulfill({ json: registry(current) }));
  await page.route('**/data/versions/*/main.json', (route) => {
    const version = Number(/versions\/(\d+)\/main\.json/.exec(route.request().url())?.[1]);
    if (!version || version > current) return route.fulfill({ status: 404, body: '' });
    return route.fulfill({ json: dataset(version) });
  });
}

/** Sélection attendue, calculée par le cœur à partir du même jeu. */
export function expectedSelection(mode: Mode, priorities: readonly string[], version = 1) {
  return selectQuestions(bankOf(version), mode, priorities);
}

type Messages = Record<string, unknown>;

/** Messages `fr` (lus depuis le fichier, comme dans home.spec.ts). */
export const fr = JSON.parse(readFileSync(join(__dirname, '../../src/i18n/messages/fr.json'), 'utf8')) as Messages;

/** Valeur d'une clé `a.b.c` de fr.json, espaces insécables remplacés par des espaces simples. */
export function msg(key: string, values: Record<string, string | number> = {}): string {
  let value = key.split('.').reduce<unknown>((node, part) => (node as Messages)[part], fr);
  if (typeof value !== 'string') throw new Error(`clé absente : ${key}`);
  for (const [name, v] of Object.entries(values)) value = (value as string).replaceAll(`{${name}}`, String(v));
  return (value as string).replace(/[  ]/g, ' ');
}
