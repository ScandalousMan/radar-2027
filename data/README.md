# `data/` : corpus, extractions et fixtures

Ce dossier contient la **matière première** de radar-2027 : thèmes, candidats, banque de
questions, sources et positions, relus en pull request. Les jeux publiés consommés par le site
vivent ailleurs, sous [`public/data/`](../public/data), et sont produits par `pnpm data:publish`.
Spécification : [specs/002-corpus-ontologie-pipeline](../specs/002-corpus-ontologie-pipeline/spec.md).

## Arborescence

```text
data/
├── corpus/                              # source de vérité, YAML relu en pull request
│   ├── themes.yaml                      # 18 thèmes, ordre canonique, axes factuels (dimensions facultatives)
│   ├── contributors.yaml                # identifiants courts des contributeurs (jamais publiés)
│   ├── candidates.yaml                  # candidats déclarés ou retirés, avec source de statut
│   ├── governance.yaml                  # critères d'inclusion, grille de neutralité, niveaux, seuils
│   ├── questions/<theme-id>.yaml        # questions dont ce thème est le thème principal
│   ├── sources/<candidate-id>.yaml      # sources propres à un candidat
│   ├── sources/commun.yaml              # sources partagées par plusieurs candidats
│   └── positions/<candidate-id>.yaml    # positions d'un candidat, une par question au plus
├── campagnes/<theme-id>/                # journaux de campagne : sources.md (recherche), enonces.md (rédaction)
├── recherche/                           # corpus de preuves de la recherche (spec 008), jamais publié ni scoré
├── extractions/                         # provenance de l'extraction assistée (JSON généré, relu)
│   ├── runs/<run-id>.json               # journal d'une exécution : modèle, consignes, coût
│   ├── affirmations/<candidate-id>.json # affirmations extraites, avec état et décision
│   └── costs.json                       # cumul des coûts par modèle et par candidat
├── fixtures/
│   ├── minimal/                         # corpus conforme de test (corpus/, cache/, published/, recherche/)
│   └── violations/<code>/               # un corpus fautif par règle de validation (SC-001)
└── reports/                             # rapports de validation locaux, ignorés par git
```

Le **texte des sources** n'est pas versionné : il vit dans le cache local `.cache/sources/`
(ou `RADAR_SOURCE_CACHE_DIR`), un fichier `<empreinte>.txt` par source. Seule l'empreinte
SHA-256 du texte normalisé est commitée (`contentHash`). Sans cache (CI), la validation signale
`CACHE-MISSING` au lieu de vérifier les citations ; la publication exige le cache.

## Axe à dimensions (spec 006)

Un thème peut déclarer un axe composite : clé facultative `dimensions` (au moins 2, chacune
`id`, `label` ≤ 60 caractères, `negative`, `positive`). Ses questions portent alors la clé
`dimension`. Ni l'une ni l'autre n'est publiée. La règle `AXIS-DIM` vérifie qu'une question
porte une dimension connue de son thème principal (obligatoire si elle est active), que chaque
dimension compte au moins 3 questions actives et que le thème compte au moins autant de
questions actives que le quota maximal d'un thème prioritaire en mode complet (13 pour
18 thèmes). Le thème `education` est le premier à l'utiliser.

## Enjeu des questions (spec 007)

Chaque question active porte un `subject` (identifiant kebab-case, juste après `themes:`) :
l'enjeu, commun à toutes les questions qui portent sur le même dispositif, la même règle ou le
même paramètre de politique publique (`retraite-age-legal` pour « 62 ans » et « au-delà de
64 ans »). Une question seule prend son propre identifiant. Un questionnaire ne contient jamais
deux questions du même enjeu (règles de sélection 2). L'enjeu est publié dans `main.json` à
partir de la version 3, avec `selectionRules: 2`, mais jamais affiché. La règle `SUBJECT`
signale en erreur une question active sans enjeu et, en avertissement, chaque enjeu partagé et
chaque thème dont les enjeux distincts sont sous le quota maximal d'un thème prioritaire. Les
regroupements sont relus par adrien dans `data/relectures/2026-11-21-enjeux.md`.

## Corpus de recherche (spec 008)

`data/recherche/` rassemble les **preuves** recueillies par le sous-agent
`french-political-source-researcher` (ou par le skill `french-political-source-research` utilisé
seul) : registre des personnalités suivies avec l'historique daté de leurs huit statuts de
candidature, preuves qualifiées par personnalité, journaux de mission et comptes rendus en
13 rubriques, signalements pour revue humaine.

- **Preuve ≠ position.** Une preuve documente ce qu'une personnalité a dit, signé ou voté, avec sa
  source, sa localisation, son attribution et ses dates. Une position (`corpus/positions/`) est une
  évaluation relue, publiée et scorée. La recherche ne modifie jamais une position, une question,
  un thème ni la liste des candidats : elle produit des **signalements** (`signalements.yaml`) qu'un
  humain traite, le cas échéant par une pull request de données distincte.
- **Jamais publié.** `data:publish` et le site ne lisent pas ce dossier. Les sources des preuves
  restent dans le registre commun `corpus/sources/` (enregistrées par `pnpm data:source fetch`) ;
  une source peut y viser une personnalité du registre de recherche absente de `candidates.yaml`.
- **Contrôlé.** `pnpm data:validate` applique les règles `RECH-*` (identifiants, renvois, statuts,
  format des preuves, citations retrouvées dans le cache, journaux, signalements).

Rôle des fichiers et règles d'écriture : [`recherche/README.md`](recherche/README.md).

## Banque active et réserve (spec 009)

À partir de la version 5, `pnpm data:publish` ne publie pas toutes les questions `active` du corpus,
mais la **banque active** : les questions renseignées pour le plus de candidats. Les autres forment
la **réserve** ; elles restent `active` dans le corpus, sans aucun changement (énoncé, enjeu,
positions), et reviennent d'elles-mêmes à une publication ultérieure dès qu'elles sont assez
renseignées.

- **Couverture d'une question** (`c_q`) : nombre de candidats déclarés dont la position est connue
  (relue, sourcée, citation retrouvée ; une position neutre compte, une inconnue non).
- **Minimum `k`** : la publication retient le plus petit `k` tel que les questions de couverture
  `≥ k`, complétées si besoin, ne dépassent pas **120** questions (`MAX_ACTIVE_QUESTIONS`).
- **Compléments** : un thème dont les questions retenues, rattachées par leur thème principal,
  couvrent moins de 3 enjeux distincts est complété par ses questions les mieux couvertes (puis
  les plus discriminantes), un enjeu nouveau à la fois, jusqu'à 3 enjeux ou épuisement. Chaque thème
  complété produit un avertissement. Si aucun `k` ne tient sous 120 après compléments, la
  publication échoue et la décision revient au propriétaire.
- **Forcer `k`** : `pnpm data:publish --min-coverage <k>` impose un `k` plus grand que le minimum
  calculé (jamais plus petit, jamais plus de 120 questions).
- **Rapport** : chaque publication, y compris `--dry-run`, écrit
  `data/reports/couverture-v<n>.{md,json}` (versionné) : questions actives et en réserve par thème,
  couverture des candidats, nombre de candidats classés pour un répondant qui répond à tout, au
  minimum, à la médiane et au maximum sur les 12 444 combinaisons de 3 à 5 thèmes, et atteinte de
  SC-001 et SC-002. Sous ces seuils, la publication avertit sans échouer : le rapport est soumis au
  propriétaire avant de publier.
- La version publiée déclare `selectionRules: 3` (dans chaque thème, la question la mieux couverte
  passe en premier), `minQuestionCoverage: k` et la couverture `coverage` de chaque question. Une
  question mise en réserve ne reçoit pas `retiredIn`.

## Campagne ciblée et agrégateurs (spec 009)

- **`pnpm data:gaps`** liste les positions manquantes (candidats déclarés × questions `active` sans
  position connue) dans `data/reports/trous/<date>.{json,md}` (versionnés). Le gain d'une position
  est la somme, sur les sélections simulées de la prochaine banque active (816 combinaisons de
  3 thèmes × 2 modes, répondant qui répond à tout) où elle figure et où le candidat n'est pas
  classé, de 1 / (positions qui lui manquent pour atteindre 60 %). Une question de réserve à qui il
  manque une position pour entrer dans la banque est simulée promue ; les autres valent 0. Un
  couple consigné en lacune `NOT_FOUND` ou `NO_PERSONAL_POSITION` (avec `question`) par un journal
  de recherche est marqué « déjà cherché » et relégué en fin de liste. Options : `--candidate`,
  `--theme` (répétables), `--limit` (lignes du `.md`), `--min-coverage`, `--date`.
- **Agrégateurs** : `governance.yaml` déclare `aggregatorDomains` (non publié). La règle
  `SRC-AGGREGATOR` refuse toute source du registre et toute `unregisteredSource` d'une preuve dont
  l'hôte est l'un de ces domaines ou un sous-domaine. Une preuve peut citer la piste qui a mené à
  la source primaire dans son champ facultatif `lead: { url, title }`, jamais contrôlé ni publié.
- **Circuit de campagne** : liste `data:gaps` → missions candidat × thème confiées au sous-agent
  `french-political-source-researcher` (preuves et lacunes dans `data/recherche/`) → positions
  `draft` transcrites en session par l'agent depuis les preuves primaires (jamais `data:extract`)
  → relecture par le propriétaire (`pnpm data:review`) → publication. PR de données distincte.

## Gouvernance (FR-041)

- Toute modification du corpus passe par une **pull request de données, distincte des pull
  requests de code**.
- Elle est **relue par une personne différente de son auteur**. Dans les fichiers, la règle
  « auteur ≠ relecteur » est vérifiée par `pnpm data:validate` (questions actives, positions
  relues) ; la correspondance avec les comptes GitHub relève de la revue.
- Une position n'entre dans un jeu publié que relue, sourcée, à citation retrouvée et de valeur
  connue. Un brouillon (`draft`) ou une position contestée n'est jamais publié.
- Les contributeurs (`contributors.yaml`, `author`, `reviewer`) ne sont jamais publiés.

## Commandes

Détail des options et des codes de sortie :
[contracts/cli.md](../specs/002-corpus-ontologie-pipeline/contracts/cli.md).

| Commande | Rôle |
|---|---|
| `pnpm data:validate` | valide le corpus, calcule couverture et pouvoir discriminant, écrit `data/reports/validation.{md,json}` |
| `pnpm data:source fetch <url> …` | enregistre une source : texte en cache, empreinte et entrée YAML |
| `pnpm data:source check [--online]` | revérifie les empreintes du cache et, en ligne, les adresses |
| `pnpm data:extract --candidate <id>` | extraction assistée sous plafond de coût (clé d'API locale) |
| `pnpm data:affirmation list\|accept\|reject` | transforme les affirmations extraites en positions `draft`, ou les rejette |
| `pnpm data:review <candidat> <question> --by <id>` | relit une position (`draft` → `reviewed`) |
| `pnpm data:publish [--next] [--dry-run] [--min-coverage <k>]` | construit une nouvelle version immuable sous `public/data/` (banque active) et le rapport `data/reports/couverture-v<n>` |
| `pnpm data:gaps [--limit <n>]` | classe les positions manquantes par gain attendu, écrit `data/reports/trous/<date>.{md,json}` |
| `pnpm data:costs` | affiche le cumul des coûts d'extraction |

Toutes acceptent les chemins par défaut du dépôt ; `pnpm data:validate --corpus <dossier>`
accepte aussi un dossier de fixture (`corpus/`, `cache/`, `published/`).

## Extraction assistée

L'extraction propose des affirmations ; elle ne crée jamais de position relue.

1. **Prérequis** : la source est enregistrée (`pnpm data:source fetch`) et son texte est dans le
   cache local ; la banque contient au moins une question active ; `ANTHROPIC_API_KEY` est
   définie dans `.env.local` ou l'environnement (jamais commitée, jamais journalisée).
2. **Estimer d'abord** : `pnpm data:extract --candidate <id> --dry-run` affiche les tranches,
   les jetons estimés et le coût maximal, sans clé ni appel réseau.
3. **Lancer sous plafond** : `pnpm data:extract --candidate <id> --max-cost 2`. Avant chaque
   requête, si le coût cumulé plus l'estimation dépasse le plafond, l'exécution s'arrête
   proprement (`interrupted`). Le modèle par défaut est `claude-opus-5-5`
   (`RADAR_EXTRACTION_MODEL` ou `--model` pour en changer).
4. **Trier** : `pnpm data:affirmation list --candidate <id> --state verifiable`, puis
   `accept <id> --by <contributeur>` (crée une position `draft`) ou
   `reject <id> --by <contributeur> --reason …`. Une affirmation dont la citation est introuvable
   dans la source (`unverifiable`) ne peut pas être acceptée.
5. **Relire** : la position créée doit être relue par une autre personne
   (`pnpm data:review`) avant toute publication.

Les relances sont idempotentes : une affirmation déjà connue (même source, même emplacement,
même question) n'est ni dupliquée ni modifiée. Le modèle n'étant pas déterministe, une relance
peut toutefois proposer de nouvelles citations ; le journal le montre. Chaque exécution est
journalisée dans `extractions/runs/` (modèle, consignes, banque, sources, effectifs, coût) et
le cumul se consulte avec `pnpm data:costs`.
