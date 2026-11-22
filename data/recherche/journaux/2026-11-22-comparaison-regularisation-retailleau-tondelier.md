# Compte rendu — 2026-11-22-comparaison-regularisation-retailleau-tondelier

Mode : COMPARISON · Auteur : claude (opus) · Dates : 2026-11-22 → 2026-11-22 · État : completed

## 1. Périmètre de recherche

- [Fait vérifié] Une seule question : `immigration-regularisation-cinq-ans`, polarité +, énoncé
  « Les étrangers sans titre de séjour présents en France depuis plus de cinq ans doivent pouvoir
  être régularisés. » (`data/corpus/questions/immigration.yaml`).
- [Fait vérifié] Deux personnalités, critères identiques : mêmes six catégories explorées pour
  chacune (`EXISTING_CORPUS`, `NATIONAL_MEDIA`, `GOVERNMENT`, `FULL_INTERVIEWS`, `PARTY_SITE`,
  `CAMPAIGN_SITE`), au moins une requête du même type par catégorie et par personnalité,
  17 requêtes au total. Écart justifié : `SENAT` non exploré (Marine Tondelier n'a jamais été
  parlementaire ; les PPL sénatoriales de Bruno Retailleau sont déjà au corpus).
- [Fait vérifié] Mêmes seuils : `VERIFIED_QUOTE` seulement pour un texte retrouvé mot pour mot dans
  le cache ; citation déjà portée par une position publiée non dupliquée en preuve, pour les deux.
- [Fait vérifié] Validation d'installation (T040) : ni enrichissement global, ni commit, ni
  modification des positions ou de la liste des candidats. Recherche non exhaustive.

## 2. Personnalités et thèmes couverts

- [Fait vérifié] `bruno-retailleau` (déjà au registre, DECLARED au 2026-02-12) : position publiée
  -1 (reviewed) sur la question.
- [Fait vérifié] `marine-tondelier` : entrée créée au registre, statut DECLARED au 2025-10-22,
  conforme à la liste publiée ; position publiée +1 (reviewed) sur la question.
- Thème : `immigration`.

## 3. Sources consultées

- [Fait vérifié] Retenues (texte en cache des sources déjà enregistrées) : Brut, déclaration de
  candidature de Marine Tondelier
  (https://www.brut.media/fr/articles/france/politique/marine-tondelier-la-patronne-des-ecologistes-officiellement-candidate-a-la-presidentielle-de-2027) ;
  livret « Travailler mieux » (https://marinetondelier.fr/s/livret-travail.pdf) ; billet
  « 21 priorités » (https://marinetondelier.fr/blog/21-priorites-gouverner-ensemble-demain) ;
  Maire-info sur la circulaire Retailleau
  (https://www.maire-info.com/immigration/ce-que-contient-la-circulaire-retailleau-sur-la-regularisation-des-etrangers-en-situation-irreguliere-article-29333).
- [Fait vérifié] Écartées : programme des Écologistes et entretien JDD du 31 mai 2026 (citations
  déjà portées par les positions publiées) ; Votons 2027 (agrégateur) ; Public Sénat (extrait de
  moteur seulement).
- [Fait vérifié] Inaccessibles : Légifrance, circulaire/id/45584 (page anti-robot, non
  contournée) ; vie-publique.fr, discours du 17 février 2025 (contenu vide).
- Aucune nouvelle source enregistrée (`pnpm data:source fetch` non utilisé).

## 4. Citations et preuves ajoutées

| Preuve | Qualification | Statut | Qualité | Attribution |
|---|---|---|---|---|
| `marine-tondelier-candidature-001` | CANDIDACY (DECLARED) | VERIFIED_QUOTE | B | PERSONAL_DIRECT, HIGH |
| `marine-tondelier-immigration-001` | QUALIFIED_SUPPORT | VERIFIED_QUOTE | A | PERSONAL_DOCUMENT, HIGH |
| `marine-tondelier-immigration-002` | QUALIFIED_SUPPORT | VERIFIED_QUOTE | A | PERSONAL_DOCUMENT, MEDIUM |
| `bruno-retailleau-immigration-012` | QUALIFIED_OPPOSITION | PARAPHRASE | B | PERSONAL_ACTION, MEDIUM |

- [Citation] candidature-001 : « Cette interview est ma déclaration officielle de candidature à
  l'élection présidentielle » (Brut, 22 octobre 2025). Actualité DATED (plus de douze mois).
- [Citation] immigration-001 : « Régulariser les travailleur·ses sur la base de critères objectifs
  (durée de résidence, effectivité du lien familial, durée ou promesse d'activité
  professionnelle). » (livret de campagne, novembre 2026). [Interprétation] Même sens que
  l'énoncé, mais limité aux travailleurs et sans seuil de durée.
- [Citation] immigration-002 : « Régulariser les travailleurs et les travailleuses sans papiers et
  accorder des titres de séjours pluriannuels automatiquement renouvelables » (billet du
  17 avril 2026). [Interprétation] Même sens, population plus étroite, aucun critère de durée ;
  texte rédigé au nom des Écologistes, d'où une confiance moyenne.
- [Paraphrase] immigration-012 : la circulaire du 23 janvier 2025 signée par Bruno Retailleau porte
  de cinq à sept ans la durée de présence de référence pour l'admission exceptionnelle au séjour.
  Passage de référence : « Il est désormais exigé " une durée de présence d'au moins sept ans " sur
  le territoire français pour juger de l'intégration de la personne, quand la circulaire Valls
  évoquait cinq ans. » (Maire-info). [Interprétation] Opposition au critère de cinq ans, partielle
  puisqu'une régularisation au cas par cas reste possible au-delà de sept ans. Actualité DATED.

## 5. Sources ayant corroboré des éléments existants

Aucun.

## 6. Corrections effectuées

Aucun.

## 7. Doublons évités

- [Fait vérifié] `bruno-retailleau-immigration-006` (« Les régularisations massives sont une fausse
  générosité et un vrai appel d'air. ») : aucune source consultée ne la reprend ; ni doublon ni
  corroboration.
- [Fait vérifié] `bruno-retailleau-immigration-011` : même source Maire-info qu'immigration-012,
  mais autre passage et autre question : preuve distincte.
- [Fait vérifié] Citations des positions publiées non dupliquées, pour les deux candidats : « l'idée
  de régulariser des clandestins qui ont fraudé nos lois est une capitulation. »
  (https://republicains.fr/actualites/2026/05/31/ma-candidature-ira-jusquau-bout/) et
  « Régulariser les travailleur·ses, les étudiant·es et les parents d'enfants scolarisés… »
  (programme des Écologistes, juillet 2026).

## 8. Éléments non vérifiés ou non résolus

- [Hypothèse] Le texte intégral de la circulaire du 23 janvier 2025 (NOR INTK2435521J) n'a pas été
  lu ; le seuil de sept ans est connu par Maire-info.
- [Fait vérifié] Aucune source n'établit si le programme 2027 de Bruno Retailleau maintient le
  seuil de sept ans.
- [Fait vérifié] Issue de la désignation et de la primaire annoncées pour Marine Tondelier non
  vérifiée.

## 9. Changements de statut de candidature identifiés

- [Fait vérifié] Aucun changement. Statut initial de `marine-tondelier` enregistré : DECLARED au
  2025-10-22, conforme à la liste publiée (declared) ; aucun signalement `CANDIDATE_STATUS`.

## 10. Contradictions et évolutions de position

Aucun. [Interprétation] Les qualifications sont cohérentes avec les positions publiées
(QUALIFIED_OPPOSITION pour -1, QUALIFIED_SUPPORT pour +1) : aucun signalement `POSITION_REVIEW`
n'est requis.

## 11. Lacunes documentaires restantes

| Lacune | Bruno Retailleau | Marine Tondelier |
|---|---|---|
| Propos personnel sur le seuil de cinq ans | Non trouvé (`NO_PERSONAL_POSITION`) : 006 vise les régularisations massives espagnoles, 012 est un acte ministériel de 2025 | Non trouvé (`NO_PERSONAL_POSITION`) : documents de campagne sans seuil chiffré, aucun propos oral |
| Type de preuve disponible | Propos d'entretien (006) et acte ministériel en paraphrase (012) | Documents de campagne (001, 002) |
| Source primaire | Circulaire inaccessible (`PRIMARY_INACCESSIBLE`) : Légifrance anti-robot, vie-publique vide | Ouverte (PDF et billet en cache) |
| Actualité | 006 CURRENT (août 2026) ; 012 DATED (janvier 2025) | 001 et 002 CURRENT (2026) |
| Preuve dans le sens opposé | Aucune (`NO_OPPOSING_EVIDENCE`) ; seule nuance : régularisation au cas par cas au-delà de sept ans | Aucune (`NO_OPPOSING_EVIDENCE`) |
| Statut de candidature | DECLARED, preuve du 2026-02-12 (CURRENT) | DECLARED, preuve du 2025-10-22 (DATED) ; désignation et primaire non vérifiées (`CANDIDACY_UNCERTAIN`) |
| Catégories non explorées (identiques) | SENAT, ASSEMBLEE_NATIONALE, SOCIAL_MEDIA, TV_RADIO_DEBATES, ORIGINAL_VIDEOS, PRESS_AGENCIES, FACT_CHECKING, HISTORICAL_ARCHIVES, REGIONAL_MEDIA | idem |

## 12. Fichiers créés ou modifiés

- Créés : `data/recherche/preuves/marine-tondelier.yaml`,
  `data/recherche/journaux/2026-11-22-comparaison-regularisation-retailleau-tondelier.yaml`,
  `data/recherche/journaux/2026-11-22-comparaison-regularisation-retailleau-tondelier.md`.
- Modifiés (ajout en fin de liste) : `data/recherche/personnalites.yaml`,
  `data/recherche/preuves/bruno-retailleau.yaml`.
- Aucune modification de `data/corpus/` (positions, candidats, sources).

## 13. Arbitrages nécessitant une intervention humaine

Aucun signalement créé. [Interprétation] Points à garder en vue sans revue obligatoire : la valeur
-1 de Bruno Retailleau est cohérente avec le relèvement du seuil à sept ans ; la valeur +1 de
Marine Tondelier reste fondée sur des documents qui retiennent la durée de résidence sans fixer de
seuil.
