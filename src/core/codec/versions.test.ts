// @vitest-environment node
// US4 scénarios 1, 2 et 5 : octet de version, décodage d'un ancien lien, version inconnue.
import { describe, expect, it } from 'vitest';
import { bankPair } from '../bank/fixtures';
import { selectQuestions } from '../selection';
import type { Answer, ResultState } from '../types';
import { decodeBase64Url, encodeBase64Url } from './base64url';
import { crc8 } from './crc8';
import { decodeFragment, decodeHeader } from './decode';
import { encodeFragment } from './encode';

const { v1, v2 } = bankPair();
const priorities = ['t03', 't04', 't09'];

function stateFor(bankVersion: 1 | 2): ResultState {
  const bank = bankVersion === 1 ? v1 : v2;
  const n = selectQuestions(bank, 'full', priorities).items.length;
  return { bankVersion, mode: 'full', priorities, answers: Array.from({ length: n }, (_, i): Answer => ([-2, -1, 0, 1, 2, 'skipped'] as const)[i % 6]!) };
}

describe('versions de banque (US4)', () => {
  const linkV1 = encodeFragment(stateFor(1), v1);

  it('scénario 1 : un état sur la version 2 porte l’octet 0x01', () => {
    expect(decodeBase64Url(encodeFragment(stateFor(2), v2).slice(3))![0]).toBe(0x01);
    expect(decodeBase64Url(linkV1.slice(3))![0]).toBe(0x00);
  });

  it('scénario 2 : decodeHeader d’un lien v1 avec 2 versions publiées désigne la version 1', () => {
    const h = decodeHeader(linkV1, 2);
    expect(h.ok && h.value.bankVersion).toBe(1);
  });

  it('decodeFragment avec la mauvaise banque → unknown-bank-version', () => {
    expect(decodeFragment(linkV1, v2)).toEqual({ ok: false, reason: 'unknown-bank-version' });
  });

  it('scénario 5 : octet 0x03 avec 2 versions publiées → unknown-bank-version', () => {
    const b = decodeBase64Url(linkV1.slice(3))!;
    b[0] = 0x03;
    b[b.length - 1] = crc8(b.subarray(0, b.length - 1));
    expect(decodeHeader(`#1.${encodeBase64Url(b)}`, 2)).toEqual({ ok: false, reason: 'unknown-bank-version' });
  });

  it('scénario 2 : la sélection reconstruite est celle de la version 1, chaque réponse sur la même question', () => {
    const decoded = decodeFragment(linkV1, v1);
    expect(decoded.ok).toBe(true);
    if (!decoded.ok) return;
    const s1 = selectQuestions(v1, decoded.value.mode, decoded.value.priorities);
    const s2 = selectQuestions(v2, decoded.value.mode, decoded.value.priorities);
    const ids1 = s1.items.map((i) => i.question.id);
    expect(ids1).toContain('t03-q07');
    expect(ids1).not.toContain('t03-q20');
    expect(s2.items.map((i) => i.question.id)).not.toEqual(ids1);
    expect(decoded.value.answers).toEqual(stateFor(1).answers);
  });
});
