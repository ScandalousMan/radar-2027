'use client';
// Étape « sujets clés » (FR-003 à FR-007, US1 sc. 2 à 4).
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { MAX_PRIORITIES, MIN_PRIORITIES } from '@/core';
import { isChoiceValid, ROUTES } from '@/lib/questionnaire/guards';
import { useQuestionnaire } from '@/lib/questionnaire/store';
import { Button } from '@/ui/Button';
import { ThemePicker } from '@/ui/ThemePicker';

export default function ThemesStep() {
  const t = useTranslations('questionnaire.themes');
  const router = useRouter();
  const { load, choice, setPriorities } = useQuestionnaire();
  if (load.status !== 'ready') return null;
  const valid = isChoiceValid(choice);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">{t('title')}</h1>
        <p className="text-fg-muted">{t('explain')}</p>
      </header>
      <ThemePicker
        options={load.bank.themes.map((theme) => ({ id: theme.id, label: theme.label, description: theme.description }))}
        value={[...choice.priorities]}
        onChange={(next) => setPriorities(next)}
        min={MIN_PRIORITIES}
        max={MAX_PRIORITIES}
        legend={t('legend')}
      />
      <div>
        <Button disabled={!valid} onClick={() => router.push(ROUTES.mode)}>
          {t('continue')}
        </Button>
      </div>
    </div>
  );
}
