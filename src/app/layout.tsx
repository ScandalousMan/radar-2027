import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';
import { appearanceInitScript } from '@/lib/appearance';
import './globals.css';

export async function generateMetadata(): Promise<Metadata> {
  const common = await getTranslations('common');
  const home = await getTranslations('home');
  return {
    title: { default: common('siteName'), template: `%s · ${common('siteName')}` },
    description: home('description'),
    icons: { icon: '/favicon.svg' },
  };
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Apparence initiale posée avant le premier rendu : aucun clignotement (FR-010). */}
        <script dangerouslySetInnerHTML={{ __html: appearanceInitScript }} />
      </head>
      <body>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
