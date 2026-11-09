'use client';

import { useFormatter, useTranslations } from 'next-intl';

export type ComparisonColumnView = { id: string; name: string; slot: 1 | 2 | 3; global: number | null };
export type ComparisonRowView = { key: string; label: string; priority: boolean; values: readonly (number | null)[] };

export type ComparisonTableProps = {
  columns: readonly ComparisonColumnView[];
  rows: readonly ComparisonRowView[];
  onRemove: (id: string) => void;
  className?: string;
};

const SERIES_TEXT = { 1: 'text-series-1', 2: 'text-series-2', 3: 'text-series-3' } as const;

/** Repère de série : forme (rond, triangle, carré) dans la couleur de l'emplacement (FR-021, FR-039). */
export function SeriesMark({ slot }: { slot: 1 | 2 | 3 }) {
  return (
    <svg aria-hidden="true" data-series={slot} viewBox="0 0 12 12" className={['size-3 shrink-0', SERIES_TEXT[slot]].join(' ')} fill="currentColor">
      {slot === 1 ? <circle cx="6" cy="6" r="5" /> : slot === 2 ? <path d="M6 1l5 10H1z" /> : <rect x="1.5" y="1.5" width="9" height="9" />}
    </svg>
  );
}

/**
 * Comparaison de deux ou trois candidats (FR-019 à FR-021, R10) : blocs par thème sous 640 px,
 * tableau à en-têtes de ligne et de colonne au-delà. Couleurs par emplacement, doublées d'une forme.
 */
export function ComparisonTable({ columns, rows, onRemove, className = '' }: ComparisonTableProps) {
  const t = useTranslations('ui.comparisonTable');
  const tThemes = useTranslations('ui.themeScoreList');
  const format = useFormatter();
  const percent = (value: number | null, insufficient = false) =>
    value === null ? (
      insufficient ? (
        <span className="text-fg-muted">{t('insufficient')}</span>
      ) : (
        <span className="text-fg-muted">
          <span aria-hidden="true">—</span>
          <span className="sr-only">{t('undefined')}</span>
        </span>
      )
    ) : (
      <span className="font-medium tabular-nums">{format.number(value / 100, { style: 'percent', maximumFractionDigits: 0 })}</span>
    );
  const rowLabel = (row: ComparisonRowView) => {
    const name = row.key === 'others' ? tThemes('others') : row.label;
    return row.priority ? (
      <>
        <span className="sr-only">{tThemes('priorityTheme', { label: name })}</span>
        <span aria-hidden="true">
          {name} · {tThemes('priorityMark')}
        </span>
      </>
    ) : (
      name
    );
  };
  const candidate = (c: ComparisonColumnView) => (
    <span className="inline-flex min-w-0 items-center gap-1.5 break-words">
      <SeriesMark slot={c.slot} />
      <span>{c.name}</span>
    </span>
  );

  return (
    <div className={['flex flex-col gap-4', className].filter(Boolean).join(' ')}>
      <ul className="flex flex-col gap-2">
        {columns.map((c) => (
          <li key={c.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border bg-surface px-3 py-2">
            <span className="font-medium">{candidate(c)}</span>
            <button
              type="button"
              data-remove-candidate={c.id}
              onClick={() => onRemove(c.id)}
              className="inline-flex min-h-touch items-center rounded-md px-3 text-sm font-medium text-accent hover:bg-accent-soft"
            >
              {t('remove', { name: c.name })}
            </button>
          </li>
        ))}
      </ul>

      {/* Moins de 640 px : un bloc par thème, une ligne par candidat. */}
      <div className="flex flex-col gap-3 sm:hidden" data-layout="blocks">
        <section className="rounded-md border border-border bg-surface p-3">
          <h3 className="font-semibold">{t('global')}</h3>
          <ul className="mt-2 flex flex-col gap-1">
            {columns.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-3 text-sm">
                {candidate(c)}
                {percent(c.global, true)}
              </li>
            ))}
          </ul>
        </section>
        {rows.map((row) => (
          <section key={row.key} className={['rounded-md border p-3', row.priority ? 'border-accent bg-accent-soft' : 'border-border bg-surface'].join(' ')}>
            <h3 className="font-medium break-words">{rowLabel(row)}</h3>
            <ul className="mt-2 flex flex-col gap-1">
              {columns.map((c, i) => (
                <li key={c.id} className="flex items-center justify-between gap-3 text-sm">
                  {candidate(c)}
                  {percent(row.values[i] ?? null)}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {/* À partir de 640 px : tableau à colonnes. */}
      <div className="hidden sm:block" data-layout="table">
        <table className="w-full border-collapse text-sm">
          <caption className="sr-only">{t('caption')}</caption>
          <thead>
            <tr className="border-b border-border">
              <th scope="col" className="py-2 pr-3 text-left font-medium text-fg-muted">
                {t('theme')}
              </th>
              {columns.map((c) => (
                <th key={c.id} scope="col" className="px-2 py-2 text-left font-semibold">
                  {candidate(c)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <th scope="row" className="py-2 pr-3 text-left font-semibold">
                {t('global')}
              </th>
              {columns.map((c) => (
                <td key={c.id} className="px-2 py-2">
                  {percent(c.global, true)}
                </td>
              ))}
            </tr>
            {rows.map((row) => (
              <tr key={row.key} className={['border-b border-border', row.priority ? 'bg-accent-soft' : ''].join(' ')}>
                <th scope="row" className="py-2 pr-3 text-left font-medium break-words">
                  {rowLabel(row)}
                </th>
                {columns.map((c, i) => (
                  <td key={c.id} className="px-2 py-2">
                    {percent(row.values[i] ?? null)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
