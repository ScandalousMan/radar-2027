# Research: Thème Éducation

Phase 0 du plan de la 006. Entrées : la spec clarifiée du 2026-11-15, le code du pipeline 002
(`scripts/data/`), le corpus v1, et la réponse de ChatGPT au prompt de recherche de sources
(`.cache/education/reponse-chatgpt-2026-11-15.md`, hors git). Toutes les vérifications en ligne
citées ci-dessous ont été faites le 2026-11-15.

## R1. Faut-il toucher au code de l'application ?

- **Decision** : non. Seul le pipeline de données change (R4).
- **Rationale** : `src/` ne cite aucun identifiant de thème (recherche de `energie`, `travail`,
  `immigration` : seuls les fixtures et tests en contiennent) ; aucune table d'icônes ni de
  traduction par thème ; les quotas sont testés par propriétés de 8 à 20 thèmes
  (`src/core/selection/quotas.test.ts`) ; la projection publiée lit les thèmes actifs triés par
  `order` (`scripts/data/lib/publish/build.ts`). Le thème apparaît donc partout (FR-014) dès
  qu'il est dans la version.
- **Alternatives considered** : ajouter une icône ou une couleur par thème — hors périmètre,
  aucun thème n'en a.

## R2. Tri des sources proposées par ChatGPT

La réponse propose 19 URL distinctes pour 14 candidats (0 pour Branco, Asselineau, Ruffin,
Philippot). Pré-vérification faite pendant le plan : doublon d'URL contre `data/corpus/sources`,
accessibilité, métadonnées réelles des vidéos (oEmbed YouTube, API Dailymotion), présence de la
citation dans la page. Elle **ne remplace pas** la vérification de FR-010 (texte en cache,
attribution, citation dans le texte normalisé), faite à l'enregistrement.

- **Decision** : traiter chaque proposition comme une piste ; l'enregistrer seulement après
  contrôle ; consigner chaque décision (retenue, écartée, motif) dans le journal de campagne
  (`data/campagnes/education/sources.md`, voir [contracts/campagne-files.md](contracts/campagne-files.md)).
- **Rationale** : la pré-vérification a déjà trouvé des erreurs de ChatGPT (tableau ci-dessous),
  ce qui confirme la règle « aucune citation ni métadonnée reprise sans contrôle ».
- **Alternatives considered** : importer la réponse en bloc — refusé par FR-010.

### Résultat de la pré-vérification

Aucune des 19 URL n'est déjà au corpus (309 sources en v1).

| Candidat | URL (abrégée) | Constat du 2026-11-15 | Suite |
|---|---|---|---|
| Philippe | YouTube `lxUYRSdmSQw` 06:12:19 | Vidéo franceinfo « Nos services publics : 8 candidats… ». Elle sert à **7** candidats dans la réponse (Philippe, Retailleau, Mélenchon, Zemmour, Glucksmann, Roussel, Attal), pas 6 comme l'annonce le rapport. | Transcription du passage (R3), une source par candidat (R3) |
| Philippe | Dailymotion `xbpdk16` | Extrait BFM de 107 s, « Mouvement lycéen : Édouard Philippe… propose un petit peu plus de semaines de cours ». Cohérent. | Transcription du passage |
| Tondelier | lesecologistes.fr dossier de rentrée | 403 (défi Cloudflare). La citation « 15% en 5 ans » est dans un PDF lié, à localiser. Attribution : document du parti dont elle est secrétaire nationale (précédent au corpus : programme des Écologistes via Wayback). | Wayback ou navigateur intégré ; enregistrer le PDF, pas la page |
| Tondelier | YouTube `1WaKtpggqG4` 00:08:30 | BFMTV, titre sans rapport avec l'école (« personne n'est capable de l'emporter seul »). | Transcription ; vérifier que le passage existe |
| Tondelier | YouTube `F6XumBLtjyA` 01:35 | Canal des Écologistes, émission « Les 4V » titrée sur l'islamophobie : la prise de position sur Parcoursup à 01:35 est douteuse. | Transcription ; écarter si le passage n'existe pas |
| Batho | delphinebatho.fr « Protéger l'école… » | 200, citation trouvée. Page de campagne non signée : position de la campagne (programme). | Enregistrer |
| Batho | delphinebatho.fr entretien Reporterre | 200, citation trouvée ; elle décrit les **demandes des lycéens**, pas un engagement. | Enregistrer seulement si un autre passage porte une mesure ; sinon écarter |
| Arthaud | YouTube `1XFZCweX4Hg` 05:12 | « Nathalie Arthaud à Saint-Quentin » : réunion publique, pas une interview comme indiqué. | Transcription ; corriger le titre |
| Arthaud | YouTube `Sa1W6lgDy0g` 08:39 | BFMTV reprise sur son canal, sur le mouvement lycéen. Cohérent. | Transcription |
| Arthaud | lutte-ouvriere.org discours du 26/09 | 200, citation trouvée ; constat sans mesure. | Garder pour d'autres passages éventuels |
| Retailleau | `lxUYRSdmSQw` 04:15:55 | Voir Philippe. | Transcription |
| Lisnard | unenouvelleenergie.fr programme éducation | 200, citation trouvée. Date absente : `2026`, précision année (comme les autres axes du programme). | Enregistrer |
| Lisnard | unenouvelleenergie.fr entretien JDNews | 200, citation trouvée ; entretien reproduit par son parti. | Enregistrer |
| Dupont-Aignan | Dailymotion `xbqmk46` | Extrait BFM de 86 s sur le « système méritocratique de la IIIe République ». Cohérent. | Transcription |
| Mélenchon | melenchon2027.fr plan ESR | 200, citation trouvée. | Enregistrer |
| Mélenchon | `lxUYRSdmSQw` 07:19:32 | Voir Philippe. | Transcription |
| Le Pen | marinelepen.com discours d'Orléans | 200, citation trouvée ; orientation générale (cas limite « phrase vague »). | Enregistrer ; positions seulement sur un passage précis |
| Zemmour | YouTube `Ax-VfNPXjKw` | CNews, « la chute du niveau scolaire me hante ». Cohérent. | Transcription |
| Zemmour | `lxUYRSdmSQw` 03:43:46 | Voir Philippe. | Transcription |
| Glucksmann | YouTube `XAaIJdP-1vo` 00:32 | **Erreur d'attribution** : c'est le « 3e débat de la primaire de la gauche Choisir 2027 » publié par le PS, pas BFMTV. Ses propos dans un débat restent attribuables (déclaration). | Transcription ; corriger titre et date de publication |
| Glucksmann | `lxUYRSdmSQw` 02:22:02 | Voir Philippe. | Transcription |
| Roussel | pcf.fr lettre aux personnels | 200 ; **citation inexacte** : le texte dit « La baisse démographique, à ce titre, ne doit pas être utilisée pour faire des économies. » ChatGPT a retiré « à ce titre ». | Enregistrer ; citer le texte réel |
| Roussel | `lxUYRSdmSQw` 01:29:59 | Voir Philippe. | Transcription |
| Attal | `lxUYRSdmSQw` 00:22:32 | Voir Philippe. | Transcription |
| Kazib | revolutionpermanente.fr 06/11 | 403 (défi Cloudflare). L'URL porte `?var_mode=calcul` (paramètre de cache SPIP) à retirer. Le titre (« Anasse Kazib appelle à durcir la mobilisation ») évoque un article **sur** lui : « signé par Anasse Kazib » est à vérifier ; sinon seules ses citations directes sont attribuables (FR-013a). | Wayback ou navigateur intégré ; vérifier la signature |
| Ruffin | page nouspresident.fr « Éducation : une école de tous les savoirs » | Doublon de contenu probable du Cahier n°8. | Comparer au texte en cache du Cahier ; n'enregistrer que si le contenu diffère |
| Asselineau | table ronde UPR | Écartée à juste titre (il anime). | Rien |

## R3. Sources vidéo : texte en cache et attribution

- **Decision** (propriétaire, 2026-11-15, option « transcription relue ») :
  1. l'agent récupère les sous-titres du passage concerné, sans installer d'outil : piste
     `captionTracks` de la page YouTube (requête HTTP simple), à défaut le panneau
     « Transcription » ouvert dans le navigateur intégré ; pour Dailymotion (extraits de moins
     de 2 minutes), les sous-titres de l'API s'ils existent, sinon transcription demandée à
     adrien ;
  2. le texte est déposé par `pnpm data:source fetch <url> --from-file <transcription.txt>`,
     avec un en-tête qui nomme la vidéo, le passage (timecodes de début et de fin), l'orateur et
     l'origine des sous-titres (automatiques ou manuels) ;
  3. **une source par candidat et par passage**, d'URL distincte grâce au paramètre de temps
     (`https://www.youtube.com/watch?v=lxUYRSdmSQw&t=15355s`) : la règle d'unicité d'URL de
     `data:source` est respectée, l'attribution reste individuelle (la vidéo réunit 8
     candidats) et le visiteur arrive au bon moment de la vidéo ;
  4. les positions tirées d'une transcription portent dans leur justification le timecode de la
     citation ; adrien confirme la citation **à l'écoute** pendant la relecture
     (`data:review`) et corrige la transcription en cache si besoin (nouvelle empreinte) avant de
     relire.
- **Rationale** : la validation exige la citation mot pour mot dans le texte en cache ; l'agent
  ne peut pas écouter ; les sous-titres automatiques contiennent des erreurs que seule l'écoute
  corrige. Le paramètre `t` évite un fichier de source commun ambigu.
- **Alternatives considered** : transcription intégrale par adrien (plus sûre, plus longue) ;
  vidéos écartées (couverture perdue pour Retailleau, Attal, Dupont-Aignan) ; installer
  `yt-dlp` (dépendance et téléchargement non nécessaires) ; une seule source commune pour la
  vidéo franceinfo (attribution par candidat moins lisible, citation d'un candidat vérifiable
  dans le texte d'un autre).

## R4. Outillage de l'axe à trois dimensions

- **Decision** : deux champs facultatifs et une règle.
  - `themes.yaml` : `dimensions` (liste d'au moins 2 éléments `{ id, label, negative,
    positive }`) — seul `education` en déclare ;
  - `questions/*.yaml` : `dimension` (identifiant), obligatoire pour une question active dont le
    thème **principal** déclare des dimensions, interdit sinon ;
  - règle `AXIS-DIM` : dimension connue du thème principal ; au moins 3 questions actives par
    dimension ; nombre de questions actives du thème au moins égal au quota maximal d'un thème
    prioritaire en mode complet, calculé avec `computeQuotas` sur la banque active (13 avec 18
    thèmes). Violation bloquante. Détail dans [contracts/corpus-delta.md](contracts/corpus-delta.md).
- **Rationale** : la spec (US3 scénario 4) attend ces contrôles de « la validation » ; les
  schémas sont stricts, un champ non déclaré serait refusé ; calculer le minimum par
  `computeQuotas` évite un seuil écrit en dur qui deviendrait faux si le nombre de thèmes
  change. Les champs ne sont pas publiés : la projection de `build.ts` liste ses champs
  explicitement.
- **Alternatives considered** : dimension consignée seulement dans le dossier de rédaction
  (non vérifiable par la CI) ; commentaire YAML (perdu par certains scripts avant la PR #20,
  non vérifiable) ; seuil `minQuestionsPerTheme` par thème dans `governance.yaml` (valeur en
  dur).

## R5. Formulation de l'axe et des dimensions

- **Decision** : reprendre la formulation de FR-002 comme proposition, avec un libellé court
  par dimension, à valider par adrien à la relecture de l'ontologie :

  | Dimension | Pôle négatif (−) | Pôle positif (+) |
  |---|---|---|
  | `choix` | Différenciation et liberté de choix des familles | École publique commune |
  | `moyens` | Maîtrise de la dépense publique d'éducation | Moyens publics accrus |
  | `pedagogie` | Autorité, fondamentaux et discipline | Autonomie de l'élève et diversité des pédagogies |

  Axe du thème : pôle négatif « École plus différenciée et plus exigeante, avec plus de choix
  pour les familles et une dépense publique maîtrisée » ; pôle positif « École plus commune et
  plus inclusive, avec plus de moyens publics et de liberté pédagogique ».
- **Rationale** : les sources triées en R2 se répartissent naturellement sur ces trois
  dimensions (chèque-éducation et financement du privé ↔ conditionnement à la mixité ;
  revalorisation, recrutements, effectifs ; méthodes traditionnelles, sélection, discipline ↔
  suppression de Parcoursup, pédagogies). Une question sur la sélection à l'université relève de
  `choix` ou de `pedagogie` selon son objet ; la règle « objet principal » de la spec tranche.
- **Alternatives considered** : un axe unique « plus ou moins d'État » (écrase la dimension
  pédagogique, qui ne recoupe pas le clivage dépense).

## R6. Énoncés tirés des positions : méthode

- **Decision** : après la campagne de sources, l'agent dresse un **inventaire des mesures**
  (une ligne par mesure : candidat, source, citation, dimension, sens) puis regroupe les mesures
  opposées en candidats d'énoncés. Un énoncé n'est retenu que s'il a au moins une citation
  attendue de chaque côté (FR-008). Premières pistes visibles dans les sources triées, à
  confirmer sur les textes en cache :
  - `choix` : financement public suivant le choix de l'établissement par les familles
    (Lisnard) ↔ financement du privé conditionné à la mixité sociale (Tondelier, Glucksmann,
    Roussel) ; suppression de Parcoursup (Mélenchon, Tondelier, Roussel, Glucksmann, Kazib) ↔
    sélection à l'entrée de filières (Philippe, Zemmour) ; collège unique (Retailleau) ;
  - `moyens` : revalorisation chiffrée des enseignants (Tondelier 15 %, Lisnard 20 % sous
    condition) ; plan de recrutement (Roussel 90 000) ; baisse démographique et postes
    (Roussel) ; effectifs en primaire (Attal) ;
  - `pedagogie` : méthodes traditionnelles de lecture (Zemmour) ; certificat de fin de primaire
    (Lisnard) ; contrôle continu et notes (Dupont-Aignan) ; rythmes et calendrier
    (Philippe).
  La couverture du périmètre de FR-005 (petite enfance, laïcité, écrans, instruction en
  famille, école inclusive, éducation prioritaire) est vérifiée sur l'inventaire ; un
  sous-thème sans mesure opposée n'est pas forcé.
- **Rationale** : c'est la décision du 2026-11-15 ; l'inventaire rend vérifiable le lien
  énoncé → sources exigé par SC-002.
- **Alternatives considered** : rédiger d'abord, sourcer ensuite (méthode des campagnes 002,
  écartée pour ce thème).

## R7. Candidats sans source nouvelle

- **Decision** : pour Branco, Asselineau, Ruffin, Philippot, et pour tout candidat dont les
  sources triées ne donnent aucune mesure précise (Le Pen, Batho, Arthaud probablement),
  l'agent (1) relit les sources déjà au corpus qui traitent d'éducation (14 sources de 9
  candidats selon la spec, FR-011) et (2) fait une recherche complémentaire avec l'agent
  `political-source-researcher`, en appliquant FR-013a et l'interdiction des agrégateurs. Le
  journal consigne les sources consultées sans résultat (SC-003).
- **Rationale** : SC-004 demande 12 candidats sur 18 avec au moins 2 positions ; la réponse de
  ChatGPT seule n'en garantit qu'environ 10.
- **Alternatives considered** : s'en tenir à ChatGPT — couverture insuffisante.

## R8. Rejeu des liens v1 (SC-006)

- **Decision** : un test Vitest lit `public/data/versions/1` et un fichier de 20 fragments v1
  (modes complet et court, combinaisons variées de 3 à 5 thèmes) avec leurs résultats attendus
  produits **avant** la publication de la v2 ; il est rejoué après. Le test vit avec les tests
  de `src/lib/results` (chargement depuis le disque).
- **Rationale** : `PUB-IMMUTABLE` garantit que les fichiers v1 ne changent pas ; le test
  vérifie en plus que le chemin de rejeu (sélection de la version par l'en-tête du fragment)
  donne les mêmes classements.
- **Alternatives considered** : contrôle manuel dans le navigateur (non reproductible).

## R9. Amendements de spec et gouvernance

- **Decision** : dans la PR de code, amender `specs/002-.../spec.md` (FR-002 et scénarios « seize
  thèmes » → renvoi à l'ontologie, 18 thèmes ; FR-012 cible 250–320 ; Assumptions datées) et
  `specs/003-.../spec.md` (« 16 thèmes » comme valeur actuelle de `T` → renvoi à la version de
  banque) ; mettre à jour `data/README.md` (18 thèmes, `campagnes/`). Dans la PR de données :
  `governance.yaml` `bankMax: 320`.
- **Rationale** : FR-004 et FR-012 de la 006 ; `BANK-SIZE` ne s'applique qu'avant la première
  publication, mais la valeur doit rester cohérente avec la spec.
- **Alternatives considered** : aucune.
