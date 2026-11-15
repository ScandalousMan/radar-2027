# Tasks: Thème Éducation

**Input**: Design documents from `/specs/006-theme-education/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/corpus-delta.md, contracts/campagne-files.md, quickstart.md

**Tests**: demandés par le plan (Testing) et le contrat `corpus-delta.md` (section « Tests attendus ») : test unitaire et fixture de la règle `AXIS-DIM`, cas de schéma, non-fuite de la projection publiée, test de rejeu des liens v1 (SC-006), contrôle des quotas sur la banque v2 (SC-007).

**Organization**: tâches groupées par user story. L'ordre d'exécution suit la décision du 2026-11-15 (sources **avant** énoncés) : la User Story 2 est coupée en deux phases (sources, puis positions) de part et d'autre de la User Story 3 ; la User Story 1, valeur visible, se vérifie sur la version publiée par la User Story 4.

**Conventions communes à toutes les tâches** :

- Lancer Vitest avec `</dev/null` (sinon il attend une entrée).
- Si un script Spec Kit a besoin de `jq`, retirer les shims asdf du `PATH` (`/usr/bin/jq` fonctionne).
- Aucune exécution de `pnpm data:extract` (extraction payante interdite) : les positions sont extraites en session par l'agent.
- Contributeurs : `claude` (auteur des énoncés, sources et positions), `adrien` (relecteur). Les tâches « relecture adrien » sont préparées par l'agent, qui présente le lot à relire et applique `pnpm data:review … --by adrien` seulement sur décision d'adrien.
- Specs et fichiers de campagne en français ; identifiants en kebab-case ASCII.
- Trois branches / PR (plan, « Découpage en pull requests ») : **code** = `006-theme-education` (PR #21) ; **données** = `006-education-donnees`, créée depuis `main` après fusion de la PR #21 ; **publication** = `006-publication-v2`, créée depuis `main` après fusion de la PR de données.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: parallélisable (fichiers différents, aucune dépendance sur une tâche non terminée)
- **[Story]**: user story de la tâche (US1, US2, US3, US4)

---

## Phase 1: Setup (branche de code `006-theme-education`)

**Purpose**: confirmer l'état de départ avant de modifier le pipeline.

- [X] T001 Vérifier sur la branche `006-theme-education` que `pnpm install` est à jour, que `.cache/sources/` est présent et que `pnpm data:validate` passe sur le corpus v1 sans faute ; noter le nombre d'avertissements actuel pour comparaison (rapport `data/reports/validation.md`, ne pas committer le rapport s'il n'est pas suivi)
- [X] T002 [P] Confirmer l'hypothèse R1 de research.md : `grep -rn "energie\|education\|travail" src/ --include='*.ts' --include='*.tsx'` hors tests et fixtures ne renvoie aucun identifiant de thème codé en dur ; si une liste fixe de thèmes apparaît (icône, traduction, test), ajouter une tâche d'extension dans la Phase 2 de ce fichier `specs/006-theme-education/tasks.md`

---

## Phase 2: Foundational — outillage de l'axe à dimensions et amendements (PR de code)

**Purpose**: rendre le corpus capable de déclarer l'axe à trois dimensions (FR-002a) et de le faire vérifier par la validation ; amender 002 et 003 (FR-004, FR-012).

**⚠️ CRITICAL**: aucune tâche de la PR de données (Phases 3 et suivantes) ne commence avant la fusion de cette PR dans `main`.

### Tests (écrits d'abord, en échec avant l'implémentation)

- [X] T003 [P] Ajouter dans `scripts/data/lib/schema/schema.test.ts` les cas du contrat `corpus-delta.md` : thème avec `dimensions` de 2 ou 3 éléments accepté ; `dimensions` à 1 élément refusé ; identifiants de dimension en double refusés ; clé inconnue dans une dimension refusée (schéma strict) ; `label` de plus de 60 caractères refusé ; question avec `dimension: choix` acceptée ; question sans `dimension` toujours acceptée
- [X] T004 [P] Créer `scripts/data/lib/rules/AXIS-DIM.test.ts` sur le modèle de `scripts/data/lib/rules/FR-012.test.ts` (helpers de `scripts/data/lib/rules/testing.ts`) : un cas par ligne du tableau `AXIS-DIM` du contrat (1 dimension sans dimensions déclarées, 2 dimension inconnue, 3 question active sans dimension, 4 dimension avec moins de 3 questions actives, 5 thème sous `maxPriorityQuota`) avec entité désignée (`question` ou `theme`) et forme du message ; une question `draft` sans dimension ne produit rien ; un thème à dimensions sans question active ne déclenche ni le cas 4 ni le cas 5 ; un corpus conforme sans thème à dimensions ne produit rien (non-régression des 17 thèmes) ; `maxPriorityQuota` vaut 13 pour une banque active de 18 thèmes de taille réaliste (≈ 310 questions) en mode complet
- [X] T005 [P] Ajouter dans `scripts/data/publish.test.ts` un test de non-fuite : un corpus dont un thème déclare `dimensions` et une question porte `dimension` produit un `main.json` (et des fichiers de détail) sans clé `dimensions` ni `dimension`

### Implémentation

- [X] T006 [P] Étendre `scripts/data/lib/schema/themes.ts` : clé facultative `dimensions: z.array(z.strictObject({ id: IdSchema, label: z.string().min(1).max(60), negative: z.string().min(1), positive: z.string().min(1) })).min(2).optional()` avec un `superRefine` (ou `.refine`) qui refuse les `id` en double ; réutiliser `IdSchema` de `scripts/data/lib/schema/common.ts`
- [X] T007 [P] Étendre `scripts/data/lib/schema/questions.ts` : clé facultative `dimension: IdSchema.optional()` ; vérifier que le type exporté par `scripts/data/lib/schema/index.ts` expose les deux champs
- [X] T008 Implémenter `scripts/data/lib/rules/AXIS-DIM.ts` (export `AXIS_DIM`, type `Rule` de `scripts/data/lib/rules/types.ts`) selon le contrat : cas 1 à 3 sur toutes les questions (cas 3 seulement pour `status: active`) en lisant le thème principal `themes[0]` ; cas 4 et 5 pour chaque thème actif à dimensions ayant au moins une question active de thème principal ; `maxPriorityQuota` = maximum, sur toutes les combinaisons de 3 indices prioritaires contenant l'indice du thème, de `computeQuotas(bank, 'full', priorities)[indice]`, en important `computeQuotas` de `src/core/selection/quotas.ts` (via l'alias `@/core/...` utilisé par les scripts) et en construisant la `BankVersion` depuis les thèmes actifs triés par `order` et les questions actives, comme le fait la construction de banque existante (`scripts/data/lib/stats.ts` / `scripts/data/lib/publish/build.ts` : réutiliser leur helper s'il existe, sinon en extraire un dans `scripts/data/lib/bank.ts` sans changer leur comportement) ; messages au format du tableau, sévérité `error` (dépend de T006, T007)
- [X] T009 Enregistrer `AXIS_DIM` dans `scripts/data/lib/rules/index.ts` juste après `FR_012` (dépend de T008)
- [X] T010 [P] Créer la fixture `data/fixtures/violations/AXIS-DIM/corpus/` sur le modèle de `data/fixtures/violations/FR-012/corpus/` : corpus minimal valide pour toutes les autres règles, dont un thème déclare 2 dimensions et une question active n'a pas de `dimension` ; vérifier que le test des fixtures existant (une fixture par règle, SC-001 de la 002) la découvre et attend `AXIS-DIM` (dépend de T009)
- [X] T011 Lancer `pnpm vitest run scripts/data/lib/rules/AXIS-DIM.test.ts scripts/data/lib/schema/schema.test.ts scripts/data/publish.test.ts </dev/null` puis `pnpm data:validate --corpus data/fixtures/violations/AXIS-DIM` (sortie non nulle, faute `AXIS-DIM`) puis `pnpm data:validate` (aucune faute nouvelle sur le corpus v1) et `pnpm vitest run scripts/data/validate.perf.test.ts </dev/null` (budget de performance tenu) ; corriger jusqu'au vert (dépend de T003–T010)

### Amendements de spec et documentation

- [X] T012 [P] Amender `specs/002-corpus-ontologie-pipeline/spec.md` : FR-002 et scénarios qui citent « seize thèmes » / « 16 thèmes » → renvoi à la liste de l'ontologie (18 thèmes après la 006, dont `energie` ajouté le 2026-11-09 et `education`) ; FR-012 cible « 250 à 320 énoncés actifs » ; ajouter dans Assumptions un amendement daté du 2026-11-15 qui renvoie à la spec 006 (FR-004, FR-012) et mentionne la règle `AXIS-DIM` ; ne modifier aucune autre exigence
- [X] T013 [P] Mettre à jour `specs/003-domaine-score-selection-codec/spec.md` là où « 16 thèmes » est donné comme valeur actuelle de `T` : renvoi au nombre de thèmes de la version de banque (18 en version 2), sans changer aucune formule ni aucun exemple chiffré qui illustre une formule
- [X] T014 [P] Mettre à jour `data/README.md` : 18 thèmes, nouveau dossier `data/campagnes/` (journaux de campagne et dossiers de rédaction), clés facultatives `dimensions` (thème) et `dimension` (question), règle `AXIS-DIM`
- [ ] T015 Committer la PR de code sur `006-theme-education` (commits séparés : schémas + règle + tests + fixture ; amendements de specs ; README), pousser, mettre à jour la description de la PR #21, attendre la CI verte puis la fusion par le propriétaire (dépend de T011–T014)

**Checkpoint**: le pipeline accepte et vérifie les dimensions ; `main` contient l'outillage. La PR de données peut commencer.

---

## Phase 3: User Story 2 (1re partie) — Campagne de sources Éducation (Priority: P1)

**Goal**: pour chacun des 18 candidats déclarés, des sources éducation attribuables (FR-013a) enregistrées au corpus avec leur texte en cache, ou la trace d'une recherche sans résultat (FR-010, SC-003).

**Independent Test**: `pnpm data:source check` concorde ; `data/campagnes/education/sources.md` a 18 sections, chacune conclue par des sources retenues ou « cherché sans résultat » avec la liste consultée ; les corrections connues de research.md R2 sont appliquées.

**Branche**: créer `006-education-donnees` depuis `main` (PR #21 fusionnée).

- [X] T016 [US2] Créer la branche `006-education-donnees` depuis `main` à jour et le squelette `data/campagnes/education/sources.md` selon `contracts/campagne-files.md` : titre, paragraphe « Entrées », une section par candidat dans l'ordre de `data/corpus/candidates.yaml` (edouard-philippe, marine-tondelier, delphine-batho, nathalie-arthaud, juan-branco, bruno-retailleau, francois-asselineau, david-lisnard, francois-ruffin, nicolas-dupont-aignan, jean-luc-melenchon, florian-philippot, gabriel-attal, anasse-kazib, marine-le-pen, raphael-glucksmann, fabien-roussel, eric-zemmour), chacune avec un tableau vide et « Conclusion : à faire »
- [X] T017 [US2] Relire les sources du corpus v1 qui traitent d'éducation (FR-011 ; 14 sources de 9 candidats selon la spec) : les repérer dans `data/corpus/sources/*.yaml` et leur texte dans `.cache/sources/` (recherche de « école », « éducation », « enseignant », « lycée », « université », « Parcoursup », « collège », « laïcité ») ; consigner chaque source relue dans la section du candidat de `data/campagnes/education/sources.md` (origine `corpus`, décision `relue`, passages utiles notés pour l'inventaire)
- [X] T018 [P] [US2] Enregistrer les sources écrites ChatGPT retenues sans difficulté d'accès (research.md R2) avec `pnpm data:source fetch "<url>" --candidate <id> --kind <kind> --title "<titre>" --published <date>` : Batho « Protéger l'école… » (delphinebatho.fr, `programme`) ; Lisnard programme éducation (unenouvelleenergie.fr, `programme`, `--published 2026`) et entretien JDNews reproduit (`declaration_vote`) ; Mélenchon plan ESR (melenchon2027.fr, `programme`) ; Le Pen discours d'Orléans (marinelepen.com, `declaration_vote`) ; Roussel lettre aux personnels (pcf.fr) ; Arthaud discours du 26/09 (lutte-ouvriere.org) seulement si un passage porte une mesure ; Batho entretien Reporterre seulement si un passage porte un engagement (sinon `écartée`, motif `sans mesure`) ; pour chacune, vérifier dans le texte en cache que la citation proposée existe (Roussel : citer « La baisse démographique, à ce titre, ne doit pas être utilisée pour faire des économies. ») et consigner décision et corrections dans `data/campagnes/education/sources.md`
- [X] T019 [P] [US2] Enregistrer les sources protégées par Cloudflare via `--from-file` : Tondelier dossier de rentrée des Écologistes (localiser le PDF lié qui contient « 15% en 5 ans » via Wayback ou le navigateur intégré ; enregistrer le PDF, pas la page) ; Kazib revolutionpermanente.fr du 06/11 (URL sans `?var_mode=calcul` ; vérifier la signature : si l'article n'est pas signé par Kazib, seules ses citations directes sont attribuables, sinon écarter avec `non attribuable (FR-013a)`) ; déposer le texte copié dans `.cache/education/` puis `pnpm data:source fetch "<url>" --from-file <fichier> …` ; consigner dans `data/campagnes/education/sources.md`
- [X] T020 [US2] Transcriptions de la vidéo franceinfo « Nos services publics » `lxUYRSdmSQw` (research.md R3) : récupérer les sous-titres par la piste `captionTracks` de la page YouTube (requête HTTP simple ; à défaut le panneau « Transcription » du navigateur intégré) ; pour chacun des 7 candidats (Attal 00:22:32, Roussel 01:29:59, Glucksmann 02:22:02, Zemmour 03:43:46, Retailleau 04:15:55, Philippe 06:12:19, Mélenchon 07:19:32), délimiter le passage éducation (début et fin), écrire `.cache/education/transcriptions/<candidat>-franceinfo-services-publics.txt` avec en-tête (vidéo, passage, orateur, origine des sous-titres automatiques/manuels), puis `pnpm data:source fetch "https://www.youtube.com/watch?v=lxUYRSdmSQw&t=<secondes>s" --candidate <id> --kind declaration_vote --title "Entretien franceinfo « Nos services publics », passage de <Nom> (<début>–<fin>)" --published <date de diffusion réelle> --from-file <fichier>` ; une source par candidat ; consigner dans `data/campagnes/education/sources.md` avec la mention « transcription automatique, à confirmer à l'écoute »
- [ ] T021 [US2] Transcriptions des autres vidéos ChatGPT, même procédure que T020 : Philippe Dailymotion `xbpdk16` (BFM, mouvement lycéen) ; Dupont-Aignan Dailymotion `xbqmk46` (BFM, méritocratie) ; Arthaud YouTube `1XFZCweX4Hg` 05:12 (titre corrigé : réunion publique à Saint-Quentin) et `Sa1W6lgDy0g` 08:39 ; Zemmour YouTube `Ax-VfNPXjKw` (CNews) ; Glucksmann YouTube `XAaIJdP-1vo` 00:32 (titre et date corrigés : 3e débat de la primaire de la gauche Choisir 2027 publié par le PS) ; Tondelier YouTube `1WaKtpggqG4` 00:08:30 et `F6XumBLtjyA` 01:35 (écarter avec `citation introuvable` ou `hors sujet` si le passage éducation n'existe pas) ; Dailymotion : URL avec `?start=<secondes>`, sous-titres de l'API s'ils existent, sinon demander la transcription à adrien et laisser la ligne « en attente » ; consigner chaque décision dans `data/campagnes/education/sources.md`
- [X] T022 [US2] Ruffin : comparer la page nouspresident.fr « Éducation : une école de tous les savoirs » au texte en cache du Cahier n°8 déjà au corpus ; n'enregistrer la page que si le contenu diffère (sinon `écartée`, motif `doublon de contenu`) ; Asselineau : consigner la table ronde UPR `écartée` (il anime) ; mettre à jour `data/campagnes/education/sources.md`
- [X] T023 [US2] Recherche complémentaire (research.md R7) pour les candidats sans source éducation précise après T017–T022 (au minimum Branco, Asselineau, Ruffin, Philippot ; probablement Le Pen, Batho, Arthaud, Kazib) : lancer en parallèle l'agent `political-source-researcher` (un par candidat ou par groupe) avec la consigne FR-013a (programme, livre/plateforme signée, déclaration ou vote du candidat ; pas de proposition de loi seulement cosignée, pas de programme de coalition, pas d'article qui paraphrase, pas d'agrégateur) et le périmètre FR-005 ; vérifier chaque proposition (URL accessible, citation dans le texte téléchargé, absence de doublon d'URL contre `data/corpus/sources/`) puis l'enregistrer avec `pnpm data:source fetch` ; consigner chaque source examinée (retenue ou écartée avec motif) dans `data/campagnes/education/sources.md`
- [X] T024 [US2] Clore le journal `data/campagnes/education/sources.md` : pour chacun des 18 candidats, ligne « Conclusion » (n sources retenues, ou « cherché sans résultat » avec la liste des sources consultées) ; lancer `pnpm data:source check` (empreintes concordantes) et `pnpm data:validate` (aucune faute sur les sources nouvelles) ; committer sur `006-education-donnees` (« data(006): campagne de sources Éducation ») (dépend de T017–T023)

**Checkpoint**: SC-003 satisfait ; toutes les sources éducation sont au corpus avec texte en cache. La rédaction des énoncés peut commencer.

---

## Phase 4: User Story 3 — Axe et énoncés tirés des positions (Priority: P1)

**Goal**: le thème `education` dans l'ontologie avec son axe à trois dimensions, et 13 à 17 énoncés actifs tirés des mesures des candidats, neutres, équilibrés et relus par adrien (FR-001 à FR-009, SC-002).

**Independent Test**: `pnpm data:validate` accepte le thème : aucune faute `FR-012` (polarités 40–60 %), `AXIS-DIM` (≥ 3 par dimension, ≥ 13 au total), `FR-009`/`FR-010` (longueur, grille, relecteur ≠ auteur) ; Éducation est 18e dans `data/reports/validation.md` ; le dossier `data/campagnes/education/enonces.md` relie chaque énoncé à ses sources.

- [X] T025 [US3] Ajouter le thème `education` à la fin de `data/corpus/themes.yaml` exactement selon `contracts/corpus-delta.md` (libellé, description de FR-001, axe de R5, dimensions `choix`, `moyens`, `pedagogie`, `order: 17`, `status: active`) ; passer `bankMax` de 300 à 320 dans `data/corpus/governance.yaml` (FR-012) ; vérifier que les 17 thèmes existants gardent leur `order`
- [X] T026 [US3] Dresser l'inventaire des mesures dans `data/campagnes/education/enonces.md` (squelette de `contracts/campagne-files.md`) : une ligne `M01…Mnn` par mesure précise trouvée dans les textes en cache des sources éducation (Phase 3 et sources relues du corpus) avec candidat, identifiant de source, citation courte retrouvée mot pour mot, dimension, sens attendu sur l'axe (+/−), sous-thème du périmètre FR-005 ; appliquer les conventions du 2026-11-09 (phrase vague → pas de mesure ; renvoi à un référendum ou une convention → pas de mesure)
- [X] T027 [US3] Rédiger dans `data/campagnes/education/enonces.md` les fiches de 15 à 19 énoncés candidats (marge pour la revue) : regrouper les mesures opposées ; ne retenir un énoncé que s'il a au moins une mesure attendue de chaque côté (FR-008) ; texte ≤ 200 caractères, affirmation unique, sans double négation, terme connoté, présupposition ni nom de personne ou de parti, vocabulaire propre au candidat retiré (002 FR-009) ; viser au moins 4 énoncés par dimension, polarités proches de 50 %, aucun sous-thème au-delà de 25 % ; pistes de research.md R6 (financement suivant le choix des familles ↔ mixité, Parcoursup ↔ sélection, revalorisation chiffrée, plan de recrutement, postes et baisse démographique, effectifs en primaire, méthodes de lecture, certificat de fin de primaire, contrôle continu, calendrier scolaire), plus laïcité, écrans, instruction en famille, école inclusive, éducation prioritaire et petite enfance si l'inventaire le permet ; un énoncé qui touche deux dimensions est rattaché à celle de son objet principal ; remplir le bilan provisoire
- [X] T028 [US3] Revue adverse des fiches par un second modèle (FR-009) : lancer un sous-agent (modèle différent de l'auteur, par exemple `sonnet`) avec la grille de neutralité de 002 FR-009, la règle FR-008 et les textes en cache des sources citées, sans lui donner l'avis de l'auteur ; consigner sa décision par fiche dans `data/campagnes/education/enonces.md` (« Revue adverse : … »), reformuler ou écarter (motif dans « Énoncés écartés »)
- [X] T029 [US3] Écrire `data/corpus/questions/education.yaml` : une entrée par énoncé retenu (13 à 17), `id` `education-<slug>`, `text`, `themes: [education]` (ou `[education, <autre>]` si Éducation est principal et l'autre secondaire), `dimension`, `polarity`, `status: draft`, `author: claude`, avec un commentaire YAML au-dessus de chaque entrée qui nomme la dimension et les sources motivantes (renvoi à `data/campagnes/education/enonces.md`) ; lancer `pnpm data:validate` (aucune faute de schéma ni `AXIS-DIM` cas 1–2)
- [X] T030 [US3] Relecture par adrien des énoncés (activation) : présenter les 13 à 17 énoncés, l'axe et les libellés des dimensions de `data/corpus/themes.yaml` (formulation à valider, FR-002) ; appliquer ses décisions (reformulation, écart, validation de l'axe) ; pour chaque énoncé validé, passer à `status: active` avec grille de neutralité cochée, `reviewedBy: adrien` et `reviewedAt` par le mécanisme existant de la 002 (script de relecture des questions s'il existe, sinon édition conforme à `contracts/corpus-files.md` de la 002) dans `data/corpus/questions/education.yaml` ; consigner « Relecture adrien : … » dans chaque fiche de `data/campagnes/education/enonces.md`
- [X] T031 [US3] Lancer `pnpm data:validate` : aucune faute `FR-012`, `AXIS-DIM`, `FR-009`, `FR-010` ; Éducation 18e dans `data/reports/validation.md` ; vérifier à la main dans le bilan de `data/campagnes/education/enonces.md` : au plus 17 actifs, ≥ 3 par dimension, polarités 40–60 %, aucun sous-thème > 25 %, chaque actif avec une mesure de chaque côté ; committer (« data(006): thème Éducation et énoncés ») (dépend de T025–T030)

**Checkpoint**: le thème et ses énoncés actifs sont valides ; les positions peuvent être extraites.

---

## Phase 5: User Story 2 (2e partie) — Positions Éducation des 18 candidats (Priority: P1)

**Goal**: positions extraites en session par l'agent sur chaque énoncé Éducation, chacune appuyée sur une citation retrouvée mot pour mot, puis relues par adrien (FR-011, SC-004, SC-005).

**Independent Test**: `pnpm data:validate` sans faute de citation ; au moins 12 candidats ont 2 positions Éducation relues ou plus ; chaque position connue cite une source attribuable dont le texte en cache contient la citation.

- [ ] T032 [P] [US2] Extraire en session les positions des candidats du premier groupe (edouard-philippe, marine-tondelier, delphine-batho, nathalie-arthaud, juan-branco, bruno-retailleau) dans `data/corpus/positions/<candidat>.yaml` : pour chaque énoncé Éducation actif et chaque source éducation du candidat (nouvelles et déjà au corpus, FR-011), position en `draft` avec `source`, citation ≤ 300 caractères copiée du texte en cache, `justification` (timecode « à hh:mm:ss » pour une transcription), niveau de preuve ; conventions du 2026-11-09 (mesure plus large → ±1 ; référendum/convention → pas de position ; phrase vague → inconnue) ; ne pas créer de position sans citation
- [ ] T033 [P] [US2] Même extraction pour le deuxième groupe (francois-asselineau, david-lisnard, francois-ruffin, nicolas-dupont-aignan, jean-luc-melenchon, florian-philippot) dans `data/corpus/positions/<candidat>.yaml`
- [ ] T034 [P] [US2] Même extraction pour le troisième groupe (gabriel-attal, anasse-kazib, marine-le-pen, raphael-glucksmann, fabien-roussel, eric-zemmour) dans `data/corpus/positions/<candidat>.yaml`
- [ ] T035 [US2] Lancer `pnpm data:validate` (citations retrouvées mot pour mot, `FR-017`, `FR-017-quote`, `FR-017-evidence` sans faute) ; compter par candidat les positions Éducation en brouillon ; si moins de 12 candidats ont au moins 2 positions, revenir à T023 pour les candidats manquants (recherche ciblée par énoncé) puis compléter T032–T034 ; committer les brouillons (« data(006): positions Éducation en brouillon ») (dépend de T032–T034)
- [ ] T036 [US2] Préparer la relecture d'adrien : liste par candidat des positions en brouillon avec citation, justification et lien (avec timecode pour les vidéos) ; signaler en tête les positions tirées d'une transcription automatique à confirmer à l'écoute ; si l'écoute corrige une transcription, mettre à jour le fichier de `.cache/education/transcriptions/`, re-déposer le texte en cache et l'empreinte (`pnpm data:source` selon la procédure de la 002) **avant** la relecture de la position
- [ ] T037 [US2] Appliquer les décisions d'adrien avec `pnpm data:review <candidat> <question> --by adrien` (positions relues) ou les marquer contestées / les corriger selon ses retours ; ne jamais relire à sa place ; vérifier après chaque lot que la mise en forme et les commentaires YAML de `data/corpus/positions/*.yaml` sont conservés (correctif de la PR #20)
- [ ] T038 [US2] Lancer `pnpm data:validate` ; relever dans `data/reports/validation.md` le nombre de candidats avec au moins 2 positions Éducation relues (cible SC-004 : ≥ 12) et les énoncés au pouvoir discriminant nul ; les inscrire dans « Énoncés non discriminants » du bilan de `data/campagnes/education/enonces.md` et faire trancher adrien (garder, ou écarter par passage à un statut retiré avant publication ; une reformulation repasse par T029–T031) (US3 scénario 5, FR-008)
- [ ] T039 [US2] Committer (« data(006): positions Éducation relues »), pousser `006-education-donnees`, ouvrir la PR de données vers `main` (description : sources retenues/écartées, effectifs par dimension et polarité, SC-003, SC-004 atteint ou non, renvoi aux deux fichiers de campagne) ; attendre la CI verte et la fusion par le propriétaire

**Checkpoint**: corpus prêt à publier ; SC-002 à SC-005 vérifiables dans la PR de données.

---

## Phase 6: User Story 4 — Publier la version 2 sans casser les liens v1 (Priority: P2)

**Goal**: version 2 de la banque publiée avec 18 thèmes ; les liens v1 rejoués sur la version 1 donnent des résultats identiques (FR-013, SC-006).

**Independent Test**: le test de rejeu des 20 liens v1 passe avant et après la publication ; `versions.json` désigne la version 2 ; la page Méthodologie de la version 2 montre 18 thèmes.

- [ ] T040 [US4] Sur la branche `006-publication-v2` créée depuis `main` (PR de données fusionnée), **avant toute publication**, construire `src/lib/results/replay-v1.fixture.json` : 20 fragments de partage v1 (modes complet et court, combinaisons variées de 3 à 5 thèmes, réponses variées dont « sans avis ») produits avec l'encodeur du codec existant sur la banque `public/data/versions/1`, chacun avec son résultat attendu (classement, scores globaux et par thème) calculé avec le chemin de résultats actuel ; documenter dans le fichier la date et la méthode de génération
- [ ] T041 [US4] Écrire `src/lib/results/replay-v1.test.ts` (R8) : charger chaque fragment de `src/lib/results/replay-v1.fixture.json` depuis le disque par le chemin de rejeu réel (choix de la version par l'en-tête du fragment, chargement via `src/lib/results/load.ts` pointé sur `public/data/versions/`) et comparer au résultat attendu ; lancer `pnpm vitest run src/lib/results </dev/null` : vert avant publication (dépend de T040)
- [ ] T042 [US4] Lancer `pnpm data:publish --dry-run` : vérifier dans le diff 18 thèmes, les énoncés Éducation ajoutés avec `introducedIn: 2`, aucun retrait d'énoncé v1, budgets `PUB-BUDGET` respectés (`main.json` ≤ 300 Kio, chaque fichier de détail ≤ 150 Kio) et absence des clés `dimensions`/`dimension` dans la projection
- [ ] T043 [US4] Lancer `pnpm data:publish` : `public/data/versions/2/` créé, `public/data/versions.json` désigne la version 2 comme courante, fichiers de `public/data/versions/1/` inchangés (`git diff --stat public/data/versions/1` vide, `PUB-IMMUTABLE`) ; vérifier que les commentaires YAML des questions et positions sont conservés (dépend de T042)
- [ ] T044 [US4] Relancer `pnpm vitest run src/lib/results </dev/null` après publication : les 20 liens v1 donnent des résultats identiques (SC-006) (dépend de T041, T043)
- [ ] T045 [US4] Vérifier la page Méthodologie (`src/app/methodologie/page.tsx` lit la version courante) avec `pnpm build && pnpm start:static` dans le navigateur intégré : 18 thèmes dans l'ordre canonique, Éducation en dernier avec sa description et son axe ; capture d'écran comme preuve

**Checkpoint**: version 2 publiée localement ; liens v1 stables.

---

## Phase 7: User Story 1 — Choisir l'éducation comme sujet prioritaire (Priority: P1)

**Goal**: sur la version 2, Éducation se choisit comme sujet prioritaire, reçoit son quota et produit un score par candidat (FR-014, SC-001, SC-007).

**Independent Test**: questionnaire complet avec Éducation + deux thèmes : 12 ou 13 énoncés Éducation ; résultats avec score Éducation (ou « — ») et couverture « x sur y » ; Éducation dans les sujets clés de la fiche candidat.

- [ ] T046 [P] [US1] Écrire `src/lib/results/bank-v2-quotas.test.ts` (SC-007) : charger la banque `public/data/versions/2` depuis le disque, vérifier 18 thèmes avec `education` en dernier, puis pour toutes les combinaisons de 3 à 5 sujets prioritaires parmi 18 (12 444 combinaisons) et les deux modes, que la sélection de `src/core/selection` respecte les quotas de `computeQuotas` sans débordement ; vérifier en particulier qu'Éducation prioritaire en mode complet avec 3 sujets reçoit 12 ou 13 énoncés et qu'en mode court non prioritaire elle entre dans l'agrégat « autres thèmes » ; lancer avec `</dev/null` (garder la durée raisonnable : < 30 s)
- [ ] T047 [US1] Parcours dans le navigateur intégré sur `pnpm build && pnpm start:static` (quickstart §6) : (1) Éducation est le dernier thème du choix des sujets, avec sa description, et se sélectionne ; (2) Éducation + deux thèmes en mode complet → compter 12 ou 13 énoncés Éducation ; (3) résultats : score Éducation (ou « — ») et couverture « x positions connues sur y » par candidat, comparaison et détail par question ; fiche candidat avec Éducation parmi les sujets clés ; (4) ouvrir un lien v1 de `src/lib/results/replay-v1.fixture.json` : mêmes résultats, 17 thèmes ; (5) lancer un nouveau questionnaire : version 2 ; captures d'écran à l'appui (dépend de T043)
- [ ] T048 [US1] Si T047 révèle un affichage incorrect lié au nombre de thèmes (débordement de liste, libellé tronqué), corriger le composant concerné dans `src/components/` avec sa story Storybook, sinon consigner « aucun changement d'interface » dans la description de la PR de publication

**Checkpoint**: la valeur visible (choisir Éducation et obtenir un score) est démontrée sur la version 2.

---

## Phase 8: Polish & Cross-Cutting Concerns

- [ ] T049 Lancer `pnpm verify` (lint, types, validation, tests, Storybook, build, e2e) sur `006-publication-v2` et corriger jusqu'au vert
- [ ] T050 Committer la publication (« data(publication): version 2 du jeu de données (18 thèmes) »), pousser `006-publication-v2`, ouvrir la PR de publication vers `main` (description : effectifs v2, SC-001 à SC-007 avec leur preuve, captures de T045 et T047), lier la PR avec les outils ccd_pr et suivre la CI
- [ ] T051 [P] Consigner en fin de ce fichier `specs/006-theme-education/tasks.md` une section « Écarts » : décisions prises en cours de route (sources écartées notables, énoncés écartés, SC-004 atteint ou non et pourquoi, corrections de transcriptions), et cocher les tâches faites
- [ ] T052 [P] Mettre à jour la mémoire du projet (fichier `project-radar-2027-spec-006-education.md` du répertoire mémoire) : état d'avancement, numéros de PR, restes éventuels

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)** → **Foundational (Phase 2, PR de code)** : bloque tout le reste ; la PR #21 doit être fusionnée avant la Phase 3.
- **US2 sources (Phase 3)** → **US3 énoncés (Phase 4)** : les énoncés sont tirés des mesures trouvées (FR-008).
- **US3 (Phase 4)** → **US2 positions (Phase 5)** : les positions portent sur les énoncés actifs.
- **Phase 5** → fusion de la PR de données → **US4 publication (Phase 6)**.
- **US4 (Phase 6)** → **US1 (Phase 7)** : la valeur visible de US1 n'existe que dans la version 2 publiée ; aucun code applicatif n'est attendu (R1).
- **Polish (Phase 8)** après les Phases 6 et 7.

### User Story Dependencies

- **US2** : dépend de la Phase 2 ; sa 2e partie dépend de US3.
- **US3** : dépend de la 1re partie de US2.
- **US4** : dépend de US2 et US3 (corpus complet et relu).
- **US1** : dépend de US4 (version publiée). C'est la story la plus prioritaire pour le visiteur, mais la dernière dans l'ordre d'exécution, car elle n'exige aucun code propre.

### Within Each Phase

- Phase 2 : tests T003–T005 avant l'implémentation T006–T010 ; T008 après T006–T007 ; T009 après T008 ; T011 en dernier.
- Phase 3 : T016 → T017 → (T018, T019 en parallèle ; T020, T021, T022) → T023 → T024.
- Phase 4 : strictement séquentielle (T025 → T031).
- Phase 5 : T032–T034 en parallèle → T035 → T036 → T037 → T038 → T039.
- Phase 6 : T040 → T041 **avant** T042–T043 → T044 ; T045 après T043.

### Parallel Opportunities

- Phase 1 : T001 ∥ T002.
- Phase 2 : T003 ∥ T004 ∥ T005 ; T006 ∥ T007 ; T012 ∥ T013 ∥ T014 (en parallèle de tout le code).
- Phase 3 : T018 ∥ T019 (fichiers de sources de candidats différents) ; T023 lance plusieurs agents `political-source-researcher` en parallèle, un par candidat.
- Phase 5 : T032 ∥ T033 ∥ T034 (fichiers de positions distincts par candidat), par exemple trois sous-agents.
- Phase 7 : T046 ∥ T047.
- Phase 8 : T051 ∥ T052.

---

## Parallel Example: Phase 2 (PR de code)

```text
Task: "T003 Cas de schéma dimensions/dimension dans scripts/data/lib/schema/schema.test.ts"
Task: "T004 Tests de la règle dans scripts/data/lib/rules/AXIS-DIM.test.ts"
Task: "T005 Test de non-fuite dans scripts/data/publish.test.ts"
Task: "T012 Amendement de specs/002-corpus-ontologie-pipeline/spec.md"
Task: "T013 Mise à jour de specs/003-domaine-score-selection-codec/spec.md"
Task: "T014 Mise à jour de data/README.md"
```

## Parallel Example: User Story 2 (positions)

```text
Task: "T032 Positions Éducation de philippe, tondelier, batho, arthaud, branco, retailleau"
Task: "T033 Positions Éducation d'asselineau, lisnard, ruffin, dupont-aignan, mélenchon, philippot"
Task: "T034 Positions Éducation d'attal, kazib, le pen, glucksmann, roussel, zemmour"
```

---

## Implementation Strategy

### MVP

Le MVP utile au visiteur est **US1 sur la version 2**, ce qui exige toute la chaîne : Phase 2 (outillage) → Phase 3 (sources) → Phase 4 (énoncés) → Phase 5 (positions) → Phase 6 (publication) → Phase 7 (vérification du parcours). Il n'existe pas de MVP plus court qui ait de la valeur : un thème publié sans énoncés actifs est refusé par la validation (002 FR-012, `AXIS-DIM`).

Couverture minimale acceptable pour publier (FR-015, SC-003 de la 002 option A) : on peut publier dès que la Phase 5 est terminée même si SC-004 (12 candidats avec 2 positions relues) n'est pas atteint, à condition que le propriétaire le décide et que l'écart soit consigné (T051).

### Incremental Delivery

1. PR de code (Phases 1–2) : livrable seul, sans effet visible ; le corpus v1 reste valide.
2. PR de données (Phases 3–5) : commits par étape (sources, thème et énoncés, brouillons, positions relues) pour faciliter la relecture d'adrien.
3. PR de publication (Phases 6–8) : la version 2 devient courante ; les liens v1 restent rejoués sur la version 1.

### Points d'arrêt où le propriétaire décide

- T015 : fusion de la PR de code.
- T021 : transcriptions Dailymotion sans sous-titres (demandées à adrien).
- T030 : validation de l'axe, des dimensions et des énoncés.
- T036–T038 : écoute des passages vidéo, relecture des positions, sort des énoncés non discriminants.
- T039 et T050 : fusion des PR de données et de publication ; publication si SC-004 n'est pas atteint.

---

## Notes

- [P] = fichiers différents, aucune dépendance sur une tâche non terminée.
- Aucune citation ni métadonnée proposée par ChatGPT ou par un sous-agent n'entre au corpus sans contrôle dans le texte téléchargé (FR-010).
- Les énoncés existants des autres thèmes ne sont ni modifiés ni déplacés (002 FR-011).
- `src/core` reste inchangé (Principe III) ; seule la règle `AXIS-DIM` appelle `computeQuotas`.
