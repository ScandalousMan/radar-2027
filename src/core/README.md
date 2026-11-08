# `src/core` — cœur métier

Ce dossier accueille le **domaine** de radar-2027. Son premier module est
[`dataset/`](dataset) (fonctionnalité 002) : types et schémas Zod du jeu de données publié
(`main.json`, détails par candidat, registre des versions), calculs de couverture et de pouvoir
discriminant, accès aux positions. Il est consommé par les scripts de données
(`scripts/data/`), par la page Méthodologie et servira de base à la fonctionnalité 003 (moteur
de score, sélection déterministe des questions, codec URL ↔ état).

`zod` est la seule dépendance tierce autorisée dans `src/core` (validation pure, sans I/O).

## Frontière

Conformément au principe III de la [constitution](../../.specify/memory/constitution.md) :

- aucun import de `react`, `react-dom`, `next`, `next/*`, ni de `src/ui`, `src/app` ou `scripts/` ;
- aucun accès au DOM, au réseau, à l'horloge ou à l'aléatoire ;
- uniquement des fonctions pures et déterministes, couvertes par des tests unitaires et des
  tests de propriétés.

## Vérification

La frontière est imposée par la règle `no-restricted-imports` de `eslint.config.mjs`, appliquée
à `src/core/**`. Un import interdit fait échouer `pnpm lint` en désignant la ligne fautive.
Le test `src/lib/core-boundary.test.ts` vérifie que cette règle reste active.

Voir [`specs/003-domaine-score-selection-codec`](../../specs/003-domaine-score-selection-codec/spec.md)
pour le contenu à venir.
