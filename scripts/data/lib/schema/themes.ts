import { z } from 'zod';
import { IdSchema } from './common';

export const ThemeSchema = z.strictObject({
  id: IdSchema,
  label: z.string().min(1),
  description: z.string().max(300),
  axis: z.strictObject({ negative: z.string().min(1), positive: z.string().min(1) }),
  order: z.int().min(0),
  status: z.enum(['active', 'retired']),
});

export type Theme = z.infer<typeof ThemeSchema>;
