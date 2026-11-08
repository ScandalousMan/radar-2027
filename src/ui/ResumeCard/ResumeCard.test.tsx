import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { fr, norm, renderWithIntl } from '@/lib/test-utils';
import { ResumeCard } from './ResumeCard';

const L = fr.ui.resumeCard;

function setup(status: 'resumable' | 'version-changed') {
  const callbacks = { onResume: vi.fn(), onRestart: vi.fn(), onClear: vi.fn() };
  renderWithIntl(<ResumeCard mode="short" done={10} total={25} updatedAt="8 novembre 2026 à 17:42" status={status} {...callbacks} />);
  return callbacks;
}

describe('ResumeCard', () => {
  it('affiche mode, avancement et date', () => {
    setup('resumable');
    expect(screen.getByRole('heading', { name: L.title })).toBeInTheDocument();
    expect(screen.getByText(/Mode court · 10 \/ 25 questions traitées · dernière réponse le 8 novembre 2026 à 17:42/)).toBeInTheDocument();
  });

  it('Reprendre, Recommencer et Effacer appellent leurs rappels', async () => {
    const c = setup('resumable');
    await userEvent.click(screen.getByRole('button', { name: L.resume }));
    await userEvent.click(screen.getByRole('button', { name: L.restart }));
    await userEvent.click(screen.getByRole('button', { name: L.clear }));
    expect(c.onResume).toHaveBeenCalledTimes(1);
    expect(c.onRestart).toHaveBeenCalledTimes(1);
    expect(c.onClear).toHaveBeenCalledTimes(1);
  });

  it('version changée : pas de Reprendre, avertissement présent', () => {
    setup('version-changed');
    expect(screen.queryByRole('button', { name: L.resume })).toBeNull();
    expect(screen.getByRole('status')).toHaveTextContent(norm(L.versionChanged));
    expect(screen.getByRole('button', { name: L.restart })).toBeInTheDocument();
  });
});
