# Feature Specification: Socle applicatif et design system

**Feature Branch**: `001-socle-design-system`

**Created**: 2026-11-06

**Status**: Draft

**Input**: User description: "Socle applicatif, design system, Storybook, tests et déploiement Vercel"

## User Scenarios & Testing *(mandatory)*

Cette spécification est la seule du projet à caractère technique : ses « utilisateurs » sont les
mainteneurs et contributeurs de radar-2027. Elle ne livre aucune fonctionnalité métier à l'électeur ;
elle met en place le cadre (projet, design system, qualité, déploiement) dans lequel les
fonctionnalités 002 à 005 seront construites. Les outils nommés ici sont exclusivement ceux que la
constitution impose ; la spécification ne descend pas en dessous de ce niveau.

### User Story 1 - Démarrer le projet et voir l'accueil en français (Priority: P1)

Un contributeur clone le dépôt, installe les dépendances avec le gestionnaire de paquets du projet,
lance le serveur de développement et voit une page d'accueil minimale en français qui présente
radar-2027 en une phrase. Il peut aussi produire l'export statique du site et le servir sans aucun
serveur applicatif. Toutes les chaînes affichées proviennent du fichier de messages de la locale
`fr` ; en modifier une suffit à changer l'écran sans toucher aux composants.

**Why this priority**: sans projet qui se lance et s'exporte, rien d'autre n'est testable ni
déployable. C'est la fondation de toutes les autres fonctionnalités et la première preuve concrète
des principes VI (i18n) et VII (statique).

**Independent Test**: sur une machine propre disposant de la version de Node attendue, exécuter
l'installation, le build et servir le dossier exporté avec un serveur de fichiers statiques
quelconque ; la page d'accueil s'affiche en français, l'attribut de langue du document est `fr`
et aucune requête n'atteint un domaine tiers.

**Acceptance Scenarios**:

1. **Given** un clone frais du dépôt et la version de Node attendue, **When** le contributeur
   exécute la commande d'installation puis la commande de développement documentées dans le README,
   **Then** la page d'accueil s'affiche en français en moins de deux minutes de manipulation.
2. **Given** le projet installé, **When** le contributeur exécute la commande de build, **Then** un
   dossier de fichiers statiques est produit, sans fonction serveur ni route dynamique, et il se
   sert avec n'importe quel serveur de fichiers.
3. **Given** le fichier de messages `fr`, **When** le contributeur modifie le titre de la page
   d'accueil dans ce fichier et relance le build, **Then** le nouveau titre apparaît sans qu'aucun
   fichier de composant ou de page n'ait été modifié.
4. **Given** une recherche automatisée de texte destiné à l'utilisateur écrit en dur dans les
   composants et pages, **When** elle est exécutée, **Then** elle ne renvoie aucun résultat.
5. **Given** la page d'accueil chargée dans un navigateur, **When** on inspecte les requêtes
   réseau et les cookies, **Then** aucune requête ne part vers un domaine tiers et aucun cookie
   n'est déposé.

---

### User Story 2 - Consulter et utiliser le design system dans Storybook (Priority: P1)

Un contributeur lance Storybook et y trouve, documentés et manipulables, les tokens de design
(couleurs, espacements, typographie, rayons, ombres) ainsi que les composants de base du produit,
chacun avec une story par état significatif. Il peut basculer chaque story entre thème clair et
thème sombre. Lorsqu'il construit un nouvel écran, il assemble ces composants sans écrire de
valeur de style en dur.

**Why this priority**: la constitution impose « design system d'abord » (principe IV) ; les
fonctionnalités 004 et 005 ne peuvent être conçues ni revues sans ces briques. Cette story est
livrable et démontrable indépendamment de l'application elle-même.

**Independent Test**: lancer Storybook, parcourir la liste des composants attendus et, pour
chacun, vérifier la présence des états listés dans FR-012, basculer le thème et constater que les
couleurs changent via les tokens uniquement.

**Acceptance Scenarios**:

1. **Given** Storybook lancé, **When** le contributeur ouvre la section des tokens, **Then** il
   voit la liste des couleurs, espacements, tailles de police, rayons et ombres avec leur nom de
   variable CSS et leur valeur dans les deux thèmes.
2. **Given** Storybook lancé, **When** il parcourt le catalogue, **Then** il trouve une story pour
   chacun des composants suivants : Button, LikertChoice, ThemeChip, ThemePicker, ProgressBar,
   ScoreBar, Card, PageShell (gabarit de page) et EvidenceBadge (badge de niveau de preuve), avec
   les états décrits dans FR-012.
3. **Given** n'importe quelle story, **When** il active le thème sombre depuis la barre d'outils de
   Storybook, **Then** le composant se réaffiche en thème sombre sans rechargement et sans
   perte de lisibilité (contraste texte/fond conforme à FR-008).
4. **Given** le composant LikertChoice, **When** il observe la story par défaut, **Then** il voit
   cinq niveaux ordonnés de « pas du tout d'accord » à « tout à fait d'accord » plus une option
   « passer », visuellement distincte des cinq niveaux.
5. **Given** le composant ThemePicker configuré pour 3 à 5 sujets, **When** il sélectionne cinq
   sujets puis tente d'en choisir un sixième, **Then** la sélection est refusée et un message
   explique la limite ; **When** il n'en a sélectionné que deux, **Then** le composant signale
   qu'il en manque au moins un.
6. **Given** le composant ScoreBar, **When** il lui fournit une valeur indéfinie, **Then** la
   barre affiche « — » et un libellé accessible indiquant que le score est indisponible, au lieu
   d'une barre à zéro.
7. **Given** le contributeur ajoute une couleur hexadécimale en dur dans un composant de
   l'application, **When** il exécute le lint, **Then** le lint échoue en désignant la ligne
   fautive.

---

### User Story 3 - Garantir l'accessibilité et le mobile dès le socle (Priority: P2)

Un contributeur vérifie qu'un visiteur naviguant uniquement au clavier, ou avec un lecteur
d'écran, ou sur un écran de 320 px de large, peut utiliser chaque composant de base. Les vérifications
automatisées d'accessibilité de Storybook ne remontent aucune violation critique, et un parcours
clavier manuel permet d'atteindre et d'actionner tous les éléments interactifs.

**Why this priority**: l'accessibilité se corrige à prix élevé après coup ; la constitution en fait
une exigence de chaque composant. Elle vient juste après l'existence des composants eux-mêmes.

**Independent Test**: exécuter l'addon d'accessibilité de Storybook sur toutes les stories et
parcourir chaque composant interactif au clavier seul ; réduire la fenêtre à 320 px et vérifier
l'absence de défilement horizontal sur l'accueil et sur toutes les stories.

**Acceptance Scenarios**:

1. **Given** l'ensemble des stories, **When** la vérification automatisée d'accessibilité
   s'exécute, **Then** elle ne signale aucune violation de niveau critique ou sérieux.
2. **Given** le composant LikertChoice affiché, **When** l'utilisateur atteint le groupe avec la
   touche Tab puis utilise les flèches, **Then** le focus se déplace entre les six options (cinq
   niveaux + « passer »), l'option courante est annoncée avec son libellé et sa position, et
   Espace ou Entrée la sélectionne.
3. **Given** le composant ThemePicker, **When** l'utilisateur navigue au clavier, **Then** chaque
   puce de sujet est atteignable, son état sélectionné/non sélectionné est annoncé, et le nombre de
   sujets choisis sur le maximum est exposé aux technologies d'assistance.
4. **Given** n'importe quel composant interactif, **When** il reçoit le focus clavier, **Then** un
   indicateur de focus visible et contrasté est affiché dans les deux thèmes.
5. **Given** la page d'accueil ou une story quelconque, **When** la fenêtre est réduite à 320 px
   de large, **Then** aucun défilement horizontal n'apparaît et aucun texte n'est tronqué de façon
   à perdre son sens.
6. **Given** le gabarit de page (PageShell), **When** l'utilisateur appuie sur Tab en arrivant sur
   la page, **Then** le premier élément focalisable est un lien « aller au contenu » qui amène au
   contenu principal.

---

### User Story 4 - Faire valider une contribution par une CI bloquante (Priority: P2)

Un contributeur ouvre une pull request. L'intégration continue exécute automatiquement le lint, la
vérification de types, les tests unitaires, le build de Storybook, le build de l'application et le
test de bout en bout « la page d'accueil s'affiche en français ». Tant qu'une étape échoue, la pull
request ne peut pas être fusionnée sur `main`. Le contributeur peut rejouer localement exactement
les mêmes commandes.

**Why this priority**: la constitution (principe V) fait des tests le contrat du projet ; sans CI
bloquante, les principes I à IV ne sont que des intentions. Elle dépend de l'existence du projet
(story 1) mais pas du déploiement.

**Independent Test**: ouvrir une pull request contenant volontairement une erreur de type, puis
une erreur de lint, puis un test e2e cassé ; vérifier que chaque cas rend la CI rouge et bloque la
fusion ; corriger et vérifier que la CI passe au vert.

**Acceptance Scenarios**:

1. **Given** une pull request vers `main`, **When** elle est ouverte ou mise à jour, **Then** une
   exécution de CI démarre et enchaîne les six étapes (lint, typecheck, tests unitaires, build
   Storybook, build application, e2e) et le résultat de chaque étape est visible sur la pull
   request.
2. **Given** une pull request dont une étape échoue, **When** un mainteneur tente de la fusionner,
   **Then** la fusion est refusée par le dépôt tant que la CI n'est pas verte.
3. **Given** un contributeur en local, **When** il exécute la commande de vérification complète
   documentée, **Then** elle lance les mêmes étapes que la CI et échoue sur les mêmes erreurs.
4. **Given** le build statique de l'application, **When** le test de bout en bout s'exécute contre
   ce build servi localement, **Then** il vérifie que la page d'accueil porte la langue `fr` et
   affiche le titre attendu, lu depuis le fichier de messages.
5. **Given** un fichier situé dans le futur module de domaine (`src/core`) qui importe un module
   React, DOM ou Next.js, **When** le lint s'exécute, **Then** il échoue en désignant l'import
   interdit.

---

### User Story 5 - Prévisualiser chaque pull request et publier depuis main (Priority: P3)

Le propriétaire du projet relie le dépôt à un projet d'hébergement Vercel (plan Hobby). Chaque
pull request obtient automatiquement une URL de prévisualisation ; chaque fusion sur `main` met la
production à jour. Le site servi est purement statique, accompagné d'en-têtes de sécurité, et les
variables d'environnement attendues sont documentées dans un fichier d'exemple commité sans aucun
secret.

**Why this priority**: indispensable pour relire les fonctionnalités à venir dans des conditions
réelles, mais le projet reste utilisable et testable localement sans lui. Il dépend des stories 1 et
4 et d'une action manuelle du propriétaire (liaison du compte).

**Independent Test**: ouvrir une pull request triviale et constater l'URL de prévisualisation ;
fusionner et constater la mise à jour de la production ; inspecter les en-têtes HTTP de la
production.

**Acceptance Scenarios**:

1. **Given** le dépôt relié au projet Vercel, **When** une pull request est ouverte ou mise à jour,
   **Then** un commentaire ou un statut sur la pull request fournit une URL de prévisualisation
   fonctionnelle en moins de cinq minutes après la dernière poussée.
2. **Given** une pull request fusionnée sur `main`, **When** le déploiement se termine, **Then** la
   version de production reflète le contenu de `main` et aucune fonction serveur n'a été déployée
   (le projet n'expose que des fichiers statiques).
3. **Given** la production déployée, **When** on inspecte les en-têtes HTTP d'une page HTML,
   **Then** les en-têtes de sécurité listés dans FR-024 sont présents avec les valeurs attendues.
4. **Given** le dépôt, **When** un contributeur consulte `.env.example`, **Then** il y trouve
   chaque variable d'environnement utilisée par le projet, son rôle et un exemple de valeur
   factice, et aucune valeur réelle n'est présente dans l'historique du dépôt.
5. **Given** un clone du dépôt sans aucun fichier `.env`, **When** le contributeur lance le build
   de l'application, **Then** il réussit : aucune variable n'est requise pour construire ou
   exécuter le site.

---

### Edge Cases

- **Préférence de thème** : si le système de l'utilisateur est en mode sombre et qu'aucun choix
  explicite n'a été fait, le thème sombre s'applique ; un choix explicite via la bascule prévaut
  et est mémorisé dans le stockage local du navigateur (jamais côté serveur). Sans stockage local
  disponible (navigation privée restrictive), le site suit la préférence système sans erreur.
- **Clignotement de thème au chargement** : le thème initial est appliqué avant le premier rendu
  visible ; aucun passage du clair au sombre n'est perceptible au chargement.
- **JavaScript désactivé** : la page d'accueil reste lisible (texte, structure, thème clair par
  défaut) puisqu'elle est exportée statiquement ; seules les interactions sont indisponibles.
- **Clé de traduction manquante** : une clé référencée mais absente du fichier de messages fait
  échouer la vérification de types ou les tests, jamais le visiteur ne voit une clé brute en
  production.
- **ThemePicker aux bornes** : sélection d'un 6e sujet refusée avec message ; moins de 3 sujets
  signalé ; le composant expose son état « valide / invalide » au parent sans décider lui-même de
  la navigation (qui relève de la fonctionnalité 004).
- **LikertChoice** : « passer » est un état distinct de « aucune réponse » ; les deux états sont
  représentables et différenciés visuellement et pour les technologies d'assistance. Le composant
  accepte une réponse déjà sélectionnée (retour en arrière) et permet d'en changer.
- **ScoreBar hors bornes** : une valeur inférieure à 0 ou supérieure à 100 est bornée à l'affichage
  et signalée en développement ; une valeur indéfinie affiche « — ».
- **Libellés longs** : un libellé de sujet long dans ThemeChip passe à la ligne sans déborder ni
  être tronqué silencieusement, y compris à 320 px.
- **Zoom texte à 200 %** : à 320 px avec un zoom texte de 200 %, aucun contenu ne devient
  inaccessible (défilement vertical autorisé, horizontal interdit).
- **Pull request depuis un fork** : la prévisualisation Vercel peut ne pas être produite pour
  un fork externe (contrainte du plan Hobby mono-compte) ; la CI GitHub reste, elle, exécutée et
  bloquante.
- **Test de bout en bout instable** : un échec e2e est rejoué au plus une fois automatiquement ;
  un second échec rend la CI rouge.
- **Version de Node différente** : une version de Node autre que celle attendue est détectée à
  l'installation et signalée clairement au contributeur.
- **Dépassement des quotas Hobby** : la surveillance de la bande passante (100 Go/mois) relève du
  propriétaire ; le socle ne prévoit aucun contournement et reste dans les limites par sa sobriété
  (voir SC-011).

## Requirements *(mandatory)*

### Functional Requirements

**Projet applicatif**

- **FR-001**: Le dépôt DOIT contenir un unique projet d'application (pas d'espace de travail
  multi-paquets), géré avec pnpm, dont la version de Node.js attendue (24) est épinglée et
  vérifiée à l'installation.
- **FR-002**: L'application DOIT être construite avec Next.js (App Router) en mode export statique
  et le build DOIT produire un dossier de fichiers servable par un simple serveur de fichiers, sans
  route dynamique, sans route d'API ni fonction serveur.
- **FR-003**: Le projet DOIT exposer des commandes documentées dans le README pour : développement,
  build de l'application, lint, vérification de types, tests unitaires, tests de bout en bout,
  Storybook (développement et build) et une commande de vérification complète équivalente à la CI.
- **FR-004**: La page d'accueil DOIT présenter radar-2027 en français (titre, phrase de
  présentation, mention que le calcul se fait dans le navigateur et qu'aucune donnée n'est
  collectée) et le document DOIT porter `lang="fr"`.
- **FR-005**: Aucune chaîne destinée à l'utilisateur ne DOIT être écrite en dur dans un composant
  ou une page ; toutes DOIVENT passer par next-intl avec des clés nommées, dans un fichier de
  messages de la locale `fr`. Les formats de date et de nombre DOIVENT être localisés par le même
  mécanisme.
- **FR-006**: La structure d'i18n DOIT permettre d'ajouter une seconde locale en ajoutant un
  fichier de messages et une entrée de configuration, sans modifier aucun composant. Seule la
  locale `fr` est livrée et aucune URL ne porte de préfixe de locale.
- **FR-007**: Le site NE DOIT charger aucune ressource depuis un domaine tiers (polices, scripts,
  images, mesure d'audience) et NE DOIT déposer aucun cookie.

**Design system et tokens**

- **FR-008**: Les tokens de design (couleurs, espacements, typographie, rayons, ombres) DOIVENT
  être définis comme variables CSS et consommés par Tailwind CSS v4 ; les thèmes clair et sombre
  DOIVENT être exprimés par ces mêmes variables. Le contraste texte/fond DOIT atteindre au moins
  4,5:1 pour le texte courant et 3:1 pour le texte large et les indicateurs de focus, dans les
  deux thèmes.
- **FR-009**: La palette DOIT être neutre et non partisane : fond et texte en teintes neutres, une
  seule couleur d'accent qui n'est pas la couleur emblématique d'un parti politique français, et
  aucune reprise de logo ou de code visuel partisan. Les couleurs destinées à distinguer les
  candidats dans les graphiques sont hors périmètre de cette spécification.
- **FR-010**: Le thème DOIT suivre par défaut la préférence système de l'utilisateur, pouvoir être
  basculé manuellement, et le choix manuel DOIT être mémorisé uniquement sur l'appareil ; le thème
  initial DOIT être appliqué avant le premier rendu visible.
- **FR-011**: Une règle de lint DOIT rejeter les valeurs de couleur en dur et les valeurs de style
  arbitraires hors du fichier de tokens, dans tout le code de l'application et de la bibliothèque
  de composants.
- **FR-012**: La bibliothèque de composants (`src/ui`) DOIT fournir les composants de base suivants,
  chacun avec une story Storybook couvrant tous ses états et des contrôles pour ses propriétés :
  - **Button** : variantes primaire, secondaire et discrète ; tailles normale et compacte ; états
    repos, survol, focus, actif, désactivé, en cours (chargement) ; rendu possible en lien.
  - **LikertChoice** : groupe de cinq niveaux ordonnés (−2 à +2) avec libellés français de
    « pas du tout d'accord » à « tout à fait d'accord », plus une option « passer » distincte ;
    états sans réponse, réponse sélectionnée, « passé », désactivé.
  - **ThemeChip** : puce de sujet ; états non sélectionné, sélectionné, désactivé (maximum atteint),
    focus.
  - **ThemePicker** : grille de ThemeChip avec minimum et maximum configurables (3 et 5 par
    défaut), compteur « n / max » exposé aux technologies d'assistance, message de limite atteinte
    et message de minimum non atteint ; expose au parent la liste sélectionnée et sa validité.
  - **ProgressBar** : progression déterminée (valeur sur total, par exemple « question 7 sur 25 »)
    avec libellé accessible ; état initial, intermédiaire et complet.
  - **ScoreBar** : barre de 0 à 100 % avec valeur et libellé ; états défini, indéfini (« — »),
    et variante compacte pour les listes.
  - **Card** : conteneur à élévation et rayon issus des tokens ; variantes repos et interactive
    (focalisable), avec en-tête, corps et pied optionnels.
  - **PageShell** : gabarit de page avec en-tête (nom du site, bascule de thème), zone de contenu
    principal, pied de page (liens vers méthodologie et à-propos, prévus mais pouvant pointer vers
    des pages à venir), et lien « aller au contenu » en premier élément focalisable.
  - **EvidenceBadge** : badge indiquant le niveau de preuve d'une position parmi « programme
    officiel », « livre ou plateforme écrite », « déclaration publique ou vote », différenciés
    par un libellé textuel et une forme ou icône, jamais par la seule couleur.
- **FR-013**: Chaque composant DOIT être entièrement utilisable au clavier (Tab, Maj+Tab, Entrée,
  Espace, flèches pour les groupes d'options), exposer des rôles et libellés accessibles corrects,
  et afficher un indicateur de focus visible dans les deux thèmes.
- **FR-014**: Storybook (version stable courante, 10) DOIT être configuré avec l'addon d'accessibilité, une bascule de thème
  clair/sombre dans la barre d'outils, et une page documentant les tokens ; aucune story NE DOIT
  présenter de violation d'accessibilité de niveau critique ou sérieux.
- **FR-015**: Chaque composant et la page d'accueil DOIVENT rester utilisables à 320 px de large
  sans défilement horizontal ni perte de contenu, y compris avec un zoom texte de 200 %.
- **FR-016**: Les composants NE DOIVENT contenir aucune logique métier (calcul de score,
  sélection de questions, encodage d'URL) ; ils reçoivent leurs données et remontent les
  interactions au parent.

**Qualité et intégration continue**

- **FR-017**: TypeScript DOIT être configuré en mode strict et la vérification de types DOIT
  couvrir l'application, la bibliothèque de composants, les stories et les tests.
- **FR-018**: Le lint DOIT inclure, dès le socle, la règle interdisant tout import React, DOM ou
  Next.js dans le module de domaine `src/core` (le dossier peut rester vide jusqu'à la
  fonctionnalité 003).
- **FR-019**: Des tests unitaires Vitest DOIVENT couvrir le comportement de chaque composant
  interactif (sélection, bornes min/max du ThemePicker, états de LikertChoice, bascule de thème)
  et le rendu des composants statiques.
- **FR-020**: Un test de bout en bout Playwright DOIT vérifier que la page d'accueil s'affiche en
  français (attribut de langue `fr`, titre issu du fichier de messages), exécuté contre le build
  statique servi localement.
- **FR-021**: Une CI GitHub Actions DOIT s'exécuter sur chaque pull request vers `main` et sur
  chaque poussée sur `main`, enchaîner lint, vérification de types, tests unitaires, build
  Storybook, build de l'application et tests de bout en bout, et publier le résultat de chaque
  étape sur la pull request.
- **FR-022**: Aucune fusion sur `main` NE DOIT être possible sans CI verte (protection de branche
  exigeant les vérifications de la CI).

**Déploiement et configuration**

- **FR-023**: Le projet DOIT être déployé sur Vercel (plan Hobby) relié au dépôt : production
  déployée depuis `main`, prévisualisation automatique par pull request, aucune fonction serveur,
  aucun stockage Vercel ; la configuration de déploiement vit dans le dépôt.
- **FR-024**: Toutes les réponses HTML servies en production DOIVENT porter les en-têtes de
  sécurité suivants : une politique de sécurité de contenu (CSP) interdisant toute origine tierce
  et aussi stricte que le rendu statique le permet, `X-Content-Type-Options: nosniff`,
  `Referrer-Policy` restrictive (au plus `strict-origin-when-cross-origin`), `Permissions-Policy`
  désactivant caméra, micro et géolocalisation, et une interdiction d'inclusion dans un cadre
  tiers (`frame-ancestors 'none'` ou `X-Frame-Options: DENY`).
- **FR-025**: Un fichier `.env.example` DOIT documenter chaque variable d'environnement utilisée
  par le projet (nom, rôle, exemple factice) ; aucun secret ne DOIT être commité, et l'application
  DOIT se construire et fonctionner sans aucune variable définie.
- **FR-026**: Le README DOIT documenter les prérequis, les commandes de FR-003, la procédure de
  prévisualisation et de déploiement, et renvoyer vers la constitution.

### Key Entities

- **Token de design** : variable nommée (couleur, espacement, taille de police, rayon, ombre)
  portant une valeur par thème ; seule source autorisée pour les styles.
- **Apparence** (thème clair ou sombre) : jeu de valeurs des tokens, sélectionné par préférence système ou choix explicite mémorisé localement ; nommée « apparence » dans le code pour ne pas la confondre avec les thèmes de l'ontologie.
- **Composant de base** : brique d'interface réutilisable de `src/ui`, sans logique métier, décrite
  par ses propriétés et ses états ; possède une story et des tests.
- **Story** : exemple documenté d'un composant dans un état donné, utilisé par Storybook pour la
  revue visuelle et la vérification d'accessibilité.
- **Message i18n** : chaîne destinée à l'utilisateur, identifiée par une clé nommée dans le fichier
  de la locale `fr`.
- **Pipeline de CI** : enchaînement ordonné des vérifications exécutées sur une pull request ; son
  statut conditionne la fusion.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un contributeur disposant de la version de Node attendue obtient la page d'accueil en
  local en moins de 10 minutes à partir d'un clone frais, en suivant uniquement le README.
- **SC-002**: 100 % des chaînes affichées sur la page d'accueil et dans les composants proviennent
  du fichier de messages `fr` : une recherche automatisée de texte en dur renvoie 0 résultat, et la
  modification d'un message change l'écran sans modification de composant.
- **SC-003**: Les 9 composants de base listés dans FR-012 disposent chacun d'une story couvrant
  100 % des états énumérés, vérifiable en parcourant le catalogue Storybook.
- **SC-004**: La vérification automatisée d'accessibilité remonte 0 violation critique ou sérieuse
  sur l'ensemble des stories, dans les deux thèmes.
- **SC-005**: 100 % des éléments interactifs des composants sont atteignables et actionnables au
  clavier seul lors d'un parcours manuel, avec indicateur de focus visible dans les deux thèmes.
- **SC-006**: À 320 px de large (et à 320 px avec zoom texte 200 %), la page d'accueil et toutes
  les stories ne présentent aucun défilement horizontal.
- **SC-007**: Tout texte courant atteint un contraste d'au moins 4,5:1 dans les deux thèmes,
  mesuré sur les tokens de couleur.
- **SC-008**: La CI complète (six étapes) s'exécute en moins de 10 minutes sur une pull request et
  aucune fusion sur `main` n'est possible avec une CI rouge (vérifié par une tentative de fusion
  refusée).
- **SC-009**: Une pull request obtient une URL de prévisualisation fonctionnelle en moins de
  5 minutes après la dernière poussée, et `main` est reflété en production en moins de 5 minutes
  après fusion.
- **SC-010**: 100 % des en-têtes de sécurité listés dans FR-024 sont présents sur les réponses HTML
  de production, et la production n'expose aucune fonction serveur.
- **SC-011**: Le chargement de la page d'accueil en production transfère au plus 200 Ko
  (ressources compressées, polices système incluses) et n'émet aucune requête vers un domaine
  tiers ni ne dépose aucun cookie.
- **SC-012**: Le build de l'application réussit sans aucune variable d'environnement définie, et
  `.env.example` liste 100 % des variables référencées dans le dépôt.

## Assumptions

- **Public de la spécification** : les utilisateurs sont les mainteneurs et contributeurs ; aucun
  parcours électeur n'est livré ici. Les outils cités sont uniquement ceux imposés par la
  constitution (Next.js export statique, Tailwind v4, Storybook 10 + addon a11y, Vitest, Playwright,
  next-intl, pnpm, Node 24, Vercel Hobby, GitHub Actions) ; tout autre choix (structure de
  fichiers, bibliothèques utilitaires, configuration précise) relève du plan.
- **Polices** : la typographie repose sur une pile de polices système ; aucune police n'est chargée
  depuis un domaine tiers ni embarquée en v1 (sobriété et vie privée).
- **Couleur d'accent** : la palette est composée de gris neutres et d'une seule couleur d'accent
  choisie hors des couleurs emblématiques des principaux partis français ; la teinte exacte est une
  décision de design validée par le propriétaire au moment de l'implémentation, la spécification
  n'exige que la neutralité et le contraste.
- **Mémorisation du thème** : le choix explicite de thème est conservé dans le stockage local du
  navigateur, ce que la constitution autorise (donnée qui ne quitte pas l'appareil).
- **Routage de locale** : la locale `fr` étant seule livrée, les URL ne portent pas de préfixe de
  locale ; l'ajout d'un préfixe lors de l'arrivée d'une seconde locale relèvera de la spécification
  qui l'introduira.
- **Composants et parcours** : ThemePicker et LikertChoice encapsulent leurs règles locales
  (bornes 3–5, échelle −2…+2 + « passer ») mais la logique de parcours (navigation, reprise,
  ordre des questions) appartient à la fonctionnalité 004 ; les composants métier (classement,
  fiche candidat, lien de partage) à la fonctionnalité 005.
- **EvidenceBadge** : trois niveaux de preuve issus de la constitution ; l'état « position
  inconnue » n'est pas un niveau de preuve et sera représenté par la fonctionnalité 005.
- **Protection de branche** : la règle « aucune fusion sans CI verte » est mise en œuvre par la
  protection de branche du dépôt, configurée par le propriétaire ; la spécification l'exige, le
  plan décrit la configuration.
- **Compte Vercel** : la liaison du dépôt au projet Vercel est une action manuelle du propriétaire
  (plan Hobby : un seul compte, usage non commercial) ; la configuration qui en dépend est
  versionnée dans le dépôt pour être reproductible.
- **Politique de sécurité de contenu** : l'export statique de Next.js injecte des scripts en ligne
  sans nonce ; la CSP tolère donc ce qui est strictement nécessaire au rendu statique mais interdit
  toute origine tierce. Le durcissement ultérieur (hachages) pourra être traité dans un plan.
- **Tests de bout en bout** : exécutés dans un seul navigateur (Chromium) en CI contre le build
  statique ; les autres navigateurs pourront être ajoutés par une spécification ultérieure.
- **Mesure d'audience** : aucune, même sans cookie (décision du propriétaire du 2026-11-06) ; le
  socle n'en installe pas et aucune spécification ultérieure n'en prévoit.
- **Dépendances** : aucune dépendance sur les spécifications 002 à 005 ; en revanche 003, 004 et
  005 dépendent de ce socle.

## Out of Scope

- Composants métier des fonctionnalités 004 (parcours questionnaire) et 005 (résultats, fiche
  candidat, partage) ; seules les briques génériques listées dans FR-012 sont livrées.
- Données de candidats, ontologie des thèmes, banque de questions et pipeline d'extraction
  (fonctionnalité 002).
- Moteur de score, sélection des questions et codec d'URL (fonctionnalité 003) ; seule la règle de
  lint protégeant `src/core` est posée ici.
- Pages « Méthodologie » et « À propos » (les liens du PageShell peuvent pointer vers des pages à
  venir).
- Couleurs d'identification des candidats dans les graphiques.
- Mesure d'audience, même sans cookie.
- Nom de domaine personnalisé et surveillance des quotas Vercel.

## Constitution Compliance

| Principe | Prise en compte dans cette spécification |
|---|---|
| I. Neutralité et traçabilité | FR-009 (palette non partisane), FR-012 EvidenceBadge (niveaux de preuve constitutionnels) ; aucune donnée candidate manipulée. |
| II. Vie privée | FR-007 (aucun tiers, aucun cookie), FR-010 (thème mémorisé sur l'appareil), FR-024 (en-têtes), SC-011. |
| III. Cœur métier pur | FR-016 (composants sans logique métier), FR-018 (règle de lint `src/core` posée dès le socle). |
| IV. Design system d'abord | FR-008 à FR-015, SC-003 à SC-007. |
| V. Tests et CI bloquante | FR-017 à FR-022, SC-008. |
| VI. i18n | FR-004 à FR-006, SC-002. |
| VII. Simplicité et statique | FR-001, FR-002, FR-023, SC-011 ; aucune fonction serveur ni stockage hébergé. |
| Contraintes techniques et hébergement | FR-001, FR-002, FR-008, FR-014, FR-019 à FR-021, FR-023 à FR-026. |
