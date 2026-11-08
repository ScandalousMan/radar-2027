'use client';

import { useTranslations } from 'next-intl';
import { useId, useRef, type KeyboardEvent } from 'react';

export type QuestionnaireMode = 'full' | 'short';

export type ModeOption = { mode: QuestionnaireMode; questionCount: number };

export type ModeChoiceProps = {
  /** Les deux modes avec le nombre exact de questions (calculé par le parent). */
  options: readonly ModeOption[];
  value: QuestionnaireMode | null;
  onChange: (mode: QuestionnaireMode) => void;
  legend: string;
  disabled?: boolean;
  className?: string;
};

const CARD =
  'flex min-h-touch cursor-pointer flex-col gap-1 rounded-lg border bg-surface px-4 py-4 text-left shadow-sm transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus';
const IDLE = 'border-border hover:border-fg-muted';
const SELECTED = 'border-accent bg-accent-soft';
const DISABLED = 'cursor-not-allowed opacity-60 hover:border-border';

/** Choix du mode : deux cartes radio (titre, nombre de questions, durée, précision). */
export function ModeChoice({ options, value, onChange, legend, disabled = false, className = '' }: ModeChoiceProps) {
  const t = useTranslations('ui.modeChoice');
  const groupId = useId();
  const inputs = useRef<Array<HTMLInputElement | null>>([]);
  const selectedIndex = options.findIndex((o) => o.mode === value);
  const tabbable = selectedIndex === -1 ? 0 : selectedIndex;

  const select = (index: number) => {
    const option = options[index];
    if (!option || disabled) return;
    inputs.current[index]?.focus();
    if (option.mode !== value) onChange(option.mode);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>, index: number) => {
    const last = options.length - 1;
    let next: number;
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        next = index === last ? 0 : index + 1;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        next = index === 0 ? last : index - 1;
        break;
      case ' ':
      case 'Enter':
        next = index;
        break;
      default:
        return;
    }
    event.preventDefault();
    select(next);
  };

  return (
    <fieldset className={['flex flex-col gap-3', className].filter(Boolean).join(' ')}>
      <legend id={`${groupId}-legend`} className="mb-2 text-lg font-medium">
        {legend}
      </legend>
      <div role="radiogroup" aria-labelledby={`${groupId}-legend`} aria-disabled={disabled || undefined} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {options.map((option, index) => {
          const id = `${groupId}-${option.mode}`;
          const checked = option.mode === value;
          return (
            <label key={option.mode} htmlFor={id} className={[CARD, checked ? SELECTED : IDLE, disabled ? DISABLED : ''].join(' ')}>
              <input
                ref={(el) => {
                  inputs.current[index] = el;
                }}
                id={id}
                type="radio"
                name={groupId}
                value={option.mode}
                checked={checked}
                aria-labelledby={`${id}-title`}
                aria-describedby={`${id}-details`}
                aria-disabled={disabled || undefined}
                tabIndex={index === tabbable ? 0 : -1}
                className="sr-only"
                onChange={() => {}}
                onClick={(event) => {
                  if (disabled) event.preventDefault();
                  else select(index);
                }}
                onKeyDown={(event) => onKeyDown(event, index)}
              />
              <span id={`${id}-title`} className="text-lg font-semibold">
                {t(`${option.mode}.title`)}
              </span>
              <span id={`${id}-details`} className="flex flex-col gap-1">
                <span className="font-medium">{t('questions', { count: option.questionCount })}</span>
                <span className="text-sm text-fg-muted">{t(`${option.mode}.duration`)}</span>
                <span className="text-sm text-fg-muted">{t(`${option.mode}.detail`)}</span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
