# Implementation Plan: Thème Éducation

**Branch**: `006-theme-education` | **Date**: 2026-11-15 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/006-theme-education/spec.md`, plus la réponse
de ChatGPT au prompt de recherche de sources (`.cache/education/reponse-chatgpt-2026-11-15.md`,
hors git, copie du fichier transmis par le propriétaire le 2026-11-15).

La spécification a été clarifiée le 2026-11-15 (axe à trois dimensions, énoncés tirés des
positions, cible de banque 320) ; le propriétaire a demandé d'enchaîner sur le plan, ce qui vaut
validation au sens du flux de travail de la constitution. Décision prise pendant le plan
(2026-11-15) : les sources vidéo entrent au cache sous forme de **transcription du passage**,
récupérée par l'agent et confirmée à l'écoute par adrien lors de la relecture des positions (R3).

## Summary

Ajouter `education` comme 18e thème, dernier de l'ordre canonique, et le publier dans la
version 2 de la banque. La fonctionnalité est d'abord un **travail de corpus** : aucune formule
de score, de quota ni de codec ne change, et aucun identifiant de thème n'est écrit en dur dans
l'application (vérifié pendant le plan : `src/` ne cite aucun thème ; les quotas sont testés
jusqu'à 20 thèmes).

Le seul changement de code est l'**outillage de l'axe à trois dimensions** (FR-002a, US3
scénario 4) : un thème peut déclarer des `dimensions`, chaque question dont il est le thème
principal porte alors une `dimension`, et une nouvelle règle de validation vérifie le
rattachement, le minimum de 3 questions par dimension et le minimum de questions égal au quota
maximal d'un thème prioritaire en mode complet (13 avec 18 thèmes, calculé par `computeQuotas`
de `@/core`). Ces champs restent dans le corpus : la projection de publication les ignore, le
format publié ne change pas.

Le corpus suit l'ordre décidé le 2026-11-15 (sources **avant** énoncés) :

1. **Sources** : tri des 19 URL proposées par ChatGPT (pré-vérification faite pendant le plan,
   R2), enregistrement par `pnpm data:source fetch` (ou `--from-file` pour les vidéos et les
   pages protégées), recherche complémentaire par l'agent pour les candidats sans source, relecture
   des 14 sources éducation déjà au corpus ; journal de campagne par candidat (SC-003).
2. **Inventaire des mesures** puis **rédaction de 13 à 17 énoncés** rattachés à une dimension,
   chacun motivé par des citations et un candidat attendu de chaque côté (FR-008) ; revue adverse
   par un second modèle, relecture d'adrien (activation).
3. **Positions** extraites en session par l'agent (jamais `data:extract`), brouillons relus par
   adrien ; signalement des énoncés non discriminants.
4. **Publication** de la version 2 (la PR #20, prérequis, est fusionnée) ; contrôle de rejeu d'un
   échantillon de 20 liens v1 (SC-006).

## Technical Context

**Language/Version**: TypeScript 5.9 (strict), Node.js 24, pnpm 12 (socle 001 inchangé)

**Primary Dependencies**: aucune nouvelle. Utilisées : Zod 4.6 (schémas du corpus),
`scripts/data/*` (pipeline 002 : `data:source`, `data:validate`, `data:review`,
`data:publish`), `@/core` (`computeQuotas` pour le minimum du thème, déjà importé par les
scripts de données), `@mozilla/readability` (extraction HTML). Pas de `yt-dlp` ni de
`ffmpeg` : les sous-titres vidéo sont lus depuis la page de la vidéo ou le panneau de
transcription dans le navigateur intégré (R3).

**Storage**: fichiers YAML versionnés sous `data/corpus/` ; texte des sources dans le cache
local `.cache/sources/` (hors git, empreinte commitée) ; journal de campagne et dossier de
rédaction en Markdown sous `data/campagnes/education/` (nouveau, versionné) ; prompt et
réponse ChatGPT sous `.cache/education/` (hors git).

**Testing**: Vitest (`scripts/data/lib/rules/AXIS-DIM.test.ts` et fixture
`data/fixtures/violations/AXIS-DIM/`, extension de `schema.test.ts`, test de non-régression
de la projection publiée sans `dimension`) ; `pnpm data:validate` sur le corpus réel ; test de
rejeu des liens v1 contre `public/data/versions/1` (SC-006) ; e2e Playwright existants inchangés
(ils servent une banque fictive) ; contrôle manuel du parcours dans le navigateur intégré après
publication.

**Target Platform**: site statique Next.js servi par Vercel Hobby ; scripts de données exécutés
en local (Node 24)

**Project Type**: application web statique, projet unique ; pipeline de données hors bundle

**Performance Goals**: sans objet nouveau ; `data:validate` reste sous son budget de
performance (`validate.perf.test.ts`)

**Constraints**: budgets publiés inchangés — `main.json` ≤ 300 Kio (104 Kio en v1, environ
+6 Kio attendus), fichier de détail ≤ 150 Kio (plus gros en v1 : Mélenchon, 95,5 Kio, environ
+15 Kio attendus) ; citation ≤ 300 caractères retrouvée mot pour mot dans le texte en cache ;
énoncé ≤ 200 caractères ; aucune extraction payante ; versions publiées immuables.

**Scale/Scope**: 18 candidats ; 13 à 17 énoncés Éducation (banque v2 : 310 à 314 actifs,
cible amendée 250–320) ; 19 URL ChatGPT à trier + recherche complémentaire ; environ 120 à
200 positions attendues ; 1 règle de validation nouvelle, 2 schémas étendus.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principe | Vérification | Statut |
|---|---|---|
| I. Neutralité et traçabilité | Chaque position cite une source attribuable (FR-013a) dont le texte en cache contient la citation ; aucune citation de ChatGPT reprise sans contrôle (R2 a déjà trouvé une citation tronquée) ; vidéos : transcription du passage en cache, confirmée à l'écoute (R3) ; énoncés soumis à la grille de neutralité et à un relecteur distinct ; axe formulé sans étiquette partisane ; équilibre 40–60 % vérifié par FR-012 ; modifications par PR de données. | ✅ |
| II. Vie privée | Aucun changement du codec, du fragment ni du stockage. | ✅ |
| III. Cœur pur | `src/core` inchangé ; la règle de validation ne fait qu'appeler `computeQuotas` (fonction pure). | ✅ |
| IV. Design system | Aucun composant nouveau ; le thème s'affiche par les composants existants qui lisent la liste de la version. | ✅ |
| V. Tests et CI | Règle nouvelle couverte par test unitaire et fixture de violation ; `data:validate` en CI ; parcours e2e existants inchangés ; test de rejeu v1. | ✅ |
| VI. i18n | Libellé, description et axe du thème sont des **données** (`themes.yaml`), stockées hors des messages d'interface ; aucune chaîne d'interface nouvelle. | ✅ |
| VII. Simplicité | Pas de dépendance ni de service nouveau ; deux champs facultatifs et une règle ; transcriptions obtenues sans outil installé. | ✅ |
| Flux de travail | PR de code (schéma, règle, amendements 002/003) distincte de la PR de données (thème, sources, énoncés, positions) et de la PR de publication ; relecture des données par adrien, distinct de l'auteur `claude`. | ✅ |

Aucune dérogation : la section « Complexity Tracking » reste vide.

## Project Structure

### Documentation (this feature)

```text
specs/006-theme-education/
├── plan.md              # ce fichier
├── research.md          # Phase 0 : décisions R1–R9, tri des sources ChatGPT
├── data-model.md        # Phase 1 : thème, dimension, source vidéo, journal, dossier
├── quickstart.md        # Phase 1 : scénarios de validation de bout en bout
├── contracts/
│   ├── corpus-delta.md      # champs nouveaux du corpus et règle AXIS-DIM
│   └── campagne-files.md    # forme du journal de campagne et du dossier de rédaction
├── checklists/requirements.md
└── tasks.md             # Phase 2 (/speckit-tasks)
```

### Source Code (repository root)

```text
scripts/data/lib/schema/
├── themes.ts                 # + dimensions?: [{ id, label, negative, positive }] (≥ 2)
├── questions.ts              # + dimension?: id
└── schema.test.ts            # cas nouveaux
scripts/data/lib/rules/
├── AXIS-DIM.ts               # nouvelle règle (FR-002a, FR-007 de 006)
├── AXIS-DIM.test.ts
└── index.ts                  # enregistrement
scripts/data/lib/publish/build.ts   # inchangé (projection explicite) ; test de non-fuite ajouté
data/fixtures/violations/AXIS-DIM/  # corpus fautif minimal
data/fixtures/minimal/              # inchangé (aucun thème à dimensions)

data/corpus/                  # PR de données
├── themes.yaml               # + education (order 17, axe, 3 dimensions)
├── governance.yaml           # bankMax 300 → 320
├── questions/education.yaml  # 13 à 17 énoncés
├── sources/<candidat>.yaml   # sources éducation nouvelles
└── positions/<candidat>.yaml # positions Éducation
data/campagnes/education/     # nouveau
├── sources.md                # journal de campagne par candidat (SC-003, FR-010)
└── enonces.md                # dossier de rédaction (FR-008)
data/README.md                # arborescence : campagnes/, 18 thèmes

public/data/versions/2/       # PR de publication (pnpm data:publish)

specs/002-corpus-ontologie-pipeline/spec.md   # amendement FR-002, FR-012, Assumptions (FR-004, FR-012 de 006)
specs/003-domaine-score-selection-codec/spec.md  # « 16 thèmes » → renvoi à l'ontologie
```

**Structure Decision**: projet unique existant. Le code touché se limite au pipeline de
données (`scripts/data/lib/schema`, `scripts/data/lib/rules`) ; l'application (`src/`) n'est
pas modifiée. Le corpus et la publication suivent l'arborescence de la 002, avec un dossier
`data/campagnes/education/` pour la traçabilité exigée par FR-008, FR-010 et SC-003.

**Découpage en pull requests** :

1. **Code** (branche `006-theme-education`, PR #21 déjà ouverte avec la spec) : plan,
   schémas, règle `AXIS-DIM`, fixtures, amendements 002/003, `data/README.md`.
2. **Données** (branche `006-education-donnees`, depuis la 1 fusionnée) : thème, gouvernance,
   sources, journal, dossier, énoncés, positions — commits par étape, relecture par adrien.
3. **Publication** (branche `006-publication-v2`) : `pnpm data:publish`, après fusion de la
   PR de données (la PR #20 est déjà fusionnée).

## Complexity Tracking

Aucune violation à justifier.
