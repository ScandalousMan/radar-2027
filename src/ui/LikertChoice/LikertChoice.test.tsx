import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fr, renderWithIntl } from '@/lib/test-utils';
import { LikertChoice, type LikertAnswer } from './LikertChoice';

const LABELS = fr.ui.likert;

function Controlled({ initial, onChange }: { initial: LikertAnswer; onChange: (next: LikertAnswer) => void }) {
  const [value, setValue] = useState<LikertAnswer>(initial);
  return (
    <LikertChoice
      name="q1"
      value={value}
      legend="Énoncé"
      onChange={(next) => {
        setValue(next);
        onChange(next);
      }}
    />
  );
}

function setupControlled(initial: LikertAnswer) {
  const onChange = vi.fn();
  renderWithIntl(<Controlled initial={initial} onChange={onChange} />);
  return { onChange };
}

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

  describe('clavier (FR-013)', () => {
    const radio = (name: string) => screen.getByRole('radio', { name });

    it('Tab entre dans le groupe sur la première option si aucune réponse', async () => {
      setupControlled(null);
      await userEvent.tab();
      expect(radio(LABELS.stronglyDisagree)).toHaveFocus();
      // Un seul arrêt de tabulation : Tab sort du groupe.
      await userEvent.tab();
      expect(screen.queryAllByRole('radio').some((r) => r === document.activeElement)).toBe(false);
    });

    it('Tab entre dans le groupe sur l’option sélectionnée', async () => {
      setupControlled(1);
      await userEvent.tab();
      expect(radio(LABELS.agree)).toHaveFocus();
    });

    it('les flèches déplacent le focus et la sélection sur les six options, en boucle', async () => {
      const { onChange } = setupControlled(null);
      await userEvent.tab();
      await userEvent.keyboard('{ArrowRight}');
      expect(radio(LABELS.disagree)).toHaveFocus();
      expect(onChange).toHaveBeenLastCalledWith(-1);
      await userEvent.keyboard('{ArrowDown}');
      expect(radio(LABELS.neutral)).toHaveFocus();
      expect(onChange).toHaveBeenLastCalledWith(0);
      await userEvent.keyboard('{ArrowLeft}');
      expect(radio(LABELS.disagree)).toHaveFocus();
      await userEvent.keyboard('{ArrowUp}');
      expect(radio(LABELS.stronglyDisagree)).toHaveFocus();
      expect(onChange).toHaveBeenLastCalledWith(-2);
      await userEvent.keyboard('{ArrowUp}');
      expect(radio(LABELS.skip)).toHaveFocus();
      expect(onChange).toHaveBeenLastCalledWith('skipped');
      await userEvent.keyboard('{ArrowRight}');
      expect(radio(LABELS.stronglyDisagree)).toHaveFocus();
      await userEvent.keyboard('{End}');
      expect(radio(LABELS.skip)).toHaveFocus();
      await userEvent.keyboard('{Home}');
      expect(radio(LABELS.stronglyDisagree)).toHaveFocus();
    });

    it('Espace et Entrée confirment l’option focalisée', async () => {
      const { onChange } = setupControlled(null);
      radio(LABELS.stronglyAgree).focus();
      await userEvent.keyboard('{Enter}');
      expect(onChange).toHaveBeenLastCalledWith(2);
      radio(LABELS.neutral).focus();
      await userEvent.keyboard(' ');
      expect(onChange).toHaveBeenLastCalledWith(0);
    });

    it('chaque option expose sa position « n sur 6 »', () => {
      setup(null);
      const radios = screen.getAllByRole('radio');
      radios.forEach((r, index) => {
        expect(r).toHaveAttribute('aria-posinset', String(index + 1));
        expect(r).toHaveAttribute('aria-setsize', '6');
      });
    });

    it('désactivé : les flèches ne changent rien', async () => {
      const { onChange } = setup(0, true);
      radio(LABELS.neutral).focus();
      await userEvent.keyboard('{ArrowRight}');
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  it('chaque option a une cible tactile de 44 px', () => {
    setup(null);
    for (const r of screen.getAllByRole('radio')) {
      expect(r.closest('label')?.className).toContain('min-h-touch');
    }
  });
});
