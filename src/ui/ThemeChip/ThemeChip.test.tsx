import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ThemeChip } from './ThemeChip';

describe('ThemeChip', () => {
  it('bascule et expose aria-pressed', async () => {
    const onToggle = vi.fn();
    const { rerender } = render(<ThemeChip id="logement" label="Logement" selected={false} onToggle={onToggle} />);
    const chip = screen.getByRole('button', { name: 'Logement', pressed: false });
    await userEvent.click(chip);
    expect(onToggle).toHaveBeenCalledWith('logement');
    rerender(<ThemeChip id="logement" label="Logement" selected onToggle={onToggle} />);
    expect(screen.getByRole('button', { name: 'Logement', pressed: true })).toBeInTheDocument();
  });

  it('désactivée : reste focalisable, annoncée désactivée, non cliquable', async () => {
    const onToggle = vi.fn();
    render(<ThemeChip id="sante" label="Santé" selected={false} disabled onToggle={onToggle} />);
    const chip = screen.getByRole('button', { name: 'Santé' });
    expect(chip).toHaveAttribute('aria-disabled', 'true');
    await userEvent.tab();
    expect(chip).toHaveFocus();
    await userEvent.click(chip);
    await userEvent.keyboard('{Enter}');
    expect(onToggle).not.toHaveBeenCalled();
  });

  it('désactivée mais sélectionnée : reste désélectionnable', async () => {
    const onToggle = vi.fn();
    render(<ThemeChip id="sante" label="Santé" selected disabled onToggle={onToggle} />);
    await userEvent.click(screen.getByRole('button', { name: 'Santé' }));
    expect(onToggle).toHaveBeenCalledWith('sante');
  });

  it('laisse un libellé long passer à la ligne et garde une cible tactile de 44 px', () => {
    render(<ThemeChip id="t" label="Transition écologique, énergie et climat" selected={false} onToggle={() => undefined} />);
    const className = screen.getByRole('button').className;
    expect(className).toContain('whitespace-normal');
    expect(className).toContain('min-h-touch');
    expect(className).not.toContain('truncate');
  });
});
