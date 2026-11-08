// Jeu publié minimal pour les tests (non importé par l'application).
import type { MainDataset } from './types';

export function minimalMainDataset(): MainDataset {
  return {
    version: 1,
    publishedAt: '2026-11-08',
    themes: [
      { id: 'economie', label: 'Économie', description: 'd', axis: { negative: 'moins', positive: 'plus' }, order: 0 },
      { id: 'sante', label: 'Santé', description: 'd', axis: { negative: 'moins', positive: 'plus' }, order: 1 },
    ],
    candidates: [
      { id: 'dupont', name: 'Jeanne Dupont', party: 'Parti A', status: 'declared', coverage: 0.5 },
      { id: 'martin', name: 'Paul Martin', party: 'Sans étiquette', status: 'declared', coverage: 0 },
    ],
    withdrawn: [],
    questions: [
      { id: 'economie-a', text: 'Énoncé A.', themes: ['economie'], polarity: '+', discriminant: 0 },
      { id: 'sante-b', text: 'Énoncé B.', themes: ['sante', 'economie'], polarity: '-', discriminant: 0 },
    ],
    positions: { dupont: [[-1, 'p'], null], martin: [null, null] },
    governance: {
      inclusionCriteria: [{ id: 'declaration-publique-personnelle', kind: 'inclusion', text: 'Déclaration.' }],
      neutralityChecklist: [{ id: 'single-claim', text: 'Une seule affirmation.' }],
      evidenceLevels: [{ id: 'programme', label: 'Programme', definition: 'Programme officiel.' }],
      reportIssueUrl: 'https://github.com/x/y/issues/new?title={title}',
    },
  };
}
