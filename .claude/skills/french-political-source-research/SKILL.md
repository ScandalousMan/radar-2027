---
name: french-political-source-research
description: >-
  Méthodologie de recherche, de vérification, de qualification et d'enregistrement des
  preuves sur les positions et statuts de candidature des personnalités politiques françaises
  liées à la présidentielle 2027 (corpus data/recherche du projet radar-2027). À utiliser
  pour toute recherche ou vérification de citations, sources, attributions ou statuts de
  candidature, par le sous-agent french-political-source-researcher ou sur sélection
  manuelle.
---

# Recherche de sources politiques françaises (présidentielle 2027)

Ce skill contient **toute** la méthodologie obligatoire. Il est préchargé par le sous-agent
`french-political-source-researcher` et peut être sélectionné seul (`/french-political-source-research`)
dans une session ordinaire : les règles sont les mêmes dans les deux cas. Les numéros entre
parenthèses (FR-0xx) renvoient à `specs/008-recherche-sources-politiques/spec.md`.

## 0. Objet et principes

- Le but n'est **pas** de trouver une source qui « va dans le sens » d'une proposition, mais
  d'établir **exactement ce que la preuve démontre**, et ce qu'elle ne démontre pas.
- **Preuve ≠ évaluation** (FR-042). Une preuve documente un propos, un document ou un acte. Une
  position (`data/corpus/positions/`) est une évaluation relue, publiée et scorée. La recherche
  ne modifie **jamais** une position, une question, un thème, la liste des candidats ni le score :
  quand une preuve pourrait changer une évaluation, elle produit un **signalement** pour revue
  humaine (§15).
- Neutralité : mêmes exigences de preuve pour toutes les personnalités, quel que soit leur bord.
- Rien n'est inventé : ni citation, ni date, ni URL, ni horodatage, ni numéro de page. Une lacune
  honnête vaut mieux qu'une réponse non étayée.
- Toute affirmation du compte rendu est étiquetée : **[Fait vérifié]**, **[Citation]**,
  **[Paraphrase]**, **[Interprétation]** ou **[Hypothèse]** (§17).

## 1. Périmètre et fichiers

Le corpus de preuves vit sous `data/recherche/` ; il n'est jamais publié ni scoré.

```text
data/recherche/
├── personnalites.yaml               # personnalités suivies + historique daté des statuts (§4)
├── preuves/<personnalite-id>.yaml   # preuves d'une personnalité (§7 à §12)
├── journaux/<journal-id>.yaml       # journal de mission : requêtes, sources, lacunes (§2, §13)
├── journaux/<journal-id>.md         # compte rendu en 13 rubriques (§17)
└── signalements.yaml                # demandes de revue humaine (§15)
```

**Modifiable** : `data/recherche/**` ; nouvelles sources via `pnpm data:source fetch`, qui écrit
`data/corpus/sources/<id>.yaml` et le cache local `.cache/sources/` (FR-039).

**Jamais modifié** (FR-046, FR-049) : `data/corpus/candidates.yaml`, `themes.yaml`,
`governance.yaml`, `questions/`, `positions/`, `contributors.yaml`, `public/data/`, `src/`,
`scripts/`, `.claude/`, la configuration globale (`~/.claude/`). Pas de `pnpm data:extract`
(payant), `data:review` ni `data:publish`.

**Identifiants** (FR-011, FR-040) :

- une personnalité présente dans `data/corpus/candidates.yaml` garde **le même identifiant** ;
  sinon `prenom-nom` en kebab-case ASCII (`jean-exemple`) ;
- preuve : `<personnalite-id>-<thème ou candidature>-<NNN>` (`bruno-retailleau-immigration-003`,
  `bruno-retailleau-candidature-001`), jamais réattribué ;
- journal : `YYYY-MM-DD-<slug>` (date de début de mission) ;
- signalement : `sig-YYYY-MM-DD-<slug>`.

Thèmes et questions : uniquement ceux de `data/corpus/themes.yaml` et `data/corpus/questions/*.yaml`
(FR-024). Aucun nouvel axe, aucune nouvelle question, aucun changement de polarité.

## 2. Démarrage d'une mission

1. **Lire la demande** et identifier le **mode** (§3) et le **périmètre** : personnalités, thèmes,
   questions, par leurs identifiants. En cas d'ambiguïté sur le périmètre, le dire dans le journal.
2. **Ouvrir le journal** `data/recherche/journaux/<YYYY-MM-DD-slug>.yaml` (`author: claude`,
   `model: opus` pour le sous-agent, `request` = demande reformulée fidèlement, `state`
   provisoire). Toute requête effectivement lancée y est consignée au fil de l'eau (FR-029).
3. **Lire le corpus existant avant toute recherche web** (FR-034) :
   - `data/corpus/candidates.yaml` (liste publiée, statuts, sources de statut) ;
   - `data/corpus/questions/<thème>.yaml` (énoncés exacts, polarités, état) ;
   - `data/corpus/positions/<candidat>.yaml` (valeur −2 à +2 = degré d'accord avec l'énoncé,
     citation, source) ;
   - `data/corpus/sources/<id>.yaml` et `commun.yaml` (sources déjà enregistrées) ;
   - `data/recherche/personnalites.yaml`, `preuves/<id>.yaml`, `signalements.yaml` et les journaux
     précédents sur le même périmètre.
   Consigner cette lecture comme catégorie `EXISTING_CORPUS`.

## 3. Les cinq modes (FR-047)

| Mode | Déroulé |
|---|---|
| `PERSONALITY` | Toutes les preuves vérifiables d'une personnalité, éventuellement limitées à un thème : passes §6 complètes, statut de candidature (§4), contradictions (§11), lacunes (§13). |
| `COMPARISON` | Plusieurs personnalités sur un même sujet, **à critères de preuve identiques** : mêmes catégories de sources explorées pour chacune (`categoriesExplored` identique, ou écart justifié dans `categoriesNotExplored`), mêmes types de requêtes, mêmes seuils de qualification. Le compte rendu contient un **tableau des lacunes par personnalité**. |
| `THEMATIC` | Un thème ou une question, pour plusieurs personnalités : chercher des preuves **dans les deux sens de la polarité** de chaque question (soutien **et** opposition à l'énoncé), consigner les requêtes des deux sens dans le journal, et l'écrire explicitement dans le compte rendu. Ne jamais se contenter des preuves qui confirment une position déjà enregistrée. |
| `GLOBAL_ENRICHMENT` | Audit du corpus de preuves : repérer les lacunes (§13), dédupliquer (§12), revérifier les preuves anciennes (mettre à jour `verifiedAt` **avec une entrée d'historique**, sans réécrire l'historique), compléter les statuts. Jamais lancé pendant une installation ni sans demande explicite. |
| `ADVERSARIAL_AUDIT` | Vérification indépendante de citations, attributions, actualité, qualité et interprétation existantes (preuves ou positions). **Revérifier d'abord la source** — rouvrir l'original, retrouver le passage, relire le contexte — **sans lire d'abord la conclusion existante** (valeur, qualification, justification), puis seulement comparer. Tout écart produit un signalement `QUOTE_DISCREPANCY` ou `POSITION_REVIEW` (§15) ; rien n'est corrigé dans les positions. |

## 4. Statuts de candidature (FR-007 à FR-012)

Toute personnalité française pertinente ayant exprimé une ambition présidentielle pour 2027 peut
être suivie, pas seulement les candidats déclarés.

Huit statuts, liste fermée (FR-008) :

| Statut | Définition | Exemple | Contre-exemple |
|---|---|---|---|
| `DECLARED` | Candidature annoncée **par l'intéressé·e**, sans condition | « Je suis candidat à l'élection présidentielle » dans un entretien | Un journal écrit « X va se déclarer » |
| `INTENTION_EXPRESSED` | Intention personnelle publique, pas encore une déclaration formelle | « J'ai l'intention d'être candidate en 2027 » | « Je n'exclus rien » (→ `POTENTIAL`) |
| `POTENTIAL` | Se présente comme candidat·e possible, ou n'exclut pas de l'être | « Je prendrai ma décision au printemps » | Aucun propos, seulement des sondages qui le testent (→ rien, ou `REPORTED_UNCONFIRMED` si un tiers l'affirme) |
| `ATTEMPTED` | Démarche engagée sans aboutir (parrainages, collecte, pré-campagne arrêtée) hors procédure de désignation d'un parti | Lancement d'une collecte de parrainages abandonnée | Défaite à une primaire (→ `DEFEATED_IN_SELECTION_PROCESS`) |
| `WITHDRAWN` | Renoncement ou retrait annoncé après une déclaration ou une intention | « Je retire ma candidature » | Silence prolongé |
| `DEFEATED_IN_SELECTION_PROCESS` | Battu·e à une investiture, primaire ou procédure de sélection | Résultat officiel d'une primaire de parti | Sondage défavorable |
| `REPORTED_UNCONFIRMED` | Candidature prêtée par un tiers, non confirmée par l'intéressé·e | « Selon son entourage, X prépare sa candidature » | Propos de X lui-même (→ statut correspondant) |
| `NOT_A_CANDIDATE` | Déclare ne pas être candidat·e (ou dément) | « Je ne serai pas candidat en 2027 » | Absence d'annonce |

Règles :

- **Rumeur ≠ déclaration** (FR-010). Un propos de tiers (`THIRD_PARTY_ATTRIBUTION`) ou d'attribution
  incertaine (`UNKNOWN_ATTRIBUTION`) ne justifie que `REPORTED_UNCONFIRMED`, `POTENTIAL` ou
  `NOT_A_CANDIDATE`. `DECLARED` et `INTENTION_EXPRESSED` exigent une preuve `PERSONAL_DIRECT` ou
  `PERSONAL_DOCUMENT`.
- Chaque statut est **daté** (`at` : date des propos ou de l'événement ; `observedAt` : date de
  constatation) et relié à **au moins une preuve** `kind: CANDIDACY` de la même personnalité.
- **Historique** (FR-009) : un nouveau statut est **ajouté en fin** de `statuses` (ordre de `at`
  croissant) ; rien n'est réécrit. Une personnalité ayant renoncé reste dans le registre.
  Renoncement puis nouvelle annonce : trois statuts conservés.
- **Écart avec la liste publiée** (FR-012) : si le statut courant (dernier de `statuses`) d'une
  personne de `candidates.yaml` n'est pas l'équivalent du sien (`declared` ↔ `DECLARED`,
  `withdrawn` ↔ `WITHDRAWN`), ou si une personnalité **hors liste** est au statut courant
  `DECLARED`, créer un signalement `CANDIDATE_STATUS`. **Ne jamais modifier `candidates.yaml`.**
- Une personnalité de `candidates.yaml` entre au registre avec son statut publié, appuyé sur la
  source de statut déjà enregistrée (`statusSource`) quand elle permet une preuve `CANDIDACY`.

## 5. Hiérarchie des sources (FR-013, FR-014, FR-016)

**Niveau A — sources primaires** (à privilégier systématiquement) :

- déclarations et discours originaux ;
- entretiens complets diffusés par leur média d'origine ;
- documents de campagne ;
- sites personnels et publications officielles ;
- communiqués et déclarations directement publiés par la personnalité ;
- questions, amendements, propositions de loi, rapports et interventions parlementaires ;
- comptes rendus des débats de l'Assemblée nationale et du Sénat ;
- documents gouvernementaux ;
- vidéos et enregistrements originaux ;
- publications publiques de comptes dont l'authenticité peut être établie.

**Niveau B — sources secondaires fiables** : agences de presse reconnues ; médias nationaux et
régionaux établis ; publications spécialisées en politique française ; entretiens et extraits
correctement attribués.

**Niveau C — sources de contextualisation** : travaux universitaires ; publications de recherche ;
fact-checking ; archives historiques ; bases de données spécialisées.

Règles :

- Les niveaux B et C **aident à trouver** une preuve ; ils ne sont **jamais présentés comme
  primaires** (FR-014).
- Un **extrait de moteur de recherche n'est jamais une preuve**. Toujours **ouvrir l'original**
  et lire le passage dans son contexte.
- Wikipédia, agrégateurs de citations, captures d'écran non sourcées, forums : pistes seulement,
  jamais preuve. Les domaines d'agrégateurs déclarés dans `data/corpus/governance.yaml`
  (`aggregatorDomains` : `candidatspresidentielles2027.fr`, `monvote2027.fr`, `wikipedia.org`) sont
  **refusés par la validation** comme source du registre ou `unregisteredSource` d'une preuve
  (règle `SRC-AGGREGATOR`) ; on les consigne seulement en piste (champ `lead`, §13 bis).
- Source primaire inaccessible : documenter la limitation (dans la preuve et le journal) et
  qualifier la source secondaire utilisée (FR-016).
- **Paywall, authentification, contrôle d'accès : jamais contournés** (FR-049). La preuve est
  alors `SOURCE_INACCESSIBLE` avec `unregisteredSource` (§14).
- Le niveau A/B/C/D de la preuve (`sourceQuality`, §10) **s'ajoute** au type de source du registre
  (`kind` : `programme`, `livre_plateforme`, `declaration_vote`), qui ne change pas de sens.

## 6. Passes de recherche (FR-028)

Une mission n'est pas terminée après une ou deux requêtes. **Ne pas s'arrêter à la première
citation trouvée** : chercher aussi les propos antérieurs, postérieurs et contraires. Chaque
requête lancée est consignée dans `queries` avec sa catégorie (liste fermée ci-dessous).

Catégories (`category`, `categoriesExplored`) : `PERSONAL_SITE`, `CAMPAIGN_SITE`, `PARTY_SITE`,
`ASSEMBLEE_NATIONALE`, `SENAT`, `PARLIAMENTARY_ARCHIVES`, `EUROPEAN_PARLIAMENT`, `GOVERNMENT`,
`SPEECHES_PRESS_CONFERENCES`, `FULL_INTERVIEWS`, `TV_RADIO_DEBATES`, `ORIGINAL_VIDEOS`,
`SOCIAL_MEDIA`, `HISTORICAL_ARCHIVES`, `NATIONAL_MEDIA`, `REGIONAL_MEDIA`, `PRESS_AGENCIES`,
`SPECIALIZED_PUBLICATIONS`, `ACADEMIC`, `FACT_CHECKING`, `EXISTING_CORPUS`.

| Passe | Contenu | Catégories |
|---|---|---|
| A — Formulation exacte | énoncé de la question entre guillemets, fragments distinctifs, noms et verbes clés, variantes grammaticales | `NATIONAL_MEDIA`, `PRESS_AGENCIES` |
| B — Personnalité | nom complet (et alias) + sujet, synonymes, termes techniques et juridiques, instruments, seuils, dates | toutes |
| C — Institutions | `site:assemblee-nationale.fr`, `site:senat.fr`, `site:europarl.europa.eu`, `site:vie-publique.fr`, `site:legifrance.gouv.fr`, `site:gouvernement.fr`, domaines officiels de la personnalité et du parti | `ASSEMBLEE_NATIONALE`, `SENAT`, `EUROPEAN_PARLIAMENT`, `PARLIAMENTARY_ARCHIVES`, `GOVERNMENT`, `PERSONAL_SITE`, `PARTY_SITE` |
| D — Audiovisuel | entretiens intégraux, débats, discours, meetings, émissions de radio et de télévision, podcasts, chaînes officielles ; quand un article rapporte une citation, chercher l'enregistrement original | `FULL_INTERVIEWS`, `TV_RADIO_DEBATES`, `ORIGINAL_VIDEOS`, `SPEECHES_PRESS_CONFERENCES` |
| E — Programme et campagne | programmes actuels et passés, livrets, PDF, propositions, conférences de presse, versions archivées ; noter la date et le cycle électoral | `CAMPAIGN_SITE`, `PARTY_SITE`, `HISTORICAL_ARCHIVES` |
| F — Activité parlementaire | propositions de loi, amendements, questions, interventions, rapports, scrutins publics, explications de vote, position du groupe | `ASSEMBLEE_NATIONALE`, `SENAT`, `EUROPEAN_PARLIAMENT`, `PARLIAMENTARY_ARCHIVES` |
| G — Contradictions et chronologie | propos antérieurs et postérieurs, revirements, précisions, critiques, votes contraires, écart campagne / gouvernement | `HISTORICAL_ARCHIVES`, `FACT_CHECKING`, `REGIONAL_MEDIA` |
| H — Élargissement | phrases exactes tirées d'articles secondaires, orthographes et terminologies alternatives, recherche par date, événement ou émission, archives, liens suivis depuis des articles fiables, transcriptions ou vidéos du même événement | `SPECIALIZED_PUBLICATIONS`, `ACADEMIC`, `SOCIAL_MEDIA` |

Exemples de requêtes (motifs, pas des preuves) pour « Jean Exemple » et l'âge de départ à la retraite :

- `"Jean Exemple" "âge légal de départ"` · `"Jean Exemple" retraite 64 ans`
- `"Jean Exemple" "durée de cotisation"` · `"Jean Exemple" "carrières longues"`
- `site:assemblee-nationale.fr "Jean Exemple" retraite` · `site:senat.fr "Exemple" retraites amendement`
- `"Jean Exemple" réforme des retraites entretien intégral` · `"Jean Exemple" retraites débat vidéo`
- `"Jean Exemple" "âge de départ" programme PDF`

Une catégorie importante non consultée (réseau social sous authentification, archive payante,
source hors ligne) est inscrite dans `categoriesNotExplored` avec sa raison ; la recherche n'est
alors **jamais** déclarée exhaustive (`exhaustive: false`, FR-030).

## 7. Vérification des citations (FR-017 à FR-020)

Pour chaque preuve, relever autant que possible (FR-017, champs de FR-041) : texte intégral exact de la citation utile ;
auteur effectif des propos (`speaker`) ; date des propos ; date de publication si différente ;
titre de la source ; média ou institution ; URL directe ; type de source ; passage, page ou
horodatage ; contexte nécessaire à la compréhension ; date de vérification.

Méthode : ouvrir l'original ; confirmer l'auteur et la date ; recopier le texte **en français
d'origine** ; noter la localisation précise ; lire ou écouter assez de contexte ; vérifier si le
propos est conditionnel, hypothétique, ironique ou rapporté.

**Interdits** (FR-020) — ne jamais :

- reconstituer une citation à partir d'une paraphrase journalistique ;
- fusionner plusieurs déclarations ;
- retirer des réserves ou conditions qui changent le sens ;
- corriger silencieusement les propos (fautes, tics oraux compris) ;
- mettre entre guillemets une reformulation ;
- attribuer à une personnalité des propos qu'elle n'a pas personnellement tenus ;
- **traduire** une citation et présenter la traduction comme l'original.

**Vidéo et audio** (FR-018) : localisation `timestamp` au format `HH:MM:SS` ou `MM:SS`. Le texte
de la source est la **transcription** utilisée, enregistrée avec
`pnpm data:source fetch <url-vidéo> --from-file <transcription.txt>`. Indiquer `transcript` :
`official` (transcription publiée par le média ou l'institution), `manual` (transcription humaine
faite à l'écoute), `automatic` (sous-titres générés). L'agent n'écoute pas l'audio : une
transcription **automatique n'est jamais `VERIFIED_QUOTE`** (elle reste `UNVERIFIED_QUOTE`, « à
confirmer à l'écoute »).

**Documents parlementaires et administratifs** : localisation `page`, `article`, `amendment`,
`paragraph` ou `passage` (numéro d'amendement, article de loi, page du compte rendu).

**Statuts de citation** (`quoteStatus`, FR-019) :

| Statut | Critère |
|---|---|
| `VERIFIED_QUOTE` | Texte retrouvé **mot pour mot** dans la source ouverte (texte en cache du registre), localisation précise, qualité A ou B, transcription non automatique. La validation recherche la citation dans le cache. |
| `UNVERIFIED_QUOTE` | Propos rapporté entre guillemets par une source, mais original non retrouvé ou non vérifiable (transcription automatique, extrait tronqué). Jamais présenté comme authentifié. |
| `PARAPHRASE` | Reformulation (la nôtre ou celle d'un média) dans `paraphrase`, **sans guillemets** et sans champ `quote`. |
| `SOURCE_INACCESSIBLE` | Source repérée mais non consultable (paywall, authentification, page retirée) : `unregisteredSource`, qualité D. |

**Deux formulations dans deux médias** : la forme de la **source primaire** prime. Sans source
primaire, recopier les deux variantes dans `verificationNotes` et laisser la citation
`UNVERIFIED_QUOTE`.

## 8. Attribution (FR-021 à FR-023)

| `attribution` | Sens |
|---|---|
| `PERSONAL_DIRECT` | Déclaration personnelle explicite |
| `PERSONAL_DOCUMENT` | Document personnellement signé ou officiellement publié par la personnalité |
| `PERSONAL_ACTION` | Action individuelle documentée (vote, amendement, question écrite) ; **`actionScope` obligatoire** : texte visé, procédure, lecture, sens exact |
| `PARTY_POSITION` | Position d'un parti |
| `PARLIAMENTARY_GROUP_POSITION` | Position d'un groupe parlementaire |
| `GOVERNMENT_POSITION` | Position d'un gouvernement |
| `COALITION_POSITION` | Position d'une coalition ou d'un accord collectif |
| `THIRD_PARTY_ATTRIBUTION` | Position attribuée par un tiers |
| `UNKNOWN_ATTRIBUTION` | Attribution insuffisamment établie |

Confiance (`attributionConfidence`) : `HIGH`, `MEDIUM`, `LOW`, `UNCONFIRMED`.

Règles :

- Une position de **parti** n'est pas automatiquement celle de chacun de ses membres.
- **Vote de groupe** (FR-022) : un vote de groupe donne `PARLIAMENTARY_GROUP_POSITION` ; le vote individuel
  nominatif de la personnalité donne `PERSONAL_ACTION` avec `actionScope`. **Ni l'un ni l'autre ne
  prouve que la personnalité partage l'argumentaire associé** : n'en déduire aucune motivation
  individuelle.
- Une décision **gouvernementale** ne démontre pas que chaque ministre l'a personnellement défendue.
- Une signature, un vote ou un amendement peuvent être des preuves, mais leur **signification est
  décrite précisément** (texte, article, lecture, résultat), après lecture du texte et du contexte
  de la procédure.
- Si `speaker` n'est pas la personnalité (porte-parole, parti, homonyme), l'attribution ne peut
  être ni `PERSONAL_DIRECT` ni `PERSONAL_DOCUMENT` (contrôlé par la validation, aux accents et à la
  casse près ; ajouter les variantes de nom dans `aliases`).
- **Désaccords documentés** avec le parti ou le groupe : les conserver comme preuves distinctes,
  sans en effacer aucune (FR-023).

## 9. Qualification (FR-024 à FR-026)

La qualification d'une preuve rattachée à une question est **relative à l'énoncé de la question**
(son texte exact dans `questions/<thème>.yaml`), pas à l'axe du thème (FR-025) :

| `qualification` | Sens |
|---|---|
| `EXPLICIT_SUPPORT` | Soutien explicite à l'énoncé |
| `EXPLICIT_OPPOSITION` | Opposition explicite à l'énoncé |
| `QUALIFIED_SUPPORT` | Soutien avec réserves, sur une partie seulement, ou plus étroit que l'énoncé |
| `QUALIFIED_OPPOSITION` | Opposition avec réserves ou partielle |
| `CONDITIONAL_POSITION` | Position subordonnée à une condition explicite |
| `AMBIGUOUS` | Propos qui ne permet pas de conclure |
| `CONTRADICTORY_EVIDENCE` | Preuves contraires non résolues (§11) |
| `NO_DIRECT_EVIDENCE` | Propos sur le sujet, mais sans lien direct avec l'énoncé |

Une question exige une qualification et inversement ; une preuve peut être rattachée à un thème
sans question. **Une absence de preuve ne signifie ni neutralité ni opposition.**

**Précision des politiques** : comparer chaque dimension à l'énoncé.

| Dimension | À vérifier |
|---|---|
| Acteur | Est-ce la position personnelle de la personnalité ? |
| Instrument | Impôt, subvention, interdiction, plafond, réglementation, investissement public, autre ? |
| Objectif | L'objectif déclaré est-il celui de l'énoncé ? |
| Montant | Le montant ou le seuil exact est-il établi ? |
| Calendrier | Même échéance, même fréquence ? |
| Portée | Mêmes personnes, secteurs, institutions ? |
| Géographie | National, européen, international ? |
| Statut juridique | Idée, promesse, proposition de loi, loi adoptée, mesure appliquée ? |
| Conditions | Exceptions, préalables, réserves ? |
| Force | Explicite, partielle, conditionnelle, exploratoire ? |

Ne pas confondre : soutien à un objectif et soutien à un instrument ; hausse ponctuelle et hausse
garantie chaque année ; intention et engagement ; proposition et mesure adoptée ; vote de groupe et
position individuelle ; option envisagée et choix arrêté ; une population et toute la population.

**Interdits de déduction** (FR-026) : ne jamais déduire une position d'une étiquette idéologique,
de l'appartenance à un parti, d'une politique voisine, ni d'un vote seul sans avoir lu le texte
voté et le contexte de la procédure.

## 10. Appréciations séparées (FR-015, FR-027)

Cinq appréciations **distinctes**, sans score agrégé :

1. **Qualité de la source** (`sourceQuality`) : `A_PRIMARY_VERIFIED` (source primaire ouverte et
   vérifiée), `B_RELIABLE_SECONDARY` (secondaire fiable, ou article reproduisant intégralement un
   entretien), `C_CONTEXTUAL_ONLY` (contextualisation), `D_UNVERIFIED_OR_INACCESSIBLE`. Elle dépend
   de l'usage : une page de presse est primaire pour un entretien reproduit intégralement,
   secondaire pour une citation rapportée.
2. **Exactitude de la citation** (`quoteStatus`, §7).
3. **Fiabilité de l'attribution** (`attribution`, `attributionConfidence`, §8).
4. **Interprétation politique** (`qualification`, §9).
5. **Actualité** (`temporalRelevance`, §11).

Chaque appréciation non évidente est justifiée en clair dans `rationale` (clés permises :
`sourceQuality`, `quote`, `attribution`, `interpretation`, `temporalRelevance`). Une source primaire
peut être ambiguë ; une source secondaire de qualité peut confirmer qu'un propos a été tenu sans
démontrer qu'il est toujours actuel.

## 11. Actualité et contradictions (FR-031 à FR-033)

Quatre dates distinctes :

- `statedAt` : date des propos (`{ date, precision: day|month|year }`), ou **`unknown`** explicite,
  **jamais remplacée par la date de publication** ;
- `publishedAt` : seulement si différente de celle de la source du registre ;
- `period` : période à laquelle la position semble correspondre (« campagne 2022 », « depuis
  septembre 2026 ») ;
- `verifiedAt` : date de dernière vérification (et `researchedAt`, date de la recherche).

`temporalRelevance` :

- `CURRENT` : propos de moins de 12 mois, ou corroboré par une source récente (moins de 12 mois) ;
- `DATED` : plus ancien et non corroboré récemment ;
- `HISTORICAL` : période révolue (autre élection, autre fonction) ;
- `UNDETERMINED` : si et seulement si `statedAt: unknown`.

**Ne jamais présenter une déclaration ancienne comme position actuelle sans corroboration récente** (FR-032).

Deux preuves contradictoires : **conserver les deux**, indiquer leur chronologie, chercher une
explication ou une évolution (revirement assumé, contexte différent, précision ultérieure), ne
jamais supprimer la plus ancienne. Sans explication fiable : qualification
`CONTRADICTORY_EVIDENCE`, entrée `contradictions` dans le journal et signalement
`UNRESOLVED_CONTRADICTION`.

## 12. Doublons et corroborations (FR-034 à FR-036)

**Avant tout ajout**, rechercher dans le dépôt (outil de recherche plein texte) :

- la citation (un fragment distinctif) : `data/recherche/preuves/`, `data/corpus/positions/` ;
- l'URL et le titre de la source : `data/corpus/sources/` ;
- les passages équivalents (autre formulation du même propos, même événement, même date).

Décider ensuite :

- même source et même citation qu'une preuve existante → **ne rien ajouter** ; au besoin mettre à
  jour `verifiedAt` (avec entrée d'historique) et consigner dans `duplicatesAvoided` ;
- autre source confirmant **la même citation** → **corroboration** de la preuve existante
  (`corroborations`), pas une nouvelle preuve (FR-035) ;
- même propos, formulations proches sur deux sources, doute sur l'identité → signalement
  `POSSIBLE_DUPLICATE` citant les deux preuves, **sans rien supprimer**.

**Indépendance des sources** : deux reprises d'une même dépêche ou d'un même communiqué ne sont
**pas** deux corroborations indépendantes ; le dire dans `note`. Préférer : déclaration originale +
compte rendu indépendant ; transcription officielle + vidéo originale ; compte rendu parlementaire +
entretien contemporain.

Identifiants stables, jamais réattribués ; aucune suppression d'enregistrement.

## 13. Lacunes et `NOT_FOUND` (FR-037, FR-038)

Toute lacune est inscrite dans `gaps` du journal (`kind`, `personality`, `theme`/`question`
éventuels, `evidence` concernées, `note` factuelle) :

| `kind` | Situation |
|---|---|
| `NO_PERSONAL_POSITION` | Aucune position personnelle trouvée |
| `PARTY_POSITION_ONLY` | Seule une position de parti trouvée |
| `HISTORICAL_ONLY` | Seule une déclaration historique trouvée |
| `PRIMARY_INACCESSIBLE` | Source primaire inaccessible |
| `REPORTED_UNVERIFIABLE` | Citation rapportée mais non vérifiable |
| `CANDIDACY_UNCERTAIN` | Statut de candidature incertain |
| `CONTRADICTORY_SOURCES` | Sources contradictoires |
| `UNKNOWN_DATE` | Date inconnue |
| `NO_OPPOSING_EVIDENCE` | Aucune preuve dans le sens opposé |
| `NOT_FOUND` | Rien trouvé après une recherche significative |

`NOT_FOUND` **seulement après une recherche significative** : au moins **5 requêtes** et au moins
**3 catégories explorées** dans le journal (seuil contrôlé par la validation), sur plusieurs
passes du §6. La `note` décrit les recherches, **jamais une position supposée**. `NOT_FOUND` n'est
jamais une preuve et ne vaut ni neutralité ni opposition.

## 13 bis. Mission issue de `data:gaps` (spec 009)

`pnpm data:gaps` classe les positions manquantes (candidat × question) par gain attendu et les
regroupe en **missions candidat × thème** dans `data/reports/trous/<date>.md`. Pour une telle
mission :

1. **Lire les lignes de la mission** : identifiants de questions, statut de banque (`active`,
   `reserve-promotable`, `reserve`), couvertures. Traiter les questions dans l'ordre de la liste.
2. **Chercher en sources primaires** (§5, §6) une prise de position **personnelle** du candidat
   sur chaque question : programme, livre, discours, entretien, vote. Ouvrir et lire l'original.
3. **Agrégateur = piste seulement.** Si une piste vient d'un agrégateur (domaines de
   `aggregatorDomains`), remonter à la source primaire et consigner la piste dans le champ `lead`
   de la preuve (`lead: { url, title }`) ; jamais en `source` ni en `unregisteredSource`.
   Dans le journal, l'agrégateur figure dans `sourcesConsulted` avec `outcome: rejected`.
4. **Absence documentée** : consigner une lacune dans `gaps` du journal, **avec `question`** :
   `NOT_FOUND` après au moins 5 requêtes sur 3 catégories (§13), ou `NO_PERSONAL_POSITION` si seule
   une position collective existe. `data:gaps` relègue alors ce couple en « déjà cherché ».
5. **Ne jamais déduire** une position du parti, d'un soutien, d'un allié ou d'une position
   collective (`PARTY_POSITION_ONLY` au besoin). Aucune position n'est écrite par la mission :
   `data/corpus/positions/` reste intouché (contrat 008) ; l'agent principal transcrit ensuite les
   preuves `VERIFIED_QUOTE` de qualité primaire en positions `draft`, relues par le propriétaire.

## 14. Enregistrement pas à pas (FR-039 à FR-045)

Règles d'écriture : chaque fichier garde son en-tête de commentaire ; ajout **en fin de liste** ;
un élément existant n'est modifié que pour ajouter une corroboration, ajouter une entrée
d'historique avec la correction correspondante, mettre à jour `verifiedAt`/`updatedAt`, ajouter un
statut en fin d'historique ; **aucune suppression**. Dans une liste YAML en ligne (`[…]`), mettre
entre guillemets tout texte contenant « : ».

**1. Enregistrer la source** (si elle n'est pas déjà dans `data/corpus/sources/`) :

```bash
pnpm data:source fetch <url> --candidate <personnalite-id> --kind <programme|livre_plateforme|declaration_vote> --title "<titre>" --published <YYYY|YYYY-MM|YYYY-MM-DD>
```

Correspondance du `--kind` : programme ou document de campagne → `programme` ; livre, plateforme
écrite, site personnel → `livre_plateforme` ; tout le reste (entretien, discours, vidéo, compte
rendu parlementaire, vote, article, réseau social, travail universitaire) → `declaration_vote`.
Page non téléchargeable ou vidéo : copier le texte ou la transcription dans un fichier temporaire
**hors du dépôt** et ajouter `--from-file <fichier.txt>`. Pour une personnalité absente de
`candidates.yaml`, l'avertissement « candidat absent de candidates.yaml » est **attendu** : la
validation accepte l'identifiant s'il figure dans `data/recherche/personnalites.yaml` (créer
l'entrée du registre d'abord). Ne jamais éditer à la main un fichier de `data/corpus/sources/`.

**2. Personnalité** (`personnalites.yaml`), si absente :

```yaml
- id: jean-exemple
  name: Jean Exemple
  party: Parti exemple
  aliases: [J. Exemple]
  statuses:
    - status: REPORTED_UNCONFIRMED
      at: { date: 2026-09, precision: month }
      observedAt: 2026-11-22
      evidence:
        - jean-exemple-candidature-001
      note: Candidature prêtée par un hebdomadaire, non confirmée par l'intéressé.
  createdAt: 2026-11-22
  updatedAt: 2026-11-22
```

**3. Preuve** (`preuves/<personnalite-id>.yaml`, fichier créé avec un en-tête de commentaire s'il
n'existe pas) :

```yaml
- id: bruno-retailleau-immigration-001
  personality: bruno-retailleau
  kind: POSITION                      # ou CANDIDACY (sans theme, question ni qualification)
  theme: immigration
  question: <id-de-question>          # facultatif ; exige qualification
  qualification: EXPLICIT_SUPPORT
  candidacyStatus: DECLARED           # statut à la date des propos (facultatif)
  quoteStatus: VERIFIED_QUOTE
  quote: "texte exact retrouvé mot pour mot dans la source"
  speaker: Bruno Retailleau
  transcript: official                # vidéo ou audio seulement
  context: Entretien intégral, réponse à une question sur le regroupement familial.
  verificationNotes: Passage relu dans la transcription officielle publiée par le média.
  source: <id-de-source-du-registre>
  publisher: <média ou institution>
  locator: { kind: timestamp, value: "00:12:34" }
  sourceQuality: A_PRIMARY_VERIFIED
  attribution: PERSONAL_DIRECT
  attributionConfidence: HIGH
  temporalRelevance: CURRENT
  period: campagne présidentielle 2027
  rationale:
    interpretation: <pourquoi cette qualification au regard de l'énoncé>
  statedAt: { date: 2026-10-05, precision: day }
  researchedAt: 2026-11-22
  verifiedAt: 2026-11-22
  journal: 2026-11-22-bruno-retailleau-immigration
  createdAt: 2026-11-22
  updatedAt: 2026-11-22
```

Source inaccessible : pas de `source` ni de `locator`, mais

```yaml
  quoteStatus: SOURCE_INACCESSIBLE
  unregisteredSource:
    url: https://…
    title: <titre>
    publisher: <média>
    reason: page derrière un paywall, non contournée
  sourceQuality: D_UNVERIFIED_OR_INACCESSIBLE
```

Corroboration (ajoutée à la preuve existante, source différente de `source` et des autres
corroborations ; `updatedAt` = date de la corroboration) :

```yaml
  corroborations:
    - source: <autre-id-de-source>
      locator: { kind: paragraph, value: "4" }
      quoteStatus: VERIFIED_QUOTE
      verifiedAt: 2026-11-22
      journal: <journal-id>
      note: Dépêche reprenant la même phrase ; non indépendante du média d'origine.
```

**Correction** (jamais silencieuse, FR-043) : modifier le champ **et** ajouter une entrée
d'historique datée du jour, qui conserve l'ancienne valeur ; `updatedAt` = cette date. Une
revérification seule (`verifiedAt`) s'historise aussi (`field: verifiedAt`). Une preuve reconnue
fausse est requalifiée (`UNVERIFIED_QUOTE`, `UNCONFIRMED`…), jamais supprimée.

```yaml
  history:
    - at: 2026-12-03
      field: qualification
      previous: EXPLICIT_SUPPORT
      reason: La suite de l'entretien (00:13:10) pose une condition omise lors de la première lecture.
      journal: 2026-12-03-audit-immigration
  updatedAt: 2026-12-03
```

**4. Journal** (`journaux/<journal-id>.yaml`, un objet) : `id`, `mode`, `author: claude`,
`model: opus`, `request`, `startedAt`, `completedAt`, `state` (`completed` ou `interrupted` avec
`interruption`), `scope` (`personalities`, `themes`, `questions`), `queries` (`at`, `query`,
`category`, `tool`), `categoriesExplored`, `categoriesNotExplored` (`category`, `reason`),
`exhaustive`, `sourcesConsulted` (`url`, `title`, `outcome` : `retained` avec `source`, `rejected`
ou `inaccessible` avec `reason`), `evidenceAdded`, `evidenceCorroborated`, `evidenceCorrected`,
`duplicatesAvoided` (`evidence`, `note`), `verified`, `toVerify`, `contradictions` (`evidence`,
`note`), `gaps` (§13), `signals`. Toute preuve de `evidenceAdded` porte `journal` égal à ce journal.

**5. Signalements** : §15.

## 15. Signalements (FR-012, FR-033, FR-036, FR-044)

Un signalement **ne modifie rien** : il demande une revue humaine. L'agent ne crée que des
signalements `state: open` et **n'en résout jamais** (`resolution` est réservé à un humain ; la
décision est appliquée, le cas échéant, par une pull request de données distincte).

| `kind` | Quand | Champs requis |
|---|---|---|
| `POSITION_REVIEW` | Une preuve pourrait modifier une position existante : notamment qualification `*_SUPPORT` alors que la position (`draft` ou `reviewed`) du même candidat sur la même question est négative, ou `*_OPPOSITION` alors qu'elle est positive (obligatoire, contrôlé) ; aussi une position `unknown` désormais documentée, ou une nuance importante | `position: { candidate, question }`, `evidence` ≥ 1 |
| `QUOTE_DISCREPANCY` | La citation d'une position n'est pas retrouvée telle quelle dans sa source (audit) | `position` |
| `CANDIDATE_STATUS` | Statut courant différent de la liste publiée (§4) | `evidence` ≥ 1 |
| `POSSIBLE_DUPLICATE` | Deux preuves semblent rapporter le même propos (§12) | `evidence` ≥ 2 |
| `UNRESOLVED_CONTRADICTION` | Contradiction sans explication fiable (§11) | `evidence` ≥ 1 |

```yaml
- id: sig-2026-11-22-retailleau-immigration-regroupement
  kind: POSITION_REVIEW
  raisedAt: 2026-11-22
  journal: 2026-11-22-bruno-retailleau-immigration
  personality: bruno-retailleau
  position: { candidate: bruno-retailleau, question: <id-de-question> }
  evidence: [bruno-retailleau-immigration-001]
  reason: "Position relue à -1 ; l'entretien du 2026-10-05 (00:12:34) dit « … » : soutien explicite."
  state: open
```

`reason` contient le **passage exact** en cause. Chaque signalement est aussi listé dans `signals`
du journal.

## 16. Contrôle final

Avant de rendre la main :

1. `pnpm data:validate` : **0 violation** ; corriger toute violation `RECH-*` ou `SCHEMA` sur le
   corpus de preuves (seuls `CACHE-MISSING` et les avertissements préexistants sont admis).
2. `git status --short` : seuls `data/recherche/**` et, au plus, `data/corpus/sources/*.yaml` sont
   modifiés ou ajoutés. Toute autre modification est annulée et signalée.
3. Relire chaque citation `VERIFIED_QUOTE` contre la source ouverte (texte, auteur, date,
   localisation, contexte).
4. Écrire le compte rendu `journaux/<id>.md` (§17) et le **restituer intégralement** dans la réponse.

## 17. Compte rendu (FR-048)

Fichier `data/recherche/journaux/<journal-id>.md`, restitué dans la réponse. Les 13 titres de
niveau 2 sont **obligatoires** (contrôlés par la validation) ; une rubrique sans objet porte
« Aucun », elle n'est jamais supprimée.

```markdown
# Compte rendu — <journal-id>

Mode : <mode> · Auteur : <contributeur> · Dates : <début> → <fin> · État : <completed|interrupted>

## 1. Périmètre de recherche
## 2. Personnalités et thèmes couverts
## 3. Sources consultées
## 4. Citations et preuves ajoutées
## 5. Sources ayant corroboré des éléments existants
## 6. Corrections effectuées
## 7. Doublons évités
## 8. Éléments non vérifiés ou non résolus
## 9. Changements de statut de candidature identifiés
## 10. Contradictions et évolutions de position
## 11. Lacunes documentaires restantes
## 12. Fichiers créés ou modifiés
## 13. Arbitrages nécessitant une intervention humaine
```

Dans chaque rubrique, chaque constat important porte la **citation exacte ou le passage de
référence et l'URL**. Chaque affirmation est étiquetée : **[Fait vérifié]** (constaté dans une
source ouverte), **[Citation]** (texte exact), **[Paraphrase]** (reformulation), **[Interprétation]**
(lecture politique de l'agent), **[Hypothèse]** (non vérifié). En mode `COMPARISON`, la rubrique 11
contient un tableau des lacunes par personnalité ; en mode `THEMATIC`, la rubrique 1 indique que
les deux sens de la polarité ont été cherchés.

## 18. Sécurité et interdits (FR-049, FR-050)

- Travailler **exclusivement dans le dépôt courant** ; ne rien écrire sous `~/.claude/` ni dans une
  configuration globale.
- Ne jamais exposer de secret, d'identifiant ni d'information privée ; ne suivre que des
  personnalités publiques et des informations publiques.
- Ne jamais contourner un paywall, une authentification ou un contrôle d'accès.
- Aucun service payant ni API supplémentaire ; jamais `pnpm data:extract`, `data:review`,
  `data:publish`.
- Ne jamais modifier `candidates.yaml`, les thèmes, les questions (formulation, polarité, enjeu,
  état d'activation), les positions, la gouvernance, `src/`, `scripts/`, `public/data/`, `.claude/`.
- Ne jamais recalculer un score ni activer ou désactiver une question.
- Aucun commit, push ni pull request sans demande explicite d'adrien.
- Ne jamais supprimer de données historiques (preuve, statut, historique, signalement).
- Ne jamais inventer ni reconstituer une citation, une date, une URL, un horodatage ou une page ;
  ne jamais tenir un extrait de moteur de recherche pour vérifié ; ne jamais citer une source
  inaccessible comme si elle avait été lue ; ne jamais prétendre à l'exhaustivité sans l'avoir
  documentée ; ne jamais cacher une preuve contraire.
