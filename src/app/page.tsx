import { useTranslations } from 'next-intl';
import { Button } from '@/ui/Button';

export default function HomePage() {
  const t = useTranslations('home');
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold tracking-tight">{t('title')}</h1>
      <p className="text-lg text-fg-muted">{t('lead')}</p>
      <p className="text-sm text-fg-muted">{t('privacy')}</p>
      <div className="flex flex-col items-start gap-2">
        {/* Désactivé tant que la page du questionnaire (spec 004) n'existe pas. */}
        <Button disabled>{t('cta')}</Button>
        <p className="text-sm text-fg-muted">{t('ctaSoon')}</p>
      </div>
    </div>
  );
}
