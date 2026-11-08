import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { fr, renderWithIntl } from '@/lib/test-utils';
import { PositionCard, type PositionCardProps } from './PositionCard';

/** Testing Library ramène les espaces insécables à des espaces dans ses recherches de texte. */
const text = (s: string) => s.replace(/\u00a0/g, ' ');

const props: PositionCardProps = {
  question: 'Le SMIC doit être augmenté au-delà de l’inflation.',
  value: -1,
  level: 'programme',
  quote: 'Nous gèlerons le SMIC.',
  justification: 'Gel explicite.',
  sources: [
    { url: 'https://exemple.fr/p', title: 'Programme', publishedAt: { date: '2026-10', precision: 'month' }, accessedAt: '2026-11-07' },
    { url: 'https://exemple.fr/e', title: 'Entretien', publishedAt: { date: '2026-09-12', precision: 'day' }, accessedAt: '2026-11-07' },
  ],
};

describe('PositionCard', () => {
  it('affiche énoncé, valeur, niveau, citation et justification', () => {
    renderWithIntl(<PositionCard {...props} />);
    expect(screen.getByText(props.question)).toBeInTheDocument();
    const scale = screen.getByRole('list', { name: fr.ui.positionCard.scaleLabel });
    const current = within(scale).getAllByRole('listitem').find((li) => li.getAttribute('aria-current') === 'true');
    expect(current).toHaveTextContent(fr.ui.positionCard.value.minus1);
    expect(screen.getByText(fr.ui.evidence.programme)).toBeInTheDocument();
    expect(screen.getByText(props.quote)).toBeInTheDocument();
    expect(screen.getByText(props.justification)).toBeInTheDocument();
  });

  it('sources : liens externes datés selon leur précision', () => {
    renderWithIntl(<PositionCard {...props} />);
    const link = screen.getByRole('link', { name: /Programme/ });
    expect(link).toHaveAttribute('href', 'https://exemple.fr/p');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(screen.getByText(/publiée en octobre 2026/)).toBeInTheDocument();
    expect(screen.getByText(/publiée le 12 septembre 2026/)).toBeInTheDocument();
  });

  it('marque « ancienne » et lien de signalement conditionnels', () => {
    const { rerender } = renderWithIntl(<PositionCard {...props} />);
    expect(screen.queryByText(text(fr.ui.positionCard.old))).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: fr.ui.positionCard.report })).not.toBeInTheDocument();
    rerender(<PositionCard {...props} old reportHref="https://github.com/x/y/issues/new?title=a%2Fb" />);
    expect(screen.getByText(text(fr.ui.positionCard.old))).toBeInTheDocument();
    expect(screen.getByRole('link', { name: fr.ui.positionCard.report })).toHaveAttribute('href', 'https://github.com/x/y/issues/new?title=a%2Fb');
  });
});
