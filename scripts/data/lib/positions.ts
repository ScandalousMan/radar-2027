// Interprétation des positions (FR-015, FR-017, FR-019, FR-022).
import { EVIDENCE_LEVELS, SCALE_VALUES, type ScaleValue } from '@/core/dataset';
import type { Corpus, EvidenceKind, Position, Source } from './schema';
import type { SourceCache } from './rules/types';
import { findQuote, sha256 } from './text';

const sourceIndexes = new WeakMap<Corpus, Map<string, Source>>();

/** Index `id → source`, mémorisé par corpus (le premier gagne en cas de doublon, signalé par ID-UNIQUE). */
export function sourceIndex(corpus: Corpus): Map<string, Source> {
  let index = sourceIndexes.get(corpus);
  if (!index) {
    index = new Map();
    for (const list of corpus.sources.values()) for (const s of list) if (!index.has(s.id)) index.set(s.id, s);
    sourceIndexes.set(corpus, index);
  }
  return index;
}

export function isScaleValue(value: unknown): value is ScaleValue {
  return typeof value === 'number' && (SCALE_VALUES as readonly number[]).includes(value);
}

/** Empreinte de ce que la relecture valide : valeur, sources (triées) et citation (FR-019). */
export function positionHash(position: Pick<Position, 'value' | 'sources' | 'quote'>): string {
  return sha256(JSON.stringify({ value: position.value, sources: [...position.sources].sort(), quote: position.quote ?? null }));
}

/** Niveau de preuve le plus fort parmi des types de source (programme > livre_plateforme > declaration_vote). */
export function strongestEvidence(kinds: Iterable<EvidenceKind>): EvidenceKind | null {
  let best: number | null = null;
  for (const k of kinds) {
    const rank = EVIDENCE_LEVELS.indexOf(k);
    if (best === null || rank < best) best = rank;
  }
  return best === null ? null : EVIDENCE_LEVELS[best]!;
}

/** Une source est ancienne si sa date de publication précède le seuil (à sa précision près). */
export function isOldSource(source: Pick<Source, 'publishedAt'>, oldSourceBefore: string): boolean {
  const { date, precision } = source.publishedAt;
  const cut = oldSourceBefore.slice(0, precision === 'year' ? 4 : precision === 'month' ? 7 : 10);
  // Une source datée seulement de l'année du seuil n'est pas considérée comme ancienne.
  return date < cut;
}

/** Citation retrouvée dans le cache de `quoteSource` : `true`/`false`, ou `null` si non vérifiable (cache absent ou texte manquant). */
export function quoteFound(position: Position, corpus: Corpus, cache: SourceCache | undefined): boolean | null {
  if (!cache || !position.quote || !position.quoteSource) return null;
  const source = sourceIndex(corpus).get(position.quoteSource);
  if (!source?.contentHash) return null;
  const text = cache.read(source.contentHash);
  if (text === null) return null;
  return findQuote(text, position.quote) !== null;
}

/**
 * Position « connue » au sens de FR-022 : relue, valeur dans l'échelle, au moins une source,
 * citation présente et, quand le cache est disponible, retrouvée dans le texte de `quoteSource`.
 */
export function isKnown(position: Position, ctx: { corpus: Corpus; cache?: SourceCache }): boolean {
  if (position.status !== 'reviewed' || !isScaleValue(position.value)) return false;
  if (position.sources.length === 0 || !position.quote || !position.quoteSource) return false;
  if (!ctx.cache) return true;
  return quoteFound(position, ctx.corpus, ctx.cache) === true;
}
