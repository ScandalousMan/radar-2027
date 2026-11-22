# Implementation Plan: Dispositif de recherche de sources politiques (présidentielle 2027)

**Branch**: `008-recherche-sources-politiques` | **Date**: 2026-11-22 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/008-recherche-sources-politiques/spec.md`, clarifiée par adrien le 2026-11-22 (trois arbitrages), plan lancé par adrien le même jour (`/speckit-plan`).

## Summary

Doter le dépôt d'une capacité durable de recherche et de vérification des propos des
personnalités politiques liées à 2027, sans service payant et sans toucher à l'évaluation des
candidats. Trois volets :

1. **Outillage Claude Code du projet** : un sous-agent `french-political-source-researcher`
   (modèle `opus`, tous les outils hérités, skill préchargé par `skills:`), lancé seulement sur
   demande explicite ; le skill `french-political-source-research` réécrit en français, qui
   porte à lui seul toute la méthodologie ; suppression de l'ancien agent
   `political-source-researcher`.
2. **Corpus de preuves** sous `data/recherche/` (YAML, jamais publié, jamais scoré) : registre
   des personnalités avec historique des huit statuts, preuves par personnalité, journaux de
   mission avec compte rendu en 13 rubriques, signalements pour revue humaine. Les sources
   réutilisent le registre existant (`data/corpus/sources/`, `pnpm data:source fetch`).
3. **Validation** : sept règles `RECH-*` ajoutées à `pnpm data:validate` (déjà en CI), avec
   tests et fixtures, et un élargissement de `REF-EXISTS` pour qu'une source puisse viser une
   personnalité du registre de recherche. C'est la seule modification de code.

Un test non destructif (`bruno-retailleau` × `immigration`) valide l'installation ; ses preuves
ne sont ni commitées ni poussées sans demande.

## Technical Context

**Language/Version**: TypeScript 5.9 (strict), Node.js 24, pnpm 12 (socle 001 inchangé) ; Markdown + en-têtes YAML pour le sous-agent et le skill.

**Primary Dependencies**: aucune nouvelle. Utilisées : Zod 4.6 (schémas), `yaml` 2.9 (lecture du corpus), fonctions existantes `normalize`/`findQuote`/`sameWords` (`scripts/data/lib/text.ts`) et cache des sources (`scripts/data/lib/cache.ts`) ; mécanismes Claude Code de sous-agents de projet (`.claude/agents/`) et de skills (`.claude/skills/`), outils de recherche déjà disponibles en session (recherche web, lecture de pages, navigateur intégré).

**Storage**: fichiers YAML et Markdown versionnés sous `data/recherche/` ; sources dans le registre existant `data/corpus/sources/*.yaml` ; textes des sources dans le cache local hors git `.cache/sources/`.

**Testing**: Vitest (`pnpm vitest run scripts/data </dev/null`) : un test par règle `RECH-*`, `REF-EXISTS` complété, schémas (listes fermées), fixtures de violation découvertes par `validate.test.ts`, fixture minimale étendue d'un `recherche/` conforme, corpus réel conforme, budget de performance existant. Validation manuelle de l'installation (découverte, préchargement, lancement explicite, test non destructif, empreintes avant/après) selon [quickstart.md](quickstart.md).

**Target Platform**: sessions Claude Code (desktop et CLI) ouvertes dans le dépôt ; scripts de données exécutés en local et en CI (GitHub Actions).

**Project Type**: application web statique, projet unique ; la fonctionnalité ne touche que le pipeline de données (hors bundle) et l'outillage `.claude/` du projet.

**Performance Goals**: `pnpm data:validate` reste dans son budget actuel (`validate.perf.test.ts`) ; les règles `RECH-*` sont linéaires (index par identifiant) pour quelques milliers de preuves.

**Constraints**: `candidates.yaml`, thèmes, questions, positions et gouvernance inchangés octet pour octet (FR-046, SC-003) ; aucune modification de `src/`, du score, de `data:publish`, de `data:source` ni du schéma des sources ; aucune API ni abonnement (pas de `data:extract`) ; rien sous `~/.claude/` ; pas de commit, push ou PR par le sous-agent ; paywalls et authentifications jamais contournés.

**Scale/Scope**: 2 fichiers `.claude/` créés ou réécrits, 1 supprimé ; ~1 schéma, 1 chargeur, 7 règles, 1 règle élargie, ~10 fixtures de violation, 1 fixture minimale étendue ; registre initial attendu de 18 à 30 personnalités ; test d'installation sur 1 personnalité × 1 thème (18 questions).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principe | Vérification | Statut |
|---|---|---|
| I. Neutralité et traçabilité | Positions, niveaux de preuve publiés, critère d'inclusion et liste des candidats inchangés. Le corpus de preuves renforce la traçabilité (URL, dates, localisation, historique des corrections, journal daté) et ne produit que des signalements ; toute modification d'une position reste une PR de données relue. La qualité A–D s'ajoute au type de source sans le remplacer. | ✅ |
| II. Vie privée | Aucun changement du site ni des données de répondants. Le registre ne contient que des informations publiques sur des personnalités publiques, aucune donnée de contributeur n'est publiée. | ✅ |
| III. Cœur pur | `src/core` non touché. | ✅ (N/A) |
| IV. Design system | Aucune interface. | ✅ (N/A) |
| V. Tests et CI | Sept règles nouvelles testées, une fixture de violation par règle, exécutées par le job `data:validate` existant ; corpus réel conforme exigé. | ✅ |
| VI. i18n | Aucune chaîne d'interface. Skill, agent et données en français ; codes de statut en anglais (identifiants, exigence d'adrien). | ✅ |
| VII. Simplicité | Ni backend, ni dépendance, ni commande nouvelle : des fichiers YAML relus en PR et des règles dans le validateur existant. Un dossier `data/recherche/` séparé, justifié par FR-011/FR-042 (ne jamais alimenter le site). | ✅ |
| Contraintes techniques | Le pipeline payant (`data:extract`) n'est pas utilisé ; la recherche se fait en session (pratique établie). Aucun secret. | ✅ |
| Flux de travail | Cycle Spec Kit respecté. Code (règles, fixtures, `.claude/`, docs) et données réelles (preuves, sources du test) en PR distinctes (R12). | ✅ |

**Gate initial** : passé, aucune dérogation.

**Re-check après Phase 1** (data-model, contrats, quickstart) : passé. Points vérifiés :
l'élargissement de `REF-EXISTS` ne permet à aucune personnalité hors liste d'entrer dans un jeu
publié (`build.ts` ne publie que les sources citées par une position, et une position ne peut
viser qu'un candidat de `candidates.yaml`) ; les fixtures existantes restent conformes
(`recherche/` absent ⇒ règles `RECH-*` muettes) ; aucune règle ne modifie de fichier.

## Project Structure

### Documentation (this feature)

```text
specs/008-recherche-sources-politiques/
├── spec.md
├── plan.md                         # ce fichier
├── research.md                     # Phase 0 : décisions R1 à R13
├── data-model.md                   # Phase 1 : personnalité, statut, preuve, journal, signalement
├── quickstart.md                   # Phase 1 : validation de l'installation
├── contracts/
│   ├── research-files.md           # format des fichiers data/recherche/ (exemples)
│   ├── validation-rules.md         # règles RECH-* et branchement dans data:validate
│   └── subagent-and-skill.md       # en-têtes exacts, plan du skill, gabarit du compte rendu
├── checklists/requirements.md
└── tasks.md                        # Phase 2 (/speckit-tasks)
```

### Source Code (repository root)

```text
.claude/
├── agents/
│   ├── french-political-source-researcher.md      # créé (opus, skills: [french-political-source-research])
│   └── political-source-researcher.md             # supprimé
└── skills/french-political-source-research/
    └── SKILL.md                                   # réécrit en français, autoportant

data/
├── recherche/                                     # nouveau, jamais publié
│   ├── README.md                                  # rôle, arborescence, renvoi au skill et aux contrats
│   ├── personnalites.yaml
│   ├── preuves/<personnalite-id>.yaml
│   ├── journaux/<journal-id>.{yaml,md}
│   └── signalements.yaml
├── corpus/sources/<personnalite-id>.yaml          # existant ; nouvelles sources via data:source fetch
├── fixtures/minimal/recherche/                    # nouveau, conforme
├── fixtures/violations/RECH-*/                    # nouveaux, une faute chacun
├── fixtures/violations/REF-EXISTS-research/       # nouveau
└── README.md                                      # section « Corpus de recherche (spec 008) »

scripts/data/
├── lib/cli.ts                                     # DataPaths.researchDir
├── lib/context.ts                                 # ctx.research
├── lib/research.ts (+ .test.ts)                   # nouveau : chargement de data/recherche
├── lib/schema/research.ts                         # nouveau : schémas Zod ; export dans schema/index.ts
├── lib/schema/schema.test.ts                      # listes fermées
└── lib/rules/
    ├── types.ts, index.ts                         # contexte, types d'entités, enregistrement des règles
    ├── REF-EXISTS.ts (+ .test.ts)                 # personnalités du registre de recherche acceptées
    └── RECH-{ID,REF,STATUS,EVIDENCE,QUOTE,JOURNAL,SIGNAL}.ts (+ .test.ts)
```

**Structure Decision**: projet unique existant. La fonctionnalité ajoute un dossier de données
`data/recherche/` frère de `data/corpus/` (comme `data/extractions/`), étend le validateur
`scripts/data/` selon son architecture « une règle, un fichier, un test, une fixture », et
installe deux fichiers d'outillage dans `.claude/`. `src/`, `public/`, `e2e/` et les autres
commandes de données ne changent pas.

## Complexity Tracking

Aucune dérogation à la constitution.
