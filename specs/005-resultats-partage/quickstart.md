# Quickstart : valider la 005 (résultats et partage)

## 1. Prérequis

- Branche `005-resultats-partage`, `pnpm install`.
- Aucune version publiée n'est nécessaire : les tests servent la banque fictive à deux versions
  de `e2e/fixtures/published.ts` par interception de route (R11). Rien de fictif sous
  `public/data`.
- Rappel : lancer Vitest avec `</dev/null` dans un shell non interactif.

## 2. Tests automatisés

```bash
pnpm test -- src/lib/results src/lib/questionnaire/from-result src/lib/dataset-client </dev/null
```

Attendu : projection conforme aux exemples A et B (SC-001), paliers, classification des liens,
report par identifiant, confirmation de remplacement, copie et repli.

```bash
pnpm build && pnpm e2e -- e2e/results.spec.ts
```

Attendu, par user story (voir [routes-and-views](contracts/routes-and-views.md)) :

| Story | Scénarios e2e |
|---|---|
| US1 | classement ordonné, rangs ex æquo, bandes, section « Données insuffisantes », aucun classable, phrase de plafonnement et lien Méthodologie |
| US2 | copie (presse-papiers accordé) puis réouverture dans `browser.newContext()` : chiffres identiques ; presse-papiers refusé ⇒ champ manuel ; fragment ≤ 64 / 32 ; « Modifier mes réponses » avec et sans brouillon existant (confirmation, refus) ; aperçu générique |
| US3 | fragment altéré, CRC faux, 2 sujets, 10 000 caractères ⇒ message invalide sans chiffre ; lien v1 alors que v2 est courante ⇒ avertissement daté, chiffres de v1, « ne se présente plus » ; lien v3 ⇒ invitation à recharger ; sans fragment ⇒ invitation à commencer |
| US4 | fiche classée et fiche insuffisante ; ordre des thèmes ; « autres thèmes » en mode court ; ligne inconnue ; passées ; non répondues ; requête du détail émise à l'ouverture seulement |
| US5 | comparaison à 2 puis 3, 4e refusé et annoncé, retrait, retour arrière, lien inchangé |
| Transversal | aucune requête hors [liste blanche](contracts/data-and-share.md#2-trafic-autorisé-sur-resultats-sc-003) ni contenant la charge ; parcours clavier classement → fiche → comparaison → partage |

## 3. Vérifications dans le navigateur (agent)

Sur l'export servi localement avec la banque fictive copiée dans une copie de `out/` hors dépôt
(méthode de T063 de la 004) :

- 320 px sur chaque vue et chaque état : `scrollWidth` = largeur ; comparaison en blocs.
- Clair et sombre : contraste du texte ≥ 4,5:1, des marqueurs de série ≥ 3:1 ; rendu atténué
  des données insuffisantes lisible ; ex æquo et sujets clés distingués sans la couleur seule.
- Arbre d'accessibilité : titres de vue focalisés, annonces « Lien copié » et limite de
  comparaison, en-têtes de tableau en comparaison large.
- Poids : JS initial de `/resultats` ≤ 200 ko compressés.

## 4. À faire après la première publication réelle

- SC-006 : ouverture d'un lien sur téléphone d'entrée de gamme en réseau mobile, classement
  < 2 s (prévisualisation Vercel).
- SC-007 : test utilisateur à cinq personnes (propriétaire ou testeurs recrutés) ; consigner
  les résultats ici.

## 5. Vérification complète

```bash
pnpm verify
```

Attendu : lint, typecheck, `data:validate`, tests unitaires et stories, build Storybook, build
Next, e2e tous verts.

## Résultats

Vérifications faites par l'agent le 2026-11-09 (T054), sur une copie de `out/` hors dépôt servie
localement avec la banque fictive à deux versions de `e2e/fixtures/published.ts` (registre
`current = 2`, `main.json` et fichiers de détail générés), comme pour T063 de la 004.

| Vérification | Résultat |
|---|---|
| axe-core 4.14 (violations critiques ou sérieuses), 11 vues/états × clair/sombre × 320/1024 px : classement, ancien lien (v1), fiche classée, fiche insuffisante, comparaison à 3, partage manuel, aucun classable, lien invalide, version inconnue, sans fragment, Méthodologie § calcul | **0 violation** sur les 44 combinaisons |
| 320 px, `scrollWidth` = largeur sur chaque vue et état | **1 défaut trouvé puis corrigé** : le bouton « Refaire le questionnaire avec les données actuelles » (libellé insécable) faisait déborder l'avertissement de version (436 px) ; il passe désormais à la ligne, comme « Répondre à davantage de questions ». Test e2e de non-régression ajouté |
| Contraste des marqueurs de série (≥ 3:1 sur `surface` et `bg`, clair et sombre) | vérifié par `src/ui/tokens.test.ts` |
| Rendu atténué des données insuffisantes | couleur `fg-muted` (≥ 4,5:1) sur `bg`, bordure en tirets, mention « données insuffisantes » en texte ; jamais l'opacité seule. En sombre, le texte secondaire sur fond de sujet clé était insuffisant dans `ThemeScoreList` : corrigé (texte principal), relevé par l'a11y Storybook |
| Ex æquo, sujets clés, données insuffisantes sans la couleur | texte « ex æquo », étoile + « sujet clé » (et « Sujet clé : … » lu), « données insuffisantes » ; vérifié aussi en `forced-colors: active` (e2e) |
| Arbre d'accessibilité | titres de vue focalisés (`h1` `tabIndex=-1`) ; retour au classement : focus sur « Voir le détail » du candidat quitté ; « Lien copié », ajouts, retraits et limite annoncés en `aria-live="polite"` ; lien invalide en `role="alert"` ; comparaison large en `<table>` avec `th scope` (e2e) |
| Clavier seul (SC-008) | classement → fiche → retour → comparaison → partage, focus visible à chaque étape (e2e) |
| JS initial de `/resultats` | brotli 178,4 ko (≤ 200 ko) ; gzip 205,0 ko (voir tasks.md § Mesure) |

Restent après la première publication réelle (§ 4) : SC-006 (< 2 s sur téléphone d'entrée de
gamme) et SC-007 (test utilisateur à cinq personnes).
