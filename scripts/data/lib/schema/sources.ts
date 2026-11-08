import { z } from 'zod';
import { DateWithPrecisionSchema, DaySchema, EvidenceKindSchema, IdSchema, Sha256Schema } from './common';

/** Source ; unicité de l'URL (FR-013) et présence de l'empreinte (FR-014) sont des règles. */
export const SourceSchema = z.strictObject({
  id: IdSchema,
  url: z.url(),
  title: z.string().min(1),
  kind: EvidenceKindSchema,
  publishedAt: DateWithPrecisionSchema,
  accessedAt: DaySchema,
  candidates: z.array(IdSchema),
  contentHash: Sha256Schema.optional(),
  archiveUrl: z.url().optional(),
  unreachableSince: DaySchema.optional(),
});

export type Source = z.infer<typeof SourceSchema>;
