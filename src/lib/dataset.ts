// Lecture du jeu de données publié au moment du build (module serveur : `node:fs`, jamais
// importé par un composant client). La page Méthodologie lit les mêmes fichiers que ceux servis
// sous /data (FR-044, R12) et les valide avec les schémas de src/core/dataset.
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  CandidateDetailSchema,
  MainDatasetSchema,
  VersionRegistrySchema,
  type CandidateDetail,
  type MainDataset,
  type VersionRegistry,
} from '@/core/dataset';

export { formatPublishedAt } from './published-date';

export const PUBLISHED_DIR = join(process.cwd(), 'public', 'data');

function readJson(file: string): unknown {
  return JSON.parse(readFileSync(file, 'utf8'));
}

export function loadRegistry(baseDir: string = PUBLISHED_DIR): VersionRegistry {
  const file = join(baseDir, 'versions.json');
  if (!existsSync(file)) return { current: 0, versions: [] };
  return VersionRegistrySchema.parse(readJson(file));
}

/** Jeu principal de la version courante ; `null` si aucune version n'est publiée. */
export function loadCurrentMain(baseDir: string = PUBLISHED_DIR): MainDataset | null {
  const { current } = loadRegistry(baseDir);
  if (current === 0) return null;
  return MainDatasetSchema.parse(readJson(join(baseDir, 'versions', String(current), 'main.json')));
}

/** Détail d'un candidat dans la version courante ; `null` si absent. */
export function loadDetail(candidateId: string, baseDir: string = PUBLISHED_DIR): CandidateDetail | null {
  const { current } = loadRegistry(baseDir);
  if (current === 0) return null;
  const file = join(baseDir, 'versions', String(current), 'candidates', `${candidateId}.json`);
  if (!existsSync(file)) return null;
  return CandidateDetailSchema.parse(readJson(file));
}
