# Implementation Plan: Corpus, ontologie et pipeline d'extraction des positions

**Branch**: `002-corpus-ontologie-pipeline` | **Date**: 2026-11-07 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/002-corpus-ontologie-pipeline/spec.md`

## Summary

Produire la matière première de radar-2027 et les garde-fous qui la rendent fiable : un corpus
versionné en YAML (16 thèmes, candidats, 250 à 300 énoncés, sources, positions relues,
contributeurs, gouvernance), un cache local des textes de sources hors dépôt, une validation
automatique bloquante en CI (règles codées une à une, rapport lisible, couverture et pouvoir
discriminant calculés dans `src/core`), une extraction assistée par l'API Anthropic
(sorties structurées, citations vérifiées par nous, journal de coût, idempotence, plafond), une
publication en versions immuables sous `public/data` consommées sans recopie par la page
Méthodologie et par les fonctionnalités 003 à 005, et cette page Méthodologie avec deux
nouveaux composants du design system. Tout l'outillage est en scripts TypeScript `tsx` hors
du bundle ; aucun serveur.

## Technical Context

**Language/Version**: TypeScript 5.9 (strict), Node.js 24, pnpm 12 (socle 001 inchangé)

**Primary Dependencies**: existantes : Next.js 16.4 (export statique), React 19.3, next-intl 4.14,
Tailwind 4.3, Storybook 10.6, Vitest 5.1, Playwright 1.65. Ajoutées (research.md) : `zod` 4.6
(schémas corpus et jeu publié, sorties structurées), `yaml` 2.9, `tsx` 4.23,
`@anthropic-ai/sdk` 1.6 (modèle par défaut `claude-opus-5-5`, redéfinissable), `@mozilla/readability`
0.6 + `linkedom` 0.18 (texte HTML), `unpdf` 2.1 (texte PDF), `fast-check` 4.10 (tests de propriétés)

**Storage**: fichiers dans le dépôt (`data/corpus/**` YAML, `data/extractions/**` JSON,
`public/data/**` JSON immuables) ; cache texte hors dépôt `.cache/sources/` (`RADAR_SOURCE_CACHE_DIR`) ;
aucune base, aucun stockage hébergé

**Testing**: Vitest projet `unit` étendu à `scripts/**` (règles de validation une à une avec
fixtures de violations, métriques par propriétés, extraction avec client factice), stories des
deux nouveaux composants exécutées dans Chromium avec a11y, Playwright `e2e/methodology.spec.ts`
contre `out/`, test d'intégration SC-001 sur `data/fixtures/violations/`

**Target Platform**: scripts : macOS/Linux, Node 24, exécutés localement et en GitHub Actions
(sans clé d'API) ; page Méthodologie : navigateurs evergreen dès 320 px, export statique Vercel Hobby

**Project Type**: application web statique, projet unique, plus un outillage de données dans
`scripts/data/` partageant `src/core/dataset` avec l'application

**Performance Goals**: `data:validate` complet (22 candidats, 300 questions) < 2 min (SC-010,
attendu : secondes) ; `main.json` ≤ 300 ko, détail par candidat ≤ 150 ko (SC-004) ; CI totale
toujours < 10 min (SC-008 de la 001)

**Constraints**: aucune position non relue, non sourcée ou à citation introuvable dans un jeu
publié (principe I, FR-022) ; versions publiées immuables et ≤ 256 (FR-039, FR-040) ; clé
d'API uniquement en environnement local, jamais journalisée (FR-030) ; aucune donnée de
contributeur publiée (FR-037) ; page Méthodologie sans chaîne en dur, sans style en dur,
utilisable au clavier et à 320 px (principes IV et VI) ; `src/core` sans React/DOM/Next

**Scale/Scope**: 16 thèmes, ~22 candidats, 250–300 questions, ~6 600 positions, quelques
centaines de sources ; 7 commandes `data:*`, ~20 règles de validation, 2 composants UI,
2 routes statiques (`/methodologie`, `/methodologie/candidats/[id]`), 1 étape CI

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principe | Exigence applicable | Comment le plan y répond | Statut |
|---|---|---|---|
| I. Neutralité et traçabilité | source + niveau de preuve par position ; `draft` jamais publié ; critères publics ; énoncés neutres et équilibrés ; données versionnées et relues | règles `FR-013`→`FR-022` codées et bloquantes ; publication ne lit que les positions `reviewed` connues (R10) ; `governance.yaml` publié tel quel ; grille de neutralité cochée avant `active` ; corpus en YAML relu par PR (R1, R13) | ✅ |
| II. Vie privée | rien du visiteur ni des contributeurs ne sort ; pipeline hors du site | contributeurs exclus des jeux publiés (R13) ; page Méthodologie statique sans requête ; signalement = lien vers le suivi de tickets (R12) ; scripts jamais dans le bundle (R3) | ✅ |
| III. Cœur métier pur | fonctions pures et testées par propriétés dans `src/core` | `src/core/dataset/{schema,types,metrics,positions}.ts` : couverture et `D_q` purs, fast-check, fixtures de la spec (R9) ; `zod` seul import, sans effet de bord | ✅ |
| IV. Design system d'abord | composants dans `src/ui` avec stories, tokens, a11y, 320 px, deux apparences | `PositionCard` et `CoverageList` avec stories/tests ; page composée de `Card`, `EvidenceBadge`, `ProgressBar`, `Button` ; lint « tokens seulement » déjà actif (R12) | ✅ |
| V. Tests comme contrat et CI bloquante | validation de schéma des données en CI ; e2e par parcours | étape `data:validate` activée dans `ci.yml` et `pnpm verify` ; test SC-001 sur fixtures ; `e2e/methodology.spec.ts` (R14) | ✅ |
| VI. i18n dès le premier écran | aucune chaîne en dur ; contenus de données séparés | textes de méthode dans `fr.json` (`methodology.*`), contenus (énoncés, thèmes, citations) dans le jeu publié (R12) | ✅ |
| VII. Simplicité, statique, sobriété | pas de backend ; projet unique ; données légères | scripts dans le même projet, pas d'espace de travail (R3) ; publication statique immuable ; budgets mesurés et bloquants (R10) | ✅ |
| Contraintes techniques | pipeline TS hors bundle via API Anthropic, clé en variable locale, journal modèle/date/coût ; ontologie plate 16 thèmes, 1–2 thèmes par question, échelle −2…+2 | R7 (SDK officiel, `client.messages.parse`, coût calculé depuis `usage`, journal `runs/*.json`) ; `themes.yaml` et règle `FR-008` | ✅ |
| Flux de travail | PR de données distinctes des PR de code, relues par une autre personne | gouvernance FR-041 rappelée dans le README du dossier `data/` ; règle « auteur ≠ relecteur » vérifiée (R13) | ✅ |

**Pré-recherche** : aucun écart. **Post-conception** : aucun écart ; une précision :
`zod` devient la seule dépendance tierce importée par `src/core` (module pur, sans I/O), ce
que le principe III autorise ; la règle de lint de frontière reste inchangée.

## Project Structure

### Documentation (this feature)

```text
specs/002-corpus-ontologie-pipeline/
├── plan.md                      # ce fichier
├── research.md                  # R1–R14 : formats, emplacements, outillage, modèle, formules
├── data-model.md                # 13 entités : corpus, extractions, gouvernance, publication, rapport
├── quickstart.md                # scénarios de validation par user story
├── contracts/
│   ├── corpus-files.md          # arborescence data/, exemples YAML, codes de règles
│   ├── cli.md                   # commandes pnpm data:*, comportements, client d'extraction
│   └── published-dataset.md     # fichiers servis, module src/core/dataset, page Méthodologie, composants
├── checklists/requirements.md
└── tasks.md                     # produit par /speckit-tasks (pas par ce plan)
```

### Source Code (repository root)

```text
.
├── .cache/sources/                      # texte des sources, ignoré par git (RADAR_SOURCE_CACHE_DIR)
├── .github/workflows/ci.yml             # étape data:validate activée (après typecheck)
├── data/
│   ├── README.md                        # gouvernance : PR de données distinctes, relecture croisée
│   ├── corpus/                          # YAML : themes, contributors, candidates, governance,
│   │                                    #   questions/<theme>.yaml, sources/<candidat>.yaml, positions/<candidat>.yaml
│   ├── extractions/                     # JSON : runs/<id>.json, affirmations/<candidat>.json, costs.json
│   ├── fixtures/
│   │   ├── minimal/                     # corpus conforme de test
│   │   └── violations/<code>/           # un corpus fautif par règle (SC-001)
│   └── reports/                         # validation.{md,json}, ignoré par git
├── public/data/
│   ├── versions.json                    # registre (current, versions[], empreintes)
│   └── versions/<n>/
│       ├── main.json                    # jeu principal ≤ 300 ko
│       └── candidates/<id>.json         # détail ≤ 150 ko
├── scripts/data/
│   ├── validate.ts                      # pnpm data:validate
│   ├── source.ts                        # pnpm data:source fetch|check
│   ├── extract.ts                       # pnpm data:extract
│   ├── affirmation.ts                   # pnpm data:affirmation list|accept|reject
│   ├── review.ts                        # pnpm data:review
│   ├── publish.ts                       # pnpm data:publish
│   ├── costs.ts                         # pnpm data:costs
│   ├── prompts/extraction.v1.md         # consignes versionnées
│   └── lib/
│       ├── schema/                      # Zod du corpus (themes, candidates, questions, sources, positions, …)
│       ├── corpus.ts                    # chargement YAML → objet Corpus typé
│       ├── rules/<code>.ts              # une règle pure par code (+ index ordonné)
│       ├── text.ts                      # normalisation, empreinte SHA-256, recherche de citation (R5)
│       ├── cache.ts                     # lecture/écriture .cache/sources
│       ├── report.ts                    # rapport Markdown + JSON
│       ├── pricing.ts                   # prix par modèle, coût depuis usage
│       ├── extraction/{client.ts,chunk.ts,run.ts,merge.ts}
│       ├── publish/{build.ts,registry.ts,sizes.ts}
│       └── *.test.ts                    # tests unitaires à côté des modules
├── src/
│   ├── app/methodologie/
│   │   ├── page.tsx                     # import de la version courante via versions.json
│   │   └── candidats/[id]/page.tsx      # generateStaticParams sur les candidats inclus
│   ├── core/dataset/
│   │   ├── types.ts                     # MainDataset, CandidateDetail, VersionRegistry, EvidenceCode
│   │   ├── schema.ts                    # schémas Zod des trois fichiers publiés
│   │   ├── metrics.ts                   # coverage(), discriminant()  (+ metrics.test.ts, fast-check)
│   │   └── positions.ts                 # positionOf(), questionIndex()
│   ├── i18n/messages/fr.json            # + methodology.*, ui.positionCard.*, ui.coverageList.*
│   └── ui/
│       ├── PositionCard/{PositionCard.tsx,.stories.tsx,.test.tsx,index.ts}
│       └── CoverageList/{CoverageList.tsx,.stories.tsx,.test.tsx,index.ts}
├── e2e/methodology.spec.ts
├── .env.example                         # ANTHROPIC_API_KEY, RADAR_EXTRACTION_MODEL, RADAR_SOURCE_CACHE_DIR
├── .gitignore                           # + .cache/, data/reports/
├── package.json                         # + dépendances, scripts data:*, verify étendu
├── tsconfig.json                        # include scripts/** ; tsconfig.scripts.json pour tsx
└── vitest.config.mts                    # projet unit : include scripts/**/*.test.ts
```

**Structure Decision** : projet unique conservé (principe VII). Quatre zones : `data/` (corpus
relu, extractions, fixtures), `scripts/data/` (outillage, jamais importé par `src/app` ni
`src/ui`), `src/core/dataset/` (contrat pur partagé entre scripts et application, future base
de la 003) et `public/data/` (publication immuable servie telle quelle). La frontière
`src/core` existante est inchangée ; les scripts peuvent importer `src/core`, jamais l'inverse.

## Approche de mise en œuvre (ordre proposé pour /speckit-tasks)

1. **Fondations** : dépendances épinglées, scripts npm, `tsconfig.scripts.json`, Vitest étendu,
   `.gitignore`, `.env.example`, `data/README.md`, `src/core/dataset` (types, schéma,
   métriques avec fixtures de la spec et propriétés).
2. **Référentiel (US1)** : schémas Zod du corpus, chargeur YAML, règles `ID-UNIQUE`,
   `REF-EXISTS`, `FR-003`→`FR-012`, rapport, `data:validate`, fixtures `minimal` et
   `violations`, test d'intégration SC-001 ; saisie des 16 thèmes, de `governance.yaml`, des
   contributeurs, de la liste de candidats confrontée à monvote2027.fr (différences tranchées
   par le propriétaire) et d'une première tranche de la banque. Activation de l'étape CI.
   `FR-012` ne s'applique qu'aux thèmes ayant au moins un énoncé actif ; un thème vide est un
   avertissement `THEME-EMPTY`, bloquant à la publication, pour que le référentiel reste
   validable avant relecture de la banque.
3. **Sources et positions (US2)** : `text.ts` (normalisation, empreinte, citation), `cache.ts`,
   `data:source fetch|check`, règles `FR-013`→`FR-020`, `SCALE`, `data:review`.
4. **Publication et Méthodologie (US3)** : `publish/`, registre, `PUB-IMMUTABLE`, `PUB-BUDGET`,
   `data:publish` ; composants `PositionCard` et `CoverageList` ; pages `/methodologie` et
   fiche candidat ; clés i18n ; e2e.
5. **Extraction assistée (US4)** : `pricing.ts`, `extraction/` (client SDK + client factice,
   découpage, exécution, fusion idempotente, plafond), `data:extract`, `data:affirmation`,
   `data:costs`, consignes `extraction.v1.md`, tests avec client factice.
6. **Campagne éditoriale** (hors périmètre de la mise en œuvre, menée avec ces outils) :
   banque à 250–300, sources des candidats, positions jusqu'à 60 % de couverture, publication
   de la version 1.

Chaque étape se termine par `pnpm verify` vert. Les étapes 3 et 5 sont indépendantes de la 4 ;
la 5 dépend de la 3 (cache et citations).

## Risques et parades

| Risque | Parade |
|---|---|
| Extraction de texte médiocre sur certains sites ou PDF | repli `--from-file` ; la validation ne dépend que du texte en cache, pas de l'extracteur |
| Modèle non déterministe ⇒ affirmations « nouvelles » aux relances | identité déterministe + fusion sans écrasement (R8) ; SC-005 interprété sur « 0 modification », documenté |
| Coût d'une campagne complète | cache de prompt, `--dry-run` avec estimation, plafond vérifié avant chaque requête, cumul consultable ; modèle redéfinissable par le mainteneur |
| `@anthropic-ai/sdk` 1.6 trop récent pour le délai minimal de pnpm | ajout à `minimumReleaseAgeExclude` ou repli sur 1.5.0 (même surface utilisée) |
| Banque de 250–300 énoncés équilibrés : effort éditorial | la validation donne les effectifs par thème et polarité à chaque exécution ; `BANK-SIZE` n'est qu'un avertissement avant la première publication |
| Taille des jeux de détail au-delà de 150 ko pour un candidat très documenté | mesure bloquante ; levier : limiter la justification publiée à 300 caractères (amendement de seuil) |
| Refus ou `max_tokens` sur une tranche | tranche marquée `failed`, exécution poursuivie, journal explicite |

## Complexity Tracking

Aucune dérogation à la constitution n'est nécessaire ; cette section reste vide.
