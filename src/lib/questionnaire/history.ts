'use client';
// Historique du navigateur entre questions (contracts/routes-and-state.md § Historique, R2).
// Cas limite « bouton précédent du navigateur » : revenir à la question précédente sans perte,
// sans jamais modifier l'URL (FR-022). Le routeur Next fusionne son état interne dans `history.state`.
import { useEffect, useRef } from 'react';

type RadarState = { radar?: { position?: unknown } };

function stateWith(position: number): Record<string, unknown> {
  const current = (typeof window.history.state === 'object' && window.history.state) || {};
  return { ...current, radar: { position } };
}

export function useQuestionHistory(position: number, onPopPosition: (position: number) => void): void {
  const last = useRef<number | null>(null);
  const fromPop = useRef(false);
  const onPop = useRef(onPopPosition);

  useEffect(() => {
    onPop.current = onPopPosition;
  }, [onPopPosition]);

  useEffect(() => {
    if (last.current === null) {
      window.history.replaceState(stateWith(position), '', window.location.href);
      last.current = position;
      return;
    }
    if (position === last.current) return;
    last.current = position;
    if (fromPop.current) {
      fromPop.current = false;
      return;
    }
    window.history.pushState(stateWith(position), '', window.location.href);
  }, [position]);

  useEffect(() => {
    const listener = (event: PopStateEvent) => {
      const p = (event.state as RadarState | null)?.radar?.position;
      if (typeof p !== 'number') return;
      fromPop.current = true;
      onPop.current(p);
    };
    window.addEventListener('popstate', listener);
    return () => window.removeEventListener('popstate', listener);
  }, []);
}
