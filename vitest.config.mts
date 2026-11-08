import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

const root = fileURLToPath(new URL('./', import.meta.url));

/** Projet Storybook : chaque story est exécutée dans Chromium avec la vérification d'accessibilité (R5, US3). */
function storybookProject(name: string, theme: 'clair' | 'sombre') {
  return {
    extends: true as const,
    plugins: [storybookTest({ configDir: `${root}.storybook`, storybookScript: 'pnpm exec storybook dev -p 6007 --no-open', storybookUrl: 'http://localhost:6007' })],
    define: { 'import.meta.env.STORYBOOK_THEME': JSON.stringify(theme) },
    test: {
      name,
      browser: {
        enabled: true,
        headless: true,
        provider: playwright(),
        instances: [{ browser: 'chromium' as const }],
      },
      setupFiles: ['.storybook/vitest.setup.ts'],
    },
  };
}

/**
 * Trois projets Vitest :
 * - `unit` : jsdom + Testing Library, tests `src/**\/*.test.{ts,tsx}` et tests des scripts de
 *   données `scripts/**\/*.test.ts` (ces derniers portent l'en-tête `// @vitest-environment node`
 *   et n'écrivent que dans un dossier temporaire) ;
 * - `storybook` et `storybook-sombre` : toutes les stories comme tests, dans chaque apparence (SC-004).
 */
export default defineConfig({
  resolve: {
    alias: { '@': `${root}src` },
  },
  test: {
    projects: [
      {
        extends: true,
        plugins: [react()],
        test: {
          name: 'unit',
          environment: 'jsdom',
          include: ['src/**/*.test.{ts,tsx}', 'scripts/**/*.test.ts'],
          setupFiles: ['./vitest.setup.ts'],
        },
      },
      storybookProject('storybook', 'clair'),
      storybookProject('storybook-sombre', 'sombre'),
    ],
  },
});
