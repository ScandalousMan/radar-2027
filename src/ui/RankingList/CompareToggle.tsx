'use client';

import { buttonClassName } from '../Button/classes';

export type CompareToggleProps = {
  id: string;
  name: string;
  selected: boolean;
  /** Limite atteinte et candidat non sélectionné : reste focalisable, n'agit plus. */
  limitReached: boolean;
  /** Identifiant de l'élément qui explique la limite. */
  limitId: string;
  label: string;
  accessibleLabel: string;
  onToggle: (id: string) => void;
};

function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8.5l3 3 7-7" />
    </svg>
  );
}

/** Bascule « Comparer » partagée par le classement et les données insuffisantes (FR-019, FR-020). */
export function CompareToggle({ id, name, selected, limitReached, limitId, label, accessibleLabel, onToggle }: CompareToggleProps) {
  const inactive = limitReached && !selected;
  return (
    <button
      type="button"
      data-compare-candidate={id}
      data-name={name}
      aria-pressed={selected}
      aria-label={accessibleLabel}
      aria-disabled={inactive || undefined}
      aria-describedby={inactive ? limitId : undefined}
      className={buttonClassName({ variant: 'secondary', size: 'sm', className: selected ? 'border-accent bg-accent-soft' : '' })}
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
