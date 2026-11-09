import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { fr, renderWithIntl } from '@/lib/test-utils';
import { ComparisonTable } from './ComparisonTable';

const L = fr.ui.comparisonTable;
const columns = [
  { id: 'a', name: 'Jeanne Dupont', slot: 1 as const, global: 72 },
  { id: 'b', name: 'Paul Martin', slot: 2 as const, global: null },
];
const rows = [
  { key: 'eco', label: 'Économie', priority: true, values: [80, 40] },
  { key: 'others', label: '', priority: false, values: [null, 55] },
];

describe('ComparisonTable', () => {
  it('tableau : en-têtes de colonne et de ligne, global ou « données insuffisantes », « — »', () => {
    renderWithIntl(<ComparisonTable columns={columns} rows={rows} onRemove={vi.fn()} />);
    const table = screen.getByRole('table', { hidden: true });
    expect(within(table).getAllByRole('columnheader', { hidden: true }).map((h) => h.textContent)).toEqual([L.theme, 'Jeanne Dupont', 'Paul Martin']);
    const rowHeaders = within(table).getAllByRole('rowheader', { hidden: true });
    expect(rowHeaders[0]).toHaveTextContent(L.global);
    expect(rowHeaders[1]).toHaveTextContent('Sujet clé : Économie');
    expect(rowHeaders[2]).toHaveTextContent(fr.ui.themeScoreList.others);
    const cells = within(table).getAllByRole('cell', { hidden: true });
    expect(cells[0]).toHaveTextContent(/72\s%/);
    expect(cells[1]).toHaveTextContent(L.insufficient);
    expect(cells[4]).toHaveTextContent(L.undefined);
  });

  it('formes de série par emplacement, jamais la couleur seule', () => {
    const { container } = renderWithIntl(<ComparisonTable columns={columns} rows={rows} onRemove={vi.fn()} />);
    expect(container.querySelectorAll('svg[data-series="1"] circle').length).toBeGreaterThan(0);
    expect(container.querySelectorAll('svg[data-series="2"] path').length).toBeGreaterThan(0);
  });

  it('Retirer appelle onRemove', async () => {
    const onRemove = vi.fn();
    renderWithIntl(<ComparisonTable columns={columns} rows={rows} onRemove={onRemove} />);
    await userEvent.click(screen.getByRole('button', { name: 'Retirer Paul Martin' }));
    expect(onRemove).toHaveBeenCalledWith('b');
  });
});
