import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { fr, renderWithIntl } from '@/lib/test-utils';
import { EvidenceBadge, type EvidenceLevel } from './EvidenceBadge';

const CASES: Array<[EvidenceLevel, string, string]> = [
  ['programme', fr.ui.evidence.programme, 'document'],
  ['livre_plateforme', fr.ui.evidence.livrePlateforme, 'book'],
  ['declaration_vote', fr.ui.evidence.declarationVote, 'speech'],
];

describe('EvidenceBadge', () => {
  it.each(CASES)('niveau %s : libellé i18n et icône distincte', (level, label, icon) => {
    const { container } = renderWithIntl(<EvidenceBadge level={level} />);
    expect(screen.getByText(label)).toBeInTheDocument();
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('data-icon', icon);
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });

  it('les trois icônes sont différentes', () => {
    const icons = CASES.map(([level]) => {
      const { container, unmount } = renderWithIntl(<EvidenceBadge level={level} />);
      const icon = container.querySelector('svg')?.getAttribute('data-icon');
      unmount();
      return icon;
    });
    expect(new Set(icons).size).toBe(3);
  });
});
