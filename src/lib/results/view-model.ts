// Projection d'affichage du classement (data-model.md § 2, § 4, § 7 ; R3).
// FR-001, FR-002, FR-004, FR-007, FR-008, FR-011 à FR-019, FR-033 : le rang, l'ordre, la bande
// et les pourcentages viennent tels quels du `Scoreboard` du cœur ; ce module trie pour
// l'affichage, compte et traduit des identifiants, sans recalculer aucun score (principe III).
import { evidenceLevelFromCode, type CandidateScore, type PositionCell, type QuestionScore, type ThemeScore } from '@/core';
import { agreementOf } from './agreement';
import {
  OTHERS_KEY,
  type CandidateSheet,
  type ComparisonView,
  type InsufficientRow,
  type QuestionGroup,
  type QuestionRow,
  type RankingRow,
  type ReadyData,
  type ResultsView,
  type SkippedRow,
  type ThemeKey,
  type ThemeRow,
} from './types';

function allScores(data: ReadyData): readonly CandidateScore[] {
  return [...data.board.ranked, ...data.board.insufficient];
}

function isWithdrawn(data: ReadyData, id: string): boolean {
  return data.prior !== null && data.prior.withdrawnIds.includes(id);
}

/** Vrai si un autre candidat classé partage le rang (FR-004). */
function isTied(data: ReadyData, score: CandidateScore): boolean {
  return score.rank !== null && data.board.ranked.some((other) => other !== score && other.rank === score.rank);
}

function themeLabel(data: ReadyData, index: number): string {
  return data.themes[index]?.label ?? data.bank.themes[index]!.label;
}

function priorityIndices(data: ReadyData): readonly number[] {
  return data.state.priorities.map((id) => data.bank.themeIndexById.get(id)!).sort((a, b) => a - b);
}

/** Lignes de thème dans l'ordre FR-011 : sujets clés (canonique), puis les autres (ou `others`). */
export function orderedThemeKeys(data: ReadyData): readonly ThemeKey[] {
  const prio = priorityIndices(data);
  const prioIds = prio.map((i) => data.bank.themes[i]!.id);
  if (data.state.mode === 'short') return [...prioIds, OTHERS_KEY];
  const others = data.bank.themes.filter((t) => !prio.includes(t.index)).map((t) => t.id);
  return [...prioIds, ...others];
}

export function resultsView(data: ReadyData): ResultsView {
  const { board, state } = data;
  const ranking: RankingRow[] = board.ranked.map((s) => ({
    candidateId: s.candidate.id,
    name: s.candidate.name,
    rank: s.rank!,
    tied: isTied(data, s),
    percent: s.global!.percent,
    band: s.band!,
    withdrawn: isWithdrawn(data, s.candidate.id),
  }));
  const insufficient: InsufficientRow[] = board.insufficient.map((s) => ({
    candidateId: s.candidate.id,
    name: s.candidate.name,
    unknown: board.answeredCount - (s.coverage?.known ?? 0),
    answered: board.answeredCount,
    withdrawn: isWithdrawn(data, s.candidate.id),
  }));
  return {
    header: {
      priorities: priorityIndices(data).map((i) => themeLabel(data, i)),
      mode: state.mode,
      answeredCount: board.answeredCount,
      totalCount: state.answers.length,
    },
    ranking,
    insufficient,
    noneRanked: ranking.length === 0,
    prior: data.prior ? { publishedAt: data.prior.publishedAt, withdrawnCount: data.prior.withdrawnIds.length } : null,
  };
}

function keyOf(theme: ThemeScore): ThemeKey {
  return theme.kind === 'others' ? OTHERS_KEY : theme.themeId;
}

/** Thèmes de la question comptés dans une ligne : le thème lui-même, ou tout thème non prioritaire pour `others`. */
function questionInRow(data: ReadyData, questionId: string, key: ThemeKey, prio: readonly number[]): boolean {
  const indices = data.bank.questionById.get(questionId)!.themeIndices;
  if (key === OTHERS_KEY) return indices.some((t) => !prio.includes(t));
  return indices.includes(data.bank.themeIndexById.get(key)!);
}

function themeRows(data: ReadyData, score: CandidateScore): ThemeRow[] {
  const prio = priorityIndices(data);
  const byKey = new Map(score.themes.map((t) => [keyOf(t), t]));
  return orderedThemeKeys(data).map((key) => {
    const theme = byKey.get(key)!;
    const answered = score.questions.filter((q) => typeof q.answer === 'number' && questionInRow(data, q.questionId, key, prio)).length;
    return {
      key,
      label: key === OTHERS_KEY ? '' : themeLabel(data, data.bank.themeIndexById.get(key)!),
      priority: theme.kind === 'theme' && theme.priority,
      percent: theme.score?.percent ?? null,
      known: theme.count,
      answered,
    };
  });
}

function cellValue(cell: PositionCell) {
  return cell === null ? { position: null, evidence: null } : { position: cell[0], evidence: evidenceLevelFromCode[cell[1]] };
}

function labelsOf(data: ReadyData, questionId: string): string[] {
  return data.bank.questionById.get(questionId)!.themeIndices.map((i) => themeLabel(data, i));
}

function questionRow(data: ReadyData, q: QuestionScore): QuestionRow {
  const text = data.bank.questionById.get(q.questionId)!.text;
  const answer = q.answer as QuestionRow['answer'];
  if ('concordance' in q) {
    return { questionId: q.questionId, text, themeLabels: labelsOf(data, q.questionId), answer, position: q.candidatePosition![0], agreement: agreementOf(q.concordance), evidence: evidenceLevelFromCode[q.level] };
  }
  return { questionId: q.questionId, text, themeLabels: labelsOf(data, q.questionId), answer, position: null, agreement: null, evidence: null };
}

/** Ligne de regroupement d'une question : son thème principal, ou `others` s'il n'a pas de ligne propre. */
function groupKeyOf(data: ReadyData, questionId: string, keys: readonly ThemeKey[]): ThemeKey {
  const primary = data.bank.themes[data.bank.questionById.get(questionId)!.themeIndices[0]!]!.id;
  return keys.includes(primary) ? primary : OTHERS_KEY;
}

export function candidateSheet(data: ReadyData, candidateId: string): CandidateSheet | null {
  const score = allScores(data).find((s) => s.candidate.id === candidateId);
  if (!score) return null;
  const themes = themeRows(data, score);
  const keys = themes.map((t) => t.key);
  const answered = score.questions.filter((q) => typeof q.answer === 'number');
  const groups: QuestionGroup[] = themes
    .map((t) => ({
      key: t.key,
      label: t.label,
      priority: t.priority,
      questions: answered.filter((q) => groupKeyOf(data, q.questionId, keys) === t.key).map((q) => questionRow(data, q)),
    }))
    .filter((g) => g.questions.length > 0);
  const skipped: SkippedRow[] = score.questions
    .filter((q) => q.answer === 'skipped')
    .map((q) => ({ questionId: q.questionId, text: data.bank.questionById.get(q.questionId)!.text, themeLabels: labelsOf(data, q.questionId), ...cellValue(q.candidatePosition) }));
  return {
    candidateId,
    name: score.candidate.name,
    party: score.candidate.party,
    status: score.status,
    rank: score.rank,
    tied: isTied(data, score),
    band: score.band,
    percent: score.status === 'ranked' ? score.global!.percent : null,
    withdrawn: isWithdrawn(data, candidateId),
    themes,
    groups,
    skipped,
    unansweredCount: score.questions.filter((q) => q.answer === 'unanswered').length,
  };
}

/** Comparaison de 2 à 3 candidats ; l'emplacement de série suit l'ordre d'ajout (FR-019, FR-039). */
export function comparisonView(data: ReadyData, ids: readonly string[]): ComparisonView {
  const sheets = ids.map((id) => candidateSheet(data, id)).filter((s): s is CandidateSheet => s !== null).slice(0, 3);
  const columns = sheets.map((s, i) => ({ candidateId: s.candidateId, name: s.name, slot: (i + 1) as 1 | 2 | 3, global: s.percent }));
  const template = sheets[0]?.themes ?? [];
  const rows = template.map((t, r) => ({ key: t.key, label: t.label, priority: t.priority, values: sheets.map((s) => s.themes[r]!.percent) }));
  return { columns, rows };
}
