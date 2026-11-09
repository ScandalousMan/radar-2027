// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { testDraft } from './fixtures';
import { setHandoff, takeHandoffDraft, takeHandoffPreselection } from './handoff';

describe('relais résultats → questionnaire', () => {
  it('brouillon consommé à la première lecture', () => {
    const draft = testDraft();
    setHandoff({ kind: 'draft', draft });
    expect(takeHandoffPreselection()).toBeNull();
    expect(takeHandoffDraft()).toBe(draft);
    expect(takeHandoffDraft()).toBeNull();
  });

  it('présélection consommée à la première lecture', () => {
    setHandoff({ kind: 'preselection', priorities: ['t01', 't04'], mode: 'short' });
    expect(takeHandoffDraft()).toBeNull();
    expect(takeHandoffPreselection()).toEqual({ priorities: ['t01', 't04'], mode: 'short' });
    expect(takeHandoffPreselection()).toBeNull();
  });
});
