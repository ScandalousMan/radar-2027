# Data Model: Sélection équilibrée

## 1. Question du corpus (`data/corpus/questions/<thème>.yaml`)

Ajout d'un champ ; le reste est inchangé (002 FR-008, 006 `dimension`).

| Champ | Type | Règle |
|---|---|---|
| `subject` | identifiant kebab-case (`IdSchema`) | Obligatoire pour une question `active` (règle SUBJECT, erreur) ; recommandé pour `retired`. Commun à toutes les questions d'un même enjeu (spec FR-001, FR-002). |

Position dans l'entrée YAML : juste après `themes:` (lisibilité de la relecture).

Exemple :

```yaml
- id: travail-retraite-62-ans
  text: L'âge légal de départ à la retraite doit être ramené à 62 ans.
  themes:
    - travail
  subject: retraite-age-legal
  polarity: …
```

Convention de nommage : `<domaine>-<objet>`, sans référence au sens de la mesure (`retraite-age-legal`, pas `retraite-62-ans`) ni au thème quand l'enjeu en traverse plusieurs (`uniforme-ecole`).

## 2. Jeu publié (`public/data/versions/<n>/main.json`)

| Champ | Type | Versions |
|---|---|---|
| `selectionRules` | `2` (littéral), facultatif | Absent pour v1 et v2 (règles 003) ; `2` à partir de v3. |
| `questions[].subject` | identifiant kebab-case, facultatif | Absent pour v1 et v2 ; présent sur **toutes** les questions quand `selectionRules` vaut 2. |

Raffinements du schéma (`src/core/dataset/schema.ts`) :

- `selectionRules === 2` ⇒ chaque question porte `subject` ;
- `selectionRules` absent ⇒ aucune question ne porte `subject` (une version reste cohérente).

## 3. Vue de banque (`src/core/bank`)

```text
BankVersion  + selectionRules: 1 | 2
BankQuestion + subject: string | null    // null si selectionRules = 1
BankErrorCode + 'unknown-selection-rules' | 'missing-subject'
```

`bankFromDataset` : `selectionRules = ds.selectionRules ?? 1`. Toute autre valeur que 1 ou 2 lève `unknown-selection-rules`, et une question sans enjeu en règles 2 lève `missing-subject`. Ce sont des défenses en profondeur, le schéma refusant déjà ces cas.

`bankFromCorpus` (scripts) : recopie `subject` et fixe `selectionRules: 2`, pour que la règle SUBJECT et les simulations utilisent les règles cibles.

## 4. Sélection (`src/core/selection`)

`Selection` est inchangée (`mode`, `priorityIndices`, `quotas`, `items`). `SelectedQuestion.pass` garde `1 | 2`.

Invariants des règles 2 (vérifiés par propriétés) :

| Invariant | Source |
|---|---|
| Aucune paire d'items de même `subject` | FR-012, SC-001 |
| `|items| = min(N, nombre d'enjeux distincts)` | FR-012, SC-004 |
| Si chaque thème `t` a au moins `quota[t]` enjeux libres à son tour, alors le nombre d'items ancrés sur `t` vaut `quota[t]` | FR-009, FR-010 |
| Chaque thème ayant au moins une question a au moins `min(plancher, questions éligibles)` items ancrés | SC-002 |
| `anchorThemeIndex ∈ question.themeIndices` | FR-008 |
| Déterminisme : même `(bank, mode, priorités)` ⇒ même liste | 003 FR-027 |

Les règles 1 restent bit pour bit celles de 003 (test de non-régression : sélections v1 et v2 identiques avant et après).

## 5. Règle de validation SUBJECT (`scripts/data/lib/rules/SUBJECT.ts`)

| Cas | Gravité | Entité |
|---|---|---|
| Question active sans `subject` | erreur | question |
| Thème actif : enjeux distincts < `maxPriorityQuota` | avertissement | theme |
| Enjeu partagé par ≥ 2 questions actives (liste des ids) | avertissement | bank |

Fixture : `data/fixtures/violations/SUBJECT/`.

## 6. Dossier de relecture (`data/relectures/2026-11-21-enjeux.md`)

En-tête : date, auteur (`claude`), relecteur (`adrien`), statut (à relire / validé le …). Puis trois sections :

1. Enjeux partagés : un bloc par enjeu, avec la liste des questions (id, thèmes, énoncé) et une case « regroupement validé ».
2. Cas limites laissés séparés : paires proches, avec le motif tiré de FR-002.
3. Couverture : par thème, nombre de questions actives, nombre d'enjeux distincts, `maxPriorityQuota`.
