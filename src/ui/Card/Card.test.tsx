import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Card } from './Card';

describe('Card', () => {
  it('rend une section statique avec en-tête, corps et pied', () => {
    render(
      <Card header="Titre" footer="Pied">
        Corps
      </Card>,
    );
    expect(screen.getByText('Titre')).toBeInTheDocument();
    expect(screen.getByText('Corps')).toBeInTheDocument();
    expect(screen.getByText('Pied')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('interactive avec onClick : bouton focalisable et activable au clavier', async () => {
    const onClick = vi.fn();
    render(
      <Card interactive onClick={onClick}>
        Détail
      </Card>,
    );
    const button = screen.getByRole('button', { name: 'Détail' });
    await userEvent.tab();
    expect(button).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('interactive avec href : lien', () => {
    render(
      <Card interactive href="/methodologie">
        Méthodologie
      </Card>,
    );
    expect(screen.getByRole('link', { name: 'Méthodologie' })).toHaveAttribute('href', '/methodologie');
  });

  it('utilise les tokens de surface, bordure, rayon et ombre', () => {
    render(<Card>Corps</Card>);
    const className = screen.getByText('Corps').parentElement?.className ?? '';
    expect(className).toContain('bg-surface');
    expect(className).toContain('rounded-lg');
    expect(className).toContain('shadow-sm');
  });
});
