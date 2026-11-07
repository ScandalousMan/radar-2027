import { screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { fr, renderWithIntl } from '@/lib/test-utils';
import { ScoreBar } from './ScoreBar';

describe('ScoreBar', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('défini : jauge avec valeur, pourcentage localisé', () => {
    renderWithIntl(<ScoreBar value={72} label="Candidate A" />);
    const meter = screen.getByRole('meter', { name: 'Candidate A' });
    expect(meter).toHaveAttribute('aria-valuenow', '72');
    // Espace insécable (U+00A0) ou fine (U+202F) selon la version d'ICU.
    expect(meter.getAttribute('aria-valuetext')).toMatch(/^72[\u00a0\u202f]%$/);
    // Testing Library normalise les espaces : `\s` couvre les deux insécables.
    expect(screen.getByText(/^72\s%$/)).toBeInTheDocument();
  });

  it('indéfini : « — » et libellé accessible, aucune jauge à zéro', () => {
    renderWithIntl(<ScoreBar value={undefined} label="Candidate C" />);
    expect(screen.queryByRole('meter')).not.toBeInTheDocument();
    expect(screen.getByText(fr.ui.scoreBar.undefined)).toBeInTheDocument();
    expect(screen.getByText(fr.ui.scoreBar.unavailable)).toBeInTheDocument();
  });

  it('borne une valeur hors de [0, 100] et avertit en développement', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    renderWithIntl(<ScoreBar value={130} label="Trop" />);
    expect(screen.getByRole('meter')).toHaveAttribute('aria-valuenow', '100');
    expect(warn).toHaveBeenCalledTimes(1);
    renderWithIntl(<ScoreBar value={-5} label="Négatif" />);
    expect(screen.getByRole('meter', { name: 'Négatif' })).toHaveAttribute('aria-valuenow', '0');
  });

  it('compacte : disposition en ligne', () => {
    renderWithIntl(<ScoreBar value={50} label="Compact" compact />);
    expect(screen.getByText('Compact').parentElement?.className).toContain('items-center');
  });
});
