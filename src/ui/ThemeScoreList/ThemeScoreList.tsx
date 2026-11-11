'use client';

import { useFormatter, useTranslations } from 'next-intl';

export type ThemeRowView = { key: string; label: string; priority: boolean; percent: number | null; known: number; answered: number };

export type ThemeScoreListProps = {
  rows: readonly ThemeRowView[];
  /** Nom accessible de la liste. */
  label: string;
  className?: string;
};

function KeyIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5 shrink-0" fill="currentColor">
      <path d="M8 1.5l1.9 4 4.4.5-3.3 3 .9 4.3L8 11.1l-3.9 2.2.9-4.3-3.3-3 4.4-.5z" />
    </svg>
  );
}

/** Scores par thème (FR-011 à FR-014) : sujets clés distingués par le texte, « — » si indéfini. */
export function ThemeScoreList({ rows, label, className = '' }: ThemeScoreListProps) {
  const t = useTranslations('ui.themeScoreList');
  const format = useFormatter();
  return (
    <ul aria-label={label} className={['flex flex-col gap-3', className].filter(Boolean).join(' ')}>
      {rows.map((row) => {
        const name = row.key === 'others' ? t('others') : row.label;
        // Sur fond de sujet clé, le texte secondaire reste en couleur principale (contraste AA en sombre).
        const muted = row.priority ? 'text-fg' : 'text-fg-muted';
        const percentText = row.percent === null ? null : format.number(row.percent / 100, { style: 'percent', maximumFractionDigits: 0 });
        return (
          <li key={row.key} data-theme={row.key} className={['flex flex-col gap-1.5 rounded-md border p-3', row.priority ? 'border-accent bg-accent-soft' : 'border-border bg-surface'].join(' ')}>
            <div className="flex items-baseline justify-between gap-3">
              <p className="flex min-w-0 items-center gap-1.5 font-medium break-words">
                {row.priority ? (
                  <>
                    <KeyIcon />
                    <span className="sr-only">{t('priorityTheme', { label: name })}</span>
                    <span aria-hidden="true">
                      {name} · {t('priorityMark')}
                    </span>
                  </>
                ) : (
                  <span>{name}</span>
                )}
              </p>
              {percentText === null ? (
                <span className={['shrink-0 text-sm', muted].join(' ')}>
                  <span aria-hidden="true">—</span>
                  <span className="sr-only">{t('undefined')}</span>
                </span>
              ) : (
                <span className="shrink-0 text-sm font-medium tabular-nums">{percentText}</span>
              )}
            </div>
            {row.percent === null ? (
              <span aria-hidden="true" className="h-2 w-full rounded-full border border-dashed border-border" />
            ) : (
              <span role="meter" aria-label={name} aria-valuemin={0} aria-valuemax={100} aria-valuenow={row.percent} aria-valuetext={percentText!} className="h-2 w-full overflow-hidden rounded-full bg-border">
                <span className="block h-full rounded-full bg-accent" style={{ width: `${Math.min(100, Math.max(0, row.percent))}%` }} />
              </span>
            )}
            <p className={['text-sm', muted].join(' ')}>{t('coverage', { known: row.known, answered: row.answered })}</p>
          </li>
        );
      })}
    </ul>
  );
}
