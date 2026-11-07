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

## Pile technique (cible)

Next.js (export statique) · React · TypeScript · Tailwind CSS v4 · Storybook 10 · Vitest ·
Playwright · next-intl · pnpm · Node.js 24 · hébergement Vercel (plan Hobby).

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

### Outillage Spec Kit

- [`specify`](https://github.com/github/spec-kit) (installé via `uv tool install specify-cli`)
- `jq` pour les scripts Spec Kit (`brew install jq`, ou fixer une version dans `.tool-versions` si asdf est utilisé)
