# Quickstart : valider la fonctionnalité 009

**Plan** : [plan.md](plan.md) · **Contrats** : [contracts/](contracts/)

Prérequis : Node 24, pnpm 12, `pnpm install`. Les commandes Vitest se lancent avec `</dev/null`.

## A. Non-régression avant tout changement du cœur

```bash
pnpm tsx scripts/results/replay-fixture.ts --version 4
```

```bash
pnpm tsx scripts/results/replay-fixture.ts --version 3 --allow-older
```

Attendu : `src/lib/results/replay-v3.fixture.json` et `replay-v4.fixture.json` sont créés, puis committés **avant** la modification de `src/core/selection`.

## B. Règles de sélection 3 (US1)

```bash
pnpm vitest run src/core/selection src/core/bank src/core/dataset src/lib/results </dev/null
```

Attendu :

- propriétés des règles 3 (enjeu unique, quotas d'ancrage, monotonie de la couverture, déterminisme) vertes ;
- cas US1 : 13 contre 7 → 13 ; couvertures égales → `D_q`, puis identifiant ;
- snapshot des règles 1 et rejeux v1 à v4 identiques (SC-003) ;
- schéma : refus de `coverage` hors règles 3 et de `coverage` incohérente.

## C. Banque resserrée et rapport (US2)

```bash
pnpm data:validate
```

```bash
pnpm data:publish --next --dry-run
```

Attendu, sur le corpus de la v4 : `k = 7`, environ 100 questions actives, 4 avertissements (Société, Santé, Sécurité, Institutions). Le fichier `data/reports/couverture-v5.md` donne les classés min/médiane/max par mode. Aucun fichier n'est écrit sous `public/data/`.

Contrôle du scénario US2 n° 3 : passer une question de réserve à `c_q = k` dans un corpus de test (fixture), relancer `--dry-run`, et constater qu'elle est désormais active.

## D. Agrégateurs et liste des trous (US3)

```bash
pnpm vitest run scripts/data/lib/rules/SRC-AGGREGATOR.test.ts scripts/data/lib/gaps.test.ts </dev/null
```

```bash
pnpm data:validate --corpus data/fixtures/violations/SRC-AGGREGATOR
```

(Le dossier de la fixture, pas son sous-dossier `corpus/` : sinon le cache et les versions publiées du dépôt sont lus avec le corpus de la fixture, et des centaines de violations sans rapport s'ajoutent.)

Attendu : une erreur `SRC-AGGREGATOR` qui nomme le domaine (code de sortie 1).

```bash
pnpm data:gaps --limit 60
```

Attendu : `data/reports/trous/<date>.{md,json}` est créé. Les premières missions concernent les candidats proches de 60 % et des questions actives ou promouvables. Les couples déjà cherchés sont en fin de liste.

Campagne (agent) : confier la mission 1 au sous-agent `french-political-source-researcher`. Vérifier ensuite trois choses :

- `data:validate` est vert ;
- chaque preuve cite une source primaire (`lead` éventuel vers l'agrégateur) ;
- les absences sont des lacunes `NOT_FOUND` avec `question`.

L'agent transcrit les preuves en positions `draft`. Relancer `pnpm data:gaps` : les couples consignés en lacune passent en « déjà cherché » ; les couples transcrits en `draft` ne sortent de la liste qu'une fois la position relue (une position `draft` n'est pas « connue »). Les positions `draft` restent hors de `data:publish --dry-run` jusqu'à la relecture (`pnpm data:review`).

## E. Publication v5 et critères de succès

```bash
pnpm data:publish --next
```

```bash
pnpm vitest run src/core/selection/balanced.audit.test.ts </dev/null
```

Attendu :

- le rapport `couverture-v5` indique `sc001: true` (court : au moins 10 classés au minimum et au moins 12 à la médiane) et, après campagne, `sc002: true` (complet : au moins 8 au minimum et au moins 10 à la médiane) ;
- l'audit exhaustif v5 confirme ces chiffres et les garanties de 007 ;
- l'audit v4 reste vert.

Si un critère n'est pas atteint, le rapport est soumis au propriétaire avant la PR de publication.

Parcours réel (navigateur intégré, `pnpm dev`) : thèmes Économie, Immigration et Travail, mode court, réponse à tout. Au moins 12 candidats doivent être classés (US1, scénario 3). La page Méthodologie montre la section couverture avec `k`. Un lien v4 partagé donne le même résultat qu'avant.

## F. Glossaire (US4, US5)

```bash
pnpm vitest run src/lib/glossary scripts/data/lib/rules/GLOSS.test.ts src/ui/DefinedTerm </dev/null
```

```bash
pnpm data:glossary --check
```

```bash
pnpm e2e e2e/glossary.spec.ts
```

Attendu :

- propriétés du repérage vertes ;
- `GLOSS` échoue sur sa fixture, en nommant le terme ;
- `--check` vert après `pnpm data:glossary` ;
- les 8 scénarios e2e (7 joués par Playwright, le n° 7 par les stories) de [defined-term-ui.md](contracts/defined-term-ui.md#e2e--e2eglossaryspects) sont verts.

Storybook (`pnpm storybook`, panneau Accessibility) : `DefinedTerm`, avec ses stories ouverte, longue et 320 px, ne montre aucune violation.

Inventaire : `data/relectures/<date>-glossaire.md` liste au moins 20 termes retenus, dont « aide médicale de l'État » et « droit du sol », et les termes écartés avec leur motif. Après validation d'adrien, les termes passent `reviewed` et `pnpm data:glossary` les publie. Dans le navigateur intégré, au questionnaire, toucher « droit du sol » à 320 px ouvre la bulle, et aucune réponse n'est enregistrée.

## G. Avant chaque PR

```bash
pnpm verify
```
