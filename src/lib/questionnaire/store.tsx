'use client';
// Fournisseur d'état du parcours (contracts/routes-and-state.md § Fournisseur, R5, R4, R13).
// FR-002, FR-015, FR-018, FR-020, FR-024, FR-025, FR-030 : chargement du jeu publié à
// l'exécution, présélection non persistée, brouillon persisté dès la première question,
// synchronisation entre onglets, lien vers les résultats. Seul module où `Date` est lu.
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { BankError, normalizePriorities, selectQuestions, type Mode, type Selection } from '@/core';
import { isDatasetClientError, loadMain, loadRegistry } from '@/lib/dataset-client';
import { questionnaireBankFrom, selectionsFor } from './bank-view';
import { isChoiceValid } from './guards';
import { reduce, sameTriplet } from './reducer';
import { clearDraft, probeStorage, readDraftSnapshot, writeDraft, type StorageLike } from './storage';
import { resultHref as hrefOf } from './summary';
import type { Action, Choice, Draft, LoadState, QuestionnaireBank, StorageStatus, ViewAction } from './types';
import { useStoredDraft } from './use-stored-draft';

export type StartResult = 'started' | 'resumed' | 'needs-confirmation';

export type QuestionnaireContext = {
  load: LoadState;
  choice: Choice;
  draft: Draft | null;
  /** Sélection du brouillon (mode et sujets du brouillon). */
  selection: Selection | null;
  storage: StorageStatus;
  setPriorities(ids: readonly string[]): void;
  setMode(mode: Mode): void;
  /** Même triplet qu'un brouillon ⇒ `resumed` ; autre brouillon présent ⇒ `needs-confirmation`. */
  start(): StartResult;
  /** Efface le brouillon puis démarre avec la présélection. */
  confirmStart(): void;
  dispatch(action: ViewAction): void;
  retry(): void;
  /** `/resultats#1.…` quand un brouillon existe (R10). */
  resultHref: string | null;
};

const Context = createContext<QuestionnaireContext | null>(null);

export type QuestionnaireProviderProps = {
  children: ReactNode;
  /** Injections pour les tests. */
  fetcher?: typeof fetch;
  storage?: StorageLike | null;
  now?: () => string;
};

const EMPTY_CHOICE: Choice = { priorities: [], mode: null };

/** Brouillon compatible avec la banque chargée (version et longueur cohérentes, FR-024). */
function fitsBank(draft: Draft, bank: QuestionnaireBank): boolean {
  if (draft.bankVersion !== bank.version) return false;
  try {
    const normalized = normalizePriorities(bank.bank, draft.priorities);
    if (normalized.some((id, i) => id !== draft.priorities[i])) return false;
    return selectQuestions(bank.bank, draft.mode, draft.priorities).items.length === draft.answers.length;
  } catch {
    return false;
  }
}

export function QuestionnaireProvider({ children, fetcher, storage: storageOverride, now = () => new Date().toISOString() }: QuestionnaireProviderProps) {
  const [load, setLoad] = useState<{ status: 'loading' } | { status: 'no-version' } | { status: 'error'; reason: 'network' | 'invalid' } | { status: 'ready'; bank: QuestionnaireBank }>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const [choice, setChoice] = useState<Choice>(EMPTY_CHOICE);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [storage, setStorage] = useState<StorageStatus>('available');
  const draftRef = useRef<Draft | null>(null);
  const storageRef = useRef<StorageStatus | null>(null);
  const stored = useStoredDraft(storageOverride);
  const storageArg = storageOverride === undefined ? undefined : storageOverride;

  // Chargement du jeu publié (R5) : registre puis version courante, validés par le cœur.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const registry = await loadRegistry(fetcher);
        if (registry.current === 0) {
          if (!cancelled) setLoad({ status: 'no-version' });
          return;
        }
        const bank = questionnaireBankFrom(await loadMain(registry.current, fetcher));
        if (cancelled) return;
        // Brouillon stocké adopté dans la même mise à jour que « ready » : les gardes des étapes
        // le voient dès leur premier rendu et ne redirigent pas à tort.
        const initial = storageArg === undefined ? readDraftSnapshot() : readDraftSnapshot(storageArg);
        if (initial && !draftRef.current && fitsBank(initial, bank)) {
          draftRef.current = initial;
          setDraft(initial);
          setChoice((c) => (c.priorities.length === 0 && c.mode === null ? { priorities: initial.priorities, mode: initial.mode } : c));
        }
        setLoad({ status: 'ready', bank });
      } catch (error) {
        if (cancelled) return;
        const reason = isDatasetClientError(error) ? (error.kind === 'invalid' ? 'invalid' : 'network') : error instanceof BankError ? 'invalid' : 'network';
        setLoad({ status: 'error', reason });
      }
    })();
    return () => {
      cancelled = true;
    };
    // storageArg est stable pour la durée du fournisseur (injection de test).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher, attempt]);

  const bank = load.status === 'ready' ? load.bank : null;

  const ensureStorageStatus = useCallback((): StorageStatus => {
    if (storageRef.current === null) {
      storageRef.current = storageArg === undefined ? probeStorage() : probeStorage(storageArg);
      setStorage(storageRef.current);
    }
    return storageRef.current;
  }, [storageArg]);

  const commit = useCallback(
    (next: Draft | null, persist: 'write' | 'clear' | 'none') => {
      draftRef.current = next;
      setDraft(next);
      if (persist === 'clear') {
        if (storageArg === undefined) clearDraft();
        else clearDraft(storageArg);
      } else if (persist === 'write' && next && ensureStorageStatus() === 'available') {
        if (storageArg === undefined) writeDraft(next);
        else writeDraft(next, storageArg);
      }
    },
    [ensureStorageStatus, storageArg],
  );

  // Adoption du brouillon stocké : au montage, puis quand un autre onglet écrit un état plus récent.
  useEffect(() => {
    if (!bank || !stored || !fitsBank(stored, bank)) return;
    const current = draftRef.current;
    if (current && stored.updatedAt <= current.updatedAt) return;
    ensureStorageStatus();
    commit(reduce(current, { type: 'resume', draft: stored }, { selection: null }), 'none');
    if (!current) setChoice((c) => (c.priorities.length === 0 && c.mode === null ? { priorities: stored.priorities, mode: stored.mode } : c));
  }, [bank, stored, commit, ensureStorageStatus]);

  const selection = useMemo(() => (bank && draft ? selectQuestions(bank.bank, draft.mode, draft.priorities) : null), [bank, draft]);

  const selections = useMemo(() => (bank && isChoiceValid(choice) ? selectionsFor(bank, choice.priorities) : null), [bank, choice]);

  const setPriorities = useCallback(
    (ids: readonly string[]) => {
      let next = [...ids];
      if (bank && isChoiceValid({ priorities: next })) {
        try {
          next = [...normalizePriorities(bank.bank, next)];
        } catch {
          // identifiant inconnu : conservé tel quel, la sélection restera invalide
        }
      }
      setChoice((c) => ({ ...c, priorities: next }));
    },
    [bank],
  );

  const setMode = useCallback((mode: Mode) => setChoice((c) => ({ ...c, mode })), []);

  const startFresh = useCallback((): boolean => {
    if (!bank || !selections || !choice.mode) return false;
    const action: Action = { type: 'start', bank, priorities: choice.priorities, mode: choice.mode, now: now() };
    const next = reduce(null, action, { selection: selections[choice.mode] });
    if (!next) return false;
    commit(next, 'write');
    return true;
  }, [bank, selections, choice, commit, now]);

  const start = useCallback((): StartResult => {
    const current = draftRef.current;
    if (bank && current && choice.mode && sameTriplet(current, bank.version, choice.mode, choice.priorities)) return 'resumed';
    // Un brouillon en cours, ou un brouillon stocké non repris (autre version), n'est jamais écrasé sans confirmation.
    if (current || stored) return 'needs-confirmation';
    return startFresh() ? 'started' : 'needs-confirmation';
  }, [bank, choice, stored, startFresh]);

  const confirmStart = useCallback(() => {
    commit(null, 'clear');
    startFresh();
  }, [commit, startFresh]);

  const dispatch = useCallback(
    (action: ViewAction) => {
      const current = draftRef.current;
      if (action.type === 'reset' || action.type === 'clear') {
        commit(null, 'clear');
        if (action.type === 'clear') setChoice(EMPTY_CHOICE);
        return;
      }
      const full = { ...action, now: now() } as Action;
      const next = reduce(current, full, { selection: null });
      if (next !== current) commit(next, 'write');
    },
    [commit, now],
  );

  const retry = useCallback(() => {
    setLoad({ status: 'loading' });
    setAttempt((a) => a + 1);
  }, []);

  const resultHref = useMemo(() => (bank && draft && fitsBank(draft, bank) ? hrefOf(draft, bank) : null), [bank, draft]);

  const loadState: LoadState = useMemo(() => (load.status === 'ready' ? { status: 'ready', bank: load.bank, selections } : load), [load, selections]);

  const value = useMemo<QuestionnaireContext>(
    () => ({ load: loadState, choice, draft, selection, storage, setPriorities, setMode, start, confirmStart, dispatch, retry, resultHref }),
    [loadState, choice, draft, selection, storage, setPriorities, setMode, start, confirmStart, dispatch, retry, resultHref],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useQuestionnaire(): QuestionnaireContext {
  const context = useContext(Context);
  if (!context) throw new Error('useQuestionnaire doit être appelé sous QuestionnaireProvider.');
  return context;
}
