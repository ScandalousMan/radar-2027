// Palier d'accord d'une question (R3, FR-015, FR-040) : traduction bijective de la concordance
// exacte `s = 1 − |u − c| / 2` ∈ {1, 1/2, 0, −1/2, −1} fournie par le cœur (écart de 0 à 4 sur
// l'échelle −2 … +2), comme la bande l'est du pourcentage. Aucun calcul.
import type { Ratio } from '@/core';
import type { AgreementLevel } from './types';

const BY_QUARTER: Readonly<Record<string, AgreementLevel>> = {
  '1/1': 'identical',
  '1/2': 'close',
  '0/1': 'intermediate',
  '-1/2': 'distant',
  '-1/1': 'opposite',
};

export function agreementOf(concordance: Ratio): AgreementLevel {
  const level = BY_QUARTER[`${concordance.num}/${concordance.den}`];
  if (!level) throw new Error(`concordance inattendue : ${concordance.num}/${concordance.den}`);
  return level;
}
