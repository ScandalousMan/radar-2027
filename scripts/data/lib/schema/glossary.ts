// Terme du glossaire, `data/corpus/glossaire.yaml` (spec 009, data-model § 7).
// Le schéma vérifie la forme ; la règle GLOSS vérifie le contenu (formes vides ou en double,
// longueur de la définition, URL, sources institutionnelles, relecture). Les champs qu'elle
// contrôle restent donc permissifs ici, pour que le terme soit chargé et désigné par la règle.
import { z } from 'zod';
import { DaySchema, IdSchema } from './common';

export const GlossarySourceEntrySchema = z.strictObject({
  url: z.string(),
  title: z.string().min(1),
  publisher: z.string().min(1),
  accessedAt: DaySchema,
});

export const GlossaryEntrySchema = z.strictObject({
  id: IdSchema,
  label: z.string().min(1),
  forms: z.array(z.string()),
  definition: z.string(),
  sources: z.array(GlossarySourceEntrySchema),
  status: z.enum(['draft', 'reviewed']),
  author: IdSchema,
  reviewedBy: IdSchema.optional(),
  reviewedAt: DaySchema.optional(),
  /** Commentaire de relecture, jamais publié. */
  note: z.string().optional(),
});

export type GlossarySourceEntry = z.infer<typeof GlossarySourceEntrySchema>;
export type GlossaryEntry = z.infer<typeof GlossaryEntrySchema>;
