# Contrat : jeu de données publié et page Méthodologie

Ce contrat est celui que consomment les fonctionnalités 003 (sélection, score, versions de
banque), 004 et 005 (affichage) et la page Méthodologie de la présente fonctionnalité. Les
types et le schéma Zod vivent dans `src/core/dataset/` (module pur, sans React ni Next).

## Fichiers servis

| Chemin | Contenu | Budget | Chargement |
|---|---|---|---|
| `/data/versions.json` | registre des versions (`current`, `versions[]` avec empreintes) | < 20 ko | au démarrage par 003 (indice de version du lien) |
| `/data/versions/<n>/main.json` | jeu principal de la version `n` | ≤ 300 ko | version courante importée au build ; versions antérieures à la demande |
| `/data/versions/<n>/candidates/<id>.json` | détail d'un candidat | ≤ 150 ko | fiche candidat (005) et page Méthodologie |

Tous les fichiers sont immuables une fois commités ; un fichier dont l'empreinte diffère du
registre fait échouer `data:validate` (`PUB-IMMUTABLE`).

## Module `src/core/dataset`

```ts
// src/core/dataset/schema.ts
export const MainDatasetSchema: z.ZodType<MainDataset>;
export const CandidateDetailSchema: z.ZodType<CandidateDetail>;
export const VersionRegistrySchema: z.ZodType<VersionRegistry>;

// src/core/dataset/types.ts
export type EvidenceCode = 'p' | 'l' | 'd';
export type EvidenceLevel = 'programme' | 'livre_plateforme' | 'declaration_vote'; // identique à src/ui/EvidenceBadge
export const evidenceLevelFromCode: Record<EvidenceCode, EvidenceLevel>;
export type PositionCell = null | [value: -2 | -1 | 0 | 1 | 2, level: EvidenceCode];

// src/core/dataset/metrics.ts  (fonctions pures, testées par propriétés)
export function coverage(known: number, activeQuestions: number): number;            // [0,1], 0 si activeQuestions = 0
export function discriminant(values: ReadonlyArray<-2|-1|0|1|2>, includedCandidates: number): number; // [0,2]

// src/core/dataset/positions.ts
export function positionOf(ds: MainDataset, candidateId: string, questionId: string): PositionCell; // null si inconnue
export function questionIndex(ds: MainDataset): ReadonlyMap<string, number>;
```

Garanties offertes à 003 :

- `themes` est en ordre canonique (`order` contigu à partir de 0) ; `T = themes.length ≤ 24`.
- `questions` est triée par `id` (ordre lexicographique, stable entre versions pour les
  questions conservées) ; chaque question porte `themes[0]` comme thème d'ancrage et un
  `discriminant` précalculé (`D_q`).
- Pour tout candidat `c` de `candidates`, `positions[c]` existe et a la longueur de
  `questions` ; toute case non nulle est une position **relue, sourcée et connue** (principe I,
  FR-022) ; 003 n'a aucun filtrage à faire.
- `candidates` ne contient que des candidats `declared` ; la `coverage` est celle de FR-033.
- Un identifiant de question désigne le même énoncé dans toutes les versions (FR-011 /
  FR-041 de la 003).

## Page Méthodologie (`/methodologie`)

Composant serveur ; aucune requête réseau côté client ; contenus de données issus de
`main.json` de la version courante (FR-044), textes de méthode via `fr.json` (`methodology.*`).

| Section | Source | Composants |
|---|---|---|
| Règles de traçabilité et de relecture | i18n | prose |
| Niveaux de preuve | `governance.evidenceLevels` | `EvidenceBadge` + définition |
| Thèmes (ordre canonique, description, axe) | `themes` | liste ordonnée (`<ol>`) de `Card` : libellé en titre, description, axe « {negative} ⟷ {positive} » |
| Grille de neutralité | `governance.neutralityChecklist` | liste |
| Critères d'inclusion et de retrait | `governance.inclusionCriteria` | liste |
| Candidats inclus (statut, étiquette, couverture) | `candidates` | `CoverageList` |
| Candidats retirés (date, critère appliqué) | `withdrawn[]` (`{ id, name, withdrawnAt, criterion }`, cas limite « candidat retiré ») | liste |
| Version de banque, date du jeu, nombre de questions | `version`, `publishedAt`, `questions.length` | prose |
| Lien « Signaler une erreur » | `governance.reportIssueUrl` | `Button` (lien externe) |

`/methodologie/candidats/<id>` (une page statique par candidat inclus, `generateStaticParams`) :
en-tête (nom, étiquette, couverture), puis les positions connues regroupées par thème, chacune
rendue par `PositionCard` (valeur sur l'échelle, `EvidenceBadge`, citation, justification,
marque « ancienne », sources avec titre, date de publication selon sa précision, date de
consultation, lien externe). Parcours SC-007 : Méthodologie → candidat → position = 2 actions.
Le lien de signalement d'une position préremplit le titre avec `candidat/question`.

Nouveaux composants `src/ui` (stories, tests, a11y, tokens) :

```ts
type PositionCardProps = {
  question: string;                         // énoncé
  value: -2 | -1 | 0 | 1 | 2;
  level: EvidenceLevel;
  quote: string;
  justification: string;
  old?: boolean;
  sources: { url: string; title: string; publishedAt: { date: string; precision: 'day'|'month'|'year' }; accessedAt: string }[];
  reportHref?: string;
};
type CoverageListProps = {
  items: { id: string; name: string; party: string; coverage: number; href: string }[];
};
```

Clés i18n ajoutées (`fr.json`) : `methodology.*` (titres de sections, textes de règles,
libellés « couverture », « ancienne », « source consultée le », formats de date par précision),
`ui.positionCard.*`, `ui.coverageList.*`. La page porte `metadata.title` depuis
`methodology.title`.
