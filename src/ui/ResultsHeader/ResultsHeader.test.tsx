import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { fr, norm, renderWithIntl } from '@/lib/test-utils';
import { ResultsHeader } from './ResultsHeader';

describe('ResultsHeader', () => {
  it('titre, sujets clés, mode et réponses, plafonnement et lien Méthodologie', () => {
    renderWithIntl(<ResultsHeader priorities={['Économie', 'Santé', 'Sécurité', 'Éducation']} mode="short" answered={21} total={25} methodologyHref="/methodologie" />);
    expect(screen.getByRole('heading', { level: 1, name: fr.results.title })).toBeInTheDocument();
    const list = screen.getByRole('list', { name: fr.ui.resultsHeader.priorities });
    expect(within(list).getAllByRole('listitem').map((li) => li.textContent)).toEqual(['Économie', 'Santé', 'Sécurité', 'Éducation']);
    expect(screen.getByText('Mode court · 21 réponses sur 25 questions')).toBeInTheDocument();
    expect(screen.getByText(norm(fr.results.header.cap), { exact: false })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: fr.results.header.methodology })).toHaveAttribute('href', '/methodologie');
  });

  it('mode complet', () => {
    renderWithIntl(<ResultsHeader priorities={['A', 'B', 'C']} mode="full" answered={1} total={100} methodologyHref="/methodologie" />);
    expect(screen.getByText('Mode complet · 1 réponse sur 100 questions')).toBeInTheDocument();
  });
});
