'use client';

import { useTranslations } from 'next-intl';
import { createPortal } from 'react-dom';
import { useCallback, useContext, useEffect, useId, useLayoutEffect, useRef, useState, useSyncExternalStore, type FocusEvent, type PointerEvent } from 'react';
import { DefinedTermGroupContext } from './DefinedTermGroup';

export type DefinedTermSource = { url: string; title: string; publisher: string };

export type DefinedTermData = { id: string; label: string; definition: string; sources: readonly DefinedTermSource[] };

export type DefinedTermProps = {
  /** Texte tel qu'il apparaît dans l'énoncé. */
  children: string;
  term: DefinedTermData;
  /** Lien vers l'entrée du glossaire, par exemple `/glossaire#aide-medicale-etat`. */
  glossaryHref: string;
};

const noSubscription = () => () => {};

/** Valeur calculée d'un token (`--defined-term-*`), convertie en pixels ou en millisecondes ; 0 si illisible. */
function readToken(name: string, unit: 'length' | 'time'): number {
  const root = document.documentElement;
  const raw = getComputedStyle(root).getPropertyValue(name).trim();
  const value = Number.parseFloat(raw);
  if (!Number.isFinite(value)) return 0;
  if (unit === 'time') return raw.endsWith('ms') ? value : raw.endsWith('s') ? value * 1000 : 0;
  if (raw.endsWith('px')) return value;
  if (raw.endsWith('rem')) {
    const rootSize = Number.parseFloat(getComputedStyle(root).fontSize);
    return Number.isFinite(rootSize) ? value * rootSize : 0;
  }
  return 0;
}

/**
 * Terme défini (009, R9) : toggletip non modal. Bouton souligné en pointillé dans l'énoncé ;
 * bulle `popover="manual"` placée juste après lui, ouverte au clic, au toucher, au clavier ou au
 * survol temporisé de la souris, fermée par Échap, un geste extérieur, la sortie du focus ou le
 * bouton Fermer. Aucun effet sur l'état du questionnaire, l'historique ou l'URL (FR-018).
 */
export function DefinedTerm({ children, term, glossaryHref }: DefinedTermProps) {
  const t = useTranslations('glossary');
  const instance = useId();
  const bubbleId = `${instance}-bubble`;
  const labelId = `${instance}-label`;
  const descriptionId = `${instance}-description`;
  const group = useContext(DefinedTermGroupContext);
  const [localOpen, setLocalOpen] = useState(false);
  // Vrai côté client seulement (le portail exige document.body ; rien au rendu statique).
  const mounted = useSyncExternalStore(
    noSubscription,
    () => true,
    () => false,
  );
  const open = group ? group.openKey === instance : localOpen;

  const wrapperRef = useRef<HTMLSpanElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const bubbleRef = useRef<HTMLSpanElement>(null);
  /** Bulle fixée par un clic (elle ne se ferme plus à la sortie du pointeur). */
  const pinned = useRef(false);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    openTimer.current = null;
    closeTimer.current = null;
  }, []);

  const setOpen = useCallback(
    (next: boolean) => {
      if (group) group.setOpenKey((current) => (next ? instance : current === instance ? null : current));
      else setLocalOpen(next);
    },
    [group, instance],
  );

  const close = useCallback(
    (returnFocus = false) => {
      clearTimers();
      pinned.current = false;
      setOpen(false);
      if (returnFocus) buttonRef.current?.focus();
    },
    [clearTimers, setOpen],
  );

  // Démontage (changement de question) : timers annulés, groupe libéré.
  useEffect(
    () => () => {
      clearTimers();
      group?.setOpenKey((current) => (current === instance ? null : current));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- nettoyage au démontage seulement
    [],
  );

  // Ouverture : couche supérieure, position, et écouteurs de fermeture.
  useLayoutEffect(() => {
    if (!open) return;
    const bubble = bubbleRef.current;
    const button = buttonRef.current;
    if (!bubble || !button) return;
    try {
      bubble.showPopover?.();
    } catch {
      // déjà ouverte, ou API indisponible : la bulle reste affichée en place
    }

    const place = () => {
      const root = document.documentElement;
      const gutter = readToken('--defined-term-gutter', 'length');
      const offset = readToken('--defined-term-offset', 'length');
      const maxWidth = readToken('--defined-term-max-width', 'length');
      const viewportWidth = root.clientWidth || window.innerWidth;
      const viewportHeight = root.clientHeight || window.innerHeight;
      const available = Math.max(0, viewportWidth - 2 * gutter);
      const width = maxWidth > 0 ? Math.min(maxWidth, available) : available;
      bubble.style.width = `${width}px`;
      const anchor = button.getBoundingClientRect();
      const height = bubble.offsetHeight;
      const left = Math.max(gutter, Math.min(anchor.left, viewportWidth - gutter - width));
      let top = anchor.bottom + offset;
      if (top + height > viewportHeight - gutter && anchor.top - offset - height >= gutter) top = anchor.top - offset - height;
      bubble.style.left = `${left}px`;
      bubble.style.top = `${top}px`;
    };
    place();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      const inside = wrapperRef.current?.contains(document.activeElement) ?? false;
      close(inside);
    };
    const onPointerDown = (event: globalThis.PointerEvent) => {
      if (event.target instanceof Node && wrapperRef.current?.contains(event.target)) return;
      close();
    };
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, { capture: true, passive: true });
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown, { capture: true });
    return () => {
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, { capture: true });
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown, { capture: true });
    };
  }, [open, close]);

  const onClick = () => {
    clearTimers();
    if (!open) {
      pinned.current = true;
      setOpen(true);
    } else if (!pinned.current) {
      // Ouverte par survol : le clic la fixe.
      pinned.current = true;
    } else {
      close();
    }
  };

  const onPointerEnter = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse') return;
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
    if (open || openTimer.current) return;
    openTimer.current = setTimeout(() => {
      openTimer.current = null;
      pinned.current = false;
      setOpen(true);
    }, readToken('--defined-term-open-delay', 'time'));
  };

  const onPointerLeave = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse') return;
    if (openTimer.current) clearTimeout(openTimer.current);
    openTimer.current = null;
    if (!open || pinned.current) return;
    closeTimer.current = setTimeout(() => close(), readToken('--defined-term-close-delay', 'time'));
  };

  const onBlur = (event: FocusEvent) => {
    if (!open) return;
    const next = event.relatedTarget;
    if (next instanceof Node && wrapperRef.current?.contains(next)) return;
    close();
  };

  return (
    // Le conteneur écoute seulement la sortie du focus du terme et de sa bulle (fermeture, FR-017).
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <span ref={wrapperRef} onBlur={onBlur}>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={bubbleId}
        aria-describedby={descriptionId}
        onClick={onClick}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        className="inline cursor-help rounded-sm text-left underline decoration-dotted decoration-(length:--defined-term-underline-thickness) underline-offset-(--defined-term-underline-offset) outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      >
        {children}
      </button>
      {/* Description « terme défini » hors de l'énoncé (portail) : le nom accessible du titre reste l'énoncé seul. */}
      {mounted ? createPortal(<span id={descriptionId} hidden>{t('definedTerm')}</span>, document.body) : null}
      {open ? (
        // La bulle reçoit le focus au clic (tabIndex -1) pour que la sortie du focus ne la ferme pas.
        <span
          ref={bubbleRef}
          id={bubbleId}
          popover="manual"
          role="dialog"
          aria-labelledby={labelId}
          tabIndex={-1}
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
          className="fixed inset-auto m-0 block max-h-(--defined-term-max-height) overflow-y-auto rounded-md border border-border bg-surface p-4 text-left text-base font-normal tracking-normal text-fg shadow-md outline-none"
        >
          <span className="flex flex-col gap-2">
            <span id={labelId} className="font-semibold break-words">
              {term.label}
            </span>
            <span className="break-words">{term.definition}</span>
            {term.sources.length > 0 ? (
              <span className="text-sm break-words text-fg-muted">
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
              </span>
            ) : null}
            <span className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <a href={glossaryHref} className="rounded-sm text-accent underline underline-offset-4">
                {t('seeGlossary')}
              </a>
              <button
                type="button"
                onClick={() => close(true)}
                className="inline-flex min-h-touch items-center rounded-md border border-border px-3 font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
              >
                {t('close')}
              </button>
            </span>
          </span>
        </span>
      ) : null}
    </span>
  );
}
