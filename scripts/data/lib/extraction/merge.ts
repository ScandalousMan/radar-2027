// Identité déterministe, vérification des citations et fusion idempotente des affirmations (R8).
import type { Affirmation } from '../schema';
import { findQuote, normalize, sha256 } from '../text';
import type { RawAffirmation } from './schema';

const hex16 = (s: string) => sha256(s).slice('sha256:'.length, 'sha256:'.length + 16);

/** `sha256(source | début | question)` tronqué à 16 hexadécimaux. */
export function affirmationId(sourceId: string, start: number | string, questionId: string | null): string {
  return hex16(`${sourceId}|${start}|${questionId ?? 'none'}`);
}

export type Verified = { state: 'verifiable'; location: { start: number; end: number }; quote: string } | { state: 'unverifiable'; location: null; quote: string };

/** La citation est-elle retrouvée mot pour mot (après normalisation) dans le texte de la source ? */
export function verifyAffirmation(raw: Pick<RawAffirmation, 'quote'>, sourceText: string): Verified {
  const location = findQuote(sourceText, raw.quote);
  if (!location) return { state: 'unverifiable', location: null, quote: normalize(raw.quote) };
  return { state: 'verifiable', location, quote: sourceText.slice(location.start, location.end) };
}

/** Identifiant d'une affirmation vérifiée ou non (une non vérifiable s'identifie par sa citation). */
export function idFor(sourceId: string, verified: Verified, questionId: string | null): string {
  return verified.location ? affirmationId(sourceId, verified.location.start, questionId) : affirmationId(sourceId, `q:${sha256(verified.quote)}`, questionId);
}

/** Fusion par identifiant sans écraser : une affirmation existante garde son état et sa décision. */
export function mergeAffirmations(existing: Affirmation[], incoming: Affirmation[]): { merged: Affirmation[]; added: number; duplicates: number } {
  const ids = new Set(existing.map((a) => a.id));
  const merged = [...existing];
  let added = 0;
  let duplicates = 0;
  for (const a of incoming) {
    if (ids.has(a.id)) {
      duplicates++;
      continue;
    }
    ids.add(a.id);
    merged.push(a);
    added++;
  }
  return { merged, added, duplicates };
}
