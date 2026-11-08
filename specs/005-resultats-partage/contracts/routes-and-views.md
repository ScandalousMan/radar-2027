# Contrat : route `/resultats`, états, vues et historique

## Route

| Chemin | Rendu statique | Rendu client |
|---|---|---|
| `/resultats` | titre générique, métadonnées génériques (`results.meta.*`), squelette `loading` | `ResultsApp` lit `location.hash` après montage |

La page de garde de la 004 (`src/app/resultats/page.tsx`) est remplacée. Aucune autre route.
`generateMetadata` renvoie `title`, `description` et `openGraph { title, description, type:
'website' }` identiques pour tous les liens (FR-029) ; pas d'`og:image`.

## `ResultsApp`

```ts
export function ResultsApp(props: { fetcher?: typeof fetch }): JSX.Element;
```

- Montage : `loadResults(location.hash, fetcher)` ⇒ `PageState` (data-model § 1).
- `hashchange` : recharge, vue remise à `ranking` par `history.replaceState`.
- `popstate` : `readView(history.state)` ⇒ vue affichée ; vue invalide ⇒ `ranking`.
- Ouverture d'une fiche / d'une comparaison : `pushView(view)` ; « Retour au classement » dans
  la vue appelle `history.back()` si l'entrée précédente est le classement de cette page, sinon
  `replaceView({ view: 'ranking' })`.
- Focus : titre de la vue ouverte ; au retour, bouton « Ouvrir » du candidat quitté (R12).

## États sans résultat

| Statut | Titre | Actions |
|---|---|---|
| `no-fragment` | `results.empty.title` | Commencer (`/questionnaire`) ; ou carte de reprise si brouillon |
| `no-version` | `questionnaire.noVersion` (004) | Méthodologie |
| `invalid` | `results.invalid.title` (`role="alert"`) | Commencer |
| `unknown-version` | `results.unknownVersion.title` | Recharger (`location.reload()`, fragment conservé) |
| `error` | `results.error.title` | Réessayer |

Aucun de ces états n'affiche de nom de candidat, de pourcentage ni de sujet clé (SC-005).

## Vue « classement » (`ready`)

Ordre : `ResultsHeader` (sujets clés, mode, réponses, phrase de plafonnement, lien Méthodologie)
→ avertissement de version si `prior` (Notice : date, candidats retirés, « Refaire le
questionnaire », Méthodologie) → `RankingList` ou message « aucun candidat classable » (FR-010,
avec « Répondre à davantage de questions ») → `InsufficientList` → barre de comparaison
(sélection 0–3, « Comparer », limite annoncée) → `SharePanel` → « Modifier mes réponses ».

## Vue « fiche » (`candidate`)

Titre = nom (+ « ne se présente plus ») ; statut (rang, %, bande) ou « données insuffisantes » ;
`ThemeScoreList` ; « Détail par question » : `QuestionDetail` par question répondue, groupées par
thème ; « Questions passées » ; « N questions non répondues » ; lien Méthodologie ;
« Comparer » ; « Retour au classement ». Le détail (citations, sources) est chargé à l'ouverture
(R5) ; son absence n'empêche pas l'affichage du reste.

## Vue « comparaison » (`compare`)

`ComparisonTable` ; retrait d'un candidat (si 2 restants ⇒ reste ouverte ; si 1 ⇒ retour au
classement avec ce candidat sélectionné) ; « Retour au classement » ; `SharePanel` (même lien,
FR-022).
