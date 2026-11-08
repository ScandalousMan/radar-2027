# Quickstart : valider le cœur métier (score, sélection, codec, versions)

Guide de vérification de la fonctionnalité `003-domaine-score-selection-codec`. Chaque
scénario renvoie à une user story de [spec.md](spec.md) ; l'API est dans
[contracts/core-api.md](contracts/core-api.md), le format de lien dans
[contracts/link-format.md](contracts/link-format.md), les entités dans
[data-model.md](data-model.md). Cette fonctionnalité n'a pas d'interface : tout se vérifie par
les tests du projet Vitest `unit` et par le lint de frontière.

## Prérequis

- Socle 001 et outillage 002 installés (`pnpm install --frozen-lockfile`, Node 24, pnpm 12).
- Aucune donnée réelle n'est nécessaire : les tests utilisent des banques fictives
  (`src/core/bank/fixtures.ts`). `vitest` se lance avec `</dev/null` dans un terminal non
  interactif.

## 0. Frontière et pureté (principe III)

```bash
pnpm lint
```

Attendu : aucune erreur ; la règle `no-restricted-imports` couvre `src/core/**`. Contre-épreuve :
ajouter `import 'react'` dans `src/core/score/score.ts` fait échouer le lint en désignant la
ligne. `src/lib/core-boundary.test.ts` reste vert.

## 1. Score plafonné (US1)

```bash
pnpm vitest run src/core/score src/core/ratio.test.ts </dev/null
```

Attendu :

- Exemple A (`EXAMPLE_A`) : `S_économie` 62 %, `S_santé` `null` (une seule question
  exploitable), `W = P = 1/4`, `G` 62 %, couverture 75 %, statut `ranked`, bande
  `rather-aligned`.
- Exemple B : `W` 70 %, `P` 50 %, `G` 50 % (plafond strict).
- Scénarios 3 à 7 : couverture 50 % → `insufficient-data` avec scores de thème fournis ; `P`
  indéfini → insuffisant malgré 90 % de couverture ; rangs `1, 1, 3` avec Y avant X ;
  `W` 85 % / `P` 72 % → `G` 72 %, pas `very-aligned` ; niveau de preuve sans effet.
- Propriétés fast-check (SC-005) : jamais `global.percent > priority.percent` ; jamais
  `very-aligned` sans `P ≥ 80` ; ordre stable ; troncature exacte sur des valeurs au bord
  (`floorPercentSigned(1/4) = 62`).
- Budget (SC-008) : le test `score.perf` journalise la durée d'un classement de 22 candidats ×
  100 questions × 16 thèmes ; échec au-delà de 500 ms sur la machine de CI.

## 2. Sélection déterministe (US2)

```bash
pnpm vitest run src/core/selection </dev/null
```

Attendu :

- Quotas : complet + 3 sujets → `14, 14, 14` et `5 × 6`, `4 × 7` (total 100) ; court + 5 sujets
  → `3, 3, 3, 3, 2` et `1 × 11` ; complet + 5 sujets → `12, 11, 11, 11, 11` et `4 × 11`.
- Égalité de `D_q` tranchée par identifiant croissant ; thème trop petit comblé au second
  passage ; question à deux thèmes créditée aux deux.
- Tourniquet : jamais deux thèmes d'ancrage identiques consécutifs tant que deux thèmes
  restent ; les trois premières questions sont celles des trois sujets prioritaires en ordre
  canonique.
- Énumération exhaustive (SC-004) : 13 496 combinaisons (2 modes × 6 748 sous-ensembles de 3 à
  5 thèmes parmi 16), `Σ quotas = N`, `N` questions distinctes, deux appels identiques. Durée
  attendue : quelques secondes (journalisée).
- Banque de 96 questions (état réel) : la sélection complète retient 96 questions.

## 3. Lien compact, fidèle et vérifié (US3)

```bash
pnpm vitest run src/core/codec </dev/null
```

Attendu :

- `FRAGMENT_FULL_EXAMPLE` : `#1.AACEAgDFgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMM`
  (44 octets, 59 caractères, CRC `C3`) ; `FRAGMENT_SHORT_EXAMPLE` : `#1.AAGFEgDFgAAAAAAAAAAAng`
  (16 octets, 22 caractères).
- Propriétés (SC-002) sur ≥ 10 000 états aléatoires (deux modes, 3 à 5 sujets, toutes
  réponses, plusieurs versions) : `decode(encode(s)) = s` et `encode(decode(c)) = c`.
- Mutations (SC-003) : pour chaque position du fragment complet, substitution par chaque
  caractère de l'alphabet, insertion et suppression → 100 % rejetés avec un motif parmi
  `invalid-length`, `invalid-content`, `invalid-checksum` ; ≥ 99 % de 1 000 charges aléatoires
  de longueur correcte rejetées.
- Motifs : masque à 2 ou 6 bits, code 7, bourrage non nul, bits réservés → `invalid-content` ;
  préfixe `2.` ou absent → `unsupported-link-version` ; SC-007 : longueur indépendante des
  sujets et réponses.

## 4. Versions immuables et anciens liens (US4)

```bash
pnpm vitest run src/core/bank src/core/score/replay.test.ts </dev/null
```

Attendu, avec `bankPair()` (version 2 : une question retirée, une ajoutée, une position
modifiée, un candidat retiré) :

- Un état encodé en version 2 porte l'octet `0x01` ; `decodeHeader` d'un lien version 1 avec
  `versionCount = 2` retourne `bankVersion: 1`.
- Le lien version 1 décodé avec la banque 1 reproduit la sélection et le `Scoreboard` exacts
  (scores, rangs, bandes, couvertures) obtenus avant la publication de la version 2 (SC-009),
  avec `priorVersion: true` et `bankPublishedAt` de la version 1.
- Octet `0x03` avec deux versions connues → `unknown-bank-version` ; `decodeFragment` avec la
  mauvaise banque → `unknown-bank-version`.

## 5. Tout le projet

```bash
pnpm verify
```

Attendu : lint, typecheck, `data:validate`, tests (dont les nouveaux), builds Storybook et
Next, e2e existants, tous verts. Aucune nouvelle dépendance dans `package.json`, aucun
fichier ajouté hors de `src/core/` et `specs/003-…/`.
