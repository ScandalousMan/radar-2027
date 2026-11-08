// Registre des versions publiées (public/data/versions.json, R11, FR-039, FR-040).
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { MAX_VERSIONS, VersionRegistrySchema, type VersionEntry, type VersionRegistry } from '@/core/dataset';
import { sha256 } from '../text';

/** Seuil d'avertissement `VERSIONS-NEAR-LIMIT`. */
export const VERSIONS_WARNING_AT = 200;

export function readRegistry(publishedDir: string): VersionRegistry {
  const file = join(publishedDir, 'versions.json');
  if (!existsSync(file)) return { current: 0, versions: [] };
  return VersionRegistrySchema.parse(JSON.parse(readFileSync(file, 'utf8')));
}

/** Ajoute la version `current + 1` ; refuse au-delà de 256 versions. */
export function appendVersion(registry: VersionRegistry, entry: Omit<VersionEntry, 'number'>): { registry: VersionRegistry; warnings: string[] } {
  const number = registry.current + 1;
  if (number > MAX_VERSIONS) throw new Error(`limite de ${MAX_VERSIONS} versions atteinte : aucune nouvelle version possible`);
  const warnings = number >= VERSIONS_WARNING_AT ? [`VERSIONS-NEAR-LIMIT : version ${number} sur ${MAX_VERSIONS} possibles`] : [];
  return { registry: { current: number, versions: [...registry.versions, { number, ...entry }] }, warnings };
}

/** Empreintes des fichiers d'une version publiée. */
export function fileHashes(publishedDir: string, n: number): { mainHash: string | null; detailHashes: Record<string, string> } {
  const dir = join(publishedDir, 'versions', String(n));
  const main = join(dir, 'main.json');
  const detailHashes: Record<string, string> = {};
  const cdir = join(dir, 'candidates');
  if (existsSync(cdir)) {
    for (const f of readdirSync(cdir).filter((x) => x.endsWith('.json')).sort()) detailHashes[f.replace(/\.json$/, '')] = sha256(readFileSync(join(cdir, f), 'utf8'));
  }
  return { mainHash: existsSync(main) ? sha256(readFileSync(main, 'utf8')) : null, detailHashes };
}
