import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithIntl } from '@/lib/test-utils';
import { CoverageList } from './CoverageList';

const items = [
  { id: 'b', name: 'Paul Martin', party: 'Sans étiquette', coverage: 0.6, href: '/methodologie/candidats/b' },
  { id: 'a', name: 'Jeanne Dupont', party: 'Parti A', coverage: 0.123, href: '/methodologie/candidats/a' },
];

describe('CoverageList', () => {
  it('conserve l’ordre et rend un lien par candidat', () => {
    renderWithIntl(<CoverageList items={items} />);
    const links = screen.getAllByRole('link');
    expect(links.map((l) => l.getAttribute('href'))).toEqual(['/methodologie/candidats/b', '/methodologie/candidats/a']);
    expect(links[0]).toHaveTextContent('Paul Martin');
  });

  it('affiche le pourcentage et expose la barre de progression', () => {
    renderWithIntl(<CoverageList items={items} />);
    const bars = screen.getAllByRole('progressbar');
    expect(bars[0]).toHaveAttribute('aria-valuenow', '60');
    expect(bars[1]).toHaveAttribute('aria-valuenow', '12');
    expect(bars[0]).toHaveAccessibleName('Couverture des questions : 60 %');
    expect(screen.getAllByText(/60\s%/).length).toBeGreaterThan(0);
  });

  it('liste vide', () => {
    renderWithIntl(<CoverageList items={[]} />);
    expect(screen.getByRole('list')).toBeEmptyDOMElement();
  });
});
