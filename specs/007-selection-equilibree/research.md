# Research: Sélection équilibrée

Décisions prises pendant le plan (2026-11-21). Aucun point « NEEDS CLARIFICATION » ne reste.

## R1. Choisir les règles de sélection d'après la version

- **Decision** : le `main.json` d'une version déclare `selectionRules: 2` à partir de la version 3. Une version sans ce champ suit les règles de 003 (règles 1). `bankFromDataset` expose `selectionRules: 1 | 2`, et `selectQuestions` choisit le remplissage en conséquence. Toute autre valeur est refusée par le schéma du jeu publié, puis par `bankFromDataset` (`BankError('unknown-selection-rules')`), et n'est jamais traitée avec d'autres règles (FR-014).
- **Rationale** : les versions 1 et 2 publiées restent intactes (empreintes de PUB-IMMUTABLE) et continuent de valider sans le champ. La règle voyage avec la donnée, si bien qu'une fixture ou une banque de test peut choisir ses règles sans dépendre d'un numéro de version.
- **Alternatives considered** : un seuil sur le numéro de version (`version >= 3`), écarté parce qu'il lie le code à la numérotation et casse les fixtures minimales, qui portent la version 1. Déduire les règles de la présence des enjeux, écarté parce que c'est implicite et qu'une version partiellement étiquetée serait ambiguë.

## R2. Où porter l'enjeu

- **Decision** : le champ `subject` (identifiant kebab-case) est ajouté à chaque question du corpus YAML (`QuestionSchema`, optionnel au schéma, exigé par une règle) et projeté dans `main.json` (`questions[].subject`) quand `selectionRules` vaut 2. `BankQuestion` gagne `subject: string | null` (`null` pour les règles 1).
- **Rationale** : la sélection est rejouée dans le navigateur à partir du seul `main.json`. L'enjeu doit donc y figurer. Le coût est d'environ 310 × 30 octets, soit environ 9 Kio, sous le budget de 300 Kio (v2 : 107 Kio).
- **Alternatives considered** : un fichier séparé `subjects.json`, écarté (une requête de plus et un second fichier à figer). Des groupes déclarés au niveau de la banque (`subjects: [{id, questions}]`), écarté parce qu'il dédouble l'information portée par la question et complique la relecture question par question.

## R3. Algorithme des règles 2

- **Decision** : nouveau module `src/core/selection/fill-subject.ts`, qui réutilise `byDiscriminant`, `questionsByTheme` et `rotationOrder` :
  1. premier passage : parcours des thèmes dans l'ordre de rotation ; pour chaque thème, on retient la meilleure question **éligible** (thème porté, non retenue, enjeu libre) jusqu'à ce que le nombre de questions **ancrées** sur lui atteigne son quota ;
  2. second passage : tant que la liste compte moins de `N` questions et qu'un thème a encore une question éligible, on fait des tours dans l'ordre de rotation, avec une question par thème et par tour ;
  3. le tourniquet `roundRobin` n'est pas modifié (FR-013).
- **Rationale** : c'est la transcription directe de FR-008 à FR-012. Compter seulement l'ancrage garantit `Σ ancrées = Σ quotas = N` dès que chaque thème a assez d'enjeux libres, ce qui donne le plancher de chaque thème (SC-002) et supprime le déversement dans le premier thème prioritaire (SC-003).
- **Alternatives considered** : garder le crédit multi-thème et seulement exclure les enjeux, écarté parce que cela ne corrige pas les thèmes sans question. Un second passage proportionnel aux poids, écarté parce que les tours unitaires suffisent et que le texte de FR-011 les impose.
- **Contrôle préalable** (simulation du 2026-11-21 sur la banque v2) : avec l'algorithme actuel, Fiscalité reçoit 9 questions sur 25 (Éducation, Fiscalité, Immigration, mode court), et 5 thèmes n'ont aucune question ancrée. Les tests du nouvel algorithme reprennent ce cas.

## R4. Validation du corpus : règle SUBJECT

- **Decision** : la nouvelle règle `scripts/data/lib/rules/SUBJECT.ts` signale :
  - une **erreur** pour une question active sans `subject` ;
  - un **avertissement** pour un thème actif dont le nombre d'enjeux distincts, sur ses questions actives (thème principal ou secondaire), est inférieur à `maxPriorityQuota` (réutilisé depuis AXIS-DIM, 13 avec 18 thèmes) ;
  - un **avertissement** informatif par enjeu partagé, pour que le rapport de validation liste les regroupements (US3 scénario 1).

  Le format de l'identifiant est vérifié par le schéma (`IdSchema`).
- **Rationale** : c'est le même patron que AXIS-DIM, avec les quotas réels de `@/core`. Le manque d'enjeux sur un thème n'empêche pas de publier (la liste reste à `N` grâce au second passage), d'où l'avertissement plutôt que l'erreur (FR-005).
- **Alternatives considered** : une erreur bloquante sur le nombre d'enjeux, écartée parce qu'elle bloquerait la publication pour un thème mince alors que la spec accepte le cas (Edge Cases).

## R5. Étiquetage et relecture

- **Decision** : l'agent étiquette les 310 questions actives (et les questions retirées, pour la cohérence) en insérant une ligne `subject:` juste après le bloc `themes:` de chaque entrée YAML. L'insertion se fait par un script de transformation textuelle à usage unique, qui préserve commentaires et mise en forme (leçon de la PR #20). Il produit le dossier `data/relectures/2026-11-21-enjeux.md`, qui contient :
  1. les enjeux partagés, avec énoncés côte à côte et case à cocher ;
  2. les cas limites laissés séparés, avec le motif (FR-002) ;
  3. la table des enjeux distincts par thème au regard de `maxPriorityQuota`.

  adrien relit le dossier, puis l'agent applique ses corrections. La validation est consignée dans le dossier (date et relecteur) et dans le message de commit.
- **Rationale** : l'enjeu sert la sélection et n'a pas de valeur éditoriale publique ; un champ de relecture par question (`subjectReviewedBy`) alourdirait le schéma sans bénéfice. La relecture en lot, appuyée sur le dossier, suffit et suit la pratique des relectures précédentes (`data/relectures/`).
- **Alternatives considered** : faire étiqueter par un modèle via l'API, écarté (règle « extraction en session par l'agent, jamais payante »). Un regroupement automatique par similarité textuelle, écarté parce que des énoncés proches peuvent porter sur des leviers différents (âge légal / pénibilité), et l'inverse.

## R6. Figer les liens v2 avant de changer le code

- **Decision** : généraliser `scripts/results/replay-v1-fixture.ts` en `replay-fixture.ts --version <n>`, et produire `src/lib/results/replay-v2.fixture.json` (20 liens v2) **avant** toute modification de `src/core/selection`, sur la v2 alors courante. Le test de rejeu est paramétré pour les fixtures v1 et v2 (SC-006).
- **Rationale** : le rejeu ne prouve rien si la fixture est produite avec le nouveau code. La garde actuelle (« la version courante doit être 1 ») devient « la version courante doit être `n` ».
- **Alternatives considered** : produire la fixture depuis `main` dans un worktree après coup, écarté parce que c'est plus fragile et inutile si l'ordre des tâches est respecté.

## R7. Page Méthodologie

- **Decision** : la page ne décrit pas aujourd'hui la sélection des questions. On ajoute une section « Choix des questions » (clés i18n `methodology.selection.*`), affichée quand la version courante déclare `selectionRules: 2`. Elle énonce : une question par enjeu, au moins une question par thème en mode court et trois en mode complet, les thèmes prioritaires approfondis.
- **Rationale** : FR-018 ; la page présente la version courante, qui sera la v3.

## R8. Vérification exhaustive des critères de succès

- **Decision** : un test Vitest `src/core/selection/balanced.audit.test.ts` parcourt les 12 444 combinaisons de 3 à 5 thèmes parmi 18, dans les deux modes, sur la banque publiée la plus récente qui déclare les règles 2 (sauté tant qu'aucune n'existe). Il vérifie SC-001 à SC-004. Les tests de propriétés (fast-check) sur des banques générées couvrent les mêmes invariants indépendamment des données.
- **Rationale** : environ 25 000 sélections à environ 0,2 ms chacune, soit quelques secondes. Si le budget de la suite est dépassé, le test passe dans la famille `*.perf.test.ts`, comme `validate.perf.test.ts`.

## R9. Découpage en pull requests

- **Decision** : une seule PR `007-selection-equilibree`, en trois temps : (1) fixture v2, code (cœur, schéma, règle, Méthodologie) et tests ; (2) étiquetage et dossier de relecture ; (3) après validation d'adrien, publication de la v3 dans la même PR.
- **Rationale** : l'application doit savoir lire `selectionRules: 2` au moment où la v3 est servie, et une seule PR garantit ce déploiement atomique. L'étiquetage n'est pas une donnée candidate (positions, sources) : la règle de PR distincte de la constitution ne s'applique pas.
