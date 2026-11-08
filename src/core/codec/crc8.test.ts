// @vitest-environment node
import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { crc8 } from './crc8';

const hex = (s: string) => Uint8Array.from(s.match(/../g)!.map((b) => parseInt(b, 16)));

describe('crc8 (FR-031)', () => {
  it('vecteurs de référence', () => {
    expect(crc8(new Uint8Array())).toBe(0);
    expect(crc8(new Uint8Array([...'123456789'].map((c) => c.charCodeAt(0))))).toBe(0xf4);
  });

  it('CRC des deux charges de référence', () => {
    expect(crc8(hex(`0000840200C580${'00'.repeat(36)}`))).toBe(0xc3);
    expect(crc8(hex('0001851200C5800000000000000000'))).toBe(0x9e);
  });

  it('propriété : modifier un octet change toujours le CRC', () => {
    fc.assert(
      fc.property(fc.uint8Array({ minLength: 1, maxLength: 44 }), fc.nat(), fc.integer({ min: 1, max: 255 }), (bytes, at, delta) => {
        const altered = Uint8Array.from(bytes);
        const i = at % bytes.length;
        altered[i] = altered[i]! ^ delta;
        expect(crc8(altered)).not.toBe(crc8(bytes));
      }),
      { numRuns: 2000 },
    );
  });
});
