// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { PUB_BUDGET } from './PUB-BUDGET';
import { ids, minimalContext } from './testing';

describe('PUB-BUDGET', () => {
  it('fichiers sous budget, puis budget minuscule', () => {
    const ctx = minimalContext();
    ctx.published = {
      registry: { current: 0, versions: [] },
      current: null,
      files: new Map([
        ['versions.json', { bytes: 30, hash: '' }],
        ['versions/1/main.json', { bytes: 120_000, hash: '' }],
        ['versions/1/candidates/dupont.json', { bytes: 160_000, hash: '' }],
      ]),
    };
    expect(ids(PUB_BUDGET, ctx)).toEqual(['versions/1/candidates/dupont.json']);
    ctx.thresholds = { ...ctx.thresholds, mainBudgetBytes: 10 };
    expect(ids(PUB_BUDGET, ctx)).toEqual(['versions/1/main.json', 'versions/1/candidates/dupont.json']);
  });

  it('glossary.json : au plus 30 Kio (009)', () => {
    const ctx = minimalContext();
    ctx.published = { registry: { current: 0, versions: [] }, current: null, files: new Map([['glossary.json', { bytes: 30_720, hash: '' }]]) };
    expect(ids(PUB_BUDGET, ctx)).toEqual([]);
    ctx.published.files.set('glossary.json', { bytes: 30_721, hash: '' });
    expect(ids(PUB_BUDGET, ctx)).toEqual(['glossary.json']);
  });
});
