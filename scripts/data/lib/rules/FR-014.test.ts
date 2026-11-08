// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { FR_014 } from './FR-014';
import { ids, minimalContext } from './testing';

describe('FR-014', () => {
  it('fixture minimale conforme', () => expect(ids(FR_014, minimalContext())).toEqual([]));
  it('empreinte absente', () => {
    const ctx = minimalContext();
    delete ctx.corpus.sources.get('martin')![0]!.contentHash;
    expect(ids(FR_014, ctx)).toEqual(['martin-declaration-candidature']);
  });
  it('texte modifié en cache ⇒ violation ; texte absent ⇒ avertissement', () => {
    const ctx = minimalContext();
    const s = ctx.corpus.sources.get('martin')![0]!;
    const original = ctx.cache!;
    ctx.cache = { dir: original.dir, read: (h) => (h === s.contentHash ? 'texte modifié' : original.read(h)) };
    expect(ids(FR_014, ctx)).toEqual(['martin-declaration-candidature']);
    ctx.cache = { dir: original.dir, read: (h) => (h === s.contentHash ? null : original.read(h)) };
    expect(ids(FR_014, ctx)).toEqual([]);
    expect(ids(FR_014, ctx, 'warning')).toEqual(['martin-declaration-candidature']);
  });
  it('sans cache : seule la présence de l’empreinte est vérifiée', () => {
    expect(FR_014.run(minimalContext({ cache: false }))).toEqual([]);
  });
});
