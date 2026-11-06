# Contrat des composants de base (`src/ui`)

Chaque composant expose l'interface ci-dessous. Les noms de props sont contractuels : les
fonctionnalités 004 et 005 s'y appuieront. Les libellés visibles ne sont jamais écrits en dur
dans le composant : ils sont soit passés en prop par le parent, soit lus via les clés i18n
indiquées. Tous les composants acceptent `className` (composition Tailwind à partir de tokens
uniquement) et transmettent les attributs HTML restants à l'élément racine.

## Button

```ts
type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'ghost';   // défaut 'primary'
  size?: 'md' | 'sm';                            // défaut 'md'
  loading?: boolean;                             // aria-busy, désactive l'action, garde la largeur
  disabled?: boolean;
  href?: string;                                 // si présent, rend un <a> avec les mêmes styles
  children: React.ReactNode;                     // libellé fourni par le parent
} & React.ButtonHTMLAttributes<HTMLButtonElement>;
```

États (stories) : repos, survol, focus, actif, désactivé, chargement, en lien ; × 3 variantes ×
2 tailles via contrôles. A11y : `<button type="button">` par défaut ; en chargement,
`aria-busy="true"` et le libellé reste lisible.

## LikertChoice

```ts
type LikertValue = -2 | -1 | 0 | 1 | 2;
type LikertAnswer = LikertValue | 'skipped' | null;   // null = aucune réponse

type LikertChoiceProps = {
  name: string;                       // nom du groupe (unicité par question)
  value: LikertAnswer;
  onChange: (next: LikertAnswer) => void;
  disabled?: boolean;
  legend: string;                     // énoncé ou libellé du groupe, fourni par le parent
};
```

Libellés des six options lus via i18n : `ui.likert.stronglyDisagree`, `ui.likert.disagree`,
`ui.likert.neutral`, `ui.likert.agree`, `ui.likert.stronglyAgree`, `ui.likert.skip`.

États : sans réponse, valeur sélectionnée (chaque niveau), passé, désactivé. A11y : `role="radiogroup"`
avec `<fieldset>/<legend>` ; six boutons radio ; Tab entre dans le groupe, flèches déplacent le
focus et la sélection, Espace/Entrée confirment ; chaque option annonce « libellé, n sur 6 » ;
« passer » est visuellement distinct (séparé, variante discrète) et sémantiquement une option du
même groupe.

## ThemeChip

```ts
type ThemeChipProps = {
  id: string;
  label: string;
  selected: boolean;
  disabled?: boolean;                 // maximum atteint
  onToggle: (id: string) => void;
};
```

États : non sélectionné, sélectionné, désactivé, focus. A11y : `<button aria-pressed>` ; libellé
long passe à la ligne, jamais tronqué.

## ThemePicker

```ts
type ThemeOption = { id: string; label: string; description?: string };

type ThemePickerProps = {
  options: ThemeOption[];
  value: string[];                    // ids sélectionnés
  onChange: (next: string[], meta: { valid: boolean }) => void;
  min?: number;                       // défaut 3
  max?: number;                       // défaut 5
  legend: string;
};
```

Comportement : refuse le (max+1)-ième clic et affiche `ui.themePicker.maxReached` ({max}) ;
sous le minimum affiche `ui.themePicker.minNotReached` ({min}, {missing}) ; expose
`ui.themePicker.counter` « {count} / {max} » dans une zone `aria-live="polite"`. Ne décide jamais
de la navigation (le parent lit `meta.valid`). États : vide, partiel invalide, valide, maximum
atteint, désactivé.

## ProgressBar

```ts
type ProgressBarProps = {
  value: number;                      // 0..total
  total: number;
  label: string;                      // ex. « Question 7 sur 25 », fourni par le parent via i18n
};
```

A11y : `role="progressbar"` avec `aria-valuemin/max/now` et `aria-label`. États : initial (0),
intermédiaire, complet.

## ScoreBar

```ts
type ScoreBarProps = {
  value: number | undefined;          // 0..100, undefined = indéfini
  label: string;
  compact?: boolean;
};
```

Comportement : valeur hors [0, 100] bornée à l'affichage et avertissement console en
développement ; `undefined` affiche « — » (`ui.scoreBar.undefined`) et un libellé accessible
`ui.scoreBar.unavailable`. États : défini, indéfini, compact.

## Card

```ts
type CardProps = {
  interactive?: boolean;              // focalisable, rendu <a> ou <button> selon href/onClick
  href?: string;
  onClick?: () => void;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
};
```

États : repos, interactive (repos, survol, focus), avec en-tête, avec pied.

## PageShell

```ts
type PageShellProps = {
  children: React.ReactNode;          // contenu principal, rendu dans <main id="contenu">
};
```

Structure : lien « aller au contenu » (`common.skipToContent`) premier élément focalisable ;
en-tête avec nom du site (`common.siteName`) et `ThemeToggle` (bascule clair/sombre, libellés
`common.theme.light` / `common.theme.dark` / `common.theme.toggle`) ; pied avec liens
`common.footer.methodology` (→ `/methodologie`) et `common.footer.about` (→ `/a-propos`), pages
pouvant être absentes à ce stade. États : par défaut, thème sombre, largeur 320 px.

## EvidenceBadge

```ts
type EvidenceLevel = 'programme' | 'livre_plateforme' | 'declaration_vote';

type EvidenceBadgeProps = { level: EvidenceLevel };
```

Libellés : `ui.evidence.programme` « programme officiel », `ui.evidence.livrePlateforme`
« livre ou plateforme écrite », `ui.evidence.declarationVote` « déclaration publique ou vote ».
Chaque niveau se distingue par le texte et une forme ou icône, jamais par la seule couleur.
États : les trois niveaux.

## Règles communes

- Indicateur de focus : anneau `--color-focus`, épaisseur 2 px, décalage 2 px, visible dans les
  deux thèmes (contraste ≥ 3:1 avec le fond).
- Cibles tactiles ≥ 44 × 44 px pour tout élément interactif.
- Aucun composant n'importe `next/*` sauf `PageShell` (pour `next/link`) ; aucun n'importe
  `src/core`.
- Chaque composant a un test Vitest couvrant ses interactions (sélection, bornes, états) et un
  rendu par état ; les stories sont exécutées en tant que tests avec vérification d'accessibilité.
