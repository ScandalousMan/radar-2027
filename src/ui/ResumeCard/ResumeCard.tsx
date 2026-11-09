'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/ui/Button';
import { Card } from '@/ui/Card';
import { Notice } from '@/ui/Notice';

export type ResumeCardProps = {
  mode: 'full' | 'short';
  /** Questions traitées (répondues ou passées). */
  done: number;
  total: number;
  /** Date déjà formatée par le parent. */
  updatedAt: string;
  /** `complete` (005) : questionnaire terminé, l'action principale mène aux résultats. */
  status: 'resumable' | 'version-changed' | 'complete';
  /** Requis si `resumable`. */
  onResume?: () => void;
  /** Requis si `complete`. */
  onViewResults?: () => void;
  /** Avec `complete` : les données ont changé depuis (les résultats restent ceux de sa version). */
  versionChanged?: boolean;
  onRestart: () => void;
  onClear: () => void;
  className?: string;
};

/** Proposition de reprise d'un questionnaire en cours, ou accès aux résultats d'un questionnaire terminé (accueil). */
export function ResumeCard({ mode, done, total, updatedAt, status, onResume, onViewResults, versionChanged = false, onRestart, onClear, className }: ResumeCardProps) {
  const t = useTranslations('ui.resumeCard');
  const resumable = status === 'resumable';
  if (status === 'complete') {
    return (
      <Card header={<h2 className="text-lg font-semibold">{t('completeTitle')}</h2>} className={className}>
        <div className="flex flex-col gap-4">
          <p>{t('completeSummary', { mode, total, date: updatedAt })}</p>
          {versionChanged ? <Notice tone="warning">{t('versionChanged')}</Notice> : null}
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            {onViewResults ? <Button onClick={onViewResults}>{t('viewResults')}</Button> : null}
            <Button variant="secondary" onClick={onRestart}>
              {t('restart')}
            </Button>
            <Button variant="ghost" onClick={onClear}>
              {t('clear')}
            </Button>
          </div>
        </div>
      </Card>
    );
  }
  return (
    <Card header={<h2 className="text-lg font-semibold">{t('title')}</h2>} className={className}>
      <div className="flex flex-col gap-4">
        <p>{t('summary', { mode, done, total, date: updatedAt })}</p>
        {resumable ? null : <Notice tone="warning">{t('versionChanged')}</Notice>}
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          {resumable && onResume ? <Button onClick={onResume}>{t('resume')}</Button> : null}
          <Button variant="secondary" onClick={onRestart}>
            {t('restart')}
          </Button>
          <Button variant="ghost" onClick={onClear}>
            {t('clear')}
          </Button>
        </div>
      </div>
    </Card>
  );
}
