# Contrat : règles de validation du corpus de preuves (`pnpm data:validate`)

**Spec** : FR-045, SC-009 · **Décisions** : [../research.md](../research.md) R4, R6, R7, R9–R11

Seule modification de code de la fonctionnalité. Elle ne touche ni `src/`, ni le score, ni
`data:publish`, ni `data:source`, ni le schéma des sources.

## Branchement

| Élément | Changement |
|---|---|
| `scripts/data/lib/cli.ts` — `DataPaths` | champ `researchDir` : `data/recherche` (dépôt) ou `<fixture>/recherche` |
| `scripts/data/lib/schema/research.ts` (nouveau) | schémas Zod stricts de [data-model.md](../data-model.md) ; exportés par `schema/index.ts` |
| `scripts/data/lib/research.ts` (nouveau) | `loadResearch(researchDir)` : chargement élément par élément, erreurs Zod → `SCHEMA` désignant `recherche/<fichier>:<chemin>` ; liste des comptes rendus `.md` présents |
| `scripts/data/lib/context.ts` | `ctx.research` chargé si `researchDir` existe, `undefined` sinon |
| `scripts/data/lib/rules/types.ts` | `RuleContext.research?: Research` ; `EntityKind` + `personality`, `evidence`, `journal`, `signal` |
| `scripts/data/lib/rules/index.ts` | sept règles `RECH-*` ajoutées en fin de `RULES` (avant `PUB-IMMUTABLE`) ; `POSITION_RULES` inchangé |
| `scripts/data/lib/rules/REF-EXISTS.ts` | `candidates` d'une source : identifiant de `candidates.yaml` **ou** de `personnalites.yaml` |
| `scripts/data/lib/report.ts` | aucun changement attendu (violations et avertissements génériques) ; ajout éventuel d'effectifs du corpus de preuves aux statistiques, sans effet sur le code de sortie |

Toutes les règles `RECH-*` renvoient `[]` si `ctx.research` est absent.

## Règles

Gravité : **E** erreur (bloque la CI), **A** avertissement.

### `RECH-ID` — identifiants

| # | Contrôle | Grav. |
|---|---|---|
| 1 | identifiants uniques par type : personnalités, preuves (tous fichiers), journaux, signalements | E |
| 2 | preuve : `id` commence par `<personality>-` ; `personality` égal au nom du fichier | E |
| 3 | journal : `id` égal au nom du fichier et de la forme `YYYY-MM-DD-<slug>` | E |
| 4 | personnalité dont le nom (`name`) est celui d'un candidat de `candidates.yaml` mais d'identifiant différent | E |

### `RECH-REF` — renvois

| # | Contrôle | Grav. |
|---|---|---|
| 1 | `personality`, `scope.personalities`, `gaps[].personality` → `personnalites.yaml` | E |
| 2 | `theme`, `scope.themes` → `themes.yaml` ; `question`, `scope.questions` → questions | E |
| 3 | `question` de la preuve : `theme` figure parmi les thèmes de la question | E |
| 4 | `source`, `corroborations[].source`, `sourcesConsulted[].source` → registre des sources | E |
| 5 | `journal` (preuves, corroborations, historique, signalements) → `journaux/` | E |
| 6 | `statuses[].evidence`, `evidenceAdded/Corroborated/Corrected`, `gaps[].evidence`, `contradictions[].evidence`, signalements → preuves | E |
| 7 | `author`, `resolution.by` → `contributors.yaml` | E |
| 8 | `position` d'un signalement → position existante dans `positions/<candidate>.yaml` | E |
| 9 | `signals` d'un journal → signalements | E |

### `RECH-STATUS` — statuts de candidature (FR-008 à FR-012)

| # | Contrôle | Grav. |
|---|---|---|
| 1 | `statuses` non vide, ordonné par `at` croissant | E |
| 2 | chaque statut relié à ≥ 1 preuve `kind: CANDIDACY` de la même personnalité | E |
| 3 | `DECLARED`/`INTENTION_EXPRESSED` : ≥ 1 preuve `PERSONAL_DIRECT` ou `PERSONAL_DOCUMENT` | E |
| 4 | statut appuyé uniquement sur des preuves `THIRD_PARTY_ATTRIBUTION`/`UNKNOWN_ATTRIBUTION` : seulement `REPORTED_UNCONFIRMED`, `POTENTIAL`, `NOT_A_CANDIDATE` | E |
| 5 | statut courant différent de la liste publiée (R10) sans signalement `CANDIDATE_STATUS` de cette personnalité | E |
| 6 | candidat de `candidates.yaml` absent du registre | A |

### `RECH-EVIDENCE` — format et cohérence des preuves (FR-015 à FR-036)

| # | Contrôle | Grav. |
|---|---|---|
| 1 | `kind: POSITION` ⇒ `theme` ; `kind: CANDIDACY` ⇒ ni `theme`, ni `question`, ni `qualification` | E |
| 2 | `question` ⇔ `qualification` | E |
| 3 | `VERIFIED_QUOTE`/`UNVERIFIED_QUOTE` ⇒ `quote` non vide ≤ `maxQuoteLength` ; `PARAPHRASE` ⇒ `paraphrase`, sans `quote` | E |
| 4 | `VERIFIED_QUOTE` ⇒ `source` du registre, `locator`, qualité A ou B, `transcript` ≠ `automatic` | E |
| 5 | `A_PRIMARY_VERIFIED` ⇒ ni `UNVERIFIED_QUOTE` ni `SOURCE_INACCESSIBLE` | E |
| 6 | `unregisteredSource` ⇔ pas de `source` ; admis seulement avec `SOURCE_INACCESSIBLE` et qualité D | E |
| 7 | `locator` présent sauf `SOURCE_INACCESSIBLE` ; `timestamp` au format `[HH:]MM:SS` | E |
| 8 | `PERSONAL_ACTION` ⇒ `actionScope` non vide | E |
| 9 | `speaker` hors nom et alias de la personnalité ⇒ attribution ni `PERSONAL_DIRECT` ni `PERSONAL_DOCUMENT` | E |
| 10 | `statedAt: unknown` ⇔ `temporalRelevance: UNDETERMINED` | E |
| 11 | ordre des dates : `statedAt ≤ publishedAt ≤ verifiedAt`, `researchedAt ≤ verifiedAt`, `createdAt ≤ updatedAt` (au préfixe de précision) | E |
| 12 | `updatedAt > createdAt` ⇒ entrée d'`history` ou de `corroborations` datée de `updatedAt` | E |
| 13 | corroboration : source différente de `source` et des autres corroborations | E |
| 14 | doublon exact : même personnalité, même source, même citation normalisée | E |
| 15 | doublon possible : même personnalité, citations de mêmes mots (`sameWords`) sur deux sources, sans signalement `POSSIBLE_DUPLICATE` citant les deux | A |
| 16 | `temporalRelevance: CURRENT` avec `statedAt` de plus de 12 mois avant `verifiedAt` (définition de `CURRENT`, data-model §2.4) sans corroboration récente | A |

### `RECH-QUOTE` — citations vérifiées (FR-019, SC-005)

| # | Contrôle | Grav. |
|---|---|---|
| 1 | `VERIFIED_QUOTE` : source munie d'une empreinte (`contentHash`) | E |
| 2 | cache disponible : la citation normalisée figure dans le texte en cache (`findQuote`) | E |
| 3 | cache indisponible ou texte absent : `CACHE-MISSING` | A |
| 4 | corroboration `VERIFIED_QUOTE` : mêmes contrôles sur la source corroborante | E/A |

### `RECH-JOURNAL` — journaux et comptes rendus (FR-029, FR-030, FR-038, FR-048)

| # | Contrôle | Grav. |
|---|---|---|
| 1 | `completed` ⇒ `completedAt ≥ startedAt` ; `interrupted` ⇒ `interruption` non vide | E |
| 2 | `queries` et `categoriesExplored` non vides | E |
| 3 | `exhaustive: true` interdit avec `categoriesNotExplored` non vide ou `state: interrupted` | E |
| 4 | lacune `NOT_FOUND` : ≥ 5 requêtes et ≥ 3 catégories explorées dans le journal | E |
| 5 | `sourcesConsulted[].outcome: retained` ⇒ `source` renseigné | E |
| 6 | compte rendu `journaux/<id>.md` présent, avec les titres `## 1.` à `## 13.` | E |
| 7 | toute preuve citée dans `evidenceAdded` a `journal` égal à ce journal | E |

### `RECH-SIGNAL` — signalements (FR-012, FR-033, FR-036, FR-044)

| # | Contrôle | Grav. |
|---|---|---|
| 1 | champs requis selon `kind` (`position`, nombre de preuves) | E |
| 2 | `resolved` ⇔ `resolution` ; `resolution.by` ≠ `claude` | E |
| 3 | preuve rattachée à une question, qualification de signe contraire à la valeur d'une position existante (`draft` ou `reviewed`) du même candidat (`*_SUPPORT` vs valeur < 0, `*_OPPOSITION` vs valeur > 0), sans signalement `POSITION_REVIEW` citant la preuve | E |
| 4 | qualification `CONTRADICTORY_EVIDENCE` sans signalement `UNRESOLVED_CONTRADICTION` ni entrée `contradictions` d'un journal citant la preuve | A |

## Fixtures

- `data/fixtures/minimal/recherche/` : registre de 3 personnalités (les deux candidats `dupont`
  et `martin` de la fixture, et une personnalité hors liste `REPORTED_UNCONFIRMED`), quelques preuves couvrant
  `VERIFIED_QUOTE` (citation présente dans `minimal/cache/`), `PARAPHRASE`,
  `SOURCE_INACCESSIBLE`, `CANDIDACY`, un journal d'auteur `adrien` (la fixture n'a pas de contributeur
  `claude`) avec compte rendu, un signalement ; doit
  rester conforme (0 violation).
- `data/fixtures/violations/RECH-<règle>[-<suffixe>]/` : copie de la fixture minimale avec une
  seule faute par dossier ; au moins une fixture par règle, plus `REF-EXISTS-research`
  (source visant une personnalité inconnue des deux registres). `validate.test.ts` les
  découvre sans modification (le code de règle est déduit du nom du dossier).

## Tests

- Un fichier `RECH-*.test.ts` par règle (style des règles existantes : `minimalContext()` puis
  mutation ciblée), couvrant chaque ligne E des tableaux ci-dessus et les cas conformes.
- `REF-EXISTS.test.ts` : cas « personnalité du registre de recherche acceptée », « inconnue des
  deux registres refusée ».
- `schema.test.ts` : listes fermées (une valeur hors liste par enum → `SCHEMA`).
- `validate.test.ts` : « le corpus du dépôt est conforme » couvre `data/recherche/` réel.
- `validate.perf.test.ts` : budget de durée existant inchangé.
