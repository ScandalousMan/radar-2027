// Chargeur navigateur du jeu publié (contracts/storage-and-data.md § 2, R5).
// Seul chargeur client : réutilisé par la 005 pour les versions antérieures. Requêtes même
// origine, sans paramètre ni en-tête ajouté (SC-008) ; aucun import `node:*`.
import { MainDatasetSchema, VersionRegistrySchema, type MainDataset, type VersionRegistry } from '@/core';

export type DatasetClientError = { kind: 'network'; status?: number } | { kind: 'invalid'; issues: string };

type Fetcher = typeof fetch;

const mainCache = new Map<number, Promise<MainDataset>>();

export function isDatasetClientError(value: unknown): value is DatasetClientError {
  return typeof value === 'object' && value !== null && 'kind' in value && (value.kind === 'network' || value.kind === 'invalid');
}

async function getJson(url: string, cache: RequestCache, fetcher: Fetcher): Promise<unknown> {
  let response: Response;
  try {
    response = await fetcher(url, { cache });
  } catch {
    throw { kind: 'network' } satisfies DatasetClientError;
  }
  if (!response.ok) throw { kind: 'network', status: response.status } satisfies DatasetClientError;
  try {
    return await response.json();
  } catch {
    throw { kind: 'invalid', issues: 'JSON illisible' } satisfies DatasetClientError;
  }
}

function validate<T>(schema: { safeParse(v: unknown): { success: true; data: T } | { success: false; error: { message: string } } }, value: unknown): T {
  const parsed = schema.safeParse(value);
  if (!parsed.success) throw { kind: 'invalid', issues: parsed.error.message } satisfies DatasetClientError;
  return parsed.data;
}

/** Registre des versions publiées (`current = 0` : aucune version). */
export async function loadRegistry(fetcher: Fetcher = fetch): Promise<VersionRegistry> {
  return validate(VersionRegistrySchema, await getJson('/data/versions.json', 'no-cache', fetcher));
}

/** Jeu principal d'une version (immuable, mémoïsé pour la durée de la page). */
export function loadMain(version: number, fetcher: Fetcher = fetch): Promise<MainDataset> {
  const cached = mainCache.get(version);
  if (cached) return cached;
  const promise = getJson(`/data/versions/${version}/main.json`, 'force-cache', fetcher).then((json) => validate(MainDatasetSchema, json));
  mainCache.set(version, promise);
  // Un échec n'est pas mémorisé : « Réessayer » relance la requête.
  promise.catch(() => mainCache.delete(version));
  return promise;
}

export function clearDatasetCache(): void {
  mainCache.clear();
}
