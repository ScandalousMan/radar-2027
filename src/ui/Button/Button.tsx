'use client';

import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'md' | 'sm';

type CommonProps = {
  /** Apparence : `primary` (défaut), `secondary`, `ghost` (discrète), `danger` (action destructrice). */
  variant?: ButtonVariant;
  /** Taille : `md` (défaut) ou `sm` (compacte). La hauteur minimale reste tactile (44 px). */
  size?: ButtonSize;
  /** En cours : `aria-busy`, action désactivée, largeur conservée, libellé lisible. */
  loading?: boolean;
  disabled?: boolean;
  /** Si présent, rend un lien `<a>` avec les mêmes styles. */
  href?: string;
  /** Libellé fourni par le parent (jamais écrit en dur ici). */
  children: ReactNode;
  className?: string;
};

export type ButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps | 'type'>;

const BASE =
  'relative inline-flex items-center justify-center gap-2 rounded-md font-medium whitespace-nowrap transition-colors select-none aria-disabled:cursor-not-allowed aria-disabled:opacity-60';

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-accent-fg hover:bg-accent/90 active:bg-accent/80',
  secondary: 'border border-border bg-surface text-fg hover:bg-bg active:bg-border/60',
  ghost: 'bg-transparent text-accent hover:bg-accent-soft active:bg-accent-soft/80',
  danger: 'bg-danger text-accent-fg hover:bg-danger/90 active:bg-danger/80',
};

const SIZES: Record<ButtonSize, string> = {
  md: 'min-h-touch px-5 text-base',
  sm: 'min-h-touch px-4 text-sm',
};

export function buttonClassName({
  variant = 'primary',
  size = 'md',
  className = '',
}: Pick<CommonProps, 'variant' | 'size' | 'className'>): string {
  return [BASE, VARIANTS[variant], SIZES[size], className].filter(Boolean).join(' ');
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  href,
  children,
  className,
  onClick,
  ...rest
}: ButtonProps) {
  const inactive = disabled || loading;
  const classes = buttonClassName({ variant, size, className });
  // En chargement, le libellé reste visible et lisible par les lecteurs d'écran ; l'indicateur s'ajoute devant.
  const content = (
    <>
      {loading ? (
        <span aria-hidden="true" className="size-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      <span className={loading ? 'opacity-70' : undefined}>{children}</span>
    </>
  );

  if (href !== undefined) {
    const anchorRest = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a
        {...anchorRest}
        href={inactive ? undefined : href}
        role={inactive ? 'link' : undefined}
        aria-disabled={inactive || undefined}
        aria-busy={loading || undefined}
        className={classes}
        onClick={(event) => {
          if (inactive) {
            event.preventDefault();
            return;
          }
          (onClick as AnchorHTMLAttributes<HTMLAnchorElement>['onClick'])?.(event);
        }}
      >
        {content}
      </a>
    );
  }

  const buttonRest = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button
      type="button"
      {...buttonRest}
      disabled={disabled}
      aria-disabled={inactive || undefined}
      aria-busy={loading || undefined}
      className={classes}
      onClick={(event) => {
        if (inactive) {
          event.preventDefault();
          return;
        }
        (onClick as ButtonHTMLAttributes<HTMLButtonElement>['onClick'])?.(event);
      }}
    >
      {content}
    </button>
  );
}
