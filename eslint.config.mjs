// Configuration ESLint (flat config) de radar-2027.
//
// Trois règles projet s'ajoutent aux presets Next, TypeScript, a11y et Storybook :
//   1. frontière du domaine : `src/core` n'importe ni React, ni DOM, ni Next (FR-018) ;
//   2. tokens seulement : aucune couleur ni valeur de style arbitraire dans `src/app` et
//      `src/ui` (FR-011) ;
//   3. i18n : aucune chaîne destinée à l'utilisateur en dur dans le JSX (FR-005).
import { defineConfig, globalIgnores } from 'eslint/config';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import storybook from 'eslint-plugin-storybook';

// Motifs rejetés par la règle « tokens seulement ». Chaque sélecteur désigne la ligne fautive.
const hardcodedStylePatterns = [
  {
    selector: 'Literal[value=/#[0-9a-fA-F]{3,8}\\b/], TemplateElement[value.raw=/#[0-9a-fA-F]{3,8}\\b/]',
    message:
      'Couleur hexadécimale interdite hors de src/ui/tokens.css : utiliser une classe issue des tokens (bg-bg, text-fg, …).',
  },
  {
    selector:
      'Literal[value=/\\b(rgb|rgba|hsl|hsla|oklch|oklab|hwb|color)\\(/], TemplateElement[value.raw=/\\b(rgb|rgba|hsl|hsla|oklch|oklab|hwb|color)\\(/]',
    message: 'Fonction de couleur interdite hors de src/ui/tokens.css : utiliser un token.',
  },
  {
    selector:
      'Literal[value=/-\\[(#|rgb|hsl|oklch|oklab|hwb|var\\()/], TemplateElement[value.raw=/-\\[(#|rgb|hsl|oklch|oklab|hwb|var\\()/]',
    message: 'Valeur de couleur arbitraire Tailwind interdite (bg-[#…], text-[rgb(…)]) : utiliser un token.',
  },
  {
    selector:
      'Literal[value=/-\\[-?[0-9.]+(px|rem|em|%|vw|vh|dvh|svh|ch)\\]/], TemplateElement[value.raw=/-\\[-?[0-9.]+(px|rem|em|%|vw|vh|dvh|svh|ch)\\]/]',
    message: 'Valeur de taille arbitraire Tailwind interdite (p-[7px], text-[13px]) : utiliser l’échelle des tokens.',
  },
];

// Attributs qui portent un texte lu par l'utilisateur ou une technologie d'assistance.
const userFacingAttributes =
  'aria-label|aria-description|aria-placeholder|aria-roledescription|aria-valuetext|title|alt|placeholder|label';

export default defineConfig([
  globalIgnores([
    'node_modules/**',
    '.next/**',
    'out/**',
    'storybook-static/**',
    'playwright-report/**',
    'test-results/**',
    'coverage/**',
    'next-env.d.ts',
  ]),

  ...nextCoreWebVitals,
  ...nextTypescript,
  ...storybook.configs['flat/recommended'],

  // Accessibilité : preset strict de jsx-a11y (le plugin est déjà enregistré par eslint-config-next).
  {
    files: ['src/**/*.{ts,tsx}', '.storybook/**/*.{ts,tsx}'],
    rules: { ...jsxA11y.flatConfigs.strict.rules },
  },

  // 1. Frontière du domaine (principe III, FR-018).
  {
    files: ['src/core/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: 'react', message: 'src/core est un module pur : aucun import React.' },
            { name: 'react-dom', message: 'src/core est un module pur : aucun import React DOM.' },
            { name: 'next', message: 'src/core est un module pur : aucun import Next.js.' },
          ],
          patterns: [
            { group: ['react/*', 'react-dom/*'], message: 'src/core est un module pur : aucun import React.' },
            { group: ['next/*'], message: 'src/core est un module pur : aucun import Next.js.' },
            { group: ['@/ui', '@/ui/*', '**/ui', '**/ui/*'], message: 'src/core ne dépend pas de src/ui.' },
            { group: ['@/app', '@/app/*', '**/app', '**/app/*'], message: 'src/core ne dépend pas de src/app.' },
          ],
        },
      ],
      'no-restricted-globals': [
        'error',
        { name: 'window', message: 'src/core n’accède pas au DOM.' },
        { name: 'document', message: 'src/core n’accède pas au DOM.' },
        { name: 'localStorage', message: 'src/core n’accède pas au stockage du navigateur.' },
        { name: 'fetch', message: 'src/core n’accède pas au réseau.' },
      ],
    },
  },

  // 2. Tokens seulement (principe IV, FR-011).
  {
    files: ['src/app/**/*.{ts,tsx}', 'src/ui/**/*.{ts,tsx}'],
    ignores: ['src/**/*.test.{ts,tsx}'],
    rules: {
      'no-restricted-syntax': ['error', ...hardcodedStylePatterns],
    },
  },

  // 3. Aucune chaîne destinée à l'utilisateur en dur (principe VI, FR-005).
  //    `ignoreProps: true` laisse passer les props techniques (className, type, href, role…) ;
  //    les attributs textuels lus par l'utilisateur sont couverts par le sélecteur ci-dessous.
  {
    files: ['src/app/**/*.tsx', 'src/ui/**/*.tsx'],
    // Tests, stories et pages de documentation Storybook (`src/ui/docs`) ne sont pas de l'interface produit.
    ignores: ['src/**/*.test.tsx', 'src/**/*.stories.tsx', 'src/ui/docs/**'],
    rules: {
      'react/jsx-no-literals': [
        'error',
        {
          noStrings: true,
          ignoreProps: true,
          allowedStrings: ['/', '·', '—', '–', '%', '(', ')', '…', ':', '&nbsp;'],
        },
      ],
      'no-restricted-syntax': [
        'error',
        ...hardcodedStylePatterns,
        {
          selector: `JSXAttribute[name.name=/^(${userFacingAttributes})$/] > Literal`,
          message: 'Texte destiné à l’utilisateur en dur dans un attribut : passer par next-intl (fr.json).',
        },
        {
          selector: `JSXAttribute[name.name=/^(${userFacingAttributes})$/] > JSXExpressionContainer > :matches(Literal[value=/[A-Za-zÀ-ÿ]/], TemplateLiteral)`,
          message: 'Texte destiné à l’utilisateur en dur dans un attribut : passer par next-intl (fr.json).',
        },
      ],
    },
  },

  // Fichiers de configuration et tests : règles Next sur les pages non pertinentes.
  {
    files: ['*.{ts,mts,mjs}', '.storybook/**/*.{ts,tsx}', 'e2e/**/*.ts'],
    rules: {
      'import/no-anonymous-default-export': 'off',
    },
  },

  // App Router uniquement : la règle Next dédiée au dossier `pages/` est sans objet.
  {
    rules: {
      '@next/next/no-html-link-for-pages': 'off',
    },
  },
]);
