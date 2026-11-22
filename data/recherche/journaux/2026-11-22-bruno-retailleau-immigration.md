# Compte rendu — 2026-11-22-bruno-retailleau-immigration

Mode : PERSONALITY · Auteur : claude (modèle opus) · Dates : 2026-11-22 → 2026-11-22 · État : completed

## 1. Périmètre de recherche

Test d'installation du sous-agent de recherche, volontairement borné : **une** personnalité
(`bruno-retailleau`) et **un** thème (`immigration`). Aucun autre thème, aucune autre personnalité,
aucun enrichissement global, aucun commit git.

Deux objets : (a) créer l'entrée du registre des personnalités avec le statut `DECLARED` à la date
`statusChangedAt` de `data/corpus/candidates.yaml`, appuyée sur une preuve `CANDIDACY` d'attribution
personnelle ; (b) recueillir de l'ordre de quatre à huit preuves solides sur l'immigration,
rattachées aux questions du thème lorsque c'est justifié, les questions non couvertes allant en
lacunes.

Les douze questions actives du thème non encore documentées par une position publiée de ce candidat,
ainsi que les trois questions pour lesquelles une preuve a été rattachée, figurent dans le `scope`
du journal. **[Fait vérifié]** La banque `immigration` compte 17 questions actives ; `positions/bruno-retailleau.yaml`
en documente 9 ; 8 n'ont aucune entrée de position pour lui.

Écriture limitée à `data/recherche/**` plus, via `pnpm data:source fetch` uniquement,
`data/corpus/sources/bruno-retailleau.yaml`. Les fichiers temporaires sont restés hors du dépôt.

## 2. Personnalités et thèmes couverts

**[Fait vérifié]** `bruno-retailleau` — Les Républicains — thème `immigration`.

Statut de candidature enregistré : `DECLARED`, `at: 2026-02-12` (reprise de `statusChangedAt` de
`candidates.yaml`), `observedAt: 2026-11-22`, appuyé sur `bruno-retailleau-candidature-001`.
**[Fait vérifié]** Le statut courant du registre (`DECLARED`) correspond au statut publié
(`declared`) : aucun écart, donc aucun signalement `CANDIDATE_STATUS`.

Questions du thème auxquelles une preuve a été rattachée : `immigration-prestations-duree-residence`,
`immigration-frais-etudiants-etrangers`, `immigration-regroupement-familial-ressources` (deux
preuves, dont une sans lien direct), `immigration-regularisation-cinq-ans`,
`immigration-ame-soins-urgents`. Deux preuves sont rattachées au thème sans question.

## 3. Sources consultées

Onze adresses ouvertes ; cinq retenues comme sources de preuve.

| Source | Issue |
|---|---|
| [Public Sénat, 12/02/2026](https://www.publicsenat.fr/actualites/politique/je-suis-pret-bruno-retailleau-se-declare-candidat-a-lelection-presidentielle-2027) (`bruno-retailleau-declaration-candidature`) | retenue |
| [republicains.fr, 31/05/2026, entretien au JDD](https://republicains.fr/actualites/2026/05/31/ma-candidature-ira-jusquau-bout/) | retenue |
| [republicains.fr, 02/08/2026, entretien au JDD](https://republicains.fr/actualites/2026/08/02/lespace-schengen-doit-etre-reserve-aux-europeens/) | retenue |
| [Sénat, PPL n° 677 du 01/06/2023](https://www.senat.fr/leg/ppl22-677.html) | retenue |
| [franceinfo, 24/09/2024, AME](https://www.franceinfo.fr/sante/suppression-de-l-aide-medicale-d-etat-la-proposition-de-bruno-retailleau-divise-jusqu-au-sein-de-la-majorite-gouvernementale_6799522.html) | **nouvelle source** enregistrée par `pnpm data:source fetch` |
| [Sénat, PPL constitutionnelle n° 646](https://www.senat.fr/leg/ppl22-646.html) | écartée : ses articles 6, 7 et 8 étayent déjà des positions publiées |
| [republicains.fr/nos-idees](https://republicains.fr/nos-idees/) | écartée : aucun livret « immigration » |
| [Archives « Immigration » de republicains.fr](https://republicains.fr/categories/actualites/immigration/) | écartée : index, aucun propos citable |
| [republicains.fr, 16/06/2026](https://republicains.fr/actualites/2026/06/16/discussion-sans-filtre-avec-francois-lenglet/) | écartée : **[Fait vérifié]** propos de François-Xavier Bellamy, pas de Bruno Retailleau |
| [republicains.fr, 31/07/2026](https://republicains.fr/actualites/2026/07/31/la-libre-circulation-des-personnes-en-europe-doit-etre-suspendue-pour-lespagne/) | inaccessible : texte dans un PDF joint non localisé (404 sur l'adresse présumée) |
| [republicains.fr, 08/06/2026](https://republicains.fr/actualites/2026/06/08/reglement-retour-proteger-les-francais/) | écartée : aucun propos attribuable mot pour mot |

**[Fait vérifié]** Dix-sept requêtes sont journalisées (recherches web, ouvertures de page, lectures
du corpus et du cache), sur cinq catégories explorées : `EXISTING_CORPUS`, `NATIONAL_MEDIA`,
`PARTY_SITE`, `FULL_INTERVIEWS`, `SENAT`. Seize catégories ne l'ont pas été, avec leur raison dans
le journal : la recherche n'est **pas** déclarée exhaustive (`exhaustive: false`).

**[Interprétation]** Aucun extrait de moteur de recherche n'a été tenu pour une preuve. Les
synthèses automatiques renvoyées par les moteurs ont servi uniquement de pistes ; l'une d'elles
affirmait une position de l'intéressé en faveur du droit de vote local des étrangers tout en se
contredisant dans la phrase suivante : elle n'a donc rien étayé.

## 4. Citations et preuves ajoutées

Neuf preuves (une de candidature, huit sur le thème). **[Fait vérifié]** Les huit citations
`VERIFIED_QUOTE` ont été retrouvées mot pour mot, une occurrence chacune, dans le texte en cache de
leur source.

1. `bruno-retailleau-candidature-001` — `CANDIDACY`, `PERSONAL_DIRECT`, `B_RELIABLE_SECONDARY`,
   `CURRENT`. **[Citation]** « J'ai pris la décision d'être candidat à l'élection présidentielle »
   (allocution du 12/02/2026, reproduite par Public Sénat).
2. `bruno-retailleau-immigration-001` — thème sans question, `PERSONAL_DIRECT`, `CURRENT`.
   **[Citation]** « Dire la vérité, c'est dire que l'immigration n'est pas une chance. » (même
   allocution). **[Interprétation]** Aucun énoncé de la banque ne porte sur l'appréciation générale
   du phénomène migratoire : cette preuve ne répond donc à aucune question.
3. `bruno-retailleau-immigration-002` — `immigration-prestations-duree-residence`,
   `QUALIFIED_SUPPORT`, `CURRENT`. **[Citation]** « Je veux conditionner l'accès aux aides sociales,
   pour les étrangers, à cinq ans de résidence légale et de travail. »
   ([31/05/2026](https://republicains.fr/actualites/2026/05/31/ma-candidature-ira-jusquau-bout/)).
   **[Interprétation]** L'énoncé parle de « prestations sociales non contributives » et de « cinq ans
   de résidence » ; le propos reprend le seuil mais vise les « aides sociales » en général et ajoute
   une condition de travail : soutien plus large et plus exigeant que l'énoncé, donc qualifié.
4. `bruno-retailleau-immigration-003` — `immigration-frais-etudiants-etrangers`,
   `QUALIFIED_OPPOSITION`, `CURRENT`. **[Citation]** « il n'y aura plus de passe-droit : plus
   d'exonération automatique des frais d'inscription pour les étudiants extra-européens » (même
   entretien). **[Interprétation]** Supprimer l'exonération de la majoration applicable aux
   extra-européens revient à des frais supérieurs à ceux des étudiants français, soit une opposition
   à l'énoncé ; qualifiée, car le propos porte sur le mécanisme d'exonération et non sur le niveau
   comparé des frais.
5. `bruno-retailleau-immigration-004` — `immigration-regroupement-familial-ressources`,
   `NO_DIRECT_EVIDENCE`, `CURRENT`. **[Citation]** « Sur le regroupement familial, il faudra changer
   le droit européen, et donc revoir la directive européenne. » (même entretien).
   **[Fait vérifié]** Aucune mention de ressources, de seuil ni de montant dans cette réponse.
   Preuve enregistrée précisément pour documenter ce qu'elle **ne** démontre **pas**.
6. `bruno-retailleau-immigration-005` — `immigration-regroupement-familial-ressources`,
   `QUALIFIED_SUPPORT`, `PERSONAL_ACTION`, `A_PRIMARY_VERIFIED`, `DATED`. **[Citation]** « L'étranger
   justifie de ressources stables, régulières et suffisantes » (PPL n° 677, article 4, nouvel art.
   L. 423-1 du CESEDA). **[Fait vérifié]** Le texte est présenté « Par MM. François-Noël BUFFET,
   Bruno RETAILLEAU, … » : il en est le **deuxième** signataire, pas l'auteur unique ; `actionScope`
   le dit, ainsi que le fait qu'il s'agit d'un dépôt, antérieur à toute discussion en séance.
   **[Interprétation]** Le dispositif durcit le contrôle des ressources (art. 3 : vérification par
   le maire pour le regroupement familial ; art. 4 : condition de ressources pour le conjoint de
   Français), mais ne relève aucun seuil et ne porte pas exactement sur la procédure de regroupement
   familial : soutien qualifié.
7. `bruno-retailleau-immigration-006` — `immigration-regularisation-cinq-ans`,
   `QUALIFIED_OPPOSITION`, `CURRENT`. **[Citation]** « Les régularisations massives sont une fausse
   générosité et un vrai appel d'air. »
   ([02/08/2026](https://republicains.fr/actualites/2026/08/02/lespace-schengen-doit-etre-reserve-aux-europeens/)).
   **[Interprétation]** Rejet de principe des régularisations massives, mais le propos vise
   l'Espagne et ne discute pas le critère d'ancienneté de cinq ans : opposition qualifiée.
8. `bruno-retailleau-immigration-007` — thème sans question, `CURRENT`. **[Citation]** « Je propose
   de revenir à l'inspiration première du système Schengen, avec une libre circulation pour les
   Européens, mais pas pour les extra-Européens. » (même entretien). **[Interprétation]** Aucun
   énoncé de la banque ne porte sur la libre circulation ni sur la territorialisation des visas ; en
   particulier, ce propos ne répond pas à l'énoncé sur les visas des professions qualifiées.
9. `bruno-retailleau-immigration-008` — `immigration-ame-soins-urgents`, `QUALIFIED_SUPPORT`,
   `PARAPHRASE`, `HISTORICAL`, `attributionConfidence: MEDIUM`. **[Paraphrase]** Selon franceinfo,
   qui rapporte sans le citer un propos tenu sur TF1 le 23/09/2024, il voulait alors, comme ministre
   de l'Intérieur, supprimer l'aide médicale d'État et la remplacer par une aide d'urgence, en usant
   de son pouvoir réglementaire. **[Fait vérifié]** L'article ne contient **aucune** phrase de lui
   entre guillemets ; rien n'a donc été mis entre guillemets ici. **[Interprétation]** L'objectif
   rejoint l'énoncé, l'instrument diffère (suppression et remplacement, par voie réglementaire) :
   soutien qualifié.

## 5. Sources ayant corroboré des éléments existants

Aucun. Aucune corroboration n'a été ajoutée à une preuve existante : le corpus de preuves était vide
au début de la mission et aucune seconde source ne reprenait mot pour mot l'une des citations
retenues. **[Interprétation]** Les deux entretiens au JDD reproduits par le site du parti ne sont
pas des sources indépendantes de leur média d'origine ; aucun n'a été compté deux fois.

## 6. Corrections effectuées

Aucune. Aucune preuve, aucun statut, aucune position n'existait à corriger ; aucune entrée
d'historique n'a donc été créée.

## 7. Doublons évités

**[Fait vérifié]** L'entretien du 31/05/2026 contient deux passages qui sont déjà, mot pour mot, les
citations de positions publiées de ce candidat : « l'idée de régulariser des clandestins qui ont
fraudé nos lois est une capitulation. » (`immigration-regularisation-cinq-ans`, valeur −1) et « On
nous explique qu'il faudrait régulariser parce que certains secteurs manquent de main-d'œuvre. Mais
on peut former des Français, comme on peut former des étrangers déjà présents légalement sur notre
territoire. » (`immigration-regularisation-metiers-tension`, valeur −2). Aucune preuve n'a été créée
sur ces deux passages ; la preuve rattachée à la régularisation s'appuie sur une autre source et une
autre formulation.

**[Fait vérifié]** La PPL constitutionnelle n° 646 a été relue intégralement : ses articles 6, 7 et 8
sont déjà les citations des positions publiées `immigration-plafond-annuel-admissions`,
`immigration-condamnes-perte-titre-sejour` et `immigration-asile-examen-hors-europe-v2`. Rien n'en a
été réenregistré.

Le champ `duplicatesAvoided` du journal est vide : il ne peut viser que des preuves du corpus de
recherche, et les doublons évités ici le sont par rapport au corpus **publié**.

## 8. Éléments non vérifiés ou non résolus

- **[Hypothèse]** La position **actuelle** sur l'aide médicale d'État. Un entretien franceinfo du
  12/11/2026 est signalé par les moteurs comme abordant l'AME, le regroupement familial et l'asile ;
  faute de transcription du segment immigration, rien n'en a été retenu. L'agent n'écoute pas l'audio
  et ne transcrit rien lui-même.
- **[Fait vérifié]** `immigration-008` repose sur une paraphrase de presse ; l'émission TF1 du
  23/09/2024 n'a pas été consultée.
- **[Fait vérifié]** Le communiqué du 31/07/2026 (« La libre-circulation des personnes en Europe doit
  être suspendue pour l'Espagne ») n'a pas pu être lu : son texte est dans un PDF dont l'adresse
  n'a pas été établie. Rien n'en a été cité.
- **[Hypothèse]** La PPL n° 677 modifierait les conditions de délivrance de la carte de résident
  (durée de résidence exigée) ; cette piste, venue d'une synthèse de moteur de recherche, n'a **pas**
  été contrôlée dans le texte en cache et n'a donc donné lieu à aucune preuve.

## 9. Changements de statut de candidature identifiés

**[Fait vérifié]** Aucun changement : première entrée au registre, statut `DECLARED` au 2026-02-12,
identique au statut publié (`declared`, même date). La preuve de candidature est d'attribution
`PERSONAL_DIRECT` (propos de l'intéressé dans sa propre allocution, sans condition), ce qu'exige
`DECLARED`. Aucun signalement `CANDIDATE_STATUS` n'était justifié.

## 10. Contradictions et évolutions de position

Aucune contradiction constatée. **[Interprétation]** Deux éléments de chronologie, cohérents et non
contradictoires :

- la condition de **cinq ans de résidence** pour l'accès des étrangers non ressortissants de l'Union
  aux prestations figure déjà dans la PPL n° 677 de 2023 (**[Citation]** « l'étranger non
  ressortissant de l'Union européenne doit résider en France depuis au moins cinq ans ») et se
  retrouve dans l'entretien du 31/05/2026 : position constante plutôt que propos isolé ;
- sur l'**AME**, le seul élément trouvé date de septembre 2024 et de sa fonction ministérielle ; il
  est enregistré `HISTORICAL` et n'est pas présenté comme sa position de candidat, faute de
  corroboration récente (FR-032).

## 11. Lacunes documentaires restantes

**[Fait vérifié]** Huit questions actives du thème `immigration` n'ont, pour ce candidat, ni position
publiée ni preuve exploitable. Elles sont inscrites en lacunes `NO_PERSONAL_POSITION` dans le
journal : `immigration-asile-droit-travail`, `immigration-vote-local-etrangers-v2`,
`immigration-titre-sejour-longue-duree`, `immigration-reduire-duree-naturalisation`,
`immigration-voies-legales-travail-ue`, `immigration-visas-professions-qualifiees-v2`,
`immigration-asile-examen-sans-transfert` — et `immigration-regroupement-familial-ressources`, qui
n'a pas de position publiée mais deux preuves désormais.

Aucune lacune `NOT_FOUND` n'a été déclarée : les recherches menées sur ces questions, bien que
réelles, n'ont pas couvert assez de catégories pour affirmer qu'il n'existe rien.
**[Interprétation]** Une absence de preuve ne vaut ni neutralité ni opposition.

Autres lacunes journalisées : `NO_OPPOSING_EVIDENCE` (aucun propos trouvé dans le sens d'un
assouplissement, mais archives antérieures à 2023 et fact-checking non explorés),
`PRIMARY_INACCESSIBLE` (allocution d'origine sur les réseaux sociaux, émission TF1),
`REPORTED_UNVERIFIABLE` et `HISTORICAL_ONLY` (AME).

Catégories de sources non explorées, à traiter dans une passe ultérieure : activité au ministère de
l'Intérieur (`GOVERNMENT`), comptes rendus et scrutins du Sénat (`PARLIAMENTARY_ARCHIVES`),
audiovisuel intégral (`ORIGINAL_VIDEOS`, `TV_RADIO_DEBATES`), `FACT_CHECKING`,
`HISTORICAL_ARCHIVES`, `REGIONAL_MEDIA`, `PRESS_AGENCIES`, `SPECIALIZED_PUBLICATIONS`, `ACADEMIC`,
`SOCIAL_MEDIA`.

## 12. Fichiers créés ou modifiés

- `data/recherche/personnalites.yaml` — entrée `bruno-retailleau` créée (statut `DECLARED`).
- `data/recherche/preuves/bruno-retailleau.yaml` — créé, 9 preuves.
- `data/recherche/journaux/2026-11-22-bruno-retailleau-immigration.yaml` — créé.
- `data/recherche/journaux/2026-11-22-bruno-retailleau-immigration.md` — ce compte rendu.
- `data/corpus/sources/bruno-retailleau.yaml` — une source ajoutée par `pnpm data:source fetch`
  (`bruno-retailleau-suppression-de-l-aide-medicale-d-etat-la-proposition-de-brun`) ; fichier jamais
  édité à la main.
- `data/reports/validation.md` — réécrit par `pnpm data:validate` (sortie de l'outil, pas une
  donnée de recherche).

**[Fait vérifié]** `pnpm data:validate` : « Corpus conforme : 0 violation », 41 avertissements
(24 `SUBJECT`, 17 `RECH-STATUS` n° 6), tous attendus. `git status --short` ne fait apparaître, par
rapport à l'état initial de la branche, que `data/corpus/sources/bruno-retailleau.yaml` (modifié) et
`data/recherche/` (nouveau) ; `data/reports/validation.md` n'est pas suivi par git.

`data/recherche/signalements.yaml` est inchangé (aucun signalement). Aucun fichier de
`data/corpus/candidates.yaml`, `themes.yaml`, `questions/`, `positions/`, `governance.yaml`,
`public/data/`, `src/`, `scripts/` ni `.claude/` n'a été touché. Aucun commit.

## 13. Arbitrages nécessitant une intervention humaine

Aucun signalement n'a pu être créé, et ce point mérite une décision :

1. **[Fait vérifié]** Deux preuves documentent des questions pour lesquelles **aucune position
   n'existe** dans `positions/bruno-retailleau.yaml` : `immigration-regroupement-familial-ressources`
   (preuves 004 et 005) et `immigration-ame-soins-urgents` (preuve 008). Un signalement
   `POSITION_REVIEW` doit viser une position existante ; il n'a donc pas pu être ouvert.
   **[Interprétation]** C'est à une personne de décider s'il faut ouvrir la rédaction d'un brouillon
   de position sur ces deux questions, en tenant compte du fait que la preuve sur l'AME est une
   paraphrase de 2024 datant de sa fonction ministérielle, et que celle sur le regroupement familial
   est un texte collectif de 2023 dont il est le deuxième signataire.
2. **[Interprétation]** La qualification `QUALIFIED_OPPOSITION` de la preuve 003
   (`immigration-frais-etudiants-etrangers`) repose sur un pas de raisonnement explicite : les frais
   des étudiants extra-européens sont majorés par principe, donc supprimer l'exonération automatique
   les porte au-dessus de ceux des étudiants français. Si ce pas est jugé trop long, la qualification
   devrait devenir `NO_DIRECT_EVIDENCE` ; la position publiée (valeur −2) n'est de toute façon pas
   contredite.
3. **[Fait vérifié]** La validation signale 17 avertissements `RECH-STATUS` n° 6 (candidats publiés
   absents du registre de recherche) : c'est l'état attendu après ce test borné à une seule
   personnalité. Peupler le registre relève d'une mission ultérieure, sur demande explicite.
