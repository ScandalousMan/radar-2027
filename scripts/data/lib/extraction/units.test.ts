// @vitest-environment node
import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { minimalContext } from '../rules/testing';
import { chunkText } from './chunk';
import { sanitizeError } from './client';
import { affirmationId, idFor, mergeAffirmations, verifyAffirmation } from './merge';
import { loadPrompt, renderSystem } from './prompt';
import { ExtractionOutputSchema } from './schema';
import type { Affirmation } from '../schema';

describe('consignes (T076)', () => {
  it('version = nom + empreinte ; emplacements remplis', () => {
    const prompt = loadPrompt();
    expect(prompt.name).toBe('extraction.v1');
    expect(prompt.hash).toMatch(/^sha256:[0-9a-f]{64}$/);
    const system = renderSystem(prompt, minimalContext().corpus);
    expect(system).not.toMatch(/\{\{/);
    expect(system).toContain('- economie-q01 [economie] (polarité +)');
    expect(system).toContain('- economie : Économie.');
  });
});

describe('sortie structurée (T077)', () => {
  const ok = { affirmations: [{ quote: 'Citation.', summary: 'Résumé.', themes: ['economie'], question: null, proposedValue: 1, confidence: 'high' }] };
  it('accepte une sortie conforme', () => expect(ExtractionOutputSchema.safeParse(ok).success).toBe(true));
  it('rejette une valeur hors échelle, trois thèmes ou une citation trop longue', () => {
    const a = ok.affirmations[0]!;
    expect(ExtractionOutputSchema.safeParse({ affirmations: [{ ...a, proposedValue: 3 }] }).success).toBe(false);
    expect(ExtractionOutputSchema.safeParse({ affirmations: [{ ...a, themes: ['a', 'b', 'c'] }] }).success).toBe(false);
    expect(ExtractionOutputSchema.safeParse({ affirmations: [{ ...a, quote: 'x'.repeat(301) }] }).success).toBe(false);
  });
});

describe('découpage (T078, R7)', () => {
  it('texte court : une tranche', () => expect(chunkText('Bonjour.')).toEqual([{ text: 'Bonjour.', offset: 0 }]));
  it('propriétés : couverture complète, chevauchement borné, offsets croissants', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1, maxLength: 3000 }), fc.integer({ min: 50, max: 400 }), (text, size) => {
        const overlap = Math.floor(size / 5);
        const chunks = chunkText(text, { size, overlap });
        let covered = 0;
        for (let i = 0; i < chunks.length; i++) {
          const c = chunks[i]!;
          if (text.slice(c.offset, c.offset + c.text.length) !== c.text) return false;
          if (c.offset > covered) return false; // aucun trou
          if (i > 0 && c.offset <= chunks[i - 1]!.offset) return false;
          if (i > 0 && covered - c.offset > overlap) return false;
          covered = Math.max(covered, c.offset + c.text.length);
        }
        return covered === text.length;
      }),
    );
  });
  it('coupe de préférence après une fin de phrase', () => {
    const text = `${'a'.repeat(70)}. ${'b'.repeat(60)}`;
    expect(chunkText(text, { size: 100, overlap: 10 })[0]!.text.endsWith('. ')).toBe(true);
  });
});

describe('identité, vérification et fusion (T079, R8)', () => {
  const text = "Nous revaloriserons le SMIC de 10 % dès l'été 2027. Nous réduirons les impôts.";
  it('identifiant déterministe de 16 hex', () => {
    expect(affirmationId('s', 0, 'q')).toMatch(/^[0-9a-f]{16}$/);
    expect(affirmationId('s', 0, 'q')).toBe(affirmationId('s', 0, 'q'));
    expect(affirmationId('s', 0, null)).not.toBe(affirmationId('s', 0, 'q'));
  });
  it('citation retrouvée ⇒ vérifiable avec localisation ; inventée ⇒ non vérifiable', () => {
    const v = verifyAffirmation({ quote: 'Nous réduirons les impôts.' }, text);
    expect(v).toMatchObject({ state: 'verifiable', location: { start: 52, end: 78 } });
    expect(verifyAffirmation({ quote: 'Nous supprimerons les impôts.' }, text).state).toBe('unverifiable');
  });
  it('fusion idempotente, états préservés', () => {
    const v = verifyAffirmation({ quote: 'Nous réduirons les impôts.' }, text);
    const a: Affirmation = { id: idFor('s', v, 'q'), run: 'r1', source: 's', location: v.location, quote: v.quote, summary: 'x', themes: ['economie'], question: 'q', proposedValue: -1, confidence: 'high', state: 'verifiable' };
    const first = mergeAffirmations([], [a, { ...a }]);
    expect(first).toMatchObject({ added: 1, duplicates: 1 });
    const accepted = [{ ...first.merged[0]!, state: 'accepted' as const }];
    const again = mergeAffirmations(accepted, [{ ...a, run: 'r2' }]);
    expect(again).toMatchObject({ added: 0, duplicates: 1 });
    expect(again.merged[0]!.state).toBe('accepted');
    expect(again.merged[0]!.run).toBe('r1');
  });
});

describe('client : aucune fuite de clé (T080, FR-030)', () => {
  it('masque la valeur de ANTHROPIC_API_KEY et tout motif de clé', () => {
    const env = { ANTHROPIC_API_KEY: 'sk-ant-api03-SECRETSECRET' };
    const message = sanitizeError(new Error('401 invalid x-api-key sk-ant-api03-SECRETSECRET for request'), env);
    expect(message).not.toContain('SECRETSECRET');
    expect(message).toContain('[clé masquée]');
    expect(sanitizeError('autre sk-ant-xyz_123', {})).toBe('autre [clé masquée]');
  });
});
