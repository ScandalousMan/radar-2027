// Glossaire publié (spec 009, R11) : construction de `public/data/glossary.json` à partir de
// `data/corpus/glossaire.yaml`. Partagé par `pnpm data:glossary` et la règle GLOSS, qui vérifie
// que le fichier publié suit le corpus.
import { GlossarySchema, type Glossary } from '@/core/dataset';
import type { GlossaryEntry } from './schema';

export const GLOSSARY_FILE_NAME = 'glossary.json';

/** Termes relus seulement, sans champs de relecture, triés par libellé (ordre alphabétique français). */
export function buildPublishedGlossary(entries: readonly GlossaryEntry[], updatedAt: string): Glossary {
  const terms = entries
    .filter((e) => e.status === 'reviewed')
    .map((e) => ({
      id: e.id,
      label: e.label,
      forms: [...e.forms],
      definition: e.definition,
      sources: e.sources.map((s) => ({ url: s.url, title: s.title, publisher: s.publisher })),
    }))
    .sort((a, b) => a.label.localeCompare(b.label, 'fr', { sensitivity: 'base' }) || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  return { updatedAt, terms };
}

/** JSON compact avec fin de ligne finale, comme les autres fichiers publiés. */
export function serializeGlossary(glossary: Glossary): string {
  return `${JSON.stringify(glossary)}\n`;
}

/** Contenu publié lisible et valide, `null` sinon. */
export function parsePublishedGlossary(text: string): Glossary | null {
  try {
    const parsed = GlossarySchema.safeParse(JSON.parse(text));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

/** Deux glossaires identiques hors `updatedAt`. */
export function sameGlossaryContent(a: Glossary, b: Glossary): boolean {
  return JSON.stringify(a.terms) === JSON.stringify(b.terms);
}
