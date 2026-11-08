// base64url sans bourrage, sans API d'environnement (FR-028, research.md R3).
// Le décodeur est strict : alphabet `A–Z a–z 0–9 - _`, aucun `=`, longueur ≢ 1 (mod 4) et bits
// de queue du dernier caractère nuls, pour que `encode(decode(s)) = s` (bijection, FR-035).

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

const LOOKUP: ReadonlyMap<string, number> = new Map([...ALPHABET].map((ch, i) => [ch, i]));

export function encodeBase64Url(bytes: Uint8Array): string {
  let out = '';
  let acc = 0;
  let bits = 0;
  for (const b of bytes) {
    acc = (acc << 8) | b;
    bits += 8;
    while (bits >= 6) {
      bits -= 6;
      out += ALPHABET[(acc >> bits) & 0x3f];
    }
    acc &= (1 << bits) - 1;
  }
  if (bits > 0) out += ALPHABET[(acc << (6 - bits)) & 0x3f];
  return out;
}

/** Octets décodés, ou `null` si la chaîne n'est pas une base64url canonique. */
export function decodeBase64Url(text: string): Uint8Array | null {
  if (text.length % 4 === 1) return null;
  const out = new Uint8Array(Math.floor((text.length * 6) / 8));
  let acc = 0;
  let bits = 0;
  let o = 0;
  for (const ch of text) {
    const v = LOOKUP.get(ch);
    if (v === undefined) return null;
    acc = (acc << 6) | v;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      out[o++] = (acc >> bits) & 0xff;
    }
    acc &= (1 << bits) - 1;
  }
  if (acc !== 0) return null;
  return out;
}
