// Différences entre un jeu candidat et la version courante (FR-039) : questions, candidats,
// positions, thèmes et gouvernance ; `null` si le contenu est identique (hors numéro et date).
import type { MainDataset } from '@/core/dataset';

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

export function diffAgainstCurrent(candidate: MainDataset, current: MainDataset | null): string[] | null {
  if (!current) return ['première version : aucune version publiée'];
  const out: string[] = [];
  const qa = new Map(current.questions.map((q) => [q.id, q]));
  const qb = new Map(candidate.questions.map((q) => [q.id, q]));
  const added = [...qb.keys()].filter((id) => !qa.has(id));
  const removed = [...qa.keys()].filter((id) => !qb.has(id));
  if (added.length) out.push(`questions ajoutées (${added.length}) : ${added.join(', ')}`);
  if (removed.length) out.push(`questions retirées (${removed.length}) : ${removed.join(', ')}`);
  const changed = [...qb.keys()].filter((id) => qa.has(id) && !same({ ...qa.get(id), discriminant: 0 }, { ...qb.get(id), discriminant: 0 }));
  if (changed.length) out.push(`questions modifiées (${changed.length}) : ${changed.join(', ')}`);

  const ca = new Set(current.candidates.map((c) => c.id));
  const cb = new Set(candidate.candidates.map((c) => c.id));
  const cAdded = [...cb].filter((id) => !ca.has(id));
  const cRemoved = [...ca].filter((id) => !cb.has(id));
  if (cAdded.length) out.push(`candidats ajoutés : ${cAdded.join(', ')}`);
  if (cRemoved.length) out.push(`candidats retirés : ${cRemoved.join(', ')}`);
  const cChanged = candidate.candidates.filter((c) => {
    const old = current.candidates.find((o) => o.id === c.id);
    return old && (old.name !== c.name || old.party !== c.party);
  });
  if (cChanged.length) out.push(`candidats modifiés : ${cChanged.map((c) => c.id).join(', ')}`);

  for (const c of candidate.candidates) {
    if (!ca.has(c.id)) continue;
    const before = new Map(current.questions.map((q, i) => [q.id, current.positions[c.id]?.[i] ?? null]));
    let n = 0;
    candidate.questions.forEach((q, i) => {
      if (!same(before.get(q.id) ?? null, candidate.positions[c.id]?.[i] ?? null)) n++;
    });
    if (n) out.push(`positions changées pour ${c.id} : ${n}`);
  }
  if (!same(current.themes, candidate.themes)) out.push('thèmes modifiés');
  if (!same(current.withdrawn, candidate.withdrawn)) out.push('candidats retirés (liste) modifiée');
  if (!same(current.governance, candidate.governance)) out.push('gouvernance modifiée');
  return out.length ? out : null;
}
