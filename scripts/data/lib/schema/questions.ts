import { z } from 'zod';
import { DaySchema, IdSchema, PolaritySchema } from './common';

/** Question ; nombre et unicité des thèmes (FR-008), longueur (FR-009) et relecture (FR-010) sont des règles. */
export const QuestionSchema = z.strictObject({
  id: IdSchema,
  text: z.string().min(1),
  themes: z.array(IdSchema).min(1),
  polarity: PolaritySchema,
  status: z.enum(['draft', 'active', 'retired']),
  author: IdSchema,
  reviewer: IdSchema.optional(),
  reviewedAt: DaySchema.optional(),
  neutralityChecklist: z.record(z.string(), z.boolean()).default({}),
  introducedIn: z.int().min(1).optional(),
  retiredIn: z.int().min(1).optional(),
});

export type Question = z.infer<typeof QuestionSchema>;
