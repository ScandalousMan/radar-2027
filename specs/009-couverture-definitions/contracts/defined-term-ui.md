# Contrat : termes définis dans l'interface

**Recherche** : [../research.md](../research.md) R9, R10, R11. **Spec** : US4, FR-016 à FR-021.

## Repérage — `src/lib/glossary/annotate.ts`

```ts
export type GlossaryIndex;                                    // opaque, compilé une fois
export function compileGlossary(terms: readonly GlossaryTerm[]): GlossaryIndex;
export type Segment = { kind: 'text'; text: string } | { kind: 'term'; text: string; termId: string };
export function annotate(text: string, index: GlossaryIndex): readonly Segment[];
```

Propriétés testées (fast-check) :

1. `segments.map(s => s.text).join('') === text`.
2. Chaque `termId` au plus une fois.
3. Aucun segment `term` n'est bordé par une lettre ou un chiffre.
4. À la position de chaque segment `term`, aucune forme connue plus longue ne correspond.
5. Glossaire vide → un seul segment `text`.

Cas fixes : « droit du sol » contre « droit » ; « AME » contre « âme » ; « Droit du sol » en début de phrase ; apostrophes ’ et ' ; deux occurrences.

## Composants — `src/ui`

### `DefinedTerm`

```ts
type DefinedTermProps = {
  children: string;                 // texte tel qu'il apparaît dans l'énoncé
  term: { id: string; label: string; definition: string; sources: { url: string; title: string; publisher: string }[] };
  glossaryHref: string;             // ex. "/glossaire#aide-medicale-etat"
};
```

| Exigence | Comportement |
|---|---|
| Repère (FR-016) | bouton en ligne, souligné en pointillé, couleur du texte inchangée, anneau de focus du design system, curseur `help` à la souris |
| Ouverture (FR-017) | clic ou toucher (bascule) ; Entrée ou Espace ; survol à la souris après 300 ms |
| Maintien | ouverte tant que le pointeur est sur le terme ou la bulle ; un clic sur une bulle ouverte par survol la fixe |
| Fermeture (FR-017) | nouveau clic, toucher ou touche sur le terme ; `pointerdown` extérieur ; bouton Fermer ; Échap ; sortie du focus ; 200 ms après la sortie du pointeur (si non fixée) ; démontage |
| Focus | Échap ou Fermer depuis la bulle → focus au terme ; ordre de tabulation : terme, puis contenu de la bulle |
| Contenu (FR-018) | libellé (titre), définition, source(s) en lien (nouvel onglet, `rel="noopener"`), lien « Voir le glossaire », bouton Fermer |
| Géométrie (FR-018) | `popover="manual"` ; sous le terme, sinon au-dessus ; recadrée dans la fenêtre avec la gouttière de page ; largeur `min(20rem, 100vw − 2 × gouttière)` ; défilement interne au-delà de `min(50vh, 18rem)` ; gouttière, dimensions et délais en tokens (`--defined-term-*`, R9), lus par le calcul JS ; aucun défilement horizontal à 320 px |
| Assistance (FR-019) | `aria-expanded`, `aria-controls` ; `aria-describedby` vers « terme défini » (masqué) ; bulle `role="dialog"` non modale, `aria-labelledby` = libellé |
| Unicité (FR-019) | une seule bulle ouverte dans un `DefinedTermGroup` |
| Neutralité d'état (FR-018) | aucun appel au store du questionnaire, à l'historique ou à l'URL ; aucun `preventDefault` sur les gestes extérieurs |

Stories : fermé, ouvert, définition longue, 320 px, thème sombre, deux termes dans une phrase. L'addon a11y doit passer sans violation, bulle ouverte comme fermée.

### `AnnotatedText`

```ts
type AnnotatedTextProps = { text: string; glossary: GlossaryIndex | null; terms: ReadonlyMap<string, Term> };
```

Rend `annotate(text)` : texte brut et `DefinedTerm`. Avec `glossary` à `null`, il rend le texte seul (glossaire indisponible).

### Intégrations

- `QuestionCard` : `statement` rendu par `AnnotatedText` dans le `h2`, qui garde `tabIndex={-1}` et son focus programmatique. La carte a pour clé l'identifiant de la question, ce qui ferme la bulle au changement de question.
- `QuestionDetail` (résultats) : `text` rendu par `AnnotatedText` dans le `h4`.
- Le glossaire est récupéré une fois par le client (`src/lib/glossary/load.ts`), en parallèle du jeu de données, et partagé par un contexte (`src/lib/glossary/GlossaryProvider.tsx`). La lecture au build de la page `/glossaire` vit à part, dans `src/lib/glossary/load.server.ts`, seul module qui importe `node:fs`.

## Page `/glossaire`

- Composant serveur, rendu au build depuis `public/data/glossary.json`.
- `h1` « Glossaire », puis une liste de définitions (`dl`) par ordre alphabétique. Chaque terme porte une ancre `id` égale à son identifiant, sa définition et sa ou ses sources.
- Liens vers la page : depuis chaque bulle (`/glossaire#<id>`) et depuis Méthodologie.
- Chaînes d'interface sous `glossary.*` (`fr.json`).

## e2e — `e2e/glossary.spec.ts`

1. Question fictive contenant un terme. Clic : bulle visible, libellé, définition et source affichés. Échap : bulle fermée, focus sur le terme.
2. Clavier seul : Tab jusqu'au terme, Entrée, Tab dans la bulle, Fermer, focus revenu au terme.
3. Viewport 375 × 812, puis 320 de large : toucher le terme, bulle entièrement dans l'écran, `scrollWidth ≤ clientWidth`. Toucher hors de la bulle : fermée.
4. Ouvrir puis fermer la bulle : la question courante n'a toujours aucune réponse, et l'URL et le stockage local sont inchangés.
5. Passage à la question suivante, bulle ouverte : aucune bulle visible.
6. `/glossaire` : termes triés, ancre atteignable depuis la bulle.
7. Accessibilité automatique (SC-006) : couverte par l'addon a11y de Storybook (tests Vitest des stories `DefinedTerm` et `QuestionCard` avec terme, bulle ouverte et fermée, en bureau et à 320 px). Aucune dépendance axe n'est ajoutée à Playwright (principe VII).
8. Lien de résultats d'une version antérieure rejoué (FR-021) : un terme de l'énoncé est signalé dans le détail des réponses, et le classement est identique à celui obtenu sans glossaire (même fragment, glossaire indisponible).
