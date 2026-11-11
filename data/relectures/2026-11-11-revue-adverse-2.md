# Revue adverse n° 2 des énoncés FR-012 (2026-11-11)

Ce rapport suit la mission de revue adverse externe n° 2 : revoir les 16 énoncés de la version 4 et le créneau Démocratie vide, sans reprendre à son compte les conclusions des revues précédentes. Le droit est vérifié au **11 novembre 2026**. Les preuves sont classées en KNOWN, PLAUSIBLE, NOT_FOUND ou CONTRADICTED, au niveau candidat, groupe ou contexte.

**Résultat**
- **15 énoncés acceptés.** 4 d'entre eux remplacent des énoncés de la version 4, 10 ont été reformulés, 1 est inchangé.
- **2 créneaux laissés vides** : Institutions « − » et le 4ᵉ « − » de Démocratie (REJECT_NO_VALID_CANDIDATE).
- **5 énoncés de la version 4 retirés.**
- **Aucun énoncé activé** : tous restent `draft` et doivent être validés par adrien.
- Le rapport précédent ([2026-11-10-nouveaux-enonces.md](2026-11-10-nouveaux-enonces.md)) est conservé tel quel.

**Fichiers**
- Métadonnées par énoncé (texte v4, texte final, changement, preuves, annexe) : [2026-11-11-revue-adverse-2.json](2026-11-11-revue-adverse-2.json).
- Registres complets, avec URL, citations et dates : dossier [2026-11-11-revue-adverse-2/](2026-11-11-revue-adverse-2/).
  - Annexes `annexe-*.md` : vérifications du jour.
  - Annexes `anterieur-*.md` : registres des 10 et 11/11, conservés pour l'historique.

## Méthode

1. **Données lues dans le dépôt** :
   - les 300 entrées de `data/corpus/questions/*.yaml` ;
   - la seconde passe ([2026-11-10-seconde-passe.json](2026-11-10-seconde-passe.json)) ;
   - les registres antérieurs.

   FR-012 est recalculé depuis ces fichiers (§ G).
2. **Vérification en parallèle par six agents de recherche.** Ils ont relu en ligne le droit au 11/11/2026 (Légifrance, Conseil constitutionnel, Assemblée, Sénat, BOFiP) et les preuves de niveau candidat.
3. **Relecture indépendante par un relecteur distinct du rédacteur (Fable 5.2), en lecture seule**, en trois tours :

   | Tour | Version | ACCEPT | Bloquants | Majeurs | Mineurs |
   |---|---|---|---|---|---|
   | 1 | v4 (16 énoncés) | 3 | 5 | 13 | 15 |
   | 2 | v5 (16 énoncés) | 13 | 1 | 4 | 20 |
   | 3 | v5 final (15 énoncés + 2 créneaux vides) | 15 | 0 | 0 | 17 |

4. **Règle C5 appliquée.** Chaque extrémité doit être défendue par un acteur public identifiable, et au moins une extrémité par une source de niveau candidat. Un programme ne vaut pour un candidat que s'il le porte. Un vote sur un amendement ne prouve une position que sur ce texte.

Les erreurs des registres antérieurs relevées par cette revue sont listées au § C.

## A. Tableau adverse final

Abréviations : B = bloquant, M = majeur, m = mineur, — = aucun défaut, cand. = niveau candidat.

| ID | Thème | Verdict | Pire défaut | C1 | C2 | C3 | C4 | C5 | Axe/polarité | Nouveauté | Discrimination | Correction ou remplacement |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `economie-eau-operateurs-publics` | Économie + | ACCEPT | m | ok | ok | ok | ok | + cand. (Mélenchon) ; − acteurs (FP2E, LR) | ok | ok | moyenne | inchangé |
| `economie-encadrement-loyers-generalise` | Économie + | ACCEPT (reformulé) | m | ok | ok au 11/11 | ok | ok | + Mélenchon ; − Retailleau (cand.) | ok | ok | bonne | « la commune » → « les élus locaux » |
| `fiscalite-reduire-allegements-cotisations` | Fiscalité + | ACCEPT (reformulé) | m | ok | ok (RGDU) | ok | ok | + Mélenchon ; − Attal (cand.), DR, EPR | ok | ok | bonne, transpartisane | « exonérations » → « allègements » |
| `fiscalite-plafonner-abattement-pensions` | Fiscalité + | **REPLACE (retiré)** | M | ok | instable (PLF 2027) | ok | ok | aucun candidat « pour » | ok | ok | quasi-unanimité | remplacé par le quotient familial |
| `fiscalite-quotient-familial-credit-enfant` | Fiscalité + | ACCEPT (nouveau) | m | ok | ok (CGI 197) | ok | ok | + LFI (AS16), Mélenchon (crédit par enfant) ; − Zemmour (cand.), RN, DR | ok | ok | bonne | — |
| `fiscalite-exit-tax-renforcee` | Fiscalité + | ACCEPT (reformulé) | m | ok | **corrigé** | ok | ok | + Ruffin (cand.) ; − gouvernement | ok | ok | moyenne à bonne | mécanisme réécrit |
| `immigration-asile-examen-en-france` | Immigration + | ACCEPT (reformulé) | m | ok | **corrigé** | ok | ok | + Mélenchon ; − gouvernement (PJL 2820) | ok | ok | bonne | ne confond plus entrée et responsabilité |
| `securite-controles-identite-soupcon` | Sécurité − | ACCEPT (reformulé) | — | ok | ok (78-2 al. 8) | ok | ok | d'accord : Ruffin (cand.) ; pas d'accord : Sénat (LR) | ok | ok | bonne | soupçon et réquisition exclus |
| `securite-interdire-plaquage-ventral` | Sécurité − | ACCEPT (reformulé) | m | ok | ok | ok | ok | d'accord : Mélenchon (cand.) ; pas d'accord : ministère de l'Intérieur (2020) | ok | ok | bonne | pratique décrite plus précisément |
| `securite-dissoudre-brav-m` | Sécurité − | **REPLACE (retiré)** | M | ok | ok | ok | ok | pas d'accord seulement plausible | discutable | redondant (LBD, drones) | locale | remplacé par les BAC |
| `securite-supprimer-bac` | Sécurité − | ACCEPT (nouveau) | m | ok | ok | ok | ok | d'accord : Mélenchon, GDR (Roussel) ; pas d'accord : ministre Berger, députés RN | ok | ok | étroite (LFI, PCF) | — |
| `institutions-dotations-conditionnees-etat` | Institutions − | ACCEPT (reformulé) | m | ok | ok (réforme proposée) | ok | ok | d'accord : Philippe (acte 2018), HCP ; pas d'accord : Lisnard (acte), Départements de France | ok (lecture budgétaire possible) | ok | faible à moyenne | « rythme maximal » → « plafond » |
| `institutions-maintenir-article-40` | Institutions − | ACCEPT (reformulé) | — | ok | ok | ok | ok | pas d'accord : Roussel (cand.) ; d'accord : EPR, MoDem, Sénat | ok | ok | moyenne | monopole du gouvernement rendu visible |
| `institutions-etat-impose-equipements` | Institutions − | **REJECT (retiré)** | B | ok | **présupposé faux** | ok | ok | aucun défenseur actuel | ok | ok | inconnue | créneau vide |
| `democratie-quorum-referendum` | Démocratie − | **REPLACE (retiré)** | B | ok | ok | ok | ok | **aucun défenseur** | ok | 5ᵉ item référendaire | nulle | remplacé par les cours criminelles |
| `democratie-champ-referendum-inchange` | Démocratie − | ACCEPT (reformulé) | — | ok | ok (art. 11) | ok | ok | pas d'accord : Retailleau, Le Pen (cand.) ; d'accord : Union centriste | ok | ok | forte, transpartisane | vise le référendum législatif, exemples hors champ |
| `democratie-cours-criminelles-sans-jury` | Démocratie − | ACCEPT (nouveau) | m | ok | ok (loi 2026-651) | ok | ok | pas d'accord : Mélenchon, Ruffin (cand.) ; d'accord : gouvernement | acceptable (corrélation à tester) | ok | gauche contre centre | — |
| `democratie-pas-de-constituante` | Démocratie − | **REPLACE (retiré)** | B | ok | ok | ok | double négation | aucun défenseur du refus | polarité fausse | ok | concentrée sur LFI | remplacé par le Congrès |
| `democratie-revision-par-congres` | Démocratie − | ACCEPT (nouveau) | m | ok | ok (art. 89 al. 3) | ok | ok | pas d'accord : Mélenchon, Ruffin (cand.) ; d'accord : DR (amendement n° 45) | ok | voisin de `institutions-referendum-revision-constitution` | LFI contre les autres | — |
| 4ᵉ créneau Démocratie − | Démocratie − | **REJECT_NO_VALID_CANDIDATE** | — | — | — | — | — | — | — | — | — | créneau vide (§ E) |
| 3ᵉ créneau Institutions − | Institutions − | **REJECT_NO_VALID_CANDIDATE** | — | — | — | — | — | — | — | — | — | créneau vide (§ E) |
| `environnement-derogation-especes-protegees` | Environnement − | ACCEPT (reformulé) | m | « détruire » légèrement chargé | ok (L411-2 et L411-2-1) | ok | ok | pas d'accord : Batho, Ruffin (cand.) ; d'accord : RN, DR, EPR, Horizons | ok | ok | bonne | ne prétend plus toucher aux conditions de fond |

## B. Raisonnement par énoncé

Textes finaux (≤ 200 caractères, comptés) :

| ID | Texte final | Car. |
|---|---|---|
| `economie-eau-operateurs-publics` | La distribution de l'eau potable doit être assurée uniquement par des opérateurs publics. | 89 |
| `economie-encadrement-loyers-generalise` | Le plafonnement du niveau des loyers doit être obligatoire dans toutes les zones où le logement manque (zones tendues), même si les élus locaux ne le demandent pas. | 164 |
| `fiscalite-reduire-allegements-cotisations` | Les allègements de cotisations sociales accordés aux employeurs sur les salaires doivent être réduits. | 102 |
| `fiscalite-quotient-familial-credit-enfant` | Le quotient familial doit être remplacé par un crédit d'impôt du même montant pour chaque enfant, quel que soit le revenu des parents. | 134 |
| `fiscalite-exit-tax-renforcee` | Quand une personne quitte la France avec plus de 800 000 € d'actions, l'impôt sur ses plus-values déjà acquises ne doit être annulé que si elle garde ses actions 15 ans, et non 2 ou 5. | 184 |
| `immigration-asile-examen-en-france` | La France doit examiner elle-même les demandes d'asile déposées sur son sol, au lieu de renvoyer les demandeurs vers le pays européen désigné par les règles de l'Union. | 168 |
| `securite-controles-identite-soupcon` | Les contrôles d'identité que la police peut faire sans soupçon ni réquisition du procureur, pour prévenir un trouble à l'ordre public, doivent être supprimés. | 158 |
| `securite-interdire-plaquage-ventral` | Il doit être interdit aux forces de l'ordre d'immobiliser une personne au sol, à plat ventre, en exerçant une pression sur son dos ou son thorax. | 145 |
| `securite-supprimer-bac` | Les brigades anticriminalité (BAC) de la police nationale doivent être supprimées. | 82 |
| `institutions-dotations-conditionnees-etat` | Les dotations de l'État aux grandes collectivités doivent baisser si leurs dépenses de fonctionnement augmentent plus vite que le plafond fixé par l'État. | 154 |
| `institutions-maintenir-article-40` | Seul le gouvernement, et non les parlementaires, doit continuer à pouvoir proposer des mesures qui augmentent les dépenses publiques. | 133 |
| `democratie-champ-referendum-inchange` | Le référendum sur un projet de loi doit rester limité aux sujets prévus aujourd'hui, sans être étendu à tous les domaines de la loi, comme la justice pénale ou les sujets de société. | 182 |
| `democratie-cours-criminelles-sans-jury` | Les crimes punis de 15 ou 20 ans de réclusion doivent continuer à être jugés par des magistrats sans jury populaire, dans les cours criminelles départementales. | 160 |
| `democratie-revision-par-congres` | Une révision de la Constitution doit pouvoir continuer à être adoptée par le Parlement réuni en Congrès, sans référendum. | 121 |
| `environnement-derogation-especes-protegees` | Un projet industriel ou d'aménagement doit pouvoir obtenir plus facilement une dérogation à l'interdiction de détruire des espèces protégées. | 141 |

### Économie

**ECO-1, eau.**
- *Force :* public contre privé pour exploiter un service marchand, dans la même famille que l'énergie, le rail et les autoroutes.
- *Faiblesse :* le côté « pas d'accord » n'a pas de candidat. Ce sont la FP2E (« Nous défendons en effet la liberté de choix de la collectivité vis-à-vis de son opérateur », audition AN du 12/05/2021) et LR (2018).
- « Uniquement » reprend le « 100 % publique » de LFI : ce n'est pas un absolu artificiel. L'énoncé vise l'exploitation, pas la propriété des réseaux, qui est déjà publique. Les SEM (sociétés d'économie mixte) restent un cas limite.
- La part de la population servie en délégation (52 %, SISPEA, données 2024) figure dans la note, pas dans le texte.
- *Preuves :* + KNOWN candidat (Mélenchon, page AEC vue en extrait, à rouvrir) ; − KNOWN acteur.

**ECO-2, loyers.**
- Le texte distingue bien le plafonnement du **niveau** (ELAN art. 140, expérimental) de la limitation des **hausses** (art. 18 de la loi de 1989).
- La demande émane souvent de l'EPCI, d'où « les élus locaux ». « Même si… » explicite « obligatoire » ; ce n'est pas un second choix.
- *Droit au 11/11 :* expérimentation jusqu'au 23-24/11/2026 ; la PPL n° 2039 n'est pas adoptée et la 2ᵉ lecture à l'AN a lieu le 18/11. Aucune prévision de séance n'est utilisée.
- *Preuves :* + Mélenchon (« Geler les loyers le temps de déployer un encadrement des loyers partout sur le territoire », AEC 2027) ; − Retailleau (« Suppression de l'encadrement des loyers sur l'ensemble du territoire », plan du 28/05/2026, source secondaire relue en entier).

### Fiscalité

**FIS-1, allègements.**
- Réduire un allègement augmente les prélèvements. La lecture « coût du travail » va dans le même sens.
- Le périmètre reste global (on peut vouloir réduire certains allègements et pas d'autres) : acceptable pour un item d'orientation.
- *Preuves :* + Mélenchon (fin des allègements au-dessus de 2 SMIC, chiffrage d'octobre 2026) ; − Attal (« des chemins alternatifs à la hausse des charges existent », 21/11/2024, formule courte), DR et EPR (groupes).

**FIS-2, abattement sur les pensions : retiré (REPLACE).**
- Aucun candidat « pour ».
- La seule preuve de niveau candidat côté « contre » (Le Pen, amendement I-CF293) porte sur une autre mesure, le forfait de 2 000 € du PLF 2026.
- Le vote du 15/10/2026 (116 voix contre 30) annonce une quasi-unanimité contre.
- L'art. 3 du PLF 2027 est en navette au Sénat.

**FIS-2 bis, quotient familial (nouveau).**
- *Mesure :* redistribution par l'impôt sur le revenu. Le gain du quotient familial croît avec le revenu jusqu'au plafond (1 807 € par demi-part, CGI 197 I 2, revenus 2025) ; un crédit forfaitaire redistribue vers les ménages modestes.
- *Nouveauté :* aucun item sur le quotient familial dans la banque.
- *Preuves :* + groupe LFI (amendement AS16 : « remplacer l'injuste quotient familial fiscal actuel par un crédit d'impôt par enfant ») ; Mélenchon KNOWN sur « Créer un crédit d'impôt par enfant pour toutes les familles » (AEC 2027) mais seulement PLAUSIBLE sur le remplacement ; − Zemmour (« doubler le quotient familial », 2022, cand.), RN 2024, DR (PPL 3224).
- *Réserve :* les motifs natalistes peuvent faire lire l'item comme de la politique familiale.

**FIS-3, exit tax.**
- *Erreur corrigée :* la version 4 disait « rester imposables sur leurs plus-values pendant quinze ans ». En réalité, l'impôt porte sur la plus-value latente au départ et il est **dégrevé** si les titres sont conservés 2 ans, ou 5 ans au-delà de 2,57 M€ (CGI 167 bis).
- *Historique :* 8 ans en 2011-2013 (seuil 1,3 M€), puis 15 ans en 2014-2018 (seuil 800 000 €). La « version 2011 à 15 ans » de la presse est fausse.
- Le critère alternatif (50 % des bénéfices d'une société) est omis : il ne change pas le choix proposé.
- *Preuves :* + Ruffin (cand., LCP 03/11/2025), amendements à 15 ans (2025 ; 30/10/2026, caducs depuis le rejet de la 1ʳᵉ partie du PLF 2027 le 04/11) ; − gouvernement.

### Immigration

**IMM-1, asile.**
- *Erreur corrigée :* la version 4 confondait l'entrée dans l'UE et la responsabilité de l'examen. L'entrée irrégulière n'est qu'un critère tardif de la hiérarchie : la famille et les titres ou visas passent avant (règlement 2024/1351, art. 33). Elle confondait aussi le droit de déposer, qui existe déjà, et l'obligation d'examiner.
- La nouvelle formulation vise le vrai choix : cesser les transferts et examiner. C'est faisable sans quitter l'UE grâce aux clauses discrétionnaires (art. 35).
- *Date d'application :* le règlement 2024/1351 s'applique, mais la date exacte est incertaine (1er juillet 2026 selon son art. 85, 12 juin selon l'étude d'impact du PJL 2820). Aucune date n'est citée.
- *Preuves :* + Mélenchon (AEC 2027, contre le pacte), LFI CL13 (17/07/2026) ; − gouvernement (Nuñez, réponse à la QAG 1615 ; PJL 2820).
- *Réserve :* le RN rejette aussi le pacte, pour des raisons opposées. Il ne faut jamais coder « contre le pacte » comme un accord.

### Sécurité

**SEC-1, contrôles d'identité.**
- La catégorie visée est l'al. 8 de l'art. 78-2 du CPP (police administrative, « quel que soit son comportement »). La nouvelle formulation exclut le soupçon et la réquisition ; la finalité écarte la zone frontalière.
- Aucun numéro d'article dans le texte : l'art. 78-2 sera abrogé au 01/01/2029 par la recodification.
- *Preuves :* d'accord : Ruffin (PPL 1841, qui supprime l'al. 8, texte lu) ; pas d'accord : commission des lois du Sénat (rapport Bonhomme).

**SEC-2, plaquage ventral.**
- Une seule pratique, décrite physiquement. Aucune interdiction dans les textes.
- Le Défenseur des droits (décision 2026-062) demande un cadre et une formation, pas une interdiction. L'affirmation d'un amendement LFI de 2022 selon laquelle la technique aurait été abandonnée en 2020 n'est pas reprise.
- *Preuves :* d'accord : Mélenchon (AEC 2027), Ruffin et Glucksmann (2020) ; pas d'accord : ministère de l'Intérieur (maintien en 2020). Aucune déclaration contraire de 2023-2026 trouvée.

**SEC-3, BRAV-M : retirée (REPLACE).** Unité de la seule préfecture de police de Paris dans un questionnaire national, et troisième item « manifestations » après les LBD et les drones.

**SEC-3 bis, BAC (nouveau).**
- Unités nationales : l'item mesure les moyens de la police.
- *Preuves :* d'accord : Mélenchon (AEC 2027, « démanteler les BAC et la BRAV-M »), amendement GDR n° 236 cosigné par Roussel (LOPMI, 08/11/2022) ; pas d'accord : ministre délégué Berger (question orale n° 818, 01/07/2026), députés RN (question écrite n° 12485, 27/01/2026). Ce sont des positions pro-BAC, pas des réponses à une suppression.
- *Faiblesse :* discrimination étroite (LFI, PCF).
- La restriction de l'usage des armes (CSI L435-1) a été écartée : doublon avec `securite-restreindre-tirs-refus-obtemperer`.

### Institutions

**INS-1, dotations.**
- *Erreur corrigée dans les registres :* les contrats de Cahors reprenaient de la **fiscalité** (douzièmes), pas des dotations.
- L'énoncé décrit une **réforme proposée** (Haut-commissariat au Plan, avril 2026 : bonus/malus sur les dotations d'environ 215 collectivités). Au 11/11/2026, aucun mécanisme lié aux dépenses n'existe. Le DILICO et la CPEB du PLF 2027 sont assis sur les recettes et la richesse.
- *Preuves :* d'accord : Philippe (acte de 2018 comme Premier ministre ; position actuelle NOT_FOUND), HCP ; pas d'accord : Lisnard (Cannes refuse de signer en 2018, acte), Départements de France.
- La citation de Lisnard sur la page AMF 43252, présente dans l'ancien registre, est introuvable et retirée.

**INS-2, article 40.**
- La nouvelle formulation rend visible le monopole du gouvernement (axe exécutif/Parlement) au lieu d'une simple rigueur budgétaire.
- L'art. 40 interdit la création ou l'aggravation d'une charge publique, même compensée, par les propositions et les amendements ; les pertes de ressources sont compensables.
- *Preuves :* pas d'accord : Roussel (premier signataire de CF47 en 2018 ; amendement n° 6 du 28/03/2024, « L'article 40 de la Constitution est abrogé ») ; d'accord : EPR, MoDem, commission des lois du Sénat.

**INS-3, PLU sans accord du maire : retiré (REJECT).**
- Présupposé faux : l'État peut déjà modifier un PLU sans l'accord du maire, par déclaration d'utilité publique, projet d'intérêt général ou déclaration de projet de l'État. L'accord du maire n'est requis que dans la procédure accélérée des projets d'intérêt national majeur (L300-6-2 II, accord réputé donné après un mois).
- Aucun défenseur actuel du côté « d'accord ». Le remplaçant SRU est aussi rejeté (§ E).

### Démocratie

**DEM-1, quorum : retiré (REPLACE).**
- Le quorum de 25 % de la PPLC n° 1552 (Marleix, 20/12/2018) ne vaut que pour le référendum d'initiative populaire qu'elle crée : ses auteurs sont du côté « + ».
- Aucun défenseur d'un quorum pour tous les référendums nationaux.
- Aucun référendum national n'est passé sous 25 % (le plus bas : 30,2 % en 2000) : discrimination nulle.

**DEM-2, champ du référendum.**
- La nouvelle formulation vise le référendum législatif de l'art. 11, distinct de l'art. 89, et montre ce qui est exclu.
- L'exemple « immigration » est retiré : la décision CC 2024-6 RIP a jugé un texte sur l'immigration **dans** le champ de l'art. 11 et l'a censuré sur le fond.
- *Preuves :* pas d'accord : Retailleau (« l'ensemble du domaine de la loi », 03/09/2026), Le Pen (2022) ; d'accord : Union centriste (Bonnecarrère, 06/12/2023). Les RIC de LFI et de Philippot sont un autre type d'extension et ne sont pas comptés.

**DEM-3, constituante : retirée (REPLACE).**
- Aucun candidat ne rejette explicitement une constituante. Philippe n'est cité que par un agrégateur, sans source primaire.
- Polarité fausse : RN, Retailleau et Philippot seraient « d'accord » tout en étant pro-référendum.
- Double négation à la réponse.

**DEM-3 bis, cours criminelles sans jury (nouveau).**
- *Axe :* le jury est une participation directe des citoyens à une décision publique.
- *Droit :* les cours criminelles départementales jugent les crimes punis de 15 ou 20 ans sans jurés ; la loi n° 2026-651 du 23/07/2026 les étend.
- *Nouveauté :* aucun item sur les jurys dans la banque, Justice comprise.
- *Preuves :* pas d'accord : Mélenchon et Ruffin (amendement n° 7 du 14/05/2021, « des magistrats précaires remplacent le peuple »), LFI n° 153 (2026) ; d'accord : gouvernement (loi de 2026).
- *Réserves :* les positions tiennent aussi aux délais de jugement ; corrélation avec l'axe à tester. CPP 380-16 consolidé à relire.

**DEM-4 bis, révision par le Congrès (nouveau).**
- *Axe :* dernier mot aux représentants ou au peuple (art. 89 al. 3).
- *Preuves :* pas d'accord : Mélenchon (« Rendre obligatoire le recours au référendum en cas de modification de la Constitution », AEC 2027), Ruffin (PPLC 1900), LFI (PPLC 722, amendement n° 323) ; d'accord : députés DR, amendement n° 45 (06/02/2026, « l'équilibre institutionnel défini par l'article 89 »). Un seul acteur de groupe de ce côté.
- *Voisinage :* proche de `institutions-referendum-revision-constitution`, sans en être le miroir.

### Environnement

**ENV-1, espèces protégées.**
- *Erreur de cadrage corrigée :* les trois conditions de L411-2 I 4° viennent de l'art. 16 de la directive Habitats. Les réformes françaises ont porté sur des présomptions (L411-2-1) et sur la procédure (loi 2026-403 art. 36 : RIIPM reconnue dès la DUP ; décret 2026-980 du 23/10/2026), jamais sur les conditions. La version 4 disait « assouplir les conditions ».
- Le nouveau texte (« obtenir plus facilement une dérogation ») couvre présomption, procédure et délais sans prétendre toucher au fond.
- *Preuves :* pas d'accord : Batho (vote contre l'élargissement de la RIIPM, scrutin 2141 du 28/05/2025 ; amendement 228 sur la PPL A69), Ruffin (cosignataire) ; d'accord : groupes RN, DR, EPR, Horizons (même scrutin).

## C. Registre juridique (synthèse)

Les lignes complètes (disposition, droit au 11/11/2026, changement proposé, URL primaire, citation, date de la source, date de vérification, confiance, développements en attente) sont dans les annexes `annexe-*.md`.

| ID | Disposition | Droit au 11/11/2026 | Confiance | En attente |
|---|---|---|---|---|
| ECO-1 | CGCT L2224-7 et suivants | libre choix régie / délégation | haute | — |
| ECO-2 | ELAN art. 140 ; loi du 06/07/1989 art. 18 | encadrement expérimental et volontaire jusqu'au 23-24/11/2026 | haute | PPL n° 2039 (2ᵉ lecture AN le 18/11) |
| FIS-1 | CSS L241-13 (RGDU depuis le 01/01/2026) | allègements jusqu'à 3 SMIC, environ 75-80 Md€ | haute | PLFSS 2027 (Sénat le 25/11) |
| FIS-2 bis | CGI 197 I 2 | plafond de 1 807 € par demi-part (BOFiP ; Légifrance non ouvert) | moyenne-haute | PLF 2027 (indexation à 1 845 €) |
| FIS-3 | CGI 167 bis | seuil 800 000 € ou 50 % ; dégrèvement après 2 ans, ou 5 ans au-delà de 2,57 M€ | haute | PLF 2027 au Sénat, CMP |
| IMM-1 | Règlement (UE) 2024/1351, art. 33 et 35 | applicable (1er juillet 2026 selon art. 85) ; Dublin III pour les demandes antérieures | moyenne (EUR-Lex lu sur un miroir) | PJL n° 2820 |
| SEC-1 | CPP 78-2 al. 8 | contrôle préventif « quel que soit son comportement » | haute | abrogation au 01/01/2029 (recodification) |
| SEC-2 | aucune norme d'interdiction ; DDD 2026-062 | technique non interdite | moyenne | — |
| SEC-3 bis | organisation de la police nationale | BAC nationales | moyenne | — |
| INS-1 | loi 2018-32 art. 29 (éteinte) ; LPFP 2023-2027 ; PLF 2027 (CPEB) | aucun mécanisme lié aux dépenses | haute | PLF 2027 |
| INS-2 | Constitution art. 40 | charges interdites, ressources compensables | haute | — |
| DEM-2 | Constitution art. 11 al. 1 ; CC 2024-6 RIP | champ limité | haute | — |
| DEM-3 bis | CPP 380-16 et suivants ; loi 2026-651 ; CC 2026-909 DC | cours sans jury pour les crimes punis de 15-20 ans | moyenne (CPP et décision CC non relus) | — |
| DEM-4 bis | Constitution art. 89 al. 3 | Congrès aux 3/5 | haute | — |
| ENV-1 | Code env. L411-2 (version du 20/08/2026), L411-2-1 ; loi 2026-403 art. 36 ; décret 2026-980 | trois conditions inchangées ; présomptions et procédure assouplies | haute | — |

**Erreurs des registres antérieurs corrigées par cette revue :**
- historique de l'exit tax (8 ans, puis 15 ans) ;
- mécanisme de reprise des contrats de Cahors ;
- citation de Lisnard introuvable ;
- quorum Marleix limité au RIC ;
- CC 2024-6 RIP : texte jugé dans le champ de l'art. 11 ;
- date d'application du règlement 2024/1351 ;
- attribution de la loi 2026-403 à deux objets différents ;
- présupposé de l'item PLU (DUP, PIG, déclaration de projet).

## D. Registre des preuves (synthèse)

Les lignes complètes (acteur, position, statut, URL, date de publication, citation exacte, date de vérification, niveau) sont dans [annexe-preuves-candidats.md](2026-11-11-revue-adverse-2/annexe-preuves-candidats.md) et dans les annexes par thème.

| ID | Extrémité « d'accord » | Extrémité « pas d'accord » |
|---|---|---|
| ECO-1 | Mélenchon, KNOWN cand. | FP2E, KNOWN acteur ; LR, KNOWN groupe ; aucun candidat |
| ECO-2 | Mélenchon, KNOWN cand. | Retailleau, KNOWN cand. (source secondaire) |
| FIS-1 | Mélenchon, KNOWN cand. | Attal, KNOWN cand. (formule courte) ; DR, EPR, KNOWN groupe |
| FIS-2 bis | LFI, KNOWN groupe ; Mélenchon, PLAUSIBLE (crédit par enfant KNOWN) | Zemmour, KNOWN cand. (2022) ; RN, DR, KNOWN groupe |
| FIS-3 | Ruffin, KNOWN cand. ; RN I-807, KNOWN groupe | gouvernement, KNOWN acteur |
| IMM-1 | Mélenchon, KNOWN cand. (contre le pacte) ; LFI CL13 | gouvernement, KNOWN acteur ; RN, Retailleau, Zemmour, PLAUSIBLE |
| SEC-1 | Ruffin, KNOWN cand. | commission des lois du Sénat, KNOWN groupe |
| SEC-2 | Mélenchon, KNOWN cand. ; Ruffin et Glucksmann (2020) | ministère de l'Intérieur (2020), KNOWN acteur |
| SEC-3 bis | Mélenchon, KNOWN cand. ; GDR (Roussel), KNOWN groupe | ministre Berger, députés RN, KNOWN acteur ou groupe (pro-BAC) |
| INS-1 | Philippe, KNOWN acte (2018) ; HCP | Lisnard, KNOWN acte (2018) ; Départements de France |
| INS-2 | EPR, MoDem, Sénat, KNOWN groupe | Roussel, KNOWN cand. ; LFI, PS, CRCE |
| DEM-2 | Union centriste, KNOWN groupe | Retailleau, KNOWN cand. ; Le Pen, KNOWN cand. (2022) |
| DEM-3 bis | gouvernement, KNOWN acteur ; Philippe, PLAUSIBLE | Mélenchon, Ruffin, KNOWN cand. |
| DEM-4 bis | DR, amendement n° 45, KNOWN groupe | Mélenchon, Ruffin, KNOWN cand. |
| ENV-1 | RN, DR, EPR, Horizons, KNOWN groupe | Batho, Ruffin, KNOWN cand. |

**Constat transversal.** Le niveau candidat repose sur Mélenchon ou Ruffin pour 11 des 15 énoncés. Les candidats de droite sont rarement prouvés à titre personnel, et leurs extrémités le sont surtout au niveau des groupes. Cette asymétrie tient aux sources disponibles. Elle devra être réduite par la passe unique de recherche des positions avant l'activation.

## E. Créneaux vides

**4ᵉ créneau Démocratie « − » : REJECT_NO_VALID_CANDIDATE confirmé.**
- L'ancienne formulation (« Le Parlement doit pouvoir modifier une loi adoptée par référendum ») décrit le droit actuel (89-265 DC). Aucun défenseur ni opposant explicite trouvé : elle n'est pas rouverte.
- Autres pistes examinées :
  - respect du « non » référendaire (Le Pen 2022 : NOT_FOUND à la vérification) ;
  - contrôle du Conseil constitutionnel sur les lois référendaires (polarité ambiguë) ;
  - effet contraignant ou consultatif des assemblées citoyennes (doublon de `democratie-assemblees-tirees-consultatives-v2`) ;
  - inscription d'un sujet à l'ordre du jour par pétition, à l'Assemblée ou au CESE (doublon des pétitions) ;
  - référendum obligatoire sur les traités européens (chevauche International) ;
  - quorum du référendum local ;
  - mandat impératif.

  Aucune n'a deux extrémités prouvées sans doublon.

**3ᵉ créneau Institutions « − » : REJECT_NO_VALID_CANDIDATE (nouveau).**
- L'item PLU est retiré (présupposé faux).
- Son remplaçant (« Dans une commune qui ne respecte pas son quota de logements sociaux, le préfet doit systématiquement délivrer les permis de construire à la place du maire ») est rejeté :
  - CCH L302-9-1 non relu ;
  - portée inexacte : le transfert ne vise que les communes déclarées carencées, environ 334, et non toutes les communes déficitaires ;
  - axe confondu avec le logement social ;
  - opposant seulement plausible (Le Pen veut abroger la loi SRU en entier) ;
  - voisin de `institutions-pouvoirs-prefet-renforces`.
- Également écartés : différenciation régionale (miroir d'un item existant), Corse (déjà dans la banque), suppression du département.

## F. Audit croisé

Ces regroupements sont des hypothèses : une formulation différente ne prouve pas l'indépendance. Ils sont à tester sur les réponses réelles.

- **Fiscalité.** Trois instruments distincts : coût du travail (allègements), redistribution familiale (quotient familial), mobilité du capital (exit tax). Les coalitions diffèrent :
  - le RN est pour l'exit tax ;
  - LR est divisé sur les allègements ;
  - le quotient familial suit le clivage gauche/droite.

  Un facteur latent « attitude envers l'impôt » reste probable.
- **Sécurité.** Trois objets distincts : un pouvoir quotidien (contrôles), une technique de coercition (plaquage), une unité (BAC). La redondance « manifestations » de la version 4 (BRAV-M avec LBD et drones) a disparu. Le pôle − reste la critique de gauche de la police, ce qui est inhérent à l'axe ; les BAC isolent surtout LFI et le PCF.
- **Institutions.** Deux dimensions : tutelle financière de l'État sur les collectivités, et monopole budgétaire de l'exécutif face au Parlement. Toutes deux se lisent aussi comme de la rigueur budgétaire, avec une corrélation probable à `economie-baisse-depense-publique`. La dimension État/collectivités sur les compétences n'a pas de bon énoncé (créneau vide).
- **Démocratie.** Le pôle − reste dominé par le référendum : exceptionnel, réservé aux élus, seuil du RIP, champ, Congrès. Le jury est le seul ajout hors référendum. Champ et Congrès voisinent avec `institutions-referendum-revision-constitution`. Le quorum et la constituante, sans défenseur, ont été retirés plutôt que gardés pour le nombre.
- **Orientation gauche/droite générale.**
  - Suivent le clivage : eau, loyers, quotient familial, asile, contrôles, plaquage, BAC, espèces protégées, jury, Congrès.
  - Le coupent : exit tax (RN pour), allègements (centre divisé), dotations (Lisnard contre Philippe), champ du référendum (Retailleau et Le Pen contre l'Union centriste). Ce sont les ajouts les plus informatifs.
- **Doublons.** Aucun doublon strict ni quasi-miroir avec la banque. Voisins signalés :
  - `immigration-asile-examen-hors-europe` (−) ;
  - `institutions-referendum-revision-constitution` ;
  - `societe-*` pour le quotient familial (aucun item fiscal familial).

## G. Projection FR-012

Recalculée depuis les fichiers YAML et la seconde passe.
- **Aujourd'hui, aucun énoncé n'est actif** (300 `draft`). Aucun thème n'est donc conforme au sens strict.
- « Validés » = gardés en première passe (grille de neutralité cochée). « À valider » = seconde passe en attente de confirmation humaine. « Ajouts » = les 15 énoncés acceptés ici, eux-mêmes à valider.

| Thème | Validés | Ajouts proposés / acceptés | Validés + ajouts | + seconde passe à valider |
|---|---|---|---|---|
| Économie | 3+/7− (30 %) | 2 / 2 | 5+/7− (42 %, conforme) | 10+/9− (53 %, conforme) |
| Fiscalité | 3+/8− (27 %) | 3 / 3 | 6+/8− (43 %, conforme) | 11+/10− (52 %, conforme) |
| Immigration | 3+/6− (33 %, 9 énoncés) | 1 / 1 | 4+/6− (40 %, conforme, limite) | 9+/8− (53 %, conforme) |
| Sécurité | 8+/3− (73 %) | 3 / 3 | 8+/6− (57 %, conforme) | 8+/8− (50 %, conforme) |
| **Institutions** | 8+/3− (73 %) | 3 / **2** | 8+/5− (**62 %, non conforme**) | 10+/7− (59 %, conforme, limite) |
| **Démocratie** | 8+/2− (80 %) | 4 / **3** | 8+/5− (**62 %, non conforme**) | 9+/11− (45 %, conforme) |
| Environnement | 8+/5− (62 %) | 1 / 1 | 8+/6− (57 %, conforme) | 9+/7− (56 %, conforme) |

**Effet du rejet d'un ajout** (colonne « validés + ajouts »). Chaque ajout est nécessaire dans son thème : Économie, Fiscalité, Immigration, Sécurité et Environnement deviennent non conformes si l'un de leurs ajouts est rejeté. Le détail :
- Économie : 4+/7− (36 %) ;
- Fiscalité : 5+/8− (38 %) ;
- Immigration : 9 énoncés seulement ;
- Sécurité : 8+/5− (62 %) ;
- Environnement : 8+/5− (62 %).

Avec la seconde passe confirmée :
- Institutions ne reste conforme qu'avec ses deux ajouts. Avec un seul, on passe à 10+/6− (62,5 %).
- Démocratie reste conforme même sans un de ses ajouts : 9+/10− (47 %).

**Conclusion.** Institutions et Démocratie ne sont pas conformes avec les seuls énoncés validés et ajoutés. Elles ne le deviennent que si une partie des énoncés « − » de la seconde passe est confirmée. Ce n'est pas présenté comme acquis. Aucun créneau n'a été rempli pour atteindre FR-012.

## H. Mise en œuvre dans le dépôt

Changements minimaux (PR de données #13), tous en `draft`, `author: claude`, à valider par adrien :
- **10 énoncés reformulés, même ID.** Leur texte de la version 4 est conservé en commentaire au-dessus de l'entrée (`# Texte v4 …`).
- **4 nouveaux ID**, chacun avec un commentaire « Remplace … » :
  - `fiscalite-quotient-familial-credit-enfant` ;
  - `securite-supprimer-bac` ;
  - `democratie-cours-criminelles-sans-jury` ;
  - `democratie-revision-par-congres`.
- **5 ID de la version 4 retirés du YAML** : `fiscalite-plafonner-abattement-pensions`, `securite-dissoudre-brav-m`, `institutions-etat-impose-equipements`, `democratie-quorum-referendum`, `democratie-pas-de-constituante`. Ils n'avaient jamais été sur `main`. Leur texte et le motif du retrait sont conservés dans le JSON (`withdrawn`) et dans ce rapport.
- **Banque active et seconde passe : aucune modification.**
- `pnpm data:validate` : 0 violation.

**À revérifier avant toute activation :**
- loyers : après la séance du 18/11 et l'échéance du 23-24/11/2026 ;
- exit tax, quotient familial et allègements : après les lois de finances et de financement de la sécurité sociale 2027 ;
- cours criminelles : relire CPP 380-16 et la décision 2026-909 DC ;
- eau et plaquage ventral : rouvrir les pages de l'AEC 2027 vues en extrait ;
- Retailleau (loyers) : recouper sur une source primaire.
