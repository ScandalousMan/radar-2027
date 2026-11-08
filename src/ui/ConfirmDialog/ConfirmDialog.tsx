'use client';

import { useEffect, useId, useRef } from 'react';
import { Button } from '@/ui/Button';

export type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  /** Action destructrice : bouton Confirmer en style `danger` ; Annuler reste le focus initial. */
  destructive?: boolean;
  onConfirm: () => void;
  /** Aussi appelé sur Échap et sur un clic hors de la boîte. */
  onCancel: () => void;
};

/**
 * Confirmation modale par `<dialog>` natif (R12) : focus initial sur Annuler, piège de focus
 * natif, Échap = annuler, retour du focus à l'élément actif avant l'ouverture.
 */
export function ConfirmDialog({ open, title, description, confirmLabel, cancelLabel, destructive = false, onConfirm, onCancel }: ConfirmDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const previous = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      previous.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      dialog.showModal();
      dialog.querySelector<HTMLElement>('[data-dialog-cancel]')?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const onClose = () => {
      const target = previous.current;
      previous.current = null;
      if (target?.isConnected) target.focus();
    };
    dialog.addEventListener('close', onClose);
    return () => dialog.removeEventListener('close', onClose);
  }, []);

  return (
    // Le clic sur le fond (la boîte elle-même, hors contenu) équivaut à Annuler ; Échap est géré par l'événement natif `cancel`.
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      className="m-auto w-full max-w-content rounded-lg border border-border bg-surface p-0 text-fg shadow-md backdrop:bg-fg/40"
      onCancel={(event) => {
        event.preventDefault();
        onCancel();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <div className="flex flex-col gap-4 p-6">
        <h2 id={titleId} className="text-xl font-semibold">
          {title}
        </h2>
        <p id={descriptionId} className="text-fg-muted">
          {description}
        </p>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button data-dialog-cancel variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant={destructive ? 'danger' : 'primary'} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
