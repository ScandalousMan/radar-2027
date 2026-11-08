# Modèle de données : corpus, ontologie et pipeline

**Feature** : `002-corpus-ontologie-pipeline` · **Date** : 2026-11-07 · **Source** : [spec.md](spec.md) § Key Entities

Trois couches, trois emplacements (voir [research.md](research.md) R2) :

| Couche | Emplacement | Format | Relu par PR ? | Chargé par un visiteur ? |
|---|---|---|---|---|
| **Corpus** (source de vérité) | `data/corpus/**` | YAML | oui | non |
| **Extractions** (provenance, journaux) | `data/extractions/**` | JSON | oui (générés, relus pour le diff) | non |
| **Cache des sources** | `.cache/sources/**` | texte | hors dépôt | non |
| **Publication** | `public/data/**` | JSON | oui (générés, immuables) | oui |

Les identifiants sont des chaînes `kebab-case` ASCII (`^[a-z0-9]+(-[a-z0-9]+)*$`), stables et
jamais réutilisés. Les dates sont en ISO 8601 (`YYYY-MM-DD`, ou précision réduite `YYYY-MM`,
`YYYY` là où la spec l'autorise). Les schémas Zod correspondants vivent dans
`scripts/data/lib/schema/` (corpus) et `src/core/dataset/schema.ts` (publication).

## 1. Thème (`data/corpus/themes.yaml`)

| Champ | Type | Règle |
|---|---|---|
| `id` | identifiant | unique, français (`economie`, `immigration`), jamais renommé (FR-003) |
| `label` | texte | libellé affiché |
| `description` | texte ≤ 300 car. | description courte |
| `axis.negative` | texte | pôle rejoint par « pas du tout d'accord » à polarité `+` (factuel, FR-001) |
| `axis.positive` | texte | pôle rejoint par « tout à fait d'accord » à polarité `+` |
| `order` | entier ≥ 0 | ordre canonique, unique, contigu à partir de 0 |
| `status` | `active` \| `retired` | un thème retiré ne reçoit plus d'énoncé actif (FR-003) |

Invariants : 16 thèmes actifs à la version 1 (FR-002) ; `order` des thèmes actifs forme
`0..T−1` ; un thème publié dans une version ne peut plus être supprimé (seulement `retired`).

## 2. Contributeur (`data/corpus/contributors.yaml`)

| Champ | Type | Règle |
|---|---|---|
| `id` | identifiant | référencé par `author`, `reviewer` |
| `github` | texte | compte GitHub (gouvernance FR-041) |
| `displayName` | texte, facultatif | jamais publié |

## 3. Candidat (`data/corpus/candidates.yaml`)

| Champ | Type | Règle |
|---|---|---|
| `id` | identifiant | stable |
| `name` | texte | nom public |
| `party` | texte | parti ou `Sans étiquette` |
| `status` | `declared` \| `withdrawn` | FR-004 |
| `statusChangedAt` | date | dernier changement de statut |
| `statusSource` | référence source | source datée du statut (FR-004) |
| `statusCriterion` | identifiant de critère | critère de `governance.yaml` appliqué (FR-005) |
| `history[]` | `{ status, at, source, criterion }` | historique des changements, en ordre chronologique |

Transitions : `declared ⇄ withdrawn`, chaque transition ajoute une entrée à `history` et cite
un critère et une source. Un candidat `withdrawn` est conservé avec positions et sources mais
exclu de toute publication postérieure (FR-007).

## 4. Question (`data/corpus/questions/<theme>.yaml`, une liste par thème principal)

| Champ | Type | Règle |
|---|---|---|
| `id` | identifiant | unique, stable ; nouvel énoncé = nouvel identifiant (FR-011) |
| `text` | texte ≤ 200 car. | affirmation unique, sans double négation (FR-009) |
| `themes` | 1 ou 2 identifiants de thème | le premier est le **thème principal** |
| `polarity` | `+` \| `-` | pôle de l'axe du thème principal rejoint par « tout à fait d'accord » |
| `status` | `draft` \| `active` \| `retired` | `active` exige `reviewer` (FR-010) |
| `author` | contributeur | rédacteur |
| `reviewer` | contributeur, facultatif | ≠ `author` ; obligatoire si `active` |
| `reviewedAt` | date, facultatif | date de validation |
| `neutralityChecklist` | objet `{ critère: true }` | toutes les clés de la grille cochées avant `active` (FR-009) |
| `introducedIn` | entier, facultatif | version de banque d'introduction (posé par la publication) |
| `retiredIn` | entier, facultatif | version de retrait |

Invariants par thème (sur les questions `active` dont il est le thème principal) : effectif
≥ 10 ; part de chaque polarité dans [0,40 ; 0,60] (FR-012). Banque cible : 250 à 300 actives.
Un identifiant publié ne change plus de `text` que par correction typographique : la
validation compare au texte figé dans la dernière version publiée et tolère une distance de
Levenshtein ≤ 3 sans changement de mot (au-delà : violation FR-011).

## 5. Source (`data/corpus/sources/<candidate>.yaml` ; sources partagées dans `sources/commun.yaml`)

| Champ | Type | Règle |
|---|---|---|
| `id` | identifiant | unique |
| `url` | URL | **unique dans tout le corpus** (FR-013) |
| `title` | texte | |
| `kind` | `programme` \| `livre_plateforme` \| `declaration_vote` | type de preuve |
| `publishedAt` | date avec précision | `{ date: '2026-03', precision: 'month' }` ; `precision ∈ day, month, year` ; **obligatoire** |
| `accessedAt` | date (jour) | date de consultation |
| `candidates` | identifiants de candidat (≥ 1) | candidats concernés |
| `contentHash` | `sha256:<hex>` | empreinte du texte normalisé en cache (FR-014) |
| `archiveUrl` | URL, facultatif | adresse d'archive si l'originale ne répond plus |
| `unreachableSince` | date, facultatif | posé par `data:source check` |

Dérivé : `isOld = publishedAt < 2022-01-01` (FR-015). Le fichier de cache est
`.cache/sources/<hex>.txt` ; son absence n'est pas une violation (la CI n'a pas le cache) mais
désactive la vérification des citations, ce que le rapport signale.

## 6. Position (`data/corpus/positions/<candidate>.yaml`)

| Champ | Type | Règle |
|---|---|---|
| `question` | identifiant de question | couple (candidat, question) **unique** (FR-016) |
| `value` | `-2 … 2` \| `unknown` | |
| `evidence` | niveau de preuve, facultatif | obligatoire si `value` connue ; **égal au plus fort niveau de `sources`** (FR-017) |
| `sources` | identifiants de source | ≥ 1 si valeur connue ; pour `unknown`, liste des sources consultées (FR-021) |
| `quote` | texte ≤ 300 car. | obligatoire si connue ; retrouvée mot pour mot dans le cache d'une des `sources` (R5) |
| `quoteSource` | identifiant de source | la source où `quote` est retrouvée |
| `justification` | texte | obligatoire si connue |
| `status` | `draft` \| `reviewed` \| `contested` | FR-018 à FR-020 |
| `old` | booléen, facultatif | marque « ancienne » (FR-015), posée si toutes les sources sont antérieures à 2022 |
| `provenance` | `{ kind: 'manual' }` \| `{ kind: 'extraction', run, affirmation, model }` | FR-016 |
| `author` | contributeur | |
| `authoredAt` | date | |
| `reviewer` | contributeur, facultatif | ≠ `author` ; obligatoire si `reviewed` |
| `reviewedAt` | date, facultatif | |
| `reviewedHash` | `sha256:<hex>`, facultatif | empreinte de `(value, sources, quote)` au moment de la relecture |

Transitions :

```text
(création)            → draft        [manuelle ou via data:affirmation accept ; jamais reviewed directement, FR-018]
draft    --relecteur ≠ auteur-->  reviewed   [reviewer, reviewedAt, reviewedHash posés]
draft    --sources contradictoires de même niveau-->  contested  [FR-020, ≥ 2 sources]
contested --relecteur tranche, justification complétée-->  reviewed
reviewed --value | sources | quote modifiés-->  draft   [détecté : empreinte ≠ reviewedHash, FR-019]
```

Interprétation publique (FR-022) : une position est **connue** si et seulement si
`status = reviewed`, `value ≠ unknown`, `sources ≥ 1`, et citation vérifiable (quand le cache
est disponible). Tout le reste est « inconnu » pour la couverture, le pouvoir discriminant et
la publication.

## 7. Affirmation extraite (`data/extractions/affirmations/<candidate>.json`)

| Champ | Type | Règle |
|---|---|---|
| `id` | 16 hex | SHA-256 de `source \| location.start \| question ?? 'none'` tronqué (R8) |
| `run` | identifiant d'exécution | première exécution l'ayant produite |
| `source` | identifiant de source | |
| `location` | `{ start, end }` | offsets dans le texte normalisé, recalculés par nous |
| `quote` | texte ≤ 300 car. | |
| `summary` | texte | résumé du modèle |
| `themes` | 1 ou 2 identifiants | |
| `question` | identifiant ou `null` | `null` = « aucune question » |
| `proposedValue` | `-2 … 2` | |
| `confidence` | `low` \| `medium` \| `high` | |
| `state` | `verifiable` \| `unverifiable` \| `accepted` \| `rejected` | FR-024, FR-028 |
| `decision` | `{ by, at, reason?, position? }`, facultatif | posé par `accept`/`reject` |

Règles : `unverifiable` et `question = null` ne peuvent pas devenir `accepted` ; `accepted`
référence la position créée ; une relance ne modifie jamais une affirmation existante (fusion
par `id`).

## 8. Exécution d'extraction (`data/extractions/runs/<run-id>.json`)

| Champ | Type |
|---|---|
| `id` | `YYYYMMDDTHHmmssZ-<8 hex>` |
| `startedAt`, `endedAt` | date-heure ISO |
| `candidate` | identifiant |
| `model` | identifiant de modèle (`claude-opus-5-5`) |
| `promptVersion` | `{ name: 'extraction.v1', hash: 'sha256:…' }` |
| `bankVersion` | entier (dernière version publiée) ou `0` si aucune |
| `sources[]` | `{ id, contentHash, chunks, status: 'done' \| 'failed' \| 'skipped' }` |
| `counts` | `{ produced, verifiable, unverifiable, duplicates }` |
| `usage` | `{ inputTokens, outputTokens, cacheWriteTokens, cacheReadTokens }` |
| `costUsd` | nombre (4 décimales) |
| `maxCostUsd` | nombre ou `null` |
| `status` | `completed` \| `interrupted` \| `failed` |
| `error` | texte, facultatif (jamais la clé d'API ni le contenu des sources) |

`data/extractions/costs.json` cumule `{ runs, totalUsd, byModel }` (SC-006).

## 9. Gouvernance (`data/corpus/governance.yaml`)

| Champ | Contenu |
|---|---|
| `inclusionCriteria[]` | `{ id, text }` : critères d'inclusion (déclaration publique et personnelle, source datée) et de retrait (renoncement, absence de la liste du Conseil constitutionnel) (FR-005, FR-006) |
| `neutralityChecklist[]` | `{ id, text }` : grille cochée par le relecteur (FR-009) |
| `evidenceLevels[]` | `{ id, label, definition }` dans l'ordre de force |
| `thresholds` | `{ polarityMin: 0.4, polarityMax: 0.6, minQuestionsPerTheme: 10, maxStatementLength: 200, maxQuoteLength: 300, oldSourceBefore: '2022-01-01', mainBudgetBytes: 307200, detailBudgetBytes: 153600 }` |
| `reportIssueUrl` | gabarit d'URL du signalement (FR-045) |

Ces contenus sont copiés tels quels dans `main.json.governance` (FR-044).

## 10. Version de banque et registre (`public/data/versions.json`)

| Champ | Type |
|---|---|
| `current` | entier (dernier numéro) |
| `versions[]` | `{ number, publishedAt, questionCount, candidateCount, mainHash, detailHashes: { candidateId: hash } }` |

Invariants : `number` contigus à partir de 1 ; une entrée n'est jamais modifiée ni supprimée
(SC-011) ; au plus 256 entrées (FR-040).

## 11. Jeu de données principal (`public/data/versions/<n>/main.json`)

```ts
type MainDataset = {
  version: number;
  publishedAt: string;                       // date du jeu de positions
  themes: { id; label; description; axis; order }[];          // ordre canonique
  candidates: { id; name; party; status: 'declared'; coverage: number }[];
  withdrawn: { id; name; withdrawnAt: string; criterion: string }[];   // page Méthodologie, jamais de position
  questions: { id; text; themes; polarity; discriminant: number }[];  // actives, ordre stable par id
  positions: Record<CandidateId, (null | [value: -2|-1|0|1|2, level: 'p'|'l'|'d'])[]>; // aligné sur questions
  governance: Governance;                    // § 9 sans thresholds internes inutiles
};
```

Invariants : aucune position `draft` ou `contested`, aucune citation, aucune justification,
aucun contributeur (FR-037) ; `positions[c].length === questions.length` ; taille du fichier
≤ 300 ko (SC-004).

## 12. Jeu de détail par candidat (`public/data/versions/<n>/candidates/<id>.json`)

```ts
type CandidateDetail = {
  version: number;
  candidate: { id; name; party };
  sources: Record<SourceId, { url; title; kind; publishedAt: { date; precision }; accessedAt; archiveUrl? }>;
  positions: Record<QuestionId, { value; level; quote; quoteSource; justification; old?: true; sources: SourceId[] }>;
};
```

Invariant : seules les positions connues de `main.json` y figurent ; taille ≤ 150 ko.

## 13. Rapport de validation (`data/reports/validation.{md,json}`, non versionné)

| Section | Contenu |
|---|---|
| `violations[]` | `{ rule: 'FR-012', severity: 'error', entity: { kind, id }, message }` |
| `warnings[]` | même forme (`cache absent`, `source inaccessible`, `version proche de 200`) |
| `stats` | effectifs par thème et polarité ; positions par statut et par niveau ; couverture par candidat et par thème ; distribution du pouvoir discriminant (min, médiane, max, déciles) ; tailles des fichiers publiés |

Code de sortie : 1 si `violations.length > 0`, 0 sinon (les avertissements ne bloquent pas).
