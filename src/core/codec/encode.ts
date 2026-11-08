// Encodage d'un état en fragment `#1.<charge>` (FR-028, FR-036, FR-038).
// Refuse tout état invalide par une `StateError` ; l'appelant passe la banque de la version
// courante.
import { priorityIndicesOf, type BankVersion } from '../bank';
import { selectQuestions } from '../selection';
import { isAnswer, LINK_FORMAT_VERSION, StateError, type ResultState } from '../types';
import { encodeBase64Url } from './base64url';
import { answerToCode } from './bits';
import { buildPayload } from './payload';

export function encodeFragment(state: ResultState, bank: BankVersion): string {
  if (state.bankVersion !== bank.version) throw new StateError('version-mismatch', `état ${state.bankVersion}, banque ${bank.version}`);
  const priorityIndices = priorityIndicesOf(bank, state.priorities);
  const selection = selectQuestions(bank, state.mode, state.priorities);
  if (state.answers.length !== selection.items.length) throw new StateError('bad-answer-count', `${state.answers.length} réponses pour ${selection.items.length} questions`);
  if (!state.answers.every(isAnswer)) throw new StateError('bad-answer');
  const payload = buildPayload(bank.version, state.mode, priorityIndices, state.answers.map(answerToCode));
  return `#${LINK_FORMAT_VERSION}.${encodeBase64Url(payload)}`;
}
