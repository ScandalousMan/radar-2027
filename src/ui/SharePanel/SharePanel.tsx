'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useId, useRef, useState } from 'react';
import { Button } from '../Button';

export type SharePanelProps = {
  url: string;
  /** Aperçu générique servi aux messageries (FR-029), identique pour tous les liens. */
  preview: { title: string; description: string };
  onCopy: () => Promise<'copied' | 'manual'>;
  /** Absent : bouton de partage natif non rendu (FR-030). */
  nativeShare?: () => Promise<'shared' | 'cancelled'>;
  className?: string;
};

/** Partage du lien : copie annoncée, champ de repli sélectionné, partage natif, aperçu (FR-023, FR-027 à FR-030). */
export function SharePanel({ url, preview, onCopy, nativeShare, className = '' }: SharePanelProps) {
  const t = useTranslations('ui.sharePanel');
  const [outcome, setOutcome] = useState<'idle' | 'copied' | 'manual'>('idle');
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const hintId = useId();

  useEffect(() => {
    if (outcome !== 'manual') return;
    inputRef.current?.focus();
    inputRef.current?.select();
  }, [outcome]);

  return (
    <div className={['flex flex-col gap-4', className].filter(Boolean).join(' ')}>
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Button onClick={async () => setOutcome(await onCopy())}>{t('copy')}</Button>
        {nativeShare ? (
          <Button variant="secondary" onClick={() => void nativeShare()}>
            {t('native')}
          </Button>
        ) : null}
      </div>
      <p aria-live="polite" className="text-sm font-medium text-success">
        {outcome === 'copied' ? t('copied') : ''}
      </p>
      {outcome === 'manual' ? (
        <div className="flex flex-col gap-2">
          <p id={hintId} className="text-sm">
            {t('manualHint')}
          </p>
          <label htmlFor={inputId} className="text-sm font-medium">
            {t('manualLabel')}
          </label>
          <input
            ref={inputRef}
            id={inputId}
            readOnly
            value={url}
            aria-describedby={hintId}
            onFocus={(event) => event.currentTarget.select()}
            className="min-h-touch w-full rounded-md border border-border bg-surface px-3 text-sm text-fg"
          />
        </div>
      ) : null}
      <figure className="flex flex-col gap-1 rounded-md border border-border bg-bg p-3">
        <figcaption className="text-xs font-medium text-fg-muted">{t('previewTitle')}</figcaption>
        <p className="text-sm font-semibold">{preview.title}</p>
        <p className="text-sm text-fg-muted">{preview.description}</p>
      </figure>
    </div>
  );
}
