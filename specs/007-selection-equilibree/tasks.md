# Tasks: Sélection équilibrée

**Input**: Design documents from `/specs/007-selection-equilibree/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: requis par la constitution (III : cœur testé par propriétés ; V : tests comme contrat). Vitest se lance avec `</dev/null`.

**Organization**: phases par user story. US1 (un enjeu) et US2 (tous les thèmes) partagent le même module de remplissage ; US3 (étiquetage) fournit les données ; US4 (liens) encadre l'ensemble. L'ordre imposé par le plan s'applique : la fixture v2 avant tout changement du cœur, et la publication après la relecture d'adrien.

## Phase 1: Setup — figer les liens v2 (bloquant, AVANT tout changement du cœur)

- [X] T001 Généraliser `scripts/results/replay-v1-fixture.ts` en `scripts/results/replay-fixture.ts` avec `--version <n>`, une garde « version courante = n », la sortie `src/lib/results/replay-v<n>.fixture.json` et une graine propre à chaque version. Le contenu de `replay-v1.fixture.json` ne doit pas changer (régénération vérifiée identique, ou fichier laissé tel quel).
- [X] T002 Produire `src/lib/results/replay-v2.fixture.json` (20 cas : deux modes, 3 à 5 thèmes, palettes avec « sans avis ») sur la v2 courante, avec le code de `main`.
- [X] T003 Paramétrer le test de rejeu : `src/lib/results/replay-v1.test.ts` devient `src/lib/results/replay.test.ts`, qui couvre les fixtures v1 (17 thèmes) et v2 (18 thèmes). Le lancer vert, puis commiter T001 à T003 ensemble.

**Checkpoint**: les liens v1 et v2 sont figés avec le code actuel.

---

## Phase 2: Foundational — format des données et vue de banque

- [X] T004 [P] Étendre `src/core/dataset/types.ts` : `MainDataset.selectionRules?: 2`, `PublishedQuestion.subject?: string`.
- [X] T005 Étendre `src/core/dataset/schema.ts` : `selectionRules: z.literal(2).optional()`, `subject: Id.optional()` sur les questions, et un raffinement qui exige l'enjeu sur toutes les questions en règles 2, l'interdit sans `selectionRules` et refuse la forme mixte. Ajouter les cas dans `src/core/dataset/schema.test.ts` : v1 et v2 réelles valides, forme règles 2 valide, mixte refusée, `selectionRules: 3` refusé.
- [X] T006 [P] Ajouter `minimalMainDatasetV2()` (règles 2, enjeux) dans `src/core/dataset/fixture.ts`, avec au moins deux questions de même enjeu sur des thèmes différents.
- [X] T007 Étendre `src/core/bank/bank.ts` : `BankVersion.selectionRules: 1 | 2`, `BankQuestion.subject: string | null`, les codes `unknown-selection-rules` et `missing-subject`, et la lecture dans `bankFromDataset`. Tests dans `src/core/bank/bank.test.ts`. Mettre à jour `src/core/bank/fixtures.ts` et toute construction manuelle de `BankVersion` (`grep -rn "positions: new Map" src scripts`) avec `selectionRules: 1` et `subject: null`.
- [X] T008 Étendre `scripts/data/lib/schema/questions.ts` (`subject: IdSchema.optional()`) et `scripts/data/lib/bank.ts` (`bankFromCorpus` : recopie `subject ?? null`, `selectionRules: 2`) ; ajouter les cas dans `scripts/data/lib/schema/schema.test.ts`.

**Checkpoint**: `pnpm typecheck` est vert ; les tests 003 et le rejeu v1/v2 sont inchangés et verts.

---

## Phase 3: User Story 1 + User Story 2 — remplissage par enjeu et par ancrage (P1) 🎯 MVP

**Goal**: en règles 2, aucune paire de même enjeu, chaque thème reçoit son quota de questions ancrées, et le reliquat est réparti par tours.

**Independent Test**: les propriétés de `fill-subject.test.ts` et le cas de référence (mode court, Éducation + Fiscalité + Immigration) sur une banque v2 étiquetée en mémoire.

### Tests

- [ ] T009 [P] [US1] Écrire les propriétés fast-check sur des banques générées (2 à 20 thèmes, 1 ou 2 thèmes par question, enjeux partagés aléatoires, `D_q` aléatoires) dans `src/core/selection/fill-subject.test.ts` :
  - aucune paire d'items de même enjeu ;
  - `|items| = min(N, enjeux distincts)` ;
  - `anchorThemeIndex ∈ themeIndices` ;
  - déterminisme.
- [ ] T010 [P] [US2] Ajouter dans `src/core/selection/fill-subject.test.ts` les propriétés de couverture :
  - avec des enjeux tous distincts et des thèmes assez fournis, le nombre d'ancrées par thème égale exactement son quota ;
  - chaque thème qui a au moins une question éligible en a au moins `min(plancher, éligibles)` ;
  - une question à deux thèmes ne compte que pour son ancrage.

  Ajouter aussi les cas d'exemple :
  - deux questions de même enjeu sur deux thèmes : la plus discriminante est retenue, l'autre thème en prend une autre ;
  - un thème épuisé : le reliquat est réparti une question par thème et par tour, dans l'ordre de rotation.
- [ ] T011 [US1] Écrire le test de non-régression des règles 1 dans `src/core/selection/select.test.ts` : sur les banques v1 et v2 réelles, `selectQuestions` donne la même liste qu'une capture prise avant la modification (empreinte des ids par combinaison, sur un échantillon déterministe de 50 combinaisons × 2 modes, enregistré dans `src/core/selection/rules1.snapshot.json`, généré avec le code de T003).

### Implémentation

- [ ] T012 [US1] Implémenter `fillQuotasBySubject(bank, quotas, priorityIndices, target)` dans `src/core/selection/fill-subject.ts` selon 007 FR-008 à FR-011 et research R3. Réutiliser `byDiscriminant`, `questionsByTheme` et `rotationOrder` de `fill.ts`. Commentaire d'en-tête avec renvoi aux exigences.
- [ ] T013 [US1] Brancher `selectQuestions` sur `bank.selectionRules` dans `src/core/selection/select.ts`, exporter `fillQuotasBySubject` dans `src/core/selection/index.ts` et `src/core/index.ts`, et documenter les règles versionnées dans `src/core/README.md`.
- [ ] T014 [US2] Ajouter le cas de référence dans `src/core/selection/fill-subject.test.ts` : banque v2 réelle, enjeux posés en mémoire pour les trois paires du constat (uniforme, retraite, signes religieux) et enjeu égal à l'id pour les autres questions, `selectionRules: 2`. Vérifier qu'en mode court, avec Éducation + Fiscalité + Immigration, Fiscalité a 4 ancrées et les 18 thèmes au moins 1 ; et qu'avec Société + Travail + Éducation, il n'y a qu'une question par paire.

**Checkpoint**: tous les tests du cœur sont verts ; règles 1 identiques ; MVP du moteur prêt.

---

## Phase 4: User Story 3 — enjeux étiquetés et relus (P1)

**Goal**: chaque question active porte un enjeu validé ; la validation le garantit.

**Independent Test**: `pnpm data:validate` sans erreur SUBJECT ; le dossier de relecture est complet.

- [ ] T015 [P] [US3] Implémenter la règle `scripts/data/lib/rules/SUBJECT.ts` (research R4, data-model § 5) :
  - erreur pour une question active sans enjeu ;
  - avertissement pour un thème dont les enjeux distincts sont inférieurs à `maxPriorityQuota` (importé de `AXIS-DIM.ts`) ;
  - avertissement par enjeu partagé.

  L'enregistrer dans `scripts/data/lib/rules/index.ts`, avec ses tests dans `scripts/data/lib/rules/SUBJECT.test.ts` et la fixture `data/fixtures/violations/SUBJECT/` (calquée sur `data/fixtures/violations/AXIS-DIM/`).
- [ ] T016 [P] [US3] Étiqueter `data/fixtures/minimal/` (enjeu sur chaque question) pour que les tests du pipeline restent verts.
- [ ] T017 [US3] Proposer l'enjeu des 310 questions actives (et des retirées) : lire chaque fichier `data/corpus/questions/*.yaml`, regrouper selon 007 FR-002 et la convention de data-model § 1, et écrire la table id → enjeu dans un script à usage unique, `scripts/data/oneoff/2026-11-21-subjects.ts`. Ce script insère `subject:` après le bloc `themes:` par transformation textuelle, qui préserve commentaires et mise en forme ; il est vérifié par un diff limité aux lignes ajoutées.
- [ ] T018 [US3] Rédiger `data/relectures/2026-11-21-enjeux.md` (data-model § 6) : enjeux partagés avec énoncés côte à côte, cas limites laissés séparés avec leur motif, table de couverture par thème (questions actives, enjeux distincts, `maxPriorityQuota`).
- [ ] T019 [US3] Lancer `pnpm data:validate` : aucune erreur ; consigner les avertissements SUBJECT dans le dossier ; commiter l'étiquetage « à relire ».
- [ ] T020 [US3] Relecture d'adrien : appliquer ses corrections au corpus et au dossier, puis inscrire « validé par adrien le <date> » dans le dossier. **Tâche bloquante du propriétaire** : la publication (T025) ne démarre qu'après.

**Checkpoint**: corpus étiqueté et validé.

---

## Phase 5: User Story 4 — publication v3 sans casser les liens (P2)

**Goal**: la v3 est servie avec les règles 2 ; les liens v1 et v2 sont identiques.

**Independent Test**: `replay.test.ts` vert après publication ; v3 conforme au contrat.

- [ ] T021 [US4] Faire émettre la forme règles 2 à la projection de publication `scripts/data/lib/publish/build.ts` (`selectionRules: 2`, `subject` sur chaque question), avec ses tests dans `scripts/data/lib/publish/build.test.ts`. Vérifier que `diff.ts` voit l'ajout des enjeux comme un changement de contenu.
- [ ] T022 [P] [US4] Ajouter la section « Choix des questions » dans `src/app/methodologie/page.tsx`, affichée si la version courante déclare `selectionRules: 2`, avec les textes `methodology.selection.{title,subject,coverage,priorities}` dans `src/i18n/messages/fr.json`. Ajouter un test de page si la page en a un (`grep -rn methodologie src --include=*.test.tsx`).
- [ ] T023 [P] [US4] Mettre la banque fictive des e2e `e2e/fixtures/published.ts` en règles 2 (enjeux) si nécessaire, et vérifier la section dans `e2e/methodology.spec.ts`.
- [ ] T024 [US4] Ajouter dans `specs/003-domaine-score-selection-codec/spec.md` une note datée sous FR-022, qui renvoie à 007 pour les versions `selectionRules: 2` (FR-019) ; documenter `subject` et SUBJECT dans `data/README.md`.
- [ ] T025 [US4] Après T020 : lancer `pnpm data:publish --next --dry-run`, puis `pnpm data:publish --next`. Contrôler que `public/data/versions/3/main.json` contient `selectionRules: 2`, l'enjeu sur 100 % des questions, des discriminants et positions identiques à la v2 (comparaison par script), et que PUB-IMMUTABLE est vert.
- [ ] T026 [US4] Relancer `src/lib/results/replay.test.ts` : v1 et v2 identiques (SC-006).
- [ ] T026a [US4] Écrire le test de reprise d'un questionnaire en cours de v2 vers v3 (US4 scénario 3) à côté de `src/lib/questionnaire/from-result.ts` : les réponses aux questions toujours présentes sont conservées, les nouvelles questions sont non répondues, et la longueur égale la sélection v3.

**Checkpoint**: v3 publiée localement, liens anciens intacts.

---

## Phase 6: Polish & vérifications transverses

- [ ] T027 Écrire l'audit exhaustif `src/core/selection/balanced.audit.test.ts` : les 12 444 combinaisons × 2 modes sur la dernière version règles 2 publiée, contrôlant SC-001 à SC-004 (sauté si aucune). Mesurer le temps et le renommer en `*.perf.test.ts` s'il dépasse 10 s.
- [ ] T028 Parcours réel dans le navigateur intégré (quickstart § 6) : mode court Société + Travail + Éducation, une question par paire, 18 thèmes présents ; lien v2 de la fixture identique ; questionnaire v2 en cours repris sur v3 avec ses réponses ; section Méthodologie visible ; capture partagée.
- [ ] T029 Lancer `pnpm verify` (lint, typecheck, data:validate, tests, Storybook, build, e2e) et corriger.
- [ ] T030 Pousser la branche rebasée sur `main` et ouvrir ou mettre à jour la PR (citer `specs/007-selection-equilibree`, cocher les principes I à VII) ; consigner les écarts éventuels en fin de ce fichier.

---

## Dependencies & Execution Order

- **Phase 1** (T001 à T003) précède tout le reste. T011 capture les règles 1 avant T012 et T013.
- **Phase 2** dépend de la phase 1 ; T005 dépend de T004, T007 de T004 et T005, T008 de T007 (types de banque).
- **T026a** dépend de T025 (banque v3 publiée).
- **Phase 3** dépend de la phase 2. Les tests T009 à T011 s'écrivent avant T012 ; T014 vient après T013.
- **Phase 4** : T015 et T016 dépendent de T008 ; T017 à T019 sont séquentielles ; T020 attend adrien.
- **Phase 5** : T021, T022, T023 et T024 dépendent de la phase 2 et peuvent avancer pendant que T020 attend ; T025 dépend de T020 et T021 ; T026 dépend de T025.
- **Phase 6** : T027 dépend de T025 ; T028 et T029 dépendent de tout ; T030 en dernier. La PR peut être ouverte avant T020 (code et étiquetage à relire), puis complétée par la publication.

## Parallel Opportunities

- Phase 2 : T004 et T006 sur des fichiers distincts.
- Phase 3 : T009 et T010 dans le même fichier de test, à écrire ensemble ; T011 en parallèle.
- Phases 4 et 5 : T015, T016, T022, T023 et T024 en parallèle pendant la relecture d'adrien.

## Implementation Strategy

1. **MVP moteur** (phases 1 à 3) : les règles 2 sont prouvées par propriétés et par le cas de référence, sans rien changer en production.
2. **Données** (phase 4) : étiquetage, dossier, puis relecture par adrien.
3. **Mise en service** (phases 5 et 6) : publication v3, audit, parcours réel, `pnpm verify`, PR.
