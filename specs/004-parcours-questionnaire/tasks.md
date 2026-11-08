# Tasks: Parcours questionnaire

**Input**: Design documents from `/specs/004-parcours-questionnaire/`

**Prerequisites**: plan.md, spec.md, research.md (R1–R14), data-model.md, contracts/
(routes-and-state.md, components.md, storage-and-data.md, i18n-messages.md), quickstart.md

**Tests**: la constitution exige un test Vitest et une story a11y par composant `src/ui`
(principe IV), des tests de bout en bout par parcours (principe V, FR-034) et le plan impose
des tests unitaires et de propriétés sur le réducteur et le stockage (R3, R4). Les tâches de
test font donc partie de chaque phase et sont écrites **avant** l'implémentation qu'elles
couvrent. Les tests e2e tournent contre l'export statique avec une banque fictive servie par
interception de route (R6) : ils ne dépendent pas d'une publication réelle.

**Organization**: tâches groupées par user story. Aucune dépendance ajoutée ; `src/core`
n'est **pas** modifié (principe III) : tout vient de `@/core` en lecture.

## Format: `[ID] [P?] [Story] Description`

- **[P]** : parallélisable (fichiers différents, aucune dépendance sur une tâche inachevée)
- **[Story]** : US1 à US4, user stories de [spec.md](spec.md)
- Chemins relatifs à la racine du dépôt (projet unique, voir plan.md § Project Structure)

## Conventions communes à toutes les tâches

- **Frontières** : `src/lib/questionnaire/**` importe `@/core`, `zod`, `react` ; jamais
  `next/*` ni `src/ui`. `src/ui/**` n'importe ni `@/core` ni `next/*` (sauf `next-intl`).
  `src/core/**` n'importe rien de nouveau (`git diff --stat main -- src/core` reste vide).
- **Textes** : aucune chaîne française en dur dans `src/app` ni `src/ui`
  (`react/jsx-no-literals`) ; toutes les clés sont celles de
  [contracts/i18n-messages.md](contracts/i18n-messages.md). Dates via `useFormatter`.
- **Styles** : tokens seulement (`src/ui/tokens.css`), aucune valeur en dur ; cibles
  `min-h-touch` (44 px) ; chaque composant vérifié à 320 px et dans les deux apparences.
- **Tests** : `*.test.ts(x)` à côté des modules, projet Vitest `unit` ; modules sans DOM en
  `// @vitest-environment node` ; composants avec Testing Library via `src/lib/test-utils.tsx`
  (fournit `NextIntlClientProvider` et `fr.json`). Lancer avec
  `pnpm vitest run <chemin> </dev/null`. Stories : une par état listé dans
  [contracts/components.md](contracts/components.md), a11y bloquante dans les projets
  `storybook` et `storybook-sombre`.
- **Réducteur et horodatage** : `now` est porté par l'action, jamais lu dans
  `src/lib/questionnaire` (`Date` n'y apparaît que dans `store.tsx`).
- **Commentaires et messages** : en français ; identifiants de code en anglais ; chaque module
  cite les FR qu'il met en œuvre dans son en-tête.

---

## Phase 1: Setup

**Purpose**: arborescence, textes et garde-fous de frontières, sans logique.

- [ ] T001 Créer les dossiers `src/lib/questionnaire/`, `src/app/questionnaire/mode/`,
  `src/app/questionnaire/questions/`, `src/app/questionnaire/fin/`, `src/app/resultats/`,
  `e2e/fixtures/` et les dossiers de composants `src/ui/ModeChoice/`, `src/ui/QuestionCard/`,
  `src/ui/ResumeCard/`, `src/ui/ConfirmDialog/`, `src/ui/Notice/`, `src/ui/AnswerSummary/`
  (un `index.ts` vide dans chaque dossier de composant pour que l'arborescence du plan existe)
- [ ] T002 [P] Ajouter à `src/i18n/messages/fr.json` toutes les clés de
  [contracts/i18n-messages.md](contracts/i18n-messages.md) : `home.resume.*`,
  `questionnaire.*` (title, loading, noVersion, loadError, retry, themes.*, mode.*,
  questions.*, confirm.*, end.*), `ui.modeChoice.*`, `ui.questionCard.*`, `ui.resumeCard.*`,
  `ui.notice.*`, `ui.answerSummary.*`, `results.*` ; respecter la typographie française
  (espaces insécables avant `?` `!` `:` `;`, guillemets « ») et vérifier
  `pnpm vitest run src/i18n/messages.test.ts </dev/null`
- [ ] T003 [P] Étendre `src/lib/core-boundary.test.ts` d'un cas vérifiant qu'aucun fichier de
  `src/core/**` n'importe `@/lib/questionnaire` ni `@/lib/dataset-client`, et que
  `src/lib/questionnaire/**` n'importe pas `next/navigation` ni `@/ui` (lecture des sources
  par `node:fs`, même technique que les cas existants)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: types, projection de la banque, réducteur, stockage, résumé, chargeur client,
gardes de routes, extension `LikertChoice` et les six composants `src/ui`. Tout est pur ou
isolé, testable sans Next.

**⚠️ CRITICAL**: aucune story ne commence avant la fin de cette phase (les composants T019 à
T024 peuvent toutefois avancer en parallèle des modules T005 à T017).

### Types et modules d'état (`src/lib/questionnaire`)

- [ ] T004 Écrire `src/lib/questionnaire/types.ts` : `Draft` (`format: 1`, `bankVersion`,
  `mode`, `priorities`, `answers`, `position`, `updatedAt`), `Choice`, `Step`
  (`'themes' | 'mode' | 'questions' | 'end'`), `Action` (`start`, `answer`, `next`,
  `previous`, `goTo`, `resume`, `reset`, `clear`), `QuestionnaireBank` (`version`,
  `publishedAt`, `themes[{ id, label, description, index }]`, `bank: BankVersion`),
  `QuestionTheme`, `StorageStatus`, `LoadState`, `ResumeInfo`, `ThemeSummary`, `EndSummary`,
  conformément à [data-model.md](data-model.md) § 1 à § 8 ; `Mode`, `Answer`, `Selection`,
  `BankVersion` importés de `@/core`
- [ ] T005 [P] Écrire `src/lib/questionnaire/bank-view.test.ts` (node) sur
  `syntheticDataset({ themes: 16, perTheme: 20 })` de `src/core/bank/fixtures.ts` :
  `questionnaireBankFrom` donne 16 thèmes avec `label`, `description`, `index = i` et
  `bank.version = main.version` ; `selectionsFor(bank, 4 sujets)` renvoie `full.items.length =
  100` et `short.items.length = 25` ; `themesOf` renvoie 1 ou 2 thèmes et marque
  `priority: true` exactement pour les sujets clés
- [ ] T006 [P] Écrire `src/lib/questionnaire/bank-view.ts` : `questionnaireBankFrom(main)`
  (`bankFromDataset` + thèmes avec description en ordre canonique), `selectionsFor(bank,
  priorities)` (deux appels `selectQuestions`, R8), `themesOf(bank, question, priorities)`
  ([contracts/storage-and-data.md](contracts/storage-and-data.md) § 3)
- [ ] T007 [P] Écrire `src/lib/questionnaire/reducer.test.ts` (node) : cas unitaires du
  [quickstart](quickstart.md) § 1 (`start` crée `N × 'unanswered'` en position 0 ; `answer`
  hors position ignorée ; `next` borné à `N − 1` ; `previous` borné à 0 ; `goTo` idempotent et
  hors bornes ignoré ; `resume` remplace ; `reset` et `clear` rendent `null` ;
  `firstUnanswered`) et propriétés fast-check : pour toute suite d'actions valides,
  `answers.length` constant, `0 ≤ position < N`, chaque réponse satisfait `isAnswer`, aucune
  réponse non visée ne change, `updatedAt` égal au `now` de la dernière action qui écrit
- [ ] T008 [P] Écrire `src/lib/questionnaire/reducer.ts` : `reduce(draft, action, { selection })`
  pur selon la table de [data-model.md](data-model.md) § 4, `isCompleted(draft)`,
  `firstUnanswered(draft)` ([contracts/routes-and-state.md](contracts/routes-and-state.md)
  § Réducteur) ; aucune règle de sélection ni de score
- [ ] T009 [P] Écrire `src/lib/questionnaire/storage.test.ts` (node, stockage en mémoire
  injecté) : `readDraft` rend `null` sur valeur absente, JSON invalide, `format: 0`, réponse
  `7`, `priorities` en double ; aller-retour `writeDraft` → `readDraft` exact ; `writeDraft`
  rend `false` et ne lève pas si `setItem` lève ; `clearDraft` supprime la clé
  `radar-questionnaire` et aucune autre ; `probeStorage` rend `'unavailable'` sur un stockage
  qui lève et ne laisse aucune clé d'essai ; `subscribeDraft` n'appelle l'écouteur que pour
  l'événement `storage` de la clé `radar-questionnaire` et se désabonne
- [ ] T010 [P] Écrire `src/lib/questionnaire/storage.ts` : `DRAFT_STORAGE_KEY`,
  `DRAFT_FORMAT`, `DraftSchema` (zod, [data-model.md](data-model.md) § 5), `readDraft`,
  `writeDraft`, `clearDraft`, `probeStorage`, `subscribeDraft`, type `StorageLike` et stockage
  par défaut `window.localStorage` sous `try/catch` (même convention que
  `src/lib/appearance.ts`) ; journalisation des lectures invalides en développement seulement
- [ ] T011 [P] Écrire `src/lib/questionnaire/summary.test.ts` (node) : `summarize` compte une
  question à deux thèmes dans les deux ; `reliable` faux sous `MIN_THEME_QUESTIONS` réponses
  numériques (`'skipped'` ne compte pas) ; `warning` vrai dès qu'un sujet clé n'est pas fiable ;
  `totalAnswered` / `totalSkipped` ; `resultStateFromDraft` normalise les sujets et garde
  `'unanswered'` ; `decodeFragment(resultHref(draft, bank).split('#')[1], bank.bank)` redonne
  l'état exact (brouillon complet, brouillon partiel, toutes passées)
- [ ] T012 [P] Écrire `src/lib/questionnaire/summary.ts` : `summarize(draft, bank, selection)`
  (R9), `resultStateFromDraft(draft, bank)`, `resultHref(draft, bank)` =
  `'/resultats' + encodeFragment(state, bank.bank)` (R10) ; constantes importées de `@/core`
- [ ] T013 [P] Écrire `src/lib/questionnaire/resume-info.test.ts` (node) : `resumeInfoFrom(draft,
  registry)` rend `done` = nombre de réponses ≠ `'unanswered'`, `total`, `mode`, `updatedAt`
  et `status` `'resumable'` si `bankVersion = registry.current`, `'version-changed'` sinon ;
  `resumeInfoFrom(draft, null)` rend `'unavailable'`
- [ ] T014 [P] Écrire `src/lib/questionnaire/resume-info.ts` : `resumeInfoFrom(draft, registry |
  null): ResumeInfo` ([data-model.md](data-model.md) § 6)
- [ ] T015 [P] Écrire `src/lib/questionnaire/guards.test.ts` (node) : `requiredStep(route,
  { choice, draft })` rend `null` ou la route de redirection pour chaque ligne de
  [data-model.md](data-model.md) § 3 (mode sans sujets → `/questionnaire` ; questions sans mode
  → `/questionnaire/mode` ; questions sans sujets → `/questionnaire` ; fin sans brouillon →
  `/questionnaire` ; brouillon présent → tout autorisé)
- [ ] T016 [P] Écrire `src/lib/questionnaire/guards.ts` : `requiredStep(route, state)` et la
  table `ROUTES: Record<Step, string>` ([contracts/routes-and-state.md](contracts/routes-and-state.md)
  § Routes) ; `isChoiceValid(choice)` via `MIN_PRIORITIES` / `MAX_PRIORITIES`

### Chargeur client du jeu publié

- [ ] T017 [P] Écrire `src/lib/dataset-client.test.ts` (node, `fetch` fictif injecté) : URL
  exactes `/data/versions.json` et `/data/versions/1/main.json` sans paramètre ni en-tête
  ajouté ; `cache: 'no-cache'` pour le registre et `'force-cache'` pour `main.json` ; erreur
  `{ kind: 'network', status }` sur réponse non 2xx ou exception ; `{ kind: 'invalid' }` sur
  schéma refusé ; `loadMain(1)` appelé deux fois ne fait qu'une requête ; `clearDatasetCache`
  réinitialise
- [ ] T018 [P] Écrire `src/lib/dataset-client.ts` : `loadRegistry(fetcher?)`,
  `loadMain(version, fetcher?)`, `clearDatasetCache()`, type `DatasetClientError`, validation
  par `VersionRegistrySchema` / `MainDatasetSchema` de `@/core`
  ([contracts/storage-and-data.md](contracts/storage-and-data.md) § 2) ; aucun import
  `node:*` (module exécuté dans le navigateur, réutilisé par la 005)

### Composants `src/ui` (parallélisables entre eux)

- [ ] T019 [P] Étendre `src/ui/LikertChoice/LikertChoice.tsx` d'une prop optionnelle
  `onCommit(answer)` appelée après `onChange` sur clic/toucher, Entrée ou Espace d'une option
  (y compris déjà sélectionnée), jamais sur flèches, Début, Fin (R7) ; ajouter dans
  `src/ui/LikertChoice/LikertChoice.test.tsx` les cas « clic appelle onChange et onCommit »,
  « flèche droite n'appelle que onChange », « Entrée sur l'option focalisée appelle onCommit »
  et une story « Commit » avec play function dans `src/ui/LikertChoice/LikertChoice.stories.tsx`
- [ ] T020 [P] Créer `src/ui/Notice/Notice.tsx`, `index.ts`, `Notice.test.tsx` (rôle ARIA
  `status` par défaut, `alert` sur demande ; titre par défaut `ui.notice.info` /
  `ui.notice.warning` quand `title` absent) et `Notice.stories.tsx` (info, warning, avec
  titre, long texte à 320 px) ; icône par ton distincte par la forme, tokens seulement
- [ ] T021 [P] Créer `src/ui/ConfirmDialog/ConfirmDialog.tsx`, `index.ts`,
  `ConfirmDialog.test.tsx` (ouverture par `showModal()` quand `open` passe à `true` ; focus
  initial sur Annuler ; Échap et clic hors boîte appellent `onCancel` ; Confirmer appelle
  `onConfirm` ; le focus revient à l'élément actif avant l'ouverture ; `aria-labelledby` et
  `aria-describedby`) et `ConfirmDialog.stories.tsx` (fermé, ouvert, destructif, 320 px) ;
  `<dialog>` natif, aucune bibliothèque (R12) ; prévoir un `polyfill` minimal de `showModal`
  dans le test si jsdom ne l'implémente pas
- [ ] T022 [P] Créer `src/ui/ModeChoice/ModeChoice.tsx`, `index.ts`, `ModeChoice.test.tsx`
  (clic et flèches changent la valeur ; `aria-checked` ; `disabled`) et
  `ModeChoice.stories.tsx` (aucun choisi, court, complet, désactivé) : `<fieldset>` +
  `role="radiogroup"`, deux cartes radio avec `ui.modeChoice.{short,full}.title`,
  `ui.modeChoice.questions` ({count} exact, R8), `.duration`, `.detail` ; empilement
  vertical à 320 px ; cibles ≥ 44 px
- [ ] T023 [P] Créer `src/ui/QuestionCard/QuestionCard.tsx`, `index.ts`,
  `QuestionCard.test.tsx` (focus posé via `headingRef` ; thème clé annoncé par
  `ui.questionCard.priorityTheme` en texte masqué ; `onChange` et `onCommit` propagés ;
  `name = question-{position}`) et `QuestionCard.stories.tsx` (sans réponse, chaque niveau,
  passée, deux thèmes dont un clé, avec aide, désactivée, 320 px) : `<article>`, `<h2
  tabIndex={-1}>` = énoncé, liste de thèmes en lecture seule (`role="list"` / `listitem`,
  style « sujet clé » jamais par la couleur seule), `LikertChoice` avec `legend =
  ui.questionCard.answerLegend`, `hint` optionnel
- [ ] T024 [P] Créer `src/ui/ResumeCard/ResumeCard.tsx`, `index.ts`, `ResumeCard.test.tsx`
  (Reprendre, Recommencer, Effacer appellent leurs rappels ; Reprendre absent si
  `status = 'version-changed'` et `Notice` d'avertissement présent) et
  `ResumeCard.stories.tsx` (reprenable, version changée, 320 px) : `Card`,
  `ui.resumeCard.title`, `ui.resumeCard.summary` ({mode} select, {done}, {total}, {date}
  déjà formatée), boutons `Button` primaire / secondaire / ghost
- [ ] T025 [P] Créer `src/ui/AnswerSummary/AnswerSummary.tsx`, `index.ts`,
  `AnswerSummary.test.tsx` (marque `ui.answerSummary.unreliable` présente seulement si
  `!reliable`, avec `{min} = minReliable`) et `AnswerSummary.stories.tsx` (tous fiables, un
  non fiable, tous non fiables, 320 px) : `<ul>`, par sujet libellé +
  `ui.answerSummary.counts`
- [ ] T026 Exporter les six nouveaux composants et leurs types depuis `src/ui/index.ts`
  (après T020 à T025) et vérifier `pnpm vitest run src/ui </dev/null` puis `pnpm vitest run
  --project storybook --project storybook-sombre </dev/null` : aucune violation a11y dans les
  deux apparences
- [ ] T027 Compléter `src/ui/ThemePicker/ThemePicker.tsx` pour afficher la description courte
  de chaque thème sous son libellé (FR-003 : visible, pas seulement en infobulle `title`) via
  une liste `<ul>` d'éléments contenant la `ThemeChip` et un `<p>` de description lié par
  `aria-describedby` ; ajouter la story « Avec descriptions » dans
  `src/ui/ThemePicker/ThemePicker.stories.tsx` et le test « la description est rendue et
  reliée à la puce » dans `src/ui/ThemePicker/ThemePicker.test.tsx` ; le compteur « x / 5 » et
  les messages min/max existants sont conservés

**Checkpoint**: `pnpm vitest run src/lib src/ui </dev/null`, `pnpm lint`, `pnpm typecheck`
verts ; Storybook a11y vert dans les deux apparences ; `src/core` inchangé.

---

## Phase 3: User Story 1 - Répondre à un questionnaire de bout en bout (Priority: P1) 🎯 MVP

**Goal**: de l'accueil à l'écran de fin : sujets clés (3 à 5), mode avec nombre exact de
questions, questions une par une avec avancement automatique, écran de fin et lien vers les
résultats portant l'état complet ; page de garde `/resultats`.

**Independent Test**: parcours court avec 4 sujets puis parcours complet avec 3 sujets sur la
banque fictive ; `decodeFragment` du lien de fin redonne mode, sujets et N réponses ; deux
contextes avec le même triplet voient les mêmes énoncés dans le même ordre.

### Tests pour User Story 1

- [ ] T028 [P] [US1] Écrire `e2e/fixtures/published.ts` : sérialiser
  `syntheticDataset({ themes: 16, perTheme: 20 })` (import relatif
  `../../src/core/bank/fixtures`) en un registre `{ current: 1, versions: [...] }` conforme à
  `VersionRegistrySchema` et un `main.json` conforme à `MainDatasetSchema` ; exporter
  `servePublished(page, { current = 1 } = {})` qui répond par `page.route('**/data/versions.json')`
  et `page.route('**/data/versions/1/main.json')`, `expectedSelection(mode, priorities)` via
  `selectQuestions` et `fr` (lecture de `src/i18n/messages/fr.json`) pour les libellés (R6)
- [ ] T029 [P] [US1] Écrire `src/lib/questionnaire/store.test.tsx` (jsdom, Testing Library,
  `fetch` et stockage fictifs) : `load` passe de `loading` à `ready` avec 16 thèmes ;
  `no-version` quand `current = 0` ; `error.network` et `error.invalid` ; `setPriorities`
  normalise en ordre canonique et calcule `selections` pour les deux modes dès 3 sujets ;
  `start()` rend `'started'` et crée un brouillon de `N` réponses ; `start()` avec le même
  triplet qu'un brouillon existant rend `'resumed'` sans modifier le brouillon (R13) ; avec un
  triplet différent rend `'needs-confirmation'` et `confirmStart()` repart de zéro ;
  `resultHref` commence par `/resultats#1.` ; `useQuestionnaire` lève hors du fournisseur
- [ ] T030 [P] [US1] Écrire dans `e2e/questionnaire.spec.ts` les tests « accueil → fin, mode
  court » (4 sujets, « 1 / 25 », 25 clics, écran de fin sans avertissement, lien « Voir mes
  résultats » dont le fragment décodé par `decodeFragment` donne `short`, 4 sujets,
  25 réponses), « mode complet » (3 sujets, « 1 / 100 », 100 réponses), « déterminisme »
  (deux contextes, mêmes 100 énoncés dans le même ordre), « sélection bornée » (2 sujets →
  Continuer inactif et `minNotReached` ; 5 sujets → sixième refusée et `maxReached`),
  « accès direct » (`/questionnaire/questions` sans choix → `/questionnaire`, aucun texte
  d'erreur), « trafic » (toute requête du parcours court est locale, URL ∈ ressources
  statiques ∪ `/data/**`, aucune ne contient un identifiant de thème, `short`, `full` ni un
  chiffre de réponse) ; tous via `servePublished`

### Implementation pour User Story 1

- [ ] T031 [US1] Écrire `src/lib/questionnaire/store.tsx` ('use client') :
  `QuestionnaireProvider` et `useQuestionnaire()` selon
  [contracts/routes-and-state.md](contracts/routes-and-state.md) § Fournisseur : chargement
  `loadRegistry` → `loadMain` → `questionnaireBankFrom` (états `loading` / `no-version` /
  `error` / `ready`, action `retry`), `choice` en mémoire, `draft` par `useReducer(reduce)`,
  `selection` du brouillon, `selections` des deux modes dès que `choice.priorities` est valide,
  `setPriorities` (normalisées par `normalizePriorities`), `setMode`, `start()` /
  `confirmStart()` (R13), `dispatch` injectant `now`, `resultHref` ; la persistance et la
  synchronisation multi-onglets sont ajoutées en US3 (T049), l'historique en US2 (T042)
- [ ] T032 [US1] Écrire `src/app/questionnaire/layout.tsx` ('use client') : enveloppe les
  pages enfants dans `QuestionnaireProvider` ; affiche `questionnaire.loading`,
  `questionnaire.noVersion` ou `questionnaire.loadError` + bouton `questionnaire.retry`
  selon `load.status` et ne rend les enfants qu'en `ready` ; `<h1>` `questionnaire.title`
  masqué visuellement si la page porte son propre titre
- [ ] T033 [US1] Écrire `src/app/questionnaire/page.tsx` (étape `themes`) : titre
  `questionnaire.themes.title`, explication `questionnaire.themes.explain` (FR-007),
  `ThemePicker` (options = `bank.themes` avec descriptions, `min = MIN_PRIORITIES`, `max =
  MAX_PRIORITIES`, `legend = questionnaire.themes.legend`, valeur = `choice.priorities`),
  bouton `questionnaire.themes.continue` actif seulement si la sélection est valide
  (`router.push('/questionnaire/mode')`) ; garde `requiredStep` dans un effet
  (`router.replace`)
- [ ] T034 [US1] Écrire `src/app/questionnaire/mode/page.tsx` (étape `mode`) : titre
  `questionnaire.mode.title`, `ModeChoice` (`options` = `selections.full.items.length` et
  `selections.short.items.length`, R8), lien `questionnaire.mode.back` vers `/questionnaire`
  (sélection conservée, FR-010), bouton `questionnaire.mode.continue` actif si un mode est
  choisi : appelle `start()` et navigue vers `/questionnaire/questions` sur `'started'` ou
  `'resumed'` (le cas `'needs-confirmation'` est câblé en US4, T056) ; garde `requiredStep`
- [ ] T035 [US1] Écrire `src/app/questionnaire/questions/page.tsx` (étape `questions`,
  parcours nominal) : question courante = `selection.items[draft.position]` ; `QuestionCard`
  (`statement = question.text`, `themes = themesOf(...)`, `value` dérivée de
  `draft.answers[position]`, `hint = questionnaire.questions.hint` sur la première question
  seulement) ; `ProgressBar` et zone `aria-live="polite" aria-atomic` annonçant
  `questionnaire.questions.progress` ; `onChange` → `dispatch(answer)` ; `onCommit` →
  `answer` puis `next` ; sur la dernière question, `next` navigue vers `/questionnaire/fin`
  (`isCompleted`) et le bouton d'avancement affiche `questionnaire.questions.finish` ; focus
  posé sur l'énoncé via `headingRef` à chaque changement de position ; garde `requiredStep`
  (déclenche `start()` si `choice` complet et aucun brouillon) ; Précédent / Suivant /
  Modifier sont ajoutés en US2 et US4
- [ ] T036 [US1] Écrire `src/app/questionnaire/fin/page.tsx` (étape `end`) : titre
  `questionnaire.end.title`, `questionnaire.end.intro`, `AnswerSummary` (`items` =
  `summarize(draft, bank, selection).themes`, `minReliable = MIN_THEME_QUESTIONS`),
  `questionnaire.end.totals`, lien `questionnaire.end.results` (`<a href={resultHref}>`,
  jamais `router.push`, R10) ; le brouillon n'est pas effacé (FR-026) ; garde `requiredStep` ;
  l'avertissement et « Revenir aux questions » sont ajoutés en US2 (T044)
- [ ] T037 [P] [US1] Écrire `src/app/resultats/page.tsx` (page de garde, R11) : `<h1>`
  `results.title`, paragraphe `results.soon`, lien `results.backToQuestionnaire` vers
  `/questionnaire` ; aucune lecture du fragment, aucun composant client
- [ ] T038 [US1] Modifier `src/app/page.tsx` (accueil, serveur) : le bouton `home.cta`
  devient un lien `Button`/`Link` vers `/questionnaire` actif quand
  `loadRegistry().current > 0` (import de `@/lib/dataset`, lecture au build), sinon
  désactivé avec `home.ctaSoon` (comportement actuel) ; ajouter un lien explicite vers
  `/methodologie` dans le corps de la page (FR-001, en plus de la navigation du `PageShell`)
  avec une clé `home.methodology` ajoutée à `fr.json` ; mettre à jour `e2e/home.spec.ts` si
  un test en dépend
- [ ] T039 [US1] Exécuter `pnpm build && pnpm e2e -- e2e/questionnaire.spec.ts` et corriger
  jusqu'au vert des tests T030 ; vérifier dans la sortie du build que la page
  `/questionnaire` reste ≤ 200 ko compressés hors données (plan § Performance Goals)

**Checkpoint**: US1 livrable seule : parcours court et complet de bout en bout, lien de
résultats décodable, page de garde, accueil actif dès qu'une version est publiée.

---

## Phase 4: User Story 2 - Naviguer, passer et corriger ses réponses (Priority: P2)

**Goal**: passer, revenir en arrière (bouton de l'interface et bouton précédent du
navigateur), corriger une réponse, avancer jusqu'à la première question non traitée,
avertissement de fiabilité sur l'écran de fin sans blocage.

**Independent Test**: passer q1, répondre q2, revenir à q1 (« passée » présélectionnée),
choisir +1, Suivant → q2 avec sa réponse ; terminer en ayant passé toutes les questions d'un
sujet clé → avertissement nommant le sujet, « Voir mes résultats » actif ; `page.goBack()`
depuis q3 affiche q2 ; depuis q1 revient à `/questionnaire/mode`.

### Tests pour User Story 2

- [ ] T040 [P] [US2] Écrire `src/lib/questionnaire/history.test.ts` (jsdom) pour le hook
  `useQuestionHistory(position, onPopPosition)` : `replaceState({ radar: { position } })` au
  montage ; `pushState` à chaque nouvelle position initiée par l'interface, URL inchangée ;
  un événement `popstate` avec `state.radar.position` appelle `onPopPosition(position)` sans
  nouveau `pushState` ; un `popstate` sans `radar` est ignoré
- [ ] T041 [P] [US2] Ajouter à `e2e/questionnaire.spec.ts` les tests « passer, précédent,
  corriger » (progression cohérente, Suivant actif seulement avec une réponse ou « passée »,
  réponse précédente présélectionnée, avancer jusqu'à la première non traitée),
  « avertissement de fin » (toutes les questions d'un sujet clé passées →
  `questionnaire.end.warning.title` visible et le sujet nommé ; « Voir mes résultats » actif ;
  « Revenir aux questions » affiche la dernière question avec ses réponses), « toutes
  passées » (avertissement pour chaque sujet clé, accès aux résultats possible) et « bouton
  précédent du navigateur » (q3 → `goBack` → q2 réponses intactes ; `goBack` depuis q1 →
  `/questionnaire/mode`)

### Implementation pour User Story 2

- [ ] T042 [US2] Écrire `src/lib/questionnaire/history.ts` ('use client') : hook
  `useQuestionHistory` selon [contracts/routes-and-state.md](contracts/routes-and-state.md)
  § Historique (R2) ; aucune modification d'URL
- [ ] T043 [US2] Compléter `src/app/questionnaire/questions/page.tsx` : bouton
  `questionnaire.questions.previous` (`Button` secondaire, désactivé si `position = 0`,
  `dispatch(previous)`), bouton `questionnaire.questions.next` (actif si
  `answers[position] ≠ 'unanswered'`, `dispatch(next)` ; libellé `finish` sur la dernière),
  `useQuestionHistory(draft.position, (p) => dispatch(goTo p))` ; la valeur `'skipped'`
  passe par l'option « Passer » de `LikertChoice` (`onCommit('skipped')` → `answer` puis
  `next`) ; disposition à 320 px : options, Passer, Précédent, Suivant et progression visibles
  sans défilement horizontal
- [ ] T044 [US2] Compléter `src/app/questionnaire/fin/page.tsx` : si `summary.warning`,
  `Notice` ton `warning`, `role="alert"`, titre `questionnaire.end.warning.title`, texte
  `questionnaire.end.warning.description` ({min} = `MIN_THEME_QUESTIONS`, {themes} =
  libellés non fiables joints par `useFormatter().list`) ; bouton `questionnaire.end.back`
  (`dispatch(goTo(N − 1))` puis `router.push('/questionnaire/questions')`) ; le résumé est
  recalculé à chaque rendu depuis `draft` (cas limite « revient sur l'écran de fin »)
- [ ] T045 [US2] Exécuter `pnpm build && pnpm e2e -- e2e/questionnaire.spec.ts` et corriger
  jusqu'au vert des tests T041 sans régression des tests US1

**Checkpoint**: US1 et US2 fonctionnent ; la navigation ne perd jamais une réponse.

---

## Phase 5: User Story 3 - Reprendre un questionnaire interrompu (Priority: P3)

**Goal**: persistance sur l'appareil dès la première question et après chaque action ;
proposition de reprise à l'accueil (reprendre, recommencer, effacer) avec mode, avancement et
date ; variante « version changée » ; avertissement si le stockage est indisponible ; dernier
état gagnant entre deux onglets.

**Independent Test**: répondre à 10 questions, recharger, revenir sur `/` → carte « 10 / 25 »
→ Reprendre affiche la question 11 avec les 10 réponses intactes ; Effacer après confirmation
vide `localStorage.getItem('radar-questionnaire')` et l'accueil n'a plus de carte.

### Tests pour User Story 3

- [ ] T046 [P] [US3] Ajouter à `src/lib/questionnaire/store.test.tsx` : aucune écriture avant
  `start` ; écriture complète après `start`, `answer`, `next`, `previous`, `goTo` ; aucune
  écriture et `storage = 'unavailable'` quand `probeStorage` échoue, parcours fonctionnel en
  mémoire ; au montage avec un brouillon valide stocké et `bankVersion = bank.version`, le
  brouillon est repris ; un événement `storage` portant un `updatedAt` plus récent déclenche
  `resume`, plus ancien est ignoré ; `reset` et `clear` effacent la clé
- [ ] T047 [P] [US3] Écrire `src/app/ResumePrompt.test.tsx` (jsdom, fixtures) : rien n'est
  rendu sans brouillon ; `ResumeCard` rendue avec « 10 / 25 », le mode et la date formatée ;
  variante « version changée » quand `registry.current ≠ draft.bankVersion` ; Recommencer et
  Effacer ouvrent `ConfirmDialog` ; confirmer Effacer appelle `clearDraft` ; annuler ne change
  rien
- [ ] T048 [P] [US3] Ajouter à `e2e/questionnaire.spec.ts` les tests « reprise » (10 réponses,
  `page.reload()`, `/`, carte « 10 / 25 », Reprendre → question 11, les 10 réponses intactes
  par Précédent, même liste d'énoncés), « effacer » (Effacer → confirmer → clé absente, accueil
  sans carte), « recommencer » (Recommencer → confirmer → écran sujets, clé absente),
  « version changée » (brouillon `bankVersion: 1` injecté par `addInitScript`, registre servi
  `current: 2` → carte sans Reprendre ; annuler Recommencer laisse la clé intacte), « stockage
  indisponible » (`localStorage.setItem` remplacé par une fonction qui lève via
  `addInitScript` → `Notice` FR-025 visible et parcours court complet possible), « fermeture
  avant la première question » (quitter sur `/questionnaire/mode` → aucune clé écrite)

### Implementation pour User Story 3

- [ ] T049 [US3] Compléter `src/lib/questionnaire/store.tsx` : lecture initiale du brouillon
  via `useSyncExternalStore(subscribeDraft, readDraft, () => null)` (instantané serveur
  `null`, aucun texte dépendant du stockage dans le HTML statique) ; `probeStorage` au premier
  `start` ou `resume` → `storage` ; `writeDraft` après chaque action qui écrit si
  `'available'` ; `clearDraft` sur `reset` et `clear` ; adoption d'un brouillon plus récent
  venu d'un autre onglet (`resume`) ; `resume` refusé si `bankVersion ≠ bank.version` ou
  longueur incohérente (le brouillon reste stocké pour l'accueil, FR-024)
- [ ] T050 [US3] Compléter `src/app/questionnaire/questions/page.tsx` : `Notice` ton `info`
  `questionnaire.questions.storageUnavailable` quand `storage = 'unavailable'` (FR-025),
  affiché au-dessus de la première question et conservé sur les suivantes
- [ ] T051 [US3] Écrire `src/app/ResumePrompt.tsx` ('use client') : lit le brouillon par
  `useSyncExternalStore`, charge le registre par `loadRegistry` (état `unavailable` en cas
  d'échec → rien de rendu), dérive `resumeInfoFrom`, rend `ResumeCard` (`updatedAt` formaté
  par `useFormatter().dateTime`, libellés `home.resume.*`) ; Reprendre →
  `router.push('/questionnaire/questions')` ; Recommencer → `ConfirmDialog`
  `questionnaire.confirm.restart.*` puis `clearDraft` et `router.push('/questionnaire')` ;
  Effacer → `ConfirmDialog` `questionnaire.confirm.clear.*` puis `clearDraft` (FR-023,
  FR-026) ; variante `version-changed` sans Reprendre (FR-024)
- [ ] T052 [US3] Intégrer `<ResumePrompt />` dans `src/app/page.tsx` au-dessus du bouton de
  démarrage (composant client dans une page serveur) et vérifier qu'aucun texte de reprise
  n'apparaît dans le HTML exporté (`grep -c "Questionnaire en cours" out/index.html` = 0)
- [ ] T053 [US3] Exécuter `pnpm build && pnpm e2e -- e2e/questionnaire.spec.ts` et corriger
  jusqu'au vert des tests T048 sans régression

**Checkpoint**: une interruption à n'importe quel moment après la première question est
reprise à l'identique ; l'effacement est complet et confirmé.

---

## Phase 6: User Story 4 - Changer de sujets clés ou de mode en cours de route (Priority: P4)

**Goal**: depuis une question, demander à modifier ses sujets ou son mode ; confirmation
explicite avant toute perte ; présélection conservée ; revalidation du même triplet sans
confirmation reprend le questionnaire en cours.

**Independent Test**: 5 réponses → Modifier mes sujets → Annuler (q6 intacte) → Modifier →
Confirmer → écran sujets présélectionné → changer un sujet → Continuer → mode → Commencer →
« 1 / N » et réponses vides ; revalider le même triplet sans confirmer → question 6.

### Tests pour User Story 4

- [ ] T054 [P] [US4] Ajouter à `e2e/questionnaire.spec.ts` les tests « changer de sujets »
  (5 réponses, Modifier mes sujets → Annuler → même question et réponses intactes ; Modifier →
  Confirmer → écran sujets avec la sélection précédente présélectionnée, clé de stockage
  absente ; nouveau triplet → « 1 / N » et aucune réponse), « changer de mode » (idem via
  Modifier le mode → écran mode présélectionné) et « revalidation identique » (bouton
  précédent du navigateur jusqu'à `/questionnaire`, même sujets, même mode, Commencer →
  question 6 avec ses 5 réponses, sans confirmation) et « triplet différent avec brouillon »
  (Commencer avec un autre mode sans passer par Modifier → `ConfirmDialog`
  `questionnaire.confirm.change.*` ; annuler conserve le brouillon)

### Implementation pour User Story 4

- [ ] T055 [US4] Compléter `src/app/questionnaire/questions/page.tsx` : boutons ghost
  `questionnaire.questions.changeThemes` et `questionnaire.questions.changeMode` ouvrant
  `ConfirmDialog` (`questionnaire.confirm.change.*`, `destructive`) ; Confirmer →
  `dispatch(reset)` (le `Choice` garde `priorities` et `mode`, R13) puis `router.push` vers
  `/questionnaire` ou `/questionnaire/mode` ; Annuler → fermeture, focus rendu au déclencheur,
  rien ne change
- [ ] T056 [US4] Compléter `src/app/questionnaire/page.tsx` et
  `src/app/questionnaire/mode/page.tsx` : présélection depuis `choice` (ou, si `choice` est
  vide et qu'un brouillon existe, depuis `draft.priorities` / `draft.mode`) ; sur
  `start() = 'needs-confirmation'`, ouvrir `ConfirmDialog` `questionnaire.confirm.change.*`
  puis `confirmStart()` et naviguer ; sur `'resumed'`, naviguer directement vers la position
  mémorisée ; aucune navigation vers `/questionnaire` ou `/questionnaire/mode` n'efface le
  brouillon
- [ ] T057 [US4] Exécuter `pnpm build && pnpm e2e -- e2e/questionnaire.spec.ts` et corriger
  jusqu'au vert des tests T054 sans régression

**Checkpoint**: les quatre stories passent ; aucune réponse n'est perdue sans confirmation.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: accessibilité clavier de bout en bout, vérification complète, documentation.

- [ ] T058 [P] Ajouter à `e2e/questionnaire.spec.ts` le test « clavier seul » (SC-005) :
  parcours court entièrement au clavier (Tab, flèches, Entrée) ; le focus n'est jamais sur
  `body` ; après Entrée sur une option, le focus est sur l'énoncé suivant ; la zone
  `aria-live` contient « Question n sur N » ; et le test « 320 px » (SC-004) : viewport
  320 × 640 sur chaque étape, `document.documentElement.scrollWidth ≤ 320`, chaque option,
  Passer, Précédent, Suivant a une boîte ≥ 44 × 44 px
- [ ] T059 [P] Ajouter une vérification a11y automatisée (SC-006) dans
  `e2e/questionnaire.spec.ts` si `@axe-core/playwright` est déjà présent dans
  `package.json` ; sinon, s'appuyer sur les stories (projets `storybook` et
  `storybook-sombre`) et consigner dans le test un commentaire renvoyant à cette couverture ;
  n'ajouter aucune dépendance sans l'accord du propriétaire
- [ ] T060 [P] Écrire `src/lib/questionnaire/README.md` : rôle du module (hors `src/core`,
  hors `src/ui`), schéma du brouillon et de la clé `radar-questionnaire`, diagramme d'états
  de [data-model.md](data-model.md) § 4, point d'extension `draftFromResultState` réservé à
  la 005 (R14), lien vers les contrats de la 004
- [ ] T061 [P] Vérifier que `.github/workflows/*.yml` exécute déjà `pnpm e2e` sur Chromium
  après `pnpm build` (socle 001) et qu'aucun ajout n'est nécessaire pour
  `e2e/questionnaire.spec.ts` ; sinon ajouter l'étape manquante
- [ ] T062 Exécuter `pnpm verify` (lint, typecheck, `data:validate`, tests unitaires et
  stories, build Storybook, build Next, e2e) et corriger jusqu'au vert ; confirmer
  `git diff --stat main -- src/core` vide
- [ ] T063 Vérifications manuelles du [quickstart](quickstart.md) § 4, à faire par le
  propriétaire et consigner le résultat dans `specs/004-parcours-questionnaire/quickstart.md`
  (section « Résultats ») : 320 px sur chaque étape, apparence sombre (contraste des puces
  « sujet clé » et de l'avertissement), taille de `main.json` ≤ 300 ko en prévisualisation,
  lecture VoiceOver d'une question

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)** : aucune dépendance ; T002 et T003 en parallèle après T001.
- **Foundational (Phase 2)** : T004 (types) d'abord ; puis T005–T018 en parallèle (paires
  test → implémentation : T005→T006, T007→T008, T009→T010, T011→T012, T013→T014, T015→T016,
  T017→T018) ; T019–T025 (composants) en parallèle et indépendants des modules ; T026 après
  T020–T025 ; T027 indépendant. **Bloque toutes les stories.**
- **US1 (Phase 3)** : après la Phase 2 ; T028, T029, T030 en parallèle puis T031 → T032 →
  T033/T034/T035/T036 (T037 et T038 en parallèle dès T031) → T039.
- **US2 (Phase 4)**, **US3 (Phase 5)**, **US4 (Phase 6)** : chacune après US1 ; indépendantes
  entre elles **mais** elles modifient toutes `src/app/questionnaire/questions/page.tsx` et
  `store.tsx` : les exécuter séquentiellement sur une même branche, ou en parallèle sur des
  branches distinctes avec fusion attentive.
- **Polish (Phase 7)** : après toutes les stories retenues.

### User Story Dependencies

- **US1 (P1)** : dépend de la Phase 2 seulement ; MVP autonome.
- **US2 (P2)** : étend la page questions et l'écran de fin de US1 ; aucune dépendance sur US3
  ni US4.
- **US3 (P3)** : étend le fournisseur de US1 (persistance) et l'accueil ; aucune dépendance
  sur US2 ni US4 (la reprise fonctionne sans navigation arrière).
- **US4 (P4)** : s'appuie sur `start()` / `confirmStart()` de US1 et sur `ConfirmDialog` ; la
  suppression du brouillon stocké sur `reset` est testée en US3 mais le code est dans
  `store.tsx` dès T031 (`clearDraft` sur `reset`/`clear` ajouté en T049).

### Within Each User Story

- Tests écrits et **rouges** avant l'implémentation qu'ils couvrent (e2e : rouges tant que les
  pages n'existent pas).
- Modules `src/lib` avant pages `src/app` ; fournisseur avant pages ; pages avant exécution e2e.
- Une story est terminée quand ses tests e2e et unitaires sont verts sans régression.

### Parallel Opportunities

- Phase 2 : jusqu'à 7 paires de modules + 7 composants en parallèle (fichiers distincts).
- US1 : fixtures e2e, test du store et scénarios e2e en parallèle ; page de garde et accueil
  en parallèle des étapes.
- US2/US3/US4 : les tests (T040, T041, T046, T047, T048, T054) peuvent être écrits en parallèle
  dès la fin de US1.
- Phase 7 : T058–T061 en parallèle.

---

## Parallel Example: Phase 2

```bash
# Modules d'état (après T004), chaque paire test → implémentation :
Task: "T005 bank-view.test.ts"   → "T006 bank-view.ts"
Task: "T007 reducer.test.ts"     → "T008 reducer.ts"
Task: "T009 storage.test.ts"     → "T010 storage.ts"
Task: "T011 summary.test.ts"     → "T012 summary.ts"
Task: "T013 resume-info.test.ts" → "T014 resume-info.ts"
Task: "T015 guards.test.ts"      → "T016 guards.ts"
Task: "T017 dataset-client.test.ts" → "T018 dataset-client.ts"

# Composants, en parallèle des modules :
Task: "T019 LikertChoice.onCommit"  Task: "T020 Notice"       Task: "T021 ConfirmDialog"
Task: "T022 ModeChoice"             Task: "T023 QuestionCard" Task: "T024 ResumeCard"
Task: "T025 AnswerSummary"          Task: "T027 ThemePicker descriptions"
```

## Parallel Example: User Story 1

```bash
# Dès la fin de la Phase 2 :
Task: "T028 e2e/fixtures/published.ts"
Task: "T029 src/lib/questionnaire/store.test.tsx"
Task: "T030 e2e/questionnaire.spec.ts (scénarios US1)"
# Puis T031 (store) → T032 (layout) → T033, T034, T035, T036 ; T037 et T038 en parallèle.
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1 (T001–T003) puis Phase 2 (T004–T027) : fondations et composants testés.
2. Phase 3 (T028–T039) : parcours nominal court et complet, lien de résultats, page de garde,
   accueil actif.
3. **STOP et valider** : `pnpm build && pnpm e2e -- e2e/questionnaire.spec.ts` verts ;
   `pnpm vitest run src/lib src/ui </dev/null` vert.
4. Déployer en prévisualisation : utilisable dès qu'une version de banque est publiée.

### Incremental Delivery

1. Setup + Foundational → fondations prêtes (composants visibles dans Storybook).
2. US1 → MVP testable de bout en bout.
3. US2 → navigation sûre (passer, précédent, corriger, avertissement).
4. US3 → reprise sur l'appareil, effacement, version changée.
5. US4 → changement de sujets ou de mode avec confirmation.
6. Polish → clavier, 320 px, `pnpm verify`, documentation.

### Parallel Team Strategy

Avec plusieurs intervenants : Phase 1 et T004 ensemble ; puis un intervenant sur les modules
d'état (T005–T018), un sur les composants (T019–T027). US1 ensuite à deux (fixtures/tests e2e
contre fournisseur/pages). US2, US3 et US4 touchent les mêmes pages : une branche par story et
fusion dans l'ordre P2 → P3 → P4.

---

## Notes

- Les textes du contrat i18n sont des propositions : les ajuster ne change que `fr.json`.
- `MIN_PRIORITIES`, `MAX_PRIORITIES`, `TARGET_COUNT`, `MIN_THEME_QUESTIONS` viennent de
  `@/core` ; ne jamais redéclarer 3, 5, 25, 100 ou 2 dans `src/lib` ou `src/app`.
- `src/core` est en lecture seule pour cette feature ; toute règle manquante remonte à la 003.
- Le pré-remplissage depuis un état de résultats (`draftFromResultState`) est réservé à la
  005 (R14) et n'est pas une tâche de cette liste.
- Commiter après chaque tâche ou groupe logique ; s'arrêter à chaque checkpoint pour valider
  la story indépendamment.
