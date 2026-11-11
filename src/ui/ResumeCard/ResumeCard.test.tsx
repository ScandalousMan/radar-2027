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

  it('terminé : titre, Voir mes résultats et Recommencer ; pas de Reprendre', async () => {
    const callbacks = { onViewResults: vi.fn(), onRestart: vi.fn(), onClear: vi.fn() };
    renderWithIntl(<ResumeCard mode="full" done={100} total={100} updatedAt="8 novembre 2026 à 17:42" status="complete" {...callbacks} />);
    expect(screen.getByRole('heading', { name: L.completeTitle })).toBeInTheDocument();
    expect(screen.getByText(/Mode complet · 100 questions · dernière réponse le 8 novembre 2026 à 17:42/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: L.resume })).toBeNull();
    expect(screen.queryByRole('status')).toBeNull();
    await userEvent.click(screen.getByRole('button', { name: L.viewResults }));
    expect(callbacks.onViewResults).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: L.restart })).toBeInTheDocument();
  });

  it('terminé, version changée : la notice s’ajoute, Voir mes résultats reste', () => {
    renderWithIntl(<ResumeCard mode="short" done={25} total={25} updatedAt="8 novembre 2026" status="complete" versionChanged onViewResults={vi.fn()} onRestart={vi.fn()} onClear={vi.fn()} />);
    expect(screen.getByRole('status')).toHaveTextContent(norm(L.versionChanged));
    expect(screen.getByRole('button', { name: L.viewResults })).toBeInTheDocument();
  });
});
