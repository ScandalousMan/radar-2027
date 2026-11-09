'use client';
// Proposition de reprise à l'accueil (FR-021, FR-023, FR-024, FR-026, US3) : lue après montage,
// jamais présente dans le HTML statique. 005 (FR-035a, R8, data-and-share § 5) : un brouillon
// complet propose « Voir mes résultats », lien recalculé avec la banque de sa version (le même que
// l'écran de fin) ; si cette version ne peut pas être chargée, la carte redevient « Reprendre ».
import { useFormatter, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { VersionRegistry } from '@/core';
import { loadMain, loadRegistry } from '@/lib/dataset-client';
import { questionnaireBankFrom } from '@/lib/questionnaire/bank-view';
import { ROUTES } from '@/lib/questionnaire/guards';
import { resumeInfoFrom } from '@/lib/questionnaire/resume-info';
import { clearDraft } from '@/lib/questionnaire/storage';
import { resultHref } from '@/lib/questionnaire/summary';
import type { Draft } from '@/lib/questionnaire/types';
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
  // Lien de résultats d'un brouillon complet : `null` = pas encore calculé, `false` = impossible.
  const [results, setResults] = useState<{ draft: Draft; href: string | false } | null>(null);
  const hasDraft = draft !== null;
  const complete = draft !== null && !draft.answers.includes('unanswered');

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

  useEffect(() => {
    if (!draft || !complete || registry === 'loading' || registry === null) return;
    let cancelled = false;
    loadMain(draft.bankVersion, fetcher)
      .then((main) => resultHref(draft, questionnaireBankFrom(main)))
      .then(
        (href) => !cancelled && setResults({ draft, href }),
        () => !cancelled && setResults({ draft, href: false }),
      );
    return () => {
      cancelled = true;
    };
  }, [draft, complete, registry, fetcher]);

  if (!draft || registry === 'loading') return null;
  const info = resumeInfoFrom(draft, registry);
  if (info.status === 'unavailable') return null;
  const href = results?.draft === draft ? results.href : null;
  if (info.status === 'complete' && href === null) return null;
  // Brouillon complet dont la version n'a pas pu être chargée : carte de reprise vers l'écran de fin.
  const status = info.status === 'complete' && href === false ? (info.versionChanged ? 'version-changed' : 'resumable') : info.status;
  const viewResults = () => {
    if (typeof href !== 'string') return;
    // Déjà sur /resultats (sans fragment) : navigation de fragment, que la page écoute (hashchange).
    if (window.location.pathname === '/resultats') window.location.assign(href);
    else router.push(href);
  };

  return (
    <>
      <ResumeCard
        mode={info.mode}
        done={info.done}
        total={info.total}
        updatedAt={format.dateTime(new Date(info.updatedAt), { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
        status={status}
        versionChanged={info.versionChanged}
        onViewResults={viewResults}
        onResume={() => router.push(info.status === 'complete' ? ROUTES.end : ROUTES.questions)}
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
