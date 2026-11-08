import { z } from 'zod';
import { DaySchema, IdSchema, ScaleSchema } from './common';

export const AffirmationSchema = z.strictObject({
  id: z.string().regex(/^[0-9a-f]{16}$/),
  run: z.string().min(1),
  source: IdSchema,
  location: z.strictObject({ start: z.int().min(0), end: z.int().min(0) }).nullable(),
  quote: z.string().max(300),
  summary: z.string(),
  themes: z.array(IdSchema).min(1).max(2),
  question: IdSchema.nullable(),
  proposedValue: ScaleSchema,
  confidence: z.enum(['low', 'medium', 'high']),
  state: z.enum(['verifiable', 'unverifiable', 'accepted', 'rejected']),
  decision: z
    .strictObject({ by: IdSchema, at: DaySchema, reason: z.string().optional(), position: z.string().optional() })
    .optional(),
});

export const AffirmationsFileSchema = z.array(AffirmationSchema);

export type Affirmation = z.infer<typeof AffirmationSchema>;
