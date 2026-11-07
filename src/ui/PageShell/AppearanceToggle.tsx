'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import {
  applyAppearance,
  oppositeAppearance,
  readAppliedAppearance,
  writeStoredAppearance,
  type Appearance,
} from '@/lib/appearance';

function SunIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" />
    </svg>
  );
}

/**
 * Bascule d'apparence clair / sombre. L'état initial est lu sur <html> (posé par le script
 * d'initialisation) après le montage, pour ne jamais diverger du rendu serveur.
 */
export function AppearanceToggle({ className = '' }: { className?: string }) {
  const t = useTranslations('common.appearance');
  const [appearance, setAppearance] = useState<Appearance | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- synchronisation avec l'attribut posé avant l'hydratation
    setAppearance(readAppliedAppearance());
  }, []);

  const isDark = appearance === 'dark';
  const current = appearance ?? 'light';

  return (
    <button
      type="button"
      aria-pressed={isDark}
      title={t(current)}
      className={[
        'inline-flex size-touch items-center justify-center rounded-md border border-border bg-surface text-fg transition-colors hover:bg-bg',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={() => {
        const next = oppositeAppearance(readAppliedAppearance());
        applyAppearance(next);
        writeStoredAppearance(next);
        setAppearance(next);
      }}
    >
      {isDark ? <MoonIcon /> : <SunIcon />}
      <span className="sr-only">{t('toggle')}</span>
    </button>
  );
}
