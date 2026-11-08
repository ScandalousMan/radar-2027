'use client';
// Brouillon stocké lu après montage (FR-021, plan § Risques « hydratation ») : l'instantané
// serveur est `null`, donc le HTML statique ne contient aucun texte dépendant du stockage.
import { useCallback, useSyncExternalStore } from 'react';
import { readDraftSnapshot, subscribeDraft, type StorageLike } from './storage';
import type { Draft } from './types';

export function useStoredDraft(storage?: StorageLike | null): Draft | null {
  const getSnapshot = useCallback(() => (storage === undefined ? readDraftSnapshot() : readDraftSnapshot(storage)), [storage]);
  return useSyncExternalStore(subscribeDraft, getSnapshot, () => null);
}
