import type { HTMLAttributes } from 'react';

export type ProgressBarProps = {
  /** Progression courante, de 0 à `total`. */
  value: number;
  total: number;
  /** Libellé accessible et visible, fourni par le parent via i18n (ex. « Question 7 sur 25 »). */
  label: string;
  className?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'className'>;

export function ProgressBar({ value, total, label, className = '', ...rest }: ProgressBarProps) {
  const safeTotal = Math.max(1, total);
  const clamped = Math.min(safeTotal, Math.max(0, value));
  const percent = (clamped / safeTotal) * 100;
  return (
    <div {...rest} className={['flex flex-col gap-2', className].filter(Boolean).join(' ')}>
      <span className="text-sm text-fg-muted">{label}</span>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={safeTotal}
        aria-valuenow={clamped}
        className="h-2 w-full overflow-hidden rounded-full bg-border"
      >
        <div className="h-full rounded-full bg-accent transition-[width]" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
