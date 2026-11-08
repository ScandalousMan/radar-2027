# Contrat : API publique de `src/core` (bank, selection, score, codec)

Ce contrat est celui que consomment la 004 (parcours : sélection, état, encodage) et la 005
(résultats : décodage, score, exemples). Tout est exporté depuis `src/core/index.ts` ; les
sous-chemins (`@/core/selection`, …) restent importables. Aucune fonction n'a d'effet de bord,
n'accepte de promesse ni ne lit l'environnement. Les types détaillés sont dans
[data-model.md](../data-model.md).

## Types partagés (`src/core/types.ts`)

```ts
export type Mode = 'full' | 'short';
export type Answer = ScaleValue | 'skipped' | 'unanswered';
export type ResultState = {
  readonly bankVersion: number;          // numéro publié, ≥ 1
  readonly mode: Mode;
  readonly priorities: readonly string[]; // 3 à 5 identifiants de thème
  readonly answers: readonly Answer[];    // ordre de présentation
};
export const TARGET_COUNT: Readonly<Record<Mode, number>>;   // { full: 100, short: 25 }
export const MIN_PRIORITIES: 3; export const MAX_PRIORITIES: 5;
export type Band = 'very-aligned' | 'rather-aligned' | 'mixed' | 'distant';
export type RejectionReason = 'unsupported-link-version' | 'invalid-content' | 'unknown-bank-version' | 'invalid-length' | 'invalid-checksum';
export type ExclusionReason = 'skipped' | 'unanswered' | 'unknown-position';
export type DecodeResult<T> = { ok: true; value: T } | { ok: false; reason: RejectionReason };
```

## Banque (`src/core/bank`)

```ts
export function bankFromDataset(ds: MainDataset): BankVersion;   // lève BankError si invariants violés (jamais sur un jeu validé par la 002)
export class BankError extends Error { code: 'too-many-themes' | 'duplicate-theme' | 'bad-theme-ref' | 'misaligned-positions' | 'too-many-themes-for-quotas' }
export function normalizePriorities(bank: BankVersion, ids: readonly string[]): readonly string[]; // distinct, ordre canonique ; lève StateError
```

## Sélection (`src/core/selection`)

```ts
export function computeQuotas(bank: BankVersion, mode: Mode, priorityIndices: readonly number[]): readonly number[]; // Σ = N (FR-021) ; lève BankError('too-many-themes-for-quotas') si les planchers débordent N (T > 20 en mode court)
export function selectQuestions(bank: BankVersion, mode: Mode, priorities: readonly string[]): Selection;            // FR-018 → FR-027
```

Garanties : pure et idempotente ; `items.length = min(N, bank.questions.length)` ; identifiants
distincts ; `items[i].position = i` ; indépendante de toute réponse. Lève `StateError`
(`'bad-priorities'`) si moins de 3, plus de 5, doublon ou identifiant inconnu.

## Score (`src/core/score`)

```ts
export function scoreCandidates(input: {
  bank: BankVersion; selection: Selection; state: ResultState; versionCount: number;
}): Scoreboard;                                                   // FR-001 → FR-017
export const EXAMPLE_A: ScoreExample; export const EXAMPLE_B: ScoreExample;  // fixtures de la spec (SC-001)
export type ScoreExample = { title: string; bank: BankVersion; state: ResultState; expected: { /* valeurs attendues en % et ratios */ } };
```

Garanties : `ranked` trié selon FR-012 ; aucun `ranked[i].global.percent >
ranked[i].priority.percent` ; `band` dérivée de `global.percent` ; `insufficient` contient
tout candidat à couverture nulle, indéfinie ou < 60 %, ou à `P` indéfini ; chaque
`CandidateScore.questions` a exactement `selection.items.length` entrées. Lève `StateError` si
`state` ne correspond pas à `selection` (longueur) ou `bank.version ≠ state.bankVersion`. Le
nombre de sujets n'est **pas** borné ici (1 à `T` identifiants connus) : les exemples A et B de
la spec n'en ont qu'un ; la borne 3 à 5 est celle de `selectQuestions` et `encodeFragment`.

## Codec (`src/core/codec`)

```ts
export function encodeFragment(state: ResultState, bank: BankVersion): string;  // '#1.<charge>' ; lève StateError (FR-036) ; la 004 passe la banque de la version COURANTE (bank.version = registry.current, FR-038)
export function decodeHeader(fragment: string, versionCount: number): DecodeResult<DecodedHeader>;   // R5 : sans banque
export function decodeFragment(fragment: string, bank: BankVersion): DecodeResult<ResultState>;      // vérifications FR-033 dans l'ordre
export function expectedPayloadLength(selectionSize: number): number;             // 5 + ceil(3n/8) + 1 (FR-032)
export const FRAGMENT_FULL_EXAMPLE: FragmentFixture; export const FRAGMENT_SHORT_EXAMPLE: FragmentFixture; // spec US3 scénarios 1 et 2
```

Comportements :

| Entrée | Sortie |
|---|---|
| fragment `''` ou `'#'` | `{ ok: false, reason: 'unsupported-link-version' }` ; l'appelant choisit de n'afficher aucune erreur dans ce cas (Edge case « fragment absent ») |
| fragment avec ou sans `#` initial | accepté dans les deux formes ; l'encodeur produit toujours `#1.…` |
| préfixe ≠ `1.` | `unsupported-link-version` |
| caractère hors alphabet, `=`, bits de queue non nuls | `invalid-content` |
| octet de version + 1 > `versionCount` ou `bank.version` | `unknown-bank-version` |
| bits réservés ≠ 0, masque avec < 3 ou > 5 bits, bit de thème ≥ `T` | `invalid-content` |
| longueur ≠ `expectedPayloadLength(selection.length)` | `invalid-length` |
| CRC-8 incorrect | `invalid-checksum` |
| code de réponse 7, bits de bourrage ≠ 0 | `invalid-content` |

`decodeFragment(fragment, bank)` exige `bank.version = octet + 1` : sinon il retourne
`unknown-bank-version` (la banque passée n'est pas celle du lien). Flux attendu côté 005 :

```ts
const header = decodeHeader(hash, registry.current);
if (!header.ok) return showRejection(header.reason);
const ds = header.value.bankVersion === registry.current ? currentMain : await fetchMain(header.value.bankVersion);
const bank = bankFromDataset(MainDatasetSchema.parse(ds));
const decoded = decodeFragment(hash, bank);
if (!decoded.ok) return showRejection(decoded.reason);
const selection = selectQuestions(bank, decoded.value.mode, decoded.value.priorities);
const board = scoreCandidates({ bank, selection, state: decoded.value, versionCount: registry.current });
```

## Erreurs de programmation

`StateError extends Error { code: 'bad-priorities' | 'bad-mode' | 'bad-answer-count' |
'bad-answer' | 'version-mismatch' }`. Elles signalent un appel incorrect (état construit par
l'application), jamais une donnée venue d'un lien : un lien invalide produit toujours un
`DecodeResult` avec `ok: false`.

## Stabilité

Le format de lien `1.` et l'ordre des vérifications sont gelés par ce contrat ; toute évolution
incompatible passe par un nouveau préfixe (`2.`) et conserve le décodage de `1.`. Les
identifiants typés (`Band`, `RejectionReason`, `ExclusionReason`, `'others'`) sont les clés
que les fonctionnalités d'interface traduisent ; les renommer est une rupture de contrat.
