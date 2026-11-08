import { useFormatter, useTranslations } from 'next-intl';
import type { DateWithPrecision, EvidenceLevel, ScaleValue } from '@/core/dataset';
import { formatPublishedAt, parseDay, type DateParts } from '@/lib/published-date';
import { Button } from '../Button';
import { Card } from '../Card';
import { EvidenceBadge } from '../EvidenceBadge';

export type PositionCardSource = { url: string; title: string; publishedAt: DateWithPrecision; accessedAt: string };

export type PositionCardProps = {
  /** Énoncé de la question. */
  question: string;
  value: ScaleValue;
  level: EvidenceLevel;
  quote: string;
  justification: string;
  /** Position fondée uniquement sur des sources antérieures à 2022 (FR-015). */
  old?: boolean;
  sources: PositionCardSource[];
  /** Lien de signalement prérempli ; absent : pas de lien. */
  reportHref?: string;
  className?: string;
};

const VALUE_KEYS = { [-2]: 'minus2', [-1]: 'minus1', 0: 'zero', 1: 'plus1', 2: 'plus2' } as const;
const SCALE: ScaleValue[] = [-2, -1, 0, 1, 2];

/** Position d'un candidat : valeur sur l'échelle, niveau de preuve, citation, justification, sources datées. */
export function PositionCard({ question, value, level, quote, justification, old = false, sources, reportHref, className }: PositionCardProps) {
  const t = useTranslations('ui.positionCard');
  const format = useFormatter();
  const dateFormat = (date: Date, options: DateParts) => format.dateTime(date, options);
  const label = (v: ScaleValue) => t(`value.${VALUE_KEYS[v]}`);

  return (
    <Card header={question} className={className}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <ol aria-label={t('scaleLabel')} className="grid grid-cols-5 gap-1">
            {SCALE.map((v) => (
              <li key={v} aria-current={v === value ? 'true' : undefined}>
                <span aria-hidden="true" className={['block h-2 rounded-full', v === value ? 'bg-accent' : 'bg-border'].join(' ')} />
                <span className="sr-only">{label(v)}</span>
              </li>
            ))}
          </ol>
          <p className="font-medium" aria-hidden="true">
            {label(value)}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <EvidenceBadge level={level} />
            {old ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-1 text-xs text-fg-muted">
                <svg aria-hidden="true" data-icon="clock" viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
                  <circle cx="8" cy="8" r="6.25" />
                  <path d="M8 4.5V8l2.5 1.5" />
                </svg>
                {t('old')}
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-sm text-fg-muted">{t('quoteLabel')}</p>
          <blockquote className="border-l-2 border-accent pl-3 italic">{quote}</blockquote>
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-sm text-fg-muted">{t('justificationLabel')}</p>
          <p>{justification}</p>
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-sm text-fg-muted">{t('sources')}</p>
          <ul className="flex flex-col gap-2">
            {sources.map((s) => (
              <li key={s.url} className="flex flex-col">
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="break-words text-accent underline underline-offset-4">
                  {s.title}
                  <span className="sr-only"> {t('newTab')}</span>
                </a>
                <span className="text-sm text-fg-muted">
                  {t(`publishedOn.${s.publishedAt.precision}`, { date: formatPublishedAt(s.publishedAt, dateFormat) })}
                  {' · '}
                  {t('accessedOn', { date: dateFormat(parseDay(s.accessedAt), { day: 'numeric', month: 'long', year: 'numeric' }) })}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {reportHref ? (
          <div>
            <Button variant="ghost" size="sm" href={reportHref} target="_blank" rel="noopener noreferrer">
              {t('report')}
            </Button>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
