# Quickstart: valider le thème Éducation

Scénarios de bout en bout qui prouvent la fonctionnalité. Formes de fichiers :
[contracts/corpus-delta.md](contracts/corpus-delta.md),
[contracts/campagne-files.md](contracts/campagne-files.md) ; entités :
[data-model.md](data-model.md).

## Prérequis

- Node 24, pnpm 12, dépendances installées (`pnpm install`).
- Cache des sources présent : `.cache/sources/` (sans lui, `data:validate` signale
  `CACHE-MISSING` et `data:publish` refuse).
- La PR #20 est fusionnée (fait) : les scripts conservent les commentaires YAML.
- Lancer Vitest avec `</dev/null` (sinon il attend une entrée).

## 1. Outillage de l'axe (PR de code)

```bash
pnpm vitest run scripts/data/lib/rules/AXIS-DIM.test.ts scripts/data/lib/schema/schema.test.ts scripts/data/publish.test.ts </dev/null
```

Attendu : tous verts ; un cas par ligne du tableau `AXIS-DIM` ; le minimum calculé vaut 13 pour
18 thèmes ; le `main.json` construit ne contient ni `dimensions` ni `dimension`.

```bash
pnpm data:validate --corpus data/fixtures/violations/AXIS-DIM
```

Attendu : code de sortie non nul, faute `AXIS-DIM` sur l'entité de la fixture.

```bash
pnpm data:validate
```

Attendu sur le corpus v1 (sans thème à dimensions) : aucune faute nouvelle.

## 2. Campagne de sources (PR de données, US2)

Pour chaque source retenue :

```bash
pnpm data:source fetch "<url>" --candidate <id> --kind <programme|livre_plateforme|declaration_vote> --title "<titre>" --published <date>
```

Vidéo ou page protégée par Cloudflare : ajouter `--from-file <texte.txt>` (transcription du
passage avec en-tête, ou texte copié depuis le navigateur intégré ou une copie Wayback).

Contrôles :

- `pnpm data:source check` : toutes les empreintes concordent ;
- `data/campagnes/education/sources.md` a 18 sections, chacune conclue par des sources
  retenues ou « cherché sans résultat » avec la liste consultée (SC-003) ;
- les corrections connues sont appliquées : citation de Roussel avec « à ce titre », vidéo de
  Glucksmann attribuée au débat de la primaire publié par le PS, vidéo d'Arthaud décrite comme
  réunion publique, URL de Kazib sans `?var_mode=calcul` (voir research.md R2).

## 3. Thème et énoncés (US3)

Après ajout de `education` dans `themes.yaml`, des énoncés dans `questions/education.yaml` et
leur activation par adrien :

```bash
pnpm data:validate
```

Attendu :

- aucune faute `FR-012` (13 à 17 actifs, polarités 40–60 %) ni `AXIS-DIM` (≥ 3 par dimension,
  ≥ 13 au total) ni `FR-009`/`FR-010` (longueur, grille, relecteur ≠ auteur) ;
- dans `data/reports/validation.md`, Éducation est 18e dans l'ordre des thèmes.

Contrôle à la main dans `data/campagnes/education/enonces.md` : au plus 17 énoncés actifs,
chaque énoncé a au moins une mesure attendue de chaque côté, aucun sous-thème au-delà de 25 %.

## 4. Positions (US2)

Positions créées en `draft` par l'agent, puis relues :

```bash
pnpm data:review <candidat> <question> --by adrien
```

Pour une source vidéo, adrien écoute la vidéo au timecode de la justification avant de relire.

```bash
pnpm data:validate
```

Attendu : aucune faute de citation (citation retrouvée mot pour mot dans le texte en cache) ;
dans le rapport, au moins 12 candidats ont 2 positions Éducation relues ou plus (SC-004) ; les
énoncés dont toutes les positions connues sont identiques apparaissent au pouvoir discriminant
nul et sont tranchés dans le bilan du dossier.

## 5. Rejeu des liens v1 puis publication (US4)

Avant la publication, générer les résultats attendus des 20 liens v1, puis :

```bash
pnpm data:publish --dry-run
pnpm data:publish
pnpm vitest run src/lib/results </dev/null
```

Attendu : `public/data/versions/2/` créé, `versions.json` désigne la version 2 comme courante,
les fichiers de la version 1 inchangés (`PUB-IMMUTABLE`), budgets respectés (`PUB-BUDGET`), et
le test de rejeu donne des résultats identiques pour les 20 liens (SC-006).

## 6. Parcours dans le site

```bash
pnpm build && pnpm start:static
```

Dans le navigateur intégré :

1. ouvrir le questionnaire : « Éducation » est le dernier thème, avec sa description ;
2. choisir Éducation et deux autres thèmes, mode complet : 12 ou 13 énoncés Éducation ;
3. résultats : score Éducation (ou « — ») et couverture « x sur y » par candidat ; fiche
   candidat avec Éducation parmi les sujets clés ;
4. ouvrir un lien v1 enregistré : mêmes résultats qu'avant, 17 thèmes ;
5. page Méthodologie : 18 thèmes, axe d'Éducation affiché.

Puis `pnpm verify` (lint, types, validation, tests, Storybook, build, e2e) vert.
