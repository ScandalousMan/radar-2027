# Feature Specification: Parcours questionnaire

**Feature Branch**: `004-parcours-questionnaire`

**Created**: 2026-11-06

**Status**: Draft

**Input**: User description: "Parcours questionnaire : choix des sujets clés, mode, réponses"

Cette fonctionnalité couvre tout ce que vit le répondant entre son arrivée sur le site et
l'affichage de ses résultats : la page d'accueil, le choix de ses sujets clés, le choix du mode,
l'enchaînement des questions, la reprise d'un questionnaire interrompu et le passage aux résultats.
Le calcul du score et l'encodage de l'URL (spécification 003), la page de résultats et le partage
(spécification 005) et le contenu de la banque de questions (spécification 002) sont hors périmètre.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Répondre à un questionnaire de bout en bout (Priority: P1)

Un électeur arrive sur le site, comprend en une phrase ce que fait l'outil et qu'aucune de ses
réponses ne quitte son appareil, choisit entre 3 et 5 sujets qui comptent le plus pour lui,
choisit un mode (court ou complet), répond aux questions une par une, puis accède à ses résultats.

**Why this priority**: c'est la raison d'être de l'application ; sans ce parcours, aucun résultat
ne peut être produit. Il constitue à lui seul un produit minimal viable.

**Independent Test**: peut être testé intégralement en partant de l'accueil, en choisissant
4 sujets clés et le mode court, en répondant à chaque question, et en vérifiant que l'écran de fin
transmet un état complet aux résultats. Le même test est rejoué en mode complet.

**Acceptance Scenarios**:

1. **Given** un visiteur sans questionnaire en cours, **When** il ouvre la page d'accueil,
   **Then** il voit une phrase expliquant ce que fait l'outil, une promesse de confidentialité
   indiquant que rien n'est envoyé à un serveur, un accès à la page Méthodologie et un bouton de
   démarrage.
2. **Given** l'écran de choix des sujets clés, **When** le visiteur n'a encore rien sélectionné,
   **Then** la liste complète des thèmes (libellé et description courte) est affichée, un compteur
   indique « 0 / 5 », une explication précise que les sujets clés pèsent trois fois plus et
   plafonnent le score global, et le bouton de poursuite est inactif.
3. **Given** l'écran de choix des sujets clés avec 2 thèmes sélectionnés, **When** le visiteur
   tente de poursuivre, **Then** il ne peut pas et un message lui indique qu'il doit choisir au
   moins 3 sujets.
4. **Given** 5 thèmes sélectionnés, **When** le visiteur tente d'en sélectionner un sixième,
   **Then** la sélection est refusée et un message lui indique qu'il peut choisir au plus 5 sujets ;
   il peut en désélectionner un pour en choisir un autre.
5. **Given** entre 3 et 5 thèmes sélectionnés, **When** le visiteur poursuit, **Then** il arrive
   sur l'écran de choix du mode qui présente le mode court (environ 25 questions, environ
   3 minutes) et le mode complet (au plus 100 questions, environ 10 minutes), avec l'indication que
   le mode court ne détaille que les sujets clés.
6. **Given** un mode choisi, **When** le questionnaire démarre, **Then** la première question
   s'affiche seule, avec son énoncé, le ou les thèmes auxquels elle appartient, la progression
   « 1 / N » où N est le nombre total de questions du parcours, les cinq niveaux de réponse et
   l'action « Passer cette question ».
7. **Given** une question affichée, **When** le répondant choisit un niveau de réponse,
   **Then** la question suivante s'affiche et la progression passe à « n+1 / N ».
8. **Given** la dernière question répondue ou passée, **When** le répondant valide, **Then** il
   arrive sur un écran de fin qui lui permet d'accéder aux résultats avec l'état complet du
   questionnaire (version de banque, mode, sujets clés, réponse à chaque question).
9. **Given** des sujets clés et un mode identiques, **When** deux répondants démarrent chacun un
   questionnaire sur la même version de banque, **Then** ils voient exactement les mêmes questions
   dans le même ordre, quelles que soient leurs réponses.

---

### User Story 2 - Naviguer, passer et corriger ses réponses (Priority: P2)

Le répondant peut passer une question sans y répondre, revenir en arrière pour relire ou modifier
une réponse déjà donnée, voir à tout moment où il en est, et terminer même s'il a passé des
questions. S'il a trop peu répondu pour qu'un calcul soit fiable, il en est averti avant d'afficher
les résultats, sans être bloqué.

**Why this priority**: sans ces possibilités, une erreur de clic est irréversible et un
répondant hésitant est contraint de répondre ; la confiance dans le résultat en souffre.
Ce bloc s'ajoute au parcours nominal sans le modifier.

**Independent Test**: peut être testé en démarrant un questionnaire, en passant plusieurs
questions, en revenant de deux questions en arrière pour changer une réponse, puis en terminant
avec un sujet clé presque entièrement passé pour déclencher l'avertissement.

**Acceptance Scenarios**:

1. **Given** une question affichée, **When** le répondant choisit « Passer cette question »,
   **Then** la question est marquée « passée », la question suivante s'affiche et la progression
   avance d'un cran.
2. **Given** le répondant est à la question n (n > 1), **When** il demande la question
   précédente, **Then** la question n−1 s'affiche avec la réponse (ou l'état « passée »)
   qu'il avait donnée, visiblement présélectionnée.
3. **Given** une question précédente affichée avec une réponse existante, **When** le répondant
   choisit un autre niveau, **Then** la nouvelle réponse remplace l'ancienne et il peut avancer
   jusqu'à la première question à laquelle il n'a pas encore répondu.
4. **Given** le répondant est à la première question, **When** il demande la question
   précédente, **Then** l'action n'est pas proposée (ou est inactive) et il reste sur la première
   question.
5. **Given** un questionnaire terminé où au moins un sujet clé compte moins de 2 réponses non
   passées, **When** le répondant arrive sur l'écran de fin, **Then** un avertissement nomme
   le ou les sujets concernés, lui propose de revenir compléter ses réponses, et lui laisse malgré
   tout la possibilité d'afficher ses résultats.
6. **Given** un questionnaire terminé où chaque sujet clé compte au moins 2 réponses non
   passées, **When** le répondant arrive sur l'écran de fin, **Then** aucun avertissement n'est
   affiché et l'accès aux résultats est direct.

---

### User Story 3 - Reprendre un questionnaire interrompu (Priority: P3)

Un répondant qui ferme l'onglet, change d'application ou perd sa connexion en cours de
questionnaire retrouve, à son retour, la proposition de reprendre là où il s'était arrêté ou de
recommencer. Rien n'a été envoyé à un serveur ; il peut effacer ces données de son appareil.

**Why this priority**: un questionnaire de 100 questions est souvent interrompu, surtout sur
mobile ; perdre ses réponses est la première cause d'abandon. La fonctionnalité est utile même si
seul le parcours nominal existe.

**Independent Test**: peut être testé en répondant à 10 questions, en fermant puis en rouvrant
le site, en choisissant « Reprendre » et en vérifiant que la onzième question s'affiche avec les
10 réponses conservées ; puis en choisissant « Effacer » et en vérifiant qu'il ne reste aucune
trace sur l'appareil.

**Acceptance Scenarios**:

1. **Given** un questionnaire en cours (au moins une question affichée), **When** le répondant
   quitte le site de n'importe quelle façon, **Then** ses sujets clés, son mode, sa version de
   banque, ses réponses et sa position courante sont mémorisés sur son appareil, et aucune de ces
   données n'est transmise à un serveur.
2. **Given** un questionnaire en cours mémorisé, **When** le répondant revient sur l'accueil,
   **Then** il lui est proposé de reprendre, de recommencer ou d'effacer, avec un rappel du mode,
   du nombre de questions déjà traitées sur le total et de la date de la dernière réponse.
3. **Given** la proposition de reprise, **When** le répondant choisit « Reprendre »,
   **Then** il retrouve la question à laquelle il s'était arrêté, avec toutes ses réponses et
   questions passées intactes et la même liste de questions dans le même ordre.
4. **Given** la proposition de reprise, **When** le répondant choisit « Recommencer »,
   **Then** le questionnaire mémorisé est effacé après confirmation et il repart du choix des
   sujets clés.
5. **Given** la proposition de reprise, **When** le répondant choisit « Effacer »,
   **Then** toute donnée de questionnaire disparaît de l'appareil après confirmation et l'accueil
   s'affiche comme pour un premier visiteur.
6. **Given** un questionnaire mémorisé sur une version de banque qui n'est plus celle du site,
   **When** le répondant revient, **Then** il est informé que le questionnaire ne peut pas être
   repris tel quel et il lui est proposé de recommencer ; rien n'est effacé sans sa confirmation.
7. **Given** un appareil dont la mémorisation locale est indisponible ou refusée,
   **When** le répondant parcourt le questionnaire, **Then** le parcours fonctionne normalement
   et il est prévenu, au démarrage, que sa progression ne sera pas conservée s'il quitte le site.

---

### User Story 4 - Changer de sujets clés ou de mode en cours de route (Priority: P4)

Après avoir commencé à répondre, le répondant réalise qu'il a mal choisi ses sujets clés ou qu'il
préfère l'autre mode. Il peut revenir sur ce choix ; comme la liste des questions en dépend, le
questionnaire est réinitialisé après qu'il a confirmé.

**Why this priority**: cas minoritaire mais nécessaire à la cohérence : la liste des questions
ne dépend que des sujets clés et du mode, aucune réponse ne peut donc survivre à leur changement.

**Independent Test**: peut être testé en répondant à 5 questions, en demandant à modifier les
sujets clés, en confirmant, et en vérifiant que la progression repart à « 1 / N » avec une liste
de questions correspondant aux nouveaux sujets.

**Acceptance Scenarios**:

1. **Given** une question affichée, **When** le répondant demande à modifier ses sujets clés ou
   son mode, **Then** une confirmation lui indique que ses réponses en cours seront perdues et
   lui permet d'annuler.
2. **Given** la confirmation affichée, **When** le répondant annule, **Then** il revient à la
   question où il était, sans aucune perte.
3. **Given** la confirmation affichée, **When** le répondant confirme, **Then** ses réponses
   sont effacées (y compris de la mémorisation sur l'appareil), il revient sur l'écran de choix
   concerné avec sa sélection précédente préremplie, et un nouveau questionnaire démarre à sa
   validation.
4. **Given** l'écran de choix des sujets clés rouvert depuis un questionnaire en cours,
   **When** le répondant revalide exactement les mêmes sujets et le même mode sans avoir confirmé
   la réinitialisation, **Then** il retrouve son questionnaire là où il l'avait laissé.

---

### Edge Cases

- Le répondant ferme le site pendant le choix des sujets ou du mode, avant la première question :
  rien n'est mémorisé ; il repart de l'accueil comme un premier visiteur.
- Le répondant passe toutes les questions : l'écran de fin affiche l'avertissement pour chacun de
  ses sujets clés et l'accès aux résultats reste possible.
- Un thème dispose de moins de questions que prévu dans la banque : le nombre total N affiché dès
  la première question reflète la liste réellement constituée ; le répondant n'est jamais confronté
  à un « N » qui change en cours de route.
- Une question appartient à deux thèmes : les deux sont affichés, le ou les sujets clés étant
  distingués des autres thèmes.
- Le répondant utilise le bouton « précédent » de son navigateur pendant le questionnaire : il
  revient à la question précédente, jamais à un écran incohérent ni à une perte de réponses.
- Le répondant actionne deux fois très vite le même niveau de réponse : une seule question est
  avancée ; aucune réponse n'est attribuée à la mauvaise question.
- Le répondant a le site ouvert dans deux onglets : la dernière réponse enregistrée l'emporte ;
  à la reprise, l'état proposé est le plus récent.
- Le répondant agrandit le texte à 200 % ou utilise un écran de 320 px : tous les niveaux de
  réponse, l'action « Passer », la progression et la navigation restent visibles et actionnables
  sans défilement horizontal.
- Le répondant arrive directement sur l'adresse d'une question sans avoir choisi de sujets clés
  ni de mode : il est renvoyé à l'étape manquante, sans message d'erreur technique.
- Le répondant revient sur l'écran de fin puis à la dernière question : ses réponses sont
  intactes et l'écran de fin est recalculé à son retour.

## Requirements *(mandatory)*

### Functional Requirements

**Accueil**

- **FR-001**: L'accueil DOIT présenter en une phrase ce que fait l'outil, une promesse de
  confidentialité indiquant explicitement qu'aucune réponse n'est envoyée à un serveur, un lien
  vers la page Méthodologie et une action de démarrage.
- **FR-002**: Lorsqu'un questionnaire en cours est mémorisé sur l'appareil, l'accueil DOIT
  proposer de le reprendre, de le recommencer ou de l'effacer, en rappelant le mode, l'avancement
  (questions traitées sur total) et la date de la dernière réponse.

**Choix des sujets clés**

- **FR-003**: Le système DOIT afficher la liste complète des thèmes de la version de banque
  courante, chacun avec son libellé et sa description courte, dans un ordre stable d'une visite
  à l'autre.
- **FR-004**: Le répondant DOIT pouvoir sélectionner et désélectionner librement des thèmes ;
  le système DOIT refuser une sixième sélection et l'expliquer.
- **FR-005**: Le système DOIT afficher en permanence un compteur du nombre de sujets
  sélectionnés sur le maximum (« x / 5 ») et l'intervalle autorisé (3 à 5).
- **FR-006**: Le système NE DOIT PAS permettre de poursuivre tant que le nombre de sujets
  sélectionnés n'est pas compris entre 3 et 5 inclus, et DOIT indiquer la raison.
- **FR-007**: L'écran DOIT expliquer l'effet du choix en termes compréhensibles : les sujets clés
  pèsent trois fois plus que les autres et plafonnent le score global d'un candidat.

**Choix du mode**

- **FR-008**: Le système DOIT proposer deux modes : court (environ 25 questions, environ
  3 minutes) et complet (au plus 100 questions, environ 10 minutes), avec le nombre de questions
  et la durée indicative de chacun.
- **FR-009**: L'écran DOIT indiquer que le mode court ne détaille que les sujets clés et que les
  autres thèmes n'y sont qu'effleurés.
- **FR-010**: Le répondant DOIT pouvoir revenir du choix du mode au choix des sujets clés sans
  perdre sa sélection.

**Questions**

- **FR-011**: Le système DOIT afficher une seule question à la fois, avec son énoncé, le ou les
  thèmes auxquels elle appartient (les sujets clés étant distingués), et la progression sous la
  forme « n / N ».
- **FR-012**: Chaque question DOIT proposer exactement cinq niveaux de réponse libellés
  « Pas du tout d'accord », « Plutôt pas d'accord », « Neutre / sans avis », « Plutôt d'accord »,
  « Tout à fait d'accord », présentés toujours dans cet ordre, plus une action distincte
  « Passer cette question ».
- **FR-013**: Choisir un niveau ou passer la question DOIT enregistrer la réponse et afficher la
  question suivante sans action supplémentaire.
- **FR-014**: Le répondant DOIT pouvoir revenir à la question précédente, voir la réponse qu'il
  avait donnée (ou l'état « passée »), la modifier, et avancer de nouveau jusqu'à la première
  question non encore traitée.
- **FR-015**: La liste et l'ordre des questions d'un parcours DOIVENT être entièrement déterminés
  par le triplet (version de banque, mode, sujets clés) et NE DOIVENT jamais dépendre des réponses
  données ; le nombre total N DOIT être connu et affiché dès la première question.
- **FR-016**: Les questions DOIVENT être présentées en tourniquet entre les thèmes, de sorte que
  deux questions consécutives appartiennent à des thèmes différents chaque fois que la liste le
  permet.
- **FR-017**: La composition de la liste (quotas par thème, choix des énoncés) relève de la
  spécification 003 ; la présente fonctionnalité DOIT se contenter de présenter la liste reçue
  sans la modifier.
- **FR-018**: Le répondant DOIT pouvoir, depuis n'importe quelle question, demander à modifier
  ses sujets clés ou son mode ; le système DOIT alors l'avertir que ses réponses seront perdues,
  obtenir sa confirmation, puis réinitialiser le questionnaire (réponses et mémorisation sur
  l'appareil comprises). S'il annule, rien ne change.
- **FR-019**: Le répondant DOIT pouvoir accéder à la page Méthodologie depuis n'importe quel
  écran du parcours, puis revenir à la question où il était sans perte.

**Reprise**

- **FR-020**: Dès la première question affichée, et après chaque réponse, passage ou retour, le
  système DOIT mémoriser sur l'appareil du répondant la version de banque, le mode, les sujets
  clés, la réponse à chaque question et la position courante.
- **FR-021**: La reprise DOIT restituer exactement le même questionnaire : mêmes questions, même
  ordre, mêmes réponses, même position.
- **FR-022**: Aucune donnée du questionnaire (sujets clés, mode, réponses, position) NE DOIT
  être transmise à un serveur, ni placée dans l'adresse de la page pendant le parcours.
- **FR-023**: Le répondant DOIT pouvoir effacer, à tout moment, le questionnaire mémorisé sur son
  appareil ; l'effacement DOIT être confirmé et complet.
- **FR-024**: Si la version de banque mémorisée n'est plus celle servie par le site, le système
  DOIT l'expliquer et proposer de recommencer, sans effacer l'ancien questionnaire avant
  confirmation.
- **FR-025**: Si la mémorisation sur l'appareil est indisponible, le parcours DOIT fonctionner
  intégralement et le répondant DOIT être prévenu que sa progression ne sera pas conservée.
- **FR-026**: Le questionnaire mémorisé DOIT être supprimé de l'appareil lorsque le répondant
  l'efface, le recommence ou confirme une réinitialisation ; il est conservé après l'accès aux
  résultats tant qu'un nouveau questionnaire n'est pas démarré.

**Fin**

- **FR-027**: Après la dernière question, le système DOIT afficher un écran de fin récapitulant,
  pour chaque sujet clé, le nombre de questions répondues et passées, et proposant d'accéder aux
  résultats ou de revenir aux questions.
- **FR-028**: Le répondant DOIT pouvoir terminer et accéder aux résultats même s'il a passé des
  questions.
- **FR-029**: Si au moins un sujet clé compte moins de 2 réponses non passées, l'écran de fin
  DOIT afficher un avertissement nommant les sujets concernés et expliquant que le résultat sera
  peu fiable, sans empêcher l'accès aux résultats.
- **FR-030**: L'accès aux résultats DOIT transmettre l'état complet du questionnaire : version de
  banque, mode, sujets clés et, pour chaque question du parcours, la réponse donnée, « passée »
  ou « non répondue ». La forme de cette transmission et le calcul des scores relèvent des
  spécifications 003 et 005.

**Transversal**

- **FR-031**: Tous les textes du parcours DOIVENT être servis en français par le mécanisme
  d'internationalisation du projet ; aucun texte visible NE DOIT être figé hors de ce mécanisme.
- **FR-032**: Chaque écran DOIT être entièrement utilisable au clavier seul (atteindre, activer
  et quitter chaque commande, avec un indicateur de focus visible) et au lecteur d'écran : les
  niveaux de réponse forment un groupe de choix nommé par l'énoncé, le changement de question et
  la progression sont annoncés, et le focus est placé sur la nouvelle question à chaque changement.
- **FR-033**: Chaque écran DOIT être conçu mobile d'abord, rester utilisable à 320 px de large
  sans défilement horizontal, et être lisible dans les thèmes clair et sombre.
- **FR-034**: Chaque parcours complet (mode court et mode complet, reprise) DOIT faire l'objet
  d'un test de bout en bout automatisé, conformément à la constitution.

### Key Entities *(include if feature involves data)*

- **Thème** : sujet de la liste (environ 16), identifié de façon stable, avec un libellé et une
  description courte en français ; fourni par la banque (spécification 002).
- **Sujets clés** : sous-ensemble de 3 à 5 thèmes désignés par le répondant pour ce
  questionnaire ; déterminent, avec le mode, la liste des questions et le poids des thèmes dans
  le score.
- **Mode** : court ou complet ; porte un nombre indicatif de questions et une durée annoncée.
- **Question (vue répondant)** : énoncé neutre, un ou deux thèmes, position dans le parcours
  (n sur N).
- **Réponse** : pour une question du parcours, l'un des cinq niveaux, « passée », ou « non
  répondue » (question pas encore atteinte).
- **Questionnaire en cours** : version de banque, mode, sujets clés, réponses, position courante
  et date de dernière modification ; mémorisé uniquement sur l'appareil du répondant.
- **État complet du questionnaire** : ce qui est remis aux résultats à la fin du parcours :
  version de banque, mode, sujets clés et la réponse à chacune des N questions, y compris
  « passée » et « non répondue ».

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: En test utilisateur, le temps médian entre l'accueil et l'écran de fin est
  inférieur ou égal à 4 minutes en mode court et à 12 minutes en mode complet.
- **SC-002**: Au moins 85 % des testeurs qui démarrent un questionnaire court atteignent l'écran
  de fin sans aide extérieure ; au moins 70 % pour le mode complet.
- **SC-003**: 100 % des testeurs parviennent à constituer une sélection valide de sujets clés en
  moins de 90 secondes, et aucun ne parvient à poursuivre avec moins de 3 ou plus de 5 sujets.
- **SC-004**: Sur un écran de 320 px de large, chaque écran du parcours s'affiche sans défilement
  horizontal et chaque commande (niveaux de réponse, « Passer », précédent, poursuivre) offre une
  zone d'activation d'au moins 44 × 44 px.
- **SC-005**: Un testeur n'utilisant que le clavier termine un questionnaire court sans jamais
  recourir à la souris ni perdre le focus ; un testeur utilisant un lecteur d'écran peut énoncer,
  pour chaque question, son numéro, son thème, son énoncé et les options disponibles.
- **SC-006**: La vérification d'accessibilité automatisée ne relève aucune violation critique ou
  sérieuse sur aucun écran du parcours, dans les thèmes clair et sombre.
- **SC-007**: Après fermeture et réouverture du site, 100 % des réponses enregistrées et la
  position courante sont restituées à l'identique lors de la reprise.
- **SC-008**: Pendant l'ensemble du parcours, aucune requête réseau sortante ne contient de sujet
  clé, de mode, de réponse ou de position (vérifié par observation du trafic en test de bout en
  bout).
- **SC-009**: Pour un même triplet (version de banque, mode, sujets clés), 100 des 100 démarrages
  produisent la même liste de questions dans le même ordre, et deux questions consécutives
  appartiennent à des thèmes différents dans au moins 95 % des transitions.
- **SC-010**: Le passage d'une question à la suivante est perçu comme immédiat : moins de 100 ms
  entre le choix d'une réponse et l'affichage de la question suivante sur un téléphone de milieu
  de gamme.
- **SC-011**: Le taux d'abandon entre la première et la dernière question d'un questionnaire court,
  mesuré en test utilisateur, est inférieur à 15 %.

## Assumptions

- La liste des thèmes (environ 16, libellés et descriptions courtes) et la banque de questions
  versionnée sont fournies par la spécification 002 ; cette fonctionnalité ne les modifie pas.
- La constitution de la liste de questions pour un triplet (version, mode, sujets clés) est
  fournie par la spécification 003 ; le parcours la reçoit telle quelle et l'affiche en tourniquet.
- Le seuil de fiabilité retenu pour l'avertissement de fin est « moins de 2 réponses non passées
  dans au moins un sujet clé », aligné sur la règle de score (score de thème indéfini sous
  2 réponses) ; il pourra être ajusté par la spécification 005 sans changer le parcours.
- « Neutre / sans avis » est une réponse à part entière (valeur médiane de l'échelle) et se
  distingue de « Passer cette question », qui exclut la question du calcul ; cette distinction est
  expliquée une fois, à la première question, dans une aide discrète.
- Le questionnaire mémorisé sur l'appareil n'a pas de durée d'expiration : il est conservé
  jusqu'à ce que le répondant l'efface, le recommence, confirme une réinitialisation ou démarre
  un nouveau questionnaire. La date de dernière réponse lui est rappelée pour qu'il décide.
- Un seul questionnaire en cours est mémorisé par appareil ; en démarrer un nouveau remplace le
  précédent après confirmation.
- La navigation en arrière du navigateur revient à la question précédente ; elle ne provoque
  jamais de perte de réponses.
- Le mode court contient tout de même au moins une question par thème non clé (plancher fixé par
  la spécification 003) ; « ne détaille que les sujets clés » signifie que seuls ceux-ci auront un
  score détaillé dans les résultats.
- Le répondant n'est pas identifié ; aucun compte, aucune authentification, aucune donnée
  personnelle n'est demandée.
- Les durées annoncées (environ 3 et 10 minutes) sont indicatives et seront confirmées par les
  tests utilisateurs ; elles sont des textes traduisibles, pas des valeurs calculées.
- La page Méthodologie existe (spécification 002) ; le parcours s'y relie sans en définir le
  contenu.
- Le changement de version de banque est rare (quelques fois avant l'élection) ; la perte d'un
  questionnaire en cours à cette occasion est acceptée, à condition d'être expliquée.

## Out of Scope

- Calcul des scores, plafonnement et encodage de l'état dans l'adresse de résultat
  (spécification 003).
- Page de résultats, classement, fiches candidats et partage (spécification 005).
- Rédaction, relecture et versionnement des thèmes, questions et positions (spécification 002).
- Comptes utilisateurs, synchronisation entre appareils, sauvegarde côté serveur.
- Toute statistique d'usage ; si elle est introduite un jour, elle fera l'objet d'une spécification
  distincte et ne recevra jamais de réponse ni de sujet clé.

## Constitution Alignment

| Principe | Prise en compte dans cette spécification |
|----------|------------------------------------------|
| I. Neutralité | Les énoncés sont affichés tels que fournis par la banque relue ; l'ordre en tourniquet et la liste indépendante des réponses évitent toute orientation du parcours. |
| II. Vie privée | FR-020 à FR-026, SC-008 : rien n'est envoyé à un serveur ni placé dans l'adresse pendant le parcours ; la mémorisation reste sur l'appareil et peut être effacée. |
| III. Cœur métier pur | La sélection des questions (FR-015, FR-017) est déléguée au domaine ; le parcours n'y ajoute aucune règle. |
| IV. Design system | FR-032, FR-033, SC-004 à SC-006 : clavier, lecteur d'écran, 320 px, thèmes clair et sombre. |
| V. Tests | FR-034, SC-007 à SC-009 : tests de bout en bout sur les deux modes et la reprise. |
| VI. i18n | FR-031 : tous les textes passent par l'internationalisation, locale `fr`. |
| VII. Simplicité | Aucun service serveur requis ; la reprise repose uniquement sur l'appareil. |
