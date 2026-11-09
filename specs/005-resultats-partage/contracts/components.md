# Contrat : composants `src/ui` ajoutés ou étendus

Tous : story couvrant les états listés (dont 320 px, clair et sombre), test Vitest, a11y sans
violation critique ou sérieuse dans `storybook` et `storybook-sombre`, textes reçus en props ou
via `useTranslations('ui.<composant>')`, tokens seulement.

## ResultsHeader

```ts
type ResultsHeaderProps = { priorities: readonly string[]; mode: Mode; answered: number; total: number; methodologyHref: string };
```

Rendu : `h1` (`results.title`), liste des sujets clés (`ThemeChip` en lecture, comme `QuestionCard`),
« Mode court · 21 réponses sur 25 », phrase de plafonnement (FR-005) et lien Méthodologie.
États : 3/4/5 sujets, court, complet.

## RankingList

```ts
type RankingRowView = { id: string; name: string; rank: number; tied: boolean; percent: number; band: Band; withdrawn: boolean };
type RankingListProps = {
  rows: readonly RankingRowView[];
  selected: readonly string[]; maxSelected: 3;
  onOpen: (id: string) => void; onToggleCompare: (id: string) => void;
};
```

Rendu : `<ol>` ; chaque entrée : rang (« 2 » + « ex æquo » en texte), nom, `ScoreBar` (valeur
`percent`, libellé accessible « 62 % »), bande en texte, « ne se présente plus » le cas échéant,
bouton « Voir le détail », case « Comparer » (`aria-pressed`, désactivée si 3 sélectionnés et
non sélectionné, raison en `aria-describedby`). États : un seul, ex æquo, tous ex æquo, 3
sélectionnés, retiré.

## InsufficientList

```ts
type InsufficientRowView = { id: string; name: string; unknown: number; answered: number; withdrawn: boolean };
type InsufficientListProps = { rows: readonly InsufficientRowView[]; selected: readonly string[]; onOpen: (id: string) => void; onToggleCompare: (id: string) => void };
```

Titre « Données insuffisantes » (`h2`), entrées en rendu atténué (couleur de texte secondaire
conforme AA, jamais l'opacité seule) avec le texte « données insuffisantes » et la mention
pluralisée. États : vide (non rendu), plusieurs, tous.

## ThemeScoreList

```ts
type ThemeRowView = { key: string; label: string; priority: boolean; percent: number | null; known: number; answered: number };
type ThemeScoreListProps = { rows: readonly ThemeRowView[] };
```

`<ul>` ; sujet clé : étoile + « sujet clé » (texte masqué « Sujet clé : … » comme `QuestionCard`) ;
« — » avec libellé accessible « non calculable » ; couverture « x positions connues sur y
questions répondues ». États : complet, court (`others`), indéfinis.

## QuestionDetail

```ts
type QuestionDetailProps = {
  text: string; themes: readonly string[];
  answer: ScaleValue | 'skipped';
  position: ScaleValue | null; agreement: AgreementLevel | null; evidence: EvidenceLevel | null;
  quote?: string | null; source?: { title: string; date: string; url: string } | null;
  detailState: 'loading' | 'ready' | 'error';
};
```

Rendu : énoncé, « Votre réponse : … », « Position : … » ou « inconnue — n'entre pas dans le
calcul », palier en texte, `EvidenceBadge`, citation (`<blockquote>`), lien source
(`target="_blank"`, `rel="noopener noreferrer"`, mention « nouvel onglet » accessible).
Passée : sans palier. États : identique … opposé, inconnue, passée, citation absente, détail en
chargement, détail en erreur.

## ComparisonTable

```ts
type ComparisonTableProps = {
  columns: readonly { id: string; name: string; slot: 1 | 2 | 3; global: number | null }[];
  rows: readonly { key: string; label: string; priority: boolean; values: readonly (number | null)[] }[];
  onRemove: (id: string) => void;
};
```

< 640 px : blocs par thème (R10) ; ≥ 640 px : `<table>` avec `<th scope>` ; chaque candidat :
forme de série (rond, triangle, carré, `aria-hidden`) + couleur `--color-series-<slot>` + nom ;
bouton « Retirer <nom> ». États : 2, 3, avec insuffisant, mode court, 320 px.

## SharePanel

```ts
type SharePanelProps = {
  url: string; preview: { title: string; description: string };
  onCopy: () => Promise<'copied' | 'manual'>;
  nativeShare?: () => Promise<'shared' | 'cancelled'>;   // absent ⇒ bouton non rendu
};
```

Bouton « Copier le lien » ; après succès, « Lien copié » dans une région `aria-live="polite"` ;
`manual` ⇒ champ `readonly` sélectionné + consigne ; bouton « Partager… » si `nativeShare` ;
encart « Aperçu dans les messageries » montrant `preview`. États : initial, copié, manuel, avec
partage natif.

## ResumeCard (extension)

`status` accepte `'complete'` ; nouvelles props `onViewResults?: () => void` (requise si
`complete`). Rendu `complete` : titre « Questionnaire terminé », mode, date, actions « Voir mes
résultats » (principale) et « Recommencer » ; notice « version changée » si
`versionChanged: true`. Les états existants sont inchangés.
