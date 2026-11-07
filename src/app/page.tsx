import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('home');
  return (
    <main id="contenu" className="mx-auto flex w-full max-w-content flex-col gap-6 px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">{t('title')}</h1>
      <p className="text-lg text-fg-muted">{t('lead')}</p>
      <p className="text-sm text-fg-muted">{t('privacy')}</p>
      <div className="flex flex-col items-start gap-2">
        <button
          type="button"
          aria-disabled="true"
          className="inline-flex min-h-touch items-center justify-center rounded-md bg-accent px-6 font-medium text-accent-fg opacity-60"
        >
          {t('cta')}
        </button>
        <p className="text-sm text-fg-muted">{t('ctaSoon')}</p>
      </div>
    </main>
  );
}
