# Recherche : socle et design system

**Feature** : `001-socle-design-system` · **Date** : 2026-11-06

Versions vérifiées sur le registre npm et les notes de version officielles le 2026-11-06. Toutes
les dépendances sont épinglées à ces versions dans `package.json` (pas de `^` sur les paquets de
la pile, mises à jour par pull request dédiée).

## R1. Next.js 16.4 avec export statique

- **Décision** : Next.js 16.4.x (React 19.3), App Router, `output: 'export'`,
  `images.unoptimized: true`, `cacheComponents` explicitement désactivé, build avec Turbopack
  (défaut) et repli `--webpack` documenté si `out/` s'avérait incomplet.
- **Justification** : dernière version stable ; l'export statique supporte l'App Router et les
  Server Components. Les fonctions non supportées en export (`headers`, `redirects`, `proxy`,
  Server Actions, `cookies()`) ne sont pas nécessaires au socle et sont interdites par la
  constitution de toute façon.
- **Alternatives écartées** : Next 15 (plus maintenu en priorité, aucun gain) ; Vite + React
  Router (écarté par le choix de pile initial : routage fichier et rendu statique intégrés).
- **Conséquence** : les en-têtes de sécurité ne peuvent pas venir de `next.config` (ignorés en
  export) → `vercel.json` (R8).

## R2. next-intl 4.14 sans routage i18n

- **Décision** : mode « without i18n routing » : `createNextIntlPlugin()` dans `next.config.ts`,
  `src/i18n/request.ts` avec `getRequestConfig` renvoyant `locale: 'fr'` et les messages importés
  statiquement, `NextIntlClientProvider` dans `app/layout.tsx`, type `IntlMessages` dérivé de
  `fr.json` pour les clés typées.
- **Justification** : une seule locale sans préfixe d'URL (FR-006) ; la locale étant statique,
  aucun appel à `cookies()` ou `headers()` n'est nécessaire, ce qui rend le mode compatible avec
  l'export statique même si la documentation ne cite pas ce cas explicitement.
- **Risque et parade** : compatibilité export à prouver par un `pnpm build` dès la première tâche
  d'i18n ; en cas de blocage, repli sur `next-intl` côté client uniquement (provider + messages
  importés), sans plugin.
- **Alternatives écartées** : routage `[locale]` (préfixe d'URL non voulu, `generateStaticParams`
  inutile pour une locale) ; react-i18next (hors pile constitutionnelle).

## R3. Tailwind CSS 4.3 et tokens

- **Décision** : `tailwindcss` + `@tailwindcss/postcss` 4.3.x ; `src/ui/tokens.css` déclare les
  tokens dans `@theme` (`--color-*`, `--spacing-*`, `--font-*`, `--radius-*`, `--shadow-*`) et
  redéfinit les couleurs sous `[data-theme="dark"]` ; variante sombre
  `@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *))`.
- **Justification** : `@theme` produit à la fois les variables CSS (source unique, lisible par la
  page Storybook des tokens) et les utilitaires. L'attribut `data-theme` (plutôt que
  `prefers-color-scheme` seul) permet la bascule manuelle mémorisée (FR-010) et le toggle
  Storybook.
- **Alternatives écartées** : classe `.dark` (équivalent, mais `data-theme` se lit mieux dans le
  script d'initialisation et dans l'addon de thèmes) ; CSS Modules sans Tailwind (hors pile).

## R4. Storybook 10.6 (et non 9)

- **Décision** : Storybook 10.6.x avec `@storybook/nextjs-vite`, addons `addon-a11y`,
  `addon-docs`, `addon-themes` (`withThemeByDataAttribute({ attributeName: 'data-theme' })`) et
  `addon-vitest` ; `parameters.a11y.test: 'error'` pour rendre les violations bloquantes.
- **Justification** : Storybook 9 n'est plus la version stable (10.6 sortie en septembre 2026,
  11.0 en bêta depuis le 2026-11-03, à ne pas prendre). `@storybook/nextjs` (webpack) sera
  déprécié en 11 ; `nextjs-vite` est le framework recommandé et le seul compatible avec
  l'addon Vitest. La constitution et la spec 001 écrivent « Storybook 9 » : l'intention est
  « Storybook, version stable courante » ; la constitution est amendée en 1.0.1 pour le dire
  ainsi, et FR-014 de la spec est aligné.
- **Alternatives écartées** : rester en 9 (perte de support, incompatible Vitest 5) ; attendre 11
  (bêta).
- **Prérequis** : Node 20.19+ ou 22.12+ (Node 24 convient) ; Vite 8 via le framework.

## R5. Vitest 5.1 et stratégie de tests unitaires

- **Décision** : Vitest 5.1.x avec deux projets (le projet navigateur impose d'installer Chromium Playwright avant `pnpm test` en CI) : `unit` (environnement jsdom, Testing Library,
  tests `*.test.tsx` et `tokens.test.ts`) et `storybook` (addon Vitest, navigateur Chromium via
  `@vitest/browser-playwright`, exécute chaque story et sa vérification d'accessibilité).
- **Justification** : les stories deviennent des tests sans duplication (SC-003, SC-004) ; les
  interactions fines (bornes du ThemePicker, clavier du LikertChoice) restent en Testing Library,
  plus rapide à écrire et à déboguer. Vitest 5 est la version requise par addon-vitest 10.6.
- **Alternatives écartées** : Jest (hors pile, mal intégré à Vite) ; test-runner Storybook
  historique (remplacé par l'addon Vitest).
- **Notes v5** : `clearMocks: true` par défaut ; locators stricts.

## R6. Playwright 1.65 contre l'export statique

- **Décision** : Playwright 1.65.x, projet `chromium` (seul en CI) plus un projet `preview` conditionné à `PREVIEW_URL` pour les en-têtes de production, `retries: 1`, `webServer` lançant
  `pnpm start:static` (`serve out -l 3000`), `reuseExistingServer: !process.env.CI`.
- **Justification** : le test doit viser le build réellement déployé (FR-020) ; `serve` est un
  serveur de fichiers neutre, sans logique Next.
- **Alternatives écartées** : tester `next dev` (ne prouve pas l'export) ; `next start` (non
  applicable à `output: 'export'`).

## R7. Node 24 et pnpm 12

- **Décision** : Node 24 (`.nvmrc`, `engines`, `.npmrc engine-strict=true`), pnpm 12.x via le
  champ `packageManager` et `pnpm/action-setup` en CI.
- **Justification** : la constitution impose Node 24 ; il est en Maintenance LTS depuis le
  2026-10-20 (fin de vie 2028-04-30), donc sûr jusqu'après le scrutin. Corepack est expérimental
  en Node 24 et retiré de Node 25 : on ne s'appuie pas dessus (`pnpm self-update` ou installation
  globale), seul `packageManager` fait foi.
- **Alternative notée** : Node 26 (Active LTS depuis 2026-10-28) pourrait remplacer 24 par
  amendement de la constitution ; aucun besoin fonctionnel ne l'impose aujourd'hui.
- **Vigilance** : Next 16.4 signale un bug des worker threads sur Node ≥ 24.13.1 avec repli
  automatique ; surveiller les notes de version.

## R8. Vercel Hobby, export et en-têtes

- **Décision** : projet Vercel relié au dépôt, framework Next.js détecté, `out/` servi en
  statique ; en-têtes de sécurité dans `vercel.json` (`headers` sur `/(.*)`) puisque ceux de
  `next.config` sont ignorés en export.
- **Justification** : quotas Hobby largement suffisants pour un site statique léger (100 Go de
  transfert, 1 M de requêtes CDN, 100 déploiements par jour) ; prévisualisation automatique par
  pull request, autorisation manuelle pour les forks (cas limite déjà noté dans la spec).
- **Contrainte** : usage non commercial uniquement, conforme au projet. Les minutes de build ne
  sont pas publiées sur la page officielle du plan ; le budget CI < 10 min ne concerne de toute
  façon que GitHub Actions.

## R9. ESLint 10 et règles projet

- **Décision** : ESLint 10.x en flat config, `eslint-config-next` 16.4 (support ESLint 10 depuis
  16.4.0), `eslint-plugin-storybook` (`flat/recommended`), `eslint-plugin-jsx-a11y`, et règles
  projet : `no-restricted-imports` sur `src/core/**` (interdit `react`, `react-dom`, `next`,
  `next/*`, `@/ui`, `@/app`) ; `no-restricted-syntax` sur `src/app/**` et `src/ui/**` pour les
  littéraux de couleur (`#hex`, `rgb(`, `hsl(`, `oklch(`) et les valeurs arbitraires Tailwind de
  couleur ou de taille ; `react/jsx-no-literals` pour les chaînes en dur (ponctuation autorisée).
- **Justification** : couvre FR-011, FR-018 et SC-002 avec des règles standard, sans plugin
  maison. `next lint` ayant disparu en Next 16, `pnpm lint` appelle ESLint directement.
- **Vigilance** : certains plugins inclus par `eslint-config-next` n'ont pas encore ESLint 10 en
  peer : ne pas activer `strict-peer-dependencies` dans pnpm.

## R10. GitHub Actions

- **Décision** : `actions/checkout@v7`, `pnpm/action-setup@v6` (lit `packageManager`),
  `actions/setup-node@v7` avec `node-version-file: .nvmrc` et `cache: pnpm`, `pnpm install
  --frozen-lockfile`, étapes séparées pour lint, typecheck, test, storybook:build, build,
  `pnpm exec playwright install --with-deps chromium`, e2e, `actions/upload-artifact@v5` du
  rapport Playwright en cas d'échec.
- **Justification** : un seul job séquentiel suffit au budget de 10 minutes et donne un statut
  requis unique (`ci`) pour la protection de branche ; le cache pnpm et Chromium seul limitent
  la durée.

## Tableau des versions retenues

| Paquet | Version | Note |
|---|---|---|
| next / react / react-dom | 16.4.x / 19.3.x | export statique, Turbopack |
| next-intl | 4.14.x | sans routage i18n |
| tailwindcss, @tailwindcss/postcss | 4.3.x | tokens `@theme`, `data-theme` |
| storybook, @storybook/nextjs-vite, addon-a11y, addon-docs, addon-themes, addon-vitest, eslint-plugin-storybook | 10.6.x | pas la 11 (bêta) |
| vitest, @vitest/browser-playwright | 5.1.x | deux projets |
| @playwright/test | 1.65.x | Chromium |
| typescript | 5.x stable courante | `strict` |
| eslint, eslint-config-next, eslint-plugin-jsx-a11y | 10.x / 16.4.x / stable | flat config |
| serve | stable courante | `pnpm start:static` |
| pnpm / Node | 12.x / 24 | `packageManager`, `.nvmrc` |

Aucun `NEEDS CLARIFICATION` ne subsiste dans le contexte technique.
