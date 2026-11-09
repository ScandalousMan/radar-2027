import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { fr, renderWithIntl } from '@/lib/test-utils';
import { InsufficientList } from './InsufficientList';

const rows = [
  { id: 'a', name: 'Jeanne Dupont', unknown: 1, answered: 3, withdrawn: false },
  { id: 'b', name: 'Paul Martin', unknown: 9, answered: 21, withdrawn: true },
];

describe('InsufficientList', () => {
  it('titre, mention pluralisée et statut en texte', () => {
    renderWithIntl(<InsufficientList rows={rows} selected={[]} onOpen={vi.fn()} onToggleCompare={vi.fn()} />);
    const section = screen.getByRole('region', { name: fr.results.insufficient.title });
    const items = within(section).getAllByRole('listitem');
    expect(items[0]).toHaveTextContent('1 position inconnue sur 3 questions répondues');
    expect(items[1]).toHaveTextContent('9 positions inconnues sur 21 questions répondues');
    expect(items[0]).toHaveTextContent(fr.ui.insufficientList.status);
    expect(items[1]).toHaveTextContent(fr.results.withdrawn);
    expect(items[0]).not.toHaveTextContent(/Rang|%/);
  });

  it('ouvrir et comparer', async () => {
    const onOpen = vi.fn();
    const onToggleCompare = vi.fn();
    renderWithIntl(<InsufficientList rows={rows} selected={[]} onOpen={onOpen} onToggleCompare={onToggleCompare} />);
    await userEvent.click(screen.getByRole('button', { name: 'Voir le détail de Jeanne Dupont' }));
    await userEvent.click(screen.getByRole('button', { name: 'Comparer Paul Martin' }));
    expect(onOpen).toHaveBeenCalledWith('a');
    expect(onToggleCompare).toHaveBeenCalledWith('b');
  });

  it('vide : rien n’est rendu', () => {
    const { container } = renderWithIntl(<InsufficientList rows={[]} selected={[]} onOpen={vi.fn()} onToggleCompare={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });
});
