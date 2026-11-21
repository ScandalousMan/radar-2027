// SUBJECT (spec 007 FR-001 à FR-005, data-model § 5) : l'enjeu de chaque question.
// Erreur : une question active sans enjeu (les règles de sélection 2 l'exigent).
// Avertissements : un thème dont les enjeux distincts sont moins nombreux que le quota maximal
// qu'il peut recevoir (la liste reste à N grâce au second passage, d'où un avertissement), et un
// avertissement informatif par enjeu partagé, pour que le rapport liste les regroupements.
import { BankError, type BankVersion } from '@/core/bank';
import { bankFromCorpus } from '../bank';
import { allQuestions } from '../corpus';
import { maxPriorityQuota } from './AXIS-DIM';
import { violation, warning, type Rule, type Violation } from './types';

export const SUBJECT: Rule = {
  code: 'SUBJECT',
  run({ corpus }) {
    const out: Violation[] = [];
    const active = allQuestions(corpus)
      .map(({ question }) => question)
      .filter((q) => q.status === 'active');

    for (const q of active) {
      if (q.subject === undefined) out.push(violation('SUBJECT', 'question', q.id, `${q.id} : enjeu manquant (champ subject)`));
    }

    const bySubject = new Map<string, string[]>();
    for (const q of active) {
      if (q.subject === undefined) continue;
      bySubject.set(q.subject, [...(bySubject.get(q.subject) ?? []), q.id]);
    }
    for (const [subject, questionIds] of [...bySubject].sort((a, b) => (a[0] < b[0] ? -1 : 1))) {
      if (questionIds.length >= 2) out.push(warning('SUBJECT', 'bank', subject, `enjeu ${subject} partagé par ${questionIds.length} questions : ${questionIds.join(', ')}`));
    }

    let bank: BankVersion | undefined;
    for (const theme of corpus.themes) {
      if (theme.status !== 'active') continue;
      const own = active.filter((q) => q.subject !== undefined && q.themes.includes(theme.id));
      if (own.length === 0) continue; // THEME-EMPTY
      bank ??= bankFromCorpus(corpus);
      const t = bank.themeIndexById.get(theme.id);
      if (t === undefined) continue;
      let quota: number;
      try {
        quota = maxPriorityQuota(bank, t);
      } catch (error) {
        if (error instanceof BankError) continue; // trop de thèmes pour les quotas : signalé ailleurs
        throw error;
      }
      const distinct = new Set(own.map((q) => q.subject)).size;
      if (distinct < quota)
        out.push(warning('SUBJECT', 'theme', theme.id, `${theme.id} : ${distinct} enjeux distincts, quota maximal ${quota} (les questions manquantes viendront du second passage)`));
    }
    return out;
  },
};
