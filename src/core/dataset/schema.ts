// Schémas Zod des trois fichiers publiés (contracts/published-dataset.md). Les raffinements
// garantissent à la 003 les invariants du contrat : thèmes en ordre canonique, questions triées,
// positions alignées, candidats déclarés seulement, versions contiguës.
import { z } from 'zod';
import type { CandidateDetail, MainDataset, VersionRegistry } from './types';
import { MAX_THEMES, MAX_VERSIONS } from './types';
import { MAX_ACTIVE_QUESTIONS } from '../types';

const Id = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/);
const Day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const Hash = z.string().regex(/^sha256:[0-9a-f]{64}$/);
const Level = z.enum(['programme', 'livre_plateforme', 'declaration_vote']);
const Code = z.enum(['p', 'l', 'd']);
const Scale = z.union([z.literal(-2), z.literal(-1), z.literal(0), z.literal(1), z.literal(2)]);

const DateWithPrecision = z
  .strictObject({ date: z.string(), precision: z.enum(['day', 'month', 'year']) })
  .refine(
    (d) =>
      (d.precision === 'day' && /^\d{4}-\d{2}-\d{2}$/.test(d.date)) ||
      (d.precision === 'month' && /^\d{4}-\d{2}$/.test(d.date)) ||
      (d.precision === 'year' && /^\d{4}$/.test(d.date)),
    { message: 'date incohérente avec sa précision' },
  );

export const GovernanceSchema = z.strictObject({
  inclusionCriteria: z.array(z.strictObject({ id: Id, kind: z.enum(['inclusion', 'withdrawal']), text: z.string().min(1) })),
  neutralityChecklist: z.array(z.strictObject({ id: Id, text: z.string().min(1) })),
  evidenceLevels: z.array(z.strictObject({ id: Level, label: z.string().min(1), definition: z.string().min(1) })),
  reportIssueUrl: z.url().refine((u) => u.includes('{title}'), { message: 'reportIssueUrl doit contenir {title}' }),
});

const PositionCell = z.union([z.null(), z.tuple([Scale, Code]).readonly()]);

export const MainDatasetSchema: z.ZodType<MainDataset> = z
  .strictObject({
    version: z.int().min(1).max(MAX_VERSIONS),
    publishedAt: Day,
    selectionRules: z.union([z.literal(2), z.literal(3)]).optional(),
    minQuestionCoverage: z.int().min(1).optional(),
    themes: z
      .array(
        z.strictObject({
          id: Id,
          label: z.string().min(1),
          description: z.string(),
          axis: z.strictObject({ negative: z.string().min(1), positive: z.string().min(1) }),
          order: z.int().min(0),
        }),
      )
      .max(MAX_THEMES),
    candidates: z.array(
      z.strictObject({
        id: Id,
        name: z.string().min(1),
        party: z.string().min(1),
        status: z.literal('declared'),
        coverage: z.number().min(0).max(1),
      }),
    ),
    withdrawn: z.array(z.strictObject({ id: Id, name: z.string().min(1), withdrawnAt: Day, criterion: Id })),
    questions: z.array(
      z.strictObject({
        id: Id,
        text: z.string().min(1),
        themes: z.array(Id).min(1).max(2),
        polarity: z.enum(['+', '-']),
        discriminant: z.number().min(0).max(2),
        subject: Id.optional(),
        coverage: z.int().min(0).optional(),
      }),
    ),
    positions: z.record(Id, z.array(PositionCell)),
    governance: GovernanceSchema,
  })
  .superRefine((ds, ctx) => {
    ds.themes.forEach((t, i) => {
      if (t.order !== i) ctx.addIssue({ code: 'custom', path: ['themes', i, 'order'], message: `ordre ${t.order} attendu ${i} (contigu depuis 0)` });
    });
    for (let i = 1; i < ds.questions.length; i++) {
      const prev = ds.questions[i - 1]!.id;
      const cur = ds.questions[i]!.id;
      if (!(prev < cur)) ctx.addIssue({ code: 'custom', path: ['questions', i, 'id'], message: `questions non triées par id (${prev} ≥ ${cur})` });
    }
    const themeIds = new Set(ds.themes.map((t) => t.id));
    const rules3 = ds.selectionRules === 3;
    // 009 : minimum de couverture et plafond de la banque active, seulement en règles 3.
    if (rules3 && ds.minQuestionCoverage === undefined) ctx.addIssue({ code: 'custom', path: ['minQuestionCoverage'], message: 'minQuestionCoverage absent (selectionRules 3)' });
    if (!rules3 && ds.minQuestionCoverage !== undefined) ctx.addIssue({ code: 'custom', path: ['minQuestionCoverage'], message: 'minQuestionCoverage sans selectionRules 3' });
    if (rules3 && ds.questions.length > MAX_ACTIVE_QUESTIONS)
      ctx.addIssue({ code: 'custom', path: ['questions'], message: `${ds.questions.length} questions > ${MAX_ACTIVE_QUESTIONS} (selectionRules 3)` });
    ds.questions.forEach((q, i) => {
      // 007 : forme cohérente, jamais mixte (contrat published-dataset-delta).
      if (ds.selectionRules !== undefined && q.subject === undefined) ctx.addIssue({ code: 'custom', path: ['questions', i, 'subject'], message: `enjeu absent (selectionRules ${ds.selectionRules})` });
      if (ds.selectionRules === undefined && q.subject !== undefined) ctx.addIssue({ code: 'custom', path: ['questions', i, 'subject'], message: 'enjeu sans selectionRules 2' });
      if (rules3 && q.coverage === undefined) ctx.addIssue({ code: 'custom', path: ['questions', i, 'coverage'], message: 'couverture absente (selectionRules 3)' });
      if (!rules3 && q.coverage !== undefined) ctx.addIssue({ code: 'custom', path: ['questions', i, 'coverage'], message: 'couverture sans selectionRules 3' });
      if (rules3 && q.coverage !== undefined) {
        // Cases non `null` de la colonne : une position neutre (0) compte, seule l'inconnue ne compte pas.
        let known = 0;
        for (const c of ds.candidates) if (ds.positions[c.id]?.[i] != null) known++;
        if (q.coverage !== known) ctx.addIssue({ code: 'custom', path: ['questions', i, 'coverage'], message: `couverture ${q.coverage} attendue ${known}` });
      }
      for (const t of q.themes) if (!themeIds.has(t)) ctx.addIssue({ code: 'custom', path: ['questions', i, 'themes'], message: `thème inconnu ${t}` });
    });
    const candidateIds = new Set(ds.candidates.map((c) => c.id));
    for (const c of ds.candidates) {
      const row = ds.positions[c.id];
      if (!row) ctx.addIssue({ code: 'custom', path: ['positions', c.id], message: `positions absentes pour ${c.id}` });
      else if (row.length !== ds.questions.length)
        ctx.addIssue({ code: 'custom', path: ['positions', c.id], message: `${row.length} cases pour ${ds.questions.length} questions` });
    }
    for (const id of Object.keys(ds.positions)) {
      if (!candidateIds.has(id)) ctx.addIssue({ code: 'custom', path: ['positions', id], message: `positions d’un candidat non inclus : ${id}` });
    }
  });

export const CandidateDetailSchema: z.ZodType<CandidateDetail> = z.strictObject({
  version: z.int().min(1).max(MAX_VERSIONS),
  candidate: z.strictObject({ id: Id, name: z.string().min(1), party: z.string().min(1) }),
  sources: z.record(
    Id,
    z.strictObject({
      url: z.url(),
      title: z.string().min(1),
      kind: Level,
      publishedAt: DateWithPrecision,
      accessedAt: Day,
      archiveUrl: z.url().optional(),
    }),
  ),
  positions: z.record(
    Id,
    z.strictObject({
      value: Scale,
      level: Code,
      quote: z.string().min(1),
      quoteSource: Id,
      justification: z.string().min(1),
      old: z.literal(true).optional(),
      sources: z.array(Id).min(1),
    }),
  ),
});

export const VersionRegistrySchema: z.ZodType<VersionRegistry> = z
  .strictObject({
    current: z.int().min(0).max(MAX_VERSIONS),
    versions: z
      .array(
        z.strictObject({
          number: z.int().min(1),
          publishedAt: Day,
          questionCount: z.int().min(0),
          candidateCount: z.int().min(0),
          mainHash: Hash,
          detailHashes: z.record(Id, Hash),
        }),
      )
      .max(MAX_VERSIONS),
  })
  .superRefine((r, ctx) => {
    r.versions.forEach((v, i) => {
      if (v.number !== i + 1) ctx.addIssue({ code: 'custom', path: ['versions', i, 'number'], message: `numéro ${v.number} attendu ${i + 1}` });
    });
    if (r.current !== r.versions.length)
      ctx.addIssue({ code: 'custom', path: ['current'], message: `current ${r.current} attendu ${r.versions.length}` });
  });
