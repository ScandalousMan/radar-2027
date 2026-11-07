'use client';

import { useFormatter, useTranslations } from 'next-intl';
import type { HTMLAttributes } from 'react';

export type ScoreBarProps = {
  /** Score de 0 à 100 ; `undefined` = indéfini (affiche « — »). */
  value: number | undefined;
  /** Libellé (ex. nom du candidat ou du thème), fourni par le parent. */
  label: string;
  /** Variante dense pour les listes. */
  compact?: boolean;
  className?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'className'>;

function clampScore(value: number): number {
  if (value < 0 || value > 100) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`ScoreBar : valeur hors de [0, 100] bornée à l'affichage (${value}).`);
    }
    return Math.min(100, Math.max(0, value));
  }
  return value;
}

export function ScoreBar({ value, label, compact = false, className = '', ...rest }: ScoreBarProps) {
  const t = useTranslations('ui.scoreBar');
  const format = useFormatter();
  const score = value === undefined ? undefined : clampScore(value);
  const classes = [compact ? 'flex items-center gap-3' : 'flex flex-col gap-1', className].filter(Boolean).join(' ');
  const labelClass = compact ? 'min-w-0 flex-1 truncate text-sm' : 'text-base font-medium';
  const trackClass = compact ? 'h-1.5 w-24 shrink-0' : 'h-2.5 w-full';

  if (score === undefined) {
    return (
      <div {...rest} className={classes}>
        <span className={labelClass}>{label}</span>
        <span className="flex items-center gap-3">
          <span aria-hidden="true" className={`${trackClass} rounded-full border border-dashed border-border`} />
          <span className="text-sm text-fg-muted">
            <span aria-hidden="true">{t('undefined')}</span>
            <span className="sr-only">{t('unavailable')}</span>
          </span>
        </span>
      </div>
    );
  }

  const percentText = format.number(score / 100, { style: 'percent', maximumFractionDigits: 0 });
  return (
    <div {...rest} className={classes}>
      <span className={labelClass}>{label}</span>
      <span className="flex items-center gap-3">
        <span
          role="meter"
          aria-label={label}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={score}
          aria-valuetext={percentText}
          className={`${trackClass} overflow-hidden rounded-full bg-border`}
        >
          <span className="block h-full rounded-full bg-accent" style={{ width: `${score}%` }} />
        </span>
        <span className="text-sm tabular-nums text-fg-muted">{percentText}</span>
      </span>
    </div>
  );
}
