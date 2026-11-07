import * as a11yAddonAnnotations from '@storybook/addon-a11y/preview';
import { setProjectAnnotations } from '@storybook/nextjs-vite';
import * as projectAnnotations from './preview';

/** Apparence imposée au projet Vitest (`clair` ou `sombre`), voir vitest.config.mts. */
const theme = (import.meta.env.STORYBOOK_THEME as string | undefined) ?? 'clair';

setProjectAnnotations([a11yAddonAnnotations, projectAnnotations, { initialGlobals: { theme } }]);
