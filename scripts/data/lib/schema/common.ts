// Briques communes des schémas du corpus (data-model.md, contracts/corpus-files.md).
// Les schémas vérifient la **forme** ; les règles de `../rules` vérifient le contenu. Certains
// champs contrôlés par une règle dédiée (FR-004, FR-008…) restent donc facultatifs ici, pour
// que l'élément soit chargé et que la règle désigne précisément la faute.
import { z } from 'zod';

export const ID_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export const IdSchema = z.string().regex(ID_PATTERN, { message: 'identifiant kebab-case ASCII attendu' });

/** Le paquet `yaml` (schéma core 1.2) lit `2026-11-07` comme une chaîne, mais `2026` comme un nombre. */
const dateText = z.union([z.string(), z.number().int()]).transform((v) => String(v));

export const DaySchema = dateText.pipe(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'date YYYY-MM-DD attendue' }));

export const DatePrecisionSchema = z.enum(['day', 'month', 'year']);

export const DateWithPrecisionSchema = z
  .strictObject({ date: dateText, precision: DatePrecisionSchema })
  .refine(
    (d) =>
      (d.precision === 'day' && /^\d{4}-\d{2}-\d{2}$/.test(d.date)) ||
      (d.precision === 'month' && /^\d{4}-\d{2}$/.test(d.date)) ||
      (d.precision === 'year' && /^\d{4}$/.test(d.date)),
    { message: 'date incohérente avec sa précision (YYYY-MM-DD / YYYY-MM / YYYY)' },
  );

export const Sha256Schema = z.string().regex(/^sha256:[0-9a-f]{64}$/, { message: 'empreinte sha256:<64 hex> attendue' });

export const EvidenceKindSchema = z.enum(['programme', 'livre_plateforme', 'declaration_vote']);

export const ScaleSchema = z.union([z.literal(-2), z.literal(-1), z.literal(0), z.literal(1), z.literal(2)]);

export const PolaritySchema = z.enum(['+', '-']);

export type DateWithPrecision = z.infer<typeof DateWithPrecisionSchema>;
export type EvidenceKind = z.infer<typeof EvidenceKindSchema>;
