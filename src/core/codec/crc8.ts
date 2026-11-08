// CRC-8, polynôme x⁸ + x² + x + 1 (0x07), init 0, sans réflexion ni masque final (FR-031).

const TABLE: readonly number[] = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 0x80 ? ((c << 1) ^ 0x07) & 0xff : (c << 1) & 0xff;
  return c;
});

export function crc8(bytes: Uint8Array): number {
  let crc = 0;
  for (const b of bytes) crc = TABLE[crc ^ b]!;
  return crc;
}
