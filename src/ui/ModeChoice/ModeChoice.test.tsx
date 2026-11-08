import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fr, renderWithIntl } from '@/lib/test-utils';
import { ModeChoice, type QuestionnaireMode } from './ModeChoice';

const OPTIONS = [
  { mode: 'short' as const, questionCount: 25 },
  { mode: 'full' as const, questionCount: 96 },
];
const L = fr.ui.modeChoice;

function setup(initial: QuestionnaireMode | null = null, disabled = false) {
  const onChange = vi.fn();
  function C() {
    const [value, setValue] = useState(initial);
    return (
      <ModeChoice
        options={OPTIONS}
        value={value}
        legend="Mode du questionnaire"
        disabled={disabled}
        onChange={(m) => {
          setValue(m);
          onChange(m);
        }}
      />
    );
  }
  renderWithIntl(<C />);
  return { onChange };
}

describe('ModeChoice', () => {
  it('rend deux cartes radio avec le nombre exact de questions', () => {
    setup();
    expect(screen.getByRole('radiogroup', { name: 'Mode du questionnaire' })).toBeInTheDocument();
    const short = screen.getByRole('radio', { name: L.short.title });
    const full = screen.getByRole('radio', { name: L.full.title });
    expect(short).not.toBeChecked();
    expect(full).not.toBeChecked();
    expect(screen.getByText('25 questions')).toBeInTheDocument();
    expect(screen.getByText('96 questions')).toBeInTheDocument();
    expect(short).toHaveAccessibleDescription(expect.stringContaining(L.short.duration));
  });

  it('clic change la valeur et l’état coché', async () => {
    const { onChange } = setup();
    await userEvent.click(screen.getByText(L.full.title));
    expect(onChange).toHaveBeenCalledWith('full');
    expect(screen.getByRole('radio', { name: L.full.title })).toBeChecked();
  });

  it('les flèches déplacent sélection et focus', async () => {
    const { onChange } = setup('short');
    await userEvent.tab();
    expect(screen.getByRole('radio', { name: L.short.title })).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenLastCalledWith('full');
    expect(screen.getByRole('radio', { name: L.full.title })).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    expect(onChange).toHaveBeenLastCalledWith('short');
  });

  it('désactivé : aucun changement', async () => {
    const { onChange } = setup(null, true);
    await userEvent.click(screen.getByText(L.full.title));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('cibles tactiles ≥ 44 px', () => {
    setup();
    for (const r of screen.getAllByRole('radio')) expect(r.closest('label')?.className).toContain('min-h-touch');
  });
});
