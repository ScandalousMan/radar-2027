# Contrat : données chargées, trafic, lien de partage, modification des réponses

## 1. Chargeur de détail (`src/lib/dataset-client.ts`)

```ts
export function loadDetail(version: number, candidateId: string, fetcher?: typeof fetch): Promise<CandidateDetail>;
// GET /data/versions/<version>/candidates/<candidateId>.json ; cache 'force-cache' ;
// CandidateDetailSchema chargé à la demande ; mémoïsé par (version, id) ; échec non mémorisé
```

`candidateId` vient du jeu publié (identifiant validé par la 002), jamais du fragment ; il est
inséré tel quel après vérification `^[a-z0-9-]+$`.

## 2. Trafic autorisé sur `/resultats` (SC-003)

| Requête | Quand |
|---|---|
| ressources statiques du site | chargement |
| `GET /data/versions.json` | chargement |
| `GET /data/versions/<v>/main.json` | chargement (version du lien) |
| `GET /data/versions/<current>/main.json` | chargement, seulement si `v < current` (R4) |
| `GET /data/versions/<v>/candidates/<id>.json` | ouverture de la fiche `<id>` (R5) |

Aucune requête ne porte de query string, d'en-tête ajouté ni de corps ; aucune ne contient la
charge du fragment. Les liens vers les sources sont des navigations utilisateur en nouvel
onglet (`noreferrer`). Vérifié par `e2e/results.spec.ts` (liste blanche de motifs d'URL et
recherche de la charge dans chaque URL).

## 3. Lien de partage

- Forme : `<origin>/resultats#1.<charge base64url>` ; charge ≤ 62 caractères en mode complet
  (fragment ≤ 64 après `#`) et ≤ 30 en mode court (FR-025), garanti par
  `expectedPayloadLength` de la 003.
- Le lien partagé est reconstruit (`origin + '/resultats' + hash`), jamais `location.href`.
- Aperçu : `results.meta.title` / `results.meta.description`, identiques pour tous les liens,
  affichés dans `SharePanel` et servis dans les métadonnées de la page.
- Partage natif : `{ title: results.meta.title, text: results.meta.description, url }`.

## 4. Modification des réponses (`src/lib/questionnaire/from-result.ts`)

```ts
export type CarryResult = { kind: 'draft'; draft: Draft } | { kind: 'choose-themes'; preselected: readonly string[] };
export function draftFromResultState(state: ResultState, bank: QuestionnaireBank, now: string): Draft;          // même version
export function carryOver(state: ResultState, linkBank: BankVersion, current: QuestionnaireBank, now: string): CarryResult; // version antérieure
export function needsConfirmation(stored: Draft | null, next: Draft): boolean;                                   // data-model § 9
```

Flux « Modifier mes réponses » (et « Refaire » de l'avertissement de version, même flux) :
`draftFromResultState` si `state.bankVersion = currentBank.version`, sinon `carryOver` vers
`currentBank` ⇒ brouillon (ou `choose-themes`) ⇒ si
`needsConfirmation`, `ConfirmDialog` (`results.modify.confirm.*`) ⇒ sur accord, `writeDraft`
puis `/questionnaire/questions` (ou `/questionnaire` avec présélection pour `choose-themes`,
transmise par `history.state`, jamais par l'URL) ; sur refus, rien n'est écrit. Stockage
indisponible ⇒ notice de la 004 et le questionnaire démarre sans persistance.

Garanties testées : `decodeFragment(resultHref(draftFromResultState(s)))` redonne `s` (même
version) ; `carryOver` ne reporte que des réponses à des questions de même identifiant ; aucune
réponse inventée.

## 5. Carte de reprise terminée (`src/app/ResumePrompt.tsx`)

Brouillon complet ⇒ `loadMain(draft.bankVersion)` ⇒ `resultHref(draft, bank)` ⇒ `ResumeCard`
`status="complete"`. Échec de chargement ⇒ carte sans « Voir mes résultats » (statut
`resumable`, « Reprendre » mène à l'écran de fin de la 004).
