# Contrat : clés i18n ajoutées (`src/i18n/messages/fr.json`)

Valeurs proposées ; les modifier ne change que `fr.json`. Typographie française (espaces
insécables avant `?`, `!`, `:`, `;`, guillemets « ») vérifiée par `src/i18n/messages.test.ts`.

## `home`

| Clé | Valeur |
|---|---|
| `home.resume.title` | Un questionnaire est en cours |
| `home.resume.summary` | {mode, select, short {Mode court} full {Mode complet} other {Questionnaire}} · {done} / {total} questions · dernière réponse le {date} |
| `home.resume.resume` | Reprendre |
| `home.resume.restart` | Recommencer |
| `home.resume.clear` | Effacer |
| `home.resume.versionChanged` | Les questions ont été mises à jour depuis votre dernière visite : ce questionnaire ne peut pas être repris tel quel. Vous pouvez le recommencer ou l'effacer. |

## `questionnaire`

| Clé | Valeur |
|---|---|
| `questionnaire.title` | Questionnaire |
| `questionnaire.loading` | Chargement des questions… |
| `questionnaire.noVersion` | Le questionnaire n'est pas encore disponible : aucune version des questions n'est publiée. |
| `questionnaire.loadError` | Les questions n'ont pas pu être chargées. Vérifiez votre connexion puis réessayez. |
| `questionnaire.retry` | Réessayer |
| `questionnaire.themes.title` | Quels sujets comptent le plus pour vous ? |
| `questionnaire.themes.legend` | Choisissez de 3 à 5 sujets clés |
| `questionnaire.themes.explain` | Vos sujets clés pèsent trois fois plus que les autres dans le calcul, et un candidat ne peut pas obtenir un score global supérieur à son score sur ces sujets. |
| `questionnaire.themes.continue` | Continuer |
| `questionnaire.mode.title` | Choisissez votre mode |
| `questionnaire.mode.legend` | Mode du questionnaire |
| `questionnaire.mode.back` | Revenir aux sujets |
| `questionnaire.mode.continue` | Commencer le questionnaire |
| `questionnaire.questions.progress` | Question {n} sur {total} |
| `questionnaire.questions.previous` | Question précédente |
| `questionnaire.questions.next` | Question suivante |
| `questionnaire.questions.finish` | Terminer |
| `questionnaire.questions.changeThemes` | Modifier mes sujets clés |
| `questionnaire.questions.changeMode` | Modifier le mode |
| `questionnaire.questions.hint` | « Neutre / sans avis » compte comme une réponse au milieu de l'échelle ; « Passer » retire la question du calcul. |
| `questionnaire.questions.storageUnavailable` | Votre navigateur ne permet pas de conserver votre progression : si vous quittez cette page, vos réponses seront perdues. |
| `questionnaire.confirm.change.title` | Modifier vos choix ? |
| `questionnaire.confirm.change.description` | La liste des questions dépend de vos sujets clés et du mode : vos réponses en cours seront perdues. |
| `questionnaire.confirm.change.confirm` | Modifier et recommencer |
| `questionnaire.confirm.restart.title` | Recommencer le questionnaire ? |
| `questionnaire.confirm.restart.description` | Vos réponses en cours seront effacées de cet appareil. |
| `questionnaire.confirm.restart.confirm` | Recommencer |
| `questionnaire.confirm.clear.title` | Effacer le questionnaire ? |
| `questionnaire.confirm.clear.description` | Toutes les données du questionnaire seront supprimées de cet appareil. Rien n'a jamais été envoyé ailleurs. |
| `questionnaire.confirm.clear.confirm` | Effacer |
| `questionnaire.confirm.cancel` | Annuler |
| `questionnaire.end.title` | Vous avez terminé |
| `questionnaire.end.intro` | Voici le nombre de réponses données pour chacun de vos sujets clés. |
| `questionnaire.end.totals` | {answered, plural, one {# question répondue} other {# questions répondues}}, {skipped, plural, =0 {aucune passée} one {# passée} other {# passées}} |
| `questionnaire.end.warning.title` | Résultat peu fiable sur certains sujets |
| `questionnaire.end.warning.description` | Vous avez répondu à moins de {min} questions sur : {themes}. Le score de ces sujets ne pourra pas être calculé. Vous pouvez revenir compléter vos réponses ou afficher vos résultats malgré tout. |
| `questionnaire.end.back` | Revenir aux questions |
| `questionnaire.end.results` | Voir mes résultats |

## `ui`

| Clé | Valeur |
|---|---|
| `ui.modeChoice.short.title` | Mode court |
| `ui.modeChoice.short.duration` | Environ 3 minutes |
| `ui.modeChoice.short.detail` | Seuls vos sujets clés sont détaillés ; les autres thèmes sont effleurés. |
| `ui.modeChoice.full.title` | Mode complet |
| `ui.modeChoice.full.duration` | Environ 10 minutes |
| `ui.modeChoice.full.detail` | Tous les thèmes sont détaillés, vos sujets clés davantage. |
| `ui.modeChoice.questions` | {count, plural, one {# question} other {# questions}} |
| `ui.questionCard.answerLegend` | Votre réponse |
| `ui.questionCard.themes` | Thèmes de la question |
| `ui.questionCard.priorityTheme` | Sujet clé : {label} |
| `ui.resumeCard.title` | Questionnaire en cours |
| `ui.resumeCard.summary` | {mode, select, short {Mode court} full {Mode complet} other {Questionnaire}} · {done} / {total} questions traitées · dernière réponse le {date} |
| `ui.resumeCard.resume` | Reprendre |
| `ui.resumeCard.restart` | Recommencer |
| `ui.resumeCard.clear` | Effacer |
| `ui.resumeCard.versionChanged` | Les questions ont été mises à jour : ce questionnaire ne peut pas être repris tel quel. |
| `ui.notice.info` | Information |
| `ui.notice.warning` | Attention |
| `ui.answerSummary.counts` | {answered, plural, one {# répondue} other {# répondues}}, {skipped, plural, one {# passée} other {# passées}}, {unanswered, plural, one {# non répondue} other {# non répondues}} |
| `ui.answerSummary.unreliable` | Trop peu de réponses pour un score fiable (minimum {min}) |

## `results` (page de garde, R11)

| Clé | Valeur |
|---|---|
| `results.title` | Résultats |
| `results.soon` | La page de résultats arrive bientôt. Ce lien reste valable : conservez-le pour revenir voir vos résultats. |
| `results.backToQuestionnaire` | Revenir au questionnaire |

## Suppressions

Aucune. `home.ctaSoon` reste utilisé tant qu'aucune version n'est publiée.
