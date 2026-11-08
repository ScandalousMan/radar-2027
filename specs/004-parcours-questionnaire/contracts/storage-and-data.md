# Contrat : stockage du brouillon, chargeur client du jeu publié, remise aux résultats

## 1. Stockage local (`src/lib/questionnaire/storage.ts`)

```ts
export const DRAFT_STORAGE_KEY = 'radar-questionnaire';
export const DRAFT_FORMAT = 1;

export const DraftSchema: z.ZodType<Draft>;                 // relecture stricte (data-model § 5)
export function readDraft(storage?: StorageLike | null): Draft | null;   // null si absent, invalide, stockage indisponible
export function writeDraft(draft: Draft, storage?: StorageLike | null): boolean; // false si indisponible
export function clearDraft(storage?: StorageLike | null): boolean;
export function probeStorage(storage?: StorageLike | null): StorageStatus;  // écriture + suppression d'une clé d'essai
export function subscribeDraft(listener: () => void): () => void;           // événement `storage` filtré sur la clé (multi-onglets)
```

`StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>` (même convention que
`src/lib/appearance.ts`) ; par défaut `window.localStorage` entouré de `try/catch`. Aucune
autre clé n'est écrite par le parcours ; `radar-appearance` (001) reste indépendante.

Exemple de valeur stockée (mode court, 25 questions, 3 traitées) :

```json
{"format":1,"bankVersion":1,"mode":"short","priorities":["economie","sante","securite"],
 "answers":[2,"skipped",-1,"unanswered", "…21 × \"unanswered\""],"position":3,"updatedAt":"2026-11-08T17:42:10.000Z"}
```

## 2. Chargeur client (`src/lib/dataset-client.ts`)

```ts
export type DatasetClientError = { kind: 'network'; status?: number } | { kind: 'invalid'; issues: string };
export function loadRegistry(fetcher?: typeof fetch): Promise<VersionRegistry>;            // GET /data/versions.json
export function loadMain(version: number, fetcher?: typeof fetch): Promise<MainDataset>;   // GET /data/versions/<version>/main.json
export function clearDatasetCache(): void;                                                 // tests
```

Garanties : URL relatives à l'origine, sans paramètre ni en-tête ajouté ; `cache: 'force-cache'`
pour `main.json` (fichiers immuables) et `'no-cache'` pour le registre ; validation par
`VersionRegistrySchema` / `MainDatasetSchema` ; erreurs typées, jamais de chaîne utilisateur.
Mémoïsation par version pour la durée de la page. La 005 utilise le même module pour une
version antérieure désignée par un lien.

## 3. Projection (`src/lib/questionnaire/bank-view.ts`)

```ts
export function questionnaireBankFrom(main: MainDataset): QuestionnaireBank;   // bankFromDataset + thèmes avec description
export function selectionsFor(bank: QuestionnaireBank, priorities: readonly string[]): Record<Mode, Selection>; // R8
export function themesOf(bank: QuestionnaireBank, question: BankQuestion, priorities: readonly string[]): QuestionTheme[];
```

## 4. Résumé et remise aux résultats (`src/lib/questionnaire/summary.ts`)

```ts
export function summarize(draft: Draft, bank: QuestionnaireBank, selection: Selection): EndSummary;   // R9, MIN_THEME_QUESTIONS
export function resultStateFromDraft(draft: Draft, bank: QuestionnaireBank): ResultState;             // priorities normalisées, answers telles quelles
export function resultHref(draft: Draft, bank: QuestionnaireBank): string;                            // '/resultats' + encodeFragment(state, bank.bank)
```

Garanties : `resultStateFromDraft` ne lève pas pour un brouillon respectant les invariants
(sinon `StateError` du codec, erreur de programmation couverte par les tests) ;
`decodeFragment(resultHref(...).split('#')[1], bank.bank)` redonne exactement l'état (test).

## 5. Point d'extension pour la 005 (non implémenté par la 004, R14)

```ts
export function draftFromResultState(state: ResultState, bank: QuestionnaireBank, now: string): Draft;
// position = firstUnanswered ; exige state.bankVersion = bank.version (version courante) ;
// le report par identifiant depuis une version antérieure est à la charge de la 005.
```

## 6. Trafic réseau pendant le parcours (SC-008)

Seules requêtes autorisées : ressources statiques du site, `/data/versions.json`,
`/data/versions/<n>/main.json`. Aucune URL ne contient de sujet, mode, réponse ou position ;
aucun en-tête ni corps n'est envoyé. Vérifié par `e2e/questionnaire.spec.ts` (écoute de
`page.on('request')`).
