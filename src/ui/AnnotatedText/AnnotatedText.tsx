'use client';

import { Fragment, useMemo } from 'react';
import { annotate } from '@/lib/glossary/annotate';
import { useGlossary, type GlossaryData } from '@/lib/glossary/context';
import { DefinedTerm, DefinedTermGroup } from '@/ui/DefinedTerm';

export type AnnotatedTextProps = {
  text: string;
  /**
   * Glossaire compilé ; absent : celui du contexte (`GlossaryProvider`) ; `null` : aucun repère
   * (glossaire indisponible), le texte est rendu tel quel.
   */
  glossary?: GlossaryData | null;
};

/** Énoncé dont la première occurrence de chaque terme défini ouvre une bulle de définition (009, FR-016). */
export function AnnotatedText({ text, glossary }: AnnotatedTextProps) {
  const fromContext = useGlossary();
  const data = glossary === undefined ? fromContext : glossary;
  const segments = useMemo(() => (data ? annotate(text, data.index) : null), [data, text]);
  if (!data || !segments || segments.every((s) => s.kind === 'text')) return <>{text}</>;
  return (
    <DefinedTermGroup>
      {segments.map((segment, i) => {
        // Texte brut en nœuds texte (pas de <span>) : le nom accessible du titre garde ses espaces.
        if (segment.kind === 'text') return <Fragment key={i}>{segment.text}</Fragment>;
        const term = data.terms.get(segment.termId);
        if (!term) return <Fragment key={i}>{segment.text}</Fragment>;
        return (
          <DefinedTerm key={i} term={term} glossaryHref={`/glossaire#${term.id}`}>
            {segment.text}
          </DefinedTerm>
        );
      })}
    </DefinedTermGroup>
  );
}
