'use client';
// Étape « mode » (FR-008 à FR-010, R8, R13) : nombre exact de questions par mode, retour aux
// sujets sans perte, confirmation avant d'écraser un questionnaire en cours.
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ROUTES } from '@/lib/questionnaire/guards';
import { firstUnanswered } from '@/lib/questionnaire/reducer';
import { useQuestionnaire } from '@/lib/questionnaire/store';
import { Button, buttonClassName } from '@/ui/Button';
import { ConfirmDialog } from '@/ui/ConfirmDialog';
import { ModeChoice } from '@/ui/ModeChoice';
import { useStepGuard } from '../use-guard';

export default function ModeStep() {
  const t = useTranslations('questionnaire');
  const router = useRouter();
  const { load, choice, draft, setMode, start, confirmStart, dispatch } = useQuestionnaire();
  const allowed = useStepGuard('mode');
  const [confirming, setConfirming] = useState(false);
  if (load.status !== 'ready' || !allowed || !load.selections) return null;
  const { selections } = load;

  const onContinue = () => {
    const result = start();
    if (result === 'needs-confirmation') return setConfirming(true);
    // Même triplet (R13) : reprise à la première question non traitée, même si l'historique du
    // navigateur a ramené le curseur en arrière.
    if (result === 'resumed' && draft) dispatch({ type: 'goTo', position: firstUnanswered(draft) });
    router.push(ROUTES.questions);
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold tracking-tight">{t('mode.title')}</h1>
      <ModeChoice
        options={[
          { mode: 'short', questionCount: selections.short.items.length },
          { mode: 'full', questionCount: selections.full.items.length },
        ]}
        value={choice.mode}
        onChange={setMode}
        legend={t('mode.legend')}
      />
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Link href={ROUTES.themes} className={buttonClassName({ variant: 'secondary' })}>
          {t('mode.back')}
        </Link>
        <Button disabled={!choice.mode} onClick={onContinue}>
          {t('mode.continue')}
        </Button>
      </div>
      <ConfirmDialog
        open={confirming}
        title={t('confirm.change.title')}
        description={t('confirm.change.description')}
        confirmLabel={t('confirm.change.confirm')}
        cancelLabel={t('confirm.cancel')}
        destructive
        onCancel={() => setConfirming(false)}
        onConfirm={() => {
          setConfirming(false);
          confirmStart();
          router.push(ROUTES.questions);
        }}
      />
    </div>
  );
}
