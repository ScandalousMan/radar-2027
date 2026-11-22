# Compte rendu — 2026-11-22-audit-retailleau-immigration

Mode : ADVERSARIAL_AUDIT · Auteur : claude (modèle opus) · Dates : 2026-11-22 → 2026-11-22 · État : completed

## 1. Périmètre de recherche

Audit adversarial de trois positions **relues** de Bruno Retailleau (`data/corpus/positions/bruno-retailleau.yaml`) dans le cadre de la validation d'installation T038 : `immigration-supprimer-droit-du-sol`, `immigration-plafond-annuel-admissions`, `immigration-regularisation-metiers-tension`. Pas d'enrichissement global, pas de commit, aucune modification de position.

Méthode suivie : lecture des trois énoncés et du seul champ `quoteSource` ; lecture intégrale des trois textes en cache puis des pages en ligne ; **ensuite seulement** lecture des valeurs, citations et justifications ; recherches de corroboration et de preuves contraires (21 requêtes, 9 catégories). **[Fait vérifié]** Recherche non exhaustive (`exhaustive: false`) : réseaux sociaux, enregistrements audiovisuels, dépêches d'agence et fact-checking non explorés.

## 2. Personnalités et thèmes couverts

`bruno-retailleau` (Les Républicains), thème `immigration`, trois questions. Énoncés exacts :

- **[Citation]** « Le droit du sol doit être supprimé pour l'acquisition de la nationalité française. » (polarité −)
- **[Citation]** « Le Parlement doit fixer chaque année un plafond du nombre d'étrangers admis au séjour. » (polarité −)
- **[Citation]** « Les travailleurs sans titre de séjour employés dans des métiers en tension doivent pouvoir être régularisés. » (polarité +)

## 3. Sources consultées

Retenues :
- Entretien au Figaro reproduit par LR, 2 septembre 2026 : https://republicains.fr/actualites/2026/09/02/en-france-la-seule-cour-supreme-cest-le-peuple-je-lui-donnerai-le-dernier-mot/ (`bruno-retailleau-figaro-constitution-2026-09`).
- PPL constitutionnelle n° 646 rect., Sénat, 25 mai 2023 : https://www.senat.fr/leg/ppl22-646.html.
- Entretien au JDD reproduit par LR, 31 mai 2026 : https://republicains.fr/actualites/2026/05/31/ma-candidature-ira-jusquau-bout/.
- Maire-info, 27 janvier 2025, sur la circulaire du 23 janvier 2025 : https://www.maire-info.com/immigration/ce-que-contient-la-circulaire-retailleau-sur-la-regularisation-des-etrangers-en-situation-irreguliere-article-29333 (**nouvelle source**, enregistrée par `pnpm data:source fetch`).

Inaccessibles : PDF de la circulaire sur Légifrance (https://www.legifrance.gouv.fr/circulaire/id/45584, fiche lue, fichier non récupéré) ; discours du 17 février 2025 sur vie-publique.fr (page vide).

Écartées (contexte) : Public Sénat, 11 décembre 2023 (retrait de la PPL constitutionnelle LR) ; Club des juristes, 9 septembre 2026 (droit du sol, paraphrase) ; Public Sénat, 24 janvier 2025 (circulaire) ; Public Sénat, 9 novembre 2023 (article 4 bis) ; Public Sénat, 17 septembre 2019 (quotas, style indirect).

## 4. Citations et preuves ajoutées

- `bruno-retailleau-immigration-010`, question `immigration-plafond-annuel-admissions`, `QUALIFIED_SUPPORT`, `VERIFIED_QUOTE`, qualité A, `PERSONAL_ACTION` (premier signataire), `DATED`. **[Citation]** « La loi fixe chaque année le nombre maximum d'autorisations d'entrées en vue de séjourner en France et d'autorisations de premier séjour en France délivrées à des ressortissants étrangers. » (art. 6, https://www.senat.fr/leg/ppl22-646.html).
- `bruno-retailleau-immigration-011`, question `immigration-regularisation-metiers-tension`, `QUALIFIED_SUPPORT`, `PARAPHRASE`, qualité B, `PERSONAL_ACTION` (circulaire ministérielle), `DATED`. **[Paraphrase]** La circulaire du 23 janvier 2025 maintient la régularisation par le travail dans les métiers en tension (art. L. 435-4 du CESEDA) et demande aux préfets de privilégier cette voie. Passage de référence : **[Citation]** « le ministre appelle les préfets à privilégier autant que possible la nouvelle » (Maire-info, URL ci-dessus).

## 5. Sources ayant corroboré des éléments existants

Aucune corroboration formelle n'a été enregistrée. **[Fait vérifié]** Le Club des juristes (9 septembre 2026, https://www.leclubdesjuristes.com/en-bref/presidentielle-2027-bruno-retailleau-veut-supprimer-le-droit-du-sol-par-referendum-17273/) confirme en paraphrase l'annonce du 8 septembre 2026, sans réserve ni restriction à Mayotte. Il ne reproduit pas la citation de la position.

## 6. Corrections effectuées

Aucune. Aucune position, aucune preuve existante n'a été modifiée.

## 7. Doublons évités

Les citations des trois positions auditées ne sont pas reprises en preuves, puisqu'elles figurent déjà dans le corpus publié. **[Fait vérifié]** La recherche plein texte (`ppl22-646`, `nombre maximum d'autorisations`, `L435-4`, `maire-info`) dans `data/recherche/preuves/` et `data/corpus/positions/` n'a trouvé aucune preuve existante sur ces passages.

## 8. Éléments non vérifiés ou non résolus

- **[Hypothèse]** La consigne de privilégier l'article L. 435-4 est connue par Maire-info : le texte intégral de la circulaire (NOR INTK2435521J) reste à lire.
- **[Hypothèse]** Le texte retiré par le groupe LR en décembre 2023 (Public Sénat) serait la PPL n° 646. Les articles 2 et 3 supprimés en commission correspondent bien à ceux de la PPL n° 646, mais le dossier législatif n'a pas été ouvert et le sort de l'article 6 est inconnu.
- L'enregistrement original de l'intervention du 8 septembre 2026 sur le droit du sol n'a pas été retrouvé.

## 9. Changements de statut de candidature identifiés

Aucun. Le statut `DECLARED` est inchangé et conforme à `candidates.yaml`.

## 10. Contradictions et évolutions de position

**[Interprétation]** Pour les métiers en tension, il y a une évolution ou une tension entre deux éléments, sans contradiction frontale.

- **[Citation]** Comme ministre, il a pris un acte de janvier 2025 qui maintient et privilégie une régularisation au cas par cas dans les métiers en tension. Il le revendique en 2026 : « le gouvernement veut détricoter ma circulaire sur les régularisations ».
- **[Citation]** Comme candidat, il rejette en mai 2026 la régularisation comme réponse aux pénuries : « On nous explique qu'il faudrait régulariser parce que certains secteurs manquent de main-d'œuvre. Mais on peut former des Français… »

Ce point est traité en revue de position (rubrique 13) et non comme `UNRESOLVED_CONTRADICTION`.

## 11. Lacunes documentaires restantes

- `HISTORICAL_ONLY`, `immigration-plafond-annuel-admissions` : aucun propos de moins de douze mois sur un plafond annuel voté par le Parlement. En 2026, il parle de référendum sur l'immigration et de quotas d'étudiants par filière.
- `PRIMARY_INACCESSIBLE`, `immigration-regularisation-metiers-tension` : texte intégral de la circulaire du 23 janvier 2025 non récupéré.

## 12. Fichiers créés ou modifiés

- `data/recherche/journaux/2026-11-22-audit-retailleau-immigration.yaml` (créé)
- `data/recherche/journaux/2026-11-22-audit-retailleau-immigration.md` (créé)
- `data/recherche/preuves/bruno-retailleau.yaml` (ajout de immigration-010 et 011 en fin de liste)
- `data/recherche/signalements.yaml` (deux signalements `open`)
- `data/corpus/sources/bruno-retailleau.yaml` (une source ajoutée par `pnpm data:source fetch`) et le cache local `.cache/sources/94641140….txt`

## 13. Arbitrages nécessitant une intervention humaine

1. **Droit du sol : pas de signalement.** **[Fait vérifié]** « abolir le droit du sol » est retrouvé mot pour mot dans le cache et en ligne. La phrase complète est **[Citation]** « Expulser tous ceux qui n'ont rien à faire en France, supprimer le droit au mariage pour les OQTF, abolir le droit du sol et revenir à l'assimilation pour qu'il n'y ait plus de naturalisations automatiques. » C'est un propos personnel du 2 septembre 2026, actuel et sans réserve. **[Interprétation]** La valeur +2 est cohérente avec l'énoncé.
2. **`sig-2026-11-22-retailleau-plafond-annuel-actualite`** (`POSITION_REVIEW`). La citation est exacte, mais la valeur +2 repose sur un texte collectif de 2023, peut-être retiré, sans corroboration récente. Le texte exclut en outre « les personnes qui demandent l'asile » et les ressortissants UE, EEE et suisses : sa portée est plus étroite que l'énoncé.
3. **`sig-2026-11-22-retailleau-metiers-tension-circulaire`** (`POSITION_REVIEW`). La citation est exacte et l'opposition de principe de 2026 est réelle. Mais sa circulaire de 2025 maintient et privilégie la régularisation au cas par cas dans les métiers en tension. Il faut trancher entre −2 et −1.

Aucun signalement `QUOTE_DISCREPANCY` : les trois citations sont retrouvées telles quelles.
