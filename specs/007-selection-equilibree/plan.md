# Implementation Plan: Sélection équilibrée

**Branch**: `007-selection-equilibree` | **Date**: 2026-11-21 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/007-selection-equilibree/spec.md`, validée par le propriétaire le 2026-11-21 (« Oui, lance le plan »).

## Summary

Deux défauts constatés sur la v2 en production : des questions sur le même enjeu dans une même liste, et des thèmes sans question propre, le reliquat allant au premier thème prioritaire. La correction porte sur trois niveaux :

1. **Données** : un champ `subject` (enjeu) sur chaque question du corpus, proposé par l'agent et relu par adrien, projeté dans le `main.json` des versions ≥ 3 avec `selectionRules: 2`.
2. **Cœur** : de nouvelles règles de remplissage, choisies par `selectQuestions` d'après la version. Une question n'est éligible que si son enjeu est libre. Elle ne compte que pour son thème d'ancrage. Le second passage procède par tours d'une question par thème. Les quotas, le tourniquet, le score et le codec ne changent pas. Les versions 1 et 2 gardent les règles de 003, bit pour bit.
3. **Publication** : la v3 est la v2 plus les enjeux et `selectionRules: 2`. Les liens v1 et v2 sont figés avant tout changement de code, puis rejoués.

## Technical Context

**Language/Version**: TypeScript 5.9 (strict), Node.js 24, pnpm 12 (socle 001 inchangé)

**Primary Dependencies**: aucune nouvelle. Utilisées : Zod 4.6 (schémas du corpus et du jeu publié), fast-check (propriétés), `@/core` (`computeQuotas`, `maxPriorityQuota` de la règle AXIS-DIM), pipeline 002 (`data:validate`, `data:publish --next`), next-intl (section Méthodologie).

**Storage**: corpus YAML sous `data/corpus/questions/` (champ `subject` ajouté par une transformation textuelle qui préserve les commentaires) ; dossier de relecture `data/relectures/2026-11-21-enjeux.md` ; jeu publié `public/data/versions/3/`.

**Testing**: Vitest. Les tests 003 existants restent intacts (règles 1). Nouveaux tests : propriétés des règles 2 sur des banques générées, cas de référence sur la banque v2 étiquetée, schéma du jeu publié (formes règles 1, règles 2 et mixte refusée), règle SUBJECT avec sa fixture de violation, projection de publication. Rejeu des fixtures de liens v1 et v2 (nouvelle) et audit exhaustif des 12 444 combinaisons × 2 modes (R8). e2e Playwright existants (banque fictive, `e2e/fixtures/published.ts`) : à garder verts, avec un scénario Méthodologie si la section dépend de la version. Parcours manuel dans le navigateur intégré.

**Target Platform**: site statique Next.js servi par Vercel Hobby ; scripts de données exécutés en local

**Project Type**: application web statique, projet unique ; pipeline de données hors bundle

**Performance Goals**: une sélection reste sous la milliseconde sur la banque réelle (environ 310 questions), ce qui laisse le questionnaire et les résultats instantanés ; l'audit exhaustif tient en quelques secondes (sinon il passe en `*.perf.test.ts`).

**Constraints**: versions publiées immuables (PUB-IMMUTABLE) ; liens v1 et v2 identiques (SC-006) ; `main.json` ≤ 300 Kio (v2 : 107 Kio, environ +9 Kio attendus) ; cœur pur et sans dépendance UI (lint de frontière) ; aucune extraction ni aucun étiquetage payant.

**Scale/Scope**: 310 questions actives à étiqueter (environ 15 à 40 enjeux partagés attendus) ; 18 thèmes ; 1 règle de validation nouvelle ; 2 schémas étendus (corpus, jeu publié) ; 1 module de sélection nouveau ; 1 section Méthodologie ; 1 version publiée.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principe | Vérification | Statut |
|---|---|---|
| I. Neutralité et traçabilité | Aucun énoncé, thème ni position modifié (FR-004). L'enjeu est relu par adrien, distinct de l'auteur `claude` (FR-003), et versionné par revue de code. La règle « la plus discriminante » est la même pour tous les enjeux et ne favorise aucun sens de réponse. | ✅ |
| II. Vie privée | Le fragment, le codec et le stockage ne changent pas ; la sélection reste calculée dans le navigateur. | ✅ |
| III. Cœur pur | `fill-subject.ts` est une fonction pure et déterministe dans `src/core/selection`, couverte par des propriétés (absence de doublon, quotas d'ancrage, `N`, déterminisme) et par la non-régression des règles 1. | ✅ |
| IV. Design system | Aucun composant nouveau ; la section Méthodologie réutilise la mise en page existante de la page (titres et paragraphes). | ✅ |
| V. Tests et CI | Tests unitaires et de propriétés, règle SUBJECT exécutée en CI par `data:validate`, rejeu v1/v2, e2e verts, `pnpm verify` avant la PR. | ✅ |
| VI. i18n | Textes de la section Méthodologie sous `methodology.selection.*` ; l'enjeu n'est jamais affiché. | ✅ |
| VII. Simplicité | Pas de dépendance ni de service ; un champ par question et un champ par version ; le choix des règles est un simple branchement interne à `selectQuestions`. | ✅ |
| Flux de travail | Spec validée avant le plan ; `/speckit-analyze` avant l'implémentation ; PR unique qui cite `specs/007-…`, publication après relecture des enjeux (R9) ; aucune donnée candidate modifiée, donc pas de PR de données distincte. | ✅ |

Re-vérification après la phase 1 (data-model, contrats) : inchangée, aucune dérogation.

## Project Structure

### Documentation (this feature)

```text
specs/007-selection-equilibree/
├── plan.md              # ce fichier
├── research.md          # Phase 0 : décisions R1–R9
├── data-model.md        # Phase 1 : champ subject, selectionRules, invariants, règle SUBJECT
├── quickstart.md        # Phase 1 : scénarios de validation
├── contracts/
│   ├── published-dataset-delta.md   # main.json : selectionRules, questions[].subject
│   └── core-selection-delta.md      # @/core : types étendus, choix des règles
├── checklists/requirements.md
└── tasks.md             # Phase 2 (/speckit-tasks)
```

### Source Code (repository root)

```text
scripts/results/
├── replay-v1-fixture.ts → replay-fixture.ts   # --version <n> ; garde « version courante = n »
src/lib/results/
├── replay-v2.fixture.json      # NOUVEAU, produit AVANT toute modification du cœur (R6)
├── replay-v1.test.ts → replay.test.ts         # paramétré v1 + v2

src/core/dataset/
├── types.ts                    # MainDataset.selectionRules?, PublishedQuestion.subject?
├── schema.ts                   # champs + raffinements (forme mixte refusée)
├── fixture.ts                  # + variante règles 2
src/core/bank/
├── bank.ts                     # selectionRules, subject, nouveaux BankErrorCode
src/core/selection/
├── fill-subject.ts             # NOUVEAU : fillQuotasBySubject (FR-008 à FR-012)
├── fill-subject.test.ts        # propriétés + cas de référence
├── select.ts                   # branchement selon bank.selectionRules
├── balanced.audit.test.ts      # audit exhaustif sur la dernière version règles 2 (R8)
├── index.ts                    # export
src/core/README.md              # mention des règles versionnées

scripts/data/lib/schema/questions.ts   # + subject?: id
scripts/data/lib/bank.ts               # recopie subject, selectionRules: 2
scripts/data/lib/rules/SUBJECT.ts      # NOUVEAU (+ test, + index.ts)
data/fixtures/violations/SUBJECT/      # corpus fautif minimal
data/fixtures/minimal/                 # questions étiquetées (sinon SUBJECT échoue)
scripts/data/lib/publish/build.ts      # émet selectionRules: 2 et subject
scripts/data/lib/publish/build.test.ts

src/app/methodologie/page.tsx          # section « Choix des questions » si selectionRules = 2
src/i18n/messages/fr.json              # methodology.selection.*
e2e/fixtures/published.ts              # banque fictive : passer en règles 2 si nécessaire
e2e/methodology.spec.ts                # section visible

data/corpus/questions/*.yaml           # subject sur chaque question
data/relectures/2026-11-21-enjeux.md   # dossier de relecture (R5)
public/data/versions/3/                # publication (pnpm data:publish --next)

specs/003-domaine-score-selection-codec/spec.md   # note datée de renvoi (FR-019)
data/README.md                                    # champ subject, règle SUBJECT
```

**Structure Decision**: projet unique existant. Le cœur gagne un module de remplissage et un branchement, et les appelants de `selectQuestions` ne changent pas (contrat `core-selection-delta.md`). Le pipeline gagne un champ, une règle et une projection.

**Ordre imposé** (R6, R9) :

1. Fixture de rejeu v2, avant tout changement du cœur.
2. Code et tests (règles 1 intactes, règles 2, schémas, SUBJECT, projection, Méthodologie).
3. Étiquetage, dossier, puis relecture et validation d'adrien.
4. Publication de la v3, audit exhaustif, parcours réel, `pnpm verify`, PR.

## Complexity Tracking

Aucune violation à justifier.
