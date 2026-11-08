# Contrat : composants `src/ui` ajoutés ou étendus

Mêmes règles communes que le contrat de la 001 ([components.md](../../001-socle-design-system/contracts/components.md)) :
tokens seulement, `className` accepté, attributs HTML transmis à la racine, libellés fournis par
le parent ou lus via les clés i18n indiquées, story par état, test Vitest, a11y bloquante dans
les deux apparences, viewport 320 px vérifié, aucun import de `src/core` ni de `next/*`.

## LikertChoice (extension, rétrocompatible)

```ts
type LikertChoiceProps = {
  // … props existantes inchangées …
  /** Activation explicite d'une option (clic/toucher, Entrée, Espace) ; les flèches n'appellent que onChange. */
  onCommit?: (answer: Exclude<LikertAnswer, null>) => void;
};
```

Comportement : `onChange` puis `onCommit` lors d'un clic ou d'Entrée/Espace sur une option (y
compris déjà sélectionnée : `onCommit` est appelé même si la valeur ne change pas) ; flèches,
Début, Fin : `onChange` seul. Test ajouté : « clic appelle onChange et onCommit ; flèche
droite n'appelle que onChange ; Entrée sur l'option focalisée appelle onCommit ».

## ModeChoice

```ts
type ModeOption = { mode: 'full' | 'short'; questionCount: number };
type ModeChoiceProps = {
  options: readonly ModeOption[];           // les deux modes, nombre exact de questions (R8)
  value: 'full' | 'short' | null;
  onChange: (mode: 'full' | 'short') => void;
  legend: string;
  disabled?: boolean;
};
```

Rendu : `<fieldset>` + `role="radiogroup"`, deux cartes radio (`Card` interactive) : titre
(`ui.modeChoice.short.title` / `full.title`), `ui.modeChoice.questions` ({count} questions),
durée (`ui.modeChoice.short.duration` / `full.duration`), détail (`ui.modeChoice.short.detail` :
seuls les sujets clés sont détaillés ; `full.detail`). Flèches : déplacent sélection et focus ;
cibles ≥ 44 px ; empilement vertical à 320 px. États : aucun choisi, court, complet, désactivé.

## QuestionCard

```ts
type QuestionTheme = { id: string; label: string; priority: boolean };
type QuestionCardProps = {
  position: number;                 // 0-based ; affiché n = position + 1
  total: number;
  statement: string;                // énoncé tel que publié
  themes: readonly QuestionTheme[]; // 1 ou 2 ; priority distingue le sujet clé (texte + style, jamais couleur seule)
  value: LikertAnswer;
  onChange: (next: LikertAnswer) => void;
  onCommit: (answer: Exclude<LikertAnswer, null>) => void;
  disabled?: boolean;
  /** Référence posée sur l'énoncé pour le focus au changement de question. */
  headingRef?: React.Ref<HTMLHeadingElement>;
  /** Aide affichée une seule fois (première question) : différence entre « Neutre » et « Passer ». */
  hint?: string;
};
```

Rendu : `<article>` ; `<h2 tabIndex={-1}>` = énoncé ; liste des thèmes en `ThemeChip` non
interactives (`aria-pressed` absent, variante lecture : `role="listitem"`, préfixe
`ui.questionCard.priorityTheme` « Sujet clé : {label} » en texte masqué) ; `LikertChoice`
(`legend` = `ui.questionCard.answerLegend` « Votre réponse », `name = question-{position}`,
`labelledBy` = identifiant de l'énoncé : le groupe est nommé « énoncé + Votre réponse », FR-032).
États : sans réponse, chaque niveau, passée, deux thèmes dont un clé, avec aide, désactivée,
320 px.

## ResumeCard

```ts
type ResumeCardProps = {
  mode: 'full' | 'short';
  done: number;                      // questions traitées (répondues ou passées)
  total: number;
  updatedAt: string;                 // déjà formaté par le parent (useFormatter)
  status: 'resumable' | 'version-changed';
  onResume?: () => void;             // requis si resumable
  onRestart: () => void;             // ouvre la confirmation (parent)
  onClear: () => void;               // ouvre la confirmation (parent)
};
```

Rendu : `Card` avec en-tête `ui.resumeCard.title` ; corps `ui.resumeCard.summary`
({mode}, {done}, {total}, {date}) ; si `version-changed` : `Notice` avertissement
`ui.resumeCard.versionChanged` et pas de bouton Reprendre ; actions : Reprendre (primaire),
Recommencer (secondaire), Effacer (ghost). États : reprenable, version changée, 320 px.

## ConfirmDialog

```ts
type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  destructive?: boolean;             // style du bouton Confirmer
  onConfirm: () => void;
  onCancel: () => void;              // aussi appelé sur Échap et clic hors boîte
};
```

Rendu : `<dialog>` ouvert par `showModal()` quand `open` passe à `true`, `aria-labelledby`
(titre) et `aria-describedby` (texte) ; focus initial sur Annuler ; à la fermeture, le focus
revient à l'élément actif avant l'ouverture. États : fermé, ouvert, destructif, 320 px.

## Notice

```ts
type NoticeProps = {
  tone: 'info' | 'warning';
  title?: string;
  children: React.ReactNode;
  /** `status` (défaut) ou `alert` pour une annonce immédiate. */
  role?: 'status' | 'alert';
};
```

Rendu : encart bordé, icône par ton (forme distincte, pas seulement couleur), `role` ARIA.
États : info, avertissement, avec titre, long texte à 320 px.

## AnswerSummary

```ts
type AnswerSummaryItem = { id: string; label: string; answered: number; skipped: number; unanswered: number; reliable: boolean };
type AnswerSummaryProps = {
  items: readonly AnswerSummaryItem[];     // sujets clés en ordre canonique
  minReliable: number;                     // MIN_THEME_QUESTIONS, passé par le parent
};
```

Rendu : `<ul>` ; par sujet : libellé, `ui.answerSummary.counts` ({answered} répondues,
{skipped} passées, {unanswered} non répondues), marque texte `ui.answerSummary.unreliable`
(« trop peu de réponses pour un score fiable (minimum {min}) ») si `!reliable`. États : tous
fiables, un non fiable, tous non fiables (toutes passées), 320 px.

## Stories et tests requis

| Composant | Stories (états) | Tests Vitest (interactions) |
|---|---|---|
| LikertChoice | + « commit » (play function) | onCommit clic / Entrée ; flèches sans commit |
| ModeChoice | vide, court, complet, désactivé | clic et flèches changent la valeur ; `aria-checked` |
| QuestionCard | 8 états listés | focus via `headingRef` ; thèmes clés annoncés ; propagation `onCommit` |
| ResumeCard | reprenable, version changée | boutons appellent les rappels ; Reprendre absent si version changée |
| ConfirmDialog | fermé, ouvert, destructif | Échap → onCancel ; focus initial ; retour du focus |
| Notice | info, warning, avec titre | rôle ARIA |
| AnswerSummary | fiable, mixte, tout passé | marque « peu fiable » selon `minReliable` |
