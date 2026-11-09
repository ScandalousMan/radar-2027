// Partage du lien de résultats (R6, contracts/data-and-share.md § 3).
// FR-023, FR-027, FR-030 : copie dans le presse-papiers, repli manuel si elle échoue, partage
// natif facultatif limité au lien et au texte générique. Les API du navigateur sont injectées.
export type CopyOutcome = 'copied' | 'manual';

type ClipboardLike = Pick<Clipboard, 'writeText'>;
type ShareNavigator = Partial<Pick<Navigator, 'share'>>;

function defaultClipboard(): ClipboardLike | null {
  return typeof navigator === 'undefined' ? null : (navigator.clipboard ?? null);
}

function defaultNavigator(): ShareNavigator | null {
  return typeof navigator === 'undefined' ? null : navigator;
}

/** Copie le lien ; toute erreur (API absente, permission refusée) ⇒ `manual`. Ne lève jamais. */
export async function copyLink(url: string, clipboard: ClipboardLike | null | undefined = defaultClipboard()): Promise<CopyOutcome> {
  try {
    if (!clipboard || typeof clipboard.writeText !== 'function') return 'manual';
    await clipboard.writeText(url);
    return 'copied';
  } catch {
    return 'manual';
  }
}

export function canShareNatively(nav: ShareNavigator | null | undefined = defaultNavigator()): boolean {
  return typeof nav?.share === 'function';
}

/** Partage natif ; une annulation (`AbortError`) ou un refus vaut `cancelled`. */
export async function shareNatively(payload: { title: string; text: string; url: string }, nav: ShareNavigator | null | undefined = defaultNavigator()): Promise<'shared' | 'cancelled'> {
  try {
    if (!nav?.share) return 'cancelled';
    await nav.share({ title: payload.title, text: payload.text, url: payload.url });
    return 'shared';
  } catch {
    return 'cancelled';
  }
}
