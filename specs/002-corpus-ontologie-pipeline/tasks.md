# Tasks: Corpus, ontologie et pipeline d'extraction des positions

**Input**: Design documents from `/specs/002-corpus-ontologie-pipeline/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ (corpus-files.md,
cli.md, published-dataset.md), quickstart.md

**Tests**: la constitution (principes III et V) et le plan exigent des tests : chaque règle de
validation a un test unitaire et une fixture de violation (SC-001), les métriques sont testées
par propriétés (fast-check), l'extraction est testée avec un client factice, les deux
composants ont des stories exécutées comme tests d'accessibilité, et la page Méthodologie a un
test Playwright. Les tâches de test font donc partie de chaque story.

**Organization**: tâches groupées par user story. Versions épinglées de
[research.md](research.md) : `zod` 4.6, `yaml` 2.9, `tsx` 4.23, `@anthropic-ai/sdk` 1.6,
`@mozilla/readability` 0.6, `linkedom` 0.18, `unpdf` 2.1, `fast-check` 4.10, sans `^`.

## Format: `[ID] [P?] [Story] Description`

- **[P]** : parallélisable (fichiers différents, aucune dépendance sur une tâche inachevée)
- **[Story]** : US1 à US4, user stories de [spec.md](spec.md)
- Chemins relatifs à la racine du dépôt (projet unique, voir plan.md § Project Structure)

## Conventions communes à toutes les tâches

- **Scripts** : TypeScript sous `scripts/data/`, exécutés par `tsx`, arguments via `node:util`
  `parseArgs`, sortie en français, codes de sortie `0` succès / `1` violation ou refus métier /
  `2` erreur d'usage ([contracts/cli.md](contracts/cli.md)). Ils importent `src/core` (alias
  `@/core/...`), jamais `src/app` ni `src/ui` ; rien sous `src/` n'importe `scripts/`.
- **Règles** : une fonction pure par code, `scripts/data/lib/rules/<code>.ts`, signature
  `(ctx: RuleContext) => Violation[]` où `RuleContext = { corpus, cache?, published?, thresholds }` ;
  chaque message désigne l'identifiant de l'élément fautif.
- **Fixtures** : un dossier par règle, `data/fixtures/violations/<code>/`, de la forme
  `corpus/**` (YAML, même arborescence que `data/corpus/`), plus, si la règle en a besoin,
  `cache/<hex>.txt` et `published/{versions.json,versions/<n>/**}`. `data/fixtures/minimal/`
  suit la même forme. `pnpm data:validate --corpus <dir>` accepte un tel dossier (par défaut :
  `data/corpus`, `public/data`, `RADAR_SOURCE_CACHE_DIR`).
- **Tests de scripts** : fichiers `*.test.ts` à côté des modules, projet Vitest `unit`,
  en-tête `// @vitest-environment node`, écriture uniquement dans un dossier temporaire
  (`fs.mkdtemp`), jamais dans `data/` ni `public/`.
- **Seuils** : lus dans `governance.thresholds` du corpus validé, jamais codés en dur dans
  les règles (ce qui rend `PUB-BUDGET` testable avec un budget minuscule).

---

## Phase 1: Setup (outillage partagé)

**Purpose** : dépendances, scripts npm, configuration TypeScript/Vitest/ESLint et conventions
du dossier `data/`, avant tout code.

- [X] T001 Compléter `package.json` : dépendance `zod` 4.6.x ; devDependencies `yaml` 2.9.x, `tsx` 4.23.x, `@anthropic-ai/sdk` 1.6.x, `@mozilla/readability` 0.6.x, `linkedom` 0.18.x, `unpdf` 2.1.x, `fast-check` 4.10.x (épinglées) ; scripts `data:validate`, `data:source`, `data:extract`, `data:affirmation`, `data:review`, `data:publish`, `data:costs` (`tsx scripts/data/<nom>.ts`) ; `typecheck` → `tsc --noEmit && tsc --noEmit -p tsconfig.scripts.json` ; `verify` → `pnpm lint && pnpm typecheck && pnpm data:validate && pnpm test && pnpm storybook:build && pnpm build && pnpm e2e` ; si pnpm refuse `@anthropic-ai/sdk` 1.6 (délai minimal), l'ajouter à `minimumReleaseAgeExclude` dans `pnpm-workspace.yaml` ou replier sur 1.5.0 (R7) ; exécuter `pnpm install` et commiter `pnpm-lock.yaml`
- [X] T002 [P] Créer `tsconfig.scripts.json` : `extends: ./tsconfig.json`, `compilerOptions` sans `plugins` Next ni `jsx`, `types: ['node']`, `lib: ['esnext']`, `include: ['scripts/**/*.ts', 'src/core/**/*.ts', 'src/types/global.d.ts']` ; conserver `moduleResolution: bundler` et l'alias `@/*` (tsx les honore) ; vérifier que `pnpm typecheck` passe sur l'arbre actuel
- [X] T003 [P] Étendre `vitest.config.mts` : projet `unit` avec `include: ['src/**/*.test.{ts,tsx}', 'scripts/**/*.test.ts']` ; documenter en commentaire que les tests de scripts portent `// @vitest-environment node`
- [X] T004 [P] Compléter `.gitignore` (`.cache/`, `data/reports/`) et `.env.example` : remplacer le bloc « à venir » par `ANTHROPIC_API_KEY` (extraction seule, jamais commitée ni journalisée), `RADAR_EXTRACTION_MODEL` (défaut `claude-opus-5-5`), `RADAR_SOURCE_CACHE_DIR` (défaut `.cache/sources`), toutes optionnelles et locales (FR-030)
- [X] T005 [P] Compléter `eslint.config.mjs` : bloc `files: ['src/**/*.{ts,tsx}']` avec `no-restricted-imports` `patterns` `['**/scripts/*', '**/scripts/**']` (message : « src n'importe jamais scripts/ ») ; bloc `files: ['scripts/**/*.ts']` avec `no-restricted-imports` interdisant `@/ui`, `@/ui/*`, `@/app`, `@/app/*`, `react`, `next`, `next/*` (message : « les scripts n'importent que src/core ») ; étendre le test `src/lib/core-boundary.test.ts` d'un cas `scripts/data/x.ts` important `@/ui/Button` (rejeté) et d'un cas `src/lib/x.ts` important `../../scripts/data/lib/corpus` (rejeté)
- [X] T006 [P] Créer `data/README.md` : arborescence de [contracts/corpus-files.md](contracts/corpus-files.md), rôle de chaque dossier, gouvernance FR-041 (pull request de données distincte des pull requests de code, relue par une personne différente de l'auteur, auteur ≠ relecteur vérifié par la validation), cache hors dépôt, commandes `pnpm data:*` avec renvoi à `contracts/cli.md`
- [X] T007 [P] Créer `scripts/data/lib/cli.ts` : `parseArgs` typé avec `strict: true` et `allowPositionals`, `usage(text)` (sortie 2), `fail(message)` (sortie 1), `info/warn` en français sur stdout/stderr, résolution des chemins `resolvePaths({ corpus?: string })` → `{ corpusDir, publishedDir, cacheDir }` (défaut dépôt ; dossier de fixture ⇒ `corpus/`, `published/`, `cache/` ; `cacheDir` surchargé par `RADAR_SOURCE_CACHE_DIR`), `writeExit(code)` ; test `scripts/data/lib/cli.test.ts` (résolution dépôt vs fixture, variable d'environnement)

**Checkpoint** : `pnpm install`, `pnpm lint`, `pnpm typecheck`, `pnpm test` verts ; `pnpm data:validate` échoue proprement « script absent » (attendu jusqu'en US1).

---

## Phase 2: Foundational (prérequis bloquants)

**Purpose** : contrat pur du jeu publié (`src/core/dataset`), schémas Zod du corpus, chargeur
YAML, texte/empreinte/citation, cache des sources et commande `data:source` (nécessaire dès
US1 pour les sources de statut des candidats), rapport, fixture minimale.

**⚠️ CRITICAL** : aucune story ne démarre avant la fin de cette phase.

### Cœur pur partagé (`src/core/dataset`, principe III)

- [X] T008 [P] Créer `src/core/dataset/types.ts` : `EvidenceCode = 'p'|'l'|'d'`, `EvidenceLevel` (identique à `src/ui/EvidenceBadge`), `evidenceLevelFromCode`, `evidenceCodeFromLevel`, `ScaleValue = -2|-1|0|1|2`, `PositionCell`, `DatePrecision`, `MainDataset`, `CandidateDetail`, `VersionRegistry`, `Governance` (sans `thresholds` internes), selon data-model.md § 10–12 et [contracts/published-dataset.md](contracts/published-dataset.md)
- [X] T009 Créer `src/core/dataset/schema.ts` : `MainDatasetSchema`, `CandidateDetailSchema`, `VersionRegistrySchema` en Zod 4 (`strict`), avec raffinements : `themes[].order` contigu depuis 0 et `≤ 24` thèmes, `questions` triées par `id`, `positions[c].length === questions.length` pour tout `c` de `candidates`, `candidates[].status === 'declared'`, `versions[].number` contigus depuis 1 et `≤ 256` ; test `src/core/dataset/schema.test.ts` (jeu minimal accepté, chaque raffinement violé rejeté)
- [X] T010 [P] Créer `src/core/dataset/metrics.ts` : `coverage(known, activeQuestions)` ([0,1], 0 si `activeQuestions = 0`), `discriminant(values, includedCandidates)` = écart-type de population × `k/n`, 0 si `k < 2` ; `round3`, `round4` ; test `src/core/dataset/metrics.test.ts` : fixtures de la spec (11/22 dispersés > 20/22 tous à +2 = 0 ; < 2 connues ⇒ 0) et propriétés fast-check `0 ≤ D_q ≤ 2`, `D_q = 0` si valeurs toutes égales, monotonie en `k` à dispersion fixée, `0 ≤ couverture ≤ 1` (R9, FR-033, FR-034)
- [X] T011 [P] Créer `src/core/dataset/positions.ts` : `positionOf(ds, candidateId, questionId)` (`null` si inconnue ou candidat absent), `questionIndex(ds)` ; test `src/core/dataset/positions.test.ts`
- [X] T012 Créer `src/core/dataset/index.ts` (réexports) et mettre à jour `src/core/README.md` : `dataset/` est le premier module du cœur, `zod` sa seule dépendance tierce, consommé par les scripts et par la page Méthodologie, base de la 003 ; vérifier que `pnpm lint` (frontière) reste vert

### Schémas du corpus et chargeur (`scripts/data/lib`)

- [X] T013 [P] Créer `scripts/data/lib/schema/common.ts` : `IdSchema` (`^[a-z0-9]+(-[a-z0-9]+)*$`), `DaySchema` (`YYYY-MM-DD`), `DateWithPrecisionSchema` (`{ date, precision: day|month|year }` cohérents), `Sha256Schema` (`sha256:<64 hex>`), `EvidenceKindSchema` (`programme|livre_plateforme|declaration_vote`), `ScaleSchema` (`-2…2`), `PolaritySchema` (`'+'|'-'`), tous `strict`
- [X] T014 [P] Créer `scripts/data/lib/schema/themes.ts`, `contributors.ts`, `candidates.ts` (avec `history[]`), `governance.ts` (`inclusionCriteria`, `neutralityChecklist`, `evidenceLevels`, `thresholds` avec valeurs par défaut de data-model.md § 9, `reportIssueUrl` contenant `{title}`) selon data-model.md § 1–3 et § 9
- [X] T015 [P] Créer `scripts/data/lib/schema/questions.ts` (`themes` 1–2, `neutralityChecklist` objet de booléens, `introducedIn`/`retiredIn`), `sources.ts` (`publishedAt` obligatoire avec précision, `candidates ≥ 1`, `archiveUrl`, `unreachableSince`), `positions.ts` (`value` échelle ou `'unknown'`, `provenance` union discriminée `manual|extraction`, `reviewedHash`) selon data-model.md § 4–6
- [X] T016 [P] Créer `scripts/data/lib/schema/affirmations.ts` (`id` 16 hex, `state`, `decision`), `runs.ts` (`id` `YYYYMMDDTHHmmssZ-<8 hex>`, `promptVersion`, `sources[]`, `counts`, `usage`, `costUsd`, `status`) et `costs.ts` (`{ runs, totalUsd, byModel, byCandidate }`) selon data-model.md § 7–8
- [X] T017 Créer `scripts/data/lib/schema/index.ts` (réexports + type `Corpus = { themes, contributors, candidates, governance, questions: Map<themeId, Question[]>, sources: Map<file, Source[]>, positions: Map<candidateId, Position[]> }`) et `scripts/data/lib/schema/schema.test.ts` : les exemples de [contracts/corpus-files.md](contracts/corpus-files.md) sont acceptés, une clé inconnue est rejetée, `publishedAt` sans précision rejeté, `value: 3` rejeté
- [X] T018 Créer `scripts/data/lib/corpus.ts` : `loadCorpus(corpusDir)` lit `themes.yaml`, `contributors.yaml`, `candidates.yaml`, `governance.yaml`, `questions/*.yaml`, `sources/*.yaml`, `positions/*.yaml` (paquet `yaml`), applique les schémas et convertit chaque erreur Zod en `Violation { rule: 'SCHEMA', entity: { kind, id: '<fichier>:<chemin>' }, message }` sans interrompre les autres fichiers ; `writeYaml(file, value)` stable (ordre des clés conservé, 2 espaces, `lineWidth: 0`) pour les commandes qui écrivent ; test `scripts/data/lib/corpus.test.ts` sur `data/fixtures/minimal` et sur un YAML invalide

### Texte, cache et sources

- [X] T019 [P] Créer `scripts/data/lib/text.ts` : `normalize(text)` (NFC, `’`→`'`, `« » “ ”`→`"`, `– —`→`-`, espaces y compris insécables réduites à une, casse conservée), `sha256(text)` → `sha256:<hex>`, `findQuote(normalizedText, quote)` → `{ start, end } | null` (inclusion stricte après normalisation de la citation), `levenshtein(a, b)` et `sameWords(a, b)` (pour FR-011) ; test `scripts/data/lib/text.test.ts` avec propriétés fast-check : `normalize` idempotente, `findQuote(t, sousChaîne)` retrouve toute sous-chaîne, casse différente ⇒ `null` (R5)
- [X] T020 [P] Créer `scripts/data/lib/cache.ts` : `cachePath(cacheDir, hash)`, `readCached(cacheDir, hash)` (`null` si absent), `writeCached(cacheDir, normalizedText)` → hash, `hasCache(cacheDir)` ; test `scripts/data/lib/cache.test.ts` dans un dossier temporaire
- [X] T021 [P] Créer `scripts/data/lib/extract-text.ts` : `textFromHtml(html, url)` via `@mozilla/readability` sur un document `linkedom` (repli sur `textContent` du `body` si Readability échoue), `textFromPdf(bytes)` via `unpdf`, `textFromBuffer(bytes, contentType, url)` qui aiguille HTML / PDF / texte brut ; test `scripts/data/lib/extract-text.test.ts` sur un HTML et un texte brut en ligne (pas de PDF binaire en fixture : tester l'aiguillage seulement) (R6)
- [X] T022 Créer `scripts/data/source.ts` : sous-commande `fetch <url> --candidate <id> [--candidate …] --kind <k> --title <t> --published <YYYY|YYYY-MM|YYYY-MM-DD> [--from-file <txt>] [--id <id>]` : télécharge (`fetch` natif, délai 30 s) ou lit le fichier, extrait, normalise, écrit le cache, calcule l'empreinte, ajoute l'entrée (id dérivé `<candidat>-<slug du titre>` si absent, `accessedAt` = aujourd'hui, précision déduite du format de date) dans `data/corpus/sources/<candidat>.yaml` (ou `commun.yaml` si plusieurs candidats), refuse une `url` déjà présente dans le corpus ; sous-commande `check [--online]` : recalcule l'empreinte de chaque source en cache et signale les écarts, avec `--online` fait une requête `HEAD`/`GET` et pose `unreachableSince` sur les adresses qui ne répondent plus (sans l'effacer si elles répondent de nouveau : le signaler) ; test `scripts/data/source.test.ts` avec `--from-file` dans un corpus temporaire (FR-013, FR-014, cas limite « source inaccessible »)

### Règles, rapport, fixture minimale

- [X] T023 [P] Créer `scripts/data/lib/rules/types.ts` (`Severity`, `Violation`, `Warning`, `RuleContext`, `Rule = { code, run }`) et `scripts/data/lib/rules/index.ts` exportant `RULES: Rule[]` dans l'ordre du tableau de [contracts/corpus-files.md](contracts/corpus-files.md) (liste vide au départ, chaque story y ajoute ses règles) et `runRules(ctx)` → `{ violations, warnings }`
- [X] T024 [P] Créer `scripts/data/lib/report.ts` : type `Report = { violations, warnings, stats }` (data-model.md § 13), `renderMarkdown(report)` (tableau des violations par règle avec identifiant et message, avertissements, sections de statistiques présentes seulement si fournies) et `writeReport(dir, report)` → `validation.md` + `validation.json` ; test `scripts/data/lib/report.test.ts` (rendu d'un rapport vide, d'un rapport avec deux violations ; identifiant présent dans chaque ligne)
- [X] T025 Créer `data/fixtures/minimal/` : `corpus/` conforme avec 3 thèmes (`order` 0..2), 2 contributeurs (`adrien`, `relecteur-1`), 2 candidats `declared` avec `statusSource`, `governance.yaml` complet (seuils par défaut), 30 questions actives (10 par thème, 5 `+` / 5 `-`, relues), 3 sources avec `contentHash`, positions `reviewed` connue, `draft`, `contested`, `unknown` ; `cache/` avec les 3 textes normalisés dont les citations sont extraites ; `published/versions.json` = `{ "current": 0, "versions": [] }` ; vérifier à la main la cohérence des empreintes (`pnpm data:source check` acceptera `--corpus` en T037)

**Checkpoint** : `pnpm test` vert (cœur, schémas, texte, cache, rapport) ; `pnpm data:source fetch --from-file` fonctionne sur un corpus temporaire ; aucune règle encore branchée.

---

## Phase 3: User Story 1 - Constituer le référentiel : thèmes, candidats, banque de questions (Priority: P1) 🎯 MVP

**Goal** : un référentiel YAML (16 thèmes, candidats, banque) validé par `pnpm data:validate`,
qui refuse toute incohérence en désignant l'élément fautif, exécuté en CI.

**Independent Test** : `pnpm data:validate` sur `data/corpus` → 0 violation, rapport listant
les 16 thèmes dans l'ordre et les effectifs par thème et polarité ; chaque fixture
`data/fixtures/violations/<code>` fait échouer la commande avec exactement ce code
(quickstart § 1). Aucune position nécessaire.

### Règles du référentiel (une fonction, un test, une fixture par code)

- [ ] T026 [P] [US1] Règle `ID-UNIQUE` dans `scripts/data/lib/rules/ID-UNIQUE.ts` : identifiants uniques par type (thèmes, contributeurs, candidats, questions tous fichiers confondus, sources tous fichiers confondus, critères de gouvernance) et conformes au format ; test `ID-UNIQUE.test.ts` ; fixture `data/fixtures/violations/ID-UNIQUE/` (question dupliquée entre deux fichiers de thème)
- [ ] T027 [P] [US1] Règle `REF-EXISTS` dans `scripts/data/lib/rules/REF-EXISTS.ts` : tout thème, question, candidat, source, contributeur, critère référencé existe (questions→thèmes, candidats→statusSource/statusCriterion/history, sources→candidates, positions→question/sources/quoteSource/author/reviewer, questions→author/reviewer) ; test ; fixture (thème inconnu sur une question)
- [ ] T028 [P] [US1] Règle `FR-003` dans `scripts/data/lib/rules/FR-003.ts` : thème `retired` sans question `active` dont il est le principal ; tout thème présent dans `published` (dernière version) existe encore dans le corpus ; test ; fixture (thème retiré avec question active)
- [ ] T029 [P] [US1] Règle `FR-004` dans `scripts/data/lib/rules/FR-004.ts` : candidat avec `status`, `statusChangedAt`, `statusSource` dont la source existe et porte une date, `party` non vide ; `history` non vide et chronologique, dernière entrée cohérente avec le statut courant ; test ; fixture (candidat sans `statusSource`)
- [ ] T030 [P] [US1] Règle `FR-005` dans `scripts/data/lib/rules/FR-005.ts` : chaque entrée de `history` et `statusCriterion` citent un critère de `governance.inclusionCriteria` ; test ; fixture (critère inconnu)
- [ ] T031 [P] [US1] Règle `FR-008` dans `scripts/data/lib/rules/FR-008.ts` : question avec 1 ou 2 thèmes distincts, le fichier `questions/<theme>.yaml` qui la contient est bien son thème principal, polarité et statut présents, `retiredIn ≥ introducedIn` ; test ; fixture (trois thèmes)
- [ ] T032 [P] [US1] Règle `FR-009` dans `scripts/data/lib/rules/FR-009.ts` : `text.length ≤ thresholds.maxStatementLength`, pas de double négation simple (motif `ne … pas … ni|pas … sans|jamais … aucun`, documenté comme heuristique), question `active` ⇒ toutes les clés de `governance.neutralityChecklist` cochées `true` ; test ; fixture (énoncé actif à grille incomplète)
- [ ] T033 [P] [US1] Règle `FR-010` dans `scripts/data/lib/rules/FR-010.ts` : `active` ⇒ `reviewer` et `reviewedAt` présents, `reviewer ≠ author` ; test ; fixture (énoncé actif auto-relu)
- [ ] T034 [P] [US1] Règle `FR-011` dans `scripts/data/lib/rules/FR-011.ts` : pour chaque question présente dans `published/versions/<current>/main.json`, `text` courant identique ou à distance de Levenshtein ≤ 3 sans changement de mot (`sameWords` de `text.ts`) ; une question publiée absente du corpus est une violation ; sans version publiée, règle sans effet ; test ; fixture (`published/` avec texte figé, corpus avec un mot changé)
- [ ] T035 [P] [US1] Règle `FR-012` dans `scripts/data/lib/rules/FR-012.ts` : par thème `active`, sur les questions `active` dont il est le principal : effectif ≥ `minQuestionsPerTheme` et part de chaque polarité dans `[polarityMin, polarityMax]`, message avec effectifs et pourcentages (`economie : 7 '+' / 3 '-' (70 % / 30 %), attendu 40–60 %`) ; un thème **sans aucune** question active produit l'avertissement `THEME-EMPTY` (bloquant à la publication, voir T063) et non une violation, pour que le référentiel reste validable avant relecture de la banque ; avertissement `BANK-SIZE` si total actif hors `[250, 300]` et aucune version publiée ; test (cas 70/30, cas 9 questions, cas thème vide) ; fixture (70/30)
- [ ] T036 [US1] Brancher les règles T026–T035 dans `RULES` (`scripts/data/lib/rules/index.ts`, ordre du contrat) et créer `scripts/data/lib/stats.ts` : `themeStats(corpus)` (par thème : actives, `+`, `-`, parts, brouillons, retirées), `bankStats(corpus)` (total actif, cible) ; `report.ts` rend ces sections ; test `stats.test.ts` sur la fixture minimale

### Commande `data:validate` et test d'intégration

- [ ] T037 [US1] Créer `scripts/data/validate.ts` : options `--corpus <dir>`, `--no-cache`, `--json <out>` ; charge le corpus (violations `SCHEMA` incluses), charge `published/versions.json` s'il existe, détecte le cache (`hasCache`) sinon avertissement `CACHE-MISSING`, exécute `runRules`, calcule les statistiques, écrit `data/reports/validation.{md,json}` (ou `--json`), affiche le résumé (nombre de violations par règle, avertissements, durée) et sort `1` si `violations.length > 0` ; exporter `validate(paths, options): Promise<Report>` pour les tests et pour `publish.ts` (FR-031, FR-035, SC-010)
- [ ] T038 [US1] Créer `scripts/data/validate.test.ts` (intégration SC-001) : parcourt `data/fixtures/violations/*`, appelle `validate()` sur chacun et vérifie que le code du dossier figure parmi `violations[].rule` et que chaque violation porte `entity.id` ; vérifie que `data/fixtures/minimal` donne 0 violation ; vérifie que le nombre de dossiers de fixtures est ≥ 10 ; vérifier aussi que `data/corpus` (le vrai) donne 0 violation ; le volet brouillon/contestée de SC-001 est couvert par T058
- [ ] T039 [US1] Activer l'étape CI : décommenter `data:validate` dans `.github/workflows/ci.yml` (entre `typecheck` et `test`, commande `pnpm data:validate`) ; vérifier en local que `pnpm verify` enchaîne les sept étapes (R14, principe V)

### Saisie du référentiel (données)

- [ ] T040 [P] [US1] Créer `data/corpus/themes.yaml` : les 16 thèmes de FR-002 (`international`, `societe`, `economie`, `fiscalite`, `immigration`, `sante`, `securite`, `justice`, `institutions`, `democratie`, `numerique`, `agriculture`, `travail`, `defense`, `environnement`, `transport`), `order` 0..15 dans cet ordre, libellé, description ≤ 300 caractères, `axis.negative`/`axis.positive` factuels (ce que la mesure fait, jamais une étiquette partisane), `status: active` ; noter dans le commentaire d'en-tête que la liste a été confrontée à monvote2027.fr et que toute différence est tranchée par le propriétaire (FR-001, FR-002, hypothèses de la spec)
- [ ] T041 [P] [US1] Créer `data/corpus/governance.yaml` : `inclusionCriteria` (au moins : `declaration-publique-personnelle` ; retrait : `renoncement-public`, `absent-liste-conseil-constitutionnel`) avec textes de FR-005/FR-006, `neutralityChecklist` (`no-loaded-term`, `no-presupposition`, `no-person-or-party`, `single-claim`, `both-ends-defensible`, textes de FR-009), `evidenceLevels` (3 niveaux dans l'ordre de force, définitions), `thresholds` par défaut, `reportIssueUrl` = `https://github.com/ScandalousMan/radar-2027/issues/new?title={title}&labels=donnees`
- [ ] T042 [P] [US1] Créer `data/corpus/contributors.yaml` : `adrien` (compte GitHub du propriétaire) et `relecteur-1` (compte à compléter par le propriétaire), sans donnée personnelle au-delà du compte (R13)
- [ ] T043 [US1] Créer `data/corpus/candidates.yaml` et les sources de statut : pour chaque personne de monvote2027.fr ayant **publiquement et personnellement** annoncé sa candidature (FR-006), une entrée `declared` avec `party`, `statusChangedAt`, `statusSource`, `statusCriterion: declaration-publique-personnelle`, `history` ; chaque source de statut enregistrée par `pnpm data:source fetch <url> --candidate <id> --kind declaration_vote …` (texte en cache, empreinte dans `sources/<id>.yaml`) ; **lister dans la description de la pull request les personnes du site non retenues et pourquoi** (candidature pressentie, désignation en cours) : décision finale du propriétaire
- [ ] T044 [US1] Créer la première tranche de la banque : un fichier `data/corpus/questions/<theme>.yaml` par thème, au moins 5 énoncés par thème en `draft` (`author: adrien`, polarités alternées, ≤ 200 caractères, un seul énoncé, grille non cochée), identifiants `<theme>-<slug>` ; `pnpm data:validate` → 0 violation, avertissements `THEME-EMPTY` × 16 et `BANK-SIZE` ; l'activation (relecture par `relecteur-1`, grille cochée) relève de la campagne éditoriale (Phase 8)

**Checkpoint** : US1 démontrable seule ; `pnpm data:validate` vert sur le dépôt, rouge sur chaque fixture ; CI exécute l'étape.

---

## Phase 4: User Story 2 - Saisir, sourcer et relire les positions (Priority: P2)

**Goal** : saisie manuelle de positions sourcées, citation vérifiée dans le cache, cycle
brouillon → relue par une personne distincte, règles FR-013 à FR-020 bloquantes.

**Independent Test** : pour un candidat et une dizaine de questions, enregistrer sources et
positions à la main, relire avec `pnpm data:review`, valider ; chaque violation (source
absente, citation introuvable, auto-relecture, niveau surévalué, valeur hors échelle) est
refusée (quickstart § 2).

### Règles sur sources et positions

- [ ] T045 [P] [US2] Créer `scripts/data/lib/positions.ts` : `isKnown(position, ctx)` (FR-022 : `reviewed`, `value ≠ unknown`, `sources ≥ 1`, citation retrouvée quand le cache est disponible), `positionHash(position)` = `sha256(JSON.stringify({ value, sources: [...].sort(), quote }))`, `strongestEvidence(sources)` (programme > livre_plateforme > declaration_vote), `isOldSource(source, thresholds.oldSourceBefore)` ; test `positions.test.ts`
- [ ] T046 [P] [US2] Règle `FR-013` dans `scripts/data/lib/rules/FR-013.ts` : champs complets, `url` unique dans tout le corpus, `publishedAt` avec précision, `accessedAt ≥ publishedAt` (à la précision près), `candidates ≥ 1` ; test ; fixture (deux sources même `url`)
- [ ] T047 [P] [US2] Règle `FR-014` dans `scripts/data/lib/rules/FR-014.ts` : `contentHash` présent ; si le cache est disponible et le fichier `<hex>.txt` existe, `sha256(contenu)` égal au nom ; fichier absent du cache disponible ⇒ avertissement `CACHE-MISSING` par source (pas une violation) ; test ; fixture (`cache/` avec texte modifié)
- [ ] T048 [P] [US2] Règle `FR-015` dans `scripts/data/lib/rules/FR-015.ts` : position connue dont toutes les sources sont antérieures à `thresholds.oldSourceBefore` ⇒ `old: true` requis (violation sinon) ; au moins une source récente ⇒ `old` absent (violation sinon) ; avertissement `OLD-NEWER-SOURCE` si une source plus récente du candidat contient la citation dans le cache (quand disponible) ; test ; fixture (`old` manquant) (FR-015, cas limite « source antérieure à 2022 »)
- [ ] T049 [P] [US2] Règle `FR-016` dans `scripts/data/lib/rules/FR-016.ts` : au plus une position par couple (candidat, question) ; champs obligatoires (`author`, `authoredAt`, `provenance`, `status`) ; `provenance.kind: extraction` ⇒ `run` et `affirmation` existent dans `data/extractions/` quand ce dossier est présent ; test ; fixture (doublon de couple)
- [ ] T050 [P] [US2] Règle `FR-017` dans `scripts/data/lib/rules/FR-017.ts` : valeur connue ⇒ `sources ≥ 1`, `quote` ≤ `maxQuoteLength`, `quoteSource ∈ sources`, `justification` non vide, `evidence` présent et **égal** à `strongestEvidence(sources)` (message « niveau surévalué » ou « sous-évalué ») ; citation retrouvée (`findQuote`) dans le cache de `quoteSource` quand il est disponible, sinon avertissement `CACHE-MISSING` ; test ; fixtures `FR-017/` (sans source), `FR-017-quote/` (citation introuvable, avec `cache/`), `FR-017-evidence/` (niveau surévalué) — le test d'intégration accepte un suffixe après le code
- [ ] T051 [P] [US2] Règle `FR-018` dans `scripts/data/lib/rules/FR-018.ts` : `reviewed` ⇒ `reviewer` présent et ≠ `author`, `reviewedAt` présent ; `provenance.kind: extraction` et `status: reviewed` sans `reviewedHash` (jamais passée par `data:review`) ⇒ violation ; test ; fixture (auto-relecture)
- [ ] T052 [P] [US2] Règle `FR-019` dans `scripts/data/lib/rules/FR-019.ts` : `reviewed` ⇒ `reviewedHash` présent et égal à `positionHash` courant (message : « modifiée depuis la relecture : repasser en draft ») ; test ; fixture (valeur modifiée)
- [ ] T053 [P] [US2] Règle `FR-020` dans `scripts/data/lib/rules/FR-020.ts` : `contested` ⇒ `sources ≥ 2` et `justification` non vide ; test ; fixture (contestée à une source)
- [ ] T054 [P] [US2] Règle `SCALE` dans `scripts/data/lib/rules/SCALE.ts` : `value` dans l'échelle ou `unknown` (défense en profondeur après Zod : la fixture charge avec `value: 3` et doit produire `SCALE` **et non seulement** `SCHEMA` — le chargeur conserve la position avec `value` brute pour cette règle) ; test ; fixture
- [ ] T055 [US2] Brancher T046–T054 dans `RULES` ; étendre `scripts/data/lib/stats.ts` : positions par statut et par niveau, couverture par candidat (`coverage` de `src/core/dataset/metrics` sur les positions `isKnown`) et par thème, distribution du pouvoir discriminant par question active (`discriminant`, min / médiane / max / déciles), sources avec `unreachableSince` ; `report.ts` rend ces sections ; test (FR-033, FR-034, FR-035)

### Commande de relecture

- [ ] T056 [US2] Créer `scripts/data/review.ts` : `pnpm data:review <candidate> <question> --by <contrib> [--contest] [--date <YYYY-MM-DD>]` : charge le corpus, trouve la position, refuse si `--by` = `author` (message « le relecteur ne peut pas être l'auteur »), si le statut n'est pas `draft` (ou `contested` sans `--contest` pour un arbitrage), si `--by` n'est pas un contributeur, ou si les règles `FR-013` à `FR-020` + `SCALE` échouent **pour cette position** (exécuter `runRules` filtré sur `entity.id`) ; pose `status: reviewed` (ou `contested` avec `--contest`), `reviewer`, `reviewedAt`, `reviewedHash` ; réécrit `positions/<candidat>.yaml` via `writeYaml` ; test `scripts/data/review.test.ts` sur un corpus temporaire (refus auteur, succès relecteur, modification ⇒ `FR-019` à la validation suivante) (FR-018, FR-019, US2 scénario 4)
- [ ] T057 [US2] Vérifier le scénario 7 (inconnue explicite) et le scénario 5 (contestée) de bout en bout dans `scripts/data/validate.test.ts` : fixture minimale enrichie d'une position `unknown` avec sources consultées (acceptée, couverture inchangée) et d'une `contested` à deux sources (acceptée, traitée inconnue dans la couverture)

**Checkpoint** : US1 et US2 démontrables ; `pnpm data:validate` couvre les 20 codes du contrat sauf `PUB-*` ; `data/fixtures/violations/` compte ≥ 10 dossiers (SC-001).

---

## Phase 5: User Story 3 - Publier un jeu de données fiable et la page Méthodologie (Priority: P3)

**Goal** : `pnpm data:publish` construit des versions immuables sous `public/data` contenant
uniquement les positions relues et connues, dans les budgets ; la page `/methodologie` et les
fiches `/methodologie/candidats/<id>` les exposent avec deux nouveaux composants.

**Independent Test** : sur la fixture minimale (relue, brouillon, contestée, inconnue),
construire le jeu : seule la relue y figure ; budgets respectés ; registre complété ; un octet
modifié ⇒ `PUB-IMMUTABLE` ; `pnpm build && pnpm start:static` → `/methodologie` affiche règles,
thèmes, critères, niveaux, candidats et couverture ; fiche candidat → source cliquable en
2 actions (quickstart § 3).

### Publication (scripts)

- [ ] T058 [P] [US3] Créer `scripts/data/lib/publish/build.ts` : `buildMain(corpus, { version, publishedAt, cache })` (cache obligatoire) → `MainDataset` (thèmes actifs en ordre canonique ; candidats `declared` avec `coverage` arrondie à 3 décimales ; `withdrawn[]` depuis `history` ; questions `active` triées par `id` avec `discriminant` arrondi à 4 décimales ; `positions[c]` aligné, case `[value, code]` seulement si `isKnown`, `null` sinon ; `governance` sans `thresholds`) et `buildDetail(corpus, candidateId, version)` → `CandidateDetail` (positions connues seulement, sources dédupliquées) ; validation par `MainDatasetSchema` / `CandidateDetailSchema` avant retour ; test `build.test.ts` : US3 scénario 1 (relue −1 publiée, brouillon +2 et contestée ⇒ `null`), aucun champ `author`/`reviewer`/`quote` dans `main`, candidat retiré absent de `candidates` et présent dans `withdrawn`, candidat sans position ⇒ couverture 0 (FR-036 à FR-038, FR-022)
- [ ] T059 [P] [US3] Créer `scripts/data/lib/publish/registry.ts` : `readRegistry(publishedDir)` (`{ current: 0, versions: [] }` si absent), `appendVersion(registry, entry)` (numéro `current + 1`, refus si `≥ 256`, avertissement `VERSIONS-NEAR-LIMIT` dès 200), `fileHashes(publishedDir, n)` ; `scripts/data/lib/publish/diff.ts` : `diffAgainstCurrent(candidateMain, currentMain)` → liste lisible des différences (questions ajoutées/retirées, candidats ajoutés/retirés, positions changées avec compte par candidat) ou `null` si identique ; `scripts/data/lib/publish/sizes.ts` : `measure(json)` octets UTF-8 ; tests `registry.test.ts`, `diff.test.ts`
- [ ] T060 [P] [US3] Règle `PUB-IMMUTABLE` dans `scripts/data/lib/rules/PUB-IMMUTABLE.ts` : pour chaque entrée du registre, `sha256` de `main.json` et de chaque `candidates/<id>.json` égal à `mainHash` / `detailHashes` ; fichier manquant ⇒ violation ; `versions[].number` contigus ; test ; fixture (`published/` avec `main.json` altéré) (SC-011)
- [ ] T061 [P] [US3] Règle `PUB-BUDGET` dans `scripts/data/lib/rules/PUB-BUDGET.ts` : taille de chaque `main.json` ≤ `thresholds.mainBudgetBytes`, de chaque détail ≤ `detailBudgetBytes`, `versions.json` < 20 480 ; message avec taille mesurée et budget ; test ; fixture (gouvernance avec `mainBudgetBytes: 10`) (SC-004)
- [ ] T062 [US3] Brancher `PUB-IMMUTABLE` et `PUB-BUDGET` dans `RULES` (`scripts/data/lib/rules/index.ts`) et ajouter dans `scripts/data/lib/stats.ts` et `scripts/data/lib/report.ts` la section « tailles des fichiers publiés » de la version courante
- [ ] T063 [US3] Créer `scripts/data/publish.ts` : `pnpm data:publish [--next] [--dry-run] [--date <YYYY-MM-DD>]` : exécute `validate()` (échec ⇒ sortie 1 sans écriture) ; refuse si le cache est absent ou incomplet pour une `quoteSource` de position `reviewed` connue (liste des sources manquantes, sortie 1, aucune option de contournement) ; refuse si un thème actif porte `THEME-EMPTY` ou si `FR-012` échouerait sur un thème actif (cas limite « thème sous le minimum ») ; construit `main` candidat avec `version = current + 1`, compare à la version courante : identique ⇒ « rien à publier » (sortie 1) ; différent sans `--next` ⇒ liste les différences, sortie 1 ; `--dry-run` ⇒ différences + tailles estimées, aucune écriture ; avec `--next` ⇒ écrit `public/data/versions/<n>/main.json` et `candidates/<id>.json` (JSON compact, fin de ligne finale), refuse si le dossier existe déjà, pose `introducedIn` (questions nouvelles) et `retiredIn` (questions retirées depuis la version précédente) dans les YAML via `writeYaml`, met à jour `versions.json` ; test `scripts/data/publish.test.ts` dans un dossier temporaire (première publication, « rien à publier », différence sans `--next`, `--next`, refus d'écrasement, cache manquant, 256) (FR-039, FR-040, US3 scénario 2)
- [ ] T064 [US3] Créer `public/data/versions.json` initial `{ "current": 0, "versions": [] }` et `public/data/versions/.gitkeep` ; vérifier que `pnpm data:validate` sur le dépôt reste vert (aucune version ⇒ `PUB-*` sans effet)

### Interface : i18n, composants, pages

- [ ] T065 [P] [US3] Ajouter à `src/i18n/messages/fr.json` les clés `methodology.*` (`title`, `description`, `intro`, `rules.*` (traçabilité, relecture, brouillon jamais publié, données versionnées), `evidenceLevels.title`, `themes.title`, `themes.axis` (`{negative} ⟷ {positive}`), `neutrality.title`, `inclusion.title`, `candidates.title`, `withdrawn.title`, `withdrawn.item` (`{name}, retiré le {date} ({criterion})`), `version.title`, `version.summary` (`Version {version} du {date}, {count, plural, …} questions actives`), `noVersion` (aucun jeu publié), `report.cta`, `report.positionTitle` (`{candidate}/{question}`), `license`, `backToList`), `ui.positionCard.*` (`value.-2`…`value.2`, `old`, `quoteLabel`, `justificationLabel`, `sources`, `publishedOn.day|month|year`, `accessedOn`, `report`, `scaleLabel`), `ui.coverageList.*` (`coverage` `{percent} %`, `coverageLabel`, `status.declared`, `viewPositions`) ; étendre `src/i18n/messages.test.ts` (`REQUIRED_KEYS`) et vérifier la typographie française (principe VI)
- [ ] T066 [P] [US3] Créer `src/lib/dataset.ts` (module serveur, `import 'server-only'` si disponible sinon commentaire) : `loadRegistry()`, `loadCurrentMain()` (`null` si `current = 0`), `loadDetail(candidateId)` lisant `public/data/**` avec `node:fs` au moment du build et validant par les schémas de `src/core/dataset` ; `formatPublishedAt(dateWithPrecision, formatter)` choisit le format par précision ; test `src/lib/dataset.test.ts` sur la fixture minimale publiée dans un dossier temporaire (paramètre `baseDir`) (FR-044, R12)
- [ ] T067 [P] [US3] Créer `src/ui/PositionCard/PositionCard.tsx`, `index.ts` : props de [contracts/published-dataset.md](contracts/published-dataset.md) ; `Card` avec en-tête = énoncé, échelle −2…+2 rendue comme liste de 5 crans avec le cran actif marqué (`aria-label` via `ui.positionCard.scaleLabel`, texte du cran via `value.*`), `EvidenceBadge`, `blockquote` de la citation, justification, marque « ancienne » (`ui.positionCard.old`, texte + icône, jamais couleur seule), liste des sources (`<a href rel="noopener noreferrer" target="_blank">` titre, date de publication selon précision, date de consultation), lien de signalement (`Button` variante `ghost`, `href` = `reportHref`) ; tokens seulement, 320 px, clavier ; exporter depuis `src/ui/index.ts`
- [ ] T068 [P] [US3] Créer `src/ui/PositionCard/PositionCard.stories.tsx` (valeur −2, −1, 0, +1, +2, ancienne, trois sources de précisions différentes, sans lien de signalement) et `PositionCard.test.tsx` (texte de la valeur, niveau, citation, sources avec `href`, marque ancienne conditionnelle, lien de signalement conditionnel) ; stories sans violation a11y dans les deux apparences (`pnpm test` projets `storybook*`)
- [ ] T069 [P] [US3] Créer `src/ui/CoverageList/CoverageList.tsx`, `index.ts` : liste sémantique (`<ul>`) d'items `{ id, name, party, coverage, href }` rendus avec `Card` interactive (`href`), nom, étiquette, `ProgressBar` (`value = round(coverage × 100)`, `total = 100`, `label` via `ui.coverageList.coverageLabel`), pourcentage textuel ; exporter depuis `src/ui/index.ts`
- [ ] T070 [P] [US3] Créer `src/ui/CoverageList/CoverageList.stories.tsx` (0 %, 60 %, 100 %, liste vide, 22 candidats) et `CoverageList.test.tsx` (ordre conservé, lien par item, pourcentage affiché, `aria` de la barre)
- [ ] T071 [US3] Créer `src/app/methodologie/page.tsx` (composant serveur) : `generateMetadata` depuis `methodology.title`/`description` ; `loadCurrentMain()` ; si `null`, rendre règles + `methodology.noVersion` ; sinon les sections du contrat dans l'ordre : règles (prose i18n), niveaux de preuve (`EvidenceBadge` + définition de `governance.evidenceLevels`), thèmes (`<ol>` de `Card` non interactives : libellé, description, axe via `methodology.themes.axis` ; pas de `ThemeChip`, composant client à bascule réservé au choix des sujets), grille de neutralité, critères d'inclusion et de retrait, candidats inclus (`CoverageList`, `href` = `/methodologie/candidats/<id>`), candidats retirés, version et date, lien « Signaler une erreur » (`Button` lien externe vers `governance.reportIssueUrl` sans titre) ; aucun littéral JSX (lint), aucune requête client (FR-042, FR-044, FR-045)
- [ ] T072 [US3] Créer `src/app/methodologie/candidats/[id]/page.tsx` : `generateStaticParams` depuis `loadCurrentMain()?.candidates` (`[]` si aucune version) ; `generateMetadata` (nom du candidat) ; en-tête (nom, étiquette, couverture avec `ProgressBar`), lien retour, positions connues regroupées par thème principal dans l'ordre canonique, chaque position rendue par `PositionCard` (`question` = énoncé depuis `main.questions`, `level` = `evidenceLevelFromCode`, sources résolues depuis `detail.sources`, `reportHref` = `reportIssueUrl` avec `{title}` = `encodeURIComponent('<candidat>/<question>')`) (FR-043, SC-007)
- [ ] T073 [US3] Relier la page au site : dans `src/ui/PageShell/PageShell.tsx`, le libellé `common.footer.methodology` devient un lien `next/link` vers `/methodologie` (mettre à jour `PageShell.test.tsx` et la story) ; vérifier `pnpm build` : `out/methodologie/index.html` présent, aucune ressource externe ; `out/methodologie/candidats/` présent uniquement si une version est publiée
- [ ] T074 [US3] Créer `e2e/methodology.spec.ts` : lit `public/data/versions.json` ; toujours : `/methodologie` répond 200, `h1` = `methodology.title`, sections des règles, grille et critères présentes, aucune requête hors `localhost`, aucun cookie, lien « Signaler une erreur » pointant vers `github.com/.../issues/new` ; si `current > 0` : 16 thèmes dans l'ordre de `main.json`, liste des candidats avec couverture, parcours en deux actions (clic candidat → fiche, première `PositionCard` visible avec lien de source `href` externe), sinon `test.skip` motivé « aucune version publiée » (SC-007, principe V)

**Checkpoint** : US1 à US3 démontrables ; `pnpm verify` vert ; Storybook montre `PositionCard` et `CoverageList` sans violation a11y ; une publication d'essai sur la fixture minimale (dossier temporaire) produit des fichiers conformes aux schémas de `src/core/dataset`.

---

## Phase 6: User Story 4 - Accélérer la saisie par extraction assistée (Priority: P4)

**Goal** : `pnpm data:extract` produit des affirmations vérifiées, journalisées et idempotentes
via l'API Anthropic, sous plafond de coût ; `pnpm data:affirmation` les transforme en positions
`draft` ; `pnpm data:costs` cumule. Tout est testé sans clé avec un client factice.

**Independent Test** : sur deux ou trois sources en cache, `pnpm data:extract --candidate <id>
--max-cost 2` écrit un journal avec modèle, consignes, banque, sources, effectifs, coût ;
chaque affirmation vérifiable a sa citation retrouvée ; trois relances ⇒ 0 affirmation et
0 position modifiées ; `accept` crée un `draft` que `review --by <auteur>` refuse (quickstart § 4).

- [ ] T075 [P] [US4] Créer `scripts/data/lib/pricing.ts` : table des prix par modèle (R7 : `claude-opus-5-5` 4 / 20 / 5 / 0,20 $ par M jetons entrée / sortie / écriture de cache / lecture de cache ; `claude-sonnet-5-5` 2 / 10 ; `claude-haiku-5-5` 0,10 / 0,50 ; écriture/lecture de cache dérivées 1,25× / 0,10× du prix d'entrée quand non précisées), `costFromUsage(model, usage)` arrondi à 4 décimales, `estimateCost(model, inputTokens, maxOutputTokens)` ; modèle inconnu ⇒ erreur explicite ; test `pricing.test.ts`
- [ ] T076 [P] [US4] Créer `scripts/data/prompts/extraction.v1.md` : rôle (extraire des prises de position **telles qu'écrites**, sans inférer), consignes de citation (copie exacte ≤ 300 caractères, une affirmation par prise de position), rattachement à la banque (identifiant de question ou `null`, 1–2 thèmes parmi la liste), échelle −2…+2 définie par la polarité de la question, confiance, interdiction de paraphraser ou d'inventer ; emplacements `{{themes}}`, `{{questions}}` (énoncés actifs avec identifiant, thèmes, polarité), `{{neutralityChecklist}}` ; `scripts/data/lib/extraction/prompt.ts` : `loadPrompt()` → `{ name: 'extraction.v1', hash, text }`, `renderSystem(prompt, corpus)` ; test
- [ ] T077 [P] [US4] Créer `scripts/data/lib/extraction/schema.ts` : `ExtractionOutputSchema` du contrat (`affirmations[]` avec `quote ≤ 300`, `summary`, `themes` 1–2, `question` nullable, `proposedValue`, `confidence`) ; `ExtractionRequest = { system, chunk: { text, index, total }, sourceId, model, maxTokens }` ; `Usage` ; test (sortie du modèle acceptée / rejetée)
- [ ] T078 [P] [US4] Créer `scripts/data/lib/extraction/chunk.ts` : `chunkText(normalizedText, { size: 12_000, overlap: 500 })` → `{ text, offset }[]` coupant de préférence sur une fin de phrase ou de paragraphe, offsets dans le texte normalisé ; test avec propriétés fast-check : couverture complète, chevauchement borné, offsets croissants (R7)
- [ ] T079 [P] [US4] Créer `scripts/data/lib/extraction/merge.ts` : `affirmationId(sourceId, start, questionId | null)` = 16 premiers hex de `sha256('<source>|<start>|<question ?? none>')`, `verifyAffirmation(raw, sourceText)` → `{ location, state: 'verifiable' } | { state: 'unverifiable' }` via `findQuote`, `mergeAffirmations(existing, incoming)` : fusion par `id` **sans écraser** (une existante garde état et décision), retourne `{ merged, added, duplicates }` ; test (idempotence : fusionner deux fois ⇒ `added = 0`, états préservés) (FR-024, FR-026, R8)
- [ ] T080 [US4] Créer `scripts/data/lib/extraction/client.ts` : type `ExtractionClient` du contrat ; `anthropicClient(model)` : `new Anthropic()` (clé lue par le SDK depuis l'environnement), `countTokens` via `client.messages.countTokens`, `extract` via `client.messages.parse` avec `output_config: { format: zodOutputFormat(ExtractionOutputSchema), effort: 'high' }`, `max_tokens: 16000`, `system` en bloc unique avec `cache_control: { type: 'ephemeral' }`, message utilisateur = tranche ; retourne `{ output: parsed ?? null, usage, stopReason }` ; `fakeClient(script)` : réponses programmées par `(sourceId, chunkIndex)`, `usage` fixe, `stopReason` configurable (`end_turn`, `refusal`, `max_tokens`), compteur d'appels ; aucun `console.log` de la requête ni de l'erreur brute (la clé n'apparaît jamais : test dédié qui vérifie que le message d'erreur journalisé ne contient pas la valeur de `ANTHROPIC_API_KEY`) (FR-030)
- [ ] T081 [US4] Créer `scripts/data/lib/extraction/run.ts` : `runExtraction({ corpus, cacheDir, extractionsDir, candidateId, sourceIds?, model, maxCostUsd?, dryRun, client, now })` : préconditions (banque active non vide, chaque source en cache, candidat existant) sinon erreur métier ; `bankVersion` = `current` du registre ; `runId` = horodatage + 8 hex de `sha256(empreintes des sources triées | bankVersion | model | prompt.hash)` ; par source, par tranche : `countTokens` → estimation ; si `cumul + estimation > maxCostUsd` ⇒ arrêt propre, `status: 'interrupted'` ; sinon `extract`, `stopReason ∈ {refusal, max_tokens}` ⇒ tranche `failed` et poursuite ; vérification des citations (`verifyAffirmation`), fusion dans `affirmations/<candidat>.json`, cumul `usage` et `costUsd` ; écrit `runs/<id>.json` (data-model.md § 8, `error` sans secret ni texte de source) et met à jour `costs.json` (`runs`, `totalUsd`, `byModel`, `byCandidate`) ; `dryRun` retourne tranches, jetons estimés, coût estimé sans appel `extract` ; **n'écrit jamais dans `positions/`** (FR-023, FR-025, FR-027, FR-029)
- [ ] T082 [US4] Créer `scripts/data/extract.ts` : `pnpm data:extract --candidate <id> [--sources a,b] [--max-cost <usd>] [--model <id>] [--dry-run]` ; modèle = `--model` ?? `RADAR_EXTRACTION_MODEL` ?? `claude-opus-5-5` ; refuse sans `ANTHROPIC_API_KEY` résolu (sauf `--dry-run`) ; appelle `runExtraction` avec `anthropicClient` ; affiche le résumé (tranches, affirmations produites / vérifiables / non vérifiables / doublons, coût, état) ; sortie 1 si `failed`
- [ ] T083 [US4] Créer `scripts/data/affirmation.ts` : `list --candidate <id> [--state verifiable|unverifiable|accepted|rejected]` (tableau : id, question ou « aucune », valeur proposée, confiance, citation tronquée, localisation) ; `accept <id> --by <contrib> [--value n] [--question q] [--evidence e]` : refuse `unverifiable`, `question = null` (sans `--question`), déjà `accepted`/`rejected`, couple déjà présent dans `positions/` ; crée la position `draft` (`provenance: { kind: 'extraction', run, affirmation, model }`, `sources: [source]`, `quote`, `quoteSource`, `evidence` = `kind` de la source, `justification` = `summary`, `author = --by`, `authoredAt` = aujourd'hui) via `writeYaml`, pose `state: accepted` et `decision { by, at, position }` ; `reject <id> --by <contrib> --reason <texte>` : pose `rejected` et `decision { by, at, reason }` ; test `scripts/data/affirmation.test.ts` (refus, création, trace) (FR-028, US4 scénarios 5 et 6)
- [ ] T084 [P] [US4] Créer `scripts/data/costs.ts` : `pnpm data:costs` lit `data/extractions/costs.json` et les journaux, affiche cumul total, par modèle, par candidat, dernières exécutions (id, date, état, coût) ; sortie 0 même sans exécution (SC-006)
- [ ] T085 [US4] Créer `scripts/data/extract.test.ts` avec `fakeClient` sur la fixture minimale copiée dans un dossier temporaire : (a) affirmations complètes et citations retrouvées ⇒ `verifiable`, citation inventée ⇒ `unverifiable` ; (b) journal complet (modèle, `promptVersion`, `bankVersion`, sources avec empreintes, effectifs, `usage`, `costUsd`, état) ; (c) trois relances ⇒ 3 journaux, `added = 0`, fichiers `affirmations/` et `positions/` identiques octet à octet ; (d) `maxCostUsd` minuscule ⇒ `interrupted` après la première tranche, affirmations conservées ; (e) `refusal` sur une tranche ⇒ `failed` pour la tranche, exécution `completed` ; (f) `dryRun` ⇒ aucun appel `extract`, estimation affichée ; (g) `positions/` jamais modifié (SC-005, FR-026, FR-027, FR-029)
- [ ] T086 [US4] Créer `data/extractions/costs.json` initial (`{ "runs": 0, "totalUsd": 0, "byModel": {}, "byCandidate": {} }`), `data/extractions/runs/.gitkeep`, `data/extractions/affirmations/.gitkeep` ; compléter `data/README.md` (section extraction : prérequis clé, `--dry-run`, plafond, relecture obligatoire, coût consultable) ; vérifier `pnpm data:validate` toujours vert (règle `FR-016` lit `data/extractions/`)

**Checkpoint** : les quatre stories sont démontrables ; `pnpm verify` vert sans clé d'API ; `pnpm data:extract --dry-run` fonctionne sans clé.

---

## Phase 7: Polish & Cross-Cutting Concerns

- [ ] T087 [P] Rédiger la section « Données et pipeline » du `README.md` : rôle de `data/`, `public/data/`, cache ; tableau des commandes `pnpm data:*` ; cycle éditorial (source → extraction facultative → affirmation → position `draft` → relecture → publication) ; renvoi à `data/README.md`, à la page Méthodologie et à la constitution
- [ ] T088 [P] Mesurer SC-010 : générer dans un dossier temporaire un corpus synthétique (22 candidats, 16 thèmes, 300 questions, 6 600 positions relues, cache) via un test `scripts/data/validate.perf.test.ts` marqué `it.skipIf(!process.env.RADAR_PERF)` et chronométrer `validate()` ; consigner la durée mesurée dans `specs/002-corpus-ontologie-pipeline/quickstart.md` § 5 (attendu : secondes, limite 2 min)
- [ ] T089 [P] Vérifier le poids : publier la fixture minimale dans un dossier temporaire et vérifier `main.json` et détails sous budgets ; vérifier que `zod` n'entre pas dans le bundle de la page d'accueil (`pnpm build`, inspecter `out/_next/static/chunks` référencés par `out/index.html`) ; consigner dans quickstart § 3 (SC-004, SC-011 de la 001)
- [ ] T090 [P] Vérifier la non-divulgation : `grep -r "ANTHROPIC_API_KEY" scripts/` ne montre que la documentation et le test de T080 ; aucun journal `runs/*.json` ne contient de texte de source ni de clé (test déjà en T085) ; `.env.example` liste 100 % des variables référencées par `grep -r process.env scripts src e2e` (FR-030)
- [ ] T091 Dérouler `specs/002-corpus-ontologie-pipeline/quickstart.md` § 1 à 3 et 5 de bout en bout sur un clone frais (sans clé) et § 4 avec une clé locale et `--max-cost 1` sur une source réelle ; corriger les écarts ; cocher chaque scénario dans le quickstart
- [ ] T092 Mettre à jour `specs/002-corpus-ontologie-pipeline/checklists/requirements.md`, `spec.md` (`Status: Implemented` une fois la Phase 8 engagée), le tableau des fonctionnalités du `README.md`, et vérifier la conformité aux principes I à VII dans la description de la pull request de code

---

## Phase 8: Campagne éditoriale (hors mise en œuvre logicielle, actions du propriétaire)

**Purpose** : produire le corpus réel avec les outils livrés, par pull requests de données
distinctes du code et relues par une personne différente (FR-041). Ces tâches ne sont **pas**
exécutées par `/speckit-implement` ; elles conditionnent SC-002, SC-003, SC-008 et SC-009.

- [ ] T093 **(propriétaire)** Compléter `data/corpus/contributors.yaml` avec le compte GitHub du relecteur réel ; arbitrer la liste de `data/corpus/candidates.yaml` au regard de monvote2027.fr (T043)
- [ ] T094 **(éditeur + relecteur)** Porter la banque `data/corpus/questions/*.yaml` à 250–300 énoncés actifs, ≥ 10 par thème, polarités 40–60 %, grille de neutralité cochée et `reviewer` distinct ; `pnpm data:validate` sans `THEME-EMPTY` ni `BANK-SIZE` (SC-002)
- [ ] T095 **(éditeur)** Enregistrer les sources de chaque candidat (`pnpm data:source fetch …`) dans `data/corpus/sources/*.yaml` ; lancer `pnpm data:extract` par candidat sous plafond ; transformer les affirmations (`pnpm data:affirmation accept|reject`)
- [ ] T096 **(relecteur)** Relire les positions (`pnpm data:review`) jusqu'à une couverture ≥ 60 % par candidat déclaré (rapport `data/reports/validation.md`) (SC-003)
- [ ] T097 **(mainteneur)** Publier la version 1 (`pnpm data:publish --next`), vérifier `/methodologie` en prévisualisation Vercel, puis mener les échantillonnages SC-008 (20 positions, < 2 min) et SC-009 (personne extérieure, 90 % à ±1) et consigner les résultats dans `specs/002-corpus-ontologie-pipeline/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)** : T001 d'abord (dépendances) ; T002–T007 en parallèle ensuite.
- **Foundational (Phase 2)** : après Phase 1 ; bloque toutes les stories. T009 après T008 ; T012 après T008–T011 ; T017 après T013–T016 ; T018 après T017 ; T022 après T018–T021 ; T025 après T018 (pour vérifier la fixture).
- **US1 (Phase 3)** : après Phase 2. T026–T035 en parallèle ; T036 après eux ; T037 après T036 ; T038 après T037 et au moins les fixtures de T026–T035 ; T039 après T037 ; T040–T042 en parallèle dès la Phase 2 terminée ; T043 après T022 et T040–T042 ; T044 après T040.
- **US2 (Phase 4)** : après Phase 2 ; indépendante de US1 pour le code (T045–T056), mais `T057` et le test d'intégration s'appuient sur T037–T038. T046–T054 en parallèle ; T055 après eux ; T056 après T045 et T055.
- **US3 (Phase 5)** : scripts (T058–T064) après US2 (`isKnown`, règles) ; interface (T065–T070) après Phase 2 seulement ; T071–T072 après T065–T070 ; T073 après T071 ; T074 après T073.
- **US4 (Phase 6)** : après US2 (cache, citations, `positions.ts`) ; indépendante de US3. T075–T079 en parallèle ; T080 après T077 ; T081 après T075–T080 ; T082–T083 après T081 ; T085 après T082–T083 ; T086 en dernier.
- **Polish (Phase 7)** : après les stories voulues. **Campagne (Phase 8)** : après US1 au minimum, idéalement après US4.

### Parallel Opportunities

- Phase 1 : T002 à T007 (six fichiers distincts).
- Phase 2 : T008 / T010 / T011 ; T013 / T014 / T015 / T016 ; T019 / T020 / T021 ; T023 / T024.
- US1 : les dix règles T026–T035 (un fichier, un test, une fixture chacune) ; T040 / T041 / T042.
- US2 : T045 et les neuf règles T046–T054.
- US3 : T058 / T059 / T060 / T061 côté scripts ; T065 / T066 / T067 / T069 côté interface, puis T068 / T070 ; les deux volets de US3 peuvent avancer de front.
- US4 : T075 / T076 / T077 / T078 / T079 ; T084 en parallèle de T082–T083.
- Phase 7 : T087 à T090.

### Parallel Example: User Story 1

```bash
# Après la Phase 2, lancer en parallèle (fichiers et fixtures distincts) :
Task: "Règle ID-UNIQUE dans scripts/data/lib/rules/ID-UNIQUE.ts + test + data/fixtures/violations/ID-UNIQUE/"
Task: "Règle REF-EXISTS dans scripts/data/lib/rules/REF-EXISTS.ts + test + fixture"
Task: "Règle FR-008 dans scripts/data/lib/rules/FR-008.ts + test + fixture"
Task: "Règle FR-010 dans scripts/data/lib/rules/FR-010.ts + test + fixture"
Task: "Règle FR-012 dans scripts/data/lib/rules/FR-012.ts + test + fixture"
Task: "data/corpus/themes.yaml (16 thèmes)"
Task: "data/corpus/governance.yaml"
# Puis séquentiellement : T036 (index + stats) → T037 (validate.ts) → T038 (test SC-001) → T039 (CI).
```

### Parallel Example: User Story 3

```bash
# Volet scripts et volet interface en parallèle :
Task: "scripts/data/lib/publish/build.ts + test (US3 scénario 1)"
Task: "scripts/data/lib/publish/registry.ts, diff.ts, sizes.ts + tests"
Task: "src/i18n/messages/fr.json : methodology.*, ui.positionCard.*, ui.coverageList.*"
Task: "src/ui/PositionCard/ (composant, story, test, index)"
Task: "src/ui/CoverageList/ (composant, story, test, index)"
# Puis : T063 (publish.ts) ; T071 → T072 → T073 → T074.
```

---

## Implementation Strategy

### MVP First (US1)

1. Phases 1 et 2 (outillage, cœur `dataset`, schémas, chargeur, texte, cache, `data:source`).
2. Phase 3 : règles du référentiel, `pnpm data:validate`, fixtures, CI, 16 thèmes, gouvernance,
   candidats, première tranche de la banque.
3. **STOP et valider** : quickstart § 1 ; la CI exécute `data:validate` ; une banque neutre et
   équilibrée est déjà un livrable.

### Incremental Delivery

1. US1 → référentiel validé en CI (MVP).
2. US2 → sources en cache, positions sourcées, relecture croisée, 20 codes de règle.
3. US3 → publication immuable, `src/core/dataset` consommable par la 003, page Méthodologie.
4. US4 → extraction assistée sous plafond, testée sans clé.
5. Polish → README, mesures SC-004 / SC-010, quickstart complet.
6. Campagne éditoriale → banque 250–300, couverture ≥ 60 %, version 1, SC-008 / SC-009.

Chaque incrément se termine par `pnpm verify` vert.

---

## Traçabilité exigences → tâches

| Exigence | Tâches |
|---|---|
| FR-001, FR-002 | T014, T040 |
| FR-003 | T028 |
| FR-004, FR-005, FR-006 | T029, T030, T041, T043 |
| FR-007 | T058 (`withdrawn`, exclusion) |
| FR-008 à FR-012 | T031–T035, T044 |
| FR-013, FR-014 | T022, T046, T047 |
| FR-015 | T048 |
| FR-016 à FR-020 | T045, T049–T053, T056 |
| FR-021, FR-022 | T045, T057, T058 |
| FR-023 à FR-029 | T076–T085 |
| FR-030 | T004, T080, T090 |
| FR-031, FR-032 | T023, T036, T037, T038, T055 |
| FR-033, FR-034 | T010, T055, T058 |
| FR-035 | T024, T036, T055 |
| FR-036 à FR-038 | T058, T063 |
| FR-039, FR-040 | T059, T060, T063 |
| FR-041 | T006, T042, Phase 8 |
| FR-042 à FR-045 | T065–T074 |
| SC-001 | T038, fixtures T026–T035, T046–T054, T060, T061 |
| SC-004 | T061, T089 |
| SC-005, SC-006 | T079, T081, T084, T085 |
| SC-007 | T072, T074 |
| SC-010 | T037, T088 |
| SC-011 | T060, T063 |
| SC-002, SC-003, SC-008, SC-009 | Phase 8 |

## Notes

- `[P]` = fichiers différents, aucune dépendance sur une tâche inachevée.
- Chaque règle a trois livrables inséparables : module, test unitaire, fixture de violation.
- Les commandes écrivent le YAML via `writeYaml` pour des diffs stables en revue.
- Ne jamais commiter `.cache/`, `data/reports/` ni un fichier `.env*` autre que `.env.example`.
- Commiter après chaque tâche ou groupe logique ; PR de code distinctes des PR de données.
