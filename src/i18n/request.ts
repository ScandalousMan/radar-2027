import { getRequestConfig } from 'next-intl/server';
import { defaultLocale, messages } from './config';

/**
 * next-intl « sans routage i18n » (R2) : la locale est statique, donc aucun accès à
 * `cookies()` ni `headers()`, ce qui reste compatible avec l'export statique.
 */
export default getRequestConfig(async () => ({
  locale: defaultLocale,
  messages: messages[defaultLocale],
  timeZone: 'Europe/Paris',
}));
