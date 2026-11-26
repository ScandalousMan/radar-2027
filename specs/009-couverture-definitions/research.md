# Research: Couverture des candidats et définitions des termes

**Spec** : [spec.md](spec.md) · **Plan** : [plan.md](plan.md)

Aucun « NEEDS CLARIFICATION » ne restait dans le contexte technique ; les décisions ci-dessous fixent les points que la spec laisse au plan. Mesures faites le 2026-11-22 sur `public/data/versions/4/main.json`.

## R1 — Règles de sélection 3 : un comparateur, pas un nouvel algorithme

- **Decision** : `selectionRules: 3` réutilise `fillQuotasBySubject` (007) avec un comparateur de préférence injecté. Règles 2 : `byDiscriminant` (inchangé). Règles 3 : `byCoverage`, soit couverture décroissante, puis `D_q` décroissant, puis identifiant croissant. `questionsByTheme` prend le comparateur en paramètre, et sa valeur par défaut reste `byDiscriminant` pour les règles 1.
- **Rationale** : FR-002 ne change que l'ordre de préférence dans un thème. Les quotas, l'ancrage, l'enjeu, les deux passages et la rotation restent ceux de 007. Un paramètre garantit qu'ils restent identiques par construction, et le snapshot des règles 1 et les rejeux v3 et v4 le vérifient.
- **Alternatives considered** : un module `fill-coverage.ts` copié de `fill-subject.ts` aurait dupliqué 60 lignes avec un risque de divergence. Un score composite (couverture × discriminant) a aussi été écarté : la spec impose un ordre lexicographique, et un poids serait arbitraire.

## R2 — Rejeu des versions 1 à 4

- **Decision** : avant toute modification du cœur, produire `replay-v3.fixture.json` et `replay-v4.fixture.json` avec `scripts/results/replay-fixture.ts`. La garde « version courante = n » est assouplie par un drapeau explicite `--allow-older`, valable seulement tant que le code de sélection est celui qui a servi à publier. `replay.test.ts` est paramétré sur v1 à v4. L'audit exhaustif des règles 2 est épinglé sur la v4, et un second audit cible la dernière version en règles 3.
- **Rationale** : SC-003 exige 100 % des liens v1 à v4 identiques, et seules v1 et v2 avaient une fixture. Les règles 2 n'ont pas changé depuis la v3 : la v3 peut donc encore être figée avec le code actuel.
- **Alternatives considered** : figer seulement la v4 couvrirait les règles 2, mais pas les données propres à la v3. Le coût de la fixture v3 est nul.

## R3 — Couverture d'une question : publiée et vérifiée

- **Decision** : `main.json` (règles 3) publie `coverage` (entier) sur chaque question. `bankFromDataset` la recalcule toujours à partir de la matrice `positions`, qui compte les cases non `null` (neutre 0 compris) des candidats inclus. En règles 3, il lève `BankError('coverage-mismatch')` si la valeur publiée diffère. Le schéma Zod refuse `coverage` hors règles 3 et l'exige en règles 3.
- **Rationale** : FR-001 demande la couverture publiée avec la question, pour que la Méthodologie et le rapport la montrent. La recalculer garantit que la sélection ne dépend jamais d'une valeur incohérente avec les positions. La matrice ne contient que des positions relues et connues (002) : la définition du vocabulaire est donc respectée.
- **Alternatives considered** : la dériver seulement, sans la publier, contredirait la lettre de FR-001. La publier sans la vérifier laisserait une source de vérité en double.

## R4 — Banque resserrée : calcul automatique du minimum

- **Decision** : la banque active est calculée à la publication, sans statut dans le corpus. Les questions `active` du corpus sont candidates, avec leur couverture `c_q` sur les candidats déclarés et les positions connues. Pour `k` croissant à partir de 1 :
  1. `A_k` = questions avec `c_q ≥ k`.
  2. Pour chaque thème actif dont les questions de `A_k`, rattachées par leur **thème principal** (`themes[0]`), comptent moins de `QUOTA_FLOOR.full` (3) enjeux distincts : ajouter les questions de ce thème principal, hors `A_k`, par couverture décroissante, puis `D_q`, puis identifiant, en ne prenant que des enjeux nouveaux, jusqu'à 3 enjeux ou épuisement. Le thème est noté en avertissement.
  3. Le minimum est le plus petit `k` dont le total après compléments ne dépasse pas 120 (`MAX_ACTIVE_QUESTIONS`).
  4. Si aucun `k` ne tient sous 120 une fois les compléments ajoutés, la publication échoue (code 1) en nommant les thèmes complétés et le total obtenu au plus grand `k` utile : la décision (relever le plafond, accepter un plancher non atteint) revient au propriétaire. Aucun repli silencieux.

  `data:publish --min-coverage <k>` permet de forcer un `k` plus grand, jamais un total supérieur à 120. Le `k` retenu est publié (`minQuestionCoverage`), et les questions écartées forment la réserve, présente seulement dans le rapport.
- **Rationale** : FR-005 et FR-006 demandent un minimum par version, un plafond de 120 et un plancher d'enjeux. Le calcul automatique rend FR-007, scénario 3 (« redevient active sans autre intervention qu'une publication »), vrai par construction. Rattacher au thème principal est prudent : une question à deux thèmes n'est comptée qu'une fois, et c'est déjà la convention d'AXIS-DIM et des statistiques par thème.
- **Mesure v4** : `k = 7` laisse 94 questions. Il faut compléter Société (1 enjeu), Santé (2), Sécurité (0) et Institutions (2), soit environ 100 questions, avec 4 avertissements. `k = 6` laisse 130 questions avant compléments, au-delà du plafond.
- **Alternatives considered** : un `k` choisi à la main a été écarté. Il risquerait de violer le plafond ou de figer une réserve que la campagne a déjà comblée. Un statut `reserve` dans le corpus a aussi été écarté : c'est une donnée dérivée, qu'il faudrait synchroniser à chaque relecture. Enfin, rattacher une question à tous ses thèmes pour le plancher compterait deux fois un même enjeu.

## R5 — Rapport de couverture et seuils de succès

- **Decision** : `data:publish` (y compris `--dry-run`) écrit `data/reports/couverture-v<n>.{md,json}`. Le rapport contient les questions actives et en réserve par thème, avec `k` ; la couverture de chaque candidat sur la banque active ; et le nombre de candidats classés en modes court et complet, pour un répondant qui répond à toutes les questions, au minimum, à la médiane et au maximum sur les 12 444 combinaisons de 3 à 5 thèmes. Pour les combinaisons de 3 thèmes, il donne aussi la liste par combinaison. Le calcul s'appuie sur une fonction pure `coverageAudit(bank, mode, priorities)` placée dans le cœur : un candidat est classé si sa couverture sur la sélection est d'au moins 60 %, la même règle que le score (003 FR-008), qui ne dépend pas de la valeur des réponses. La publication **avertit** sans bloquer quand SC-001 ou SC-002 n'est pas atteint. Dans ce cas, l'agent soumet le rapport au propriétaire avant de publier.
- **Rationale** : FR-008 ; SC-001 et SC-002 supposent une campagne relue, et le propriétaire veut être consulté sur les décisions matérielles. 24 888 sélections à moins de 1 ms chacune et 18 couvertures par sélection : environ 30 s, acceptable pour une publication.
- **Alternatives considered** : bloquer la publication sous les seuils empêcherait de publier un progrès partiel. Échantillonner les combinaisons ne permettrait plus d'affirmer le minimum exact.

## R6 — Gain attendu d'une position manquante (`data:gaps`)

- **Decision** : la liste porte sur les candidats déclarés × les questions `active` du corpus sans position connue, en banque active ou en réserve. La banque de simulation est la banque active de la prochaine version (R4). Les simulations couvrent les 816 combinaisons de 3 thèmes × 2 modes, avec un répondant qui répond à tout.
  - Pour une question q de la banque active : `gain(c, q) = Σ 1 / m(c, S)` sur les sélections S qui contiennent q et où c est sous 60 %. `m(c, S)` est le nombre de positions qui manquent à c dans S pour atteindre 60 %. Une position compte d'autant plus que le candidat est proche du seuil (`m` petit) et que la question est souvent sélectionnée.
  - Pour une question de réserve dont la couverture atteint `k − 1` (une position de plus la rendrait active) : même calcul sur une banque où elle est promue. Les autres questions de réserve ont un gain nul : elles sont listées après, par couverture décroissante.
  - Départage : gain décroissant, couverture du candidat décroissante, couverture de la question décroissante, puis identifiants.
  - Un couple pour lequel un journal 008 consigne une lacune `NOT_FOUND` ou `NO_PERSONAL_POSITION` avec `question` est marqué « déjà cherché », avec l'identifiant du journal, et relégué en fin de liste.

  Sortie : `data/reports/trous/<date>.{md,json}`. Le Markdown regroupe les lignes en missions, par candidat × thème, dans l'ordre du gain cumulé : c'est le format qu'attend le sous-agent.
- **Rationale** : FR-009 demande de favoriser les candidats proches de 60 % et les questions qui sont ou deviendraient actives. La formule `1/m` exprime les deux sans poids arbitraire, est déterministe et s'explique en une phrase dans le rapport. Les combinaisons de 3 thèmes suffisent à ordonner (environ 3 000 sélections, quelques secondes, plus environ 40 promotions).
- **Alternatives considered** : le gain marginal strict (seulement si la position fait franchir le seuil) laisserait presque toutes les lignes à zéro. Un ordre purement lexicographique (candidat le plus proche, puis question la plus couverte) ignore la fréquence de sélection.

## R7 — Circuit de la campagne et constat d'absence

- **Decision** : le circuit 008 et le circuit 002 restent inchangés.
  1. L'agent génère la liste et confie au sous-agent `french-political-source-researcher` une mission par groupe candidat × thème, en citant les identifiants de questions de la liste.
  2. Le sous-agent écrit des preuves et un journal (`data/recherche/`). Une absence documentée devient une lacune `NOT_FOUND` (au moins 5 requêtes sur 3 catégories, règle R11 de 008) ou `NO_PERSONAL_POSITION`, avec `question`. Le sous-agent ne touche jamais `data/corpus/positions/` (contrat 008).
  3. L'agent, en session (pratique du projet, sans `data:extract`), transcrit chaque preuve `VERIFIED_QUOTE` de qualité primaire en position `draft`, avec la source enregistrée et la citation.
  4. Le propriétaire relit avec `data:review`. Seules les positions `reviewed` entrent dans la publication. PR de données distincte.

  Le skill gagne une courte section « Mission issue de `data:gaps` » : lire la ligne, chercher, ne jamais déduire du parti, et consigner l'absence dans le journal.
- **Rationale** : FR-010 et FR-012, et l'hypothèse de la spec selon laquelle la campagne ne crée pas de nouveau circuit. Les lacunes de journal existent déjà et suffisent comme constat qui évite de refaire la recherche. `data:gaps` les lit.
- **Alternatives considered** : laisser le sous-agent écrire les positions `draft` violerait son contrat 008 (FR-042). Un fichier « constats » séparé ferait doublon avec les lacunes des journaux.

## R8 — Agrégateurs : liste et règle `SRC-AGGREGATOR`

- **Decision** : `governance.yaml` gagne `aggregatorDomains`, non publiée comme `thresholds`, initialisée à `candidatspresidentielles2027.fr`, `monvote2027.fr` et `wikipedia.org`. Le skill traite déjà Wikipédia comme une simple piste. La règle `SRC-AGGREGATOR` échoue pour :
  1. toute source du registre `data/corpus/sources/` dont l'hôte est un domaine déclaré ou l'un de ses sous-domaines (le registre ne contient que des sources citables par une position ou une preuve) ;
  2. toute preuve dont `unregisteredSource.url` est un agrégateur.

  La preuve gagne un champ facultatif `lead: { url, title }`, la piste qui a mené à la source primaire, que la règle n'examine pas. Dans les journaux, `sourcesConsulted` peut citer un agrégateur avec `outcome: rejected`, et la règle RECH-JOURNAL n'est pas modifiée.
- **Rationale** : FR-011 et SC-004. La correspondance par hôte est simple et sans faux positif sur les sources primaires. Le corpus actuel ne contient aucune source sur ces domaines (vérifié par recherche textuelle) : la règle passe dès son ajout.
- **Alternatives considered** : un contrôle seulement dans le skill ne serait pas vérifié en CI (principe V). Une liste en dur dans le code obligerait à le modifier pour chaque nouvel agrégateur.

## R9 — Bulle de définition : toggletip non modal, API Popover, positionnement maison

- **Decision** : le terme est un `<button type="button">` dans l'énoncé, avec `aria-expanded` et `aria-controls`. Une description masquée « terme défini » est référencée par `aria-describedby`, pour que le lecteur d'écran annonce « aide médicale de l'État, bouton, réduit, terme défini ». La bulle est un élément `popover="manual"` placé juste après le bouton dans le DOM : affichée dans la couche supérieure, elle n'est jamais rognée par un parent, et l'ordre de tabulation va du terme à la bulle. Elle porte `role="dialog"` non modal et `aria-labelledby` sur son libellé. Elle contient le libellé, la définition, la source (lien), un lien « Glossaire » et un bouton Fermer.
  - **Position** : calculée en JS à l'ouverture, au redimensionnement et au défilement. La bulle se place sous le terme, ou au-dessus s'il manque de place. Elle est recadrée horizontalement dans la fenêtre avec la gouttière de page (16 px). Sa largeur vaut `min(20rem, 100vw − 2 × gouttière)`, et sa hauteur maximale `min(50vh, 18rem)` avec défilement interne. Ces valeurs, comme les délais de survol (300 ms) et de sortie (200 ms), sont des tokens de `src/ui/tokens.css` (`--defined-term-gutter`, `--defined-term-max-width`, `--defined-term-max-height`, `--defined-term-open-delay`, `--defined-term-close-delay`) ; le calcul JS lit les valeurs calculées (`getComputedStyle`) et n'écrit aucune valeur en dur (principe IV). À 320 px, la bulle prend toute la largeur utile.
  - **Ouverture et fermeture** : clic ou toucher sur le terme pour basculer. Entrée et Espace (natifs au bouton). Survol à la souris seulement (`pointerType === 'mouse'`), après 300 ms ; la bulle reste ouverte tant que le pointeur est sur le terme ou sur elle, et se ferme 200 ms après l'avoir quittée (WCAG 1.4.13 : on peut la survoler et la fermer, elle persiste). Un clic sur une bulle ouverte par survol la **fixe**, et un nouveau clic la ferme. Échap ferme la bulle et rend le focus au terme s'il était dans la bulle. Un `pointerdown` hors du terme et de la bulle la ferme, sans annuler le clic visé. Quand le focus quitte le terme et la bulle, elle se ferme. Le démontage la ferme aussi, au changement de question (`key` = identifiant).
  - **Une seule bulle ouverte** : un petit contexte React (`DefinedTermGroup`) mémorise l'identifiant ouvert.
  - **Réponses** : la bulle n'a aucun gestionnaire sur l'état du questionnaire, ne touche pas à l'URL, et un `pointerdown` extérieur n'appelle pas `preventDefault`. Un bouton de réponse visible reste donc un choix explicite, et un bouton couvert par la bulle ne reçoit pas le geste. La bulle n'est jamais durable : n'importe quel geste extérieur la ferme.
  - **Repère visuel** : soulignement pointillé (`text-decoration: underline dotted`, épaisseur et décalage en tokens), couleur du texte inchangée, curseur `help` à la souris, anneau de focus du design system. Ce repère ne repose pas sur la couleur seule.
- **Rationale** : US4, FR-016 à FR-019 et SC-005 et SC-006. Le toggletip, un bouton qui affiche une information au clic, est le motif recommandé pour un contenu qui doit marcher au toucher. Une infobulle `role="tooltip"` pure est inaccessible au toucher et ne peut pas contenir de lien. L'API Popover est disponible dans tous les navigateurs evergreen depuis 2024 et règle la couche supérieure sans portail. Le positionnement d'ancrage CSS n'est pas encore partout : un calcul en une trentaine de lignes évite d'ajouter Floating UI (principe VII).
- **Alternatives considered** :
  - `<dialog>` modal : il piège le focus et masque la question, contrairement à « sans quitter la question ».
  - Tiroir en bas d'écran sur mobile : bonne lisibilité, mais il masque les boutons de réponse et s'écarte de « à côté du terme ».
  - `<abbr title>` : invisible au toucher et au clavier.
  - Floating UI : une dépendance pour un seul cas simple.
  - Fermeture au clic sur une bulle ouverte par survol : à la souris, l'utilisateur qui survole puis clique verrait la bulle disparaître. La fixer est plus naturel, et le second clic ferme toujours (AC 2).

## R10 — Repérage des termes dans un énoncé

- **Decision** : fonction pure `annotate(text, index) → Segment[]` (`src/lib/glossary/annotate.ts`). L'index est compilé une fois par glossaire.
  - **Normalisation de comparaison** : NFC, apostrophes typographiques ’ ramenées à ', espaces insécables ramenées à l'espace. Insensible à la casse **sur la première lettre seulement**, pour que « Droit du sol » corresponde à « droit du sol » sans que « AME » corresponde à « âme ».
  - **Bornes** : la forme doit être précédée et suivie d'un caractère qui n'est ni lettre ni chiffre Unicode (`\p{L}\p{N}`), ou du début ou de la fin du texte.
  - **Choix** : parcours de gauche à droite. À chaque position, on retient la forme la plus longue qui correspond. Le texte couvert est consommé, et un terme déjà signalé dans cet énoncé n'est plus signalé. Aucun chevauchement, aucun terme dans un autre.
  - Les segments conservent le texte original, casse et apostrophes comprises.
- **Rationale** : Edge Cases de la spec (première occurrence, forme la plus longue, formes déclarées seulement). Le parcours unique coûte O(longueur × formes candidates par initiale), négligeable pour des énoncés de 200 caractères au plus et 60 termes. La fonction est hors du cœur métier : elle ne touche ni score ni sélection (FR-021), et vit donc dans `src/lib`, testée par propriétés.
- **Alternatives considered** : des expressions régulières construites par terme gèrent mal la règle du plus long et du non-chevauchement entre termes. Un repérage au build, avec les annotations stockées dans `main.json`, rendrait le glossaire dépendant des versions, contre l'hypothèse de la spec.

## R11 — Publication et chargement du glossaire

- **Decision** : `pnpm data:glossary` écrit `public/data/glossary.json` avec les seuls termes `reviewed`, triés selon `localeCompare('fr', { sensitivity: 'base' })` sur le libellé. Le fichier est hors du dossier des versions et peut être modifié sans nouvelle version. La règle `GLOSS` vérifie en CI que le fichier publié est identique à ce que produirait la commande, pour qu'il ne dérive pas du corpus. La page `/glossaire` est un composant serveur qui lit le fichier au build (`node:fs`, comme Méthodologie), par `src/lib/glossary/load.server.ts`, seul module à importer `node:fs` ; le fetch client (`load.ts`) et le contexte (`GlossaryProvider.tsx`) sont séparés pour qu'aucun module client n'importe `node:fs`. Le questionnaire et les résultats le récupèrent côté client (`fetch('/data/glossary.json')`, mis en cache) en parallèle du jeu de données. En cas d'échec, l'énoncé s'affiche sans repère : le glossaire n'est pas essentiel au parcours.
- **Rationale** : FR-020 et FR-021, et l'hypothèse « le glossaire n'est pas figé par version ». Le fichier compte moins de 30 Kio, et rien ne s'ajoute au bundle JS.
- **Alternatives considered** : intégrer le glossaire au `main.json` le lierait à la version et imposerait une version pour corriger une virgule. L'importer comme module JS l'ajouterait au bundle de toutes les pages.

## R12 — Règle `GLOSS` et sources institutionnelles

- **Decision** :
  - **Erreurs** : aucune source ; définition vide ou de plus de 280 caractères ; aucune forme ; forme en double après normalisation (R10) au sein d'un terme ou entre deux termes ; identifiant en double ; terme `reviewed` sans `reviewedBy` ni `reviewedAt` ; `reviewedBy` égal à l'auteur ; `glossary.json` désynchronisé.
  - **Erreur supplémentaire** (FR-013) : aucune source du terme dont l'hôte appartient à la liste `institutionalDomains` de `governance.yaml`. Une institution absente de la liste s'y ajoute par revue de code.
  - **Avertissements** : terme `reviewed` absent de l'énoncé de toute question `active` du corpus (et non de la seule banque active d'une version : le glossaire ne dépend pas des versions) ; source supplémentaire dont l'hôte n'appartient pas à `institutionalDomains`. La liste est initialisée à `legifrance.gouv.fr`, `service-public.fr`, `vie-publique.fr`, `*.gouv.fr`, `conseil-constitutionnel.fr`, `conseil-etat.fr`, `assemblee-nationale.fr`, `senat.fr`, `insee.fr`, `europa.eu`, `ameli.fr`, `courdecassation.fr` et `ccomptes.fr`.
  - Une forme d'un terme incluse dans une forme plus longue d'un autre terme (« droit » dans « droit du sol ») n'est **pas** un conflit : la règle du plus long s'applique.
- **Rationale** : FR-013, FR-014 et FR-015. La neutralité d'une définition ne se vérifie pas automatiquement : elle relève de la relecture du propriétaire, et la règle garantit seulement que cette relecture a eu lieu. FR-013 exige au moins une source institutionnelle ou juridique : l'absence de toute source de la liste est donc une erreur ; une source complémentaire hors liste (presse spécialisée, organisme de recherche) n'est qu'un avertissement. Une institution qui manque à la liste s'y ajoute dans `governance.yaml`.
- **Alternatives considered** : une liste blanche bloquante serait trop rigide. Aucun contrôle de domaine permettrait une source militante par inadvertance.

## R13 — Inventaire initial du glossaire

- **Decision** : l'agent parcourt les énoncés de la banque active, à défaut ceux du corpus, et repère les sigles (mots en capitales de 2 lettres ou plus, avec chiffres comme « 49.3 »), les dispositifs et prestations, les procédures et les notions juridiques. Il rédige pour chaque terme une définition d'au plus 280 caractères à partir d'une source institutionnelle ouverte et vérifiée. Le tout va dans `data/relectures/<date>-glossaire.md` : un tableau des termes retenus (formes, définition, source, énoncés concernés) et un tableau des termes écartés avec leur motif (« langage courant », « pas de définition institutionnelle stable »…). Les termes sont écrits dans `glossaire.yaml` avec `status: draft` et `author: claude`. Après validation d'adrien, ils passent `reviewed` (`reviewedBy: adrien`), puis `data:glossary` les publie. L'objectif est d'au moins 20 termes, dont « aide médicale de l'État » et « droit du sol » (SC-007).
- **Rationale** : FR-022 et US5. Ce dossier de relecture suit le modèle de `2026-11-21-enjeux.md` (007).
- **Alternatives considered** : repérage automatique par fréquence de mots, trop bruité ; extraction payante, exclue par la pratique du projet.
