// @vitest-environment node
// US3 : fragments de référence (SC-007), bijection (SC-002), mutations (SC-003), motifs de rejet.
import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { bankPair, syntheticBank } from '../bank/fixtures';
import type { BankVersion } from '../bank';
import { selectQuestions } from '../selection';
import { StateError, type Answer, type Mode, type RejectionReason, type ResultState } from '../types';
import { decodeBase64Url, encodeBase64Url } from './base64url';
import { crc8 } from './crc8';
import { decodeFragment, decodeHeader } from './decode';
import { encodeFragment } from './encode';
import { FRAGMENT_FULL_EXAMPLE, FRAGMENT_SHORT_EXAMPLE } from './fixtures';
import { expectedPayloadLength } from './payload';

const bank = syntheticBank();
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
const toHex = (b: Uint8Array) => [...b].map((x) => x.toString(16).padStart(2, '0').toUpperCase()).join('');

function arbState(b: BankVersion) {
  const ids = b.themes.map((t) => t.id);
  return fc
    .tuple(
      fc.constantFrom<Mode>('full', 'short'),
      fc.uniqueArray(fc.constantFrom(...ids), { minLength: 3, maxLength: 5 }),
      fc.infiniteStream(fc.constantFrom<Answer>(-2, -1, 0, 1, 2, 'skipped', 'unanswered')),
    )
    .map(([mode, priorities, stream]): ResultState => {
      const canonical = [...priorities].sort((x, y) => b.themeIndexById.get(x)! - b.themeIndexById.get(y)!);
      const n = selectQuestions(b, mode, canonical).items.length;
      return { bankVersion: b.version, mode, priorities: canonical, answers: [...stream.take(n)] };
    });
}

/** Fragment à partir d'octets bruts, CRC recalculé (pour atteindre les vérifications tardives). */
function forge(bytes: Uint8Array): string {
  const b = Uint8Array.from(bytes);
  b[b.length - 1] = crc8(b.subarray(0, b.length - 1));
  return `#1.${encodeBase64Url(b)}`;
}

const reference = () => decodeBase64Url(FRAGMENT_FULL_EXAMPLE.fragment.slice(3))!;

describe('fragments de référence (US3 scénarios 1 et 2, SC-007)', () => {
  it.each([FRAGMENT_FULL_EXAMPLE, FRAGMENT_SHORT_EXAMPLE])('$title', (fx) => {
    const b = fx.bank();
    expect(encodeFragment(fx.state, b)).toBe(fx.fragment);
    expect(toHex(decodeBase64Url(fx.fragment.slice(3))!)).toBe(fx.bytesHex);
    expect(decodeFragment(fx.fragment, b)).toEqual({ ok: true, value: fx.state });
  });

  it('longueurs : 59 et 22 caractères, 44 et 16 octets', () => {
    expect(FRAGMENT_FULL_EXAMPLE.fragment.length - 3).toBe(59);
    expect(FRAGMENT_SHORT_EXAMPLE.fragment.length - 3).toBe(22);
    expect(expectedPayloadLength(100)).toBe(44);
    expect(expectedPayloadLength(25)).toBe(16);
    expect(expectedPayloadLength(96)).toBe(42);
  });

  it('propriété : la longueur ne dépend que du mode (SC-007)', () => {
    fc.assert(
      fc.property(arbState(bank), (s) => {
        expect(encodeFragment(s, bank).length - 3).toBe(s.mode === 'full' ? 59 : 22);
      }),
      { numRuns: 300 },
    );
  });

  it('le # initial est facultatif', () => {
    expect(decodeFragment(FRAGMENT_SHORT_EXAMPLE.fragment.slice(1), bank)).toEqual({ ok: true, value: FRAGMENT_SHORT_EXAMPLE.state });
  });
});

describe('bijection (SC-002, FR-035)', () => {
  const { v1, v2 } = bankPair();
  const arb = fc.oneof(arbState(v1).map((s) => ({ s, b: v1 })), arbState(v2).map((s) => ({ s, b: v2 })));

  it('decode(encode(s)) = s et encode(decode(c)) = c sur 10 000 états', { timeout: 120_000 }, () => {
    fc.assert(
      fc.property(arb, ({ s, b }) => {
        const c = encodeFragment(s, b);
        const d = decodeFragment(c, b);
        expect(d).toEqual({ ok: true, value: s });
        if (d.ok) expect(encodeFragment(d.value, b)).toBe(c);
      }),
      { numRuns: 10_000 },
    );
  });
});

describe('mutations (SC-003, US3 scénario 5)', () => {
  const payload = FRAGMENT_FULL_EXAMPLE.fragment.slice(3);
  const allowed: RejectionReason[] = ['invalid-length', 'invalid-content', 'invalid-checksum'];

  /** Rejet attendu ; « version de banque inconnue » n'est admise que si l'octet de version a changé. */
  function expectRejected(mutated: string) {
    const r = decodeFragment(`#1.${mutated}`, bank);
    expect(r.ok, mutated).toBe(false);
    if (r.ok) return;
    if (r.reason === 'unknown-bank-version') expect(decodeBase64Url(mutated)![0]).not.toBe(0);
    else expect(allowed).toContain(r.reason);
  }

  it('chaque substitution, insertion et suppression d’un caractère est rejetée', () => {
    let count = 0;
    for (let i = 0; i <= payload.length; i++) {
      for (const ch of ALPHABET) {
        expectRejected(payload.slice(0, i) + ch + payload.slice(i));
        if (i < payload.length && ch !== payload[i]) expectRejected(payload.slice(0, i) + ch + payload.slice(i + 1));
        count++;
      }
      if (i < payload.length) expectRejected(payload.slice(0, i) + payload.slice(i + 1));
    }
    expect(count).toBe(64 * 60);
  });

  it('les substitutions hors de l’octet de version ne donnent que longueur, contenu ou somme', () => {
    for (let i = 2; i < payload.length; i++) {
      for (const ch of ALPHABET) {
        if (ch === payload[i]) continue;
        const r = decodeFragment(`#1.${payload.slice(0, i)}${ch}${payload.slice(i + 1)}`, bank);
        expect(r.ok).toBe(false);
        if (!r.ok) expect(allowed).toContain(r.reason);
      }
    }
  });

  it('au moins 99 % de 1 000 charges aléatoires de 44 octets sont rejetées', () => {
    const samples = fc.sample(fc.uint8Array({ minLength: 44, maxLength: 44 }), { numRuns: 1000, seed: 2027 });
    const accepted = samples.filter((b) => decodeFragment(`#1.${encodeBase64Url(b)}`, bank).ok).length;
    expect(accepted).toBeLessThanOrEqual(10);
  });
});

describe('motifs de rejet (US3 scénarios 6 et 7)', () => {
  it.each([
    ['masque à 2 bits', (b: Uint8Array) => (b[3] = 0x00)],
    ['masque à 6 bits', (b: Uint8Array) => (b[3] = 0x0f)],
    ['bits réservés', (b: Uint8Array) => (b[1] = 0x02)],
    ['code de réponse 7', (b: Uint8Array) => (b[5] = 0xe5)],
    ['bourrage non nul', (b: Uint8Array) => (b[42] = 0x01)],
    ['sujet hors des thèmes de la version', (b: Uint8Array) => (b[4] = 0x01)],
  ])('%s → invalid-content', (_, mutate) => {
    const b = reference();
    mutate(b);
    expect(decodeFragment(forge(b), bank)).toEqual({ ok: false, reason: 'invalid-content' });
  });

  it.each(['#2.AACEAg', '#AACEAg', '#1AACEAg', '', '#', 'x'])('« %s » → unsupported-link-version', (fragment) => {
    expect(decodeFragment(fragment, bank)).toEqual({ ok: false, reason: 'unsupported-link-version' });
    expect(decodeHeader(fragment, 1)).toEqual({ ok: false, reason: 'unsupported-link-version' });
  });

  it('caractère hors alphabet ou bourrage = → invalid-content', () => {
    expect(decodeFragment('#1.AACE+g', bank)).toEqual({ ok: false, reason: 'invalid-content' });
    expect(decodeFragment(`${FRAGMENT_SHORT_EXAMPLE.fragment}==`, bank)).toEqual({ ok: false, reason: 'invalid-content' });
  });

  it('moins de 6 octets ou longueur inattendue → invalid-length', () => {
    expect(decodeFragment('#1.AACEAg', bank)).toEqual({ ok: false, reason: 'invalid-length' });
    const b = reference();
    expect(decodeFragment(forge(b.subarray(0, 40)), bank)).toEqual({ ok: false, reason: 'invalid-length' });
  });

  it('somme de contrôle fausse → invalid-checksum', () => {
    const b = reference();
    b[43] = 0x00;
    expect(decodeFragment(`#1.${encodeBase64Url(b)}`, bank)).toEqual({ ok: false, reason: 'invalid-checksum' });
  });

  it('decodeHeader : version, mode et sujets sans banque', () => {
    expect(decodeHeader(FRAGMENT_FULL_EXAMPLE.fragment, 1)).toEqual({ ok: true, value: { bankVersion: 1, mode: 'full', priorityIndices: [2, 7, 9] } });
    expect(decodeHeader(FRAGMENT_SHORT_EXAMPLE.fragment, 3)).toEqual({ ok: true, value: { bankVersion: 1, mode: 'short', priorityIndices: [0, 2, 7, 9, 12] } });
    expect(decodeHeader(FRAGMENT_FULL_EXAMPLE.fragment, 0)).toEqual({ ok: false, reason: 'unknown-bank-version' });
  });
});

describe('encodeFragment refuse un état invalide (FR-036)', () => {
  const s = FRAGMENT_FULL_EXAMPLE.state;
  it.each<[string, ResultState]>([
    ['2 sujets', { ...s, priorities: ['t00', 't01'] }],
    ['6 sujets', { ...s, priorities: ['t00', 't01', 't02', 't03', 't04', 't05'] }],
    ['mauvais nombre de réponses', { ...s, answers: s.answers.slice(1) }],
    ['réponse hors échelle', { ...s, answers: [3 as never, ...s.answers.slice(1)] }],
    ['version ≠ banque', { ...s, bankVersion: 2 }],
    ['mode inconnu', { ...s, mode: 'moyen' as never }],
  ])('%s', (_, state) => {
    expect(() => encodeFragment(state, bank)).toThrow(StateError);
  });
});
