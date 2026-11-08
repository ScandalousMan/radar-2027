# Contrat : messages ajoutés à `src/i18n/messages/fr.json`

Les valeurs ci-dessous sont indicatives (rédaction finale à l'implémentation) ; les **clés** et
les **listes fermées** sont contractuelles. `results.title`, `results.soon` et
`results.backToQuestionnaire` (page de garde de la 004) sont retirées.

## Listes fermées (FR-003, FR-015, FR-040)

| Clé | Valeur |
|---|---|
| `results.band.very-aligned` | très aligné |
| `results.band.rather-aligned` | plutôt aligné |
| `results.band.mixed` | mitigé |
| `results.band.distant` | éloigné |
| `results.agreement.identical` | identique |
| `results.agreement.close` | proche |
| `results.agreement.intermediate` | intermédiaire |
| `results.agreement.distant` | éloigné |
| `results.agreement.opposite` | opposé |

Un test vérifie que les clés de bande correspondent exactement à `Band` et celles de palier à
`AgreementLevel`, et qu'aucune autre clé de `results.*` ne qualifie un candidat (revue de la
liste ci-dessous).

## `results.*`

| Clé | Exemple |
|---|---|
| `meta.title` | Mes affinités avec les candidats à la présidentielle 2027 |
| `meta.description` | Comparez vos réponses aux positions des candidats, en donnant plus de poids aux sujets qui comptent pour vous. |
| `title` | Vos résultats |
| `header.mode` | {mode, select, short {Mode court} other {Mode complet}} · {answered} réponses sur {total} |
| `header.cap` | Votre score global avec un candidat ne dépasse jamais votre accord avec lui sur vos sujets clés. |
| `header.methodology` | Comprendre le calcul |
| `ranking.title` | Classement |
| `ranking.tied` | ex æquo |
| `ranking.withdrawn` | ne se présente plus |
| `ranking.noneTitle` | Aucun candidat ne dispose d'assez de données |
| `ranking.noneBody` | Répondez à davantage de questions pour obtenir un classement. |
| `ranking.answerMore` | Répondre à davantage de questions |
| `insufficient.title` | Données insuffisantes |
| `insufficient.unknown` | {unknown, plural, one {# position inconnue} other {# positions inconnues}} sur {answered} questions répondues |
| `compare.add` / `compare.remove` / `compare.limit` / `compare.action` / `compare.title` | Comparer · Retirer · Trois candidats au plus · Comparer ({count}) · Comparaison |
| `candidate.back` / `candidate.themes` / `candidate.questions` / `candidate.skipped` / `candidate.unanswered` | Retour au classement · Scores par thème · Détail par question · Questions passées · {count, plural, …} non répondue(s) |
| `candidate.insufficient` | Données insuffisantes : ce candidat n'est pas classé. |
| `candidate.detailError` | Les citations et sources n'ont pas pu être chargées. |
| `share.*` | copy, copied, manualHint, native, previewTitle |
| `modify.action` | Modifier mes réponses |
| `modify.confirm.title` / `.description` / `.confirm` / `.cancel` | Remplacer le questionnaire en cours ? · … · Remplacer · Annuler |
| `prior.warning` | Résultats calculés avec les données du {date} ; des données plus récentes existent. |
| `prior.withdrawn` | {count, plural, one {# candidat ne se présente plus} other {# candidats ne se présentent plus}} depuis. |
| `prior.redo` | Refaire le questionnaire avec les données actuelles |
| `empty.title` / `empty.start` | Aucun résultat à afficher · Commencer le questionnaire |
| `invalid.title` / `invalid.body` | Ce lien est incomplet ou invalide · … |
| `unknownVersion.title` / `unknownVersion.reload` | Ce lien vient d'une version plus récente du site · Recharger la page |
| `error.title` / `error.retry` | Les données n'ont pas pu être chargées · Réessayer |

## `ui.*`

`ui.rankingList.*` (rank, open, compare, compareDisabled), `ui.insufficientList.*`,
`ui.themeScoreList.*` (priorityTheme, priorityMark, undefined « non calculable », coverage),
`ui.questionDetail.*` (yourAnswer, position, unknownPosition, agreement, quoteMissing, source,
newTab, skipped), `ui.comparisonTable.*` (global, insufficient, remove, series), `ui.sharePanel.*`,
`ui.resultsHeader.*`, `ui.resumeCard.completeTitle`, `ui.resumeCard.viewResults`. Libellés des
réponses : réutilisation de `ui.likert.*` (004).
