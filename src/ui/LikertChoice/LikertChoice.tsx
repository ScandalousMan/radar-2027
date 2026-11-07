'use client';

import { useTranslations } from 'next-intl';
import { useId, useRef, type FieldsetHTMLAttributes, type KeyboardEvent } from 'react';

export type LikertValue = -2 | -1 | 0 | 1 | 2;

/** `'skipped'` (passée) est distinct de `null` (aucune réponse). */
export type LikertAnswer = LikertValue | 'skipped' | null;

export type LikertChoiceProps = {
  /** Nom du groupe de boutons radio (unique par question). */
  name: string;
  value: LikertAnswer;
  onChange: (next: LikertAnswer) => void;
  disabled?: boolean;
  /** Énoncé de la question ou libellé du groupe, fourni par le parent. */
  legend: string;
  className?: string;
} & Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, 'onChange' | 'children' | 'className' | 'disabled'>;

type Option = { answer: Exclude<LikertAnswer, null>; key: 'stronglyDisagree' | 'disagree' | 'neutral' | 'agree' | 'stronglyAgree' | 'skip' };

export const LIKERT_OPTIONS: readonly Option[] = [
  { answer: -2, key: 'stronglyDisagree' },
  { answer: -1, key: 'disagree' },
  { answer: 0, key: 'neutral' },
  { answer: 1, key: 'agree' },
  { answer: 2, key: 'stronglyAgree' },
  { answer: 'skipped', key: 'skip' },
];

const OPTION_BASE =
  'flex min-h-touch cursor-pointer items-center justify-center rounded-md border px-3 py-2 text-center text-sm font-medium transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus';
const LEVEL_IDLE = 'border-border bg-surface text-fg hover:border-fg-muted';
const LEVEL_SELECTED = 'border-accent bg-accent text-accent-fg';
const SKIP_IDLE = 'border-transparent bg-transparent text-fg-muted underline-offset-4 hover:underline';
const SKIP_SELECTED = 'border-border bg-bg text-fg';
const DISABLED = 'cursor-not-allowed opacity-60 hover:border-border hover:no-underline';

export function LikertChoice({ name, value, onChange, disabled = false, legend, className = '', ...rest }: LikertChoiceProps) {
  const t = useTranslations('ui.likert');
  const groupId = useId();
  const inputs = useRef<Array<HTMLInputElement | null>>([]);
  const selectedIndex = LIKERT_OPTIONS.findIndex((option) => option.answer === value);
  // Roving tabindex : l'option sélectionnée (sinon la première) porte le focus du groupe.
  const tabbableIndex = selectedIndex === -1 ? 0 : selectedIndex;

  const select = (index: number) => {
    const option = LIKERT_OPTIONS[index];
    if (!option || disabled) return;
    inputs.current[index]?.focus();
    if (option.answer !== value) onChange(option.answer);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>, index: number) => {
    const last = LIKERT_OPTIONS.length - 1;
    let next: number | null = null;
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        next = index === last ? 0 : index + 1;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        next = index === 0 ? last : index - 1;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = last;
        break;
      case 'Enter':
      case ' ':
        next = index;
        break;
      default:
        return;
    }
    event.preventDefault();
    select(next);
  };

  return (
    <fieldset {...rest} className={['flex flex-col gap-3', className].filter(Boolean).join(' ')}>
      <legend id={`${groupId}-legend`} className="mb-2 text-lg font-medium">
        {legend}
      </legend>
      <div role="radiogroup" aria-labelledby={`${groupId}-legend`} aria-disabled={disabled || undefined} className="flex flex-col gap-3">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-5">
        {LIKERT_OPTIONS.slice(0, 5).map((option, index) => (
          <LikertOption
            key={option.key}
            id={`${groupId}-${option.key}`}
            name={name}
            label={t(option.key)}
            index={index}
            checked={value === option.answer}
            tabbable={index === tabbableIndex}
            disabled={disabled}
            className={[OPTION_BASE, value === option.answer ? LEVEL_SELECTED : LEVEL_IDLE, disabled ? DISABLED : ''].join(' ')}
            inputRef={(el) => {
              inputs.current[index] = el;
            }}
            onSelect={() => select(index)}
            onKeyDown={(event) => onKeyDown(event, index)}
          />
        ))}
      </div>
      <div className="mt-1 border-t border-border pt-3">
        <LikertOption
          id={`${groupId}-skip`}
          name={name}
          label={t('skip')}
          index={5}
          checked={value === 'skipped'}
          tabbable={tabbableIndex === 5}
          disabled={disabled}
          className={[OPTION_BASE, 'inline-flex w-full sm:w-auto', value === 'skipped' ? SKIP_SELECTED : SKIP_IDLE, disabled ? DISABLED : ''].join(' ')}
          inputRef={(el) => {
            inputs.current[5] = el;
          }}
          onSelect={() => select(5)}
          onKeyDown={(event) => onKeyDown(event, 5)}
        />
      </div>
      </div>
    </fieldset>
  );
}

type LikertOptionProps = {
  id: string;
  name: string;
  label: string;
  index: number;
  checked: boolean;
  tabbable: boolean;
  disabled: boolean;
  className: string;
  inputRef: (el: HTMLInputElement | null) => void;
  onSelect: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
};

function LikertOption({ id, name, label, index, checked, tabbable, disabled, className, inputRef, onSelect, onKeyDown }: LikertOptionProps) {
  return (
    <label htmlFor={id} className={className}>
      <input
        ref={inputRef}
        id={id}
        type="radio"
        name={name}
        value={String(index)}
        checked={checked}
        aria-posinset={index + 1}
        aria-setsize={LIKERT_OPTIONS.length}
        aria-disabled={disabled || undefined}
        tabIndex={tabbable ? 0 : -1}
        className="sr-only"
        onChange={() => {
          if (!disabled) onSelect();
        }}
        onClick={(event) => {
          if (disabled) event.preventDefault();
        }}
        onKeyDown={onKeyDown}
      />
      <span>{label}</span>
    </label>
  );
}
