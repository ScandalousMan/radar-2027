# Feature Specification: Moteur de score, sélection déterministe des questions et codec URL

**Feature Branch**: `003-domaine-score-selection-codec`

**Created**: 2026-11-06

**Status**: Draft

**Input**: User description: "Moteur de score, sélection déterministe des questions et codec URL"

## User Scenarios & Testing *(mandatory)*

Cette fonctionnalité constitue le cœur métier de radar-2027 : trois règles pures et
déterministes (calcul du score, sélection des questions, encodage de l'état dans l'URL) et la
notion de version de banque qui les relie. Ses « utilisateurs » sont d'une part le répondant,
qui perçoit ces règles à travers les résultats qu'il voit et les liens qu'il partage, et d'autre
part les autres fonctionnalités du produit (parcours questionnaire, page de résultats, page
méthodologie) qui s'appuient sur elles.

Notation utilisée dans tout le document :

- `u` : réponse du répondant à une question, entière de −2 à +2, ou « passée », ou « non répondue ».
- `c` : position d'un candidat sur une question, entière de −2 à +2, ou « inconnue ».
- `P` (ensemble) : les sujets prioritaires choisis par le répondant, 3 à 5 thèmes.
- `w_t` : poids du thème `t`, égal à 3 si `t` est prioritaire, sinon 1.
- `T` : nombre de thèmes de la version de banque (16 dans l'ontologie actuelle), rangés dans un
  **ordre canonique** fixé par la version de banque.
- Conversion en pourcentage d'une valeur `x` de [−1, +1] : `(x + 1) / 2`, exprimée en %.

### User Story 1 - Un score global plafonné par les sujets clés (Priority: P1)

En tant que répondant, je vois pour chaque candidat un score global, un score par thème et un
classement. Le score global d'un candidat ne peut jamais dépasser son accord avec moi sur les
sujets que j'ai déclarés prioritaires. Les candidats dont les positions sont trop peu
documentées pour être comparés sont mis à part, sans être classés.

**Why this priority**: c'est la promesse différenciante du produit (« un candidat ne peut être
très aligné que s'il l'est d'abord sur vos sujets »). Sans ce calcul, rien d'autre n'a de valeur.

**Independent Test**: on peut le tester seul en fournissant une liste de questions (avec leurs
thèmes), des réponses, un ensemble de sujets prioritaires et les positions de quelques candidats,
puis en vérifiant les scores, statuts et rangs produits contre des valeurs attendues calculées à
la main (exemples A et B ci-dessous).

**Acceptance Scenarios**:

1. **Given** l'exemple A : sujet prioritaire = économie, autre thème = santé ; q1 (économie)
   `u = +2, c = +1` ; q2 (économie) `u = −1, c = +1` ; q3 (santé) `u = +2, c = +2` ; q4 (santé)
   `u = 0`, `c` inconnue, **When** le score du candidat est calculé, **Then** les concordances
   sont `s1 = 0,5`, `s2 = 0`, `s3 = 1`, q4 est exclue ; `S_économie = 0,25` (62 %) ;
   `S_santé` est indéfini (une seule question exploitable, affiché « — ») ; `W = 0,25` ;
   `P = 0,25` ; `G = 62 %` ; couverture = 3/4 = 75 % ; le candidat est classé, bande
   « plutôt aligné ».
2. **Given** l'exemple B : un thème prioritaire avec `S = 0` (50 %) et deux autres thèmes avec
   `S = 1,0` (100 %), tous définis, **When** le score est calculé, **Then**
   `W = (3·0 + 1 + 1) / 5 = 0,4` soit 70 %, `P = 50 %`, et `G = 50 %` (plafond strict).
3. **Given** un répondant qui a répondu (sans passer) à 10 questions et un candidat dont la
   position est connue sur 5 d'entre elles seulement, **When** le score est calculé, **Then** la
   couverture vaut 50 %, le candidat porte le statut « données insuffisantes », n'a pas de rang,
   et ses scores de thème définis (par exemple un thème à 2 questions connues) sont tout de même
   fournis pour affichage.
4. **Given** un candidat dont `P` est indéfini (aucun thème prioritaire avec au moins 2 questions
   exploitables) mais dont la couverture est de 90 %, **When** le score est calculé, **Then** le
   candidat porte le statut « données insuffisantes » et n'a pas de rang.
5. **Given** trois candidats classés X (`G` exact 62,5 %, `P` 62,5 %), Y (`G` 62,2 %, `P` 65 %)
   et Z (`G` 58 %), **When** le classement est produit, **Then** X et Y affichent tous deux
   `62 %` et le rang 1 (égalité), Y est listé avant X (départage par `P`), Z a le rang 3.
6. **Given** un candidat dont `W` vaut 85 % et `P` vaut 72 %, **When** le score est calculé,
   **Then** `G` vaut 72 % (plafond strict) et le candidat n'apparaît pas en bande
   « très aligné » ; il est impossible d'atteindre 80 % sans au moins 80 % sur les sujets clés.
7. **Given** un calcul où deux candidats n'ont pour seule différence que le niveau de preuve de
   leurs positions (programme officiel contre déclaration publique), **When** le score est
   calculé, **Then** leurs scores sont identiques : le niveau de preuve n'intervient pas dans le
   calcul.

---

### User Story 2 - Une sélection de questions déterministe et adaptée aux sujets (Priority: P2)

En tant que répondant, lorsque je choisis mes 3 à 5 sujets prioritaires et un mode (complet ou
court), je reçois une liste ordonnée de questions qui couvre tous les thèmes, approfondit mes
sujets prioritaires, alterne les thèmes, et qui est toujours la même pour les mêmes choix,
quelles que soient mes réponses.

**Why this priority**: la sélection conditionne à la fois la pertinence du questionnaire et la
possibilité d'encoder les réponses de manière compacte (l'URL ne contient pas les identifiants
des questions : elle suppose que la sélection est recalculable).

**Independent Test**: on peut la tester seule en fournissant une version de banque fictive
(questions avec thèmes et pouvoir discriminant), un mode et des sujets prioritaires, puis en
vérifiant le nombre de questions, les quotas par thème, l'ordre de présentation et la stabilité
entre deux appels.

**Acceptance Scenarios**:

1. **Given** une banque à 16 thèmes de 20 questions chacun, le mode complet et 3 sujets
   prioritaires, **When** la sélection est calculée, **Then** elle contient exactement
   100 questions distinctes ; les quotas sont 14 pour chacun des 3 thèmes prioritaires, 5 pour
   6 autres thèmes et 4 pour les 7 derniers (ordre canonique), soit 42 + 30 + 28 = 100.
2. **Given** la même banque, le mode court et 5 sujets prioritaires, **When** la sélection est
   calculée, **Then** elle contient exactement 25 questions ; les quotas sont 3, 3, 3, 3, 2 pour
   les thèmes prioritaires (ordre canonique) et 1 pour chacun des 11 autres thèmes.
3. **Given** la même banque, le mode complet et 5 sujets prioritaires, **When** la sélection est
   calculée, **Then** les quotas sont 12, 11, 11, 11, 11 pour les prioritaires et 4 pour chacun
   des 11 autres thèmes (total 100).
4. **Given** un même triplet (version de banque, mode, sujets), **When** la sélection est
   calculée deux fois, ou calculée sur deux appareils différents, **Then** les deux listes sont
   identiques, question par question et dans le même ordre.
5. **Given** un thème contenant trois questions de pouvoir discriminant 0,9, 0,9 et 0,4 avec un
   quota de 2, **When** la sélection est calculée, **Then** les deux questions à 0,9 sont
   retenues, et en cas d'égalité stricte de pouvoir discriminant c'est l'identifiant le plus
   petit (ordre lexicographique) qui est pris en premier.
6. **Given** une sélection en mode complet avec 3 sujets prioritaires, **When** on parcourt
   l'ordre de présentation, **Then** deux questions consécutives n'ont jamais le même thème
   d'ancrage tant qu'au moins deux thèmes ont encore des questions à présenter, et les trois
   premières questions appartiennent aux trois thèmes prioritaires dans l'ordre canonique.
7. **Given** une banque où un thème prioritaire ne compte que 6 questions alors que son quota
   est 14, **When** la sélection est calculée, **Then** le déficit de 8 questions est comblé par
   des questions supplémentaires prises d'abord dans les autres thèmes prioritaires puis dans
   l'ensemble de la banque, et la sélection compte bien 100 questions.
8. **Given** une question rattachée à deux thèmes dont l'un est prioritaire, **When** elle est
   retenue au titre du thème prioritaire, **Then** elle compte aussi pour le quota de son second
   thème (ce thème a besoin d'une question de moins).

---

### User Story 3 - Un lien de résultat compact, fidèle et vérifié (Priority: P3)

En tant que répondant, je peux partager mon résultat par un lien court dont le fragment contient
l'intégralité de mon état (version de banque, mode, sujets prioritaires, chaque réponse y compris
« passée » et « non répondue »). Quiconque ouvre ce lien voit exactement le même état ; un lien
abîmé est refusé avec une explication claire plutôt que d'afficher un résultat faux.

**Why this priority**: le partage est le principal vecteur de diffusion du produit, et la
constitution impose que l'état complet tienne dans le fragment et que l'encodage soit une
bijection. Elle dépend des deux histoires précédentes (longueur de la charge = taille de la
sélection).

**Independent Test**: on peut le tester seul en encodant des états construits à la main, en
vérifiant la longueur et le préfixe du fragment, en décodant le résultat et en comparant à
l'état d'origine, puis en altérant des caractères et en vérifiant le rejet.

**Acceptance Scenarios**:

1. **Given** un état complet (version de banque numéro 1, codée 0, mode complet, sujets
   d'indices canoniques 2, 7 et 9, réponses : première question `+2`, deuxième « passée », troisième `−1`,
   les 97 autres « non répondues »), **When** il est encodé, **Then** le fragment est
   `#1.AACEAgDFgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMM` : préfixe `1.` puis
   59 caractères représentant 44 octets, dont les 8 premiers valent (en hexadécimal)
   `00 00 84 02 00 C5 80 00` et le dernier (somme de contrôle) `C3`.
2. **Given** l'état court correspondant (mode court, sujets d'indices 0, 2, 7, 9 et 12, mêmes
   trois premières réponses, 22 « non répondues »), **When** il est encodé, **Then** la charge
   fait 16 octets et 22 caractères : `#1.AAGFEgDFgAAAAAAAAAAAng`.
3. **Given** n'importe quel état valide (tout mode, toute combinaison de 3 à 5 sujets, toute
   combinaison de réponses, toute version de banque connue), **When** il est encodé puis
   décodé, **Then** l'état obtenu est strictement identique à l'état de départ.
4. **Given** n'importe quelle charge valide, **When** elle est décodée puis réencodée, **Then**
   la chaîne obtenue est identique caractère pour caractère à la chaîne de départ.
5. **Given** le fragment du scénario 1 dont un caractère quelconque a été remplacé, inséré ou
   supprimé, **When** il est décodé, **Then** le décodage est refusé avec un motif explicite
   (longueur incorrecte, contenu invalide ou somme de contrôle invalide) et aucun état partiel
   n'est produit.
6. **Given** un fragment dont le masque de sujets compte 2 bits (ou 6 bits), ou dont une réponse
   porte le code 7, ou dont les bits de bourrage ne sont pas nuls, **When** il est décodé,
   **Then** le décodage est refusé avec le motif « contenu invalide ».
7. **Given** un fragment commençant par `2.` ou sans point, **When** il est décodé, **Then** le
   décodage est refusé avec le motif « version de lien non prise en charge ».

---

### User Story 4 - Des versions de banque immuables et des anciens liens fidèles (Priority: P4)

En tant que répondant ayant partagé un lien il y a plusieurs semaines, je veux que ce lien
s'ouvre encore après que la banque de questions ou les positions des candidats ont évolué, et
qu'il montre exactement le résultat que j'ai vu au moment du partage : chaque version de banque
fige ensemble les questions, les candidats inclus et leurs positions.

**Why this priority**: indispensable à la pérennité des liens partagés, mais ne se manifeste
qu'à partir de la deuxième version de banque.

**Independent Test**: on peut le tester seul avec deux versions de banque fictives (la seconde
retirant une question, en ajoutant une autre et modifiant une position), en décodant un lien
émis avec la première et en vérifiant que la sélection, les positions utilisées et le score sont
identiques à ceux obtenus avec la première version seule.

**Acceptance Scenarios**:

1. **Given** une banque publiée en deux versions (numéros 1 et 2), **When** un nouveau résultat
   est encodé, **Then** l'octet de version vaut 1 (numéro 2 moins un : la dernière version
   connue).
2. **Given** un lien dont l'octet de version vaut 0 (version numéro 1) alors que la version
   courante est la 2, **When** il est décodé, **Then** la sélection est reconstruite avec les
   thèmes, questions et pouvoirs discriminants figés de la version 1, et chaque réponse est
   associée à la même question qu'au moment du partage.
3. **Given** ce même lien, où la position d'un candidat sur la question q17 et la liste des
   candidats inclus ont changé entre la version 1 et la version 2, **When** le score est calculé,
   **Then** les positions et la liste de candidats utilisées sont celles figées dans la version 1,
   les scores, rangs et bandes sont identiques à ceux affichés le jour du partage, et le résultat
   signale qu'il repose sur une version antérieure de la banque (avec la date de publication de
   cette version).
4. **Given** une version de banque publiée, **When** l'énoncé d'une de ses questions doit être
   modifié, **Then** la version existante reste inchangée et une nouvelle version est créée.
5. **Given** un lien dont l'octet de version vaut 3 (version numéro 4) alors que seules les
   versions 1 et 2 sont publiées, **When** il est décodé, **Then** le décodage est refusé avec le motif « version de
   banque inconnue (lien créé par une version plus récente de l'application) ».

---

### Edge Cases

- Aucune question répondue (toutes « passées » ou « non répondues ») : la couverture est
  indéfinie ; tous les candidats sont « données insuffisantes », aucun classement n'est produit.
- Candidat dont toutes les positions sont inconnues : couverture 0 %, `P` indéfini, « données
  insuffisantes ».
- Couverture exactement égale à 60 % : le candidat est classé (seuil inclusif).
- Thème avec exactement 2 questions exploitables : score de thème défini.
- Question rattachée à deux thèmes prioritaires : sa concordance compte dans les deux scores de
  thème, donc deux fois dans `P` ; c'est voulu.
- Tous les thèmes prioritaires indéfinis mais des thèmes non prioritaires définis : `P`
  indéfini, donc « données insuffisantes » malgré un `W` calculable.
- Égalité parfaite de `G` arrondi, `P`, couverture : départage par identifiant de candidat
  (ordre lexicographique), ordre stable entre deux calculs.
- Banque dont le nombre total de questions est inférieur à `N` : la sélection contient toutes
  les questions de la banque (moins de `N`), et la longueur attendue de la charge est calculée
  sur cette taille réelle.
- Les planchers de quota dépassent `N` (impossible avec 16 thèmes : 16 × 3 = 48 ≤ 100 et
  16 × 1 = 16 ≤ 25) : situation considérée comme une erreur de configuration de la banque,
  détectée à la validation de la banque (spec 002) et non au moment de la sélection.
- Mode court et question rattachée à deux thèmes non prioritaires : elle compte une seule fois
  dans le pseudo-thème « autres thèmes » (FR-013), alors qu'en mode complet elle compterait dans
  chacun des deux thèmes.
- Fragment absent ou vide : ce n'est pas un lien de résultat ; aucun décodage n'est tenté et
  aucune erreur n'est signalée.
- Fragment contenant des caractères hors de l'alphabet base64url, ou un bourrage `=` : refusé
  (« contenu invalide »).
- Bits réservés de l'octet de drapeaux non nuls : refusé (« contenu invalide »), afin de
  préserver la bijection et de laisser ces bits à de futures évolutions.

## Requirements *(mandatory)*

### Functional Requirements

#### Score

- **FR-001**: Le système DOIT calculer, pour chaque question où `u` est une valeur numérique
  (ni « passée » ni « non répondue ») et `c` est connue, la concordance
  `s = 1 − 0,5 · |u − c|`, comprise dans [−1, +1], et DOIT pouvoir la restituer en pourcentage
  `(s + 1) / 2`.
- **FR-002**: Le système DOIT exclure de tout calcul de score les questions « passées », « non
  répondues » ou à position de candidat « inconnue ».
- **FR-003**: Le système DOIT compter chaque question dans chacun de ses thèmes (1 ou 2).
- **FR-004**: Le système DOIT calculer le score de thème `S_t` comme la moyenne arithmétique des
  concordances des questions exploitables (au sens de FR-001) du thème `t`, et DOIT le déclarer
  **indéfini** lorsque ce thème compte moins de 2 questions exploitables. Un score de thème
  indéfini est restitué comme tel (affiché « — ») et exclu de tous les agrégats.
- **FR-005**: Le système DOIT calculer le score prioritaire `P` comme la moyenne simple des `S_t`
  définis des thèmes prioritaires, et le déclarer indéfini si aucun thème prioritaire n'a de
  score défini.
- **FR-006**: Le système DOIT calculer le score pondéré `W = Σ w_t · S_t / Σ w_t` sur l'ensemble
  des thèmes dont le score est défini, avec `w_t = 3` pour un thème prioritaire et 1 sinon.
- **FR-007**: Le système DOIT calculer la couverture d'un candidat comme le quotient du nombre
  de questions répondues (valeur numérique) dont la position du candidat est connue par le
  nombre total de questions répondues (valeur numérique) ; la couverture est indéfinie si le
  dénominateur est nul. Cette couverture « par répondant » est distincte de la couverture de
  corpus (part des questions actives à position connue) calculée et publiée par la spec 002,
  qui n'intervient pas dans le score.
- **FR-008**: Le système DOIT attribuer le statut « données insuffisantes » à tout candidat dont
  la couverture est indéfinie ou strictement inférieure à 60 %, ou dont `P` est indéfini. Un tel
  candidat n'a pas de rang ni de score global, est restitué à part, mais ses scores de thème
  définis et sa couverture restent fournis.
- **FR-009**: Pour tout candidat non concerné par FR-008, le système DOIT calculer le score
  global `G` en pourcentage à partir de `W %` et `P %` selon FR-010.
- **FR-010**: `G` DOIT être tel qu'un candidat ne puisse pas être présenté comme mieux aligné
  globalement qu'il ne l'est sur les sujets prioritaires : `G = min(W %, P %)` (plafond strict,
  décision du 2026-11-06 ; aucune tolérance).
- **FR-011**: Le système DOIT arrondir tout pourcentage destiné à l'affichage à l'entier
  inférieur (troncature) ; les comparaisons de classement et les seuils de bande utilisent la
  valeur affichée de `G` (exemple A : 62,5 % → 62 %).
- **FR-012**: Le système DOIT classer les candidats non concernés par FR-008 par `G` affiché
  décroissant, puis `P` exact décroissant, puis couverture décroissante, puis identifiant de
  candidat croissant (ordre lexicographique). Les candidats dont le `G` affiché est identique
  partagent le même rang ; le rang suivant saute autant de places (1, 1, 3).
- **FR-013**: En mode court, le système DOIT remplacer les thèmes non prioritaires, dans le
  calcul de `W` et dans la restitution, par un unique pseudo-thème « autres thèmes » de poids 1
  dont le score est la moyenne des concordances de toutes les questions exploitables rattachées
  à au moins un thème non prioritaire (chaque question comptée une fois), indéfini si moins de
  2 questions exploitables. En mode complet, chaque thème est restitué individuellement.
- **FR-014**: Le système DOIT attribuer à chaque candidat classé une bande d'alignement d'après
  son `G` affiché : ≥ 80 « très aligné », 60 à 79 « plutôt aligné », 40 à 59 « mitigé »,
  < 40 « éloigné ».
- **FR-015**: Le calcul du score NE DOIT PAS tenir compte du niveau de preuve des positions ; ce
  niveau est transmis tel quel pour affichage (badge) sans pondération.
- **FR-016**: Le système DOIT restituer, pour chaque candidat : son statut (classé ou « données
  insuffisantes »), son rang et sa bande le cas échéant, `G`, `P`, `W`, la couverture, le score
  de chaque thème (ou « autres thèmes » en mode court) avec le nombre de questions exploitables
  ayant servi, et, par question, la concordance ou le motif d'exclusion (passée, non répondue,
  position inconnue).
- **FR-017**: Le calcul de score DOIT être déterministe et pur : mêmes entrées (réponses,
  sujets, mode, positions, version) ⇒ mêmes sorties, sans dépendance à l'heure, au hasard ou à
  une ressource réseau.

#### Sélection déterministe

- **FR-018**: Le système DOIT produire, à partir d'une version de banque, d'un mode et d'un
  ensemble de 3 à 5 sujets prioritaires, une liste ordonnée de questions, sans aucune dépendance
  aux réponses du répondant (adaptative aux sujets, pas aux réponses).
- **FR-019**: Le nombre cible `N` DOIT être 100 en mode complet et 25 en mode court ; la liste
  DOIT contenir exactement `N` questions distinctes dès lors que la banque en compte au moins
  `N`, et toutes les questions de la banque sinon.
- **FR-020**: Le système DOIT utiliser le pouvoir discriminant `D_q` fourni par la version de
  banque (valeur précalculée par la spec 002, nombre réel compris entre 0 et 2) sans le
  recalculer.
- **FR-021**: Le système DOIT calculer un quota par thème ainsi : part exacte
  `e_t = N · w_t / Σ w` avec `Σ w = 3 · |P| + (T − |P|)` ; quota initial
  `q_t = max(plancher, partie entière de e_t)` avec un plancher de 3 en mode complet et 1 en mode
  court ; puis le reste `N − Σ q_t` est distribué, une unité à la fois, aux thèmes par ordre
  décroissant de `(e_t − q_t)` puis par ordre canonique, sans qu'un thème reçoive plus d'une
  unité. La somme des quotas DOIT valoir exactement `N`.
- **FR-022**: Le système DOIT remplir les quotas par un parcours glouton des thèmes : d'abord
  les thèmes prioritaires dans l'ordre canonique, puis les autres dans l'ordre canonique. Pour
  chaque thème, tant que le nombre de questions déjà retenues rattachées à ce thème est
  inférieur à son quota et qu'il reste des candidates, la question non encore retenue de ce
  thème ayant le plus grand `D_q`, puis le plus petit identifiant, est retenue. Une question
  retenue crédite tous ses thèmes.
- **FR-023**: Si, après le premier passage, la liste compte moins de `N` questions (banque trop
  petite sur un thème, ou chevauchements de questions à deux thèmes), le système DOIT compléter
  en second passage : d'abord les questions restantes des thèmes prioritaires (dans l'ordre
  canonique, par `D_q` décroissant puis identifiant), puis les questions restantes de toute la
  banque (par `D_q` décroissant puis identifiant), jusqu'à atteindre `N` ou épuiser la banque.
- **FR-024**: Le système DOIT attribuer à chaque question retenue un thème d'ancrage : le thème
  au titre duquel elle a été retenue au premier passage, ou, pour une question du second
  passage, le premier de ses thèmes dans l'ordre de rotation (FR-025).
- **FR-025**: Le système DOIT ordonner la présentation en tourniquet sur les thèmes d'ancrage :
  ordre de rotation = thèmes prioritaires dans l'ordre canonique puis autres thèmes dans l'ordre
  canonique ; à chaque tour, chaque thème ayant encore des questions livre sa question suivante
  (par `D_q` décroissant puis identifiant) ; les thèmes épuisés sont sautés. Deux questions
  consécutives n'ont donc jamais le même thème d'ancrage tant qu'au moins deux thèmes ont encore
  des questions.
- **FR-026**: La position d'une question dans cet ordre de présentation (à partir de 0) DOIT
  être l'index utilisé pour sa réponse dans la charge encodée (FR-032).
- **FR-027**: La sélection DOIT être déterministe et pure : même triplet (version, mode, sujets)
  ⇒ même liste, sur tout appareil et à tout moment.

#### Codec URL

- **FR-028**: Le système DOIT encoder l'état complet d'un résultat (version de banque, mode,
  sujets prioritaires, réponse à chaque question de la sélection y compris « passée » et « non
  répondue ») dans le **fragment** de l'URL, sous la forme `#1.<charge>`, où `1` est la version
  du format de lien, écrite en clair, et `<charge>` est la charge binaire encodée en base64url
  **sans bourrage** `=`.
- **FR-029**: La charge binaire DOIT être composée, dans cet ordre : (1) 1 octet : numéro de la
  version de banque **moins un** (les numéros publiés sont contigus à partir de 1, spec 002 ;
  la première version, numéro 1, est donc codée 0) ;
  (2) 1 octet de drapeaux : bit de poids faible = mode (0 complet, 1 court), les 7 autres bits
  réservés et nuls ; (3) 3 octets : masque des sujets prioritaires, le premier octet portant les
  thèmes d'indices canoniques 0 à 7 (bit de poids faible = indice 0), le deuxième les indices 8
  à 15, le troisième les indices 16 à 23 ; (4) les réponses, 3 bits chacune, dans l'ordre de
  présentation, empaquetées du bit de poids fort vers le bit de poids faible, les bits de
  bourrage du dernier octet étant nuls ; (5) 1 octet de somme de contrôle.
- **FR-030**: Chaque réponse DOIT être codée sur 3 bits : 0 = non répondue, 1 = passée, 2 à 6 =
  valeurs −2 à +2 (valeur = code − 4) ; le code 7 est invalide.
- **FR-031**: La somme de contrôle DOIT être un CRC-8 de polynôme x⁸ + x² + x + 1 (0x07), valeur
  initiale 0, sans réflexion ni masque final, calculé sur tous les octets qui la précèdent.
- **FR-032**: Pour une sélection de `n` questions, la charge DOIT faire
  `5 + ⌈3·n / 8⌉ + 1` octets : 44 octets (59 caractères) en mode complet à 100 questions et
  16 octets (22 caractères) en mode court à 25 questions.
- **FR-033**: Le décodeur DOIT, dans cet ordre : vérifier le préfixe `1.` ; vérifier que la
  charge ne contient que des caractères base64url, sans bourrage, et que les bits inutilisés du
  dernier caractère sont nuls ; vérifier que l'octet de version, augmenté de un, désigne un numéro de version publié ;
  vérifier que les bits réservés sont nuls ; vérifier que le masque ne désigne que des thèmes
  existants dans cette version et compte 3 à 5 bits ; recalculer la sélection à partir de
  (version, mode, sujets) ; vérifier la longueur exacte attendue (FR-032) ; vérifier la somme de
  contrôle ; vérifier que chaque code de réponse vaut 0 à 6 et que les bits de bourrage sont
  nuls.
- **FR-034**: Toute charge échouant à une vérification de FR-033 DOIT être rejetée sans produire
  d'état partiel, avec un motif de rejet distinct parmi : version de lien non prise en charge,
  contenu invalide, version de banque inconnue, longueur incorrecte, somme de contrôle invalide.
  Le motif est destiné à être affiché au répondant en langage clair par la fonctionnalité de
  résultats (spec 005).
- **FR-035**: L'encodage DOIT être une bijection entre états valides et charges valides :
  `decode(encode(état)) = état` pour tout état valide, et `encode(decode(charge)) = charge`
  pour toute charge valide ; deux états distincts produisent deux fragments distincts.
- **FR-036**: L'encodeur DOIT refuser d'encoder un état invalide (moins de 3 ou plus de 5
  sujets, mode inconnu, nombre de réponses différent de la taille de la sélection, valeur de
  réponse hors échelle).

#### Versions de banque

- **FR-037**: Une version de banque DOIT être immuable : la liste ordonnée des thèmes, la liste
  des questions avec leurs identifiants, leurs thèmes et leur `D_q`, la liste des candidats
  inclus et la position de chaque candidat sur chaque question (valeur et niveau de preuve) ne
  changent jamais une fois la version publiée. Toute modification (énoncé, thème, ajout ou
  retrait de question, inclusion ou retrait d'un candidat, mise à jour d'une position) DOIT
  donner lieu à une nouvelle version, ajoutée en fin de liste.
- **FR-038**: L'application DOIT toujours encoder un nouveau résultat avec la dernière version
  de banque connue.
- **FR-039**: Le décodeur DOIT reconstruire la sélection d'un ancien lien avec la version de
  banque indiquée dans la charge, et non avec la version courante.
- **FR-040**: Lors du score d'un ancien lien, le système DOIT utiliser exclusivement les
  candidats et les positions figés dans la version de banque indiquée dans la charge, de sorte
  que les scores, rangs et bandes soient identiques à ceux obtenus au moment du partage, et DOIT
  signaler que le résultat repose sur une version antérieure de la banque, avec la date de
  publication de cette version. Aucune donnée courante n'entre dans ce calcul (décision du
  2026-11-06 : positions figées par version). Les données d'une version antérieure ne sont
  chargées que lorsqu'un lien la référence.
- **FR-041**: Un identifiant de question DOIT désigner la même question dans toutes les versions
  où il apparaît ; une question dont l'énoncé change reçoit un nouvel identifiant.

### Key Entities

- **Version de banque** : instantané immuable publié de la banque de questions ; identifiée par
  son numéro (entier contigu à partir de 1, registre de la spec 002), codé dans le lien comme
  numéro moins un ; contient la liste ordonnée des thèmes (ordre
  canonique), les questions (identifiant, énoncé, 1 ou 2 thèmes, `D_q`), les candidats inclus,
  la position de chaque candidat sur chaque question et une date de publication.
- **Thème** : sujet de l'ontologie (16 actuellement), identifié par un identifiant stable et un
  indice canonique dans la version ; prioritaire ou non selon le choix du répondant.
- **Question** : énoncé rattaché à 1 ou 2 thèmes, avec un identifiant stable et un pouvoir
  discriminant `D_q`, figés dans la version de banque.
- **État de résultat** : version de banque, mode (complet ou court), ensemble de 3 à 5 sujets
  prioritaires, et pour chaque question de la sélection une réponse (−2 à +2, passée, non
  répondue). C'est l'objet encodé dans le fragment d'URL.
- **Sélection** : liste ordonnée de questions dérivée de (version, mode, sujets), chaque
  question portant un thème d'ancrage et une position de présentation.
- **Position de candidat** : valeur −2 à +2 ou « inconnue » d'un candidat sur une question, avec
  un niveau de preuve transmis pour affichage ; figée dans la version de banque (spec 002).
- **Résultat de score** : pour un candidat, statut, rang, bande, `G`, `P`, `W`, couverture,
  scores de thème (définis ou indéfinis, avec effectif), détail par question (concordance ou
  motif d'exclusion), indicateur « version antérieure ».
- **Charge encodée** : suite d'octets (en-tête, réponses, somme de contrôle) et sa
  représentation texte base64url préfixée par la version du format de lien.
- **Motif de rejet** : raison typée pour laquelle une charge est refusée (version de lien non
  prise en charge, contenu invalide, version de banque inconnue, longueur incorrecte, somme de
  contrôle invalide).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Les exemples chiffrés A et B de cette spécification sont reproduits exactement
  (A : `S_économie` 62 %, `S_santé` « — », `G` 62 %, couverture 75 % ; B : `W` 70 %, `P` 50 %,
  `G` 50 % en plafond strict) et figurent, inchangés, dans la page « Méthodologie ».
- **SC-002**: Sur au moins 10 000 états valides générés aléatoirement (les deux modes, toutes
  tailles de 3 à 5 sujets, toutes réponses, toutes versions connues), 100 % satisfont
  `decode(encode(état)) = état`, et 100 % des charges ainsi produites satisfont
  `encode(decode(charge)) = charge`.
- **SC-003**: 100 % des fragments valides dans lesquels un seul caractère a été remplacé, inséré
  ou supprimé sont rejetés ; au moins 99 % des charges aléatoires de longueur correcte sont
  rejetées.
- **SC-004**: Pour les 13 496 combinaisons (2 modes × tous les sous-ensembles de 3 à 5 thèmes
  parmi 16), la somme des quotas vaut exactement `N`, la sélection compte exactement `N`
  questions distinctes sur une banque d'au moins `N` questions par mode, et deux calculs
  successifs donnent la même liste.
- **SC-005**: Pour tout jeu de données de test, aucun candidat classé n'a un `G` supérieur à son
  `P` (plafond strict) et aucun candidat n'atteint la bande « très aligné » sans `P ≥ 80 %`.
- **SC-006**: Dans 100 % des sélections testées, deux questions consécutives n'ont jamais le
  même thème d'ancrage tant qu'au moins deux thèmes ont encore des questions à présenter.
- **SC-007**: Les fragments produits font exactement 59 caractères après `1.` en mode complet et
  22 en mode court, pour toute combinaison de sujets et de réponses.
- **SC-008**: Le calcul complet du classement (au moins 22 candidats, 100 questions, 16 thèmes ;
  18 candidats sont déclarés au 2026-11-08) et le
  décodage d'un lien s'achèvent chacun en moins de 100 ms sur un téléphone d'entrée de gamme.
- **SC-009**: Un lien émis avec la version de banque 1, décodé après publication de la version 2
  (questions, candidats et positions modifiés), reproduit à l'identique les scores, rangs, bandes
  et couvertures obtenus au moment de son émission, dans 100 % des cas de test.

## Assumptions

- Le nombre de thèmes `T` est fourni par la version de banque et vaut 16 dans l'ontologie
  actuelle ; le masque sur 3 octets autorise jusqu'à 24 thèmes. Au-delà, une nouvelle version du
  format de lien serait nécessaire.
- Les planchers de quota ne dépassent jamais `N` (16 × 3 = 48 ≤ 100 ; 16 × 1 = 16 ≤ 25) ; toute
  banque violant cette contrainte est refusée à la validation de la banque (spec 002), pas au
  moment de la sélection.
- La banque cible compte 250 à 300 questions, soit au moins `N` questions par mode ; le cas
  d'une banque plus petite que `N` est géré (liste plus courte, longueur de charge adaptée) mais
  n'est pas un cas nominal. Au 2026-11-08, le corpus compte 96 énoncés (6 par thème) et aucune
  version n'est encore publiée : tant que la banque reste sous 100 questions, le mode complet
  retient toutes les questions et la charge est plus courte que 44 octets (FR-019, FR-032) ;
  SC-004 et SC-007 se vérifient sur une banque de test d'au moins `N` questions.
- Le pouvoir discriminant `D_q` est précalculé par la spec 002 et figé dans la version de
  banque ; sa formule n'appartient pas à cette spécification.
- Le départage à égalité de `D_q` ou d'identifiants se fait par ordre lexicographique des
  identifiants, qui sont uniques dans une version.
- L'arrondi d'affichage est la troncature à l'entier inférieur, choix conservateur cohérent avec
  l'esprit du plafond (on n'affiche jamais plus que l'accord réel) ; il reproduit le « 62 % » de
  l'exemple A (62,5 %).
- En mode court, les thèmes non prioritaires sont agrégés en un pseudo-thème « autres thèmes »
  qui entre dans `W` avec un poids de 1 (FR-013) ; sans cette agrégation, chaque thème non
  prioritaire n'aurait qu'une question et serait indéfini, ce qui rendrait `W` égal à `P` en
  mode court.
- Une réponse « non répondue » représente un questionnaire interrompu ou partiellement partagé ;
  elle est traitée exactement comme « passée » dans le calcul mais reste distinguée dans l'état
  pour l'affichage et la reprise.
- La liste des versions de banque publiées (registre de la spec 002 : numéro, date, effectifs)
  est disponible dans le site ; le numéro moins un tient sur un octet, soit 256 versions au
  plus, limite reprise par la spec 002 (FR-040). Chaque publication de positions créant
  une version, le rythme de publication doit rester compatible avec cette limite (par exemple au
  plus une version par semaine jusqu'au scrutin) ; seules les données de la version courante sont
  chargées par défaut, celles des versions antérieures à la demande.
- Les positions de candidats « inconnues » incluent les positions absentes, non sourcées ou en
  statut `draft`, conformément au principe I ; cette fonctionnalité ne reçoit que des positions
  déjà filtrées par la spec 002.
- Les bits réservés de l'octet de drapeaux permettront d'ajouter des indicateurs sans changer la
  version du format de lien ; tant qu'ils ne sont pas définis, une valeur non nulle est refusée.
- Les « règles d'interprétation » des positions publiées sont celles de la spec 002 : une case
  vide signifie « inconnue », une case renseignée porte la valeur et le niveau de preuve.

## Scope Boundaries

**Dans le périmètre** : formules de score (concordance, scores de thème, `P`, `W`, couverture,
plafond, bandes, classement) ; sélection déterministe des questions (quotas, remplissage,
ordre de présentation) ; codec fragment d'URL ↔ état (format, somme de contrôle, motifs de
rejet, bijection) ; règles d'immuabilité et de rejeu des versions de banque ; exemples
chiffrés servant de référence à la page Méthodologie.

**Hors périmètre** : production, validation et publication des données, calcul de `D_q` et de
la couverture de corpus (002) ; déroulé du questionnaire, reprise de session et choix des
sujets (004) ; page de résultats, fiches candidats, affichage des motifs de rejet et bouton de
partage (005) ; rendu de la page Méthodologie (002 pour les données, 005 pour les formules).

## Dependencies

- Fonctionnalité 002 : jeu de données principal d'une version (thèmes en ordre canonique,
  questions avec thèmes et `D_q`, candidats inclus, positions connues ou inconnues avec niveau
  de preuve) et registre des versions publiées (numéros contigus à partir de 1, dates). Aucune
  version n'est publiée au 2026-11-08 ; les tests de cette fonctionnalité reposent sur des
  banques fictives.
- Fonctionnalité 001 : module de domaine existant, sa frontière de lint et son outillage de
  tests unitaires et de propriétés.

## Constitution Check

- **I. Neutralité et traçabilité** : FR-002 et FR-015 (positions inconnues exclues, niveau de
  preuve sans pondération) ; cette fonctionnalité ne reçoit que des positions déjà filtrées
  par la spec 002 et n'en produit aucune.
- **II. Vie privée** : FR-028 (état complet dans le fragment, jamais dans la query string),
  FR-035 (bijection), FR-017 et FR-027 (aucun accès réseau : tout calcul se fait sur
  l'appareil).
- **III. Cœur métier pur** : FR-017, FR-027 et FR-035 (règles pures et déterministes) ; SC-001 à
  SC-006 et SC-009 énoncent les propriétés à tester et les exemples A, B et les fragments
  d'exemple servent de fixtures ; SC-001 impose que la page Méthodologie reprenne les formules
  du code.
- **IV. Design system d'abord** : sans objet, cette fonctionnalité ne comporte aucune
  interface ; ses résultats structurés (FR-016, FR-034) sont conçus pour être rendus par les
  composants des spécifications 004 et 005.
- **V. Tests comme contrat** : les propriétés SC-002 à SC-006 sont vérifiées par des tests
  unitaires et de propriétés exécutés en intégration continue ; les parcours de bout en bout
  relèvent des spécifications 004 et 005.
- **VI. Internationalisation** : FR-034 livre des motifs de rejet typés, pas des textes ; les
  libellés (motifs, bandes, « autres thèmes », « — ») sont traduits par les fonctionnalités
  d'interface.
- **VII. Simplicité, statique et sobriété** : aucun service serveur ; les données d'une version
  antérieure ne sont chargées que lorsqu'un lien la référence (FR-040) ; un seul projet
  d'application.
