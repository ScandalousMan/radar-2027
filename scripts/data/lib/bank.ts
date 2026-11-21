// Version de banque construite depuis le corpus (thèmes et questions actifs), sans positions.
// Sert aux règles qui ont besoin du domaine (AXIS-DIM : quotas de 003 FR-021).
import type { BankQuestion, BankTheme, BankVersion } from '@/core/bank';
import type { Corpus } from './schema';

/** Thèmes actifs triés par `order`, questions actives dont le thème principal est actif. */
export function bankFromCorpus(corpus: Corpus): BankVersion {
  const active = corpus.themes.filter((t) => t.status === 'active').sort((a, b) => a.order - b.order);
  const themeIndexById = new Map<string, number>();
  const themes = active.map((t, index): BankTheme => {
    themeIndexById.set(t.id, index);
    return { id: t.id, label: t.label, index };
  });
  const questionById = new Map<string, BankQuestion>();
  const questions: BankQuestion[] = [];
  const all = [...corpus.questions.values()].flat().filter((q) => q.status === 'active');
  all.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  for (const q of all) {
    const themeIndices = q.themes.map((id) => themeIndexById.get(id)).filter((i): i is number => i !== undefined);
    if (themeIndexById.get(q.themes[0]!) === undefined) continue;
    const question: BankQuestion = { id: q.id, text: q.text, themeIndices, discriminant: 0, subject: q.subject ?? null, index: questions.length };
    questions.push(question);
    questionById.set(q.id, question);
  }
  return { version: 0, publishedAt: '', selectionRules: 2, themes, themeIndexById, questions, questionById, candidates: [], positions: new Map() };
}
