'use client';
// Étape « fin » (FR-027 à FR-030, R9, R10) : réponses par sujet clé, avertissement de fiabilité
// sans blocage, lien vers les résultats portant l'état complet dans le fragment. Le brouillon
// reste sur l'appareil (FR-026).
import { useFormatter, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { MIN_THEME_QUESTIONS } from '@/core';
import { ROUTES } from '@/lib/questionnaire/guards';
import { useQuestionnaire } from '@/lib/questionnaire/store';
import { summarize } from '@/lib/questionnaire/summary';
import { AnswerSummary } from '@/ui/AnswerSummary';
import { Button } from '@/ui/Button';
import { Notice } from '@/ui/Notice';
import { useStepGuard } from '../use-guard';

export default function EndStep() {
  const t = useTranslations('questionnaire.end');
  const format = useFormatter();
  const router = useRouter();
  const { load, draft, selection, dispatch, resultHref } = useQuestionnaire();
  const allowed = useStepGuard('end');
  if (load.status !== 'ready' || !allowed || !draft || !selection) return null;

  // Recalculé à chaque rendu : revenir sur cet écran après une correction donne un résumé à jour.
  const summary = summarize(draft, load.bank, selection);
  const unreliable = summary.themes.filter((theme) => !theme.reliable).map((theme) => theme.label);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">{t('title')}</h1>
        <p className="text-fg-muted">{t('intro')}</p>
      </header>
      {summary.warning ? (
        <Notice tone="warning" role="alert" title={t('warning.title')}>
          {t('warning.description', { min: MIN_THEME_QUESTIONS, themes: format.list(unreliable, { type: 'conjunction' }) })}
        </Notice>
      ) : null}
      <AnswerSummary
        items={summary.themes.map((theme) => ({ id: theme.themeId, label: theme.label, answered: theme.answered, skipped: theme.skipped, unanswered: theme.unanswered, reliable: theme.reliable }))}
        minReliable={MIN_THEME_QUESTIONS}
      />
      <p>{t('totals', { answered: summary.totalAnswered, skipped: summary.totalSkipped })}</p>
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button
          variant="secondary"
          onClick={() => {
            dispatch({ type: 'goTo', position: draft.answers.length - 1 });
            router.push(ROUTES.questions);
          }}
        >
          {t('back')}
        </Button>
        {resultHref ? <Button href={resultHref}>{t('results')}</Button> : null}
      </div>
    </div>
  );
}
