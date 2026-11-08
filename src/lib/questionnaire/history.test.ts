import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useQuestionHistory } from './history';

afterEach(() => vi.restoreAllMocks());

function pop(state: unknown) {
  act(() => {
    window.dispatchEvent(new PopStateEvent('popstate', { state }));
  });
}

describe('useQuestionHistory', () => {
  it('replaceState au montage, pushState à chaque position initiée par l’interface, URL inchangée', () => {
    const replace = vi.spyOn(window.history, 'replaceState');
    const push = vi.spyOn(window.history, 'pushState');
    const href = window.location.href;
    const { rerender } = renderHook(({ p }) => useQuestionHistory(p, vi.fn()), { initialProps: { p: 0 } });
    expect(replace).toHaveBeenCalledTimes(1);
    expect(replace.mock.calls[0]![0]).toMatchObject({ radar: { position: 0 } });
    expect(push).not.toHaveBeenCalled();
    rerender({ p: 1 });
    rerender({ p: 1 });
    rerender({ p: 2 });
    expect(push).toHaveBeenCalledTimes(2);
    expect(push.mock.calls.map((c) => c[0])).toEqual([expect.objectContaining({ radar: { position: 1 } }), expect.objectContaining({ radar: { position: 2 } })]);
    expect(push.mock.calls.every((c) => c[2] === href)).toBe(true);
    expect(window.location.href).toBe(href);
  });

  it('popstate avec radar.position appelle onPopPosition sans nouveau pushState', () => {
    const push = vi.spyOn(window.history, 'pushState');
    const onPop = vi.fn();
    const { rerender } = renderHook(({ p }) => useQuestionHistory(p, onPop), { initialProps: { p: 3 } });
    pop({ radar: { position: 2 } });
    expect(onPop).toHaveBeenCalledWith(2);
    rerender({ p: 2 });
    expect(push).not.toHaveBeenCalled();
    rerender({ p: 3 });
    expect(push).toHaveBeenCalledTimes(1);
  });

  it('popstate sans radar est ignoré', () => {
    const onPop = vi.fn();
    renderHook(() => useQuestionHistory(0, onPop));
    pop(null);
    pop({ __NA: true });
    expect(onPop).not.toHaveBeenCalled();
  });
});
