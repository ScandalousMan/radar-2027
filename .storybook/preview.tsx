import type { Preview } from '@storybook/nextjs-vite';
import { withThemeByDataAttribute } from '@storybook/addon-themes';
import { NextIntlClientProvider } from 'next-intl';
import { defaultLocale, messages } from '../src/i18n/config';
import '../src/app/globals.css';

const preview: Preview = {
  decorators: [
    // Bascule clair / sombre de la barre d'outils : pose `data-theme` sur <html> (FR-014).
    withThemeByDataAttribute({
      themes: { clair: 'light', sombre: 'dark' },
      defaultTheme: 'clair',
      attributeName: 'data-theme',
    }),
    (Story) => (
      <NextIntlClientProvider locale={defaultLocale} messages={messages[defaultLocale]} timeZone="Europe/Paris">
        <Story />
      </NextIntlClientProvider>
    ),
  ],
  parameters: {
    nextjs: { appDirectory: true },
    layout: 'padded',
    controls: { expanded: true },
    viewport: {
      options: {
        mobile320: { name: 'Mobile 320 px', styles: { width: '320px', height: '640px' }, type: 'mobile' },
        mobile375: { name: 'Mobile 375 px', styles: { width: '375px', height: '812px' }, type: 'mobile' },
      },
    },
    // Accessibilité bloquante : les violations font échouer les stories exécutées comme tests (US3).
    a11y: { test: 'error', config: { rules: [] } },
  },
};

export default preview;
