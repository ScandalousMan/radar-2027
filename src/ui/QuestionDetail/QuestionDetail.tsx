'use client';

import { useTranslations } from 'next-intl';
import { EvidenceBadge, type EvidenceLevel } from '../EvidenceBadge';

export type ScaleValue = -2 | -1 | 0 | 1 | 2;

/** Palier d'accord (liste fermée FR-015), redéclaré pour ne pas dépendre du cœur. */
export type AgreementLevel = 'identical' | 'close' | 'intermediate' | 'distant' | 'opposite';

export type QuestionDetailSource = { title: string; /** Date déjà formatée selon sa précision. */ date: string; url: string };

export type QuestionDetailProps = {
  text: string;
  themes: readonly string[];
  answer: ScaleValue | 'skipped';
  position: ScaleValue | null;
  agreement: AgreementLevel | null;
  evidence: EvidenceLevel | null;
  /** Citation du fichier de détail ; `null` : absente. */
  quote?: string | null;
  source?: QuestionDetailSource | null;
  /** État du fichier de détail (citations et sources), chargé à l'ouverture de la fiche. */
  detailState: 'loading' | 'ready' | 'error';
  className?: string;
};

const ANSWER_KEYS = { [-2]: 'stronglyDisagree', [-1]: 'disagree', 0: 'neutral', 1: 'agree', 2: 'stronglyAgree' } as const;
const POSITION_KEYS = { [-2]: 'minus2', [-1]: 'minus1', 0: 'zero', 1: 'plus1', 2: 'plus2' } as const;

/** Une question de la fiche (FR-015 à FR-017) : réponse, position, palier d'accord, preuve, citation, source. */
export function QuestionDetail({ text, themes, answer, position, agreement, evidence, quote = null, source = null, detailState, className = '' }: QuestionDetailProps) {
  const t = useTranslations('ui.questionDetail');
  const tLikert = useTranslations('ui.likert');
  const tPosition = useTranslations('ui.positionCard.value');
  const tAgreement = useTranslations('results.agreement');
  const known = position !== null;
  return (
    <article className={['flex flex-col gap-3 rounded-md border border-border bg-surface p-4', className].filter(Boolean).join(' ')}>
      <div className="flex flex-col gap-1">
        <p className="text-xs text-fg-muted">{themes.join(' · ')}</p>
        <h4 className="font-medium break-words">{text}</h4>
      </div>
      <dl className="grid grid-cols-1 gap-x-4 gap-y-1 text-sm sm:grid-cols-[auto_1fr]">
        <dt className="text-fg-muted">{t('yourAnswer')}</dt>
        <dd>{answer === 'skipped' ? t('skipped') : tLikert(ANSWER_KEYS[answer])}</dd>
        <dt className="text-fg-muted">{t('position')}</dt>
        <dd>{known ? tPosition(POSITION_KEYS[position]) : t('unknown')}</dd>
        {agreement && answer !== 'skipped' ? (
          <>
            <dt className="text-fg-muted">{t('agreement')}</dt>
            <dd className="font-medium">{tAgreement(agreement)}</dd>
          </>
        ) : null}
      </dl>
      {!known ? <p className="text-sm text-fg-muted">{t('unknownNote')}</p> : null}
      {known && evidence ? (
        <div className="flex flex-col gap-2">
          <div>
            <EvidenceBadge level={evidence} />
          </div>
          {detailState === 'loading' ? (
            <p className="text-sm text-fg-muted">{t('loading')}</p>
          ) : detailState === 'error' ? (
            <p className="text-sm text-fg-muted">{t('error')}</p>
          ) : (
            <>
              {quote ? (
                <figure className="flex flex-col gap-1">
                  <figcaption className="sr-only">{t('quoteLabel')}</figcaption>
                  <blockquote className="border-l-4 border-border pl-3 text-sm break-words italic">{quote}</blockquote>
                </figure>
              ) : (
                <p className="text-sm text-fg-muted">{t('quoteMissing')}</p>
              )}
              {source ? (
                <p className="text-sm break-words">
                  <span className="text-fg-muted">{t('source')}</span>
                  {'\u00a0: '}
                  <a href={source.url} target="_blank" rel="noopener noreferrer" className="rounded-sm text-accent underline underline-offset-4">
                    {source.title}
                    <span className="sr-only"> {t('newTab')}</span>
                  </a>
                  {' · '}
                  {source.date}
                </p>
              ) : null}
            </>
          )}
        </div>
      ) : null}
    </article>
  );
}
