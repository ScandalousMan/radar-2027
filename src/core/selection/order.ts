// Ordre de présentation en tourniquet sur les thèmes d'ancrage (FR-025, FR-026).
// À chaque tour, chaque thème ayant encore des questions livre la suivante (`D_q` décroissant
// puis identifiant) ; les thèmes épuisés sont sautés.
import { byDiscriminant, type Picked } from './fill';
import type { SelectedQuestion } from './types';

export function roundRobin(picked: readonly Picked[], rotation: readonly number[]): readonly SelectedQuestion[] {
  const queues = new Map<number, Picked[]>(rotation.map((t) => [t, []]));
  for (const p of picked) queues.get(p.anchorThemeIndex)!.push(p);
  for (const q of queues.values()) q.sort((a, b) => byDiscriminant(a.question, b.question));

  const items: SelectedQuestion[] = [];
  for (let round = 0; items.length < picked.length; round++) {
    for (const t of rotation) {
      const p = queues.get(t)![round];
      if (p) items.push({ question: p.question, anchorThemeIndex: p.anchorThemeIndex, position: items.length, pass: p.pass });
    }
  }
  return items;
}
