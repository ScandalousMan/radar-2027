// Fragments de référence de la spec (US3 scénarios 1 et 2, contracts/link-format.md).
// Partagés entre les tests et la page Méthodologie (research.md R9).
import type { BankVersion } from '../bank';
import { syntheticBank } from '../bank/fixtures';
import type { Answer, ResultState } from '../types';

export type FragmentFixture = {
  readonly title: string;
  readonly bank: () => BankVersion;
  readonly state: ResultState;
  readonly fragment: string;
  readonly bytesHex: string;
};

const answers = (n: number): Answer[] => [2, 'skipped', -1, ...Array<Answer>(n - 3).fill('unanswered')];
const ids = (indices: number[]) => indices.map((i) => `t${String(i).padStart(2, '0')}`);

export const FRAGMENT_FULL_EXAMPLE: FragmentFixture = {
  title: 'Mode complet, sujets 2, 7 et 9',
  bank: () => syntheticBank(),
  state: { bankVersion: 1, mode: 'full', priorities: ids([2, 7, 9]), answers: answers(100) },
  fragment: '#1.AACEAgDFgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMM',
  bytesHex: `00008402 00C580${'00'.repeat(36)}C3`.replace(/ /g, ''),
};

export const FRAGMENT_SHORT_EXAMPLE: FragmentFixture = {
  title: 'Mode court, sujets 0, 2, 7, 9 et 12',
  bank: () => syntheticBank(),
  state: { bankVersion: 1, mode: 'short', priorities: ids([0, 2, 7, 9, 12]), answers: answers(25) },
  fragment: '#1.AAGFEgDFgAAAAAAAAAAAng',
  bytesHex: '00018512 00C58000000000000000009E'.replace(/ /g, ''),
};
