// Schémas du corpus de preuves `data/recherche/` (spec 008, data-model.md §1 à §4).
// Jamais publié, jamais scoré. Les schémas vérifient la **forme** (objets stricts, listes
// fermées) ; les contrôles croisés (champ requis selon un autre champ, renvois, dates) sont
// portés par les règles `RECH-*`, pour que l'élément soit chargé et la faute désignée.
import { z } from 'zod';
import { DateWithPrecisionSchema, DaySchema, IdSchema } from './common';

export const CANDIDACY_STATUSES = [
  'DECLARED',
  'INTENTION_EXPRESSED',
  'POTENTIAL',
  'ATTEMPTED',
  'WITHDRAWN',
  'DEFEATED_IN_SELECTION_PROCESS',
  'REPORTED_UNCONFIRMED',
  'NOT_A_CANDIDATE',
] as const;
export const CandidacyStatusValueSchema = z.enum(CANDIDACY_STATUSES);

export const QuoteStatusSchema = z.enum(['VERIFIED_QUOTE', 'UNVERIFIED_QUOTE', 'PARAPHRASE', 'SOURCE_INACCESSIBLE']);

export const SourceQualitySchema = z.enum(['A_PRIMARY_VERIFIED', 'B_RELIABLE_SECONDARY', 'C_CONTEXTUAL_ONLY', 'D_UNVERIFIED_OR_INACCESSIBLE']);

export const AttributionSchema = z.enum([
  'PERSONAL_DIRECT',
  'PERSONAL_DOCUMENT',
  'PERSONAL_ACTION',
  'PARTY_POSITION',
  'PARLIAMENTARY_GROUP_POSITION',
  'GOVERNMENT_POSITION',
  'COALITION_POSITION',
  'THIRD_PARTY_ATTRIBUTION',
  'UNKNOWN_ATTRIBUTION',
]);

export const AttributionConfidenceSchema = z.enum(['HIGH', 'MEDIUM', 'LOW', 'UNCONFIRMED']);

export const QualificationSchema = z.enum([
  'EXPLICIT_SUPPORT',
  'EXPLICIT_OPPOSITION',
  'QUALIFIED_SUPPORT',
  'QUALIFIED_OPPOSITION',
  'CONDITIONAL_POSITION',
  'AMBIGUOUS',
  'CONTRADICTORY_EVIDENCE',
  'NO_DIRECT_EVIDENCE',
]);

export const TemporalRelevanceSchema = z.enum(['CURRENT', 'DATED', 'HISTORICAL', 'UNDETERMINED']);

export const TranscriptSchema = z.enum(['official', 'manual', 'automatic']);

export const LocatorKindSchema = z.enum(['timestamp', 'page', 'article', 'amendment', 'paragraph', 'passage']);

export const ResearchModeSchema = z.enum(['PERSONALITY', 'COMPARISON', 'THEMATIC', 'GLOBAL_ENRICHMENT', 'ADVERSARIAL_AUDIT']);

/** Catégories de sources (FR-028, data-model §3.1). */
export const SourceCategorySchema = z.enum([
  'PERSONAL_SITE',
  'CAMPAIGN_SITE',
  'PARTY_SITE',
  'ASSEMBLEE_NATIONALE',
  'SENAT',
  'PARLIAMENTARY_ARCHIVES',
  'EUROPEAN_PARLIAMENT',
  'GOVERNMENT',
  'SPEECHES_PRESS_CONFERENCES',
  'FULL_INTERVIEWS',
  'TV_RADIO_DEBATES',
  'ORIGINAL_VIDEOS',
  'SOCIAL_MEDIA',
  'HISTORICAL_ARCHIVES',
  'NATIONAL_MEDIA',
  'REGIONAL_MEDIA',
  'PRESS_AGENCIES',
  'SPECIALIZED_PUBLICATIONS',
  'ACADEMIC',
  'FACT_CHECKING',
  'EXISTING_CORPUS',
]);

/** Lacunes documentaires (FR-037, data-model §3.2). */
export const GapKindSchema = z.enum([
  'NO_PERSONAL_POSITION',
  'PARTY_POSITION_ONLY',
  'HISTORICAL_ONLY',
  'PRIMARY_INACCESSIBLE',
  'REPORTED_UNVERIFIABLE',
  'CANDIDACY_UNCERTAIN',
  'CONTRADICTORY_SOURCES',
  'UNKNOWN_DATE',
  'NO_OPPOSING_EVIDENCE',
  'NOT_FOUND',
]);

export const SignalKindSchema = z.enum(['POSITION_REVIEW', 'QUOTE_DISCREPANCY', 'CANDIDATE_STATUS', 'POSSIBLE_DUPLICATE', 'UNRESOLVED_CONTRADICTION']);

export const JournalStateSchema = z.enum(['completed', 'interrupted']);

export const SignalStateSchema = z.enum(['open', 'resolved']);

/** Texte libre ; un scalaire YAML non textuel (nombre, booléen) est ramené à sa forme écrite. */
const looseText = z.union([z.string(), z.number(), z.boolean()]).transform((v) => String(v));

// ── §1 Personnalité ─────────────────────────────────────────────────────────

export const CandidacyStatusSchema = z.strictObject({
  status: CandidacyStatusValueSchema,
  at: DateWithPrecisionSchema,
  observedAt: DaySchema,
  /** Preuves `CANDIDACY` ; au moins une est exigée par `RECH-STATUS`. */
  evidence: z.array(IdSchema),
  note: z.string().optional(),
});

export const PersonalitySchema = z.strictObject({
  id: IdSchema,
  name: z.string().min(1),
  party: z.string(),
  aliases: z.array(z.string().min(1)).optional(),
  statuses: z.array(CandidacyStatusSchema).min(1),
  createdAt: DaySchema,
  updatedAt: DaySchema,
});

// ── §2 Preuve ───────────────────────────────────────────────────────────────

export const LocatorSchema = z.strictObject({ kind: LocatorKindSchema, value: looseText.pipe(z.string().min(1)) });

export const UnregisteredSourceSchema = z.strictObject({
  url: z.url(),
  title: z.string().min(1),
  publisher: z.string().min(1),
  reason: z.string().min(1),
});

export const RationaleSchema = z.strictObject({
  sourceQuality: z.string().optional(),
  quote: z.string().optional(),
  attribution: z.string().optional(),
  interpretation: z.string().optional(),
  temporalRelevance: z.string().optional(),
});

export const CorroborationSchema = z.strictObject({
  source: IdSchema,
  locator: LocatorSchema.optional(),
  quoteStatus: QuoteStatusSchema,
  verifiedAt: DaySchema,
  journal: IdSchema,
  note: z.string().optional(),
});

export const EvidenceHistoryEntrySchema = z.strictObject({
  at: DaySchema,
  field: z.string().min(1),
  previous: looseText,
  reason: z.string().min(1),
  journal: IdSchema,
});

export const StatedAtSchema = z.union([z.literal('unknown'), DateWithPrecisionSchema]);

export const EvidenceSchema = z.strictObject({
  id: IdSchema,
  personality: IdSchema,
  kind: z.enum(['POSITION', 'CANDIDACY']),
  theme: IdSchema.optional(),
  question: IdSchema.optional(),
  qualification: QualificationSchema.optional(),
  candidacyStatus: CandidacyStatusValueSchema.optional(),
  journal: IdSchema,
  quoteStatus: QuoteStatusSchema,
  quote: z.string().optional(),
  paraphrase: z.string().optional(),
  speaker: z.string().min(1),
  transcript: TranscriptSchema.optional(),
  context: z.string().min(1),
  verificationNotes: z.string().optional(),
  source: IdSchema.optional(),
  unregisteredSource: UnregisteredSourceSchema.optional(),
  /** Piste qui a mené à la source primaire (009 R8) ; peut être un agrégateur, jamais une source. */
  lead: z.strictObject({ url: z.url(), title: z.string().min(1) }).optional(),
  publisher: z.string().min(1),
  locator: LocatorSchema.optional(),
  sourceQuality: SourceQualitySchema,
  attribution: AttributionSchema,
  attributionConfidence: AttributionConfidenceSchema,
  actionScope: z.string().optional(),
  temporalRelevance: TemporalRelevanceSchema,
  period: z.string().optional(),
  rationale: RationaleSchema.optional(),
  statedAt: StatedAtSchema,
  publishedAt: DateWithPrecisionSchema.optional(),
  researchedAt: DaySchema,
  verifiedAt: DaySchema,
  corroborations: z.array(CorroborationSchema).optional(),
  history: z.array(EvidenceHistoryEntrySchema).optional(),
  createdAt: DaySchema,
  updatedAt: DaySchema,
});

// ── §3 Journal ──────────────────────────────────────────────────────────────

export const GapSchema = z.strictObject({
  kind: GapKindSchema,
  personality: IdSchema,
  theme: IdSchema.optional(),
  question: IdSchema.optional(),
  evidence: z.array(IdSchema).optional(),
  note: z.string().min(1),
});

export const JournalSchema = z.strictObject({
  id: IdSchema,
  mode: ResearchModeSchema,
  author: IdSchema,
  /** Modèle ayant mené la mission (`opus` pour le sous-agent) ; aucun coût à journaliser. */
  model: z.string().min(1).optional(),
  request: z.string().min(1),
  startedAt: DaySchema,
  completedAt: DaySchema.optional(),
  state: JournalStateSchema,
  interruption: z.string().optional(),
  scope: z.strictObject({
    personalities: z.array(IdSchema),
    themes: z.array(IdSchema),
    questions: z.array(IdSchema),
  }),
  queries: z.array(
    z.strictObject({
      at: DaySchema,
      query: z.string().min(1),
      category: SourceCategorySchema,
      tool: z.string().optional(),
    }),
  ),
  categoriesExplored: z.array(SourceCategorySchema),
  categoriesNotExplored: z.array(z.strictObject({ category: SourceCategorySchema, reason: z.string().min(1) })).optional(),
  exhaustive: z.boolean(),
  sourcesConsulted: z.array(
    z.strictObject({
      url: z.url(),
      title: z.string().min(1),
      outcome: z.enum(['retained', 'rejected', 'inaccessible']),
      reason: z.string().optional(),
      source: IdSchema.optional(),
    }),
  ),
  evidenceAdded: z.array(IdSchema).optional(),
  evidenceCorroborated: z.array(IdSchema).optional(),
  evidenceCorrected: z.array(IdSchema).optional(),
  duplicatesAvoided: z.array(z.strictObject({ evidence: IdSchema, note: z.string().min(1) })).optional(),
  verified: z.array(z.string()).optional(),
  toVerify: z.array(z.string()).optional(),
  contradictions: z.array(z.strictObject({ evidence: z.array(IdSchema), note: z.string().min(1) })).optional(),
  gaps: z.array(GapSchema).optional(),
  signals: z.array(IdSchema).optional(),
});

// ── §4 Signalement ──────────────────────────────────────────────────────────

export const SignalSchema = z.strictObject({
  id: IdSchema,
  kind: SignalKindSchema,
  raisedAt: DaySchema,
  journal: IdSchema,
  personality: IdSchema,
  position: z.strictObject({ candidate: IdSchema, question: IdSchema }).optional(),
  evidence: z.array(IdSchema).default([]),
  reason: z.string().min(1),
  state: SignalStateSchema,
  resolution: z.strictObject({ at: DaySchema, by: IdSchema, decision: z.string().min(1) }).optional(),
});

export type CandidacyStatusValue = z.infer<typeof CandidacyStatusValueSchema>;
export type CandidacyStatus = z.infer<typeof CandidacyStatusSchema>;
export type Personality = z.infer<typeof PersonalitySchema>;
export type Evidence = z.infer<typeof EvidenceSchema>;
export type Corroboration = z.infer<typeof CorroborationSchema>;
export type Journal = z.infer<typeof JournalSchema>;
export type Gap = z.infer<typeof GapSchema>;
export type Signal = z.infer<typeof SignalSchema>;
export type SourceCategory = z.infer<typeof SourceCategorySchema>;

/** Corpus de preuves chargé (`data/recherche/`). */
export type Research = {
  personalities: Personality[];
  /** Fichier `preuves/<personnalité>.yaml` (nom sans extension) → preuves. */
  evidence: Map<string, Evidence[]>;
  /** Fichier `journaux/<id>.yaml` (nom sans extension) → journal. */
  journals: Map<string, Journal>;
  /** Compte rendu `journaux/<id>.md` (nom sans extension) → titres de niveau 2. */
  reports: Map<string, string[]>;
  signals: Signal[];
};
