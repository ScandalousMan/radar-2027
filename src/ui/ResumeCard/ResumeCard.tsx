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
  status: 'resumable' | 'version-changed';
  /** Requis si `resumable`. */
  onResume?: () => void;
  onRestart: () => void;
  onClear: () => void;
  className?: string;
};

/** Proposition de reprise d'un questionnaire en cours (accueil). */
export function ResumeCard({ mode, done, total, updatedAt, status, onResume, onRestart, onClear, className }: ResumeCardProps) {
  const t = useTranslations('ui.resumeCard');
  const resumable = status === 'resumable';
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
