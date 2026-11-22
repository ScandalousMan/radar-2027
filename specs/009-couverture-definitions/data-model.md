# Data Model: Couverture des candidats et définitions des termes

**Spec** : [spec.md](spec.md) · **Recherche** : [research.md](research.md)

Les entités de 002, 003, 007 et 008 restent inchangées sauf mention contraire.

## 1. Couverture d'une question (dérivée)

| Élément | Définition |
|---|---|
| `c_q` | Nombre de candidats **déclarés** dont la position sur `q` est connue : valeur −2 à +2, relue, sourcée, citation retrouvée (`isKnown`, 002). « Neutre » (0) compte, « inconnue » ne compte pas. |
| Calcul au corpus | `knownMatrix` (scripts) sur les questions `active`. |
| Calcul au jeu publié | nombre de cases non nulles de la colonne `q` dans `positions` (tous les candidats de `candidates`). |
| Invariant (règles 3) | `questions[i].coverage` publié = calcul au jeu publié ; sinon `BankError('coverage-mismatch')` et refus du schéma. |

## 2. Version de banque (étendue)

`main.json` :

| Champ | Type | Règle |
|---|---|---|
| `selectionRules` | absent \| `2` \| `3` | absent = règles 1 (v1, v2) ; `2` = 007 (v3, v4) ; `3` = 009 (v5 et suivantes) |
| `minQuestionCoverage` | entier ≥ 1 | **présent si et seulement si** `selectionRules = 3` ; le `k` de R4 |
| `questions[].coverage` | entier 0 … nombre de candidats | **présent si et seulement si** `selectionRules = 3` |
| `questions[].subject` | id | obligatoire en règles 2 **et** 3 |

Invariants supplémentaires en règles 3 :

- toute question publiée a `coverage ≥ minQuestionCoverage`, **sauf** les compléments de plancher (R4 étape 2), toujours rattachés à un thème signalé dans le rapport ;
- `questions.length ≤ 120` (`MAX_ACTIVE_QUESTIONS`, constante de `src/core/types.ts`, lue par la publication et par le schéma).

Vue `BankVersion` (cœur) : `selectionRules: 1 | 2 | 3`, `minQuestionCoverage: number | null`, `BankQuestion.coverage: number`, toujours dérivée (R3), utilisée seulement en règles 3.

## 3. Banque active et réserve (dérivées à la publication)

| Statut | Définition | Où il apparaît |
|---|---|---|
| Active | question `active` du corpus retenue par R4 pour la version `n` | `main.json` v`n`, détails candidats v`n` |
| Réserve | question `active` du corpus non retenue | rapport `couverture-v<n>` uniquement ; le corpus n'a aucun champ nouveau |

Transitions : réserve → active dès qu'une publication voit `c_q ≥ k` (ou la retient en complément) ; active → réserve si une publication ultérieure ne la retient plus (retrait d'un candidat, `k` plus haut). Énoncé, thèmes, enjeu, polarité, positions et sources ne changent jamais (FR-007). Les statuts `draft`/`retired` du corpus gardent leur sens de 002.

La couverture des candidats publiée (`candidates[].coverage`, 002 FR-033) se calcule désormais sur la banque active.

## 4. Rapport de couverture — `data/reports/couverture-v<n>.json`

```text
{
  version, generatedAt, minQuestionCoverage, maxActiveQuestions: 120,
  themes: [{ id, active, reserve, subjects, completed: boolean }],
  warnings: [{ theme, subjects, message }],
  candidates: [{ id, coverage }],                       // sur la banque active
  ranked: {
    short: { min, median, max }, full: { min, median, max },   // 12 444 combinaisons
    byTriple: [{ priorities: [t1,t2,t3], short, full }]        // 816 combinaisons de 3 thèmes
  },
  successCriteria: { sc001: boolean, sc002: boolean }
}
```

Le `.md` reprend ces données en tableaux, en français.

## 5. Position manquante (trou) — `data/reports/trous/<date>.json`

| Champ | Type | Règle |
|---|---|---|
| `candidate` | id | candidat déclaré |
| `question` | id | question `active` du corpus sans position connue de ce candidat |
| `theme` | id | thème principal de la question |
| `bank` | `active` \| `reserve-promotable` \| `reserve` | `reserve-promotable` : `c_q = k − 1` |
| `questionCoverage` | entier | `c_q` |
| `candidateCoverage` | nombre [0, 1] | couverture du candidat sur la banque active |
| `gain` | nombre ≥ 0 | R6, arrondi à 4 décimales |
| `searched` | `{ journal, kind }` \| absent | lacune `NOT_FOUND` / `NO_PERSONAL_POSITION` d'un journal 008 portant `candidate` et `question` |
| `rank` | entier | ordre R6 ; les `searched` en fin de liste |

Le `.md` regroupe les lignes par mission (candidat × thème), avec le gain cumulé, prêt à être confié au sous-agent.

## 6. Agrégateur

`governance.yaml` (non publié, comme `thresholds`) :

| Champ | Type | Règle |
|---|---|---|
| `aggregatorDomains` | liste de noms d'hôte | au moins `candidatspresidentielles2027.fr`, `monvote2027.fr` ; correspondance sur l'hôte ou un sous-domaine |
| `institutionalDomains` | liste de noms d'hôte, `*.` admis en préfixe | avertissement `GLOSS` hors liste |

Preuve 008 (`data/recherche/preuves/*.yaml`), champ ajouté :

| Champ | Type | Obl. | Règle |
|---|---|---|---|
| `lead` | `{ url, title }` | non | piste qui a conduit à la source primaire ; peut être un agrégateur ; jamais une source |

Règle `SRC-AGGREGATOR` : voir [contracts/data-commands.md](contracts/data-commands.md#règle-src-aggregator).

## 7. Terme du glossaire — `data/corpus/glossaire.yaml`

Liste YAML ; en-tête de commentaire conservé ; ajout en fin de liste.

| Champ | Type | Obl. | Règle |
|---|---|---|---|
| `id` | kebab-case | oui | unique |
| `label` | texte | oui | forme canonique affichée (« aide médicale de l'État ») |
| `forms` | texte[] (≥ 1) | oui | formes reconnues dans les énoncés, dont le libellé s'il y figure tel quel ; uniques après normalisation (R10), entre tous les termes |
| `definition` | texte | oui | 1 à 280 caractères ; factuelle, neutre, sans candidat ni parti (FR-014, relu) |
| `sources` | `{ url, title, publisher, accessedAt }`[] (≥ 1) | oui | référence juridique ou institutionnelle ; hôte hors `institutionalDomains` → avertissement |
| `status` | `draft` \| `reviewed` | oui | seuls les `reviewed` sont publiés |
| `author` | id de `contributors.yaml` | oui | `claude` pour l'inventaire initial |
| `reviewedBy`, `reviewedAt` | id, date | si `reviewed` | `reviewedBy ≠ author` |
| `note` | texte | non | commentaire de relecture, jamais publié |

Exemple illustratif (formulation et URL à vérifier lors de l'inventaire, non à recopier) :

```yaml
- id: aide-medicale-etat
  label: aide médicale de l'État
  forms: [aide médicale de l'État, AME]
  definition: Dispositif qui prend en charge les soins des étrangers en situation irrégulière résidant en France depuis plus de trois mois, sous conditions de ressources.
  sources:
    - url: https://www.service-public.fr/particuliers/vosdroits/F3079
      title: Aide médicale de l'État (AME)
      publisher: Service-Public.fr
      accessedAt: 2026-11-22
  status: draft
  author: claude
```

## 8. Glossaire publié — `public/data/glossary.json`

```text
{
  updatedAt: "YYYY-MM-DD",
  terms: [{ id, label, forms: string[], definition, sources: [{ url, title, publisher }] }]   // reviewed seulement, ordre alphabétique fr
}
```

Schéma Zod `GlossarySchema` dans `src/core/dataset/glossary.ts`. Il n'a aucun lien avec les versions de banque et n'est jamais lu par la sélection, le score ou le codec (FR-021).

## 9. Segments d'un énoncé annoté (UI, éphémère)

`Segment = { kind: 'text', text } | { kind: 'term', text, termId }`. Les segments concaténés redonnent exactement l'énoncé, et chaque `termId` apparaît au plus une fois par énoncé (R10).
