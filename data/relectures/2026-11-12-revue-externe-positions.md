# Revue externe des positions — arbitrage du 2026-11-12

Le dossier de revue (`2026-11-11-revue-positions-externe/`) a été soumis à un modèle d'OpenAI par adrien. Un premier retour couvre les **parties 4 et 5** : Le Pen, Tondelier, Arthaud, Dupont-Aignan et Glucksmann, soit 326 positions (P0777 à P1102). Un second retour, arbitré le 2026-11-13, couvre les parties 1 et 2 (voir la section dédiée plus bas). La partie 3 (Mélenchon et Branco, 254 positions) n'a pas encore de retour.

Pour les parties 4 et 5, le relecteur a contesté **75 positions** :

| Verdict | Nombre |
|---|---|
| Suppression proposée | 40 |
| Changement de valeur proposé | 26 |
| Point signalé (FLAG) | 9 |

Claude a vérifié chaque contestation sur le texte en cache, en lisant le contexte autour de la citation et pas seulement la citation. Les règles appliquées sont celles de la PR #9 et les conventions du propriétaire du 2026-11-09.

**Résultat :** 18 contestations retenues (7 suppressions et 11 changements de valeur) et 57 écartées. Les positions retenues restent à l'état de brouillon (`draft`), à relire avec `pnpm data:review`.

## Pourquoi la plupart des suppressions sont écartées

Le relecteur a lu « répond directement » de façon stricte : pour lui, toute mesure voisine, partielle ou plus large que l'énoncé ne compte pas. Or les règles du projet prévoient justement ±1 pour ces cas :

- ±1 pour une version voisine, partielle ou conditionnée ;
- ±1 pour une mesure plus large dans le même sens (convention du propriétaire).

Une suppression n'est donc retenue que si le passage ne tranche pas l'énoncé, même partiellement :

- l'acteur diffère (les Régions et non l'État) ;
- l'objet diffère (l'Alliance atlantique et non le commandement intégré de l'OTAN ; le congé parental et non le congé de naissance) ;
- la position est celle du parti, rapportée par un journaliste, et non celle de la candidate.

**Reprises journalistiques.** Pour P0784, P0797 et P0802 (Le Pen, franceinfo), l'article rapporte les intentions de la candidate elle-même (« elle a affiché sa volonté de… », « elle défend… »). Ces positions sont gardées. Le texte de consigne envoyé au relecteur était trop strict sur ce point : il assimilait toute reprise journalistique à la position d'un tiers. P1005 (Arthaud) est supprimée parce que l'article attribue la mesure au parti (« Lutte ouvrière… prône »), et aucune source de la candidate ne la reprend.

## Contestations retenues (18)

| Réf. | Candidat | Énoncé | Avant | Après | Motif |
|---|---|---|---|---|---|
| P0782 | marine-le-pen | economie-accords-libre-echange | −1 | supprimée | Revoir les accords existants ne dit rien de la conclusion de nouveaux accords. |
| P0805 | marine-le-pen | immigration-prestations-duree-residence | 2 | 1 | Cinq ans de travail, plus strict que cinq ans de résidence : mesure plus large, 1 par convention. |
| P0836 | marine-tondelier | agriculture-interdire-poules-cage | 2 | 1 | Interdiction de tout élevage en cage : mesure plus large, 1 par convention. |
| P0859 | marine-tondelier | economie-accords-libre-echange | −2 | −1 | Le refus vise les accords en attente ; de futurs traités sont admis avec des clauses miroirs. |
| P0885 | marine-tondelier | environnement-publicite-vehicules-emetteurs | 2 | 1 | Interdiction visant tous les produits fossiles : mesure plus large, 1 par convention. |
| P0909 | marine-tondelier | immigration-regularisation-metiers-tension | 2 | 1 | Régularisation de toutes les personnes qui travaillent : mesure plus large, 1 par convention. |
| P0933 | marine-tondelier | international-quitter-commandement-otan | −1 | supprimée | L'Alliance atlantique n'est pas le commandement intégré de l'OTAN. |
| P0938 | marine-tondelier | justice-comparution-immediate-mineurs | −2 | −1 | « Limiter au maximum » n'est pas une interdiction. |
| P0939 | marine-tondelier | justice-imprescriptibilite-crimes-sexuels-mineurs | 2 | 1 | Tous les crimes commis sur des mineurs : mesure plus large, 1 par convention. |
| P0948 | marine-tondelier | numerique-assouplir-regles-ia | −2 | −1 | « Améliorer la régulation » n'est pas le contraire explicite d'un assouplissement. |
| P0956 | marine-tondelier | sante-depassements-honoraires-libres | −2 | −1 | Les dépassements sont plafonnés et non supprimés. |
| P0974 | marine-tondelier | societe-signes-religieux-universite | −1 | −2 | « Pas à ses usagers » : les étudiants sont des usagers, c'est l'inverse explicite de l'énoncé. |
| P1005 | nathalie-arthaud | travail-limiter-licenciements-beneficiaires-v2 | 1 | supprimée | Mesure attribuée au parti par le journaliste, sans reprise dans les sources de la candidate. |
| P1011 | nicolas-dupont-aignan | democratie-referendum-revocatoire | 1 | supprimée | « Conditionner la révocation ou la reconduction des mandats à la confiance populaire » ne désigne ni un référendum ni une révocation en cours de mandat. |
| P1041 | raphael-glucksmann | economie-participations-etat-industrie | 1 | supprimée | Ce sont les Régions qui entrent au capital, pas l'État. |
| P1073 | raphael-glucksmann | international-reduire-contribution-ue | −1 | supprimée | Un budget européen plus élevé, financé par de nouvelles ressources propres, ne tranche pas la contribution française. |
| P1084 | raphael-glucksmann | societe-conge-second-parent | 1 | supprimée | Le congé parental n'est pas le congé de naissance du second parent. |
| P1085 | raphael-glucksmann | societe-service-national-obligatoire | 2 | 1 | Service civique obligatoire dont le volet militaire reste volontaire : version partielle. |

## Contestations écartées (57)

| Réf. | Candidat | Énoncé | Proposé | Gardé | Motif du rejet |
|---|---|---|---|---|---|
| P0779 | marine-le-pen | defense-reduire-budget-armees | suppr. | −1 | Porter la défense à 55 Md€ en 2027 (environ +34 % en cinq ans) est incompatible avec une baisse en part de PIB ; −1 reconnaît déjà l'écart. |
| P0783 | marine-le-pen | economie-aides-conditionnees-emploi | suppr. | 1 | Subventions conditionnées à la création d'emplois : version voisine. |
| P0784 | marine-le-pen | economie-alleger-regles-entreprises | suppr. | 2 | Intention de la candidate rapportée par franceinfo (voir plus haut). |
| P0787 | marine-le-pen | economie-participations-etat-industrie | suppr. | 1 | Fonds souverain public investissant dans l'économie et des actifs stratégiques : version voisine. |
| P0791 | marine-le-pen | energie-petits-reacteurs-modulaires | suppr. | 1 | Reprise d'études publiques sur les petits réacteurs : soutien partiel. |
| P0797 | marine-le-pen | fiscalite-baisse-impot-societes | suppr. | 2 | Intention de la candidate rapportée par franceinfo. |
| P0799 | marine-le-pen | fiscalite-reduire-droits-succession | 1 | 2 | La suppression pour les familles modestes et moyennes, plus l'exonération des donations, va au moins aussi loin qu'une réduction. |
| P0802 | marine-le-pen | fiscalite-taxe-benefices-exceptionnels | suppr. | 2 | Intention de la candidate rapportée par franceinfo. |
| P0807 | marine-le-pen | immigration-regularisation-cinq-ans | −2 | −1 | La régularisation n'est pas nommée ; −1 reste prudent. |
| P0812 | marine-le-pen | international-primaute-loi-nationale-v2 | FLAG | 1 | « Juridictions supranationales » inclut la Cour de justice de l'Union ; 1 est conditionnel. |
| P0814 | marine-le-pen | international-renegocier-traites-competences | suppr. | 1 | Une alliance des nations qui remplace l'Union : mesure plus large dans le même sens. |
| P0840 | marine-tondelier | agriculture-retenues-eau-irrigation | −1 | −2 | Moratoire sur les méga-bassines et conditions sur toutes les autres retenues : l'inverse d'une facilitation. |
| P0844 | marine-tondelier | defense-defense-europeenne-emprunt | FLAG | 1 | Le contexte confirme qu'il s'agit de l'effort de défense européen. |
| P0864 | marine-tondelier | economie-participations-etat-industrie | suppr. | 1 | Passage sous gestion publique d'entreprises stratégiques : version voisine. |
| P0867 | marine-tondelier | energie-accelerer-eolien-terrestre | suppr. | 1 | Soutien fiscal et réglementaire aux parcs éoliens terrestres pour amplifier la filière : version voisine. |
| P0868 | marine-tondelier | energie-fonds-publics-renouvelables | suppr. | 1 | Moyens de la PPE réorientés vers les renouvelables et fin des nouveaux programmes nucléaires. |
| P0872 | marine-tondelier | energie-reduire-part-nucleaire | 1 | 2 | Sous le titre « Planifier la sortie du nucléaire », arrêt étalé sur vingt ans : c'est la réduction progressive. Même valeur que Mélenchon. |
| P0873 | marine-tondelier | energie-supprimer-aides-solaire-eolien | −1 | −2 | Le programme ajoute des aides (prêt à taux zéro, soutien fiscal) : l'inverse explicite d'une suppression. |
| P0874 | marine-tondelier | energie-suspendre-nouvelles-eoliennes | suppr. | −1 | Amplifier la production, éolien compris, s'oppose à une suspension. |
| P0883 | marine-tondelier | environnement-pause-normes-europeennes | suppr. | −1 | S'opposer aux textes « Omnibus » (report et allègement) et renforcer le cadre de durabilité va contre une pause. |
| P0890 | marine-tondelier | fiscalite-baisse-prelevements-obligatoires | suppr. | −1 | La stratégie vise une hausse des recettes ; −1 reconnaît l'absence d'objectif en part de PIB. |
| P0891 | marine-tondelier | fiscalite-capital-aligne-travail | −2 | 1 | Le relecteur lit « aligner » comme « égaliser ». Taxer davantage le capital va plus loin dans le même sens : 1 par convention. |
| P0895 | marine-tondelier | fiscalite-heures-sup-sans-plafond | suppr. | −1 | La suppression de l'exonération de cotisations sur les heures supplémentaires est une version voisine. |
| P0900 | marine-tondelier | fiscalite-reduire-droits-succession | FLAG | −1 | Le titre de la section (« fiscalité sur l'héritage ») confirme qu'il s'agit des successions. |
| P0906 | marine-tondelier | immigration-reduire-duree-naturalisation | suppr. | 1 | « Faciliter l'obtention de la nationalité » : mesure plus large dans le même sens. |
| P0911 | marine-tondelier | immigration-titre-sejour-longue-duree | suppr. | 1 | Présomption d'accord pour le renouvellement : version voisine. |
| P0912 | marine-tondelier | immigration-voies-legales-travail-ue | suppr. | 1 | Voies légales d'immigration en général : mesure plus large. |
| P0917 | marine-tondelier | institutions-investiture-premier-ministre | suppr. | 1 | La composition du gouvernement est confirmée par un vote du Parlement : version voisine. |
| P0934 | marine-tondelier | international-renegocier-traites-competences | suppr. | −2 | Partager davantage de compétences avec l'Union est l'inverse explicite. |
| P0936 | marine-tondelier | justice-accompagnement-emploi-detenus | suppr. | 1 | Accompagnement pendant et après la détention, et plus de postes de travail en prison. |
| P0940 | marine-tondelier | justice-juridictions-mineurs-specialisees-v2 | 1 | 2 | Garder la compétence pénale du juge des enfants, c'est garder une juridiction distincte. |
| P0942 | marine-tondelier | justice-majorite-penale-16-ans | FLAG | −1 | Préserver l'excuse de minorité s'oppose à une majorité pénale à 16 ans. |
| P0945 | marine-tondelier | justice-visites-familiales-prisons | 1 | 2 | Les unités de vie familiale sont précisément des visites prolongées sans surveillance directe, et le programme les prévoit dans tous les établissements. |
| P0947 | marine-tondelier | numerique-assouplir-consentement-traceurs | suppr. | −1 | Restreindre le ciblage comportemental : version voisine, en sens contraire. |
| P0950 | marine-tondelier | numerique-faciliter-centres-donnees | −1 | −2 | Le label PINM est justement la procédure accélérée que le programme supprime. |
| P0955 | marine-tondelier | sante-centres-sante-publics | suppr. | 1 | 2 000 centres de santé (structures à praticiens salariés) : version voisine. |
| P0959 | marine-tondelier | sante-production-publique-medicaments | 1 | 2 | Production publique des médicaments majeurs en rupture : c'est l'énoncé. |
| P0960 | marine-tondelier | sante-regulation-installation-medecins | 1 | 2 | Autorisation de droit dans les zones sous-dotées, donc régulation ailleurs : c'est l'énoncé. |
| P0973 | marine-tondelier | societe-signes-religieux-sorties-scolaires | FLAG | −1 | Neutralité réservée aux agents ; −1 parce que les accompagnateurs ne sont pas nommés. |
| P0977 | marine-tondelier | transport-abonnement-national-unique | FLAG | 2 | Ticket mensuel à tarif unique pour l'ensemble des transports en commun hors TGV. |
| P0984 | marine-tondelier | transport-taxe-kilometrique-poids-lourds | 1 | 2 | Le réseau concédé est déjà à péage ; l'éco-redevance couvre le reste. |
| P0985 | marine-tondelier | transport-trains-de-nuit | 1 | 2 | Création de lignes dans une programmation ferroviaire nationale financée. |
| P0998 | marine-tondelier | travail-smic-au-dela-inflation | suppr. | 2 | 2 000 € bruts en 2027, soit environ +10 %, nettement au-dessus de l'inflation. |
| P1001 | nathalie-arthaud | fiscalite-taxe-benefices-exceptionnels | suppr. | 1 | La confiscation des bénéfices est une version voisine, plus forte. |
| P1007 | nathalie-arthaud | travail-smic-au-dela-inflation | FLAG | 2 | 2 200 € puis indexation : hausse nettement supérieure à l'inflation. |
| P1030 | raphael-glucksmann | defense-armes-ukraine | 1 | 2 | « Augmenter drastiquement l'aide militaire » : l'aide militaire, ce sont d'abord les armes. |
| P1046 | raphael-glucksmann | energie-supprimer-aides-solaire-eolien | suppr. | −1 | Un plan d'investissement dans toutes les renouvelables : version voisine. |
| P1069 | raphael-glucksmann | international-emprunt-commun-ue | 1 | 2 | Un emprunt commun de 500 Md€ pour investir : c'est l'énoncé. |
| P1077 | raphael-glucksmann | numerique-ia-remuneration-auteurs | suppr. | 1 | Protection du droit d'auteur face à l'IA générative : version voisine. |
| P1078 | raphael-glucksmann | numerique-logiciels-libres-administration | suppr. | 1 | Fonds pour les alternatives libres et européennes, et sortie des GAFAM en cinq ans : version voisine. |
| P1082 | raphael-glucksmann | securite-pouvoirs-polices-municipales | suppr. | −1 | Police municipale recentrée sur la proximité : s'oppose à l'alignement de ses pouvoirs. |
| P1086 | raphael-glucksmann | societe-simplifier-changement-sexe-etat-civil | suppr. | 1 | Autodétermination de genre : mesure plus large, 1 par convention. |
| P1090 | raphael-glucksmann | transport-milliard-amenagements-cyclables | suppr. | 1 | Plan d'infrastructures cyclables sans montant : version partielle. |
| P1092 | raphael-glucksmann | transport-subventionner-fret-ferroviaire | suppr. | 1 | Soutien public au fret par la modernisation des lignes : version voisine. |
| P1095 | raphael-glucksmann | travail-durcir-indemnisation-chomage | −1 | −2 | Abroger la réforme qui a durci l'indemnisation : l'inverse explicite. |
| P1100 | raphael-glucksmann | travail-retraite-62-ans | FLAG | 1 | L'abrogation de la réforme de 2023 ramène l'âge légal à 62 ans ; 1 parce que la plateforme refuse de se focaliser sur l'âge. |
| P1102 | raphael-glucksmann | travail-smic-au-dela-inflation | suppr. | 2 | 1 600 € nets en deux ans, soit environ +11 %, au-dessus de l'inflation. |

## Parties 1 et 2 — arbitrage du 2026-11-13

Le second retour couvre les **parties 1 et 2** : Kazib, Retailleau, Lisnard, Batho, Philippe, Zemmour, Roussel, Philippot, Asselineau, Ruffin et Attal, soit 522 positions (P0001 à P0522). Ce relecteur utilisait encore l'ancienne consigne, la plus stricte, sur les reprises journalistiques.

| Verdict | Nombre |
|---|---|
| Suppression proposée | 105 |
| Changement de valeur proposé | 7 |
| Point signalé (FLAG) | 10 |

**Résultat :** 6 contestations retenues en tout ou en partie et 116 écartées. Deux positions sont supprimées, trois passent de 2 à 1, et une change de citation (sa valeur passe de 1 à 2). La méthode et les conventions sont les mêmes que pour les parties 4 et 5. La plupart des suppressions proposées visaient des mesures voisines, partielles ou plus larges, que les règles cotent ±1.

### Contestations retenues (6)

| Réf. | Candidat | Énoncé | Avant | Après | Motif |
|---|---|---|---|---|---|
| P0084 | david-lisnard | institutions-adaptation-lois-regions | 1 | supprimée | Le programme transfère le pouvoir réglementaire d'application de la loi, « celle-ci restant par définition nationale », et le discours de Bayeux exclut des lois différentes selon les territoires : le passage ne soutient pas un pouvoir d'adaptation des lois. |
| P0137 | edouard-philippe | international-arrets-cedh-derogation-v2 | −1 | supprimée | Ne pas sortir de la Convention est compatible avec la non-exécution comme avec l'exécution de tous les arrêts : le passage ne tranche pas l'énoncé. |
| P0175 | eric-zemmour | economie-assouplir-seuils-effectifs | 2 | 1 | Un seul seuil relevé, pour une seule obligation (consultation du CSE) : version partielle. Retailleau, qui relève le seuil déclenchant les obligations en général, garde 2. |
| P0202 | eric-zemmour | immigration-amende-sejour-irregulier | 2 | 1 | Suppression écartée, mais le délit rétabli ne précise pas la peine : 1, comme Lisnard (P0075). |
| P0286 | fabien-roussel | international-quitter-commandement-otan | 2 | 1 | Sortie de l'OTAN : mesure plus large, 1 par convention, comme Philippot et Asselineau. |
| P0454 | francois-ruffin | numerique-donnees-sante-hebergeurs-europeens | 1 | 2 (citation remplacée) | La citation critiquait seulement le choix de Microsoft. Elle est remplacée par la mesure du même cahier : l'obligation d'un cloud SecNumCloud « 100 % UE », réservé aux acteurs de droit européen, étendue au secteur de la santé. C'est la mesure de l'énoncé : 2. |

### Contestations écartées (116)

| Réf. | Candidat | Énoncé | Proposé | Gardé | Motif du rejet |
|---|---|---|---|---|---|
| P0007 | anasse-kazib | democratie-referendum-revocatoire | suppr. | 1 | Élus « révocables » : la révocation en cours de mandat est explicite, seul le mécanisme référendaire manque ; version voisine, déjà cotée 1. |
| P0009 | anasse-kazib | economie-participations-etat-industrie | suppr. | 1 | L'expropriation des secteurs stratégiques est une prise de contrôle publique plus large que des participations, dans le même sens : 1 par convention. |
| P0016 | anasse-kazib | societe-signes-religieux-sorties-scolaires | suppr. | −1 | Abroger la loi de 2004 (signes religieux des élèves) va a fortiori contre une interdiction étendue aux accompagnateurs : déduction voisine, -1. |
| P0017 | anasse-kazib | societe-signes-religieux-universite | suppr. | −1 | Même raisonnement a fortiori pour les étudiants majeurs à l'université : -1. |
| P0018 | anasse-kazib | societe-simplifier-changement-sexe-etat-civil | suppr. | 1 | Des transitions « libres » impliquent l'autodétermination, y compris administrative ; version voisine, 1. |
| P0022 | anasse-kazib | travail-plateformes-presomption-salariat | suppr. | 1 | Le CDI pour tous inclut les travailleurs des plateformes : mesure plus large dans le même sens, 1 par convention. |
| P0029 | bruno-retailleau | democratie-referendum-exceptionnel | suppr. | −1 | Élargir le référendum à toute question législative et alléger ses conditions d'organisation va contre un usage exceptionnel ; -1 reste proportionné. |
| P0033 | bruno-retailleau | energie-accelerer-eolien-terrestre | suppr. | −1 | Fin des soutiens aux nouvelles capacités éoliennes et report de projets autorisés : sens contraire d'une accélération, -1. |
| P0038 | bruno-retailleau | environnement-plastique-usage-unique-2030 | suppr. | −1 | L'interdiction 2030 dépasse le droit européen ; le moratoire sur toute interdiction plastique allant au-delà s'y oppose : -1. |
| P0045 | bruno-retailleau | immigration-prestations-duree-residence | suppr. | 1 | La mesure votée puis censurée (loi immigration 2023) était précisément une condition de durée de résidence pour les prestations non contributives : version voisine, 1. |
| P0048 | bruno-retailleau | international-arrets-cedh-derogation-v2 | FLAG | 2 | Le contexte immédiat nomme la CEDH et ses décisions d'expulsion : le lien est établi. |
| P0051 | bruno-retailleau | justice-sanction-financiere-parents | suppr. | 1 | Sanction financière des parents d'élèves violents : version voisine et partielle, déjà cotée 1. |
| P0061 | david-lisnard | democratie-seuil-rip-maintenu-v2 | suppr. | −1 | Réclamer un seuil « atteignable » pour l'initiative populaire va contre le maintien du seuil actuel d'un dixième ; version voisine, -1. |
| P0067 | david-lisnard | energie-petits-reacteurs-modulaires | FLAG | 2 | Le programme réinvestit les sommes publiques économisées sur les renouvelables dans les mini-réacteurs : financement public explicite. |
| P0069 | david-lisnard | energie-supprimer-aides-solaire-eolien | suppr. | 1 | Les projets « dérogatoires aux prix du marché » sont ceux qui bénéficient de tarifs garantis ; le retour au droit commun et les « sommes économisées » désignent la fin de ces aides : 1. |
| P0075 | david-lisnard | immigration-amende-sejour-irregulier | suppr. | 1 | Le délit de séjour irrégulier était puni notamment d'une amende ; rétablir le délit est une version voisine, 1. |
| P0076 | david-lisnard | immigration-asile-examen-hors-europe-v2 | suppr. | 1 | Des consulats à l'étranger sont hors du territoire de l'UE ; version voisine, 1. |
| P0078 | david-lisnard | immigration-plafond-annuel-admissions | suppr. | 1 | Des quotas d'immigration légale sont une version voisine d'un plafond annuel, 1. |
| P0094 | david-lisnard | numerique-logiciels-libres-administration | suppr. | 1 | Refuser des serveurs non maîtrisés pour les systèmes publics vise un hébergement souverain ; version voisine, 1. |
| P0095 | david-lisnard | securite-pouvoirs-polices-municipales | FLAG | 2 | La qualité d'OPJ/APJ confère précisément les pouvoirs d'enquête judiciaire de la police nationale : 2 justifié. |
| P0102 | delphine-batho | agriculture-pesticides-moitie-2030 | suppr. | 1 | Convertir toute l'agriculture au bio en cinq ans exclut les pesticides de synthèse : mesure plus large dans le même sens, 1 par convention. |
| P0108 | delphine-batho | institutions-competences-retour-etat-v2 | suppr. | −1 | Donner « beaucoup plus de pouvoir au local » va en sens contraire d'un retour de compétences à l'État : -1. |
| P0109 | delphine-batho | numerique-assouplir-regles-ia | suppr. | −1 | La candidate veut être « à l'avant-garde » de la régulation de l'IA et appliquer pleinement les règles existantes : sens contraire d'un assouplissement, -1. |
| P0110 | edouard-philippe | agriculture-alleger-normes-agricoles | suppr. | 1 | « Zéro surtransposition agricole » retire les normes nationales ajoutées au droit européen : version partielle d'un allègement, 1. |
| P0113 | edouard-philippe | defense-effectifs-armees-hausse | FLAG | 1 | Une LPM « de la massification » qui étend les armées va dans le sens d'une hausse des effectifs ; le chiffre manque, d'où 1 déjà retenu. |
| P0119 | edouard-philippe | energie-centres-donnees-pres-centrales | suppr. | 1 | L'accès préférentiel à l'énergie décarbonée, assorti de règles de raccordement type « AI Growth Zones », vise les infrastructures de calcul ; version voisine, 1. |
| P0121 | edouard-philippe | energie-reduire-part-nucleaire | suppr. | −1 | Huit EPR supplémentaires en plus des six prévus vont contre une réduction de la part du nucléaire : -1. |
| P0122 | edouard-philippe | environnement-pause-normes-europeennes | suppr. | 1 | Un moratoire sur toute nouvelle norme pendant le quinquennat est une version voisine (niveau national) d'une pause normative : 1. |
| P0124 | edouard-philippe | fiscalite-baisse-cotisations-salaries | suppr. | 1 | Augmenter le salaire net en allégeant le financement du modèle social par le travail revient à baisser les prélèvements salariaux : version voisine, 1. |
| P0128 | edouard-philippe | fiscalite-reduire-credits-impot | suppr. | 1 | Supprimer les niches fiscales va dans le sens de l'énoncé sans en fixer l'ampleur : 1. |
| P0133 | edouard-philippe | immigration-plafond-annuel-admissions | suppr. | 1 | Des quotas migratoires sont une version voisine d'un plafond annuel : 1. |
| P0134 | edouard-philippe | immigration-prestations-duree-residence | suppr. | 1 | Restreindre les aides versées aux étrangers (alignement européen) est une version voisine d'une condition de résidence : 1. |
| P0138 | edouard-philippe | international-renegocier-traites-competences | suppr. | −1 | « Approfondir » l'Europe va à l'opposé d'un retour de compétences aux États : -1. |
| P0139 | edouard-philippe | justice-comparution-immediate-mineurs | FLAG | 1 | Comparution immédiate des mineurs (tous âges, narcotrafic) : version partielle, 1 déjà retenu. |
| P0142 | edouard-philippe | justice-majorite-penale-16-ans | suppr. | 1 | Lever l'excuse de minorité (narcotrafic) rapproche les mineurs du régime des majeurs : version partielle, 1. |
| P0143 | edouard-philippe | justice-peines-minimales-recidive | suppr. | 1 | Des peines planchers pour les infractions graves sont une version voisine des peines minimales pour récidivistes : 1. |
| P0144 | edouard-philippe | justice-sanction-financiere-parents | suppr. | 1 | Amende pour les parents d'enfants perturbateurs ou absentéistes : version voisine et partielle, 1. |
| P0145 | edouard-philippe | justice-supprimer-reductions-automatiques | suppr. | 1 | Supprimer le JAP pour que la peine prononcée ne soit pas « défaite » poursuit le même but que la suppression des réductions automatiques : version voisine, 1. |
| P0147 | edouard-philippe | numerique-logiciels-libres-administration | suppr. | 1 | Un « Buy European Tech Act » applique une préférence européenne aux achats technologiques publics : version voisine, 1. |
| P0148 | edouard-philippe | sante-depenses-assurance-maladie-inflation | suppr. | 1 | « Stabiliser » les dépenses de santé est au moins aussi strict qu'une progression limitée à l'inflation : même sens, 1. |
| P0149 | edouard-philippe | securite-reconnaissance-faciale-police | FLAG | 1 | Reconnaissance faciale ciblée pendant un état d'urgence narco : version partielle, 1 déjà retenu. |
| P0151 | edouard-philippe | transport-subventionner-fret-ferroviaire | suppr. | 1 | Un grand plan fret ferroviaire pour retirer des camions des routes est une version voisine d'un soutien public au fret : 1. |
| P0165 | eric-zemmour | defense-priorite-depenses-sociales | suppr. | −1 | Dépenser « trop dans la protection sociale » et « trop peu » pour les armées revient à placer le militaire avant le social : -1. |
| P0177 | eric-zemmour | economie-controle-rachats-etrangers | 1 | 2 | Créer un comité chargé de contrôler tous les investissements étrangers renforce bien le contrôle des rachats ; « renforcer » n'a pas de périmètre fixe, la mesure est directe : 2. |
| P0180 | eric-zemmour | economie-prix-energie-reglementes | suppr. | 1 | Un tarif régulé de l'électricité nucléaire pour tous les consommateurs est une version partielle de prix réglementés : 1. |
| P0191 | eric-zemmour | fiscalite-baisse-cotisations-salaries | suppr. | 1 | La CSG est un prélèvement social salarial ; sa baisse sur les bas salaires est une version voisine, 1. |
| P0203 | eric-zemmour | immigration-asile-examen-hors-europe-v2 | suppr. | 1 | Des consulats hors de France, donc hors de l'UE pour l'essentiel : version voisine, 1. |
| P0204 | eric-zemmour | immigration-asile-examen-sans-transfert | suppr. | −1 | Exiger le dépôt hors du territoire exclut l'examen en France : mesure plus large dans le sens contraire, -1 par convention. |
| P0223 | eric-zemmour | justice-juridictions-mineurs-specialisees-v2 | suppr. | −1 | Abaisser la majorité pénale à 16 ans fait juger les 16-17 ans comme des majeurs : version partielle du sens contraire, -1. |
| P0239 | eric-zemmour | societe-signes-religieux-universite | FLAG | 1 | L'« espace public » au sens du programme couvre tous les lieux ouverts au public, université comprise : 1 déjà retenu (un seul signe visé). |
| P0243 | eric-zemmour | transport-supprimer-controle-technique-motos-v2 | suppr. | 1 | Refuser l'extension du contrôle technique aux deux-roues est une version voisine de sa suppression aujourd'hui : 1. |
| P0246 | eric-zemmour | travail-retraite-62-ans | FLAG | −2 | La justification signale déjà l'absence de source 2026 ; le programme de 2022 reste la dernière position connue. |
| P0247 | fabien-roussel | defense-budget-armees-3-pib | suppr. | −1 | Le refus de « la course à l'armement » va contre toute hausse substantielle du budget militaire, 3 % compris : -1. |
| P0254 | fabien-roussel | defense-reduire-presence-etranger | suppr. | 1 | Recentrer les armées sur le territoire et refuser les projections hors mandat ONU : version voisine, 1. |
| P0255 | fabien-roussel | defense-second-porte-avions | suppr. | −1 | S'opposer au remplaçant du porte-avions actuel va a fortiori contre un second : -1. |
| P0258 | fabien-roussel | democratie-petition-debat-parlement | suppr. | 1 | Un « droit de pétition effectif » est une version voisine de l'énoncé : 1. |
| P0259 | fabien-roussel | democratie-referendum-exceptionnel | suppr. | −1 | Un RIC ouvre un recours permanent au référendum à l'initiative des citoyens : sens contraire d'un usage exceptionnel, -1 (même lecture que P0029). |
| P0263 | fabien-roussel | economie-aides-conditionnees-emploi | suppr. | 1 | Conditionner et contrôler les aides publiques, avec des commissions de travailleurs : version voisine d'une conditionnalité à l'emploi, 1. |
| P0269 | fabien-roussel | energie-nouveaux-reacteurs-au-dela-epr2 | suppr. | 1 | Doubler les capacités nucléaires (environ 63 GW) suppose bien plus que six EPR2 : 1 est prudent. |
| P0270 | fabien-roussel | energie-reduire-part-nucleaire | suppr. | −1 | Doubler les capacités nucléaires va contre une réduction de leur part : -1. |
| P0271 | fabien-roussel | environnement-assouplir-artificialisation | suppr. | −1 | « Combattre l'artificialisation des sols » va contre l'assouplissement des objectifs de réduction : -1. |
| P0272 | fabien-roussel | environnement-supprimer-zfe | suppr. | 1 | « Notre combat contre les ZFE » : version voisine de leur suppression, 1. |
| P0274 | fabien-roussel | fiscalite-reduire-credits-impot | suppr. | 1 | Supprimer les exonérations fiscales des grandes entreprises réduit une partie des niches : version partielle, 1. |
| P0275 | fabien-roussel | immigration-asile-examen-hors-europe-v2 | suppr. | −1 | S'opposer à tout centre extraterritorial du pacte européen va contre l'examen de l'asile hors de l'UE : version voisine, -1. |
| P0280 | fabien-roussel | institutions-adaptation-lois-regions | suppr. | −1 | Le texte rejette l'autonomie corse (qui inclut un pouvoir d'adaptation normative) et son extension aux régions : -1. |
| P0282 | fabien-roussel | institutions-ordre-du-jour-parlement | 1 | 2 | La « maîtrise de son ordre du jour » par le Parlement est la mesure de l'énoncé : 2. |
| P0283 | fabien-roussel | institutions-parlement-interventions-militaires | 1 | 2 | Le PCF refuse toute projection extérieure sans mandat ONU ni approbation du Parlement : l'approbation parlementaire devient une condition générale, 2. |
| P0288 | fabien-roussel | justice-courtes-peines-alternatives | suppr. | 1 | Favoriser les peines aménagées pour les moins dangereux est une version voisine du remplacement des courtes peines : 1. |
| P0289 | fabien-roussel | justice-plafonner-detenus-places | suppr. | 1 | En finir avec la surpopulation carcérale est l'objectif que sert un plafonnement : version voisine, 1. |
| P0290 | fabien-roussel | numerique-logiciels-libres-administration | suppr. | 1 | Un pôle public du numérique fondé sur le logiciel libre est une version voisine de l'usage prioritaire par les administrations : 1. |
| P0294 | fabien-roussel | sante-psychologues-rembourses | suppr. | 1 | Intégrer pleinement la santé mentale à une Sécurité sociale remboursant à 100 % : version voisine, 1. |
| P0295 | fabien-roussel | securite-enquetes-policiers-independantes | suppr. | 1 | Une institution indépendante pour les recours contre tout abus des forces de sécurité : version voisine, 1. |
| P0296 | fabien-roussel | securite-pouvoirs-polices-municipales | suppr. | −1 | Refuser que la police municipale devienne le supplétif de la police nationale va contre l'alignement de leurs pouvoirs : -1. |
| P0301 | fabien-roussel | transport-subventionner-fret-ferroviaire | suppr. | 1 | Des investissements publics massifs pour que le fret ferroviaire recule la part de la route : version voisine d'un soutien public, 1. |
| P0310 | florian-philippot | defense-armes-ukraine | suppr. | −1 | Le livret demande de cesser d'entretenir la guerre et cite les livraisons d'armes comme moyen de cet entretien : -1. |
| P0313 | florian-philippot | democratie-champ-referendum-inchange | suppr. | −1 | Un RIC « sur tout sujet » étend le référendum à tous les domaines de la loi, par un autre mécanisme : version voisine du sens contraire, -1. |
| P0314 | florian-philippot | democratie-referendum-exceptionnel | suppr. | −1 | RIC sur tout sujet : sens contraire d'un usage exceptionnel, -1 (même lecture que P0029). |
| P0326 | florian-philippot | energie-nouveaux-reacteurs-au-dela-epr2 | suppr. | 1 | Un plan d'investissement massif dans le nucléaire de nouvelle génération va au-delà du programme actuel : version voisine, 1. |
| P0342 | florian-philippot | international-referendum-maintien-ue | suppr. | 1 | Le livret retient le référendum parmi les voies de sortie et exige sa tenue « en tant que force d'opposition » : version voisine, 1. |
| P0345 | florian-philippot | justice-comparution-immediate-mineurs | suppr. | 1 | Juger et sanctionner les mineurs de façon « concomitante » est une version voisine de la comparution immédiate : 1. |
| P0347 | florian-philippot | justice-majorite-penale-16-ans | suppr. | 1 | Fin de l'excuse automatique de minorité et « qui tue comme un adulte doit être jugé comme un adulte » : version partielle, 1. |
| P0351 | florian-philippot | numerique-alleger-moderation | suppr. | 1 | Le passage vise le règlement DSA, qui porte précisément les obligations de modération : version voisine, 1. |
| P0357 | florian-philippot | societe-aide-active-a-mourir | suppr. | −1 | Refuser l'euthanasie « assumée ou déguisée » des personnes handicapées s'oppose à l'aide active à mourir pour une partie du public visé : version partielle, -1. |
| P0381 | francois-asselineau | environnement-assouplir-artificialisation | suppr. | −1 | Lutter contre l'artificialisation (moratoire sur les zones commerciales) va contre l'assouplissement des objectifs : -1. |
| P0385 | francois-asselineau | fiscalite-hausse-taxe-transactions-financieres | suppr. | 1 | Étendre la taxe à toutes les transactions spéculatives alourdit la taxe sans toucher au taux : version voisine, 1. |
| P0394 | francois-asselineau | international-arrets-cedh-derogation-v2 | suppr. | 1 | Se retirer de certains articles de la Convention pour ne plus être lié par sa jurisprudence migratoire : version voisine, 1. |
| P0400 | francois-asselineau | justice-accompagnement-emploi-detenus | suppr. | 1 | Travail ou formation obligatoire en détention : version voisine d'un accompagnement vers l'emploi, 1. |
| P0413 | francois-asselineau | societe-uniforme-ecole-publique | suppr. | 1 | Favoriser des vêtements neutres pour les élèves est une version partielle de l'uniforme : 1. |
| P0424 | francois-ruffin | agriculture-derogations-neonicotinoides | suppr. | −1 | Le cahier du candidat range la réautorisation des néonicotinoïdes parmi les effets néfastes des lobbies : opposition propre, -1. |
| P0427 | francois-ruffin | agriculture-plafonner-aides-pac | suppr. | 1 | Répartir les aides selon le travail plutôt que les hectares limite la prime aux grandes surfaces : version voisine du plafonnement, 1. |
| P0434 | francois-ruffin | economie-controle-rachats-etrangers | suppr. | 2 | Le contexte immédiat prévoit une étude stratégique publiée pour chaque rachat étranger d'une entreprise stratégique, voire des nationalisations : renforcement direct, 2. |
| P0438 | francois-ruffin | economie-vendre-participations-etat | suppr. | −1 | Refuser « la logique de privatisation » va contre la vente de participations de l'État : -1. |
| P0439 | francois-ruffin | energie-accelerer-eolien-terrestre | suppr. | 1 | Poursuivre le développement de l'éolien : version voisine d'une accélération, 1. |
| P0442 | francois-ruffin | energie-prolonger-reacteurs-60-ans | 1 | 2 | Prolonger les centrales « tant que » l'autorité de sûreté valide leur niveau, sans limite d'âge, couvre l'au-delà de 60 ans sous contrôle de l'ASN : c'est la mesure, 2. |
| P0444 | francois-ruffin | environnement-ecocide-crime | suppr. | 1 | Un délit de faute systémique pour les dirigeants pollueurs est une version voisine de l'écocide : 1. |
| P0445 | francois-ruffin | environnement-plastique-usage-unique-2030 | suppr. | 1 | Réduire le plastique et rétablir la consigne : version voisine d'une interdiction, 1. |
| P0447 | francois-ruffin | fiscalite-impot-fortune-retabli | suppr. | 1 | Dans sa propre tribune, le candidat range le non-rétablissement de l'ISF parmi les refus de « justice fiscale » : soutien implicite, version voisine, 1. |
| P0451 | francois-ruffin | fiscalite-supprimer-impots-production | suppr. | −1 | Juger « sans efficacité » la baisse des impôts de production va contre leur suppression : -1. |
| P0453 | francois-ruffin | institutions-pouvoirs-commissions-enquete | suppr. | 1 | Des moyens renforcés pour que les assemblées enquêtent sur les dérives du pouvoir : version voisine, 1. |
| P0456 | francois-ruffin | numerique-logiciels-libres-administration | suppr. | 2 | Le contexte immédiat fait de la commande publique informatique de l'administration le moteur du logiciel libre et étend le cloud « 100 % UE » aux administrations : 2. |
| P0459 | francois-ruffin | transport-subventionner-fret-ferroviaire | suppr. | 1 | Tripler la part du fret ferroviaire par le renouveau public du rail : version voisine d'un soutien, 1. |
| P0461 | francois-ruffin | travail-durcir-indemnisation-chomage | suppr. | −1 | Le cahier du candidat dénonce les durcissements de l'assurance chômage : opposition propre, -1. |
| P0462 | francois-ruffin | travail-duree-travail-accord-entreprise | suppr. | −1 | Le cahier dénonce la primauté des accords d'entreprise « y compris si les règles négociées sont moins favorables que la loi » : version voisine du sens contraire, -1. |
| P0463 | francois-ruffin | travail-elargir-penibilite-retraite | suppr. | 1 | Le dispositif vise toutes les formes de pénibilité du C3P d'origine (4,4 millions de salariés), au-delà du C2P actuel : version voisine d'un élargissement, 1. |
| P0469 | francois-ruffin | travail-smic-au-dela-inflation | FLAG | 1 | Le SMIC net est d'environ 1 440 € en 2026 : 1 600 € net représente une hausse d'environ 11 %, bien au-delà de l'inflation. |
| P0473 | gabriel-attal | defense-armes-ukraine | suppr. | 1 | Soutenir l'Ukraine « sans relâche » face à la Russie : version voisine d'une hausse des livraisons, 1. |
| P0474 | gabriel-attal | defense-reduire-budget-armees | −1 | −2 | « Continuer à augmenter les moyens de notre défense » est l'opposé explicite d'une réduction : -2. |
| P0488 | gabriel-attal | energie-suspendre-nouvelles-eoliennes | suppr. | −1 | L'énoncé vise toutes les nouvelles éoliennes ; relever l'objectif d'éolien en mer s'y oppose directement : -1 est prudent. |
| P0494 | gabriel-attal | fiscalite-reduire-droits-succession | suppr. | 1 | Une « transmission facilitée du patrimoine entre générations » : version voisine d'une baisse des droits, 1. |
| P0508 | gabriel-attal | justice-supprimer-reductions-automatiques | suppr. | 1 | Suppression des aménagements automatiques pour les multirécidivistes : version partielle et voisine, 1. |
| P0509 | gabriel-attal | justice-tig-delits-sans-violence | suppr. | 1 | Renforcer l'usage des TIG comme sanction : version voisine, 1. |
| P0515 | gabriel-attal | securite-limiter-dissolution-associations | suppr. | −1 | Accélérer la dissolution administrative va en sens contraire d'une limitation de ce pouvoir : -1. |
| P0519 | gabriel-attal | travail-durcir-indemnisation-chomage | suppr. | 1 | Une réforme de l'assurance chômage « qui incite au travail », dans la lignée des réformes du candidat : version voisine d'un durcissement, 1. |
| P0520 | gabriel-attal | travail-duree-travail-accord-entreprise | suppr. | 1 | Plus de liberté au dialogue social pour fixer l'organisation du travail : version voisine, 1. |
| P0521 | gabriel-attal | travail-retraite-au-dela-64-ans | suppr. | −1 | « L'enjeu ne sera plus l'âge de départ » écarte l'âge comme levier : -1. |
| P0522 | gabriel-attal | travail-retraite-capitalisation | FLAG | 2 | La phrase suivante parle explicitement de « capitalisation » : la lecture est confirmée. |


## Après cette revue

- **Partie 3 à soumettre** (Mélenchon et Branco). La consigne du dossier devrait préciser que les intentions d'un candidat rapportées par la presse sont recevables. Seule une mesure attribuée au parti ou à un tiers ne l'est pas.
- **Références décalées.** Les références du dossier datent d'avant cette revue. Les deux suppressions des parties 1 et 2 décalent de deux rangs les positions de la partie 3 dans le corpus actuel. Le retour de la partie 3 devra donc être rapproché par candidat et par énoncé, pas par référence.
- **Total : 1 093 positions** au lieu de 1 102. Toutes restent en brouillon jusqu'à relecture par adrien.
