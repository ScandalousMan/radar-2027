import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { loadRegistry } from '@/lib/dataset';
import { Button, buttonClassName } from '@/ui/Button';
import { ResumePrompt } from './ResumePrompt';

export default function HomePage() {
  const t = useTranslations('home');
  // Lecture au build : le questionnaire n'est proposé qu'une fois une version publiée (R5).
  const published = loadRegistry().current > 0;
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold tracking-tight">{t('title')}</h1>
      <p className="text-lg text-fg-muted">{t('lead')}</p>
      <p className="text-sm text-fg-muted">{t('privacy')}</p>
      <ResumePrompt />
      <div className="flex flex-col items-start gap-2">
        {published ? (
          <Link href="/questionnaire" className={buttonClassName({})}>
            {t('cta')}
          </Link>
        ) : (
          <>
            <Button disabled>{t('cta')}</Button>
            <p className="text-sm text-fg-muted">{t('ctaSoon')}</p>
          </>
        )}
      </div>
      <p>
        <Link href="/methodologie" className="rounded-sm text-accent underline underline-offset-4">
          {t('methodology')}
        </Link>
      </p>
    </div>
  );
}
