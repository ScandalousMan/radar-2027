// Récupération du glossaire côté client (009, R11) : `public/data/glossary.json`, hors versions.
// Aucun import de `node:fs` : ce module est inclus dans le bundle du questionnaire et des résultats.
import { GlossarySchema, type Glossary } from '@/core/dataset';

export const GLOSSARY_URL = '/data/glossary.json';

let cache: Promise<Glossary | null> | null = null;

/**
 * Glossaire validé, mis en cache en mémoire pour la session ; `null` si le fichier est absent,
 * invalide ou injoignable (le site s'affiche alors sans repère de terme).
 */
export function fetchGlossary(fetcher: typeof fetch = fetch): Promise<Glossary | null> {
  cache ??= (async () => {
    try {
      const response = await fetcher(GLOSSARY_URL);
      if (!response.ok) return null;
      const parsed = GlossarySchema.safeParse(await response.json());
      return parsed.success ? parsed.data : null;
    } catch {
      return null;
    }
  })();
  return cache;
}

/** Vide le cache (tests). */
export function resetGlossaryCache(): void {
  cache = null;
}
