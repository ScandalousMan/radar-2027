# Feature Specification: Résultats, détail par candidat et partage par URL

**Feature Branch**: `005-resultats-partage`

**Created**: 2026-11-06

**Status**: Draft

**Input**: User description: "Page de résultats, détail par thème et par candidat, partage par URL"

## User Scenarios & Testing *(mandatory)*

Cette fonctionnalité couvre tout ce que le répondant voit et peut faire **après** avoir répondu au
questionnaire : le classement des candidats, le détail par thème et par question pour un candidat,
la comparaison de plusieurs candidats, le partage des résultats par un lien, et la réouverture d'un
lien (valide, corrompu, ou issu d'une version antérieure de la banque de questions).

Les formules de score, les règles de couverture, l'ordre de classement et l'encodage de l'état dans
le fragment de l'URL sont définis par le moteur de score et le codec (spécification 003). La présente
spécification s'appuie sur leurs résultats et décrit uniquement la restitution au répondant.
Le questionnaire lui-même (choix des sujets, enchaînement des questions, reprise) relève de la
spécification 004 ; le contenu des données (candidats, positions, sources) de la spécification 002.

### User Story 1 - Consulter mon classement des candidats (Priority: P1)

À la fin du questionnaire, le répondant voit en tête le rappel de ses sujets clés, puis tous les
candidats classables, du plus au moins aligné, chacun avec un pourcentage entier et une bande
qualitative. Une phrase explique que le score global avec un candidat ne dépasse jamais l'accord sur
les sujets clés. Les candidats pour lesquels les données sont insuffisantes ne sont pas classés : ils
sont présentés à part, grisés, avec le nombre de positions inconnues.

**Why this priority**: c'est la raison d'être de l'application. Sans classement lisible et honnête
(plafonnement expliqué, candidats mal documentés non classés), le reste n'a pas de valeur.

**Independent Test**: à partir d'un jeu de réponses connu (fixture chiffrée du moteur de score),
afficher la page de résultats et vérifier l'ordre, les pourcentages, les bandes, les mentions
« ex æquo », la section « Données insuffisantes » et la phrase de plafonnement. Testable sans
partage, sans détail et sans comparaison.

**Acceptance Scenarios**:

1. **Given** un répondant a terminé un questionnaire complet avec quatre sujets clés, **When** la
   page de résultats s'affiche, **Then** ses quatre sujets clés sont rappelés en tête de page, puis
   chaque candidat classable apparaît par score global décroissant avec son rang, un pourcentage
   entier et sa bande qualitative (« très aligné », « plutôt aligné », « mitigé » ou « éloigné »).
2. **Given** deux candidats classables ont le même pourcentage global arrondi, **When** le
   classement s'affiche, **Then** ils portent le même rang et la mention « ex æquo », leur ordre
   relatif respectant les critères secondaires du moteur de score (score sur les sujets clés, puis
   couverture, puis identifiant), et le rang suivant est décalé d'autant.
3. **Given** un candidat dont la couverture est inférieure à 60 % des questions répondues,
   **When** la page s'affiche, **Then** il n'a pas de rang, figure dans la section « Données
   insuffisantes » en rendu grisé, avec la mention « N positions inconnues sur M questions
   répondues », et ses scores de thème définis restent consultables.
4. **Given** un candidat dont la couverture est suffisante mais dont le score sur les sujets clés
   est indéfini, **When** la page s'affiche, **Then** il est traité comme en données insuffisantes,
   avec la même mention de positions inconnues.
5. **Given** la page de résultats est affichée, **When** le répondant la lit, **Then** il trouve
   une phrase indiquant que « votre score global avec un candidat ne dépasse jamais votre accord
   avec lui sur vos sujets clés » et un lien vers la page Méthodologie.
6. **Given** un état où aucun candidat n'est classable (par exemple trois questions répondues),
   **When** la page s'affiche, **Then** le classement est vide, un message explique qu'aucun
   candidat ne dispose d'assez de données, tous les candidats figurent dans la section « Données
   insuffisantes » et le répondant est invité à répondre à davantage de questions.

---

### User Story 2 - Partager mes résultats par un lien et les rouvrir (Priority: P2)

Le répondant copie un lien de partage. Ce lien, ouvert dans n'importe quel navigateur, sur
n'importe quel appareil, reproduit exactement les mêmes chiffres, sans qu'aucune réponse ne
transite par un serveur. Depuis un lien ouvert, il peut revenir au questionnaire pré-rempli pour
modifier ses réponses. Avant de partager, il voit ce que le destinataire verra comme aperçu
(texte) et constate que cet aperçu ne révèle pas ses réponses.

**Why this priority**: le partage est le principal vecteur de diffusion de l'outil et la seule
manière de conserver un résultat, puisque rien n'est stocké côté serveur.

**Independent Test**: produire un résultat, copier le lien, l'ouvrir dans un navigateur vierge
(autre profil ou appareil) et comparer chiffre à chiffre ; vérifier l'absence de query string et
l'absence de toute requête réseau contenant le fragment. Testable sans le détail ni la comparaison.

**Acceptance Scenarios**:

1. **Given** la page de résultats est affichée, **When** le répondant active le bouton de partage,
   **Then** le lien est copié dans le presse-papiers, une confirmation visible et annoncée au
   lecteur d'écran apparaît, et le lien ne contient aucun paramètre de query string : tout l'état
   est dans le fragment.
2. **Given** le lien copié d'un questionnaire en mode complet, **When** on en mesure la partie
   située après `#`, **Then** elle fait au plus 64 caractères.
3. **Given** un lien de partage valide, **When** il est ouvert dans un navigateur qui n'a jamais
   visité le site, **Then** la page affiche les mêmes sujets clés, le même mode, le même classement,
   les mêmes pourcentages, les mêmes bandes et les mêmes candidats en données insuffisantes que la
   page d'origine, et aucune requête réseau émise ne contient le fragment ni une réponse.
4. **Given** un lien ouvert, **When** le répondant choisit « Modifier mes réponses », **Then** il
   arrive dans le questionnaire avec ses sujets clés, son mode et toutes ses réponses (y compris
   « passée » et « non répondue ») pré-remplis, et peut revenir aux résultats recalculés.
5. **Given** le répondant ouvre l'aperçu de partage, **When** il le lit, **Then** l'aperçu (titre et
   description tels que les afficheront les messageries) est générique : il ne contient ni
   réponse, ni sujet clé, ni nom de candidat, ni pourcentage, et il est identique pour tous les
   liens.
6. **Given** la copie dans le presse-papiers n'est pas autorisée par le navigateur, **When** le
   répondant active le bouton de partage, **Then** le lien s'affiche dans un champ sélectionnable
   avec une consigne de copie manuelle.

---

### User Story 3 - Ouvrir un lien invalide ou issu d'une version antérieure (Priority: P2)

Une personne ouvre un lien tronqué par une messagerie, un lien datant d'une version précédente de
la banque de questions, ou un lien produit par une version du site plus récente que celle qu'elle a
en cache. Dans chaque cas elle comprend ce qui se passe et ce qu'elle peut faire.

**Why this priority**: les liens circulent pendant des mois ; sans gestion explicite, une partie
des visiteurs arriverait sur une page vide ou sur des chiffres faux, ce qui ruinerait la confiance.

**Independent Test**: ouvrir trois liens fabriqués (corrompu, version antérieure dont une position
a changé depuis, version inconnue) et vérifier le message et le comportement de chacun. Testable
indépendamment des autres histoires.

**Acceptance Scenarios**:

1. **Given** un lien dont le fragment est corrompu (caractère manquant, altéré ou somme de contrôle
   invalide), **When** il est ouvert, **Then** la page affiche un message clair indiquant que le
   lien est incomplet ou invalide, n'affiche aucun chiffre, et propose de commencer le
   questionnaire.
2. **Given** un lien encodé avec une version de banque antérieure à la version courante, **When**
   il est ouvert, **Then** les résultats s'affichent exactement tels qu'ils étaient au moment du
   partage (mêmes candidats, mêmes positions, mêmes chiffres), précédés d'un avertissement
   « résultats calculés avec les données du JJ/MM/AAAA ; des données plus récentes existent » (date
   de publication de la version du lien) et d'une proposition de refaire le questionnaire avec les
   données actuelles.
3. **Given** un lien encodé avec une version de banque inconnue de la page (plus récente), **When**
   il est ouvert, **Then** la page n'affiche aucun chiffre et invite à recharger pour obtenir la
   dernière version du site, en conservant le lien.
4. **Given** un lien dont le fragment est bien formé mais décrit un état impossible (par exemple
   moins de trois ou plus de cinq sujets clés), **When** il est ouvert, **Then** il est traité comme
   un lien invalide.

---

### User Story 4 - Comprendre le détail d'un candidat, thème par thème et question par question (Priority: P3)

Depuis le classement, le répondant ouvre un candidat et voit son score par thème, sujets clés en
premier et mis en évidence, puis pour chaque question répondue : sa propre réponse, la position du
candidat, le niveau d'accord, le niveau de preuve, la citation d'appui et la source.

**Why this priority**: c'est ce qui rend le score vérifiable et crédible ; chaque pourcentage
doit pouvoir être remonté jusqu'à une source.

**Independent Test**: ouvrir la fiche d'un candidat à partir d'une fixture et vérifier l'ordre des
thèmes, les « — », l'agrégat « autres thèmes » en mode court, la couverture par thème et le contenu
de chaque ligne de question. Testable sans partage ni comparaison.

**Acceptance Scenarios**:

1. **Given** la fiche d'un candidat classé, **When** elle s'affiche, **Then** les thèmes du
   répondant désignés comme sujets clés apparaissent en premier et sont visuellement distingués,
   suivis des autres thèmes ; chaque thème montre son pourcentage entier ou « — » lorsqu'il est
   indéfini, et sa couverture « x positions connues sur y questions répondues ».
2. **Given** un questionnaire en mode court, **When** la fiche s'affiche, **Then** les thèmes non
   prioritaires sont regroupés en une seule ligne « autres thèmes » avec son pourcentage et sa
   couverture.
3. **Given** la fiche d'un candidat, **When** le répondant consulte le détail par question,
   **Then** pour chaque question répondue il voit l'énoncé, sa réponse, la position du candidat ou
   « inconnue », le niveau d'accord sur cinq paliers, le badge de niveau de preuve (programme
   officiel, livre ou plateforme, déclaration publique ou vote), la citation d'appui et un lien vers la
   source s'ouvrant dans un nouvel onglet.
4. **Given** le répondant a passé certaines questions, **When** il consulte le détail, **Then** les
   questions passées sont listées à part, avec la position du candidat et sa preuve mais sans niveau
   d'accord, et les questions non répondues sont seulement dénombrées.
5. **Given** un candidat en données insuffisantes, **When** sa fiche s'affiche, **Then** elle est
   accessible, affiche le rappel « données insuffisantes », les scores de thème définis et le
   détail par question ; aucun score global ni rang n'est montré.

---

### User Story 5 - Comparer deux ou trois candidats (Priority: P4)

Le répondant sélectionne deux ou trois candidats et les voit côte à côte, thème par thème, pour
comprendre où ils se distinguent sur ce qui compte pour lui.

**Why this priority**: utile pour départager des candidats proches, mais ne conditionne ni la
lecture du classement ni le partage.

**Independent Test**: sélectionner deux puis trois candidats depuis le classement, vérifier la vue
côte à côte et ses libellés, puis vérifier qu'un quatrième ne peut pas être ajouté. Testable à
partir d'un état chargé sans utiliser le détail par question.

**Acceptance Scenarios**:

1. **Given** le classement est affiché, **When** le répondant sélectionne deux candidats et lance la
   comparaison, **Then** il voit leurs scores globaux (ou la mention « données insuffisantes ») et,
   pour chaque thème, leur pourcentage ou « — », sujets clés d'abord et mis en évidence.
2. **Given** deux candidats sont déjà comparés, **When** le répondant en ajoute un troisième,
   **Then** la vue affiche les trois ; **When** il tente d'en ajouter un quatrième, **Then** l'action
   est indisponible et un message indique la limite de trois.
3. **Given** une comparaison est affichée sur un écran de 320 px de large, **When** le répondant la
   parcourt, **Then** chaque candidat reste identifiable (nom lisible, couleur distinctive doublée
   d'un repère non chromatique) sans défilement horizontal de la page.
4. **Given** une comparaison est affichée, **When** le répondant partage, **Then** le lien copié
   est le même lien de résultats (l'état comparé n'en fait pas partie).

---

### Edge Cases

- Aucune question répondue (lien encodant uniquement des « non répondues ») : la page affiche le
  message « aucun candidat classable » et propose de commencer ou de reprendre le questionnaire.
- Toutes les questions répondues sont « passées » : même traitement qu'aucune réponse.
- Un seul candidat classable : classement d'un seul rang, sans mention « ex æquo ».
- Tous les candidats classables ont le même pourcentage arrondi : tous au rang 1, tous « ex æquo ».
- Un candidat dont le score global est exactement 80, 60 ou 40 : bande déterminée sur le
  pourcentage entier affiché (80 → « très aligné », 60 → « plutôt aligné », 40 → « mitigé »).
- Un thème avec exactement deux questions exploitables : score défini et affiché ; un thème avec une
  seule : « — ».
- En mode court, aucun thème non prioritaire ne possède de question exploitable : la ligne « autres
  thèmes » affiche « — » et une couverture « 0 position connue sur y questions répondues ».
- Une question appartenant à deux thèmes : elle apparaît dans le détail de chacun des deux thèmes et
  une seule fois dans le détail par question.
- Une position connue mais sans citation d'appui exploitable : la ligne affiche la position, le
  badge de preuve et la source, et signale l'absence de citation sans masquer la ligne.
- Un candidat retiré de la version courante de la banque mais présent dans l'ancienne : il
  n'apparaît pas dans les résultats ; une note dénombre les candidats retirés depuis la date du
  lien.
- Fragment extrêmement long ou contenant des caractères hors alphabet attendu : traité comme lien
  invalide, sans blocage de la page.
- Le répondant modifie le fragment à la main pour une autre version ou d'autres réponses : la page
  recalcule à partir du fragment, comme pour tout lien ; aucune donnée n'est présumée fiable au-delà
  du fragment lui-même.
- La page est ouverte sans fragment (navigation directe) : elle invite à commencer le questionnaire,
  ou à reprendre le questionnaire en cours s'il en existe un sur l'appareil.
- Le presse-papiers est indisponible ou refusé : champ de copie manuelle (voir US2).
- Navigateur en thème sombre et contraste élevé : tous les états (grisé, mis en évidence, ex æquo)
  restent distinguables sans dépendre de la couleur seule.

## Requirements *(mandatory)*

### Functional Requirements

**Classement**

- **FR-001**: La page de résultats DOIT afficher, en tête, les sujets clés du répondant tels
  qu'encodés dans l'état, ainsi que le mode (court ou complet) et le nombre de questions répondues.
- **FR-002**: La page DOIT lister tous les candidats classables selon l'ordre fourni par le moteur
  de score (score global décroissant, puis score sur les sujets clés, puis couverture, puis
  identifiant), avec un rang, le nom du candidat, un pourcentage entier et la bande qualitative.
- **FR-003**: La bande qualitative DOIT être déterminée à partir du pourcentage entier affiché :
  80 et plus « très aligné », 60 à 79 « plutôt aligné », 40 à 59 « mitigé », moins de 40
  « éloigné ». Aucun autre libellé de bande n'est autorisé.
- **FR-004**: Les candidats classables ayant le même pourcentage global arrondi DOIVENT partager le
  même rang et porter la mention « ex æquo » ; le rang suivant DOIT être décalé du nombre
  d'ex æquo (classement 1, 2, 2, 4).
- **FR-005**: La page DOIT afficher une phrase expliquant le plafonnement : « votre score global
  avec un candidat ne dépasse jamais votre accord avec lui sur vos sujets clés », à proximité
  immédiate du classement, et un lien vers la page Méthodologie.
- **FR-006**: Chaque entrée du classement DOIT permettre d'ouvrir la fiche détaillée du candidat
  (US4) et de l'ajouter à une comparaison (US5).

**Données insuffisantes**

- **FR-007**: Les candidats que le moteur de score déclare en données insuffisantes (couverture
  inférieure à 60 % des questions répondues, ou score sur les sujets clés indéfini) NE DOIVENT PAS
  recevoir de rang ni de score global, et DOIVENT être regroupés dans une section distincte intitulée
  « Données insuffisantes », placée après le classement.
- **FR-008**: Chaque candidat en données insuffisantes DOIT être rendu de manière grisée (et
  signalé textuellement comme tel pour les technologies d'assistance) et porter la mention
  « N positions inconnues sur M questions répondues », où N et M proviennent du moteur de score.
- **FR-009**: Les scores de thème définis d'un candidat en données insuffisantes DOIVENT rester
  consultables depuis sa fiche.
- **FR-010**: Lorsque aucun candidat n'est classable, la page DOIT l'indiquer explicitement et
  proposer de répondre à davantage de questions (retour au questionnaire pré-rempli).

**Détail par thème**

- **FR-011**: La fiche d'un candidat DOIT lister les thèmes dans l'ordre suivant : sujets clés du
  répondant d'abord (mis en évidence visuellement et textuellement), puis les autres thèmes.
- **FR-012**: Pour chaque thème, la fiche DOIT afficher le pourcentage entier fourni par le moteur,
  ou « — » lorsque le score de thème est indéfini (moins de deux questions exploitables), avec un
  libellé accessible équivalent (« non calculable »).
- **FR-013**: Pour chaque thème, la fiche DOIT afficher la couverture « x positions connues sur y
  questions répondues ».
- **FR-014**: En mode court, les thèmes non prioritaires DOIVENT être agrégés en une seule ligne
  « autres thèmes », avec pourcentage ou « — » et couverture ; en mode complet, chaque thème
  apparaît individuellement.

**Détail par question**

- **FR-015**: Pour chaque question répondue (hors « passée »), la fiche DOIT afficher : l'énoncé,
  la réponse du répondant sur l'échelle à cinq niveaux, la position du candidat sur la même échelle
  ou « inconnue », et le niveau d'accord sur cinq paliers calculé par le moteur, avec des libellés
  neutres (« identique », « proche », « intermédiaire », « éloigné », « opposé »).
- **FR-016**: Lorsque la position du candidat est connue, la ligne DOIT afficher le badge de niveau
  de preuve (« programme officiel », « livre ou plateforme », « déclaration publique ou vote »), la citation
  d'appui et un lien vers la source (titre et date de publication), ouvert dans un nouvel onglet ;
  lorsque la position est « inconnue », aucune citation ni source n'est affichée et la ligne précise
  que la question n'entre pas dans le calcul pour ce candidat.
- **FR-017**: Les questions passées par le répondant DOIVENT être listées dans une section distincte
  « Questions passées », avec la position du candidat et sa preuve mais sans niveau d'accord ; les
  questions non répondues DOIVENT être dénombrées sans être listées.
- **FR-018**: Les questions regroupées par thème DOIVENT être présentées dans l'ordre des thèmes de
  FR-011 ; une question portant deux thèmes apparaît une seule fois dans le détail par question.

**Comparaison**

- **FR-019**: Le répondant DOIT pouvoir sélectionner de deux à trois candidats (classés ou en
  données insuffisantes) et les voir côte à côte : score global ou mention « données
  insuffisantes », puis chaque thème dans l'ordre de FR-011 avec pourcentage ou « — ».
- **FR-020**: La sélection d'un quatrième candidat DOIT être impossible et expliquée ; le répondant
  DOIT pouvoir retirer un candidat de la comparaison à tout moment.
- **FR-021**: La comparaison DOIT rester lisible à 320 px de large sans défilement horizontal de
  la page ; chaque candidat DOIT être identifiable par son nom et par un repère non uniquement
  chromatique.
- **FR-022**: L'état de la comparaison (candidats sélectionnés) NE DOIT PAS modifier le lien de
  partage.

**Partage par lien**

- **FR-023**: La page DOIT proposer un bouton de partage qui copie dans le presse-papiers un lien
  dont le fragment (`#…`) encode l'état complet tel que produit par le codec : version de banque,
  mode, sujets clés et la réponse à chaque question, y compris « passée » et « non répondue ».
- **FR-024**: Le lien de partage NE DOIT contenir aucune donnée de résultat ailleurs que dans le
  fragment ; la query string DOIT être vide.
- **FR-025**: Pour un questionnaire en mode complet, la partie du lien située après `#` DOIT faire
  au plus 64 caractères ; en mode court, au plus 32.
- **FR-026**: L'ouverture d'un lien valide DOIT reproduire exactement les mêmes sujets clés, mode,
  classement, pourcentages, bandes, candidats en données insuffisantes et détails que la page
  d'origine, sur tout navigateur et appareil, sans qu'aucune réponse, sujet clé ou résultat ne
  soit transmis à un serveur.
- **FR-027**: Après la copie, la page DOIT confirmer visuellement et par annonce au lecteur d'écran
  que le lien est copié ; si la copie est impossible, le lien DOIT être présenté dans un champ
  sélectionnable avec une consigne de copie manuelle.
- **FR-028**: Depuis des résultats affichés (générés localement ou ouverts par lien), le
  répondant DOIT pouvoir revenir au questionnaire pré-rempli avec l'état complet pour modifier ses
  réponses, puis revenir aux résultats recalculés.
- **FR-029**: L'aperçu de partage (titre et description que montrent les messageries et réseaux)
  DOIT être générique et identique pour tous les liens : il NE DOIT contenir ni réponse, ni sujet
  clé, ni nom de candidat, ni score. La page DOIT permettre au répondant de voir ce texte avant de
  partager.
- **FR-030**: La page PEUT proposer en complément le partage natif de l'appareil lorsqu'il est
  disponible ; dans ce cas le contenu partagé se limite au lien et au texte générique de FR-029.

**Liens invalides ou anciens**

- **FR-031**: Lorsque le codec rejette le fragment (somme de contrôle invalide, format inattendu,
  état impossible), la page DOIT afficher un message indiquant que le lien est incomplet ou
  invalide, n'afficher aucun chiffre et proposer de commencer le questionnaire.
- **FR-032**: Lorsque le fragment référence une version de banque antérieure à la version
  courante, la page DOIT afficher les résultats calculés avec les candidats et les positions figés
  dans cette version (identiques à ceux vus au moment du partage), précédés d'un avertissement
  « résultats calculés avec les données du JJ/MM/AAAA ; des données plus récentes existent » (date
  de publication de la version du lien, au format français), proposer de refaire le questionnaire
  avec les données actuelles et proposer un lien vers la page Méthodologie.
- **FR-033**: Dans ce cas, un candidat présent dans la version du lien mais qui ne figure plus
  dans la version courante DOIT rester calculé et affiché, avec la mention « ne se présente
  plus » ; aucune donnée de la version courante NE DOIT être mélangée à l'affichage.
- **FR-034**: Lorsque le fragment référence une version de banque inconnue de la page (plus
  récente), la page DOIT n'afficher aucun chiffre et inviter à recharger la page pour obtenir la
  dernière version, en conservant le lien intact.
- **FR-035**: Lorsqu'un lien est ouvert sans fragment, la page DOIT inviter à commencer le
  questionnaire ou à reprendre celui en cours sur l'appareil s'il existe.

**Transversal**

- **FR-036**: Toutes les chaînes affichées DOIVENT passer par le mécanisme d'internationalisation
  avec des clés nommées ; la locale livrée est le français, avec formats de date et de nombre
  français.
- **FR-037**: La page et ses vues (classement, fiche, comparaison, partage) DOIVENT être
  entièrement utilisables au clavier, exposer des rôles et libellés accessibles, annoncer les
  changements d'état (copie, ajout à la comparaison, erreur de lien) aux lecteurs d'écran et
  respecter les ratios de contraste du niveau AA, en thème clair comme en thème sombre.
- **FR-038**: La page DOIT être conçue mobile d'abord et rester utilisable à 320 px de large sans
  défilement horizontal.
- **FR-039**: Les couleurs associées aux candidats DOIVENT servir uniquement à les distinguer,
  NE DOIVENT jamais reprendre les couleurs ou codes d'un parti, et DOIVENT toujours être doublées
  d'un repère non chromatique (nom, motif ou position).
- **FR-040**: Aucun libellé de la page NE DOIT contenir de jugement de valeur sur un candidat, une
  position ou une réponse ; seuls les libellés de bande (FR-003) et de niveau d'accord (FR-015)
  qualifient la relation entre le répondant et le candidat.
- **FR-041**: La page DOIT proposer un lien vers la page Méthodologie depuis le classement, la fiche
  d'un candidat et tout avertissement de version.
- **FR-042**: La page NE DOIT émettre aucune requête réseau contenant tout ou partie du fragment,
  des réponses, des sujets clés ou des résultats ; aucun cookie ni traceur tiers NE DOIT être
  déposé. Aucune mesure d'audience, même agrégée et sans cookie, N'EST installée sur la page de
  résultats ni ailleurs sur le site (décision du 2026-11-06).

### Key Entities *(include if feature involves data)*

- **État de résultat** : ce que décrit un lien de partage — version de banque, mode (court ou
  complet), sujets clés (3 à 5), réponse à chaque question de la banque (valeur sur cinq niveaux,
  « passée » ou « non répondue »). Produit et lu par le codec ; la page ne fait que l'afficher et le
  transmettre au questionnaire pour modification.
- **Résultat calculé** : sortie du moteur de score pour un état et une version de banque courante —
  pour chaque candidat : score global (ou indéfini), score sur les sujets clés (ou indéfini),
  couverture, scores de thème (définis ou non), indicateur « données insuffisantes », nombre de
  positions inconnues, et ordre de classement.
- **Entrée de classement** : vue d'un candidat classable — rang, mention « ex æquo » éventuelle,
  pourcentage entier, bande qualitative, lien vers la fiche.
- **Fiche candidat** : vue détaillée d'un candidat — identité, statut (classé ou données
  insuffisantes), liste des scores de thème ordonnée (sujets clés d'abord, « autres thèmes » en mode
  court), couverture par thème, détail par question, questions passées, nombre de questions non
  répondues, mention « ne se présente plus » le cas échéant.
- **Ligne de question** : pour une question et un candidat — énoncé, thèmes, réponse du répondant,
  position du candidat ou « inconnue », niveau d'accord (cinq paliers), niveau de preuve, citation,
  source (titre, date de publication, lien).
- **Comparaison** : sélection de deux à trois candidats et leur vue côte à côte ; état local à la
  page, non encodé dans le lien.
- **Lien de partage** : adresse de la page de résultats dont le fragment est l'encodage de l'état de
  résultat ; accompagné d'un aperçu générique (titre, description) identique pour tous les liens.
- **Avertissement de version** : message affiché quand la version de banque du lien est antérieure
  à la version courante — date de publication de la version du lien, mention que des données plus
  récentes existent, nombre de candidats qui ne se présentent plus, proposition de refaire le
  questionnaire.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Pour chaque fixture chiffrée du moteur de score, la page affiche exactement les rangs,
  pourcentages entiers, bandes, mentions « ex æquo » et candidats en données insuffisantes attendus
  (100 % de concordance sur l'ensemble des fixtures).
- **SC-002**: Un lien de partage ouvert dans un navigateur vierge (autre profil ou autre appareil)
  reproduit 100 % des chiffres de la page d'origine, pour le mode court comme pour le mode complet
  et pour 3, 4 et 5 sujets clés.
- **SC-003**: Pendant la génération, la copie et l'ouverture d'un lien, aucune requête réseau
  sortante ne contient le fragment, une réponse, un sujet clé ou un résultat (0 occurrence
  constatée en test de bout en bout), et le lien ne comporte aucun paramètre de query string.
- **SC-004**: La partie du lien située après `#` fait au plus 64 caractères en mode complet et au
  plus 32 en mode court, pour toute combinaison de réponses.
- **SC-005**: Un lien corrompu, un lien de version antérieure et un lien de version inconnue
  produisent chacun le comportement spécifié (message, avertissement daté, invitation à recharger)
  dans 100 % des cas de test, sans qu'aucun chiffre ne soit affiché pour les deux cas invalides.
- **SC-006**: Le classement est visible moins de 2 secondes après l'ouverture d'un lien sur un
  téléphone d'entrée de gamme et une connexion mobile ordinaire.
- **SC-007**: Dans un test utilisateur sur cinq personnes n'ayant jamais vu l'outil, au moins quatre
  retrouvent sans aide, en moins d'une minute chacune : pourquoi un candidat est grisé, et
  pourquoi un score global peut être inférieur à la moyenne des thèmes (phrase de plafonnement).
- **SC-008**: La vérification d'accessibilité automatisée ne remonte aucune violation critique ou
  sérieuse sur le classement, la fiche candidat, la comparaison et les trois états d'erreur de
  lien, en thème clair et en thème sombre ; un parcours complet (classement → fiche → comparaison
  → partage) est réalisable au clavier seul.
- **SC-009**: À 320 px de large, aucune des vues ne provoque de défilement horizontal de la page.
- **SC-010**: 100 % des chaînes visibles proviennent du catalogue de traduction (aucune chaîne en
  dur détectée par la vérification automatisée), et aucun libellé n'utilise de terme hors des listes
  fermées de bandes et de niveaux d'accord pour qualifier un candidat.
- **SC-011**: Depuis un lien ouvert, un répondant qui change une réponse et revient aux résultats
  obtient un nouveau lien différent du premier, et la réouverture de l'ancien lien redonne les
  anciens chiffres (deux états distincts, deux liens distincts).

## Assumptions

- **Plafonnement strict** : le moteur de score (spécification 003) applique le plafond strict
  « global = minimum du score pondéré et du score sur les sujets clés », sans tolérance (décision
  du 2026-11-06) ; la phrase d'explication de FR-005 en découle.
- **Arrondi** : le pourcentage entier, l'ordre de classement et la détection des ex æquo sont
  fournis par le moteur de score sur la base du même arrondi (entier le plus proche), de sorte que
  l'affichage et le classement ne se contredisent jamais.
- **Niveau de preuve non pondéré** : le badge de preuve est informatif ; il n'influence aucun
  chiffre en v1.
- **Positions figées par version** : un lien d'une version antérieure est rejoué avec les
  candidats et les positions figés dans cette version (décision du 2026-11-06) ; il reproduit donc
  exactement ce qui a été vu au moment du partage. La date de l'avertissement est la date de
  publication de la version du lien. Aucun recalcul avec des données courantes n'est proposé :
  seule l'option de refaire le questionnaire l'est.
- **Candidats affichés** : pour un nouveau résultat, la page affiche les candidats de la version
  courante ; pour un ancien lien, ceux de la version du lien, un candidat qui ne figure plus dans
  la version courante portant la mention « ne se présente plus ».
- **Liens partiels** : un lien peut décrire un questionnaire inachevé ; les questions non répondues
  sont simplement absentes du calcul et dénombrées. Il n'existe pas de seuil minimal de réponses
  pour afficher la page, seulement les règles de données insuffisantes.
- **Aperçu de partage** : la page étant statique et l'état vivant dans le fragment, l'aperçu que
  génèrent les messageries ne peut pas dépendre du résultat ; il est donc volontairement générique.
  L'image de partage personnalisée est reportée à une version ultérieure.
- **Comparaison éphémère** : la sélection de candidats comparés n'est ni encodée dans le lien ni
  conservée entre deux visites.
- **Page Méthodologie** : elle existe (spécification 002) et publie les formules, les seuils (60 %,
  2 questions, bandes) et les critères d'inclusion des candidats ; la page de résultats s'y réfère
  sans les redéfinir.
- **Pré-remplissage du questionnaire** : le questionnaire (spécification 004) sait démarrer à partir
  d'un état complet fourni par la page de résultats ; pour un ancien lien, il démarre sur la version
  courante en reprenant, par identifiant, les réponses aux questions encore présentes.
- **Reprise locale** : la détection d'un questionnaire en cours sur l'appareil (FR-035) repose sur
  le mécanisme de reprise de la spécification 004, qui reste sur l'appareil.

### Dependencies

- Spécification 002 : liste des candidats, positions, niveaux de preuve, citations, sources, page
  Méthodologie, date de publication de chaque version de banque.
- Spécification 003 : moteur de score (scores, bandes, couverture, ordre, ex æquo, données
  insuffisantes), codec URL (encodage, validation, détection de version), fixtures chiffrées.
- Spécification 004 : questionnaire acceptant un état pré-rempli ; reprise locale.
- Spécification 001 : composants du design system, tokens, thèmes clair et sombre, i18n,
  accessibilité, tests de bout en bout.

### Out of Scope

- Formules de score, règles de sélection des questions et format du codec (spécification 003).
- Questionnaire : choix des sujets, enchaînement, reprise (spécification 004).
- Contenu des données : candidats, positions, sources, citations (spécification 002).
- Image de partage téléchargeable ou personnalisée (version ultérieure).
- Export (PDF, impression dédiée), historique de résultats, comptes utilisateur.
- Pondération des scores par niveau de preuve.
