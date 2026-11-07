'use client';

import type { ReactNode } from 'react';

/**
 * Lien « aller au contenu » : déplace explicitement le focus sur la cible (certains navigateurs
 * ne le font pas pour une ancre), puis met à jour le fragment sans rechargement.
 */
export function SkipLink({ targetId, children }: { targetId: string; children: ReactNode }) {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only z-10 rounded-md bg-accent px-4 py-2 font-medium text-accent-fg focus:not-sr-only focus:absolute focus:top-2 focus:left-2"
      onClick={(event) => {
        const target = document.getElementById(targetId);
        if (!target) return;
        event.preventDefault();
        target.focus();
        if (typeof window !== 'undefined' && window.history?.replaceState) {
          window.history.replaceState(null, '', `#${targetId}`);
        }
      }}
    >
      {children}
    </a>
  );
}
