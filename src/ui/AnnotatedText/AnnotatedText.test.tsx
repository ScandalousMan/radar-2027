import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import type { GlossaryTerm } from '@/core/dataset';
import { toGlossaryData } from '@/lib/glossary/context';
import { GlossaryProvider } from '@/lib/glossary/GlossaryProvider';
import { renderWithIntl } from '@/lib/test-utils';
import { AnnotatedText } from './AnnotatedText';

const TERMS: GlossaryTerm[] = [
  {
    id: 'droit-du-sol',
    label: 'droit du sol',
    forms: ['droit du sol'],
    definition: 'Règle d’acquisition de la nationalité liée à la naissance sur le territoire.',
    sources: [{ url: 'https://www.vie-publique.fr/', title: 'Nationalité', publisher: 'Vie-publique.fr' }],
  },
];
const TEXT = 'Faut-il restreindre le droit du sol à Mayotte ?';

describe('AnnotatedText', () => {
  it('rend le terme défini comme bouton et le reste en texte', async () => {
    const user = userEvent.setup();
    const { container } = renderWithIntl(
      <h2>
        <AnnotatedText text={TEXT} glossary={toGlossaryData(TERMS)} />
      </h2>,
    );
    expect(container.querySelector('h2')).toHaveAccessibleName(TEXT);
    await user.click(screen.getByRole('button', { name: 'droit du sol' }));
    expect(screen.getByRole('link', { name: /Voir le glossaire/ })).toHaveAttribute('href', '/glossaire#droit-du-sol');
  });

  it('glossaire null → texte seul', () => {
    const { container } = renderWithIntl(<AnnotatedText text={TEXT} glossary={null} />);
    expect(screen.queryByRole('button')).toBeNull();
    expect(container).toHaveTextContent(TEXT);
  });

  it('lit le glossaire du contexte', () => {
    renderWithIntl(
      <GlossaryProvider glossary={{ updatedAt: '2026-11-22', terms: TERMS }}>
        <AnnotatedText text={TEXT} />
      </GlossaryProvider>,
    );
    expect(screen.getByRole('button', { name: 'droit du sol' })).toBeInTheDocument();
  });

  it('sans fournisseur → texte seul', () => {
    renderWithIntl(<AnnotatedText text={TEXT} />);
    expect(screen.queryByRole('button')).toBeNull();
  });
});
