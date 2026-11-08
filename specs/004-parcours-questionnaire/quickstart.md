# Quickstart : valider le parcours questionnaire

Guide de vérification de la fonctionnalité `004-parcours-questionnaire`. Chaque scénario
renvoie à une user story de [spec.md](spec.md) ; les routes et l'état sont dans
[contracts/routes-and-state.md](contracts/routes-and-state.md), les composants dans
[contracts/components.md](contracts/components.md), le stockage et les données dans
[contracts/storage-and-data.md](contracts/storage-and-data.md), les entités dans
[data-model.md](data-model.md).

## Prérequis

- Socle 001, outillage 002 et cœur 003 installés (`pnpm install --frozen-lockfile`, Node 24,
  pnpm 12) ; Chromium Playwright installé (`pnpm exec playwright install chromium`).
- Aucune version réelle n'est nécessaire : les tests e2e servent une banque fictive par
  interception de route (R6). Pour une vérification manuelle sans version publiée, lancer
  `pnpm dev` puis, dans la console du navigateur, aucune action : la page affiche
  `questionnaire.noVersion`. Pour voir le parcours en local, publier une version de test dans un
  dossier temporaire (`pnpm data:publish --corpus data/fixtures/minimal --dry-run` montre la
  procédure) ou utiliser Storybook pour les composants.
- `vitest` se lance avec `</dev/null` dans un terminal non interactif.

## 0. Lint, types, frontières

```bash
pnpm lint && pnpm typecheck
```

Attendu : aucune erreur. Contre-épreuves : une chaîne française en dur dans
`src/app/questionnaire/page.tsx` fait échouer `react/jsx-no-literals` ; un import de
`@/lib/questionnaire` depuis `src/core` fait échouer la frontière ; `src/core` n'est pas
modifié (`git diff --stat main -- src/core` vide).

## 1. État et stockage (fondations)

```bash
pnpm vitest run src/lib/questionnaire src/lib/dataset-client.test.ts </dev/null
```

Attendu :

- Réducteur : `start` crée `N` réponses `'unanswered'` à la position 0 ; `answer` hors position
  ignorée ; `next` borné, `previous` borné à 0 ; `goTo` idempotent ; `start` avec le même
  triplet qu'un brouillon existant reprend ce brouillon (R13). Propriétés fast-check : toute
  suite d'actions conserve les invariants de [data-model.md § 2](data-model.md).
- Stockage : lecture `null` sur valeur absente, JSON invalide, `format: 0`, réponse `7` ;
  aller-retour exact ; `probeStorage` renvoie `'unavailable'` sur un stockage qui lève ;
  `subscribeDraft` ne réagit qu'à la clé `radar-questionnaire`.
- Projection : 16 thèmes avec description, `selectionsFor` renvoie 100 et 25 éléments sur la
  banque fictive 16 × 20 ; `themesOf` marque le sujet clé.
- Résumé : question à deux thèmes comptée dans les deux ; `reliable` faux sous 2 réponses ;
  `decodeFragment(resultHref)` redonne l'état exact.
- Chargeur : URL exactes `/data/versions.json` et `/data/versions/1/main.json`, aucun paramètre ;
  erreurs typées `network` / `invalid` ; mémoïsation.

## 2. Composants (principe IV)

```bash
pnpm vitest run src/ui </dev/null
pnpm vitest run --project storybook --project storybook-sombre </dev/null
```

Attendu : tests d'interaction du tableau de [contracts/components.md](contracts/components.md)
verts ; toutes les stories passent la vérification a11y dans les deux apparences ; aucune
violation `color-contrast`, `button-name`, `aria-*`. Vérification visuelle dans Storybook
(`pnpm storybook`) au viewport « Mobile 320 px » : `QuestionCard`, `ModeChoice`, `ResumeCard`,
`ConfirmDialog` sans défilement horizontal, cibles ≥ 44 px.

## 3. Parcours de bout en bout (US1, US2, US3)

```bash
pnpm build && pnpm e2e
```

`e2e/questionnaire.spec.ts` (banque fictive 16 thèmes × 20 questions, version 1) :

| Test | Déroulé | Attendu |
|---|---|---|
| Accueil → fin, mode court (US1) | `/` → Commencer → 4 sujets → Continuer → mode court → première question « 1 / 25 » → 25 réponses par clic → écran de fin | aucun avertissement (chaque sujet clé ≥ 2 réponses) ; lien « Voir mes résultats » vers `/resultats#1.…` ; `decodeFragment` sur le fragment avec la banque fictive redonne mode `short`, 4 sujets, 25 réponses |
| Mode complet (US1) | idem avec 3 sujets et mode complet | « 1 / 100 », 100 réponses, état décodé de 100 réponses |
| Déterminisme (US1 sc. 9) | deux contextes, mêmes sujets et mode | mêmes énoncés dans le même ordre (comparaison des 100 textes) |
| Sélection bornée (US1 sc. 3, 4) | 2 sujets → Continuer inactif + message ; 5 sujets → sixième refusé | compteur « 2 / 5 », message `minNotReached` ; `maxReached` |
| Passer, précédent, corriger (US2) | passer q1, répondre q2, précédent → q1 « passée » présélectionnée, choisir +1, Suivant → q2 avec sa réponse | progression cohérente ; Suivant actif seulement avec réponse |
| Avertissement de fin (US2 sc. 5) | passer toutes les questions d'un sujet clé | `questionnaire.end.warning.title` visible nommant le sujet ; « Voir mes résultats » toujours actif |
| Reprise (US3) | répondre à 10 questions, `page.reload()` puis `/` → `ResumeCard` « 10 / 25 » → Reprendre | question 11 affichée, 10 réponses intactes (retour arrière), même liste |
| Effacer (US3 sc. 5) | depuis l'accueil, Effacer → confirmer | `localStorage.getItem('radar-questionnaire')` vaut `null` ; accueil sans carte |
| Version changée (US3 sc. 6) | brouillon `bankVersion: 1` puis registre servi `current: 2` | carte « version changée » sans Reprendre ; rien d'effacé avant confirmation |
| Stockage indisponible (US3 sc. 7) | `localStorage.setItem` remplacé par une fonction qui lève (addInitScript) | `Notice` FR-025 affiché, parcours complet possible |
| Changement de sujets (US4) | 5 réponses → Modifier mes sujets → Annuler (rien ne change) → Modifier → Confirmer | écran sujets préselectionné ; après validation, « 1 / N » et réponses vides |
| Bouton précédent du navigateur | q3 → `page.goBack()` | q2 affichée, réponses intactes ; `goBack` depuis q1 → `/questionnaire/mode` |
| Accès direct | `/questionnaire/questions` sans choix | redirection vers `/questionnaire`, aucun message d'erreur |
| Trafic (SC-008) | écoute de toutes les requêtes du parcours court | seulement l'origine locale ; URL ∈ ressources statiques ∪ `/data/**` ; aucune ne contient un identifiant de thème, `short`, `full` ou un chiffre de réponse |
| Clavier (SC-005) | parcours court au clavier seul : Tab, flèches, Entrée | focus jamais perdu ; après Entrée sur une option, le focus est sur l'énoncé suivant ; annonce « Question n sur N » présente dans la zone `aria-live` |

Rapport : `playwright-report/index.html` en cas d'échec.

## 4. Vérifications manuelles complémentaires

- 320 px (SC-004) : `pnpm start:static` puis fenêtre à 320 px sur chaque étape : aucun
  défilement horizontal ; les six options de réponse, Précédent, Suivant et la progression
  visibles.
- Apparence sombre : bascule de l'en-tête sur chaque étape ; contraste des puces « sujet clé »
  et de l'encart d'avertissement.
- Taille des données : onglet Réseau, `main.json` ≤ 300 ko, en-tête de cache présent en
  prévisualisation Vercel.
- Lecteur d'écran (VoiceOver) : sur une question, l'ordre de lecture est énoncé → thèmes →
  « Votre réponse », options « 1 sur 6 »… ; après activation, « Question n sur N » est annoncé.

## 5. Vérification complète

```bash
pnpm verify
```

Attendu : lint, typecheck, `data:validate`, tests unitaires et stories, build Storybook, build
Next, e2e tous verts ; même enchaînement que la CI.

## Résultats (T063, 2026-11-08)

Vérifications du § 4 faites par l'agent (Claude Code) sur l'export statique (`pnpm build`),
servi localement avec la banque fictive des e2e (16 thèmes × 20 questions) copiée dans une
copie de `out/` hors dépôt : rien de fictif sous `public/data`. Mesures par script dans le
navigateur intégré (largeur de défilement, contraste WCAG calculé sur les couleurs rendues,
arbre d'accessibilité).

| Vérification | Résultat |
|---|---|
| 320 px (SC-004) : `/`, `/questionnaire`, `/mode`, `/questions`, `/fin`, `/resultats` | **OK** : `scrollWidth` = 320 sur chaque écran, aucun élément ne déborde ; six options, Précédent, Suivant/Terminer et progression présents, sur une colonne |
| Apparence sombre et claire, contraste du texte | **OK** : aucun texte sous 4,5:1 (3:1 en grand corps) ; minimum 6,16:1 en sombre, 5,24:1 en clair |
| Puces « sujet clé » | **OK** : ≥ 7,99:1 en sombre, ≥ 5,24:1 en clair ; le sujet clé est aussi marqué par une étoile et le texte « sujet clé » (jamais la couleur seule) |
| Encart d'avertissement (`/fin`, « Résultat peu fiable ») | **OK** : texte ≥ 6,16:1 en sombre, ≥ 5,47:1 en clair ; icône et titre en plus de la bordure |
| Bordures des commandes non sélectionnées (puces de thème, boutons secondaires) | 1,35 à 1,53:1. Admis par WCAG 1.4.11 : le libellé identifie la commande, l'état sélectionné est porté par une coche et `aria-pressed`. À reprendre au design system si l'on vise mieux |
| Taille de `main.json` ≤ 300 ko | **Non mesurable aujourd'hui** : aucune version publiée (`current = 0`), et la prévisualisation Vercel est protégée par connexion. Le plafond est imposé à la publication par la règle `PUB-BUDGET` (002). Une seule requête `main.json` par chargement de page, même origine, sans paramètre |
| En-tête de cache de `main.json` | **Écart corrigé** : `vercel.json` ne posait aucun `Cache-Control` sur `/data/versions/**` (plan § risques : « immuable »). Ajout de `public, max-age=31536000, immutable` ; le registre garde le comportement par défaut de Vercel (revalidation). À constater sur la prévisualisation après la première publication |
| Lecteur d'écran (arbre d'accessibilité, VoiceOver non lancé) | **OK après correction** : focus sur l'énoncé (`h2`) à chaque question ; « Question n sur N » dans une région `aria-live="polite"` ; options en `radio` nommées par leur libellé avec « n sur 6 » (`aria-posinset`/`aria-setsize`), tabulation itinérante ; dialogue de modification fermé non exposé. **Écart corrigé** : le groupe de réponses était nommé « Votre réponse » seul, alors que FR-032 demande qu'il soit nommé par l'énoncé ; il est désormais nommé « énoncé + Votre réponse » (`LikertChoice.labelledBy`). Ordre du DOM : progression → thèmes → énoncé → réponses ; le focus posé sur l'énoncé fait lire énoncé puis réponses, les thèmes se lisent en remontant (SC-005 satisfait : numéro, thème, énoncé et options sont énonçables) |

Reste ouvert : écoute réelle avec VoiceOver et mesure de `main.json` sur la première version
publiée (prévisualisation Vercel).
