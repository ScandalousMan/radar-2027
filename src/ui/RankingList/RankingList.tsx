'use client';

import { useTranslations } from 'next-intl';
import { useId } from 'react';
import { buttonClassName } from '../Button/classes';
import { ScoreBar } from '../ScoreBar';
import { CompareToggle } from './CompareToggle';

/** Bande d'alignement (liste fermée FR-003), redéclarée pour ne pas dépendre du cœur. */
export type Band = 'very-aligned' | 'rather-aligned' | 'mixed' | 'distant';

export type RankingRowView = { id: string; name: string; rank: number; tied: boolean; percent: number; band: Band; withdrawn: boolean };

export type RankingListProps = {
  rows: readonly RankingRowView[];
  /** Candidats retenus pour la comparaison (0 à `maxSelected`). */
  selected: readonly string[];
  maxSelected?: number;
  onOpen: (id: string) => void;
  onToggleCompare: (id: string) => void;
  className?: string;
};

/** Classement des candidats classables : rang (et « ex æquo » en texte), nom, pourcentage, bande. */
export function RankingList({ rows, selected, maxSelected = 3, onOpen, onToggleCompare, className = '' }: RankingListProps) {
  const t = useTranslations('ui.rankingList');
  const tBand = useTranslations('results.band');
  const tResults = useTranslations('results');
  const limitId = useId();
  const limitReached = selected.length >= maxSelected;
  return (
    <div className={['flex flex-col gap-2', className].filter(Boolean).join(' ')}>
      <ol aria-label={t('label')} className="flex flex-col gap-3">
        {rows.map((row) => (
          <li key={row.id} data-candidate={row.id} className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4">
            <div className="flex items-start gap-3">
              <p className="flex min-w-10 shrink-0 flex-col items-center rounded-md bg-bg px-2 py-1 text-center">
                <span className="sr-only">{t('rank', { rank: row.rank })}</span>
                <span aria-hidden="true" className="text-xl font-semibold tabular-nums">
                  {row.rank}
                </span>
                {row.tied ? <span className="text-xs text-fg-muted">{t('tied')}</span> : null}
              </p>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <ScoreBar value={row.percent} label={row.name} />
                <p className="text-sm">
                  <span className="font-medium">{tBand(row.band)}</span>
                  {row.withdrawn ? (
                    <>
                      {' · '}
                      <span className="text-fg-muted">{tResults('withdrawn')}</span>
                    </>
                  ) : null}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" data-open-candidate={row.id} aria-label={t('openLabel', { name: row.name })} className={buttonClassName({ variant: 'ghost', size: 'sm' })} onClick={() => onOpen(row.id)}>
                {t('open')}
              </button>
              <CompareToggle
                id={row.id}
                name={row.name}
                selected={selected.includes(row.id)}
                limitReached={limitReached}
                limitId={limitId}
                label={t('compare')}
                accessibleLabel={t('compareLabel', { name: row.name })}
                onToggle={onToggleCompare}
              />
            </div>
          </li>
        ))}
      </ol>
      <p id={limitId} className={limitReached ? 'text-sm text-fg-muted' : 'sr-only'}>
        {t('compareDisabled')}
      </p>
    </div>
  );
}
