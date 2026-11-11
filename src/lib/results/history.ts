// Vues de la page de résultats dans l'historique du navigateur (R1, data-model § 3).
// FR-006, FR-022 : ouvrir une fiche ou une comparaison empile une entrée sans changer l'adresse
// (fragment compris) ; le bouton précédent referme la vue. L'état du routeur Next déjà présent
// dans `history.state` est conservé.
import { MAX_COMPARED, MIN_COMPARED, type ViewState } from './types';

const KEY = 'radarResults';
const RANKING: ViewState = { view: 'ranking' };

type HistoryLike = Pick<History, 'state' | 'pushState' | 'replaceState'>;

const isId = (v: unknown): v is string => typeof v === 'string' && v.length > 0;

/** Vue portée par un état d'historique ; toute valeur absente ou invalide vaut le classement. */
export function readView(state: unknown): ViewState {
  if (typeof state !== 'object' || state === null) return RANKING;
  const view = (state as Record<string, unknown>)[KEY];
  if (typeof view !== 'object' || view === null) return RANKING;
  const v = view as Record<string, unknown>;
  if (v.view === 'candidate' && isId(v.candidateId)) return { view: 'candidate', candidateId: v.candidateId };
  if (v.view === 'compare' && Array.isArray(v.candidateIds)) {
    const ids = v.candidateIds;
    if (ids.length >= MIN_COMPARED && ids.length <= MAX_COMPARED && ids.every(isId) && new Set(ids).size === ids.length) return { view: 'compare', candidateIds: [...ids] };
  }
  return RANKING;
}

function stateWith(h: HistoryLike, view: ViewState): Record<string, unknown> {
  const current = typeof h.state === 'object' && h.state !== null ? (h.state as Record<string, unknown>) : {};
  return { ...current, [KEY]: view };
}

const defaultHistory = (): HistoryLike => window.history;
const currentHref = (): string => window.location.href;

export function pushView(view: ViewState, h: HistoryLike = defaultHistory(), href: string = currentHref()): void {
  h.pushState(stateWith(h, view), '', href);
}

export function replaceView(view: ViewState, h: HistoryLike = defaultHistory(), href: string = currentHref()): void {
  h.replaceState(stateWith(h, view), '', href);
}
