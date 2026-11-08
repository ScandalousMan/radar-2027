// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { minimalMainDataset } from './fixture';
import { positionOf, questionIndex } from './positions';

describe('positionOf', () => {
  const ds = minimalMainDataset();
  it('retourne la case connue', () => {
    expect(positionOf(ds, 'dupont', 'economie-a')).toEqual([-1, 'p']);
  });
  it('null si inconnue, candidat ou question absents', () => {
    expect(positionOf(ds, 'dupont', 'sante-b')).toBeNull();
    expect(positionOf(ds, 'absent', 'economie-a')).toBeNull();
    expect(positionOf(ds, 'dupont', 'absente')).toBeNull();
  });
  it('questionIndex suit l’ordre de questions[]', () => {
    expect([...questionIndex(ds)]).toEqual([
      ['economie-a', 0],
      ['sante-b', 1],
    ]);
  });
});
