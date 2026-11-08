// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { minimalMainDataset } from '@/core/dataset/fixture';
import { FR_003 } from './FR-003';
import { ids, minimalContext } from './testing';

describe('FR-003', () => {
  it('fixture minimale conforme', () => expect(ids(FR_003, minimalContext())).toEqual([]));
  it('thème retiré avec question active', () => {
    const ctx = minimalContext();
    ctx.corpus.themes[1]!.status = 'retired';
    expect(ids(FR_003, ctx)).toEqual(['sante']);
  });
  it('thème publié supprimé du corpus', () => {
    const ctx = minimalContext();
    const current = minimalMainDataset();
    ctx.published = { registry: { current: 1, versions: [] }, current, files: new Map() };
    expect(ids(FR_003, ctx)).toEqual([]);
    ctx.corpus.themes = ctx.corpus.themes.filter((t) => t.id !== 'sante');
    expect(ids(FR_003, ctx)).toEqual(['sante']);
  });
});
