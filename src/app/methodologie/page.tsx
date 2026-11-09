import type { Metadata } from 'next';
import { getFormatter, getTranslations } from 'next-intl/server';
import { BANDS, COVERAGE_THRESHOLD, EXAMPLE_A, EXAMPLE_B, MIN_THEME_QUESTIONS, PRIORITY_WEIGHT } from '@/core';
import { loadCurrentMain } from '@/lib/dataset';
import { AGREEMENT_LEVELS } from '@/lib/results/types';
import { parseDay } from '@/lib/published-date';
import { Button } from '@/ui/Button';
import { Card } from '@/ui/Card';
import { CoverageList } from '@/ui/CoverageList';
import { EvidenceBadge } from '@/ui/EvidenceBadge';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('methodology');
  return { title: t('title'), description: t('description') };
}

const H2 = 'text-2xl font-semibold tracking-tight';
const SECTION = 'flex flex-col gap-4';

/**
 * Page Méthodologie (FR-042, FR-044, FR-045) : règles, gouvernance et candidats de la version
 * courante. 005 (FR-005, FR-041 ; 003 SC-001) : formules, seuils, bandes, paliers d'accord et
 * exemples chiffrés, lus dans le cœur pour que la page reprenne exactement ce que le code calcule.
 */
export default async function MethodologyPage() {
  const t = await getTranslations('methodology');
  const tResults = await getTranslations('results');
  const format = await getFormatter();
  const main = loadCurrentMain();
  const day = (d: string) => format.dateTime(parseDay(d), { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">{t('title')}</h1>
        <p className="text-lg text-fg-muted">{t('intro')}</p>
      </header>

      <section aria-labelledby="regles" className={SECTION}>
        <h2 id="regles" className={H2}>
          {t('rules.title')}
        </h2>
        <ul className="flex list-disc flex-col gap-2 pl-5">
          <li>{t('rules.traceability')}</li>
          <li>{t('rules.review')}</li>
          <li>{t('rules.draft')}</li>
          <li>{t('rules.versioned')}</li>
        </ul>
      </section>

      <section aria-labelledby="calcul-titre" id="calcul" className={SECTION}>
        <h2 id="calcul-titre" className={H2}>
          {t('scoring.title')}
        </h2>
        <p>{t('scoring.intro')}</p>
        <p>{t('scoring.concordance')}</p>
        <h3 className="text-lg font-semibold">{t('scoring.agreementTitle')}</h3>
        <ul className="flex list-disc flex-col gap-1 pl-5">
          {AGREEMENT_LEVELS.map((level, gap) => (
            <li key={level}>{t('scoring.agreementItem', { label: tResults(`agreement.${level}`), gap })}</li>
          ))}
        </ul>
        <p>{t('scoring.theme', { min: MIN_THEME_QUESTIONS })}</p>
        <p>{t('scoring.weighted', { weight: PRIORITY_WEIGHT })}</p>
        <p>{t('scoring.cap')}</p>
        <p>{t('scoring.percent')}</p>
        <p>{t('scoring.coverage', { threshold: COVERAGE_THRESHOLD })}</p>
        <h3 className="text-lg font-semibold">{t('scoring.bandsTitle')}</h3>
        <ul className="flex list-disc flex-col gap-1 pl-5">
          {BANDS.map((b, i) => {
            const label = tResults(`band.${b.band}`);
            const upper = i === 0 ? null : BANDS[i - 1]!.min;
            return <li key={b.band}>{upper === null ? t('scoring.bandFrom', { label, min: b.min }) : b.min === 0 ? t('scoring.bandBelow', { label, max: upper }) : t('scoring.bandRange', { label, min: b.min, max: upper - 1 })}</li>;
          })}
        </ul>
        <h3 className="text-lg font-semibold">{t('scoring.examplesTitle')}</h3>
        <ul className="flex flex-col gap-2">
          <li>
            {t('scoring.exampleA', {
              economie: EXAMPLE_A.expected.themes[0]!.percent!,
              global: EXAMPLE_A.expected.global.percent,
              coverage: EXAMPLE_A.expected.coverage.percent,
              band: tResults(`band.${EXAMPLE_A.expected.band}`),
            })}
          </li>
          <li>
            {t('scoring.exampleB', {
              weighted: EXAMPLE_B.expected.weighted.percent,
              priority: EXAMPLE_B.expected.priority.percent,
              global: EXAMPLE_B.expected.global.percent,
              band: tResults(`band.${EXAMPLE_B.expected.band}`),
            })}
          </li>
        </ul>
      </section>

      {main === null ? (
        <p className="text-fg-muted">{t('noVersion')}</p>
      ) : (
        <>
          <section aria-labelledby="niveaux" className={SECTION}>
            <h2 id="niveaux" className={H2}>
              {t('evidenceLevels.title')}
            </h2>
            <ul className="flex flex-col gap-3">
              {main.governance.evidenceLevels.map((level) => (
                <li key={level.id} className="flex flex-col items-start gap-1">
                  <EvidenceBadge level={level.id} />
                  <span>{level.definition}</span>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="themes" className={SECTION}>
            <h2 id="themes" className={H2}>
              {t('themes.title')}
            </h2>
            <ol className="flex flex-col gap-3">
              {main.themes.map((theme) => (
                <li key={theme.id}>
                  <Card header={theme.label}>
                    <div className="flex flex-col gap-2">
                      <p>{theme.description}</p>
                      <p className="text-sm text-fg-muted">{t('themes.axis', { negative: theme.axis.negative, positive: theme.axis.positive })}</p>
                    </div>
                  </Card>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="neutralite" className={SECTION}>
            <h2 id="neutralite" className={H2}>
              {t('neutrality.title')}
            </h2>
            <p className="text-fg-muted">{t('neutrality.intro')}</p>
            <ul className="flex list-disc flex-col gap-2 pl-5">
              {main.governance.neutralityChecklist.map((c) => (
                <li key={c.id}>{c.text}</li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="criteres" className={SECTION}>
            <h2 id="criteres" className={H2}>
              {t('inclusion.title')}
            </h2>
            {(['inclusion', 'withdrawal'] as const).map((kind) => (
              <div key={kind} className="flex flex-col gap-2">
                <h3 className="text-lg font-medium">{t(`inclusion.${kind}`)}</h3>
                <ul className="flex list-disc flex-col gap-2 pl-5">
                  {main.governance.inclusionCriteria
                    .filter((c) => c.kind === kind)
                    .map((c) => (
                      <li key={c.id}>{c.text}</li>
                    ))}
                </ul>
              </div>
            ))}
          </section>

          <section aria-labelledby="candidats" className={SECTION}>
            <h2 id="candidats" className={H2}>
              {t('candidates.title')}
            </h2>
            <p className="text-fg-muted">{t('candidates.intro')}</p>
            {main.candidates.length === 0 ? (
              <p>{t('candidates.none')}</p>
            ) : (
              <CoverageList
                items={main.candidates.map((c) => ({ id: c.id, name: c.name, party: c.party, coverage: c.coverage, href: `/methodologie/candidats/${c.id}` }))}
              />
            )}
          </section>

          {main.withdrawn.length > 0 ? (
            <section aria-labelledby="retires" className={SECTION}>
              <h2 id="retires" className={H2}>
                {t('withdrawn.title')}
              </h2>
              <ul className="flex list-disc flex-col gap-2 pl-5">
                {main.withdrawn.map((w) => (
                  <li key={w.id}>
                    {t('withdrawn.item', {
                      name: w.name,
                      date: day(w.withdrawnAt),
                      criterion: main.governance.inclusionCriteria.find((c) => c.id === w.criterion)?.text ?? w.criterion,
                    })}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section aria-labelledby="version" className={SECTION}>
            <h2 id="version" className={H2}>
              {t('version.title')}
            </h2>
            <p>{t('version.summary', { version: main.version, date: day(main.publishedAt), count: main.questions.length })}</p>
            <p className="text-sm text-fg-muted">{t('license')}</p>
            <div>
              <Button variant="secondary" href={main.governance.reportIssueUrl.replace('{title}', '')} target="_blank" rel="noopener noreferrer">
                {t('report.cta')}
              </Button>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
