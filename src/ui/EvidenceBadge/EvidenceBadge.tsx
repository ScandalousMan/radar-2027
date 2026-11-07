import { useTranslations } from 'next-intl';
import type { HTMLAttributes } from 'react';

/** Niveaux de preuve, du plus fort au plus faible (principe I). */
export type EvidenceLevel = 'programme' | 'livre_plateforme' | 'declaration_vote';

export type EvidenceBadgeProps = {
  level: EvidenceLevel;
  className?: string;
} & Omit<HTMLAttributes<HTMLSpanElement>, 'children' | 'className'>;

const KEYS = {
  programme: 'programme',
  livre_plateforme: 'livrePlateforme',
  declaration_vote: 'declarationVote',
} as const;

/** Chaque niveau a sa propre forme : le texte et l'icône distinguent, jamais la couleur seule. */
function EvidenceIcon({ level }: { level: EvidenceLevel }) {
  const common = {
    'aria-hidden': true,
    className: 'size-3.5 shrink-0',
    viewBox: '0 0 16 16',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  } as const;
  switch (level) {
    case 'programme':
      // Document avec lignes
      return (
        <svg {...common} data-icon="document">
          <path d="M4 1.5h5.5L13 5v9.5H4z" />
          <path d="M6 7h4M6 9.5h4M6 12h2.5" />
        </svg>
      );
    case 'livre_plateforme':
      // Livre ouvert
      return (
        <svg {...common} data-icon="book">
          <path d="M1.5 3.5h4.5a2 2 0 0 1 2 2v8a1.5 1.5 0 0 0-1.5-1.5h-5z" />
          <path d="M14.5 3.5H10a2 2 0 0 0-2 2v8a1.5 1.5 0 0 1 1.5-1.5h5z" />
        </svg>
      );
    case 'declaration_vote':
      // Bulle de parole
      return (
        <svg {...common} data-icon="speech">
          <path d="M2 3.5h12v7.5H7l-3.5 3v-3H2z" />
        </svg>
      );
  }
}

export function EvidenceBadge({ level, className = '', ...rest }: EvidenceBadgeProps) {
  const t = useTranslations('ui.evidence');
  return (
    <span
      {...rest}
      data-level={level}
      className={[
        'inline-flex max-w-full items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-medium text-fg-muted',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <EvidenceIcon level={level} />
      <span>{t(KEYS[level])}</span>
    </span>
  );
}
