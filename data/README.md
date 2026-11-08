# `data/` : corpus, extractions et fixtures

Ce dossier contient la **matière première** de radar-2027 : thèmes, candidats, banque de
questions, sources et positions, relus en pull request. Les jeux publiés consommés par le site
vivent ailleurs, sous [`public/data/`](../public/data), et sont produits par `pnpm data:publish`.
Spécification : [specs/002-corpus-ontologie-pipeline](../specs/002-corpus-ontologie-pipeline/spec.md).

## Arborescence

```text
data/
├── corpus/                              # source de vérité, YAML relu en pull request
│   ├── themes.yaml                      # 16 thèmes, ordre canonique, axes factuels
│   ├── contributors.yaml                # identifiants courts des contributeurs (jamais publiés)
│   ├── candidates.yaml                  # candidats déclarés ou retirés, avec source de statut
│   ├── governance.yaml                  # critères d'inclusion, grille de neutralité, niveaux, seuils
│   ├── questions/<theme-id>.yaml        # questions dont ce thème est le thème principal
│   ├── sources/<candidate-id>.yaml      # sources propres à un candidat
│   ├── sources/commun.yaml              # sources partagées par plusieurs candidats
│   └── positions/<candidate-id>.yaml    # positions d'un candidat, une par question au plus
├── extractions/                         # provenance de l'extraction assistée (JSON généré, relu)
│   ├── runs/<run-id>.json               # journal d'une exécution : modèle, consignes, coût
│   ├── affirmations/<candidate-id>.json # affirmations extraites, avec état et décision
│   └── costs.json                       # cumul des coûts par modèle et par candidat
├── fixtures/
│   ├── minimal/                         # corpus conforme de test (corpus/, cache/, published/)
│   └── violations/<code>/               # un corpus fautif par règle de validation (SC-001)
└── reports/                             # rapports de validation locaux, ignorés par git
```

Le **texte des sources** n'est pas versionné : il vit dans le cache local `.cache/sources/`
(ou `RADAR_SOURCE_CACHE_DIR`), un fichier `<empreinte>.txt` par source. Seule l'empreinte
SHA-256 du texte normalisé est commitée (`contentHash`). Sans cache (CI), la validation signale
`CACHE-MISSING` au lieu de vérifier les citations ; la publication exige le cache.

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
| `pnpm data:publish [--next] [--dry-run]` | construit une nouvelle version immuable sous `public/data/` |
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
