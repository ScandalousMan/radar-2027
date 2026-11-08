# Implementation Plan: Parcours questionnaire

**Branch**: `004-parcours-questionnaire` | **Date**: 2026-11-08 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/004-parcours-questionnaire/spec.md`

## Summary

Livrer le parcours du répondant, de l'accueil à l'écran de fin : choix de 3 à 5 sujets clés,
choix du mode, enchaînement des questions une par une (réponse, passage, retour, correction),
écran de fin avec avertissement de fiabilité, reprise d'un questionnaire interrompu depuis
l'appareil, changement de sujets ou de mode en cours de route. Le parcours est une **coquille
d'interface pure** autour du cœur 003 : il appelle `selectQuestions` pour obtenir la liste
ordonnée, `encodeFragment` pour remettre l'état complet aux résultats, et n'ajoute aucune règle
métier. Il s'organise en quatre routes statiques sous `/questionnaire`, un **état de brouillon**
géré par un réducteur pur (testable sans DOM) et persisté dans le stockage local du navigateur,
une **lecture à l'exécution** du jeu publié (`/data/versions.json`, `/data/versions/<n>/main.json`,
même origine, immuable) et six nouveaux composants `src/ui` avec stories et tests. Les textes
passent par `fr.json` (`questionnaire.*`, `ui.*`). Trois tests Playwright (mode court, mode
complet, reprise) tournent contre l'export statique avec une banque fictive servie par
interception de route, donc sans dépendre de la première publication réelle.

## Technical Context

**Language/Version**: TypeScript 5.9 (strict), Node.js 24, pnpm 12 (socle 001 inchangé)

**Primary Dependencies**: aucune nouvelle. Utilisées : Next.js 16.4 App Router en export
statique, React 19.3 (`useReducer`, `useSyncExternalStore`), next-intl 4.14 (`questionnaire.*`),
Tailwind 4 via tokens, `zod` 4.6 (validation du brouillon relu depuis le stockage), `@/core`
(`bankFromDataset`, `selectQuestions`, `normalizePriorities`, `encodeFragment`, constantes
`MIN_PRIORITIES`, `MAX_PRIORITIES`, `TARGET_COUNT`, `MIN_THEME_QUESTIONS`). Élément `<dialog>`
natif pour les confirmations (pas de bibliothèque de modale).

**Storage**: `localStorage` du navigateur, une seule clé `radar-questionnaire` (brouillon JSON
versionné, schéma `DraftSchema`), écrite à partir de la première question affichée (FR-020) ;
lecture tolérante (stockage absent, refusé, corrompu, version de format inconnue ⇒ « aucun
brouillon »). Aucune donnée dans l'URL pendant le parcours (FR-022) ; l'état complet n'entre
dans un fragment qu'au passage aux résultats (`/resultats#1.…`).

**Testing**: Vitest `unit` (réducteur, stockage, projection de banque, résumé de fin,
composants avec Testing Library ; propriétés fast-check sur le réducteur), projets Vitest
`storybook` / `storybook-sombre` (stories des six composants, a11y bloquante dans les deux
apparences), Playwright `chromium` contre `out/` : `e2e/questionnaire.spec.ts` (parcours court,
parcours complet, reprise, accès direct, aucune requête sortante porteuse de données) avec
`page.route('**/data/**')` servant une banque fictive (`syntheticDataset` de
`src/core/bank/fixtures.ts`).

**Target Platform**: navigateurs evergreen mobiles et desktop à partir de 320 px ; export
statique servi par Vercel Hobby ; aucune fonction serveur

**Project Type**: application web statique, projet unique (routes App Router + composants
`src/ui` + logique d'état dans `src/lib/questionnaire`)

**Performance Goals**: passage à la question suivante < 100 ms perçu (SC-010 ; rendu local,
aucun calcul : la sélection est calculée une fois au démarrage) ; chargement initial du jeu
publié ≤ 300 ko (budget 002) en une requête même origine, mise en cache immuable ; page
`/questionnaire` ≤ 200 ko compressés hors données (cohérent avec SC-011 de la 001)

**Constraints**: aucune règle métier hors `src/core` (principe III) ; aucun envoi réseau de
sujet, mode, réponse ou position (SC-008, vérifié en e2e) ; aucune chaîne en dur (lint 001) ;
tokens seulement ; clavier et lecteur d'écran (FR-032) ; 320 px sans défilement horizontal ;
thèmes clair et sombre ; export statique : toutes les routes connues au build, état uniquement
côté client

**Scale/Scope**: 4 routes (`/questionnaire`, `/questionnaire/mode`, `/questionnaire/questions`,
`/questionnaire/fin`) + 1 page de garde `/resultats` (R11) + modification de l'accueil ;
6 nouveaux composants `src/ui` et 1 extension (`LikertChoice.onCommit`) ; 1 module d'état
(`src/lib/questionnaire`, ~6 fichiers) ; 1 chargeur de données client ; ~40 clés i18n ;
3 scénarios Playwright ; 16 thèmes, 25 ou 100 questions, 1 brouillon par appareil

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principe | Exigence applicable | Comment le plan y répond | Statut |
|---|---|---|---|
| I. Neutralité et traçabilité | énoncés affichés tels que publiés ; aucune orientation du parcours | le parcours affiche `question.text` du jeu publié sans transformation ; l'ordre vient de `selectQuestions` (FR-016, FR-017) et ne dépend d'aucune réponse ; les thèmes sont listés en ordre canonique (FR-003) | ✅ |
| II. Vie privée | rien n'est envoyé ni placé dans la query string ; stockage local autorisé pour la reprise | une seule requête même origine vers `/data/**` sans paramètre ; brouillon dans `localStorage` (R4), effaçable (FR-023) ; état complet transmis dans le **fragment** par `encodeFragment` (R10) ; test e2e d'observation du trafic (SC-008) | ✅ |
| III. Cœur métier pur | règles dans `src/core`, parcours sans règle | sélection, bornes 3–5, cibles 25/100, seuil 2 et codec importés de `@/core` ; le réducteur de brouillon ne contient que des transitions d'interface (position, réponses) et est lui-même pur et testé par propriétés (R3) ; `src/core` n'est pas modifié | ✅ |
| IV. Design system d'abord | composants dans `src/ui`, stories, a11y, tokens, 320 px, clair/sombre | 6 nouveaux composants + 1 extension, chacun avec story (états), test Vitest et passage a11y dans les deux projets Storybook ; aucune valeur de style en dur (lint 001) ; viewport 320 px dans les stories | ✅ |
| V. Tests comme contrat, CI bloquante | e2e Playwright par parcours (sujets, court, complet) | `e2e/questionnaire.spec.ts` : parcours court, parcours complet, reprise, accès direct ; banque fictive par interception de route (R6) donc exécutable en CI dès maintenant ; CI inchangée | ✅ |
| VI. i18n | aucune chaîne en dur ; `fr` seule ; dates et nombres localisés | nouvelles clés `questionnaire.*` et `ui.*` ; date de dernière réponse via `useFormatter` ; pluriels ICU ; lint `react/jsx-no-literals` actif sur `src/app` et `src/ui` | ✅ |
| VII. Simplicité, statique, sobriété | pas de backend, projet unique, données légères | aucune dépendance ajoutée ; `<dialog>` natif ; données lues depuis `public/data` déjà servi ; aucune route dynamique | ✅ |
| Contraintes techniques | pile imposée ; échelle −2…+2 plus « passer » | `LikertChoice` existant (6 options) ; Next/React/next-intl/Tailwind/Storybook/Vitest/Playwright du socle | ✅ |

**Pré-recherche** : aucun écart. **Post-conception** : aucun écart ; la page de garde
`/resultats` (R11) n'introduit ni donnée ni règle, elle évite seulement une impasse tant que la
005 n'est pas livrée et sera remplacée par celle-ci.

## Project Structure

### Documentation (this feature)

```text
specs/004-parcours-questionnaire/
├── plan.md                      # ce fichier
├── research.md                  # R1–R12 : routes, état, stockage, données, avancement, e2e, garde résultats
├── data-model.md                # brouillon, banque projetée, étapes, transitions, résumé de fin
├── quickstart.md                # scénarios de validation par user story
├── contracts/
│   ├── routes-and-state.md      # routes, gardes d'accès, store, réducteur, événements d'historique
│   ├── components.md            # props et a11y des 6 nouveaux composants + extension LikertChoice
│   ├── storage-and-data.md      # clé et schéma du brouillon, chargeur client du jeu publié, remise aux résultats
│   └── i18n-messages.md         # clés ajoutées à fr.json
├── checklists/requirements.md
└── tasks.md                     # produit par /speckit-tasks (pas par ce plan)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── page.tsx                             # accueil : CTA actif si une version est publiée (build) ; <ResumePrompt/> client
│   ├── questionnaire/
│   │   ├── layout.tsx                       # <QuestionnaireProvider> : chargement du jeu publié + store du brouillon
│   │   ├── page.tsx                         # étape « sujets clés » (ThemePicker, explication du poids, Continuer)
│   │   ├── mode/page.tsx                    # étape « mode » (ModeChoice avec N exact par mode, retour, Continuer)
│   │   ├── questions/page.tsx               # étape « questions » (QuestionCard, ProgressBar, navigation, historique)
│   │   └── fin/page.tsx                     # étape « fin » (AnswerSummary, avertissement, lien vers /resultats#…)
│   └── resultats/page.tsx                   # page de garde (R11) : conserve le fragment, remplacée par la 005
├── lib/
│   ├── dataset.ts                           # inchangé (lecture build, serveur)
│   ├── dataset-client.ts                    # fetch même origine : registre + main.json d'une version ; cache mémoire (+ test)
│   └── questionnaire/
│       ├── types.ts                         # Draft, Step, QuestionnaireBank (projection), actions
│       ├── reducer.ts                       # transitions pures (+ reducer.test.ts, propriétés fast-check)
│       ├── storage.ts                       # lecture/écriture/effacement du brouillon, détection d'indisponibilité (+ test)
│       ├── bank-view.ts                     # projection MainDataset → QuestionnaireBank (thèmes avec description, sélection par mode) (+ test)
│       ├── summary.ts                       # comptes par sujet clé, avertissement < MIN_THEME_QUESTIONS, état complet → fragment (+ test)
│       ├── store.tsx                        # QuestionnaireProvider, hooks useDraft/useBank, synchronisation storage et historique
│       └── guards.ts                        # étape requise par route, redirection vers l'étape manquante
├── ui/
│   ├── LikertChoice/                        # + prop `onCommit` (clic, Entrée, Espace) ; stories et tests complétés
│   ├── ModeChoice/                          # deux cartes radio : libellé, nombre de questions, durée, précision mode court
│   ├── QuestionCard/                        # énoncé (h2 focalisable), ThemeChip des thèmes (clé distingué), LikertChoice
│   ├── ResumeCard/                          # reprise : mode, avancement, date ; Reprendre / Recommencer / Effacer ; variante « version changée »
│   ├── ConfirmDialog/                       # <dialog> modal : titre, texte, Confirmer / Annuler, focus piégé, Échap
│   ├── Notice/                              # encart info / avertissement (stockage indisponible, fiabilité, version)
│   └── AnswerSummary/                       # liste des sujets clés : répondues / passées, marque « peu fiable »
└── i18n/messages/fr.json                    # + questionnaire.*, ui.modeChoice.*, ui.questionCard.*, ui.resumeCard.*, ui.confirmDialog.*, ui.notice.*, ui.answerSummary.*, home.resume*

e2e/
├── fixtures/published.ts                    # banque fictive sérialisée depuis syntheticDataset() ; aide `servePublished(page)`
└── questionnaire.spec.ts                    # parcours court, parcours complet, reprise, accès direct, trafic, clavier
```

**Structure Decision** : projet unique conservé (principe VII). La logique d'état vit dans
`src/lib/questionnaire` (hors `src/core`, car elle manipule position, étapes et stockage, et hors
`src/ui`, car elle n'affiche rien) ; `src/core` reste intact et importé en lecture. Les routes
sont quatre pages statiques sous un layout client commun qui porte le fournisseur d'état, ce qui
donne au bouton « précédent » du navigateur un comportement naturel entre écrans (R1) ; la
navigation entre questions utilise `history.pushState` sans changer l'URL (R2). Le chargeur
client `src/lib/dataset-client.ts` est écrit pour être réutilisé par la 005 (version courante
et versions antérieures).

## Approche de mise en œuvre (ordre proposé pour /speckit-tasks)

1. **Fondations** : types, projection `bank-view`, chargeur client, réducteur et stockage avec
   leurs tests (unitaires et propriétés) ; clés i18n ; `LikertChoice.onCommit`.
2. **Composants** (parallélisables) : `ModeChoice`, `QuestionCard`, `ResumeCard`,
   `ConfirmDialog`, `Notice`, `AnswerSummary`, chacun avec story, test, a11y.
3. **US1 – parcours nominal** : layout + store, étapes sujets, mode, questions (réponse et
   avancement), fin et remise aux résultats ; page de garde `/resultats` ; accueil (CTA).
4. **US2 – navigation** : passer, précédent, correction, « Suivant » après correction,
   historique du navigateur, avertissement de fin.
5. **US3 – reprise** : persistance depuis la première question, `ResumePrompt` à l'accueil,
   reprendre / recommencer / effacer, version changée, stockage indisponible, deux onglets.
6. **US4 – changement de sujets ou de mode** : demande depuis une question, confirmation,
   présélection, revalidation à l'identique.
7. **E2E et clôture** : `e2e/fixtures/published.ts`, `e2e/questionnaire.spec.ts`, `pnpm verify`.

Les étapes 1 et 2 sont indépendantes ; 3 dépend des deux ; 4, 5 et 6 dépendent de 3 et sont
indépendantes entre elles ; 7 clôt.

## Risques et parades

| Risque | Parade |
|---|---|
| Avancement automatique déclenché par les flèches du clavier dans le groupe radio (un utilisateur clavier serait emporté à la question suivante en explorant les options) | `onCommit` distinct de `onChange` (R7) : les flèches sélectionnent sans avancer ; clic, Entrée et Espace valident et avancent ; bouton « Suivant » toujours disponible |
| Aucune version de banque publiée au moment de livrer (registre à `current: 0`) | lecture à l'exécution (R5) : la page affiche `questionnaire.noVersion` ; l'accueil garde le CTA inactif au build ; les e2e servent une banque fictive par interception (R6) et ne dépendent pas de la publication |
| Le répondant termine et atterrit sur une page absente (`/resultats` relève de la 005) | page de garde minimale conservant le fragment (R11), remplacée par la 005 ; le brouillon reste sur l'appareil (FR-026) |
| Hydratation : l'état mémorisé diffère du rendu serveur (accueil avec ou sans reprise, apparence) | lecture du stockage après montage via `useSyncExternalStore` avec instantané serveur « aucun brouillon » ; aucun texte dépendant du stockage dans le HTML statique |
| Deux onglets écrivent le même brouillon | écriture entière à chaque transition, horodatage `updatedAt` ; écoute de l'événement `storage` pour adopter l'état le plus récent (FR-020, cas limite « deux onglets ») |
| Changement de version de banque entre deux visites | `draft.bankVersion ≠ registry.current` ⇒ `ResumeCard` variante « version changée » : Recommencer / Effacer seulement, rien d'effacé sans confirmation (FR-024) |
| Double activation très rapide du même niveau | l'action `answer` porte la `position` visée ; le réducteur l'ignore si elle n'est pas la position courante (cas limite « deux fois très vite ») |
| Brouillon corrompu ou d'un ancien format | `DraftSchema` zod + champ `format: 1` ; toute lecture invalide vaut « aucun brouillon » et est journalisée en développement seulement |
| Taille du jeu publié chargé par le parcours | `main.json` ≤ 300 ko (budget 002), une requête, en-tête de cache immuable côté Vercel ; mesuré dans le quickstart |

## Complexity Tracking

Aucune dérogation à la constitution n'est nécessaire ; cette section reste vide.
