// Construction des jeux publiés (FR-036 à FR-038, R10) : seules les positions connues
// (relues, sourcées, citation retrouvée) y entrent ; aucun contributeur, aucune citation dans main.
import {
  CandidateDetailSchema,
  MainDatasetSchema,
  coverage,
  discriminant,
  evidenceCodeFromLevel,
  round3,
  round4,
  type CandidateDetail,
  type MainDataset,
  type PositionCell,
  type PublishedSource,
} from '@/core/dataset';
import { allPositions } from '../corpus';
import { isKnown, isScaleValue, sourceIndex } from '../positions';
import type { Corpus, Position } from '../schema';
import type { SourceCache } from '../rules/types';
import { knownMatrix } from '../stats';
import { DEFAULT_THRESHOLDS } from '../schema';

export type BuildOptions = { version: number; publishedAt: string; cache: SourceCache };

function ctxOf(corpus: Corpus, cache: SourceCache) {
  return { corpus, cache, thresholds: corpus.governance?.thresholds ?? DEFAULT_THRESHOLDS };
}

/** Positions connues d'un candidat, indexées par question. */
function knownPositions(corpus: Corpus, candidateId: string, cache: SourceCache): Map<string, Position> {
  const ctx = ctxOf(corpus, cache);
  const out = new Map<string, Position>();
  for (const { candidate, position } of allPositions(corpus)) {
    if (candidate === candidateId && isScaleValue(position.value) && isKnown(position, ctx)) out.set(position.question, position);
  }
  return out;
}

export function buildMain(corpus: Corpus, options: BuildOptions): MainDataset {
  const governance = corpus.governance;
  if (!governance) throw new Error('governance.yaml absent ou invalide');
  const { declared, active, known } = knownMatrix(ctxOf(corpus, options.cache));
  const questions = [...active].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  const discriminantOf = (questionId: string) =>
    discriminant(
      declared.flatMap((c) => {
        const v = known.get(c)!.get(questionId);
        return v === undefined ? [] : [v];
      }),
      declared.length,
    );

  const positions: Record<string, PositionCell[]> = {};
  for (const c of declared) {
    const row = knownPositions(corpus, c, options.cache);
    positions[c] = questions.map((q) => {
      const p = row.get(q.id);
      return p && isScaleValue(p.value) && p.evidence ? ([p.value, evidenceCodeFromLevel[p.evidence]] as const) : null;
    });
  }

  const main: MainDataset = {
    version: options.version,
    publishedAt: options.publishedAt,
    themes: [...corpus.themes]
      .filter((t) => t.status === 'active')
      .sort((a, b) => a.order - b.order)
      .map((t, i) => ({ id: t.id, label: t.label, description: t.description, axis: { negative: t.axis.negative, positive: t.axis.positive }, order: i })),
    candidates: corpus.candidates
      .filter((c) => c.status === 'declared')
      .map((c) => ({ id: c.id, name: c.name, party: c.party, status: 'declared' as const, coverage: round3(coverage(known.get(c.id)?.size ?? 0, active.length)) })),
    withdrawn: corpus.candidates
      .filter((c) => c.status === 'withdrawn')
      .map((c) => ({ id: c.id, name: c.name, withdrawnAt: c.statusChangedAt ?? c.history.at(-1)?.at ?? options.publishedAt, criterion: c.statusCriterion ?? c.history.at(-1)?.criterion ?? '' })),
    questions: questions.map((q) => ({ id: q.id, text: q.text, themes: [...q.themes], polarity: q.polarity, discriminant: round4(discriminantOf(q.id)) })),
    positions,
    governance: {
      inclusionCriteria: governance.inclusionCriteria.map((c) => ({ ...c })),
      neutralityChecklist: governance.neutralityChecklist.map((c) => ({ ...c })),
      evidenceLevels: governance.evidenceLevels.map((c) => ({ ...c })),
      reportIssueUrl: governance.reportIssueUrl,
    },
  };
  return MainDatasetSchema.parse(main);
}

export function buildDetail(corpus: Corpus, candidateId: string, options: BuildOptions): CandidateDetail {
  const candidate = corpus.candidates.find((c) => c.id === candidateId);
  if (!candidate) throw new Error(`candidat inconnu : ${candidateId}`);
  const index = sourceIndex(corpus);
  const sources: Record<string, PublishedSource> = {};
  const positions: CandidateDetail['positions'] = {};
  const known = knownPositions(corpus, candidateId, options.cache);
  const activeIds = new Set(knownMatrix(ctxOf(corpus, options.cache)).active.map((q) => q.id));
  for (const [question, p] of [...known].sort(([a], [b]) => (a < b ? -1 : 1))) {
    if (!activeIds.has(question) || !isScaleValue(p.value) || !p.evidence) continue;
    positions[question] = {
      value: p.value,
      level: evidenceCodeFromLevel[p.evidence],
      quote: p.quote!,
      quoteSource: p.quoteSource!,
      justification: p.justification!,
      ...(p.old ? { old: true as const } : {}),
      sources: [...p.sources],
    };
    for (const id of p.sources) {
      const s = index.get(id);
      if (!s || sources[id]) continue;
      sources[id] = {
        url: s.url,
        title: s.title,
        kind: s.kind,
        publishedAt: { date: s.publishedAt.date, precision: s.publishedAt.precision },
        accessedAt: s.accessedAt,
        ...(s.archiveUrl ? { archiveUrl: s.archiveUrl } : {}),
      };
    }
  }
  return CandidateDetailSchema.parse({ version: options.version, candidate: { id: candidate.id, name: candidate.name, party: candidate.party }, sources, positions });
}

/** Sérialisation publiée : JSON compact avec fin de ligne finale. */
export function serialize(value: unknown): string {
  return `${JSON.stringify(value)}\n`;
}
