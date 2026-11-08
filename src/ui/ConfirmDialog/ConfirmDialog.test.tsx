import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { renderWithIntl } from '@/lib/test-utils';
import { ConfirmDialog } from './ConfirmDialog';

// jsdom n'implémente pas showModal / close : polyfill minimal.
beforeAll(() => {
  const proto = HTMLDialogElement.prototype as HTMLDialogElement & { showModal?: () => void };
  if (typeof proto.showModal !== 'function') {
    proto.showModal = function (this: HTMLDialogElement) {
      this.setAttribute('open', '');
    };
    proto.close = function (this: HTMLDialogElement) {
      if (!this.hasAttribute('open')) return;
      this.removeAttribute('open');
      this.dispatchEvent(new Event('close'));
    };
  }
});

function Harness({ onConfirm = vi.fn(), onCancel = vi.fn() }: { onConfirm?: () => void; onCancel?: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Ouvrir
      </button>
      <ConfirmDialog
        open={open}
        title="Effacer le questionnaire ?"
        description="Toutes les données seront supprimées."
        confirmLabel="Effacer"
        cancelLabel="Annuler"
        destructive
        onConfirm={() => {
          onConfirm();
          setOpen(false);
        }}
        onCancel={() => {
          onCancel();
          setOpen(false);
        }}
      />
    </>
  );
}

const dialog = () => document.querySelector('dialog')!;

describe('ConfirmDialog', () => {
  it('s’ouvre par showModal, focus initial sur Annuler, nommé et décrit', async () => {
    const spy = vi.spyOn(HTMLDialogElement.prototype, 'showModal');
    renderWithIntl(<Harness />);
    expect(dialog()).not.toHaveAttribute('open');
    await userEvent.click(screen.getByRole('button', { name: 'Ouvrir' }));
    expect(spy).toHaveBeenCalledTimes(1);
    expect(dialog()).toHaveAttribute('open');
    expect(screen.getByRole('button', { name: 'Annuler' })).toHaveFocus();
    const labelledBy = dialog().getAttribute('aria-labelledby')!;
    const describedBy = dialog().getAttribute('aria-describedby')!;
    expect(document.getElementById(labelledBy)).toHaveTextContent('Effacer le questionnaire ?');
    expect(document.getElementById(describedBy)).toHaveTextContent('Toutes les données seront supprimées.');
    spy.mockRestore();
  });

  it('Confirmer appelle onConfirm et rend le focus au déclencheur', async () => {
    const onConfirm = vi.fn();
    renderWithIntl(<Harness onConfirm={onConfirm} />);
    const trigger = screen.getByRole('button', { name: 'Ouvrir' });
    await userEvent.click(trigger);
    await userEvent.click(screen.getByRole('button', { name: 'Effacer' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(dialog()).not.toHaveAttribute('open');
    expect(trigger).toHaveFocus();
  });

  it('Échap (événement cancel) appelle onCancel', async () => {
    const onCancel = vi.fn();
    renderWithIntl(<Harness onCancel={onCancel} />);
    await userEvent.click(screen.getByRole('button', { name: 'Ouvrir' }));
    fireEvent(dialog(), new Event('cancel', { cancelable: true }));
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(dialog()).not.toHaveAttribute('open');
  });

  it('un clic hors de la boîte (sur le fond) appelle onCancel, pas un clic dans le contenu', async () => {
    const onCancel = vi.fn();
    renderWithIntl(<Harness onCancel={onCancel} />);
    await userEvent.click(screen.getByRole('button', { name: 'Ouvrir' }));
    fireEvent.click(screen.getByText('Toutes les données seront supprimées.'));
    expect(onCancel).not.toHaveBeenCalled();
    fireEvent.click(dialog());
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('Annuler appelle onCancel', async () => {
    const onCancel = vi.fn();
    renderWithIntl(<Harness onCancel={onCancel} />);
    await userEvent.click(screen.getByRole('button', { name: 'Ouvrir' }));
    await userEvent.click(screen.getByRole('button', { name: 'Annuler' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
