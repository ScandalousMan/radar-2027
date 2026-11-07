import fr from './messages/fr.json';

/**
 * Locales de radar-2027. Ajouter une locale = ajouter `messages/<locale>.json`, l'inscrire
 * dans `locales` et dans `messages` ; aucun composant ne change (FR-006).
 */
export const locales = ['fr'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'fr';

export type Messages = typeof fr;

export const messages: Record<Locale, Messages> = { fr };
