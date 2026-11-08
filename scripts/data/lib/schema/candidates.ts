import { z } from 'zod';
import { DaySchema, IdSchema } from './common';

const CandidateStatusSchema = z.enum(['declared', 'withdrawn']);

export const CandidateHistoryEntrySchema = z.strictObject({
  status: CandidateStatusSchema,
  at: DaySchema,
  source: IdSchema,
  criterion: IdSchema,
});

/** Candidat ; la complétude du statut (date, source, critère) est vérifiée par FR-004 et FR-005. */
export const CandidateSchema = z.strictObject({
  id: IdSchema,
  name: z.string().min(1),
  party: z.string(),
  status: CandidateStatusSchema,
  statusChangedAt: DaySchema.optional(),
  statusSource: IdSchema.optional(),
  statusCriterion: IdSchema.optional(),
  history: z.array(CandidateHistoryEntrySchema).default([]),
});

export type Candidate = z.infer<typeof CandidateSchema>;
export type CandidateHistoryEntry = z.infer<typeof CandidateHistoryEntrySchema>;
