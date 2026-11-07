import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { APPEARANCE_ATTRIBUTE, APPEARANCE_STORAGE_KEY } from '@/lib/appearance';
import { fr, renderWithIntl } from '@/lib/test-utils';
import { PageShell } from './PageShell';

describe('PageShell', () => {
  beforeEach(() => {
    document.documentElement.setAttribute(APPEARANCE_ATTRIBUTE, 'light');
    window.localStorage.clear();
  });

  afterEach(() => {
    document.documentElement.removeAttribute(APPEARANCE_ATTRIBUTE);
    window.localStorage.clear();
  });

  it('le premier Tab atteint le lien « aller au contenu », qui mène à <main id="contenu">', async () => {
    renderWithIntl(
      <PageShell>
        <p>Corps</p>
      </PageShell>,
    );
    await userEvent.tab();
    const skip = screen.getByRole('link', { name: fr.common.skipToContent });
    expect(skip).toHaveFocus();
    expect(skip).toHaveAttribute('href', '#contenu');
    const main = screen.getByRole('main');
    expect(main).toHaveAttribute('id', 'contenu');
    expect(main).toHaveAttribute('tabindex', '-1');
    await userEvent.keyboard('{Enter}');
    expect(main).toHaveFocus();
  });

  it('ordre de focus : aller au contenu, nom du site, bascule, puis le contenu', async () => {
    renderWithIntl(
      <PageShell>
        <button type="button">Action</button>
      </PageShell>,
    );
    await userEvent.tab();
    expect(screen.getByRole('link', { name: fr.common.skipToContent })).toHaveFocus();
    await userEvent.tab();
    expect(screen.getByRole('link', { name: fr.common.siteName })).toHaveFocus();
    await userEvent.tab();
    expect(screen.getByRole('button', { name: fr.common.appearance.toggle })).toHaveFocus();
    await userEvent.tab();
    expect(screen.getByRole('button', { name: 'Action' })).toHaveFocus();
  });

  it('en-tête avec le nom du site, pied avec méthodologie et à propos', () => {
    renderWithIntl(
      <PageShell>
        <p>Corps</p>
      </PageShell>,
    );
    expect(screen.getByRole('link', { name: fr.common.siteName })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: fr.common.footer.methodology })).toHaveAttribute('href', '/methodologie');
    expect(screen.getByRole('link', { name: fr.common.footer.about })).toHaveAttribute('href', '/a-propos');
    expect(screen.getByText('Corps')).toBeInTheDocument();
  });

  it('la bascule d’apparence écrit data-theme et le stockage local', async () => {
    renderWithIntl(
      <PageShell>
        <p>Corps</p>
      </PageShell>,
    );
    const toggle = screen.getByRole('button', { name: fr.common.appearance.toggle });
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(toggle);
    expect(document.documentElement.getAttribute(APPEARANCE_ATTRIBUTE)).toBe('dark');
    expect(window.localStorage.getItem(APPEARANCE_STORAGE_KEY)).toBe('dark');
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(toggle);
    expect(document.documentElement.getAttribute(APPEARANCE_ATTRIBUTE)).toBe('light');
    expect(window.localStorage.getItem(APPEARANCE_STORAGE_KEY)).toBe('light');
  });

  it('la bascule a une cible tactile de 44 px', () => {
    renderWithIntl(
      <PageShell>
        <p>Corps</p>
      </PageShell>,
    );
    expect(screen.getByRole('button', { name: fr.common.appearance.toggle }).className).toContain('size-touch');
  });
});
