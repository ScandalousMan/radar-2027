'use client';

import { useTranslations } from 'next-intl';
import type { Ref } from 'react';

export type ResultsHeaderProps = {
  /** Libellés des sujets clés, en ordre canonique. */
  priorities: readonly string[];
  mode: 'full' | 'short';
  answered: number;
  total: number;
  methodologyHref: string;
  /** Titre focalisable au changement de vue (R12). */
  headingRef?: Ref<HTMLHeadingElement>;
  className?: string;
};

function KeyIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5 shrink-0" fill="currentColor">
      <path d="M8 1.5l1.9 4 4.4.5-3.3 3 .9 4.3L8 11.1l-3.9 2.2.9-4.3-3.3-3 4.4-.5z" />
    </svg>
  );
}

/** En-tête des résultats (FR-001, FR-005, FR-041) : sujets clés, mode, réponses, plafonnement, Méthodologie. */
export function ResultsHeader({ priorities, mode, answered, total, methodologyHref, headingRef, className = '' }: ResultsHeaderProps) {
  const t = useTranslations('results');
  const tHeader = useTranslations('ui.resultsHeader');
  return (
    <header className={['flex flex-col gap-3', className].filter(Boolean).join(' ')}>
      <h1 ref={headingRef} tabIndex={-1} className="rounded-sm text-3xl font-semibold tracking-tight outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus">
        {t('title')}
      </h1>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-fg-muted">{tHeader('priorities')}</p>
        <ul aria-label={tHeader('priorities')} className="flex flex-wrap gap-2">
          {priorities.map((label) => (
            <li key={label} className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-accent bg-accent-soft px-3 py-1 text-sm font-medium break-words">
              <KeyIcon />
              <span>{label}</span>
            </li>
          ))}
        </ul>
      </div>
      <p className="text-sm text-fg-muted">{t('header.mode', { mode, answered, total })}</p>
      <p className="text-base">
        {t('header.cap')}{' '}
        <a href={methodologyHref} className="rounded-sm text-accent underline underline-offset-4">
          {t('header.methodology')}
        </a>
      </p>
    </header>
  );
}
