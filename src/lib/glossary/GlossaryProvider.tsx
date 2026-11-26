'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Glossary } from '@/core/dataset';
import { GlossaryContext, toGlossaryData } from './context';
import { fetchGlossary } from './load';

export { useGlossary } from './context';
export type { GlossaryData } from './context';

export type GlossaryProviderProps = {
  children: ReactNode;
  /**
   * Glossaire déjà chargé (stories, tests) ; `null` : aucun glossaire. Absent : récupéré une fois
   * côté client, en parallèle du jeu de données.
   */
  glossary?: Glossary | null;
};

/** Fournit le glossaire compilé aux énoncés (`AnnotatedText`). Sans effet sur la sélection, le score ou le lien (FR-021). */
export function GlossaryProvider({ children, glossary }: GlossaryProviderProps) {
  const [fetched, setFetched] = useState<Glossary | null>(null);
  const preloaded = glossary !== undefined;

  useEffect(() => {
    if (preloaded) return;
    let active = true;
    void fetchGlossary().then((g) => {
      if (active) setFetched(g);
    });
    return () => {
      active = false;
    };
  }, [preloaded]);

  const source = preloaded ? glossary : fetched;
  const value = useMemo(() => (source ? toGlossaryData(source.terms) : null), [source]);
  return <GlossaryContext.Provider value={value}>{children}</GlossaryContext.Provider>;
}
