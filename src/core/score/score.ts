// Classement complet (FR-001 → FR-017, FR-039, FR-040).
// La seule source de données est la `BankVersion` passée en argument : un ancien lien est scoré
// avec les candidats et positions figés de sa version, jamais avec des données courantes (FR-040).
// Le nombre de sujets n'est pas borné ici (exemples A et B à un sujet, spec § Assumptions).
import type { BankVersion } from '../bank';
import type { Selection } from '../selection';
import { isAnswer, StateError, type ResultState } from '../types';
import { scoreCandidate } from './candidate';
import { rankCandidates } from './rank';
import type { Scoreboard } from './types';

export type ScoreInput = {
  readonly bank: BankVersion;
  readonly selection: Selection;
  readonly state: ResultState;
  /** Nombre de versions publiées (numéros contigus de 1 à `versionCount`). */
  readonly versionCount: number;
};

export function scoreCandidates({ bank, selection, state, versionCount }: ScoreInput): Scoreboard {
  if (bank.version !== state.bankVersion) throw new StateError('version-mismatch', `banque ${bank.version}, état ${state.bankVersion}`);
  if (state.answers.length !== selection.items.length) throw new StateError('bad-answer-count', `${state.answers.length} réponses pour ${selection.items.length} questions`);
  if (!state.answers.every(isAnswer)) throw new StateError('bad-answer');
  const priority = new Set<number>();
  for (const id of state.priorities) {
    const t = bank.themeIndexById.get(id);
    if (t === undefined) throw new StateError('bad-priorities', `thème inconnu ${id}`);
    priority.add(t);
  }

  const scores = bank.candidates.map((c) => scoreCandidate(bank, selection, state, priority, c));
  return {
    ranked: rankCandidates(scores.filter((s) => s.status === 'ranked')),
    insufficient: scores.filter((s) => s.status === 'insufficient-data'),
    answeredCount: state.answers.filter((a) => typeof a === 'number').length,
    priorVersion: bank.version < versionCount,
    bankPublishedAt: bank.publishedAt,
  };
}
