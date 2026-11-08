'use client';

import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';
import { buttonClassName, type ButtonCommonProps } from './classes';

export { buttonClassName };
export type { ButtonSize, ButtonVariant } from './classes';

type CommonProps = ButtonCommonProps;

export type ButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps | 'type'>;

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
