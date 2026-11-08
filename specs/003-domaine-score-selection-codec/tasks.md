# Tasks: Moteur de score, sélection déterministe des questions et codec URL

**Input**: Design documents from `/specs/003-domaine-score-selection-codec/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ (core-api.md,
link-format.md), quickstart.md

**Tests**: la constitution (principe III) exige que chaque fonction du cœur soit couverte par
des tests unitaires **et** des tests de propriétés, et la spec fixe des critères mesurables
(SC-001 à SC-009) qui ne se vérifient que par des tests. Les tâches de test font donc partie
de chaque story et sont écrites **avant** l'implémentation qu'elles couvrent (exemples de la
spec en fixtures, propriétés fast-check).

**Organization**: tâches groupées par user story. Aucune dépendance ajoutée ; `fast-check`
4.10, Vitest 5.1 et `zod` 4.6 sont déjà installés (002).

## Format: `[ID] [P?] [Story] Description`

- **[P]** : parallélisable (fichiers différents, aucune dépendance sur une tâche inachevée)
- **[Story]** : US1 à US4, user stories de [spec.md](spec.md)
- Chemins relatifs à la racine du dépôt (projet unique, voir plan.md § Project Structure)

## Conventions communes à toutes les tâches

- **Pureté** : tout fichier sous `src/core/` n'importe que `src/core/**` et `zod` ; aucun
  `react`, `next`, DOM, `node:*`, `Buffer`, `atob`, `Date.now`, `Math.random`. La règle de lint
  existante le vérifie (`pnpm lint`).
- **Arithmétique** : toute grandeur de score est un `Ratio` BigInt ([research.md](research.md)
  R2) ; `number` uniquement dans les champs `approx` et `percent` (entier).
- **Erreurs** : `StateError` (code typé) pour un appel incorrect ; `DecodeResult` (`ok: false`,
  `reason`) pour un lien invalide, jamais d'exception ([contracts/core-api.md](contracts/core-api.md)).
- **Tests** : `*.test.ts` à côté des modules, projet Vitest `unit`, en-tête
  `// @vitest-environment node`, lancés avec `pnpm vitest run <chemin> </dev/null`. Les
  propriétés utilisent `fc.assert(fc.property(...))` avec `numRuns` explicite quand la spec
  fixe un volume (SC-002 : 10 000). Les tests ne lisent jamais `public/data`.
- **Commentaires et messages** : en français ; identifiants de code en anglais ; chaque module
  cite les FR qu'il met en œuvre dans son en-tête.

---

## Phase 1: Setup

**Purpose**: préparer l'arborescence et les points d'entrée sans logique.

- [X] T001 Créer les dossiers `src/core/bank/`, `src/core/selection/`, `src/core/score/`,
  `src/core/codec/` et le fichier `src/core/index.ts` réexportant `./types`, `./ratio`,
  `./dataset`, `./bank`, `./selection`, `./score`, `./codec` (les sous-modules pourront être
  vides au début : créer un `index.ts` vide dans chaque dossier)
- [X] T002 [P] Mettre à jour `src/core/README.md` : décrire les quatre nouveaux modules, le
  graphe de dépendances (`dataset ← bank ← selection ← score, codec`), la règle d'arithmétique
  exacte et le lien vers `specs/003-domaine-score-selection-codec/contracts/core-api.md`
- [X] T003 [P] Vérifier que `src/lib/core-boundary.test.ts` couvre bien `src/core/**` (motif de
  fichiers de la règle `no-restricted-imports` dans `eslint.config.mjs`) et ajouter, si le test
  énumère des chemins, les quatre nouveaux dossiers

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: types partagés, arithmétique exacte, vue « version de banque » et banques
fictives, dont dépendent toutes les stories.

**⚠️ CRITICAL**: aucune story ne commence avant la fin de cette phase.

- [X] T004 Écrire `src/core/types.ts` : `Mode`, `Answer`, `ResultState`, `Band`,
  `RejectionReason`, `ExclusionReason`, `DecodeResult<T>`, `StateError` (codes
  `bad-priorities | bad-mode | bad-answer-count | bad-answer | version-mismatch`) et les
  constantes `TARGET_COUNT`, `QUOTA_FLOOR`, `PRIORITY_WEIGHT`, `OTHER_WEIGHT`,
  `MIN_PRIORITIES`, `MAX_PRIORITIES`, `MIN_THEME_QUESTIONS`, `COVERAGE_THRESHOLD`,
  `LINK_FORMAT_VERSION`, `BANDS` ([data-model.md](data-model.md) § 1 et § 4)
- [X] T005 [P] Écrire `src/core/ratio.test.ts` : réduction par pgcd, `add/sub/mul/div`,
  `cmp` par produit en croix, `mean`, `weightedMean`, `floorPercentSigned(1/4) = 62`,
  `floorPercentSigned(0) = 50`, `floorPercentSigned(1) = 100`, `floorPercentSigned(−1) = 0`,
  `floorPercentUnit(3/4) = 75`, `floorPercentUnit(1/2) = 50`, et propriétés fast-check :
  `cmp` antisymétrique et transitif, `toNumber` monotone, `floorPercent*` égal à
  `Math.floor` sur des rationnels à petit dénominateur
- [X] T006 [P] Écrire `src/core/ratio.ts` : type `Ratio { num: bigint; den: bigint }` réduit,
  `ratio(num, den)`, `ZERO`, `ONE`, `add`, `sub`, `mul`, `div`, `cmp`, `min`, `mean(list)`,
  `weightedMean([{ value, weight }])`, `floorPercentSigned`, `floorPercentUnit`, `toNumber`
  ([data-model.md](data-model.md) § 2)
- [X] T007 [P] Écrire `src/core/bank/bank.test.ts` : `bankFromDataset(minimalMainDataset())`
  donne 2 thèmes indexés 0 et 1, `questionById`, `themeIndexById`, positions alignées ;
  `BankError` pour un jeu à 25 thèmes (`too-many-themes`), un thème dupliqué, une question
  référençant un thème inconnu, des positions désalignées ; `normalizePriorities` trie en ordre
  canonique, refuse 2 ou 6 sujets, un doublon et un identifiant inconnu (`bad-priorities`,
  conformément à [contracts/core-api.md](contracts/core-api.md))
- [X] T008 [P] Écrire `src/core/bank/bank.ts` : types `BankTheme`, `BankQuestion`,
  `BankCandidate`, `BankVersion`, classe `BankError`, `bankFromDataset(ds: MainDataset)` (lit
  `ds.themes` en ordre canonique, construit `themeIndices` depuis `q.themes`, `positions` en
  `ReadonlyMap`), `normalizePriorities(bank, ids)` ([data-model.md](data-model.md) § 3)
- [X] T009 [P] Écrire `src/core/bank/fixtures.ts` : `syntheticBank({ themes = 16, perTheme =
  20, version = 1, candidates = 22, publishedAt })` (identifiants `tNN`, `tNN-qMM`, `D_q = 2 −
  MM/perTheme`, une question sur cinq avec second thème `(NN + 1) mod T`, positions
  `((NN + MM + k) mod 5) − 2` avec `null` quand `(NN + MM + k) mod 7 = 0`, niveaux `p/l/d`
  cycliques), `bankPair()` (version 2 : sans `t03-q07`, avec `t03-q20`, position de `c05` sur
  `t04-q02` changée, candidat `c21` retiré), `exampleABank()` (thèmes `economie`, `sante` ;
  questions `q1`, `q2` économie, `q3`, `q4` santé ; un candidat `cand` aux positions `+1, +1,
  +2, null`), `selectionOf(bank, questionIds)` (construit une `Selection` littérale pour les
  tests de score, thème d'ancrage = premier thème) ([data-model.md](data-model.md) § 8)
- [X] T010 Écrire `src/core/bank/index.ts` réexportant `bank.ts` (pas `fixtures.ts`, réservé
  aux tests) et vérifier `pnpm vitest run src/core/ratio.test.ts src/core/bank </dev/null` vert
  et `pnpm lint` vert

**Checkpoint**: fondations prêtes ; US1, US2 et US3 peuvent avancer en parallèle.

---

## Phase 3: User Story 1 - Un score global plafonné par les sujets clés (Priority: P1) 🎯 MVP

**Goal**: `scoreCandidates` produit, pour une banque, une sélection et un état, les scores de
thème, `P`, `W`, la couverture, le statut, `G = min(W, P)`, la bande et le classement, en
arithmétique exacte, avec les exemples A et B de la spec comme fixtures.

**Independent Test**: `pnpm vitest run src/core/score src/core/ratio.test.ts </dev/null`
reproduit les exemples A et B et les scénarios 3 à 7 de l'US1, et les propriétés SC-005
passent sur des banques fictives, sans sélection algorithmique (sélections littérales via
`selectionOf`).

### Tests for User Story 1

- [X] T011 [P] [US1] Écrire `src/core/score/examples.ts` : `EXAMPLE_A` (banque
  `exampleABank()`, état mode complet, priorité `economie`, réponses `+2, −1, +2, 0`, attendus :
  `s = 1/2, 0, 1`, q4 exclue `unknown-position`, `S_economie = 1/4` (62 %), `S_sante = null`,
  `W = P = 1/4`, `G` 62 %, couverture 3/4 (75 %), `ranked`, `rather-aligned`) et `EXAMPLE_B`
  (trois thèmes dont un prioritaire à `S = 0` et deux à `S = 1`, attendus `W = 2/5` (70 %),
  `P = 0` (50 %), `G` 50 %) ; type `ScoreExample` exporté ([contracts/core-api.md](contracts/core-api.md))
- [X] T012 [P] [US1] Écrire `src/core/score/score.test.ts` (exemples) : `EXAMPLE_A` et
  `EXAMPLE_B` reproduits champ par champ (ratios exacts et `percent`), détail par question
  (concordance, niveau de preuve, motif d'exclusion) — SC-001
- [X] T013 [P] [US1] Écrire `src/core/score/candidate.test.ts` (scénarios US1 3 à 7) :
  couverture 5/10 → `insufficient-data`, `rank: null`, scores de thème définis fournis ; `P`
  indéfini avec couverture 90 % → insuffisant ; `W` 85 % et `P` 72 % → `G` 72 %, bande
  `rather-aligned` ; couverture exactement 60 % → classé ; thème à exactement 2 questions
  exploitables → défini ; aucune réponse numérique → couverture `null`, tous insuffisants,
  `ranked` vide ; deux candidats ne différant que par le niveau de preuve → scores identiques
- [X] T014 [P] [US1] Écrire `src/core/score/rank.test.ts` : X (`G` exact 5/8 = 62,5 %, `P`
  5/8), Y (`G` 62,2 %, `P` 65 %), Z (58 %) → `percent` 62, 62, 58 ; rangs 1, 1, 3 ; Y avant X ;
  égalité parfaite → identifiant croissant ; propriété : tri stable et idempotent
- [X] T015 [P] [US1] Écrire `src/core/score/themes.test.ts` : mode complet → un `ThemeScore`
  par thème avec `count` ; mode court → thèmes prioritaires + `{ kind: 'others' }` comptant
  chaque question une seule fois même si elle a deux thèmes non prioritaires ; question à deux
  thèmes prioritaires comptée dans les deux ; `null` sous 2 questions exploitables
- [X] T016 [P] [US1] Écrire `src/core/score/properties.test.ts` (fast-check, SC-005) : sur
  `syntheticBank()` et des états aléatoires (réponses, 3 à 5 sujets, deux modes), pour tout
  candidat classé `global.percent ≤ priority.percent` et `global.percent ≤ weighted.percent` ;
  `band = 'very-aligned' ⇒ priority.percent ≥ 80` ; `ranked.length + insufficient.length =
  candidates.length` ; `questions.length = selection.items.length` ; déterminisme (deux appels
  égaux en profondeur)

### Implementation for User Story 1

- [X] T017 [P] [US1] Écrire `src/core/score/concordance.ts` : `concordance(u: Answer, c:
  PositionCell): { concordance: Ratio; level: EvidenceCode } | { excluded: ExclusionReason }`
  avec `s = 1 − |u − c| / 2` (FR-001, FR-002)
- [X] T018 [US1] Écrire `src/core/score/themes.ts` : `themeScores(bank, selection, state,
  perQuestion)` → `ThemeScore[]` (moyenne des concordances par thème, chaque question comptée
  dans ses 1 ou 2 thèmes, `null` sous `MIN_THEME_QUESTIONS` ; pseudo-thème `others` en mode
  court, FR-003, FR-004, FR-013)
- [X] T019 [US1] Écrire `src/core/score/candidate.ts` : `scoreCandidate(...)` → `CandidateScore`
  (P, W pondéré 3/1, couverture `known/answered`, statut par seuil inclusif 60 et `P` défini,
  `G = min(W, P)`, `percent` par `floorPercentSigned`, bande par `BANDS`, FR-005 → FR-011,
  FR-014 → FR-016)
- [X] T020 [US1] Écrire `src/core/score/rank.ts` : `rankCandidates(scores)` → tri `G.percent ↓`,
  `P.ratio ↓`, `coverage.ratio ↓`, `id ↑`, rangs ex æquo avec saut (FR-012)
- [X] T021 [US1] Écrire `src/core/score/score.ts` : `scoreCandidates({ bank, selection, state,
  versionCount })` → `Scoreboard` (`ranked`, `insufficient` dans l'ordre du jeu,
  `answeredCount`, `priorVersion = bank.version < versionCount`, `bankPublishedAt`) ; **ne borne
  pas** le nombre de sujets (accepte 1 à `T` identifiants connus, sans appeler
  `normalizePriorities` : les exemples A et B n'ont qu'un sujet, spec § Assumptions) ; lève
  `StateError` si `state.answers.length ≠ selection.items.length` (`bad-answer-count`) ou
  `bank.version ≠ state.bankVersion` (`version-mismatch`) (FR-017)
- [X] T022 [US1] Écrire `src/core/score/index.ts` (réexports : `scoreCandidates`, types,
  `EXAMPLE_A`, `EXAMPLE_B`) et faire passer `pnpm vitest run src/core/score </dev/null`
- [X] T023 [US1] Écrire `src/core/score/perf.test.ts` (SC-008) : classement de 22 candidats ×
  100 questions × 16 thèmes sur `syntheticBank()` et `selectionOf` des 100 premières questions,
  durée mesurée avec `performance.now()` (disponible en Node et navigateur, hors `src/core`
  non : le test seul l'utilise), journalisée, échec au-delà de 500 ms

**Checkpoint**: le moteur de score est livrable seul, testé sur sélections littérales.

---

## Phase 4: User Story 2 - Une sélection de questions déterministe et adaptée aux sujets (Priority: P2)

**Goal**: `selectQuestions(bank, mode, priorities)` produit la liste ordonnée de `N` questions
(quotas, remplissage glouton, second passage, thème d'ancrage, tourniquet), identique à chaque
appel.

**Independent Test**: `pnpm vitest run src/core/selection </dev/null` vérifie les quotas des
scénarios 1 à 3, les scénarios 4 à 8, SC-004 (13 496 combinaisons) et SC-006.

### Tests for User Story 2

- [X] T024 [P] [US2] Écrire `src/core/selection/quotas.test.ts` : complet + sujets {0, 1, 2}
  → `[14, 14, 14, 5, 5, 5, 5, 5, 5, 4, 4, 4, 4, 4, 4, 4]` ; court + 5 sujets → `3, 3, 3, 3, 2`
  et `1 × 11` ; complet + 5 sujets → `12, 11, 11, 11, 11` et `4 × 11` ; propriété : `Σ = N`
  pour tout sous-ensemble de 3 à 5 parmi `T ∈ [8, 20]`, chaque quota ≥ plancher ; refus :
  mode court, `T = 21` et 5 sujets → `BankError('too-many-themes-for-quotas')` (FR-021)
- [X] T025 [P] [US2] Écrire `src/core/selection/select.test.ts` : scénario 5 (D_q 0,9, 0,9,
  0,4, quota 2 → les deux 0,9, égalité par identifiant) ; scénario 7 (thème prioritaire à 6
  questions, quota 14 → 100 questions, déficit comblé d'abord par les autres prioritaires) ;
  scénario 8 (question à deux thèmes créditée aux deux quotas) ; scénario 4 (deux appels
  égaux en profondeur) ; scénario 6 (alternance des thèmes d'ancrage, trois premières
  questions = trois sujets en ordre canonique) ; banque de 96 questions → 96 ; banque à
  `T = 24` acceptée ; `StateError` sur 2 ou 6 sujets ; `items[i].position = i`
- [X] T026 [P] [US2] Écrire `src/core/selection/enumeration.test.ts` (SC-004, SC-006) :
  énumération des 6 748 sous-ensembles × 2 modes sur `syntheticBank()` : `Σ quotas = N`, `N`
  identifiants distincts, alternance d'ancrage tant que deux thèmes restent, idempotence ;
  durée journalisée (attendu < 10 s ; si > 30 s en CI, réduire à un échantillon fast-check
  et garder l'énumération complète sous `RADAR_FULL_ENUMERATION=1`)

### Implementation for User Story 2

- [X] T027 [P] [US2] Écrire `src/core/selection/quotas.ts` : `computeQuotas(bank, mode,
  priorityIndices)` — part exacte `e_t = N·w_t/Σw` en `Ratio`, `q_t = max(plancher, ⌊e_t⌋)`,
  reste distribué une unité par thème par `(e_t − q_t)` décroissant puis ordre canonique ;
  lève `BankError('too-many-themes-for-quotas')` si `Σ q_t > N` avant distribution (FR-021)
- [X] T028 [US2] Écrire `src/core/selection/fill.ts` : `fillQuotas(bank, quotas,
  priorityIndices)` → premier passage glouton (prioritaires puis autres en ordre canonique,
  `D_q` décroissant puis identifiant croissant, une question retenue crédite tous ses thèmes)
  et second passage (restantes des prioritaires puis de toute la banque) jusqu'à `N` ou
  épuisement ; attribue `anchorThemeIndex` et `pass` (FR-022 → FR-024)
- [X] T029 [US2] Écrire `src/core/selection/order.ts` : `roundRobin(selected,
  rotationOrder)` → tourniquet sur les thèmes d'ancrage, chaque thème livrant sa question
  suivante par `D_q` décroissant puis identifiant, thèmes épuisés sautés ; pose `position`
  (FR-025, FR-026)
- [X] T030 [US2] Écrire `src/core/selection/select.ts` : `selectQuestions(bank, mode,
  priorities)` → normalise les priorités (`normalizePriorities`), calcule quotas, remplit,
  ordonne, retourne `Selection { mode, priorityIndices, quotas, items }` (FR-018, FR-019,
  FR-027)
- [X] T031 [US2] Écrire `src/core/selection/index.ts` et faire passer
  `pnpm vitest run src/core/selection </dev/null`
- [X] T032 [US2] Remplacer, dans `src/core/score/perf.test.ts`, la sélection littérale par
  `selectQuestions(syntheticBank(), 'full', …)` et vérifier que le budget SC-008 tient toujours

**Checkpoint**: sélection et score fonctionnent ensemble sur une banque fictive.

---

## Phase 5: User Story 3 - Un lien de résultat compact, fidèle et vérifié (Priority: P3)

**Goal**: `encodeFragment` et `decodeHeader`/`decodeFragment` réalisent la bijection état ↔
`#1.<charge>` avec les vérifications de FR-033 dans l'ordre et des motifs de rejet typés.

**Independent Test**: `pnpm vitest run src/core/codec </dev/null` reproduit les deux
fragments de référence, vérifie SC-002 (10 000 états), SC-003 (mutations) et SC-007
(longueurs), et les scénarios 5 à 7 de l'US3.

### Tests for User Story 3

- [X] T033 [P] [US3] Écrire `src/core/codec/fixtures.ts` : `FRAGMENT_FULL_EXAMPLE` et
  `FRAGMENT_SHORT_EXAMPLE` (`FragmentFixture { title, bank: () => BankVersion, state,
  fragment, bytesHex }`) avec les valeurs de
  [contracts/link-format.md](contracts/link-format.md) : banque `syntheticBank()` version 1,
  sujets d'indices 2, 7, 9 (court : 0, 2, 7, 9, 12), réponses `+2`, `skipped`, `−1`, reste
  `unanswered`
- [X] T034 [P] [US3] Écrire `src/core/codec/crc8.test.ts` : `crc8([])  = 0`, `crc8('123456789')
  = 0xF4` (vecteur de référence du CRC-8 polynôme 0x07), CRC des deux charges de référence
  `0xC3` et `0x9E` ; propriété : changer un octet change le CRC dans ≥ 99 % des cas
- [X] T035 [P] [US3] Écrire `src/core/codec/base64url.test.ts` : encodage sans `=` des octets
  de référence, décodage inverse, rejet de `=`, de `+`, `/`, espace, et d'une chaîne dont les
  bits de queue sont non nuls (`AA` décode `0x00`, `AQ` décode `0x01`, mais `AB` et `AC`
  sont refusés) ; propriété
  `decode(encode(b)) = b` et `encode(decode(s)) = s` pour toute chaîne valide
- [X] T036 [P] [US3] Écrire `src/core/codec/codec.test.ts` : fixtures caractère par caractère
  et octets (`00 00 84 02 00 C5 80 00 … C3` ; `00 01 85 12 00 C5 80 … 9E`) ; SC-007 (59 et 22
  caractères quels que soient sujets et réponses) ; SC-002 (`numRuns: 10000`, états
  aléatoires sur `syntheticBank()` : deux modes, 3 à 5 sujets, réponses, versions 1 et 2 via
  `bankPair()`) : `decodeFragment(encodeFragment(s)) = { ok: true, value: s }` et
  `encodeFragment(decodeFragment(c).value) = c` ; SC-003 : pour chaque position du fragment
  complet, substitution par chacun des 64 caractères, insertion, suppression → `ok: false`
  avec motif ∈ {`invalid-length`, `invalid-content`, `invalid-checksum`}, ou
  `unknown-bank-version` si l'altération modifie l'octet de version ; 1 000 charges
  aléatoires de 44 octets → ≥ 99 % rejetées ; scénario 6 (masque à 2 et 6 bits, code 7,
  bourrage non nul, bits réservés → `invalid-content`) ; scénario 7 (`2.`, sans point →
  `unsupported-link-version`) ; `#` optionnel accepté ; `expectedPayloadLength(100) = 44`,
  `(25) = 16`, `(96) = 42` ; `encodeFragment` lève `StateError` pour 2 sujets, mauvais
  nombre de réponses, version ≠ banque ; `decodeHeader` renvoie `{ bankVersion, mode,
  priorityIndices }` et `unknown-bank-version` si `versionCount` trop petit

### Implementation for User Story 3

- [X] T037 [P] [US3] Écrire `src/core/codec/crc8.ts` : table de 256 entrées calculée au
  chargement (polynôme 0x07), `crc8(bytes: Uint8Array): number` (FR-031)
- [X] T038 [P] [US3] Écrire `src/core/codec/base64url.ts` : `encodeBase64Url(bytes)` sans
  bourrage, `decodeBase64Url(text): Uint8Array | null` (alphabet strict, bits de queue nuls,
  longueur `≡ 1 mod 4` refusée) (FR-028, R3)
- [X] T039 [P] [US3] Écrire `src/core/codec/bits.ts` : `packAnswers(codes: number[]):
  Uint8Array` (3 bits, poids fort d'abord, bourrage nul) et `unpackAnswers(bytes, n):
  number[] | null` (null si un bit de bourrage est non nul) ; `answerToCode`, `codeToAnswer`
  (FR-029 (4), FR-030)
- [X] T040 [US3] Écrire `src/core/codec/payload.ts` : `buildPayload(state, bank, selection)`
  → `Uint8Array` (octet version − 1, drapeaux, masque 3 octets depuis `priorityIndices`,
  réponses, CRC) et `expectedPayloadLength(n)` ; `parseHeader(bytes)` → `{ versionByte, mode,
  reservedBits, maskIndices }` (FR-029, FR-032)
- [X] T041 [US3] Écrire `src/core/codec/encode.ts` : `encodeFragment(state, bank)` →
  `'#1.' + base64url(payload)` ; valide l'état (`normalizePriorities`, mode, `answers.length
  = selectQuestions(...).items.length`, domaine des réponses, `bankVersion = bank.version`) et
  lève `StateError` sinon (FR-028, FR-036)
- [X] T042 [US3] Écrire `src/core/codec/decode.ts` : `decodeHeader(fragment, versionCount)`
  (étapes 1 à 6 de [contracts/link-format.md](contracts/link-format.md), sans contrôle de
  `T`) et `decodeFragment(fragment, bank)` (étapes 1 à 9, `unknown-bank-version` si
  `bank.version ≠ octet + 1`, sélection recalculée, longueur, CRC, codes, bourrage ;
  retourne un `ResultState` aux priorités en identifiants ordonnés) (FR-033 → FR-035)
- [X] T043 [US3] Écrire `src/core/codec/index.ts` (réexports : `encodeFragment`,
  `decodeHeader`, `decodeFragment`, `expectedPayloadLength`, fixtures) et faire passer
  `pnpm vitest run src/core/codec </dev/null`

**Checkpoint**: un état se partage et se relit ; un lien abîmé est refusé avec un motif typé.

---

## Phase 6: User Story 4 - Des versions de banque immuables et des anciens liens fidèles (Priority: P4)

**Goal**: un lien émis avec la version 1 se rejoue exactement après publication de la version
2 ; une version inconnue est refusée ; le résultat signale la version antérieure.

**Independent Test**: `pnpm vitest run src/core/score/replay.test.ts src/core/codec/versions.test.ts </dev/null`
passe avec `bankPair()`.

### Tests for User Story 4

- [X] T044 [P] [US4] Écrire `src/core/codec/versions.test.ts` : état sur la version 2 →
  octet `0x01` ; `decodeHeader(lienV1, 2).value.bankVersion = 1` ; `decodeFragment(lienV1,
  bankV2)` → `unknown-bank-version` ; octet `0x03` avec `versionCount = 2` →
  `unknown-bank-version` ; `decodeFragment(lienV1, bankV1)` reconstruit la sélection de la
  version 1 (question `t03-q07` présente, `t03-q20` absente) et associe chaque réponse à la
  même question (scénarios 1, 2, 5)
- [X] T045 [P] [US4] Écrire `src/core/score/replay.test.ts` (SC-009, scénario 3) : pour 200
  états aléatoires sur `bankPair().v1`, `Scoreboard` calculé avant « publication » puis
  recalculé après décodage du lien avec `bankV1` et `versionCount = 2` → identiques en
  profondeur (scores, rangs, bandes, couvertures), `priorVersion: true`, `bankPublishedAt` =
  date de la version 1 ; le même lien scoré sur `bankV2` (test négatif) donne un résultat
  différent pour `c05` ou `c21`, ce qui prouve que la version compte

### Implementation for User Story 4

- [X] T046 [US4] Vérifier et compléter `src/core/score/score.ts` et
  `src/core/codec/decode.ts` pour que les tests T044 et T045 passent sans aucune lecture de
  données « courantes » : la seule source est la `BankVersion` passée en argument (FR-037 →
  FR-041) ; ajouter un en-tête de commentaire citant FR-039 et FR-040 dans les deux fichiers
- [X] T047 [US4] Documenter dans `src/core/README.md` le flux de rejeu d'un ancien lien
  (extrait de [contracts/core-api.md](contracts/core-api.md) : `decodeHeader` → chargement de
  la version → `bankFromDataset` → `decodeFragment` → `selectQuestions` → `scoreCandidates`)
  à l'intention des fonctionnalités 004 et 005

**Checkpoint**: toutes les user stories sont livrées et testées.

---

## Phase 7: Polish & Cross-Cutting Concerns

- [X] T048 [P] Compléter `src/core/index.ts` avec tous les réexports publics listés dans
  [contracts/core-api.md](contracts/core-api.md) et vérifier qu'aucun symbole de `fixtures.ts`
  ni d'`examples.ts` de test n'est réexporté par accident (les `EXAMPLE_*` et `FRAGMENT_*`
  le sont volontairement, SC-001)
- [X] T049 [P] Écrire `src/core/contract.test.ts` : test de contrat qui importe `@/core` et
  vérifie l'existence et le type (via `expectTypeOf` de Vitest) des exports de
  [contracts/core-api.md](contracts/core-api.md) : `selectQuestions`, `scoreCandidates`,
  `encodeFragment`, `decodeHeader`, `decodeFragment`, `bankFromDataset`, `TARGET_COUNT`,
  `EXAMPLE_A`, `FRAGMENT_FULL_EXAMPLE`
- [X] T050 [P] Relire chaque module de `src/core/{bank,selection,score,codec}` pour vérifier :
  aucune chaîne destinée à l'utilisateur, aucun `Date`, `Math.random`, `fetch`, `console` ;
  en-têtes citant les FR ; `readonly` sur les types publics
- [X] T051 Exécuter `pnpm verify` (lint, typecheck, data:validate, tests, Storybook, build,
  e2e) et corriger tout échec ; noter dans `specs/003-domaine-score-selection-codec/quickstart.md`
  les durées mesurées de SC-004 et SC-008 sur la machine de développement
- [X] T052 Exécuter `/speckit-analyze` (cohérence spec / plan / tasks) puis ouvrir la pull
  request `003-domaine-score-selection-codec → main` en citant la fonctionnalité et la
  conformité aux principes I à VII

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)** : aucune dépendance.
- **Foundational (Phase 2)** : dépend de la phase 1 ; bloque toutes les stories. Ordre interne :
  T004 → (T005 ∥ T006) et (T007 ∥ T008 ∥ T009) → T010.
- **US1 (Phase 3)**, **US2 (Phase 4)**, **US3 (Phase 5)** : dépendent de la phase 2 et sont
  **indépendantes entre elles**, sauf T032 (US2) qui touche un fichier de US1, et T041/T042
  (US3) qui appellent `selectQuestions` : l'encodeur et le décodeur ont besoin de US2 pour la
  longueur de charge. En pratique : US1 ∥ US2, puis US3 dès que T030 est fait.
- **US4 (Phase 6)** : dépend de US1, US2 et US3.
- **Polish (Phase 7)** : dépend de toutes les stories.

### User Story Dependencies

- **US1 (P1)** : fondations seulement (sélections littérales via `selectionOf`).
- **US2 (P2)** : fondations seulement.
- **US3 (P3)** : fondations + `selectQuestions` (T030).
- **US4 (P4)** : US1 + US2 + US3.

### Within Each User Story

- Fixtures et tests d'abord (ils échouent), puis implémentation jusqu'au vert, puis
  `index.ts` du module.
- Les modules marqués [P] d'une même story sont dans des fichiers distincts.

### Parallel Opportunities

- Phase 2 : T005, T006, T007, T008, T009 en parallèle après T004.
- US1 : T011 à T016 (tests) en parallèle ; puis T017 ∥ (T018 → T019 → T020 → T021).
- US2 : T024, T025, T026 en parallèle ; T027 ∥ T028 → T029 → T030.
- US3 : T033 à T036 en parallèle ; T037, T038, T039 en parallèle ; puis T040 → T041 → T042.
- US4 : T044 ∥ T045.
- Polish : T048, T049, T050 en parallèle.

---

## Parallel Example: User Story 1

```bash
# Tests et fixtures en parallèle (fichiers distincts) :
#   T011 src/core/score/examples.ts
#   T012 src/core/score/score.test.ts
#   T013 src/core/score/candidate.test.ts
#   T014 src/core/score/rank.test.ts
#   T015 src/core/score/themes.test.ts
#   T016 src/core/score/properties.test.ts
# Puis implémentation :
#   T017 concordance.ts  ∥  T018 themes.ts → T019 candidate.ts → T020 rank.ts → T021 score.ts
pnpm vitest run src/core/score </dev/null
```

## Parallel Example: User Story 3

```bash
# T033 fixtures.ts ∥ T034 crc8.test.ts ∥ T035 base64url.test.ts ∥ T036 codec.test.ts
# T037 crc8.ts ∥ T038 base64url.ts ∥ T039 bits.ts   →   T040 payload.ts → T041 encode.ts → T042 decode.ts
pnpm vitest run src/core/codec </dev/null
```

---

## Implementation Strategy

### MVP First (User Story 1 seule)

1. Phases 1 et 2 (T001 à T010).
2. US1 (T011 à T023) : le moteur de score est testable seul sur les exemples de la spec et
   des sélections littérales.
3. **STOP et valider** : `pnpm vitest run src/core </dev/null` et `pnpm lint` verts.

### Incremental Delivery

1. Fondations → US1 (score) : la promesse différenciante du produit est prouvée par les tests.
2. US2 (sélection) : le questionnaire devient constructible (004 peut démarrer).
3. US3 (codec) : le partage devient possible (005 peut démarrer).
4. US4 (versions) : la pérennité des liens est prouvée.
5. Polish : contrat d'export, `pnpm verify`, `/speckit-analyze`, pull request.

### Notes

- Aucune tâche ne touche `src/app`, `src/ui`, `scripts/`, `public/` ni `package.json`.
- Les durées de SC-004 et SC-008 sont journalisées, pas devinées ; si l'énumération dépasse
  30 s en CI, appliquer le repli décrit en T026.
- SC-001 exige aussi que les exemples A et B figurent sur la page Méthodologie : c'est une
  tâche de la 005 (afficher `EXAMPLE_A`, `EXAMPLE_B` et les formules depuis `@/core`), à
  inscrire dans son tasks.md.
- Suivi 002 : ajouter une règle de validation refusant plus de 20 thèmes actifs (invariant des
  quotas du mode court, FR-021 de la 003).
- Les fixtures de la spec (exemples A, B, deux fragments) sont la source de vérité ; en cas de
  désaccord entre un test et la spec, c'est la spec qui est corrigée par le propriétaire,
  jamais le test silencieusement.
