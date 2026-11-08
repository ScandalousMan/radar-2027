// Réponses sur 3 bits, du bit de poids fort vers le bit de poids faible, bourrage nul
// (FR-029 (4), FR-030) : 0 non répondue, 1 passée, v + 4 pour v ∈ −2 … +2, 7 invalide.
import type { ScaleValue } from '../dataset';
import type { Answer } from '../types';

export function answerToCode(a: Answer): number {
  if (a === 'unanswered') return 0;
  if (a === 'skipped') return 1;
  return a + 4;
}

/** Réponse d'un code, ou `null` pour le code 7 (ou hors plage). */
export function codeToAnswer(code: number): Answer | null {
  if (code === 0) return 'unanswered';
  if (code === 1) return 'skipped';
  if (code >= 2 && code <= 6) return (code - 4) as ScaleValue;
  return null;
}

export function packedLength(n: number): number {
  return Math.ceil((3 * n) / 8);
}

export function packAnswers(codes: readonly number[]): Uint8Array {
  const out = new Uint8Array(packedLength(codes.length));
  codes.forEach((code, i) => {
    for (let k = 0; k < 3; k++) {
      if ((code >> (2 - k)) & 1) {
        const bit = 3 * i + k;
        out[bit >> 3]! |= 0x80 >> (bit & 7);
      }
    }
  });
  return out;
}

/** Codes dépaquetés, ou `null` si un bit de bourrage est non nul. */
export function unpackAnswers(bytes: Uint8Array, n: number): number[] | null {
  const bitAt = (bit: number) => ((bytes[bit >> 3] ?? 0) >> (7 - (bit & 7))) & 1;
  const codes: number[] = [];
  for (let i = 0; i < n; i++) codes.push((bitAt(3 * i) << 2) | (bitAt(3 * i + 1) << 1) | bitAt(3 * i + 2));
  for (let bit = 3 * n; bit < bytes.length * 8; bit++) if (bitAt(bit)) return null;
  return codes;
}
