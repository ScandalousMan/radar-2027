import { render, type RenderOptions } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import type { ReactElement, ReactNode } from 'react';
import { defaultLocale, messages } from '@/i18n/config';

export function IntlWrapper({ children }: { children: ReactNode }) {
  return (
    <NextIntlClientProvider locale={defaultLocale} messages={messages[defaultLocale]} timeZone="Europe/Paris">
      {children}
    </NextIntlClientProvider>
  );
}

/** Rend un composant dans le fournisseur next-intl `fr`, comme en production et dans Storybook. */
export function renderWithIntl(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, { wrapper: IntlWrapper, ...options });
}

export const fr = messages[defaultLocale];
