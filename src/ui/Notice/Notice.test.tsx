import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { fr, renderWithIntl } from '@/lib/test-utils';
import { Notice } from './Notice';

describe('Notice', () => {
  it('rôle status par défaut et titre par défaut selon le ton', () => {
    renderWithIntl(<Notice tone="info">Texte</Notice>);
    const box = screen.getByRole('status');
    expect(box).toHaveTextContent(fr.ui.notice.info);
    expect(box).toHaveTextContent('Texte');
  });

  it('rôle alert sur demande, titre d’avertissement par défaut', () => {
    renderWithIntl(
      <Notice tone="warning" role="alert">
        Texte
      </Notice>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent(fr.ui.notice.warning);
  });

  it('titre fourni prioritaire', () => {
    renderWithIntl(
      <Notice tone="warning" title="Titre précis">
        Texte
      </Notice>,
    );
    expect(screen.getByRole('status')).toHaveTextContent('Titre précis');
    expect(screen.queryByText(fr.ui.notice.warning)).toBeNull();
  });

  it('icônes de formes distinctes selon le ton', () => {
    const { container, unmount } = renderWithIntl(<Notice tone="info">a</Notice>);
    const info = container.querySelector('svg')?.innerHTML;
    unmount();
    const { container: c2 } = renderWithIntl(<Notice tone="warning">a</Notice>);
    expect(c2.querySelector('svg')?.innerHTML).not.toBe(info);
  });
});
