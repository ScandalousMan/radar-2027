# Contrat : sous-agent et skill de recherche politique

**Spec** : FR-001 à FR-006, FR-013 à FR-050 · **Décisions** : [../research.md](../research.md) R1, R2, R8

> **Amendement du 2026-11-27** (demande d'adrien) : le chercheur passe à `model: sonnet`,
> `effort: medium`, `disallowedTools: Agent, Workflow`, et un second agent,
> `french-political-research-orchestrator` (`model: opus`, `effort: high`), planifie et contrôle les
> missions larges avec le même skill. Les en-têtes ci-dessous et SC-010 sont à lire avec ce
> changement ; les fichiers de `.claude/agents/` font foi.

## Fichiers

| Fichier | Action |
|---|---|
| `.claude/agents/french-political-source-researcher.md` | créé |
| `.claude/agents/political-source-researcher.md` | **supprimé** (FR-006) |
| `.claude/skills/french-political-source-research/SKILL.md` | réécrit en français (FR-005, FR-006) |
| `~/.claude/**` | **jamais touché** (FR-049, SC-007) |

## Sous-agent — en-tête (contrat exact)

```yaml
---
name: french-political-source-researcher
description: >-
  French Political Source Researcher. Agent spécialisé dans la recherche approfondie, la
  vérification et la documentation des citations et positions politiques de personnalités
  françaises liées à l'élection présidentielle de 2027. Recherche les sources primaires,
  vérifie les citations, distingue les positions individuelles des positions collectives et
  enrichit le corpus du projet. Utilise systématiquement le skill
  french-political-source-research. À utiliser lorsque l'utilisateur demande explicitement
  son intervention. Ne l'employer que lorsque la demande le nomme, jamais pour les tâches
  ordinaires du projet.
model: opus
skills:
  - french-political-source-research
---
```

Contraintes :

- pas de champ `tools`, `disallowedTools`, `permissionMode`, `mcpServers` (FR-002 : héritage
  complet des outils de la session principale) ;
- `name` en kebab-case, unique dans le projet ; aucun autre agent de recherche politique
  (SC-010) ;
- le texte de la description est celui d'adrien, mot pour mot (section 3 de
  [`demande.md`](../demande.md)), précédé du nom affiché et complété par la phrase d'invocation
  explicite (FR-003). Corrigé à l'implémentation (T025) : la version initiale de ce contrat
  reformulait la dernière phrase d'adrien.

## Sous-agent — corps (sections attendues)

Court ; il renvoie au skill préchargé pour toute la méthodologie (FR-004).

1. **Titre** « French Political Source Researcher » et rôle en deux phrases.
2. **Avant toute recherche** : lire la demande, identifier le mode (FR-047), le périmètre
   (personnalités, thèmes, questions par leurs identifiants), ouvrir un journal
   `data/recherche/journaux/<date>-<slug>.yaml`.
3. **Ce que le sous-agent peut écrire** : `data/recherche/**` ; nouvelles sources via
   `pnpm data:source fetch` (donc `data/corpus/sources/*.yaml` et le cache local).
4. **Ce qu'il ne touche jamais** : `data/corpus/{candidates.yaml,themes.yaml,questions/,positions/,governance.yaml}`,
   `public/data/`, `src/`, `scripts/`, `.claude/`, configuration globale ; pas de commit, de
   push, de pull request, de `pnpm data:extract`, de `data:review`, de `data:publish`
   (FR-042, FR-046, FR-049, FR-050).
5. **Avant de rendre la main** : `pnpm data:validate` sans violation sur le corpus de preuves ;
   compte rendu écrit dans `journaux/<id>.md` et restitué intégralement dans la réponse.

## Skill — en-tête (contrat exact)

```yaml
---
name: french-political-source-research
description: >-
  Méthodologie de recherche, de vérification, de qualification et d'enregistrement des
  preuves sur les positions et statuts de candidature des personnalités politiques françaises
  liées à la présidentielle 2027 (corpus data/recherche du projet radar-2027). À utiliser
  pour toute recherche ou vérification de citations, sources, attributions ou statuts de
  candidature, par le sous-agent french-political-source-researcher ou sur sélection
  manuelle.
---
```

Contraintes : **pas** de `disable-model-invocation` (empêcherait le préchargement dans le
sous-agent) ; `user-invocable` laissé à sa valeur par défaut (sélection manuelle, US2) ;
description + `when_to_use` sous 1 536 caractères.

## Skill — plan du corps (`SKILL.md`, autoportant)

Toutes les règles obligatoires figurent dans `SKILL.md` lui-même : le préchargement n'injecte
que ce fichier. Chaque section renvoie aux exigences qu'elle porte.

| § | Section | Contenu | Exigences |
|---|---|---|---|
| 0 | Objet et principes | établir ce que la preuve démontre, pas trouver une source qui « va dans le sens » ; preuves ≠ évaluation | FR-042 |
| 1 | Périmètre et fichiers | arborescence `data/recherche/`, ce qui est modifiable ou non, identifiants réutilisés | FR-011, FR-039–FR-041, FR-046 |
| 2 | Démarrage d'une mission | choix du mode, ouverture du journal, lecture préalable du corpus existant (positions, sources, preuves) | FR-029, FR-034, FR-047 |
| 3 | Les cinq modes | déroulé de chacun ; comparaison à critères identiques ; thématique dans les deux sens de la polarité ; audit adversarial (revérifier sans lire d'abord la conclusion existante) | FR-047, US4, US5 |
| 4 | Statuts de candidature | 8 statuts définis avec exemples et contre-exemples ; rumeur ≠ déclaration ; historique ; signalement si écart avec la liste publiée | FR-007–FR-012 |
| 5 | Hiérarchie des sources | niveaux A, B, C tels qu'énumérés par adrien ; extrait de moteur ≠ preuve ; ouvrir l'original ; paywall non contourné | FR-013, FR-014, FR-016, FR-049 |
| 6 | Passes de recherche | passes A à H reprises de l'ancien skill, alignées sur les catégories de FR-028 ; exemples de requêtes ; ne pas s'arrêter à la première citation | FR-028 |
| 7 | Vérification des citations | champs à relever ; interdits ; vidéo (horodatage, transcription) ; documents parlementaires (page, article, amendement) ; quatre statuts de citation avec critères | FR-017–FR-020 |
| 8 | Attribution | neuf types + confiance ; parti, groupe, gouvernement ≠ individu ; portée d'un vote ; désaccords avec le parti | FR-021–FR-023 |
| 9 | Qualification | huit qualifications relatives à l'énoncé ; tableau de précision des politiques (acteur, instrument, objectif, montant, calendrier, portée, géographie, statut juridique, conditions, force) ; interdits de déduction | FR-024–FR-026 |
| 10 | Appréciations séparées | qualité de source, exactitude, attribution, interprétation, actualité ; pas de score agrégé ; `rationale` | FR-015, FR-027 |
| 11 | Actualité et contradictions | quatre dates ; `temporalRelevance` ; conserver les deux preuves, chercher l'explication, `CONTRADICTORY_EVIDENCE` | FR-031–FR-033 |
| 12 | Doublons et corroborations | requêtes de recherche dans le dépôt avant ajout ; corroboration ; indépendance des sources ; jamais de suppression | FR-034–FR-036 |
| 13 | Lacunes et `NOT_FOUND` | les dix lacunes ; seuil de recherche significative | FR-037, FR-038 |
| 14 | Enregistrement | format YAML pas à pas (exemples de [research-files.md](./research-files.md)), `pnpm data:source fetch` (correspondance du `kind`, `--from-file` pour les transcriptions), historique des corrections, signalements | FR-039–FR-045 |
| 15 | Signalements | quand en produire (cinq types), contenu, jamais de résolution par l'agent | FR-012, FR-033, FR-036, FR-044 |
| 16 | Contrôle final | `pnpm data:validate`, vérification d'intégrité des fichiers interdits (`git status`), relecture des citations | FR-045, SC-003 |
| 17 | Compte rendu | gabarit ci-dessous ; séparation faits / citations / paraphrases / interprétations / hypothèses | FR-048 |
| 18 | Sécurité et interdits | liste récapitulative | FR-049, FR-050 |

Annexe facultative admise : `.claude/skills/french-political-source-research/exemples.md`
(cas commentés), sans aucune règle qui n'existe pas déjà dans `SKILL.md`.

## Gabarit du compte rendu

Écrit dans `data/recherche/journaux/<journal-id>.md` et restitué dans la réponse.

```markdown
# Compte rendu — <journal-id>

Mode : <mode> · Auteur : <contributeur> · Dates : <début> → <fin> · État : <completed|interrupted>

## 1. Périmètre de recherche
## 2. Personnalités et thèmes couverts
## 3. Sources consultées
## 4. Citations et preuves ajoutées
## 5. Sources ayant corroboré des éléments existants
## 6. Corrections effectuées
## 7. Doublons évités
## 8. Éléments non vérifiés ou non résolus
## 9. Changements de statut de candidature identifiés
## 10. Contradictions et évolutions de position
## 11. Lacunes documentaires restantes
## 12. Fichiers créés ou modifiés
## 13. Arbitrages nécessitant une intervention humaine
```

Dans chaque rubrique, chaque constat important porte la citation exacte ou le passage de
référence et l'URL ; chaque affirmation est étiquetée **[Fait vérifié]**, **[Citation]**,
**[Paraphrase]**, **[Interprétation]** ou **[Hypothèse]**. Une rubrique sans objet porte
« Aucun » (jamais supprimée).

## Lancement et sélection (pour le livrable final, FR-053)

- Sous-agent : « Utilise le sous-agent french-political-source-researcher pour rechercher les
  positions de Bruno Retailleau sur l'immigration », ou `@agent-french-political-source-researcher …`.
- Skill : `/french-political-source-research` dans une session ordinaire, ou sélection dans la
  liste des skills de l'interface.
