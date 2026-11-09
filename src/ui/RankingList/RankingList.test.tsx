import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { fr, renderWithIntl } from '@/lib/test-utils';
import { RankingList, type RankingRowView } from './RankingList';

const L = fr.ui.rankingList;

const rows: RankingRowView[] = [
  { id: 'a', name: 'Jeanne Dupont', rank: 1, tied: true, percent: 72, band: 'rather-aligned', withdrawn: false },
  { id: 'b', name: 'Paul Martin', rank: 1, tied: true, percent: 72, band: 'rather-aligned', withdrawn: true },
  { id: 'c', name: 'Lucie Bernard', rank: 3, tied: false, percent: 41, band: 'mixed', withdrawn: false },
  { id: 'd', name: 'Marc Petit', rank: 4, tied: false, percent: 12, band: 'distant', withdrawn: false },
];

function setup(selected: string[] = []) {
  const callbacks = { onOpen: vi.fn(), onToggleCompare: vi.fn() };
  renderWithIntl(<RankingList rows={rows} selected={selected} {...callbacks} />);
  return callbacks;
}

describe('RankingList', () => {
  it('liste ordonnée : rang et « ex æquo » en texte, pourcentage, bande', () => {
    setup();
    const items = within(screen.getByRole('list', { name: L.label })).getAllByRole('listitem');
    expect(items).toHaveLength(4);
    expect(items[0]).toHaveTextContent('Rang 1');
    expect(items[0]).toHaveTextContent(L.tied);
    expect(items[2]).not.toHaveTextContent(L.tied);
    expect(items[0]).toHaveTextContent(fr.results.band['rather-aligned']);
    expect(within(items[2]!).getByRole('meter', { name: 'Lucie Bernard' })).toHaveAttribute('aria-valuenow', '41');
    expect(items[1]).toHaveTextContent(fr.results.withdrawn);
  });

  it('Voir le détail et Comparer appellent leurs rappels ; aria-pressed', async () => {
    const c = setup(['a']);
    await userEvent.click(screen.getByRole('button', { name: `${L.open} de Paul Martin` }));
    expect(c.onOpen).toHaveBeenCalledWith('b');
    expect(screen.getByRole('button', { name: 'Comparer Jeanne Dupont' })).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(screen.getByRole('button', { name: 'Comparer Paul Martin' }));
    expect(c.onToggleCompare).toHaveBeenCalledWith('b');
  });

  it('3 sélectionnés : les autres restent focalisables, désactivés avec la raison', async () => {
    const c = setup(['a', 'b', 'c']);
    const fourth = screen.getByRole('button', { name: 'Comparer Marc Petit' });
    expect(fourth).toHaveAttribute('aria-disabled', 'true');
    expect(fourth).toHaveAccessibleDescription(L.compareDisabled);
    await userEvent.click(fourth);
    expect(c.onToggleCompare).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: 'Comparer Lucie Bernard' }));
    expect(c.onToggleCompare).toHaveBeenCalledWith('c');
  });
});
