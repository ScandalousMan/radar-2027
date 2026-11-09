// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { testDraft } from './fixtures';
import { resumeInfoFrom } from './resume-info';

describe('resumeInfoFrom', () => {
  const draft = testDraft({ answers: testDraft().answers.map((a, i) => (i < 8 ? 1 : i < 10 ? 'skipped' : a)), position: 10 });

  it('compte les questions traitées (répondues ou passées)', () => {
    expect(resumeInfoFrom(draft, { current: 1 })).toEqual({ mode: 'short', done: 10, total: 25, updatedAt: draft.updatedAt, status: 'resumable', versionChanged: false });
  });

  it('signale une version changée', () => {
    expect(resumeInfoFrom(draft, { current: 2 }).status).toBe('version-changed');
  });

  it('registre indisponible', () => {
    expect(resumeInfoFrom(draft, null).status).toBe('unavailable');
  });

  it('brouillon complet ⇒ complete, version changée signalée à part (FR-035a)', () => {
    const complete = testDraft({ answers: testDraft().answers.map((_, i) => (i % 3 === 0 ? 'skipped' : 2)) });
    expect(resumeInfoFrom(complete, { current: 1 })).toMatchObject({ status: 'complete', versionChanged: false, done: 25 });
    expect(resumeInfoFrom(complete, { current: 2 })).toMatchObject({ status: 'complete', versionChanged: true });
    expect(resumeInfoFrom(complete, null).status).toBe('unavailable');
  });
});
