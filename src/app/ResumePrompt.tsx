'use client';
// Proposition de reprise à l'accueil (FR-021, FR-023, FR-024, FR-026, US3) : lue après montage,
// jamais présente dans le HTML statique.
import { useFormatter, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { VersionRegistry } from '@/core';
import { loadRegistry } from '@/lib/dataset-client';
import { ROUTES } from '@/lib/questionnaire/guards';
import { resumeInfoFrom } from '@/lib/questionnaire/resume-info';
import { clearDraft } from '@/lib/questionnaire/storage';
import { useStoredDraft } from '@/lib/questionnaire/use-stored-draft';
import { ConfirmDialog } from '@/ui/ConfirmDialog';
import { ResumeCard } from '@/ui/ResumeCard';

type Pending = 'restart' | 'clear' | null;

export function ResumePrompt({ fetcher }: { fetcher?: typeof fetch }) {
  const t = useTranslations('questionnaire.confirm');
  const format = useFormatter();
  const router = useRouter();
  const draft = useStoredDraft();
  const [registry, setRegistry] = useState<VersionRegistry | null | 'loading'>('loading');
  const [pending, setPending] = useState<Pending>(null);
  const hasDraft = draft !== null;

  useEffect(() => {
    if (!hasDraft) return;
    let cancelled = false;
    loadRegistry(fetcher).then(
      (r) => !cancelled && setRegistry(r),
      () => !cancelled && setRegistry(null),
    );
    return () => {
      cancelled = true;
    };
  }, [hasDraft, fetcher]);

  if (!draft || registry === 'loading') return null;
  const info = resumeInfoFrom(draft, registry);
  if (info.status === 'unavailable') return null;

  return (
    <>
      <ResumeCard
        mode={info.mode}
        done={info.done}
        total={info.total}
        updatedAt={format.dateTime(new Date(info.updatedAt), { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
        status={info.status}
        onResume={() => router.push(ROUTES.questions)}
        onRestart={() => setPending('restart')}
        onClear={() => setPending('clear')}
      />
      <ConfirmDialog
        open={pending !== null}
        title={pending === 'clear' ? t('clear.title') : t('restart.title')}
        description={pending === 'clear' ? t('clear.description') : t('restart.description')}
        confirmLabel={pending === 'clear' ? t('clear.confirm') : t('restart.confirm')}
        cancelLabel={t('cancel')}
        destructive
        onCancel={() => setPending(null)}
        onConfirm={() => {
          const action = pending;
          setPending(null);
          clearDraft();
          if (action === 'restart') router.push(ROUTES.themes);
        }}
      />
    </>
  );
}
