# Feature Specification: Corpus, ontologie et pipeline d'extraction des positions

**Feature Branch**: `002-corpus-ontologie-pipeline`

**Created**: 2026-11-06

**Status**: Draft

**Input**: User description: "Corpus des candidats, ontologie des thèmes, banque de questions et pipeline d'extraction des positions"

## User Scenarios & Testing *(mandatory)*

Cette fonctionnalité produit la matière première de radar-2027 : les thèmes, les candidats, les énoncés du questionnaire et, pour chaque couple (candidat, question), une position sourcée et relue. Elle livre aussi les contrôles qui empêchent toute donnée non conforme d'atteindre un visiteur, le jeu de données publié que consomment les fonctionnalités 003 à 005, et la page « Méthodologie » qui rend l'ensemble vérifiable par n'importe qui.

Quatre acteurs interviennent :

- l'**éditeur de données**, qui rédige les énoncés, collecte les sources et transforme les affirmations extraites en positions ;
- le **relecteur**, personne différente de l'éditeur, qui valide ou conteste chaque position et chaque énoncé ;
- le **mainteneur**, qui exécute la validation, publie les versions du jeu de données et surveille le coût des extractions ;
- le **visiteur**, qui lit la page Méthodologie et remonte, pour n'importe quelle position, jusqu'à la source qui la fonde.

### User Story 1 - Constituer le référentiel : thèmes, candidats, banque de questions (Priority: P1)

L'éditeur de données établit la liste plate des thèmes, la liste des candidats avec leur statut, et rédige une banque de 250 à 300 énoncés neutres rattachés chacun à un ou deux thèmes. Un contrôle automatique vérifie la cohérence du référentiel (identifiants uniques et stables, thèmes existants, équilibre des polarités par thème, taille minimale par thème) et refuse tout référentiel non conforme. Un relecteur valide chaque énoncé avant qu'il ne devienne actif.

**Why this priority**: sans référentiel conforme, aucune position ne peut être saisie, aucune sélection de questions (003) ni questionnaire (004) ne peut exister. C'est le socle de toutes les autres données et il a de la valeur seul : une banque d'énoncés neutres, équilibrés et relus est déjà un livrable publiable.

**Independent Test**: rédiger les thèmes, une liste de candidats et une banque d'énoncés, lancer la validation, constater qu'un référentiel conforme est accepté et qu'un référentiel violant une règle (thème inconnu, trois thèmes sur une question, thème déséquilibré, identifiant dupliqué) est refusé avec un message désignant l'élément fautif. Aucune position n'est nécessaire.

**Acceptance Scenarios**:

1. **Given** l'ontologie contient les seize thèmes de travail avec identifiant, libellé, description courte, axe de lecture et ordre canonique, **When** la validation s'exécute, **Then** elle accepte l'ontologie et la liste des thèmes publiée reprend exactement cet ordre.
2. **Given** une question rattachée à trois thèmes, ou à un thème qui n'existe pas, **When** la validation s'exécute, **Then** elle échoue en nommant l'identifiant de la question et la règle violée.
3. **Given** un thème dont les énoncés actifs comptent 70 % d'une polarité et 30 % de l'autre, **When** la validation s'exécute, **Then** elle échoue en indiquant le thème, les effectifs par polarité et la fourchette attendue.
4. **Given** un nouvel énoncé rédigé par l'éditeur, **When** aucun relecteur distinct ne l'a validé, **Then** l'énoncé reste en attente et ne peut pas porter le statut « actif ».
5. **Given** la liste de candidats, **When** un candidat y figure, **Then** il porte un statut parmi déclaré / retiré, une étiquette politique et une source datée justifiant ce statut ; un candidat sans source de statut est refusé.
6. **Given** un énoncé déjà publié dans une version de banque, **When** l'éditeur tente d'en modifier le texte au-delà d'une correction typographique, **Then** la validation le refuse et exige la création d'un nouvel énoncé avec un nouvel identifiant, l'ancien passant au statut « retiré ».

---

### User Story 2 - Saisir, sourcer et relire les positions (Priority: P2)

L'éditeur enregistre des sources (programme officiel, livre ou plateforme écrite, déclaration publique ou vote) et, pour un couple (candidat, question), une position de −2 à +2 ou « inconnue », avec niveau de preuve, citation d'appui, justification et provenance. Le relecteur, personne différente, passe la position en « relue » ou la marque « contestée ». Le contrôle automatique refuse toute position connue sans source, sans citation ou dont le niveau de preuve ne correspond pas à ses sources.

**Why this priority**: c'est le cœur de la promesse de neutralité et de traçabilité. Même sans extraction assistée, ce parcours permet de produire manuellement un corpus de positions publiable, ce qui en fait le second incrément de valeur.

**Independent Test**: pour un candidat et une dizaine de questions, enregistrer des sources et des positions à la main, faire relire par une seconde personne, lancer la validation ; vérifier que seules les positions relues et sourcées sont acceptées comme « connues » et que chaque violation (source absente, citation absente, auto-relecture, valeur hors échelle) est refusée.

**Acceptance Scenarios**:

1. **Given** une source avec adresse, titre, type de preuve, date de publication et date de consultation, **When** l'éditeur l'enregistre, **Then** son texte brut est conservé dans un cache local hors du dépôt et le dépôt n'en garde que les métadonnées et une empreinte du contenu.
2. **Given** une position de valeur +1 sans aucune source rattachée, **When** la validation s'exécute, **Then** elle échoue en nommant le candidat et la question.
3. **Given** une position dont la citation d'appui n'apparaît pas mot pour mot dans le texte en cache de la source citée, **When** la validation s'exécute, **Then** elle signale la position comme non vérifiable et la refuse.
4. **Given** une position en statut « brouillon » rédigée par l'éditeur A, **When** l'éditeur A tente lui-même de la passer en « relue », **Then** le changement est refusé ; **When** le relecteur B la valide, **Then** la position porte le statut « relue », l'identifiant du relecteur et la date de relecture.
5. **Given** deux sources de même niveau de preuve donnant des positions opposées sur la même question, **When** l'éditeur enregistre la position, **Then** elle doit porter le statut « contestée » avec les deux sources, et elle est traitée comme inconnue tant qu'un relecteur n'a pas tranché en documentant son choix.
6. **Given** une position dont les sources sont une déclaration publique et un programme officiel, **When** la validation s'exécute, **Then** le niveau de preuve affiché est « programme officiel » (le plus fort des niveaux cités) ; un niveau déclaré supérieur à celui de ses sources est refusé.
7. **Given** l'éditeur n'a trouvé aucune prise de position d'un candidat sur une question après consultation de ses sources, **When** il enregistre explicitement « inconnue » avec la liste des sources consultées, **Then** la validation l'accepte et la couverture du candidat n'est pas augmentée.

---

### User Story 3 - Publier un jeu de données fiable et la page Méthodologie (Priority: P3)

Le mainteneur construit, à partir du corpus validé, un jeu de données publié, versionné et immuable, qui ne contient que des positions relues et connues ; il calcule la couverture de chaque candidat et le pouvoir discriminant de chaque question. Le visiteur consulte une page Méthodologie qui expose les règles, la liste des thèmes, les critères d'inclusion des candidats, les niveaux de preuve, la couverture par candidat et, pour chaque position publiée, ses sources.

**Why this priority**: c'est ce qui rend le corpus utilisable par l'application (003 à 005) et vérifiable par le public. Il vient après la saisie des positions car il n'a de sens qu'avec un corpus relu, mais avant l'extraction assistée, qui n'est qu'un accélérateur de production.

**Independent Test**: à partir d'un corpus de test contenant des positions relues, brouillons, contestées et inconnues, construire le jeu de données publié et vérifier qu'il ne contient que les positions relues et connues, qu'il tient dans le budget de taille, que sa version est enregistrée et ne peut pas être modifiée, et qu'un visiteur peut atteindre la source d'une position depuis la page Méthodologie.

**Acceptance Scenarios**:

1. **Given** un corpus contenant une position « relue » de valeur −1, une position « brouillon » de valeur +2 et une position « contestée », **When** le jeu de données est construit, **Then** seule la position relue y figure avec sa valeur ; les deux autres apparaissent comme inconnues.
2. **Given** un jeu de données publié en version N, **When** un mainteneur tente de reconstruire la version N avec une liste de questions actives différente, **Then** la construction échoue et exige la création de la version N+1.
3. **Given** 22 candidats, 300 questions actives et toutes les positions connues, **When** le jeu de données principal est construit, **Then** sa taille reste inférieure au budget défini (voir SC-004) ; les citations et justifications sont livrées dans un jeu de détail séparé par candidat.
4. **Given** le jeu de données publié, **When** le visiteur ouvre la page Méthodologie, **Then** il y lit les règles de traçabilité, les seize thèmes dans l'ordre canonique, les critères d'inclusion et de retrait des candidats, la définition des trois niveaux de preuve, la liste des candidats inclus avec leur statut et leur couverture, et la date du jeu de positions.
5. **Given** une position publiée, **When** le visiteur la consulte depuis la page Méthodologie ou la fiche d'un candidat, **Then** il voit sa valeur, son niveau de preuve, sa citation d'appui et au moins une source cliquable avec titre, date de publication et date de consultation.
6. **Given** une question à laquelle 11 candidats sur 22 ont une position connue, dispersée sur toute l'échelle, et une autre où 20 candidats sur 22 ont tous la position +2, **When** le pouvoir discriminant est calculé, **Then** la première obtient une valeur strictement supérieure à la seconde, et une question à moins de deux positions connues obtient 0.

---

### User Story 4 - Accélérer la saisie par extraction assistée (Priority: P4)

L'éditeur lance une exécution d'extraction sur les sources d'un candidat : un modèle de langage produit des « affirmations extraites » (citation, localisation dans la source, résumé, thèmes, question de la banque associée ou aucune, prise de position proposée, confiance). L'éditeur relit chaque affirmation et la transforme en position « brouillon », ou la rejette en motivant. Une réexécution sur des entrées inchangées ne produit ni doublon ni modification ; chaque exécution journalise le modèle, la date, les sources traitées et le coût.

**Why this priority**: l'extraction assistée divise le temps de constitution du corpus mais n'est jamais indispensable : toutes ses sorties passent par la saisie et la relecture humaines de la story 2. Elle vient en dernier pour que les règles de relecture existent avant l'automatisation.

**Independent Test**: exécuter l'extraction sur deux ou trois sources en cache d'un candidat ; vérifier que chaque affirmation produite a une citation retrouvable mot pour mot dans la source, qu'un journal d'exécution avec coût et modèle est écrit, que relancer l'extraction à l'identique ne crée aucune affirmation ni position nouvelle, et qu'aucune position créée depuis une affirmation ne peut dépasser le statut « brouillon » sans relecteur.

**Acceptance Scenarios**:

1. **Given** les sources en cache d'un candidat et la banque de questions active, **When** l'éditeur lance une extraction, **Then** chaque affirmation produite porte une citation, sa localisation dans la source, un résumé, un ou deux thèmes, la question associée ou « aucune », une position proposée de −2 à +2 et un niveau de confiance.
2. **Given** une affirmation dont la citation n'est pas retrouvée mot pour mot dans le texte en cache, **When** l'exécution se termine, **Then** l'affirmation est marquée « non vérifiable » et ne peut pas être transformée en position.
3. **Given** une exécution terminée, **When** le mainteneur consulte le journal, **Then** il y trouve l'identifiant d'exécution, la date, le modèle utilisé, la version de la banque, la liste des sources traitées, le nombre d'affirmations produites et le coût.
4. **Given** une exécution déjà réalisée, **When** l'éditeur la relance avec les mêmes sources, la même banque et le même modèle, **Then** aucune affirmation nouvelle n'est créée, aucune position existante n'est modifiée, et seul un nouvel enregistrement de journal apparaît.
5. **Given** une affirmation relue par l'éditeur, **When** il la transforme en position, **Then** la position créée est en statut « brouillon », référence l'affirmation et l'exécution d'origine comme provenance, et reprend la source et la citation ; **When** il la rejette, **Then** un motif de rejet est enregistré.
6. **Given** une affirmation produite avec une confiance maximale, **When** aucun humain n'est intervenu, **Then** il n'existe aucun chemin permettant de la publier : la position correspondante reste brouillon, donc inconnue.
7. **Given** un plafond de coût configuré pour une exécution, **When** le coût cumulé atteint ce plafond, **Then** l'exécution s'arrête proprement, journalise l'arrêt et conserve les affirmations déjà produites.

---

### Edge Cases

- **Candidat retiré** : ses positions et sources sont conservées dans le corpus mais il est exclu du jeu de données publié ; la date et la source du retrait figurent sur la page Méthodologie.
- **Candidat sans aucune position connue** : il est inclus dans le jeu de données avec une couverture de 0 % ; l'affichage « données insuffisantes » relève de la fonctionnalité 005.
- **Question retirée portant des positions** : les positions restent dans le corpus mais la question n'entre plus dans aucune nouvelle version de banque ni dans le calcul de couverture.
- **Thème sans énoncé actif ou sous le minimum requis** : la validation refuse la publication d'une nouvelle version de banque.
- **Source devenue inaccessible en ligne** : la position reste valide grâce à la date de consultation et au texte en cache ; la validation signale les adresses qui ne répondent plus pour que l'éditeur cherche une adresse d'archive.
- **Source sans date de publication précise** : une précision au mois ou à l'année est acceptée et affichée comme telle ; une source sans aucune date est refusée.
- **Source antérieure à la dernière élection présidentielle (avant le 1er janvier 2022)** : acceptée uniquement si aucune source plus récente n'existe sur la question ; la position est alors marquée « ancienne » dans le jeu de détail.
- **Évolution de la position d'un candidat dans le temps** : à niveau de preuve égal, la source la plus récente prévaut ; la position antérieure est conservée dans la justification.
- **Sources de niveaux différents en contradiction** : le niveau de preuve le plus fort prévaut (programme officiel > livre ou plateforme écrite > déclaration publique ou vote) ; la contradiction est notée dans la justification.
- **Citation trop longue** : au-delà de la longueur maximale (voir FR-017), la validation refuse la position pour que la citation reste une courte citation d'appui.
- **Affirmation extraite ne correspondant à aucune question** : conservée avec « aucune question » et ses thèmes, afin d'alimenter la rédaction de futurs énoncés ; elle ne peut pas devenir une position.
- **Même source utilisée par plusieurs candidats** (débat, scrutin) : une source est unique par adresse et peut être rattachée à plusieurs positions de candidats différents.
- **Texte en cache modifié après l'extraction** : l'empreinte du cache ne correspond plus à celle enregistrée ; la validation signale les positions et affirmations à revérifier.
- **Relecteur indisponible** : les positions restent en brouillon et donc inconnues ; aucune dérogation n'existe.
- **Interruption de l'extraction** (réseau, plafond de coût) : les affirmations déjà produites sont conservées et l'exécution est marquée « interrompue » dans le journal ; une relance reprend sans doublon.

## Requirements *(mandatory)*

### Functional Requirements

**Ontologie des thèmes**

- **FR-001**: Le système DOIT maintenir une liste plate de thèmes, chacun avec un identifiant stable en français, un libellé, une description courte, un axe de lecture à deux pôles décrits de manière factuelle (servant à définir la polarité des énoncés) et une position dans l'ordre canonique.
- **FR-002**: La liste de travail initiale DOIT comprendre les seize thèmes suivants, à confronter à la liste de monvote2027.fr lors de la mise en œuvre : international, société, économie, fiscalité, immigration, santé, sécurité, justice, institutions, démocratie, numérique, agriculture, travail, défense, environnement, transport.
- **FR-003**: Un identifiant de thème NE DOIT jamais être renommé ni réutilisé une fois publié dans une version de banque ; un thème abandonné passe au statut « retiré » et ne peut plus recevoir d'énoncé actif.

**Candidats**

- **FR-004**: Chaque candidat DOIT porter un identifiant stable, un nom public, une étiquette politique (parti ou « sans étiquette »), un statut parmi déclaré / retiré, la date du dernier changement de statut et une source datée justifiant ce statut.
- **FR-005**: Le critère d'inclusion (déclaration publique de candidature) et les critères de retrait DOIVENT être rédigés dans le corpus, publiés sur la page Méthodologie et appliqués de manière identique à tous les candidats ; tout changement de statut DOIT citer le critère appliqué.
- **FR-006**: Un candidat NE DOIT être inclus (« déclaré ») que s'il a annoncé publiquement et personnellement sa candidature à l'élection présidentielle de 2027, annonce attestée par une source datée ; aucune inclusion ne se fonde sur une candidature pressentie, sondée, rapportée par des tiers ou en cours de désignation par un parti (décision du 2026-11-06). Après publication de la liste officielle des candidats par le Conseil constitutionnel (mars 2027), seules les personnes de cette liste restent « déclarées » ; les autres passent « retirées ».
- **FR-007**: Un candidat « retiré » DOIT être conservé dans le corpus avec ses positions et sources, et exclu de tout jeu de données publié postérieur à son retrait.

**Banque de questions**

- **FR-008**: Chaque question DOIT porter un identifiant stable, un énoncé en français, un ou deux thèmes, une polarité (pôle de l'axe du thème principal que rejoint une réponse « tout à fait d'accord »), un statut actif / retiré, la version de banque d'introduction et, le cas échéant, la version de retrait.
- **FR-009**: Un énoncé DOIT être une affirmation unique d'au plus 200 caractères, sans double négation, formulée de sorte que les deux extrémités de l'échelle de réponse soient des positions défendables ; il DOIT satisfaire une grille de neutralité écrite, publiée sur la page Méthodologie (absence de terme connoté, de présupposition, de référence à une personne ou à un parti), que le relecteur coche point par point avant l'activation.
- **FR-010**: Un énoncé NE DOIT devenir « actif » qu'après validation par un relecteur distinct de son rédacteur ; l'identifiant du relecteur et la date sont enregistrés.
- **FR-011**: L'énoncé d'une question publiée dans une version de banque NE DOIT plus changer, sauf correction orthographique ou typographique qui n'en modifie pas le sens ; toute autre modification DOIT se faire par retrait et création d'une nouvelle question.
- **FR-012**: Pour chaque thème, la part de chaque polarité parmi les énoncés actifs qui le portent comme thème principal DOIT être comprise entre 40 % et 60 %, et chaque thème DOIT compter au moins 10 énoncés actifs ; la banque cible 250 à 300 énoncés actifs au total.

**Sources**

- **FR-013**: Chaque source DOIT porter une adresse unique, un titre, un type de preuve parmi programme officiel / livre ou plateforme écrite / déclaration publique ou vote, une date de publication (précision jour, mois ou année), une date de consultation, et l'identifiant du ou des candidats concernés.
- **FR-014**: Le texte brut de chaque source DOIT être conservé dans un cache local hors du dépôt ; le dépôt NE DOIT contenir que les métadonnées et une empreinte du texte en cache permettant de détecter toute modification.
- **FR-015**: Une source datée d'avant le 1er janvier 2022 NE DOIT fonder une position que si aucune source plus récente du même candidat ne traite la question ; la position est alors marquée « ancienne ».

**Positions**

- **FR-016**: Pour chaque couple (candidat, question), le système DOIT pouvoir enregistrer au plus une position portant : une valeur parmi −2, −1, 0, +1, +2 ou « inconnue » ; un niveau de preuve ; une ou plusieurs sources ; une citation d'appui ; une justification ; un statut de relecture parmi brouillon / relue / contestée ; une provenance (saisie manuelle, ou affirmation extraite avec l'identifiant de l'exécution et du modèle) ; les identifiants de l'auteur et du relecteur avec leurs dates.
- **FR-017**: Toute position de valeur connue DOIT citer au moins une source, porter une citation d'appui d'au plus 300 caractères retrouvable mot pour mot dans le texte en cache d'une des sources citées, et une justification ; le niveau de preuve de la position DOIT être égal au niveau le plus fort parmi ses sources.
- **FR-018**: Une position DOIT passer de « brouillon » à « relue » uniquement par l'action d'un relecteur distinct de l'auteur de la position ; une position créée ou modifiée par un modèle de langage NE DOIT jamais porter directement le statut « relue ».
- **FR-019**: Toute modification de la valeur, des sources ou de la citation d'une position « relue » DOIT la ramener au statut « brouillon ».
- **FR-020**: Lorsque deux sources de même niveau de preuve se contredisent sans que la plus récente l'emporte clairement, la position DOIT être enregistrée « contestée » avec toutes les sources ; un relecteur peut la trancher en documentant son choix dans la justification.
- **FR-021**: Une position « inconnue » PEUT être enregistrée explicitement avec la liste des sources consultées, afin de distinguer « non cherché » de « cherché sans résultat » ; elle n'entre pas dans la couverture.
- **FR-022**: Une position sans source, en statut « brouillon » ou « contestée », ou dont la citation n'est pas vérifiable, DOIT être traitée comme « inconnue » par la validation, la construction du jeu de données et tout calcul de couverture ou de pouvoir discriminant.

**Extraction assistée**

- **FR-023**: Le système DOIT permettre de lancer une exécution d'extraction qui, à partir des sources en cache d'un candidat et de la banque active, produit des affirmations extraites portant chacune : une citation, sa localisation dans la source, un résumé, un ou deux thèmes, la question associée ou « aucune », une prise de position proposée de −2 à +2 et un niveau de confiance.
- **FR-024**: Chaque affirmation extraite DOIT être vérifiée automatiquement : si sa citation n'est pas retrouvée mot pour mot dans le texte en cache de la source, elle est marquée « non vérifiable » et ne peut pas être transformée en position.
- **FR-025**: Chaque exécution DOIT journaliser : son identifiant, la date, le modèle de langage utilisé et la version des consignes qui lui sont données, la version de la banque, les sources traitées avec leur empreinte, le nombre d'affirmations produites et rejetées, le coût, et son état final (terminée, interrompue, échouée).
- **FR-026**: Une réexécution avec des entrées identiques (mêmes empreintes de sources, même version de banque, même modèle, mêmes consignes) NE DOIT créer aucune affirmation nouvelle ni modifier aucune affirmation ou position existante ; une affirmation est identifiée de façon déterministe par sa source, sa localisation et la question associée.
- **FR-027**: Une exécution NE DOIT jamais modifier une position existante, quel que soit son statut ; elle ne fait que proposer des affirmations.
- **FR-028**: L'éditeur DOIT pouvoir transformer une affirmation vérifiable en position « brouillon » (reprenant source, citation, thèmes, question et valeur proposée, modifiables), ou la rejeter avec un motif ; l'affirmation garde la trace de cette décision.
- **FR-029**: Une exécution DOIT s'arrêter proprement lorsqu'un plafond de coût configuré est atteint, conserver les affirmations déjà produites et journaliser l'interruption.
- **FR-030**: Le secret donnant accès au modèle de langage DOIT être fourni par l'environnement local de l'opérateur et NE DOIT jamais être versionné ni journalisé.

**Validation automatique**

- **FR-031**: Le système DOIT fournir un contrôle automatique couvrant l'ensemble du corpus, exécutable localement et dans l'intégration continue, qui échoue dès qu'une règle de la présente spécification est violée et liste chaque violation avec l'identifiant de l'élément concerné et la règle enfreinte.
- **FR-032**: Le contrôle DOIT vérifier au minimum : l'unicité et la stabilité des identifiants ; l'existence de tous les thèmes, questions, candidats et sources référencés ; le nombre de thèmes par question ; l'équilibre des polarités et la taille minimale par thème ; la présence des champs obligatoires des sources ; l'ensemble des règles FR-016 à FR-022 sur les positions ; la correspondance entre les empreintes enregistrées et le cache lorsqu'il est disponible.
- **FR-033**: Le contrôle DOIT calculer pour chaque candidat inclus sa **couverture** : part des questions actives de la version de banque pour lesquelles le candidat a une position relue de valeur connue. Cette couverture de corpus est distincte de la couverture par répondant (part des questions répondues à position connue) calculée par la fonctionnalité 003.
- **FR-034**: Le contrôle DOIT calculer pour chaque question active son **pouvoir discriminant** : écart-type des positions relues connues des candidats inclus (non retirés), multiplié par la part de ces candidats ayant une position connue ; il vaut 0 lorsque moins de deux candidats ont une position connue.
- **FR-035**: Le contrôle DOIT produire un rapport lisible par un humain : effectifs par thème et par polarité, couverture par candidat et par thème, répartition du pouvoir discriminant, nombre de positions par statut et par niveau de preuve, sources inaccessibles.

**Jeu de données publié**

- **FR-036**: Le système DOIT construire, à partir du corpus validé, un **jeu de données principal** contenant : le numéro de version de banque, la date de construction, les thèmes dans l'ordre canonique, les candidats inclus (déclarés) avec statut, étiquette et couverture, les questions actives avec thèmes, polarité et pouvoir discriminant, et, pour chaque couple (candidat, question), la valeur et le niveau de preuve lorsque la position est relue et connue, « inconnue » sinon.
- **FR-037**: Le jeu de données principal NE DOIT contenir aucune position brouillon ou contestée, aucune citation, aucune justification et aucune donnée relative aux éditeurs et relecteurs.
- **FR-038**: Le système DOIT construire un **jeu de détail par candidat** contenant, pour chaque position publiée, la citation d'appui, la justification, la marque « ancienne » éventuelle et les sources (adresse, titre, type de preuve, dates).
- **FR-039**: Une **version de banque** identifie ensemble la liste ordonnée des questions actives, la liste des candidats inclus et la position publiée de chaque candidat sur chaque question ; une version publiée est immuable : toute modification de l'un de ces trois éléments exige un nouveau numéro de version, et le registre des versions (numéro, date, nombre de questions, nombre de candidats) ainsi que le contenu de chaque version sont conservés indéfiniment.
- **FR-040**: Toute mise à jour des positions publiées ou de la liste des candidats inclus DOIT donner lieu à une nouvelle version de banque, même si la liste des questions est inchangée (décision du 2026-11-06 : positions figées par version, afin qu'un ancien lien partagé reproduise exactement le résultat vu au moment du partage) ; le rythme de publication DOIT rester compatible avec la limite de 256 versions du format de lien (spécification 003).
- **FR-041**: Toute modification des thèmes, candidats, questions, sources ou positions DOIT passer par une proposition de modification du dépôt relue par une personne différente de l'auteur, distincte des modifications de code ; l'historique de chaque position DOIT rester consultable.

**Page Méthodologie**

- **FR-042**: Le site DOIT exposer une page Méthodologie publique présentant : les règles de traçabilité et de relecture, la liste des thèmes dans l'ordre canonique avec leur description, les critères d'inclusion et de retrait des candidats, la liste des candidats inclus et retirés avec statut et date, la définition des trois niveaux de preuve, la couverture de chaque candidat, la version de banque et la date du jeu de positions.
- **FR-043**: Depuis la page Méthodologie, le visiteur DOIT pouvoir atteindre, pour chaque position publiée, sa valeur, son niveau de preuve, sa citation d'appui et ses sources avec adresse, titre, date de publication et date de consultation.
- **FR-044**: Les contenus de la page Méthodologie issus des données (thèmes, candidats, couverture, versions) DOIVENT provenir du même jeu de données que celui consommé par l'application, sans recopie manuelle.
- **FR-045**: La page Méthodologie DOIT offrir un moyen de signaler une erreur sur une position ou une source, sans collecte de données personnelles autre que celles que le visiteur choisit de communiquer.

### Key Entities *(include if feature involves data)*

- **Thème** : sujet de l'ontologie plate. Identifiant stable, libellé, description courte, axe de lecture (deux pôles décrits factuellement), ordre canonique, statut actif / retiré. Référencé par les questions et les affirmations extraites.
- **Candidat** : personne susceptible d'être classée par l'application. Identifiant stable, nom public, étiquette politique, statut (déclaré / retiré), date de changement de statut, source du statut, critère appliqué. Détient des positions.
- **Question** : énoncé du questionnaire. Identifiant stable, texte, un ou deux thèmes (dont un principal), polarité, statut actif / retiré, version d'introduction, version de retrait, rédacteur, relecteur et date de validation. Porte un pouvoir discriminant calculé.
- **Source** : document fondant une ou plusieurs positions. Adresse unique, titre, type de preuve, date de publication avec sa précision, date de consultation, candidats concernés, empreinte du texte en cache. Le texte lui-même vit hors du dépôt.
- **Position** : prise de position d'un candidat sur une question. Valeur (−2 à +2 ou inconnue), niveau de preuve, sources, citation d'appui, justification, statut de relecture (brouillon / relue / contestée), marque « ancienne », provenance (manuelle ou affirmation + exécution + modèle), auteur, relecteur, dates. Au plus une par couple (candidat, question).
- **Affirmation extraite** : sortie brute d'une exécution d'extraction. Identifiant déterministe, source, localisation, citation, résumé, thèmes, question associée ou aucune, valeur proposée, confiance, état (vérifiable / non vérifiable / transformée / rejetée avec motif), position créée le cas échéant.
- **Exécution d'extraction** : journal d'un lancement. Identifiant, date, modèle, version des consignes, version de banque, candidat, sources traitées et empreintes, effectifs d'affirmations, coût, plafond, état final.
- **Version de banque** : liste ordonnée immuable de questions actives, numéro entier croissant, date de publication, nombre de questions. Registre conservé indéfiniment.
- **Jeu de données publié** : jeu principal (thèmes, candidats, questions, positions connues et relues, couverture, pouvoir discriminant, version, date du jeu de positions) et jeux de détail par candidat (citations, justifications, sources). Seul contenu de données chargé par un visiteur.
- **Rapport de validation** : résultat du contrôle automatique. Liste des violations, effectifs, couverture, pouvoir discriminant, sources inaccessibles.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100 % des positions de valeur connue présentes dans un jeu de données publié ont le statut « relue », au moins une source et une citation vérifiable ; un jeu de test contenant au moins dix violations distinctes (source absente, brouillon, contestée, valeur hors échelle, citation absente ou introuvable, niveau de preuve surévalué, auto-relecture, thème inconnu, trois thèmes, identifiant dupliqué) est refusé à 100 % par la validation, chaque violation étant désignée par identifiant.
- **SC-002**: La banque publiée en version 1 compte entre 250 et 300 énoncés actifs, chaque thème en porte au moins 10 comme thème principal, et la part de chaque polarité par thème est comprise entre 40 % et 60 %.
- **SC-003**: Avant la première publication, chaque candidat « déclaré » a une couverture d'au moins 60 % des questions actives, et la couverture de 100 % des candidats inclus est calculée et affichée sur la page Méthodologie.
- **SC-004**: Le jeu de données principal pèse au plus 300 ko et chaque jeu de détail par candidat au plus 150 ko, pour 22 candidats et 300 questions actives.
- **SC-005**: Une réexécution de l'extraction à entrées identiques produit 0 affirmation nouvelle, 0 position modifiée et 0 différence dans le corpus hormis un nouvel enregistrement de journal, sur 3 relances consécutives.
- **SC-006**: 100 % des exécutions d'extraction disposent d'un enregistrement de journal avec modèle, date, sources traitées et coût ; le coût total cumulé est consultable à tout moment par le mainteneur.
- **SC-007**: Depuis la page Méthodologie, un visiteur atteint la source d'une position donnée en au plus 3 actions, et 100 % des positions publiées exposent au moins une adresse de source avec ses dates.
- **SC-008**: Un relecteur disposant de la citation, de sa localisation et du texte en cache vérifie une position en moins de 2 minutes en moyenne sur un échantillon de 20 positions.
- **SC-009**: Une personne extérieure à l'équipe, munie uniquement de la page Méthodologie et des sources publiées, retrouve la valeur attribuée (à ±1 près) pour au moins 90 % d'un échantillon aléatoire de 20 positions publiées.
- **SC-010**: La validation complète du corpus (22 candidats, 300 questions) s'exécute en moins de 2 minutes et son rapport permet d'identifier chaque violation sans ouvrir les fichiers de données.
- **SC-011**: Aucune version de banque publiée n'est jamais modifiée : pour toute version N, la liste de questions reconstruite à une date ultérieure est identique à celle publiée initialement.

## Assumptions

- La liste de travail des seize thèmes provient de monvote2027.fr (lu le 2026-11-06) ; la liste de départ des candidats est constituée des personnes figurant sur ce site qui ont publiquement annoncé leur candidature (critère FR-006), les autres n'étant ajoutées qu'au fur et à mesure de leurs déclarations ; ces listes sont confrontées au site lors de la mise en œuvre et toute différence est tranchée par le propriétaire du projet. Le site de référence n'expose ni licence ni données réutilisables : l'ensemble du corpus est produit par le projet.
- La polarité d'un énoncé se définit par rapport à l'axe de lecture de son thème principal ; les deux pôles de chaque axe sont décrits en termes factuels (ce que la mesure fait), jamais par des étiquettes partisanes.
- Les seuils retenus par défaut sont : 40 à 60 % par polarité et au moins 10 énoncés actifs par thème ; énoncé de 200 caractères au plus ; citation de 300 caractères au plus (courte citation d'appui) ; sources antérieures au 1er janvier 2022 marquées « anciennes » ; jeu principal de 300 ko et jeux de détail de 150 ko au plus. Ces seuils peuvent être ajustés par amendement de la spécification.
- Un candidat « retiré » n'est pas publié : on considère qu'un visiteur ne souhaite pas être comparé à une personne qui ne se présente plus. Les données sont conservées pour l'historique et une éventuelle réintégration.
- Les positions « contestées » sont traitées comme inconnues jusqu'à arbitrage d'un relecteur ; aucune pondération par niveau de preuve n'est appliquée au score en v1 (le niveau de preuve est seulement affiché).
- Chaque publication de positions ou de candidats crée une nouvelle version de banque ; un ancien lien partagé est rejoué sur sa propre version (fonctionnalité 003), jamais sur les données courantes. Le volume d'une version (positions de ~22 candidats sur ~300 questions) reste de l'ordre de quelques dizaines de kilo-octets ; les versions antérieures ne sont chargées qu'à la demande.
- L'identité des éditeurs et relecteurs est un identifiant de contributeur interne au dépôt ; elle n'est pas publiée. Les visiteurs ne font l'objet d'aucune collecte de données ; le signalement d'erreur renvoie vers un canal public existant (suivi de tickets du dépôt ou adresse de contact).
- Le modèle de langage utilisé pour l'extraction est fourni par un service externe ; son identité et ses consignes sont versionnées dans le journal de chaque exécution afin de reproduire ou d'auditer un résultat. Le plafond de coût par exécution est fixé par le mainteneur ; aucun plafond par défaut n'est imposé par la spécification.
- Le pouvoir discriminant et la couverture sont calculés ici et simplement consommés par la sélection des questions (003) et par l'affichage « données insuffisantes » (005), qui n'ont pas à les recalculer.
- Le jeu de données publié est destiné à être librement consultable ; le choix précis d'une licence de réutilisation est documenté sur la page Méthodologie et ne conditionne pas la présente spécification.

## Scope Boundaries

**Dans le périmètre** : ontologie des thèmes ; liste et statuts des candidats ; banque de questions et règles de neutralité et d'équilibre ; sources et cache ; positions et cycle de relecture ; extraction assistée et journal d'exécution ; validation automatique, couverture et pouvoir discriminant ; versions de banque et jeu de données publié ; page Méthodologie.

**Hors périmètre** : formules de score et algorithme de sélection des questions (003) ; interface du questionnaire et reprise de session (004) ; page de résultats, fiches candidats détaillées et lien de partage (005) ; socle technique, composants d'interface et déploiement (001) ; collecte réelle et exhaustive des programmes des 22 candidats (travail éditorial continu mené avec les outils spécifiés ici).

## Dependencies

- Fonctionnalité 001 (socle et design system) pour l'affichage de la page Méthodologie et l'exécution de la validation en intégration continue.
- Accès à un modèle de langage externe pour l'extraction assistée (optionnel : les stories 1 à 3 n'en dépendent pas).
- Disponibilité en ligne des sources primaires (programmes, livres, déclarations, votes) et possibilité d'en conserver localement le texte.

## Constitution Check

- **I. Neutralité et traçabilité** : FR-013 à FR-022 (sources, niveaux de preuve, citation vérifiable, brouillon jamais publié), FR-005 à FR-006 (critères publics et identiques), FR-009 à FR-012 (neutralité et équilibre des énoncés), FR-041 (données versionnées et relues).
- **II. Vie privée** : FR-037 et FR-045 (aucune donnée d'éditeur, de relecteur ni de visiteur publiée ou collectée) ; le pipeline s'exécute hors du site et ne touche à aucune donnée de répondant.
- **III. Cœur métier pur** : les indicateurs calculés ici (couverture, pouvoir discriminant) sont déterministes à corpus donné et livrés dans le jeu de données, de sorte que la sélection (003) reste pure.
- **V. Tests comme contrat** : FR-031 et SC-001 imposent une validation bloquante en intégration continue avec jeu de violations de référence.
- **VI. Internationalisation** : les contenus de données (énoncés, libellés, citations) sont en français et séparés des chaînes d'interface de la page Méthodologie.
- **VII. Simplicité, statique et sobriété** : aucun service serveur ; le pipeline est un outillage hors du site ; SC-004 borne le poids des données chargées par un visiteur.
