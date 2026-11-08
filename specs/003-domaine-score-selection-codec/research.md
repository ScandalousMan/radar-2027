# Recherche : moteur de score, sélection déterministe et codec URL

**Feature** : `003-domaine-score-selection-codec` · **Date** : 2026-11-08 · **Plan** : [plan.md](plan.md)

Le contexte technique ne contenait aucun `NEEDS CLARIFICATION` : la pile est imposée par la
constitution et le socle 001, et la spec fixe les formules. Les points ci-dessous sont les
décisions de conception qu'il fallait trancher avant d'écrire le modèle et les contrats.

## R1. Découpage en quatre modules sous `src/core`

- **Décision** : `bank` (vue d'une version), `selection`, `score`, `codec`, plus `types.ts`
  (types partagés) et `ratio.ts` (arithmétique). `codec` dépend de `selection` (longueur de
  charge, ordre des réponses) ; `score` dépend de `selection` (thème d'ancrage, ordre) ; tous
  dépendent de `bank` ; `bank` dépend de `dataset` (002).
- **Justification** : les trois règles ont des cycles de vie et des tests différents ; les
  séparer rend lisible la frontière avec la 002 (`dataset` décrit les fichiers, `bank` ce dont
  le domaine a besoin) et permet à la 004 de n'importer que `selection` et `codec`, et à la
  005 d'importer `score` et `codec`.
- **Alternatives** : un seul fichier `engine.ts` (illisible à 40 exigences) ; un paquet séparé
  (interdit par le principe VII tant qu'il n'y a qu'un consommateur).

## R2. Arithmétique rationnelle exacte en BigInt

- **Décision** : toutes les grandeurs du score (`s`, `S_t`, `P`, `W`, couverture, `G`) sont
  des rationnels `{ num: bigint; den: bigint }` réduits ; la troncature en pourcentage est
  `floor((num + den) · 100 / (2 · den))` en entiers pour une valeur de [−1, +1], et
  `floor(num · 100 / den)` pour une valeur de [0, 1] (couverture). Les comparaisons
  (plafond `min`, départage par `P`) sont des produits en croix. Les valeurs sont converties
  en `number` uniquement pour les champs d'affichage approximatifs (`approx`, barre de
  progression), jamais pour une décision.
- **Justification** : les moyennes de moyennes produisent des flottants comme 0,6249999 ;
  avec la troncature de FR-011, une erreur d'un ulp change le pourcentage affiché, le rang
  et la bande. Les dénominateurs (produits de jusqu'à 16 effectifs) dépassent 2⁵³ en `number`
  mais restent dérisoires pour BigInt. Coût : quelques centaines d'opérations BigInt par
  candidat, négligeable face à SC-008.
- **Alternatives** : `number` avec epsilon (fragile, non prouvable) ; entiers en « demi-points »
  (fonctionne pour `s` et `S_t`, pas pour `W` dont le dénominateur varie) ; bibliothèque de
  fractions (dépendance inutile pour six opérations).

## R3. Codec sans API d'environnement

- **Décision** : base64url (alphabet `A–Z a–z 0–9 - _`, sans `=`), empaquetage 3 bits et
  CRC-8 implémentés dans `src/core/codec`, sur `Uint8Array` et entiers. Le décodeur de
  base64url vérifie l'alphabet et exige que les bits de queue du dernier caractère soient nuls
  (sans quoi deux chaînes différentes décoderaient les mêmes octets et la bijection
  `encode(decode(c)) = c` serait fausse).
- **Justification** : `atob`/`btoa` et `Buffer` sont des API d'environnement (DOM ou Node),
  tolèrent le bourrage et les caractères parasites, et ne sont pas disponibles de manière
  identique partout ; une implémentation de 40 lignes est plus sûre et testable par propriété.
- **Alternatives** : `Buffer.from(…, 'base64url')` (Node seulement) ; `TextEncoder` (inutile,
  pas de texte).

## R4. Nombre de version dans l'état et dans la charge

- **Décision** : l'état porte `bankVersion` = numéro publié (entier ≥ 1, registre de la 002) ;
  la charge écrit `bankVersion − 1`. La validité d'un numéro est décidée par la liste des
  versions connues fournie par l'appelant (`versionCount` du registre : les numéros publiés
  sont contigus de 1 à `current`).
- **Justification** : aligne la spec (révision du 2026-11-08) et le registre sans off-by-one
  dans le code applicatif ; garde les fixtures de la spec (version 1 codée 0).

## R5. Décodage en deux temps

- **Décision** : `decodeHeader(fragment, versionCount)` effectue les vérifications de FR-033
  qui ne nécessitent pas la banque (préfixe, alphabet et bits de queue, version connue, bits
  réservés, masque : 3 à 5 bits) et retourne `{ bankVersion, mode, priorityIndices }` ;
  `decodeFragment(fragment, bank)` rejoue ces vérifications puis termine (thèmes existants
  dans la version, sélection recalculée, longueur, CRC, codes de réponse, bourrage). Les deux
  retournent un résultat `{ ok: true, … } | { ok: false, reason }`, jamais d'exception pour
  une donnée invalide ; une incohérence d'appel (`bank.version ≠ header.bankVersion`) est une
  erreur de programmation et lève.
- **Justification** : l'appelant (005) doit savoir quelle version charger avant de pouvoir
  décoder ; le `fetch` d'une version antérieure est un effet de bord qui n'a pas sa place dans
  `src/core`. Les motifs de rejet sont émis dans l'ordre de la spec, le premier échec
  l'emporte.
- **Alternatives** : `decode(fragment, loader: (n) => Promise<Bank>)` (introduit l'asynchrone
  et un effet dans le domaine) ; charger toutes les versions au démarrage (contraire à FR-040
  et au principe VII).

## R6. Chargement d'une version antérieure (contrat pour la 005)

- **Décision** : hors périmètre de la 003, mais contractualisé : la version courante est
  importée au build (`src/lib/dataset.ts`, 002) ; une version antérieure est récupérée par
  `fetch('/data/versions/<n>/main.json')`, validée par `MainDatasetSchema`, puis transformée
  par `bankFromDataset`. `BankVersion` expose `publishedAt` pour l'indicateur « version
  antérieure » de FR-040, et `Scoreboard.priorVersion` vaut `true` quand
  `bank.version < versionCount`.

## R7. Représentation des réponses et des sujets

- **Décision** : `Answer = ScaleValue | 'skipped' | 'unanswered'` ; `Priorities` =
  identifiants de thème (ensemble de 3 à 5, validé) ; en interne la sélection et le codec
  travaillent sur les indices canoniques (`theme.order`). L'état `ResultState` est le même
  objet pour la 004 (reprise, encodage) et la 005 (décodage, score).
- **Justification** : les identifiants restent lisibles dans l'application et les tests ; les
  indices restent une affaire d'encodage.

## R8. Sortie du score : exact, affiché, et détail

- **Décision** : chaque grandeur est livrée sous trois formes : `ratio` (exact, pour tests et
  départages), `percent` (entier tronqué, celui qu'on affiche et qui décide rang et bande) et
  `approx` (`number` pour une barre). Un score indéfini est `null`. Le niveau de preuve
  (`EvidenceCode`) accompagne chaque concordance par question sans intervenir dans le calcul
  (FR-015). Les motifs d'exclusion par question sont typés (`'skipped' | 'unanswered' |
  'unknown-position'`), tout comme les bandes et statuts (principe VI).
- **Alternatives** : n'exposer que des `number` (empêche les tests exacts de SC-005 et le
  départage de FR-012).

## R9. Fixtures partagées avec la page Méthodologie

- **Décision** : `score/examples.ts` exporte les exemples A et B (entrées et sorties
  attendues) et `codec/fixtures.ts` les deux fragments de référence ; ce sont des modules de
  `src/core` importables par la 005 pour afficher les exemples sans recopie (SC-001).
- **Justification** : le principe III exige que les formules publiées soient celles du code ;
  partager les fixtures est le moyen le plus simple de le garantir.

## R10. Stratégie de test

- **Décision** : fast-check pour les propriétés (arbitraires `arbState(bank)`, `arbBank`,
  `arbPriorities`), énumération exhaustive pour SC-004 (13 496 cas sur une banque fictive
  16 × 20, attendu < 10 s), mutations systématiques d'un fragment de référence pour SC-003
  (chaque position × substitution/insertion/suppression), et 1 000 charges aléatoires de
  longueur correcte (taux de rejet ≥ 99 % attendu, CRC-8 rejetant 255/256 des altérations
  aléatoires). Test de budget temps SC-008 : mesure et journalisation, échec au-delà de
  500 ms sur la machine de CI (marge × 5 par rapport au téléphone cible, non mesurable ici).
- **Alternatives** : snapshots (opaques, ne prouvent pas les propriétés).

## R11. Banques fictives

- **Décision** : `bank/fixtures.ts` fournit `syntheticBank({ themes: 16, perTheme: 20,
  version })` avec des identifiants `t00-q00…`, des `D_q` décroissants déterministes et des
  positions de candidats dérivées d'une formule (pas d'aléatoire), et `bankPair()` : deux
  versions où la seconde retire une question, en ajoute une et modifie une position (US4,
  SC-009). La banque réelle (`public/data`) n'est jamais lue par les tests du domaine.

## R12. Frontière et outillage existants

- **Constat** : la règle `no-restricted-imports` de `eslint.config.mjs` s'applique à
  `src/core/**/*.{ts,tsx}` et le test `src/lib/core-boundary.test.ts` vérifie qu'elle reste
  active : rien à ajouter pour les nouveaux dossiers. `fast-check` 4.10 et Vitest 5.1 sont en
  place (002). `zod` reste la seule dépendance tierce de `src/core`.
