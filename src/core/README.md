# `src/core` — cœur métier

Ce dossier accueillera le **domaine** de radar-2027 (fonctionnalité 003) : moteur de score,
sélection déterministe des questions et codec URL ↔ état. Il est volontairement vide dans le
socle (fonctionnalité 001).

## Frontière

Conformément au principe III de la [constitution](../../.specify/memory/constitution.md) :

- aucun import de `react`, `react-dom`, `next`, `next/*`, ni de `src/ui` ou `src/app` ;
- aucun accès au DOM, au réseau, à l'horloge ou à l'aléatoire ;
- uniquement des fonctions pures et déterministes, couvertes par des tests unitaires et des
  tests de propriétés.

## Vérification

La frontière est imposée par la règle `no-restricted-imports` de `eslint.config.mjs`, appliquée
à `src/core/**`. Un import interdit fait échouer `pnpm lint` en désignant la ligne fautive.
Le test `src/lib/core-boundary.test.ts` vérifie que cette règle reste active.

Voir [`specs/003-domaine-score-selection-codec`](../../specs/003-domaine-score-selection-codec/spec.md)
pour le contenu à venir.
