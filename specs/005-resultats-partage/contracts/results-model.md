# Contrat : `src/lib/results`

Module sans React ni DOM (hors `history.ts` et `share.ts`, qui reçoivent leurs dépendances
navigateur en paramètre pour être testables). N'importe de `@/core` que des fonctions et types
publics du contrat `core-api`.

## `load.ts`

```ts
export type PageState =
  | { status: 'loading' }
  | { status: 'no-fragment' }
  | { status: 'no-version' }
  | { status: 'invalid'; reason: Exclude<RejectionReason, 'unknown-bank-version'> }
  | { status: 'unknown-version' }
  | { status: 'error'; reason: 'network' | 'invalid-data' | 'internal' }
  | { status: 'ready'; data: ReadyData };

export type ReadyData = {
  state: ResultState; board: Scoreboard; bank: BankVersion;
  themes: readonly { id: string; label: string; index: number }[];
  prior: null | { publishedAt: string; withdrawnIds: readonly string[] };
  currentBank: QuestionnaireBank;   // projection de la version courante (= celle du lien si v = current) : « Modifier » et « Refaire » (R7)
  shareUrl: string;            // origin + '/resultats' + '#1.…' (fragment normalisé, jamais de query)
};

export function loadResults(hash: string, origin: string, fetcher?: typeof fetch): Promise<PageState>;
```

Ordre (R2) : fragment vide ⇒ `no-fragment` ; registre ; `current = 0` ⇒ `no-version` ;
`decodeHeader` ; `loadMain(v)` (+ `loadMain(current)` si `v < current`) ; `decodeFragment` ;
`selectQuestions` ; `scoreCandidates`. Ne lève jamais. Si `decodeFragment` renvoie
`unknown-bank-version` malgré un en-tête accepté (banque incohérente), l'état est
`error: internal`, jamais `invalid`.

## `view-model.ts`

```ts
export function resultsView(data: ReadyData): ResultsView;                         // data-model § 2
export function candidateSheet(data: ReadyData, candidateId: string): CandidateSheet | null; // § 4
export function comparisonView(data: ReadyData, ids: readonly string[]): ComparisonView;     // § 7 ; 2 ≤ ids ≤ 3
export function orderedThemeKeys(data: ReadyData): readonly ('others' | string)[];           // prioritaires puis autres
```

Garanties testées : pour `EXAMPLE_A` et `EXAMPLE_B`, rangs, pourcentages, bandes, ex æquo et
données insuffisantes égaux aux valeurs attendues des exemples (SC-001) ; aucune ligne de
classement sans rang ; `percent` jamais recalculé (identique à `global.percent`) ; chaque
question répondue apparaît exactement une fois dans la fiche.

## `agreement.ts`

```ts
export type AgreementLevel = 'identical' | 'close' | 'intermediate' | 'distant' | 'opposite';
export function agreementOf(concordance: Ratio): AgreementLevel;   // 1, 3/4, 1/2, 1/4, 0 ; autre valeur ⇒ erreur de programmation
```

## `history.ts`

```ts
export function readView(state: unknown): ViewState;                 // défaut { view: 'ranking' }
export function pushView(view: ViewState, h?: History): void;        // URL inchangée
export function replaceView(view: ViewState, h?: History): void;
```

## `share.ts`

```ts
export type CopyOutcome = 'copied' | 'manual';
export function copyLink(url: string, clipboard?: Pick<Clipboard, 'writeText'> | null): Promise<CopyOutcome>;
export function canShareNatively(nav?: Pick<Navigator, 'share'> | null): boolean;
export function shareNatively(payload: { title: string; text: string; url: string }, nav?: Pick<Navigator, 'share'>): Promise<'shared' | 'cancelled'>;
```

`copyLink` ne lève jamais ; toute erreur ⇒ `'manual'`.
