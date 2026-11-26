'use client';

// Contexte du glossaire compilé (009, R11) : partagé par le questionnaire et les résultats.
// Séparé de `GlossaryProvider.tsx` (qui récupère le fichier) pour que les composants de `src/ui`
// le lisent sans dépendre du chargement réseau.
import { createContext, useContext } from 'react';
import type { GlossaryTerm } from '@/core/dataset';
import { compileGlossary, type GlossaryIndex } from './annotate';

export type GlossaryData = {
  readonly index: GlossaryIndex;
  readonly terms: ReadonlyMap<string, GlossaryTerm>;
};

export const GlossaryContext = createContext<GlossaryData | null>(null);

/** Glossaire compilé du contexte, `null` s'il est absent, en cours de chargement ou indisponible. */
export function useGlossary(): GlossaryData | null {
  return useContext(GlossaryContext);
}

export function toGlossaryData(terms: readonly GlossaryTerm[]): GlossaryData {
  return { index: compileGlossary(terms), terms: new Map(terms.map((t) => [t.id, t])) };
}
