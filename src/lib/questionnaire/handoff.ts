// Relais en mémoire entre la page de résultats et le questionnaire (005, R7).
// « Modifier mes réponses » quand le stockage est indisponible (le brouillon ne peut pas être
// écrit) et présélection des sujets restants d'un ancien lien (`choose-themes`). Le relais vit
// dans le module JavaScript, conservé par la navigation côté client : rien n'est mis dans l'URL
// (FR-024) ni dans le stockage, et il est consommé à la première lecture.
import type { Mode } from '@/core';
import type { Draft } from './types';

export type Handoff = { readonly kind: 'draft'; readonly draft: Draft } | { readonly kind: 'preselection'; readonly priorities: readonly string[]; readonly mode: Mode };

let pending: Handoff | null = null;

export function setHandoff(value: Handoff | null): void {
  pending = value;
}

/** Brouillon relayé, consommé ; `null` s'il n'y en a pas. */
export function takeHandoffDraft(): Draft | null {
  if (pending?.kind !== 'draft') return null;
  const { draft } = pending;
  pending = null;
  return draft;
}

/** Présélection relayée, consommée ; `null` s'il n'y en a pas. */
export function takeHandoffPreselection(): { priorities: readonly string[]; mode: Mode } | null {
  if (pending?.kind !== 'preselection') return null;
  const { priorities, mode } = pending;
  pending = null;
  return { priorities, mode };
}
