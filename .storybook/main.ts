import type { StorybookConfig } from '@storybook/nextjs-vite';

const config: StorybookConfig = {
  framework: '@storybook/nextjs-vite',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.tsx'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-themes', '@storybook/addon-vitest'],
  staticDirs: ['../public'],
  // Aucune télémétrie, même anonyme (principe II).
  core: { disableTelemetry: true },
};

export default config;
