// Lecture d'un lien de résultats (R2, R4, contrat `core-api` § flux 005 ; contracts/results-model.md).
// FR-026, FR-031 à FR-035 : fragment vide ⇒ invitation ; registre ; en-tête ; version du lien
// (et version courante pour les seuls identifiants de candidats) ; décodage complet ; sélection ;
// classement. Aucune donnée d'une autre version n'entre dans le calcul (FR-033). Ne lève jamais.
import { bankFromDataset, BankError, decodeFragment, decodeHeader, encodeFragment, scoreCandidates, selectQuestions, StateError, type MainDataset } from '@/core';
import { isDatasetClientError, loadMain, loadRegistry } from '@/lib/dataset-client';
import { questionnaireBankFrom } from '@/lib/questionnaire/bank-view';
import type { PageState } from './types';

type Fetcher = typeof fetch;

function errorState(error: unknown): PageState {
  if (process.env.NODE_ENV === 'development') console.error('Résultats : chargement impossible.', error);
  if (isDatasetClientError(error)) return { status: 'error', reason: error.kind === 'invalid' ? 'invalid-data' : 'network' };
  if (error instanceof BankError) return { status: 'error', reason: 'invalid-data' };
  return { status: 'error', reason: 'internal' };
}

/** Identifiants des candidats de la version du lien absents de la version courante (R4). */
function withdrawnIds(link: MainDataset, current: MainDataset): string[] {
  const present = new Set(current.candidates.map((c) => c.id));
  return link.candidates.filter((c) => !present.has(c.id)).map((c) => c.id);
}

export async function loadResults(hash: string, origin: string, fetcher?: Fetcher): Promise<PageState> {
  if (hash === '' || hash === '#') return { status: 'no-fragment' };
  try {
    const registry = await loadRegistry(fetcher);
    const current = registry.current;
    if (current === 0) return { status: 'no-version' };

    const header = decodeHeader(hash, current);
    if (!header.ok) return header.reason === 'unknown-bank-version' ? { status: 'unknown-version' } : { status: 'invalid', reason: header.reason };

    const version = header.value.bankVersion;
    const [linkMain, currentMain] = await Promise.all([loadMain(version, fetcher), version < current ? loadMain(current, fetcher) : null]);
    const bank = bankFromDataset(linkMain);
    const currentBank = questionnaireBankFrom(currentMain ?? linkMain);

    const decoded = decodeFragment(hash, bank);
    if (!decoded.ok) {
      // En-tête accepté mais version refusée au décodage complet : banque incohérente, jamais un lien invalide.
      if (decoded.reason === 'unknown-bank-version') return { status: 'error', reason: 'internal' };
      return { status: 'invalid', reason: decoded.reason };
    }
    const state = decoded.value;
    const selection = selectQuestions(bank, state.mode, state.priorities);
    const board = scoreCandidates({ bank, selection, state, versionCount: current });
    return {
      status: 'ready',
      data: {
        state,
        board,
        bank,
        themes: bank.themes,
        prior: currentMain ? { publishedAt: linkMain.publishedAt, withdrawnIds: withdrawnIds(linkMain, currentMain) } : null,
        currentBank,
        shareUrl: `${origin}/resultats${encodeFragment(state, bank)}`,
      },
    };
  } catch (error) {
    if (error instanceof StateError) return { status: 'error', reason: 'internal' };
    return errorState(error);
  }
}
