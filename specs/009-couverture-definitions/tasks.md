---

description: "Liste des tâches — 009 Couverture des candidats et définitions des termes"
---

# Tasks: Couverture des candidats et définitions des termes

**Input**: Design documents from `/specs/009-couverture-definitions/`

**Prerequisites**: plan.md, spec.md, research.md (R1–R13), data-model.md, contracts/ (core-selection-delta, published-dataset-delta, data-commands, defined-term-ui), quickstart.md

**Tests**: requis. La constitution (V) impose une règle = un fichier = un test = une fixture, et le plan liste les tests attendus : propriétés des règles 3, rejeu v1 à v4, resserrement, `data:gaps`, `SRC-AGGREGATOR`, `GLOSS`, repérage des termes, `DefinedTerm`, e2e et audit exhaustif v5. Vitest se lance avec `</dev/null`.

**Organization**: deux récits livrables séparément. Récit A, couverture : US1 (sélection par couverture), US2 (banque resserrée), US3 (campagne ciblée), puis la publication v5. Récit B, définitions : US4 (bulle de définition), US5 (glossaire relu et page Glossaire). Le récit B ne dépend d'aucune tâche du récit A.

**Garde-fous valables pour toutes les tâches** :

- les fixtures de rejeu v3 et v4 (T002) sont committées **avant** toute modification de `src/core/selection` ou `src/core/bank` (R2) ;
- `public/data/versions/1` à `4` ne changent jamais (PUB-IMMUTABLE) ; score, seuil de 60 %, codec et `LINK_FORMAT_VERSION` ne changent pas (FR-004) ;
- jamais de `pnpm data:extract` (payant) : positions et définitions sont rédigées en session par l'agent ;
- le sous-agent `french-political-source-researcher` n'écrit jamais dans `data/corpus/positions/` (contrat 008) ; aucune position n'est déduite d'un parti ou d'un soutien (FR-012) ;
- seules les positions et définitions relues par adrien (`reviewed`) entrent dans une publication ; l'agent ne passe jamais lui-même un élément en `reviewed` ;
- aucun son audible dans les vérifications au navigateur.

## Format: `[ID] [P?] [Story] Description`

- **[P]** : parallélisable (fichiers différents, aucune dépendance sur une tâche inachevée)
- **[Story]** : user story concernée (US1 à US5)

---

## Phase 1: Setup — base verte et rejeux figés

**Purpose**: partir de `main` à jour et figer les résultats des versions 3 et 4 avant de toucher au cœur.

- [X] T001 Mettre la branche `009-couverture-definitions` à jour avec `main` (`git fetch origin && git rebase origin/main`), lancer `pnpm install`, `pnpm vitest run </dev/null` et `pnpm data:validate`. Noter le nombre de tests et d'avertissements existants dans le message de fin de phase.
- [X] T002 Ajouter le drapeau `--allow-older` à `scripts/results/replay-fixture.ts` : il lève la garde « version courante = n » et écrit en tête de sortie un rappel « valable seulement si le code de sélection est celui qui a servi à publier ». Produire `src/lib/results/replay-v4.fixture.json` (`pnpm tsx scripts/results/replay-fixture.ts --version 4`) puis `src/lib/results/replay-v3.fixture.json` (`--version 3 --allow-older`). Committer ces deux fixtures seules, avant toute autre tâche du cœur.
- [X] T003 Paramétrer `src/lib/results/replay.test.ts` sur les versions 1 à 4 (`describe.each`), en lisant `replay-v<n>.fixture.json` et `public/data/versions/<n>/main.json`. Lancer `pnpm vitest run src/lib/results </dev/null` : 4 rejeux verts. Dépend de T002.
- [X] T004 Épingler l'audit exhaustif des règles 2 de `src/core/selection/balanced.audit.test.ts` sur `public/data/versions/4/main.json` (au lieu de « la version courante »), sans changer ses assertions, pour qu'il reste valide après la publication de la v5. Dépend de T001.

**Checkpoint**: base verte, rejeux v1 à v4 figés et testés, audit v4 épinglé.

---

## Phase 2: Foundational — couverture dans le jeu publié et la banque (bloquant pour le récit A)

**Purpose**: types, schéma et vue `BankVersion` acceptent les règles 3 et la couverture. US1, US2 et US3 en dépendent ; US4 et US5 n'en dépendent pas.

**⚠️ CRITICAL**: aucune tâche de US1 à US3 ne commence avant la fin de cette phase.

- [X] T005 Ajouter `export const MAX_ACTIVE_QUESTIONS = 120;` dans `src/core/types.ts` et l'exporter depuis `src/core/index.ts` (contrat `core-selection-delta.md` § Types).
- [X] T006 Étendre `src/core/dataset/types.ts` : `selectionRules?: 2 | 3`, `minQuestionCoverage?: number` sur le jeu, `coverage?: number` sur `PublishedQuestion` (data-model § 2). Dépend de T005.
- [X] T007 Étendre `MainDatasetSchema` dans `src/core/dataset/schema.ts` (contrat `published-dataset-delta.md`) : littéral `3` admis ; `minQuestionCoverage` (entier ≥ 1) présent si et seulement si `selectionRules = 3` ; `coverage` présent sur chaque question si et seulement si `selectionRules = 3` ; `subject` exigé en règles 2 et 3 ; `coverage` égale au nombre de cases **non `null`** de la colonne de la question dans `positions` (une position neutre `0` compte ; seule `null`, inconnue, ne compte pas) ; au plus `MAX_ACTIVE_QUESTIONS` questions en règles 3. Dépend de T006.
- [X] T008 Ajouter à `src/core/dataset/schema.test.ts` un cas par refus de T007 (règles 3 sans `minQuestionCoverage`, question sans `coverage`, `coverage` hors règles 3, `minQuestionCoverage` hors règles 3, `coverage` incohérente, `coverage` qui omet une position neutre `0`, 121 questions) et un cas conforme ; vérifier que `public/data/versions/1` à `4` sont toujours acceptés. Compléter `src/core/dataset/fixture.ts` d'un jeu fictif en règles 3. Dépend de T007.
- [X] T009 Étendre `src/core/bank/bank.ts` (contrat `core-selection-delta.md`) : `BankVersion.selectionRules: 1 | 2 | 3`, `BankVersion.minQuestionCoverage: number | null`, `BankQuestion.coverage` toujours dérivée de `positions` (cases non `null` des candidats de la version, neutre `0` compris) ; `bankFromDataset` accepte `selectionRules` absent, 2 ou 3 (sinon `unknown-selection-rules`), exige `subject` en règles 2 et 3 (`missing-subject`) et lève `BankError('coverage-mismatch')` en règles 3 si la valeur publiée diffère. Ajouter `'coverage-mismatch'` à `BankErrorCode`. Compléter `src/core/bank/fixtures.ts` d'une banque en règles 3. Dépend de T006.
- [X] T010 Ajouter à `src/core/bank/bank.test.ts` : propriété fast-check (principe III) « pour tout jeu généré, `BankQuestion.coverage` = nombre de cases non `null` de la colonne, neutre `0` compris, quelles que soient les règles » ; couverture dérivée sur une banque des règles 1 et 2 ; règles 3 acceptées ; `coverage-mismatch` ; `unknown-selection-rules` pour `4`. Lancer `pnpm vitest run src/core src/lib/results </dev/null` : rejeux v1 à v4 toujours verts. Dépend de T009.

**Checkpoint**: un `main.json` en règles 3 est lisible de bout en bout ; rien ne change pour les versions 1 à 4.

---

## Phase 3: User Story 1 - Être comparé à la plupart des candidats (Priority: P1) 🎯 MVP

**Goal**: en règles 3, la sélection retient dans chaque thème la question la mieux couverte, sans toucher aux autres règles de 007 (FR-001 à FR-004).

**Independent Test**: sur une banque en règles 3, calculer la sélection et les candidats classés pour toutes les combinaisons de thèmes, dans les deux modes, avec un répondant qui répond à tout ; vérifier les garanties de 007 et la monotonie de la couverture.

### Tests pour US1

- [X] T011 [P] [US1] Ajouter à `src/core/selection/fill-subject.test.ts` les propriétés des règles 3 (fast-check, banques générées avec couvertures) : au plus une question par enjeu ; quota d'ancrage atteint tant qu'il reste des questions éligibles ; `N` ou épuisement ; déterminisme ; **monotonie** (aucune question éligible non retenue d'un thème n'a une couverture strictement supérieure à une question retenue au premier passage pour ce thème). Ajouter les cas d'acceptation US1 n° 1 (couvertures 13 contre 7, enjeux différents → 13, quel que soit `D_q`) et n° 2 (couvertures égales → `D_q`, puis identifiant). Les tests échouent tant que T013 à T015 ne sont pas faits.
- [X] T012 [P] [US1] Créer `src/core/selection/coverage-audit.test.ts` : propriétés fast-check sur des banques et sélections générées (principe III, contrat `core-selection-delta.md` § Audit de couverture) — `c` classé ⇔ `missingForThreshold = 0` ; monotonie (rendre connue une position ne retire aucun classé et ne fait jamais croître `missingForThreshold`) ; minimalité de `missingForThreshold` ; déterminisme et indépendance de l'ordre de la sélection. Cas fixes : `rankedCandidates` et `missingForThreshold` sur une banque fixe (candidat à 59 %, à 60 %, à 0 %). Test croisé : pour chaque sélection de 20 combinaisons tirées de la banque de `src/core/bank/fixtures.ts`, un répondant qui répond `+1` partout est classé par `scoreCandidate` exactement pour les candidats que renvoie `rankedCandidates`.

### Implémentation pour US1

- [X] T013 [US1] Dans `src/core/selection/fill.ts`, ajouter `byCoverage(a, b)` (couverture décroissante, puis `byDiscriminant`) et donner à `questionsByTheme(bank, compare = byDiscriminant)` un comparateur en paramètre, sans changer son comportement par défaut (R1). Dépend de T009.
- [X] T014 [US1] Dans `src/core/selection/fill-subject.ts`, ajouter le paramètre `compare = byDiscriminant` à `fillQuotasBySubject(bank, quotas, priorityIndices, target, compare)` et le transmettre à `questionsByTheme` dans les deux passages. Aucune autre ligne de l'algorithme ne change. Dépend de T013.
- [X] T015 [US1] Dans `src/core/selection/select.ts`, brancher : règles 1 → `fillQuotas` ; règles 2 → `fillQuotasBySubject(…, byDiscriminant)` ; règles 3 → `fillQuotasBySubject(…, byCoverage)`. Signature publique de `selectQuestions` inchangée. Exporter `byCoverage` depuis `src/core/selection/index.ts`. Dépend de T014.
- [X] T016 [US1] Créer `src/core/selection/coverage-audit.ts` (pur) : `rankedCandidates(bank, selection)` (candidats dont la couverture sur la sélection atteint `COVERAGE_THRESHOLD`) et `missingForThreshold(bank, selection, candidateId)` (positions manquantes pour atteindre le seuil, 0 si classé). Exporter depuis `src/core/selection/index.ts` et `src/core/index.ts`. Vérifier que `src/lib/core-boundary.test.ts` reste vert. Dépend de T009.
- [X] T017 [US1] Lancer `pnpm vitest run src/core src/lib/results </dev/null` : T011 et T012 verts, `rules1.snapshot.json` inchangé, rejeux v1 à v4 identiques, audit v4 vert (SC-003). Dépend de T011 à T016.

**Checkpoint**: le cœur sait sélectionner par couverture ; tant qu'aucune version ne déclare les règles 3, le site se comporte exactement comme avant.

---

## Phase 4: User Story 2 - Une banque resserrée sur les questions renseignées (Priority: P1)

**Goal**: `data:publish` ne publie que la banque active (au plus 120 questions, plancher de 3 enjeux par thème), déclare `selectionRules: 3`, `minQuestionCoverage` et `coverage`, et produit le rapport de couverture (FR-005 à FR-008, FR-023).

**Independent Test**: `pnpm data:publish --next --dry-run` sur le corpus actuel donne `k = 7`, environ 100 questions, 4 avertissements, et `data/reports/couverture-v5.{md,json}` ; aucune question sous `k` hors compléments.

### Tests pour US2

- [X] T018 [P] [US2] Créer `scripts/data/lib/publish/active-bank.test.ts` sur des corpus construits en mémoire : plus petit `k` qui laisse au plus 120 questions ; complément d'un thème sous 3 enjeux distincts (rattachement par `themes[0]`, couverture décroissante puis `D_q` puis identifiant, enjeux nouveaux seulement) avec un avertissement qui nomme le thème ; thème épuisé avant 3 enjeux (avertissement, pas d'erreur) ; `--min-coverage` plus petit que le minimum calculé → erreur ; aucun `k` ne tient sous 120 après compléments → erreur qui nomme les thèmes complétés et le total au plus grand `k` utile (R4 étape 4, aucun repli silencieux) ; promotion (US2 n° 3) : une question de réserve qui passe à `c_q = k` devient active ; couverture calculée sur les seuls candidats déclarés et positions connues.
- [X] T019 [P] [US2] Créer `scripts/data/lib/publish/coverage-report.test.ts` : structure du JSON de data-model § 4 ; min, médiane et max sur une petite banque ; `successCriteria.sc001` et `sc002` vrais et faux aux bornes (10/12 en court, 8/10 en complet) ; Markdown en français avec ses tableaux.

### Implémentation pour US2

- [X] T020 [US2] Créer `scripts/data/lib/publish/active-bank.ts` (R4) : `computeActiveBank(ctx, { minCoverage? })` → `{ k, active: Question[], reserve: Question[], completed: { theme, subjects }[], warnings }` ou une erreur `ActiveBankError` si aucun `k` ne tient sous 120 après compléments (R4 étape 4 ; `data:publish` sort alors en code 1 et l'agent soumet le cas à adrien), à partir de `knownMatrix` (`scripts/data/lib/stats.ts`) sur les questions `active` et les candidats déclarés ; utilise `MAX_ACTIVE_QUESTIONS` et `QUOTA_FLOOR.full` de `@/core`. Dépend de T005 et T018.
- [X] T021 [US2] Modifier `scripts/data/lib/publish/build.ts` : n'émettre que les questions de la banque active ; `selectionRules: 3`, `minQuestionCoverage: k`, `coverage` sur chaque question ; `candidates[].coverage` calculée sur la banque active ; `candidates/<id>.json` limités aux questions actives ; `versions.json` avec `questionCount` = taille de la banque active. Mettre à jour `scripts/data/lib/publish/build.test.ts` (le jeu produit passe `MainDatasetSchema` et `bankFromDataset`). Dépend de T007, T009 et T020.
- [X] T022 [US2] Créer `scripts/data/lib/publish/coverage-report.ts` (R5) : pour la banque produite, les questions actives et en réserve par thème, la couverture de chaque candidat, et les candidats classés (via `selectQuestions` et `rankedCandidates`) en court et en complet sur les 12 444 combinaisons de 3 à 5 thèmes (min, médiane, max), la liste par combinaison pour les 816 combinaisons de 3 thèmes, et `successCriteria`. Écrit `data/reports/couverture-v<n>.json` et `.md`. Moins de 60 s sur le corpus réel. Dépend de T016, T019 et T021.
- [X] T023 [US2] Modifier `scripts/data/publish.ts` : option `--min-coverage <k>` (refus, code 1, si `k` est sous le minimum calculé ou si le total dépasse 120) ; écriture du rapport, y compris en `--dry-run` ; sortie console (`k`, actives et réserve, un avertissement par thème complété, classés min/médiane/max par mode, avertissement sans échec si SC-001 ou SC-002 n'est pas atteint). Le reste du comportement (comparaison, `--next`, immutabilité, budgets) est inchangé. Compléter `scripts/data/publish.test.ts` (dry-run sur `data/fixtures/minimal`, `--min-coverage` refusé). Dépend de T021 et T022.
- [X] T024 [US2] Lancer `pnpm data:publish --next --dry-run` sur le corpus du dépôt : vérifier `k`, le nombre de questions actives, les avertissements et `data/reports/couverture-v5.md` (attendu sur le corpus de la v4 : `k = 7`, environ 100 questions, Société, Santé, Sécurité, Institutions complétés), et qu'aucun fichier n'est écrit sous `public/data/`. Noter les chiffres classés min/médiane/max dans le message de fin de phase. Dépend de T023.
- [X] T025 [P] [US2] Ajouter la section couverture à `src/app/methodologie/page.tsx`, affichée seulement si la version courante déclare `selectionRules: 3` (FR-023) : la sélection privilégie les questions renseignées pour le plus de candidats, le minimum `k` de la banque active et le nombre de questions actives, et le rôle des agrégateurs (pistes, jamais sources). Chaînes sous `methodology.coverage.*` dans `src/i18n/messages/fr.json`. Dépend de T006.
- [X] T026 [US2] Ajouter à `e2e/fixtures/published.ts` une banque fictive en règles 3 (avec `minQuestionCoverage` et `coverage`) et à `e2e/methodology.spec.ts` un scénario qui vérifie la section couverture et la valeur de `k` ; vérifier que les scénarios existants du questionnaire et des résultats passent sur cette banque (`pnpm e2e`). Dépend de T015 et T025.
- [X] T027 [P] [US2] Documenter dans `data/README.md` la banque active et la réserve (calcul de `k`, plafond, compléments, rapport `data/reports/couverture-v<n>`) et l'option `--min-coverage`.

**Checkpoint**: la publication sait produire une v5 resserrée et son rapport ; rien n'est encore publié.

---

## Phase 5: User Story 3 - Combler en priorité les trous qui rapportent le plus (Priority: P2)

**Goal**: les agrégateurs sont refusés comme source (FR-011), `pnpm data:gaps` classe les positions manquantes par gain attendu (FR-009), et le sous-agent 008 traite ces lignes en sources primaires, jusqu'à la relecture d'adrien (FR-010, FR-012).

**Independent Test**: `pnpm data:validate --corpus data/fixtures/violations/SRC-AGGREGATOR/corpus` échoue en nommant le domaine ; `pnpm data:gaps --limit 60` produit une liste dont les premières missions visent les candidats proches de 60 % ; une mission du sous-agent produit des preuves primaires ou des lacunes `NOT_FOUND` avec `question`.

### Tests pour US3

- [X] T028 [P] [US3] Créer `scripts/data/lib/rules/SRC-AGGREGATOR.test.ts` : source dont l'hôte est `candidatspresidentielles2027.fr` → erreur, entité `source`, message citant l'URL et le domaine ; sous-domaine `www.monvote2027.fr` → erreur ; preuve dont `unregisteredSource.url` est un agrégateur → erreur, entité `evidence` ; `lead.url` agrégateur → aucune erreur ; domaine voisin (`monvote2027.fr.example.org`, `notmonvote2027.fr`) → aucune erreur ; `aggregatorDomains` absent → aucune vérification.
- [X] T029 [P] [US3] Créer `scripts/data/lib/gaps.test.ts` sur un corpus construit en mémoire : seuls les candidats déclarés × questions `active` sans position connue sont listés ; `bank` vaut `active`, `reserve-promotable` (`c_q = k − 1`) ou `reserve` ; gain `Σ 1/m(c, S)` sur un cas calculé à la main ; gain nul pour la réserve non promouvable ; départage (gain, couverture du candidat, couverture de la question, identifiants) ; couple consigné en lacune `NOT_FOUND` ou `NO_PERSONAL_POSITION` avec `question` → `searched` renseigné et relégué en fin de liste ; déterminisme ; regroupement Markdown par mission candidat × thème triées par gain cumulé.

### Implémentation pour US3

- [X] T030 [US3] Ajouter `aggregatorDomains` (liste de noms d'hôte, facultative, non publiée) au schéma de `scripts/data/lib/schema/governance.ts`, et l'initialiser dans `data/corpus/governance.yaml` à `candidatspresidentielles2027.fr`, `monvote2027.fr` et `wikipedia.org`, en conservant les commentaires du fichier. Vérifier que `data:publish --dry-run` ne publie pas ce champ.
- [X] T031 [US3] Ajouter à `EvidenceSchema` de `scripts/data/lib/schema/research.ts` le champ facultatif `lead: { url, title }` (strict), et un cas accepté dans `scripts/data/lib/schema/schema.test.ts`.
- [X] T032 [US3] Créer `scripts/data/lib/rules/SRC-AGGREGATOR.ts` (contrat `data-commands.md` § Règle `SRC-AGGREGATOR`), correspondance sur l'hôte exact ou un sous-domaine, l'enregistrer dans `scripts/data/lib/rules/index.ts` avant `PUB-IMMUTABLE`, et créer la fixture `data/fixtures/violations/SRC-AGGREGATOR/` (copie de la fixture minimale dont une source `https://candidatspresidentielles2027.fr/…` est référencée par une position, et `governance.yaml` avec `aggregatorDomains`). Lancer `pnpm vitest run scripts/data </dev/null` et `pnpm data:validate` : corpus du dépôt conforme. Dépend de T028, T030 et T031.
- [X] T033 [US3] Créer `scripts/data/lib/gaps.ts` (R6) : `computeGaps(ctx, research, { candidates?, themes? })` simule la banque active de la prochaine version (`computeActiveBank`), calcule le gain attendu sur les 816 combinaisons de 3 thèmes × 2 modes (`selectQuestions`, `missingForThreshold`), promeut une à une les questions `reserve-promotable`, lit les lacunes des journaux 008 et renvoie les lignes ordonnées de data-model § 5 (gain arrondi à 4 décimales). Fonction `renderGapsMarkdown(rows, { limit })` pour les missions. Moins de 30 s sur le corpus réel. Dépend de T016, T020 et T029.
- [X] T034 [US3] Créer `scripts/data/gaps.ts` (`pnpm data:gaps [--date] [--candidate]… [--theme]… [--limit] [--corpus]`) et le script `"data:gaps": "tsx scripts/data/gaps.ts"` dans `package.json` : écrit `data/reports/trous/<date>.json` (toutes les lignes) et `.md` (missions, bornées par `--limit`), affiche le nombre de trous, de trous déjà cherchés et les 10 premières missions ; lecture seule sur le corpus. Test de la CLI sur `data/fixtures/minimal` dans `scripts/data/gaps.test.ts`. Dépend de T033.
- [X] T035 [P] [US3] Ajouter au skill `.claude/skills/french-political-source-research/SKILL.md` une section « Mission issue de `data:gaps` » : lire les lignes de la mission, chercher en sources primaires, consigner `lead` quand une piste vient d'un agrégateur (jamais comme source), consigner en cas d'absence une lacune `NOT_FOUND` (au moins 5 requêtes sur 3 catégories) ou `NO_PERSONAL_POSITION` avec `question`, ne jamais déduire une position du parti, d'un soutien ou d'une position collective. Lister les domaines agrégateurs déclarés dans `governance.yaml`. Dépend de T030.
- [X] T036 [P] [US3] Documenter dans `data/README.md` la commande `data:gaps`, la formule du gain en une phrase, `aggregatorDomains`, le champ `lead` et le circuit de campagne (liste → sous-agent → positions `draft` → `data:review`).
- [X] T037 [US3] Vérifier US3 de bout en bout : `pnpm data:validate --corpus data/fixtures/violations/SRC-AGGREGATOR/corpus` échoue (code 1) en nommant le domaine ; `pnpm data:gaps --limit 60` produit `data/reports/trous/2026-11-22.{md,json}` (ou la date du jour) ; les premières missions visent des candidats proches de 60 % et des questions actives ou promouvables. Ouvrir la PR de code du récit A (US1 à US3) avec `pnpm verify` vert, après rebase sur `main`. Dépend de T017, T026, T032 et T034.

### Campagne de sourçage pour US3 (données, PR distincte)

- [X] T038 [US3] Sur une branche de données issue de la branche de code, générer la liste (`pnpm data:gaps --limit 120`) et confier au sous-agent `french-political-source-researcher` les missions dans l'ordre du gain cumulé, une mission par groupe candidat × thème, en citant les identifiants de questions de la liste. Traiter par lots (par exemple 5 missions), en lançant `pnpm data:validate` après chaque lot. Dépend de T035 et T037.
- [X] T039 [US3] Contrôler chaque lot : chaque preuve cite une source primaire (agrégateur seulement en `lead`) ; chaque absence est une lacune avec `question` ; rien n'a été écrit dans `data/corpus/positions/`. Corriger ou rejeter une preuve non conforme et le consigner dans le journal. Dépend de T038.
- [X] T040 [US3] Transcrire en session chaque preuve `VERIFIED_QUOTE` de qualité primaire en position `draft` dans `data/corpus/positions/*.yaml` (source enregistrée dans le registre via `pnpm data:source` si nécessaire, citation exacte, valeur −2 à +2, `author: claude`), sans `data:extract`. Relancer `pnpm data:validate` et `pnpm data:gaps` : les couples traités sortent de la liste ou passent en « déjà cherché ». Dépend de T039.
- [X] T041 [US3] Préparer un dossier de relecture `data/relectures/<date>-campagne-couverture.md` (positions `draft` par candidat, avec citation, source et valeur proposée, et constats d'absence) et ouvrir la PR de données. La relecture et le passage en `reviewed` (`pnpm data:review`) restent à adrien ; vérifier ensuite que `data:review` n'a pas abîmé la mise en forme YAML. Dépend de T040.

**Checkpoint**: la liste des trous existe, au moins un lot de campagne est transcrit, et la PR de données attend la relecture d'adrien.

---

## Phase 6: Publication v5 (US1 à US3)

**Purpose**: publier la première version en règles 3 et vérifier SC-001 à SC-004.

- [ ] T042 [US2] Après fusion des PR de code et de données et relecture d'adrien, sur une branche de publication à jour avec `main` : `pnpm data:publish --next --dry-run`, puis lire `data/reports/couverture-v5.md`. Si `sc001` ou `sc002` est faux, soumettre le rapport à adrien avant de publier (R5) et attendre sa décision. Dépend de T041.
- [ ] T043 [US2] Publier : `pnpm data:publish --next`, ce qui écrit `public/data/versions/5/` et `data/reports/couverture-v5.{md,json}` ; vérifier que `public/data/versions/1` à `4` sont inchangés (`git diff --stat`) et que `main.json` reste sous 300 Kio. Dépend de T042.
- [ ] T044 [US1] Ajouter à `src/core/selection/balanced.audit.test.ts` un second audit exhaustif sur la dernière version en règles 3 (v5) : 12 444 combinaisons × 2 modes, garanties de 007 respectées partout (SC-003), et candidats classés pour un répondant qui répond à tout **égaux aux chiffres exacts** de `data/reports/couverture-v5.json` (min, médiane, max par mode, et chaque entrée `byTriple`) — le test n'est jamais conditionnel ; l'atteinte de SC-001 et SC-002 est constatée par le rapport et arbitrée par adrien (T042). Assertion dédiée US1 n° 3 : Économie, Immigration et Travail, mode court → au moins 12 candidats classés. Délai de test adapté comme pour l'audit v4. Lancer `pnpm vitest run src/core/selection/balanced.audit.test.ts src/lib/results </dev/null`. Dépend de T043.
- [ ] T045 [US1] Parcours réel dans le navigateur intégré (`pnpm dev`) : thèmes Économie, Immigration et Travail, mode court, réponse à toutes les questions → au moins 12 candidats classés (US1 n° 3) ; un candidat sous 60 % apparaît en « données insuffisantes » (US1 n° 5) ; la page Méthodologie montre la section couverture et `k` ; un lien de résultats v4 donne le même résultat qu'avant. Capture d'écran à l'appui. Dépend de T043.
- [ ] T046 [US2] Ouvrir la PR de publication v5 (rapport de couverture et chiffres SC-001/SC-002 dans la description), après rebase sur `main` et `pnpm verify` vert. Dépend de T044 et T045.

**Checkpoint**: v5 publiée en règles 3 ; liens v1 à v4 identiques.

---

## Phase 7: User Story 4 - Comprendre un terme technique sans quitter la question (Priority: P2)

**Goal**: dans les énoncés du questionnaire et du détail des résultats, la première occurrence de chaque terme défini est signalée et ouvre une bulle de définition accessible, sans effet sur les réponses (FR-016 à FR-019, FR-021).

**Independent Test**: avec un glossaire fictif, ouvrir une question contenant un terme, à la souris, au clavier, au toucher à 320 px et via les rôles ARIA ; vérifier affichage, fermeture, retour du focus et absence de réponse enregistrée (`e2e/glossary.spec.ts`, scénarios 1 à 5 et 7).

### Fondation partagée avec US5

- [ ] T047 [US4] Créer `src/core/dataset/glossary.ts` : type `GlossaryTerm` et schéma Zod `GlossarySchema` de `public/data/glossary.json` (data-model § 8 : `updatedAt`, `terms[{ id, label, forms (≥ 1), definition (1 à 280), sources[{ url, title, publisher }] (≥ 1) }]`), exportés depuis `src/core/dataset/index.ts`. Aucun import depuis la sélection, le score ou le codec (FR-021). Cas acceptés et refusés dans `src/core/dataset/glossary.test.ts`.

### Tests pour US4

- [ ] T048 [P] [US4] Créer `src/lib/glossary/annotate.test.ts` (contrat `defined-term-ui.md` § Repérage) : propriétés fast-check (concaténation = texte ; chaque `termId` au plus une fois ; aucun terme bordé par une lettre ou un chiffre ; aucune forme plus longue ne correspond à la position d'un terme ; glossaire vide → un segment) et cas fixes (« droit du sol » contre « droit », « AME » contre « âme », « Droit du sol » en début de phrase, apostrophes ’ et ', deux occurrences, espace insécable).
- [ ] T049 [P] [US4] Créer `src/ui/DefinedTerm/DefinedTerm.test.tsx` (Testing Library, `src/lib/test-utils.tsx`) : clic ouvre puis referme ; Entrée et Espace ; survol souris 300 ms ouvre, sortie 200 ms ferme, clic sur une bulle ouverte par survol la fixe ; Échap et Fermer rendent le focus au terme ; `pointerdown` extérieur ferme sans `preventDefault` ; sortie du focus ferme ; deux termes dans un `DefinedTermGroup` → une seule bulle ouverte ; démontage ferme ; attributs `aria-expanded`, `aria-controls`, `aria-describedby`, `role="dialog"`, `aria-labelledby` ; contenu (libellé, définition, source en lien `target="_blank"` `rel="noopener"`, lien glossaire).

### Implémentation pour US4

- [ ] T050 [US4] Créer `src/lib/glossary/annotate.ts` (R10) : `compileGlossary(terms)` (normalisation NFC, ’ → ', espace insécable → espace, première lettre insensible à la casse, index par initiale) et `annotate(text, index)` (parcours gauche-droite, forme la plus longue, bornes `\p{L}\p{N}`, première occurrence seulement, texte original conservé). Exporter `normalizeForm` pour la règle `GLOSS`. Moins de 1 ms par énoncé avec 60 termes. Dépend de T047 et T048.
- [ ] T051 [US4] Créer trois modules séparés, pour qu'aucun module client n'importe `node:fs` : `src/lib/glossary/load.ts` (`fetchGlossary()` côté client : `fetch('/data/glossary.json')`, validé par `GlossarySchema`, mis en cache en mémoire, `null` en cas d'échec), `src/lib/glossary/GlossaryProvider.tsx` (`'use client'`, contexte `GlossaryProvider` / `useGlossary()` qui fournit l'index compilé et la table des termes) et `src/lib/glossary/load.server.ts` (`readGlossaryAtBuild()` par `node:fs`, importé seulement par la page `/glossaire`). Tests dans `src/lib/glossary/load.test.ts` (succès, fichier invalide → `null`, échec réseau → `null`) et `load.server.test.ts` (fichier absent ou invalide → `null`). Dépend de T047 et T050.
- [ ] T052 [US4] Créer `src/ui/DefinedTerm/DefinedTerm.tsx`, `DefinedTermGroup.tsx` et `index.ts` (R9, contrat `defined-term-ui.md` § `DefinedTerm`) : bouton en ligne souligné en pointillé (tokens d'épaisseur et de décalage), couleur du texte inchangée, curseur `help` à la souris, anneau de focus du design system ; bulle `popover="manual"` placée juste après le bouton, positionnée en JS sous le terme ou au-dessus, repositionnée au redimensionnement et au défilement. Déclarer d'abord dans `src/ui/tokens.css` les tokens `--defined-term-gutter` (gouttière de page, 16 px), `--defined-term-max-width` (`20rem`), `--defined-term-max-height` (`min(50vh, 18rem)`), `--defined-term-open-delay` (300 ms) et `--defined-term-close-delay` (200 ms), et compléter `src/ui/tokens.test.ts` ; le calcul JS lit leurs valeurs calculées (`getComputedStyle`) et ne contient aucune valeur de style ni délai en dur (principe IV) ; largeur effective `min(max-width, 100vw − 2 × gutter)`, défilement interne au-delà de la hauteur max ; aucun appel au store du questionnaire, à l'historique ni à l'URL. Tokens seulement ; chaînes sous `glossary.*` dans `src/i18n/messages/fr.json` (« terme défini », « Fermer », « Voir le glossaire », « Source »). Exporter depuis `src/ui/index.ts`. Dépend de T049.
- [ ] T053 [P] [US4] Créer `src/ui/DefinedTerm/DefinedTerm.stories.tsx` : fermé, ouvert, définition longue, 320 px, thème sombre, deux termes dans une phrase ; l'addon a11y passe sans violation, bulle ouverte comme fermée (tests Vitest des stories). Dépend de T052.
- [ ] T054 [US4] Créer `src/ui/AnnotatedText/AnnotatedText.tsx`, `index.ts` et un test : rend `annotate(text)` en texte brut et `DefinedTerm`, avec `glossaryHref` = `/glossaire#<id>` ; avec un glossaire `null`, rend le texte seul. Exporter depuis `src/ui/index.ts`. Dépend de T050 et T052.
- [ ] T055 [US4] Intégrer dans `src/ui/QuestionCard/QuestionCard.tsx` (énoncé rendu par `AnnotatedText` dans le `h2`, qui garde `tabIndex={-1}` et son focus programmatique) et `src/ui/QuestionDetail/QuestionDetail.tsx` (texte dans le `h4`). Ajouter à `QuestionCard.stories.tsx` une story avec un terme défini, bulle ouverte et fermée, en bureau et à 320 px, sans violation a11y. Mettre à jour les tests existants des deux composants. Dépend de T054.
- [ ] T056 [US4] Brancher `GlossaryProvider` dans `src/app/questionnaire/layout.tsx` (ou `src/app/questionnaire/questions/page.tsx`) et `src/app/resultats/ResultsApp.tsx`, avec la récupération du glossaire en parallèle du jeu de données ; vérifier que la carte de question a pour clé l'identifiant de la question (fermeture au changement de question). Le glossaire n'a aucun effet sur la sélection, le score ni le lien (FR-021). Dépend de T051 et T055.
- [ ] T057 [US4] Créer `e2e/glossary.spec.ts` avec un glossaire fictif servi par `e2e/fixtures/published.ts` (route `/data/glossary.json`) et une question fictive contenant un terme : scénarios 1 à 5 du contrat (clic et Échap, clavier seul, toucher à 375 puis 320 px avec `scrollWidth ≤ clientWidth` et fermeture par toucher extérieur, aucune réponse ni changement d'URL ou de stockage local, fermeture au passage à la question suivante) et le scénario 8 (lien de résultats d'une version antérieure rejoué : terme signalé dans le détail des réponses, classement identique avec et sans glossaire, FR-021). Lancer `pnpm e2e e2e/glossary.spec.ts`. Dépend de T056.

**Checkpoint**: avec un `glossary.json` présent, les termes sont signalés et définis au questionnaire et aux résultats ; sans fichier, le site s'affiche comme avant.

---

## Phase 8: User Story 5 - Des définitions neutres, sourcées et relues (Priority: P3)

**Goal**: un glossaire `data/corpus/glossaire.yaml` contrôlé par la règle `GLOSS`, publié par `pnpm data:glossary`, rassemblé sur la page `/glossaire`, et un inventaire initial d'au moins 20 termes soumis à adrien (FR-013 à FR-015, FR-020, FR-022).

**Independent Test**: `GLOSS` échoue sur sa fixture en nommant le terme ; `pnpm data:glossary --check` est vert après publication ; `/glossaire` liste les termes dans l'ordre alphabétique avec leur ancre.

### Tests pour US5

- [ ] T058 [P] [US5] Créer `scripts/data/lib/rules/GLOSS.test.ts` (contrat `data-commands.md` § Règle `GLOSS`) : chaque erreur (identifiant en double, aucune forme, forme en double après normalisation dans un terme ou entre termes, définition vide ou de plus de 280 caractères, aucune source, URL invalide, `reviewed` sans `reviewedBy`/`reviewedAt`, `reviewedBy = author`, contributeur inconnu, `glossary.json` désynchronisé hors `updatedAt`) nomme le terme ; erreur si aucune source du terme n'a un hôte dans `institutionalDomains` (FR-013, `*.gouv.fr` reconnu) ; avertissements (terme `reviewed` absent de l'énoncé de toute question `active` **du corpus**, pas de la seule banque active d'une version ; source supplémentaire hors `institutionalDomains`) ; `institutionalDomains` absent → contrôle institutionnel ignoré (fixtures historiques) ; « droit » et « droit du sol » ne sont pas en conflit ; glossaire absent → aucune vérification.

### Implémentation pour US5

- [ ] T059 [US5] Créer `scripts/data/lib/schema/glossary.ts` (Zod strict, data-model § 7) et l'exporter depuis `scripts/data/lib/schema/index.ts` ; charger `glossaire.yaml` (facultatif) dans `scripts/data/lib/corpus.ts` et l'exposer dans `RuleContext` (`scripts/data/lib/rules/types.ts`), avec des violations `SCHEMA` élément par élément ; ajouter `institutionalDomains` (facultatif, `*.` admis en préfixe) au schéma de `scripts/data/lib/schema/governance.ts` et l'initialiser dans `data/corpus/governance.yaml` avec la liste de R12, en conservant les commentaires. Dépend de T047.
- [ ] T060 [US5] Créer `scripts/data/lib/rules/GLOSS.ts` (R12, repérage via `compileGlossary`/`annotate`/`normalizeForm` de `src/lib/glossary/annotate.ts`), l'enregistrer dans `scripts/data/lib/rules/index.ts` avant `PUB-IMMUTABLE`, créer `data/fixtures/violations/GLOSS/` (définition trop longue et conflit de forme) et `data/fixtures/minimal/corpus/glossaire.yaml` (deux termes valides, chacun avec une source institutionnelle, `reviewed` par un contributeur de la fixture différent de l'auteur). Lancer `pnpm vitest run scripts/data </dev/null`. Dépend de T050, T058 et T059.
- [ ] T061 [US5] Créer `scripts/data/glossary.ts` (`pnpm data:glossary [--check] [--date]`) et le script `"data:glossary": "tsx scripts/data/glossary.ts"` dans `package.json` : valide (`GLOSS`), écrit `public/data/glossary.json` (termes `reviewed`, triés par `localeCompare('fr', { sensitivity: 'base' })`, JSON compact avec fin de ligne, ≤ 30 Kio) ; `--check` n'écrit rien et sort en code 1 si le fichier diffère hors `updatedAt`. Tests dans `scripts/data/glossary.test.ts` sur la fixture minimale. Dépend de T060.
- [ ] T062 [US5] Créer la page `src/app/glossaire/page.tsx` (composant serveur, `readGlossaryAtBuild()` de `src/lib/glossary/load.server.ts`) : `h1` « Glossaire », `dl` alphabétique, ancre `id` = identifiant du terme, définition et sources ; « aucun terme publié » si le fichier est absent ou invalide. Ajouter un lien vers `/glossaire` dans `src/app/methodologie/page.tsx`. Chaînes sous `glossary.*`. Ajouter le scénario 6 à `e2e/glossary.spec.ts` (termes triés, ancre atteinte depuis la bulle). Dépend de T051 et T057.
- [ ] T063 [US5] Inventaire initial (R13, FR-022) : parcourir les énoncés de la banque active (à défaut, les questions `active` du corpus), repérer sigles, dispositifs, prestations, procédures et notions juridiques, ouvrir et vérifier une source institutionnelle pour chaque terme retenu, rédiger une définition factuelle et neutre d'au plus 280 caractères (sans candidat, parti ni chiffre polémique). Écrire les termes dans `data/corpus/glossaire.yaml` (`status: draft`, `author: claude`, en-tête de commentaire) et le dossier `data/relectures/<date>-glossaire.md` sur le modèle de `data/relectures/2026-11-21-enjeux.md` : tableau des termes retenus (formes, définition, source, énoncés concernés) et tableau des termes écartés avec leur motif. Au moins 20 termes, dont « aide médicale de l'État » et « droit du sol » (SC-007). `pnpm data:validate` vert. Dépend de T060.
- [ ] T064 [US5] Ouvrir la PR du récit B (code US4 et US5, inventaire en `draft`) après rebase sur `main` et `pnpm verify` vert, et soumettre le dossier de relecture à adrien. Après sa validation (`reviewed`, `reviewedBy: adrien`, fait par adrien), lancer `pnpm data:glossary` puis `pnpm data:glossary --check`, et committer `public/data/glossary.json`. Dépend de T057, T062 et T063.
- [ ] T065 [US5] Vérification réelle dans le navigateur intégré (`pnpm dev`), une fois `glossary.json` publié : au questionnaire, à 320 px, toucher « droit du sol » ouvre la bulle entière dans l'écran, aucune réponse n'est enregistrée ; le lien « Voir le glossaire » mène à l'ancre de `/glossaire` ; au clavier, ouverture et fermeture avec retour du focus. Capture d'écran à l'appui. Dépend de T064.

**Checkpoint**: glossaire relu et publié, page Glossaire en ligne, termes définis au questionnaire et aux résultats.

---

## Phase 9: Polish & Cross-Cutting Concerns

- [ ] T066 [P] Compléter `data/README.md` avec le glossaire (`glossaire.yaml`, `institutionalDomains`, `data:glossary`, circuit de relecture) et vérifier la cohérence de la page Méthodologie avec la version affichée.
- [ ] T067 [P] Dérouler [quickstart.md](./quickstart.md) A à G et corriger tout écart (commande, chemin, chiffre attendu) dans le quickstart ou le code.
- [ ] T068 Lancer `pnpm verify` sur chaque branche avant sa PR, et `pnpm data:validate` sur le corpus final ; noter le nombre de tests et d'avertissements par rapport à T001.
- [ ] T069 Ajouter en fin de ce fichier une section « Écarts constatés à l'implémentation » qui liste les écarts entre spec, plan et réalisation (valeurs de `k`, chiffres SC-001/SC-002 obtenus, termes écartés), comme pour 008.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)** : aucune dépendance. T002 doit être committé avant toute modification du cœur.
- **Foundational (Phase 2)** : dépend de la phase 1 ; bloque US1, US2 et US3 seulement.
- **US1 (Phase 3)** : dépend de la phase 2.
- **US2 (Phase 4)** : dépend de la phase 2 ; T022 (rapport) dépend de T016 (US1), T026 dépend de T015.
- **US3 (Phase 5)** : T028 à T032 (agrégateurs) ne dépendent que de la phase 1 ; T033 (`data:gaps`) dépend de T016 et T020 ; la campagne (T038 à T041) suit la PR de code (T037).
- **Publication v5 (Phase 6)** : dépend de la relecture d'adrien (T041) et de la fusion des PR du récit A.
- **US4 (Phase 7)** : aucune dépendance sur le récit A ; peut commencer dès la phase 1.
- **US5 (Phase 8)** : dépend de T047 et T050 (US4) pour le schéma publié et le repérage ; la page dépend de T051 et T057.
- **Polish (Phase 9)** : après les récits livrés.

### Fichiers partagés entre les deux récits

Les récits A et B peuvent avancer en parallèle, mais touchent quelques fichiers communs : `scripts/data/lib/schema/governance.ts` et `data/corpus/governance.yaml` (T030 `aggregatorDomains`, T059 `institutionalDomains`), `src/i18n/messages/fr.json` (T025, T052, T062), `scripts/data/lib/rules/index.ts` (T032, T060), `package.json` (T034, T061) et `data/README.md` (T027, T036, T066). Chaque récit n'ajoute que ses propres clés ou lignes, sans réordonner l'existant ; le récit fusionné en second se rebase sur `main` et résout ces fichiers par union avant sa PR.

### User Story Dependencies

- **US1 (P1)** : indépendante une fois la phase 2 faite.
- **US2 (P1)** : utilise `rankedCandidates` de US1 pour le rapport ; le resserrement lui-même (T020, T021) est indépendant.
- **US3 (P2)** : utilise la banque active de US2 et l'audit de US1 pour le gain ; la règle `SRC-AGGREGATOR` est indépendante.
- **US4 (P2)** : indépendante du récit A.
- **US5 (P3)** : réutilise le schéma publié et le repérage de US4.

### Within Each User Story

- Les tests sont écrits avant l'implémentation et échouent d'abord.
- Types et schémas avant la logique ; logique pure avant commandes et composants ; composants avant intégration ; intégration avant e2e.
- Les tâches de données (campagne, inventaire) suivent le code qui les valide.

### Parallel Opportunities

- Phase 1 : T004 en parallèle de T002/T003.
- Phase 2 : T009 (banque) en parallèle de T007/T008 (schéma) une fois T006 fait.
- US1 : T011 et T012 en parallèle ; T016 en parallèle de T013 à T015.
- US2 : T018, T019, T025 et T027 en parallèle.
- US3 : T028, T029, T035 et T036 en parallèle ; T030 à T032 en parallèle de tout US1/US2.
- Récit B entier (Phase 7 et 8) en parallèle du récit A ; dans US4, T048, T049 et T053 en parallèle ; dans US5, T058 en parallèle de T059.

---

## Parallel Example: User Story 1

```text
# Tests (fichiers distincts) :
T011 Propriétés des règles 3 et cas US1 dans src/core/selection/fill-subject.test.ts
T012 Tests de rankedCandidates / missingForThreshold dans src/core/selection/coverage-audit.test.ts

# Implémentation en deux fils :
Fil 1 : T013 fill.ts → T014 fill-subject.ts → T015 select.ts
Fil 2 : T016 coverage-audit.ts
```

## Parallel Example: User Story 4

```text
T048 src/lib/glossary/annotate.test.ts
T049 src/ui/DefinedTerm/DefinedTerm.test.tsx
puis T050 annotate.ts et T052 DefinedTerm.tsx en parallèle, T053 stories après T052
```

---

## Implementation Strategy

### MVP First (US1 + US2)

1. Phase 1 (rejeux figés), phase 2 (règles 3 dans le jeu et la banque).
2. US1 : sélection par couverture, audit de couverture.
3. US2 : banque resserrée, rapport, Méthodologie.
4. **STOP and VALIDATE** : `pnpm data:publish --next --dry-run` ; si le rapport atteint SC-001 sans campagne, la v5 peut être publiée dès là (phase 6), sur décision d'adrien.

### Incremental Delivery

1. PR de code du récit A (US1 à US3) → v5 publiable.
2. PR de données par lot de campagne (US3) → relecture d'adrien → v5 ou v6 avec plus de candidats classés.
3. PR de publication v5 (phase 6).
4. PR du récit B (US4 + US5) → glossaire relu → `glossary.json` publié, sans nouvelle version de banque.

### Notes

- [P] = fichiers différents, aucune dépendance sur une tâche inachevée.
- Committer après chaque tâche ou groupe logique ; T002 dans un commit seul.
- Les étapes réservées à adrien sont la relecture des positions (`data:review`), la validation des définitions et les décisions sur le rapport sous les seuils ; tout le reste, vérifications au navigateur comprises, est fait par l'agent.
