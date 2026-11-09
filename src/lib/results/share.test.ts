// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';
import { canShareNatively, copyLink, shareNatively } from './share';

const URL = 'https://radar.exemple/resultats#1.AbC';

describe('copyLink (R6, FR-027)', () => {
  it('writeText réussit ⇒ copied, avec le lien exact', async () => {
    const writeText = vi.fn(async () => undefined);
    expect(await copyLink(URL, { writeText })).toBe('copied');
    expect(writeText).toHaveBeenCalledWith(URL);
  });

  it('writeText rejette ⇒ manual', async () => {
    expect(await copyLink(URL, { writeText: vi.fn(async () => Promise.reject(new DOMException('refusé', 'NotAllowedError'))) })).toBe('manual');
  });

  it('API absente ⇒ manual', async () => {
    expect(await copyLink(URL, null)).toBe('manual');
  });
});

describe('partage natif (FR-030)', () => {
  it('canShareNatively', () => {
    expect(canShareNatively({ share: vi.fn() })).toBe(true);
    expect(canShareNatively({})).toBe(false);
    expect(canShareNatively(null)).toBe(false);
  });

  it('partage : contenu limité au titre, texte générique et lien', async () => {
    const share = vi.fn(async () => undefined);
    expect(await shareNatively({ title: 'T', text: 'D', url: URL }, { share })).toBe('shared');
    expect(share).toHaveBeenCalledWith({ title: 'T', text: 'D', url: URL });
  });

  it('annulation ⇒ cancelled', async () => {
    const share = vi.fn(async () => Promise.reject(new DOMException('annulé', 'AbortError')));
    expect(await shareNatively({ title: 'T', text: 'D', url: URL }, { share })).toBe('cancelled');
  });
});
