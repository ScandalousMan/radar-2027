// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { PUB_IMMUTABLE } from './PUB-IMMUTABLE';
import { ids, minimalContext } from './testing';

const H = (c: string) => `sha256:${c.repeat(64)}`;

function withVersion() {
  const ctx = minimalContext();
  ctx.published = {
    registry: { current: 1, versions: [{ number: 1, publishedAt: '2026-11-10', questionCount: 30, candidateCount: 2, mainHash: H('a'), detailHashes: { dupont: H('b') } }] },
    current: null,
    files: new Map([
      ['versions.json', { bytes: 100, hash: H('0') }],
      ['versions/1/main.json', { bytes: 100, hash: H('a') }],
      ['versions/1/candidates/dupont.json', { bytes: 100, hash: H('b') }],
    ]),
  };
  return ctx;
}

describe('PUB-IMMUTABLE', () => {
  it('sans version : sans effet', () => expect(ids(PUB_IMMUTABLE, minimalContext())).toEqual([]));
  it('empreintes conformes', () => expect(ids(PUB_IMMUTABLE, withVersion())).toEqual([]));
  it('main.json altéré, détail manquant, fichier hors registre', () => {
    const ctx = withVersion();
    ctx.published!.files.set('versions/1/main.json', { bytes: 101, hash: H('c') });
    ctx.published!.files.delete('versions/1/candidates/dupont.json');
    ctx.published!.files.set('versions/2/main.json', { bytes: 1, hash: H('d') });
    expect(ids(PUB_IMMUTABLE, ctx)).toEqual(['version 1', 'version 1', 'versions/2/main.json']);
  });
});
