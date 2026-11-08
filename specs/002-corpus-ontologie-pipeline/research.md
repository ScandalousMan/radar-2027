# Recherche : corpus, ontologie et pipeline d'extraction

**Feature** : `002-corpus-ontologie-pipeline` · **Date** : 2026-11-07

Versions vérifiées sur le registre npm le 2026-11-07. Comme pour la fonctionnalité 001, les
dépendances ajoutées sont épinglées (pas de `^`) et mises à jour par pull request dédiée. Aucun
point « NEEDS CLARIFICATION » ne subsistait dans la spec ; les décisions ci-dessous fixent les
choix techniques laissés ouverts par la spécification (formats, emplacements, outillage, modèle).

## R1. Format des fichiers du corpus : YAML validé par Zod

- **Décision** : le corpus (thèmes, candidats, questions, sources, positions, contributeurs,
  gouvernance) est écrit en **YAML** (paquet `yaml` 2.9.x), un fichier par groupe logique, et
  validé à la lecture par des schémas **Zod 4.6.x** (forme) puis par des règles métier en
  fonctions pures (contenu). Les artefacts machine (affirmations extraites, journaux
  d'exécution, jeux publiés) sont en **JSON**.
- **Justification** : la constitution impose que les données soient modifiées « uniquement par
  revue de code » (principe I) : il faut un format lisible en diff, commentable (les
  justifications et contradictions se notent en commentaire ou en champ texte) et éditable sans
  outil. YAML remplit ce rôle mieux que JSON pour des humains ; JSON reste le format des sorties
  produites par des programmes, où la stabilité d'écriture compte plus que la lisibilité.
  Zod 4 donne des messages d'erreur précis avec chemin (`positions[12].sources`) réutilisés
  tels quels dans le rapport de validation (FR-031) et le même schéma sert à typer le jeu publié
  côté application.
- **Alternatives écartées** : JSON partout (diffs bruyants, pas de commentaires) ; SQLite ou
  base locale (hors principe VII, invisible en revue) ; CSV (pas de structure imbriquée pour
  sources et provenance) ; JSON Schema + ajv (deux sources de vérité à maintenir, Zod infère
  les types TypeScript).

## R2. Emplacements : corpus dans le dépôt, cache hors dépôt, publication sous `public/data`

- **Décision** :
  - `data/corpus/**` : source de vérité versionnée (YAML) ;
  - `data/extractions/**` : affirmations et journaux d'exécution (JSON, versionnés, car ils
    constituent la provenance exigée par FR-016 et le registre de coût de SC-006) ;
  - `.cache/sources/<empreinte>.txt` : texte brut des sources, **ignoré par git**, chemin
    redéfinissable par `RADAR_SOURCE_CACHE_DIR` (FR-014) ;
  - `public/data/versions.json` + `public/data/versions/<n>/main.json` +
    `public/data/versions/<n>/candidates/<id>.json` : jeux de données publiés, versionnés dans
    le dépôt et servis tels quels par l'export statique (FR-036 à FR-040).
- **Justification** : séparer ce qui est relu (corpus) de ce qui est produit (publication) rend
  les pull requests de données lisibles (FR-041) ; placer la publication sous `public/` permet
  à la page Méthodologie (import au build) et à la fonctionnalité 003 (chargement à la demande
  des versions antérieures) de lire **le même fichier** sans recopie (FR-044). Le cache hors
  dépôt évite de versionner des textes sous droit d'auteur et des fichiers volumineux ; seule
  l'empreinte SHA-256 est commitée.
- **Alternatives écartées** : publication générée au build sans la commiter (impossible de
  garantir l'immuabilité d'une version ni de la relire) ; cache dans `data/` avec `.gitignore`
  (trop facile de le commiter par erreur ; un dossier caché à la racine est plus explicite).

## R3. Exécution des scripts : `tsx`, dossier `scripts/data`, hors bundle

- **Décision** : scripts TypeScript sous `scripts/data/` exécutés avec **tsx 4.23.x**
  (`pnpm data:<commande>` → `tsx scripts/data/<commande>.ts`), arguments analysés avec
  `node:util` `parseArgs` (aucune bibliothèque CLI). Un `tsconfig.scripts.json` étend le
  `tsconfig.json` racine avec `module: nodenext`, `types: ['node']`, et inclut `scripts/**`
  et `src/core/**` ; `pnpm typecheck` l'enchaîne au `tsc` principal. Vitest projet `unit`
  étend son `include` à `scripts/**/*.test.ts`.
- **Justification** : Node 24 exécute du TypeScript nativement mais sans alias `@/*` ni
  résolution des imports sans extension ; tsx apporte ces deux choses sans étape de build. Les
  scripts ne sont importés par aucun fichier de `src/app` ni `src/ui`, donc jamais inclus dans
  l'export Next (contrainte « scripts hors du bundle applicatif »). Le domaine partagé (types et
  schéma du jeu publié, calculs de couverture et de pouvoir discriminant) vit dans `src/core`
  et est importé par les scripts **et** par l'application : une seule implémentation.
- **Alternatives écartées** : `node --experimental-strip-types` (pas d'alias, erreurs peu
  lisibles) ; `ts-node` (plus lent, configuration ESM fragile) ; paquet séparé dans un espace
  de travail pnpm (interdit par le principe VII tant qu'il n'existe pas de second consommateur
  publié du cœur).

## R4. Validation : schémas Zod + règles pures + rapport double

- **Décision** : `pnpm data:validate` charge le corpus, applique les schémas Zod, puis une liste
  ordonnée de **règles** (`scripts/data/lib/rules/*.ts`), chacune une fonction pure
  `(corpus, options) => Violation[]` portant le code de la règle (`FR-012`, `FR-017`, …),
  l'identifiant de l'élément fautif et un message en français. La commande écrit un rapport
  Markdown (`data/reports/validation.md`, non versionné) et un JSON, affiche le résumé, et
  sort avec un code non nul dès qu'une violation existe (FR-031, FR-035). Les calculs de
  couverture et de pouvoir discriminant sont des fonctions pures de `src/core/dataset/`
  testées par propriétés avec **fast-check 4.10.x**.
- **Justification** : les règles sont nombreuses (FR-032 en liste une dizaine) et doivent être
  testables une à une ; une fonction pure par règle avec une fixture de violation dédiée
  (`data/fixtures/violations/<règle>/`) satisfait SC-001 (« au moins dix violations distinctes,
  refusées à 100 % »). Le rapport Markdown répond à SC-010 (« identifier chaque violation sans
  ouvrir les fichiers »).
- **Budget** : 22 candidats × 300 questions = 6 600 positions ; la validation complète est
  linéaire et tient très largement sous les 2 minutes de SC-010, vérification du cache
  comprise (lecture de quelques centaines de fichiers texte).

## R5. Citation « mot pour mot » : inclusion stricte après normalisation

- **Décision** : une citation est vérifiable si, après **normalisation identique** du texte en
  cache et de la citation, la seconde est une sous-chaîne de la première. Normalisation :
  Unicode NFC, apostrophes `’`→`'`, guillemets `« » “ ”`→`"`, tirets `– —`→`-`, espaces
  (y compris insécables) réduites à une seule, casse conservée. L'empreinte d'une source est le
  SHA-256 du texte **normalisé**, de sorte qu'un simple re-téléchargement avec des espaces
  différents ne casse pas les citations.
- **Justification** : le texte extrait d'un PDF ou d'une page web varie dans sa typographie
  (apostrophes, insécables) alors que la spec exige une correspondance « mot pour mot » : la
  normalisation garde l'exigence (aucun mot changé, aucune omission) sans faux négatifs. La
  casse est conservée pour ne pas accepter une citation modifiée.
- **Alternative écartée** : correspondance floue (distance d'édition) : incompatible avec
  « mot pour mot » et avec SC-008/SC-009 (le relecteur doit retrouver exactement la citation).

## R6. Cache des sources : extraction de texte simple, repli manuel

- **Décision** : `pnpm data:source fetch <url>` télécharge la source et en extrait le texte :
  HTML via **@mozilla/readability 0.6.x** sur un DOM **linkedom 0.18.x** ; PDF via
  **unpdf 2.1.x** ; texte brut tel quel. Le résultat normalisé (R5) est écrit dans
  `.cache/sources/<sha256>.txt` et l'empreinte reportée dans l'entrée YAML de la source. Si
  l'extraction automatique échoue ou donne un texte inexploitable (site dynamique, PDF scanné),
  l'éditeur fournit le texte à la main (`--from-file`) ; la commande ne fait que le normaliser
  et l'empreinter. Une commande `data:source check` revérifie les empreintes et signale les
  adresses qui ne répondent plus (cas limite « source inaccessible »).
- **Justification** : la spec exige seulement « conserver localement le texte » ; un
  extracteur suffisant dans 80 % des cas plus un repli manuel évite une dépendance lourde
  (navigateur sans tête, OCR). Readability est l'extracteur de référence pour les articles ;
  unpdf fonctionne sans binaire natif ; linkedom est un DOM léger sans jsdom (déjà présent pour
  les tests, mais trop lourd pour des scripts).
- **Alternatives écartées** : Playwright pour le rendu des pages (déjà installé mais lent et
  inutile pour des programmes et discours statiques ; peut être ajouté plus tard pour un site
  précis) ; stockage du HTML brut (empreinte instable, texte à ré-extraire à chaque vérification).

## R7. Extraction assistée : SDK Anthropic, sorties structurées, cache de prompt

- **Décision** : **@anthropic-ai/sdk 1.6.x** (publié le 2026-11-05 ; si pnpm le refuse au titre
  du délai minimal de publication, l'ajouter à `minimumReleaseAgeExclude` comme en 001).
  Modèle par défaut **`claude-opus-5-5`** (défaut recommandé de l'API au 2026-11-07),
  redéfinissable par `RADAR_EXTRACTION_MODEL` ; les consignes vivent dans
  `scripts/data/prompts/extraction.v1.md` et leur version est le nom du fichier plus son
  SHA-256 (journalisé, FR-025). Appel `client.messages.parse` avec
  `output_config.format = zodOutputFormat(ExtractionOutput)` : la réponse est déjà validée
  contre le schéma des affirmations. Paramètre `thinking` omis (adaptatif par défaut sur ce
  modèle), `output_config.effort: 'high'` (fidélité des citations), `max_tokens: 16000`,
  pas de `temperature`. Le prompt système (règles, grille de neutralité, banque de questions
  active) est placé en premier avec `cache_control: { type: 'ephemeral' }` ; le texte de la
  source, découpé en tranches d'environ 12 000 caractères avec chevauchement de 500, vient
  ensuite. Un `stop_reason` égal à `refusal` ou `max_tokens` est journalisé et la tranche
  marquée « échouée » sans interrompre l'exécution.
- **Coût** : calculé localement à partir de `response.usage` et d'une table de prix par modèle
  (`scripts/data/lib/pricing.ts`, prix au 2026-11-07 : Opus 5.5 4 $/M entrée, 20 $/M sortie,
  5 $/M écriture de cache, 0,20 $/M lecture de cache ; Sonnet 5.5 2 $/10 $ ; Haiku 5.5
  0,10 $/0,50 $). Le plafond `--max-cost` est vérifié **avant** chaque requête : si le coût
  cumulé plus l'estimation de la requête suivante (jetons comptés avec `messages.countTokens`)
  dépasse le plafond, l'exécution s'arrête proprement et le journal porte l'état `interrupted`
  (FR-029). Un journal cumulé (`data/extractions/costs.json`) répond à SC-006.
- **Secret** : `ANTHROPIC_API_KEY` lu par le client depuis l'environnement (`.env.local` ou
  profil `ant auth login`), jamais écrit dans un journal ; `.env.example` documente déjà la
  variable (FR-030).
- **Justification** : les sorties structurées suppriment le parsing de JSON libre et garantissent
  la forme de chaque affirmation (FR-023) ; le cache de prompt divise le coût des tranches
  suivantes d'une même source (les consignes et la banque pèsent 30 à 40 k jetons) ; la
  vérification des citations reste faite **par nous** (R5), jamais confiée au modèle.
- **Alternatives écartées** : Batches API (50 % moins cher, mais asynchrone : le plafond de
  coût et l'interruption propre de FR-029 sont plus difficiles à garantir ; à reconsidérer pour
  les grandes campagnes) ; Tool Runner ou agent (une extraction est une transformation
  texte → JSON, pas une boucle d'outils) ; modèle moins coûteux par défaut (choix du
  mainteneur via la variable d'environnement, pas du plan).

## R8. Déterminisme et idempotence des exécutions

- **Décision** : identifiant d'affirmation = 16 premiers hexadécimaux du SHA-256 de
  `sourceId | location | questionId-ou-none`, où `location` est l'offset de début de la
  citation dans le texte normalisé (recalculé par nous après vérification, pas celui du modèle).
  Identifiant d'exécution = horodatage ISO + 8 hexadécimaux du SHA-256 des entrées (empreintes
  des sources, version de banque, modèle, version des consignes). Une relance lit les
  affirmations existantes du candidat, **fusionne par identifiant sans écraser** (une
  affirmation déjà transformée ou rejetée garde son état), et n'écrit un nouveau fichier que
  pour le journal (FR-026, SC-005). Les positions ne sont jamais touchées par une exécution
  (FR-027) : la transformation affirmation → position est une commande distincte lancée par
  l'éditeur (`data:affirmation accept|reject`).
- **Justification** : un modèle de langage n'est pas déterministe ; l'idempotence ne peut donc
  venir que de l'identité des affirmations et de la règle de fusion, pas de la reproduction
  exacte des sorties. Les trois relances de SC-005 produisent alors 0 affirmation nouvelle à
  condition que le modèle retrouve les mêmes citations ; dans le cas contraire des affirmations
  **supplémentaires** peuvent apparaître (nouvelles citations), ce que le journal rend visible
  et que la relecture humaine absorbe. Cette limite est documentée dans le quickstart.

## R9. Couverture et pouvoir discriminant

- **Décision** (formules figées, implémentées dans `src/core/dataset/metrics.ts`) :
  - couverture d'un candidat = `nombre de questions actives avec position relue de valeur connue / nombre de questions actives`, en [0, 1], publiée arrondie à 3 décimales ;
  - pouvoir discriminant d'une question = `σ(valeurs connues) × (k / n)` où `k` est le nombre
    de candidats inclus ayant une position connue, `n` le nombre de candidats inclus, `σ`
    l'écart-type **de population** des `k` valeurs ; vaut 0 si `k < 2` ; publié arrondi à
    4 décimales. Avec l'échelle −2…+2, `σ ≤ 2` donc `D_q ∈ [0, 2]`.
- **Justification** : c'est la définition littérale de FR-033 et FR-034 ; l'écart-type de
  population (diviseur `k`) est choisi car l'ensemble des candidats inclus est la population
  entière, pas un échantillon. Les exemples de US3 scénario 6 (11/22 dispersés > 20/22 tous à
  +2 = 0) servent de fixtures. Propriétés testées : `0 ≤ D_q ≤ 2`, `D_q = 0` si toutes les
  valeurs connues sont égales, monotonie en `k` à dispersion fixée.

## R10. Jeu de données publié : forme compacte et budget de taille

- **Décision** : `main.json` contient `version`, `publishedAt`, `themes[]`, `candidates[]`,
  `questions[]`, `governance` (critères d'inclusion, grille de neutralité, définitions des
  niveaux de preuve) et `positions` sous forme de dictionnaire `candidateId → tableau aligné
  sur questions[]`, chaque case étant `null` (inconnue) ou `[valeur, niveau]` avec le niveau
  codé sur un caractère (`p` programme, `l` livre ou plateforme, `d` déclaration ou vote).
  Les jeux de détail `candidates/<id>.json` listent, par question, citation, justification,
  marque « ancienne » et sources dédupliquées.
- **Estimation** : 300 questions × ~220 octets ≈ 66 ko ; 22 × 300 cases × ~7 octets ≈ 46 ko ;
  thèmes, candidats et gouvernance ≈ 15 ko ; total ≈ 130 ko non compressé, bien sous les
  300 ko de SC-004. Détail par candidat : 300 × (citation 300 + justification 300 + source
  ~200) ≈ 240 ko dans le pire cas théorique, mais ~100 ko en pratique (justifications courtes,
  sources dédupliquées) ; la validation **mesure** chaque fichier et échoue au-delà des budgets.
- **Justification** : le tableau aligné évite de répéter les identifiants de question 6 600
  fois ; les niveaux sur un caractère sont décodés par un type `EvidenceLevel` déjà présent
  dans `src/ui/EvidenceBadge`. La structure est typée par le schéma Zod de `src/core/dataset`
  que la fonctionnalité 003 consommera.

## R11. Immuabilité des versions publiées

- **Décision** : `public/data/versions.json` (registre) enregistre pour chaque version
  `number`, `publishedAt`, `questionCount`, `candidateCount` et le **SHA-256 de `main.json`**
  et de chaque fichier de détail. `pnpm data:publish` refuse d'écrire sur une version
  existante ; `pnpm data:validate` recalcule les empreintes des versions présentes et échoue
  si l'une diffère du registre (SC-011). La publication compare aussi le contenu candidat à la
  dernière version : si rien ne change, elle refuse de créer une version vide ; si quelque chose
  change (question, candidat ou position), elle exige `--next` et crée `n+1` (FR-039, FR-040).
  Le registre est plafonné à 256 entrées (format de lien de la 003) avec avertissement à
  partir de 200.
- **Alternative écartée** : protéger les fichiers par des règles de dépôt uniquement (non
  vérifiable en local, contournable).

## R12. Page Méthodologie : pages statiques, données importées au build

- **Décision** : `src/app/methodologie/page.tsx` (composant serveur, import statique de
  `public/data/versions/<courante>/main.json` résolu via `versions.json`) et
  `src/app/methodologie/candidats/[id]/page.tsx` avec `generateStaticParams` sur les candidats
  inclus, qui importe le jeu de détail du candidat. Les textes de règles et de méthode sont des
  clés i18n (`methodology.*` dans `fr.json`) ; les contenus de données (thèmes, critères,
  grille, candidats, couverture, positions, sources) viennent du jeu publié (FR-044). Le
  signalement d'erreur (FR-045) est un lien vers un nouveau ticket du dépôt GitHub dont le
  titre est prérempli avec l'identifiant de la position ; aucune donnée n'est collectée par le
  site. Parcours SC-007 : Méthodologie → fiche candidat → position (2 actions).
- **Composants** : deux nouveaux composants dans `src/ui` avec stories et tests :
  `PositionCard` (valeur, `EvidenceBadge`, citation, sources datées, marque « ancienne ») et
  `CoverageList` (liste des candidats avec `ProgressBar` de couverture et statut). Les tableaux
  de thèmes et de critères utilisent `Card` et des listes sémantiques existantes. Aucune valeur
  de style en dur (lint existant).
- **Justification** : l'export statique de Next résout les imports JSON au build, donc la page
  reflète exactement la version publiée commitée ; la fiche par candidat sépare le poids du
  détail (150 ko max) de la page principale.

## R13. Identité des contributeurs

- **Décision** : `data/corpus/contributors.yaml` liste des identifiants courts (`adrien`,
  `relecteur-1`) avec un nom d'affichage facultatif et le compte GitHub ; les positions et
  questions référencent ces identifiants. Rien de ce fichier n'entre dans les jeux publiés
  (FR-037). La règle « auteur ≠ relecteur » (FR-010, FR-018) est vérifiée par la validation ;
  la correspondance entre l'auteur de la pull request et l'auteur déclaré n'est pas vérifiée
  automatiquement (gouvernance de revue, FR-041).

## R14. Intégration continue et scripts npm

- **Décision** : décommenter l'étape `data:validate` du workflow (entre `typecheck` et
  `test`), l'ajouter à `pnpm verify`, et ajouter un test d'intégration qui lance la validation
  sur `data/fixtures/violations/` et attend les dix codes de règle (SC-001). Les commandes
  d'extraction ne tournent jamais en CI (clé absente, coût) ; le test de l'extraction utilise
  un client factice injecté.

## Tableau des dépendances ajoutées

| Paquet | Version | Rôle | dev ? |
|---|---|---|---|
| `zod` | 4.6.x | schémas du corpus et du jeu publié, sorties structurées | non (importé par `src/core`) |
| `yaml` | 2.9.x | lecture et écriture du corpus | oui |
| `tsx` | 4.23.x | exécution des scripts | oui |
| `@anthropic-ai/sdk` | 1.6.x | extraction assistée | oui |
| `@mozilla/readability` | 0.6.x | texte des pages HTML | oui |
| `linkedom` | 0.18.x | DOM léger pour Readability | oui |
| `unpdf` | 2.1.x | texte des PDF | oui |
| `fast-check` | 4.10.x | tests de propriétés (métriques, normalisation, codage) | oui |

Aucune de ces dépendances n'entre dans le bundle visiteur sauf `zod` (utilisé par
`src/core/dataset` pour valider un jeu chargé ; ~15 ko compressés, compatible SC-011 de la 001
qui plafonne l'accueil à 200 ko, la page d'accueil ne l'important pas).
