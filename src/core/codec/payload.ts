// Charge binaire (FR-029, FR-032, contracts/link-format.md) :
// [version − 1][drapeaux][masque × 3][réponses 3 bits…][CRC-8].
import { packAnswers, packedLength } from './bits';
import { crc8 } from './crc8';
import type { Mode } from '../types';

export const HEADER_LENGTH = 5;

/** `5 + ⌈3n/8⌉ + 1` octets pour une sélection de `n` questions (FR-032). */
export function expectedPayloadLength(selectionSize: number): number {
  return HEADER_LENGTH + packedLength(selectionSize) + 1;
}

export function buildPayload(bankVersion: number, mode: Mode, priorityIndices: readonly number[], codes: readonly number[]): Uint8Array {
  const answers = packAnswers(codes);
  const out = new Uint8Array(HEADER_LENGTH + answers.length + 1);
  out[0] = bankVersion - 1;
  out[1] = mode === 'short' ? 1 : 0;
  for (const t of priorityIndices) out[2 + (t >> 3)]! |= 1 << (t & 7);
  out.set(answers, HEADER_LENGTH);
  out[out.length - 1] = crc8(out.subarray(0, out.length - 1));
  return out;
}

export type ParsedHeader = { readonly versionByte: number; readonly mode: Mode; readonly reservedBits: number; readonly maskIndices: readonly number[] };

/** Lit l'en-tête (au moins `HEADER_LENGTH` octets). */
export function parseHeader(bytes: Uint8Array): ParsedHeader {
  const maskIndices: number[] = [];
  for (let t = 0; t < 24; t++) if ((bytes[2 + (t >> 3)]! >> (t & 7)) & 1) maskIndices.push(t);
  return { versionByte: bytes[0]!, mode: bytes[1]! & 1 ? 'short' : 'full', reservedBits: bytes[1]! & 0xfe, maskIndices };
}
