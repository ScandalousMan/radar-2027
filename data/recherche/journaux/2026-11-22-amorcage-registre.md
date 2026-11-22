# Compte rendu — 2026-11-22-amorcage-registre

Mode : GLOBAL_ENRICHMENT · Auteur : claude (opus) · Dates : 2026-11-22 → 2026-11-22 · État : completed

## 1. Périmètre de recherche

[Fait vérifié] Amorçage du registre `data/recherche/personnalites.yaml` avec les candidats publiés
de `data/corpus/candidates.yaml` qui n'y figuraient pas encore (14 sur 18), **sans recherche web**
(tâche T048, FR-052) : seules les sources de statut déjà enregistrées (`statusSource`) et leur
texte en cache ont été relus. Les 4 candidats enregistrés par les missions de test du même jour
(`bruno-retailleau`, `marine-tondelier`, `edouard-philippe`, `gabriel-attal`) sont conservés tels
quels. Aucun thème ni aucune question.

## 2. Personnalités et thèmes couverts

[Fait vérifié] 14 personnalités, toutes au statut publié `declared`, enregistrées au statut
`DECLARED` à la même date : delphine-batho (2025-11-25), nathalie-arthaud (2025-12-08),
juan-branco (2025-12-19), francois-asselineau (2026-03-21), david-lisnard (2026-03-31),
francois-ruffin (2026-04-10), nicolas-dupont-aignan (2026-04-23), jean-luc-melenchon (2026-05-03),
florian-philippot (2026-05-09), anasse-kazib (2026-06-01), marine-le-pen (2026-07-07),
raphael-glucksmann (2026-08-23), fabien-roussel (2026-09-06), eric-zemmour (2026-09-17).
Aucun thème.

## 3. Sources consultées

[Fait vérifié] Les 14 sources de statut du registre existant, toutes retenues, aucune source
nouvelle (liste complète dans `sourcesConsulted` du journal), par exemple :

- LCP, annonce de Marine Le Pen — https://lcp.fr/actualites/ce-soir-je-suis-candidate-a-l-election-presidentielle-annonce-marine-le-pen-438886
- franceinfo, annonce de Florian Philippot — https://www.franceinfo.fr/elections/presidentielle/presidentielle-2027-le-souverainiste-florian-philippot-annonce-sa-candidature-a-l-elysee_7993346.html
- France 24 (en anglais), annonce de Jean-Luc Mélenchon — https://www.france24.com/en/france/20260503-lfi-s-m%C3%A9lenchon-to-stand-in-2027-french-presidential-election

## 4. Citations et preuves ajoutées

14 preuves `CANDIDACY` (`<id>-candidature-001`), qualité `B_RELIABLE_SECONDARY`, attribution
`PERSONAL_DIRECT`.

- [Citation] Neuf annonces retrouvées mot pour mot dans le texte en cache (`VERIFIED_QUOTE`,
  confiance `HIGH`), notamment :
  - Delphine Batho : « J'ai décidé de me porter candidate à l'élection présidentielle »
    (https://www.linfodurable.fr/lex-ministre-delphine-batho-candidate-la-presidentielle-pour-conjurer-la-rikikisation-de-lecologie) ;
  - Marine Le Pen : « Ce soir, je suis candidate à l'élection présidentielle » (LCP, URL ci-dessus) ;
  - Nicolas Dupont-Aignan : « Je serai candidat en 2027 pour offrir aux Français un sursaut
    gaulliste ! » (message X du 23 avril 2026 reproduit par
    https://info.fr/yerres-dupont-aignan-candidature-presidentielle-2027-sursaut-gaulliste/) ;
  - Éric Zemmour : « Je serai candidat à l'élection présidentielle »
    (https://lcp.fr/actualites/presidentielle-2027-eric-zemmour-officialise-sa-candidature-441871).
- [Paraphrase] Cinq annonces sans phrase citée exploitable (`PARAPHRASE`, confiance `MEDIUM`) :
  juan-branco, francois-asselineau, francois-ruffin, jean-luc-melenchon, fabien-roussel.

## 5. Sources ayant corroboré des éléments existants

Aucun.

## 6. Corrections effectuées

Aucun.

## 7. Doublons évités

[Fait vérifié] Les 4 personnalités déjà présentes (missions de test) n'ont pas été réenregistrées ;
aucune autre preuve existante ne portait sur ces 14 personnalités.

## 8. Éléments non vérifiés ou non résolus

- [Fait vérifié] Jean-Luc Mélenchon : la source enregistrée ne cite l'annonce qu'en anglais
  (« Yes, I am a candidate ») ; une traduction n'est jamais reprise comme citation (FR-020),
  d'où la paraphrase. La formulation française d'origine reste à retrouver.
- [Hypothèse] Raphaël Glucksmann : l'annonce du 23 août 2026 est subordonnée à la primaire
  sociale-démocrate d'octobre 2026, dont l'issue n'a pas été vérifiée.
- [Fait vérifié] Nicolas Dupont-Aignan : info.fr rapporte une première annonce le 8 mars 2025,
  non prouvée ici ; la date publiée (23 avril 2026) est conservée.
- [Fait vérifié] Anasse Kazib : franceinfo parle d'« intention d'être candidat », mais le clip
  cité présente « une candidature ouvrière, communiste et révolutionnaire à la présidentielle » ;
  statut `DECLARED` conforme à la liste publiée.

## 9. Changements de statut de candidature identifiés

Aucun. [Fait vérifié] Les 14 statuts enregistrés sont l'équivalent exact de la liste publiée
(`declared` ↔ `DECLARED`, mêmes dates).

## 10. Contradictions et évolutions de position

Aucun.

## 11. Lacunes documentaires restantes

- `CANDIDACY_UNCERTAIN` — raphael-glucksmann : issue de la primaire d'octobre 2026.
- `REPORTED_UNVERIFIABLE` — jean-luc-melenchon : annonce disponible seulement en traduction.
- [Fait vérifié] Catégories non explorées (amorçage sans recherche web) : sites personnels et de
  campagne, vidéos originales, réseaux sociaux, nouvelles recherches dans la presse.

## 12. Fichiers créés ou modifiés

- Modifié : `data/recherche/personnalites.yaml` (14 entrées ajoutées en fin de liste).
- Créés : `data/recherche/preuves/<id>.yaml` pour les 14 personnalités ;
  `data/recherche/journaux/2026-11-22-amorcage-registre.yaml` et ce compte rendu.

## 13. Arbitrages nécessitant une intervention humaine

- [Interprétation] Vérifier l'issue de la primaire sociale-démocrate d'octobre 2026 pour
  Raphaël Glucksmann : un résultat défavorable appellerait un statut
  `DEFEATED_IN_SELECTION_PROCESS` et un signalement `CANDIDATE_STATUS`, sans modification de
  `candidates.yaml` par la recherche.
- [Interprétation] Les cinq paraphrases et la citation de Mélenchon pourront être renforcées par
  une mission `PERSONALITY` ou `GLOBAL_ENRICHMENT` avec recherche web.
