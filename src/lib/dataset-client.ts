// Chargeur navigateur du jeu publié (contracts/storage-and-data.md § 2, R5 ; 005 :
// contracts/data-and-share.md § 1, R5). Seul chargeur client : réutilisé par la 005 pour les
// versions antérieures et les fichiers de détail. Requêtes même origine, sans paramètre ni
// en-tête ajouté (SC-008 de la 004, SC-003 et FR-042 de la 005) ; aucun import `node:*`.
import type { CandidateDetail, MainDataset, VersionRegistry } from '@/core/dataset/types';

// Schémas chargés à la demande, en parallèle de la requête : zod reste hors du chargement initial des pages.
const schemas = () => import('@/core/dataset/schema');

export type DatasetClientError = { kind: 'network'; status?: number } | { kind: 'invalid'; issues: string };

type Fetcher = typeof fetch;

const mainCache = new Map<number, Promise<MainDataset>>();
const detailCache = new Map<string, Promise<CandidateDetail>>();

/** Identifiant de candidat admis dans un chemin (validé par la 002 ; jamais lu dans le fragment). */
const CANDIDATE_ID = /^[a-z0-9-]+$/;

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
  const [json, { VersionRegistrySchema }] = await Promise.all([getJson('/data/versions.json', 'no-cache', fetcher), schemas()]);
  return validate(VersionRegistrySchema, json);
}

/** Jeu principal d'une version (immuable, mémoïsé pour la durée de la page). */
export function loadMain(version: number, fetcher: Fetcher = fetch): Promise<MainDataset> {
  const cached = mainCache.get(version);
  if (cached) return cached;
  const promise = Promise.all([getJson(`/data/versions/${version}/main.json`, 'force-cache', fetcher), schemas()]).then(([json, { MainDatasetSchema }]) => validate(MainDatasetSchema, json));
  mainCache.set(version, promise);
  // Un échec n'est pas mémorisé : « Réessayer » relance la requête.
  promise.catch(() => mainCache.delete(version));
  return promise;
}

/**
 * Fichier de détail d'un candidat (citations, sources) d'une version, chargé à l'ouverture de sa
 * fiche seulement (FR-042) ; immuable, mémoïsé par (version, identifiant), échec non mémorisé.
 */
export function loadDetail(version: number, candidateId: string, fetcher: Fetcher = fetch): Promise<CandidateDetail> {
  if (!Number.isInteger(version) || version < 1 || !CANDIDATE_ID.test(candidateId)) {
    return Promise.reject({ kind: 'invalid', issues: 'identifiant de fichier de détail refusé' } satisfies DatasetClientError);
  }
  const key = `${version}/${candidateId}`;
  const cached = detailCache.get(key);
  if (cached) return cached;
  const promise = Promise.all([getJson(`/data/versions/${version}/candidates/${candidateId}.json`, 'force-cache', fetcher), schemas()]).then(([json, { CandidateDetailSchema }]) =>
    validate(CandidateDetailSchema, json),
  );
  detailCache.set(key, promise);
  promise.catch(() => detailCache.delete(key));
  return promise;
}

export function clearDatasetCache(): void {
  mainCache.clear();
  detailCache.clear();
}
