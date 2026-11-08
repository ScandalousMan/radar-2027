// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { testDraft } from './fixtures';
import { resumeInfoFrom } from './resume-info';

describe('resumeInfoFrom', () => {
  const draft = testDraft({ answers: testDraft().answers.map((a, i) => (i < 8 ? 1 : i < 10 ? 'skipped' : a)), position: 10 });

  it('compte les questions traitées (répondues ou passées)', () => {
    expect(resumeInfoFrom(draft, { current: 1 })).toEqual({ mode: 'short', done: 10, total: 25, updatedAt: draft.updatedAt, status: 'resumable' });
  });

  it('signale une version changée', () => {
    expect(resumeInfoFrom(draft, { current: 2 }).status).toBe('version-changed');
  });

  it('registre indisponible', () => {
    expect(resumeInfoFrom(draft, null).status).toBe('unavailable');
  });
});
