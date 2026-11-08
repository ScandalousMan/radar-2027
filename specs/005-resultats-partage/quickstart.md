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
