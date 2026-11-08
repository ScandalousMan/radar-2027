# Contrat : routes, fournisseur d'état et réducteur

Ce contrat lie les pages `src/app/questionnaire/**`, le module `src/lib/questionnaire` et la
005 (qui réutilise le chargeur client et, à terme, le pré-remplissage). Les règles métier
viennent de `@/core` ([core-api.md](../../003-domaine-score-selection-codec/contracts/core-api.md)).

## Routes (export statique)

| Route | Étape | Composant principal | Prérequis (garde) |
|---|---|---|---|
| `/` | accueil | `HomePage` (serveur) + `ResumePrompt` (client) | — |
| `/questionnaire` | `themes` | `ThemesStep` | banque chargée ; sinon état `loading` / `no-version` / `error` |
| `/questionnaire/mode` | `mode` | `ModeStep` | `choice.priorities` valide ou brouillon |
| `/questionnaire/questions` | `questions` | `QuestionsStep` | brouillon, ou `choice` complet (déclenche `start`) |
| `/questionnaire/fin` | `end` | `EndStep` | brouillon |
| `/resultats` | garde (R11) | `ResultsPlaceholder` | — ; remplacée par la 005 |

Garde : `requiredStep(route, state)` renvoie `null` (accès autorisé) ou la route de redirection ;
les pages appellent `router.replace(target)` dans un effet, sans message. Aucune route ne lit
ni n'écrit de query string ; seule `/resultats` reçoit un fragment.

## Fournisseur `QuestionnaireProvider` (`src/lib/questionnaire/store.tsx`)

Monté par `src/app/questionnaire/layout.tsx` ('use client'). Charge le jeu publié (R5), lit le
brouillon (R4), expose :

```ts
type LoadState =
  | { status: 'loading' }
  | { status: 'no-version' }                         // registre current = 0
  | { status: 'error'; reason: 'network' | 'invalid' } // fetch échoué ou schéma refusé
  | { status: 'ready'; bank: QuestionnaireBank; selections: Record<Mode, Selection> | null }; // selections dès que choice.priorities est valide

type QuestionnaireContext = {
  load: LoadState;
  choice: Choice;                                     // présélection non persistée
  draft: Draft | null;
  selection: Selection | null;                        // sélection du brouillon (mode + priorities du brouillon)
  storage: StorageStatus;
  setPriorities(ids: readonly string[]): void;        // normalise par normalizePriorities quand la banque est prête
  setMode(mode: Mode): void;
  start(): 'started' | 'resumed' | 'needs-confirmation'; // R13 : même triplet ⇒ resumed ; brouillon différent ⇒ needs-confirmation
  confirmStart(): void;                               // reset puis start
  dispatch(action: Action): void;                     // answer, next, previous, goTo, reset, clear
  resultHref: string | null;                          // '/resultats#1.…' quand draft existe (R10)
};

export function useQuestionnaire(): QuestionnaireContext; // lève hors du fournisseur
```

Comportements garantis :

- `now` des actions est fourni par le fournisseur (`new Date().toISOString()`), jamais par le
  réducteur.
- Après chaque action modifiant le brouillon : `writeDraft(draft)` si `storage = 'available'`.
- Événement `storage` sur la clé : si `updatedAt` de la valeur lue est postérieur, `resume`.
- `resultHref` = `'/resultats' + encodeFragment(resultStateFromDraft(draft, bank), bank.bank)`.

## Réducteur (`src/lib/questionnaire/reducer.ts`)

```ts
export function reduce(draft: Draft | null, action: Action, ctx: { selection: Selection | null }): Draft | null;
export function isCompleted(draft: Draft): boolean;     // position = N − 1 et action next reçue (signal géré par la vue via `next` retournant la même position)
export function firstUnanswered(draft: Draft): number;  // première position 'unanswered', sinon N − 1
```

Propriétés (fast-check) : conservation de la longueur, bornes de position, immutabilité des
réponses non visées, idempotence de `goTo`, `answer` hors position ignorée.

## Historique du navigateur (étape questions, R2)

- Montage : `history.replaceState({ radar: { position } }, '', location.href)`.
- Changement de position initié par l'interface : `history.pushState({ radar: { position } }, '', location.href)`.
- `popstate` avec `state.radar.position` défini : `dispatch({ type: 'goTo', position })` sans
  nouveau `pushState`.
- Quitter l'étape (fin, modification) : aucune manipulation supplémentaire.

## Accessibilité de l'étape questions

- Au changement de question : focus sur l'énoncé (`<h2 tabIndex={-1}>`), annonce
  `questionnaire.questions.progress` (« Question {n} sur {total} ») dans une zone
  `aria-live="polite"` `aria-atomic`.
- `LikertChoice` : `onChange` enregistre (`answer`), `onCommit` enregistre puis `next` (R7).
- « Suivant » (`Button`) : actif si `answers[position] ≠ 'unanswered'` ; « Précédent » : actif
  si `position > 0` ; « Passer » est l'option de `LikertChoice`.
- Lien Méthodologie du `PageShell` disponible sur tous les écrans (FR-019) ; le retour par le
  bouton précédent du navigateur retrouve le brouillon (persistance).

## Accueil

`HomePage` (serveur) : `loadRegistry().current > 0` ⇒ bouton « Commencer » actif vers
`/questionnaire` ; sinon inactif avec `home.ctaSoon` (comportement actuel). `ResumePrompt`
(client) lit le brouillon après montage (`useSyncExternalStore`, instantané serveur `null`) et
charge le registre pour établir `ResumeInfo.status` ; il rend `ResumeCard` ou rien.
