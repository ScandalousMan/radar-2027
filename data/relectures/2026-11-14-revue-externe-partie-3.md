# Revue externe des positions — partie 3, arbitrage du 2026-11-14

**Statut : plan validé par adrien et appliqué le 2026-11-14. Les 11 arbitrages humains ont été tranchés par adrien le même jour, selon les recommandations : 3 valeurs passent à 1, 8 restent inchangées.** Les positions modifiées restent en brouillon (`draft`), à relire avec `pnpm data:review`.

Le retour couvre la **partie 3** du dossier `2026-11-11-revue-positions-externe/` : Mélenchon (P0523 à P0685) et Branco (P0686 à P0776), soit 254 positions. Le relecteur a contesté **80 positions** : 57 suppressions, 12 changements de valeur et 11 points signalés (FLAG).

## Audit préalable

| Contrôle | Résultat |
|---|---|
| Positions du périmètre présentes dans le corpus | 254 sur 254 (163 Mélenchon, 91 Branco) |
| Constats rattachés à une position unique | 80 sur 80, aucun doublon |
| Candidat et énoncé conformes à l'entrée du dossier | 80 sur 80 |
| Valeur `current` conforme au dossier et au corpus | 80 sur 80 |
| Valeurs proposées cohérentes (CHANGE_VALUE entre −2 et 2, différentes de l'actuelle ; nulles ailleurs) | 80 sur 80 |
| Constats hors périmètre | aucun |

**Décalage des références.** Les références du dossier datent d'avant l'arbitrage des parties 1 et 2, qui a supprimé P0084 et P0137. Dans le corpus actuel, chaque position de la partie 3 a donc deux rangs de moins (P0536 du dossier = P0534 actuelle). Les constats ont été rattachés par candidat et par énoncé, puis contrôlés contre l'entrée du dossier : aucune anomalie.

**Modèle de données.** Une position n'a que trois statuts : `draft`, `reviewed` et `contested`. `contested` signifie que deux sources se contredisent ; il exige au moins deux sources (règle FR-020) et un relecteur humain. Il ne convient pas à un FLAG. Les 11 positions signalées restent donc en `draft`, sans modification, et sont listées plus bas. Il n'existe pas non plus de statut « retirée » : la trace d'une suppression est ce journal (ancienne valeur, énoncé, motif) et l'historique git, comme pour les parties 1, 2, 4 et 5.

## Méthode

Chaque constat a été vérifié sur le texte de la source en cache, en lisant le contexte autour de la citation. Les règles sont celles de la PR #9 et les conventions du propriétaire du 2026-11-09 : ±2 pour la mesure ou son contraire explicite, ±1 pour une version voisine, partielle ou conditionnée, et ±1 pour une mesure plus large dans le même sens. Comme pour les autres parties, le relecteur lit « répond directement » plus strictement que ces règles : la plupart des suppressions proposées visent des versions voisines ou plus larges.

## Bilan proposé

| Décision | Nombre |
|---|---|
| Changements de valeur retenus | 10 |
| Suppression retenue | 1 |
| Suppressions écartées mais valeur ajustée | 2 |
| Arbitrages humains (FLAG), tranchés par adrien | 11 (3 valeurs passées à 1, 8 gardées) |
| Contestations écartées | 56 |

Après application : 1 092 positions au lieu de 1 093 (une suppression), 12 valeurs modifiées. Le détail des contrôles figure en fin de document.

## Corrections prévues (13)

| Réf. dossier | Réf. actuelle | Candidat | Énoncé | Verdict | Actuel | Proposé | Opération prévue | Motif |
|---|---|---|---|---|---|---|---|---|
| P0552 | P0550 | jean-luc-melenchon | economie-participations-etat-industrie | CHANGE_VALUE | 2 | 1 | Passer à 1 | La nationalisation d'ArcelorMittal France est une prise de contrôle totale, plus large que des participations : 1 par convention, comme Kazib et Branco. |
| P0554 | P0552 | jean-luc-melenchon | economie-plafonner-prix-alimentaires | CHANGE_VALUE | 2 | 1 | Passer à 1 | Plafonner tous les prix alimentaires va au-delà des seuls produits de première nécessité : mesure plus large, 1 par convention. |
| P0565 | P0563 | jean-luc-melenchon | energie-suspendre-nouvelles-eoliennes | CHANGE_VALUE | −2 | −1 | Passer à −1 | Le déploiement de l'éolien en mer s'oppose à une suspension, sans viser l'éolien terrestre : -1, comme Attal (P0488) et Tondelier (P0874). |
| P0572 | P0570 | jean-luc-melenchon | environnement-plastique-usage-unique-2030 | CHANGE_VALUE | 2 | 1 | Passer à 1 | Interdire tous les plastiques à usage unique, immédiatement, va au-delà des seuls emballages : mesure plus large, 1 par convention. |
| P0573 | P0571 | jean-luc-melenchon | environnement-publicite-vehicules-emetteurs | CHANGE_VALUE | 2 | 1 | Passer à 1 | Interdire la publicité de tous les produits les plus émetteurs va au-delà des véhicules : mesure plus large, 1 par convention, comme Tondelier (P0885). |
| P0575 | P0573 | jean-luc-melenchon | environnement-taxe-carbone-importations | CHANGE_VALUE | 2 | 1 | Passer à 1 | Des droits de douane écologiques fondés sur plusieurs critères (carbone, pollution, eau) : mesure plus large qu'une taxe carbone sur les importations, 1 par convention. |
| P0636 | P0634 | jean-luc-melenchon | sante-production-publique-medicaments | CHANGE_VALUE | 2 | 1 | Passer à 1 | Le pôle public relocalise la production de médicaments en général, au-delà des médicaments essentiels en cas de défaillance du privé : mesure plus large, 1 par convention. |
| P0638 | P0636 | jean-luc-melenchon | sante-ratios-soignants-patients | DELETE | 1 | suppr. | Supprimer | Le ratio d'encadrement vise les résidents des EHPAD, pas les patients des hôpitaux : l'objet diffère. Aucun ratio hospitalier n'apparaît dans les sources du candidat. |
| P0653 | P0651 | jean-luc-melenchon | societe-aide-active-a-mourir | CHANGE_VALUE | 2 | 1 | Passer à 1 | Un droit constitutionnel de mourir dans la dignité, avec assistance, sans restriction aux adultes atteints d'une maladie incurable : mesure plus large, 1 par convention. |
| P0675 | P0673 | jean-luc-melenchon | travail-limiter-licenciements-beneficiaires-v2 | CHANGE_VALUE | 2 | 1 | Passer à 1 | L'interdiction ne vise que les entreprises qui versent des dividendes ou reçoivent des aides : version partielle, 1. |
| P0711 | P0709 | juan-branco | economie-participations-etat-industrie | CHANGE_VALUE | 2 | 1 | Passer à 1 | Pôle public de l'armement, reprise en main des conseils d'administration et nationalisation de MBDA : prise de contrôle plus large que des participations, 1 par convention. |
| P0717 | P0715 | juan-branco | energie-reduire-part-nucleaire | DELETE | −2 | suppr. | Passer à −1 | Suppression écartée : 14 EPR2 vont contre une réduction de la part du nucléaire. Mais aucun objectif de part n'est donné : -1, comme Philippe (P0121) et Roussel (P0270). |
| P0758 | P0756 | juan-branco | sante-psychologues-rembourses | DELETE | 2 | suppr. | Passer à 1 | Suppression écartée : le remboursement « intégral » vaut pour le taux, pas forcément pour le nombre de séances. Version voisine, 1, comme Roussel (P0294). |

## Arbitrages humains (11), tranchés par adrien le 2026-11-14

adrien a validé les 11 recommandations. Trois positions passent à 1 (P0565, P0580 et P0757 actuelles) ; leur justification est réécrite et `authoredAt` passe au 2026-11-14. Les huit autres restent strictement inchangées. La colonne « Opération prévue » garde le plan d'origine ; la décision figure dans la colonne « Décision ».

| Réf. dossier | Réf. actuelle | Candidat | Énoncé | Verdict | Actuel | Proposé | Opération prévue | Motif | Décision |
|---|---|---|---|---|---|---|---|---|---|
| P0543 | P0541 | jean-luc-melenchon | democratie-vote-blanc-exprime | FLAG | 2 | — | Garder en `draft`, arbitrage humain | Recommandation : garder 2. « Reconnaître le vote blanc », à côté d'un seuil de votes exprimés, désigne d'ordinaire son décompte parmi les suffrages exprimés (il est déjà décompté à part depuis 2014). | Garder (inchangée) |
| P0567 | P0565 | jean-luc-melenchon | environnement-calendrier-logements-mal-isoles | FLAG | 2 | — | Garder en `draft`, arbitrage humain | Recommandation : passer à 1. « Interdire réellement » la location des passoires thermiques va contre tout report, mais le calendrier n'est pas cité ; 1 serait cohérent avec les autres versions voisines. | Passer à 1 (appliqué) |
| P0582 | P0580 | jean-luc-melenchon | fiscalite-hausse-taxe-transactions-financieres | FLAG | 2 | — | Garder en `draft`, arbitrage humain | Recommandation : passer à 1. Le document chiffre une hausse des taxes sur les transactions financières (5 Md€) sans dire si elle passe par le taux ou par l'assiette ; Asselineau (élargissement d'assiette) est à 1. | Passer à 1 (appliqué) |
| P0619 | P0617 | jean-luc-melenchon | numerique-assouplir-consentement-traceurs | FLAG | −1 | — | Garder en `draft`, arbitrage humain | Recommandation : garder -1. Refuser que le seul consentement suffise à fonder la collecte de données durcit l'encadrement : sens contraire d'un assouplissement, les traceurs n'étant pas nommés. | Garder (inchangée) |
| P0650 | P0648 | jean-luc-melenchon | securite-restreindre-tirs-refus-obtemperer | FLAG | 2 | — | Garder en `draft`, arbitrage humain | Recommandation : garder 2. La justification rappelle que la loi Cazeneuve (2017) a élargi l'usage des armes lors des refus d'obtempérer ; l'abroger restreint ces règles. Ce lien vient de la justification, pas de l'extrait. | Garder (inchangée) |
| P0684 | P0682 | jean-luc-melenchon | travail-smic-au-dela-inflation | FLAG | 2 | — | Garder en `draft`, arbitrage humain | Recommandation : garder 2. Porter « immédiatement » le SMIC à 1 700 € net, contre environ 1 440 € en 2026, fait environ +18 %, puis l'indexer sur l'inflation ; Glucksmann (1 600 € net) est à 2. | Garder (inchangée) |
| P0696 | P0694 | juan-branco | democratie-chambre-tiree-au-sort | FLAG | 1 | — | Garder en `draft`, arbitrage humain | Recommandation : garder 1. La chambre haute tirée au sort n'est qu'une des trois options de réorganisation, ce que la valeur 1 reflète déjà. | Garder (inchangée) |
| P0704 | P0702 | juan-branco | democratie-supprimer-cese | FLAG | 1 | — | Garder en `draft`, arbitrage humain | Recommandation : garder 1. L'absorption du CESE dans une chambre haute n'est qu'une des trois options, ce que la valeur 1 reflète déjà. | Garder (inchangée) |
| P0747 | P0745 | juan-branco | justice-imprescriptibilite-crimes-sexuels-mineurs | FLAG | −1 | — | Garder en `draft`, arbitrage humain | Recommandation : garder -1. Un retour général à dix ans de prescription criminelle, sans exception mentionnée, va contre l'imprescriptibilité. | Garder (inchangée) |
| P0759 | P0757 | juan-branco | sante-regulation-installation-medecins | FLAG | 2 | — | Garder en `draft`, arbitrage humain | Recommandation : passer à 1. « Régulation de l'installation » est accolée à des obligations d'exercice en zones sous-dotées, mais les zones bien dotées ne sont pas nommées ; Tondelier, qui les vise explicitement, est à 2. | Passer à 1 (appliqué) |
| P0775 | P0773 | juan-branco | travail-smic-au-dela-inflation | FLAG | 1 | — | Garder en `draft`, arbitrage humain | Recommandation : garder 1. 1 500 € net, contre environ 1 440 € en 2026, fait environ +4 % : hausse ponctuelle modérée, sans règle de revalorisation. | Garder (inchangée) |

## Contestations écartées (56)

| Réf. dossier | Réf. actuelle | Candidat | Énoncé | Verdict | Actuel | Proposé | Opération prévue | Motif |
|---|---|---|---|---|---|---|---|---|
| P0536 | P0534 | jean-luc-melenchon | democratie-raccourcir-consultations-public | DELETE | −1 | suppr. | Aucune (garder −1) | Revenir sur l'affaiblissement des mécanismes de participation du public va contre le raccourcissement des consultations : version voisine, -1. |
| P0546 | P0544 | jean-luc-melenchon | economie-baisse-depense-publique | DELETE | −1 | suppr. | Aucune (garder −1) | Refuser les coupes budgétaires et prévoir environ 80 Md€ de dépenses nouvelles va contre une baisse de la dépense en part de PIB : -1. |
| P0550 | P0548 | jean-luc-melenchon | economie-etat-finance-usines | DELETE | 1 | suppr. | Aucune (garder 1) | Un plan public de reconstruction industrielle dans les secteurs stratégiques : version voisine d'un financement direct d'usines, 1. |
| P0556 | P0554 | jean-luc-melenchon | economie-reduire-nombre-fonctionnaires | DELETE | −1 | suppr. | Aucune (garder −1) | Le programme recrute des fonctionnaires dans plusieurs services publics et « reconstruit » les effectifs du contrôle fiscal : sens contraire d'une baisse, -1. |
| P0557 | P0555 | jean-luc-melenchon | economie-regle-equilibre-constitution | DELETE | −1 | suppr. | Aucune (garder −1) | Suspendre les règles européennes de déficit va contre une règle d'équilibre constitutionnelle : version voisine, -1. |
| P0560 | P0558 | jean-luc-melenchon | energie-fonds-publics-renouvelables | DELETE | 1 | suppr. | Aucune (garder 1) | Viser 100 % de renouvelables et arrêter le nouveau nucléaire oriente les moyens publics vers les renouvelables : version voisine, 1. |
| P0571 | P0569 | jean-luc-melenchon | environnement-pause-normes-europeennes | DELETE | −1 | suppr. | Aucune (garder −1) | Refuser les plans « omnibus » de dérégulation va contre une pause normative : -1, comme Tondelier (P0883). |
| P0577 | P0575 | jean-luc-melenchon | environnement-trajectoire-emissions-entreprises | DELETE | 2 | suppr. | Aucune (garder 2) | La citation se poursuit par « accompagnée d'une trajectoire de baisse de leurs émissions », imposée par la loi aux entreprises, par secteur puis par taille : c'est la mesure, 2. |
| P0580 | P0578 | jean-luc-melenchon | fiscalite-csg-progressive-v2 | DELETE | 1 | suppr. | Aucune (garder 1) | Une cotisation universelle intégrant la CSG avec une part progressive selon les revenus : version voisine, 1. |
| P0584 | P0582 | jean-luc-melenchon | fiscalite-impot-minimum-grandes-fortunes-v2 | CHANGE_VALUE | 2 | 1 | Aucune (garder 2) | La « taxe Zucman » est précisément un impôt plancher annuel de 2 % sur les patrimoines de plus de 100 M€ : 2. |
| P0585 | P0583 | jean-luc-melenchon | fiscalite-quotient-familial-credit-enfant | DELETE | 1 | suppr. | Aucune (garder 1) | Un crédit d'impôt par enfant pour toutes les familles, avec la fin du quotient conjugal : version voisine du remplacement du quotient familial, 1. |
| P0588 | P0586 | jean-luc-melenchon | fiscalite-reduire-droits-succession | DELETE | 0 | suppr. | Aucune (garder 0) | Le contexte immédiat ajoute « Augmenter les droits de succession sur les plus hauts patrimoines » : exonérer les petits héritages et alourdir les gros justifie la position intermédiaire, 0. |
| P0594 | P0592 | jean-luc-melenchon | immigration-reduire-duree-naturalisation | DELETE | 1 | suppr. | Aucune (garder 1) | « Faciliter l'accès à la nationalité » : mesure plus large dans le même sens, 1 par convention (comme Tondelier, P0906). |
| P0602 | P0600 | jean-luc-melenchon | institutions-autonomie-fiscale-collectivites | DELETE | 1 | suppr. | Aucune (garder 1) | Rétablir un impôt local propre aux communes pour leur « redonner des moyens » : version voisine d'une autonomie fiscale accrue, 1. |
| P0614 | P0612 | jean-luc-melenchon | justice-accompagnement-emploi-detenus | DELETE | 1 | suppr. | Aucune (garder 1) | Assurer aux détenus « les moyens de se réinsérer » : version voisine d'un accompagnement vers l'emploi, 1. |
| P0615 | P0613 | jean-luc-melenchon | justice-comparution-immediate-mineurs | DELETE | −1 | suppr. | Aucune (garder −1) | Revenir sur « toutes les mesures qui alignent la justice des mineurs sur celle des adultes » va contre la comparution immédiate des mineurs : -1. |
| P0617 | P0615 | jean-luc-melenchon | justice-majorite-penale-16-ans | DELETE | −1 | suppr. | Aucune (garder −1) | Même passage : il va a fortiori contre une majorité pénale abaissée à 16 ans, -1. |
| P0620 | P0618 | jean-luc-melenchon | numerique-assouplir-regles-ia | DELETE | −1 | suppr. | Aucune (garder −1) | Soumettre les IA à haut risque à une autorisation nationale de mise sur le marché renforce l'encadrement : sens contraire d'un assouplissement, -1 (comme Batho, P0109). |
| P0622 | P0620 | jean-luc-melenchon | numerique-donnees-sante-hebergeurs-europeens | DELETE | 1 | suppr. | Aucune (garder 1) | Héberger les données des services publics sur des serveurs publics en France couvre les données de santé publiques : version voisine, 1. |
| P0627 | P0625 | jean-luc-melenchon | sante-assurance-sante-privee-option-v2 | DELETE | −1 | suppr. | Aucune (garder −1) | Intégrer les complémentaires dans la Sécurité sociale (« 100 % Sécu ») va contre une sortie vers l'assurance privée : -1. |
| P0628 | P0626 | jean-luc-melenchon | sante-budget-hopital-inflation | DELETE | 1 | suppr. | Aucune (garder 1) | Une hausse de 3 Md€ du budget des hôpitaux et 10 000 postes : version voisine d'une hausse supérieure à l'inflation, 1. |
| P0631 | P0629 | jean-luc-melenchon | sante-depenses-assurance-maladie-inflation | DELETE | −1 | suppr. | Aucune (garder −1) | Remplacer l'ONDAM par un objectif fondé sur les besoins va contre un plafonnement des dépenses : -1. |
| P0632 | P0630 | jean-luc-melenchon | sante-derembourser-faible-service-rendu | DELETE | −1 | suppr. | Aucune (garder −1) | Rembourser à 100 % les soins prescrits va contre les déremboursements : -1. |
| P0642 | P0640 | jean-luc-melenchon | securite-budget-vers-prevention | DELETE | 1 | suppr. | Aucune (garder 1) | Abroger des lois sécuritaires et renforcer la prévention par davantage d'éducateurs et de médiateurs : version voisine d'une réorientation, 1. |
| P0649 | P0647 | jean-luc-melenchon | securite-renseignement-autorisation-juge | DELETE | 1 | suppr. | Aucune (garder 1) | Garantir le contrôle du juge judiciaire dans la lutte antiterroriste : version voisine d'une autorisation préalable, 1. |
| P0652 | P0650 | jean-luc-melenchon | securite-videosurveillance-algorithmique | DELETE | −1 | suppr. | Aucune (garder −1) | Interdire l'identification biométrique et la police prédictive va contre la vidéosurveillance algorithmique : version voisine, -1. |
| P0656 | P0654 | jean-luc-melenchon | societe-education-sexualite-accord-parents | DELETE | −1 | suppr. | Aucune (garder −1) | Assurer « à tous les élèves » les trois séances prévues par la loi exclut une condition d'accord parental : version voisine du sens contraire, -1. |
| P0669 | P0667 | jean-luc-melenchon | transport-subventionner-fret-ferroviaire | DELETE | 1 | suppr. | Aucune (garder 1) | Revenir sur la liquidation de Fret SNCF et développer massivement le fret : version voisine d'un soutien public, 1. |
| P0676 | P0674 | jean-luc-melenchon | travail-plafond-prudhommes-maintenu-v2 | DELETE | −1 | suppr. | Aucune (garder −1) | La justification rappelle que les ordonnances Pénicaud ont instauré le barème ; les abroger, c'est le supprimer. Déduction acceptée par les conventions, -1. |
| P0693 | P0691 | juan-branco | defense-doubler-reservistes | DELETE | 1 | suppr. | Aucune (garder 1) | Un service universel qui alimente des réserves civiles et militaires obligatoires gonfle les réserves bien au-delà d'un doublement ; le chiffre manque, d'où 1. |
| P0694 | P0692 | juan-branco | defense-renoncer-modernisation-dissuasion | DELETE | −1 | suppr. | Aucune (garder −1) | Remplacer les M51, missiles de la dissuasion embarquée, par des vecteurs hypersoniques, c'est moderniser la dissuasion : sens contraire, -1. |
| P0701 | P0699 | juan-branco | democratie-referendum-local-initiative | DELETE | 1 | suppr. | Aucune (garder 1) | Des « référendums d'initiative locaux » sont déclenchés par les habitants : version voisine, 1. |
| P0703 | P0701 | juan-branco | democratie-referendum-revocatoire | DELETE | 2 | suppr. | Aucune (garder 2) | La note 1 rattachée à la phrase citée précise : « Les référendums révocatoires proposés devront être adoptés à la majorité de deux tiers… » ; la révocation passe bien par référendum, 2. |
| P0708 | P0706 | juan-branco | economie-baisse-depense-publique | CHANGE_VALUE | 2 | 1 | Aucune (garder 2) | Une baisse des dépenses publiques en valeur entraîne a fortiori la baisse de leur part dans le PIB : 2. |
| P0712 | P0710 | juan-branco | economie-prix-energie-reglementes | DELETE | 1 | suppr. | Aucune (garder 1) | Le même passage nationalise la distribution d'électricité et module les tarifs avec un minimum vital : fixation publique des prix pour les ménages, version voisine, 1. |
| P0716 | P0714 | juan-branco | energie-petits-reacteurs-modulaires | DELETE | 1 | suppr. | Aucune (garder 1) | Retirer les SMR au privé pour en faire des projets publics suppose un financement public : version voisine, 1. |
| P0720 | P0718 | juan-branco | environnement-gazole-non-routier-agriculteurs | DELETE | −1 | suppr. | Aucune (garder −1) | Le taux réduit de taxe sur le GNR est l'aide visée ; la plafonner revient à la réduire en partie : -1. |
| P0721 | P0719 | juan-branco | environnement-limiter-recours-projets-v2 | DELETE | 1 | suppr. | Aucune (garder 1) | Plafonner à trois mois le traitement de tout recours contre un site industriel encadre les recours : version voisine, 1. |
| P0724 | P0722 | juan-branco | environnement-taxe-carbone-importations | DELETE | 1 | suppr. | Aucune (garder 1) | Une taxe à l'importation proportionnelle à l'usage du charbon du pays d'origine : version voisine d'une taxe carbone aux frontières, 1. |
| P0726 | P0724 | juan-branco | fiscalite-baisse-cotisations-salaries | DELETE | 1 | suppr. | Aucune (garder 1) | Baisser les cotisations sur les salaires, financée par une TVA sociale : version voisine, 1. |
| P0728 | P0726 | juan-branco | fiscalite-hausse-taxe-transactions-financieres | DELETE | 1 | suppr. | Aucune (garder 1) | Mettre en œuvre une taxe sur les transactions financières alourdit leur taxation : version voisine d'une hausse du taux, 1. |
| P0730 | P0728 | juan-branco | fiscalite-impot-minimum-grandes-fortunes-v2 | DELETE | 1 | suppr. | Aucune (garder 1) | Rétablir l'ISF : mesure plus large dans le même sens, 1 par convention. |
| P0734 | P0732 | juan-branco | immigration-amende-sejour-irregulier | DELETE | 1 | suppr. | Aucune (garder 1) | Systématiser les TIG pour infraction au séjour sanctionne le séjour irrégulier par une autre peine qu'une amende : version voisine, 1 (comme Lisnard et Zemmour). |
| P0735 | P0733 | juan-branco | immigration-asile-examen-hors-europe-v2 | DELETE | 1 | suppr. | Aucune (garder 1) | Le traitement de l'asile dans les consulats se fait hors du territoire de l'UE : version voisine, 1 (comme Lisnard, P0076). |
| P0736 | P0734 | juan-branco | immigration-regroupement-familial-ressources | DELETE | 1 | suppr. | Aucune (garder 1) | Conditionner le regroupement familial : version voisine de conditions de ressources plus strictes, 1. |
| P0737 | P0735 | juan-branco | immigration-visas-professions-qualifiees-v2 | DELETE | 1 | suppr. | Aucune (garder 1) | Une politique d'attractivité pour les profils très qualifiés : version voisine d'un assouplissement des visas de travail, 1. |
| P0743 | P0741 | juan-branco | international-aide-developpement-0-7 | DELETE | −1 | suppr. | Aucune (garder −1) | Réduire les contributions internationales et l'aide multilatérale va contre une hausse à 0,7 % du RNB : version voisine, -1. |
| P0745 | P0743 | juan-branco | justice-arret-construction-prisons | DELETE | −1 | suppr. | Aucune (garder −1) | Un plan pénitentiaire, qui suppose de nouvelles cellules, va contre l'arrêt des constructions : version voisine, -1. |
| P0749 | P0747 | juan-branco | numerique-ia-remuneration-auteurs | DELETE | 1 | suppr. | Aucune (garder 1) | Exiger une compensation pour le « pillage des données françaises » par les modèles de langage : version voisine de la rémunération des auteurs, 1. |
| P0751 | P0749 | juan-branco | sante-assurance-sante-privee-option-v2 | DELETE | −1 | suppr. | Aucune (garder −1) | Supprimer les complémentaires et mutuelles privées au profit d'un service public universel va contre une sortie vers l'assurance privée : -1. |
| P0760 | P0758 | juan-branco | sante-taxer-boissons-sucrees | DELETE | 1 | suppr. | Aucune (garder 1) | Surtaxer les aliments ultra-transformés trop sucrés : version voisine, 1. |
| P0761 | P0759 | juan-branco | securite-enquetes-policiers-independantes | DELETE | 1 | suppr. | Aucune (garder 1) | Un corps d'inspection « indépendant des forces de l'ordre » : version voisine, 1. |
| P0765 | P0763 | juan-branco | societe-instruction-famille-autorisation | DELETE | −1 | suppr. | Aucune (garder −1) | « Simplifier les conditions de l'instruction en famille » va contre le maintien de l'autorisation préalable : version voisine, -1. |
| P0768 | P0766 | juan-branco | transport-petites-lignes-maintenues | DELETE | 1 | suppr. | Aucune (garder 1) | Un grand plan d'investissement dans les lignes secondaires menacées : version voisine du maintien des petites lignes, 1. |
| P0770 | P0768 | juan-branco | transport-subventionner-fret-ferroviaire | DELETE | 1 | suppr. | Aucune (garder 1) | Un grand plan d'investissement dans le ferroutage contre la route : version voisine d'un soutien public au fret, 1. |
| P0776 | P0774 | juan-branco | travail-smic-regional | DELETE | 1 | suppr. | Aucune (garder 1) | « Déconcentrer » le SMIC au-dessus d'un plancher national permet qu'il varie localement : version voisine, 1. |

## Trace de la position supprimée

| Champ | Valeur avant suppression |
|---|---|
| Réf. dossier / actuelle | P0638 / P0636 |
| Candidat | jean-luc-melenchon |
| Énoncé | sante-ratios-soignants-patients |
| Valeur | 1 |
| Sources | jean-luc-melenchon-aec-securite-sociale-ch2 |
| Citation | « Former, qualifier et recruter du personnel en nombre suffisant pour respecter un ratio minimal d'encadrement » |
| Justification | Le programme fixe un ratio minimal d'encadrement dans les EHPAD, et non dans les hôpitaux. |
| Auteur, date | claude, 2026-11-09 |

## Contrôles avant / après

| Contrôle | Avant | Après |
|---|---|---|
| Positions du corpus | 1 093 | 1 092 |
| Positions Mélenchon / Branco | 163 / 91 | 162 / 91 |
| Positions supprimées | — | 1, conforme au plan (P0638) |
| Positions modifiées | — | 12, conformes au plan |
| Champs modifiés sur ces 12 positions | — | `value`, `justification`, `authoredAt` uniquement ; énoncé, sources, citation et métadonnées inchangés |
| Positions FLAG | 11 | 11, strictement inchangées |
| Contestations écartées | 56 | 56 positions strictement inchangées |
| Positions hors des 80 constats | — | aucune modifiée, aucune ajoutée |
| `pnpm data:validate` (schéma, sources, citations, références) | 0 violation | 0 violation, 0 avertissement |
| `pnpm test` | 959 réussis, 1 ignoré | 959 réussis, 1 ignoré |

Chaque constat du rapport a été traité selon le tableau ci-dessus : 13 corrections appliquées, 11 FLAG tranchés par adrien (3 valeurs passées à 1, 8 gardées), 56 rejets motivés. Le retour brut du relecteur est versé au dossier de revue (`revue-adverse-partie-3-2026-11-14.json`).


## Après les arbitrages humains (2026-11-14)

| Contrôle | Résultat |
|---|---|
| Positions du corpus | 1 092, inchangé |
| Positions modifiées par les arbitrages | 3 (P0565 et P0580 de Mélenchon, P0757 de Branco), conformes aux décisions ; champs `value`, `justification`, `authoredAt` uniquement |
| Positions FLAG gardées | 8, strictement inchangées |
| `pnpm data:validate` | 0 violation, 0 avertissement |

## Relecture de l'ensemble du corpus (2026-11-14)

Les cinq parties de la revue externe étant arbitrées, adrien a validé toutes les positions. Les 1 092 positions des 18 candidats passent de `draft` à `reviewed`, avec `reviewer: adrien`, `reviewedAt: 2026-11-14` et le `reviewedHash` que calcule `pnpm data:review` (empreinte de la valeur, des sources et de la citation). Les règles de `data:review` ont été appliquées en une seule passe : aucune position n'a adrien pour auteur et les règles de position donnent 0 violation. Les fichiers gardent leur mise en forme ; seul leur commentaire d'en-tête change, puisqu'il annonçait une relecture à venir.

| Contrôle | Résultat |
|---|---|
| Positions `reviewed` / `draft` / `contested` | 1 092 / 0 / 0 |
| `pnpm data:validate` | 0 violation, 0 avertissement |
| `pnpm test` | 959 réussis, 1 ignoré |
