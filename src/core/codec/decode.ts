// Décodage d'un fragment (FR-033 → FR-035, FR-039, FR-040, research.md R5).
// Vérifications dans l'ordre de contracts/link-format.md ; le premier échec l'emporte et aucun
// état partiel n'est produit. La sélection d'un ancien lien est reconstruite avec la seule
// `BankVersion` passée en argument, celle que désigne l'octet de version (FR-039).
import type { BankVersion } from '../bank';
import { selectQuestions } from '../selection';
import { LINK_FORMAT_VERSION, MAX_PRIORITIES, MIN_PRIORITIES, type Answer, type DecodeResult, type Mode, type RejectionReason, type ResultState } from '../types';
import { decodeBase64Url } from './base64url';
import { codeToAnswer, unpackAnswers } from './bits';
import { crc8 } from './crc8';
import { expectedPayloadLength, HEADER_LENGTH, parseHeader, type ParsedHeader } from './payload';

export type DecodedHeader = { readonly bankVersion: number; readonly mode: Mode; readonly priorityIndices: readonly number[] };

const PREFIX = `${LINK_FORMAT_VERSION}.`;

const reject = (reason: RejectionReason): { ok: false; reason: RejectionReason } => ({ ok: false, reason });

/** Étapes 1 à 6 hors contrôle de version : préfixe, alphabet, longueur minimale, bits réservés, nombre de sujets. */
function readHeader(fragment: string): DecodeResult<{ bytes: Uint8Array; header: ParsedHeader }> {
  const body = fragment.startsWith('#') ? fragment.slice(1) : fragment;
  if (!body.startsWith(PREFIX)) return reject('unsupported-link-version');
  const bytes = decodeBase64Url(body.slice(PREFIX.length));
  if (!bytes) return reject('invalid-content');
  if (bytes.length < HEADER_LENGTH + 1) return reject('invalid-length');
  return { ok: true, value: { bytes, header: parseHeader(bytes) } };
}

function checkFlagsAndMask(header: ParsedHeader): RejectionReason | null {
  if (header.reservedBits !== 0) return 'invalid-content';
  if (header.maskIndices.length < MIN_PRIORITIES || header.maskIndices.length > MAX_PRIORITIES) return 'invalid-content';
  return null;
}

/** En-tête seul (sans banque) : version à charger, mode et sujets. */
export function decodeHeader(fragment: string, versionCount: number): DecodeResult<DecodedHeader> {
  const read = readHeader(fragment);
  if (!read.ok) return read;
  const { header } = read.value;
  if (header.versionByte + 1 > versionCount) return reject('unknown-bank-version');
  const bad = checkFlagsAndMask(header);
  if (bad) return reject(bad);
  return { ok: true, value: { bankVersion: header.versionByte + 1, mode: header.mode, priorityIndices: header.maskIndices } };
}

/** État complet, avec la banque de la version désignée par le lien. */
export function decodeFragment(fragment: string, bank: BankVersion): DecodeResult<ResultState> {
  const read = readHeader(fragment);
  if (!read.ok) return read;
  const { bytes, header } = read.value;
  if (header.versionByte + 1 !== bank.version) return reject('unknown-bank-version');
  const bad = checkFlagsAndMask(header);
  if (bad) return reject(bad);
  if (header.maskIndices.some((t) => t >= bank.themes.length)) return reject('invalid-content');

  const priorities = header.maskIndices.map((t) => bank.themes[t]!.id);
  const n = selectQuestions(bank, header.mode, priorities).items.length;
  if (bytes.length !== expectedPayloadLength(n)) return reject('invalid-length');
  if (crc8(bytes.subarray(0, bytes.length - 1)) !== bytes[bytes.length - 1]) return reject('invalid-checksum');

  const codes = unpackAnswers(bytes.subarray(HEADER_LENGTH, bytes.length - 1), n);
  if (!codes) return reject('invalid-content');
  const answers: Answer[] = [];
  for (const code of codes) {
    const a = codeToAnswer(code);
    if (a === null) return reject('invalid-content');
    answers.push(a);
  }
  return { ok: true, value: { bankVersion: bank.version, mode: header.mode, priorities, answers } };
}
