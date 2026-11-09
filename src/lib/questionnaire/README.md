# `src/lib/questionnaire` — état du parcours questionnaire

Mécanique d'écran du parcours (fonctionnalité 004) : brouillon, étapes, persistance locale,
résumé de fin. Ce module est **hors de `src/core`** (il parle de position, d'étapes et de
stockage, pas de règles métier) et **hors de `src/ui`** (il n'affiche rien). Il importe le cœur
en lecture (`selectQuestions`, `normalizePriorities`, `encodeFragment`, constantes) et n'importe
ni `next/*` ni `@/ui` (vérifié par `src/lib/core-boundary.test.ts`).

Contrats : [routes et état](../../../specs/004-parcours-questionnaire/contracts/routes-and-state.md),
[stockage et données](../../../specs/004-parcours-questionnaire/contracts/storage-and-data.md),
[modèle de données](../../../specs/004-parcours-questionnaire/data-model.md).

| Fichier | Rôle |
|---|---|
| `types.ts` | `Draft`, `Choice`, `Action`, `QuestionnaireBank`, `LoadState`, `EndSummary`… |
| `bank-view.ts` | projection `MainDataset → QuestionnaireBank`, sélections des deux modes, thèmes d'une question |
| `reducer.ts` | transitions pures du brouillon (`start`, `answer`, `next`, `previous`, `goTo`, `resume`, `reset`, `clear`) |
| `storage.ts` | lecture tolérante, écriture, effacement, sonde, abonnement (clé `radar-questionnaire`) |
| `use-stored-draft.ts` | brouillon stocké lu après montage (`useSyncExternalStore`, instantané serveur `null`) |
| `summary.ts` | comptes par sujet clé, seuil `MIN_THEME_QUESTIONS`, lien `/resultats#1.…` |
| `resume-info.ts` | ce qu'affiche la carte de reprise de l'accueil |
| `guards.ts` | étape requise par route, redirection silencieuse |
| `history.ts` | historique du navigateur entre questions (`pushState` sans changer l'URL) |
| `from-result.ts` | 005 : `draftFromResultState`, `carryOver` (report par identifiant vers la version courante), `needsConfirmation` |
| `store.tsx` | `QuestionnaireProvider` / `useQuestionnaire` : chargement du jeu publié, présélection, brouillon, onglets |

## Brouillon stocké

Une seule clé, `radar-questionnaire`, écrite à partir de la première question puis après chaque
action ; jamais avant (fermer pendant le choix des sujets ne laisse rien). Valeur :

```json
{"format":1,"bankVersion":1,"mode":"short","priorities":["economie","sante","securite"],
 "answers":[2,"skipped",-1,"unanswered","…"],"position":3,"updatedAt":"2026-11-08T17:42:10.000Z"}
```

Toute valeur absente, illisible, d'un autre `format` ou incohérente vaut « aucun brouillon »
(`parseDraft`, écrit sans zod pour garder la bibliothèque hors du chargement initial des pages).
La cohérence avec la banque (`bankVersion`, longueur) est vérifiée à la reprise, ce qui permet à
l'accueil d'afficher « version changée ». `radar-appearance` (001) reste indépendante.

## États

```text
[accueil] --Commencer--> [themes] --Continuer (3..5)--> [mode] --Continuer--> start --> [questions]
[accueil] --Reprendre--> resume --> [questions] (position mémorisée)
[accueil] --Recommencer (confirm)--> reset --> [themes] (présélection)
[accueil] --Effacer (confirm)--> clear --> [accueil]
[questions] --answer+commit / Suivant--> next --> [questions] | dernière --> [fin]
[questions] --Précédent / popstate--> previous | goTo --> [questions]
[questions] --Modifier sujets|mode (confirm)--> reset --> [themes] | [mode]
[fin] --Revenir aux questions--> goTo(N−1) --> [questions]
[fin] --Voir mes résultats--> /resultats#1.…  (brouillon conservé)
```

Revalider le même triplet (version, mode, sujets) depuis l'écran du mode reprend le brouillon à
sa première question non traitée, sans confirmation ; un triplet différent demande confirmation.

## Pré-remplissage depuis les résultats (005, R14 de la 004)

`from-result.ts` met en œuvre le point d'extension réservé par la 004 :

- `draftFromResultState(state, bank, now): Draft` — même version : brouillon identique à l'état,
  `position` = première question non répondue, sinon 0 ; exige `state.bankVersion = bank.version`.
- `carryOver(state, linkBank, current, now)` — lien d'une version antérieure : sujets clés encore
  présents, sélection recalculée sur la version courante, réponses reportées par identifiant de
  question (les nouvelles restent `'unanswered'`) ; moins de 3 sujets ⇒ `choose-themes` avec la
  présélection des sujets restants (`setPendingPreselection`, lue par l'étape des sujets).
- `needsConfirmation(stored, next)` — un brouillon stocké différent (version, mode, sujets,
  réponses) n'est jamais remplacé sans confirmation.

Le réducteur et le stockage n'ont pas changé.
