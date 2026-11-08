import { z } from 'zod';

export const CostsSchema = z.strictObject({
  runs: z.int().min(0),
  totalUsd: z.number().min(0),
  byModel: z.record(z.string(), z.number().min(0)),
  byCandidate: z.record(z.string(), z.number().min(0)),
});

export type Costs = z.infer<typeof CostsSchema>;
export const EMPTY_COSTS: Costs = { runs: 0, totalUsd: 0, byModel: {}, byCandidate: {} };
