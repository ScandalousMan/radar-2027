// Remplissage des quotas par enjeu et par ancrage (règles de sélection 2, spec 007).
// Renvois : FR-008 (une question n'est éligible que si son enjeu est libre), FR-009 et FR-010
// (une question ne crédite que son thème d'ancrage, les quotas s'appliquent à l'ancrage),
// FR-011 (second passage par tours d'une question par thème), FR-012 (déterminisme, N ou épuisement).
// Règles 3 (009 R1) : même algorithme, seul l'ordre de préférence dans un thème change (`byCoverage`).
// Pur et déterministe : lit `themeIndices`, `discriminant`, `coverage`, `subject` et `id` des questions.
import type { BankQuestion, BankVersion } from '../bank';
import { byDiscriminant, questionsByTheme, rotationOrder, type Picked, type QuestionComparator } from './fill';

export function fillQuotasBySubject(
  bank: BankVersion,
  quotas: readonly number[],
  priorityIndices: readonly number[],
  target: number,
  compare: QuestionComparator = byDiscriminant,
): readonly Picked[] {
  const byTheme = questionsByTheme(bank, compare);
  const rotation = rotationOrder(bank.themes.length, priorityIndices);
  const selected = new Set<string>();
  const usedSubjects = new Set<string>();
  const anchored = bank.themes.map(() => 0);
  const cursor = bank.themes.map(() => 0);
  const picked: Picked[] = [];

  const subjectOf = (q: BankQuestion) => q.subject ?? q.id;
  const eligible = (q: BankQuestion) => !selected.has(q.id) && !usedSubjects.has(subjectOf(q));

  /** Meilleure question éligible du thème ; l'éligibilité ne fait que se perdre, le curseur avance donc sans retour. */
  const best = (t: number): BankQuestion | undefined => {
    const list = byTheme[t]!;
    while (cursor[t]! < list.length && !eligible(list[cursor[t]!]!)) cursor[t]! += 1;
    return list[cursor[t]!];
  };

  const take = (question: BankQuestion, anchorThemeIndex: number, pass: 1 | 2) => {
    selected.add(question.id);
    usedSubjects.add(subjectOf(question));
    anchored[anchorThemeIndex]! += 1;
    picked.push({ question, anchorThemeIndex, pass });
  };

  // Premier passage : le quota de chaque thème en questions ancrées sur lui.
  for (const t of rotation) {
    while (anchored[t]! < quotas[t]! && picked.length < target) {
      const q = best(t);
      if (!q) break;
      take(q, t, 1);
    }
  }

  // Second passage : tours d'une question par thème, dans l'ordre de rotation.
  let progress = true;
  while (progress && picked.length < target) {
    progress = false;
    for (const t of rotation) {
      if (picked.length >= target) break;
      const q = best(t);
      if (q) {
        take(q, t, 2);
        progress = true;
      }
    }
  }

  return picked;
}
