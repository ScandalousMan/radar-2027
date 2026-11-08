// Page de garde des résultats (R11, validée le 2026-11-08) : temporaire, remplacée par la 005.
// Ne lit pas le fragment ; le lien reçu est déjà au format définitif `#1.…`.
import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { buttonClassName } from '@/ui/Button';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('results');
  return { title: t('title') };
}

export default async function ResultsPlaceholder() {
  const t = await getTranslations('results');
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold tracking-tight">{t('title')}</h1>
      <p className="text-lg text-fg-muted">{t('soon')}</p>
      <div>
        <Link href="/questionnaire" className={buttonClassName({ variant: 'secondary' })}>
          {t('backToQuestionnaire')}
        </Link>
      </div>
    </div>
  );
}
