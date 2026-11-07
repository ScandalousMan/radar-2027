import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { fr, renderWithIntl } from '@/lib/test-utils';
import { LikertChoice, type LikertAnswer } from './LikertChoice';

const LABELS = fr.ui.likert;

function setup(value: LikertAnswer, disabled = false) {
  const onChange = vi.fn();
  renderWithIntl(<LikertChoice name="q1" value={value} onChange={onChange} legend="Énoncé" disabled={disabled} />);
  return { onChange };
}

describe('LikertChoice', () => {
  it('rend six options radio ordonnées dans un groupe nommé', () => {
    setup(null);
    const group = screen.getByRole('radiogroup', { name: 'Énoncé' });
    const radios = screen.getAllByRole('radio');
    expect(group).toBeInTheDocument();
    expect(radios.map((r) => r.closest('label')?.textContent)).toEqual([
      LABELS.stronglyDisagree,
      LABELS.disagree,
      LABELS.neutral,
      LABELS.agree,
      LABELS.stronglyAgree,
      LABELS.skip,
    ]);
    expect(radios.every((r) => !(r as HTMLInputElement).checked)).toBe(true);
  });

  it('sélectionne un niveau', async () => {
    const { onChange } = setup(null);
    await userEvent.click(screen.getByRole('radio', { name: LABELS.agree }));
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it('change une réponse déjà donnée', async () => {
    const { onChange } = setup(2);
    expect(screen.getByRole('radio', { name: LABELS.stronglyAgree })).toBeChecked();
    await userEvent.click(screen.getByRole('radio', { name: LABELS.disagree }));
    expect(onChange).toHaveBeenCalledWith(-1);
  });

  it('« passée » est un état distinct de « aucune réponse »', async () => {
    const { onChange } = setup(null);
    await userEvent.click(screen.getByRole('radio', { name: LABELS.skip }));
    expect(onChange).toHaveBeenCalledWith('skipped');
  });

  it('état passé : seule l’option « passer » est cochée', () => {
    setup('skipped');
    expect(screen.getByRole('radio', { name: LABELS.skip })).toBeChecked();
    expect(screen.getAllByRole('radio').filter((r) => (r as HTMLInputElement).checked)).toHaveLength(1);
  });

  it('désactivé : aucun changement', async () => {
    const { onChange } = setup(0, true);
    await userEvent.click(screen.getByRole('radio', { name: LABELS.agree }));
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-disabled', 'true');
  });

  it('« passer » est visuellement distinct des cinq niveaux', () => {
    setup(null);
    const skipLabel = screen.getByRole('radio', { name: LABELS.skip }).closest('label');
    const levelLabel = screen.getByRole('radio', { name: LABELS.agree }).closest('label');
    expect(skipLabel?.className).toContain('text-fg-muted');
    expect(levelLabel?.className).toContain('bg-surface');
    expect(skipLabel?.className).not.toBe(levelLabel?.className);
  });
});
