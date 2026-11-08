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
  /** Identifiant d'un élément qui nomme le groupe avant la légende (l'énoncé, FR-032). */
  labelledBy?: string;
  /**
   * Activation explicite d'une option (clic ou toucher, Entrée, Espace), y compris l'option déjà
   * sélectionnée ; appelé après `onChange`. Les flèches, Début et Fin n'appellent que `onChange`.
   */
  onCommit?: (answer: Exclude<LikertAnswer, null>) => void;
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

export function LikertChoice({ name, value, onChange, onCommit, disabled = false, legend, labelledBy, className = '', ...rest }: LikertChoiceProps) {
  const t = useTranslations('ui.likert');
  const groupId = useId();
  const inputs = useRef<Array<HTMLInputElement | null>>([]);
  // Vrai entre l'appui sur Entrée/Espace et le clic natif éventuel qui le suit : évite un double commit.
  const keyCommit = useRef(false);
  const selectedIndex = LIKERT_OPTIONS.findIndex((option) => option.answer === value);
  // Roving tabindex : l'option sélectionnée (sinon la première) porte le focus du groupe.
  const tabbableIndex = selectedIndex === -1 ? 0 : selectedIndex;

  const select = (index: number) => {
    const option = LIKERT_OPTIONS[index];
    if (!option || disabled) return;
    inputs.current[index]?.focus();
    if (option.answer !== value) onChange(option.answer);
  };

  const commit = (index: number) => {
    const option = LIKERT_OPTIONS[index];
    if (!option || disabled) return;
    select(index);
    onCommit?.(option.answer);
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
        event.preventDefault();
        keyCommit.current = true;
        commit(index);
        return;
      default:
        return;
    }
    event.preventDefault();
    select(next);
  };

  const releaseKey = () => {
    setTimeout(() => {
      keyCommit.current = false;
    }, 0);
  };

  return (
    <fieldset {...rest} className={['flex flex-col gap-3', className].filter(Boolean).join(' ')}>
      <legend id={`${groupId}-legend`} className="mb-2 text-lg font-medium">
        {legend}
      </legend>
      <div role="radiogroup" aria-labelledby={[labelledBy, `${groupId}-legend`].filter(Boolean).join(' ')} aria-disabled={disabled || undefined} className="flex flex-col gap-3">
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
            onActivate={() => {
              if (!keyCommit.current) commit(index);
            }}
            onKeyDown={(event) => onKeyDown(event, index)}
            onKeyUp={releaseKey}
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
          onActivate={() => {
            if (!keyCommit.current) commit(5);
          }}
          onKeyDown={(event) => onKeyDown(event, 5)}
          onKeyUp={releaseKey}
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
  /** Clic ou toucher (y compris sur le libellé) : sélection et commit. */
  onActivate: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  onKeyUp: () => void;
};

function LikertOption({ id, name, label, index, checked, tabbable, disabled, className, inputRef, onActivate, onKeyDown, onKeyUp }: LikertOptionProps) {
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
        // La sélection passe par le clic (qui précède toujours `change`) : rien à faire ici.
        onChange={() => {}}
        onClick={(event) => {
          if (disabled) event.preventDefault();
          else onActivate();
        }}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
      />
      <span>{label}</span>
    </label>
  );
}
