# Contrat des messages i18n (`src/i18n/messages/fr.json`)

- Une seule locale livrée : `fr`, sans préfixe d'URL (next-intl « sans routage i18n »).
- Les clés sont organisées par espace de noms ; le type `IntlMessages` est dérivé de `fr.json`,
  donc toute clé inconnue est une erreur de compilation.
- Ajouter une locale = ajouter `messages/<locale>.json` et une entrée dans `src/i18n/config.ts`
  (liste des locales et locale par défaut) ; aucun composant ne change.

## Clés requises par le socle

| Clé | Valeur française |
|---|---|
| `common.siteName` | radar-2027 |
| `common.skipToContent` | Aller au contenu |
| `common.theme.toggle` | Changer de thème |
| `common.theme.light` | Thème clair |
| `common.theme.dark` | Thème sombre |
| `common.footer.methodology` | Méthodologie |
| `common.footer.about` | À propos |
| `home.title` | Quels candidats sont proches de vous ? |
| `home.lead` | radar-2027 compare vos réponses aux positions des candidats à la présidentielle 2027, en donnant plus de poids aux sujets qui comptent pour vous. |
| `home.privacy` | Tout est calculé dans votre navigateur : aucune réponse n'est envoyée ni conservée. |
| `home.cta` | Commencer |
| `ui.likert.stronglyDisagree` | Pas du tout d'accord |
| `ui.likert.disagree` | Plutôt pas d'accord |
| `ui.likert.neutral` | Neutre / sans avis |
| `ui.likert.agree` | Plutôt d'accord |
| `ui.likert.stronglyAgree` | Tout à fait d'accord |
| `ui.likert.skip` | Passer cette question |
| `ui.themePicker.counter` | {count} / {max} |
| `ui.themePicker.maxReached` | Vous avez atteint le maximum de {max} sujets. |
| `ui.themePicker.minNotReached` | Choisissez encore {missing, plural, one {# sujet} other {# sujets}} (minimum {min}). |
| `ui.scoreBar.undefined` | — |
| `ui.scoreBar.unavailable` | Score indisponible |
| `ui.evidence.programme` | Programme officiel |
| `ui.evidence.livrePlateforme` | Livre ou plateforme écrite |
| `ui.evidence.declarationVote` | Déclaration publique ou vote |

Les valeurs ci-dessus sont des propositions de rédaction ; les modifier ne change que `fr.json`.

## Vérifications

- Lint : règle interdisant les littéraux de texte dans le JSX de `src/app` et `src/ui`
  (ponctuation et symboles seuls autorisés).
- Test e2e : le titre de la page d'accueil est lu depuis `fr.json` et comparé au DOM.
- Typographie française : espace insécable avant `?`, `!`, `:` et `;`, guillemets « » ; vérifiée
  par un test unitaire sur le fichier de messages.
