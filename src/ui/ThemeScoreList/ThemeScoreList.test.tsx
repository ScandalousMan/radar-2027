import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { fr, renderWithIntl } from '@/lib/test-utils';
import { ThemeScoreList } from './ThemeScoreList';

const L = fr.ui.themeScoreList;

describe('ThemeScoreList', () => {
  it('sujet clé en texte, pourcentage, « — » non calculable, couverture', () => {
    renderWithIntl(
      <ThemeScoreList
        label="Scores par thème"
        rows={[
          { key: 'eco', label: 'Économie', priority: true, percent: 62, known: 2, answered: 2 },
          { key: 'sante', label: 'Santé', priority: false, percent: null, known: 1, answered: 2 },
          { key: 'others', label: '', priority: false, percent: 75, known: 10, answered: 12 },
        ]}
      />,
    );
    const items = within(screen.getByRole('list', { name: 'Scores par thème' })).getAllByRole('listitem');
    expect(items[0]).toHaveTextContent('Sujet clé : Économie');
    expect(within(items[0]!).getByRole('meter', { name: 'Économie' })).toHaveAttribute('aria-valuenow', '62');
    expect(items[0]).toHaveTextContent('2 positions connues sur 2 questions répondues');
    expect(items[1]).toHaveTextContent(L.undefined);
    expect(within(items[1]!).queryByRole('meter')).toBeNull();
    expect(items[1]).toHaveTextContent('1 position connue sur 2 questions répondues');
    expect(items[2]).toHaveTextContent(L.others);
  });
});
