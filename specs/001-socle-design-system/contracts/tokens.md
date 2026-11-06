# Contrat des tokens de design (`src/ui/tokens.css`)

Les tokens sont déclarés dans un seul fichier CSS, consommés par Tailwind v4 via `@theme` et
redéfinis pour le thème sombre sous `[data-theme="dark"]`. Les classes utilitaires générées
(`bg-bg`, `text-fg`, `text-fg-muted`, `border-border`, `rounded-md`, `shadow-sm`, …) sont les
seules façons d'appliquer un style dans `src/app` et `src/ui`.

## Couleurs (sémantiques)

| Token | Rôle | Clair (proposé) | Sombre (proposé) |
|---|---|---|---|
| `--color-bg` | fond de page | `#fafaf9` | `#111113` |
| `--color-surface` | fond des cartes et champs | `#ffffff` | `#1b1b1f` |
| `--color-fg` | texte courant | `#1c1c1e` | `#f2f2f3` |
| `--color-fg-muted` | texte secondaire | `#5c5c62` | `#a8a8b0` |
| `--color-border` | bordures et séparateurs | `#d9d9de` | `#34343a` |
| `--color-accent` | action principale, sélection | `#0f766e` | `#2dd4bf` |
| `--color-accent-fg` | texte sur accent | `#ffffff` | `#06201d` |
| `--color-focus` | anneau de focus | `#0f766e` | `#5eead4` |
| `--color-danger` | erreur, limite dépassée | `#b42318` | `#f97066` |
| `--color-success` | validation | `#027a48` | `#32d583` |

Les valeurs sont des propositions : la teinte d'accent (ici un sarcelle, hors des couleurs
emblématiques des partis) est validée par le propriétaire à l'implémentation. Le test unitaire
`tokens.test.ts` calcule le contraste WCAG de chaque couple ci-dessous et échoue sous le seuil :

| Couple | Seuil |
|---|---|
| `fg` / `bg`, `fg` / `surface` | 4,5:1 |
| `fg-muted` / `bg`, `fg-muted` / `surface` | 4,5:1 |
| `accent-fg` / `accent` | 4,5:1 |
| `focus` / `bg`, `focus` / `surface` | 3:1 |
| `danger` / `bg`, `success` / `bg` | 4,5:1 |

## Espacements

Échelle en `rem` sur base 4 px : `--spacing-1` (0,25 rem) … `--spacing-16` (4 rem), plus
`--spacing-touch` (2,75 rem = 44 px) pour les cibles tactiles.

## Typographie

- `--font-sans` : pile système (`system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`) ;
  aucune police embarquée ni distante.
- Tailles : `--font-size-xs` 0,75 rem, `sm` 0,875, `base` 1, `lg` 1,125, `xl` 1,25, `2xl` 1,5,
  `3xl` 1,875 ; hauteur de ligne associée.
- Graisses : `--font-weight-normal` 400, `medium` 500, `semibold` 600.

## Rayons et ombres

- `--radius-sm` 0,25 rem, `md` 0,5 rem, `lg` 0,75 rem, `full` 9999 px.
- `--shadow-sm`, `--shadow-md` : ombres neutres, atténuées en thème sombre.

## Règles de lint associées

- Interdit dans `src/app` et `src/ui` (hors `tokens.css`) : couleurs hexadécimales, `rgb(`,
  `hsl(`, `oklch(`, et valeurs arbitraires Tailwind de couleur ou de taille (`bg-[#…]`,
  `text-[13px]`, `p-[7px]`). Une violation désigne la ligne fautive.
- La page Storybook `Fondations/Tokens` est générée à partir du même fichier CSS (lecture des
  variables au rendu), pour ne jamais diverger.
