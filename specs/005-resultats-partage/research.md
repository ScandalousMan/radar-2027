# Research : Résultats, détail par candidat et partage par URL

Décisions de conception de la 005. Chaque entrée : décision, justification, alternatives
écartées. Les décisions marquées « clarification » ont été tranchées par le propriétaire le
2026-11-08 (spec, section « Clarifications »).

## R1. Une route, trois vues portées par l'historique (clarification)

- **Décision** : une seule page statique `/resultats`. Le classement, la fiche d'un candidat et
  la comparaison sont des vues de cette page. Ouvrir une fiche ou une comparaison appelle
  `history.pushState({ radarResults: view }, '', location.href)` : l'adresse, fragment compris,
  ne change pas. `popstate` lit `history.state?.radarResults` et affiche la vue correspondante
  (classement par défaut), en restaurant la position de défilement du classement mémorisée au
  départ. Une modification manuelle du fragment (`hashchange`) recalcule tout et remet la vue au
  classement (`replaceState`).
- **Justification** : le format de lien `1.` est figé (003) et ne peut pas porter de vue ;
  l'adresse reste égale au lien de partage (FR-022) ; le bouton précédent se comporte comme
  attendu sur mobile ; aucune route dynamique en export statique.
- **Alternatives** : routes `/resultats/candidat/[id]#…` (paramètres connus seulement pour la
  version courante au build, cassées pour les anciens liens ; fragment à recopier à chaque
  navigation) ; vue dans la query string (interdit par FR-024) ; dialogues modaux sans historique
  (le bouton précédent quitterait la page).

## R2. Flux de chargement et états de la page

- **Décision** : `loadResults(hash, fetcher)` dans `src/lib/results/load.ts` suit le contrat
  `core-api` :
  1. fragment vide ou `#` ⇒ `no-fragment` (FR-035, aucun message d'erreur) ;
  2. `loadRegistry` ; `current = 0` ⇒ `no-version` ;
  3. `decodeHeader(hash, current)` ; `unknown-bank-version` ⇒ `unknown-version` (FR-034) ; autre
     rejet ⇒ `invalid` (FR-031) ;
  4. `loadMain(v)` de la version du lien ; si `v < current`, `loadMain(current)` en parallèle
     pour les seuls identifiants de candidats (R4) ;
  5. `bankFromDataset`, `decodeFragment(hash, bank)` ; rejet ⇒ `invalid`, sauf
     `unknown-bank-version` (incohérence de banque, impossible sur un jeu publié) ⇒
     `error: internal` ;
  6. `selectQuestions`, `scoreCandidates({ …, versionCount: current })` ⇒ `ready`.
  Erreur réseau ou jeu invalide ⇒ `error` avec « Réessayer ». `StateError` ou `BankError`
  (programmation ou configuration) ⇒ `error` également, journalisée en développement.
- **Justification** : un seul ordre de vérification, celui du codec ; aucune donnée d'une autre
  version n'entre dans le calcul (FR-040 de la 003) ; un lien invalide n'affiche jamais de
  chiffre (SC-005).
- **Alternatives** : décoder avec la banque courante puis corriger (mélangerait les versions) ;
  afficher un résultat partiel en cas d'échec réseau sur l'ancienne version (chiffres faux).

## R3. Projection d'affichage pure (`src/lib/results/view-model.ts`)

- **Décision** : fonctions pures du `Scoreboard` vers des lignes prêtes à afficher :
  - **classement** : ordre et rang du cœur ; `tied = true` si un autre candidat classé a le même
    rang ; bande = identifiant `Band` du cœur ;
  - **données insuffisantes** : ordre du cœur ; `unknown = answeredCount − coverage.known`
    (0 position connue si couverture nulle), `answered = answeredCount` ;
  - **thèmes d'une fiche** : thèmes prioritaires d'abord (ordre canonique), puis les autres
    (ordre canonique), ou la ligne `others` en mode court ; pourcentage tronqué ou `null` (« — ») ;
    couverture `x positions connues sur y questions répondues` par thème, comptée sur les
    questions du thème ;
  - **questions** : regroupées par thème principal dans l'ordre des thèmes ci-dessus, chaque
    question une seule fois (FR-018) ; trois listes : répondues, passées, nombre de non répondues ;
  - **palier d'accord** (`agreement.ts`) : lecture de la concordance exacte `Ratio` du cœur,
    `(2 − |u − c|) / 2` ∈ {1, 3/4, 1/2, 1/4, 0} ⇒ `identical`, `close`, `intermediate`, `distant`,
    `opposite`.
- **Justification** : la page ne recalcule aucun score (principe III) ; le palier est une
  traduction bijective d'une valeur exacte fournie par le cœur, comme la bande ; tout est testable
  contre les exemples A et B (SC-001).
- **Alternatives** : calculer les paliers dans `src/core` (modifierait un contrat gelé pour un
  libellé) ; dériver les paliers d'un pourcentage arrondi (ambigu).

## R4. Ancien lien : candidats qui ne se présentent plus

- **Décision** : pour `v < current`, le résultat est calculé uniquement avec `main.json` de `v`.
  La mention « ne se présente plus » est posée sur tout candidat de `v` absent de
  `candidates` de la version courante ; l'avertissement de version dénombre ces candidats. La
  version courante est chargée en parallèle et seule sa liste d'identifiants est lue.
- **Justification** : FR-032 et FR-033 (positions figées, aucune donnée courante mélangée) ; le
  registre ne porte que des comptes, pas de liste d'identifiants.
- **Alternatives** : lire `withdrawn` de la version courante (ne couvre pas un candidat retiré
  puis réintégré, ni les changements d'identifiant) ; ne rien signaler (contraire à FR-033).

## R5. Fichier de détail chargé à l'ouverture d'une fiche (clarification)

- **Décision** : `loadDetail(version, candidateId)` ajouté à `dataset-client.ts` :
  `GET /data/versions/<v>/candidates/<id>.json`, `cache: 'force-cache'`, validation par
  `CandidateDetailSchema` chargé à la demande, mémoïsé par `(v, id)`. Appelé à l'ouverture de
  la fiche seulement, avec la version **du lien**. Aucun préchargement (ni au survol, ni dans
  l'ordre du classement). Pendant le chargement, la fiche affiche thèmes et lignes de question
  (énoncé, réponse, position, palier, badge : tous dans `main.json`) ; citations et sources
  apparaissent ensuite. Échec ⇒ message dans la fiche, chiffres conservés.
- **Justification** : la requête révèle quel candidat est consulté, jamais les réponses (FR-042
  précisé) ; poids limité à ≤ 150 ko par fiche ouverte.
- **Alternatives** : tout charger au départ (~18 × 150 ko) ; précharger le premier classé
  (révélerait le résultat).

## R6. Partage : presse-papiers, repli, partage natif, aperçu générique

- **Décision** : lien partagé = `location.origin + '/resultats' + location.hash` (jamais de
  query string, même si l'adresse courante en porte une). `navigator.clipboard.writeText` ;
  succès ⇒ message « Lien copié » dans une région `aria-live="polite"` ; échec ou API absente ⇒
  champ `readonly` présélectionné avec consigne de copie manuelle. Si `navigator.share` existe,
  bouton « Partager… » avec `{ title, text, url }` génériques (FR-030). Les métadonnées de
  `/resultats` (`title`, `description`, `openGraph`) sont statiques et génériques ; le panneau
  de partage affiche ces deux textes comme aperçu (FR-029). Aucune image de partage.
- **Justification** : l'aperçu des messageries ne peut pas dépendre du fragment (page statique) ;
  le texte montré est celui servi, donc vérifiable.
- **Alternatives** : `document.execCommand('copy')` (obsolète) ; aperçu personnalisé (impossible
  sans serveur, hors périmètre).

## R7. « Modifier mes réponses » et « Refaire le questionnaire »

- **Décision** : « Modifier mes réponses » et « Refaire le questionnaire avec les données
  actuelles » (avertissement de version) déclenchent le même flux ; `ReadyData.currentBank`
  fournit la version courante (déjà chargée pour R4). `draftFromResultState(state, bank, now)`
  (point d'extension prévu par la 004)
  dans `src/lib/questionnaire/from-result.ts`. Même version que la courante : brouillon identique
  à l'état, `position` = première question non répondue, sinon 0 (le répondant relit depuis le
  début ; « Terminer » le ramène à l'écran de fin puis aux résultats recalculés). Version
  antérieure : `carryOver(state, oldBank, currentBank)` recalcule la sélection courante pour le
  même mode et les sujets clés encore présents, et reporte chaque réponse par identifiant de
  question ; si moins de 3 sujets clés subsistent, le répondant arrive à l'étape « sujets clés »
  avec les sujets restants présélectionnés et aucun brouillon n'est écrit. Avant toute écriture :
  si un brouillon existe et diffère (version, mode, sujets, réponses), `ConfirmDialog` ; refus ⇒
  rien n'est écrit, le répondant reste sur les résultats (clarification).
- **Justification** : la 004 sait reprendre un brouillon complet ; FR-038 de la 003 impose
  d'encoder un nouveau résultat avec la version courante ; FR-024 de la 004 (rien d'effacé sans
  confirmation).
- **Alternatives** : modifier dans l'ancienne version (contraire à FR-038 de la 003) ; repartir
  de zéro (perd les réponses).

## R8. Carte « Voir mes résultats » à l'accueil (clarification)

- **Décision** : `ResumeCard` reçoit un statut `complete` (aucune réponse `'unanswered'`) : action
  principale « Voir mes résultats », secondaire « Recommencer », mention de la date. `ResumePrompt`
  charge alors `main.json` de la version du brouillon et calcule `resultHref` (même lien que
  l'écran de fin). Si la version du brouillon n'est plus la courante, la notice « version
  changée » reste affichée et le lien mène au résultat de l'ancienne version (avertissement daté
  sur la page de résultats).
- **Justification** : un questionnaire terminé n'est plus « en cours » ; même lien que la fin de
  la 004, donc mêmes chiffres.
- **Alternatives** : mémoriser le dernier lien de résultats (seconde clé de stockage, inutile).

## R9. Couleurs de comparaison par emplacement

- **Décision** : trois tokens `--color-series-1..3` (clair et sombre, contraste ≥ 3:1 sur
  `surface`), attribués selon l'ordre d'ajout à la comparaison (1er, 2e, 3e), jamais selon le
  candidat. Chaque série est doublée d'une forme (rond, triangle, carré) et du nom. Teintes
  choisies hors des couleurs dominantes des grands partis (pas de rouge, bleu roi, vert vif,
  orange) : sarcelle (accent existant), ocre, prune ; validées par le test de contraste des tokens.
- **Justification** : FR-039 et principe IV ; aucun candidat n'est associé durablement à une
  couleur.
- **Alternatives** : couleur fixe par candidat (association implicite, risque partisan) ;
  monochrome (identification plus lente).

## R10. Disposition de la comparaison à 320 px

- **Décision** : pas de tableau large : un bloc par thème (libellé du thème sur toute la largeur,
  puis une ligne par candidat : forme, nom abrégé à la ligne si besoin, pourcentage ou « — ») ;
  bloc d'en-tête pour le score global ou « données insuffisantes ». À partir de 640 px, tableau à
  colonnes (sémantique `<table>` avec en-têtes de ligne et de colonne).
- **Justification** : FR-021 sans défilement horizontal ; lecteur d'écran : en-têtes associés.
- **Alternatives** : tableau avec défilement horizontal interne (interdit à 320 px pour la page,
  pénible au doigt).

## R11. E2E : banque fictive à deux versions avec détails

- **Décision** : `e2e/fixtures/published.ts` étendu : version 1 et version 2 du jeu synthétique ;
  en v2, un candidat retiré, un ajouté et une position modifiée ; `servePublished` sert aussi
  `/data/versions/<n>/candidates/<id>.json` générés (citation et source fictives,
  `https://exemple.invalid/…`). Liens fabriqués par `encodeFragment` dans les tests. Réouverture
  « navigateur vierge » par `browser.newContext()`. Trafic observé par `page.on('request')`.
- **Justification** : comme R6 de la 004 : rien de fictif sous `public/data`, CI indépendante de
  la publication réelle.
- **Alternatives** : jeu publié de test sous `public/data` (interdit) ; mocks au niveau des
  modules (ne testerait pas l'export).

## R12. Annonces et focus

- **Décision** : à l'ouverture d'une vue, focus sur son titre (`h1`/`h2` `tabIndex={-1}`) ; au
  retour au classement, focus sur l'entrée du candidat quitté. Régions `aria-live="polite"` pour
  « Lien copié », ajout/retrait de comparaison et limite atteinte ; message de lien invalide en
  `role="alert"`.
- **Justification** : FR-037, même convention que la 004 (focus sur le titre à chaque changement).

## R13. Accès sans fragment et page statique

- **Décision** : HTML statique de `/resultats` = titre générique et squelette de chargement ;
  aucun chiffre ni nom. Sans fragment : invitation à commencer, ou carte de reprise (même
  composant que l'accueil, R8) s'il existe un brouillon.
- **Justification** : FR-035 ; aucune donnée personnelle dans le HTML servi.
