// Brouillon dans le stockage local (contracts/storage-and-data.md § 1, data-model § 5, R4).
// FR-020 (persistance après chaque action), FR-023 (effacement complet), FR-025 (stockage
// indisponible). Une seule clé ; lecture tolérante : toute valeur invalide vaut « aucun brouillon ».
import { z } from 'zod';
import { MAX_PRIORITIES, MIN_PRIORITIES, MODES } from '@/core';
import type { Draft, StorageStatus } from './types';

export const DRAFT_STORAGE_KEY = 'radar-questionnaire';
export const DRAFT_FORMAT = 1;
const PROBE_KEY = `${DRAFT_STORAGE_KEY}:__probe__`;

export type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

const AnswerSchema = z.union([z.literal(-2), z.literal(-1), z.literal(0), z.literal(1), z.literal(2), z.literal('skipped'), z.literal('unanswered')]);

export const DraftSchema: z.ZodType<Draft> = z
  .strictObject({
    format: z.literal(DRAFT_FORMAT),
    bankVersion: z.int().min(1),
    mode: z.enum(MODES as [Draft['mode'], ...Draft['mode'][]]),
    priorities: z
      .array(z.string().min(1))
      .min(MIN_PRIORITIES)
      .max(MAX_PRIORITIES)
      .refine((p) => new Set(p).size === p.length, { message: 'sujets en double' }),
    answers: z.array(AnswerSchema).min(1),
    position: z.int().min(0),
    updatedAt: z.iso.datetime(),
  })
  .refine((d) => d.position < d.answers.length, { message: 'position hors bornes', path: ['position'] });

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
    const parsed = DraftSchema.safeParse(JSON.parse(raw));
    if (parsed.success) return parsed.data;
    if (process.env.NODE_ENV === 'development') console.warn('Brouillon du questionnaire ignoré :', parsed.error.message);
  } catch {
    if (process.env.NODE_ENV === 'development') console.warn('Brouillon du questionnaire illisible.');
  }
  return null;
}

/** Écrit le brouillon entier ; `false` si le stockage est indisponible (ne lève jamais). */
export function writeDraft(draft: Draft, storage: StorageLike | null = defaultStorage()): boolean {
  try {
    if (!storage) return false;
    storage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
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

/** Écoute les écritures d'un autre onglet sur la clé du brouillon. */
export function subscribeDraft(listener: () => void, target: Pick<Window, 'addEventListener' | 'removeEventListener'> | null = typeof window === 'undefined' ? null : window): () => void {
  if (!target) return () => {};
  const onStorage = (event: StorageEvent) => {
    if (event.key === DRAFT_STORAGE_KEY || event.key === null) listener();
  };
  target.addEventListener('storage', onStorage);
  return () => target.removeEventListener('storage', onStorage);
}
