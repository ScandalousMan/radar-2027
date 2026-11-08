// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { FR_010 } from './FR-010';
import { ids, minimalContext, questionsOf } from './testing';

describe('FR-010', () => {
  it('fixture minimale conforme', () => expect(ids(FR_010, minimalContext())).toEqual([]));
  it('énoncé actif auto-relu', () => {
    const ctx = minimalContext();
    questionsOf(ctx, 'environnement')[4]!.reviewer = 'adrien';
    expect(ids(FR_010, ctx)).toEqual(['environnement-q05']);
  });
  it('actif sans relecteur ni date ; brouillon non relu accepté', () => {
    const ctx = minimalContext();
    const [a, b] = questionsOf(ctx, 'sante');
    delete a!.reviewer;
    delete a!.reviewedAt;
    b!.status = 'draft';
    delete b!.reviewer;
    expect(ids(FR_010, ctx)).toEqual(['sante-q01', 'sante-q01']);
  });
});
