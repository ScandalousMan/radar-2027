import type { Metadata } from 'next';
import { getFormatter, getTranslations } from 'next-intl/server';
import { readGlossaryAtBuild } from '@/lib/glossary/load.server';
import { parseDay } from '@/lib/published-date';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('glossary.page');
  return { title: t('title'), description: t('description') };
}

/**
 * Page Glossaire (009, FR-020) : termes relus, rendus au build depuis `public/data/glossary.json`
 * (déjà triés par `data:glossary`). Chaque terme a une ancre égale à son identifiant, cible des
 * liens « Voir le glossaire » des bulles de définition.
 */
export default async function GlossaryPage() {
  const t = await getTranslations('glossary');
  const format = await getFormatter();
  const glossary = readGlossaryAtBuild();
  const terms = glossary?.terms ?? [];

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">{t('page.title')}</h1>
        <p className="text-lg text-fg-muted">{t('page.intro')}</p>
        {glossary && terms.length > 0 ? (
          <p className="text-sm text-fg-muted">{t('page.updatedAt', { date: format.dateTime(parseDay(glossary.updatedAt), { day: 'numeric', month: 'long', year: 'numeric' }) })}</p>
        ) : null}
      </header>
      {terms.length === 0 ? (
        <p>{t('page.empty')}</p>
      ) : (
        <dl className="flex flex-col gap-6">
          {terms.map((term) => (
            <div key={term.id} id={term.id} className="flex scroll-mt-24 flex-col gap-2 rounded-md border border-border bg-surface p-4">
              <dt className="text-lg font-semibold break-words">{term.label}</dt>
              <dd className="break-words">{term.definition}</dd>
              <dd className="text-sm break-words text-fg-muted">
                {term.sources.length > 1 ? t('sources') : t('source')}
                {' : '}
                {term.sources.map((source, i) => (
                  <span key={source.url}>
                    {i > 0 ? ' · ' : null}
                    <a href={source.url} target="_blank" rel="noopener noreferrer" className="rounded-sm text-accent underline underline-offset-4">
                      {source.title}
                      <span className="sr-only"> {t('newTab')}</span>
                    </a>
                    {' '}({source.publisher})
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
