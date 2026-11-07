import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderWithIntl } from '@/lib/test-utils';
import { ThemePicker, isThemeSelectionValid } from './ThemePicker';

const OPTIONS = ['a', 'b', 'c', 'd', 'e', 'f'].map((id) => ({ id, label: `Sujet ${id.toUpperCase()}` }));

function setup(value: string[], extra: { min?: number; max?: number; disabled?: boolean } = {}) {
  const onChange = vi.fn();
  renderWithIntl(<ThemePicker options={OPTIONS} value={value} onChange={onChange} legend="Vos sujets" {...extra} />);
  return { onChange };
}

describe('ThemePicker', () => {
  it('ajoute un sujet et expose la validité', async () => {
    const { onChange } = setup(['a', 'b']);
    await userEvent.click(screen.getByRole('button', { name: 'Sujet C' }));
    expect(onChange).toHaveBeenCalledWith(['a', 'b', 'c'], { valid: true });
  });

  it('retire un sujet sélectionné et signale l’invalidité', async () => {
    const { onChange } = setup(['a', 'b', 'c']);
    await userEvent.click(screen.getByRole('button', { name: 'Sujet A' }));
    expect(onChange).toHaveBeenCalledWith(['b', 'c'], { valid: false });
  });

  it('refuse le (max+1)-ième sujet et affiche le message de maximum', async () => {
    const { onChange } = setup(['a', 'b', 'c', 'd', 'e']);
    const sixth = screen.getByRole('button', { name: 'Sujet F' });
    expect(sixth).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(sixth);
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByText('Vous avez atteint le maximum de 5 sujets.')).toBeInTheDocument();
    // Les sujets sélectionnés restent désélectionnables.
    await userEvent.click(screen.getByRole('button', { name: 'Sujet A' }));
    expect(onChange).toHaveBeenCalledWith(['b', 'c', 'd', 'e'], { valid: true });
  });

  it('sous le minimum : message avec le nombre manquant (pluriel ICU)', () => {
    setup(['a', 'b']);
    expect(screen.getByText('Choisissez encore 1 sujet (minimum 3).')).toBeInTheDocument();
  });

  it('vide : message au pluriel', () => {
    setup([]);
    expect(screen.getByText('Choisissez encore 3 sujets (minimum 3).')).toBeInTheDocument();
  });

  it('expose le compteur « n / max » dans une zone aria-live', () => {
    setup(['a', 'b', 'c']);
    const live = screen.getByText('3 / 5').closest('[aria-live="polite"]');
    expect(live).not.toBeNull();
    expect(screen.getByText('3 sujet(s) choisi(s) sur 5')).toBeInTheDocument();
  });

  it('bornes configurables', async () => {
    const { onChange } = setup(['a'], { min: 1, max: 2 });
    await userEvent.click(screen.getByRole('button', { name: 'Sujet B' }));
    expect(onChange).toHaveBeenCalledWith(['a', 'b'], { valid: true });
    expect(isThemeSelectionValid(0, 1, 2)).toBe(false);
    expect(isThemeSelectionValid(3, 1, 2)).toBe(false);
  });

  it('désactivé : aucune puce ne bascule', async () => {
    const { onChange } = setup(['a'], { disabled: true });
    await userEvent.click(screen.getByRole('button', { name: 'Sujet B' }));
    expect(onChange).not.toHaveBeenCalled();
  });
});
