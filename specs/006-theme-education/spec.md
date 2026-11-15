# Feature Specification: Thème Éducation

**Feature Branch**: `006-theme-education`

**Created**: 2026-11-15

**Status**: Draft

**Input**: User description: "Ajouter le thème « Éducation » (18e thème) à radar-2027 et le rendre sélectionnable par l'utilisateur comme thème prioritaire. Périmètre : petite enfance et maternelle, primaire, collège, lycée, enseignants, autorité et laïcité à l'école, écrans, privé sous contrat et instruction en famille, voie professionnelle et orientation, enseignement supérieur et recherche, école inclusive, éducation prioritaire. Axe factuel et neutre ; énoncés conformes aux règles de neutralité et d'équilibre (002) et au quota d'un thème prioritaire ; campagne de sources pour les 18 candidats déclarés (FR-013a, sources complémentaires recherchées avec un prompt ChatGPT déjà rédigé) ; extraction des positions en session par l'agent puis relecture par adrien ; nouvelle version de banque, anciens liens rejoués sur leur version ; le thème apparaît dans le questionnaire, les résultats et les fiches candidats ; amendement de la spec 002 qui fixe le nombre de thèmes."

## Clarifications

### Session 2026-11-15

- Q : Quel axe de lecture pour Éducation ? → R : les trois dimensions proposées (choix ↔ école commune, dépense ↔ moyens publics, autorité ↔ pédagogie) alimentent le thème ; les énoncés sont tirés des positions des candidats (FR-002, FR-002a, FR-008).
- Q : La banque dépasse 300 énoncés avec Éducation ; que faire ? → R : relever la cible de 002 FR-012 à 320 (FR-012).

## Contexte

La version 1 du jeu de données (publiée le 2026-11-15) compte 17 thèmes, 297 énoncés actifs et 18 candidats déclarés. L'éducation n'y figure pas comme thème : quelques énoncés de Société ou de Travail l'effleurent, mais un répondant ne peut pas en faire un sujet prioritaire. Le corpus contient déjà 14 sources de 9 candidats qui traitent d'éducation ; 9 candidats n'en ont aucune.

Le questionnaire, le score, les quotas de sélection et le lien de partage sont définis pour un nombre quelconque de thèmes de la version de banque, jusqu'à 20 (003 FR-021). Cette fonctionnalité est donc d'abord un travail de corpus : ontologie, énoncés, sources, positions, relecture et publication. Elle ne change aucune règle de calcul.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Choisir l'éducation comme sujet prioritaire (Priority: P1)

En tant que répondant pour qui l'école compte, je trouve « Éducation » dans la liste des thèmes, je peux le choisir parmi mes 3 à 5 sujets prioritaires, je réponds à des énoncés sur l'école et mon classement tient compte de mon accord avec chaque candidat sur ce thème.

**Why this priority**: c'est la valeur attendue par le visiteur ; tout le reste (sources, positions, relecture) n'existe que pour la rendre possible.

**Independent Test**: sur la version qui introduit le thème, ouvrir le questionnaire, choisir Éducation et deux autres thèmes, répondre au questionnaire complet et vérifier que la liste contient le quota d'énoncés Éducation d'un thème prioritaire et que les résultats affichent un score Éducation par candidat.

**Acceptance Scenarios**:

1. **Given** la version qui introduit le thème, **When** le répondant ouvre le choix des sujets prioritaires, **Then** « Éducation » apparaît avec son libellé et sa description courte, à sa place dans l'ordre canonique, et se sélectionne comme les autres thèmes.
2. **Given** Éducation et deux autres thèmes prioritaires en mode complet, **When** la liste de questions est calculée, **Then** Éducation reçoit le quota d'un thème prioritaire défini par 003 FR-021 (12 ou 13 énoncés avec 18 thèmes) et ce quota est rempli sans débordement vers d'autres thèmes.
3. **Given** un questionnaire où Éducation est prioritaire, **When** les résultats s'affichent, **Then** chaque candidat classé montre un score Éducation (ou « — » si moins de 2 questions exploitables) et la couverture « x positions connues sur y » du thème, et Éducation figure parmi les sujets clés de sa fiche.
4. **Given** un questionnaire où Éducation n'est pas prioritaire, **When** la liste est calculée, **Then** Éducation reçoit le quota d'un thème non prioritaire en mode complet, ou entre dans l'agrégat « autres thèmes » en mode court, comme tout autre thème.

---

### User Story 2 - Des sources et des positions pour les 18 candidats (Priority: P1)

En tant que propriétaire du projet, je dispose pour chaque candidat déclaré de ses positions sur les énoncés Éducation, chacune appuyée sur une source attribuable selon FR-013a et sur une citation vérifiable, relues par adrien avant publication. Les sources complémentaires sont recherchées avec l'aide d'un prompt adressé à ChatGPT, dont les propositions sont vérifiées avant d'entrer au corpus.

**Why this priority**: les énoncés sont tirés des positions des candidats (FR-008) ; la campagne de sources vient donc en premier. Le thème peut être publié avec une couverture partielle (règle SC-003 de 002, option A du 2026-11-14), mais un thème sans positions n'aide pas le répondant à se décider.

**Independent Test**: pour chaque candidat, compter les positions Éducation relues et les positions « inconnues » explicites ; vérifier que chaque position connue cite une source attribuable dont le texte en cache contient la citation mot pour mot.

**Acceptance Scenarios**:

1. **Given** une source proposée par ChatGPT, **When** elle est examinée, **Then** elle n'entre au corpus que si son URL est valide, son texte est conservé dans le cache local, elle est attribuable au candidat selon FR-013a et elle n'est pas déjà présente ; sinon elle est écartée avec un motif.
2. **Given** les sources d'un candidat et les énoncés Éducation rédigés, **When** l'agent extrait les positions en session (sans extraction payante), **Then** chaque position est créée en brouillon avec sa source, sa citation d'au plus 300 caractères retrouvable mot pour mot, sa justification et son niveau de preuve.
3. **Given** un candidat sans aucune source éducation après recherche, **When** la campagne se termine, **Then** ses positions Éducation restent inconnues et la liste des sources consultées est consignée, afin de distinguer « cherché sans résultat » de « non cherché ».
4. **Given** les positions en brouillon, **When** adrien les relit, **Then** seules les positions relues entrent dans la version publiée ; les brouillons et les positions contestées comptent comme inconnues.

---

### User Story 3 - Des énoncés tirés des positions, neutres et équilibrés (Priority: P1)

En tant que propriétaire du projet, je dispose d'un axe Éducation décrit sans étiquette partisane, qui réunit trois dimensions (choix ↔ école commune, dépense ↔ moyens publics, autorité ↔ pédagogie), et d'une série d'énoncés tirés des mesures que les candidats ont réellement proposées, qui couvrent le périmètre du thème, respectent la grille de neutralité et l'équilibre des polarités, et ont été validés par un relecteur distinct de leur rédacteur.

**Why this priority**: sans énoncés actifs, le thème ne peut pas être publié (002 FR-012). Cette étape suit la campagne de sources (User Story 2), dont elle exploite les mesures.

**Independent Test**: lancer la validation du corpus sur la branche de données : le thème Éducation est accepté, compte au moins 13 énoncés actifs dont chaque polarité représente 40 à 60 %, et chaque énoncé porte sa grille de neutralité cochée et son relecteur.

**Acceptance Scenarios**:

1. **Given** les sources éducation du corpus, **When** l'agent rédige les énoncés, **Then** chaque énoncé reprend une mesure précise d'au moins une source attribuable et le dossier de rédaction cite, pour chacun, au moins un candidat attendu de chaque côté de l'échelle.
2. **Given** l'ontologie avec le thème Éducation, **When** la validation s'exécute, **Then** le thème porte un identifiant stable, un libellé, une description, un axe à deux pôles factuels et la dernière position de l'ordre canonique.
3. **Given** les énoncés Éducation rédigés par l'agent, **When** ils sont relus, **Then** chacun est une affirmation unique d'au plus 200 caractères, sans double négation, sans terme connoté, présupposition ni référence à une personne ou à un parti, et défendable aux deux extrémités de l'échelle.
4. **Given** les énoncés actifs du thème, **When** la validation s'exécute, **Then** leur nombre est au moins égal au quota maximal d'un thème prioritaire, chacune des trois dimensions de l'axe compte au moins 3 énoncés et la part de chaque polarité est comprise entre 40 % et 60 %.
5. **Given** un énoncé qui ne départage aucun candidat (toutes les positions connues identiques ou inconnues), **When** la banque est arrêtée, **Then** il est signalé au relecteur, qui le garde, le reformule ou l'écarte.

---

### User Story 4 - Publier sans casser les liens existants (Priority: P2)

En tant que visiteur qui a partagé un lien de résultats sur la version 1, je retrouve exactement les mêmes résultats après la publication de la version qui introduit Éducation, et la page Méthodologie présente les 18 thèmes.

**Why this priority**: la stabilité des liens est une promesse publique du projet (décision du 2026-11-06) ; la publication est l'étape qui rend le thème visible.

**Independent Test**: rejouer un échantillon de liens de la version 1 avant et après la publication et comparer les résultats ; ouvrir la page Méthodologie de la nouvelle version.

**Acceptance Scenarios**:

1. **Given** un lien de résultats de la version 1, **When** il est ouvert après la publication, **Then** il est rejoué sur la version 1 avec ses 17 thèmes et donne un résultat identique à celui d'avant.
2. **Given** la nouvelle version, **When** un répondant commence un questionnaire, **Then** il utilise la nouvelle version, avec 18 thèmes.
3. **Given** la nouvelle version, **When** le visiteur ouvre la page Méthodologie, **Then** il y lit les 18 thèmes dans l'ordre canonique, avec la description et l'axe d'Éducation.

---

### Edge Cases

- Un énoncé touche à la fois l'école et un autre thème (laïcité et Société, apprentissage et Travail) : il peut porter deux thèmes, Éducation étant principal ou secondaire selon son objet ; la polarité se lit toujours sur l'axe du thème principal.
- Un énoncé existant d'un autre thème porte en réalité sur l'école : il n'est ni modifié ni déplacé (002 FR-011) ; s'il doit changer de thème principal, c'est par retrait et création d'un nouvel énoncé dans la nouvelle version.
- Un candidat se prononce dans un programme général par une phrase vague (« l'école est une priorité ») : ce n'est pas une position sur un énoncé précis ; la position reste inconnue.
- Une mesure plus large que l'énoncé vaut ±1 ; une mesure renvoyée à un référendum ou à une convention ne donne pas de position (conventions du 2026-11-09).
- ChatGPT propose une source dont la citation n'existe pas ou dont l'URL ne répond pas : la source est écartée ; aucune citation n'est reprise de la réponse de ChatGPT sans vérification dans le texte téléchargé.
- Une source est une proposition de loi dont le candidat n'est que cosignataire, un programme de coalition ou un article qui paraphrase le candidat : elle est refusée (FR-013a).
- Un candidat se retire ou un nouveau candidat se déclare pendant la campagne : les règles de 002 s'appliquent (exclusion du jeu publié ou ajout avec ses positions Éducation à chercher).
- Une mesure n'est portée que par un seul candidat et personne ne s'y oppose explicitement : l'énoncé n'est retenu que si les sources permettent d'attendre un désaccord d'au moins un autre candidat (FR-008), sinon il est écarté.
- Un énoncé relève de deux dimensions de l'axe (par exemple, la gratuité de l'enseignement supérieur touche au choix et à la dépense) : il est rattaché à la dimension de son objet principal, et sa polarité doit rester la même sur les deux.

## Requirements *(mandatory)*

### Functional Requirements

**Ontologie**

- **FR-001**: L'ontologie DOIT comporter un thème d'identifiant `education`, de libellé « Éducation », avec la description courte : « École, de la maternelle au lycée, enseignants, voie professionnelle, enseignement supérieur et recherche. »
- **FR-002**: Le thème DOIT porter un axe à deux pôles factuels, sans étiquette partisane, qui réunit trois dimensions (décision du propriétaire du 2026-11-15) : (a) différenciation et liberté de choix ↔ école publique commune ; (b) maîtrise de la dépense publique ↔ moyens publics accrus ; (c) autorité, fondamentaux et discipline ↔ autonomie de l'élève et diversité des pédagogies. Formulation proposée, à valider à la relecture de l'ontologie : pôle négatif « École plus différenciée et plus exigeante, avec plus de choix pour les familles et une dépense publique maîtrisée » ; pôle positif « École plus commune et plus inclusive, avec plus de moyens publics et de liberté pédagogique ».
- **FR-002a**: Chaque énoncé Éducation DOIT être rattaché à l'une des trois dimensions de FR-002 ; sa polarité se lit sur le pôle de l'axe qui correspond à cette dimension. Chaque dimension DOIT compter au moins 3 énoncés actifs, et l'équilibre des polarités de 002 FR-012 s'applique au thème entier.
- **FR-003**: Le thème DOIT prendre la dernière position de l'ordre canonique (après `energie`), afin que les indices des 17 thèmes existants ne changent pas.
- **FR-004**: La spec 002 DOIT être amendée : FR-012 (cible de taille, voir FR-012 ci-dessous), FR-002 et les scénarios qui citent « seize thèmes » renvoient à la liste de l'ontologie (18 thèmes après cette fonctionnalité, dont `energie` ajouté le 2026-11-09 et `education`), et la section Assumptions consigne l'amendement daté. La spec 003 DOIT être mise à jour là où elle cite « 16 thèmes » comme valeur actuelle de `T`, sans changer aucune formule.

**Énoncés**

- **FR-005**: Les énoncés Éducation DOIVENT couvrir le périmètre du thème : petite enfance et maternelle ; primaire, collège et lycée (programmes, savoirs fondamentaux, examens, carte scolaire) ; enseignants (recrutement, formation, rémunération, statut) ; autorité et laïcité à l'école ; écrans ; enseignement privé sous contrat et instruction en famille ; voie professionnelle et orientation ; enseignement supérieur et recherche (frais d'inscription, sélection, bourses) ; école inclusive ; éducation prioritaire. Aucun sous-thème NE DOIT représenter plus du quart des énoncés.
- **FR-006**: Chaque énoncé Éducation DOIT respecter 002 FR-008 à FR-011 (format, grille de neutralité, validation par un relecteur distinct, énoncé figé après publication).
- **FR-007**: Le thème DOIT compter un nombre d'énoncés actifs au moins égal au quota maximal d'un thème prioritaire en mode complet avec 18 thèmes (13 selon 003 FR-021), au plus 17, avec une part de chaque polarité comprise entre 40 % et 60 % (002 FR-012).
- **FR-008**: Les énoncés DOIVENT être tirés des positions des candidats (décision du propriétaire du 2026-11-15) : la campagne de sources précède la rédaction ; chaque énoncé reprend une mesure ou un engagement précis trouvé dans une source attribuable, et n'est retenu que si les sources du corpus permettent d'attendre au moins un candidat déclaré de chaque côté de l'échelle (accord et désaccord). Le dossier de rédaction consigne, pour chaque énoncé, les sources et citations qui l'ont motivé. Un énoncé dont toutes les positions relues sont finalement identiques DOIT être signalé au relecteur avant publication.
- **FR-009**: Les énoncés sont rédigés par l'agent (`author: claude`) et relus par adrien ; une relecture adverse par un second modèle PEUT précéder la relecture humaine, comme pour les énoncés de la PR #13. La reformulation d'une mesure en énoncé neutre DOIT retirer le vocabulaire propre au candidat qui l'a portée (002 FR-009).

**Sources et positions**

- **FR-010**: La recherche de sources DOIT couvrir les 18 candidats déclarés et appliquer FR-013a sans exception. Les propositions obtenues avec le prompt ChatGPT DOIVENT être vérifiées une à une (URL accessible, texte conservé dans le cache, attribution, absence de doublon) ; aucune citation ni métadonnée proposée par ChatGPT n'est reprise sans contrôle dans la source téléchargée.
- **FR-011**: Les positions DOIVENT être extraites en session par l'agent (aucune exécution d'extraction payante), créées en brouillon, puis relues par adrien conformément à 002 FR-016 à FR-022. Les positions qu'un candidat a prises sur un énoncé Éducation dans des sources déjà au corpus DOIVENT aussi être recherchées.
- **FR-012**: L'amendement de 002 (FR-004) DOIT relever la cible de 002 FR-012 à 250 à 320 énoncés actifs (décision du propriétaire du 2026-11-15) ; aucun énoncé publié d'un autre thème n'est retiré pour faire place à Éducation.

**Publication et affichage**

- **FR-013**: Le thème DOIT être publié dans une nouvelle version de banque créée par la procédure de publication de 002 ; les versions antérieures restent inchangées et les liens qui les désignent sont rejoués sur elles (003, 005).
- **FR-014**: Dans la nouvelle version, Éducation DOIT apparaître partout où apparaissent les autres thèmes : choix des sujets prioritaires (004 FR-003 et FR-004), liste de questions et quotas (003), scores et couverture par thème, fiche candidat, comparaison et détail par question (005), page Méthodologie (002).
- **FR-015**: La nouvelle version PEUT être publiée même si la couverture Éducation de certains candidats est faible ou nulle (règle SC-003 de 002 amendée le 2026-11-14) ; la couverture est alors affichée comme pour les autres thèmes.

### Key Entities *(include if feature involves data)*

- **Thème Éducation** : identifiant `education`, libellé, description courte, axe à deux pôles réunissant trois dimensions, ordre canonique 17 (dernier), statut actif.
- **Énoncé Éducation** : un énoncé de la banque dont le thème principal ou secondaire est `education`, avec sa dimension d'axe, les sources qui l'ont motivé, sa polarité, sa grille de neutralité, son auteur, son relecteur et sa version d'introduction.
- **Source éducation** : une source au sens de 002 FR-013, attribuable selon FR-013a, conservée dans le cache local, avec l'origine de sa découverte (recherche de l'agent ou proposition ChatGPT vérifiée).
- **Position Éducation** : une position au sens de 002 FR-016 d'un candidat sur un énoncé Éducation, en brouillon puis relue.
- **Version de banque** : la nouvelle version qui introduit le thème ; elle fige les énoncés, les positions et les candidats.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Dans la nouvelle version, un répondant peut choisir Éducation comme sujet prioritaire et obtenir un score Éducation pour chaque candidat ayant au moins 2 positions exploitables, en suivant le même parcours que pour les autres thèmes.
- **SC-002**: Le thème compte entre 13 et 17 énoncés actifs, au moins 3 par dimension de l'axe, chaque polarité représentant 40 à 60 % d'entre eux, 100 % des énoncés sont reliés dans le dossier de rédaction aux sources qui les ont motivés, et 100 % des énoncés actifs portent une grille de neutralité cochée et un relecteur distinct de l'auteur.
- **SC-003**: Pour 100 % des 18 candidats déclarés, la recherche de sources éducation est consignée : au moins une source attribuable ajoutée, ou la liste des sources consultées sans résultat.
- **SC-004**: Au moins 12 des 18 candidats ont au moins 2 positions Éducation relues (seuil du score de thème), afin que le thème départage effectivement la majorité des candidats.
- **SC-005**: 100 % des positions Éducation publiées citent une source attribuable dont le texte en cache contient la citation mot pour mot ; aucune source refusée par FR-013a n'est publiée.
- **SC-006**: 100 % d'un échantillon d'au moins 20 liens de la version 1 (modes complet et court, combinaisons de sujets variées) donnent un résultat identique avant et après la publication.
- **SC-007**: La validation du corpus et la construction du jeu de données passent sans erreur sur la nouvelle version, et la sélection des questions respecte les quotas de 003 pour toute combinaison de 3 à 5 sujets prioritaires parmi 18 thèmes.

## Assumptions

- Le code du questionnaire, du score, de la sélection, du lien de partage et des résultats lit la liste des thèmes dans la version de banque ; aucun identifiant de thème n'y est écrit en dur (vérifié le 2026-11-15 : `energie` n'apparaît que dans les données). Si une liste fixe de thèmes est découverte (icône, traduction, test), son extension fait partie de cette fonctionnalité.
- 003 FR-021 accepte jusqu'à 20 thèmes ; avec 18, le mode court (25 questions, 5 sujets prioritaires) reste dans la limite.
- Le prompt ChatGPT de recherche de sources est rédigé (`.cache/education/prompt-chatgpt.md`, hors git) ; le propriétaire le soumet et transmet la réponse à l'agent.
- Les règles d'attribution (FR-013a), les conventions de positions du 2026-11-09 et la règle de publication sans seuil de couverture (SC-003 de 002, option A) s'appliquent telles quelles.
- La publication se fait après la fusion de la PR #20, afin que `data:publish` conserve les commentaires YAML des questions.
- Les énoncés existants des autres thèmes qui touchent à l'école ne sont pas déplacés dans cette fonctionnalité.

### Dependencies

- 002 : ontologie, banque, sources, positions, validation, publication.
- 003 : formules de quotas et de score, sans modification.
- 004 et 005 : affichage du thème, sans modification attendue.
- Fusion de la PR #20 avant la publication.

### Out of Scope

- Toute modification des formules de score, des quotas ou du format du lien de partage.
- La refonte ou le déplacement des énoncés existants d'autres thèmes.
- L'ajout d'autres thèmes.
- La traduction dans une autre langue que le français.
