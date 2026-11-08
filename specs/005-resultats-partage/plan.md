# Implementation Plan: Résultats, détail par candidat et partage par URL

**Branch**: `005-resultats-partage` | **Date**: 2026-11-08 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/005-resultats-partage/spec.md`

La spécification a été clarifiée le 2026-11-08 (quatre réponses du propriétaire, section
« Clarifications » de la spec) ; le propriétaire a demandé d'enchaîner sur le plan, ce qui vaut
validation au sens du flux de travail de la constitution.

## Summary

Remplacer la page de garde `/resultats` de la 004 par la restitution complète d'un état de
résultat lu dans le **fragment** : classement des candidats classables (rang, « ex æquo »,
pourcentage tronqué, bande), section « Données insuffisantes », fiche d'un candidat (thèmes,
détail par question avec preuve et source), comparaison de deux ou trois candidats, partage du
lien (presse-papiers, repli manuel, partage natif) et gestion des liens corrompus, anciens ou
d'une version inconnue. La page est une **coquille d'interface** autour du cœur 003 : elle suit
le flux du contrat `core-api` (`decodeHeader` → `loadMain` → `decodeFragment` →
`selectQuestions` → `scoreCandidates`) et n'ajoute aucune règle de score. Une projection pure
(`src/lib/results`) transforme le `Scoreboard` en modèle d'affichage (ex æquo, ordre des thèmes,
paliers d'accord, regroupement des questions) testable sans DOM. Fiche et comparaison sont des
vues de la même page, empilées dans l'historique du navigateur sans changer l'adresse (R1). Le
fichier de détail d'un candidat n'est téléchargé qu'à l'ouverture de sa fiche (R5). La 005
ajoute à la 004 la conversion d'un état en brouillon (« Modifier mes réponses », avec
confirmation si un autre brouillon existe) et la variante « Voir mes résultats » de la carte de
reprise. Les e2e servent une banque fictive à deux versions (avec fichiers de détail) par
interception de route, comme la 004.

## Technical Context

**Language/Version**: TypeScript 5.9 (strict), Node.js 24, pnpm 12 (socle 001 inchangé)

**Primary Dependencies**: aucune nouvelle. Utilisées : Next.js 16.4 App Router en export
statique, React 19.3, next-intl 4.14 (`results.*`, `ui.*`), Tailwind 4 via tokens, `@/core`
(`decodeHeader`, `decodeFragment`, `bankFromDataset`, `selectQuestions`, `scoreCandidates`,
`encodeFragment`, types `Scoreboard`, `CandidateScore`, `Band`, `RejectionReason`),
`src/lib/dataset-client.ts` (étendu d'un chargeur de détail), `src/lib/questionnaire`
(brouillon, stockage, `resultHref`). API navigateur : Clipboard (`writeText`), Web Share
(`navigator.share`, facultative), History (`pushState`/`popstate`), `hashchange`.

**Storage**: aucun nouveau. Lecture et, après confirmation, écriture du brouillon de la 004
(`radar-questionnaire`) pour « Modifier mes réponses » ; l'état de résultat ne vit que dans le
fragment ; la comparaison et la vue ouverte ne vivent que dans `history.state` (non persistés).

**Testing**: Vitest `unit` (projection `src/lib/results` contre `EXAMPLE_A`/`EXAMPLE_B` et des
tableaux de scores construits, chargement et classification des liens, `draftFromResultState`
et report par identifiant, partage avec presse-papiers simulé ; composants avec Testing
Library) ; projets Vitest `storybook` / `storybook-sombre` (stories des nouveaux composants, a11y
bloquante dans les deux apparences) ; Playwright `chromium` contre `out/` :
`e2e/results.spec.ts` (classement et données insuffisantes, partage et réouverture dans un
contexte vierge, liens corrompu / ancien / inconnu / absent, fiche, comparaison, modification,
trafic réseau) avec `servePublished` étendu (deux versions, détails par candidat).

**Target Platform**: navigateurs evergreen mobiles et desktop à partir de 320 px ; export
statique servi par Vercel Hobby ; aucune fonction serveur

**Project Type**: application web statique, projet unique (route App Router + composants
`src/ui` + projection et chargement dans `src/lib/results`)

**Performance Goals**: classement visible < 2 s après ouverture d'un lien sur téléphone d'entrée
de gamme (SC-006) : une requête registre + une requête `main.json` (≤ 300 ko, cache immuable),
calcul local (sélection + classement complet borné à 500 ms par le test de performance de la
003, mesuré bien en dessous) ; JS initial de `/resultats` ≤ 200 ko compressés hors données (même
budget que la 004) ; fichier de détail ≤ 150 ko (budget 002) chargé à l'ouverture d'une fiche

**Constraints**: aucune règle de score hors `src/core` (principe III) ; aucune requête portant
le fragment, une réponse, un sujet clé ou un résultat (FR-042, SC-003) ; query string vide
(FR-024) ; aucune chaîne en dur ; tokens seulement ; clavier et lecteur d'écran (FR-037) ;
320 px sans défilement horizontal (FR-038) ; thèmes clair et sombre ; couleurs de série
attribuées par emplacement de comparaison, jamais par candidat ni parti (FR-039)

**Scale/Scope**: 1 route (`/resultats`, remplace la page de garde) + 3 vues internes (classement,
fiche, comparaison) ; modification de l'accueil (`ResumePrompt`) et de `ResumeCard` ;
1 module `src/lib/results` (~6 fichiers) ; 1 fonction ajoutée à `src/lib/questionnaire` ;
1 chargeur ajouté à `dataset-client` ; 7 nouveaux composants `src/ui` ; ~70 clés i18n ;
6 groupes de scénarios Playwright ; jusqu'à 22 candidats, 16 thèmes, 25 ou 100 questions

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principe | Exigence applicable | Comment le plan y répond | Statut |
|---|---|---|---|
| I. Neutralité et traçabilité | chaque chiffre remonte à une source ; libellés neutres ; positions figées par version | la fiche affiche, pour chaque position connue, badge de preuve, citation et source (titre, date, lien) issues du fichier de détail **de la version du lien** (R5) ; seuls les libellés fermés de bande et de palier qualifient la relation (FR-040, liste fermée dans `i18n-messages.md`) ; un ancien lien est calculé avec sa propre version (R2) | ✅ |
| II. Vie privée | état dans le fragment seulement ; rien envoyé ; pas de traceur | lecture de `location.hash` côté client uniquement ; requêtes même origine sans paramètre (`/data/versions.json`, `/data/versions/<n>/main.json`, `/data/versions/<n>/candidates/<id>.json` à l'ouverture d'une fiche, R5) ; aperçu générique statique (R6) ; test e2e d'observation du trafic (SC-003) | ✅ |
| III. Cœur métier pur | score, sélection, codec dans `src/core` | flux `core-api` appelé tel quel ; la projection `src/lib/results` ne fait que trier pour l'affichage, compter et traduire des identifiants (rang, ex æquo et bande viennent du cœur ; le palier d'accord est une lecture directe de la concordance exacte, R3) ; `src/core` n'est pas modifié | ✅ |
| IV. Design system d'abord | composants dans `src/ui`, stories, a11y, tokens, 320 px, clair/sombre, couleurs non partisanes | 7 composants + 1 variante (`ResumeCard`), chacun avec story (états, 320 px), test et a11y dans les deux projets Storybook ; 3 tokens de série doublés d'un repère de forme, attribués par emplacement (R9) | ✅ |
| V. Tests comme contrat, CI bloquante | e2e « résultats » et « ouverture d'un lien partagé » | `e2e/results.spec.ts` couvre les deux parcours de la constitution et les liens invalides ; banque fictive par interception (R11), exécutable en CI sans publication réelle ; CI inchangée | ✅ |
| VI. i18n | aucune chaîne en dur ; formats français | clés `results.*` et `ui.*` ; dates de version via `formatPublishedAt` / `useFormatter` ; pluriels ICU (positions inconnues, candidats retirés) | ✅ |
| VII. Simplicité, statique, sobriété | pas de backend, projet unique, données légères | aucune dépendance ; une route statique ; détail chargé à la demande ; aucune image de partage générée | ✅ |
| Flux de travail | données et code séparés | aucune donnée de corpus modifiée par cette fonctionnalité | ✅ |

**Pré-recherche** : aucun écart. **Post-conception** : aucun écart. Le chargement de la version
courante en plus de celle d'un ancien lien (R4) ne sert qu'à poser la mention « ne se présente
plus » ; aucune position courante n'entre dans un calcul (FR-033).

## Project Structure

### Documentation (this feature)

```text
specs/005-resultats-partage/
├── plan.md                      # ce fichier
├── research.md                  # R1–R13 : vues, flux de chargement, projection, détail, partage, modification, e2e
├── data-model.md                # états de la page, modèle d'affichage, vues, historique, report par identifiant
├── quickstart.md                # scénarios de validation par user story
├── contracts/
│   ├── routes-and-views.md      # route /resultats, états de chargement, vues et historique, hashchange
│   ├── results-model.md         # API de src/lib/results (projection, chargement, partage)
│   ├── components.md            # props et a11y des nouveaux composants + variante ResumeCard
│   ├── data-and-share.md        # chargeur de détail, trafic autorisé, lien et aperçu, modification des réponses
│   └── i18n-messages.md         # clés ajoutées à fr.json, listes fermées de libellés
├── checklists/requirements.md
└── tasks.md                     # produit par /speckit-tasks (pas par ce plan)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── ResumePrompt.tsx                     # + variante « terminé » : Voir mes résultats (FR-035a)
│   └── resultats/
│       ├── page.tsx                         # métadonnées génériques (FR-029) + <ResultsApp/> client ; remplace la page de garde
│       └── ResultsApp.tsx                   # lecture du fragment, états de chargement, vues, historique
├── lib/
│   ├── dataset-client.ts                    # + loadDetail(version, id) : fichier de détail, mémoïsé (+ test)
│   ├── questionnaire/
│   │   └── from-result.ts                   # draftFromResultState + report par identifiant (+ test) ; R14 de la 004
│   └── results/
│       ├── types.ts                         # PageState, ResultsView, RankingRow, ThemeRow, QuestionRow, ViewState
│       ├── load.ts                          # flux core-api : fragment → PageState (+ test, fetcher simulé)
│       ├── view-model.ts                    # Scoreboard → classement, données insuffisantes, fiche, comparaison (+ test, SC-001)
│       ├── agreement.ts                     # concordance exacte → palier (5 identifiants) (+ test)
│       ├── history.ts                       # vues dans history.state, popstate (+ test)
│       └── share.ts                         # copie, repli, partage natif, texte générique (+ test)
├── ui/
│   ├── RankingList/                         # classement : rang, ex æquo, nom, % (ScoreBar), bande, Ouvrir, Comparer
│   ├── InsufficientList/                    # candidats grisés : mention « N positions inconnues sur M », Ouvrir, Comparer
│   ├── ThemeScoreList/                      # thèmes ordonnés (sujets clés distingués), % ou « — », couverture
│   ├── QuestionDetail/                      # une ligne : énoncé, réponse, position, palier, EvidenceBadge, citation, source
│   ├── ComparisonTable/                     # 2–3 candidats : global, puis thèmes ; marqueurs de série ; 320 px
│   ├── SharePanel/                          # bouton, confirmation annoncée, champ de repli, partage natif, aperçu
│   ├── ResultsHeader/                       # rappel sujets clés, mode, nombre de réponses, phrase de plafonnement
│   └── ResumeCard/                          # + statut « complete » : Voir mes résultats / Recommencer
├── ui/tokens.css                            # + --color-series-1..3 (clair et sombre)
└── i18n/messages/fr.json                    # + results.*, ui.rankingList.*, ui.themeScoreList.*, ui.questionDetail.*, ui.comparisonTable.*, ui.sharePanel.*, ui.resultsHeader.*, ui.resumeCard.complete*

e2e/
├── fixtures/published.ts                    # + deux versions, un candidat retiré, une position changée, fichiers de détail
└── results.spec.ts                          # US1 à US5, liens invalides, trafic, clavier
```

**Structure Decision** : projet unique conservé (principe VII). Le flux de chargement et la
projection vivent dans `src/lib/results` (hors `src/core`, car ils manipulent réseau,
historique et libellés ; hors `src/ui`, car ils n'affichent rien), sur le modèle de
`src/lib/questionnaire`. Une seule route statique `/resultats` : la fiche et la comparaison sont
des vues internes portées par `history.state` (R1, clarification du 2026-11-08), ce qui garde
l'adresse égale au lien de partage. La conversion état → brouillon rejoint
`src/lib/questionnaire`, propriétaire du brouillon.

## Approche de mise en œuvre (ordre proposé pour /speckit-tasks)

1. **Fondations** : types, `agreement`, `view-model` (contre `EXAMPLE_A`/`EXAMPLE_B`), `load`
   (classification des liens, versions), `history`, `share`, `loadDetail` ; clés i18n ;
   tokens de série.
2. **Composants** (parallélisables) : `ResultsHeader`, `RankingList`, `InsufficientList`,
   `ThemeScoreList`, `QuestionDetail`, `ComparisonTable`, `SharePanel`, variante `ResumeCard`.
3. **US1 – classement** : `ResultsApp` (états, classement, données insuffisantes, aucun
   classable, plafonnement, Méthodologie) ; métadonnées génériques.
4. **US2 – partage et réouverture** : `SharePanel` branché, réouverture, `draftFromResultState`,
   confirmation de remplacement, retour aux résultats recalculés ; carte « Voir mes résultats ».
5. **US3 – liens invalides et anciens** : rejet, version inconnue, version antérieure (avertissement
   daté, « ne se présente plus », report par identifiant pour « Refaire »), lien absent.
6. **US4 – fiche** : vue fiche, chargement du détail, thèmes, questions, passées, non répondues.
7. **US5 – comparaison** : sélection, limite de trois, vue, retrait, historique.
8. **E2E et clôture** : fixtures à deux versions, `e2e/results.spec.ts`, `pnpm verify`.

1 et 2 sont indépendantes ; 3 dépend des deux ; 4 à 7 dépendent de 3 et sont indépendantes entre
elles, mais toutes modifient `ResultsApp.tsx` (séquentiel sur une branche) ; 8 clôt.

## Risques et parades

| Risque | Parade |
|---|---|
| Aucune version publiée au moment de livrer (`current = 0`) | état `no-version` (même texte que la 004) ; e2e sur banque fictive par interception (R11) |
| Un fragment hostile (très long, caractères inattendus) bloque la page | `decodeHeader` rejette avant tout chargement (longueur et alphabet) ; aucune boucle sur la longueur du fragment hors codec ; test e2e avec un fragment de 10 000 caractères |
| Fuite du fragment dans une requête (préchargement, en-tête `Referer`) | le fragment n'est jamais transmis par le navigateur ; liens sortants vers les sources en `rel="noopener noreferrer"` ; aucune URL construite avec l'état ; test d'observation du trafic (SC-003) |
| Ancien lien dont la version n'est plus servie | les versions sont immuables et conservées (002, `PUB-IMMUTABLE`) ; une erreur réseau sur une version antérieure affiche l'état `error` avec « Réessayer », jamais des chiffres d'une autre version |
| Retour arrière incohérent entre vues (fiche ouverte, puis lien modifié à la main) | `hashchange` réinitialise la vue au classement et remplace l'entrée d'historique ; `popstate` ne lit que `history.state.view` (R1) |
| Libellé orienté ou couleur partisane | listes fermées de libellés (bandes, paliers) contrôlées par test i18n ; couleurs de série par emplacement, doublées d'une forme (R9) |
| Remplacement involontaire d'un questionnaire en cours | comparaison stricte de l'état du brouillon et de celui du lien ; `ConfirmDialog` si différents (clarification du 2026-11-08) |
| Presse-papiers refusé (iframe, navigateur ancien, permissions) | repli par champ sélectionnable avec consigne ; `navigator.share` proposé seulement s'il existe (R6) |
| Hydratation : rien du résultat ne doit être dans le HTML statique | `ResultsApp` lit le fragment après montage ; HTML statique = titre générique et état « chargement » |

## Complexity Tracking

Aucune dérogation à la constitution n'est nécessaire ; cette section reste vide.
