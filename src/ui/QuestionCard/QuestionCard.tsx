'use client';

import { useTranslations } from 'next-intl';
import { useId, type Ref } from 'react';
import { LikertChoice, type LikertAnswer } from '@/ui/LikertChoice';

export type QuestionCardTheme = { id: string; label: string; priority: boolean };

export type QuestionCardProps = {
  /** Position 0-based dans le questionnaire. */
  position: number;
  total: number;
  /** Énoncé tel que publié. */
  statement: string;
  /** 1 ou 2 thèmes ; `priority` distingue le sujet clé (texte et style, jamais la couleur seule). */
  themes: readonly QuestionCardTheme[];
  value: LikertAnswer;
  onChange: (next: LikertAnswer) => void;
  onCommit: (answer: Exclude<LikertAnswer, null>) => void;
  disabled?: boolean;
  /** Référence posée sur l'énoncé pour le focus au changement de question. */
  headingRef?: Ref<HTMLHeadingElement>;
  /** Aide affichée une seule fois (première question). */
  hint?: string;
  className?: string;
};

function KeyIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5 shrink-0" fill="currentColor">
      <path d="M8 1.5l1.9 4 4.4.5-3.3 3 .9 4.3L8 11.1l-3.9 2.2.9-4.3-3.3-3 4.4-.5z" />
    </svg>
  );
}

/** Une question : énoncé focalisable, thèmes en lecture seule, échelle de réponse. */
export function QuestionCard({ position, statement, themes, value, onChange, onCommit, disabled = false, headingRef, hint, className = '' }: QuestionCardProps) {
  const t = useTranslations('ui.questionCard');
  const statementId = useId();
  return (
    <article className={['flex flex-col gap-5', className].filter(Boolean).join(' ')}>
      <div className="flex flex-col gap-3">
        <ul aria-label={t('themes')} className="flex flex-wrap gap-2">
          {themes.map((theme) => (
            <li
              key={theme.id}
              className={[
                'inline-flex max-w-full items-center gap-1.5 rounded-full border px-3 py-1 text-sm break-words',
                theme.priority ? 'border-accent bg-accent-soft font-medium text-fg' : 'border-border text-fg-muted',
              ].join(' ')}
            >
              {theme.priority ? (
                <>
                  <KeyIcon />
                  <span className="sr-only">{t('priorityTheme', { label: theme.label })}</span>
                  <span aria-hidden="true">
                    {theme.label} · {t('priorityMark')}
                  </span>
                </>
              ) : (
                <span>{theme.label}</span>
              )}
            </li>
          ))}
        </ul>
        <h2 id={statementId} ref={headingRef} tabIndex={-1} className="rounded-sm text-2xl font-semibold tracking-tight break-words outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus">
          {statement}
        </h2>
        {hint ? <p className="text-sm text-fg-muted">{hint}</p> : null}
      </div>
      <LikertChoice name={`question-${position}`} value={value} onChange={onChange} onCommit={onCommit} legend={t('answerLegend')} labelledBy={statementId} disabled={disabled} />
    </article>
  );
}
