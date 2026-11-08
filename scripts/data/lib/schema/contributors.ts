import { z } from 'zod';
import { IdSchema } from './common';

/** Contributeur : jamais publié (FR-037, R13). */
export const ContributorSchema = z.strictObject({
  id: IdSchema,
  github: z.string().min(1),
  displayName: z.string().optional(),
});

export type Contributor = z.infer<typeof ContributorSchema>;
