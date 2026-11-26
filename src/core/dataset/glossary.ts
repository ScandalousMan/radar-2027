// Glossaire publié hors versions : `public/data/glossary.json` (spec 009, data-model § 8).
// Partagé par le site (bulle, page /glossaire) et les scripts (`data:glossary`, règle GLOSS).
// Aucun lien avec la sélection, le score ou le codec (FR-021).
import { z } from 'zod';

const Id = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/);

/** Longueur maximale d'une définition (FR-014). */
export const MAX_DEFINITION_LENGTH = 280;

export const GlossarySourceSchema = z.strictObject({
  url: z.url(),
  title: z.string().min(1),
  publisher: z.string().min(1),
});

export const GlossaryTermSchema = z.strictObject({
  id: Id,
  label: z.string().min(1),
  forms: z.array(z.string().min(1)).min(1),
  definition: z.string().min(1).max(MAX_DEFINITION_LENGTH),
  sources: z.array(GlossarySourceSchema).min(1),
});

export const GlossarySchema = z
  .strictObject({
    updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    terms: z.array(GlossaryTermSchema),
  })
  .refine((g) => new Set(g.terms.map((t) => t.id)).size === g.terms.length, { message: 'identifiant de terme en double' });

export type GlossarySource = z.infer<typeof GlossarySourceSchema>;
export type GlossaryTerm = z.infer<typeof GlossaryTermSchema>;
export type Glossary = z.infer<typeof GlossarySchema>;
