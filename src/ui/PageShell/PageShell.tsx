import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import { AppearanceToggle } from './AppearanceToggle';

export type PageShellProps = {
  /** Contenu principal, rendu dans `<main id="contenu">`. */
  children: ReactNode;
  className?: string;
};

export const MAIN_CONTENT_ID = 'contenu';

/**
 * Gabarit de page : lien « aller au contenu » en premier élément focalisable, en-tête (nom du
 * site, bascule d'apparence), contenu principal, pied (méthodologie, à propos).
 */
export function PageShell({ children, className = '' }: PageShellProps) {
  const t = useTranslations('common');
  return (
    <div className={['flex min-h-dvh flex-col', className].filter(Boolean).join(' ')}>
      <a
        href={`#${MAIN_CONTENT_ID}`}
        className="sr-only z-10 rounded-md bg-accent px-4 py-2 font-medium text-accent-fg focus:not-sr-only focus:absolute focus:top-2 focus:left-2"
      >
        {t('skipToContent')}
      </a>
      <header className="border-b border-border">
        <div className="mx-auto flex w-full max-w-content items-center justify-between gap-4 px-4 py-3">
          <Link href="/" className="rounded-sm text-lg font-semibold tracking-tight">
            {t('siteName')}
          </Link>
          <AppearanceToggle />
        </div>
      </header>
      <main id={MAIN_CONTENT_ID} tabIndex={-1} className="mx-auto w-full max-w-content flex-1 px-4 py-10 outline-none">
        {children}
      </main>
      <footer className="border-t border-border">
        <nav aria-label={t('siteName')} className="mx-auto flex w-full max-w-content flex-wrap gap-x-6 gap-y-2 px-4 py-4 text-sm text-fg-muted">
          <Link href="/methodologie" className="rounded-sm underline-offset-4 hover:underline">
            {t('footer.methodology')}
          </Link>
          <Link href="/a-propos" className="rounded-sm underline-offset-4 hover:underline">
            {t('footer.about')}
          </Link>
        </nav>
      </footer>
    </div>
  );
}
