# Contrat : delta de l'API du cœur (`@/core`)

Ce document complète `specs/003-domaine-score-selection-codec/contracts/core-api.md`.

## Signatures inchangées

```ts
selectQuestions(bank: BankVersion, mode: Mode, priorities: readonly string[]): Selection
computeQuotas(bank: BankVersion, mode: Mode, priorityIndices: readonly number[]): readonly number[]
encodeFragment / decodeFragment / decodeHeader   // format du lien inchangé
```

Les appelants (`store.tsx`, `from-result.ts`, `bank-view.ts`, `load.ts`, codec) ne changent pas : le choix des règles est interne à `selectQuestions`.

## Types étendus

```ts
type BankVersion = { …; readonly selectionRules: 1 | 2 };
type BankQuestion = { …; readonly subject: string | null };
type BankErrorCode = … | 'unknown-selection-rules' | 'missing-subject';
type MainDataset = { …; selectionRules?: 2; questions: { …; subject?: string }[] };
```

## Comportement

```ts
selectQuestions(bank, mode, priorities):
  quotas = computeQuotas(bank, mode, prioIdx)              // inchangé
  picked = bank.selectionRules === 2
    ? fillQuotasBySubject(bank, quotas, prioIdx, N)        // 007 FR-008 à FR-012
    : fillQuotas(bank, quotas, prioIdx, N)                 // 003, inchangé
  items  = roundRobin(picked, rotationOrder(T, prioIdx))   // inchangé
```

`fillQuotasBySubject` est exportée pour les tests ; elle est pure et déterministe et ne lit que `bank.questions`, leurs `themeIndices`, `discriminant`, `subject` et `id`.

## Erreurs

| Situation | Erreur |
|---|---|
| `main.json` avec `selectionRules` ≠ 2 ou forme mixte | rejet par `MainDatasetSchema` (jeu invalide, chemin d'erreur existant de 005) |
| `BankVersion` construite à la main avec des règles inconnues ou un enjeu manquant | `BankError` (`unknown-selection-rules`, `missing-subject`) |
