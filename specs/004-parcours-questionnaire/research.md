# Recherche : parcours questionnaire

**Feature** : `004-parcours-questionnaire` · **Date** : 2026-11-08 · **Plan** : [plan.md](plan.md)

Le contexte technique ne contenait aucun `NEEDS CLARIFICATION` : la pile est imposée par la
constitution et le socle 001, les règles métier par la 003. Les points ci-dessous sont les
décisions de conception à trancher avant d'écrire le modèle et les contrats. Celles marquées
**(à valider)** méritent un regard du propriétaire avant `/speckit-tasks` car elles engagent la
005 ou l'expérience en production.

## R1. Quatre routes statiques sous un layout client commun

- **Décision** : `/questionnaire` (sujets clés), `/questionnaire/mode`, `/questionnaire/questions`,
  `/questionnaire/fin`, toutes exportées statiquement ; `src/app/questionnaire/layout.tsx` est
  un composant client qui porte le fournisseur d'état (banque chargée + brouillon) et survit
  aux navigations entre ces pages. Chaque page vérifie l'étape requise et redirige vers l'étape
  manquante (`router.replace`) sans message technique.
- **Justification** : des URL distinctes par écran donnent au bouton « précédent » du navigateur
  un sens évident (mode → sujets, questions → mode), aux tests e2e des points d'entrée clairs, et
  respectent FR-022 : aucune URL ne porte de donnée. Un layout App Router conserve son état
  entre pages enfants, ce qui évite de recharger le jeu publié à chaque étape.
- **Alternatives** : une seule route avec étapes en état interne (le bouton précédent du
  navigateur quitte alors le site) ; étapes dans le fragment `#sujets` (le fragment est
  réservé à l'état complet des résultats par la constitution, et un `#q12` serait trompeur).

## R2. Navigation entre questions par `history.pushState` sans changer l'URL

- **Décision** : sur `/questionnaire/questions`, chaque changement de question appelle
  `window.history.pushState({ position }, '', location.href)` (première question :
  `replaceState`). Un écouteur `popstate` lit `state.position` et déclenche l'action `goTo`. En
  arrière depuis la première question, l'historique revient naturellement à `/questionnaire/mode`.
- **Justification** : cas limite « bouton précédent du navigateur » de la spec : revenir à la
  question précédente sans perte. Next 16 prend en charge `pushState` / `replaceState` natifs
  avec l'App Router (routage superficiel) ; l'URL reste `/questionnaire/questions` (FR-022).
- **Alternatives** : une route par question `/questionnaire/questions/12` (100 pages statiques
  par mode, ou route dynamique interdite en export) ; ignorer le bouton précédent (perte de
  réponses ou écran incohérent, rejeté par la spec).

## R3. État du parcours : réducteur pur dans `src/lib/questionnaire`, hors `src/core`

- **Décision** : un type `Draft` (brouillon) et un réducteur `reduce(draft, action)` pur,
  déterministe (l'horodatage est porté par l'action, jamais lu dans le réducteur), testé
  unitairement et par propriétés fast-check (toute suite d'actions valides conserve
  `answers.length = selection.items.length`, `0 ≤ position < N`, pas de réponse hors
  `Answer`). Le réducteur ne contient aucune règle de score ni de sélection : il stocke des
  réponses à des positions et déplace un curseur.
- **Justification** : le principe III réserve `src/core` aux règles métier pures (score,
  sélection, codec) ; la mécanique d'écran (position, étape, brouillon) n'en fait pas partie et
  ne doit pas y entrer. La séparer des composants la rend testable sans DOM et réutilisable par
  la 005 (pré-remplissage). Les bornes (`MIN_PRIORITIES`, `MAX_PRIORITIES`, `TARGET_COUNT`,
  `MIN_THEME_QUESTIONS`) sont importées de `@/core`, jamais redéclarées.
- **Alternatives** : état dans les composants (`useState` dispersés, intestable, bogues de
  synchronisation avec le stockage) ; bibliothèque d'état (dépendance inutile, principe VII) ;
  placer le brouillon dans `src/core` (hors de son rôle, et il parle de stockage).

## R4. Persistance : une clé `localStorage`, format versionné, écriture à chaque transition

- **Décision** : clé `radar-questionnaire`, valeur JSON `{ format: 1, bankVersion, mode,
  priorities, answers, position, updatedAt }` validée par un schéma zod à la lecture ; toute
  valeur absente, invalide ou de `format` inconnu vaut « aucun brouillon ». Écriture complète
  après chaque action à partir de la première question affichée (FR-020) ; jamais avant
  (cas limite « ferme pendant le choix des sujets »). Effacement par `removeItem` (FR-023).
  Indisponibilité détectée par une écriture d'essai au démarrage des questions ; si elle
  échoue, un `Notice` prévient (FR-025) et le parcours continue en mémoire. L'événement
  `storage` est écouté pour adopter un brouillon plus récent écrit par un autre onglet
  (cas limite « deux onglets »).
- **Justification** : la constitution autorise explicitement le stockage local pour la reprise
  (principe II) ; une seule clé rend l'effacement complet trivial et vérifiable en e2e ; le
  schéma protège contre un ancien format après une mise à jour du site. Même approche
  tolérante que `src/lib/appearance.ts` (stockage injectable pour les tests).
- **Alternatives** : `sessionStorage` (perdu à la fermeture de l'onglet, contraire à US3) ;
  IndexedDB (asynchrone et surdimensionné pour 1 ko) ; cookie (interdit par le principe II).

## R5. Lecture du jeu publié à l'exécution, même origine **(à valider)**

- **Décision** : le fournisseur du layout charge `fetch('/data/versions.json')` puis
  `fetch('/data/versions/<current>/main.json')`, valide avec `MainDatasetSchema`, construit
  `bankFromDataset` et une projection `QuestionnaireBank` (thèmes avec description, questions,
  version). Un module `src/lib/dataset-client.ts` expose `loadRegistry()` et `loadMain(version)`
  avec cache mémoire, réutilisable par la 005 (version courante et versions antérieures). Si
  `current = 0`, la page affiche `questionnaire.noVersion` ; l'accueil, rendu au build, garde
  le bouton « Commencer » inactif tant que `loadRegistry()` serveur renvoie `current = 0`.
- **Justification** : (1) aucune version n'est publiée aujourd'hui (`public/data/versions.json`
  à `current: 0`) et le parcours doit pouvoir être livré et testé avant la première
  publication ; (2) les tests e2e interceptent `/data/**` et servent une banque fictive sans
  rebâtir le site (R6) ; (3) la 005 doit de toute façon charger une version antérieure à
  l'exécution : un seul chargeur ; (4) la détection « version changée » à la reprise (FR-024)
  compare `draft.bankVersion` au registre réellement servi. Coût : un état de chargement et
  une requête ≤ 300 ko (budget 002), même origine, sans paramètre, immuable donc cachée.
- **Alternatives** : intégrer la projection au build dans le HTML (plus rapide au premier
  affichage, mais les e2e exigeraient un second build avec un répertoire de données fictif, et
  l'accueil comme le questionnaire ignoreraient une version publiée après le build Vercel — ce
  dernier point est théorique puisque la publication redéploie, mais la première raison suffit).
  Le contrat `published-dataset.md` de la 002 indiquait « version courante importée au build »
  pour la page Méthodologie, qui reste inchangée.

## R6. Banque fictive pour Playwright par interception de route

- **Décision** : `e2e/fixtures/published.ts` sérialise `syntheticDataset({ themes: 16,
  perTheme: 20 })` de `src/core/bank/fixtures.ts` (import relatif, Playwright compile le
  TypeScript) en un registre `{ current: 1 }` et un `main.json`, et expose
  `servePublished(page)` qui répond aux requêtes `**/data/versions.json` et
  `**/data/versions/1/main.json`. Les tests lisent le même jeu pour calculer `N` attendu via
  `selectQuestions`.
- **Justification** : les parcours e2e sont exigés par la constitution (principe V) et doivent
  passer en CI avant toute publication réelle ; la banque fictive partage les invariants de la
  002 (déjà validée par les tests de la 003). Quand une version réelle existera, les tests
  continueront d'utiliser la fictive : ils vérifient le parcours, pas le contenu.
- **Alternatives** : attendre la publication (parcours non testé en CI) ; commiter un
  `main.json` fictif sous `public/data` (données factices servies en production, inacceptable).

## R7. Avancement automatique : `onCommit` distinct de `onChange`

- **Décision** : `LikertChoice` reçoit une nouvelle prop optionnelle `onCommit(answer)` appelée
  lors d'une **activation explicite** (clic ou toucher sur une option, Entrée ou Espace sur
  l'option focalisée), tandis que `onChange` continue de suivre toute sélection (y compris par
  flèches). Le parcours enregistre la réponse sur `onChange` et avance sur `onCommit` ; un bouton
  « Suivant » est toujours présent (actif dès qu'une réponse ou « passée » existe) pour avancer
  après une sélection aux flèches ou après une correction (FR-014). Au changement de question,
  le focus est posé sur l'énoncé (`h2 tabIndex={-1}`) et une zone `aria-live="polite"` annonce
  « Question n sur N ».
- **Justification** : FR-013 impose l'avancement sans action supplémentaire pour le cas
  courant (toucher, clic, Entrée) ; mais avancer à chaque flèche emporterait un utilisateur
  clavier qui parcourt les options (FR-032). La distinction est la pratique recommandée pour
  les groupes radio à effet immédiat. L'extension est rétrocompatible (prop optionnelle) ; la
  story et le test de `LikertChoice` sont complétés.
- **Alternatives** : avancer sur `onChange` avec délai (fragile, toujours piégeux au clavier) ;
  ne jamais avancer automatiquement (contraire à FR-013) ; bouton « Suivant » seul (une action
  de plus par question, 100 fois).

## R8. Écran de mode : nombre exact de questions calculé

- **Décision** : une fois les sujets clés connus, le fournisseur calcule
  `selectQuestions(bank, mode, priorities)` pour les deux modes ; `ModeChoice` affiche le nombre
  réel (`items.length`, par exemple « 25 questions », « 96 questions » si la banque est plus
  petite que 100) et une durée indicative issue de `fr.json` (`ui.modeChoice.short.duration`,
  `…full.duration`). La sélection du mode choisi est conservée telle quelle pour l'étape
  questions (FR-015 : `N` connu dès la première question).
- **Justification** : la spec annonce « environ 25 » et « au plus 100 » ; afficher la valeur
  exacte évite tout « N » changeant (cas limite « thème avec moins de questions ») et coûte deux
  appels purs de quelques millisecondes (SC-004 de la 003).
- **Alternatives** : afficher les constantes `TARGET_COUNT` (faux si la banque compte 96
  questions).

## R9. Écran de fin : comptes par sujet clé et seuil de fiabilité

- **Décision** : `summarize(draft, bank, selection)` renvoie, pour chaque sujet clé en ordre
  canonique, `{ themeId, answered, skipped, unanswered, reliable }` où une question compte pour
  chacun de ses thèmes (`question.themeIndices`), `answered` = réponses numériques, et
  `reliable = answered ≥ MIN_THEME_QUESTIONS` (constante de `@/core`, valeur 2). L'avertissement
  (FR-029) est affiché si au moins un sujet clé n'est pas fiable ; l'accès aux résultats reste
  possible (FR-028).
- **Justification** : aligné sur la règle de score de la 003 (score de thème indéfini sous
  2 questions exploitables, FR-004) sans la réimplémenter : seule la constante est partagée, le
  calcul du score reste dans `src/core/score`. Compter une question à deux thèmes dans les deux
  est le comportement du mode complet de la 003.
- **Alternatives** : appeler `scoreCandidates` pour détecter les thèmes indéfinis (exige les
  positions des candidats et mélange parcours et résultats).

## R10. Remise aux résultats : état complet dans le fragment via le codec de la 003

- **Décision** : à l'écran de fin, `resultStateFromDraft(draft, bank)` construit un
  `ResultState` (`bankVersion`, `mode`, `priorities` normalisées par `normalizePriorities`,
  `answers` dans l'ordre de présentation, `'unanswered'` pour toute question non atteinte) et
  `encodeFragment(state, bank)` produit `#1.…` ; le bouton « Voir mes résultats » est un lien
  vers `/resultats` + fragment. Le brouillon reste sur l'appareil (FR-026).
- **Justification** : FR-030 exige la transmission de l'état complet ; la constitution impose le
  fragment et la bijection, que le codec garantit (SC-002 de la 003). Un lien (et non un
  `router.push`) laisse le répondant copier l'adresse et fonctionne sans JavaScript côté
  résultats.
- **Alternatives** : passer l'état par le stockage local ou un état React vers la page de
  résultats (la 005 doit de toute façon décoder un fragment pour les liens partagés ; un seul
  chemin d'entrée).

## R11. Page de garde `/resultats` tant que la 005 n'est pas livrée **(à valider)**

- **Décision** : la 004 crée `src/app/resultats/page.tsx`, page statique minimale : titre,
  texte « vos résultats seront bientôt disponibles ; ce lien reste valable » (`results.soon`),
  lien de retour au questionnaire. Elle ne lit pas le fragment et n'affiche rien de l'état. La
  005 la remplace entièrement.
- **Justification** : sans elle, un répondant qui termine un questionnaire en production
  (dès qu'une version sera publiée) arriverait sur une page 404. Dix lignes sans règle ni
  donnée ; aucun impact sur la 005 qui écrase le fichier.
- **Alternatives** : laisser le 404 (impasse visible en production ou en prévisualisation) ;
  désactiver le bouton de fin (le parcours ne serait pas testable de bout en bout).

## R12. Confirmations par `<dialog>` natif

- **Décision** : `ConfirmDialog` encapsule un `<dialog>` ouvert par `showModal()` : focus
  initial sur « Annuler » (action la moins destructrice), piège de focus natif, Échap = annuler,
  retour du focus sur le déclencheur à la fermeture, `aria-labelledby` et `aria-describedby`.
  Utilisé pour : recommencer, effacer, changer de sujets ou de mode (FR-018, FR-023, US3
  scénarios 4 et 5).
- **Justification** : pris en charge par tous les navigateurs evergreen ciblés, accessible par
  construction, aucune dépendance (principe VII) ; l'addon a11y de Storybook vérifie l'état
  ouvert.
- **Alternatives** : `window.confirm` (non stylable, texte hors i18n dans certains
  navigateurs, bloquant pour les tests) ; bibliothèque de modale (dépendance).

## R13. Changement de sujets ou de mode en cours de route (US4)

- **Décision** : depuis une question, « Modifier mes sujets » / « Modifier le mode » ouvre le
  `ConfirmDialog` ; en cas de confirmation, l'action `reset` efface réponses et brouillon mais
  conserve `priorities` et `mode` comme présélection, puis navigue vers l'étape concernée.
  Le brouillon n'est **jamais** effacé par une simple navigation (bouton précédent, URL
  directe) vers `/questionnaire` ou `/questionnaire/mode` : si le répondant y revalide
  exactement le même triplet, l'action `start` reconnaît le brouillon existant et reprend à sa
  position (scénario 4). S'il valide un triplet différent alors qu'un brouillon existe, la
  confirmation est demandée à ce moment-là.
- **Justification** : couvre les quatre scénarios de US4 avec une seule règle : « on ne perd
  des réponses qu'après confirmation ». La liste des questions ne dépend que du triplet
  (FR-015), donc un triplet identique garantit le même questionnaire.
- **Alternatives** : effacer à la sortie de l'écran questions (perte silencieuse, contraire au
  scénario 2 et 4).

## R14. Pré-remplissage depuis les résultats (besoin de la 005) : hors périmètre, point d'extension prévu

- **Décision** : la spec 004 ne décrit pas le démarrage à partir d'un état complet ; ce besoin
  est une hypothèse de la 005 (FR-028 de la 005). Le plan ne l'implémente pas, mais le modèle le
  rend trivial : `draftFromResultState(state, bank, now)` est spécifié dans
  [contracts/storage-and-data.md](contracts/storage-and-data.md) comme fonction à ajouter par
  la 005 (ou par une clarification de la 004), et l'étape questions sait démarrer depuis un
  brouillon déjà complet (position = première question `'unanswered'`, sinon dernière).
- **Justification** : ne pas élargir le périmètre validé de la 004 ; éviter une implémentation
  sans scénario d'acceptation. Le réducteur et le stockage, eux, n'ont pas besoin de changer.
- **Alternatives** : implémenter maintenant (sans spec) ; ignorer (la 005 devrait modifier le
  store sans contrat).
