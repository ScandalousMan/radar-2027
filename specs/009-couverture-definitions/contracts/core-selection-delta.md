# Contrat : `@/core` (delta 009)

**Base** : delta 007 `core-selection-delta.md`. **Recherche** : [../research.md](../research.md) R1, R3, R5.

## Types

```ts
// src/core/types.ts
export const MAX_ACTIVE_QUESTIONS = 120;

// src/core/bank/bank.ts
type BankQuestion = {
  // … champs 007 inchangés
  /** Nombre de candidats de la version dont la position est connue (toujours dérivé de `positions`). */
  readonly coverage: number;
};
type BankVersion = {
  // … champs 007 inchangés
  readonly selectionRules: 1 | 2 | 3;
  /** `k` de la banque resserrée ; `null` avant les règles 3. */
  readonly minQuestionCoverage: number | null;
};
type BankErrorCode = /* 007 */ | 'coverage-mismatch';
```

`bankFromDataset` :

- accepte `selectionRules` absent, 2 ou 3 (sinon `unknown-selection-rules`) ;
- exige `subject` en règles 2 et 3 (`missing-subject`) ;
- calcule `coverage` pour toute version ; en règles 3, lève `coverage-mismatch` si la valeur publiée diffère.

## Sélection

```ts
// src/core/selection/fill.ts
export function byDiscriminant(a: BankQuestion, b: BankQuestion): number;   // inchangé
export function byCoverage(a: BankQuestion, b: BankQuestion): number;       // coverage ↓, puis byDiscriminant
export function questionsByTheme(bank: BankVersion, compare = byDiscriminant): readonly (readonly BankQuestion[])[];

// src/core/selection/fill-subject.ts
export function fillQuotasBySubject(bank, quotas, priorityIndices, target, compare = byDiscriminant): readonly Picked[];

// src/core/selection/select.ts — signature publique inchangée
selectQuestions(bank, mode, priorities): Selection
//   règles 1 → fillQuotas ; règles 2 → fillQuotasBySubject(byDiscriminant) ; règles 3 → fillQuotasBySubject(byCoverage)
```

Garanties en règles 3, vérifiées par propriétés sur des banques générées :

1. Au plus une question par enjeu ; quota d'ancrage atteint pour chaque thème tant qu'il reste des questions éligibles ; `N` ou épuisement ; déterminisme (007, inchangé).
2. **Monotonie** : pour toute question retenue au premier passage pour le thème `t`, aucune question éligible de `t` non retenue à ce moment n'a une couverture strictement supérieure.
3. Cas d'acceptation US1, 1 et 2 : couverture 13 contre 7 → 13, quel que soit `D_q` ; couvertures égales → `D_q` puis identifiant.
4. Règles 1 et 2 : sorties identiques au snapshot `rules1.snapshot.json` et aux rejeux v1 à v4.

## Audit de couverture

```ts
// src/core/selection/coverage-audit.ts (pur)
/** Candidats classés (couverture ≥ COVERAGE_THRESHOLD sur la sélection) pour un répondant qui répond à toutes les questions. */
export function rankedCandidates(bank: BankVersion, selection: Selection): readonly string[];
/** Positions qui manquent au candidat dans la sélection pour atteindre le seuil (0 s'il est classé). */
export function missingForThreshold(bank: BankVersion, selection: Selection, candidateId: string): number;
```

Utilisé par le rapport de couverture (R5), par `data:gaps` (R6) et par l'audit exhaustif v5 (SC-001, SC-002). La règle de classement est celle de `scoreCandidate` (003 FR-008), et un test croise les deux sur la banque v5.

Propriétés (fast-check, banques et sélections générées ; principe III) :

1. `c ∈ rankedCandidates(bank, S)` ⇔ `missingForThreshold(bank, S, c) = 0`.
2. Monotonie : rendre connue une position inconnue d'un candidat sur une question de `S` ne retire aucun candidat de `rankedCandidates` et ne fait jamais croître `missingForThreshold`.
3. `missingForThreshold` est le plus petit nombre de positions à rendre connues dans `S` pour atteindre le seuil.
4. Déterminisme, et résultat indépendant de l'ordre des questions de `S`.

Couverture dans `bankFromDataset` : pour toute banque générée, `BankQuestion.coverage` = nombre de cases non `null` (neutre 0 compris) de la colonne, quelles que soient les règles.

## Hors périmètre

Score, quotas, ordre de présentation, codec, `LINK_FORMAT_VERSION` : inchangés (FR-004).
