# Revue corrective après la revue adverse indépendante n° 2 (2026-11-11)

Ce rapport corrige les énoncés FR-012 issus de [2026-11-11-revue-adverse-2.md](2026-11-11-revue-adverse-2.md), qui reste **inchangé**, tout comme ses annexes. Les corrections sont consignées ici et dans [2026-11-11-revue-corrective.json](2026-11-11-revue-corrective.json). Les preuves détaillées sont dans le dossier [2026-11-11-revue-corrective/](2026-11-11-revue-corrective/), en trois annexes :
- `annexe-juridique.md` : AMMR, CGI 167 bis, art. 40, art. 11, cours criminelles ;
- `annexe-preuves-lot-a.md` : FIS-1, FIS-2, ECO-1, INS-1, SEC-2 ;
- `annexe-preuves-lot-b.md` : SEC-3 bis, DEM-3 bis, DEM-4 bis, IMM-1.

Aucune question n'est activée. Tout reste en `draft`, à valider par adrien. La validité prime sur FR-012 : un créneau vide vaut mieux qu'un énoncé faible.

## 1. État initial (avant correction, commit 2d372e5)

- **Git :** branche `002-nouveaux-enonces-fr012`, arbre propre, PR #13 ouverte.
- **Banque :** 299 questions, **0 active**, 299 `draft`. Aucune version publiée : `public/data/versions.json` donne `current: 0` et `versions: []`.
- **Énoncés concernés :** les 15 de la revue n° 2, textes au § 2 de [2026-11-11-revue-adverse-2.md](2026-11-11-revue-adverse-2.md).
- **Références aux 15 identifiants :** uniquement les YAML du corpus et les rapports `data/relectures/` (2026-11-10-nouveaux-enonces.md, 2026-11-11-revue-adverse-2.*). Il n'y en a dans aucun des endroits suivants :
  - positions : `data/corpus/positions/` n'existe pas ;
  - extractions : `affirmations/` et `runs/` sont vides ;
  - jeu publié, code `src/` ou `scripts/`, tests ou fixtures.
- **FR-012 initial :** tableau du § 6 de la revue n° 2 (Institutions et Démocratie non conformes sans la seconde passe).

## 2. Identifiants : compatibilité et règle appliquée

**Consommateurs des identifiants de question** (inspection du code) :

| Consommateur | Usage de l'id | Effet d'un changement d'id aujourd'hui |
|---|---|---|
| Réponses des utilisateurs (lien de résultats, `src/core/codec`) | Aucun : la charge code la **version de banque** et des **indices** de sélection | aucun, rien n'est publié |
| Positions des candidats (`data/corpus/positions/`, `src/core/dataset/positions.ts`) | clé `question` | aucun, il n'existe aucune position |
| Score et appariement (`src/core/score`) | ids du jeu publié | aucun, rien n'est publié |
| Publication (`scripts/data/lib/publish`), FR-011 | une question publiée garde son texte. Au-delà d'une correction typographique, la règle exige un nouvel identifiant, et l'ancien passe en `retired` | la règle ne s'applique qu'aux questions publiées |
| Statistiques, analytique | pas d'analytique (choix du projet) ; les statistiques sont calculées sur le corpus | aucun |
| Historique et audit | rapports `data/relectures/` et historique git | les anciens ids restent cités dans les rapports d'origine |

**Convention du dépôt :**
- L'identité d'une question est figée **à sa publication** (FR-011, statut `retired`, champs `introducedIn` et `retiredIn`).
- Avant publication, un brouillon peut changer sans migration.
- Le schéma (`QuestionSchema`, objet strict) n'a pas de champ `replaces` ou `supersedes`. En ajouter un serait une modification de code, hors de cette PR de données (FR-041 : PR de données distinctes des PR de code). La filiation est donc tracée comme dans la revue n° 2, par commentaire YAML (`# Ancien identifiant : …`, `# Remplace …`) et dans le JSON (`idMap`).

**Règle appliquée :**
- **Nouvel identifiant** quand l'énoncé engage le répondant sur une proposition différente de celle que portait l'identifiant à sa création.
- **Identifiant conservé** pour une correction rédactionnelle ou une précision qui ne change ni le sens ni la portée.

Changer un id ne casse rien aujourd'hui, puisque rien n'est publié ni positionné. Aucune migration n'est nécessaire. L'ancien texte reste lisible dans le commentaire YAML, dans les rapports d'origine et dans git. Aucune preuve n'est reportée automatiquement : les preuves restent rattachées à leur texte dans les annexes.

## 3. Décisions

| ID (final) | Décision | Texte modifié ? | Thème modifié ? | Statut C5 | Statut juridique | Action sur l'ID | Raison |
|---|---|---|---|---|---|---|---|
| `economie-eau-operateurs-publics` | CONSERVÉ | non | non | satisfait : Mélenchon KNOWN (régie ; « uniquement » PLAUSIBLE) / Lisnard niveau 6, FP2E, LR | exact (CGCT L2224-7) | conservé | inchangé depuis la v1 |
| `economie-plafonnement-loyers-zones-tendues` | CONSERVÉ | non | non | satisfait (revue n° 2, non rouvert) | exact au 11/11 ; **à revérifier** après le 18/11 et l'échéance des 23-24/11 | **nouvel id** (ancien : `economie-encadrement-loyers-generalise`) | la v1 portait sur « toutes les grandes villes » ; l'énoncé vise désormais le plafonnement en zones tendues contre l'avis des élus |
| `fiscalite-reduire-allegements-cotisations` | CONSERVÉ | non | non | satisfait : Mélenchon KNOWN niv. 1, Ruffin AS3369 niv. 2 / DR, EPR KNOWN niv. 3 ; Attal rétrogradé en PLAUSIBLE | exact (CSS L241-13) | conservé | id créé en v4, seulement « exonérations » remplacé par « allègements » depuis |
| `fiscalite-quotient-familial-credit-enfant` | CONSERVÉ, **fragile** | non | non | satisfait de justesse : groupe LFI AS16 KNOWN niv. 3, Mélenchon PLAUSIBLE / Zemmour et Le Pen 2022 (renforcer le QF, incompatible avec son remplacement), DR PPL 3224 KNOWN niv. 3 | exact (CGI 197) | conservé | créé en v5 |
| `fiscalite-exit-tax-conservation-15-ans` | RÉVISÉ | oui | non | satisfait (revue n° 2) | exact après correction (CGI 167 bis, inchangé depuis le 01/01/2024) | **nouvel id** (ancien : `fiscalite-exit-tax-renforcee`) | la v1 visait « imposés plus lourdement », la v4 une durée d'imposition : trois propositions différentes |
| `immigration-asile-examen-sans-transfert` | RÉVISÉ | oui | non | satisfait : Mélenchon KNOWN (indirect), LFI CL13 / gouvernement, EPR ; aucun restrictif côté « d'accord » | exact ; **date corrigée : AMMR applicable depuis le 12/06/2026** | **nouvel id** (ancien : `immigration-asile-examen-en-france`) | la v4 portait sur le pays d'entrée, la v5 sur l'État responsable ; formulation recentrée sur le demandeur pour réduire la lecture souverainiste |
| `securite-supprimer-controles-preventifs` | CONSERVÉ | non | non | satisfait (revue n° 2) | exact (CPP 78-2 al. 8) | **nouvel id** (ancien : `securite-controles-identite-soupcon`) | la v1 réservait les contrôles aux suspects (suppression aussi des contrôles sur réquisition) ; l'énoncé ne vise plus que les contrôles préventifs |
| `securite-interdire-plaquage-ventral` | CONSERVÉ | non | non | satisfait : Mélenchon KNOWN niv. 1 / groupes LR et LREM 2020 KNOWN niv. 3 ; **aucun candidat** contre | exact (aucune interdiction en vigueur) | conservé | même proposition depuis la v1, décrite plus précisément |
| `securite-supprimer-bac` | CONSERVÉ | non | non | **renforcé** : Mélenchon KNOWN niv. 1 / Le Pen niv. 1 (X, 07/11/2026, via l'AFP, message original non lu), députés RN niv. 3 | exact | conservé | créé en v5 ; erreur d'attribution corrigée (QO 818 : député RN Weber, pas un ministre) |
| `institutions-dotations-conditionnees-etat` | **RETIRÉ : REJECT_C5_UNSUPPORTED** (et doute d'axe) | — | — | **non satisfait** : aucune preuve KNOWN de niveau candidat sur le mécanisme ; Cahors écarté (Philippe niv. 6, Lisnard via l'AMF niv. 5) | le mécanisme n'existe pas en droit : condition du PLF 2026 retirée (LF 2026, art. 195-196) ; proposition du Haut-commissariat au Plan seulement | retiré du corpus, texte conservé en commentaire YAML et dans le JSON | mesure surtout la discipline budgétaire ; ne pas le garder pour remplir le créneau |
| `institutions-maintenir-article-40` | RÉVISÉ | oui | non | satisfait (revue n° 2) : Roussel KNOWN niv. 2 / EPR, MoDem, Sénat niv. 3 | exact après correction (« charge », plus fidèle que « dépenses ») | conservé | même proposition (maintenir l'art. 40) ; précision juridique seulement |
| `democratie-champ-referendum-inchange` | RÉVISÉ | oui | non | satisfait (revue n° 2) | exact après correction : exemples retirés, « justice pénale » non établie par une décision | conservé | même proposition depuis la v1 (statu quo sur le champ) |
| `democratie-cours-criminelles-sans-jury` | **RETIRÉ : REJECT_OFF_AXIS** | — | — | satisfait (Mélenchon KNOWN / gouvernement, rapport Bordes-Mazars) | exact en première instance seulement (appel devant une cour d'assises avec jury) | retiré du corpus, texte conservé | le pôle « d'accord » est défendu au nom de l'efficacité, pas de la démocratie représentative ; risque d'anti-corrélation (RN) ; relève de l'organisation des tribunaux, et l'axe Justice (sévérité) ne convient pas non plus |
| `democratie-revision-par-congres` | CONSERVÉ, **signalé** | non | non | satisfait de justesse : Mélenchon KNOWN niv. 1, Dupont-Aignan PPLC 1618 niv. 2 / pôle « d'accord » indirect (amendement DR n° 45, Retailleau PLAUSIBLE) | exact (art. 89 al. 3) | conservé | créé en v5 ; apport propre défendable (sépare la gauche radicale et Dupont-Aignan du RN), mais chevauchement partiel avec `institutions-referendum-revision-constitution` (voir § 5) |
| `environnement-faciliter-derogation-especes` | CONSERVÉ | non | non | satisfait (revue n° 2) | exact (L411-2, L411-2-1) | **nouvel id** (ancien : `environnement-derogation-especes-protegees`) | la v4 visait l'assouplissement des conditions de fond, la v5 la facilité d'obtention en général |

**Bilan :**
- **13 conservés** : 8 sans changement de texte, 5 révisés. Parmi les 13, cinq ont un nouvel id.
- **2 retirés.**
- **4 créneaux vides** : Institutions « − » × 2 (SRU déjà vide, plus les dotations) et Démocratie « − » × 2 (4ᵉ créneau déjà vide, plus les cours criminelles).

### Textes révisés

| ID | Texte v5 | Texte final | Car. |
|---|---|---|---|
| `fiscalite-exit-tax-conservation-15-ans` | « …ne doit être annulé que si elle garde ses actions 15 ans, et non 2 ou 5. » | « Quand une personne quitte la France avec plus de 800 000 € d'actions, l'impôt sur ses plus-values déjà acquises au départ ne doit être effacé que si elle les garde 15 ans, contre 2 ou 5 aujourd'hui. » | 198 |
| `immigration-asile-examen-sans-transfert` | « La France doit examiner elle-même les demandes d'asile déposées sur son sol, au lieu de renvoyer… » | « Un demandeur d'asile présent en France doit pouvoir y faire examiner sa demande, au lieu d'être renvoyé vers le pays européen responsable selon les règles de l'Union. » | 166 |
| `institutions-maintenir-article-40` | « Seul le gouvernement, et non les parlementaires, doit continuer à pouvoir proposer des mesures qui augmentent les dépenses publiques. » | « Les députés et sénateurs doivent rester empêchés de proposer une mesure qui crée ou augmente une charge pour les finances publiques. » | 132 |
| `democratie-champ-referendum-inchange` | « Le référendum sur un projet de loi … comme la justice pénale ou les sujets de société. » | « Le référendum sur un texte de loi doit rester limité à ses sujets actuels (notamment institutions, politique économique, sociale ou environnementale), sans être étendu à tous les domaines de la loi. » | 198 |

### Raisonnement par point de la mission

**2.2 Exit tax.**
- La formulation proposée par la revue indépendante (« départs fiscaux », « dégrèvement… qu'après 15 ans ») **omet la condition de conservation des titres**. Le lecteur comprendrait que l'impôt s'efface après un délai, quoi qu'il arrive. Elle n'est pas retenue.
- Le texte final garde le mécanisme exact : impôt sur les plus-values latentes au départ, effacé seulement si les titres sont conservés.
- « au départ » exclut les plus-values en report, qui ne sont jamais dégrevées.
- « effacé » est retenu au lieu de « dégrevé » pour la compréhension du grand public. Le terme légal (dégrèvement, CGI 167 bis VII) et les conditions omises sont consignés dans l'annexe juridique :
  - le critère alternatif de 50 % ;
  - la résidence 6 ans sur 10 ;
  - le seuil de 2,57 M€ pour les 5 ans ;
  - le dégrèvement en cas de retour en France.
- « actions » au lieu de « titres » est une simplification tolérée.

**2.3 Article 40.**
- « charge pour les finances publiques » est fidèle à la « charge publique » de la Constitution, qui couvre toutes les administrations publiques et la simple faculté de dépenser, tout en restant compréhensible.
- La précision « même compensée par une économie » proposée en annexe n'est **pas** retenue : en loi de finances, les amendements de crédits peuvent redéployer entre programmes d'une même mission (LOLF art. 47), et la formule aurait été inexacte dans ce cas.
- Le volet « ressources » (baisse d'impôt gagée, admise) n'est pas visé : l'énoncé ne porte que sur les charges, sans rien affirmer de faux sur les ressources.

**3.1 Asile.**
- Les deux pôles correspondent bien à l'axe ouverture / restriction.
  - Les seuls acteurs qui veulent cesser les transferts le font au nom de l'accueil (LFI CL13, écologistes).
  - Le camp restrictif veut appliquer ou durcir les transferts, voire supprimer le dépôt en France (Le Pen 2022).
  - Aucun acteur restrictif ne demande à la France d'examiner toutes les demandes déposées chez elle.
- **Risque résiduel :** un répondant souverainiste pouvait lire « La France doit examiner elle-même » comme une affirmation de souveraineté. La reformulation centre l'énoncé sur le demandeur, en évitant « la France elle-même ».
- Pas de changement de thème. Ne jamais coder « contre le Pacte » comme un accord.

**3.2 Dotations.**
- Le seul mécanisme correspondant exactement à l'énoncé est une **proposition** du Haut-commissariat au Plan (note du 01/04/2026, bonus/malus sur les dotations de 215 collectivités).
- Le PLF 2026 initial conditionnait le reversement du DILICO à la maîtrise des dépenses ; la LF 2026 l'a rendu inconditionnel.
- Aucun candidat n'a de position KNOWN sur ce mécanisme : Retailleau (10 Md€ sur le fonctionnement des grandes collectivités, sans mécanisme) et Mélenchon (DGF indexée) restent PLAUSIBLE.
- Les positions observées suivent la discipline budgétaire, pas la répartition des pouvoirs : Retailleau associe la contrainte à davantage de décentralisation.
- Retrait : REJECT_C5_UNSUPPORTED, et axe douteux.

**3.3 Cours criminelles.**
- Le droit est confirmé :
  - loi n° 2026-651 du 23/07/2026, qui étend les CCD aux accusés en récidive légale et rien d'autre ;
  - CC 2026-909 DC, conformité sans réserve ;
  - appel devant une cour d'assises avec jury, sauf appel limité aux peines complémentaires.
- L'axe Démocratie (« participation des citoyens aux décisions ») couvre littéralement le jury, mais le pôle « d'accord » n'est défendu que par l'efficacité et les délais. Le RN (rapport Bordes-Mazars) se retrouve du côté « représentatif ».
- L'item mesurerait donc une préférence de politique judiciaire, pas l'axe Démocratie. Le thème Justice (organisation des tribunaux) n'a pas d'axe adapté non plus : son axe oppose sévérité et réinsertion.
- Retrait de Démocratie : REJECT_OFF_AXIS. S'il est repris un jour, il faudra écrire « en première instance ».

**3.4 Révision par le Congrès.**
- Il est distinct de l'item existant, qui porte sur **qui déclenche** une révision : le président, par référendum direct. Celui-ci porte sur **qui a le dernier mot** : le Parlement réuni en Congrès ou le peuple.
- Profils attendus :
  - **gauche radicale et Dupont-Aignan :** pro-référendum sur les deux items ;
  - **RN :** d'accord avec l'existant, non documenté sur le nouveau ;
  - **centre :** pro-représentatif sur les deux.
- Ce n'est pas un miroir. Il reste une double pondération partielle sur Démocratie, puisque l'item existant porte aussi le thème `democratie`.
- Conservé, avec un signalement (§ 5 et § 7).

**3.5 Champ du référendum.**
- CC 2026-7 RIP du 17/06/2026 exclut les questions de société (fin de vie). Aucune décision n'exclut la justice pénale.
- Les deux exemples sont retirés. Les matières principales de l'art. 11 sont données entre parenthèses, avec « notamment », parce que la liste n'est pas exhaustive (services publics, traités).
- « texte de loi » couvre le projet du gouvernement comme la proposition parlementaire du RIP.
- Le schéma ne prévoit pas d'aide contextuelle : si elle est ajoutée un jour, y préciser « article 11 de la Constitution ».

## 4. Registre juridique : corrections auditables

Les registres d'origine ne sont pas réécrits. Les corrections ci-dessous les **remplacent** pour la suite.

| # | Registre d'origine | Énoncé erroné | Correction | Source primaire | Vérifié le |
|---|---|---|---|---|---|
| J1 | revue n° 2, § C (IMM-1) ; `annexe-immigration-securite.md` | AMMR applicable « 1er juillet 2026 selon art. 85 » ; date « incertaine » ; « rectificatif du 18/09/2026 » | **Applicable depuis le 12/06/2026.** Le rectificatif n° 2 (CELEX 32024R1351R(02), JO L 2025/90929, publié le 25/11/2025) remplace la date aux art. 83, 84 § 1-3 et 85 al. 2. Les demandes enregistrées **avant le 12/06/2026** restent régies par les critères de Dublin III (art. 84 § 2 rectifié). Le rectificatif du 18/09/2026 (JO L 2026/90777) ne vise que les versions BG, GA, LT et ES. | http://data.europa.eu/eli/reg/2024/1351/corrigendum/2025-11-25/oj ; texte FR (Cellar) : https://publications.europa.eu/resource/cellar/463d41d1-c9d2-11f0-8da2-01aa75ed71a1.0009.03/DOC_1 | 2026-11-11 |
| J2 | revue n° 2, § C (INS-1) | « aucun mécanisme lié aux dépenses » | Le PLF 2026 initial conditionnait le reversement du DILICO à la maîtrise des dépenses ; la LF 2026 (loi n° 2026-103, art. 195-196) l'a rendu inconditionnel. Aucun mécanisme en vigueur au 11/11/2026. | Banque des Territoires (mise à jour du 22/04/2026), lien dans l'annexe lot A | 2026-11-11 |
| J3 | revue n° 2, § C (DEM-3 bis) | « CPP et décision CC non relus » | Loi 2026-651 et 2026-909 DC lues. Extension à la récidive légale seulement. Appel devant une cour d'assises avec jury. Texte consolidé de l'art. 380-16 toujours non lu. | https://www.legifrance.gouv.fr/jorf/id/JORFSCTA000054470586 ; https://www.conseil-constitutionnel.fr/decision/2026/2026909DC.htm | 2026-11-11 |
| J4 | revue n° 2, § B (DEM-2) | exemples « justice pénale ou sujets de société » | Sujets de société exclus (CC 2026-7 RIP, § 7). Justice pénale : seulement la doctrine. Exemples retirés du texte. | conseil-constitutionnel.fr, décision 2026-7 RIP (voir annexe juridique) | 2026-11-11 |
| J5 | revue n° 2, § B (FIS-3) | « l'impôt porte sur la plus-value latente… dégrevé » | Confirmé. Précision : le dégrèvement de 2 ou 5 ans ne vise que les plus-values latentes, pas les plus-values en report. CGI 167 bis inchangé par la LF 2026. Sort des amendements du PLF 2027 non vérifié. | Légifrance, CGI 167 bis (voir annexe juridique) | 2026-11-11 |
| J6 | revue n° 2, § B (INS-2) | « mesures qui augmentent les dépenses publiques » | « charge publique » (art. 40) : charges interdites même compensées, ressources compensables par un gage ; redéploiement de crédits possible au sein d'une mission (LOLF). | Constitution art. 40 ; CC 2006-544 DC (voir annexe juridique) | 2026-11-11 |

## 5. Preuves C5 : ce qui change

Le détail ligne par ligne est dans les annexes lots A et B. Chaque ligne y donne : pôle, acteur, niveau 1 à 6, statut, URL, citation, date de publication, date de vérification, ce que la source prouve et ce qu'elle ne prouve pas.

- **FIS-1 :** Attal passe de KNOWN à **PLAUSIBLE**. Le lien avec les allègements est fait par le journaliste, pas par Attal. Ruffin (AS3369, 2023) s'ajoute au pôle « d'accord ». Le RN est mixte : Le Pen n'est pas à coder « contre ».
- **SEC-3 bis :** Le Pen (07/11/2026) devient la première preuve candidat du pôle « pas d'accord ». La citation est partielle et rapportée par l'AFP ; le message original sur X n'a pas été lu. La « question du ministre Berger » était la question orale n° 818 du député RN Frédéric Weber.
- **INS-1 :** les preuves de Cahors (Philippe niv. 6, Lisnard via l'AMF niv. 5) sont **écartées**, car elles portent sur un autre mécanisme. Voir le retrait.
- **ECO-1 :** citations de l'AEC 2027 relues ; le « 100 % publique » cité par la revue n° 2 venait d'une édition antérieure. Lisnard (contrat So'EAU, filiale de Suez, 2023, niv. 6) entre au pôle « pas d'accord » comme acte, pas comme préférence actuelle.
- **FIS-2 :** l'AEC 2027 ne mentionne **pas** le quotient familial. Le remplacement n'est explicite qu'au niveau du groupe LFI (AS16). Zemmour et Le Pen (2022) veulent renforcer le QF, ce qui est incompatible avec son remplacement, mais c'est daté. Il faut une déclaration de 2025-2026 avant activation.
- **SEC-2 :** les groupes LR et LREM se sont explicitement opposés à l'interdiction (rapport n° 2741, 2020). Aucun candidat n'est trouvé au pôle « pas d'accord » : Retailleau, Le Pen et Zemmour sont NOT_FOUND.
- **DEM-3 bis :** Mélenchon (AEC 2027 : « supprimer les cours criminelles sans jurés ») a été manqué par la revue n° 2. Cela ne change pas le retrait, motivé par l'axe.
- **DEM-4 bis :** Dupont-Aignan (PPLC 1618, art. 8, 2019, seul auteur) entre au pôle « pas d'accord » : l'item ne se réduit pas à LFI. Le pôle « d'accord » reste indirect : amendement DR n° 45 et Retailleau PLAUSIBLE.

**Asymétrie persistante :** le pôle « contre » reste rarement prouvé au niveau candidat, à droite comme au centre. C'est le cas de FIS-1, FIS-2, SEC-2 et DEM-4 bis.

## 6. FR-012 recalculé

Le calcul part du corpus après correction. Définitions :
- **active** : `status: active` ;
- **validée** : gardée en première passe, avec `neutralityChecklist`, mais `draft` ;
- **en attente** : seconde passe `PENDING_HUMAN_VALIDATION` ;
- **ajouts** : les 13 énoncés de ce rapport, `draft`.

**Questions actives : 0 dans chaque thème.** Aucun thème n'est conforme aujourd'hui (il faut ≥ 10 actives et 40-60 % de « + »).

Projections **hypothétiques** (rien n'est actif ni validé par adrien) :

| Thème | Validées seules | Validées + ajouts | + seconde passe (sans ajouts) | Tout | Manque |
|---|---|---|---|---|---|
| Économie | 3+/7− (30 %) non | 5+/7− (42 %) **oui** | 8+/9− (47 %) oui | 10+/9− (53 %) oui | — |
| Fiscalité | 3+/8− (27 %) non | 6+/8− (43 %) **oui** | 8+/10− (44 %) oui | 11+/10− (52 %) oui | — |
| Immigration | 3+/6− (33 %) non (n = 9) | 4+/6− (40 %) **oui, limite** | 8+/8− (50 %) oui | 9+/8− (53 %) oui | — |
| Sécurité | 8+/3− (73 %) non | 8+/6− (57 %) **oui** | 8+/5− (62 %) non | 8+/8− (50 %) oui | — |
| Institutions | 8+/3− (73 %) non | 8+/4− (67 %) **non** | 10+/5− (67 %) non | 10+/6− (62,5 %) **non** | **au moins 1 « − »** même avec toute la seconde passe (2 si l'on s'en tient aux validées + ajouts) |
| Démocratie | 8+/2− (80 %) non | 8+/4− (67 %) **non** | 9+/8− (53 %) oui | 9+/10− (47 %) oui | 2 « − » sans la seconde passe |
| Environnement | 8+/5− (62 %) non | 8+/6− (57 %) **oui** | 9+/6− (60 %) oui | 9+/7− (56 %) oui | — |

Changements par rapport à la revue n° 2 :
- **Institutions** devient non conforme **dans tous les scénarios** : sans les dotations, il manque un « − », même avec toute la seconde passe.
- **Démocratie** reste conforme seulement avec la seconde passe.
- Économie, Fiscalité, Immigration, Sécurité et Environnement restent conformes à condition que tous leurs ajouts soient validés. Le rejet d'un seul ajout les fait basculer, Immigration étant à la limite.

Aucun créneau n'a été rempli pour atteindre le seuil.

## 7. Points ouverts

**Décisions pour adrien :**
1. Valider ou rejeter les 13 énoncés.
2. Chevauchement des items sur la révision de la Constitution : retirer `democratie` des thèmes de `institutions-referendum-revision-constitution`, qui mesure surtout le pouvoir présidentiel, ou accepter la double pondération partielle. Rien n'est fait ici : la question existante est hors périmètre.
3. Institutions « − » : chercher un énoncé valide sur la concentration du pouvoir, ou accepter la non-conformité.

**Preuves manquantes :**
- pôle « contre » au niveau candidat pour FIS-1, FIS-2, SEC-2 et DEM-4 bis ;
- position actuelle (2025-2026) de Zemmour et Le Pen sur le quotient familial ;
- message original de Le Pen sur X (07/11/2026).

**Sources non vérifiées :**
- texte consolidé de l'art. 380-16 CPP ;
- sort des amendements du PLF 2027 sur l'exit tax ;
- livret de Tondelier sur l'eau ;
- sources primaires de Lisnard et Philippe sur le quotient familial ;
- programme 2027 d'Asselineau sur upr.fr ;
- rectificatifs des autres règlements du Pacte (autres que 2024/1348).

**À revérifier avant activation :**
- loyers, après le 18/11 et l'échéance des 23-24/11 ;
- exit tax, quotient familial et allègements, après les lois de finances et de financement de la sécurité sociale pour 2027 ;
- asile, quand les ordonnances du PJL 2820 seront prises.

**Compatibilité :** aucun risque aujourd'hui. Si une question est publiée puis modifiée au-delà d'une correction typographique, FR-011 imposera un nouvel id et le passage de l'ancien en `retired`. Un champ `supersedes` dans le schéma, s'il est souhaité, relève d'une PR de code distincte.

## 8. Vérifications

| Commande | Résultat |
|---|---|
| `pnpm data:validate </dev/null` | Corpus conforme : 0 violation ; 18 avertissements (THEME-EMPTY 17, BANK-SIZE 1). |
| `pnpm test </dev/null` | 958 tests réussis, 1 échec, 1 ignoré. L'échec est `src/core/codec/codec.test.ts`, test « mutations » : 5471 ms pour une limite de 5000 ms sous charge. Relancé seul (`pnpm vitest run src/core/codec/codec.test.ts`) : 31/31 réussis. Le test ne lit pas le corpus. |
| Contrôle ad hoc (Python) | 297 questions, 0 doublon d'id, 0 texte de plus de 200 caractères, 0 polarité invalide, 0 question non `draft` ; aucun ancien id référencé hors de `data/relectures/`. |
| Non exécuté | `pnpm verify` complet (lint, typecheck, Storybook, build, e2e) : aucun code n'est modifié. Aucun test ajouté : aucun comportement de code ne change, et la PR de données doit rester distincte des PR de code (FR-041). |

**Diff :**
- 7 fichiers YAML modifiés :
  - 2 entrées retirées, avec un commentaire de traçabilité ;
  - 5 identifiants renommés ;
  - 4 textes révisés ;
  - une référence à ce rapport sur les 13 entrées gardées.
- Nouveaux fichiers : ce rapport, son JSON et trois annexes.
- Le rapport de la revue n° 2 et ses annexes ne sont pas modifiés.
