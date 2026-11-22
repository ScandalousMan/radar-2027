# Demande d’origine — 008

Texte intégral de la demande d’adrien (2026-11-22, arguments de `/speckit-specify`, session `e1330777-b2bf-40f7-a21e-ef871d18ddc9`), recopié tel quel. Les tâches du skill et du sous-agent s’y réfèrent (sections 3, 6, 15, 17 et 20).

---

```text
Mise en place d'un dispositif de recherche politique française pour la présidentielle 2027
1. Objectif
Je souhaite doter ce projet Claude Code d'une capacité durable de recherche, de vérification et d'enrichissement de citations, sources et références concernant les personnalités politiques françaises qui se présentent ou ont voulu se présenter à l'élection présidentielle de 2027.
Le dispositif doit être composé :

* d'un sous-agent spécialisé, identifiable et lançable manuellement ;
* d'un skill méthodologique spécialisé, utilisé par cet agent et également disponible pour une utilisation manuelle ;
* éventuellement de fichiers de données ou de documentation nécessaires à l'intégration dans le projet existant.

L'ensemble doit être installé au niveau du projet, sans modifier ma configuration Claude Code globale.
Le dispositif doit pouvoir être utilisé ponctuellement, à ma demande, pour effectuer des recherches approfondies et enrichir progressivement un corpus de preuves politiques.
Il ne doit nécessiter aucun abonnement supplémentaire, aucune API payante ni aucun service externe.
2. Exploration préalable obligatoire
Avant toute modification :

1. Inspecte intégralement la structure pertinente du dépôt.
2. Identifie le modèle de données existant pour les personnalités politiques, les candidats, les sources, les citations et les positions.
3. Identifie les fichiers contenant les questions du questionnaire politique, leurs thèmes, leurs polarités et les éventuelles évaluations des candidats.
4. Inspecte les instructions Claude Code déjà présentes dans le projet.
5. Repère les agents, skills, outils, scripts et conventions de documentation existants.
6. Identifie les éventuels mécanismes de traçabilité et d'historisation.

Réutilise les structures existantes dès que possible.
Ne crée pas de second référentiel de données concurrent.
Ne modifie pas les questions du questionnaire ni leurs évaluations dans le cadre de cette installation.
Avant de coder, présente brièvement l'architecture retenue et les éventuelles incompatibilités avec les structures existantes. Puis réalise l'implémentation.
3. Sous-agent spécialisé
Crée un sous-agent propre au projet dans le répertoire conventionnel des agents Claude Code du dépôt.
Nom technique :
french-political-source-researcher
Nom affiché :
French Political Source Researcher
Modèle :
opus
Description :
Agent spécialisé dans la recherche approfondie, la vérification et la documentation des citations et positions politiques de personnalités françaises liées à l'élection présidentielle de 2027. Recherche les sources primaires, vérifie les citations, distingue les positions individuelles des positions collectives et enrichit le corpus du projet. Utilise systématiquement le skill french-political-source-research. À utiliser lorsque l'utilisateur demande explicitement son intervention.
Configuration :

* Définir un frontmatter YAML Claude Code valide.
* Renseigner le nom, la description et le modèle.
* Précharger le skill french-political-source-research à l'aide du mécanisme de skills disponible dans le frontmatter des sous-agents.
* Ne pas limiter artificiellement les outils nécessaires à la recherche si ceux-ci sont disponibles dans la session principale.
* Ne pas créer d'autres agents sans justification démontrée.

Le sous-agent doit être utilisable manuellement. Une demande explicite de l'utilisateur telle que « Utilise le sous-agent french-political-source-researcher pour rechercher les positions de X sur l'immigration » doit déclencher son intervention.
Il ne doit pas se substituer à l'assistant principal pour les tâches ordinaires du projet.
4. Skill méthodologique
Crée un skill de projet nommé :
french-political-source-research
Il doit être stocké dans le répertoire conventionnel des skills Claude Code du dépôt.
Ce skill doit être suffisamment complet pour que la méthodologie de recherche ne dépende pas uniquement de la description du sous-agent.
Il doit également pouvoir être sélectionné manuellement depuis l'interface Claude Code.
Son rôle est de définir les règles de recherche, de vérification, de qualification, de classement et d'enregistrement des preuves.
5. Périmètre des personnalités
Le corpus doit inclure toutes les personnalités françaises pertinentes ayant exprimé une ambition présidentielle pour 2027, et pas uniquement les candidats officiellement déclarés.
Prendre en compte notamment :

* les candidatures officiellement déclarées ;
* les intentions publiques de candidature ;
* les personnalités qui se présentent comme candidates potentielles ;
* les candidatures soumises à une investiture ou à une procédure de sélection ;
* les candidatures tentées mais non abouties ;
* les personnalités ayant renoncé ou retiré leur candidature ;
* les candidatures rapportées par des tiers mais non confirmées par l'intéressé.

Distinguer explicitement les statuts suivants :
DECLARED
INTENTION_EXPRESSED
POTENTIAL
ATTEMPTED
WITHDRAWN
DEFEATED_IN_SELECTION_PROCESS
REPORTED_UNCONFIRMED
NOT_A_CANDIDATE
Conserver l'historique des changements de statut. Une personne ayant renoncé doit rester présente dans le corpus.
Chaque statut doit être daté et relié à une preuve.
Ne jamais transformer une rumeur ou une hypothèse journalistique en déclaration officielle.
6. Hiérarchie des sources
Privilégier systématiquement les sources primaires.
Niveau A : sources primaires

* Déclarations et discours originaux.
* Entretiens complets diffusés par leur média d'origine.
* Documents de campagne.
* Sites personnels et publications officielles.
* Communiqués et déclarations directement publiés par la personnalité.
* Questions, amendements, propositions de loi, rapports et interventions parlementaires.
* Comptes rendus des débats de l'Assemblée nationale et du Sénat.
* Documents gouvernementaux.
* Vidéos et enregistrements originaux.
* Publications publiques provenant de comptes dont l'authenticité peut être établie.

Niveau B : sources secondaires fiables

* Agences de presse reconnues.
* Médias nationaux et régionaux établis.
* Publications spécialisées en politique française.
* Entretiens et extraits correctement attribués.

Niveau C : sources de contextualisation

* Travaux universitaires.
* Publications de recherche.
* Fact-checking.
* Archives historiques.
* Bases de données spécialisées.

Les sources secondaires et de contextualisation peuvent aider à trouver une preuve, mais ne doivent pas être présentées comme des sources primaires.
Ne jamais considérer un extrait de moteur de recherche comme une preuve suffisante.
Ouvrir et examiner les documents originaux dès que possible.
Lorsqu'une source primaire est inaccessible, documenter explicitement cette limitation et qualifier la source secondaire utilisée.
7. Vérification des citations
Chaque citation doit être exacte et vérifiable.
Enregistrer autant que possible :

* le texte intégral exact de la citation utile ;
* le nom de la personne ayant effectivement prononcé ou écrit les propos ;
* la date de déclaration ;
* la date de publication, si différente ;
* le titre de la source ;
* le média ou l'institution ;
* l'URL directe ;
* le type de source ;
* le passage précis, la page ou l'horodatage ;
* le contexte nécessaire à la compréhension ;
* la date de vérification.

Ne jamais :

* reconstituer une citation à partir d'une paraphrase journalistique ;
* fusionner plusieurs déclarations ;
* retirer des réserves ou des conditions qui changent le sens ;
* corriger silencieusement les propos ;
* utiliser des guillemets pour une reformulation ;
* attribuer à une personnalité des propos qu'elle n'a pas personnellement tenus.

Pour les vidéos et enregistrements audio, fournir un horodatage précis.
Pour les documents parlementaires et administratifs, fournir la page, l'article, l'amendement ou le passage concerné.
Utiliser les statuts suivants :
VERIFIED_QUOTE
UNVERIFIED_QUOTE
PARAPHRASE
SOURCE_INACCESSIBLE
Lorsque les propos sont rapportés mais non vérifiables directement, ne pas les présenter comme une citation authentifiée.
8. Attribution : position individuelle ou collective
Il est impératif de distinguer :
PERSONAL_DIRECT : déclaration personnelle explicite.
PERSONAL_DOCUMENT : document personnellement signé ou officiellement publié par la personnalité.
PERSONAL_ACTION : action individuelle documentée, par exemple un vote, un amendement ou une question parlementaire.
PARTY_POSITION : position d'un parti politique.
PARLIAMENTARY_GROUP_POSITION : position d'un groupe parlementaire.
GOVERNMENT_POSITION : position d'un gouvernement.
COALITION_POSITION : position d'une coalition ou d'un accord collectif.
THIRD_PARTY_ATTRIBUTION : position attribuée par un tiers.
UNKNOWN_ATTRIBUTION : attribution insuffisamment établie.
Une position de parti ne constitue pas automatiquement une position personnelle de tous ses membres.
Un vote de groupe ne prouve pas automatiquement que chaque membre partage individuellement l'argumentaire associé.
Une décision gouvernementale ne démontre pas que chaque ministre a personnellement défendu cette décision.
Une signature, un vote ou un amendement peuvent constituer des preuves, mais leur signification doit être décrite précisément.
Conserver les désaccords entre une personnalité et son parti lorsqu'ils sont documentés.
9. Qualification des positions politiques
Lorsque les preuves sont rattachées aux thèmes ou aux questions du questionnaire :

* réutiliser exclusivement la taxonomie et les polarités existantes du projet ;
* ne pas inventer de nouveaux axes ;
* distinguer soutien explicite, opposition explicite, soutien conditionnel, opposition conditionnelle, ambiguïté et absence de preuve ;
* ne jamais déduire une position à partir d'une étiquette idéologique ou de l'appartenance à un parti ;
* ne jamais déduire une position uniquement d'un vote sans vérifier le texte et le contexte de la procédure ;
* conserver les positions contradictoires et leur chronologie.

Utiliser les qualifications suivantes :
EXPLICIT_SUPPORT
EXPLICIT_OPPOSITION
QUALIFIED_SUPPORT
QUALIFIED_OPPOSITION
CONDITIONAL_POSITION
AMBIGUOUS
CONTRADICTORY_EVIDENCE
NO_DIRECT_EVIDENCE
Une absence de preuve ne signifie ni neutralité ni opposition.
10. Qualité des preuves et niveau de confiance
Évaluer séparément :

* la qualité de la source ;
* l'exactitude de la citation ;
* la fiabilité de l'attribution ;
* l'interprétation politique ;
* l'actualité de la position.

Qualité de source :
A_PRIMARY_VERIFIED
B_RELIABLE_SECONDARY
C_CONTEXTUAL_ONLY
D_UNVERIFIED_OR_INACCESSIBLE
Confiance d'attribution :
HIGH
MEDIUM
LOW
UNCONFIRMED
Chaque appréciation non évidente doit être justifiée.
Une source primaire peut être ambiguë.
Une source secondaire de qualité peut confirmer qu'une déclaration a été faite, mais elle ne suffit pas nécessairement à démontrer qu'une position est toujours actuelle.
Ne pas utiliser un score unique qui masquerait ces différences.
11. Profondeur des recherches
Le sous-agent doit effectuer de véritables recherches approfondies.
Selon le sujet, explorer notamment :

* les sites personnels des personnalités ;
* les sites de campagne ;
* les sites des partis ;
* les archives parlementaires ;
* l'Assemblée nationale ;
* le Sénat ;
* les sites gouvernementaux et ministériels ;
* les discours et conférences de presse ;
* les interviews intégrales ;
* les débats télévisés ;
* les vidéos originales ;
* les publications publiques sur les réseaux sociaux ;
* les archives historiques ;
* les médias nationaux et régionaux ;
* les publications spécialisées.

Effectuer des recherches avec les noms complets, les variantes terminologiques, les expressions exactes et le contexte historique.
Ne pas s'arrêter à la première citation trouvée.
Pour chaque tâche, identifier :

* les sources consultées ;
* les catégories de sources explorées ;
* les éléments effectivement vérifiés ;
* les éléments restant à vérifier ;
* les lacunes documentaires ;
* les éventuelles contradictions.

Ne jamais prétendre avoir effectué une recherche exhaustive lorsque des catégories importantes de sources n'ont pas pu être consultées.
12. Actualité et évolution des positions
Les positions politiques peuvent évoluer.
Pour chaque déclaration, distinguer :

* la date des propos ;
* la date de publication ;
* la période à laquelle la position semble correspondre ;
* la date de dernière vérification.

Ne pas présenter une déclaration ancienne comme une position actuelle sans corroboration récente.
Lorsque deux déclarations sont contradictoires :

* conserver les deux ;
* indiquer leur chronologie ;
* rechercher une éventuelle explication ou évolution de position ;
* ne pas supprimer arbitrairement la déclaration la plus ancienne ;
* qualifier le dossier comme contradictoire si aucune explication fiable ne permet de résoudre la divergence.

13. Détection des doublons
Avant tout ajout :

* rechercher la citation dans le corpus ;
* rechercher la source ;
* rechercher les passages équivalents ;
* identifier si la nouvelle preuve est réellement nouvelle.

Une source supplémentaire peut corroborer une citation existante sans créer nécessairement une nouvelle citation.
Préserver les identifiants stables et l'historique.
Ne pas supprimer automatiquement des enregistrements qui semblent similaires.
14. Gestion des lacunes documentaires
Identifier clairement les situations suivantes :

* aucune position personnelle trouvée ;
* uniquement une position de parti trouvée ;
* uniquement une déclaration historique trouvée ;
* source primaire inaccessible ;
* citation rapportée mais non vérifiable ;
* statut de candidature incertain ;
* sources contradictoires ;
* date inconnue ;
* absence de preuve sur une position opposée.

Utiliser NOT_FOUND uniquement après une recherche significative.
Documenter les recherches effectuées et leur date.
Ne jamais remplacer NOT_FOUND par une position politique supposée.
15. Intégration dans les données existantes
Avant de choisir un format, étudier le modèle actuellement utilisé dans le projet.
Réutiliser les fichiers, identifiants et formats existants.
Si aucun modèle satisfaisant n'existe, proposer un schéma minimal et documenté avant de l'implémenter.
Chaque enregistrement doit pouvoir conserver, lorsque pertinent :

* un identifiant unique et stable ;
* l'identifiant de la personnalité ;
* son nom ;
* son statut de candidature à la date considérée ;
* la citation ou la paraphrase ;
* le type d'attribution ;
* le thème politique ;
* l'identifiant de la question associée, le cas échéant ;
* la qualification de la position ;
* la date des propos ;
* la date de publication ;
* le titre et le nom de la source ;
* l'URL directe ;
* le type de source ;
* la localisation exacte de la preuve ;
* la qualité de la source ;
* le niveau de confiance ;
* la pertinence temporelle ;
* le contexte ;
* les notes de vérification ;
* la date de recherche ;
* la date de création et de mise à jour.

Ne jamais écraser silencieusement une preuve historique.
Ne pas modifier les formulations, les thèmes, les polarités ou l'état d'activation des questions.
Ne pas recalculer automatiquement les scores de positionnement des candidats.
Lorsque de nouvelles preuves pourraient modifier une évaluation existante, produire un signalement destiné à une revue humaine.
La collecte des preuves et l'évaluation des candidats doivent rester deux opérations distinctes.
16. Modes de recherche à prendre en charge
Le sous-agent doit pouvoir être lancé explicitement pour les opérations suivantes.
Recherche sur une personnalité :
Recherche approfondie de toutes les citations et positions vérifiables d'une personnalité donnée.
Comparaison de personnalités :
Recherche parallèle sur plusieurs personnalités concernant un même sujet, selon des critères de preuve identiques.
Recherche thématique :
Enrichissement des preuves disponibles sur un thème politique, en recherchant les positions favorables et défavorables.
Enrichissement global :
Audit du corpus existant, identification des lacunes, recherches complémentaires, vérification, déduplication et mise à jour.
Audit adversarial :
Vérification indépendante des citations existantes, de leurs attributions, de leur actualité, de leur qualité et de l'interprétation politique qui leur est associée.
17. Compte rendu obligatoire
À la fin de chaque mission, produire un compte rendu synthétique et vérifiable comprenant :

1. Le périmètre de recherche.
2. Les personnalités et thèmes couverts.
3. Les sources consultées.
4. Les citations et preuves ajoutées.
5. Les sources ayant permis de corroborer des éléments existants.
6. Les corrections effectuées.
7. Les doublons évités.
8. Les éléments non vérifiés ou non résolus.
9. Les changements de statut de candidature identifiés.
10. Les contradictions et évolutions de position constatées.
11. Les lacunes documentaires restantes.
12. Les fichiers créés ou modifiés.
13. Les arbitrages nécessitant une intervention humaine.

Pour chaque constat important, fournir la citation exacte ou le passage de référence et l'URL de la source.
Séparer explicitement faits vérifiés, citations, paraphrases, interprétations et hypothèses.
18. Sécurité et périmètre technique
Travailler exclusivement dans le dépôt courant.
Ne pas modifier la configuration Claude Code globale.
Ne pas exposer de secrets, identifiants ou informations privées.
Ne pas contourner les paywalls, authentifications ou contrôles d'accès.
Ne pas introduire de service payant ou d'API supplémentaire.
Ne pas modifier du code applicatif sans nécessité liée à l'intégration du corpus.
Ne pas effectuer de commit, push ou ouverture de pull request sans demande explicite.
Ne pas supprimer les données historiques.
Ne pas activer ou désactiver automatiquement des questions.
19. Validation de l'installation
Après création du sous-agent et du skill :

1. Vérifie que le sous-agent est correctement découvert par Claude Code.
2. Vérifie que son frontmatter est valide et que le modèle demandé est bien configuré.
3. Vérifie que le skill est correctement découvert.
4. Vérifie que le skill est bien préchargé dans le contexte du sous-agent.
5. Vérifie que le sous-agent peut être lancé explicitement en le nommant dans une demande en langage naturel.
6. Vérifie que les deux composants sont bien définis au niveau du projet et non dans ma configuration utilisateur globale.
7. Effectue un test non destructif sur une personnalité et un thème.
8. Vérifie que les sources, citations, dates, attributions et statuts de vérification sont correctement conservés.

Ne lance pas un enrichissement complet du corpus pendant l'installation.
20. Livrable final
À la fin, fournis :

* l'architecture effectivement mise en place ;
* les fichiers créés et modifiés ;
* le nom, la description et le modèle du sous-agent ;
* le nom et la fonction du skill ;
* la manière de lancer manuellement le sous-agent ;
* la manière de sélectionner manuellement le skill ;
* les validations effectuées ;
* les éventuelles limitations ;
* un exemple concret de demande de recherche.

Ne déclare pas l'installation terminée tant que la découverte du sous-agent, le chargement du skill et le test non destructif n'ont pas été vérifiés.
```
