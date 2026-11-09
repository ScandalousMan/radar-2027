// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';
import { pushView, readView, replaceView } from './history';

describe('readView (R1)', () => {
  it.each([null, undefined, 42, 'x', {}, { radarResults: null }, { radarResults: { view: 'inconnue' } }, { radarResults: { view: 'candidate' } }, { radarResults: { view: 'candidate', candidateId: '' } }, { radarResults: { view: 'compare', candidateIds: ['a'] } }, { radarResults: { view: 'compare', candidateIds: ['a', 'b', 'c', 'd'] } }, { radarResults: { view: 'compare', candidateIds: ['a', 'a'] } }, { radarResults: { view: 'compare', candidateIds: 'ab' } }])('%o ⇒ classement', (state) => {
    expect(readView(state)).toEqual({ view: 'ranking' });
  });

  it('fiche et comparaison valides', () => {
    expect(readView({ radarResults: { view: 'candidate', candidateId: 'c01' } })).toEqual({ view: 'candidate', candidateId: 'c01' });
    expect(readView({ __NA: true, radarResults: { view: 'compare', candidateIds: ['c01', 'c02', 'c03'] } })).toEqual({ view: 'compare', candidateIds: ['c01', 'c02', 'c03'] });
  });
});

function fakeHistory(state: unknown = { __NA: true, tree: 1 }) {
  return { state, pushState: vi.fn(), replaceState: vi.fn() };
}

describe('pushView / replaceView', () => {
  const href = 'https://radar.exemple/resultats#1.AbC';

  it('pushView empile la vue, conserve l’état existant et l’adresse courante', () => {
    const h = fakeHistory();
    pushView({ view: 'candidate', candidateId: 'c01' }, h, href);
    expect(h.pushState).toHaveBeenCalledWith({ __NA: true, tree: 1, radarResults: { view: 'candidate', candidateId: 'c01' } }, '', href);
    expect(h.replaceState).not.toHaveBeenCalled();
  });

  it('replaceView remplace, état nul toléré', () => {
    const h = fakeHistory(null);
    replaceView({ view: 'ranking' }, h, href);
    expect(h.replaceState).toHaveBeenCalledWith({ radarResults: { view: 'ranking' } }, '', href);
  });
});
