import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { GlossaryProvider } from '@/lib/glossary/GlossaryProvider';
import { fr, renderWithIntl } from '@/lib/test-utils';
import { QuestionDetail, type QuestionDetailProps } from './QuestionDetail';

const L = fr.ui.questionDetail;
const base: QuestionDetailProps = {
  text: 'Il faut augmenter le salaire minimum.',
  themes: ['Économie'],
  answer: 2,
  position: 1,
  agreement: 'close',
  evidence: 'programme',
  quote: 'Nous augmenterons le salaire minimum.',
  source: { title: 'Programme 2027', date: 'mars 2026', url: 'https://exemple.invalid/programme' },
  detailState: 'ready',
};

describe('QuestionDetail', () => {
  it('réponse, position, palier, badge, citation et source en nouvel onglet', () => {
    renderWithIntl(<QuestionDetail {...base} />);
    expect(screen.getByRole('heading', { level: 4, name: base.text })).toBeInTheDocument();
    expect(screen.getByText(fr.ui.likert.stronglyAgree)).toBeInTheDocument();
    expect(screen.getByText(fr.ui.positionCard.value.plus1)).toBeInTheDocument();
    expect(screen.getByText(fr.results.agreement.close)).toBeInTheDocument();
    expect(screen.getByText(fr.ui.evidence.programme)).toBeInTheDocument();
    expect(screen.getByText(base.quote!)).toBeInTheDocument();
    const link = screen.getByRole('link', { name: /^Programme 2027\s*\(nouvel onglet\)$/ });
    expect(link).toHaveAttribute('href', 'https://exemple.invalid/programme');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('position inconnue : ni palier ni citation, mention du calcul', () => {
    renderWithIntl(<QuestionDetail {...base} position={null} agreement={null} evidence={null} />);
    expect(screen.getByText(L.unknown)).toBeInTheDocument();
    expect(screen.getByText(L.unknownNote)).toBeInTheDocument();
    expect(screen.queryByText(L.agreement)).toBeNull();
    expect(screen.queryByRole('link')).toBeNull();
  });

  it('question passée : sans palier', () => {
    renderWithIntl(<QuestionDetail {...base} answer="skipped" agreement={null} />);
    expect(screen.getByText(L.skipped)).toBeInTheDocument();
    expect(screen.queryByText(L.agreement)).toBeNull();
    expect(screen.getByText(base.quote!)).toBeInTheDocument();
  });

  it('citation absente, détail en chargement, détail en erreur', () => {
    const { rerender } = renderWithIntl(<QuestionDetail {...base} quote={null} />);
    expect(screen.getByText(L.quoteMissing)).toBeInTheDocument();
    rerender(<QuestionDetail {...base} detailState="loading" />);
    expect(screen.getByText(L.loading)).toBeInTheDocument();
    expect(screen.getByText(fr.results.agreement.close)).toBeInTheDocument();
    rerender(<QuestionDetail {...base} detailState="error" />);
    expect(screen.getByText(L.error)).toBeInTheDocument();
  });

  it('signale un terme défini dans l’énoncé (009)', () => {
    renderWithIntl(
      <GlossaryProvider glossary={{ updatedAt: '2026-11-22', terms: [{ id: 'smic', label: 'salaire minimum', forms: ['salaire minimum'], definition: 'Définition.', sources: [{ url: 'https://www.service-public.fr/', title: 'Smic', publisher: 'Service-Public.fr' }] }] }}>
        <QuestionDetail {...base} />
      </GlossaryProvider>,
    );
    expect(screen.getByRole('heading', { level: 4, name: base.text })).toContainElement(screen.getByRole('button', { name: 'salaire minimum' }));
  });
});
