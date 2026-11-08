// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { FR_009, hasDoubleNegation } from './FR-009';
import { ids, minimalContext, questionsOf } from './testing';

describe('FR-009', () => {
  it('fixture minimale conforme', () => expect(ids(FR_009, minimalContext())).toEqual([]));
  it('énoncé actif à grille incomplète', () => {
    const ctx = minimalContext();
    questionsOf(ctx, 'sante')[0]!.neutralityChecklist['single-claim'] = false;
    expect(ids(FR_009, ctx)).toEqual(['sante-q01']);
  });
  it('brouillon à grille incomplète accepté, énoncé trop long refusé', () => {
    const ctx = minimalContext();
    const [a, b] = questionsOf(ctx, 'economie');
    a!.status = 'draft';
    a!.neutralityChecklist = {};
    b!.text = 'x'.repeat(201);
    expect(ids(FR_009, ctx)).toEqual(['economie-q02']);
  });
  it('heuristique de double négation', () => {
    expect(hasDoubleNegation("Il ne faut pas supprimer l'impôt sans contrepartie.")).toBe(true);
    expect(hasDoubleNegation("L'État ne doit jamais renoncer à aucune industrie.")).toBe(true);
    expect(hasDoubleNegation("L'État n'a pas à financer ni les cultes ni les partis.")).toBe(true);
    expect(hasDoubleNegation("L'État ne doit pas financer les cultes.")).toBe(false);
    expect(hasDoubleNegation('Le SMIC doit augmenter sans délai.')).toBe(false);
  });
});
