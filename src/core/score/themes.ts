// Scores de thème (FR-003, FR-004, FR-013).
// Chaque question compte dans chacun de ses thèmes ; un thème est indéfini sous 2 questions
// exploitables. En mode court, les thèmes non prioritaires forment un pseudo-thème `others`
// où chaque question n'est comptée qu'une fois.
import type { BankVersion } from '../bank';
import { mean, type Ratio } from '../ratio';
import type { Selection } from '../selection';
import { MIN_THEME_QUESTIONS, type Mode } from '../types';
import { signedScore } from './concordance';
import type { QuestionScore, Score, ThemeScore } from './types';

function scoreOf(values: readonly Ratio[]): Score | null {
  return values.length >= MIN_THEME_QUESTIONS ? signedScore(mean(values)) : null;
}

export function themeScores(
  bank: BankVersion,
  selection: Selection,
  mode: Mode,
  priority: ReadonlySet<number>,
  perQuestion: readonly QuestionScore[],
): readonly ThemeScore[] {
  const byTheme: Ratio[][] = bank.themes.map(() => []);
  const others: Ratio[] = [];
  perQuestion.forEach((qs, i) => {
    if (!('concordance' in qs)) return;
    const themes = selection.items[i]!.question.themeIndices;
    for (const t of themes) byTheme[t]!.push(qs.concordance);
    if (themes.some((t) => !priority.has(t))) others.push(qs.concordance);
  });

  const themeEntry = (t: number): ThemeScore => ({
    kind: 'theme',
    themeIndex: t,
    themeId: bank.themes[t]!.id,
    priority: priority.has(t),
    count: byTheme[t]!.length,
    score: scoreOf(byTheme[t]!),
  });

  if (mode === 'full') return bank.themes.map((t) => themeEntry(t.index));
  const prio = [...priority].sort((a, b) => a - b).map(themeEntry);
  return [...prio, { kind: 'others', count: others.length, score: scoreOf(others) }];
}
