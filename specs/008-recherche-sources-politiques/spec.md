# Feature Specification: Dispositif de recherche de sources politiques (présidentielle 2027)

**Feature Branch**: `008-recherche-sources-politiques`

**Created**: 2026-11-22

**Status**: Draft

**Input**: User description: "Mise en place d'un dispositif de recherche politique française pour la présidentielle 2027 : un sous-agent spécialisé `french-political-source-researcher` (modèle opus), lançable manuellement, et un skill méthodologique `french-political-source-research`, installés au niveau du projet, pour rechercher, vérifier et enrichir progressivement un corpus de preuves (citations, sources, statuts de candidature) sans API payante ni service externe, en réutilisant les structures de données existantes et sans toucher aux questions ni aux évaluations des candidats." (description complète en 20 sections fournie par adrien le 2026-11-22.)

## Contexte : existant constaté lors de l'exploration

Cette section consigne l'état du dépôt le 2026-11-22, que la fonctionnalité doit réutiliser.

- **Candidats** : `data/corpus/candidates.yaml`, 18 personnes. Statuts possibles : `declared` et
  `withdrawn` seulement, avec date, source de statut, critère d'inclusion et historique
  (`history`). Le critère `declaration-publique-personnelle` (gouvernance, FR-006 de la spec 002)
  exclut explicitement les candidatures pressenties, rapportées par des tiers ou en cours de
  désignation. Ce fichier alimente directement les jeux publiés.
- **Sources** : `data/corpus/sources/<candidat>.yaml` et `commun.yaml`. Chaque source a un
  identifiant stable, une URL, un titre, un type (`programme`, `livre_plateforme`,
  `declaration_vote`), une date de publication avec précision, une date de consultation et une
  empreinte du texte. Le texte vit dans un cache local hors git. Les sources sont enregistrées
  par `pnpm data:source fetch`.
- **Positions** : `data/corpus/positions/<candidat>.yaml`, au plus une par candidat et par
  question, valeur de −2 à +2, citation, justification, statut `draft` / `reviewed` /
  `contested`, auteur et relecteur distincts. C'est l'**évaluation** du candidat : elle entre
  dans le score une fois relue.
- **Questions et thèmes** : `data/corpus/questions/<thème>.yaml` (identifiant, énoncé, thèmes,
  enjeu, polarité `+`/`-`, statut, dimension éventuelle) et `data/corpus/themes.yaml`
  (18 thèmes, axe `negative`/`positive`).
- **Traçabilité** : relectures dans `data/relectures/`, journaux de campagne dans
  `data/campagnes/<thème>/` (tableaux origine / URL / décision / motif), provenance de
  l'extraction dans `data/extractions/`, versions publiées immuables, historique git.
- **Outillage Claude Code du projet** : skills Spec Kit dans `.claude/skills/`, et deux fichiers
  **non suivis par git** créés le 2026-11-14 : un sous-agent `political-source-researcher`
  (modèle sonnet, en anglais) et un skill `french-political-source-research` (en anglais,
  méthodologie en 14 sections, statuts `SUPPORTED` / `PARTIALLY_SUPPORTED` / `CONTRADICTED`…,
  niveaux A à D différents de ceux demandés ici).
- **Pratique établie** : les positions sont extraites en session par l'agent, jamais par
  l'extraction payante `data:extract`.

### Incompatibilités identifiées

1. **Périmètre des personnalités** : les statuts demandés (`POTENTIAL`, `REPORTED_UNCONFIRMED`,
   `DEFEATED_IN_SELECTION_PROCESS`…) sont incompatibles avec le critère d'inclusion publié et
   avec le schéma de `candidates.yaml`, qui alimente le site.
2. **Granularité** : une position est une évaluation unique par question ; le corpus de preuves
   demandé admet plusieurs preuves par personnalité et par question, contradictoires au besoin,
   avec des qualifications qui n'existent pas dans les positions.
3. **Taxonomie de qualité** : le type de source existant (programme, livre, déclaration) mesure
   la force d'engagement, pas la qualité A/B/C/D demandée ; les deux coexistent.
4. **Composants existants** : le skill porte déjà le nom demandé avec une autre méthodologie, et
   un second agent au rôle voisin existe.

## Clarifications

### Session 2026-11-22

- Q: Où enregistrer les personnalités hors liste publiée et leurs huit statuts ? → A : registre
  de recherche distinct sous `data/`, non publié, réutilisant les identifiants des candidats ;
  `candidates.yaml` inchangé (FR-011, résout l'incompatibilité 1).
- Q: Comment contrôler le format des preuves ? → A : règle ajoutée à la validation existante du
  corpus, en intégration continue, avec tests (FR-045).
- Q: Que faire de l'ancien sous-agent `political-source-researcher` et de l'ancien skill ? → A :
  supprimer l'ancien sous-agent ; réécrire le skill en français en reprenant ce qui reste utile
  (FR-006, résout l'incompatibilité 4).
- Les incompatibilités 2 et 3 sont résolues sans question : le corpus de preuves est une couche
  distincte des positions (FR-042) et la qualité A–D s'ajoute au type de source existant sans le
  remplacer (FR-015).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Lancer explicitement le chercheur sur une personnalité et un thème (Priority: P1)

adrien demande, en langage naturel, « Utilise le sous-agent french-political-source-researcher
pour rechercher les positions de Bruno Retailleau sur l'immigration ». Le sous-agent démarre
avec la méthodologie du skill déjà chargée, mène une recherche approfondie en priorité sur les
sources primaires, enregistre chaque preuve trouvée avec ses qualifications dans le corpus de
preuves du projet, et rend un compte rendu vérifiable.

**Why this priority**: c'est la raison d'être du dispositif ; sans lancement explicite et sans
preuves correctement qualifiées, rien d'autre n'a de valeur.

**Independent Test**: lancer la demande ci-dessus sur une personnalité et un thème ; vérifier
que le sous-agent nommé intervient, que chaque preuve enregistrée porte source, citation, dates,
attribution et statut de vérification, et que les fichiers de questions, de positions et de
candidats sont inchangés.

**Acceptance Scenarios**:

1. **Given** le dispositif installé, **When** adrien nomme le sous-agent dans sa demande,
   **Then** c'est ce sous-agent qui traite la demande, avec le skill méthodologique préchargé.
2. **Given** une recherche sur une personnalité et un thème, **When** le sous-agent trouve une
   déclaration dans un entretien vidéo original, **Then** la preuve est enregistrée avec la
   citation exacte, l'horodatage, la date des propos, la date de publication, la date de
   vérification, l'attribution `PERSONAL_DIRECT`, la qualité de source et le statut
   `VERIFIED_QUOTE`.
3. **Given** une citation trouvée seulement dans un article de presse dont l'original est
   introuvable, **When** elle est enregistrée, **Then** elle porte `UNVERIFIED_QUOTE` (ou
   `PARAPHRASE` si l'article ne cite pas entre guillemets), une qualité `B_RELIABLE_SECONDARY`
   au mieux, et la limitation est décrite.
4. **Given** une demande adressée à l'assistant principal sans nommer le sous-agent (par
   exemple corriger un composant), **When** elle est traitée, **Then** le sous-agent
   n'intervient pas.
5. **Given** une recherche infructueuse après les passes de recherche prévues, **When** le
   sous-agent conclut, **Then** il consigne `NOT_FOUND` avec le journal daté des recherches
   effectuées, sans position supposée.

---

### User Story 2 - Utiliser la méthodologie sans le sous-agent (Priority: P1)

adrien sélectionne manuellement le skill `french-political-source-research` dans l'interface
Claude Code pour qu'une session ordinaire applique les mêmes règles de recherche, de
vérification, de qualification et d'enregistrement.

**Why this priority**: la méthodologie doit exister indépendamment de la description du
sous-agent ; elle sert aussi aux sessions de rédaction et de relecture déjà pratiquées.

**Independent Test**: invoquer le skill par son nom dans une session sans sous-agent ; vérifier
que ses règles (hiérarchie des sources, statuts, format d'enregistrement, compte rendu) sont
disponibles et complètes.

**Acceptance Scenarios**:

1. **Given** une session Claude Code ouverte dans le dépôt, **When** adrien liste ou invoque les
   skills, **Then** `french-political-source-research` apparaît et se charge.
2. **Given** le skill chargé, **When** on y cherche la règle applicable à un vote de groupe
   parlementaire, **Then** le skill indique l'attribution `PARLIAMENTARY_GROUP_POSITION` ou
   `PERSONAL_ACTION` et interdit d'en déduire l'argumentaire individuel.

---

### User Story 3 - Suivre le statut de candidature de toutes les personnalités pertinentes (Priority: P2)

Le corpus de preuves suit toutes les personnalités ayant exprimé une ambition présidentielle
pour 2027, y compris celles qui ont renoncé, ont échoué à une investiture ou ne sont citées que
par des tiers, avec un historique daté de leurs statuts relié chacun à une preuve.

**Why this priority**: le périmètre élargi est demandé explicitement, mais il ne doit pas
modifier la liste des candidats publiée ; il vient après la capacité de recherche elle-même.

**Independent Test**: enregistrer le statut d'une personnalité absente de la liste publiée
(par exemple une candidature rapportée par la presse) ; vérifier que le statut est daté, relié
à une preuve, qualifié `REPORTED_UNCONFIRMED`, et que la liste publiée des candidats est
inchangée.

**Acceptance Scenarios**:

1. **Given** une personnalité dont seule la presse rapporte l'intention, **When** son statut est
   enregistré, **Then** il vaut `REPORTED_UNCONFIRMED`, jamais `DECLARED`.
2. **Given** une personnalité passée de `DECLARED` à `WITHDRAWN`, **When** le nouveau statut est
   enregistré, **Then** l'ancien statut reste dans l'historique avec sa date et sa preuve, et la
   personnalité reste dans le corpus.
3. **Given** un changement de statut d'une personne figurant dans la liste publiée des
   candidats, **When** il est constaté, **Then** il fait l'objet d'un signalement pour revue
   humaine, sans modification automatique de cette liste.

---

### User Story 4 - Auditer de façon adversariale les preuves et signaler les évaluations à revoir (Priority: P2)

adrien demande un audit adversarial : le sous-agent revérifie indépendamment des citations
existantes (texte, attribution, actualité, qualité, interprétation), corrige ou requalifie les
preuves sans effacer leur historique, et produit des signalements lorsque de nouvelles preuves
pourraient modifier une position existante.

**Why this priority**: la confiance dans le corpus repose sur la revérification ; elle suppose
d'abord un corpus de preuves alimenté (US1).

**Independent Test**: lancer un audit sur un petit échantillon de positions existantes ;
vérifier que chaque constat cite le passage et l'URL, qu'aucune position n'est modifiée et que
les écarts produisent un signalement daté.

**Acceptance Scenarios**:

1. **Given** une position relue dont la citation ne figure pas mot pour mot dans la source,
   **When** l'audit la revérifie, **Then** un signalement décrit l'écart avec le passage exact,
   et la position reste inchangée.
2. **Given** une preuve plus récente contredisant une position relue, **When** elle est
   enregistrée, **Then** les deux preuves sont conservées avec leur chronologie et un
   signalement pour revue humaine est produit, sans recalcul de score.

---

### User Story 5 - Comparer, enrichir par thème et auditer globalement (Priority: P3)

adrien lance une comparaison de plusieurs personnalités sur un même sujet avec des critères de
preuve identiques, une recherche thématique (positions favorables et défavorables) ou un
enrichissement global (lacunes, recherches complémentaires, déduplication, mise à jour).

**Why this priority**: ces modes réutilisent la capacité de base sur un périmètre plus large et
sont lancés ponctuellement.

**Independent Test**: lancer une comparaison de deux personnalités sur une question ; vérifier
que les mêmes catégories de sources ont été explorées pour chacune et que le compte rendu le
montre.

**Acceptance Scenarios**:

1. **Given** une comparaison sur une question, **When** elle se termine, **Then** le compte rendu
   indique pour chaque personnalité les catégories de sources explorées et les lacunes, selon
   les mêmes critères.
2. **Given** une recherche thématique, **When** elle se termine, **Then** elle a cherché des
   preuves dans les deux sens de la polarité des questions du thème, et le dit.

---

### Edge Cases

- Source primaire derrière un paywall ou une authentification : elle n'est pas contournée ; la
  preuve est qualifiée `SOURCE_INACCESSIBLE` ou repose sur une source secondaire qualifiée, avec
  la limitation décrite.
- Citation trouvée sous deux formulations légèrement différentes dans deux médias : la forme de
  la source primaire prime ; à défaut, les deux variantes sont signalées et la citation reste
  `UNVERIFIED_QUOTE`.
- Vidéo sans transcription fiable (sous-titres automatiques) : l'horodatage est fourni et la
  citation est marquée « transcription automatique, à confirmer à l'écoute ».
- Date des propos inconnue (seule la date de publication est connue) : la date inconnue est
  explicite, jamais remplacée par la date de publication.
- Homonymes ou propos d'un proche (porte-parole, parti) présentés comme ceux de la
  personnalité : attribution `THIRD_PARTY_ATTRIBUTION` ou position collective, jamais
  `PERSONAL_DIRECT`.
- Preuve déjà présente dans le corpus (même source, même passage) : pas de nouvel
  enregistrement ; une nouvelle source qui confirme la même citation est ajoutée comme
  corroboration.
- Deux enregistrements semblables mais non identiques : aucun n'est supprimé ; le doublon
  possible est signalé.
- Personnalité ayant renoncé puis annoncé de nouveau sa candidature : les trois statuts restent
  dans l'historique, chacun daté et prouvé.
- Question retirée ou thème sans question correspondante : la preuve est rattachée au thème
  seul, sans question et sans création d'axe nouveau.
- Recherche interrompue (limite de contexte, source indisponible) : le compte rendu dit ce qui
  n'a pas été exploré et ne prétend pas à l'exhaustivité.

## Requirements *(mandatory)*

### Functional Requirements

#### Composants et installation

- **FR-001**: Le dépôt MUST contenir, au niveau du projet et non dans la configuration
  utilisateur globale, un sous-agent de nom technique `french-political-source-researcher`,
  de nom affiché « French Political Source Researcher », de modèle `opus`, avec la description
  fournie par adrien (section 3 de la demande) et un en-tête de configuration valide.
- **FR-002**: Le sous-agent MUST précharger le skill `french-political-source-research` par le
  mécanisme de skills de son en-tête, et MUST NOT restreindre les outils de recherche
  disponibles dans la session principale.
- **FR-003**: Le sous-agent MUST n'intervenir que sur demande explicite le nommant ; sa
  description MUST le dire, afin qu'il ne se substitue pas à l'assistant principal.
- **FR-004**: Le dépôt MUST contenir, au niveau du projet, un skill
  `french-political-source-research` sélectionnable manuellement, qui porte à lui seul toute la
  méthodologie (FR-007 à FR-046) sans dépendre de la description du sous-agent.
- **FR-005**: Le skill et le sous-agent MUST être rédigés en français (langue de travail du
  projet) ; les codes de statut restent ceux, en anglais, demandés par adrien.
- **FR-006**: À l'installation, le sous-agent existant `political-source-researcher` MUST être
  supprimé (doublon du nouveau, fichier jamais suivi par git), et l'ancienne version du skill
  MUST être remplacée par une réécriture en français qui reprend ce qu'elle a d'utile (passes
  de recherche, précision des politiques, indépendance des sources). Un seul sous-agent de
  recherche politique subsiste. *(Tranché par adrien le 2026-11-22.)*

#### Périmètre des personnalités et statuts de candidature

- **FR-007**: Le corpus de preuves MUST pouvoir suivre toute personnalité française ayant
  exprimé ou s'étant vu prêter une ambition présidentielle pour 2027, y compris hors de la liste
  publiée des candidats.
- **FR-008**: Chaque statut de candidature MUST prendre l'une des valeurs `DECLARED`,
  `INTENTION_EXPRESSED`, `POTENTIAL`, `ATTEMPTED`, `WITHDRAWN`,
  `DEFEATED_IN_SELECTION_PROCESS`, `REPORTED_UNCONFIRMED`, `NOT_A_CANDIDATE`, être daté et
  relié à au moins une preuve.
- **FR-009**: L'historique des statuts MUST être conservé ; une personnalité ayant renoncé MUST
  rester dans le corpus.
- **FR-010**: Une candidature rapportée par des tiers ou une hypothèse journalistique MUST NOT
  être qualifiée `DECLARED` ni `INTENTION_EXPRESSED` sans propos personnels de l'intéressé.
- **FR-011**: Les personnalités suivies et leurs statuts MUST être enregistrés dans un registre
  de recherche distinct, sous `data/`, jamais publié, qui réutilise les identifiants de la liste
  des candidats pour les personnes qui y figurent ; la liste publiée des candidats reste la
  seule source du site et MUST rester inchangée. Ce registre complète la liste publiée sans la
  concurrencer : il ne sert ni au score ni à la publication. *(Tranché par adrien le
  2026-11-22.)*
- **FR-012**: Un statut constaté différent de celui de la liste publiée des candidats MUST
  produire un signalement pour revue humaine et MUST NOT modifier cette liste automatiquement.

#### Hiérarchie et qualité des sources

- **FR-013**: Le skill MUST définir les niveaux de sources A (primaires), B (secondaires
  fiables) et C (contextualisation) tels qu'énumérés dans la demande, et imposer la recherche
  prioritaire des sources primaires.
- **FR-014**: Une source secondaire ou de contextualisation MUST NOT être présentée comme
  primaire ; un extrait de moteur de recherche MUST NOT suffire comme preuve ; le document
  original MUST être ouvert et examiné dès que possible.
- **FR-015**: Chaque preuve MUST porter une qualité de source parmi `A_PRIMARY_VERIFIED`,
  `B_RELIABLE_SECONDARY`, `C_CONTEXTUAL_ONLY`, `D_UNVERIFIED_OR_INACCESSIBLE`, distincte du
  type de source existant (programme, livre ou plateforme, déclaration ou vote), qui est
  conservé.
- **FR-016**: Lorsqu'une source primaire est inaccessible, la limitation MUST être documentée et
  la source secondaire utilisée qualifiée.

#### Vérification des citations

- **FR-017**: Chaque preuve MUST conserver, autant que possible : texte exact de la citation
  utile, auteur effectif des propos, date des propos, date de publication si différente, titre,
  média ou institution, URL directe, type de source, localisation précise (page, article,
  amendement, paragraphe ou horodatage), contexte nécessaire, date de vérification.
- **FR-018**: Pour une vidéo ou un enregistrement audio, la localisation MUST être un
  horodatage ; pour un document parlementaire ou administratif, la page, l'article,
  l'amendement ou le passage.
- **FR-019**: Chaque preuve MUST porter un statut de citation parmi `VERIFIED_QUOTE`,
  `UNVERIFIED_QUOTE`, `PARAPHRASE`, `SOURCE_INACCESSIBLE` ; `VERIFIED_QUOTE` exige que le texte
  ait été retrouvé mot pour mot dans la source originale consultée.
- **FR-020**: Le skill MUST interdire de reconstituer une citation à partir d'une paraphrase,
  de fusionner des déclarations, de retirer des réserves qui changent le sens, de corriger
  silencieusement les propos, de mettre une reformulation entre guillemets et d'attribuer des
  propos non tenus personnellement.

#### Attribution

- **FR-021**: Chaque preuve MUST porter un type d'attribution parmi `PERSONAL_DIRECT`,
  `PERSONAL_DOCUMENT`, `PERSONAL_ACTION`, `PARTY_POSITION`, `PARLIAMENTARY_GROUP_POSITION`,
  `GOVERNMENT_POSITION`, `COALITION_POSITION`, `THIRD_PARTY_ATTRIBUTION`,
  `UNKNOWN_ATTRIBUTION`, et une confiance d'attribution parmi `HIGH`, `MEDIUM`, `LOW`,
  `UNCONFIRMED`.
- **FR-022**: Le skill MUST interdire d'étendre une position de parti, un vote de groupe ou une
  décision gouvernementale à un membre individuel sans preuve personnelle, et MUST exiger la
  description précise de la portée d'une signature, d'un vote ou d'un amendement.
- **FR-023**: Les désaccords documentés entre une personnalité et son parti MUST être conservés.

#### Qualification des positions

- **FR-024**: Le rattachement d'une preuve à un thème ou à une question MUST utiliser
  exclusivement les identifiants de thèmes, de questions, les axes et les polarités existants ;
  un axe nouveau MUST NOT être créé.
- **FR-025**: Chaque preuve rattachée à une question MUST porter une qualification parmi
  `EXPLICIT_SUPPORT`, `EXPLICIT_OPPOSITION`, `QUALIFIED_SUPPORT`, `QUALIFIED_OPPOSITION`,
  `CONDITIONAL_POSITION`, `AMBIGUOUS`, `CONTRADICTORY_EVIDENCE`, `NO_DIRECT_EVIDENCE`,
  exprimée par rapport à l'énoncé de la question (et non à son axe).
- **FR-026**: Le skill MUST interdire de déduire une position d'une étiquette idéologique, de
  l'appartenance à un parti ou d'un vote seul sans examen du texte voté et de la procédure ; une
  absence de preuve MUST NOT valoir neutralité ni opposition.

#### Évaluation séparée des dimensions de qualité

- **FR-027**: Qualité de source, exactitude de la citation, fiabilité de l'attribution,
  interprétation politique et actualité de la position MUST être évaluées séparément, sans score
  unique agrégé ; toute appréciation non évidente MUST être justifiée en clair.

#### Profondeur de recherche et journal

- **FR-028**: Le skill MUST imposer des passes de recherche couvrant, selon le sujet : sites
  personnels, de campagne et de partis, Assemblée nationale, Sénat, archives parlementaires,
  sites gouvernementaux, discours et conférences de presse, entretiens intégraux, débats
  télévisés, vidéos originales, réseaux sociaux authentifiés, archives, médias nationaux et
  régionaux, publications spécialisées ; avec noms complets, variantes terminologiques,
  expressions exactes et contexte historique.
- **FR-029**: Chaque mission MUST consigner un journal daté : requêtes, sources consultées,
  catégories explorées, éléments vérifiés, éléments restant à vérifier, lacunes, contradictions.
- **FR-030**: Une recherche MUST NOT être déclarée exhaustive si une catégorie importante de
  sources n'a pas pu être consultée ; la catégorie manquante MUST être nommée.

#### Actualité et évolution

- **FR-031**: Chaque preuve MUST distinguer date des propos, date de publication, période à
  laquelle la position semble correspondre et date de dernière vérification.
- **FR-032**: Une déclaration ancienne MUST NOT être présentée comme position actuelle sans
  corroboration récente ; sa pertinence temporelle MUST être indiquée.
- **FR-033**: Deux preuves contradictoires MUST être toutes deux conservées avec leur
  chronologie ; une explication MUST être recherchée ; à défaut, le dossier est qualifié
  `CONTRADICTORY_EVIDENCE`. La preuve la plus ancienne MUST NOT être supprimée.

#### Doublons

- **FR-034**: Avant tout ajout, le corpus (preuves, sources existantes du projet, positions)
  MUST être interrogé sur la citation, la source et les passages équivalents.
- **FR-035**: Une source qui confirme une citation existante MUST être ajoutée comme
  corroboration de la preuve existante, sans nouvel enregistrement de citation.
- **FR-036**: Les identifiants MUST être uniques et stables ; un enregistrement semblable
  MUST NOT être supprimé automatiquement ; les doublons possibles sont signalés.

#### Lacunes documentaires

- **FR-037**: Le dispositif MUST distinguer : aucune position personnelle trouvée, seule une
  position de parti trouvée, seule une déclaration historique trouvée, source primaire
  inaccessible, citation rapportée non vérifiable, statut de candidature incertain, sources
  contradictoires, date inconnue, absence de preuve d'une position opposée.
- **FR-038**: `NOT_FOUND` MUST n'être utilisé qu'après une recherche significative documentée
  et datée, et MUST NOT être remplacé par une position supposée.

#### Intégration aux données existantes

- **FR-039**: Les sources retenues MUST réutiliser le registre de sources existant du projet
  (identifiants, URL, dates, empreinte, cache local) ; un second registre de sources MUST NOT
  être créé.
- **FR-040**: Les personnalités MUST être désignées par les identifiants existants lorsqu'elles
  figurent dans la liste des candidats, et les questions et thèmes par leurs identifiants
  existants.
- **FR-041**: Chaque preuve MUST pouvoir conserver les champs énumérés en section 15 de la
  demande (identifiant stable, personnalité, statut à la date considérée, citation ou
  paraphrase, attribution, thème, question, qualification, dates, source, localisation,
  qualité, confiance, pertinence temporelle, contexte, notes de vérification, date de
  recherche, dates de création et de mise à jour).
- **FR-042**: Le corpus de preuves MUST être distinct des positions : la collecte des preuves
  MUST NOT créer, modifier ni relire de position, ni recalculer de score.
- **FR-043**: Une preuve historique MUST NOT être écrasée silencieusement : toute correction
  conserve la valeur antérieure, sa date et le motif.
- **FR-044**: Lorsqu'une preuve pourrait modifier une position existante, un signalement daté
  pour revue humaine MUST être produit, citant la position concernée, la preuve et le motif.
- **FR-045**: La conformité du registre des personnalités, des preuves, des journaux et des
  signalements à leur format documenté MUST être contrôlée par la validation existante du
  corpus, exécutée en intégration continue, avec des tests : valeurs de statuts dans les listes
  fermées, champs obligatoires présents, renvois existants (sources, personnalités, thèmes,
  questions), identifiants uniques, `VERIFIED_QUOTE` retrouvée dans le texte de la source quand
  il est en cache. Cette modification des scripts de données est la seule modification de code
  admise ; elle ne touche ni le site, ni le score, ni la publication. *(Tranché par adrien le
  2026-11-22.)*
- **FR-046**: Les formulations, thèmes, polarités, enjeux et états d'activation des questions,
  ainsi que les positions et la liste publiée des candidats, MUST rester inchangés par
  l'installation et par toute mission de recherche.

#### Modes de recherche

- **FR-047**: Le sous-agent MUST prendre en charge cinq modes lancés explicitement : recherche
  sur une personnalité, comparaison de personnalités (critères de preuve identiques), recherche
  thématique (preuves dans les deux sens), enrichissement global (lacunes, recherches,
  vérification, déduplication, mise à jour), audit adversarial (revérification indépendante des
  citations, attributions, actualité, qualité et interprétation).

#### Compte rendu

- **FR-048**: Chaque mission MUST se terminer par un compte rendu comportant les 13 rubriques de
  la section 17 de la demande, avec pour chaque constat important la citation exacte ou le
  passage de référence et l'URL, et une séparation explicite entre faits vérifiés, citations,
  paraphrases, interprétations et hypothèses.

#### Sécurité et périmètre

- **FR-049**: Le dispositif MUST travailler exclusivement dans le dépôt courant, sans modifier
  la configuration Claude Code globale, sans exposer de secret ni d'information privée, sans
  contourner paywall, authentification ou contrôle d'accès, et sans service ni API payants
  supplémentaires (la commande d'extraction payante du projet n'est jamais utilisée).
- **FR-050**: Le sous-agent MUST NOT effectuer de commit, de push ni ouvrir de pull request sans
  demande explicite, MUST NOT supprimer de données historiques et MUST NOT activer ni désactiver
  de question.

#### Validation de l'installation

- **FR-051**: L'installation MUST être vérifiée par : découverte du sous-agent, validité de son
  en-tête et modèle `opus`, découverte du skill, préchargement du skill dans le sous-agent,
  lancement par une demande en langage naturel le nommant, présence des deux composants au
  niveau du projet uniquement, test non destructif sur une personnalité et un thème, contrôle
  de la conservation des sources, citations, dates, attributions et statuts de vérification.
- **FR-052**: L'installation MUST NOT lancer d'enrichissement complet du corpus ; le test
  non destructif porte sur une seule personnalité et un seul thème.
- **FR-053**: L'installation MUST NOT être déclarée terminée tant que la découverte du
  sous-agent, le chargement du skill et le test non destructif n'ont pas été vérifiés ; le
  livrable final MUST contenir les éléments de la section 20 de la demande.

### Key Entities *(include if feature involves data)*

- **Personnalité suivie** : personne liée à la présidentielle 2027 ; identifiant stable (celui
  de la liste des candidats s'il existe), nom, parti ou mouvement, historique des statuts.
- **Statut de candidature** : valeur parmi les huit statuts, date d'effet, preuve associée,
  date de constatation ; forme un historique ordonné par personnalité.
- **Source** : document consulté, enregistré dans le registre de sources existant du projet
  (identifiant, URL, titre, type, dates, empreinte du texte).
- **Preuve** : enregistrement d'un propos, document ou acte d'une personnalité ; relie une
  personnalité, une ou plusieurs sources, un thème et éventuellement une question ; porte la
  citation ou la paraphrase, la localisation, les statuts de citation, d'attribution, de
  qualification, la qualité de source, la confiance, la pertinence temporelle, les dates, le
  contexte, les notes de vérification, les corroborations et l'historique de ses corrections.
- **Journal de recherche** : trace datée d'une mission (mode, périmètre, requêtes, catégories
  explorées, résultats, lacunes, `NOT_FOUND` éventuels).
- **Signalement** : demande de revue humaine (écart avec une position existante, changement de
  statut d'un candidat publié, doublon possible, contradiction non résolue), datée, avec preuve
  et motif ; ne modifie rien par lui-même.
- **Position** (existante, inchangée) : évaluation relue d'un candidat sur une question, seule à
  entrer dans le score ; peut être éclairée par des preuves et des signalements.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Une demande en langage naturel nommant le sous-agent le déclenche du premier coup,
  et le skill est présent dans son contexte dès le démarrage (vérifié lors de l'installation).
- **SC-002**: Le skill est sélectionnable manuellement par son nom dans une session ordinaire et
  contient toutes les règles (statuts, hiérarchie, format, compte rendu) sans renvoi nécessaire
  à la description du sous-agent.
- **SC-003**: Après l'installation et le test non destructif, les fichiers de questions, de
  thèmes, de positions et la liste publiée des candidats sont identiques octet pour octet à leur
  état antérieur.
- **SC-004**: 100 % des preuves enregistrées lors du test portent une URL directe, une date de
  vérification, un type d'attribution, un statut de citation et une qualité de source.
- **SC-005**: 100 % des preuves marquées `VERIFIED_QUOTE` lors du test ont un texte retrouvé
  mot pour mot dans la source consultée, et une localisation précise (page, passage ou
  horodatage).
- **SC-006**: Chaque compte rendu de mission contient les 13 rubriques demandées et chaque
  constat important y est accompagné d'une citation ou d'un passage et d'une URL.
- **SC-007**: Aucun composant du dispositif n'est ajouté à la configuration Claude Code globale
  de l'utilisateur, et aucun service ni API payant n'est appelé.
- **SC-008**: Une relance de la même mission sur la même personnalité et le même thème ne crée
  aucune preuve en double (les sources supplémentaires deviennent des corroborations).
- **SC-009**: Pour chaque règle de format du corpus de preuves, un enregistrement fautif de test
  est rejeté par la validation, et le corpus de preuves produit par le test non destructif passe
  la validation sans erreur.
- **SC-010**: Après l'installation, un seul sous-agent de recherche politique est découvert dans
  le projet.

## Assumptions

- Les utilisateurs du dispositif sont adrien et l'assistant Claude Code travaillant dans ce
  dépôt ; il n'y a pas d'utilisateur final du site concerné, et rien de nouveau n'est publié.
- La recherche s'appuie sur les outils déjà disponibles dans les sessions Claude Code
  (recherche web, lecture de pages, navigateur intégré) et sur la commande existante
  d'enregistrement des sources ; aucun abonnement ni clé d'API n'est ajouté.
- Le corpus de preuves vit dans `data/`, versionné et relu en pull request de données comme le
  reste du corpus (gouvernance FR-041 de la spec 002).
- Les nouveaux statuts de candidature, qualités et qualifications servent au corpus de preuves ;
  ils ne modifient ni le critère d'inclusion publié ni les niveaux de preuve publiés sur la page
  Méthodologie.
- Le sous-agent et le skill sont chargés par Claude Code au démarrage d'une session ; une
  session ouverte avant leur création peut nécessiter un redémarrage pour les découvrir.
- Le test non destructif peut ajouter quelques preuves réelles au corpus de preuves sur une
  personnalité et un thème ; il n'est ni commité ni poussé sans demande explicite.
- Les règles existantes (extraction en session par l'agent, pas de `data:extract` payant, mise
  en forme YAML préservée) s'appliquent aussi aux missions de recherche.
