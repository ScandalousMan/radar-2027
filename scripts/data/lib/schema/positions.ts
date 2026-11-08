import { z } from 'zod';
import { DaySchema, EvidenceKindSchema, IdSchema, ScaleSchema, Sha256Schema } from './common';

export const ProvenanceSchema = z.discriminatedUnion('kind', [
  z.strictObject({ kind: z.literal('manual') }),
  z.strictObject({ kind: z.literal('extraction'), run: z.string().min(1), affirmation: z.string().regex(/^[0-9a-f]{16}$/), model: z.string().min(1) }),
]);

export const PositionValueSchema = z.union([ScaleSchema, z.literal('unknown')]);

/** Position ; sources, citation, niveau et relecture (FR-013 à FR-020) sont des règles. */
export const PositionSchema = z.strictObject({
  question: IdSchema,
  value: PositionValueSchema,
  evidence: EvidenceKindSchema.optional(),
  sources: z.array(IdSchema).default([]),
  quote: z.string().optional(),
  quoteSource: IdSchema.optional(),
  justification: z.string().optional(),
  status: z.enum(['draft', 'reviewed', 'contested']),
  old: z.boolean().optional(),
  provenance: ProvenanceSchema,
  author: IdSchema,
  authoredAt: DaySchema,
  reviewer: IdSchema.optional(),
  reviewedAt: DaySchema.optional(),
  reviewedHash: Sha256Schema.optional(),
});

export type Provenance = z.infer<typeof ProvenanceSchema>;
export type Position = z.infer<typeof PositionSchema>;
