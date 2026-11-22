// Construction des jeux publiés (FR-036 à FR-038, R10) : seules les positions connues
// (relues, sourcées, citation retrouvée) y entrent ; aucun contributeur, aucune citation dans main.
// 009 : seule la banque active (R4) est publiée, en règles de sélection 3, avec sa couverture.
import {
  CandidateDetailSchema,
  MainDatasetSchema,
  coverage,
  evidenceCodeFromLevel,
  round3,
  type CandidateDetail,
  type MainDataset,
  type PositionCell,
  type PublishedSource,
} from '@/core/dataset';
import { allPositions, allQuestions } from '../corpus';
import { isKnown, isScaleValue, sourceIndex } from '../positions';
import type { Corpus, Position } from '../schema';
import type { SourceCache } from '../rules/types';
import { DEFAULT_THRESHOLDS } from '../schema';
import { computeActiveBank, type ActiveBank } from './active-bank';

export type BuildOptions = {
  version: number;
  publishedAt: string;
  cache: SourceCache;
  /** Banque active déjà calculée (sinon calculée ici, avec `minCoverage`). */
  activeBank?: ActiveBank;
  minCoverage?: number;
};

function activeBankOf(corpus: Corpus, options: BuildOptions): ActiveBank {
  return options.activeBank ?? computeActiveBank(ctxOf(corpus, options.cache), { minCoverage: options.minCoverage });
}

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
  // 007 : toute nouvelle version déclare l'enjeu ; SUBJECT le garantit en amont.
  for (const q of allQuestions(corpus)) if (q.question.status === 'active' && q.question.subject === undefined) throw new Error(`${q.question.id} : enjeu manquant (règle SUBJECT)`);
  const bank = activeBankOf(corpus, options);
  const declared = corpus.candidates.filter((c) => c.status === 'declared').map((c) => c.id);
  const questions = bank.activeQuestions;

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
    selectionRules: 3,
    minQuestionCoverage: bank.k,
    themes: [...corpus.themes]
      .filter((t) => t.status === 'active')
      .sort((a, b) => a.order - b.order)
      .map((t, i) => ({ id: t.id, label: t.label, description: t.description, axis: { negative: t.axis.negative, positive: t.axis.positive }, order: i })),
    candidates: corpus.candidates
      .filter((c) => c.status === 'declared')
      .map((c) => ({
        id: c.id,
        name: c.name,
        party: c.party,
        status: 'declared' as const,
        coverage: round3(coverage(positions[c.id]!.filter((cell) => cell !== null).length, questions.length)),
      })),
    withdrawn: corpus.candidates
      .filter((c) => c.status === 'withdrawn')
      .map((c) => ({ id: c.id, name: c.name, withdrawnAt: c.statusChangedAt ?? c.history.at(-1)?.at ?? options.publishedAt, criterion: c.statusCriterion ?? c.history.at(-1)?.criterion ?? '' })),
    questions: questions.map((q) => ({
      id: q.id,
      text: q.text,
      themes: [...q.themes],
      polarity: q.polarity,
      discriminant: bank.discriminant.get(q.id)!,
      subject: q.subject!,
      coverage: bank.coverage.get(q.id)!,
    })),
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
  const activeIds = new Set(activeBankOf(corpus, options).active);
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
