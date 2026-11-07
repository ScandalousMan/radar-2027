import { expect, test } from '@playwright/test';

/**
 * En-têtes de sécurité d'une prévisualisation ou de la production Vercel (FR-024, SC-010).
 * Exécuté uniquement dans le projet `preview`, lui-même défini si `PREVIEW_URL` est renseigné.
 */
const EXPECTED_HEADERS: Record<string, string> = {
  'content-security-policy':
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'",
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'permissions-policy': 'camera=(), microphone=(), geolocation=()',
  'x-frame-options': 'DENY',
};

test.describe('en-têtes de sécurité (PREVIEW_URL)', () => {
  test.skip(!process.env.PREVIEW_URL, 'PREVIEW_URL non défini');

  test('la page HTML porte les cinq en-têtes attendus', async ({ request }) => {
    const response = await request.get('/');
    expect(response.ok()).toBe(true);
    const headers = response.headers();
    for (const [name, value] of Object.entries(EXPECTED_HEADERS)) {
      expect(headers[name], name).toBe(value);
    }
  });
});
