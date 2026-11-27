# Glossaire : dossier de relecture (spec 009)

- **Date** : 2026-11-22
- **Auteur** : claude (proposition)
- **Relecteur** : adrien
- **Statut** : à relire

Inventaire initial du glossaire (spec 009, FR-022, R13). L'agent a parcouru les énoncés des 310 questions actives du corpus (la banque active de la v5 n'est pas encore publiée) et repéré les sigles, dispositifs, prestations, procédures et notions juridiques. Pour chaque terme retenu, une source institutionnelle a été ouverte et lue le 2026-11-22, et la définition rédigée à partir de cette source : factuelle, neutre, sans candidat, parti ni chiffre polémique, d'au plus 280 caractères.

**36 termes retenus**, dont « aide médicale de l'État » et « droit du sol » (SC-007), tous écrits dans `data/corpus/glossaire.yaml` avec `status: draft` et `author: claude`. **Termes écartés** : voir la section 2.

**Comment relire** : pour chaque terme de la section 1, cocher « définition validée » ou indiquer la correction (définition, formes, source). Un terme validé passe ensuite à `status: reviewed`, `reviewedBy: adrien`, `reviewedAt: <date>` (fait par adrien ou à sa demande, jamais par l'agent seul), puis `pnpm data:glossary` publie `public/data/glossary.json`. Pour la section 2, indiquer les termes à réintégrer.

**Points d'attention pour la relecture** :

- `referendum-initiative-partagee` : la page Vie-publique citée mentionne le cinquième des parlementaires et l'article 11 ; le seuil d'un dixième des électeurs inscrits est confirmé indirectement par la seconde source (plus de 4,7 millions de soutiens nécessaires pour le RIP ADP). Une source plus directe (Conseil constitutionnel) n'a pas pu être ouverte.
- `ordonnance` : seule la forme « ordonnances » est repérée ; la forme au singulier signalerait « médicaments sans ordonnance » (énoncé `sante-medicaments-grandes-surfaces`), qui désigne une prescription médicale.
- `congres` : la forme « Congrès » n'apparaît que dans `democratie-revision-par-congres`.
- `majorite-qualifiee` : définition propre au Conseil de l'Union européenne, seul sens employé par l'énoncé concerné.
- `delai-de-carence` : la durée de trois jours vaut pour les salariés du secteur privé (source ameli) ; les règles de la fonction publique diffèrent et ne sont pas détaillées.
- `peines-minimales` : la définition rappelle qu'elles ont été supprimées en 2014 ; l'énoncé propose de les « rétablir ».
- Les URL `service-public.fr` redirigent vers `service-public.gouv.fr` : les sources citent l'adresse finale (domaine `*.gouv.fr` de `institutionalDomains`).

## 1. Termes retenus (36)

### 1. aide médicale de l'État (AME) (`aide-medicale-etat`)

- **Formes repérées** : « aide médicale de l'État », « aide médicale d'État », « AME »
- **Définition** (196 caractères) : Dispositif qui permet aux étrangers en situation irrégulière résidant en France depuis plus de trois mois d'accéder aux soins sans avancer les frais, sous conditions de résidence et de ressources.
- **Source** : [Qu'est-ce que l'aide médicale de l'État (AME) ?](https://www.service-public.gouv.fr/particuliers/vosdroits/F3079) — Service-Public.fr, consultée le 2026-11-22
- **Énoncés concernés** :
  - `immigration-ame-soins-urgents` : L'aide médicale d'État doit être limitée aux soins urgents.

- [ ] définition validée

### 2. droit du sol (`droit-du-sol`)

- **Formes repérées** : « droit du sol »
- **Définition** (235 caractères) : Principe qui permet d'attribuer la nationalité française en raison de la naissance d'un enfant en France, et éventuellement de celle d'un de ses parents. Le droit français le combine avec le droit du sang, qui l'attribue par filiation.
- **Source 1** : [Nationalité française : le droit du sol en quatre questions](https://www.vie-publique.fr/questions-reponses/297250-nationalite-francaise-le-droit-du-sol-en-quatre-questions) — Vie-publique.fr, consultée le 2026-11-22
- **Source 2** : [Nationalité française d'un enfant né en France de parents étrangers](https://www.service-public.gouv.fr/particuliers/vosdroits/F295) — Service-Public.fr, consultée le 2026-11-22
- **Énoncés concernés** :
  - `immigration-supprimer-droit-du-sol` : Le droit du sol doit être supprimé pour l'acquisition de la nationalité française.

- [ ] définition validée

### 3. article 49.3 de la Constitution (`article-49-3`)

- **Formes repérées** : « article 49.3 », « 49.3 »
- **Définition** (212 caractères) : Procédure par laquelle le Premier ministre engage la responsabilité du Gouvernement sur un texte : celui-ci est considéré comme adopté sans vote, sauf si une motion de censure est votée par l'Assemblée nationale.
- **Source** : [Le recours à l'article 49.3 de la Constitution : dans quels cas ?](https://www.vie-publique.fr/fiches/19494-le-recours-larticle-493-de-la-constitution) — Vie-publique.fr, consultée le 2026-11-22
- **Énoncés concernés** :
  - `institutions-supprimer-49-3` : Le recours à l'article 49.3 de la Constitution doit être supprimé.

- [ ] définition validée

### 4. référendum d'initiative partagée (RIP) (`referendum-initiative-partagee`)

- **Formes repérées** : « référendum d'initiative partagée »
- **Définition** (256 caractères) : Procédure prévue par l'article 11 de la Constitution : une proposition de loi portée par un cinquième des parlementaires peut être soumise à référendum si elle recueille le soutien d'un dixième des électeurs inscrits et n'est pas examinée par le Parlement.
- **Source 1** : [Le Conseil constitutionnel rejette une proposition de loi relative aux prestations sociales des étrangers](https://www.vie-publique.fr/en-bref/293835-conseil-constitutionnel-rejet-du-rip-prestations-sociales-etrangers) — Vie-publique.fr, consultée le 2026-11-22
- **Source 2** : [Clôture du référendum d'initiative partagée sur la privatisation d'ADP](https://www.vie-publique.fr/en-bref/273802-cloture-du-referendum-dinitiative-partagee-sur-la-privatisation-dadp) — Vie-publique.fr, consultée le 2026-11-22
- **Énoncés concernés** :
  - `democratie-seuil-rip-maintenu-v2` : Le seuil de soutien d'un dixième des électeurs inscrits doit être maintenu pour déclencher un référendum d'initiative partagée.

- [ ] définition validée

### 5. Conseil économique, social et environnemental (CESE) (`cese`)

- **Formes repérées** : « Conseil économique, social et environnemental », « CESE »
- **Définition** (216 caractères) : Assemblée consultative instituée par la Constitution, composée de représentants d'organisations professionnelles et associatives, qui conseille les pouvoirs publics en matière économique, sociale et environnementale.
- **Source** : [Quel est le rôle du Conseil économique, social et environnemental ?](https://www.vie-publique.fr/fiches/19574-quel-est-le-role-du-conseil-economique-social-et-environnemental-cese) — Vie-publique.fr, consultée le 2026-11-22
- **Énoncés concernés** :
  - `democratie-supprimer-cese` : Le Conseil économique, social et environnemental doit être supprimé.

- [ ] définition validée

### 6. Commission nationale du débat public (CNDP) (`cndp`)

- **Formes repérées** : « Commission nationale du débat public », « CNDP »
- **Définition** (198 caractères) : Autorité administrative indépendante chargée de veiller à la participation du public à l'élaboration des grands projets d'aménagement ou d'équipement, notamment par l'organisation de débats publics.
- **Source** : [Le rôle de la Commission nationale du débat public (CNDP) en six questions](https://www.vie-publique.fr/questions-reponses/286893-la-commission-nationale-du-debat-public-cndp-en-6-questions) — Vie-publique.fr, consultée le 2026-11-22
- **Énoncés concernés** :
  - `democratie-supprimer-cndp` : La Commission nationale du débat public doit être supprimée.

- [ ] définition validée

### 7. ordonnance (`ordonnance`)

- **Formes repérées** : « ordonnances »
- **Définition** (216 caractères) : Texte pris par le Gouvernement dans un domaine qui relève normalement de la loi, après autorisation du Parlement (article 38 de la Constitution). Il peut acquérir valeur législative s'il est ratifié par le Parlement.
- **Source** : [Qu'est-ce qu'une ordonnance ?](https://www.vie-publique.fr/fiches/20262-quest-ce-quune-ordonnance) — Vie-publique.fr, consultée le 2026-11-22
- **Note** : Forme au singulier volontairement absente, pour ne pas signaler « médicaments sans ordonnance » (prescription médicale).
- **Énoncés concernés** :
  - `institutions-ordonnances-elargies` : Le gouvernement doit pouvoir légiférer plus largement par ordonnances.

- [ ] définition validée

### 8. scrutin proportionnel (`scrutin-proportionnel`)

- **Formes repérées** : « scrutin proportionnel »
- **Définition** (216 caractères) : Mode de scrutin de liste dans lequel les sièges sont répartis entre les listes en fonction du nombre de voix obtenues par chacune, à la différence du scrutin majoritaire, qui élit le ou les candidats arrivés en tête.
- **Source** : [Quels sont les différents modes de scrutin ?](https://www.vie-publique.fr/fiches/23948-quels-sont-les-differents-modes-de-scrutin) — Vie-publique.fr, consultée le 2026-11-22
- **Énoncés concernés** :
  - `institutions-proportionnelle-legislatives` : Les députés doivent être élus au scrutin proportionnel.

- [ ] définition validée

### 9. vote blanc (`vote-blanc`)

- **Formes repérées** : « vote blanc »
- **Définition** (196 caractères) : Vote qui consiste à déposer dans l'urne une enveloppe vide ou contenant un bulletin vierge. Depuis 2014, les votes blancs sont décomptés à part, mais ils n'entrent pas dans les suffrages exprimés.
- **Source** : [Vote blanc, vote nul : quelles différences ?](https://www.vie-publique.fr/fiches/23931-vote-blanc-vote-nul-quelles-differences) — Vie-publique.fr, consultée le 2026-11-22
- **Énoncés concernés** :
  - `democratie-vote-blanc-exprime` : Le vote blanc doit être pris en compte dans les suffrages exprimés.

- [ ] définition validée

### 10. suffrages exprimés (`suffrages-exprimes`)

- **Formes repérées** : « suffrages exprimés »
- **Définition** (112 caractères) : Votes retenus pour calculer le résultat d'une élection. Les votes blancs et les votes nuls n'en font pas partie.
- **Source** : [Vote blanc, vote nul : quelles différences ?](https://www.vie-publique.fr/fiches/23931-vote-blanc-vote-nul-quelles-differences) — Vie-publique.fr, consultée le 2026-11-22
- **Énoncés concernés** :
  - `democratie-vote-blanc-exprime` : Le vote blanc doit être pris en compte dans les suffrages exprimés.

- [ ] définition validée

### 11. majorité qualifiée (Union européenne) (`majorite-qualifiee`)

- **Formes repérées** : « majorité qualifiée »
- **Définition** (176 caractères) : Règle de vote du Conseil de l'Union européenne : une décision est adoptée si elle réunit au moins 55 % des États membres représentant au moins 65 % de la population de l'Union.
- **Source** : [Comment est organisé le vote à la majorité qualifiée au sein du Conseil de l'UE ?](https://www.vie-publique.fr/fiches/20348-le-vote-la-majorite-qualifiee-au-sein-du-conseil-de-lue) — Vie-publique.fr, consultée le 2026-11-22
- **Énoncés concernés** :
  - `international-majorite-qualifiee-ue` : La France doit accepter que davantage de décisions soient prises à la majorité qualifiée au sein de l'Union européenne.

- [ ] définition validée

### 12. Congrès du Parlement (`congres`)

- **Formes repérées** : « Congrès »
- **Définition** (149 caractères) : Réunion de l'ensemble des députés et des sénateurs, à Versailles, notamment pour adopter une révision de la Constitution sans recourir au référendum.
- **Source** : [Qu'est-ce que le Congrès du Parlement ?](https://www.vie-publique.fr/fiches/19595-quest-ce-que-le-congres) — Vie-publique.fr, consultée le 2026-11-22
- **Énoncés concernés** :
  - `democratie-revision-par-congres` : Une révision de la Constitution doit pouvoir continuer à être adoptée par le Parlement réuni en Congrès, sans référendum.

- [ ] définition validée

### 13. gestation pour autrui (GPA) (`gestation-pour-autrui`)

- **Formes repérées** : « gestation pour autrui », « GPA »
- **Définition** (168 caractères) : Pratique par laquelle une femme porte un enfant pour le compte d'un couple ou d'une personne, à qui l'enfant est remis après sa naissance. Elle est interdite en France.
- **Source** : [Gestation pour autrui (GPA) : quelles sont les évolutions du droit ?](https://www.vie-publique.fr/eclairage/18636-gestation-pour-autrui-gpa-quelles-sont-les-evolutions-du-droit) — Vie-publique.fr, consultée le 2026-11-22
- **Énoncés concernés** :
  - `societe-gpa-interdite-v2` : La gestation pour autrui doit être interdite en France.

- [ ] définition validée

### 14. procréation médicalement assistée (PMA) (`procreation-medicalement-assistee`)

- **Formes repérées** : « PMA », « procréation médicalement assistée »
- **Définition** (219 caractères) : Ensemble de techniques médicales, aussi appelées assistance médicale à la procréation (AMP), qui permettent à un couple formé d'un homme et d'une femme, à un couple de femmes ou à une femme non mariée d'avoir un enfant.
- **Source** : [Procréation médicalement assistée (PMA)](https://www.service-public.gouv.fr/particuliers/vosdroits/F31462) — Service-Public.fr, consultée le 2026-11-22
- **Énoncés concernés** :
  - `societe-pma-post-mortem` : Une femme doit pouvoir poursuivre une PMA avec les gamètes de son conjoint décédé.

- [ ] définition validée

### 15. dissuasion nucléaire (`dissuasion-nucleaire`)

- **Formes repérées** : « dissuasion nucléaire »
- **Définition** (221 caractères) : Stratégie qui vise à protéger un État contre toute agression d'origine étatique contre ses intérêts vitaux, en faisant redouter à l'agresseur potentiel des dommages inacceptables, grâce à la possession d'armes nucléaires.
- **Source** : [Armée, dissuasion nucléaire, Europe de la défense... L'essentiel en 10 questions-réponses](https://www.vie-publique.fr/questions-reponses/284126-armee-dissuasion-nucleaire-europe-de-la-defense-en-10-questions) — Vie-publique.fr, consultée le 2026-11-22
- **Énoncés concernés** :
  - `defense-renoncer-modernisation-dissuasion` : La France doit renoncer à moderniser sa dissuasion nucléaire.
  - `defense-dissuasion-protection-europe-v2` : La France doit étendre explicitement sa doctrine de dissuasion nucléaire à la protection de ses partenaires européens.

- [ ] définition validée

### 16. peines minimales (peines planchers) (`peines-minimales`)

- **Formes repérées** : « peines minimales », « peines planchers »
- **Définition** (169 caractères) : Peines qu'un juge doit prononcer au minimum pour certaines infractions commises en récidive, sauf décision motivée. Instaurées en 2007, elles ont été supprimées en 2014.
- **Source** : [Principales, complémentaires, automatiques... Que sont les peines en droit pénal ?](https://www.vie-publique.fr/questions-reponses/296120-les-peines-en-droit-penal-le-point-en-cinq-questions) — Vie-publique.fr, consultée le 2026-11-22
- **Énoncés concernés** :
  - `justice-peines-minimales-recidive` : Des peines minimales doivent être rétablies pour les récidivistes.

- [ ] définition validée

### 17. comparution immédiate (`comparution-immediate`)

- **Formes repérées** : « comparution immédiate »
- **Définition** (178 caractères) : Procédure pénale qui permet de faire juger par le tribunal correctionnel, dès la fin de sa garde à vue et sous certaines conditions, une personne poursuivie pour certains délits.
- **Source** : [Comparution immédiate : une procédure pénale de plus en plus utilisée](https://www.vie-publique.fr/eclairage/297540-comparution-immediate-procedure-penale-rapide-justice-expeditive) — Vie-publique.fr, consultée le 2026-11-22
- **Énoncés concernés** :
  - `justice-comparution-immediate-mineurs` : Les mineurs de plus de 16 ans doivent pouvoir être jugés en comparution immédiate.

- [ ] définition validée

### 18. espace Schengen (`espace-schengen`)

- **Formes repérées** : « espace Schengen »
- **Définition** (231 caractères) : Espace de libre circulation des personnes entre les États signataires de l'accord de Schengen, sans contrôle systématique aux frontières intérieures. Il regroupe la plupart des États de l'Union européenne et quelques États voisins.
- **Source** : [Espace Schengen : le point en 8 questions-réponses](https://www.vie-publique.fr/questions-reponses/269481-lespace-schengen-en-8-questions-reponses) — Vie-publique.fr, consultée le 2026-11-22
- **Énoncés concernés** :
  - `international-controles-frontieres-schengen` : La France doit rétablir durablement des contrôles à toutes ses frontières intérieures de l'espace Schengen.

- [ ] définition validée

### 19. Cour européenne des droits de l'homme (CEDH) (`cour-europeenne-droits-homme`)

- **Formes repérées** : « Cour européenne des droits de l'homme », « CEDH »
- **Définition** (246 caractères) : Juridiction du Conseil de l'Europe, siégeant à Strasbourg, qui juge les requêtes dénonçant la violation par un État des droits garantis par la Convention européenne des droits de l'homme. Elle est distincte des institutions de l'Union européenne.
- **Source** : [Le recours individuel devant la CEDH en cinq questions](https://www.vie-publique.fr/questions-reponses/282289-le-recours-individuel-devant-la-cedh-en-5-questions) — Vie-publique.fr, consultée le 2026-11-22
- **Énoncés concernés** :
  - `international-arrets-cedh-derogation-v2` : La France doit pouvoir ne pas exécuter certains arrêts de la Cour européenne des droits de l'homme.

- [ ] définition validée

### 20. SMIC (salaire minimum interprofessionnel de croissance) (`smic`)

- **Formes repérées** : « SMIC », « Smic », « salaire minimum interprofessionnel de croissance »
- **Définition** (141 caractères) : Montant légal minimum de salaire brut horaire que doit percevoir chaque salarié, sauf dispositions particulières (salariés mineurs, Mayotte).
- **Source** : [Smic (salaire minimum interprofessionnel de croissance)](https://www.service-public.gouv.fr/particuliers/vosdroits/F2300) — Service-Public.fr, consultée le 2026-11-22
- **Énoncés concernés** :
  - `travail-smic-au-dela-inflation` : Le SMIC doit être augmenté au-delà de l'inflation.
  - `travail-smic-regional` : Le SMIC doit pouvoir varier selon les régions.

- [ ] définition validée

### 21. regroupement familial (`regroupement-familial`)

- **Formes repérées** : « regroupement familial »
- **Définition** (210 caractères) : Procédure qui permet à un étranger non européen résidant régulièrement en France, sous conditions de durée de séjour, de ressources et de logement, de faire venir son époux ou son épouse et ses enfants mineurs.
- **Source** : [Regroupement familial](https://www.service-public.gouv.fr/particuliers/vosdroits/F11166) — Service-Public.fr, consultée le 2026-11-22
- **Énoncés concernés** :
  - `immigration-regroupement-familial-ressources` : Le regroupement familial doit être soumis à des conditions de ressources plus strictes.

- [ ] définition validée

### 22. naturalisation (`naturalisation`)

- **Formes repérées** : « naturalisation »
- **Définition** (192 caractères) : Procédure d'acquisition de la nationalité française par décret, à la demande d'un étranger qui remplit des conditions fixées par la loi, dont, sauf exceptions, cinq ans de résidence en France.
- **Source** : [Naturalisation française par décret](https://www.service-public.gouv.fr/particuliers/vosdroits/F2213) — Service-Public.fr, consultée le 2026-11-22
- **Énoncés concernés** :
  - `immigration-reduire-duree-naturalisation` : La durée de résidence exigée pour demander la naturalisation doit être réduite.

- [ ] définition validée

### 23. quotient familial (`quotient-familial`)

- **Formes repérées** : « quotient familial »
- **Définition** (218 caractères) : Mécanisme de l'impôt sur le revenu qui tient compte de la composition du foyer : le revenu est réparti en parts (deux pour un couple marié ou pacsé, plus pour les personnes à charge), et l'avantage obtenu est plafonné.
- **Source** : [Impôt sur le revenu - Quotient familial d'un couple marié ou pacsé](https://www.service-public.gouv.fr/particuliers/vosdroits/F2705) — Service-Public.fr, consultée le 2026-11-22
- **Énoncés concernés** :
  - `fiscalite-quotient-familial-credit-enfant` : Le quotient familial doit être remplacé par un crédit d'impôt du même montant pour chaque enfant, quel que soit le revenu des parents.

- [ ] définition validée

### 24. droits de succession (`droits-de-succession`)

- **Formes repérées** : « droits de succession »
- **Définition** (166 caractères) : Impôt dû par les héritiers sur les biens reçus d'une personne décédée. Son montant dépend du lien avec le défunt, qui détermine l'abattement et le barème applicables.
- **Source** : [Droits de succession - Évaluation de la succession et calcul des droits](https://www.service-public.gouv.fr/particuliers/vosdroits/F14198) — Service-Public.fr, consultée le 2026-11-22
- **Énoncés concernés** :
  - `fiscalite-reduire-droits-succession` : Les droits de succession doivent être réduits pour les transmissions familiales.
  - `societe-succession-couples-non-maries` : Les couples non mariés doivent bénéficier des mêmes droits de succession que les couples mariés.

- [ ] définition validée

### 25. impôt sur la fortune immobilière (IFI) (`impot-fortune-immobiliere`)

- **Formes repérées** : « impôt sur la fortune immobilière », « IFI »
- **Définition** (141 caractères) : Impôt annuel dû par les personnes dont le patrimoine immobilier net, détenu directement ou indirectement au 1er janvier, dépasse 1 300 000 €.
- **Source** : [Impôt sur la fortune immobilière (IFI) : personnes et biens concernés](https://www.service-public.gouv.fr/particuliers/vosdroits/F563) — Service-Public.fr, consultée le 2026-11-22
- **Énoncés concernés** :
  - `fiscalite-supprimer-ifi` : L'impôt sur la fortune immobilière doit être supprimé.

- [ ] définition validée

### 26. contribution sociale généralisée (CSG) (`contribution-sociale-generalisee`)

- **Formes repérées** : « contribution sociale généralisée », « CSG »
- **Définition** (223 caractères) : Prélèvement destiné à financer la protection sociale, opéré sur les revenus d'activité (salaires, revenus des indépendants) et sur les revenus de remplacement (allocations chômage, pensions), ainsi que sur d'autres revenus.
- **Source** : [CSG et CRDS sur les revenus d'activité et de remplacement](https://www.service-public.gouv.fr/particuliers/vosdroits/F2971) — Service-Public.fr, consultée le 2026-11-22
- **Énoncés concernés** :
  - `fiscalite-csg-progressive-v2` : Le taux de la contribution sociale généralisée (CSG) doit augmenter avec le revenu.

- [ ] définition validée

### 27. zone tendue (`zone-tendue`)

- **Formes repérées** : « zones tendues », « zone tendue »
- **Définition** (202 caractères) : Commune où l'offre de logements est insuffisante par rapport à la demande. Le loyer y est encadré lors d'un changement de locataire et, dans certaines grandes villes, plafonné par un loyer de référence.
- **Source** : [En quoi consiste l'encadrement des loyers à respecter en zone tendue ?](https://www.service-public.gouv.fr/particuliers/vosdroits/F1314) — Service-Public.fr, consultée le 2026-11-22
- **Énoncés concernés** :
  - `economie-plafonnement-loyers-zones-tendues` : Le plafonnement du niveau des loyers doit être obligatoire dans toutes les zones où le logement manque (zones tendues), même si les élus locaux ne le demandent pas.

- [ ] définition validée

### 28. conseil de prud'hommes (`conseil-prudhommes`)

- **Formes repérées** : « prud'hommes », « conseil de prud'hommes »
- **Définition** (120 caractères) : Juridiction qui règle les litiges individuels entre un employeur et un salarié nés à l'occasion d'un contrat de travail.
- **Source** : [Saisir le conseil de prud'hommes (CPH)](https://www.service-public.gouv.fr/particuliers/vosdroits/F2360) — Service-Public.fr, consultée le 2026-11-22
- **Énoncés concernés** :
  - `travail-plafond-prudhommes-maintenu-v2` : Le barème légal plafonnant les indemnités accordées par les prud'hommes en cas de licenciement sans cause réelle et sérieuse doit être maintenu.

- [ ] définition validée

### 29. livret A (`livret-a`)

- **Formes repérées** : « livret A »
- **Définition** (149 caractères) : Placement d'épargne réglementé, disponible à tout moment et non imposé, dont le taux d'intérêt est fixé par l'État et le montant des dépôts plafonné.
- **Source** : [Livret A](https://www.service-public.gouv.fr/particuliers/vosdroits/F2365) — Service-Public.fr, consultée le 2026-11-22
- **Énoncés concernés** :
  - `defense-livret-a-industrie-defense` : L'épargne du livret A doit pouvoir financer l'industrie de défense.

- [ ] définition validée

### 30. franchise médicale (`franchise-medicale`)

- **Formes repérées** : « franchises médicales », « franchise médicale »
- **Définition** (178 caractères) : Somme déduite des remboursements de l'Assurance maladie sur les médicaments, les actes paramédicaux et les transports sanitaires, dans la limite d'un plafond annuel par personne.
- **Source** : [La franchise médicale](https://www.ameli.fr/assure/remboursements/reste-charge/franchise-medicale) — ameli.fr, consultée le 2026-11-22
- **Énoncés concernés** :
  - `sante-hausse-franchises-medicales` : Les franchises médicales payées par les patients doivent être augmentées.

- [ ] définition validée

### 31. indemnités journalières (`indemnites-journalieres`)

- **Formes repérées** : « indemnités journalières »
- **Définition** (150 caractères) : Sommes versées par l'Assurance maladie pendant un arrêt de travail pour compenser en partie la perte de salaire, en général après un délai de carence.
- **Source** : [Arrêt de travail pour maladie : les indemnités journalières du salarié](https://www.ameli.fr/assure/remboursements/indemnites-journalieres-maladie-maternite-paternite/indemnites-journalieres-pour-maladie/arret-maladie-salarie) — ameli.fr, consultée le 2026-11-22
- **Énoncés concernés** :
  - `sante-reduire-indemnites-arret-maladie` : Les indemnités journalières versées pendant un arrêt maladie doivent être réduites.

- [ ] définition validée

### 32. délai de carence (`delai-de-carence`)

- **Formes repérées** : « jours de carence », « délai de carence »
- **Définition** (178 caractères) : Premiers jours d'un arrêt maladie pendant lesquels les indemnités journalières de l'Assurance maladie ne sont pas versées. Il est de trois jours pour un salarié du secteur privé.
- **Source 1** : [Arrêt de travail pour maladie : les indemnités journalières du salarié](https://www.ameli.fr/assure/remboursements/indemnites-journalieres-maladie-maternite-paternite/indemnites-journalieres-pour-maladie/arret-maladie-salarie) — ameli.fr, consultée le 2026-11-22
- **Source 2** : [Arrêt maladie : indemnités journalières versées au salarié](https://www.service-public.gouv.fr/particuliers/vosdroits/F3053) — Service-Public.fr, consultée le 2026-11-22
- **Énoncés concernés** :
  - `travail-augmenter-jours-carence` : Le nombre de jours de carence en cas d'arrêt maladie doit être augmenté.

- [ ] définition validée

### 33. produit intérieur brut (PIB) (`produit-interieur-brut`)

- **Formes repérées** : « PIB », « produit intérieur brut »
- **Définition** (187 caractères) : Indicateur qui mesure la richesse créée par l'ensemble des agents, privés et publics, sur le territoire national pendant une période donnée, notamment comme la somme des valeurs ajoutées.
- **Source** : [Produit intérieur brut](https://www.insee.fr/fr/metadonnees/definition/c1365) — Insee, consultée le 2026-11-22
- **Énoncés concernés** :
  - `defense-budget-armees-3-pib` : Le budget des armées doit atteindre 3 % du PIB.
  - `defense-reduire-budget-armees` : Le budget des armées doit être réduit en proportion du PIB.
  - `economie-baisse-depense-publique` : La dépense publique doit baisser en proportion du PIB au cours du prochain quinquennat.

- [ ] définition validée

### 34. zone à faibles émissions (ZFE) (`zone-faibles-emissions`)

- **Formes repérées** : « zones à faibles émissions », « zone à faibles émissions », « ZFE »
- **Définition** (159 caractères) : Zone où la circulation des véhicules les plus polluants est restreinte, selon des modalités définies par la collectivité, afin d'améliorer la qualité de l'air.
- **Source** : [Zones à faibles émissions (ZFE)](https://www.ecologie.gouv.fr/politiques-publiques/zones-faibles-emissions-zfe) — Ministère de la Transition écologique, consultée le 2026-11-22
- **Énoncés concernés** :
  - `environnement-supprimer-zfe` : Les zones à faibles émissions dans les grandes villes doivent être supprimées.

- [ ] définition validée

### 35. artificialisation des sols (`artificialisation-des-sols`)

- **Formes repérées** : « artificialisation des sols »
- **Définition** (232 caractères) : Altération durable des fonctions écologiques d'un sol (biologiques, hydriques, climatiques) et de son potentiel agronomique par son occupation ou son usage, par exemple par l'urbanisation d'espaces naturels, agricoles ou forestiers.
- **Source** : [Artificialisation des sols](https://www.ecologie.gouv.fr/politiques-publiques/artificialisation-sols) — Ministère de la Transition écologique, consultée le 2026-11-22
- **Énoncés concernés** :
  - `environnement-assouplir-artificialisation` : Les objectifs de réduction de l'artificialisation des sols doivent être assouplis.

- [ ] définition validée

### 36. aide publique au développement (APD) (`aide-publique-developpement`)

- **Formes repérées** : « aide publique au développement »
- **Définition** (199 caractères) : Ensemble des financements publics consacrés par un État au développement des pays les plus vulnérables. Son niveau est exprimé en part du revenu national brut ; l'objectif international est de 0,7 %.
- **Source** : [Lutter contre les inégalités mondiales](https://www.diplomatie.gouv.fr/fr/le-ministere-en-action/contribuer-a-une-mondialisation-durable-et-equilibree/lutter-contre-les-inegalites-mondiales) — France Diplomatie, consultée le 2026-11-22
- **Énoncés concernés** :
  - `international-aide-developpement-0-7` : L'aide publique au développement doit atteindre 0,7 % du revenu national brut.

- [ ] définition validée

## 2. Termes écartés

| Terme ou sigle | Énoncé(s) | Motif |
|---|---|---|
| référendum d'initiative citoyenne | `democratie-referendum-initiative-citoyenne` | Dispositif qui n'existe pas en droit français : l'énoncé le décrit lui-même ; aucune définition institutionnelle stable. |
| aide active à mourir | `societe-aide-active-a-mourir` | Pas de définition légale en vigueur ; l'énoncé précise déjà le public visé. |
| écocide | `environnement-ecocide-crime` | Pas de définition stable en droit pénal français (débat en cours) ; seule une source sur le droit de l'Union a été trouvée. |
| carte scolaire | `education-carte-scolaire-suppression` | Définie dans l'énoncé lui-même ; source institutionnelle (education.gouv.fr) inaccessible lors de la vérification. |
| établissement privé sous contrat, instruction en famille | `education-*`, `societe-instruction-famille-autorisation` | Sources institutionnelles (education.gouv.fr) inaccessibles lors de la vérification ; à reprendre. |
| politique agricole commune (PAC) | `agriculture-plafonner-aides-pac` | Page du ministère de l'Agriculture ouverte sans définition exploitable ; source européenne non vérifiée. À reprendre. |
| nouvelles techniques génomiques, néonicotinoïdes, glyphosate | `agriculture-*` | Sources institutionnelles non trouvées ou inaccessibles lors de la vérification ; à reprendre. |
| TVA (taux normal) | `fiscalite-baisse-tva` | Page institutionnelle ouverte sans définition du taux normal ; sigle très courant. |
| impôts de production | `fiscalite-supprimer-impots-production` | Source Vie-publique trouvée, mais sans définition stable (énumération de composantes). |
| revenu national brut | `international-aide-developpement-0-7` | Définition Insee non trouvée à l'adresse attendue ; terme cité dans la définition de l'aide publique au développement. |
| prélèvements obligatoires | `fiscalite-baisse-prelevements-obligatoires` | Définition Insee non trouvée à l'adresse attendue ; à reprendre. |
| libération conditionnelle, travail d'intérêt général, justice restaurative | `justice-*` | Pages du ministère de la Justice et de Service-Public non trouvées aux adresses attendues ; à reprendre. |
| légitime défense, refus d'obtempérer | `securite-*` | Sources institutionnelles non trouvées lors de la vérification ; à reprendre. |
| OTAN, ONU, Union européenne | `international-*`, `defense-*` | Organisations connues, nommées en toutes lettres ou d'usage courant ; pas de besoin de définition. |
| EDF, SNCF | `economie-edf-entierement-publique`, `transport-sncf-entreprise-publique-v2` | Noms d'entreprises, pas des notions. |
| EPR2, petits réacteurs modulaires | `energie-*` | Pas de source institutionnelle vérifiée ; noms de modèles industriels. |
| BAC | `securite-supprimer-bac` | Sigle développé dans l'énoncé (« brigades anticriminalité »). |
| CO2 | `environnement-publicite-vehicules-emetteurs` | Langage courant. |
| règlement sur la protection des données (RGPD) | `numerique-rgpd-petites-entreprises` | Le sigle n'apparaît pas dans l'énoncé ; sources européennes inaccessibles (limitation de débit). |
| commandement intégré de l'OTAN, traité sur l'interdiction des armes nucléaires | `international-quitter-commandement-otan`, `defense-traite-interdiction-armes-nucleaires` | Pages de France Diplomatie ouvertes sans définition exploitable ; à reprendre. |
| métiers en tension, titre de séjour de longue durée | `immigration-*` | Fiches Service-Public non trouvées aux adresses attendues ; à reprendre. |
| dépassements d'honoraires, complémentaires santé, service médical rendu | `sante-*` | Page ameli non trouvée à l'adresse attendue ; source de la Haute Autorité de santé hors `institutionalDomains`. À reprendre. |
| heures supplémentaires, quinquennat, fonctionnaire, récidive | divers | Langage courant. |

Les termes « à reprendre » pourront être ajoutés dans un second lot, une fois leur source institutionnelle ouverte et vérifiée.

## Validation (2026-11-26)

Validation automatisée au nom d'adrien (consigne du 2026-11-26 : au-delà de 10 éléments, l'agent valide après vérification indépendante). Un relecteur indépendant a lu au moins une source institutionnelle par terme et vérifié neutralité, longueur et présence dans les énoncés actifs : 34 conformes, 2 corrigés avant validation.

- **zone tendue** : « dans certaines grandes villes » était inexact ; le plafonnement par loyer de référence est expérimental et réservé aux communes qui l'ont demandé.
- **aide publique au développement** : l'APD vise tous les pays en développement (définition du CAD de l'OCDE), pas seulement les plus vulnérables ; source du Sénat ajoutée.

À surveiller : seuil de l'IFI (1 300 000 €) après la loi de finances 2027 ; prolongation de l'expérimentation de l'encadrement des loyers (votée le 2026-11-19, non encore vue au Journal officiel).
