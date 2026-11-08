# Data Model : Résultats, détail par candidat et partage par URL

Aucune donnée persistée nouvelle. Les entités métier (`ResultState`, `Scoreboard`,
`CandidateScore`, `ThemeScore`, `QuestionScore`, `Band`, `RejectionReason`) viennent de `@/core`
(contrat `core-api` de la 003) ; le brouillon vient de la 004. Ce document décrit les états de
la page et le modèle d'affichage de `src/lib/results`.

## 1. État de la page (`PageState`)

| Statut | Quand | Affichage |
|---|---|---|
| `loading` | lecture du fragment et chargement en cours | squelette, aucun chiffre |
| `no-fragment` | `location.hash` vide ou `#` | invitation à commencer, ou carte de reprise (FR-035) |
| `no-version` | registre `current = 0` | texte de la 004 (`questionnaire.noVersion`) |
| `invalid` | rejet du codec autre que version inconnue | message « lien incomplet ou invalide », Commencer (FR-031) |
| `unknown-version` | `unknown-bank-version` à l'en-tête | invitation à recharger, lien conservé (FR-034) |
| `error` | réseau ou jeu invalide | message, « Réessayer » |
| `ready` | décodage et score réussis | vues (§ 3) |

`ready` porte : `state: ResultState`, `board: Scoreboard`, `bank: BankVersion` (version du lien),
`themes` (libellés et ordre), `prior: null | { publishedAt: string; withdrawnIds: readonly string[] }`,
`shareUrl: string`.

Transitions : `loading → (no-fragment | no-version | invalid | unknown-version | error | ready)` ;
`error → loading` (Réessayer) ; `hashchange` ⇒ `loading` depuis n'importe quel état.

## 2. Modèle d'affichage (`ResultsView`)

```text
ResultsView
├── header       : priorities (libellés, ordre canonique), mode, answeredCount, totalCount
├── ranking[]    : RankingRow  { candidateId, name, rank, tied, percent, band, withdrawn }
├── insufficient[]: InsufficientRow { candidateId, name, unknown, answered, withdrawn }
├── noneRanked   : boolean   (ranking vide)
└── prior        : null | { publishedAt, withdrawnCount }
```

Règles : `ranking` reprend l'ordre et le rang du cœur ; `tied ⇔ ∃ autre ligne de même rang` ;
`percent = global.percent` (tronqué par le cœur) ; `band` = `Band` du cœur ; `unknown =
answered − coverage.known` (`answered = board.answeredCount`) ; `withdrawn ⇔ prior ≠ null ∧ id ∈
prior.withdrawnIds` (§ 5).

## 3. Vues et historique (`ViewState`)

```ts
type ViewState =
  | { view: 'ranking' }
  | { view: 'candidate'; candidateId: string }
  | { view: 'compare'; candidateIds: readonly string[] };   // 2 à 3, ordre d'ajout = emplacement de série
```

Stocké dans `history.state.radarResults`. La sélection en cours de constitution (avant
« Comparer ») est un état local de la vue classement, non historisé. Invariants : `candidateId`
appartient à `ranking ∪ insufficient` ; sinon la vue retombe sur `ranking`.

## 4. Fiche candidat (`CandidateSheet`)

| Champ | Source |
|---|---|
| `candidate` | `CandidateScore.candidate` ; `status`, `rank`, `band`, `global` |
| `withdrawn` | § 5 |
| `themes[]` : `ThemeRow { key, label, priority, percent \| null, known, answered }` | `CandidateScore.themes`, réordonnés : prioritaires puis autres (ou `others`) |
| `answered[]` : `QuestionRow` | questions non exclues ou exclues pour `unknown-position` |
| `skipped[]` : `SkippedRow { questionId, text, candidatePosition }` | `excluded = 'skipped'` |
| `unansweredCount` | `excluded = 'unanswered'` |

`QuestionRow { questionId, text, themeLabels, answer: ScaleValue, position: ScaleValue | null,
agreement: AgreementLevel | null, evidence: EvidenceLevel | null }` ; `agreement` et `evidence`
sont `null` si la position est inconnue (la ligne indique qu'elle n'entre pas dans le calcul).
Citation et source viennent du détail (§ 6). Regroupement : par thème principal dans l'ordre de
`themes`, chaque question une fois.

`AgreementLevel = 'identical' | 'close' | 'intermediate' | 'distant' | 'opposite'` (R3).

## 5. Ancienne version

`prior = { publishedAt: bank.publishedAt, withdrawnIds }` où `withdrawnIds` = identifiants des
candidats de la version du lien absents de la version courante (R4). `withdrawnCount =
withdrawnIds.length`.

## 6. Détail chargé (`DetailState`)

Par `(version, candidateId)` : `idle | loading | ready(CandidateDetail) | error`. Pour une
`QuestionRow` connue : `quote = detail.positions[questionId].quote` (absente ⇒ mention « citation
indisponible », ligne conservée), source = `detail.sources[quoteSource]` (`title`, `publishedAt`
au format français selon sa précision, `url`).

## 7. Comparaison (`ComparisonView`)

```text
columns[] : { candidateId, name, slot: 1|2|3, global: number | null (null ⇒ données insuffisantes) }
rows[]    : { key, label, priority, values: (number | null)[] }   // ordre des thèmes de la fiche
```

Les lignes suivent l'ordre « prioritaires puis autres » ; en mode court, une ligne `others`.

## 8. Report vers le questionnaire (`draftFromResultState`, `carryOver`)

- Même version : `Draft { format: 1, bankVersion, mode, priorities, answers, position, updatedAt: now }`,
  `position` = première `'unanswered'`, sinon 0.
- Version antérieure : `priorities' = priorities ∩ thèmes courants` ; si `|priorities'| < 3` ⇒
  `{ kind: 'choose-themes', preselected: priorities' }` ; sinon sélection courante
  `selectQuestions(current, mode, priorities')` et `answers'[i] = answers[id]` si la question
  existait dans la sélection de l'ancien lien, sinon `'unanswered'` ⇒ `{ kind: 'draft', draft }`.
- Écriture conditionnée par § 9.

## 9. Confirmation de remplacement

`needsConfirmation(stored, next) ⇔ stored ≠ null ∧ (stored.bankVersion, mode, priorities,
answers) ≠ (next.…)`. `position` et `updatedAt` sont ignorés dans la comparaison.

## 10. Carte de reprise (`ResumeInfo.status`)

`'resumable' | 'version-changed' | 'unavailable'` (004) + `'complete'` : aucune réponse
`'unanswered'`. Avec `'complete'`, la carte porte `resultsHref` (calculé avec la banque de la
version du brouillon) ; la notice « version changée » s'ajoute si `draft.bankVersion ≠ current`.
