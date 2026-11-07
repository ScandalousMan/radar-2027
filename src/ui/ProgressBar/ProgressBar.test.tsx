import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProgressBar } from './ProgressBar';

describe('ProgressBar', () => {
  it.each([
    [0, 25, '0%'],
    [7, 25, '28%'],
    [25, 25, '100%'],
  ])('expose les attributs ARIA pour %s sur %s', (value, total, width) => {
    render(<ProgressBar value={value} total={total} label={`Question ${value} sur ${total}`} />);
    const bar = screen.getByRole('progressbar', { name: `Question ${value} sur ${total}` });
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', String(total));
    expect(bar).toHaveAttribute('aria-valuenow', String(value));
    expect(bar.firstElementChild).toHaveStyle({ width });
  });

  it('borne une valeur hors de [0, total]', () => {
    render(<ProgressBar value={40} total={25} label="Question 40 sur 25" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '25');
  });

  it('affiche le libellé fourni par le parent', () => {
    render(<ProgressBar value={1} total={2} label="Étape 1 sur 2" />);
    expect(screen.getByText('Étape 1 sur 2')).toBeInTheDocument();
  });
});
