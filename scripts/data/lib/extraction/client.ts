// Client d'extraction (contracts/cli.md) : SDK Anthropic en production, client factice en test.
// La clé d'API est lue par le SDK depuis l'environnement ; elle n'est jamais journalisée (FR-030).
import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { ExtractionOutputSchema, type ExtractionOutput, type ExtractionRequest, type ExtractionResponse } from './schema';
import type { Usage } from '../schema';

export type ExtractionClient = {
  countTokens(req: ExtractionRequest): Promise<number>;
  extract(req: ExtractionRequest): Promise<ExtractionResponse>;
};

export function userMessage(req: ExtractionRequest): string {
  return `Source « ${req.sourceId} », tranche ${req.chunk.index + 1} sur ${req.chunk.total}. Texte à analyser :\n\n<source>\n${req.chunk.text}\n</source>`;
}

/** Message d'erreur sans secret : la clé et tout motif de clé sont masqués. */
export function sanitizeError(error: unknown, env: NodeJS.ProcessEnv = process.env): string {
  let message = error instanceof Error ? `${error.name} : ${error.message}` : String(error);
  const key = env.ANTHROPIC_API_KEY;
  if (key) message = message.split(key).join('[clé masquée]');
  return message.replace(/sk-ant-[A-Za-z0-9_-]+/g, '[clé masquée]').slice(0, 500);
}

export function anthropicClient(model: string): ExtractionClient {
  const client = new Anthropic();
  const guard = async <T>(call: () => Promise<T>): Promise<T> => {
    try {
      return await call();
    } catch (error) {
      throw new Error(sanitizeError(error));
    }
  };
  return {
    countTokens: (req) =>
      guard(async () => {
        const r = await client.messages.countTokens({ model, system: [{ type: 'text', text: req.system }], messages: [{ role: 'user', content: userMessage(req) }] });
        return r.input_tokens;
      }),
    extract: (req) =>
      guard(async () => {
        const message = await client.messages.parse({
          model,
          max_tokens: req.maxTokens,
          system: [{ type: 'text', text: req.system, cache_control: { type: 'ephemeral' } }],
          messages: [{ role: 'user', content: userMessage(req) }],
          output_config: { format: zodOutputFormat(ExtractionOutputSchema), effort: 'high' },
        });
        const u = message.usage;
        return {
          output: (message.parsed_output as ExtractionOutput | null | undefined) ?? null,
          usage: { inputTokens: u.input_tokens, outputTokens: u.output_tokens, cacheWriteTokens: u.cache_creation_input_tokens ?? 0, cacheReadTokens: u.cache_read_input_tokens ?? 0 },
          stopReason: message.stop_reason ?? 'unknown',
        };
      }),
  };
}

/** Estimation locale (sans réseau ni clé) pour `--dry-run` : ~3,5 caractères par jeton. */
export function estimatingClient(): ExtractionClient {
  return {
    countTokens: async (req) => Math.ceil((req.system.length + userMessage(req).length) / 3.5),
    extract: async () => {
      throw new Error('estimatingClient ne fait pas d’extraction');
    },
  };
}

export type FakeReply = { output: ExtractionOutput | null; stopReason?: string };

/** Client factice : réponses programmées par `(sourceId, indice de tranche)`, usage fixe. */
export function fakeClient(script: Record<string, FakeReply> | ((req: ExtractionRequest) => FakeReply), usage: Usage = { inputTokens: 1000, outputTokens: 200, cacheWriteTokens: 0, cacheReadTokens: 0 }) {
  const calls = { countTokens: 0, extract: 0 };
  const client: ExtractionClient & { calls: typeof calls } = {
    calls,
    countTokens: async () => {
      calls.countTokens++;
      return usage.inputTokens;
    },
    extract: async (req) => {
      calls.extract++;
      const reply = typeof script === 'function' ? script(req) : (script[`${req.sourceId}:${req.chunk.index}`] ?? { output: { affirmations: [] } });
      return { output: reply.output, usage, stopReason: reply.stopReason ?? 'end_turn' };
    },
  };
  return client;
}
