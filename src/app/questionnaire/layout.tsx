'use client';
// Layout du parcours (R1, R5) : porte le fournisseur d'état, qui survit aux navigations entre
// étapes, et n'affiche les étapes qu'une fois la version courante chargée. Le HTML statique ne
// contient donc ni thème ni question.
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import { QuestionnaireProvider, useQuestionnaire } from '@/lib/questionnaire/store';
import { Button } from '@/ui/Button';
import { Notice } from '@/ui/Notice';

function LoadGate({ children }: { children: ReactNode }) {
  const t = useTranslations('questionnaire');
  const { load, retry } = useQuestionnaire();
  if (load.status === 'ready') return <>{children}</>;
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold tracking-tight">{t('title')}</h1>
      {load.status === 'loading' ? (
        <p role="status" className="text-fg-muted">
          {t('loading')}
        </p>
      ) : load.status === 'no-version' ? (
        <Notice tone="info">{t('noVersion')}</Notice>
      ) : (
        <div className="flex flex-col items-start gap-4">
          <Notice tone="warning" role="alert">
            {t('loadError')}
          </Notice>
          <Button onClick={retry}>{t('retry')}</Button>
        </div>
      )}
    </div>
  );
}

export default function QuestionnaireLayout({ children }: { children: ReactNode }) {
  return (
    <QuestionnaireProvider>
      <LoadGate>{children}</LoadGate>
    </QuestionnaireProvider>
  );
}
