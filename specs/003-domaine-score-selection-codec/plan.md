# Implementation Plan: Moteur de score, sélection déterministe des questions et codec URL

**Branch**: `003-domaine-score-selection-codec` | **Date**: 2026-11-08 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/003-domaine-score-selection-codec/spec.md`

## Summary

Livrer le cœur métier de radar-2027 sous la forme de quatre modules purs dans `src/core`, sans
aucune interface : une **vue « version de banque »** construite à partir du jeu publié de la 002
(`src/core/bank`), la **sélection déterministe** des questions (quotas, remplissage glouton,
tourniquet ; `src/core/selection`), le **moteur de score** (concordance, scores de thème, `P`,
`W`, couverture, plafond strict, bandes, classement ; `src/core/score`) et le **codec** fragment
d'URL ↔ état (charge binaire, base64url, CRC-8, motifs de rejet typés ; `src/core/codec`). Les
calculs de score se font en arithmétique rationnelle exacte (BigInt) pour que troncatures,
plafonds et départages ne dépendent jamais d'un arrondi flottant. Chaque règle est couverte par
des tests unitaires et des tests de propriétés fast-check ; les exemples chiffrés de la spec
(A, B, deux fragments) sont des fixtures exportées, réutilisables par la page Méthodologie
(005). Aucune dépendance ajoutée.

## Technical Context

**Language/Version**: TypeScript 5.9 (strict), Node.js 24, pnpm 12 (socle 001 inchangé)

**Primary Dependencies**: aucune nouvelle. Utilisées : `zod` 4.6 (déjà seule dépendance de
`src/core`, pour valider un `main.json` d'une version antérieure avant d'en faire une
`BankVersion`), `fast-check` 4.10 (tests de propriétés, déjà présent), Vitest 5.1. Pas de
`Buffer`, `atob`/`btoa`, `TextEncoder` ni API Web : base64url et CRC-8 sont implémentés dans le
module (quelques dizaines de lignes), ce qui garantit la pureté et l'identité du résultat entre
Node et navigateur.

**Storage**: aucun. Entrées : `MainDataset` et `VersionRegistry` publiés par la 002
(`public/data/**`), chargés par l'appelant (build pour la version courante, `fetch` à la demande
pour une version antérieure, hors périmètre). Sortie : état dans le fragment d'URL, jamais
persisté par ce module.

**Testing**: projet Vitest `unit`, tests à côté des modules (`*.test.ts`, en-tête
`// @vitest-environment node`) : exemples de la spec, propriétés fast-check (SC-002, SC-003,
SC-005, SC-006), énumération exhaustive des 13 496 combinaisons (SC-004), fragments de référence
caractère par caractère (SC-007), test de budget temps (SC-008, exécuté sans seuil bloquant en
CI, seuil informatif), rejeu inter-versions sur deux banques fictives (SC-009). Le test de
frontière `src/lib/core-boundary.test.ts` existant couvre les nouveaux dossiers.

**Target Platform**: navigateurs evergreen (exécution dans l'application statique) et Node 24
(tests, scripts) ; code ES2022 sans API d'environnement

**Project Type**: bibliothèque de domaine interne au projet unique (module `src/core`), sans
interface ni commande

**Performance Goals**: classement complet (22 candidats, 100 questions, 16 thèmes) et décodage
d'un lien chacun < 100 ms sur téléphone d'entrée de gamme (SC-008) ; attendu : < 5 ms sur
poste de développement ; énumération SC-004 < 30 s en CI

**Constraints**: fonctions pures et déterministes, aucun import React/DOM/Next, aucune horloge
ni aléatoire (principe III, lint de frontière) ; état complet dans le fragment et bijection
(principe II) ; troncature et plafond strict exacts (FR-010, FR-011) ; motifs de rejet typés,
aucune chaîne destinée à l'utilisateur dans `src/core` (principe VI)

**Scale/Scope**: 16 thèmes (jusqu'à 24), 100 ou 25 questions sélectionnées sur une banque de
96 aujourd'hui et 250 à 300 à terme, ~22 candidats, 256 versions au plus ; 4 modules, ~15
fichiers source, ~12 fichiers de test, 0 composant, 0 route

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principe | Exigence applicable | Comment le plan y répond | Statut |
|---|---|---|---|
| I. Neutralité et traçabilité | positions sans source ou `draft` jamais dans un score | le module ne lit que `main.json` publié, où ces positions sont déjà `null` (002 FR-022) ; une case `null` est « inconnue » et exclue (FR-002) ; le niveau de preuve est transmis sans pondération (FR-015, R8) | ✅ |
| II. Vie privée | état complet dans le fragment, bijection, aucun envoi serveur | codec `#1.<charge>` (R3), propriétés `decode∘encode = id` et `encode∘decode = id` (SC-002) ; aucun accès réseau dans `src/core` ; l'appelant n'utilise jamais la query string | ✅ |
| III. Cœur métier pur | `src/core` sans React/DOM/Next, pur, testé par propriétés, formules = page Méthodologie | quatre modules sous `src/core/**` couverts par la règle `no-restricted-imports` existante ; arithmétique exacte (R2) ; fast-check sur chaque propriété ; exemples A, B et fragments exportés comme fixtures (R9) | ✅ |
| IV. Design system d'abord | composants dans `src/ui` | sans objet : aucune interface ; les résultats structurés sont conçus pour les composants des 004 et 005 | ✅ (n/a) |
| V. Tests comme contrat, CI bloquante | tests unitaires en CI ; e2e par parcours | tous les tests dans le projet Vitest `unit` exécuté par `pnpm test` et la CI ; les e2e relèvent des 004 et 005 | ✅ |
| VI. i18n | aucune chaîne utilisateur en dur | le module n'émet que des identifiants typés (`RejectionReason`, `Band`, `ExclusionReason`, pseudo-thème `others`) ; les libellés sont traduits par les fonctionnalités d'interface | ✅ |
| VII. Simplicité, statique, sobriété | pas de backend, projet unique, données légères | pas de dépendance ni de paquet ; les versions antérieures ne sont chargées que si un lien les référence (FR-040, R6) ; le module n'embarque aucune donnée | ✅ |
| Contraintes techniques | TypeScript strict, Vitest, échelle −2…+2, 1 ou 2 thèmes par question | types `ScaleValue` et `PublishedQuestion` réutilisés de `src/core/dataset` | ✅ |

**Pré-recherche** : aucun écart. **Post-conception** : aucun écart. `BigInt` est une primitive
du langage, pas une dépendance ; base64url et CRC-8 sont réimplémentés (R3) plutôt
qu'empruntés aux API d'environnement, précisément pour respecter le principe III.

## Project Structure

### Documentation (this feature)

```text
specs/003-domaine-score-selection-codec/
├── plan.md                      # ce fichier
├── research.md                  # R1–R12 : découpage, arithmétique exacte, codec, API, tests
├── data-model.md                # entités du domaine : banque, état, sélection, résultat, charge
├── quickstart.md                # scénarios de validation par user story
├── contracts/
│   ├── core-api.md              # API publique de src/core (types, fonctions, erreurs)
│   └── link-format.md           # format binaire du lien v1, fixtures caractère par caractère
├── checklists/requirements.md
└── tasks.md                     # produit par /speckit-tasks (pas par ce plan)
```

### Source Code (repository root)

```text
src/core/
├── README.md                    # mis à jour : quatre modules, frontière inchangée
├── index.ts                     # réexports publics (bank, selection, score, codec, types)
├── types.ts                     # Mode, Answer, ResultState, Priorities, bornes (N, planchers, poids)
├── ratio.ts                     # rationnels exacts BigInt : add, mul, div, cmp, floorPercent  (+ ratio.test.ts)
├── dataset/                     # inchangé (002)
├── bank/
│   ├── bank.ts                  # BankVersion : thèmes ordonnés, index des questions, D_q, positions ; fromDataset()
│   ├── fixtures.ts              # banques fictives de test : syntheticBank(T, perTheme), bankPair() pour SC-009
│   └── bank.test.ts
├── selection/
│   ├── quotas.ts                # quotas par thème (FR-021)                       (+ quotas.test.ts)
│   ├── fill.ts                  # remplissage glouton et second passage (FR-022, FR-023, FR-024)
│   ├── order.ts                 # tourniquet par thème d'ancrage (FR-025, FR-026)
│   ├── select.ts                # selectQuestions(bank, mode, priorities) → Selection
│   └── select.test.ts           # scénarios US2, propriétés, énumération des 13 496 combinaisons
├── score/
│   ├── concordance.ts           # s = 1 − 0,5·|u − c| et motifs d'exclusion (FR-001, FR-002)
│   ├── themes.ts                # scores de thème, pseudo-thème « autres » en mode court (FR-004, FR-013)
│   ├── candidate.ts             # P, W, couverture, statut, plafond, bande (FR-005 → FR-010, FR-014)
│   ├── rank.ts                  # tri, rangs ex æquo (FR-011, FR-012)
│   ├── score.ts                 # scoreCandidates(input) → Scoreboard
│   ├── examples.ts              # exemples A et B de la spec (fixtures partagées avec la page Méthodologie)
│   └── score.test.ts            # exemples, scénarios US1, propriétés SC-005, rejeu SC-009
└── codec/
    ├── crc8.ts                  # CRC-8 polynôme 0x07, table précalculée      (+ crc8.test.ts)
    ├── base64url.ts             # encode/décode sans bourrage, contrôle des bits de queue
    ├── bits.ts                  # empaquetage/dépaquetage 3 bits, bourrage nul
    ├── payload.ts               # état ↔ octets : en-tête, masque, réponses, somme (FR-029 → FR-032)
    ├── encode.ts                # encodeFragment(state, bank) → '#1.…' ou erreur d'état invalide (FR-036)
    ├── decode.ts                # decodeHeader(), decodeFragment() : vérifications dans l'ordre FR-033
    ├── fixtures.ts              # les deux fragments de référence de la spec
    └── codec.test.ts            # fixtures, propriétés SC-002/SC-003/SC-007, mutations
```

**Structure Decision** : projet unique conservé (principe VII) ; tout vit sous `src/core`, déjà
protégé par la règle de lint et le test de frontière de la 001. Le module `dataset` de la 002
reste la seule description du jeu publié ; `bank` en est une vue dérivée, pour que `selection`,
`score` et `codec` ne manipulent jamais directement la forme des fichiers. Rien n'est ajouté à
`src/app`, `src/ui` ni `scripts/` : la consommation (chargement d'une version antérieure,
affichage, libellés) appartient aux 004 et 005, dont les contrats sont fixés dans
[contracts/core-api.md](contracts/core-api.md).

## Approche de mise en œuvre (ordre proposé pour /speckit-tasks)

1. **Fondations** : `types.ts` (constantes `N`, planchers, poids, bornes de sujets),
   `ratio.ts` avec ses propriétés, `bank/` (vue + banques fictives), mise à jour du README.
2. **Sélection (US2)** : quotas (scénarios 1 à 3, propriété « somme = N »), remplissage
   (scénarios 5, 7, 8), tourniquet (scénario 6, SC-006), déterminisme (scénario 4), énumération
   SC-004.
3. **Score (US1)** : concordance, thèmes et pseudo-thème, agrégats et statut, classement ;
   fixtures A et B ; scénarios 3 à 7 ; propriétés SC-005 ; test de budget temps SC-008.
4. **Codec (US3)** : CRC-8, base64url, bits, charge, encodeur, décodeur ; fragments de
   référence ; propriétés SC-002, SC-003, SC-007 ; mutations (substitution, insertion,
   suppression) ; motifs de rejet et ordre des vérifications.
5. **Versions (US4)** : banque fictive en deux versions, rejeu d'un lien émis en version 1
   après publication de la version 2 (SC-009), refus d'une version inconnue, indicateur
   « version antérieure ».
6. **Intégration** : `src/core/index.ts`, vérification `pnpm lint` (frontière) et
   `pnpm verify` vert.

Les étapes 2, 3 et 4 sont indépendantes une fois la 1 posée ; la 5 dépend des 2 à 4.

## Risques et parades

| Risque | Parade |
|---|---|
| Arrondis flottants faussant une troncature ou un départage (62,5 % → 61 %) | arithmétique rationnelle exacte en BigInt (R2) ; `floorPercent` entier ; propriétés sur des valeurs au bord (`x,5`) |
| Divergence entre la sélection recalculée au décodage et celle du partage (D_q ou ordre différents) | la sélection ne lit que la version figée (FR-039) ; l'énumération SC-004 et le rejeu SC-009 testent la stabilité ; `D_q` jamais recalculé (FR-020) |
| Durée de l'énumération exhaustive SC-004 en CI | banque fictive légère (16 × 20) ; attendu quelques secondes ; repli : échantillon fast-check + énumération complète sous un drapeau `RADAR_FULL_ENUMERATION` si > 30 s |
| Banque réelle < 100 questions à la première publication | cas couvert par FR-019 et FR-032 ; test dédié « banque de 96 » ; SC-007 vérifié sur banque ≥ N |
| `BigInt` et cibles de compilation | `target` ES2020+ déjà requis par Next 16 ; vérifié au typecheck |
| Thèmes au-delà de 24 ou masque hors plage | `MAX_THEMES = 24` déjà imposé par le schéma de la 002 ; l'encodeur refuse (FR-036) |

## Complexity Tracking

Aucune dérogation à la constitution n'est nécessaire ; cette section reste vide.
