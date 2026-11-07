import type { Locale, Messages } from '@/i18n/config';

/** Clés typées pour next-intl : toute clé absente de `fr.json` est une erreur de compilation. */
declare module 'next-intl' {
  interface AppConfig {
    Locale: Locale;
    Messages: Messages;
  }
}

/** Alias conservé pour la lisibilité des tests et des outils (plan § Project Structure). */
export type IntlMessages = Messages;
