# Implementation Plan: Socle applicatif et design system

**Branch**: `001-socle-design-system` | **Date**: 2026-11-06 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-socle-design-system/spec.md`

## Summary

Mettre en place le projet radar-2027 : une application Next.js 16 exportée en statique, une
bibliothèque de neuf composants de base construite sur des tokens Tailwind v4 et documentée dans
Storybook 10 (accessibilité bloquante, bascule clair/sombre), l'internationalisation next-intl en
locale `fr` sans préfixe d'URL, une CI GitHub Actions en six étapes (lint, typecheck, Vitest,
build Storybook, build, Playwright contre l'export) et le déploiement Vercel Hobby avec en-têtes
de sécurité. Aucune logique métier : le socle prépare les fonctionnalités 002 à 005.

## Technical Context

**Language/Version**: TypeScript 5 (strict), Node.js 24 (Maintenance LTS), pnpm 12

**Primary Dependencies**: Next.js 16.4 (App Router, `output: 'export'`, React 19.3), next-intl
4.14 (sans routage i18n), Tailwind CSS 4.3 (`@tailwindcss/postcss`, tokens `@theme`),
Storybook 10.6 (`@storybook/nextjs-vite`, addon-a11y, addon-docs, addon-themes, addon-vitest)

**Storage**: N/A (site statique ; stockage local du navigateur pour le thème uniquement)

**Testing**: Vitest 5.1 (projet `unit` jsdom + Testing Library ; projet `storybook` en
navigateur Chromium avec vérification d'accessibilité), Playwright 1.65 (Chromium) contre `out/`

**Target Platform**: navigateurs evergreen desktop et mobile, à partir de 320 px ; hébergement
statique Vercel Hobby

**Project Type**: application web statique, projet unique (pas d'espace de travail)

**Performance Goals**: page d'accueil ≤ 200 Ko compressés sans requête tierce (SC-011) ; CI
complète < 10 min (SC-008) ; prévisualisation < 5 min (SC-009)

**Constraints**: aucune fonction serveur ni route dynamique ; aucune ressource tierce ni cookie ;
contrastes 4,5:1 / 3:1 dans les deux thèmes ; utilisable au clavier et à 320 px ; aucune chaîne
en dur ; aucune variable d'environnement requise

**Scale/Scope**: 1 page (accueil), 9 composants, 1 page Storybook de tokens, 1 workflow CI,
1 configuration Vercel

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principe | Exigence applicable au socle | Statut |
|---|---|---|
| I. Neutralité et traçabilité | Aucune donnée candidat dans le socle ; palette non partisane (FR-009) | ✅ conforme |
| II. Vie privée | Aucune requête serveur ni tierce, aucun cookie, thème mémorisé localement seulement, aucune mesure d'audience (FR-007, FR-010) | ✅ conforme |
| III. Cœur métier pur | `src/core` créé vide avec la règle de lint interdisant React/DOM/Next (FR-018) | ✅ conforme |
| IV. Design system d'abord | Tokens uniques, 9 composants avec stories et a11y, lint anti-valeurs en dur (FR-008 à FR-016) | ✅ conforme |
| V. Tests comme contrat | Vitest + stories en tests + Playwright + CI bloquante (FR-017 à FR-022) | ✅ conforme |
| VI. i18n dès le premier écran | next-intl, `fr` seule, clés typées, lint anti-littéraux (FR-004 à FR-006) | ✅ conforme |
| VII. Simplicité et statique | Projet unique, export statique, Vercel Hobby sans fonction (FR-001, FR-002, FR-023) | ✅ conforme |
| Contraintes techniques | Pile imposée respectée, **sauf « Storybook 9 »** : la version stable est la 10.6 | ⚠️ écart de libellé, voir Complexity Tracking |

**Pré-recherche** : passage avec un écart de libellé (Storybook 9 → 10). **Post-conception** :
inchangé ; l'écart est résolu par un amendement correctif de la constitution (1.0.1) et
l'alignement de FR-014, réalisés avec ce plan.

## Project Structure

### Documentation (this feature)

```text
specs/001-socle-design-system/
├── plan.md              # ce fichier
├── research.md          # décisions de versions et d'outillage (Phase 0)
├── data-model.md        # tokens, thème, composant, story, message, pipeline (Phase 1)
├── quickstart.md        # scénarios de validation par user story (Phase 1)
├── contracts/
│   ├── components.md    # props, états, a11y des 9 composants
│   ├── tokens.md        # tokens, seuils de contraste, règles de lint
│   ├── i18n-messages.md # clés requises et conventions
│   └── ci-and-deploy.md # commandes, workflow, Playwright, Vercel, en-têtes
├── checklists/requirements.md
└── tasks.md             # produit par /speckit-tasks (pas par ce plan)
```

### Source Code (repository root)

```text
.
├── .github/workflows/ci.yml        # job unique `ci`, six étapes
├── .storybook/
│   ├── main.ts                     # framework nextjs-vite, addons, stories glob
│   ├── preview.ts                  # import globals.css, withThemeByDataAttribute, a11y 'error'
│   └── vitest.setup.ts             # addon-vitest
├── e2e/
│   ├── home.spec.ts                # lang=fr, titre depuis fr.json, aucune requête tierce
│   └── headers.spec.ts             # projet `preview`, seulement si PREVIEW_URL est défini
├── public/                         # favicon, robots.txt
├── src/
│   ├── app/
│   │   ├── layout.tsx              # <html lang="fr" data-theme>, script d'apparence, NextIntlClientProvider, PageShell
│   │   ├── page.tsx                # accueil : titre, lead, privacy, CTA
│   │   └── globals.css             # @import "tailwindcss"; @import "../ui/tokens.css"; @custom-variant dark
│   ├── core/
│   │   └── README.md               # vide jusqu'à 003 ; frontière protégée par le lint
│   ├── i18n/
│   │   ├── config.ts               # locales, locale par défaut
│   │   ├── request.ts              # getRequestConfig → fr
│   │   ├── messages/fr.json
│   │   └── messages.test.ts        # clés requises, typographie française
│   ├── lib/
│   │   ├── appearance.ts           # apparence clair/sombre : lecture/écriture, script d'initialisation
│   │   ├── appearance.test.ts
│   │   └── core-boundary.test.ts   # vérifie la règle de lint protégeant src/core
│   ├── ui/
│   │   ├── tokens.css              # @theme + [data-theme="dark"]
│   │   ├── tokens.test.ts          # contrastes WCAG
│   │   ├── Tokens.mdx              # page Storybook « Fondations/Tokens »
│   │   ├── Button/{Button.tsx,Button.stories.tsx,Button.test.tsx,index.ts}
│   │   ├── LikertChoice/…
│   │   ├── ThemeChip/…
│   │   ├── ThemePicker/…
│   │   ├── ProgressBar/…
│   │   ├── ScoreBar/…
│   │   ├── Card/…
│   │   ├── PageShell/…             # inclut AppearanceToggle
│   │   ├── EvidenceBadge/…
│   │   └── index.ts
│   └── types/
│       └── global.d.ts             # IntlMessages dérivé de fr.json
├── .env.example
├── .npmrc                          # engine-strict=true
├── .nvmrc                          # 24
├── eslint.config.mjs               # flat config + règles projet
├── next.config.ts                  # output: 'export', images.unoptimized, cacheComponents: false, plugin next-intl
├── package.json                    # packageManager pnpm@12.x, engines node 24, scripts FR-003
├── playwright.config.ts            # Chromium, retries 1, webServer serve out
├── postcss.config.mjs
├── tsconfig.json                   # strict, paths @/*
├── vercel.json                     # headers de sécurité
├── vitest.config.ts                # projets unit + storybook
└── vitest.setup.ts                 # jest-dom pour le projet unit
```

**Structure Decision** : projet unique à la racine du dépôt (principe VII, FR-001). Trois
frontières internes : `src/core` (domaine, vide pour l'instant, protégé par le lint),
`src/ui` (composants, Storybook, tokens) et `src/app` (pages Next). Les scripts du pipeline de
données (fonctionnalité 002) iront dans `scripts/`, hors du bundle. Pas d'espace de travail pnpm
tant qu'il n'existe pas de second consommateur de `src/core`.

## Approche de mise en œuvre (ordre proposé pour /speckit-tasks)

1. **Fondation** : `package.json` (versions épinglées, scripts), Node/pnpm épinglés, TypeScript
   strict, ESLint flat config avec les trois règles projet, `.env.example`, README des commandes.
2. **Application minimale** : Next 16 export statique, Tailwind 4 + `tokens.css`, next-intl
   sans routage, `layout.tsx` avec script d'apparence et `lang="fr"`, page d'accueil ; preuve par
   `pnpm build` que l'export fonctionne avec next-intl (risque R2 levé tôt).
3. **Design system** : `tokens.css` complet et `tokens.test.ts` ; puis composants dans l'ordre
   Button → Card → ProgressBar → ScoreBar → EvidenceBadge → ThemeChip → ThemePicker →
   LikertChoice → PageShell (AppearanceToggle inclus) ; chaque composant livré avec story, test et
   clés i18n.
4. **Storybook** : configuration nextjs-vite, addons, page Tokens, bascule de thème, a11y en
   `error`, addon Vitest branché sur le projet `storybook`.
5. **Tests e2e et CI** : Playwright contre `out/`, workflow `ci.yml` (Chromium installé avant
   l'étape test), `pnpm verify` ; note README pour la protection de branche.
6. **Déploiement** : `vercel.json`, procédure de liaison documentée, vérification des en-têtes
   sur la prévisualisation.

Chaque étape se termine par `pnpm verify` vert. Les composants sont indépendants entre eux
(parallélisables), sauf PageShell qui consomme Button.

## Risques et parades

| Risque | Parade |
|---|---|
| next-intl sans routage et `output: 'export'` non documentés ensemble | build d'export dès l'étape 2 ; repli provider client sans plugin |
| `out/` incomplet avec Turbopack (retour terrain isolé) | script `build` avec repli `next build --webpack` documenté |
| Plugins ESLint sans peer ESLint 10 déclaré | pas de `strict-peer-dependencies` ; mise à jour `eslint-config-next` suivie |
| Storybook 11 bêta attirante | versions épinglées ; montée de version par pull request dédiée |
| CSP et scripts en ligne de Next | `'unsafe-inline'` sur `script-src` assumé et documenté ; durcissement par hachages plus tard |
| Dérive des tokens entre CSS et page Storybook | page Tokens lit les variables CSS au rendu ; test de contraste sur le fichier source |

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Constitution « Storybook 9 » vs Storybook 10.6 retenu | La 9 n'est plus la version stable ; `@storybook/nextjs-vite` 10 est le seul framework compatible avec Vitest 5 et l'addon de tests, et la 11 est en bêta | Rester en 9 priverait de support et des tests de stories ; la constitution est amendée en 1.0.1 (correctif de libellé : « Storybook, version stable courante ») plutôt que de figer une version dépassée |
