# Quickstart : vérifier la sélection équilibrée

Prérequis : dépendances installées (`pnpm install`), branche `007-selection-equilibree`. Lancer Vitest avec `</dev/null` (comportement connu du projet).

## 1. Liens v1 et v2 figés (avant tout changement de code)

```bash
pnpm tsx scripts/results/replay-fixture.ts --version 2
```

Résultat attendu : `src/lib/results/replay-v2.fixture.json` contient 20 cas (modes complet et court, 3 à 5 thèmes). Le commit précède toute modification de `src/core/selection`.

## 2. Tests du cœur

```bash
pnpm vitest run src/core src/lib/results </dev/null
```

Résultats attendus :

- les tests 003 existants passent sans modification (règles 1) ;
- les propriétés des règles 2 passent (aucun enjeu en double, quotas d'ancrage, `N` atteint, déterminisme) ;
- le cas de référence (mode court, Éducation + Fiscalité + Immigration, banque v2 étiquetée) donne 4 questions ancrées en Fiscalité et au moins 1 sur chacun des 18 thèmes ;
- le rejeu v1 et v2 (`replay-*.test.ts`) donne des résultats identiques.

## 3. Corpus

```bash
pnpm data:validate
```

Résultats attendus : aucune erreur SUBJECT. Les avertissements listent les enjeux partagés et, le cas échéant, les thèmes dont les enjeux distincts sont inférieurs à 13. Le dossier `data/relectures/2026-11-21-enjeux.md` porte la mention de validation d'adrien.

## 4. Publication v3

```bash
pnpm data:publish --next --dry-run
```

```bash
pnpm data:publish --next
```

Résultats attendus : `public/data/versions/3/main.json` déclare `"selectionRules": 2`, chaque question porte `subject`, et les discriminants et positions sont identiques à ceux de la v2. Les fichiers v1 et v2 sont inchangés (PUB-IMMUTABLE vert).

## 5. Audit exhaustif

```bash
pnpm vitest run src/core/selection/balanced.audit.test.ts </dev/null
```

Résultat attendu : 12 444 combinaisons × 2 modes sur la v3, sans enjeu en double, avec un plancher par thème et `N` questions (SC-001 à SC-004).

## 6. Parcours réel

`preview_start` sur le serveur de développement, puis : choisir Société, Travail et Éducation en mode court et parcourir les 25 questions. On doit trouver une seule question sur l'uniforme, une sur l'âge légal de la retraite, une sur les signes religieux, et au moins une question pour chacun des 18 thèmes. Ouvrir ensuite un lien v2 de la fixture : le résultat est identique, avec la mention de version antérieure. La page Méthodologie affiche la section « Choix des questions ».

## 7. Suite complète

```bash
pnpm lint && pnpm typecheck && pnpm vitest run </dev/null && pnpm build && pnpm test:e2e
```
