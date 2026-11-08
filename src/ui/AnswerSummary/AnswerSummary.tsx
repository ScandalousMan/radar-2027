import { useTranslations } from 'next-intl';

export type AnswerSummaryItem = { id: string; label: string; answered: number; skipped: number; unanswered: number; reliable: boolean };

export type AnswerSummaryProps = {
  /** Sujets clés en ordre canonique. */
  items: readonly AnswerSummaryItem[];
  /** Seuil de fiabilité, passé par le parent (constante du cœur). */
  minReliable: number;
  className?: string;
};

/** Réponses par sujet clé sur l'écran de fin, avec marque « peu fiable ». */
export function AnswerSummary({ items, minReliable, className = '' }: AnswerSummaryProps) {
  const t = useTranslations('ui.answerSummary');
  return (
    <ul className={['flex flex-col divide-y divide-border rounded-lg border border-border bg-surface', className].filter(Boolean).join(' ')}>
      {items.map((item) => (
        <li key={item.id} className="flex flex-col gap-1 px-4 py-3">
          <span className="font-medium break-words">{item.label}</span>
          <span className="text-sm text-fg-muted">{t('counts', { answered: item.answered, skipped: item.skipped, unanswered: item.unanswered })}</span>
          {item.reliable ? null : (
            <span className="flex items-start gap-1.5 text-sm text-danger">
              <svg aria-hidden="true" viewBox="0 0 20 20" className="mt-0.5 size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 2.5l8 14.5H2z" />
                <path d="M10 8v4" />
                <path d="M10 14.5v.01" />
              </svg>
              <span>{t('unreliable', { min: minReliable })}</span>
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
