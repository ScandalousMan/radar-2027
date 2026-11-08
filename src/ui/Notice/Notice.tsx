import { useTranslations } from 'next-intl';
import type { HTMLAttributes, ReactNode } from 'react';

export type NoticeTone = 'info' | 'warning';

export type NoticeProps = {
  tone: NoticeTone;
  /** Titre visible ; par défaut « Information » ou « Attention » selon le ton. */
  title?: string;
  children: ReactNode;
  /** `status` (défaut) ou `alert` pour une annonce immédiate. */
  role?: 'status' | 'alert';
  className?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'role' | 'children' | 'className'>;

const TONES: Record<NoticeTone, string> = {
  info: 'border-accent',
  warning: 'border-danger',
};

/** Icône distincte par la forme (cercle « i » / triangle « ! »), jamais par la seule couleur. */
function NoticeIcon({ tone }: { tone: NoticeTone }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className={['mt-0.5 size-5 shrink-0', tone === 'warning' ? 'text-danger' : 'text-accent'].join(' ')} fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      {tone === 'warning' ? (
        <>
          <path d="M10 2.5l8 14.5H2z" />
          <path d="M10 8v4" />
          <path d="M10 14.5v.01" />
        </>
      ) : (
        <>
          <circle cx="10" cy="10" r="8" />
          <path d="M10 9v5" />
          <path d="M10 6v.01" />
        </>
      )}
    </svg>
  );
}

/** Encart d'information ou d'avertissement (stockage indisponible, fiabilité, version changée). */
export function Notice({ tone, title, children, role = 'status', className = '', ...rest }: NoticeProps) {
  const t = useTranslations('ui.notice');
  return (
    <div {...rest} role={role} className={['flex gap-3 rounded-md border border-l-4 bg-surface px-4 py-3 text-fg', TONES[tone], className].filter(Boolean).join(' ')}>
      <NoticeIcon tone={tone} />
      <div className="flex min-w-0 flex-col gap-1">
        <p className="font-medium">{title ?? t(tone)}</p>
        <div className="text-sm break-words">{children}</div>
      </div>
    </div>
  );
}
