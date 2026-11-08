# Tasks: Résultats, détail par candidat et partage par URL

**Input**: Design documents from `/specs/005-resultats-partage/`

**Prerequisites**: plan.md, spec.md (clarifiée le 2026-11-08), research.md (R1–R13),
data-model.md, contracts/ (routes-and-views.md, results-model.md, components.md,
data-and-share.md, i18n-messages.md), quickstart.md

**Tests**: la constitution exige un test Vitest et une story a11y par composant `src/ui`
(principe IV), des tests de bout en bout pour les parcours « résultats » et « ouverture d'un
lien partagé » (principe V) ; la spec fixe SC-001 sur les exemples chiffrés de la 003. Les
tâches de test font partie de chaque phase et sont écrites **avant** l'implémentation qu'elles
couvrent. Les e2e tournent contre l'export statique avec une banque fictive à deux versions
servie par interception de route (R11) : aucune publication réelle n'est nécessaire.

**Organization**: tâches groupées par user story. Aucune dépendance ajoutée ; `src/core` n'est
**pas** modifié (principe III).

## Format: `[ID] [P?] [Story] Description`

- **[P]** : parallélisable (fichiers différents, aucune dépendance sur une tâche inachevée)
- **[Story]** : US1 à US5, user stories de [spec.md](spec.md)
- Chemins relatifs à la racine du dépôt

## Conventions communes à toutes les tâches

- **Frontières** : `src/lib/results/**` importe `@/core`, `@/lib/dataset-client` et
  `@/lib/questionnaire` (types, `resultHref`) ; jamais `next/*`, `react` ni `src/ui`.
  `src/ui/**` n'importe ni `@/core` ni `next/*` (sauf `next-intl`) : les types nécessaires
  (`Band`, `AgreementLevel`, `EvidenceLevel`, `ScaleValue`) sont redéclarés en unions de
  chaînes dans le composant ou importés de `src/ui` existant (`EvidenceBadge`).
  `git diff --stat main -- src/core` reste vide.
- **Textes** : aucune chaîne française en dur dans `src/app` ni `src/ui`
  (`react/jsx-no-literals`) ; clés de [contracts/i18n-messages.md](contracts/i18n-messages.md).
  Dates via `useFormatter` ou `formatPublishedAt`.
- **Styles** : tokens seulement ; cibles `min-h-touch` (44 px) ; chaque composant vérifié à
  320 px et dans les deux apparences.
- **Tests** : `*.test.ts(x)` à côté des modules, projet Vitest `unit` ; modules sans DOM en
  `// @vitest-environment node` ; composants via `src/lib/test-utils.tsx`. Lancer avec
  `pnpm vitest run <chemin> </dev/null`. Stories : une par état listé dans
  [contracts/components.md](contracts/components.md).
- **Vie privée** : aucune URL construite avec l'état ; aucun `fetch` hors des fonctions de
  `src/lib/dataset-client.ts` ; liens sources en `rel="noopener noreferrer"`.
- **Commentaires et messages** : en français ; identifiants en anglais ; chaque module cite les
  FR qu'il met en œuvre dans son en-tête.

---

## Phase 1: Setup

**Purpose**: arborescence, textes et tokens, sans logique.

- [ ] T001 Créer `src/lib/results/` et les dossiers de composants `src/ui/ResultsHeader/`,
  `src/ui/RankingList/`, `src/ui/InsufficientList/`, `src/ui/ThemeScoreList/`,
  `src/ui/QuestionDetail/`, `src/ui/ComparisonTable/`, `src/ui/SharePanel/` (un `index.ts`
  vide dans chacun)
- [ ] T002 [P] Ajouter à `src/i18n/messages/fr.json` toutes les clés `results.*` et `ui.*` de
  [contracts/i18n-messages.md](contracts/i18n-messages.md), retirer `results.title` (page de
  garde, remplacé), `results.soon`, `results.backToQuestionnaire` ; typographie française
  (espaces insécables avant `:` `;` `?` `!`) ; déclarer les nouvelles clés dans la liste de
  `src/i18n/messages.test.ts`
- [ ] T003 [P] Ajouter `--color-series-1`, `--color-series-2`, `--color-series-3` (clair et
  sombre ; sarcelle, ocre, prune, R9) dans `src/ui/tokens.css`, leur classe utilitaire Tailwind,
  et les contrôles de contraste ≥ 3:1 sur `surface` dans `src/ui/tokens.test.ts` ; documenter
  dans `src/ui/Tokens.mdx` l'attribution par emplacement de comparaison

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: modules purs, chargement, partage et composants, tous testés ; bloque toutes les
stories.

- [ ] T004 Écrire `src/lib/results/types.ts` : `PageState`, `ReadyData`, `ResultsView`,
  `RankingRow`, `InsufficientRow`, `CandidateSheet`, `ThemeRow`, `QuestionRow`, `SkippedRow`,
  `ComparisonView`, `ViewState`, `AgreementLevel` (data-model § 1–7, results-model)
- [ ] T005 [P] Test `src/lib/results/agreement.test.ts` : concordances 1, 3/4, 1/2, 1/4, 0 ⇒
  `identical` … `opposite` ; toute autre valeur lève une erreur de programmation
- [ ] T006 [P] Implémenter `agreementOf` dans `src/lib/results/agreement.ts` (R3)
- [ ] T007 [P] Test `src/lib/results/view-model.test.ts` : pour `EXAMPLE_A` et `EXAMPLE_B`
  de `@/core`, classement (rang, `tied`, `percent`, `band`) et données insuffisantes conformes
  aux valeurs attendues (SC-001) ; tableaux de scores construits pour : ex æquo 1, 1, 3 ; tous
  ex æquo ; un seul classé ; aucun classé (`noneRanked`) ; `unknown = answered − known` ; ordre
  des thèmes prioritaires puis autres, ligne `others` en mode court ; une question à deux thèmes
  présente une seule fois dans la fiche ; questions passées et compte des non répondues ;
  comparaison à 2 et 3 colonnes avec emplacements dans l'ordre d'ajout ; `withdrawn` posé
  d'après `prior.withdrawnIds`
- [ ] T008 Implémenter `resultsView`, `candidateSheet`, `comparisonView`, `orderedThemeKeys`
  dans `src/lib/results/view-model.ts` (data-model § 2–7, sans recalcul de score)
- [ ] T009 [P] Test `src/lib/dataset-client.test.ts` (compléter) : `loadDetail(v, id)` appelle
  `/data/versions/<v>/candidates/<id>.json` sans paramètre, `cache: 'force-cache'`, valide par
  `CandidateDetailSchema`, mémoïse par `(v, id)`, ne mémorise pas l'échec, refuse un identifiant
  hors `^[a-z0-9-]+$`
- [ ] T010 Implémenter `loadDetail` dans `src/lib/dataset-client.ts` (data-and-share § 1, R5)
- [ ] T011 [P] Test `src/lib/results/load.test.ts` (fetcher simulé, banque `syntheticDataset`
  en v1 et v2) : `''`/`'#'` ⇒ `no-fragment` ; `current = 0` ⇒ `no-version` ; préfixe faux,
  caractère hors alphabet, CRC faux, longueur fausse, 2 sujets ⇒ `invalid` avec la raison ;
  version > current ⇒ `unknown-version` ; v = current ⇒ `ready` sans requête supplémentaire ;
  v < current ⇒ `ready` calculé avec v seulement, `prior.publishedAt` de v et `withdrawnIds`
  corrects ; échec réseau ⇒ `error: network` ; jeu invalide ⇒ `error: invalid-data` ; jamais
  d'exception ; `shareUrl = origin + '/resultats#1.…'`
- [ ] T012 Implémenter `loadResults` dans `src/lib/results/load.ts` (R2, R4, contrat
  `core-api` § flux 005)
- [ ] T013 [P] Test `src/lib/results/history.test.ts` : `readView` tolère `null`, objets
  étrangers et vues invalides (⇒ `ranking`) ; `pushView`/`replaceView` gardent l'URL courante
  (faux `History`)
- [ ] T014 [P] Implémenter `src/lib/results/history.ts` (R1)
- [ ] T015 [P] Test `src/lib/results/share.test.ts` : `copyLink` ⇒ `copied` si `writeText`
  réussit, `manual` s'il rejette ou est absent ; `canShareNatively` ; `shareNatively`
  distingue partage et annulation (`AbortError`)
- [ ] T016 [P] Implémenter `src/lib/results/share.ts` (R6)
- [ ] T017 [P] Test `src/lib/questionnaire/from-result.test.ts` : `draftFromResultState` même
  version, `position` = première non répondue sinon 0, aller-retour
  `decodeFragment(resultHref(draft))` = état ; `carryOver` reporte par identifiant, laisse
  `'unanswered'` aux questions nouvelles, renvoie `choose-themes` si moins de 3 sujets
  subsistent ; `needsConfirmation` ignore `position` et `updatedAt`
- [ ] T018 Implémenter `src/lib/questionnaire/from-result.ts` (data-and-share § 4, R7) et
  l'exporter depuis le `README.md` du module
- [ ] T019 [P] Composant `src/ui/ResultsHeader/` (`ResultsHeader.tsx`, `.stories.tsx`,
  `.test.tsx`, `index.ts`) selon contracts/components.md ; états 3/4/5 sujets, court, complet,
  320 px
- [ ] T020 [P] Composant `src/ui/RankingList/` (fichiers idem) ; états un seul, ex æquo, tous
  ex æquo, 3 sélectionnés (case désactivée et raison), retiré ; test : rang et « ex æquo » en
  texte, `aria-pressed`, `onOpen`/`onToggleCompare`
- [ ] T021 [P] Composant `src/ui/InsufficientList/` ; rendu atténué AA (jamais l'opacité
  seule), mention pluralisée ; états vide (non rendu), plusieurs, tous
- [ ] T022 [P] Composant `src/ui/ThemeScoreList/` ; sujet clé (étoile + texte), « — » avec
  « non calculable », couverture ; états complet, court (`others`), indéfinis
- [ ] T023 [P] Composant `src/ui/QuestionDetail/` réutilisant `EvidenceBadge` ; états
  identique … opposé, inconnue, passée, citation absente, détail en chargement, en erreur ;
  test : lien source `target="_blank"` `rel="noopener noreferrer"`, mention « nouvel onglet »
- [ ] T024 [P] Composant `src/ui/ComparisonTable/` ; blocs < 640 px, `<table>` ≥ 640 px
  (`th scope`) ; formes et `--color-series-<slot>` ; bouton « Retirer » ; états 2, 3, avec
  insuffisant, court, 320 px
- [ ] T025 [P] Composant `src/ui/SharePanel/` ; région `aria-live="polite"`, champ `readonly`
  de repli sélectionné, bouton natif conditionnel, aperçu ; états initial, copié, manuel, natif
- [ ] T026 Exporter les sept composants depuis `src/ui/index.ts`

**Checkpoint**: modules et composants verts ; aucune page encore.

---

## Phase 3: User Story 1 - Consulter mon classement des candidats (Priority: P1) 🎯 MVP

**Goal**: un lien `/resultats#1.…` affiche sujets clés, classement (rang, ex æquo, %, bande),
données insuffisantes, phrase de plafonnement et lien Méthodologie.

**Independent Test**: ouvrir un lien fabriqué par `encodeFragment` sur la banque fictive et
vérifier ordre, pourcentages, bandes, ex æquo, section « Données insuffisantes », message
« aucun classable ».

- [ ] T027 [P] [US1] Étendre `e2e/fixtures/published.ts` : versions 1 et 2 (`syntheticDataset`
  avec, en v2, un candidat retiré, un ajouté et une position modifiée) ; `servePublished(page,
  { current })` sert aussi `/data/versions/<n>/candidates/<id>.json` (citation et source
  fictives, `https://exemple.invalid/…`) ; aides `linkFor(state, version)` et
  `expectedBoard(state, version)` calculées avec `@/core`
- [ ] T028 [P] [US1] Écrire `e2e/results.spec.ts` (scénarios US1) : questionnaire complet à
  4 sujets ⇒ sujets rappelés, entrées dans l'ordre de `expectedBoard`, pourcentages et bandes ;
  ex æquo ; candidat en données insuffisantes avec mention ; aucun classable (3 réponses) ⇒
  message et « Répondre à davantage de questions » ; phrase de plafonnement et lien
  Méthodologie ; 320 px sans défilement horizontal
- [ ] T029 [US1] Créer `src/app/resultats/ResultsApp.tsx` (client) : lecture du fragment après
  montage, `loadResults`, rendu des états de contracts/routes-and-views.md (tous les états
  sans résultat, texte seul pour l'instant), vue classement avec `ResultsHeader`, `RankingList`,
  `InsufficientList`, message « aucun classable » ; écoute `hashchange`
- [ ] T030 [US1] Remplacer `src/app/resultats/page.tsx` par la page statique : métadonnées
  génériques (`results.meta.*`, `openGraph` sans image, FR-029) et `<ResultsApp/>` ; aucun
  chiffre ni nom dans le HTML exporté
- [ ] T031 [US1] Brancher « Voir le détail » et « Comparer » de `RankingList` sur des
  gestionnaires vides de `ResultsApp` (complétés en US4 et US5) et vérifier les scénarios US1
  verts (`pnpm build && pnpm e2e -- e2e/results.spec.ts`)

**Checkpoint**: MVP : un lien de résultats est lisible et honnête.

---

## Phase 4: User Story 2 - Partager mes résultats par un lien et les rouvrir (Priority: P2)

**Goal**: copier le lien (ou repli manuel, ou partage natif), le rouvrir à l'identique,
revenir au questionnaire pré-rempli, voir l'aperçu générique ; carte « Voir mes résultats ».

**Independent Test**: copier, rouvrir dans un contexte vierge, comparer chiffre à chiffre ;
modifier une réponse et obtenir un autre lien.

- [ ] T032 [P] [US2] Scénarios US2 dans `e2e/results.spec.ts` : copie (permission
  `clipboard-write` accordée) puis lecture du presse-papiers, aucune query string, fragment
  ≤ 64 (complet) et ≤ 32 (court) ; réouverture dans `browser.newContext()` : sujets, mode,
  classement, %, bandes, insuffisants identiques ; presse-papiers refusé ⇒ champ manuel ;
  aperçu générique identique pour deux liens différents ; « Modifier mes réponses » sans
  brouillon ⇒ questionnaire pré-rempli, changer une réponse, terminer ⇒ nouveau lien différent,
  l'ancien redonne les anciens chiffres (SC-011) ; avec un autre brouillon ⇒ confirmation,
  refus ⇒ brouillon intact
- [ ] T033 [P] [US2] Test `src/ui/ResumeCard/ResumeCard.test.tsx` (compléter) et stories : statut
  `complete` (titre, « Voir mes résultats », « Recommencer », notice si `versionChanged`)
- [ ] T034 [US2] Étendre `src/ui/ResumeCard/ResumeCard.tsx` avec le statut `complete` et
  `onViewResults` (contracts/components.md § ResumeCard)
- [ ] T035 [US2] Brancher `SharePanel` dans `ResultsApp` (classement et comparaison) avec
  `copyLink(data.shareUrl)`, `shareNatively` si disponible et l'aperçu `results.meta.*`
- [ ] T036 [US2] Ajouter « Modifier mes réponses » à `ResultsApp` : `draftFromResultState`
  (même version), `needsConfirmation` avec le brouillon lu par `readDraft`, `ConfirmDialog`
  (`results.modify.confirm.*`), `writeDraft` puis navigation vers `/questionnaire/questions` ;
  refus ⇒ rien d'écrit ; stockage indisponible ⇒ notice de la 004
- [ ] T037 [US2] Étendre `src/lib/questionnaire/resume-info.ts` (+ test) avec le statut
  `complete` et `src/app/ResumePrompt.tsx` : brouillon complet ⇒ `loadMain(draft.bankVersion)`,
  `resultHref`, `ResumeCard status="complete"` ; échec ⇒ carte `resumable` (data-and-share § 5)
- [ ] T038 [US2] Ajouter un test e2e dans `e2e/questionnaire.spec.ts` : questionnaire terminé ⇒
  accueil propose « Voir mes résultats » menant au même lien que l'écran de fin

**Checkpoint**: le partage et la modification fonctionnent ; US1 inchangée.

---

## Phase 5: User Story 3 - Ouvrir un lien invalide ou issu d'une version antérieure (Priority: P2)

**Goal**: messages explicites pour les liens corrompus, impossibles, inconnus ou absents ;
ancien lien rejoué avec ses données et averti.

**Independent Test**: ouvrir les liens fabriqués et vérifier message et absence de chiffre.

- [ ] T039 [P] [US3] Scénarios US3 dans `e2e/results.spec.ts` : caractère supprimé, caractère
  altéré, CRC faux, 2 sujets, 10 000 caractères ⇒ `results.invalid.*` en `role="alert"`, aucun
  pourcentage ni nom ; lien v1 avec `current = 2` ⇒ avertissement daté (format français),
  chiffres égaux à `expectedBoard(state, 1)`, « ne se présente plus » sur le candidat retiré,
  compte des retirés, « Refaire le questionnaire » et lien Méthodologie ; lien v3 ⇒ invitation
  à recharger, fragment conservé ; sans fragment ⇒ invitation à commencer, carte de reprise si
  brouillon
- [ ] T040 [US3] Finaliser dans `ResultsApp` les états `invalid`, `unknown-version`, `error`
  (« Réessayer »), `no-fragment` (réutiliser `ResumePrompt`), `no-version` (texte de la 004),
  avec les `Notice` et boutons de contracts/routes-and-views.md
- [ ] T041 [US3] Avertissement de version (`Notice`, `results.prior.*`) en tête de la vue
  classement quand `prior` ; mention « ne se présente plus » dans `RankingList`,
  `InsufficientList` et la fiche
- [ ] T042 [US3] « Refaire le questionnaire avec les données actuelles » : `carryOver` vers la
  version courante (chargée par `loadMain(current)`), confirmation commune avec T036,
  `choose-themes` ⇒ `/questionnaire` avec les sujets restants présélectionnés transmis par
  `history.state` (lecture ajoutée à `src/app/questionnaire/page.tsx`)

**Checkpoint**: aucun lien ne mène à une page vide ou à des chiffres faux.

---

## Phase 6: User Story 4 - Comprendre le détail d'un candidat (Priority: P3)

**Goal**: fiche du candidat : thèmes ordonnés, détail par question avec preuve et source,
questions passées, non répondues ; vue sur la même page avec retour arrière.

**Independent Test**: ouvrir la fiche d'un classé et d'un insuffisant, vérifier contenu, ordre
et la requête du détail à l'ouverture seulement.

- [ ] T043 [P] [US4] Scénarios US4 dans `e2e/results.spec.ts` : fiche classée (ordre des
  thèmes, sujets clés distingués, « — », couverture) ; mode court ⇒ ligne « autres thèmes » ;
  lignes de question (réponse, position ou « inconnue », palier, badge, citation, lien source
  nouvel onglet) ; passées sans palier ; compte des non répondues ; fiche insuffisante sans
  rang ni score global ; aucune requête `candidates/` avant l'ouverture, une seule après ;
  bouton précédent du navigateur ⇒ classement, focus sur l'entrée quittée ; adresse inchangée
- [ ] T044 [US4] Vue fiche dans `ResultsApp` : `pushView({ view: 'candidate', … })`,
  `candidateSheet`, `ThemeScoreList`, groupes de `QuestionDetail`, « Questions passées », non
  répondues, Méthodologie, « Comparer », « Retour au classement » ; focus titre (R12) ;
  `popstate` et restauration du défilement
- [ ] T045 [US4] Chargement du détail à l'ouverture : `loadDetail(data.bank.version, id)`,
  état `loading | ready | error` passé à `QuestionDetail` ; citation via
  `detail.positions[questionId]`, source via `detail.sources[quoteSource]` (date selon sa
  précision) ; aucun préchargement

**Checkpoint**: chaque pourcentage remonte à une source.

---

## Phase 7: User Story 5 - Comparer deux ou trois candidats (Priority: P4)

**Goal**: sélection de 2 à 3 candidats et vue côte à côte, lisible à 320 px.

**Independent Test**: sélectionner 2 puis 3, refuser le 4e, retirer, revenir en arrière.

- [ ] T046 [P] [US5] Scénarios US5 dans `e2e/results.spec.ts` : sélection de 2 (dont un
  insuffisant) ⇒ globaux ou « données insuffisantes », thèmes dans l'ordre ; 3e ajouté ; 4e
  indisponible et limite annoncée ; retrait ; précédent ⇒ classement ; lien de partage inchangé
  (FR-022) ; 320 px sans défilement horizontal
- [ ] T047 [US5] Barre de comparaison dans la vue classement (sélection locale 0–3, annonce
  `aria-live` des ajouts, retraits et de la limite) et « Comparer » depuis la fiche
- [ ] T048 [US5] Vue comparaison dans `ResultsApp` : `pushView({ view: 'compare', … })`,
  `comparisonView`, `ComparisonTable`, retrait (2 ⇒ reste ouverte, 1 ⇒ retour au classement
  avec sélection), « Retour au classement », `SharePanel`

**Checkpoint**: toutes les stories fonctionnent indépendamment.

---

## Phase 8: Polish & Cross-Cutting Concerns

- [ ] T049 [P] Test e2e transversal dans `e2e/results.spec.ts` : observation de toutes les
  requêtes (`page.on('request')`) pendant chargement, copie, fiche, comparaison ; chaque URL dans
  la liste blanche de contracts/data-and-share.md § 2 ; aucune ne contient la charge du fragment
  ni de query string porteuse (SC-003)
- [ ] T050 [P] Test e2e clavier : classement → fiche → retour → comparaison → partage sans souris,
  focus toujours visible (SC-008)
- [ ] T051 [P] Test i18n dans `src/i18n/messages.test.ts` : clés `results.band.*` = valeurs de
  `Band`, `results.agreement.*` = `AgreementLevel` ; aucune clé de la page de garde ne subsiste
- [ ] T052 [P] Mettre à jour la page Méthodologie si nécessaire pour les libellés de paliers
  (`src/app/methodologie/page.tsx`) et le `README.md` (tableau des fonctionnalités : 003, 004,
  005 réalisées ; partage par URL)
- [ ] T053 Mesurer le JS initial de `/resultats` sur l'export (≤ 200 ko compressés) et consigner
  la mesure en fin de ce fichier
- [ ] T054 Vérifications navigateur de [quickstart.md](quickstart.md) § 3, faites par l'agent
  (320 px, clair et sombre, contraste des marqueurs de série et du rendu atténué, arbre
  d'accessibilité) ; consigner les résultats dans `quickstart.md` § « Résultats »
- [ ] T055 `pnpm verify` vert ; cocher les items de `checklists/requirements.md` encore
  pertinents ; passer `spec.md` en `Status: Implemented`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)** : T002 et T003 en parallèle après T001.
- **Foundational (Phase 2)** : T004 d'abord ; puis paires test → implémentation en parallèle
  (T005→T006, T007→T008, T009→T010, T011→T012, T013→T014, T015→T016, T017→T018) ; T019–T025
  en parallèle et indépendants des modules ; T026 après T019–T025. Les modules ne dépendent que des types
  de T004. **Bloque toutes les stories.**
- **US1 (Phase 3)** : après la Phase 2 ; T027, T028 en parallèle ; T029 → T030 → T031.
- **US2 à US5 (Phases 4–7)** : chacune après US1 ; indépendantes fonctionnellement **mais**
  toutes modifient `src/app/resultats/ResultsApp.tsx` : séquentiel sur cette branche.
  T042 (US3) réutilise la confirmation de T036 (US2) : faire US2 avant US3 ou extraire la
  confirmation dans T042.
- **Polish (Phase 8)** : après toutes les stories retenues.

### User Story Dependencies

- **US1 (P1)** : Phase 2 seulement ; MVP autonome.
- **US2 (P2)** : US1 (vue classement) ; indépendante de US3–US5.
- **US3 (P2)** : US1 ; partage la confirmation de US2 (voir ci-dessus).
- **US4 (P3)** : US1 ; indépendante de US2, US3, US5.
- **US5 (P4)** : US1 ; « Comparer » depuis la fiche suppose US4 (sinon seulement depuis le
  classement).

### Within Each User Story

- Tests écrits et **rouges** avant l'implémentation (e2e rouges tant que la vue n'existe pas).
- Modules `src/lib` avant `ResultsApp` ; build avant e2e.
- Story terminée quand ses e2e et tests unitaires sont verts sans régression.

### Parallel Opportunities

- Phase 2 : 7 paires de modules et 7 composants en parallèle.
- US1 : fixtures et scénarios e2e en parallèle.
- Les tâches e2e de chaque story (T032, T039, T043, T046) peuvent être écrites en parallèle
  dès la fin de US1.
- Phase 8 : T049–T052 en parallèle.

---

## Parallel Example: Phase 2

```bash
# Modules (après T004), chaque paire test → implémentation :
Task: "T005 agreement.test.ts"      → "T006 agreement.ts"
Task: "T007 view-model.test.ts"     → "T008 view-model.ts"
Task: "T009 dataset-client.test.ts" → "T010 loadDetail"
Task: "T011 load.test.ts"           → "T012 load.ts"
Task: "T013 history.test.ts"        → "T014 history.ts"
Task: "T015 share.test.ts"          → "T016 share.ts"
Task: "T017 from-result.test.ts"    → "T018 from-result.ts"

# Composants, en parallèle des modules :
Task: "T019 ResultsHeader"  Task: "T020 RankingList"     Task: "T021 InsufficientList"
Task: "T022 ThemeScoreList" Task: "T023 QuestionDetail"  Task: "T024 ComparisonTable"
Task: "T025 SharePanel"
```

## Parallel Example: User Story 1

```bash
Task: "T027 e2e/fixtures/published.ts (deux versions, détails)"
Task: "T028 e2e/results.spec.ts (scénarios US1)"
# Puis T029 (ResultsApp) → T030 (page) → T031.
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1 (T001–T003) puis Phase 2 (T004–T026).
2. Phase 3 (T027–T031) : un lien de résultats affiche le classement.
3. **Stop and validate** : e2e US1 verts, page lisible à 320 px dans les deux apparences.

### Incremental Delivery

1. MVP (US1) → US2 (partage, modification, carte d'accueil) → US3 (liens invalides et
   anciens) → US4 (fiche) → US5 (comparaison) → Polish.
2. Chaque story ajoute une valeur testable sans casser les précédentes ; commit par tâche ou
   groupe logique, arrêt à chaque checkpoint.

### Notes

- Aucune publication réelle n'est nécessaire ; SC-006 (< 2 s sur téléphone) et SC-007 (test
  utilisateur à cinq personnes) se vérifient après la première publication (quickstart § 4) et
  ne sont pas des tâches de cette liste.
- Les vérifications navigateur (T054) sont faites par l'agent, pas par le propriétaire.
