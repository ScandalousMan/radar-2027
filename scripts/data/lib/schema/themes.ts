import { z } from 'zod';
import { IdSchema } from './common';

/** Dimension d'un axe composite (spec 006 FR-002a) ; jamais publiée. */
export const DimensionSchema = z.strictObject({
  id: IdSchema,
  label: z.string().min(1).max(60),
  negative: z.string().min(1),
  positive: z.string().min(1),
});

export type Dimension = z.infer<typeof DimensionSchema>;

export const ThemeSchema = z.strictObject({
  id: IdSchema,
  label: z.string().min(1),
  description: z.string().max(300),
  axis: z.strictObject({ negative: z.string().min(1), positive: z.string().min(1) }),
  dimensions: z
    .array(DimensionSchema)
    .min(2)
    .refine((ds) => new Set(ds.map((d) => d.id)).size === ds.length, { message: 'identifiants de dimension en double' })
    .optional(),
  order: z.int().min(0),
  status: z.enum(['active', 'retired']),
});

export type Theme = z.infer<typeof ThemeSchema>;
