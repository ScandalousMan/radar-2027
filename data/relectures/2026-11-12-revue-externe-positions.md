# Revue externe des positions — arbitrage du 2026-11-12

Le dossier de revue (`2026-11-11-revue-positions-externe/`) a été soumis à un modèle d'OpenAI par adrien. Le retour reçu couvre les **parties 4 et 5** : Le Pen, Tondelier, Arthaud, Dupont-Aignan et Glucksmann, soit 326 positions (P0777 à P1102). Les parties 1 à 3 (776 positions) n'ont pas encore de retour.

Le relecteur a contesté **75 positions** :

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

## Après cette revue

- **Parties 1 à 3 à soumettre.** Pour la suite, la consigne du dossier devrait préciser que les intentions d'un candidat rapportées par la presse sont recevables. Seule une mesure attribuée au parti ou à un tiers ne l'est pas.
- **Total : 1 095 positions** au lieu de 1 102. Toutes restent en brouillon jusqu'à relecture par adrien.
