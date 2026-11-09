// Page de résultats (contracts/routes-and-views.md § Route, R6, R13). FR-029 : métadonnées
// génériques, identiques pour tous les liens (aucune réponse, aucun sujet, aucun nom, aucun
// score) ; le HTML statique ne contient que le titre et l'état « chargement ». Le fragment est
// lu côté client par `ResultsApp`.
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ResultsApp } from './ResultsApp';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('results.meta');
  return {
    title: t('title'),
    description: t('description'),
    openGraph: { title: t('title'), description: t('description'), type: 'website' },
  };
}

export default function ResultsPage() {
  return <ResultsApp />;
}
