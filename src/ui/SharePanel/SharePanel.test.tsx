import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { fr, renderWithIntl } from '@/lib/test-utils';
import { SharePanel } from './SharePanel';

const L = fr.ui.sharePanel;
const URL = 'https://radar.exemple/resultats#1.AbC';
const preview = { title: fr.results.meta.title, description: fr.results.meta.description };

describe('SharePanel', () => {
  it('copie réussie : annonce polie « Lien copié »', async () => {
    const onCopy = vi.fn(async () => 'copied' as const);
    const { container } = renderWithIntl(<SharePanel url={URL} preview={preview} onCopy={onCopy} />);
    const live = container.querySelector('[aria-live="polite"]')!;
    expect(live).toBeEmptyDOMElement();
    await userEvent.click(screen.getByRole('button', { name: L.copy }));
    expect(onCopy).toHaveBeenCalled();
    expect(live).toHaveTextContent(L.copied);
    expect(screen.queryByRole('textbox')).toBeNull();
  });

  it('copie impossible : champ en lecture seule, sélectionné, avec consigne', async () => {
    renderWithIntl(<SharePanel url={URL} preview={preview} onCopy={async () => 'manual'} />);
    await userEvent.click(screen.getByRole('button', { name: L.copy }));
    const input = screen.getByRole('textbox', { name: L.manualLabel }) as HTMLInputElement;
    expect(input).toHaveAttribute('readonly');
    expect(input.value).toBe(URL);
    expect(input).toHaveFocus();
    expect(input.selectionEnd! - input.selectionStart!).toBe(URL.length);
  });

  it('partage natif seulement s’il est fourni ; aperçu générique affiché', async () => {
    const nativeShare = vi.fn(async () => 'shared' as const);
    const { rerender } = renderWithIntl(<SharePanel url={URL} preview={preview} onCopy={async () => 'copied'} />);
    expect(screen.queryByRole('button', { name: L.native })).toBeNull();
    expect(screen.getByText(preview.title)).toBeInTheDocument();
    expect(screen.getByText(preview.description)).toBeInTheDocument();
    rerender(<SharePanel url={URL} preview={preview} onCopy={async () => 'copied'} nativeShare={nativeShare} />);
    await userEvent.click(screen.getByRole('button', { name: L.native }));
    expect(nativeShare).toHaveBeenCalled();
  });
});
