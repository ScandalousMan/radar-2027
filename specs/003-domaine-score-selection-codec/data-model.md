# Modèle de données : banque, état, sélection, score, charge

**Feature** : `003-domaine-score-selection-codec` · **Date** : 2026-11-08 · **Source** : [spec.md](spec.md) § Key Entities

Toutes les entités sont des valeurs TypeScript immuables (`readonly`) produites et consommées
par des fonctions pures de `src/core`. Rien n'est persisté par ce module : la seule forme
sérialisée est la **charge encodée** du fragment d'URL ([contracts/link-format.md](contracts/link-format.md)).
Les types du jeu publié (`MainDataset`, `PositionCell`, `ScaleValue`, `EvidenceCode`) viennent
de `src/core/dataset` (002) et ne sont pas redéfinis.

## 1. Constantes du domaine (`src/core/types.ts`)

| Nom | Valeur | Exigence |
|---|---|---|
| `TARGET_COUNT` | `{ full: 100, short: 25 }` | FR-019 |
| `QUOTA_FLOOR` | `{ full: 3, short: 1 }` | FR-021 |
| `PRIORITY_WEIGHT` / `OTHER_WEIGHT` | 3 / 1 | FR-006, FR-021 |
| `MIN_PRIORITIES` / `MAX_PRIORITIES` | 3 / 5 | FR-018, FR-036 |
| `MIN_THEME_QUESTIONS` | 2 | FR-004, FR-013 |
| `COVERAGE_THRESHOLD` | 60 (%) inclusif | FR-008 |
| `BANDS` | `≥ 80 very-aligned`, `60–79 rather-aligned`, `40–59 mixed`, `< 40 distant` | FR-014 |
| `LINK_FORMAT_VERSION` | `1` | FR-028 |
| `MAX_THEMES` (002) | 24 | masque 3 octets, FR-029 |
| `MAX_VERSIONS` (002) | 256 | 1 octet, FR-029 |

## 2. Rationnel exact (`src/core/ratio.ts`)

| Champ | Type | Règle |
|---|---|---|
| `num` | `bigint` | signé |
| `den` | `bigint` | > 0 ; fraction réduite (pgcd), `0` représenté `0/1` |

Opérations : `add`, `sub`, `mul`, `div`, `cmp` (produit en croix), `min`, `mean(list)`,
`weightedMean(pairs)`, `floorPercentSigned` ([−1, +1] → 0…100 par `(x + 1) / 2`),
`floorPercentUnit` ([0, 1] → 0…100), `toNumber`. Invariant testé par propriété :
`cmp(a, b)` cohérent avec `toNumber` hors des cas d'égalité exacte, et
`floorPercentSigned(1/4) = 62`, `floorPercentSigned(0) = 50`.

## 3. Version de banque (`src/core/bank/bank.ts`)

Vue dérivée d'un `MainDataset` (002 § 11) par `bankFromDataset(ds)`. Immuable.

| Champ | Type | Règle |
|---|---|---|
| `version` | entier ≥ 1 | numéro publié (`ds.version`) |
| `publishedAt` | date `YYYY-MM-DD` | pour l'indicateur « version antérieure » (FR-040) |
| `themes` | `readonly BankTheme[]` | ordre canonique, `themes[i].index = i`, `T = themes.length ≤ 24` |
| `themeIndexById` | `ReadonlyMap<string, number>` | |
| `questions` | `readonly BankQuestion[]` | triées par `id` (garantie 002), `discriminant` ∈ [0, 2] |
| `questionById` | `ReadonlyMap<string, BankQuestion>` | |
| `candidates` | `readonly BankCandidate[]` | candidats inclus, dans l'ordre du jeu |
| `positions` | `ReadonlyMap<candidateId, ReadonlyArray<PositionCell>>` | alignées sur `questions` ; `null` = inconnue |

`BankTheme = { id, label, index }` ; `BankQuestion = { id, text, themeIndices: readonly number[]
(1 ou 2), discriminant }` ; `BankCandidate = { id, name, party }`.

Le **thème principal** de la 002 (`themes[0]`) est une notion éditoriale ; il ne faut pas le
confondre avec le **thème d'ancrage** attribué par la sélection (§ 5), qui dépend des sujets
prioritaires du répondant.

Invariants (vérifiés par `bankFromDataset`, qui lève une `BankError` sinon, la 002 les
garantissant déjà) : `T ≤ 24` ; identifiants de thème uniques ; chaque `themeIndices` non vide,
sans doublon, dans `[0, T)` ; positions alignées.

## 4. État de résultat (`src/core/types.ts`)

Objet encodé dans le fragment ; partagé par 004 (reprise, partage) et 005 (décodage, score).

| Champ | Type | Règle |
|---|---|---|
| `bankVersion` | entier 1…256 | numéro publié ; codé `bankVersion − 1` (FR-029) |
| `mode` | `'full' \| 'short'` | FR-019 |
| `priorities` | `readonly string[]` | 3 à 5 identifiants de thème distincts, existant dans la version ; **ordre canonique** après normalisation (l'ensemble est ce qui compte) |
| `answers` | `readonly Answer[]` | une par question de la sélection, dans l'ordre de présentation (FR-026) ; longueur = taille de la sélection |

`Answer = ScaleValue | 'skipped' | 'unanswered'` ; code sur 3 bits : `unanswered = 0`,
`skipped = 1`, valeur `v` → `v + 4` (2…6), `7` invalide (FR-030).

Validité (`validateState(state, bank)` → `StateError | null`, FR-036) : version = `bank.version`,
mode connu, 3 à 5 sujets distincts connus, `answers.length = selectQuestions(…).length`,
chaque réponse dans le domaine.

## 5. Sélection (`src/core/selection`)

Résultat pur de `selectQuestions(bank, mode, priorities)`.

| Champ | Type | Règle |
|---|---|---|
| `mode`, `priorityIndices` | | entrées normalisées (indices canoniques croissants) |
| `quotas` | `readonly number[]` (longueur `T`) | FR-021 ; `Σ quotas = N` |
| `items` | `readonly SelectedQuestion[]` | ordre de **présentation** ; `items[i].position = i` (FR-026) ; `N` éléments ou toute la banque si plus petite (FR-019) ; identifiants distincts |

`SelectedQuestion = { question: BankQuestion; anchorThemeIndex: number; position: number;
pass: 1 | 2 }` : `anchorThemeIndex` est le thème au titre duquel la question a été retenue au
premier passage, ou son premier thème dans l'ordre de rotation si elle vient du second (FR-024) ;
`pass` sert aux tests et au diagnostic.

Invariants testés : somme des quotas (SC-004) ; distinctness ; alternance des thèmes d'ancrage
tant que deux thèmes restent (SC-006) ; les premières questions appartiennent aux thèmes
prioritaires en ordre canonique (US2 scénario 6) ; idempotence (US2 scénario 4) ; indépendance
vis-à-vis des réponses (la fonction ne les reçoit pas, FR-018).

## 6. Entrée et sortie du score (`src/core/score`)

### Entrée `ScoreInput`

| Champ | Type |
|---|---|
| `bank` | `BankVersion` |
| `selection` | `Selection` (doit provenir de `bank` et des mêmes `mode`/`priorities`) |
| `state` | `ResultState` (réponses) |
| `versionCount` | entier : nombre de versions publiées, pour `priorVersion` |

### Sortie `Scoreboard`

| Champ | Type | Règle |
|---|---|---|
| `ranked` | `readonly CandidateScore[]` | candidats classés, dans l'ordre FR-012 |
| `insufficient` | `readonly CandidateScore[]` | statut « données insuffisantes », ordre du jeu |
| `answeredCount` | entier | questions à réponse numérique (dénominateur de la couverture) |
| `priorVersion` | booléen | `bank.version < versionCount` (FR-040) |
| `bankPublishedAt` | date | pour l'affichage de FR-040 |

### `CandidateScore`

| Champ | Type | Règle |
|---|---|---|
| `candidate` | `BankCandidate` | |
| `status` | `'ranked' \| 'insufficient-data'` | FR-008 |
| `rank` | entier ≥ 1 ou `null` | ex æquo partagent le rang, saut ensuite (1, 1, 3) |
| `band` | `'very-aligned' \| 'rather-aligned' \| 'mixed' \| 'distant' \| null` | FR-014, d'après `global.percent` |
| `global` | `Score \| null` | `G = min(W, P)` (FR-010) ; `null` si insuffisant |
| `priority` | `Score \| null` | `P` (FR-005) |
| `weighted` | `Score \| null` | `W` (FR-006) |
| `coverage` | `Coverage \| null` | FR-007 ; `null` si aucune question répondue |
| `themes` | `readonly ThemeScore[]` | un par thème en mode complet ; thèmes prioritaires + pseudo-thème `others` en mode court (FR-013) |
| `questions` | `readonly QuestionScore[]` | une entrée par question de la sélection, ordre de présentation (FR-016) |

`Score = { ratio: Ratio; percent: number (0…100, tronqué); approx: number }` ;
`Coverage = { known: number; answered: number; ratio: Ratio; percent: number }` ;
`ThemeScore = { kind: 'theme'; themeIndex: number; themeId: string; priority: boolean; count:
number; score: Score | null } | { kind: 'others'; count: number; score: Score | null }` ;
`QuestionScore = { position: number; questionId: string; answer: Answer; position_candidate:
PositionCell } & ({ concordance: Ratio; level: EvidenceCode } | { excluded: 'skipped' |
'unanswered' | 'unknown-position' })`.

Règles de dérivation (toutes exactes, § 2) :

```text
s            = 1 − |u − c| / 2                                  (FR-001)
S_t          = mean(s des questions exploitables de t)          si count_t ≥ 2, sinon null (FR-004)
P            = mean(S_t définis, t prioritaire)                 null si aucun (FR-005)
W            = Σ w_t S_t / Σ w_t  sur les S_t définis            (FR-006 ; en mode court, « others » poids 1, FR-013)
couverture   = known / answered                                 null si answered = 0 (FR-007)
insuffisant  ⇔ couverture null ∨ couverture < 60 % ∨ P null      (FR-008, seuil inclusif à 60)
G            = min(W, P)                                        (FR-010), percent = floor((G+1)/2·100) (FR-011)
ordre        = G.percent ↓, P.ratio ↓, couverture.ratio ↓, id ↑  (FR-012)
```

## 7. Charge encodée et motifs de rejet (`src/core/codec`)

| Champ | Type | Règle |
|---|---|---|
| `bytes` | `Uint8Array` | `5 + ⌈3n/8⌉ + 1` octets (FR-032) |
| `text` | chaîne | base64url sans bourrage, préfixée `1.` → fragment `#1.<text>` (FR-028) |

Disposition : voir [contracts/link-format.md](contracts/link-format.md).

`RejectionReason = 'unsupported-link-version' | 'invalid-content' | 'unknown-bank-version' |
'invalid-length' | 'invalid-checksum'` (FR-034). `DecodeResult<T> = { ok: true; value: T } |
{ ok: false; reason: RejectionReason }`.

`DecodedHeader = { bankVersion: number; mode: Mode; priorityIndices: readonly number[] }`
(sortie de `decodeHeader`, R5).

## 8. Banques fictives de test (`src/core/bank/fixtures.ts`)

| Fonction | Contenu |
|---|---|
| `syntheticBank({ themes = 16, perTheme = 20, version = 1, candidates = 22 })` | identifiants `tNN`/`tNN-qMM`, `D_q = 2 − MM/perTheme` (décroissant, égalités contrôlées), une question sur cinq rattachée à un second thème `(NN + 1) mod T`, positions `((NN + MM + k) mod 5) − 2` avec une case `null` sur sept |
| `bankPair()` | version 1 = `syntheticBank`, version 2 = même banque moins `t03-q07`, plus `t03-q20`, position de `c05` sur `t04-q02` changée, candidat `c21` retiré |
| `exampleABank()` | banque à deux thèmes et quatre questions reproduisant l'exemple A de la spec |

## 9. Relations

```text
MainDataset (002) ──bankFromDataset──▶ BankVersion
BankVersion + mode + priorities ──selectQuestions──▶ Selection
Selection + ResultState + BankVersion ──scoreCandidates──▶ Scoreboard
ResultState + BankVersion ──encodeFragment──▶ '#1.<charge>'
'#1.<charge>' + versionCount ──decodeHeader──▶ DecodedHeader   (puis chargement de la version)
'#1.<charge>' + BankVersion ──decodeFragment──▶ ResultState
```
