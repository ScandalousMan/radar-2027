// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { FR_016 } from './FR-016';
import { ids, minimalContext } from './testing';

describe('FR-016', () => {
  it('fixture minimale conforme', () => expect(ids(FR_016, minimalContext())).toEqual([]));
  it('doublon de couple', () => {
    const ctx = minimalContext();
    const list = ctx.corpus.positions.get('martin')!;
    list.push({ ...list[0]! });
    expect(ids(FR_016, ctx)).toEqual(['martin/environnement-q01']);
  });
  it('provenance d’extraction inconnue', () => {
    const ctx = minimalContext();
    ctx.corpus.positions.get('martin')![0]!.provenance = { kind: 'extraction', run: '20261108T101500Z-9c2e1f0a', affirmation: '7b1d2c3e4f506172', model: 'claude-opus-5-5' };
    expect(ids(FR_016, ctx)).toEqual([]); // sans data/extractions : non vérifiable
    ctx.extractions = { runs: new Set(), affirmations: new Map() };
    expect(ids(FR_016, ctx)).toEqual(['martin/environnement-q01', 'martin/environnement-q01']);
  });
});
