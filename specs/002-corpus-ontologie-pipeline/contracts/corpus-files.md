# Contrat : fichiers du corpus (`data/corpus`)

Formats d'entrée relus en pull request. Les champs et règles sont ceux de
[data-model.md](../data-model.md) ; ce document fixe la **forme sur disque** que les éditeurs
écrivent et que les schémas Zod de `scripts/data/lib/schema/` acceptent. Toute clé inconnue
est refusée (`strict`).

## Arborescence

```text
data/
├── corpus/
│   ├── themes.yaml
│   ├── contributors.yaml
│   ├── candidates.yaml
│   ├── governance.yaml
│   ├── questions/<theme-id>.yaml          # questions dont ce thème est le principal
│   ├── sources/<candidate-id>.yaml        # sources propres à un candidat
│   ├── sources/commun.yaml                # sources partagées (débat, scrutin)
│   └── positions/<candidate-id>.yaml
├── extractions/
│   ├── runs/<run-id>.json
│   ├── affirmations/<candidate-id>.json
│   └── costs.json
├── fixtures/
│   ├── minimal/                           # corpus de test conforme (3 thèmes, 2 candidats, 30 questions)
│   └── violations/<rule>/                 # un corpus minimal fautif par règle (SC-001)
└── reports/                               # sorties locales, ignorées par git
```

## Exemples

`themes.yaml`

```yaml
- id: economie
  label: Économie
  description: Rôle de l'État dans l'activité, dépense publique, entreprises.
  axis:
    negative: Moins d'intervention publique dans l'économie
    positive: Plus d'intervention publique dans l'économie
  order: 2
  status: active
```

`questions/economie.yaml`

```yaml
- id: economie-smic-hausse
  text: Le SMIC doit être augmenté nettement au-delà de l'inflation.
  themes: [economie, travail]
  polarity: '+'
  status: active
  author: adrien
  reviewer: relecteur-1
  reviewedAt: 2026-11-20
  neutralityChecklist:
    no-loaded-term: true
    no-presupposition: true
    no-person-or-party: true
    single-claim: true
    both-ends-defensible: true
```

`sources/dupont.yaml`

```yaml
- id: dupont-programme-2027
  url: https://exemple.fr/programme.pdf
  title: Programme présidentiel 2027
  kind: programme
  publishedAt: { date: 2026-10, precision: month }
  accessedAt: 2026-11-07
  candidates: [dupont]
  contentHash: sha256:3f1a…
```

`positions/dupont.yaml`

```yaml
- question: economie-smic-hausse
  value: 1
  evidence: programme
  sources: [dupont-programme-2027]
  quote: "Nous revaloriserons le SMIC de 10 % dès l'été 2027."
  quoteSource: dupont-programme-2027
  justification: Hausse chiffrée mais ponctuelle, pas d'indexation au-delà de l'inflation → +1 plutôt que +2.
  status: reviewed
  provenance: { kind: extraction, run: 20261108T101500Z-9c2e1f0a, affirmation: 7b1d2c3e4f506172, model: claude-opus-5-5 }
  author: adrien
  authoredAt: 2026-11-08
  reviewer: relecteur-1
  reviewedAt: 2026-11-09
  reviewedHash: sha256:aa90…

- question: sante-deserts-medicaux-obligation
  value: unknown
  sources: [dupont-programme-2027, dupont-interview-rtl]
  justification: Aucune prise de position trouvée dans les sources consultées.
  status: reviewed
  provenance: { kind: manual }
  author: adrien
  authoredAt: 2026-11-08
  reviewer: relecteur-1
  reviewedAt: 2026-11-09
```

## Règles de validation (codes de règle)

Chaque règle est une fonction pure de `scripts/data/lib/rules/`, nommée par le code ci-dessous,
et possède une fixture dans `data/fixtures/violations/<code>/`. Le message désigne toujours
l'identifiant de l'élément fautif.

| Code | Règle | Entité désignée |
|---|---|---|
| `ID-UNIQUE` | identifiants uniques par type, format `kebab-case` | l'identifiant dupliqué |
| `REF-EXISTS` | tout thème, question, candidat, source, contributeur référencé existe | la référence |
| `FR-003` | thème retiré sans question active ; identifiant de thème publié jamais supprimé | thème |
| `FR-004` | candidat avec statut, date et source de statut | candidat |
| `FR-005` | changement de statut citant un critère de `governance.yaml` | candidat |
| `FR-008` | question avec 1 ou 2 thèmes, polarité, statut | question |
| `FR-009` | énoncé ≤ 200 car., grille de neutralité complète avant `active` | question |
| `FR-010` | `active` ⇒ `reviewer` présent et ≠ `author` | question |
| `FR-011` | texte d'une question publiée inchangé (hors typographie) | question |
| `FR-012` | par thème ayant ≥ 1 énoncé actif : ≥ 10 actives, polarités dans [40 %, 60 %] ; un thème actif sans aucun énoncé actif produit l'avertissement `THEME-EMPTY`, bloquant pour `data:publish` | thème (avec effectifs) |
| `FR-013` | source complète ; `url` unique ; date avec précision | source |
| `FR-014` | `contentHash` présent et, cache disponible, égal à l'empreinte du fichier | source |
| `FR-015` | position fondée sur des sources < 2022 alors qu'une source plus récente du candidat existe pour la question ⇒ erreur ; sinon `old: true` requis | position |
| `FR-016` | au plus une position par couple ; champs obligatoires | position |
| `FR-017` | connue ⇒ ≥ 1 source, citation ≤ 300 car. retrouvée dans `quoteSource`, justification, `evidence` = max des sources | position |
| `FR-018` | `reviewed` ⇒ `reviewer` ≠ `author` ; provenance extraction ⇒ jamais créée `reviewed` | position |
| `FR-019` | `reviewed` ⇒ empreinte courante = `reviewedHash` | position |
| `FR-020` | `contested` ⇒ ≥ 2 sources | position |
| `SCALE` | `value` dans l'échelle | position |
| `PUB-IMMUTABLE` | empreintes des versions publiées = registre | version |
| `PUB-BUDGET` | tailles des fichiers publiés ≤ budgets | fichier |

Avertissements (non bloquants) : `CACHE-MISSING`, `SOURCE-UNREACHABLE`, `VERSIONS-NEAR-LIMIT`,
`BANK-SIZE` (banque active hors 250–300 avant la première publication), `THEME-EMPTY` (thème
actif sans énoncé actif ; bloquant pour `data:publish`), `OLD-NEWER-SOURCE` (position « ancienne »
alors qu'une source plus récente du candidat contient la citation dans le cache).
