import { z } from 'zod';
import { DaySchema, EvidenceKindSchema, IdSchema } from './common';

/** Seuils de validation (data-model.md § 9) ; jamais codés en dur dans les règles. */
export const ThresholdsSchema = z.strictObject({
  polarityMin: z.number().min(0).max(1).default(0.4),
  polarityMax: z.number().min(0).max(1).default(0.6),
  minQuestionsPerTheme: z.int().min(1).default(10),
  maxStatementLength: z.int().min(1).default(200),
  maxQuoteLength: z.int().min(1).default(300),
  oldSourceBefore: DaySchema.default('2022-01-01'),
  mainBudgetBytes: z.int().min(1).default(307_200),
  detailBudgetBytes: z.int().min(1).default(153_600),
  bankMin: z.int().min(0).default(250),
  bankMax: z.int().min(0).default(300),
});

export const GovernanceFileSchema = z.strictObject({
  inclusionCriteria: z.array(z.strictObject({ id: IdSchema, kind: z.enum(['inclusion', 'withdrawal']), text: z.string().min(1) })),
  neutralityChecklist: z.array(z.strictObject({ id: IdSchema, text: z.string().min(1) })),
  evidenceLevels: z.array(z.strictObject({ id: EvidenceKindSchema, label: z.string().min(1), definition: z.string().min(1) })),
  thresholds: ThresholdsSchema.prefault({}),
  reportIssueUrl: z.url().refine((u) => u.includes('{title}'), { message: 'reportIssueUrl doit contenir {title}' }),
});

export type Thresholds = z.infer<typeof ThresholdsSchema>;
export type GovernanceFile = z.infer<typeof GovernanceFileSchema>;
export const DEFAULT_THRESHOLDS: Thresholds = ThresholdsSchema.parse({});
