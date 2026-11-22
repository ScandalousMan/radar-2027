# Implementation Plan: Couverture des candidats et définitions des termes

**Branch**: `009-couverture-definitions` | **Date**: 2026-11-22 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/009-couverture-definitions/spec.md` (décisions du propriétaire du 2026-11-22 : une spec, deux récits livrables séparément, trois leviers de couverture, seuil de 60 % inchangé).

## Summary

Deux récits indépendants, la couverture d'abord.

**Couverture (US1 à US3)**. Sur la v4, une question n'est connue en moyenne que pour 5 à 6 candidats sur 18, et la sélection de 007 choisit la question la plus discriminante sans regarder sa couverture. Trois leviers :

1. **Règles de sélection 3** (cœur) : identiques aux règles 2 de 007, à un détail près. Dans chaque thème, les questions éligibles sont triées par couverture décroissante, puis par pouvoir discriminant, puis par identifiant. Quotas, ancrage, une question par enjeu, rotation, ordre de présentation, score et codec ne changent pas. Les versions 1 à 4 gardent leurs règles.
2. **Banque resserrée** (publication) : `data:publish` calcule la couverture de chaque question active du corpus. Il retient le plus petit minimum `k` qui laisse au plus 120 questions, après complément des thèmes sous le plancher de 3 enjeux. Il publie `selectionRules: 3`, `minQuestionCoverage: k` et `coverage` sur chaque question. Les autres questions restent dans le corpus, sans changement : c'est la réserve. Un rapport de couverture accompagne chaque publication. Sur la v4, `k = 7` donne environ 100 questions, avec un complément pour Société, Santé, Sécurité et Institutions.
3. **Campagne ciblée** (données) : `pnpm data:gaps` classe les couples candidat × question sans position par gain attendu. Ce gain dérive de simulations de sélection et compte les candidats que chaque position rapprocherait du seuil. Le sous-agent 008 traite les lignes par mission : il produit des preuves primaires ou un constat `NOT_FOUND`. L'agent en tire des positions `draft`, que le propriétaire relit avec `data:review`. Une nouvelle règle `SRC-AGGREGATOR` refuse tout agrégateur comme source. Un agrégateur peut seulement être consigné comme piste.

**Définitions (US4, US5)**. Un glossaire `data/corpus/glossaire.yaml` contient des termes relus et sourcés, contrôlés par la règle `GLOSS`. Il est publié hors versions dans `public/data/glossary.json`. Une fonction pure repère les termes dans un énoncé : première occurrence, forme la plus longue, sans chevauchement. Le composant `DefinedTerm` du design system est un toggletip : bouton souligné en pointillé et bulle non modale, ouverte par clic, toucher, clavier ou survol temporisé, fermée par Échap, geste extérieur ou bouton. Il est branché dans `QuestionCard` et `QuestionDetail`. La page `/glossaire` est rendue au build.

## Technical Context

**Language/Version**: TypeScript 5.9 (strict), Node.js 24, pnpm 12 (socle inchangé)

**Primary Dependencies**: aucune nouvelle. Utilisées : Next.js 16.4 (export statique), React 19.3, Zod 4.6, fast-check, next-intl, Tailwind v4 (tokens), Storybook 10.6 + addon a11y, Playwright 1.65. API Popover native (`popover="manual"`) pour la bulle, positionnée en JS (pas de Floating UI, R9).

**Storage**: corpus YAML (`data/corpus/glossaire.yaml` nouveau ; `governance.yaml` + `aggregatorDomains`) ; preuves et journaux 008 (`data/recherche/`, champ `lead` facultatif sur la preuve) ; jeux publiés `public/data/versions/5/` et `public/data/glossary.json` ; rapports `data/reports/couverture-v<n>.{md,json}` et `data/reports/trous/<date>.{md,json}` ; dossiers de relecture `data/relectures/`.

**Testing**: Vitest. Propriétés des règles 3 : garanties de 007 conservées, couverture monotone dans chaque thème, déterminisme. Cas d'acceptation US1 1 et 2. Non-régression des règles 1 et 2 : snapshot, rejeu v1 à v4, avec fixtures v3 et v4 produites avant tout changement du cœur. Resserrement de la banque : minimum, compléments, avertissements, cas limite sous 100 enjeux. Gain attendu et classement de `data:gaps`. Règles `SRC-AGGREGATOR` et `GLOSS`, avec leurs fixtures de violation. Repérage des termes : propriétés de non-chevauchement, première occurrence, forme la plus longue, bornes de mots. Composant `DefinedTerm` : tests d'interaction et stories avec a11y. e2e Playwright : terme défini au questionnaire (souris, clavier, toucher à 320 px, aucune réponse enregistrée) et page Glossaire. Audit exhaustif des 12 444 combinaisons × 2 modes sur la v5 (SC-001, SC-002). Parcours manuel dans le navigateur intégré.

**Target Platform**: site statique Next.js servi par Vercel Hobby (navigateurs evergreen, Popover API disponible partout depuis 2024) ; scripts de données exécutés en local

**Project Type**: application web statique, projet unique ; pipeline de données hors bundle

**Performance Goals**: sélection inchangée (< 1 ms) ; repérage des termes < 1 ms par énoncé (≤ 60 termes) ; rapport de couverture (24 888 sélections) en moins de 60 s ; `data:gaps` en moins de 30 s (R6).

**Constraints**: versions publiées immuables (PUB-IMMUTABLE) ; liens v1 à v4 identiques (SC-003) ; `main.json` ≤ 300 Kio (la v5 sera plus petite que la v4) ; `glossary.json` ≤ 30 Kio ; cœur pur ; aucune extraction payante ; le sous-agent ne touche jamais `data/corpus/positions/` (008) ; positions de campagne relues avant publication (FR-012) ; 320 px sans défilement horizontal.

**Scale/Scope**: environ 100 questions actives sur 310, 18 candidats, 18 thèmes. Campagne de quelques centaines de lignes, traitées par lots. Glossaire de 20 à 60 termes. 2 règles de validation nouvelles, 1 commande nouvelle (`data:gaps`), 1 commande étendue (`data:publish`), 1 composant UI, 1 page, 1 version publiée.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principe | Vérification | Statut |
|---|---|---|
| I. Neutralité et traçabilité | Aucune position inventée ni imputée (FR-012). Les positions de campagne passent par `draft` puis par la relecture du propriétaire. Les agrégateurs sont refusés comme source par une règle CI (`SRC-AGGREGATOR`). La règle de couverture est la même pour tous les candidats et ne favorise aucun sens de réponse. Les définitions sont factuelles, sourcées auprès d'institutions et relues (règle `GLOSS`). Énoncés et positions inchangés par la mise en réserve (FR-007). | ✅ |
| II. Vie privée | Fragment, codec et stockage inchangés. Le glossaire est un fichier statique sans état : ouvrir une définition ne change ni l'URL ni l'état (FR-018). | ✅ |
| III. Cœur pur | Les règles 3 reprennent `fillQuotasBySubject` avec un comparateur injecté, dans `src/core/selection`. La couverture est dérivée des positions dans `bankFromDataset`. Propriétés et non-régression sont couvertes. Le repérage des termes est une fonction pure, testée par propriétés (`src/lib/glossary`, hors cœur car sans effet sur le domaine, FR-021). | ✅ |
| IV. Design system | `DefinedTerm` vit dans `src/ui`, avec stories (fermé, ouvert, long, 320 px, sombre) et a11y sans violation. Il est utilisable au clavier et n'emploie que des tokens. Le repère est un soulignement pointillé, qui ne dépend pas de la seule couleur. | ✅ |
| V. Tests et CI | Tests unitaires et de propriétés, règles exécutées par `data:validate` en CI, rejeu v1 à v4, e2e sur le questionnaire et la page Glossaire, `pnpm verify` avant chaque PR. | ✅ |
| VI. i18n | Chaînes d'interface sous `glossary.*` et `methodology.coverage.*`. Libellés et définitions sont des données en français, stockés hors des messages. | ✅ |
| VII. Simplicité | Aucune dépendance ni service. Le glossaire est un JSON statique lu au build pour la page et récupéré par le client au questionnaire. La bulle utilise l'API Popover native. Une commande et deux règles sont ajoutées. | ✅ |
| Flux de travail | Spec validée avant le plan. `/speckit-analyze` avant l'implémentation. Une PR de code par récit, une PR de données distincte par campagne (positions candidates), une PR de publication v5. Glossaire relu par adrien avant publication. | ✅ |

Re-vérification après la phase 1 (data-model, contrats) : inchangée, aucune dérogation.

## Project Structure

### Documentation (this feature)

```text
specs/009-couverture-definitions/
├── plan.md              # ce fichier
├── research.md          # Phase 0 : décisions R1–R13
├── data-model.md        # Phase 1 : couverture, banque active/réserve, trou, agrégateur, terme
├── quickstart.md        # Phase 1 : scénarios de validation
├── contracts/
│   ├── published-dataset-delta.md   # main.json v5 : selectionRules 3, minQuestionCoverage, coverage ; glossary.json
│   ├── core-selection-delta.md      # @/core : règles 3, BankQuestion.coverage
│   ├── data-commands.md             # data:publish (resserrement, rapport), data:gaps, règles SRC-AGGREGATOR et GLOSS
│   └── defined-term-ui.md           # repérage des termes, composant DefinedTerm, page /glossaire
├── checklists/requirements.md
└── tasks.md             # Phase 2 (/speckit-tasks)
```

### Source Code (repository root)

```text
# Récit A — couverture
scripts/results/replay-fixture.ts          # --allow-older pour figer v3 (règles 2 inchangées à ce moment)
src/lib/results/replay-v3.fixture.json     # NOUVEAU, AVANT toute modification du cœur
src/lib/results/replay-v4.fixture.json     # NOUVEAU, idem
src/lib/results/replay.test.ts             # paramétré v1 à v4

src/core/dataset/types.ts                  # selectionRules?: 2 | 3, minQuestionCoverage?, PublishedQuestion.coverage?
src/core/dataset/schema.ts                 # raffinements : coverage ⇔ selectionRules 3, coverage = cases non `null` (neutre 0 compris)
src/core/bank/bank.ts                      # selectionRules 1|2|3, BankQuestion.coverage, minQuestionCoverage
src/core/selection/fill.ts                 # byCoverage (comparateur)
src/core/selection/fill-subject.ts         # comparateur en paramètre (règles 2 : byDiscriminant, règles 3 : byCoverage)
src/core/selection/select.ts               # branchement 1 / 2 / 3
src/core/selection/fill-subject.test.ts    # propriétés règles 3 + cas US1
src/core/selection/balanced.audit.test.ts  # épinglé sur v4 (règles 2) + audit v5 (règles 3, SC-001/002)
src/core/selection/coverage-audit.ts       # NOUVEAU (pur) : candidats classés pour un répondant qui répond à tout

scripts/data/lib/publish/active-bank.ts    # NOUVEAU : minimum de couverture, compléments, avertissements
scripts/data/lib/publish/build.ts          # n'émet que la banque active ; selectionRules 3 ; coverage
scripts/data/lib/publish/coverage-report.ts# NOUVEAU : rapport FR-008 (md + json)
scripts/data/publish.ts                    # rapport, avertissements, --min-coverage <k> facultatif
scripts/data/gaps.ts                       # NOUVEAU : pnpm data:gaps
scripts/data/lib/gaps.ts                   # NOUVEAU : liste ordonnée des trous (gain attendu, constats)
scripts/data/lib/schema/governance.ts      # aggregatorDomains
scripts/data/lib/schema/research.ts        # preuve : lead? { url, title }
scripts/data/lib/rules/SRC-AGGREGATOR.ts   # NOUVEAU (+ test, + index.ts)
data/fixtures/violations/SRC-AGGREGATOR/   # NOUVEAU
data/corpus/governance.yaml                # aggregatorDomains
.claude/skills/french-political-source-research/SKILL.md   # section « Mission issue de data:gaps », agrégateurs = pistes
src/app/methodologie/page.tsx              # section couverture si selectionRules = 3
src/i18n/messages/fr.json                  # methodology.coverage.*
e2e/fixtures/published.ts                  # banque fictive en règles 3
e2e/methodology.spec.ts

data/reports/trous/<date>.{md,json}        # listes de trous (campagne)
data/recherche/{preuves,journaux}/         # missions de campagne (sous-agent)
data/corpus/positions/*.yaml               # positions draft puis reviewed (PR de données)
public/data/versions/5/                    # publication (pnpm data:publish --next)
data/reports/couverture-v5.{md,json}

# Récit B — définitions
scripts/data/lib/schema/glossary.ts        # NOUVEAU (Zod)
scripts/data/lib/corpus.ts                 # chargement de glossaire.yaml (facultatif)
scripts/data/lib/rules/GLOSS.ts            # NOUVEAU (+ test, + fixtures)
scripts/data/glossary.ts                   # NOUVEAU : pnpm data:glossary → public/data/glossary.json
src/core/dataset/glossary.ts               # type + schéma Zod de glossary.json (partagé site/scripts)
src/lib/glossary/annotate.ts               # NOUVEAU : repérage pur (+ tests de propriétés)
src/lib/glossary/load.server.ts            # lecture au build (node:fs, page /glossaire uniquement)
src/lib/glossary/load.ts                   # fetch client (questionnaire, résultats), sans node:fs
src/lib/glossary/GlossaryProvider.tsx      # contexte React client (index compilé, table des termes)
src/ui/DefinedTerm/                        # NOUVEAU : DefinedTerm.tsx, stories, test, index.ts
src/ui/AnnotatedText/                      # NOUVEAU : rend un énoncé avec ses DefinedTerm
src/ui/QuestionCard/QuestionCard.tsx       # statement → AnnotatedText
src/ui/QuestionDetail/QuestionDetail.tsx   # text → AnnotatedText
src/app/glossaire/page.tsx                 # NOUVEAU
src/app/methodologie/page.tsx              # lien vers /glossaire
src/i18n/messages/fr.json                  # glossary.*
e2e/glossary.spec.ts                       # NOUVEAU
data/corpus/glossaire.yaml                 # NOUVEAU
data/relectures/<date>-glossaire.md        # inventaire + termes écartés (FR-022)
public/data/glossary.json
data/README.md                             # glossaire, aggregatorDomains, data:gaps, banque active / réserve
```

**Structure Decision**: projet unique existant. Le cœur gagne un comparateur et une valeur de `selectionRules`, et les appelants de `selectQuestions` ne changent pas. Le pipeline gagne le resserrement, un rapport, une commande et deux règles. L'UI gagne deux composants et une page.

**Ordre imposé** :

1. Fixtures de rejeu v3 et v4, avant tout changement du cœur (R2).
2. Récit A, code : règles 3, schémas, banque active, rapport, `SRC-AGGREGATOR`, `data:gaps`, Méthodologie. PR de code.
3. Récit A, données : liste des trous, missions du sous-agent, positions `draft`, relecture d'adrien (`data:review`). PR de données distincte. Plusieurs lots si besoin.
4. Publication v5 (`data:publish --next`), rapport de couverture, audit exhaustif, parcours réel. PR de publication. Si SC-001 ou SC-002 n'est pas atteint, le rapport est soumis au propriétaire avant publication (R5).
5. Récit B, indépendant de 2 à 4 : schéma, `GLOSS`, repérage, `DefinedTerm`, intégration, page, inventaire (FR-022), relecture d'adrien, `data:glossary`. Le glossaire peut sortir avant ou après la v5.

## Complexity Tracking

Aucune violation à justifier.
