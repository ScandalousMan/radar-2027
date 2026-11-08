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
