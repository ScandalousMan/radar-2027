# Compte rendu — 2026-11-22-campagne-branco-immigration

Mode : PERSONALITY · Auteur : claude (opus) · Dates : 2026-11-22 → 2026-11-22 · État : completed

## 1. Périmètre de recherche

- Mission issue de `data:gaps` (spec 009, §13 bis) : Juan Branco (`juan-branco`), thème `immigration`, neuf questions traitées dans l'ordre demandé : `immigration-regularisation-metiers-tension` (+), `immigration-supprimer-droit-du-sol` (−), `immigration-ame-soins-urgents` (−), `immigration-vote-local-etrangers-v2` (+), `immigration-condamnes-perte-titre-sejour` (−), `immigration-prestations-duree-residence` (−), `immigration-voies-legales-travail-ue` (+), `immigration-plafond-annuel-admissions` (−), `immigration-titre-sejour-longue-duree` (+).
- **[Fait vérifié]** 19 requêtes consignées, 12 catégories explorées (corpus existant, presse nationale, agences, entretiens, émissions, vidéos, réseaux sociaux par moteur, site personnel, site du mouvement, site de campagne, publications spécialisées, archives). Recherche non exhaustive (`exhaustive: false`) ; catégories parlementaires et gouvernementales sans objet (aucun mandat).
- Aucune écriture dans `data/corpus/positions/`, `signalements.yaml` ni `personnalites.yaml` (missions parallèles).

## 2. Personnalités et thèmes couverts

- **[Fait vérifié]** `juan-branco`, déjà au registre (`DECLARED`, preuve `juan-branco-candidature-001`), statut publié `declared`. Aucune position publiée sur les neuf questions ; quatre positions immigration relues existent sur d'autres questions (amende, asile hors Europe, regroupement familial, visas qualifiés), toutes issues du même PDF.
- Thème : `immigration` seulement.

## 3. Sources consultées

Retenue :
- **[Fait vérifié]** Programme « La Voie » v9 (Les Ruches, 27 mai 2026), texte en cache, source déjà enregistrée `juan-branco-la-voie-programme-2027` — https://media.ruches.org/projet-1784217879253.pdf

Rejetées (pistes ou sans objet) :
- ruches.org/le-projet, rouverte : renvoie au même PDF — https://ruches.org/le-projet
- Entretien Aurores (cache) et Sud Radio (cache) : aucun propos sur les neuf questions.
- **[Fait vérifié]** Votons 2027 (agrégateur) : toutes ses mesures renvoient à ruches.org/le-projet — https://votons-2027.fr/candidats/branco/programme/immigration
- **[Fait vérifié]** MonVote2027 (domaine `aggregatorDomains`) : « Plutôt contre » sur la fin du droit du sol, la suppression de l'AME et le délai de cinq ans, **sans source citée** — https://monvote2027.fr/candidat/branco
- Thinkerview, 13 mai 2025 : page sans transcription, vidéo non écoutée — https://www.thinkerview.com/juan-branco-sans-filtre-avant-les-presidentielles/
- presidentielle-france.fr et autres comparateurs : vus en extrait seulement, contradictoires entre eux, non ouverts.

Aucune nouvelle source enregistrée (`pnpm data:source fetch` inutile : la seule source primaire pertinente était déjà au registre).

## 4. Citations et preuves ajoutées

- `juan-branco-immigration-001` — question `immigration-regularisation-metiers-tension`, `QUALIFIED_SUPPORT`, `VERIFIED_QUOTE`, A, `PERSONAL_DOCUMENT`, `CURRENT`.
  **[Citation]** « Mise en place de critères objectivables d'intégration concernant les étrangers, accompagnée d'obligations de service à la nation, dans le cadre des régularisations de personnes dénuées de titres de séjour. » (programme, volet Intérieur, fin p. 21) — https://media.ruches.org/projet-1784217879253.pdf
  **[Interprétation]** La mesure présuppose des régularisations de sans-papiers et les encadre (critères d'intégration, service à la nation) ; elle ne vise ni le travail ni les métiers en tension. Sens proposé : **+1**.
- `juan-branco-immigration-002` — question `immigration-titre-sejour-longue-duree`, `QUALIFIED_OPPOSITION`, `VERIFIED_QUOTE`, A, `PERSONAL_DOCUMENT`, `CURRENT`.
  **[Citation]** « … avec conditionnalisation du maintien du statut et des droits afférents à des examens spécifiques en ce qui concerne les exilés de deuxième niveau, et réactualisation quinquennale du titre asilaire pour ces derniers. » (volet Intérieur, p. 22) — même URL.
  **[Interprétation]** Restriction de la durée et de la stabilité du titre pour une partie des bénéficiaires de l'asile (le premier niveau conserve « l'ensemble des prérogatives actuelles ») ; rien sur les autres étrangers réguliers. Sens proposé : **−1**, lecture à confirmer par un humain (population étroite).

## 5. Sources ayant corroboré des éléments existants

Aucun.

## 6. Corrections effectuées

Aucun.

## 7. Doublons évités

- **[Fait vérifié]** « critères objectivables » et « titre asilaire » absents de `data/recherche/preuves/` et `data/corpus/positions/` : aucun doublon ; les positions existantes du même PDF portent d'autres phrases.

## 8. Éléments non vérifiés ou non résolus

- **[Hypothèse]** Les entretiens Thinkerview (2025) peuvent contenir des propos sur l'immigration : non écoutés, aucune transcription.
- Comptes X et Telegram de l'intéressé non consultés directement (authentification) ; recherche par moteur seulement.
- **[Fait vérifié]** Les positions « Plutôt contre » affichées par MonVote2027 (droit du sol, AME, délai de cinq ans) ne citent aucune source ; non reprises.

## 9. Changements de statut de candidature identifiés

Aucun.

## 10. Contradictions et évolutions de position

Aucun. **[Fait vérifié]** Les comparateurs tiers vus en extrait se contredisent entre eux (réduction de l'immigration légale contre ouverture des frontières), mais aucun ne s'appuie sur une source primaire autre que le programme.

## 11. Lacunes documentaires restantes

`NOT_FOUND` consigné avec `question` (19 requêtes, 12 catégories) pour :
- `immigration-supprimer-droit-du-sol` — aucune occurrence de « droit du sol », « nationalité », « naturalisation » dans le programme ;
- `immigration-ame-soins-urgents` — AME absente du programme ;
- `immigration-vote-local-etrangers-v2` — vote traité pour les seuls citoyens ;
- `immigration-condamnes-perte-titre-sejour` — rien sur le retrait du titre ; seulement TIG pour infraction au séjour ;
- `immigration-prestations-duree-residence` — minima sociaux automatiques et RSA déconditionnalisé, sans critère de nationalité ni de résidence (**[Interprétation]** ce silence ne vaut ni soutien ni opposition) ;
- `immigration-voies-legales-travail-ue` — seule une politique nationale d'attractivité des hauts qualifiés ;
- `immigration-plafond-annuel-admissions` — aucun plafond ou quota migratoire.

## 12. Fichiers créés ou modifiés

- `data/recherche/preuves/juan-branco.yaml` (ajout de `juan-branco-immigration-001` et `-002` en fin de liste)
- `data/recherche/journaux/2026-11-22-campagne-branco-immigration.yaml` (créé)
- `data/recherche/journaux/2026-11-22-campagne-branco-immigration.md` (créé)

## 13. Arbitrages nécessitant une intervention humaine

Signalements proposés, **non écrits** dans `signalements.yaml` (consigne de coordination) :
- `POSITION_REVIEW` (position inconnue désormais documentée) — `{ candidate: juan-branco, question: immigration-regularisation-metiers-tension }`, preuve `juan-branco-immigration-001` : « dans le cadre des régularisations de personnes dénuées de titres de séjour » ; transcription en position `draft` à +1 proposée.
- `POSITION_REVIEW` (position inconnue désormais documentée) — `{ candidate: juan-branco, question: immigration-titre-sejour-longue-duree }`, preuve `juan-branco-immigration-002` : « réactualisation quinquennale du titre asilaire pour ces derniers » ; −1 proposé, mais à arbitrer : la mesure ne vise qu'une partie des réfugiés, on peut aussi la juger trop étroite pour l'énoncé (alors `unknown`).
