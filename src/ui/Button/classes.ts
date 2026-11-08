import type { ReactNode } from 'react';

// Classes du bouton, sans directive client : utilisables par un lien rendu côté serveur.
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'md' | 'sm';

export type ButtonCommonProps = {
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
}: Pick<ButtonCommonProps, 'variant' | 'size' | 'className'>): string {
  return [BASE, VARIANTS[variant], SIZES[size], className].filter(Boolean).join(' ');
}

