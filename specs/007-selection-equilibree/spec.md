# Feature Specification: Sélection équilibrée

**Feature Branch**: `007-selection-equilibree`

**Created**: 2026-11-21

**Status**: Draft

**Input**: User description: "007 — Sélection équilibrée : une question par sujet, tous les thèmes couverts. Retour du propriétaire après test en production (v2) : le questionnaire pose plusieurs questions sur le même sujet (uniforme à l'école, âge de la retraite, signes religieux). Le but n'est pas d'évaluer la cohérence des réponses de l'utilisateur mais de l'aider à se positionner sur la boussole politique : au plus une question par sujet dans une sélection. Par ailleurs des questions doivent être posées sur tous les thèmes, pas seulement les thèmes prioritaires. Décisions du propriétaire : champ éditorial `subject` sur chaque question (étiquetage proposé par l'agent, relu par adrien), propagé dans le jeu publié ; au plus une question par sujet (la plus discriminante) ; chaque thème reçoit au moins son plancher de questions ancrées sur lui ; le reliquat est réparti entre les thèmes. Les règles actuelles restent figées pour les versions 1 et 2 ; les nouvelles s'appliquent à partir de la version 3."

## Vocabulaire

Dans l'interface et les specs précédentes, « sujets prioritaires » désigne les **thèmes** que le répondant choisit (003 FR-018). Pour éviter toute confusion, cette spec appelle **enjeu** ce que le propriétaire a nommé « sujet » : la décision publique précise sur laquelle porte une question (l'âge légal de départ à la retraite, l'uniforme à l'école, le port de signes religieux). Dans les données, l'enjeu est porté par le champ `subject`.

## Contexte

Constat du propriétaire sur la version 2 en production (2026-11-21), reproduit sur le jeu publié :

- **Doublons d'enjeu.** La banque contient des questions distinctes sur le même enjeu, que la sélection peut retenir ensemble : `societe-uniforme-ecole-publique` et `education-uniforme-obligatoire` ; `travail-retraite-62-ans` et `travail-retraite-au-dela-64-ans` ; `societe-signes-religieux-universite` et `societe-signes-religieux-sorties-scolaires`. Avec Société, Travail et Éducation en mode court, les trois paires apparaissent dans les 25 questions. La sélection de 003 ne connaît que les thèmes : rien ne l'en empêche.
- **Thèmes sans question.** Une question à deux thèmes crédite le quota de ses deux thèmes (003 FR-022). En mode court (plancher de 1), des thèmes comme Économie, Santé, Travail, Défense ou Énergie voient leur quota « rempli » par une question ancrée ailleurs et n'ont aucune question qui leur soit propre. Les places ainsi libérées vont au second passage (003 FR-023), qui les donne toutes au premier thème prioritaire : avec Éducation, Fiscalité et Immigration, Fiscalité reçoit 9 questions sur 25 pour un quota de 4. En mode complet, Fiscalité reçoit 27 questions pour un quota de 13.

Le questionnaire sert à situer le répondant, pas à tester la cohérence de ses réponses : deux questions sur le même enjeu coûtent du temps sans rien apprendre de plus, et un thème sans question ne pèse pas dans son positionnement.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Une seule question par enjeu (Priority: P1)

En tant que répondant, je ne reçois jamais deux questions qui portent sur le même enjeu dans un même questionnaire, quel que soit le mode et quels que soient mes thèmes prioritaires.

**Why this priority**: c'est le défaut le plus visible du test en production ; il fait douter du sérieux de l'outil et allonge le questionnaire sans bénéfice.

**Independent Test**: sur la version 3, calculer la sélection pour toutes les combinaisons de 3 à 5 thèmes prioritaires dans les deux modes et vérifier qu'aucune liste ne contient deux questions de même enjeu.

**Acceptance Scenarios**:

1. **Given** la version 3, le mode court et les thèmes prioritaires Société, Travail et Éducation, **When** la liste est calculée, **Then** elle contient au plus une des deux questions sur l'uniforme, au plus une sur l'âge légal de la retraite et au plus une sur les signes religieux.
2. **Given** deux questions de même enjeu éligibles pour un thème, **When** la sélection choisit, **Then** elle retient celle au plus grand pouvoir discriminant (puis au plus petit identifiant), et l'autre n'est plus éligible pour aucun thème.
3. **Given** un enjeu porté par des questions de deux thèmes différents (l'uniforme en Société et en Éducation), **When** l'un des deux thèmes a déjà retenu une question de cet enjeu, **Then** l'autre thème retient une question d'un autre enjeu.

---

### User Story 2 - Des questions sur tous les thèmes (Priority: P1)

En tant que répondant, je reçois au moins une question propre à chaque thème en mode court, et au moins trois en mode complet, y compris sur les thèmes que je n'ai pas choisis ; mes thèmes prioritaires sont approfondis sans écraser les autres.

**Why this priority**: un thème sans question ne compte pas dans le positionnement du répondant ; c'est le second défaut signalé.

**Independent Test**: sur la version 3, pour toutes les combinaisons de 3 à 5 thèmes prioritaires dans les deux modes, compter les questions ancrées sur chaque thème et les comparer aux quotas de 003 FR-021.

**Acceptance Scenarios**:

1. **Given** la version 3, le mode court et les thèmes prioritaires Éducation, Fiscalité et Immigration, **When** la liste est calculée, **Then** chacun des 18 thèmes a au moins une question ancrée sur lui et Fiscalité en a exactement son quota (4).
2. **Given** le mode complet et n'importe quelle combinaison de 3 à 5 thèmes prioritaires, **When** la liste est calculée, **Then** chaque thème a exactement son quota de questions ancrées sur lui, dès lors que la banque le permet.
3. **Given** un thème dont les questions éligibles sont épuisées avant son quota (enjeux déjà pris par d'autres thèmes, banque trop petite), **When** le reliquat est attribué, **Then** il est réparti une question à la fois entre les thèmes qui ont encore des questions éligibles, thèmes prioritaires d'abord, et non versé en bloc au premier thème prioritaire.
4. **Given** une question à deux thèmes retenue au titre de l'un d'eux, **When** les quotas sont comptés, **Then** elle ne compte que pour son thème d'ancrage.

---

### User Story 3 - Des enjeux étiquetés et relus (Priority: P1)

En tant que propriétaire du projet, chaque question active du corpus porte un enjeu ; l'étiquetage est proposé par l'agent, relu et validé par adrien, et la validation du corpus refuse une question active sans enjeu.

**Why this priority**: la règle « une question par enjeu » ne vaut que ce que vaut l'étiquetage ; sans lui, la User Story 1 est impossible.

**Independent Test**: lancer la validation du corpus : 100 % des questions actives portent un enjeu ; le rapport liste les enjeux partagés par plusieurs questions, que le relecteur a validés.

**Acceptance Scenarios**:

1. **Given** les questions actives de la version 2, **When** l'agent propose l'étiquetage, **Then** chaque question reçoit un enjeu, et un dossier de relecture liste chaque enjeu partagé par au moins deux questions avec leurs énoncés côte à côte.
2. **Given** le dossier de relecture, **When** adrien le relit, **Then** il peut regrouper ou séparer des questions, et seul l'étiquetage validé est publié.
3. **Given** une question active sans enjeu, ou un enjeu mal formé, **When** la validation du corpus s'exécute, **Then** elle échoue en nommant la question.
4. **Given** un thème dont le nombre d'enjeux distincts est inférieur au quota maximal d'un thème prioritaire en mode complet, **When** la validation s'exécute, **Then** elle signale le thème (avertissement), car son quota ne pourra pas être rempli de questions propres.

---

### User Story 4 - Les liens existants restent identiques (Priority: P2)

En tant que visiteur qui a partagé un lien de résultats sur la version 1 ou 2, je retrouve exactement la même liste de questions et les mêmes résultats après la publication de la version 3.

**Why this priority**: la stabilité des liens est une promesse publique du projet ; la règle est déjà appliquée à chaque publication (006 FR-013).

**Independent Test**: rejouer un échantillon figé de liens des versions 1 et 2 avant et après la mise en production et comparer les résultats.

**Acceptance Scenarios**:

1. **Given** un lien de la version 1 ou 2, **When** il est ouvert après la mise en production, **Then** la sélection est recalculée avec les règles de 003, sans enjeu, et le résultat est identique à celui d'avant.
2. **Given** la version 3, **When** un répondant commence un questionnaire, **Then** la sélection suit les règles de cette spec.
3. **Given** un questionnaire en cours sur la version 2 repris après la publication de la version 3, **When** il est transposé sur la version 3 (004), **Then** les réponses déjà données aux questions toujours présentes sont conservées et les nouvelles questions apparaissent non répondues, comme lors des publications précédentes.

---

### Edge Cases

- Deux questions de même enjeu prennent des positions opposées (« ramener à 62 ans » / « porter au-delà de 64 ans ») : elles restent un seul enjeu ; une seule est posée.
- Deux questions portent sur le même domaine mais sur des leviers différents (âge légal de la retraite et financement par capitalisation ; critères de pénibilité) : ce sont des enjeux distincts, posables ensemble.
- Un enjeu regroupe plus de deux questions : la règle reste « au plus une » ; la plus discriminante disponible est retenue.
- L'enjeu d'une question à deux thèmes est unique ; il ne dépend pas du thème au titre duquel elle est retenue.
- Un thème prioritaire n'a pas assez d'enjeux distincts pour son quota : il reçoit ce qu'il peut ; le manque est redistribué selon le scénario 3 de la User Story 2 ; la liste totale garde `N` questions si la banque compte au moins `N` enjeux distincts.
- La banque compte moins de `N` enjeux distincts : la liste contient une question par enjeu, donc moins de `N` questions ; la longueur de la charge du lien suit la taille réelle (003 FR-019, FR-032).
- Une question est retirée dans une version ultérieure : son enjeu peut rester porté par d'autres questions ; un enjeu sans question active disparaît de lui-même.
- Le pouvoir discriminant de deux questions de même enjeu est égal : l'identifiant le plus petit l'emporte, comme partout dans la sélection.

## Requirements *(mandatory)*

### Functional Requirements

**Enjeux dans le corpus**

- **FR-001**: Chaque question active du corpus DOIT porter exactement un enjeu : un identifiant stable en minuscules, chiffres et tirets (par exemple `retraite-age-legal`), commun à toutes les questions qui portent sur le même enjeu, quels que soient leurs thèmes.
- **FR-002**: Deux questions DOIVENT partager un enjeu lorsqu'elles portent sur le même dispositif, la même règle ou le même paramètre de politique publique, même si elles en proposent des modalités, des publics ou des sens différents (âge légal à 62 ans ou au-delà de 64 ans ; signes religieux à l'université ou en sortie scolaire ; uniforme à l'école publique ou au primaire et au collège). Elles NE DOIVENT PAS le partager si elles portent sur des leviers distincts d'un même domaine (âge légal et capitalisation).
- **FR-003**: L'étiquetage initial DOIT être proposé par l'agent pour toutes les questions actives de la version 2, accompagné d'un dossier de relecture qui liste chaque enjeu partagé par au moins deux questions avec leurs énoncés, et les cas limites écartés ; il DOIT être validé par adrien avant publication. Une question créée après cette fonctionnalité reçoit son enjeu à la rédaction et le relecteur le valide avec l'énoncé (002 FR-010).
- **FR-004**: L'enjeu d'une question NE DOIT PAS modifier son énoncé, ses thèmes, sa polarité ni les positions des candidats ; ajouter ou corriger un enjeu n'est pas une modification de l'énoncé au sens de 002 FR-011. Un enjeu peut changer d'une version à l'autre ; chaque version publiée fige les siens.
- **FR-005**: La validation du corpus DOIT échouer pour une question active sans enjeu ou dont l'enjeu est mal formé, et DOIT signaler en avertissement tout thème dont le nombre d'enjeux distincts (parmi ses questions actives, principales ou secondaires) est inférieur au quota maximal d'un thème prioritaire en mode complet.
- **FR-006**: Le jeu de données publié DOIT porter l'enjeu de chaque question à partir de la version 3, ainsi que l'indication des règles de sélection qui s'appliquent à la version. Les versions 1 et 2 publiées NE DOIVENT PAS être modifiées.

**Règles de sélection à partir de la version 3**

Les règles de 003 FR-018 à FR-027 s'appliquent, sauf FR-022, FR-023 et FR-024, que les exigences suivantes remplacent pour les versions qui déclarent ces règles.

- **FR-007**: Les quotas par thème DOIVENT être calculés comme en 003 FR-021, sans changement.
- **FR-008**: Une question est **éligible** pour un thème si ce thème est l'un de ses thèmes, si elle n'est pas déjà retenue et si aucune question retenue ne porte le même enjeu. Retenir une question rend inéligibles toutes les questions de même enjeu.
- **FR-009**: Une question retenue DOIT avoir pour thème d'ancrage le thème au titre duquel elle a été retenue, et NE DOIT compter que pour le quota de ce thème.
- **FR-010**: Premier passage : pour chaque thème dans l'ordre de rotation (thèmes prioritaires dans l'ordre canonique, puis autres thèmes dans l'ordre canonique, 003 FR-025), tant que le nombre de questions ancrées sur ce thème est inférieur à son quota et qu'il reste une question éligible pour lui, le système DOIT retenir la question éligible de ce thème au plus grand `D_q`, puis au plus petit identifiant.
- **FR-011**: Second passage : si la liste compte moins de `N` questions, le système DOIT parcourir les thèmes par tours successifs dans l'ordre de rotation ; à chaque tour, chaque thème qui a encore une question éligible en retient une (même règle de préférence que FR-010), ancrée sur lui ; les tours se succèdent jusqu'à `N` questions ou jusqu'à ce qu'aucun thème n'ait de question éligible.
- **FR-012**: La liste NE DOIT jamais contenir deux questions de même enjeu. Elle DOIT contenir exactement `N` questions dès que la banque compte au moins `N` enjeux distincts, et une question par enjeu sinon.
- **FR-013**: L'ordre de présentation (tourniquet de 003 FR-025), l'index de réponse (003 FR-026), le déterminisme (003 FR-027) et le format du lien de partage (003 FR-028 et suivants) NE DOIVENT PAS changer.

**Versions et liens**

- **FR-014**: Le système DOIT appliquer à chaque version de banque les règles de sélection qu'elle déclare : les versions 1 et 2, qui n'en déclarent pas, suivent les règles de 003 ; la version 3 suit celles de cette spec. Une version qui déclare des règles inconnues DOIT être refusée avec une erreur explicite, jamais traitée avec d'autres règles.
- **FR-015**: Un lien de résultats d'une version antérieure DOIT être rejoué sur sa version avec les règles de cette version, et donner un résultat identique à celui d'avant la mise en production.
- **FR-016**: La version 3 DOIT être publiée par la procédure de publication de 002 ; elle reprend les questions, positions et candidats de la version 2 et y ajoute les enjeux.

**Score et affichage**

- **FR-017**: Le calcul du score (003 FR-001 à FR-017) et les écrans de résultats (005) NE DOIVENT PAS changer ; ils opèrent sur la liste produite.
- **FR-018**: La page Méthodologie DOIT décrire, pour la version affichée, la règle « une question par enjeu » et la garantie d'au moins une question par thème en mode court (trois en mode complet), si elle décrit la sélection des questions ; sinon, elle DOIT ajouter un court paragraphe qui l'énonce.
- **FR-019**: La spec 003 DOIT être amendée par une note datée qui renvoie à cette spec pour les versions qui déclarent les nouvelles règles, sans modifier le texte de FR-022 à FR-024, qui reste la référence des versions 1 et 2.

### Key Entities *(include if feature involves data)*

- **Enjeu** : identifiant stable d'une décision publique précise ; porté par une ou plusieurs questions, de un ou plusieurs thèmes. Il n'a ni libellé public ni position propre ; il sert uniquement à la sélection.
- **Question** : gagne un enjeu (exactement un pour une question active) ; le reste de sa définition (002 FR-008) est inchangé.
- **Version de banque** : déclare ses règles de sélection et fige les enjeux de ses questions ; les versions 1 et 2 restent sur les règles de 003.
- **Thème d'ancrage** : thème au titre duquel une question est retenue ; seul thème dont le quota la compte à partir de la version 3.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Sur la version 3, pour 100 % des combinaisons de 3 à 5 thèmes prioritaires parmi 18 et pour les deux modes, aucune liste ne contient deux questions de même enjeu.
- **SC-002**: Sur la version 3, pour 100 % de ces combinaisons, chaque thème a au moins 1 question ancrée sur lui en mode court et au moins 3 en mode complet.
- **SC-003**: Sur la version 3, pour 100 % de ces combinaisons, aucun thème ne dépasse son quota de plus d'une question, sauf si un autre thème n'a pas pu atteindre le sien faute de question éligible ; avec Éducation, Fiscalité et Immigration en mode court, Fiscalité a 4 questions au lieu de 9.
- **SC-004**: Sur la version 3, pour 100 % de ces combinaisons, la liste compte exactement 100 questions en mode complet et 25 en mode court.
- **SC-005**: 100 % des questions actives de la version 3 portent un enjeu validé par adrien ; le dossier de relecture couvre 100 % des enjeux partagés.
- **SC-006**: 100 % d'un échantillon figé d'au moins 20 liens de la version 1 et 20 liens de la version 2 (deux modes, combinaisons variées) donnent un résultat identique avant et après la mise en production.

## Assumptions

- Le terme « sujet » employé par le propriétaire est rendu par « enjeu » dans les textes, pour ne pas le confondre avec les « sujets prioritaires » (thèmes) de l'interface ; le champ de données garde le nom `subject` décidé par le propriétaire.
- La granularité d'un enjeu suit FR-002 ; les cas litigieux sont tranchés par adrien à la relecture du dossier, sans nouvelle clarification de la spec.
- Le pouvoir discriminant `D_q` de la version 2 est repris tel quel en version 3 ; aucune position n'est modifiée par cette fonctionnalité.
- Les quotas de 003 FR-021 restent inchangés ; seul leur mode de remplissage change. Avec 18 thèmes et 310 questions, la banque compte assez d'enjeux distincts pour atteindre `N` dans les deux modes ; l'étiquetage le confirmera (FR-005).
- La reprise d'un questionnaire en cours lors d'un changement de version (004) fonctionne déjà par identifiant de question et n'a pas à changer.
- L'enjeu n'est pas affiché au répondant.

### Dependencies

- 002 : schéma du corpus, validation, publication (ajout du champ `subject`).
- 003 : sélection (FR-022 à FR-024 remplacés à partir de la version 3), codec inchangé.
- 004 et 005 : aucun changement attendu hors la page Méthodologie.

### Out of Scope

- Tout changement des quotas, du nombre de questions par mode, de l'ordre de présentation, du score ou du format du lien.
- La réécriture, la fusion ou le retrait de questions de la banque : les questions de même enjeu restent toutes dans la banque.
- L'affichage de l'enjeu au répondant.
- La sélection adaptative aux réponses.
