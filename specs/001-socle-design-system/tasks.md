# Tasks: Socle applicatif et design system

**Input**: Design documents from `/specs/001-socle-design-system/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: la spécification exige explicitement des tests (FR-017 à FR-020, principe V de la
constitution) : tests unitaires Vitest par composant, stories exécutées comme tests
d'accessibilité, test de bout en bout Playwright. Les tâches de test font donc partie de chaque
story.

**Organization**: tâches groupées par user story pour que chaque story soit livrable et
testable indépendamment. Toutes les versions sont celles de [research.md](research.md)
(Next 16.4, next-intl 4.14, Tailwind 4.3, Storybook 10.6, Vitest 5.1, Playwright 1.65,
ESLint 10, pnpm 12, Node 24), épinglées sans `^`.

## Format: `[ID] [P?] [Story] Description`

- **[P]** : parallélisable (fichiers différents, aucune dépendance sur une tâche inachevée)
- **[Story]** : US1 à US5, user stories de [spec.md](spec.md)
- Chemins relatifs à la racine du dépôt (projet unique, voir plan.md § Project Structure)

---

## Phase 1: Setup (outillage partagé)

**Purpose** : initialiser le projet Node/pnpm, TypeScript et le lint avec les trois règles
projet, avant tout code.

- [x] T001 Créer `package.json` : nom `radar-2027`, `private: true`, `packageManager` pnpm 12.x exact, `engines.node` `>=24 <25`, scripts de [contracts/ci-and-deploy.md](contracts/ci-and-deploy.md) (`dev`, `build`, `start:static`, `lint`, `typecheck`, `test`, `e2e`, `storybook`, `storybook:build`, `verify`), dépendances épinglées de research.md
- [x] T002 [P] Épingler Node et pnpm : `.nvmrc` (`24`), `.npmrc` (`engine-strict=true`, `auto-install-peers=true`, pas de `strict-peer-dependencies`)
- [x] T003 [P] Créer `tsconfig.json` strict (`strict`, `noUncheckedIndexedAccess`, `moduleResolution: bundler`, `jsx: preserve`, alias `@/*` → `src/*`, `include` app, ui, core, i18n, lib, types, e2e, `.storybook`, fichiers de config)
- [x] T004 [P] Créer `eslint.config.mjs` (flat config) : `eslint-config-next` 16.4 core-web-vitals + TypeScript, `eslint-plugin-jsx-a11y` strict, `eslint-plugin-storybook` `flat/recommended` ; règle `no-restricted-imports` sur `src/core/**` interdisant `react`, `react-dom`, `next`, `next/*`, `@/ui/*`, `@/app/*` (FR-018) ; règle `no-restricted-syntax` sur `src/app/**` et `src/ui/**` (hors `tokens.css`) rejetant littéraux `#hex`, `rgb(`, `hsl(`, `oklch(` et classes arbitraires `-[#…]`, `-[…px]` (FR-011) ; `react/jsx-no-literals` avec `noStrings: true`, `ignoreProps: false`, liste blanche de ponctuation (FR-005)
- [x] T005 [P] Créer `.env.example` selon [contracts/ci-and-deploy.md](contracts/ci-and-deploy.md) (aucune variable requise, convention documentée) et compléter `.gitignore` (`out/`, `storybook-static/`, `playwright-report/`, `test-results/`, `.vercel/`, `coverage/` déjà présents : vérifier)
- [x] T006 [P] Créer `src/core/README.md` expliquant la frontière du domaine (aucun import React/DOM/Next, fonctions pures) et renvoyant à la spec 003 ; dossier volontairement vide sinon
- [x] T007 Exécuter `pnpm install` et commiter `pnpm-lock.yaml` ; vérifier qu'un Node ≠ 24 fait échouer l'installation (`engine-strict`)

**Checkpoint** : `pnpm lint` et `pnpm typecheck` s'exécutent (sur un arbre vide) sans erreur de configuration.

---

## Phase 2: Foundational (prérequis bloquants)

**Purpose** : socle Next/Tailwind/Vitest minimal dont toutes les stories dépendent.

**⚠️ CRITICAL** : aucune story ne démarre avant la fin de cette phase.

- [x] T008 Créer `next.config.ts` : `output: 'export'`, `images.unoptimized: true`, `trailingSlash: false`, `cacheComponents: false`, enveloppé par `createNextIntlPlugin('./src/i18n/request.ts')` (R1, R2)
- [x] T009 [P] Créer `postcss.config.mjs` avec `@tailwindcss/postcss` et `src/app/globals.css` : `@import "tailwindcss"`, `@import "../ui/tokens.css"`, `@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *))`, styles de base (`body` sur `bg-bg text-fg font-sans`) (R3)
- [x] T010 [P] Créer `src/ui/tokens.css` avec le bloc `@theme` complet et le bloc `[data-theme="dark"]` selon [contracts/tokens.md](contracts/tokens.md) (couleurs sémantiques, espacements dont `--spacing-touch`, typographie système, rayons, ombres)
- [x] T011 [P] Créer `src/i18n/config.ts` (`locales = ['fr'] as const`, `defaultLocale = 'fr'`), `src/i18n/request.ts` (`getRequestConfig` renvoyant locale `fr` et messages importés statiquement) et `src/types/global.d.ts` déclarant `IntlMessages` à partir de `fr.json` (R2, FR-006)
- [x] T012 [P] Créer `src/i18n/messages/fr.json` avec toutes les clés de [contracts/i18n-messages.md](contracts/i18n-messages.md) (`common.*`, `home.*`, `ui.*`), typographie française
- [x] T013 [P] Créer `vitest.config.ts` avec le projet `unit` (environnement jsdom, `@testing-library/react`, `@testing-library/jest-dom`, fichiers `src/**/*.test.{ts,tsx}`, `setupFiles: ['./vitest.setup.ts']`) et `vitest.setup.ts` ; le projet `storybook` est ajouté en US3 (R5)
- [x] T014 [P] Créer `src/lib/appearance.ts` (apparence clair/sombre, distincte des « thèmes » de l'ontologie) : constantes `STORAGE_KEY = 'radar-appearance'`, fonctions `readStoredAppearance()`, `writeStoredAppearance()`, `resolveInitialAppearance()` (stockage local puis `prefers-color-scheme`, tolérant à un stockage indisponible), et la chaîne du script d'initialisation à injecter dans `<head>` (FR-010, data-model § Apparence)
- [x] T015 [P] Écrire `src/lib/appearance.test.ts` : préférence système seule, choix explicite prioritaire, stockage local indisponible sans erreur

**Checkpoint** : `pnpm typecheck`, `pnpm lint` et `pnpm test` verts ; `tokens.css` chargé sans erreur PostCSS.

---

## Phase 3: User Story 1 - Démarrer le projet et voir l'accueil en français (Priority: P1) 🎯 MVP

**Goal** : un clone frais donne une page d'accueil française, exportable en statique, sans
chaîne en dur, sans requête tierce ni cookie.

**Independent Test** : `pnpm install && pnpm build && pnpm start:static` sur une machine propre
→ accueil en français, `html[lang="fr"]`, aucune requête hors `localhost`, aucun cookie ;
modifier `home.title` change l'écran sans toucher aux composants (quickstart § 1).

### Implementation for User Story 1

- [x] T016 [US1] Créer `src/app/layout.tsx` : `<html lang="fr" suppressHydrationWarning>`, script d'initialisation de l'apparence (`src/lib/appearance.ts`) injecté avant tout rendu, import de `globals.css`, `NextIntlClientProvider`, métadonnées (`title`, `description`) lues depuis les messages via `getTranslations` (FR-004, FR-010)
- [x] T017 [US1] Créer `src/app/page.tsx` : accueil avec `home.title`, `home.lead`, `home.privacy` et bouton `home.cta` rendu désactivé (`aria-disabled`) accompagné du texte `home.ctaSoon`, tant que la page du questionnaire (spec 004) n'existe pas ; aucun lien vers une page absente de l'export, via `useTranslations` / `getTranslations` ; aucun littéral JSX (FR-004, FR-005)
- [x] T018 [P] [US1] Ajouter `public/favicon.svg` (forme neutre aux couleurs des tokens) et `public/robots.txt` ; aucune ressource externe (FR-007)
- [x] T019 [US1] Exécuter `pnpm build` et vérifier `out/index.html` (lang `fr`, titre présent, aucun `<script src>` externe, aucune `<link>` vers un domaine tiers) ; si l'export échoue avec next-intl, appliquer le repli de research.md R2 et documenter ; si `out/` est incomplet avec Turbopack, documenter `next build --webpack` dans le script `build` (R1)
- [x] T020 [US1] Exécuter `pnpm start:static` (script créé en T001 : `serve out -l 3000`) et vérifier le service de `out/` ; vérifier dans le navigateur l'absence de cookie et de requête tierce (FR-007)
- [x] T021 [P] [US1] Écrire `src/i18n/messages.test.ts` : chaque clé de [contracts/i18n-messages.md](contracts/i18n-messages.md) est présente, typographie française respectée (espace insécable avant `? ! : ;`, guillemets « »), aucune valeur vide
- [x] T022 [US1] Rédiger la section « Démarrer » du `README.md` : prérequis (Node 24, pnpm 12), commandes `pnpm install`, `pnpm dev`, `pnpm build`, `pnpm start:static`, renvoi à la constitution (FR-026, SC-001)

**Checkpoint** : US1 démontrable seule ; `pnpm lint` échoue si un littéral de texte est ajouté dans `page.tsx` (SC-002).

---

## Phase 4: User Story 2 - Consulter et utiliser le design system dans Storybook (Priority: P1)

**Goal** : neuf composants sur tokens, chacun avec story (tous les états) et test unitaire ;
Storybook avec page des tokens et bascule clair/sombre ; lint anti-valeurs en dur.

**Independent Test** : `pnpm storybook` → `Fondations/Tokens` et `UI/<Nom>` pour les neuf
composants avec les états de [contracts/components.md](contracts/components.md) ; bascule de
thème sans rechargement ; `pnpm lint` rejette `bg-[#ff0000]` (quickstart § 2).

### Configuration Storybook

- [ ] T023 [US2] Créer `.storybook/main.ts` : framework `@storybook/nextjs-vite`, `stories: ['../src/**/*.mdx', '../src/**/*.stories.tsx']`, addons `@storybook/addon-docs`, `@storybook/addon-a11y`, `@storybook/addon-themes`, `staticDirs: ['../public']` (R4)
- [ ] T024 [US2] Créer `.storybook/preview.ts` : import de `src/app/globals.css`, décorateur `withThemeByDataAttribute({ themes: { clair: 'light', sombre: 'dark' }, defaultTheme: 'clair', attributeName: 'data-theme' })`, décorateur `NextIntlClientProvider` avec `fr.json`, `parameters.nextjs.appDirectory: true`, viewports `mobile320` (320 px) et `mobile375` (FR-014)
- [ ] T025 [P] [US2] Créer `src/ui/Tokens.mdx` : page `Fondations/Tokens` qui lit les variables CSS au rendu (`getComputedStyle(document.documentElement)`) et affiche nom, valeur claire et valeur sombre par famille (FR-014, data-model § Token)
- [ ] T026 [P] [US2] Écrire `src/ui/tokens.test.ts` : parser `tokens.css`, calculer le contraste WCAG des couples de [contracts/tokens.md](contracts/tokens.md) dans les deux thèmes, échouer sous 4,5:1 ou 3:1 selon le couple (FR-008, SC-007)

### Composants (chaque tâche : `<Nom>.tsx`, `<Nom>.stories.tsx` couvrant tous les états du contrat, `<Nom>.test.tsx`, `index.ts`)

- [ ] T027 [P] [US2] Button dans `src/ui/Button/` : variantes `primary|secondary|ghost`, tailles `md|sm`, `loading` (`aria-busy`), `disabled`, rendu `<a>` si `href` ; test : clic, désactivé, chargement, rendu lien
- [ ] T028 [P] [US2] Card dans `src/ui/Card/` : `interactive`, `href`/`onClick`, `header`, `footer` ; test : rendu statique, focalisable en interactive, activation
- [ ] T029 [P] [US2] ProgressBar dans `src/ui/ProgressBar/` : `role="progressbar"`, `aria-valuemin/max/now`, `aria-label` ; test : attributs ARIA aux trois états
- [ ] T030 [P] [US2] ScoreBar dans `src/ui/ScoreBar/` : `value | undefined`, `compact`, bornage hors [0, 100] avec avertissement en développement, « — » et libellé `ui.scoreBar.unavailable` si indéfini ; test : défini, indéfini, bornage, compact
- [ ] T031 [P] [US2] EvidenceBadge dans `src/ui/EvidenceBadge/` : trois niveaux, libellé i18n + forme/icône distincte, jamais la couleur seule ; test : libellé et icône par niveau
- [ ] T032 [P] [US2] ThemeChip dans `src/ui/ThemeChip/` : `<button aria-pressed>`, états sélectionné / désactivé / focus, libellé long sur plusieurs lignes ; test : bascule, désactivé non cliquable
- [ ] T033 [US2] ThemePicker dans `src/ui/ThemePicker/` (dépend de T032) : `min`/`max` (3/5), refus du (max+1)-ième avec `ui.themePicker.maxReached`, message `ui.themePicker.minNotReached`, compteur `ui.themePicker.counter` en `aria-live="polite"`, `onChange(next, { valid })` ; test : bornes, messages, `valid`, désactivation des puces au maximum
- [ ] T034 [P] [US2] LikertChoice dans `src/ui/LikertChoice/` : `<fieldset>/<legend>`, `role="radiogroup"`, six options (−2…+2 + `skipped`) avec libellés `ui.likert.*`, « passer » visuellement distinct, `value: LikertAnswer`, `disabled` ; test : sélection, changement de réponse, état passé, désactivé
- [ ] T035 [US2] PageShell et AppearanceToggle dans `src/ui/PageShell/` (dépend de T027) : lien `common.skipToContent` premier élément focalisable vers `<main id="contenu">`, en-tête `common.siteName` + AppearanceToggle (`src/lib/appearance.ts`, libellés `common.appearance.*`), pied avec `common.footer.methodology` → `/methodologie` et `common.footer.about` → `/a-propos` ; test : ordre de focus, la bascule d'apparence écrit `data-theme` et le stockage local
- [ ] T036 [US2] Créer `src/ui/index.ts` exportant les neuf composants et leurs types ; remplacer le gabarit de `src/app/layout.tsx` par `PageShell` et le bouton de `src/app/page.tsx` par `Button` (intégration US1 ↔ US2)
- [ ] T037 [US2] Lancer `pnpm storybook` et `pnpm storybook:build` ; vérifier les neuf entrées `UI/*`, la page Tokens, la bascule de thème ; corriger les stories manquantes au regard de [contracts/components.md](contracts/components.md) (SC-003)
- [ ] T038 [US2] Vérifier la règle anti-couleurs : ajouter temporairement `className="bg-[#ff0000]"` dans `Button.tsx`, constater l'échec de `pnpm lint` avec la ligne désignée, retirer (FR-011)

**Checkpoint** : US1 et US2 fonctionnent ensemble ; `pnpm test` couvre les neuf composants et les tokens.

---

## Phase 5: User Story 3 - Garantir l'accessibilité et le mobile dès le socle (Priority: P2)

**Goal** : violations a11y `critical`/`serious` bloquantes sur toutes les stories, clavier
complet, 320 px et zoom 200 % sans défilement horizontal.

**Independent Test** : `pnpm test` exécute les stories dans Chromium avec axe et échoue sur une
violation ; parcours clavier manuel des composants interactifs ; viewport 320 px sur l'accueil
et les stories (quickstart § 3).

### Implementation for User Story 3

- [ ] T039 [US3] Ajouter le projet `storybook` à `vitest.config.ts` : plugin `@storybook/addon-vitest/vitest-plugin`, navigateur Chromium via `@vitest/browser-playwright` (`headless: true`), `setupFiles: ['.storybook/vitest.setup.ts']` ; créer `.storybook/vitest.setup.ts` (`setProjectAnnotations`) ; ajouter `@storybook/addon-vitest` à `.storybook/main.ts` (R5)
- [ ] T040 [US3] Dans `.storybook/preview.ts`, fixer `parameters.a11y = { test: 'error', config: { rules: [] } }` et exécuter les stories dans les deux thèmes (décorateur ou `globals` par projet) ; lancer `pnpm test` et corriger chaque violation `critical`/`serious` dans les composants concernés (FR-014, SC-004)
- [ ] T041 [P] [US3] Compléter `src/ui/LikertChoice/LikertChoice.test.tsx` : Tab entre dans le groupe, flèches gauche/droite et haut/bas déplacent focus et sélection sur les six options (roving tabindex), Espace/Entrée confirment, chaque option expose « libellé, n sur 6 » (`aria-posinset`/`aria-setsize` ou libellé) (FR-013)
- [ ] T042 [P] [US3] Compléter `src/ui/ThemePicker/ThemePicker.test.tsx` : chaque puce atteignable au clavier, `aria-pressed` annoncé, compteur `n / max` présent dans une zone `aria-live` (FR-013)
- [ ] T043 [P] [US3] Compléter `src/ui/PageShell/PageShell.test.tsx` : premier Tab atteint le lien « aller au contenu », son activation déplace le focus sur `<main id="contenu">` (FR-013, US3 scénario 6)
- [ ] T044 [P] [US3] Vérifier et ajuster l'indicateur de focus dans `src/ui/tokens.css` et les composants : anneau `--color-focus` 2 px, décalage 2 px, visible dans les deux apparences (`focus-visible`) ; le contraste `focus`/`bg` ≥ 3:1 est déjà couvert par T026 (FR-013)
- [ ] T045 [US3] Ajouter dans chaque `src/ui/*/*.stories.tsx` interactive une story « Étroit 320 px » (`parameters.viewport.defaultViewport: 'mobile320'`) et vérifier sur `src/app/page.tsx` l'absence de défilement horizontal sur l'accueil et les stories à 320 px et avec zoom texte 200 % ; corriger les retours à la ligne (ThemeChip long, LikertChoice en colonne) (FR-015, SC-006)
- [ ] T046 [US3] Vérifier les cibles tactiles ≥ 44 × 44 px (`--spacing-touch`) dans `src/ui/Button/Button.tsx`, `src/ui/ThemeChip/ThemeChip.tsx`, `src/ui/LikertChoice/LikertChoice.tsx`, `src/ui/PageShell/AppearanceToggle.tsx` ; ajouter une assertion de taille minimale dans chaque `*.test.tsx` correspondant

**Checkpoint** : `pnpm test` (unit + storybook) vert dans les deux thèmes ; parcours clavier manuel conforme à quickstart § 3.

---

## Phase 6: User Story 4 - Faire valider une contribution par une CI bloquante (Priority: P2)

**Goal** : six étapes en CI sur chaque pull request et poussée sur `main`, reproductibles en
local par `pnpm verify`, avec le test e2e contre l'export statique.

**Independent Test** : pull request avec une erreur de type, puis de lint, puis e2e → CI rouge
à chaque fois et fusion refusée ; corrigée → verte ; `import 'react'` dans `src/core/x.ts` fait
échouer le lint (quickstart § 4).

### Implementation for User Story 4

- [ ] T047 [P] [US4] Créer `playwright.config.ts` : `testDir: 'e2e'`, projet `chromium` seul, `retries: 1`, `reporter: [['html', { open: 'never' }], ['github']]`, `webServer: { command: 'pnpm start:static', url: 'http://localhost:3000', reuseExistingServer: !process.env.CI }`, `use.baseURL` (R6)
- [ ] T048 [P] [US4] Écrire `e2e/home.spec.ts` : `html[lang="fr"]`, `h1` égal à `home.title` lu depuis `src/i18n/messages/fr.json`, `<title>` renseigné, aucune requête vers un hôte autre que `localhost` (écoute `page.on('request')`), `context.cookies()` vide (FR-020)
- [ ] T049 [US4] Vérifier que les scripts `e2e` (`playwright test`) et `verify` (`pnpm lint && pnpm typecheck && pnpm test && pnpm storybook:build && pnpm build && pnpm e2e`) créés en T001 enchaînent bien les six étapes dans l'ordre de la CI ; exécuter `pnpm verify` en local jusqu'au vert
- [ ] T050 [US4] Créer `.github/workflows/ci.yml` : déclencheurs `pull_request` (vers `main`) et `push` (`main`) ; job `ci` sur `ubuntu-latest` ; étapes `actions/checkout@v7`, `pnpm/action-setup@v6`, `actions/setup-node@v7` (`node-version-file: .nvmrc`, `cache: pnpm`), `pnpm install --frozen-lockfile`, **puis `pnpm exec playwright install --with-deps chromium` avant les tests** (le projet Vitest `storybook` tourne déjà dans Chromium), puis six `run` nommés lint / typecheck / test / storybook:build / build / e2e, `actions/upload-artifact@v5` de `playwright-report/` en `if: failure()` ; `timeout-minutes: 15` ; un commentaire réserve l'emplacement d'une future étape `data:validate` (validation de schéma des données, principe V, spec 002) entre typecheck et test (FR-021, R10)
- [ ] T051 [P] [US4] Écrire `src/core/README.md` § « Vérification » et un test de lint dédié : `src/lib/core-boundary.test.ts` (projet `unit`, motif `src/**/*.test.ts`) qui exécute ESLint en mémoire sur un extrait `import React from 'react'` placé virtuellement sous `src/core/` et attend une erreur `no-restricted-imports` (FR-018, US4 scénario 5)
- [ ] T052 [US4] Rédiger la section « Qualité et CI » du `README.md` : commandes de FR-003, `pnpm verify`, procédure de protection de branche `main` (vérification requise : job `ci`, pas de fusion sans vert, action manuelle du propriétaire) (FR-022, FR-026)
- [ ] T053 [US4] Ouvrir une pull request de vérification (erreur de type volontaire, puis correction) et confirmer : statuts visibles par étape, CI rouge puis verte, durée < 10 min (SC-008)

**Checkpoint** : CI verte sur `main` ; protection de branche active (par le propriétaire).

---

## Phase 7: User Story 5 - Prévisualiser chaque pull request et publier depuis main (Priority: P3)

**Goal** : déploiement Vercel Hobby statique, prévisualisation par pull request, production
depuis `main`, en-têtes de sécurité, aucune variable requise.

**Independent Test** : pull request triviale → URL de prévisualisation < 5 min ; fusion →
production < 5 min ; `curl -sI` montre les cinq en-têtes ; aucune fonction listée (quickstart § 5).

### Implementation for User Story 5

- [ ] T054 [P] [US5] Créer `vercel.json` : `headers` sur `source: "/(.*)"` avec les cinq en-têtes et valeurs exactes de [contracts/ci-and-deploy.md](contracts/ci-and-deploy.md) (CSP, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options`) ; `cleanUrls: true` ; aucune `functions`, aucune `rewrites` (FR-023, FR-024, R8)
- [ ] T055 [P] [US5] Écrire `e2e/headers.spec.ts` dans un second projet Playwright `preview` de `playwright.config.ts`, défini seulement si `PREVIEW_URL` est renseigné, sans `webServer` (le projet `chromium` reste le seul exécuté en CI) : requête sur `PREVIEW_URL/` et assertion des cinq en-têtes ; documenter la variable dans `.env.example` comme optionnelle et locale (SC-010)
- [ ] T056 [US5] Rédiger la section « Déploiement » du `README.md` : import du dépôt dans Vercel (plan Hobby, framework Next.js, aucune variable), production = `main`, prévisualisation par pull request, limite des forks, usage non commercial, vérification des en-têtes (FR-026)
- [ ] T057 [US5] Action du propriétaire : relier le dépôt au projet Vercel, ouvrir une pull request triviale, vérifier l'URL de prévisualisation, fusionner, vérifier la production et les en-têtes avec `curl -sI`, confirmer qu'aucune fonction n'est déployée (SC-009, SC-010)
- [ ] T058 [US5] Vérifier que `pnpm build` réussit dans un clone sans aucun fichier `.env` et que `.env.example` liste 100 % des variables référencées (`grep -r process.env src e2e`) (FR-025, SC-012)

**Checkpoint** : production et prévisualisation opérationnelles.

---

## Phase 8: Polish & Cross-Cutting Concerns

- [ ] T059 [P] Mesurer le poids transféré de la page d'accueil en production (onglet Réseau ou `curl --compressed`) et, si nécessaire, le ramener sous 200 Ko en ajustant `src/app/layout.tsx`, `src/app/page.tsx` et `next.config.ts` (SC-011)
- [ ] T060 [P] Relire `README.md` dans son ensemble (démarrer, commandes, qualité, déploiement, tableau des fonctionnalités, renvoi à la constitution) et le tableau des versions de research.md (FR-026)
- [ ] T061 [P] Exécuter `pnpm lint` comme recherche automatisée de texte en dur (règle `react/jsx-no-literals` de `eslint.config.mjs`) et consigner le résultat attendu (0 violation) dans `specs/001-socle-design-system/quickstart.md` § 1 (SC-002)
- [ ] T062 Dérouler [quickstart.md](quickstart.md) de bout en bout sur un clone frais et cocher chaque scénario ; corriger les écarts
- [ ] T063 Mettre à jour `specs/001-socle-design-system/checklists/requirements.md` et `spec.md` (`Status: Implemented`) ; vérifier la conformité aux principes I à VII dans la description de la pull request finale

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)** : aucune dépendance ; T001 avant T007.
- **Foundational (Phase 2)** : après Phase 1 ; bloque toutes les stories. T008 dépend de T011 (chemin du plugin) ; T009 dépend de T010 (import de `tokens.css`).
- **US1 (Phase 3)** : après Phase 2. T016 → T017 → T019 → T020 ; T018, T021 en parallèle.
- **US2 (Phase 4)** : après Phase 2 ; indépendante de US1 pour Storybook, mais T036 intègre les composants dans l'accueil (nécessite T016, T017). T033 dépend de T032 ; T035 dépend de T027 ; T037 après tous les composants.
- **US3 (Phase 5)** : après US2 (teste les composants). T039 → T040 ; T041 à T046 ensuite.
- **US4 (Phase 6)** : après US1 (export à tester) ; T049 et T050 après T047 et T048 ; T053 en dernier. Peut démarrer en parallèle de US2/US3 si l'on accepte une CI qui s'enrichit.
- **US5 (Phase 7)** : après US4 (CI) ; T057 est une action manuelle du propriétaire.
- **Polish (Phase 8)** : après toutes les stories voulues.

### Parallel Opportunities

- Phase 1 : T002 à T006 en parallèle après T001.
- Phase 2 : T009/T010, T011/T012, T013, T014/T015 en parallèle (fichiers distincts).
- US2 : T027 à T032 et T034 en parallèle (dossiers distincts) ; T025 et T026 en parallèle.
- US3 : T041 à T044 en parallèle.
- US4 : T047 et T048 en parallèle, T051 en parallèle de T050.
- US5 : T054 et T055 en parallèle.

### Parallel Example: User Story 2

```bash
# Après T023/T024, lancer en parallèle (dossiers distincts) :
Task: "Button dans src/ui/Button/ (composant, story, test, index)"
Task: "Card dans src/ui/Card/"
Task: "ProgressBar dans src/ui/ProgressBar/"
Task: "ScoreBar dans src/ui/ScoreBar/"
Task: "EvidenceBadge dans src/ui/EvidenceBadge/"
Task: "ThemeChip dans src/ui/ThemeChip/"
Task: "LikertChoice dans src/ui/LikertChoice/"
# Puis séquentiellement : ThemePicker (après ThemeChip), PageShell (après Button), index.ts, intégration.
```

---

## Implementation Strategy

### MVP First (US1)

1. Phases 1 et 2 (outillage, Next, Tailwind, i18n, thème).
2. Phase 3 : accueil en français exporté en statique.
3. **STOP et valider** : quickstart § 1 ; c'est le premier déployable.

### Incremental Delivery

1. US1 → accueil statique (MVP).
2. US2 → design system complet dans Storybook, accueil réassemblé avec PageShell et Button.
3. US3 → accessibilité bloquante, clavier, 320 px.
4. US4 → CI en six étapes et e2e ; protection de branche.
5. US5 → Vercel, en-têtes, production.
6. Polish → poids, README, quickstart complet.

Chaque incrément se termine par `pnpm verify` vert (une fois US4 livrée, par la CI).

---

## Traçabilité exigences → tâches

| Exigence | Tâches |
|---|---|
| FR-001 projet unique, pnpm, Node 24 | T001, T002, T007 |
| FR-002 export statique sans serveur | T008, T019, T020 |
| FR-003 commandes documentées | T001, T020, T049, T052 |
| FR-004 accueil français, `lang="fr"` | T016, T017 |
| FR-005 aucune chaîne en dur | T004, T012, T017, T061 |
| FR-006 seconde locale sans toucher aux composants | T011, T012 |
| FR-007 aucune ressource tierce ni cookie | T018, T020, T048 |
| FR-008 tokens, thèmes, contrastes | T010, T026, T044 |
| FR-009 palette neutre | T010 |
| FR-010 thème système, bascule, mémorisation locale | T014, T015, T016, T035 |
| FR-011 lint anti-valeurs en dur | T004, T038 |
| FR-012 neuf composants avec stories et contrôles | T027 à T037 |
| FR-013 clavier, rôles, focus | T041 à T044, T046 |
| FR-014 Storybook a11y, bascule, page tokens | T023 à T025, T039, T040 |
| FR-015 320 px et zoom 200 % | T024, T045 |
| FR-016 composants sans logique métier | T027 à T035 (contrat), T006 |
| FR-017 TypeScript strict partout | T003 |
| FR-018 frontière `src/core` | T004, T006, T051 |
| FR-019 tests unitaires des composants | T027 à T035, T041 à T043 |
| FR-020 e2e accueil contre l'export | T047, T048 |
| FR-021 CI six étapes | T049, T050, T053 |
| FR-022 fusion impossible sans CI verte | T052, T053 |
| FR-023 Vercel Hobby, production et prévisualisation | T054, T056, T057 |
| FR-024 en-têtes de sécurité | T054, T055, T057 |
| FR-025 `.env.example`, build sans variable | T005, T058 |
| FR-026 README | T022, T052, T056, T060 |

## Notes

- Tâches [P] = fichiers différents, aucune dépendance sur une tâche inachevée.
- Aucune tâche n'écrit de logique métier : `src/core` reste vide jusqu'à la spec 003.
- Toute valeur de style passe par `src/ui/tokens.css` ; toute chaîne visible par `fr.json`.
- Commiter après chaque tâche ou groupe logique ; pull request par phase ou par story.
- T053 et T057 nécessitent le dépôt distant GitHub et l'accès Vercel du propriétaire.
