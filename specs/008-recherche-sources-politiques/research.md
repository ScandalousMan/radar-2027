# Phase 0 : recherche et décisions — 008 Dispositif de recherche de sources politiques

**Date** : 2026-11-22 · **Spec** : [spec.md](./spec.md) · **Plan** : [plan.md](./plan.md)

Aucune inconnue technique ne restait marquée `NEEDS CLARIFICATION` après la session de
clarification du 2026-11-22 (registre distinct, règle de validation, suppression de l'ancien
agent). Les décisions ci-dessous fixent les choix laissés au plan par la spécification.

## R1. Format des composants Claude Code (sous-agent et skill)

Sources : documentation Claude Code « Subagents » et « Skills » (code.claude.com/docs, consultée
le 2026-11-22).

- **Decision** : sous-agent `.claude/agents/french-political-source-researcher.md`, en-tête YAML
  `name`, `description`, `model: opus`, `skills: [french-political-source-research]`, **sans**
  `tools` ni `disallowedTools` (héritage de tous les outils de la session principale, MCP
  compris : recherche web, lecture de pages, navigateur intégré). Skill
  `.claude/skills/french-political-source-research/SKILL.md`, en-tête `name` et `description`
  seulement, **sans** `disable-model-invocation`.
- **Rationale** :
  - `skills:` injecte le contenu complet de `SKILL.md` dans le contexte du sous-agent au
    démarrage (FR-002) ; un skill marqué `disable-model-invocation: true` **ne peut pas** être
    préchargé dans un sous-agent : le champ est donc proscrit.
  - Il n'existe aucun champ de « nom affiché » distinct de `name`. Convention retenue :
    `name: french-political-source-researcher`, titre « French Political Source Researcher »
    en tête de la `description` et en titre H1 du corps du fichier (FR-001).
  - `opus` est un alias de modèle accepté.
  - Il n'existe aucun réglage « invocation explicite seulement » pour un sous-agent : la
    délégation automatique est découragée par la `description` (FR-003), qui reprend le texte
    d'adrien et se termine par « À utiliser uniquement lorsque l'utilisateur demande
    explicitement son intervention en le nommant ». Interdire l'agent par `permissions.deny`
    empêcherait aussi le lancement manuel : écarté.
  - Lancement manuel : en langage naturel (« Utilise le sous-agent
    french-political-source-researcher pour… ») ou par mention `@agent-french-political-source-researcher`.
  - Les dossiers `.claude/agents/` et `.claude/skills/` du projet sont surveillés : pas de
    redémarrage nécessaire en principe ; `/reload-skills` sinon.
- **Alternatives considered** : `tools` limité à une liste explicite (contraire à FR-002) ;
  méthodologie dans le corps de l'agent seul (contraire à FR-004) ; skill réparti en plusieurs
  fichiers de référence (le préchargement n'injecte que `SKILL.md` : toute règle obligatoire
  doit y figurer, un fichier annexe n'est admis que pour des exemples facultatifs) ; installation
  dans `~/.claude/` (interdite par FR-001, FR-049, SC-007).

## R2. Sort des composants existants

- **Decision** : supprimer `.claude/agents/political-source-researcher.md` (jamais suivi par git)
  et réécrire `SKILL.md` en français. Reprendre de l'ancien skill : les passes de recherche A à H
  (reformulées sur les catégories de FR-028), le tableau de « précision des politiques » (acteur,
  instrument, objectif, montant, calendrier, portée, géographie, statut juridique, conditions,
  force), la règle d'indépendance des sources (deux reprises d'une même dépêche ne sont pas deux
  corroborations), les exemples de requêtes, l'interdit de traduire une citation. Abandonner :
  les statuts `SUPPORTED`/`PARTIALLY_SUPPORTED`/`CONTRADICTED`, les niveaux A–D de l'ancienne
  version et le gabarit de sortie, remplacés par les listes fermées de la spec.
- **Rationale** : tranché par adrien (FR-006) ; SC-010 exige un seul sous-agent de recherche.
- **Alternatives considered** : conserver l'ancien agent en le renommant (doublon) ; garder le
  skill en anglais (contraire à FR-005).

## R3. Emplacement et format du corpus de preuves

- **Decision** : nouveau dossier **`data/recherche/`**, frère de `data/corpus/` et de
  `data/extractions/`, en YAML (listes) sauf les comptes rendus en Markdown :

  ```text
  data/recherche/
  ├── personnalites.yaml               # registre des personnalités suivies et historique des statuts
  ├── preuves/<personnalite-id>.yaml   # preuves d'une personnalité
  ├── journaux/<journal-id>.yaml       # journal daté d'une mission
  ├── journaux/<journal-id>.md         # compte rendu de la mission (13 rubriques)
  └── signalements.yaml                # demandes de revue humaine
  ```

- **Rationale** : hors de `data/corpus/`, rien n'est lu par `data:publish` ni par le site
  (FR-011, FR-042) ; YAML comme le reste du corpus, relu en pull request de données, édité sans
  perte de mise en forme ; un fichier de preuves par personnalité suit la convention des
  positions et limite les conflits. Les comptes rendus Markdown suivent la pratique de
  `data/relectures/`.
- **Alternatives considered** : `data/corpus/recherche/` (brouille la frontière « corpus =
  source du site ») ; JSON (moins lisible en revue, commentaires impossibles) ; preuves dans
  `positions/` (contraire à FR-042, incompatibilité 2 de la spec) ; une base SQLite (service
  local superflu, non relisible en PR).

## R4. Sources des personnalités hors liste publiée (réutilisation du registre)

Constat : une source porte `candidates: [<id>]` ; `REF-EXISTS` exige que ces identifiants
figurent dans `candidates.yaml` et `FR-013` refuse une liste vide. Une source sur une
personnalité absente de la liste publiée serait donc rejetée.

- **Decision** : élargir **la seule règle `REF-EXISTS`** : un identifiant du champ `candidates`
  d'une source est accepté s'il figure dans `candidates.yaml` **ou** dans
  `data/recherche/personnalites.yaml`. Le schéma des sources, `data:source` et `FR-013` ne
  changent pas ; une telle source vit dans `sources/<personnalite-id>.yaml` (convention
  existante). `pnpm data:source fetch --candidate <personnalite-id>` fonctionne déjà : il émet
  seulement l'avertissement « candidat absent de candidates.yaml », attendu et documenté dans le
  skill.
- **Rationale** : FR-039 interdit un second registre de sources ; FR-045 limite la modification
  de code à la validation. La publication n'est pas touchée : `build.ts` ne publie que les
  sources citées par une position publiée, et aucune position ne peut viser une personnalité
  hors liste (`REF-EXISTS` sur `positions/<candidat>.yaml` reste inchangé).
- **Alternatives considered** : nouveau champ `personalities` dans le schéma des sources
  (modifie le schéma et la commande d'enregistrement) ; sources des personnalités hors liste
  non enregistrées (contraire à FR-039) ; registre de sources propre à la recherche (interdit).

## R5. Type de source existant et qualité A–D

- **Decision** : le champ `kind` d'une source garde sa sémantique (force d'engagement) ; la
  qualité `A_PRIMARY_VERIFIED`…`D_UNVERIFIED_OR_INACCESSIBLE` est portée **par la preuve**, car
  elle dépend de l'usage (une même page de presse est primaire pour un entretien reproduit
  intégralement, secondaire pour une citation rapportée). Correspondance documentée dans le
  skill : programme ou document de campagne → `programme` ; livre, plateforme écrite, site
  personnel → `livre_plateforme` ; tout le reste (entretien, discours, vidéo, compte rendu
  parlementaire, vote, article, réseau social, travail universitaire) → `declaration_vote`.
- **Rationale** : FR-015 (coexistence des deux taxonomies) ; constitution, principe I (niveaux
  publiés inchangés).
- **Alternatives considered** : étendre `EvidenceKindSchema` (toucherait la publication et la
  page Méthodologie).

## R6. Contrôle `VERIFIED_QUOTE` et vidéos

- **Decision** : une preuve `VERIFIED_QUOTE` doit viser une source du registre munie d'une
  empreinte ; cache disponible, la citation normalisée doit figurer dans le texte en cache
  (`normalize` + `findQuote` de `scripts/data/lib/text.ts`, mêmes fonctions que `FR-017`) ;
  sans cache (CI), avertissement `CACHE-MISSING` comme pour les positions. Pour une vidéo ou un
  audio, le texte enregistré est la **transcription** utilisée (`data:source fetch <url-vidéo>
  --from-file <transcription.txt>`), et la localisation est un horodatage. Une transcription
  automatique (sous-titres générés) marque la preuve `transcript: automatic` et lui interdit
  `VERIFIED_QUOTE` (elle reste `UNVERIFIED_QUOTE`, « à confirmer à l'écoute »).
- **Rationale** : SC-005 exige un texte retrouvé mot pour mot ; l'agent n'écoute pas l'audio,
  seule une transcription officielle ou humaine (compte rendu de l'Assemblée, transcription
  publiée par le média) permet une vérification honnête.
- **Alternatives considered** : exempter les horodatages du contrôle (SC-005 invérifiable) ;
  stocker les extraits dans git (le texte des sources reste hors git par convention).

## R7. Règles de validation ajoutées à `pnpm data:validate`

- **Decision** : `DataPaths` gagne `researchDir` (`data/recherche`, ou `<fixture>/recherche`) ;
  `buildContext` charge le corpus de preuves s'il existe (absent : rien à valider, les fixtures
  existantes restent conformes) dans `ctx.research` ; les erreurs Zod deviennent des violations
  `SCHEMA` comme pour le corpus. Sept règles, préfixe `RECH-`, ajoutées en fin de `RULES` (détail
  dans [contracts/validation-rules.md](./contracts/validation-rules.md)) :
  `RECH-ID`, `RECH-REF`, `RECH-STATUS`, `RECH-EVIDENCE`, `RECH-QUOTE`, `RECH-JOURNAL`,
  `RECH-SIGNAL`, plus l'élargissement de `REF-EXISTS` (R4). Une fixture de violation par règle
  (`data/fixtures/violations/RECH-*/`) est reprise automatiquement par `validate.test.ts`, et la
  fixture minimale reçoit un petit `recherche/` conforme.
- **Rationale** : FR-045, SC-009 ; même architecture que les 23 règles existantes (une règle,
  un fichier, un test, une fixture).
- **Alternatives considered** : commande séparée `data:research-validate` (hors CI existante,
  contraire à la clarification) ; JSON Schema (outillage nouveau).

## R8. Enregistrement des preuves sans nouvelle commande

- **Decision** : aucune commande d'écriture n'est ajoutée. Le sous-agent édite les YAML de
  `data/recherche/` avec les outils d'édition de fichiers (ajout en fin de liste, mise en forme
  conservée), enregistre les sources avec `pnpm data:source fetch`, recherche les doublons avec
  la recherche plein texte du dépôt, puis exécute `pnpm data:validate` avant son compte rendu.
- **Rationale** : FR-045 (seule la validation change) ; la validation joue le rôle de garde-fou
  (doublons exacts refusés, renvois vérifiés, citations contrôlées).
- **Alternatives considered** : commande `data:evidence add` (code hors périmètre admis).

## R9. Doublons (FR-034 à FR-036)

- **Decision** : deux niveaux dans `RECH-EVIDENCE`. **Erreur** : deux preuves de la même
  personnalité avec la même source et la même citation normalisée (la seconde doit devenir une
  corroboration). **Avertissement** : même personnalité, citations de mêmes mots (`sameWords`)
  sur deux sources différentes, sauf signalement `POSSIBLE_DUPLICATE` qui les cite toutes deux.
  Rien n'est jamais supprimé automatiquement.
- **Rationale** : SC-008 ; FR-036.

## R10. Écart avec une position existante (FR-044) et avec la liste publiée (FR-012)

- **Decision** : `RECH-SIGNAL` exige un signalement (ouvert ou traité) :
  - `POSITION_REVIEW` pour toute preuve rattachée à une question dont la qualification
    (`EXPLICIT_SUPPORT`/`QUALIFIED_SUPPORT` vs `EXPLICIT_OPPOSITION`/`QUALIFIED_OPPOSITION`)
    est de signe contraire à la valeur d'une position existante (`reviewed` ou `draft`) du même
    candidat sur la même question ;
  - `CANDIDATE_STATUS` lorsque le statut courant d'une personnalité diffère de la liste publiée :
    personne de `candidates.yaml` dont le statut courant n'est pas l'équivalent
    (`declared` ↔ `DECLARED`, `withdrawn` ↔ `WITHDRAWN`), ou personnalité hors liste au statut
    courant `DECLARED`.
  Les autres écarts (position `unknown`, nuances) relèvent du jugement de l'agent, guidé par le
  skill.
- **Rationale** : la position, comme la liste publiée, reste la seule à faire foi ; le
  signalement trace la demande de revue humaine sans rien modifier.

## R11. `NOT_FOUND` et « recherche significative »

- **Decision** : `NOT_FOUND` est une **lacune** du journal (pas une preuve) ; `RECH-JOURNAL`
  l'accepte seulement si le journal compte au moins 5 requêtes et au moins 3 catégories de
  sources explorées, et si une date de recherche est portée. Un journal déclaré exhaustif ne
  peut pas avoir de catégorie non explorée (FR-030).
- **Rationale** : rend FR-038 contrôlable sans prétendre mesurer la qualité de la recherche ;
  le skill fixe l'exigence de fond (passes de recherche).

## R12. Gouvernance des pull requests

- **Decision** : l'installation (règles, fixtures, agent, skill, documentation) forme une pull
  request de **code** ; les preuves et sources réelles produites par le test non destructif
  forment, si adrien le demande, une pull request de **données** distincte. Le test n'est ni
  commité ni poussé sans demande (spec, hypothèses).
- **Rationale** : constitution, « Flux de travail et portes de qualité » (données et code en
  PR distinctes) ; FR-050.

## R13. Test non destructif retenu

- **Decision** : personnalité `bruno-retailleau` (dans la liste publiée, sources déjà
  enregistrées), thème `immigration` (18 questions), mode « recherche sur une personnalité »
  limitée à ce thème. Contrôle d'intégrité par empreintes : `shasum` de
  `data/corpus/{candidates.yaml,themes.yaml,questions/,positions/}` avant et après (SC-003).
- **Rationale** : exemple même de la demande d'adrien ; positions existantes sur le thème qui
  permettent d'exercer `POSITION_REVIEW` si besoin.
