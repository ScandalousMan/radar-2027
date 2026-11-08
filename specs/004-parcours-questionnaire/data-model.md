# Modèle de données : parcours questionnaire

**Feature** : `004-parcours-questionnaire` · **Date** : 2026-11-08 · **Plan** : [plan.md](plan.md)

Les entités métier (banque, sélection, état complet, codec) sont celles de la 003
([data-model.md](../003-domaine-score-selection-codec/data-model.md)) et ne sont pas redéfinies.
Ce document décrit ce que le parcours ajoute : une projection de la banque pour l'affichage,
le brouillon persisté, les étapes et leurs transitions, le résumé de fin.

## 1. `QuestionnaireBank` — projection de la version courante (lecture seule)

Construite une fois au chargement (R5) à partir de `MainDataset` validé et de `BankVersion`.

| Champ | Type | Source | Rôle |
|---|---|---|---|
| `version` | `number` ≥ 1 | `main.version` | figé pour toute la durée du questionnaire |
| `publishedAt` | `string` (AAAA-MM-JJ) | `main.publishedAt` | affichage éventuel |
| `themes` | `{ id, label, description, index }[]` | `main.themes` (ordre canonique) | écran sujets (FR-003), puces de thème |
| `bank` | `BankVersion` | `bankFromDataset(main)` | entrée de `selectQuestions`, `encodeFragment`, `normalizePriorities` |

Invariants : `themes.length = bank.themes.length ≤ 24` ; `themes[i].index = i`.

## 2. `Draft` — brouillon du questionnaire (état du parcours)

```ts
type Draft = {
  readonly format: 1;                      // version du format de stockage
  readonly bankVersion: number;            // = QuestionnaireBank.version au démarrage
  readonly mode: Mode;                     // 'full' | 'short' (core)
  readonly priorities: readonly string[];  // 3 à 5 identifiants, ordre canonique (normalizePriorities)
  readonly answers: readonly Answer[];     // longueur N, ordre de présentation ; 'unanswered' par défaut
  readonly position: number;               // 0 ≤ position < N : question affichée
  readonly updatedAt: string;              // ISO 8601, fourni par l'action (jamais lu dans le réducteur)
};
```

Invariants (vérifiés par les tests de propriétés du réducteur) :

- `answers.length = selectQuestions(bank, mode, priorities).items.length` ;
- `0 ≤ position < answers.length` ;
- `priorities` distinctes, `MIN_PRIORITIES ≤ length ≤ MAX_PRIORITIES`, en ordre canonique ;
- chaque `answers[i]` satisfait `isAnswer` ; aucune réponse n'est modifiée par une action qui
  ne la vise pas.

Le brouillon n'existe qu'à partir de l'action `start` (première question). Avant, la sélection
en cours (`priorities`, `mode`) vit dans l'état du fournisseur sous forme de `Choice`
(non persisté) :

```ts
type Choice = { readonly priorities: readonly string[]; readonly mode: Mode | null };
```

## 3. `Step` — étapes et gardes d'accès

| Étape | Route | Prérequis | Redirection si manquant |
|---|---|---|---|
| `themes` | `/questionnaire` | banque chargée | — (page d'entrée ; `noVersion` si `current = 0`) |
| `mode` | `/questionnaire/mode` | `choice.priorities` valide **ou** brouillon | `/questionnaire` |
| `questions` | `/questionnaire/questions` | brouillon **ou** (`choice.priorities` valide et `choice.mode`) | `/questionnaire/mode` (ou `/questionnaire`) |
| `end` | `/questionnaire/fin` | brouillon | `/questionnaire` |

Un accès direct à une route sans prérequis redirige silencieusement (cas limite « arrive
directement sur l'adresse d'une question »).

## 4. Actions et transitions du réducteur

```ts
type Action =
  | { type: 'start'; bank: QuestionnaireBank; priorities: readonly string[]; mode: Mode; now: string }
  | { type: 'answer'; position: number; answer: Exclude<Answer, 'unanswered'>; now: string }
  | { type: 'next' }                       // vers position + 1 (bornée) ; depuis la dernière → étape fin (signal `completed`)
  | { type: 'previous' }                   // vers position − 1 (bornée à 0)
  | { type: 'goTo'; position: number }     // popstate, retour depuis fin
  | { type: 'resume'; draft: Draft }       // brouillon lu du stockage ou d'un autre onglet
  | { type: 'reset' }                      // efface le brouillon (réponses) ; la présélection reste dans Choice
  | { type: 'clear' };                     // efface tout (brouillon et présélection)
```

| Action | Précondition | Effet | Persistance |
|---|---|---|---|
| `start` | triplet valide ; si un brouillon existe avec le **même** triplet (`bankVersion`, `mode`, `priorities`) → `resume` implicite (R13) | `answers = N × 'unanswered'`, `position = 0`, `updatedAt = now` | écrit |
| `answer` | `position` = position courante (sinon ignorée : double activation) | `answers[position] = answer`, `updatedAt = now` | écrit |
| `next` | — | `position = min(position + 1, N − 1)` ; si déjà `N − 1`, émet `completed` (navigation vers `fin`) | écrit |
| `previous` | `position > 0` (sinon ignorée) | `position − 1` | écrit |
| `goTo` | `0 ≤ p < N` (sinon ignorée) | `position = p` | écrit |
| `resume` | brouillon valide pour la banque courante (`bankVersion = bank.version`, longueur cohérente) | remplace le brouillon | — (déjà stocké) |
| `reset` | — | brouillon supprimé ; `Choice` conserve `priorities` et `mode` | efface |
| `clear` | — | brouillon et `Choice` supprimés | efface |

« Avancer jusqu'à la première question non traitée » (FR-014) n'est pas une action : la vue
affiche « Suivant » tant que `position < N − 1`, et le réducteur borne. Le marquage « passée »
est `answer` avec `'skipped'`.

### Diagramme d'états (vue)

```text
[accueil] --Commencer--> [themes] --Continuer (3..5)--> [mode] --Continuer--> start --> [questions]
[accueil] --Reprendre--> resume --> [questions] (position mémorisée)
[accueil] --Recommencer (confirm)--> reset --> [themes] (présélection)
[accueil] --Effacer (confirm)--> clear --> [accueil]
[questions] --answer+commit / Suivant--> next --> [questions] | completed --> [fin]
[questions] --Précédent / popstate--> previous | goTo --> [questions]
[questions] --Modifier sujets|mode (confirm)--> reset --> [themes] | [mode]
[fin] --Revenir aux questions--> goTo(N−1) --> [questions]
[fin] --Voir mes résultats--> /resultats#1.…  (brouillon conservé)
```

## 5. `StoredDraft` — représentation dans `localStorage`

Clé `radar-questionnaire`. Valeur : `JSON.stringify(draft)` (le type `Draft` est déjà sérialisable).
Schéma de relecture (zod) : `format` littéral `1`, `bankVersion` entier ≥ 1, `mode` ∈ `MODES`,
`priorities` tableau de chaînes (3 à 5, distinctes), `answers` tableau de `Answer`
(`-2..2 | 'skipped' | 'unanswered'`), `position` entier ≥ 0, `updatedAt` chaîne ISO. Toute
lecture invalide ⇒ `null`. La cohérence avec la banque (`bankVersion`, longueur) est vérifiée à
l'étape `resume`, pas par le schéma, pour pouvoir afficher « version changée » (FR-024).

## 6. `ResumeInfo` — ce que voit le répondant à l'accueil

Dérivé d'un `StoredDraft` et du registre chargé :

| Champ | Calcul |
|---|---|
| `mode` | `draft.mode` |
| `done` | nombre de `answers` ≠ `'unanswered'` |
| `total` | `draft.answers.length` |
| `updatedAt` | `draft.updatedAt`, affiché via `useFormatter().dateTime` |
| `status` | `'resumable'` si `draft.bankVersion = registry.current`, `'version-changed'` sinon, `'unavailable'` si le registre n'est pas chargeable |

## 7. `EndSummary` — résumé de l'écran de fin (R9)

```ts
type ThemeSummary = { themeId: string; label: string; answered: number; skipped: number; unanswered: number; reliable: boolean };
type EndSummary = { themes: ThemeSummary[]; warning: boolean; totalAnswered: number; totalSkipped: number };
```

`themes` = sujets clés en ordre canonique ; une question compte pour chacun de ses thèmes ;
`reliable = answered ≥ MIN_THEME_QUESTIONS` ; `warning = ∃ thème non fiable`.

## 8. `StorageStatus`

`'available' | 'unavailable'`, établi par une écriture d'essai (`__probe__`) au montage de
l'étape questions ; `'unavailable'` déclenche le `Notice` FR-025 et désactive la persistance
(le réducteur fonctionne en mémoire).

## 9. Relations

```text
MainDataset (002) ──bankFromDataset──> BankVersion (003) ──┐
      │                                                    ├──> QuestionnaireBank ──selectQuestions──> Selection (003)
      └── themes (label, description) ─────────────────────┘                                   │
Choice ──start──> Draft <──resume── StoredDraft (localStorage)                                  │
Draft + Selection ──summarize──> EndSummary                                                     │
Draft + QuestionnaireBank ──resultStateFromDraft──> ResultState (003) ──encodeFragment──> '#1.…'
```
