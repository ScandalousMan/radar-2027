import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('rend un bouton de type button et déclenche onClick', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Commencer</Button>);
    const button = screen.getByRole('button', { name: 'Commencer' });
    expect(button).toHaveAttribute('type', 'button');
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('désactivé : pas de clic, attribut disabled', async () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Commencer
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Commencer' });
    expect(button).toBeDisabled();
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('en chargement : aria-busy, libellé toujours présent, action bloquée', async () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Commencer
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Commencer' });
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(button).toHaveTextContent('Commencer');
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('rend un lien avec les mêmes styles si href est fourni', () => {
    render(<Button href="/methodologie">Méthodologie</Button>);
    const link = screen.getByRole('link', { name: 'Méthodologie' });
    expect(link).toHaveAttribute('href', '/methodologie');
    expect(link.className).toContain('bg-accent');
  });

  it('lien désactivé : href retiré et navigation empêchée', async () => {
    render(
      <Button href="/methodologie" disabled>
        Méthodologie
      </Button>,
    );
    const link = screen.getByRole('link', { name: 'Méthodologie' });
    expect(link).not.toHaveAttribute('href');
    expect(link).toHaveAttribute('aria-disabled', 'true');
  });

  it('applique variantes et tailles via les classes de tokens', () => {
    const { rerender } = render(<Button variant="secondary">A</Button>);
    expect(screen.getByRole('button').className).toContain('bg-surface');
    rerender(
      <Button variant="ghost" size="sm">
        A
      </Button>,
    );
    expect(screen.getByRole('button').className).toContain('text-accent');
    expect(screen.getByRole('button').className).toContain('text-sm');
  });

  it('garde une cible tactile minimale de 44 px', () => {
    render(<Button size="sm">A</Button>);
    expect(screen.getByRole('button').className).toContain('min-h-touch');
  });
});
