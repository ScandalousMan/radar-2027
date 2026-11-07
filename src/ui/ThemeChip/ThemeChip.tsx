'use client';

import type { ButtonHTMLAttributes } from 'react';

export type ThemeChipProps = {
  id: string;
  /** Libellé du sujet, fourni par le parent ; passe à la ligne, jamais tronqué. */
  label: string;
  selected: boolean;
  /** Maximum atteint : la puce reste focalisable (aria-disabled) mais ne bascule plus. */
  disabled?: boolean;
  onToggle: (id: string) => void;
  className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'id' | 'onClick' | 'onToggle' | 'disabled' | 'children' | 'className'>;

function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8.5l3 3 7-7" />
    </svg>
  );
}

export function ThemeChip({ id, label, selected, disabled = false, onToggle, className = '', ...rest }: ThemeChipProps) {
  const inactive = disabled && !selected;
  const classes = [
    'inline-flex min-h-touch max-w-full items-center gap-2 rounded-full border px-4 py-2 text-left text-sm font-medium whitespace-normal break-words transition-colors',
    selected ? 'border-accent bg-accent-soft text-fg' : 'border-border bg-surface text-fg hover:border-fg-muted',
    inactive ? 'cursor-not-allowed opacity-60 hover:border-border' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      {...rest}
      type="button"
      data-theme-id={id}
      aria-pressed={selected}
      aria-disabled={inactive || undefined}
      className={classes}
      onClick={() => {
        if (inactive) return;
        onToggle(id);
      }}
    >
      {selected ? <CheckIcon /> : null}
      <span>{label}</span>
    </button>
  );
}
