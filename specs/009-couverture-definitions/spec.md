# Feature Specification: Couverture des candidats et définitions des termes

**Feature Branch**: `009-couverture-definitions`

**Created**: 2026-11-22

**Status**: Draft

**Input**: User description: "Ajouter des définitions pour des termes (par exemple aide médicale d'état, droit du sol, etc.) à l'aide d'un tool-tip avec une excellente UX. J'ai encore fait un test, et à nouveau JL Mélenchon et Marine Tondelier sont les seuls candidats à avoir suffisamment de sources pour pouvoir rentrer dans ma boussole. Comment fait un site comme monvote2027.fr/donnees ? Est-ce qu'un site comme candidatspresidentielles2027.fr peut être utilisé comme source ? Privilégier un jeu de questions permettant d'intégrer un maximum de candidats dans l'indice de proximité." (demande recopiée telle quelle dans [demande.md](demande.md))

Décisions du propriétaire (2026-11-22) : une seule spec avec deux récits livrables séparément ; trois leviers pour la couverture : **sélection par couverture**, **campagne ciblée de sourçage**, **banque resserrée** ; le seuil de couverture de 60 % (003 FR-008) **n'est pas modifié**.

## Vocabulaire

- **Couverture d'une question** : nombre de candidats inclus dans la version pour lesquels une position relue et sourcée est connue sur cette question.
- **Couverture d'un candidat pour un répondant** : part des questions auxquelles le répondant a donné une réponse numérique pour lesquelles la position du candidat est connue (003 FR-008, inchangée). En dessous de 60 %, le candidat est « données insuffisantes » et n'entre pas dans le classement.
- **Banque active** : les questions qu'une version propose à la sélection. **Réserve** : les questions du corpus conservées, mais non publiées dans la version.
- **Terme défini** : mot ou expression du glossaire (« aide médicale de l'État », « droit du sol »…) repéré dans les énoncés et accompagné d'une définition.
- **Agrégateur** : site tiers qui résume ou compile les positions des candidats (monvote2027.fr, candidatspresidentielles2027.fr…), par opposition à une **source primaire** (programme, déclaration, entretien, vote, publication du candidat ou de son équipe).

## Contexte

### Pourquoi presque aucun candidat n'entre dans la boussole

Mesures sur la version 4 publiée (310 questions actives, 18 candidats) :

- La couverture moyenne d'un candidat sur la banque est d'environ 30 % ; seuls Jean-Luc Mélenchon (62 %) et Marine Tondelier (59 %) approchent le seuil de 60 %. Delphine Batho est à 6,5 %, Nathalie Arthaud à 12,6 %.
- Une question est connue en moyenne pour 5 à 6 candidats sur 18 ; 14 questions ne sont connues pour aucun, 38 seulement le sont pour au moins 10 candidats. Le thème Sécurité n'a aucune question connue pour plus de 5 candidats.
- La sélection de 007 retient dans chaque thème la question au plus grand pouvoir discriminant, sans tenir compte de sa couverture : elle choisit souvent des questions que la plupart des candidats n'ont jamais abordées.

Simulation sur la version 4, répondant qui répond à tout, règles d'équilibre de 007 conservées :

| Thèmes prioritaires | Mode | Candidats classés (règles 007) | En retenant d'abord la question la mieux couverte |
|---|---|---|---|
| Économie, Immigration, Travail | court | 8 | 12 |
| Éducation, Environnement, Institutions | court | 5 | 11 |
| Sécurité, Santé, Société | court | 5 | 8 |
| (les trois cas ci-dessus) | complet | 2 à 3 | 3 à 5 |

La sélection seule suffit presque en mode court ; en mode complet, le corpus est trop dispersé (310 questions pour 18 candidats). Les 100 questions les mieux couvertes ne suffisent encore qu'à 6 candidats : il faut aussi combler les trous du corpus là où ils rapportent le plus.

### Ce que fait MonVote2027

D'après ses pages Données et Méthodologie (lues le 2026-11-22) : 22 candidats, environ 100 questions, positions tirées des programmes, déclarations et entretiens, votes au Parlement et prises de position médiatiques, sourcées question par question sur une page par candidat. « Neutre » est une position sourcée ; une position inconnue n'est pas comptée. Pas d'imputation depuis le parti, et **pas de seuil de couverture** : un candidat peu renseigné est comparé sur moins de questions, avec un score « plus fragile ». radar-2027 garde son seuil (décision du propriétaire) ; il rapproche surtout sa banque de la taille de celle de MonVote2027 et en améliore la couverture.

### candidatspresidentielles2027.fr comme source

Le site se présente comme une synthèse des positions des candidats, sans éditeur ni responsable de publication identifiés, sans licence de réutilisation ni date de mise à jour visibles. Il ne peut pas servir de source au sens de la constitution (principe I) : un agrégateur peut seulement **orienter** la recherche vers une source primaire, qui doit être ouverte, vérifiée et citée à sa place. La même règle vaut pour MonVote2027 et tout autre agrégateur.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Être comparé à la plupart des candidats (Priority: P1)

En tant que répondant, quand je termine le questionnaire, la plupart des candidats déclarés figurent dans mon classement de proximité, et non deux seulement.

**Why this priority**: c'est le défaut constaté à chaque test du propriétaire ; un indice de proximité qui ne compare qu'à deux candidats n'a pas de valeur.

**Independent Test**: sur la nouvelle version, calculer la sélection et les scores pour toutes les combinaisons de thèmes prioritaires, dans les deux modes, pour un répondant qui répond à toutes les questions, et compter les candidats classés.

**Acceptance Scenarios**:

1. **Given** deux questions éligibles pour un thème, d'enjeux différents, connues respectivement pour 13 et 7 candidats, **When** la sélection choisit, **Then** elle retient celle connue pour 13 candidats, quel que soit leur pouvoir discriminant.
2. **Given** deux questions éligibles de même couverture, **When** la sélection choisit, **Then** elle départage par le pouvoir discriminant, puis par l'identifiant, comme en 007.
3. **Given** la nouvelle version, le mode court et les thèmes prioritaires Économie, Immigration et Travail, **When** le répondant répond à toutes les questions, **Then** au moins 12 candidats sont classés.
4. **Given** la nouvelle version, **When** la sélection est calculée, **Then** les garanties de 007 tiennent toujours : au plus une question par enjeu, au moins le plancher de questions ancrées sur chaque thème.
5. **Given** un candidat dont la couverture reste sous 60 % pour ce répondant, **When** les résultats s'affichent, **Then** il apparaît en « données insuffisantes » comme aujourd'hui.

---

### User Story 2 - Une banque resserrée sur les questions renseignées (Priority: P1)

En tant que propriétaire, je publie une version dont la banque active ne garde que les questions connues pour un nombre suffisant de candidats ; les autres passent en réserve et peuvent revenir quand elles auront été sourcées.

**Why this priority**: en mode complet, la sélection ne peut pas compenser une banque où la plupart des questions ne sont connues que pour quelques candidats ; c'est le levier qui rapproche radar-2027 de MonVote2027.

**Independent Test**: appliquer la règle de resserrement au corpus, vérifier le nombre de questions actives, l'absence de question sous le minimum de couverture, et le nombre d'enjeux distincts par thème.

**Acceptance Scenarios**:

1. **Given** le corpus relu et le minimum de couverture fixé pour la version, **When** la banque active est calculée, **Then** elle ne contient aucune question connue pour moins de candidats que ce minimum.
2. **Given** un thème qui n'aurait plus assez d'enjeux distincts pour le plancher du mode complet, **When** la banque est resserrée, **Then** ses questions les mieux couvertes sont conservées jusqu'au plancher, et un avertissement nomme le thème.
3. **Given** une question mise en réserve, **When** une campagne de sourçage la fait passer au-dessus du minimum, **Then** elle redevient active dans la version publiée suivante, sans autre intervention qu'une publication.
4. **Given** les versions 1 à 4, **When** un lien de résultats de ces versions est ouvert, **Then** il est rejoué sur sa version, avec ses règles, et donne un résultat identique à celui d'avant la mise en production.

---

### User Story 3 - Combler en priorité les trous qui rapportent le plus (Priority: P2)

En tant que propriétaire, je dispose d'une liste ordonnée des positions manquantes (candidat × question) dont le sourçage ferait entrer le plus de candidats dans la boussole, et le sous-agent de recherche les traite dans cet ordre, à partir de sources primaires uniquement.

**Why this priority**: la sélection et le resserrement exploitent le corpus existant ; seul le sourçage augmente durablement la couverture, mais il coûte du temps de recherche et de relecture : il faut le diriger.

**Independent Test**: générer la liste sur la version courante, vérifier son ordre, lancer une mission sur ses premières lignes et vérifier que les positions obtenues suivent le circuit de relecture habituel.

**Acceptance Scenarios**:

1. **Given** le corpus et la banque active, **When** la liste des trous est générée, **Then** chaque ligne indique le candidat, la question, la couverture actuelle de la question et du candidat, et les lignes sont classées par gain attendu (candidats les plus proches du seuil et questions les plus souvent sélectionnées d'abord).
2. **Given** une ligne de la liste, **When** le sous-agent de recherche la traite, **Then** il produit soit une position assortie d'une source primaire vérifiée, soit le constat documenté qu'aucune position publique n'a été trouvée ; il n'invente jamais de position et n'en déduit aucune du parti.
3. **Given** une piste trouvée sur un agrégateur (candidatspresidentielles2027.fr, monvote2027.fr…), **When** elle est utilisée, **Then** la preuve enregistrée cite la source primaire vers laquelle l'agrégateur renvoie, ouverte et vérifiée ; l'agrégateur seul est rejeté par la validation.
4. **Given** des positions issues de la campagne, **When** elles n'ont pas été relues par le propriétaire, **Then** elles n'entrent dans aucun calcul ni aucune version publiée.

---

### User Story 4 - Comprendre un terme technique sans quitter la question (Priority: P2)

En tant que répondant, quand un énoncé emploie un terme technique (« aide médicale de l'État », « droit du sol », « 49.3 »…), je vois qu'il est défini et j'en lis la définition d'un geste, sans perdre ma question ni enregistrer de réponse par erreur.

**Why this priority**: répondre à une question qu'on ne comprend pas fausse le positionnement ; la définition sur place évite d'aller chercher ailleurs et d'abandonner le questionnaire.

**Independent Test**: ouvrir une question qui contient un terme du glossaire, à la souris, au clavier, au toucher à 320 px de large et avec un lecteur d'écran, et vérifier l'affichage, la fermeture et l'absence d'effet sur les réponses.

**Acceptance Scenarios**:

1. **Given** une question dont l'énoncé contient « aide médicale de l'État », **When** elle s'affiche, **Then** le terme est visiblement signalé comme défini, sans gêner la lecture de l'énoncé.
2. **Given** un terme signalé, **When** le répondant le touche ou le clique, **Then** la définition s'affiche à côté du terme, entière, lisible et dans l'écran, avec sa source ; un nouveau geste sur le terme, un geste en dehors, un bouton de fermeture ou la touche Échap la ferment.
3. **Given** un pointeur de souris, **When** le répondant survole le terme un court instant, **Then** la définition s'affiche, et reste ouverte tant que le pointeur est sur le terme ou sur la définition.
4. **Given** la navigation au clavier, **When** le répondant atteint le terme, **Then** il peut ouvrir la définition, la lire et la fermer, et le focus revient au terme.
5. **Given** un lecteur d'écran, **When** le terme est atteint, **Then** il est annoncé comme ayant une définition, et la définition est lisible.
6. **Given** une définition ouverte, **When** le répondant agit, **Then** aucune réponse n'est enregistrée tant qu'il n'a pas choisi explicitement un bouton de réponse, et la définition ne masque jamais durablement ces boutons.

---

### User Story 5 - Des définitions neutres, sourcées et relues (Priority: P3)

En tant que propriétaire, je dispose d'un glossaire dont chaque définition est factuelle, courte, sourcée par une référence institutionnelle et relue par moi avant publication, et d'une page Glossaire qui les rassemble.

**Why this priority**: une définition orientée serait une entorse à la neutralité (principe I) plus insidieuse qu'un énoncé orienté ; elle doit suivre la même discipline que les positions.

**Independent Test**: faire valider le glossaire : une définition sans source, trop longue ou non relue doit faire échouer la validation ; la page Glossaire liste toutes les définitions publiées.

**Acceptance Scenarios**:

1. **Given** les énoncés de la banque active, **When** l'agent prépare le glossaire initial, **Then** il produit un inventaire des termes techniques candidats (sigles, dispositifs, procédures, notions juridiques), avec une définition proposée et sa source pour chacun, dans un dossier de relecture.
2. **Given** une définition non relue, sans source ou au-delà de la longueur maximale, **When** la validation s'exécute, **Then** elle échoue en nommant le terme.
3. **Given** le glossaire publié, **When** le visiteur ouvre la page Glossaire, **Then** il y trouve tous les termes, dans l'ordre alphabétique, avec leur définition et leur source.

### Edge Cases

- Un terme apparaît deux fois dans un énoncé : seule la première occurrence est signalée.
- Deux termes se chevauchent (« droit du sol » et « droit ») : le plus long l'emporte ; un terme n'est jamais signalé à l'intérieur d'un autre.
- Variantes d'écriture (pluriel, majuscule initiale, sigle « AME » et forme longue) : chaque terme déclare ses formes reconnues ; une forme non déclarée n'est pas signalée.
- Énoncé d'une ancienne version rejoué par un lien partagé : les définitions courantes s'y appliquent, sans aucun effet sur le score ni sur la sélection.
- Définition ouverte quand le répondant passe à la question suivante : elle se ferme.
- Définition longue sur un écran de 320 px : elle reste entièrement lisible sans défilement horizontal.
- Un candidat reste sous le seuil malgré la sélection et la campagne (Delphine Batho, Nathalie Arthaud) : il reste « données insuffisantes » ; aucune règle ne force son classement.
- Le répondant passe beaucoup de questions : la couverture se calcule sur ses seules réponses numériques, comme aujourd'hui ; le nombre de candidats classés peut baisser.
- Le resserrement ferait passer la banque sous le nombre de questions du mode complet : le mode complet propose une question par enjeu disponible (007 FR-012), sans erreur.
- Un candidat se retire ou un nouveau candidat est inclus : la couverture des questions est recalculée sur les candidats inclus dans la version.
- Une piste d'agrégateur renvoie vers une source introuvable ou qui ne dit pas ce que l'agrégateur affirme : aucune position n'est enregistrée, le constat est consigné.

## Requirements *(mandatory)*

### Functional Requirements

#### Sélection par couverture

- **FR-001**: La couverture de chaque question active DOIT être calculée lors de la publication sur les seuls candidats inclus dans la version et les seules positions relues, et publiée avec la question.
- **FR-002**: Dans les deux passages de la sélection (007 FR-010 et FR-011), parmi les questions éligibles d'un thème, le système DOIT retenir la question à la plus grande couverture, puis au plus grand pouvoir discriminant, puis au plus petit identifiant. Toutes les autres règles de 007 (quotas, ancrage, une question par enjeu, ordre de rotation, ordre de présentation, déterminisme) DOIVENT rester inchangées.
- **FR-003**: Les nouvelles règles DOIVENT s'appliquer à partir de la première version qui les déclare ; les versions 1 à 4 DOIVENT conserver leurs règles, et tout lien de ces versions DOIT être rejoué à l'identique.
- **FR-004**: Le calcul du score, le seuil de couverture de 60 % et les écrans de résultats NE DOIVENT PAS changer.

#### Banque resserrée

- **FR-005**: Chaque version publiée DOIT déclarer un minimum de couverture de question ; seules les questions dont la couverture atteint ce minimum DOIVENT être publiées dans la banque active, les autres restant en réserve dans le corpus, avec leurs positions et leurs sources.
- **FR-006**: Le minimum DOIT être choisi de sorte que la banque active compte au plus 120 questions et que chaque thème garde au moins autant d'enjeux distincts que le plancher du mode complet ; si un thème n'y parvient pas, ses questions les mieux couvertes DOIVENT être conservées jusqu'à ce plancher, et la publication DOIT émettre un avertissement qui nomme le thème.
- **FR-007**: La mise en réserve NE DOIT modifier ni l'énoncé, ni les thèmes, ni l'enjeu, ni les positions d'une question ; une question en réserve redevient active dès qu'une version publiée la voit atteindre le minimum.
- **FR-008**: La publication DOIT produire un rapport qui donne, pour la version : le nombre de questions actives et en réserve par thème, la couverture de chaque candidat sur la banque active, et le nombre de candidats classés en mode court et complet pour un répondant qui répond à tout, au minimum, à la médiane et au maximum sur toutes les combinaisons de thèmes prioritaires.

#### Campagne ciblée de sourçage

- **FR-009**: Le système DOIT générer la liste des positions manquantes (candidat inclus × question du corpus, active ou en réserve), chacune avec la couverture de la question, la couverture du candidat et un gain attendu ; la liste DOIT être ordonnée par gain attendu décroissant, en favorisant les candidats sous le seuil les plus proches de 60 % et les questions qui sont ou deviendraient actives.
- **FR-010**: Le sous-agent de recherche (008) DOIT pouvoir recevoir des lignes de cette liste comme missions et produire, pour chacune, une preuve conforme aux règles de 008 ou un constat d'absence de position publique, consigné pour ne pas refaire la recherche.
- **FR-011**: Un agrégateur NE DOIT jamais être enregistré comme source d'une position ou d'une preuve ; il PEUT être consigné comme piste à côté de la source primaire qu'il a permis de trouver. La validation DOIT échouer pour une preuve dont la seule source est un domaine déclaré comme agrégateur, et la liste des domaines agrégateurs DOIT inclure au moins candidatspresidentielles2027.fr et monvote2027.fr.
- **FR-012**: Aucune position ne DOIT être déduite du parti, d'un soutien ou d'une position collective ; une position issue de la campagne n'entre dans les calculs et les versions publiées qu'après relecture par le propriétaire, comme toute position (002).

#### Définitions des termes

- **FR-013**: Le corpus DOIT comporter un glossaire : pour chaque terme, un libellé, les formes reconnues dans les énoncés (variantes, sigle), une définition d'au plus 280 caractères, au moins une source institutionnelle ou juridique (texte de loi, administration, institution publique) et l'état de relecture.
- **FR-014**: Une définition DOIT être factuelle et neutre : elle décrit ce qu'est le dispositif ou la notion selon le droit et les sources officielles, sans jugement, sans chiffre polémique non sourcé, et sans mention de la position d'un candidat ou d'un parti. Seules les définitions relues par le propriétaire DOIVENT être publiées.
- **FR-015**: La validation DOIT échouer pour un terme sans source, sans source institutionnelle ou juridique (domaine de la liste déclarée), au-delà de la longueur maximale, sans forme reconnue, ou dont une forme est en conflit avec celle d'un autre terme ; elle DOIT signaler en avertissement un terme publié qui n'apparaît dans l'énoncé d'aucune question active du corpus.
- **FR-016**: Dans l'énoncé de chaque question affichée au questionnaire et dans le détail des réponses des résultats, la première occurrence de chaque terme défini DOIT être signalée par un repère visuel discret et cohérent dans tout le site, qui ne repose pas sur la seule couleur ; en cas de chevauchement, la forme la plus longue l'emporte.
- **FR-017**: La définition DOIT s'ouvrir par un toucher ou un clic sur le terme, par le clavier lorsque le terme a le focus, et par un survol bref à la souris ; elle DOIT se fermer par un nouveau geste sur le terme, un geste en dehors, un bouton de fermeture, la touche Échap, ou le passage à une autre question, le focus revenant au terme lorsqu'il était dans la définition.
- **FR-018**: La définition affichée DOIT montrer le libellé, la définition et la source, tenir entièrement dans l'écran dès 320 px de large sans défilement horizontal, ne jamais masquer durablement les boutons de réponse, et ne jamais enregistrer de réponse ni modifier l'état du questionnaire ou l'URL.
- **FR-019**: Le terme signalé DOIT être annoncé aux technologies d'assistance comme porteur d'une définition, et la définition DOIT leur être lisible ; une seule définition est ouverte à la fois.
- **FR-020**: Le site DOIT exposer une page Glossaire qui liste tous les termes publiés par ordre alphabétique, avec définition et source, accessible depuis chaque définition affichée et depuis la page Méthodologie.
- **FR-021**: Le glossaire NE DOIT avoir aucun effet sur la sélection, le score ni le lien de partage ; il s'applique aux énoncés de toutes les versions, y compris celles rejouées par un lien.
- **FR-022**: L'agent DOIT préparer le glossaire initial à partir des énoncés de la banque active : un inventaire des termes techniques avec définition et source proposées, et la liste des termes écartés avec le motif, dans un dossier de relecture soumis au propriétaire.

#### Transparence

- **FR-023**: La page Méthodologie DOIT expliquer, pour la version affichée : que la sélection privilégie les questions renseignées pour le plus de candidats, le minimum de couverture de la banque active, et que les agrégateurs servent de pistes, jamais de sources.

### Key Entities

- **Question** : gagne une couverture publiée (nombre de candidats renseignés dans la version) et un statut active / réserve par version ; énoncé, thèmes, enjeu et positions inchangés.
- **Version de banque** : déclare ses règles de sélection (une nouvelle valeur pour la sélection par couverture) et son minimum de couverture de question.
- **Position manquante** : couple candidat × question sans position relue, avec couverture de la question, couverture du candidat, gain attendu, et éventuellement un constat d'absence de position publique.
- **Agrégateur** : domaine déclaré comme compilation secondaire ; peut figurer comme piste, jamais comme source.
- **Terme du glossaire** : libellé, formes reconnues, définition courte, sources, état de relecture ; indépendant des versions de banque.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Sur la première version publiée avec ces règles, pour un répondant qui répond à toutes les questions en mode court, au moins 10 des 18 candidats inclus sont classés pour chaque combinaison de thèmes prioritaires, et au moins 12 à la médiane (contre 5 à 8 sur la version 4).
- **SC-002**: Sur la même version, en mode complet, au moins 8 candidats sont classés pour chaque combinaison de thèmes prioritaires, et au moins 10 à la médiane (contre 2 à 5 sur la version 4).
- **SC-003**: 100 % des sélections de la nouvelle version respectent les garanties de 007 (une question par enjeu, plancher par thème), et 100 % des liens des versions 1 à 4 rejoués donnent un résultat identique.
- **SC-004**: 0 position ou preuve publiée n'a pour seule source un agrégateur ; 100 % des positions issues de la campagne sont relues avant publication.
- **SC-005**: 100 % des occurrences des termes publiés dans les énoncés actifs sont signalées (première occurrence par énoncé), et chaque définition s'ouvre en un seul geste à la souris, au toucher et au clavier.
- **SC-006**: 0 violation d'accessibilité automatique sur une question qui contient un terme défini, définition ouverte et fermée, à 320 px et en bureau ; aucune réponse n'est enregistrée par l'ouverture ou la fermeture d'une définition.
- **SC-007**: Le glossaire initial couvre au moins 20 termes, dont « aide médicale de l'État » et « droit du sol », et 100 % des définitions publiées ont une source et ont été relues par le propriétaire.

## Assumptions

- Le seuil de couverture de 60 % reste inchangé (décision du propriétaire) ; l'option d'un seuil assoupli à la manière de MonVote2027 est écartée pour cette spec.
- Le plafond de 120 questions actives et les objectifs de SC-001 et SC-002 sont des valeurs par défaut fondées sur la simulation de la version 4 ; ils pourront être ajustés en clarification ou au vu du rapport de publication (FR-008). Les objectifs de SC-002 supposent qu'au moins une campagne ciblée a été menée et relue avant la publication.
- Les définitions sont rédigées par l'agent et relues par le propriétaire, comme les positions ; aucune extraction payante (pipeline `data:extract`) n'est utilisée, conformément à la pratique du projet.
- Le glossaire n'est pas figé par version : corriger une définition n'impose pas de nouvelle version de banque, puisqu'il n'a aucun effet sur les scores ni les liens.
- Les termes sont signalés dans les énoncés des questions (questionnaire et détail des résultats) ; les descriptions de thèmes, les citations de candidats et les pages éditoriales sont hors périmètre.
- Les deux récits (couverture, définitions) sont livrables séparément ; la couverture (US1 à US3) est prioritaire.
- La campagne ciblée réutilise le sous-agent et les règles de recherche de 008 ; elle ne crée pas de nouveau circuit de relecture.
