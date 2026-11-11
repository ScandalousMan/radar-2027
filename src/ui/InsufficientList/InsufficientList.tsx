'use client';

import { useTranslations } from 'next-intl';
import { useId } from 'react';
import { buttonClassName } from '../Button/classes';
import { CompareToggle } from '../RankingList/CompareToggle';

export type InsufficientRowView = { id: string; name: string; unknown: number; answered: number; withdrawn: boolean };

export type InsufficientListProps = {
  rows: readonly InsufficientRowView[];
  selected: readonly string[];
  maxSelected?: number;
  onOpen: (id: string) => void;
  onToggleCompare: (id: string) => void;
  className?: string;
};

/**
 * Candidats en données insuffisantes (FR-007, FR-008) : sans rang ni score global, rendu atténué
 * par la couleur de texte secondaire (contraste AA), jamais par l'opacité seule, et signalé en texte.
 */
export function InsufficientList({ rows, selected, maxSelected = 3, onOpen, onToggleCompare, className = '' }: InsufficientListProps) {
  const t = useTranslations('ui.insufficientList');
  const tList = useTranslations('ui.rankingList');
  const tResults = useTranslations('results');
  const headingId = useId();
  const limitId = useId();
  if (rows.length === 0) return null;
  const limitReached = selected.length >= maxSelected;
  return (
    <section aria-labelledby={headingId} className={['flex flex-col gap-3', className].filter(Boolean).join(' ')}>
      <h2 id={headingId} className="text-xl font-semibold">
        {tResults('insufficient.title')}
      </h2>
      <p className="text-sm text-fg-muted">{tResults('insufficient.intro')}</p>
      <ul className="flex flex-col gap-3">
        {rows.map((row) => (
          <li key={row.id} data-candidate={row.id} className="flex flex-col gap-3 rounded-lg border border-dashed border-border bg-bg p-4 text-fg-muted">
            <div className="flex flex-col gap-1">
              <p className="font-medium break-words">{row.name}</p>
              <p className="text-sm">
                <span className="font-medium">{t('status')}</span>
                {' · '}
                {t('unknown', { unknown: row.unknown, answered: row.answered })}
                {row.withdrawn ? (
                  <>
                    {' · '}
                    {tResults('withdrawn')}
                  </>
                ) : null}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" data-open-candidate={row.id} aria-label={tList('openLabel', { name: row.name })} className={buttonClassName({ variant: 'ghost', size: 'sm' })} onClick={() => onOpen(row.id)}>
                {tList('open')}
              </button>
              <CompareToggle
                id={row.id}
                name={row.name}
                selected={selected.includes(row.id)}
                limitReached={limitReached}
                limitId={limitId}
                label={tList('compare')}
                accessibleLabel={tList('compareLabel', { name: row.name })}
                onToggle={onToggleCompare}
              />
            </div>
          </li>
        ))}
      </ul>
      <p id={limitId} className={limitReached ? 'text-sm text-fg-muted' : 'sr-only'}>
        {tList('compareDisabled')}
      </p>
    </section>
  );
}
