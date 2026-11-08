// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { FR_008 } from './FR-008';
import { ids, minimalContext, questionsOf } from './testing';

describe('FR-008', () => {
  it('fixture minimale conforme', () => expect(ids(FR_008, minimalContext())).toEqual([]));
  it('trois thèmes', () => {
    const ctx = minimalContext();
    questionsOf(ctx, 'sante')[2]!.themes = ['sante', 'economie', 'environnement'];
    expect(ids(FR_008, ctx)).toEqual(['sante-q03']);
  });
  it('mauvais fichier, thèmes en double, retiredIn < introducedIn', () => {
    const ctx = minimalContext();
    const [a, b, c] = questionsOf(ctx, 'economie');
    a!.themes = ['sante'];
    b!.themes = ['economie', 'economie'];
    c!.introducedIn = 3;
    c!.retiredIn = 2;
    expect(ids(FR_008, ctx)).toEqual(['economie-q01', 'economie-q02', 'economie-q03']);
  });
});
