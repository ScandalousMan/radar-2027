// Sortie structurée demandée au modèle (contracts/cli.md) ; la localisation est recalculée par nous.
import { z } from 'zod';
import type { Usage } from '../schema';

export const ExtractionOutputSchema = z.object({
  affirmations: z.array(
    z.object({
      quote: z.string().max(300),
      summary: z.string(),
      themes: z.array(z.string()).min(1).max(2),
      question: z.string().nullable(),
      proposedValue: z.union([z.literal(-2), z.literal(-1), z.literal(0), z.literal(1), z.literal(2)]),
      confidence: z.enum(['low', 'medium', 'high']),
    }),
  ),
});

export type ExtractionOutput = z.infer<typeof ExtractionOutputSchema>;
export type RawAffirmation = ExtractionOutput['affirmations'][number];

export type ExtractionRequest = {
  system: string;
  chunk: { text: string; index: number; total: number };
  sourceId: string;
  model: string;
  maxTokens: number;
};

export type ExtractionResponse = { output: ExtractionOutput | null; usage: Usage; stopReason: string };
