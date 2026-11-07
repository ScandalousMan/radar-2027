# radar-2027

Application web citoyenne pour mesurer son affinité avec chacun des candidats à l'élection
présidentielle française de 2027.

Particularité par rapport aux outils existants (référence : [monvote2027.fr](https://monvote2027.fr/)) :
le répondant choisit **3 à 5 sujets qui comptent le plus pour lui**. Ces sujets pèsent trois fois
plus dans le calcul, et le score global avec un candidat ne dépasse jamais l'accord sur ces sujets.
Un candidat « très aligné » l'est donc d'abord là où ça compte.

## Principes

- **Neutralité et traçabilité** : chaque position d'un candidat est sourcée et porte un niveau de
  preuve (programme officiel, livre ou plateforme, déclaration ou vote). Sans source, pas de score.
- **Vie privée** : tout est calculé dans le navigateur ; rien n'est envoyé à un serveur. Le résultat
  se partage par une URL dont le fragment encode l'intégralité des réponses.
- **Français d'abord**, internationalisation prête pour d'autres langues.

La constitution complète du projet est dans [`.specify/memory/constitution.md`](.specify/memory/constitution.md).

## Pile technique

Next.js 16 (App Router, export statique) · React 19 · TypeScript 5 strict · Tailwind CSS 4
(tokens en variables CSS) · Storybook 10 (`nextjs-vite`, addons a11y, docs, themes, vitest) ·
Vitest 5 (jsdom + navigateur Chromium) · Playwright 1.65 · next-intl 4 (locale `fr`, sans
préfixe d'URL) · ESLint 10 · pnpm 12 · Node.js 24 · hébergement Vercel (plan Hobby).
Les versions exactes sont épinglées dans [`package.json`](package.json) et justifiées dans
[`specs/001-socle-design-system/research.md`](specs/001-socle-design-system/research.md).

Structure : `src/app` (pages Next), `src/ui` (composants, stories, tokens), `src/core`
(domaine, vide jusqu'à la fonctionnalité 003, protégé par le lint), `src/i18n` (messages),
`src/lib` (utilitaires sans effet de bord), `e2e` (Playwright), `.storybook`.

## Méthode : Spec-Driven Development avec Spec Kit

Le projet est piloté par [GitHub Spec Kit](https://github.com/github/spec-kit). Les skills sont
installés dans `.claude/skills/` et s'utilisent depuis Claude Code :

| Étape | Skill | Produit |
|---|---|---|
| Principes | `/speckit-constitution` | `.specify/memory/constitution.md` |
| Spécification | `/speckit-specify` puis `/speckit-clarify` | `specs/NNN-slug/spec.md` |
| Plan technique | `/speckit-plan` | `specs/NNN-slug/plan.md` |
| Tâches | `/speckit-tasks` | `specs/NNN-slug/tasks.md` |
| Vérification | `/speckit-analyze`, `/speckit-checklist` | rapports |
| Réalisation | `/speckit-implement` | code |

Le dossier de la fonctionnalité courante est pointé par `.specify/feature.json` (fichier local, non versionné).

### Fonctionnalités spécifiées

| # | Dossier | Objet |
|---|---|---|
| 001 | `specs/001-socle-design-system` | Socle applicatif, design system, Storybook, tests, déploiement Vercel |
| 002 | `specs/002-corpus-ontologie-pipeline` | Thèmes, candidats, banque de questions, sources, positions, pipeline d'extraction |
| 003 | `specs/003-domaine-score-selection-codec` | Moteur de score, sélection déterministe des questions, codec URL |
| 004 | `specs/004-parcours-questionnaire` | Accueil, choix des sujets clés, mode court/complet, réponses |
| 005 | `specs/005-resultats-partage` | Classement, détail par thème et par question, partage par URL |

## Démarrer

### Prérequis

- **Node.js 24** (`.nvmrc` est fourni : `nvm use` suffit). Une autre version est refusée à
  l'installation (`engine-strict`).
- **pnpm 12** à la version indiquée par le champ `packageManager` de `package.json`
  (`npm install -g pnpm@<version>` ; Corepack n'est pas requis).
- Aucun fichier `.env` n'est nécessaire : le site se construit sans variable d'environnement
  (voir [`.env.example`](.env.example)).

### Commandes

```bash
pnpm install --frozen-lockfile
```

```bash
pnpm dev
```

La page d'accueil est servie sur <http://localhost:3000>, en français (`<html lang="fr">`),
sans requête vers un domaine tiers ni cookie. Toutes les chaînes affichées viennent de
[`src/i18n/messages/fr.json`](src/i18n/messages/fr.json) : modifier `home.title` suffit à
changer l'écran.

```bash
pnpm build
```

```bash
pnpm start:static
```

`pnpm build` produit l'export statique dans `out/` (aucune fonction serveur, aucune route
dynamique) ; `pnpm start:static` sert ce dossier sur le port 3000, exactement comme en
production.

| Commande | Effet |
|---|---|
| `pnpm dev` | serveur de développement Next.js |
| `pnpm build` | export statique dans `out/` |
| `pnpm start:static` | sert `out/` localement (port 3000) |
| `pnpm lint` | ESLint : règles Next, accessibilité, Storybook, interdictions projet |
| `pnpm typecheck` | `tsc --noEmit` sur l'application, les composants, les stories, les tests et les e2e |
| `pnpm test` | Vitest : tests unitaires, tests de tokens, stories exécutées comme tests d'accessibilité |
| `pnpm e2e` | Playwright contre `out/` servi automatiquement |
| `pnpm storybook` | Storybook en développement (<http://localhost:6006>) |
| `pnpm storybook:build` | build statique de Storybook dans `storybook-static/` |
| `pnpm verify` | lint → typecheck → test → storybook:build → build → e2e, même ordre que la CI |

## Qualité et CI

Chaque pull request vers `main` et chaque poussée sur `main` déclenchent le workflow
[`ci.yml`](.github/workflows/ci.yml) : un job unique `ci` enchaîne, dans l'ordre, **lint →
typecheck → test → storybook:build → build → e2e** (Playwright contre l'export `out/` servi
localement, une relance automatique en cas d'échec e2e). Le rapport Playwright est publié en
artefact si une étape échoue. Budget : moins de 10 minutes.

En local, la même séquence se rejoue avec :

```bash
pnpm verify
```

Trois règles de lint propres au projet protègent les principes de la constitution :

| Règle | Portée | Principe |
|---|---|---|
| `no-restricted-imports` (react, react-dom, next, `@/ui`, `@/app`) | `src/core/**` | III — cœur métier pur |
| `no-restricted-syntax` (couleurs `#hex`, `rgb(`, `hsl(`, `oklch(`, valeurs arbitraires `bg-[#…]`, `p-[7px]`) | `src/app/**`, `src/ui/**` | IV — tokens seulement |
| `react/jsx-no-literals` + attributs textuels (`aria-label`, `title`, `alt`, …) | `src/app/**`, `src/ui/**` | VI — i18n |

Les stories Storybook sont exécutées comme tests (projets Vitest `storybook` et
`storybook-sombre`) dans Chromium avec la vérification d'accessibilité axe : toute violation
`critical` ou `serious`, dans l'une ou l'autre apparence, fait échouer `pnpm test`.
Chromium doit être installé une fois en local : `pnpm exec playwright install chromium`.

### Protection de la branche `main` (action du propriétaire)

Dans GitHub : *Settings → Branches → Add branch ruleset* (ou *branch protection rule*) sur
`main` :

1. **Require a pull request before merging** ;
2. **Require status checks to pass before merging**, vérification requise : `ci` ;
3. **Require branches to be up to date before merging** (recommandé) ;
4. ne pas autoriser le contournement par les administrateurs.

Aucune fusion n'est alors possible tant que le job `ci` n'est pas vert (FR-022).

## Déploiement (Vercel, plan Hobby)

Le site est un export statique : Vercel ne déploie **aucune fonction serveur** et sert `out/`.
La configuration vit dans [`vercel.json`](vercel.json) (en-têtes de sécurité, URL propres) et
[`next.config.ts`](next.config.ts) (`output: 'export'`).

### Liaison initiale (action du propriétaire)

1. Sur <https://vercel.com/new>, importer le dépôt GitHub `radar-2027` ; framework détecté :
   **Next.js** ; laisser la commande de build (`next build`) et le répertoire de sortie
   détectés ; **aucune variable d'environnement** à renseigner.
2. Production = branche `main` ; chaque pull request reçoit automatiquement une URL de
   prévisualisation (commentaire du bot Vercel sur la pull request, en moins de cinq minutes).
3. Limites du plan Hobby : usage **non commercial** uniquement, un seul compte propriétaire,
   pas de prévisualisation pour les pull requests venant de **forks** externes (la CI GitHub
   reste exécutée et bloquante), 100 Go de transfert par mois.

### Vérifier les en-têtes de sécurité

```bash
curl -sI https://<domaine>/ | grep -iE 'content-security-policy|x-content-type-options|referrer-policy|permissions-policy|x-frame-options'
```

Ou, avec Playwright, contre une prévisualisation ou la production :

```bash
PREVIEW_URL=https://<domaine> pnpm e2e --project preview
```

Les cinq en-têtes attendus sont listés dans
[`specs/001-socle-design-system/contracts/ci-and-deploy.md`](specs/001-socle-design-system/contracts/ci-and-deploy.md).
La CSP autorise `'unsafe-inline'` sur les scripts (données d'hydratation de Next.js et script
d'apparence initial) et aucune origine tierce.

### Outillage Spec Kit

- [`specify`](https://github.com/github/spec-kit) (installé via `uv tool install specify-cli`)
- `jq` pour les scripts Spec Kit (`brew install jq`, ou fixer une version dans `.tool-versions` si asdf est utilisé)
