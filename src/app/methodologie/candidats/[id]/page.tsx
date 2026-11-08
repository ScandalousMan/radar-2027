import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { evidenceLevelFromCode } from '@/core/dataset';
import { loadCurrentMain, loadDetail } from '@/lib/dataset';
import { PositionCard } from '@/ui/PositionCard';
import { ProgressBar } from '@/ui/ProgressBar';

type Params = { id: string };

/**
 * Une page statique par candidat inclus de la version courante. Sans version publiée, l'export
 * statique exige au moins un paramètre : un identifiant réservé produit une page 404.
 */
export const dynamicParams = false;
const NO_VERSION_PLACEHOLDER = '_aucune-version';

export function generateStaticParams(): Params[] {
  const ids = loadCurrentMain()?.candidates.map((c) => c.id) ?? [];
  return ids.length > 0 ? ids.map((id) => ({ id })) : [{ id: NO_VERSION_PLACEHOLDER }];
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { id } = await params;
  const t = await getTranslations('methodology.candidate');
  const candidate = loadCurrentMain()?.candidates.find((c) => c.id === id);
  return candidate ? { title: t('metaTitle', { name: candidate.name }), description: t('description', { name: candidate.name }) } : {};
}

/** Fiche candidat (FR-043, SC-007) : positions connues regroupées par thème principal, chacune sourcée. */
export default async function CandidatePage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const main = loadCurrentMain();
  const candidate = main?.candidates.find((c) => c.id === id);
  const detail = candidate ? loadDetail(id) : null;
  if (!main || !candidate || !detail) notFound();

  const t = await getTranslations('methodology');
  const tc = await getTranslations('ui.coverageList');
  const percent = Math.round(candidate.coverage * 100);
  const questions = new Map(main.questions.map((q) => [q.id, q]));
  const groups = main.themes
    .map((theme) => ({
      theme,
      positions: Object.entries(detail.positions).filter(([qid]) => questions.get(qid)?.themes[0] === theme.id),
    }))
    .filter((g) => g.positions.length > 0);
  const reportHref = (questionId: string) =>
    main.governance.reportIssueUrl.replace('{title}', encodeURIComponent(t('report.positionTitle', { candidate: id, question: questionId })));

  return (
    <div className="flex flex-col gap-8">
      <Link href="/methodologie" className="self-start rounded-sm text-sm text-accent underline-offset-4 hover:underline">
        {t('backToList')}
      </Link>
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">{candidate.name}</h1>
        <p className="text-fg-muted">{candidate.party}</p>
        <ProgressBar value={percent} total={100} label={tc('coverageLabel', { percent })} />
      </header>

      <section aria-labelledby="positions" className="flex flex-col gap-6">
        <h2 id="positions" className="text-2xl font-semibold tracking-tight">
          {t('candidate.positionsTitle')}
        </h2>
        {groups.length === 0 ? <p className="text-fg-muted">{t('candidate.noPositions')}</p> : null}
        {groups.map(({ theme, positions }) => (
          <section key={theme.id} aria-labelledby={`theme-${theme.id}`} className="flex flex-col gap-3">
            <h3 id={`theme-${theme.id}`} className="text-xl font-medium">
              {theme.label}
            </h3>
            <ul className="flex flex-col gap-4">
              {positions.map(([qid, p]) => (
                <li key={qid}>
                  <PositionCard
                    question={questions.get(qid)!.text}
                    value={p.value}
                    level={evidenceLevelFromCode[p.level]}
                    quote={p.quote}
                    justification={p.justification}
                    old={p.old === true}
                    sources={p.sources.flatMap((sid) => {
                      const s = detail.sources[sid];
                      return s ? [{ url: s.url, title: s.title, publishedAt: s.publishedAt, accessedAt: s.accessedAt }] : [];
                    })}
                    reportHref={reportHref(qid)}
                  />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </section>
    </div>
  );
}
