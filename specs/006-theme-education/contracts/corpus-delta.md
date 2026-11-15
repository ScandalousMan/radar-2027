# Contrat : extensions du corpus et règle `AXIS-DIM`

Complète [002 contracts/corpus-files.md](../../002-corpus-ontologie-pipeline/contracts/corpus-files.md).
Les schémas restent stricts (`z.strictObject`) : toute clé non listée est refusée. Le format
**publié** ([002 contracts/published-dataset.md](../../002-corpus-ontologie-pipeline/contracts/published-dataset.md))
ne change pas : `dimensions` et `dimension` ne sont jamais publiés.

## `themes.yaml` — clé facultative `dimensions`

```yaml
- id: education
  label: Éducation
  description: École, de la maternelle au lycée, enseignants, voie professionnelle, enseignement supérieur et recherche.
  axis:
    negative: École plus différenciée et plus exigeante, avec plus de choix pour les familles et une dépense publique maîtrisée
    positive: École plus commune et plus inclusive, avec plus de moyens publics et de liberté pédagogique
  dimensions:                      # facultatif ; ≥ 2 éléments ; id uniques dans le thème
    - id: choix
      label: Choix et école commune
      negative: Différenciation et liberté de choix des familles
      positive: École publique commune
    - id: moyens
      label: Moyens publics
      negative: Maîtrise de la dépense publique d'éducation
      positive: Moyens publics accrus
    - id: pedagogie
      label: Autorité et pédagogie
      negative: Autorité, fondamentaux et discipline
      positive: Autonomie de l'élève et diversité des pédagogies
  order: 17
  status: active
```

Schéma : `dimensions: z.array(z.strictObject({ id: IdSchema, label: z.string().min(1).max(60),
negative: z.string().min(1), positive: z.string().min(1) })).min(2).optional()`.

## `questions/education.yaml` — clé facultative `dimension`

```yaml
# Dimension « choix ». Motivé par : david-lisnard-programme-education (chèque-éducation),
# fabien-roussel-… (mixité) — voir data/campagnes/education/enonces.md.
- id: education-financement-suit-choix-familles
  text: "…"                        # ≤ 200 caractères, grille de neutralité
  themes:
    - education
  dimension: choix                 # obligatoire ici : le thème principal déclare des dimensions
  polarity: "-"
  status: draft
  author: claude
```

Schéma : `dimension: IdSchema.optional()`.

## Règle `AXIS-DIM`

Fichier `scripts/data/lib/rules/AXIS-DIM.ts`, enregistré dans `rules/index.ts`. Sévérité
`error` pour les cas 1 à 4, entité désignée entre parenthèses.

| # | Condition | Message (forme) |
|---|---|---|
| 1 | Question (toutes statuts) avec `dimension` alors que son thème principal ne déclare pas de dimensions | `<question> : dimension « <d> » sans dimensions déclarées sur <thème>` (question) |
| 2 | Question avec `dimension` inconnue du thème principal | `<question> : dimension « <d> » inconnue de <thème> (attendu : a, b, c)` (question) |
| 3 | Question **active** dont le thème principal déclare des dimensions, sans `dimension` | `<question> : dimension manquante (attendu : a, b, c)` (question) |
| 4 | Thème actif à dimensions dont une dimension compte moins de 3 questions actives | `<thème> : dimension <d> : <n> questions actives, minimum 3` (theme) |
| 5 | Thème actif à dimensions dont le nombre de questions actives (thème principal) est inférieur à `maxPriorityQuota` | `<thème> : <n> questions actives, minimum <q> (quota maximal d'un thème prioritaire en mode complet, <T> thèmes)` (theme) |

Les cas 4 et 5 ne s'appliquent pas à un thème sans aucune question active (déjà signalé par
`THEME-EMPTY`, avertissement bloquant pour la publication).

**`maxPriorityQuota`** : maximum, sur toutes les combinaisons de 3 sujets prioritaires
contenant le thème, du quota attribué au thème par `computeQuotas(bank, 'full', priorities)`,
la banque étant construite depuis les thèmes et questions actifs du corpus (comme pour le calcul
du pouvoir discriminant). Avec 18 thèmes, la valeur attendue est 13 (003 FR-021). Le calcul est
pur et déterministe.

## Tests attendus

- `schema.test.ts` : `dimensions` accepté (≥ 2, ids uniques), refusé à 1 élément, clé inconnue
  dans une dimension refusée ; `dimension` acceptée sur une question.
- `AXIS-DIM.test.ts` : un cas par ligne du tableau ; un corpus conforme sans aucun thème à
  dimensions ne produit rien (non-régression des 17 thèmes) ; le minimum vaut 13 pour une banque
  de 18 thèmes.
- `data/fixtures/violations/AXIS-DIM/` : corpus minimal fautif (SC-001 de la 002 : une fixture
  par règle).
- `publish.test.ts` : une question avec `dimension` et un thème avec `dimensions` donnent un
  `main.json` sans ces clés.
