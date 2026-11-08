// @vitest-environment node
import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { decodeBase64Url, encodeBase64Url } from './base64url';

describe('base64url (FR-028, R3)', () => {
  it('encode sans bourrage', () => {
    expect(encodeBase64Url(Uint8Array.from([0x00, 0x01, 0x85, 0x12]))).toBe('AAGFEg');
    expect(encodeBase64Url(Uint8Array.from([0xfb, 0xff]))).toBe('-_8');
    expect(encodeBase64Url(new Uint8Array())).toBe('');
  });

  it('décode l’inverse', () => {
    expect(decodeBase64Url('AAGFEg')).toEqual(Uint8Array.from([0x00, 0x01, 0x85, 0x12]));
    expect(decodeBase64Url('-_8')).toEqual(Uint8Array.from([0xfb, 0xff]));
    expect(decodeBase64Url('AA')).toEqual(Uint8Array.from([0x00]));
    expect(decodeBase64Url('AQ')).toEqual(Uint8Array.from([0x01]));
  });

  it.each(['AA==', 'AA=', 'A+', 'A/', 'A A', 'AAAAA', 'AB', 'AC'])('refuse « %s »', (text) => {
    expect(decodeBase64Url(text)).toBeNull();
  });

  it('propriété : decode(encode(b)) = b', () => {
    fc.assert(
      fc.property(fc.uint8Array({ maxLength: 64 }), (b) => {
        expect(decodeBase64Url(encodeBase64Url(b))).toEqual(b);
      }),
    );
  });

  it('propriété : encode(decode(s)) = s pour toute chaîne acceptée', () => {
    const arb = fc.string({ unit: fc.constantFrom(...'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'), maxLength: 40 });
    fc.assert(
      fc.property(arb, (s) => {
        const b = decodeBase64Url(s);
        if (b) expect(encodeBase64Url(b)).toBe(s);
      }),
    );
  });
});
