import { z } from 'zod';
import { IdSchema, Sha256Schema } from './common';

export const RUN_ID_PATTERN = /^\d{8}T\d{6}Z-[0-9a-f]{8}$/;

export const UsageSchema = z.strictObject({
  inputTokens: z.int().min(0),
  outputTokens: z.int().min(0),
  cacheWriteTokens: z.int().min(0),
  cacheReadTokens: z.int().min(0),
});

export const RunSchema = z.strictObject({
  id: z.string().regex(RUN_ID_PATTERN),
  startedAt: z.string(),
  endedAt: z.string(),
  candidate: IdSchema,
  model: z.string().min(1),
  promptVersion: z.strictObject({ name: z.string().min(1), hash: Sha256Schema }),
  bankVersion: z.int().min(0),
  sources: z.array(
    z.strictObject({
      id: IdSchema,
      contentHash: Sha256Schema,
      chunks: z.int().min(0),
      failedChunks: z.int().min(0).default(0),
      status: z.enum(['done', 'failed', 'skipped']),
    }),
  ),
  counts: z.strictObject({
    produced: z.int().min(0),
    verifiable: z.int().min(0),
    unverifiable: z.int().min(0),
    duplicates: z.int().min(0),
  }),
  usage: UsageSchema,
  costUsd: z.number().min(0),
  maxCostUsd: z.number().min(0).nullable(),
  status: z.enum(['completed', 'interrupted', 'failed']),
  error: z.string().optional(),
});

export type Usage = z.infer<typeof UsageSchema>;
export type Run = z.infer<typeof RunSchema>;
