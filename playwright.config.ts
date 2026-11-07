import { defineConfig, devices } from '@playwright/test';

/**
 * Tests de bout en bout contre l'export statique (`out/`) servi localement (R6, FR-020).
 * - `chromium` : seul projet exécuté en CI ; `webServer` lance `pnpm start:static`.
 * - `preview` : défini seulement si `PREVIEW_URL` est renseigné (local), vérifie les en-têtes
 *   de sécurité d'une prévisualisation ou de la production (SC-010), sans serveur local.
 */
const previewUrl = process.env.PREVIEW_URL;
const isCi = Boolean(process.env.CI);

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: isCi,
  retries: 1,
  reporter: isCi ? [['github'], ['html', { open: 'never' }]] : [['list'], ['html', { open: 'never' }]],
  use: {
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      testIgnore: /headers\.spec\.ts$/,
      use: { ...devices['Desktop Chrome'], baseURL: 'http://localhost:3000' },
    },
    ...(previewUrl
      ? [
          {
            name: 'preview',
            testMatch: /headers\.spec\.ts$/,
            use: { baseURL: previewUrl },
          },
        ]
      : []),
  ],
  webServer: {
    command: 'pnpm start:static',
    url: 'http://localhost:3000',
    reuseExistingServer: !isCi,
    timeout: 60_000,
  },
});
