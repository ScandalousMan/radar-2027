import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

/**
 * Deux projets Vitest (R5) :
 * - `unit` : jsdom + Testing Library, tests `src/**\/*.test.{ts,tsx}` ;
 * - `storybook` : ajouté en US3 (stories exécutées dans Chromium avec vérification d'accessibilité).
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          environment: 'jsdom',
          include: ['src/**/*.test.{ts,tsx}'],
          setupFiles: ['./vitest.setup.ts'],
        },
      },
    ],
  },
});
