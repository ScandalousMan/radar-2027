import type { DateWithPrecision } from '@/core/dataset';

export type DateParts = { day?: 'numeric'; month?: 'long'; year?: 'numeric' };

export type DateFormatter = (date: Date, options: DateParts) => string;

/** Date à minuit UTC : affichée dans le fuseau Europe/Paris, elle reste le même jour. */
export function parseDay(day: string): Date {
  return new Date(`${day}T00:00:00Z`);
}

/** Met en forme une date selon sa précision (« 14 mars 2026 », « mars 2026 », « 2026 »). */
export function formatPublishedAt(d: DateWithPrecision, format: DateFormatter): string {
  switch (d.precision) {
    case 'day':
      return format(parseDay(d.date), { day: 'numeric', month: 'long', year: 'numeric' });
    case 'month':
      return format(parseDay(`${d.date}-01`), { month: 'long', year: 'numeric' });
    default:
      return d.date;
  }
}
