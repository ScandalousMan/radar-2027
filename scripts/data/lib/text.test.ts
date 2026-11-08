// @vitest-environment node
import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { findQuote, levenshtein, normalize, sameWords, sha256 } from './text';

describe('normalize (R5)', () => {
  it('ramène la typographie à une forme canonique', () => {
    expect(normalize('L’État  « fort » – vraiment —\n oui')).toBe('L\'État " fort " - vraiment - oui');
  });
  it('conserve la casse', () => {
    expect(normalize('SMIC')).toBe('SMIC');
  });
  it('propriété : idempotente', () => {
    fc.assert(fc.property(fc.string(), (s) => normalize(normalize(s)) === normalize(s)));
  });
});

describe('findQuote', () => {
  const text = normalize('Nous revaloriserons le SMIC de 10 % dès l’été 2027. Puis nous verrons.');
  it('retrouve une citation à la typographie près', () => {
    expect(findQuote(text, "Nous revaloriserons le SMIC de 10 % dès l'été 2027.")).toEqual({ start: 0, end: 51 });
  });
  it('refuse une citation modifiée ou de casse différente', () => {
    expect(findQuote(text, 'nous revaloriserons le smic')).toBeNull();
    expect(findQuote(text, 'Nous augmenterons le SMIC')).toBeNull();
    expect(findQuote(text, '')).toBeNull();
  });
  it('propriété : toute sous-chaîne d’un texte normalisé est retrouvée', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), fc.nat(), fc.nat(), (raw, a, b) => {
        const t = normalize(raw);
        if (t.length === 0) return true;
        const start = a % t.length;
        const end = start + 1 + (b % (t.length - start));
        const sub = t.slice(start, end);
        if (normalize(sub).length === 0) return true;
        return findQuote(t, sub) !== null;
      }),
    );
  });
  it('propriété : casse différente ⇒ introuvable', () => {
    fc.assert(
      fc.property(fc.stringMatching(/^[a-z]{3,20}$/), (w) => findQuote(normalize(w), w.toUpperCase()) === null),
    );
  });
});

describe('sha256', () => {
  it('format sha256:<64 hex>', () => {
    expect(sha256('abc')).toBe('sha256:ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  });
});

describe('levenshtein et sameWords (FR-011)', () => {
  it('distance', () => {
    expect(levenshtein('chat', 'chats')).toBe(1);
    expect(levenshtein('', 'abc')).toBe(3);
    expect(levenshtein('kitten', 'sitting')).toBe(3);
  });
  it('correction typographique = mêmes mots', () => {
    expect(sameWords("L'Etat doit agir.", 'L’État doit agir')).toBe(true);
    expect(sameWords('Le SMIC doit augmenter.', 'Le SMIC doit baisser.')).toBe(false);
    expect(sameWords('Il faut agir.', 'Il ne faut pas agir.')).toBe(false);
  });
});
