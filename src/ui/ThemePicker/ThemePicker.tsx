'use client';

import { useTranslations } from 'next-intl';
import { useId, type FieldsetHTMLAttributes } from 'react';
import { ThemeChip } from '@/ui/ThemeChip';

export type ThemeOption = { id: string; label: string; description?: string };

export type ThemePickerProps = {
  options: ThemeOption[];
  /** Identifiants sélectionnés (état contrôlé par le parent). */
  value: string[];
  /** Nouvelle sélection et validité (`min ≤ taille ≤ max`) ; le parent décide de la navigation. */
  onChange: (next: string[], meta: { valid: boolean }) => void;
  min?: number;
  max?: number;
  legend: string;
  disabled?: boolean;
  className?: string;
} & Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, 'onChange' | 'children' | 'className' | 'disabled'>;

export function isThemeSelectionValid(count: number, min: number, max: number): boolean {
  return count >= min && count <= max;
}

export function ThemePicker({
  options,
  value,
  onChange,
  min = 3,
  max = 5,
  legend,
  disabled = false,
  className = '',
  ...rest
}: ThemePickerProps) {
  const t = useTranslations('ui.themePicker');
  const statusId = useId();
  const count = value.length;
  const atMax = count >= max;
  const missing = Math.max(0, min - count);

  const toggle = (id: string) => {
    if (disabled) return;
    const selected = value.includes(id);
    if (!selected && atMax) return; // (max+1)-ième refusé
    const next = selected ? value.filter((v) => v !== id) : [...value, id];
    onChange(next, { valid: isThemeSelectionValid(next.length, min, max) });
  };

  const message = atMax ? t('maxReached', { max }) : missing > 0 ? t('minNotReached', { missing, min }) : null;

  return (
    <fieldset {...rest} disabled={undefined} aria-describedby={statusId} className={['flex flex-col gap-3', className].filter(Boolean).join(' ')}>
      <legend className="mb-1 text-base font-medium">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <ThemeChip
            key={option.id}
            id={option.id}
            label={option.label}
            title={option.description}
            selected={value.includes(option.id)}
            disabled={disabled || atMax}
            onToggle={toggle}
          />
        ))}
      </div>
      <p id={statusId} aria-live="polite" aria-atomic="true" className="flex flex-col gap-1 text-sm">
        <span className="text-fg-muted">
          <span aria-hidden="true">{t('counter', { count, max })}</span>
          <span className="sr-only">{t('counterLabel', { count, max })}</span>
        </span>
        {message ? <span className={atMax ? 'text-fg-muted' : 'text-danger'}>{message}</span> : null}
      </p>
    </fieldset>
  );
}
