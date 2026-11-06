# Modèle de données : socle et design system

**Feature** : `001-socle-design-system` · **Date** : 2026-11-06 · **Source** : [spec.md](spec.md) § Key Entities

Ce socle ne manipule aucune donnée métier (pas de candidat, pas de position, pas de réponse).
Ses « entités » sont des artefacts de conception et de configuration. Elles sont décrites ici
pour fixer le vocabulaire, les invariants et les règles de validation que les tâches devront
respecter.

## 1. Token de design

Variable CSS nommée, définie une seule fois dans `src/ui/tokens.css` et consommée par Tailwind
v4 via la directive `@theme`. Seule source autorisée pour toute valeur de style.

| Champ | Type | Règle |
|---|---|---|
| `name` | identifiant CSS `--<famille>-<nom>` | kebab-case, préfixé par la famille |
| `family` | `color` \| `spacing` \| `font-size` \| `font-weight` \| `line-height` \| `radius` \| `shadow` | une famille par token |
| `value.light` | valeur CSS | obligatoire |
| `value.dark` | valeur CSS | obligatoire pour la famille `color`, identique à `light` sinon |
| `role` | texte court | rôle sémantique (ex. « fond de page », « texte secondaire »), pas la teinte |

Invariants :

- Les tokens de couleur sont **sémantiques** (`--color-bg`, `--color-fg`, `--color-accent`,
  `--color-fg-muted`, `--color-border`, `--color-surface`, `--color-focus`, `--color-danger`,
  `--color-success`) et non descriptifs (`--color-blue-500` est interdit en dehors d'une éventuelle
  palette de base privée non exportée vers Tailwind).
- Tout couple (texte, fond) prévu par les composants atteint 4,5:1 (texte courant) ou 3:1 (texte
  large, focus) dans les deux thèmes ; vérifié par un test unitaire sur les valeurs des tokens
  (voir [contracts/tokens.md](contracts/tokens.md)).
- La couleur d'accent est unique et choisie hors des couleurs emblématiques des partis
  (teinte proposée : un vert sarcelle ou un violet désaturé, validée par le propriétaire).

## 2. Apparence (clair / sombre)

Jeu de valeurs des tokens, identifié par `light` ou `dark`. Le terme « apparence » est retenu
dans le code et les clés i18n pour ne pas entrer en collision avec les « thèmes » de l'ontologie
politique (ThemeChip, ThemePicker, specs 002 à 005) ; l'attribut HTML `data-theme` reste un
détail d'implémentation imposé par la convention Tailwind.

| Champ | Type | Règle |
|---|---|---|
| `id` | `light` \| `dark` | |
| `source` | `system` \| `explicit` | `explicit` seulement après action sur la bascule |
| `storageKey` | `radar-appearance` | clé du stockage local, valeur `light` \| `dark` ; absente = suivre le système |

Transitions :

```text
(aucun choix)  --préférence système--> light | dark   [source = system]
light | dark   --bascule-->            dark | light   [source = explicit, écrit dans le stockage local]
explicit       --effacer le stockage--> system
```

Règles : l'apparence initiale est posée sur `<html data-theme="…">` par un script en ligne exécuté
avant le premier rendu (pas de clignotement) ; si le stockage local est indisponible, le script
retombe sur la préférence système sans lever d'erreur.

## 3. Composant de base

Brique de `src/ui/<Nom>/`, sans logique métier, décrite par ses propriétés, ses états et son
contrat d'accessibilité (détail dans [contracts/components.md](contracts/components.md)).

| Champ | Règle |
|---|---|
| `name` | PascalCase, parmi les 9 de FR-012 : Button, LikertChoice, ThemeChip, ThemePicker, ProgressBar, ScoreBar, Card, PageShell, EvidenceBadge |
| `files` | `<Nom>.tsx`, `<Nom>.stories.tsx`, `<Nom>.test.tsx`, `index.ts` ; aucun autre fichier n'importe directement `<Nom>.tsx` |
| `props` | typées, sans `any` ; toute chaîne visible est reçue en prop ou lue via i18n, jamais écrite en dur |
| `states` | liste fermée par composant (voir contrat) ; chaque état a une story |
| `a11y` | rôle ARIA, nom accessible, séquence clavier, indicateur de focus |

Invariant : un composant ne dépend que de React, des tokens, d'autres composants de `src/ui` et
d'utilitaires sans effet de bord. Il n'importe rien de `src/core` ni de `src/app`.

## 4. Story

Exemple documenté d'un composant dans un état donné (format CSF 3).

| Champ | Règle |
|---|---|
| `title` | `UI/<Nom>` pour les composants, `Fondations/Tokens` pour la page des tokens |
| `name` | nom de l'état en français (ex. « Désactivé », « Score indéfini ») |
| `args` | propriétés fixant l'état ; les contrôles Storybook exposent toutes les props |
| `parameters.a11y` | hérités globalement : violations `critical` et `serious` bloquantes |

Invariant : l'ensemble des `name` d'un composant couvre 100 % de ses états listés dans le
contrat (SC-003) ; chaque story se rend correctement dans les deux thèmes (bascule globale par
`data-theme`).

## 5. Message i18n

Chaîne destinée à l'utilisateur, dans `src/i18n/messages/fr.json`.

| Champ | Règle |
|---|---|
| `namespace` | premier niveau : `common`, `home`, `ui.<composant>` |
| `key` | camelCase, décrit l'intention (`home.title`, `ui.likert.skip`) |
| `value` | français, typographie française (espaces insécables avant `: ; ? !`, guillemets « ») |
| `params` | placeholders ICU (`{count}`, `{max}`) ; pluriels via ICU `plural` |

Invariants : le type `IntlMessages` est dérivé du fichier `fr.json`, donc une clé absente est une
erreur de compilation ; aucune valeur de `fr.json` n'est dupliquée dans un composant ; les
formats de date et de nombre passent par `useFormatter`.

## 6. Pipeline de CI

Enchaînement ordonné de vérifications, défini dans `.github/workflows/ci.yml`, déclenché par
pull request vers `main` et poussée sur `main`.

| Étape | Commande pnpm | Échec bloquant |
|---|---|---|
| 1. lint | `pnpm lint` | oui |
| 2. typecheck | `pnpm typecheck` | oui |
| 3. tests unitaires | `pnpm test` | oui |
| 4. build Storybook | `pnpm storybook:build` | oui |
| 5. build application | `pnpm build` | oui |
| 6. e2e | `pnpm e2e` (contre `out/` servi localement) | oui (1 relance automatique) |

`pnpm verify` enchaîne les six étapes localement, dans le même ordre. Le nom du job (`ci`) est
la vérification requise par la protection de branche (configurée par le propriétaire).

## 7. Configuration de déploiement

| Élément | Emplacement | Contenu |
|---|---|---|
| Export statique | `next.config.ts` | `output: 'export'`, `images.unoptimized: true`, `trailingSlash: false` |
| En-têtes | `vercel.json` → `headers` | voir [contracts/ci-and-deploy.md](contracts/ci-and-deploy.md) |
| Variables | `.env.example` | aucune variable requise par le socle ; le fichier documente la convention et sert de gabarit |
| Version de Node | `.nvmrc` + `engines` + `.npmrc` (`engine-strict=true`) | `24` |
| Gestionnaire | `package.json` → `packageManager` | version exacte de pnpm |
