# `src/core` — cœur métier

Ce dossier accueille le **domaine** de radar-2027 : des fonctions pures, sans interface,
consommées par les scripts de données, les parcours (004) et les résultats (005). L'API publique
est réexportée par [`index.ts`](index.ts) (`@/core`) et décrite dans
[`specs/003-domaine-score-selection-codec/contracts/core-api.md`](../../specs/003-domaine-score-selection-codec/contracts/core-api.md).

| Module | Rôle | Fonctionnalité |
|---|---|---|
| [`dataset/`](dataset) | types et schémas Zod du jeu publié, couverture de corpus, pouvoir discriminant | 002 |
| [`types.ts`](types.ts) | `Mode`, `Answer`, `ResultState`, motifs typés, constantes (`N`, planchers, poids, seuils) | 003 |
| [`ratio.ts`](ratio.ts) | rationnels exacts en BigInt, troncatures en pourcentage | 003 |
| [`bank/`](bank) | vue « version de banque » d'un `main.json` (`bankFromDataset`), sujets prioritaires | 003 |
| [`selection/`](selection) | quotas, remplissage glouton, tourniquet : `selectQuestions` | 003 |
| [`score/`](score) | concordance, scores de thème, `P`, `W`, couverture, plafond `G = min(W, P)`, bandes, classement : `scoreCandidates` ; exemples A et B | 003 |
| [`codec/`](codec) | fragment `#1.<charge>` ↔ état : base64url, 3 bits par réponse, CRC-8, motifs de rejet ; fragments de référence | 003 |

Graphe de dépendances : `dataset ← bank ← selection ← score, codec`. `zod` est la seule
dépendance tierce autorisée dans `src/core` (validation pure, sans I/O).

## Règles

- **Arithmétique exacte** : toute grandeur de score est un `Ratio` BigInt ; les pourcentages
  affichés sont tronqués en entiers (`floorPercentSigned`, `floorPercentUnit`) et décident rangs
  et bandes. Le champ `approx` (flottant) ne sert qu'à l'affichage.
- **Erreurs** : une `StateError` (ou `BankError`) signale un appel incorrect ; un lien invalide
  produit toujours un `DecodeResult` `{ ok: false, reason }`, jamais d'exception.
- **Aucune chaîne destinée à l'utilisateur** : seulement des identifiants typés (`Band`,
  `RejectionReason`, `ExclusionReason`, `'others'`) que les interfaces traduisent.
- Les banques fictives de test (`bank/fixtures.ts`) ne sont pas réexportées ; les tests du
  domaine ne lisent jamais `public/data`.

## Rejouer un ancien lien (004, 005)

Chaque version de banque fige thèmes, questions, candidats et positions. Un lien se décode avec
la version qu'il désigne, jamais avec la version courante (FR-039, FR-040) :

```ts
const header = decodeHeader(hash, registry.current);              // sans banque : version, mode, sujets
if (!header.ok) return showRejection(header.reason);
const ds = header.value.bankVersion === registry.current
  ? currentMain
  : await fetchMain(header.value.bankVersion);                     // effet de bord : hors de src/core
const bank = bankFromDataset(MainDatasetSchema.parse(ds));
const decoded = decodeFragment(hash, bank);
if (!decoded.ok) return showRejection(decoded.reason);
const selection = selectQuestions(bank, decoded.value.mode, decoded.value.priorities);
const board = scoreCandidates({ bank, selection, state: decoded.value, versionCount: registry.current });
// board.priorVersion et board.bankPublishedAt signalent une version antérieure.
```

Un nouveau résultat s'encode toujours avec la banque de la version courante
(`encodeFragment(state, currentBank)`, FR-038).

## Frontière

Conformément au principe III de la [constitution](../../.specify/memory/constitution.md) :

- aucun import de `react`, `react-dom`, `next`, `next/*`, ni de `src/ui`, `src/app` ou `scripts/` ;
- aucun accès au DOM, au réseau, à l'horloge ou à l'aléatoire ;
- uniquement des fonctions pures et déterministes, couvertes par des tests unitaires et des
  tests de propriétés.

La frontière est imposée par la règle `no-restricted-imports` de `eslint.config.mjs`, appliquée
à `src/core/**`. Un import interdit fait échouer `pnpm lint` en désignant la ligne fautive.
Le test `src/lib/core-boundary.test.ts` vérifie que cette règle reste active.
