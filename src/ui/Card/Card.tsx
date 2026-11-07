'use client';

import type { HTMLAttributes, ReactNode } from 'react';

export type CardProps = {
  /** Focalisable et activable : rend `<a>` si `href`, sinon `<button>` si `onClick`. */
  interactive?: boolean;
  href?: string;
  onClick?: () => void;
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
} & Omit<HTMLAttributes<HTMLElement>, 'onClick' | 'children' | 'className'>;

const BASE = 'block w-full rounded-lg border border-border bg-surface text-left text-fg shadow-sm';
const INTERACTIVE = 'cursor-pointer transition-shadow hover:shadow-md hover:border-fg-muted active:shadow-sm';

export function Card({ interactive = false, href, onClick, header, footer, children, className = '', ...rest }: CardProps) {
  const classes = [BASE, interactive ? INTERACTIVE : '', className].filter(Boolean).join(' ');
  const body = (
    <>
      {header ? <div className="border-b border-border px-4 py-3 font-medium">{header}</div> : null}
      <div className="px-4 py-4">{children}</div>
      {footer ? <div className="border-t border-border px-4 py-3 text-sm text-fg-muted">{footer}</div> : null}
    </>
  );

  if (interactive && href !== undefined) {
    return (
      <a {...rest} href={href} className={classes} onClick={onClick}>
        {body}
      </a>
    );
  }
  if (interactive) {
    return (
      <button {...rest} type="button" className={classes} onClick={onClick}>
        {body}
      </button>
    );
  }
  return (
    <section {...rest} className={classes}>
      {body}
    </section>
  );
}
