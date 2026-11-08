import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithIntl } from '@/lib/test-utils';
import { AnswerSummary } from './AnswerSummary';

const ITEMS = [
  { id: 'sante', label: 'Santé', answered: 3, skipped: 1, unanswered: 0, reliable: true },
  { id: 'logement', label: 'Logement', answered: 1, skipped: 2, unanswered: 0, reliable: false },
];

describe('AnswerSummary', () => {
  it('liste chaque sujet avec ses comptes', () => {
    renderWithIntl(<AnswerSummary items={ITEMS} minReliable={2} />);
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent('Santé');
    expect(items[0]).toHaveTextContent('3 répondues, 1 passée, 0 non répondue');
    expect(items[1]).toHaveTextContent('1 répondue, 2 passées, 0 non répondue');
  });

  it('marque « peu fiable » seulement si non fiable, avec le minimum', () => {
    renderWithIntl(<AnswerSummary items={ITEMS} minReliable={2} />);
    const [sante, logement] = screen.getAllByRole('listitem');
    expect(sante).not.toHaveTextContent('Trop peu de réponses');
    expect(logement).toHaveTextContent('Trop peu de réponses pour un score fiable (minimum 2)');
  });
});
