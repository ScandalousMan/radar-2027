import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fr, norm, renderWithIntl } from '@/lib/test-utils';
import { QuestionCard } from './QuestionCard';

const THEMES = [
  { id: 'sante', label: 'Santé', priority: true },
  { id: 'logement', label: 'Logement', priority: false },
];

function setup(extra: Partial<Parameters<typeof QuestionCard>[0]> = {}) {
  const onChange = vi.fn();
  const onCommit = vi.fn();
  const headingRef = createRef<HTMLHeadingElement>();
  renderWithIntl(<QuestionCard position={3} total={25} statement="L’État doit construire davantage de logements." themes={THEMES} value={null} onChange={onChange} onCommit={onCommit} headingRef={headingRef} {...extra} />);
  return { onChange, onCommit, headingRef };
}

describe('QuestionCard', () => {
  it('l’énoncé est un titre focalisable via headingRef', () => {
    const { headingRef } = setup();
    const heading = screen.getByRole('heading', { level: 2, name: 'L’État doit construire davantage de logements.' });
    expect(headingRef.current).toBe(heading);
    expect(heading).toHaveAttribute('tabindex', '-1');
    headingRef.current!.focus();
    expect(heading).toHaveFocus();
  });

  it('annonce le sujet clé en texte, pas par la seule couleur', () => {
    setup();
    const list = screen.getByRole('list', { name: fr.ui.questionCard.themes });
    const items = screen.getAllByRole('listitem');
    expect(list).toContainElement(items[0]!);
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent('Sujet clé : Santé');
    expect(items[1]).toHaveTextContent('Logement');
    expect(items[1]).not.toHaveTextContent(fr.ui.questionCard.priorityMark);
  });

  it('propage onChange et onCommit ; nom de groupe question-{position}', async () => {
    const { onChange, onCommit } = setup();
    // FR-032 : le groupe est nommé par l'énoncé, puis par la légende.
    expect(screen.getByRole('radiogroup', { name: `L’État doit construire davantage de logements. ${fr.ui.questionCard.answerLegend}` })).toBeInTheDocument();
    const radio = screen.getByRole('radio', { name: fr.ui.likert.agree });
    expect(radio).toHaveAttribute('name', 'question-3');
    await userEvent.click(radio);
    expect(onChange).toHaveBeenCalledWith(1);
    expect(onCommit).toHaveBeenCalledWith(1);
  });

  it('aide affichée seulement si fournie', () => {
    setup({ hint: fr.questionnaire.questions.hint });
    expect(screen.getByText(norm(fr.questionnaire.questions.hint))).toBeInTheDocument();
  });

  it('désactivée : aucune réponse', async () => {
    const { onCommit } = setup({ disabled: true });
    await userEvent.click(screen.getByRole('radio', { name: fr.ui.likert.agree }));
    expect(onCommit).not.toHaveBeenCalled();
  });
});
