'use client';
// Étape « questions » (FR-011 à FR-019, FR-025, R2, R7, R13) : une question à la fois,
// avancement automatique sur activation explicite, Précédent / Suivant, historique du
// navigateur, changement de sujets ou de mode après confirmation.
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { themesOf } from '@/lib/questionnaire/bank-view';
import { isChoiceValid, ROUTES } from '@/lib/questionnaire/guards';
import { useQuestionHistory } from '@/lib/questionnaire/history';
import { isCompleted } from '@/lib/questionnaire/reducer';
import { useQuestionnaire } from '@/lib/questionnaire/store';
import type { Draft, GivenAnswer } from '@/lib/questionnaire/types';
import { Button } from '@/ui/Button';
import { ConfirmDialog } from '@/ui/ConfirmDialog';
import type { LikertAnswer } from '@/ui/LikertChoice';
import { Notice } from '@/ui/Notice';
import { ProgressBar } from '@/ui/ProgressBar';
import { QuestionCard } from '@/ui/QuestionCard';
import { useStepGuard } from '../use-guard';

export default function QuestionsStep() {
  const { load, draft, choice, start } = useQuestionnaire();
  const allowed = useStepGuard('questions');

  // Choix complet sans brouillon à l'arrivée sur l'étape : démarrage implicite, une seule fois
  // (jamais après un `reset` demandé depuis cette page, qui la quitte aussitôt).
  const attempted = useRef(false);
  useEffect(() => {
    if (attempted.current || load.status !== 'ready') return;
    attempted.current = true;
    if (!draft && allowed && isChoiceValid(choice) && choice.mode) start();
  }, [load.status, draft, allowed, choice, start]);

  if (load.status !== 'ready' || !draft) return null;
  return <Questions draft={draft} />;
}

type ChangeTarget = 'themes' | 'mode';

function Questions({ draft }: { draft: Draft }) {
  const t = useTranslations('questionnaire');
  const router = useRouter();
  const { load, selection, storage, dispatch } = useQuestionnaire();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [change, setChange] = useState<ChangeTarget | null>(null);
  const { position } = draft;
  const total = draft.answers.length;

  useQuestionHistory(
    position,
    useCallback((p: number) => dispatch({ type: 'goTo', position: p }), [dispatch]),
  );

  // Focus sur l'énoncé à chaque changement de question (FR-032).
  useEffect(() => {
    headingRef.current?.focus();
  }, [position]);

  if (load.status !== 'ready' || !selection) return null;
  const item = selection.items[position];
  if (!item) return null;
  const answer = draft.answers[position]!;
  const value: LikertAnswer = answer === 'unanswered' ? null : answer;
  const last = isCompleted(draft);
  const progress = t('questions.progress', { n: position + 1, total });

  const advance = () => {
    if (last) router.push(ROUTES.end);
    else dispatch({ type: 'next' });
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="sr-only">{t('title')}</h1>
      {storage === 'unavailable' ? <Notice tone="info">{t('questions.storageUnavailable')}</Notice> : null}
      <ProgressBar value={position + 1} total={total} label={progress} />
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {progress}
      </p>
      <QuestionCard
        key={position}
        position={position}
        total={total}
        statement={item.question.text}
        themes={themesOf(load.bank, item.question, draft.priorities)}
        value={value}
        headingRef={headingRef}
        hint={position === 0 ? t('questions.hint') : undefined}
        onChange={(next) => {
          if (next !== null) dispatch({ type: 'answer', position, answer: next as GivenAnswer });
        }}
        onCommit={(next) => {
          dispatch({ type: 'answer', position, answer: next as GivenAnswer });
          advance();
        }}
      />
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button variant="secondary" disabled={position === 0} onClick={() => dispatch({ type: 'previous' })}>
          {t('questions.previous')}
        </Button>
        <Button disabled={answer === 'unanswered'} onClick={advance}>
          {last ? t('questions.finish') : t('questions.next')}
        </Button>
      </div>
      <div className="flex flex-col gap-2 border-t border-border pt-4 sm:flex-row sm:flex-wrap">
        <Button variant="ghost" size="sm" onClick={() => setChange('themes')}>
          {t('questions.changeThemes')}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setChange('mode')}>
          {t('questions.changeMode')}
        </Button>
      </div>
      <ConfirmDialog
        open={change !== null}
        title={t('confirm.change.title')}
        description={t('confirm.change.description')}
        confirmLabel={t('confirm.change.confirm')}
        cancelLabel={t('confirm.cancel')}
        destructive
        onCancel={() => setChange(null)}
        onConfirm={() => {
          const target = change === 'mode' ? ROUTES.mode : ROUTES.themes;
          setChange(null);
          dispatch({ type: 'reset' });
          router.push(target);
        }}
      />
    </div>
  );
}
