// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { FR_015 } from './FR-015';
import { ids, minimalContext } from './testing';

function withOldSource() {
  const ctx = minimalContext();
  ctx.corpus.sources.get('martin')![0]!.publishedAt = { date: '2021-03', precision: 'month' };
  return ctx;
}

describe('FR-015', () => {
  it('fixture minimale conforme', () => expect(ids(FR_015, minimalContext())).toEqual([]));
  it('source antérieure à 2022 sans old: true', () => {
    expect(ids(FR_015, withOldSource())).toEqual(['martin/environnement-q01']);
  });
  it('old: true accepté si toutes les sources sont anciennes, refusé sinon', () => {
    const ctx = withOldSource();
    ctx.corpus.positions.get('martin')![0]!.old = true;
    expect(ids(FR_015, ctx)).toEqual([]);
    ctx.corpus.positions.get('dupont')![0]!.old = true;
    expect(ids(FR_015, ctx)).toEqual(['dupont/economie-q01']);
  });
  it('avertissement si une source récente contient la citation', () => {
    const ctx = withOldSource();
    const p = ctx.corpus.positions.get('martin')![0]!;
    p.old = true;
    ctx.corpus.sources.get('martin')!.push({ ...ctx.corpus.sources.get('martin')![0]!, id: 'martin-recente', url: 'https://exemple.fr/r', publishedAt: { date: '2026', precision: 'year' } });
    expect(ids(FR_015, ctx, 'warning')).toEqual(['martin/environnement-q01']);
  });
});
