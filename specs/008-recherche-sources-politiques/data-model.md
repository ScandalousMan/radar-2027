# Modèle de données — 008 Dispositif de recherche de sources politiques

**Date** : 2026-11-22 · **Spec** : [spec.md](./spec.md) · **Décisions** : [research.md](./research.md)

Le corpus de preuves vit sous `data/recherche/` (R3). Il n'est lu ni par `data:publish` ni par
le site ; il n'entre dans aucun score. Format exact des fichiers et exemples :
[contracts/research-files.md](./contracts/research-files.md). Règles de contrôle :
[contracts/validation-rules.md](./contracts/validation-rules.md).

Conventions communes, reprises de `scripts/data/lib/schema/common.ts` :

- identifiants : kebab-case ASCII (`IdSchema`) ;
- `Day` : `YYYY-MM-DD` ; `DateWithPrecision` : `{ date, precision: day|month|year }` ;
- clés en anglais `camelCase`, valeurs des listes fermées en anglais `UPPER_SNAKE_CASE`
  (codes demandés par adrien), textes libres en français ;
- objets stricts : toute clé inconnue est une violation `SCHEMA`.

## Vue d'ensemble

```text
candidates.yaml (inchangé) ──id réutilisé──▶ Personnalité ◀──personality── Preuve ──source──▶ Source (registre existant)
                                               │ statuses[].evidence ─────────▲    │ theme/question ─▶ thèmes, questions (inchangés)
                                               │                              │    │ journal ─▶ Journal ◀── NOT_FOUND, lacunes
                                               └───────── Signalement ────────┴────┴─ position ─▶ positions (inchangées)
```

## 1. Personnalité suivie — `personnalites.yaml`

| Champ | Type | Obl. | Règle |
|---|---|---|---|
| `id` | Id | oui | unique ; **égal à l'identifiant de `candidates.yaml`** si la personne y figure (FR-011, FR-040) ; sinon `prenom-nom` |
| `name` | texte | oui | nom d'usage complet |
| `party` | texte | oui | parti ou mouvement à la date de dernière mise à jour ; `""` si aucun |
| `aliases` | texte[] | non | variantes de nom utiles à la recherche et au repérage des homonymes |
| `statuses` | StatutCandidature[] | oui, ≥ 1 | historique ordonné par `at` croissant ; jamais réécrit, seulement complété (FR-009) |
| `createdAt`, `updatedAt` | Day | oui | `updatedAt ≥ createdAt` |

Dérivés (non stockés) : **listée** = `id` présent dans `candidates.yaml` ; **statut courant** =
dernier élément de `statuses`.

### 1.1 Statut de candidature (élément de `statuses`)

| Champ | Type | Obl. | Règle |
|---|---|---|---|
| `status` | enum | oui | `DECLARED`, `INTENTION_EXPRESSED`, `POTENTIAL`, `ATTEMPTED`, `WITHDRAWN`, `DEFEATED_IN_SELECTION_PROCESS`, `REPORTED_UNCONFIRMED`, `NOT_A_CANDIDATE` (FR-008) |
| `at` | DateWithPrecision | oui | date d'effet (date des propos ou de l'événement) |
| `observedAt` | Day | oui | date de constatation par la recherche |
| `evidence` | Id[] | oui, ≥ 1 | preuves de type `CANDIDACY` de la même personnalité |
| `note` | texte | non | contexte (procédure de désignation, motif du retrait…) |

Contraintes (`RECH-STATUS`) :

- `DECLARED` et `INTENTION_EXPRESSED` exigent au moins une preuve d'attribution
  `PERSONAL_DIRECT` ou `PERSONAL_DOCUMENT` (FR-010) ;
- une preuve dont l'attribution est `THIRD_PARTY_ATTRIBUTION` ou `UNKNOWN_ATTRIBUTION` ne peut
  justifier qu'un statut `REPORTED_UNCONFIRMED`, `POTENTIAL` ou `NOT_A_CANDIDATE` ;
- statut courant différent de la liste publiée → signalement `CANDIDATE_STATUS` requis
  (FR-012, R10).

Transitions : toutes sont permises (renoncement puis nouvelle annonce, échec à une investiture
puis candidature indépendante…) ; seule l'**ajout** en fin d'historique est admis. Une
personnalité n'est jamais retirée du registre.

## 2. Preuve — `preuves/<personnalite-id>.yaml`

Enregistrement d'un propos, document ou acte d'une personnalité. Le nom du fichier est
l'identifiant de la personnalité (comme `positions/<candidat>.yaml`).

### 2.1 Identification et rattachement

| Champ | Type | Obl. | Règle |
|---|---|---|---|
| `id` | Id | oui | unique dans tout `preuves/` ; préfixé par l'identifiant de la personnalité (`bruno-retailleau-immigration-001`) ; stable, jamais réattribué (FR-036) |
| `personality` | Id | oui | égal au nom du fichier ; existe dans `personnalites.yaml` |
| `kind` | enum | oui | `POSITION` (propos sur une politique) ou `CANDIDACY` (preuve d'un statut de candidature) |
| `theme` | Id | si `POSITION` | thème existant de `themes.yaml` (FR-024) ; interdit pour `CANDIDACY` |
| `question` | Id | non | question existante dont `theme` est l'un des thèmes ; une question retirée reste admise (preuve historique) |
| `qualification` | enum | si `question` | `EXPLICIT_SUPPORT`, `EXPLICIT_OPPOSITION`, `QUALIFIED_SUPPORT`, `QUALIFIED_OPPOSITION`, `CONDITIONAL_POSITION`, `AMBIGUOUS`, `CONTRADICTORY_EVIDENCE`, `NO_DIRECT_EVIDENCE` ; relative à l'**énoncé** de la question (FR-025) ; interdite sans `question` |
| `candidacyStatus` | enum | non | statut de candidature à la date des propos, mêmes valeurs qu'en 1.1 |
| `journal` | Id | oui | journal de la mission qui a créé la preuve |

### 2.2 Contenu et vérification de la citation

| Champ | Type | Obl. | Règle |
|---|---|---|---|
| `quoteStatus` | enum | oui | `VERIFIED_QUOTE`, `UNVERIFIED_QUOTE`, `PARAPHRASE`, `SOURCE_INACCESSIBLE` (FR-019) |
| `quote` | texte | si `VERIFIED_QUOTE`/`UNVERIFIED_QUOTE` | texte exact, en français d'origine, sans coupe qui change le sens ; ≤ `maxQuoteLength` de la gouvernance |
| `paraphrase` | texte | si `PARAPHRASE` | reformulation, jamais entre guillemets ; interdite avec `VERIFIED_QUOTE` |
| `speaker` | texte | oui | auteur effectif des propos (peut différer de la personnalité : porte-parole, parti) |
| `transcript` | enum | non | `official`, `manual`, `automatic` ; `automatic` interdit `VERIFIED_QUOTE` (R6) |
| `context` | texte | oui | contexte nécessaire à la compréhension (émission, débat, question posée, réserves) |
| `verificationNotes` | texte | non | ce qui a été vérifié, comment, et ce qui ne l'a pas été |

### 2.3 Source et localisation

| Champ | Type | Obl. | Règle |
|---|---|---|---|
| `source` | Id | oui sauf cas ci-dessous | source du registre existant (`data/corpus/sources/`) ; fournit URL, titre, type, date de publication, empreinte |
| `unregisteredSource` | `{ url, title, publisher, reason }` | si pas de `source` | admis seulement avec `quoteStatus: SOURCE_INACCESSIBLE` et `sourceQuality: D_UNVERIFIED_OR_INACCESSIBLE` (paywall, authentification, page retirée) ; `reason` décrit la limitation (FR-016) |
| `publisher` | texte | oui | média ou institution |
| `locator` | `{ kind, value }` | oui sauf `SOURCE_INACCESSIBLE` | `kind` ∈ `timestamp`, `page`, `article`, `amendment`, `paragraph`, `passage` ; `timestamp` au format `HH:MM:SS` ou `MM:SS` (FR-018) |
| `sourceQuality` | enum | oui | `A_PRIMARY_VERIFIED`, `B_RELIABLE_SECONDARY`, `C_CONTEXTUAL_ONLY`, `D_UNVERIFIED_OR_INACCESSIBLE` (FR-015) |

Le **type de source** existant (`kind` de la source : programme, livre ou plateforme,
déclaration ou vote) est lu dans le registre et n'est pas recopié (R5).

### 2.4 Attribution et appréciations séparées

| Champ | Type | Obl. | Règle |
|---|---|---|---|
| `attribution` | enum | oui | `PERSONAL_DIRECT`, `PERSONAL_DOCUMENT`, `PERSONAL_ACTION`, `PARTY_POSITION`, `PARLIAMENTARY_GROUP_POSITION`, `GOVERNMENT_POSITION`, `COALITION_POSITION`, `THIRD_PARTY_ATTRIBUTION`, `UNKNOWN_ATTRIBUTION` (FR-021) |
| `attributionConfidence` | enum | oui | `HIGH`, `MEDIUM`, `LOW`, `UNCONFIRMED` |
| `actionScope` | texte | si `PERSONAL_ACTION` | portée exacte du vote, de la signature ou de l'amendement : texte visé, procédure, lecture (FR-022) |
| `temporalRelevance` | enum | oui | `CURRENT` (propos de moins de 12 mois ou corroboré récemment), `DATED` (plus ancien, non corroboré), `HISTORICAL` (période révolue : autre élection, autre fonction), `UNDETERMINED` (date inconnue) (FR-032) |
| `period` | texte | non | période à laquelle la position semble correspondre (« campagne 2022 », « depuis septembre 2026 ») |
| `rationale` | map | non | justification en clair de chaque appréciation non évidente, clés `sourceQuality`, `quote`, `attribution`, `interpretation`, `temporalRelevance` (FR-027) |

Contraintes de cohérence (`RECH-EVIDENCE`) :

- `VERIFIED_QUOTE` exige `source` (registre), `locator` et `sourceQuality` `A_PRIMARY_VERIFIED`
  ou `B_RELIABLE_SECONDARY` (une citation vérifiée mot pour mot dans un article reproduisant un
  entretien intégral) ;
- `A_PRIMARY_VERIFIED` interdit `UNVERIFIED_QUOTE` et `SOURCE_INACCESSIBLE` ;
- si `speaker` diffère du nom de la personnalité et de ses `aliases` (aux accents et à la casse
  près), l'attribution ne peut être ni `PERSONAL_DIRECT` ni `PERSONAL_DOCUMENT` (propos d'un
  porte-parole, d'un parti, d'un homonyme : cas limite de la spec) ;
- `temporalRelevance: UNDETERMINED` si et seulement si `statedAt: unknown`.

### 2.5 Dates

| Champ | Type | Obl. | Règle |
|---|---|---|---|
| `statedAt` | DateWithPrecision ou `unknown` | oui | date des propos ; `unknown` explicite, jamais remplacée par la date de publication (cas limite) |
| `publishedAt` | DateWithPrecision | non | seulement si différente de celle de la source ; sinon lue dans le registre |
| `researchedAt` | Day | oui | date de la recherche |
| `verifiedAt` | Day | oui | date de dernière vérification (FR-031) |
| `createdAt`, `updatedAt` | Day | oui | `createdAt ≤ updatedAt` ; `updatedAt > createdAt` exige une entrée d'`history` ou de `corroborations` datée de `updatedAt` |

`statedAt ≤ publishedAt ≤ verifiedAt` lorsque les dates sont connues (comparaison au préfixe de
précision, comme `FR-013`).

### 2.6 Corroborations et historique

| Champ | Type | Obl. | Règle |
|---|---|---|---|
| `corroborations` | `{ source, locator?, quoteStatus, verifiedAt, journal, note? }[]` | non | sources supplémentaires confirmant la **même** citation (FR-035) ; `source` du registre, différente de `source` et des autres corroborations |
| `history` | `{ at, field, previous, reason, journal }[]` | non | toute correction conserve la valeur antérieure (sérialisée en texte), sa date et son motif (FR-043) ; jamais supprimé |

Une preuve n'est jamais supprimée : une preuve reconnue fausse est requalifiée (par exemple
`quoteStatus: UNVERIFIED_QUOTE`, `attributionConfidence: UNCONFIRMED`) avec une entrée
d'historique.

## 3. Journal de recherche — `journaux/<journal-id>.yaml` (+ `.md`)

`journal-id` : `YYYY-MM-DD-<slug>` (date de début de mission).

| Champ | Type | Obl. | Règle |
|---|---|---|---|
| `id` | Id | oui | égal au nom du fichier |
| `mode` | enum | oui | `PERSONALITY`, `COMPARISON`, `THEMATIC`, `GLOBAL_ENRICHMENT`, `ADVERSARIAL_AUDIT` (FR-047) |
| `author` | Id | oui | contributeur (`contributors.yaml`), `claude` pour l'agent |
| `model` | texte | non | modèle ayant mené la mission (`opus` pour le sous-agent), pour la traçabilité ; aucun coût à journaliser (aucune API appelée) |
| `request` | texte | oui | demande d'adrien, reformulée fidèlement |
| `startedAt`, `completedAt` | Day | `completedAt` si `state: completed` | |
| `state` | enum | oui | `completed`, `interrupted` (limite de contexte, source indisponible) |
| `interruption` | texte | si `interrupted` | ce qui n'a pas été exploré |
| `scope` | `{ personalities: Id[], themes: Id[], questions: Id[] }` | oui | renvois existants |
| `queries` | `{ at: Day, query, category, tool? }[]` | oui | requêtes effectivement lancées (FR-029) |
| `categoriesExplored` | enum[] | oui | catégories de FR-028 (liste en 3.1) |
| `categoriesNotExplored` | `{ category, reason }[]` | non | catégories importantes non consultées (FR-030) |
| `exhaustive` | booléen | oui | `true` interdit si `categoriesNotExplored` non vide ou `state: interrupted` |
| `sourcesConsulted` | `{ url, title, outcome, reason?, source? }[]` | oui | `outcome` ∈ `retained`, `rejected`, `inaccessible` ; `source` = identifiant du registre si `retained` |
| `evidenceAdded`, `evidenceCorroborated`, `evidenceCorrected` | Id[] | non | preuves existantes |
| `duplicatesAvoided` | `{ evidence, note }[]` | non | |
| `verified`, `toVerify` | texte[] | non | éléments vérifiés / restant à vérifier |
| `contradictions` | `{ evidence: Id[], note }[]` | non | |
| `gaps` | Lacune[] | non | voir 3.2 |
| `signals` | Id[] | non | signalements produits |

Le **compte rendu** `journaux/<journal-id>.md` est obligatoire pour un journal `completed` ou
`interrupted` ; il contient les 13 rubriques numérotées de la demande (titres de niveau 2,
gabarit dans [contracts/subagent-and-skill.md](./contracts/subagent-and-skill.md)).

### 3.1 Catégories de sources

`PERSONAL_SITE`, `CAMPAIGN_SITE`, `PARTY_SITE`, `ASSEMBLEE_NATIONALE`, `SENAT`,
`PARLIAMENTARY_ARCHIVES`, `EUROPEAN_PARLIAMENT`, `GOVERNMENT`, `SPEECHES_PRESS_CONFERENCES`,
`FULL_INTERVIEWS`, `TV_RADIO_DEBATES`, `ORIGINAL_VIDEOS`, `SOCIAL_MEDIA`,
`HISTORICAL_ARCHIVES`, `NATIONAL_MEDIA`, `REGIONAL_MEDIA`, `PRESS_AGENCIES`,
`SPECIALIZED_PUBLICATIONS`, `ACADEMIC`, `FACT_CHECKING`, `EXISTING_CORPUS`.

### 3.2 Lacune (élément de `gaps`)

| Champ | Type | Obl. | Règle |
|---|---|---|---|
| `kind` | enum | oui | `NO_PERSONAL_POSITION`, `PARTY_POSITION_ONLY`, `HISTORICAL_ONLY`, `PRIMARY_INACCESSIBLE`, `REPORTED_UNVERIFIABLE`, `CANDIDACY_UNCERTAIN`, `CONTRADICTORY_SOURCES`, `UNKNOWN_DATE`, `NO_OPPOSING_EVIDENCE`, `NOT_FOUND` (FR-037) |
| `personality` | Id | oui | |
| `theme`, `question` | Id | non | |
| `evidence` | Id[] | non | preuves concernées |
| `note` | texte | oui | description factuelle ; jamais une position supposée (FR-038) |

`NOT_FOUND` exige un journal d'au moins 5 requêtes sur au moins 3 catégories explorées (R11).

## 4. Signalement — `signalements.yaml`

| Champ | Type | Obl. | Règle |
|---|---|---|---|
| `id` | Id | oui | unique ; `sig-YYYY-MM-DD-<slug>` |
| `kind` | enum | oui | `POSITION_REVIEW` (preuve susceptible de modifier une position, FR-044), `QUOTE_DISCREPANCY` (citation d'une position non retrouvée telle quelle, audit US4), `CANDIDATE_STATUS` (FR-012), `POSSIBLE_DUPLICATE` (FR-036), `UNRESOLVED_CONTRADICTION` (FR-033) |
| `raisedAt` | Day | oui | |
| `journal` | Id | oui | mission d'origine |
| `personality` | Id | oui | |
| `position` | `{ candidate, question }` | si `POSITION_REVIEW`/`QUOTE_DISCREPANCY` | position existante |
| `evidence` | Id[] | oui sauf `QUOTE_DISCREPANCY` (≥ 1) ; ≥ 2 pour `POSSIBLE_DUPLICATE` | |
| `reason` | texte | oui | motif, avec le passage exact en cause |
| `state` | enum | oui | `open`, `resolved` |
| `resolution` | `{ at, by, decision }` | si `resolved` | `by` contributeur humain (≠ `claude`) ; la décision est appliquée, le cas échéant, par une PR de données distincte |

Un signalement ne modifie rien par lui-même. Le sous-agent ne crée que des signalements
`open` ; seul un humain les passe à `resolved`.

## 5. Entités existantes réutilisées (inchangées)

- **Source** (`data/corpus/sources/*.yaml`) : schéma inchangé ; le champ `candidates` accepte
  désormais aussi un identifiant de `personnalites.yaml` (R4).
- **Candidat** (`candidates.yaml`), **thème**, **question**, **position** : lus seulement ;
  aucune mission ne les modifie (FR-046, SC-003).
- **Contributeur** (`contributors.yaml`) : auteur des journaux, auteur des résolutions.
