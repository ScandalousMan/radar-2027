// Brouillon dans le stockage local (contracts/storage-and-data.md § 1, data-model § 5, R4).
// FR-020 (persistance après chaque action), FR-023 (effacement complet), FR-025 (stockage
// indisponible). Une seule clé ; lecture tolérante : toute valeur invalide vaut « aucun brouillon ».
import { isAnswer, MAX_PRIORITIES, MIN_PRIORITIES, MODES } from '@/core/types';
import type { Draft, StorageStatus } from './types';

export const DRAFT_STORAGE_KEY = 'radar-questionnaire';
export const DRAFT_FORMAT = 1;
const PROBE_KEY = `${DRAFT_STORAGE_KEY}:__probe__`;

export type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

// Écouteurs du même onglet : l'événement `storage` ne parvient qu'aux autres onglets.
const localListeners = new Set<() => void>();
const notifyLocal = () => localListeners.forEach((listener) => listener());

/**
 * Relecture stricte du brouillon (data-model § 5). Écrite sans zod : ce module est chargé par
 * l'accueil et chaque étape, et la bibliothèque de validation pèse plus que toute la page.
 */
export function parseDraft(value: unknown): Draft | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return null;
  const v = value as Record<string, unknown>;
  const keys = ['format', 'bankVersion', 'mode', 'priorities', 'answers', 'position', 'updatedAt'];
  if (Object.keys(v).length !== keys.length || !keys.every((k) => k in v)) return null;
  if (v.format !== DRAFT_FORMAT) return null;
  if (!Number.isInteger(v.bankVersion) || (v.bankVersion as number) < 1) return null;
  if (!MODES.includes(v.mode as Draft['mode'])) return null;
  const p = v.priorities;
  if (!Array.isArray(p) || p.length < MIN_PRIORITIES || p.length > MAX_PRIORITIES) return null;
  if (!p.every((id) => typeof id === 'string' && id.length > 0) || new Set(p).size !== p.length) return null;
  const a = v.answers;
  if (!Array.isArray(a) || a.length === 0 || !a.every(isAnswer)) return null;
  if (!Number.isInteger(v.position) || (v.position as number) < 0 || (v.position as number) >= a.length) return null;
  if (typeof v.updatedAt !== 'string' || !ISO_DATETIME.test(v.updatedAt) || Number.isNaN(Date.parse(v.updatedAt))) return null;
  return value as Draft;
}

const ISO_DATETIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/;

function defaultStorage(): StorageLike | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage;
  } catch {
    return null;
  }
}

/** Brouillon stocké ; `null` si absent, invalide ou stockage indisponible. */
export function readDraft(storage: StorageLike | null = defaultStorage()): Draft | null {
  let raw: string | null;
  try {
    raw = storage?.getItem(DRAFT_STORAGE_KEY) ?? null;
  } catch {
    return null;
  }
  if (raw === null) return null;
  try {
    const draft = parseDraft(JSON.parse(raw));
    if (!draft && process.env.NODE_ENV === 'development') console.warn('Brouillon du questionnaire ignoré : valeur invalide.');
    return draft;
  } catch {
    if (process.env.NODE_ENV === 'development') console.warn('Brouillon du questionnaire illisible.');
    return null;
  }
}

/** Écrit le brouillon entier ; `false` si le stockage est indisponible (ne lève jamais). */
export function writeDraft(draft: Draft, storage: StorageLike | null = defaultStorage()): boolean {
  try {
    if (!storage) return false;
    storage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    notifyLocal();
    return true;
  } catch {
    return false;
  }
}

/** Supprime la clé du brouillon, et aucune autre. */
export function clearDraft(storage: StorageLike | null = defaultStorage()): boolean {
  try {
    if (!storage) return false;
    storage.removeItem(DRAFT_STORAGE_KEY);
    notifyLocal();
    return true;
  } catch {
    return false;
  }
}

/** Écriture puis suppression d'une clé d'essai. */
export function probeStorage(storage: StorageLike | null = defaultStorage()): StorageStatus {
  try {
    if (!storage) return 'unavailable';
    storage.setItem(PROBE_KEY, '1');
    storage.removeItem(PROBE_KEY);
    return 'available';
  } catch {
    try {
      storage?.removeItem(PROBE_KEY);
    } catch {
      // stockage refusé : rien à nettoyer
    }
    return 'unavailable';
  }
}

/**
 * Écoute les écritures sur la clé du brouillon : événement `storage` (autre onglet, cas limite
 * « deux onglets ») et écritures du même onglet par `writeDraft` / `clearDraft`.
 */
export function subscribeDraft(listener: () => void, target: Pick<Window, 'addEventListener' | 'removeEventListener'> | null = typeof window === 'undefined' ? null : window): () => void {
  localListeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === DRAFT_STORAGE_KEY || event.key === null) listener();
  };
  target?.addEventListener('storage', onStorage);
  return () => {
    localListeners.delete(listener);
    target?.removeEventListener('storage', onStorage);
  };
}

let snapshot: { raw: string | null; draft: Draft | null } = { raw: null, draft: null };

/**
 * Instantané stable pour `useSyncExternalStore` : même objet tant que la valeur stockée ne
 * change pas.
 */
export function readDraftSnapshot(storage: StorageLike | null = defaultStorage()): Draft | null {
  let raw: string | null = null;
  try {
    raw = storage?.getItem(DRAFT_STORAGE_KEY) ?? null;
  } catch {
    raw = null;
  }
  if (raw !== snapshot.raw) snapshot = { raw, draft: raw === null ? null : readDraft(storage) };
  return snapshot.draft;
}
