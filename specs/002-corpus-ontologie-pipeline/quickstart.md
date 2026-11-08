# Quickstart : valider le corpus et le pipeline de bout en bout

Guide de vérification de la fonctionnalité `002-corpus-ontologie-pipeline`. Chaque scénario
renvoie à une user story de [spec.md](spec.md) ; les formats sont dans
[contracts/corpus-files.md](contracts/corpus-files.md), les commandes dans
[contracts/cli.md](contracts/cli.md), le jeu publié dans
[contracts/published-dataset.md](contracts/published-dataset.md).

## Prérequis

- Socle 001 installé (`pnpm install --frozen-lockfile`, Node 24, pnpm 12).
- Pour le scénario 4 seulement : une clé d'API Anthropic dans `.env.local`
  (`ANTHROPIC_API_KEY=…`) ou un profil `ant auth login`. Aucune clé n'est nécessaire pour les
  scénarios 1 à 3 ni pour la CI.
- Le cache des sources vit dans `.cache/sources/` (ou `RADAR_SOURCE_CACHE_DIR`) ; il n'est
  jamais commité.

## 1. Référentiel : thèmes, candidats, banque (US1)

```bash
pnpm data:validate
```

Attendu sur le corpus du dépôt : `0 violation`, rapport dans `data/reports/validation.md`
listant les 16 thèmes dans l'ordre canonique, les effectifs par thème et par polarité, et des
avertissements : `BANK-SIZE` tant que la banque n'atteint pas 250 énoncés actifs,
`THEME-EMPTY` pour chaque thème encore sans énoncé actif (la première tranche est en
brouillon), `CACHE-MISSING` sans cache local.

Contre-épreuves (chaque fixture doit faire échouer la commande avec le code indiqué) :

```bash
pnpm data:validate --corpus data/fixtures/violations/FR-012
```

Attendu : code de sortie 1, violation `FR-012` désignant le thème avec ses effectifs
(ex. `economie : 7 '+' / 3 '-' (70 % / 30 %), attendu 40 %–60 %`). Même procédé pour
`REF-EXISTS` (thème inconnu), `FR-008` (trois thèmes), `ID-UNIQUE`, `FR-010` (énoncé actif
sans relecteur distinct), `FR-011` (texte publié modifié), `FR-004` (candidat sans source de
statut).

Le test d'intégration `scripts/data/validate.test.ts` parcourt toutes les fixtures de
`data/fixtures/violations/` et vérifie que chacune produit exactement son code (SC-001).

## 2. Sources et positions relues (US2)

Enregistrer une source (texte téléchargé ou fourni) :

```bash
pnpm data:source fetch https://exemple.fr/programme.pdf --candidate dupont --kind programme --title "Programme 2027" --published 2026-10
```

Attendu : `.cache/sources/<sha256>.txt` créé, entrée ajoutée à `data/corpus/sources/dupont.yaml`
avec `contentHash` ; `git status` ne montre que le fichier YAML (US2 scénario 1).

Saisir une position à la main dans `data/corpus/positions/dupont.yaml` (voir l'exemple du
contrat), puis :

```bash
pnpm data:validate
```

Contre-épreuves attendues : citation absente du cache ⇒ `FR-017` « citation introuvable » ;
position connue sans source ⇒ `FR-017` ; `evidence: programme` avec une seule source
`declaration_vote` ⇒ `FR-017` « niveau surévalué » ; `value: 3` ⇒ `SCALE`.

Relecture :

```bash
pnpm data:review dupont economie-smic-hausse --by adrien
```

Attendu : refus « le relecteur ne peut pas être l'auteur » (US2 scénario 4). Puis avec
`--by relecteur-1` : statut `reviewed`, `reviewer`, `reviewedAt`, `reviewedHash` posés.
Modifier ensuite `value` dans le YAML et relancer la validation : violation `FR-019`
(empreinte différente ⇒ la position doit repasser `draft`).

Position inconnue explicite (`value: unknown` avec sources consultées) : acceptée, et la
couverture du candidat dans le rapport n'augmente pas (US2 scénario 7).

## 3. Publication et page Méthodologie (US3)

```bash
pnpm data:publish --dry-run
```

Attendu : liste des différences avec la version courante (ou « rien à publier »), tailles
estimées de `main.json` et de chaque détail, aucune écriture.

```bash
pnpm data:publish --next
```

Attendu : `public/data/versions/<n+1>/main.json` et `candidates/*.json` créés,
`public/data/versions.json` complété, tailles sous 300 ko / 150 ko (SC-004). Dans
`main.json`, seules les positions `reviewed` et connues apparaissent ; une position `draft` à
+2 et une `contested` sont `null` (US3 scénario 1). Relancer `pnpm data:publish --next` sans
changement ⇒ refus « rien à publier ». Modifier à la main un octet de `main.json` d'une version
publiée puis `pnpm data:validate` ⇒ `PUB-IMMUTABLE` (SC-011).

Pouvoir discriminant (US3 scénario 6) : le test `src/core/dataset/metrics.test.ts` vérifie
que 11 positions connues sur 22 dispersées sur l'échelle donnent un `D_q` strictement supérieur
à 20 positions sur 22 toutes à +2 (qui vaut 0), et qu'une question à moins de deux positions
connues vaut 0 ; les propriétés `0 ≤ D_q ≤ 2` et `0 ≤ couverture ≤ 1` sont testées avec
fast-check.

Page Méthodologie :

```bash
pnpm build && pnpm start:static
```

Attendu sur <http://localhost:3000/methodologie> : règles, 16 thèmes dans l'ordre canonique,
critères d'inclusion et de retrait, trois niveaux de preuve, candidats avec statut et
couverture, numéro et date de version. Depuis la liste des candidats, une fiche
`/methodologie/candidats/<id>` montre chaque position avec valeur, niveau, citation et au moins
une source cliquable datée (SC-007 : 2 actions). Aucune requête hors `localhost`, aucun
cookie. Test Playwright `e2e/methodology.spec.ts` : présence des sections, parcours en deux
clics, lien de signalement pointant vers le suivi de tickets.

Storybook : stories `PositionCard` (valeur −2 à +2, ancienne, plusieurs sources) et
`CoverageList` (0 %, 60 %, 100 %) sans violation d'accessibilité dans les deux apparences.

**Poids mesuré le 2026-11-08 (T089).** Fixture minimale publiée (3 thèmes, 30 questions,
2 candidats) : `main.json` 7,7 ko, détails 0,6 à 0,8 ko. À l'échelle cible (300 questions,
22 candidats), l'estimation de research.md R10 reste d'environ 130 ko pour `main.json`, sous
le budget de 300 ko, et chaque publication mesure réellement les fichiers (`PUB-BUDGET`, refus
avant écriture). `zod` n'apparaît dans aucun fragment JavaScript chargé par `out/index.html` ni
par `out/methodologie.html` : la validation du jeu se fait au build. JavaScript de la page
d'accueil : 191,7 ko compressés (gzip), sous la limite de 200 ko (SC-011 de la 001).

Sans version publiée, `/methodologie` affiche les règles et un message d'attente, et l'export
contient une seule page réservée `/methodologie/candidats/_aucune-version` (page 404) : l'export
statique de Next exige au moins un paramètre pour une route dynamique.

## 4. Extraction assistée (US4, clé d'API requise)

```bash
pnpm data:extract --candidate dupont --max-cost 2 --dry-run
```

Attendu : tranches par source, jetons estimés, coût estimé, aucune requête. La simulation
fonctionne sans clé : les jetons sont estimés localement (environ 3,5 caractères par jeton).
La clé est lue dans l'environnement ou dans `.env.local` (chargé par `pnpm data:extract`).

```bash
pnpm data:extract --candidate dupont --max-cost 2
```

Attendu : `data/extractions/runs/<id>.json` avec modèle, version des consignes, version de
banque, sources et empreintes, effectifs, `usage`, `costUsd`, état `completed` ;
`data/extractions/affirmations/dupont.json` où chaque affirmation porte citation, localisation,
résumé, thèmes, question ou `null`, valeur proposée, confiance ; les citations non retrouvées
sont `unverifiable`. `pnpm data:costs` affiche le cumul (SC-006).

Idempotence (SC-005) : relancer trois fois la même commande ⇒ trois nouveaux journaux, zéro
affirmation modifiée, zéro position modifiée (`git diff --stat data/corpus` vide). Limite
connue (research R8) : si le modèle retrouve une citation **supplémentaire**, une affirmation
nouvelle apparaît ; elle n'altère rien d'existant et reste à relire.

Plafond : le plafond est comparé, avant chaque requête, au coût cumulé plus le coût maximal de
la requête suivante (entrée comptée et sortie au plafond de 16 000 jetons, soit environ 0,32 $
par tranche avec `claude-opus-5-5`). Un plafond inférieur à cette estimation arrête donc avant
la première requête ; un plafond compris entre une et deux estimations arrête avant la
deuxième, état `interrupted`, affirmations de la première tranche conservées (US4 scénario 7).

Transformation :

```bash
pnpm data:affirmation list --candidate dupont --state verifiable
pnpm data:affirmation accept 7b1d2c3e4f506172 --by adrien
```

Attendu : position `draft` ajoutée à `positions/dupont.yaml` avec `provenance.kind:
extraction`, l'affirmation passe `accepted` ; `pnpm data:review … --by adrien` refuse
(auteur) ; sans relecteur, `pnpm data:publish` publie cette position comme `null` (US4
scénario 6). `pnpm data:affirmation accept` sur une affirmation `unverifiable` ou sans
question ⇒ refus.

Sans clé d'API, le test `scripts/data/extract.test.ts` rejoue l'ensemble avec le client
factice (`fakeClient`) : plafond, idempotence, vérification des citations, journal.

## 5. Intégration continue

`pnpm verify` enchaîne désormais `data:validate` après `typecheck`. En CI le cache est absent :
les règles dépendant du cache passent en avertissement `CACHE-MISSING`, toutes les autres
restent bloquantes. La durée de `data:validate` sur le corpus complet doit rester sous
2 minutes (SC-010 ; attendu : quelques secondes).

**Mesure du 2026-11-08 (T088).** `RADAR_PERF=1 pnpm exec vitest run --project unit
scripts/data/validate.perf.test.ts` : corpus synthétique de 22 candidats, 16 thèmes,
304 questions, 6 600 positions relues avec cache et citations vérifiées, validé en **1,7 s**.

## Suivi de vérification (T091, 2026-11-08)

- [x] § 1 Référentiel : `pnpm data:validate` vert sur le dépôt ; chacune des 23 fixtures de
  `data/fixtures/violations/` échoue avec son code (test d'intégration et exécution à la main).
- [x] § 2 Sources et positions : `data:source fetch --from-file` et `check`, relecture refusée à
  l'auteur, `FR-019` après modification, inconnue explicite et contestée acceptées (tests
  `source`, `review`, `validate`).
- [x] § 3 Publication et Méthodologie : `--dry-run`, `--next`, « rien à publier », refus
  d'écrasement, `PUB-IMMUTABLE` (tests `publish`) ; pages vérifiées dans le navigateur à 375 px
  avec la fixture minimale publiée, e2e vert avec et sans version publiée.
- [ ] § 4 Extraction avec une vraie clé (`--max-cost 1` sur une source réelle) : **à faire par
  le propriétaire**. Le scénario complet est couvert sans clé par `scripts/data/extract.test.ts`
  (client factice) et `--dry-run` a été exécuté sans clé.
- [x] § 5 Intégration continue : `pnpm verify` enchaîne `data:validate` ; étape activée dans
  `ci.yml`.
