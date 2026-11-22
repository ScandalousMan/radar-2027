---

description: "Liste des tâches — 008 Dispositif de recherche de sources politiques"
---

# Tasks: Dispositif de recherche de sources politiques (présidentielle 2027)

**Input**: Design documents from `/specs/008-recherche-sources-politiques/`

**Prerequisites**: plan.md, spec.md, research.md (R1–R13), data-model.md, contracts/ (research-files, validation-rules, subagent-and-skill), quickstart.md

**Tests**: requis. FR-045 et SC-009 exigent des tests pour les règles de format ; la constitution (V) impose une règle = un fichier = un test = une fixture. Vitest se lance avec `</dev/null` (`pnpm vitest run scripts/data </dev/null`).

**Organization**: phases par user story. US1 (lancer le sous-agent) et US2 (le skill seul) forment ensemble le MVP : le sous-agent précharge le skill, et le skill porte toute la méthodologie. US3 (statuts de candidature) et US4 (audit et signalements) ajoutent chacune leur règle de validation. US5 (comparaison, thématique, enrichissement) ne demande aucun code : seulement des vérifications.

**Garde-fous valables pour toutes les tâches** (FR-042, FR-046, FR-049, FR-050) :

- ne jamais modifier `data/corpus/{candidates.yaml,themes.yaml,governance.yaml,questions/,positions/}`, `src/`, `public/data/`, le score, `data:publish`, `data:source` ni le schéma des sources ;
- ne jamais lancer `pnpm data:extract` (payant), `data:review` ni `data:publish` ;
- ne rien écrire sous `~/.claude/` ;
- ne pas modifier `data/fixtures/minimal/corpus/` (d'autres tests en dépendent) : la fixture minimale reçoit seulement un dossier `recherche/` ;
- les preuves réelles produites par les tests de mission ne sont ni commitées ni poussées sans demande explicite d'adrien (R12).

## Format: `[ID] [P?] [Story] Description`

- **[P]** : parallélisable (fichiers différents, aucune dépendance sur une tâche inachevée)
- **[Story]** : user story concernée (US1 à US5)

---

## Phase 1: Setup

**Purpose**: partir d'une base à jour, verte et figée.

- [X] T001 Mettre la branche `008-recherche-sources-politiques` à jour avec `main` (`git fetch origin && git rebase origin/main`), puis lancer `pnpm install`, `pnpm vitest run scripts/data </dev/null` et `pnpm data:validate` pour confirmer une base verte. Noter dans le message de fin de phase le nombre de tests et d'avertissements existants.
- [X] T002 Enregistrer les empreintes de référence (SC-003) avec la commande de [quickstart.md](./quickstart.md) §1 vers `$TMPDIR/radar-008-avant.sha` (fichiers `data/corpus/candidates.yaml`, `themes.yaml`, `governance.yaml`, `questions/`, `positions/`).
- [X] T003 [P] Retrouver le texte intégral de la demande d'adrien (description en 20 sections du 2026-11-22, session `e1330777-b2bf-40f7-a21e-ef871d18ddc9`, avec `mcp__ccd_session_mgmt__search_session_transcripts`) et l'enregistrer tel quel dans `specs/008-recherche-sources-politiques/demande.md`. Les tâches du skill s'y réfèrent pour les sections 3 (description de l'agent), 6 (niveaux de sources A, B, C), 15 (champs des preuves), 17 (13 rubriques du compte rendu) et 20 (livrable). Si le texte est introuvable, demander à adrien de le coller avant T024.

**Checkpoint**: base verte, empreintes enregistrées, demande d'origine disponible dans le dépôt.

---

## Phase 2: Foundational — charger le corpus de preuves dans la validation (bloquant)

**Purpose**: schémas, chargeur, contexte, règles génériques (identifiants, renvois) et élargissement de `REF-EXISTS`. Toutes les user stories en dépendent.

**⚠️ CRITICAL**: aucune tâche de user story ne commence avant la fin de cette phase.

- [X] T004 [P] Créer `scripts/data/lib/schema/research.ts` : schémas Zod stricts (`.strict()`) de [data-model.md](./data-model.md) §1 à §4, en réutilisant `IdSchema`, le schéma de jour et `DateWithPrecision` de `scripts/data/lib/schema/common.ts`. Listes fermées : 8 statuts de candidature, 4 statuts de citation, 4 qualités de source, 9 attributions, 4 confiances, 8 qualifications, 4 pertinences temporelles (`CURRENT`, `DATED`, `HISTORICAL`, `UNDETERMINED`), `transcript` (`official`, `manual`, `automatic`), 6 types de `locator`, 5 modes, 21 catégories (§3.1), 10 lacunes (§3.2), 5 types de signalement, `state` du journal et du signalement. Schémas : `PersonalitySchema` (avec `statuses` ≥ 1), `CandidacyStatusSchema`, `EvidenceSchema` (`statedAt` = `DateWithPrecision` ou littéral `unknown` ; `unregisteredSource`, `corroborations`, `history`, `rationale` aux cinq clés permises), `JournalSchema` (avec le champ facultatif `model`, modèle ayant mené la mission, par exemple `opus`), `GapSchema`, `SignalSchema`. Exporter le type `Research` (`personalities`, `evidence`, `journals`, `reports`, `signals`) et le tout depuis `scripts/data/lib/schema/index.ts`. Les contrôles croisés (champ requis selon un autre champ) restent dans les règles, pas dans le schéma.
- [X] T005 Ajouter à `scripts/data/lib/schema/schema.test.ts` : pour chaque liste fermée, une valeur hors liste refusée ; une clé inconnue refusée sur chaque objet ; les exemples de [contracts/research-files.md](./contracts/research-files.md) acceptés (dépend de T004).
- [X] T006 [P] Ajouter `researchDir` à `DataPaths` dans `scripts/data/lib/cli.ts` : `data/recherche` pour le dépôt (et pour un `--corpus` qui désigne directement un dossier de corpus), `<fixture>/recherche` pour une fixture. Cas correspondants dans `scripts/data/lib/cli.test.ts`.
- [X] T007 Créer `scripts/data/lib/research.ts` : `loadResearch(researchDir)` lit `personnalites.yaml`, `preuves/*.yaml`, `journaux/*.yaml`, `signalements.yaml` (fichier absent = liste vide) et relève les comptes rendus `journaux/*.md` avec leurs titres de niveau 2. Validation élément par élément sur le modèle de `scripts/data/lib/corpus.ts`. Chaque erreur Zod devient une violation `SCHEMA` dont l'entité désigne `recherche/<fichier>:<chemin>`. Tests dans `scripts/data/lib/research.test.ts` (dossiers temporaires : dossier absent, fichiers absents, élément fautif isolé, comptes rendus relevés). Dépend de T004.
- [X] T008 Brancher le chargement : `scripts/data/lib/context.ts` charge `ctx.research` si `researchDir` existe (`undefined` sinon) et fusionne ses violations `SCHEMA` avec celles du corpus ; `scripts/data/lib/rules/types.ts` reçoit `RuleContext.research?: Research` et les types d'entité `personality`, `evidence`, `journal`, `signal`. Vérifier que `validate.ts` et `report.ts` n'ont pas besoin d'autre changement. Dépend de T006 et T007.
- [X] T009 Créer la fixture minimale conforme `data/fixtures/minimal/recherche/` d'après [contracts/validation-rules.md](./contracts/validation-rules.md) § Fixtures. Contenu : `personnalites.yaml` avec **tous** les candidats de `data/fixtures/minimal/corpus/candidates.yaml`, soit `dupont` et `martin` (même identifiant, statut équivalent, chacun appuyé par une preuve `CANDIDACY`), plus une personnalité hors liste au statut `REPORTED_UNCONFIRMED` ; des preuves (`preuves/<id>.yaml`) couvrant `VERIFIED_QUOTE`, `PARAPHRASE`, `SOURCE_INACCESSIBLE` (avec `unregisteredSource`) et `CANDIDACY`. La citation `VERIFIED_QUOTE` doit être prise mot pour mot dans un texte de `data/fixtures/minimal/cache/` lié à une source de la fixture. La preuve de candidature de la personnalité hors liste est une `THIRD_PARTY_ATTRIBUTION` sur `unregisteredSource` (aucune source n'est ajoutée à `minimal/corpus/`). Ajouter aussi un journal `journaux/<YYYY-MM-DD-slug>.yaml` d'auteur `adrien` (la fixture n'a pas de contributeur `claude`, et `minimal/corpus/` ne doit pas changer), et son compte rendu `.md` avec les titres `## 1.` à `## 13.`, et un `signalements.yaml` avec un signalement `open` conforme. La fixture doit rester à 0 violation après chaque règle ajoutée dans les phases suivantes. Dépend de T004.
- [X] T010 Élargir `scripts/data/lib/rules/REF-EXISTS.ts` (R4) : un identifiant du champ `candidates` d'une source est accepté s'il figure dans `candidates.yaml` **ou** dans `ctx.research?.personalities`. Les positions restent limitées à `candidates.yaml`. Dans `scripts/data/lib/rules/REF-EXISTS.test.ts`, ajouter les cas « personnalité du registre de recherche acceptée » et « inconnue des deux registres refusée ». Ajouter la fixture `data/fixtures/violations/REF-EXISTS-research/` : copie de la fixture minimale (avec `recherche/`), dont une source vise un identifiant absent des deux registres. Dépend de T008.
- [X] T011 [P] Créer `scripts/data/lib/rules/RECH-ID.ts` et `RECH-ID.test.ts` (contrôles 1 à 4 de `RECH-ID`, cas conforme sur `minimalContext()` complété d'un `research` minimal), et la fixture `data/fixtures/violations/RECH-ID/` (deux preuves de même identifiant). Toute règle `RECH-*` renvoie `[]` si `ctx.research` est absent. Dépend de T008.
- [X] T012 [P] Créer `scripts/data/lib/rules/RECH-REF.ts` et `RECH-REF.test.ts` (contrôles 1 à 9 de `RECH-REF`), et la fixture `data/fixtures/violations/RECH-REF/` (preuve visant un thème inexistant). Dépend de T008.
- [X] T013 Enregistrer `RECH_ID` et `RECH_REF` en fin de `RULES` dans `scripts/data/lib/rules/index.ts`, avant `PUB-IMMUTABLE`, sans toucher `POSITION_RULES`. Lancer `pnpm vitest run scripts/data </dev/null` : nouvelles fixtures refusées avec leur code, fixture minimale conforme, corpus du dépôt conforme. Dépend de T009 à T012.

**Checkpoint**: `pnpm data:validate` lit `data/recherche/` (absent pour l'instant : rien à contrôler) et toutes les fixtures existantes restent vertes.

---

## Phase 3: User Story 1 + User Story 2 — sous-agent lancé explicitement, skill autoportant (Priority: P1) 🎯 MVP

**Goal**: adrien nomme le sous-agent `french-political-source-researcher` (modèle `opus`) et celui-ci démarre avec le skill préchargé. Il enregistre des preuves qualifiées que la validation contrôle, et rend un compte rendu en 13 rubriques. Le même skill peut aussi être sélectionné seul dans une session ordinaire.

**Independent Test**: [quickstart.md](./quickstart.md) §2 à §7 sur `bruno-retailleau` × `immigration` : sous-agent découvert et seul de son espèce, skill préchargé, demande ordinaire sans intervention du sous-agent, preuves conformes (`pnpm data:validate` à 0 violation), empreintes SC-003 inchangées, relance sans doublon, compte rendu complet. Pour US2 : `/french-political-source-research` chargé dans une session ordinaire, avec la règle du vote de groupe.

### Tests et règles pour US1

- [X] T014 [P] [US1] Créer `scripts/data/lib/rules/RECH-EVIDENCE.ts` et `RECH-EVIDENCE.test.ts` : contrôles 1 à 14 en erreur, 15 et 16 en avertissement (n° 16 : `CURRENT` avec `statedAt` de plus de 12 mois avant `verifiedAt` sans corroboration récente, seuil aligné sur la définition de [data-model.md](./data-model.md) §2.4). Le n° 9 compare `speaker` au nom et aux `aliases` sans accents ni casse (`normalize` de `scripts/data/lib/text.ts`). Le n° 11 compare les dates au préfixe de précision, comme `FR-013`. Le n° 14 compare les citations normalisées et le n° 15 utilise `sameWords`. `maxQuoteLength` est lu dans la gouvernance du contexte.
- [X] T015 [P] [US1] Créer `scripts/data/lib/rules/RECH-QUOTE.ts` et `RECH-QUOTE.test.ts` : contrôles 1 à 4, avec le cache et `findQuote` exactement comme `scripts/data/lib/rules/FR-017.ts` (avertissement `CACHE-MISSING` si le cache ou le texte manque).
- [X] T016 [P] [US1] Créer `scripts/data/lib/rules/RECH-JOURNAL.ts` et `RECH-JOURNAL.test.ts` : contrôles 1 à 7. Le n° 6 exige les titres `## 1.` à `## 13.` dans `journaux/<id>.md`, et le n° 4 demande au moins 5 requêtes et 3 catégories explorées pour une lacune `NOT_FOUND`.
- [X] T017 [P] [US1] Créer les fixtures de violation, chacune une copie de la fixture minimale avec une seule faute : `data/fixtures/violations/RECH-EVIDENCE/` (`VERIFIED_QUOTE` sans `locator`), `RECH-EVIDENCE-duplicate/` (même source et même citation deux fois), `RECH-QUOTE/` (citation `VERIFIED_QUOTE` absente du texte en cache), `RECH-JOURNAL/` (compte rendu privé de sa rubrique `## 13.`), `RECH-JOURNAL-notfound/` (lacune `NOT_FOUND` avec 2 requêtes).
- [X] T018 [US1] Enregistrer `RECH_EVIDENCE`, `RECH_QUOTE` et `RECH_JOURNAL` dans `scripts/data/lib/rules/index.ts` à la suite de `RECH_REF`. Lancer les tests de `scripts/data` : verts, fixture minimale toujours conforme. Dépend de T014 à T017.

### Corpus de preuves et documentation pour US1

- [X] T019 [P] [US1] Créer le squelette `data/recherche/` d'après [contracts/research-files.md](./contracts/research-files.md). Il contient : `README.md` (rôle, arborescence, jamais publié ni scoré, règles d'écriture « ajout en fin de liste, aucune suppression », renvoi au skill, aux contrats et à `pnpm data:validate`), `personnalites.yaml` et `signalements.yaml` (en-tête de commentaire, liste vide `[]`), et `preuves/.gitkeep`, `journaux/.gitkeep`. `pnpm data:validate` doit rester à 0 violation.
- [X] T020 [P] [US1] Ajouter à `data/README.md` une section « Corpus de recherche (spec 008) » (rôle, différence entre preuve et position, signalements, renvoi à `data/recherche/README.md`) et la ligne `recherche/` dans la section « Arborescence ».

### Skill autoportant pour US2 (un seul fichier, tâches successives)

- [X] T021 [US2] Réécrire `.claude/skills/french-political-source-research/SKILL.md` en français. Lire d'abord l'ancienne version en entier, puis remplacer son contenu. L'en-tête est **exactement** celui de [contracts/subagent-and-skill.md](./contracts/subagent-and-skill.md), sans `disable-model-invocation`. Rédiger ensuite les §0 à §3 du plan du corps : objet et principes, périmètre et fichiers (modifiables ou non), démarrage d'une mission (journal, lecture préalable des positions, sources et preuves existantes), les cinq modes (comparaison à critères identiques, thématique dans les deux sens de la polarité, audit adversarial sans lire d'abord la conclusion existante).
- [X] T022 [US2] Ajouter à `SKILL.md` les §4 à §6. §4 : les 8 statuts de candidature, avec exemples et contre-exemples, la règle « rumeur ≠ déclaration », l'historique et le signalement en cas d'écart avec la liste publiée. §5 : la hiérarchie des sources A, B, C telle qu'énumérée dans `demande.md` (T003), avec ces règles : un extrait de moteur de recherche n'est pas une preuve, l'original est ouvert, un paywall n'est pas contourné. §6 : les passes de recherche A à H reprises de l'ancien skill et alignées sur les 21 catégories de [data-model.md](./data-model.md) §3.1, avec des exemples de requêtes et l'obligation de ne pas s'arrêter à la première citation.
- [X] T023 [US2] Ajouter à `SKILL.md` les §7 à §11. §7 : vérification des citations (champs à relever, interdits de FR-020, vidéo avec horodatage et transcription, documents parlementaires, critères des quatre statuts de citation, transcription automatique jamais `VERIFIED_QUOTE`, pas de traduction d'une citation ; citation trouvée sous deux formulations dans deux médias : la forme de la source primaire prime, sinon les deux variantes sont recopiées dans `verificationNotes` et la citation reste `UNVERIFIED_QUOTE`). §8 : attribution (9 types et confiance ; un vote de groupe donne `PARLIAMENTARY_GROUP_POSITION`, ou `PERSONAL_ACTION` avec `actionScope`, sans en déduire l'argumentaire individuel ; désaccords avec le parti conservés). §9 : qualification relative à l'énoncé, tableau de précision des politiques repris de l'ancien skill, interdits de déduction. §10 : appréciations séparées et `rationale`. §11 : les quatre dates, `temporalRelevance` et contradictions.
- [X] T024 [US2] Ajouter à `SKILL.md` les §12 à §18. §12 : doublons et corroborations, avec les recherches à lancer dans le dépôt avant tout ajout et l'indépendance des sources. §13 : les dix lacunes et le seuil de `NOT_FOUND`. §14 : l'enregistrement pas à pas. Il reprend les exemples YAML de `research-files.md`, `pnpm data:source fetch` avec la correspondance du `kind` (R5), `--from-file` pour les transcriptions et l'avertissement attendu « candidat absent de candidates.yaml » pour une personnalité hors liste. Il couvre aussi l'historique des corrections. §15 : les cinq types de signalement, jamais résolus par l'agent. §16 : le contrôle final (`pnpm data:validate`, `git status`, relecture des citations). §17 : le gabarit du compte rendu en 13 rubriques, avec les étiquettes [Fait vérifié], [Citation], [Paraphrase], [Interprétation], [Hypothèse]. §18 : la liste des interdits (FR-049, FR-050). Vérifier que la description et `when_to_use` font moins de 1 536 caractères, et que chaque exigence FR-007 à FR-050 est portée par au moins une section.

### Sous-agent pour US1

- [X] T025 [US1] Créer `.claude/agents/french-political-source-researcher.md`. L'en-tête est **exactement** celui de [contracts/subagent-and-skill.md](./contracts/subagent-and-skill.md) (`model: opus`, `skills: [french-political-source-research]`, sans `tools`, `disallowedTools`, `permissionMode` ni `mcpServers`). Comparer la description à la section 3 de `demande.md` : en cas d'écart, le texte d'adrien l'emporte (précédé du nom affiché et suivi de la phrase d'invocation explicite), et l'en-tête de [contracts/subagent-and-skill.md](./contracts/subagent-and-skill.md) est corrigé dans la même tâche. Le corps reste court, avec les cinq sections du contrat : titre et rôle ; avant toute recherche ; ce qu'il peut écrire ; ce qu'il ne touche jamais ; avant de rendre la main.
- [X] T026 [US1] Supprimer `.claude/agents/political-source-researcher.md` (FR-006, jamais suivi par git), après en avoir lu le contenu pour vérifier que T021 à T024 reprennent tout ce qu'il a d'utile. Vérifier ensuite que `ls .claude/agents/` ne liste que le nouveau fichier et que `ls ~/.claude/agents/ ~/.claude/skills/ 2>/dev/null | grep -i political` ne renvoie rien (SC-007, SC-010).

### Validation de l'installation pour US1 et US2

- [X] T027 [US2] Vérifier la découverte et la sélection manuelle du skill ([quickstart.md](./quickstart.md) §3, points 2 et 3) : le skill figure dans la liste des skills de la session, `/french-political-source-research` le charge, et la règle du vote de groupe s'y trouve (US2, scénario 2). Si le skill n'apparaît pas, lancer `/reload-skills`, puis redémarrer la session.
- [X] T028 [US1] Vérifier la découverte du sous-agent et la contre-épreuve ([quickstart.md](./quickstart.md) §3, point 1, et §4, dernier paragraphe). Le sous-agent est le seul agent de recherche politique découvert. Une demande ordinaire ne l'appelle pas (US1, scénario 4). Limite à reporter dans le livrable (T047) : aucun réglage de Claude Code ne réserve un sous-agent aux demandes qui le nomment ; seule sa description l'en dissuade (R1).
- [X] T029 [US1] Lancer le test non destructif ([quickstart.md](./quickstart.md) §4 et §5) avec la demande en langage naturel qui nomme le sous-agent, limitée à `bruno-retailleau` × `immigration`. Contrôler que l'intervention vient du sous-agent, qu'il applique le skill sans l'invoquer, qu'il ouvre un journal et qu'il crée l'entrée `bruno-retailleau` du registre. Cette entrée porte le statut `DECLARED` à la date de `candidates.yaml`, appuyé par une preuve `CANDIDACY` d'attribution `PERSONAL_DIRECT` ou `PERSONAL_DOCUMENT` (la source de déclaration déjà enregistrée peut servir), pour que `RECH-STATUS` reste conforme une fois T033 en place. À la fin, `git status --short` ne montre que `data/recherche/**` et, au plus, `data/corpus/sources/bruno-retailleau.yaml`, et `shasum -a 256 -c "$TMPDIR/radar-008-avant.sha" | grep -v ': OK$'` ne renvoie rien (SC-003).
- [X] T030 [US1] Contrôler le résultat du test ([quickstart.md](./quickstart.md) §6 et §7). `pnpm data:validate` donne 0 violation. Chaque preuve a une URL directe, `verifiedAt`, `attribution`, `quoteStatus` et `sourceQuality` (SC-004). Ouvrir à la main deux citations `VERIFIED_QUOTE` dans leur source (SC-005). Le compte rendu `data/recherche/journaux/<id>.md` contient les 13 rubriques étiquetées, avec passage et URL pour chaque constat (SC-006). Relancer la même demande, puis vérifier avec `git diff --stat data/recherche/preuves/` et `pnpm data:validate` qu'aucune preuve n'est en double (SC-008).

**Checkpoint**: MVP opérationnel. Le sous-agent et le skill sont installés au niveau du projet, le test non destructif est validé et la validation contrôle les preuves. Les preuves du test restent hors commit.

---

## Phase 4: User Story 3 — statuts de candidature de toutes les personnalités pertinentes (Priority: P2)

**Goal**: le registre suit les huit statuts avec leur historique daté et prouvé. Une rumeur n'est jamais `DECLARED`, et tout écart avec la liste publiée produit un signalement, jamais une modification.

**Independent Test**: dans une copie de travail, enregistrer une personnalité hors liste avec une preuve `THIRD_PARTY_ATTRIBUTION` en `REPORTED_UNCONFIRMED` ; la validation l'accepte. La passer à `DECLARED` sans propos personnels ; la validation refuse (`RECH-STATUS` n° 3 ou 4). `candidates.yaml` reste inchangé.

- [X] T031 [P] [US3] Créer `scripts/data/lib/rules/RECH-STATUS.ts` et `RECH-STATUS.test.ts` : contrôles 1 à 5 en erreur, 6 en avertissement. Le statut courant est le dernier de `statuses`. Les équivalences avec la liste publiée sont `declared` ↔ `DECLARED` et `withdrawn` ↔ `WITHDRAWN`. Une personnalité hors liste au statut courant `DECLARED` exige un signalement `CANDIDATE_STATUS` (R10). Cas couverts : renoncement puis nouvelle annonce (trois statuts conservés), statut rapporté par un tiers, écart avec la liste publiée sans signalement.
- [X] T032 [P] [US3] Créer les fixtures `data/fixtures/violations/RECH-STATUS/` (statut `DECLARED` appuyé seulement sur une preuve `THIRD_PARTY_ATTRIBUTION`) et `data/fixtures/violations/RECH-STATUS-signal/` (candidat de la fixture passé à `WITHDRAWN` dans le registre, sans signalement `CANDIDATE_STATUS`).
- [X] T033 [US3] Enregistrer `RECH_STATUS` dans `scripts/data/lib/rules/index.ts` à la suite de `RECH_JOURNAL`, puis lancer les tests de `scripts/data` (fixture minimale conforme, corpus du dépôt conforme hormis les avertissements n° 6). Dépend de T031 et T032.
- [X] T034 [US3] Mettre à jour [quickstart.md](./quickstart.md) §6 : tant que le registre n'est pas amorcé (T048), `pnpm data:validate` émet un avertissement `RECH-STATUS` n° 6 par candidat publié absent du registre. Ces avertissements sont attendus et ne bloquent pas la CI.

**Checkpoint**: le registre des statuts est contrôlé ; les candidatures hors liste publiée sont admises sans toucher au site.

---

## Phase 5: User Story 4 — audit adversarial et signalements (Priority: P2)

**Goal**: toute preuve susceptible de modifier une position, tout écart de citation, tout doublon possible et toute contradiction non résolue produisent un signalement daté pour revue humaine, sans modifier les positions ni le score.

**Independent Test**: dans une copie de travail, ajouter une preuve `EXPLICIT_OPPOSITION` sur une question où le candidat a une position de valeur positive ; la validation refuse tant qu'aucun signalement `POSITION_REVIEW` ne cite la preuve. Puis lancer un audit sur 2 ou 3 positions existantes : les positions restent identiques octet pour octet.

- [X] T035 [P] [US4] Créer `scripts/data/lib/rules/RECH-SIGNAL.ts` et `RECH-SIGNAL.test.ts` : contrôles 1 à 3 en erreur, 4 en avertissement. Le n° 3 compare la qualification (`*_SUPPORT` / `*_OPPOSITION`) à la valeur d'une position `draft` ou `reviewed` du même candidat sur la même question (`ctx.corpus.positions`). Une résolution par `claude` est refusée.
- [X] T036 [P] [US4] Créer les fixtures `data/fixtures/violations/RECH-SIGNAL/` (preuve de signe contraire à une position de la fixture, sans `POSITION_REVIEW`) et `data/fixtures/violations/RECH-SIGNAL-resolution/` (signalement `resolved` sans `resolution`, contrôle n° 2). La fixture minimale n'a pas de contributeur `claude` : le cas `resolution.by: claude` est couvert par `RECH-SIGNAL.test.ts`, pas par une fixture.
- [X] T037 [US4] Enregistrer `RECH_SIGNAL` dans `scripts/data/lib/rules/index.ts` à la suite de `RECH_STATUS`, puis lancer les tests de `scripts/data`. Dépend de T035 et T036.
- [X] T038 [US4] Valider l'audit adversarial (US4, scénarios 1 et 2). Demander au sous-agent, en le nommant, un audit `ADVERSARIAL_AUDIT` de 2 ou 3 positions `reviewed` de `bruno-retailleau` sur `immigration`. Vérifier que chaque constat cite le passage et l'URL, que tout écart produit un signalement `QUOTE_DISCREPANCY` ou `POSITION_REVIEW` `open`, et qu'aucune position n'est modifiée (`shasum -a 256 -c "$TMPDIR/radar-008-avant.sha"`). Vérifier aussi que `pnpm data:validate` reste conforme. Rien n'est commité.

**Checkpoint**: les sept règles `RECH-*` sont en place ; la revue humaine est tracée sans aucune modification automatique.

---

## Phase 6: User Story 5 — comparaison, recherche thématique, enrichissement (Priority: P3)

**Goal**: les modes `COMPARISON`, `THEMATIC` et `GLOBAL_ENRICHMENT` fonctionnent avec des critères de preuve identiques et des recherches dans les deux sens. Aucun code nouveau.

**Independent Test**: une comparaison de deux personnalités sur une question montre les mêmes catégories explorées pour chacune ; une recherche thématique sur une question cherche dans les deux sens de sa polarité.

- [X] T039 [US5] Relire les §3 et §17 de `.claude/skills/french-political-source-research/SKILL.md`. Le mode comparaison doit imposer les mêmes catégories de sources pour chaque personnalité et un tableau des lacunes par personnalité dans le compte rendu. Le mode thématique doit chercher des preuves dans les deux sens de la polarité de chaque question et le dire. L'enrichissement doit couvrir lacunes, déduplication et mise à jour de `verifiedAt` sans réécrire l'historique. Compléter le skill si un de ces points manque.
- [X] T040 [US5] Valider le mode comparaison (US5, scénario 1). Demander au sous-agent, en le nommant, une comparaison de `bruno-retailleau` et d'un second candidat publié sur **une seule** question du thème `immigration`. Vérifier dans le journal que `categoriesExplored` est identique pour les deux personnalités (ou que l'écart est justifié dans `categoriesNotExplored`), puis que `pnpm data:validate` reste conforme. Rien n'est commité ; le test reste borné à une question (FR-052).
- [X] T041 [US5] Valider le mode thématique (US5, scénario 2). Demander au sous-agent, en le nommant, une recherche `THEMATIC` limitée à **une seule** question du thème `immigration` et à 2 personnalités publiées. Vérifier que le journal et le compte rendu montrent des requêtes dans les deux sens de la polarité de la question, et que le compte rendu le dit. Vérifier aussi qu'aucune question, aucun thème ni aucune position n'est modifié (`shasum -a 256 -c "$TMPDIR/radar-008-avant.sha"`) et que `pnpm data:validate` reste conforme. Rien n'est commité. Le mode `GLOBAL_ENRICHMENT` n'est pas exercé pendant l'installation (FR-052) : il l'est par l'amorçage T048, après le livrable.

**Checkpoint**: les cinq modes de FR-047 sont couverts par le skill. Quatre sont exercés pendant l'installation (personnalité, audit, comparaison, thématique) ; l'enrichissement global l'est par T048.

---

## Phase 7: Polish & Cross-Cutting Concerns

- [X] T042 [P] Lancer `pnpm vitest run scripts/data </dev/null` (dont `validate.perf.test.ts` : budget inchangé), `pnpm lint` et `pnpm typecheck`. Corriger toute régression. Le job `data:validate` de `.github/workflows/ci.yml` reste inchangé et couvre `data/recherche/`.
- [X] T043 [P] Vérifier `pnpm data:validate --corpus data/fixtures/violations/RECH-QUOTE; echo "code $?"` : violation `RECH-QUOTE` et code 1 ([quickstart.md](./quickstart.md) §8). Contrôler qu'il existe au moins une fixture par règle `RECH-*` et une fixture `REF-EXISTS-research`.
- [X] T044 Contrôle d'intégrité final : `shasum -a 256 -c "$TMPDIR/radar-008-avant.sha" | grep -v ': OK$'` ne renvoie rien. `git diff --stat main -- src public data/corpus/candidates.yaml data/corpus/themes.yaml data/corpus/questions data/corpus/positions data/corpus/governance.yaml scripts/data/lib/schema/sources.ts scripts/data/source.ts scripts/data/publish.ts` est vide (FR-046, SC-003).
- [X] T045 Consigner en fin de ce fichier une section « Écarts constatés à l'implémentation » (pratique des specs 004 à 007) : choix faits par rapport aux contrats (fixture de signalement, `researchDir` d'un corpus direct, avertissements n° 6 avant amorçage) et limitations rencontrées.
- [X] T046 Préparer la PR de **code** (R12). Elle contient les règles, schémas, chargeur, tests et fixtures, `data/recherche/README.md` et les fichiers vides, `data/README.md`, `.claude/agents/french-political-source-researcher.md`, `.claude/skills/french-political-source-research/SKILL.md` et `specs/008-recherche-sources-politiques/`. Les preuves et sources réelles des tests (T029, T038, T040, T041) restent hors commit. Rebaser sur `origin/main`, commiter, pousser, ouvrir la PR et la lier avec les outils `ccd_pr`. La description de la PR indique la fonctionnalité (`specs/008-recherche-sources-politiques`) et coche la conformité aux principes I à VII de la constitution (« Flux de travail et portes de qualité »), avec une ligne de justification par principe. Si adrien le demande, les données du test et de l'amorçage partent dans une PR de données distincte.
- [X] T047 Rédiger le livrable final (FR-053, [quickstart.md](./quickstart.md) §9, section 20 de `demande.md`). Il couvre l'architecture, les fichiers créés, modifiés et supprimés, le nom, la description et le modèle du sous-agent, le nom et la fonction du skill, le lancement manuel du sous-agent et la sélection manuelle du skill, et les validations effectuées avec leurs résultats (T026 à T030, T038, T040 à T044). Il couvre aussi les limitations : invocation explicite garantie seulement par la description du sous-agent (R1), transcriptions automatiques, réseaux sociaux sous authentification, paywalls, absence de cache en CI. Il se termine par un exemple concret de demande. L'installation n'est pas déclarée terminée avant T027 à T030.

---

## Phase 8: Après l'installation — amorçage du registre (US3, données)

**Purpose**: remplir le registre avec les 18 candidats publiés une fois l'installation livrée. C'est une tâche de données, hors de la PR de code, lancée seulement avec l'accord d'adrien (FR-052, R12).

- [ ] T048 [US3] Amorcer le registre avec les 18 candidats publiés, sans recherche web, en partant des données déjà présentes. Pour chaque candidat de `data/corpus/candidates.yaml`, ajouter à `data/recherche/personnalites.yaml` le même `id`, le nom, le parti et l'historique (`history`) converti (`declared` → `DECLARED`, `withdrawn` → `WITHDRAWN`, mêmes dates). Chaque statut est appuyé par une preuve `CANDIDACY` dans `data/recherche/preuves/<id>.yaml`, construite sur la source existante `statusSource`. La citation de déclaration est prise mot pour mot dans le texte en cache (`VERIFIED_QUOTE`), sinon la preuve est `PARAPHRASE`. Ouvrir un journal `GLOBAL_ENRICHMENT` limité à cette conversion (aucune recherche web, aucune autre personnalité), avec son compte rendu. Objectif : `pnpm data:validate` à 0 violation et aucun avertissement `RECH-STATUS` n° 6. Ces données forment une PR de **données** distincte de la PR de code (R12) ; ne pas commiter sans l'accord d'adrien. À lancer seulement après le livrable final (T047) et l'accord explicite d'adrien, pour que l'installation ne comporte aucun enrichissement (FR-052). Fusionner l'entrée `bruno-retailleau` du test T029 si elle existe.

**Checkpoint**: registre amorcé, `pnpm data:validate` sans avertissement `RECH-STATUS` n° 6, PR de données prête à relire.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)** : aucune dépendance. T003 doit être fait avant T022 et T025.
- **Foundational (Phase 2)** : dépend de la phase 1 et bloque toutes les user stories.
- **US1 + US2 (Phase 3)** : dépend de la phase 2. Côté règles, T014 à T018 ; côté skill, T021 → T022 → T023 → T024, puis T025 et T026 ; validation T027 à T030 à la fin.
- **US3 (Phase 4)** : règle (T031 à T033) dès la fin de la phase 2.
- **US4 (Phase 5)** : règle (T035 à T037) dès la fin de la phase 2. L'audit T038 dépend de T029 (sous-agent installé, preuves présentes).
- **US5 (Phase 6)** : dépend de la phase 3 (skill et sous-agent).
- **Polish (Phase 7)** : après les phases voulues ; T046 et T047 en dernier.
- **Après l'installation (Phase 8)** : T048 après T047, avec l'accord d'adrien, en PR de données.

### User Story Dependencies

- **US1 et US2** : interdépendantes (le sous-agent précharge le skill), d'où une seule phase.
- **US3** : règle indépendante. L'amorçage (T048, phase 8) réutilise l'entrée créée par le test US1.
- **US4** : règle indépendante. L'audit suppose le sous-agent d'US1.
- **US5** : aucune règle ; suppose le skill et le sous-agent d'US1 et US2.

### Within Each User Story

- Règle et test dans le même fichier de tâche, fixture de violation, puis enregistrement dans `index.ts` (un seul fichier, donc tâches séquentielles).
- `SKILL.md` : quatre tâches successives sur le même fichier.
- Chaque nouvelle règle doit laisser la fixture minimale (T009) conforme.

### Parallel Opportunities

- Phase 2 : T004 et T006 en parallèle ; puis T011 et T012 en parallèle une fois T008 fait (T009 et T010 également, sur des fichiers distincts).
- Phase 3 : T014, T015, T016 et T017 en parallèle ; T019 et T020 en parallèle entre eux et avec la rédaction du skill (T021 à T024).
- Phases 4 et 5 : les règles `RECH-STATUS` (T031, T032) et `RECH-SIGNAL` (T035, T036) peuvent s'écrire en parallèle de la phase 3 dès la fin de la phase 2, seul l'enregistrement dans `index.ts` étant séquentiel.
- Phase 6 : T040 et T041 sont deux missions distinctes, à lancer l'une après l'autre (même corpus de preuves).
- Phase 7 : T042 et T043 en parallèle.

---

## Parallel Example: User Story 1

```bash
# Trois règles et leurs fixtures, sur des fichiers distincts :
Task: "Créer scripts/data/lib/rules/RECH-EVIDENCE.ts et RECH-EVIDENCE.test.ts"
Task: "Créer scripts/data/lib/rules/RECH-QUOTE.ts et RECH-QUOTE.test.ts"
Task: "Créer scripts/data/lib/rules/RECH-JOURNAL.ts et RECH-JOURNAL.test.ts"
Task: "Créer les fixtures data/fixtures/violations/RECH-{EVIDENCE,EVIDENCE-duplicate,QUOTE,JOURNAL,JOURNAL-notfound}/"

# En même temps, documentation et rédaction du skill :
Task: "Créer le squelette data/recherche/ et son README"
Task: "Ajouter la section Corpus de recherche à data/README.md"
Task: "Réécrire SKILL.md : en-tête et §0 à §3"
```

---

## Implementation Strategy

### MVP First (US1 + US2)

1. Phase 1 : base verte, empreintes, demande d'origine.
2. Phase 2 : chargeur, schémas, `RECH-ID`, `RECH-REF`, `REF-EXISTS` élargi.
3. Phase 3 : règles des preuves, skill, sous-agent, test non destructif.
4. **STOP et VALIDATION** : quickstart §2 à §8. Le dispositif est utilisable.

### Incremental Delivery

1. MVP (phases 1 à 3) : recherche sur une personnalité, preuves contrôlées.
2. US3 : statuts contrôlés.
3. US4 : signalements contrôlés et audit adversarial.
4. US5 : vérification des modes larges.
5. Polish : intégrité, PR de code, livrable final.
6. Après l'installation : amorçage des 18 candidats (T048, PR de données), avec l'accord d'adrien.

### Notes

- Une règle = un fichier = un test = au moins une fixture (`validate.test.ts` déduit le code du nom du dossier, suffixe permis).
- Les missions (T029, T038, T040, T041 et l'amorçage T048) écrivent dans `data/recherche/` et, au plus, dans `data/corpus/sources/` : jamais ailleurs.
- Aucune mission ne lance d'enrichissement pendant l'installation (FR-052) ; l'amorçage T048 vient après le livrable.

---

## Écarts constatés à l'implémentation (2026-11-22)

Choix faits par rapport aux contrats et limitations rencontrées pendant `/speckit-implement`.

1. **Découverte du sous-agent** (R1 corrigée par l'expérience). Un sous-agent créé dans
   `.claude/agents/` pendant une session n'est **pas** découvert par cette session : la liste des
   agents est figée à l'ouverture (elle montrait encore l'ancien `political-source-researcher`,
   supprimé). Le skill, lui, est rechargé à chaud. Les validations T028 à T030, T038, T040 et
   T041 ont donc été menées dans des sessions Claude Code **neuves** (`claude -p`, permissions
   limitées à l'écriture de fichiers, la recherche web, `pnpm data:source`, `pnpm data:validate`,
   `git status` et `git diff`). Le sous-agent n'est apparu dans la session d'installation que
   plusieurs minutes plus tard (rechargement différé) ; les missions suivantes (relance T030,
   T038, T040, T041) l'y ont appelé directement. Pour l'usage courant : après installation ou mise
   à jour du sous-agent, ouvrir une nouvelle session si `/agents` ne le montre pas.
2. **Description du sous-agent** (T025). Le contrat initial reformulait la dernière phrase de la
   demande d'adrien ; la description reprend désormais son texte mot pour mot (« À utiliser
   lorsque l'utilisateur demande explicitement son intervention. »), suivi de la phrase
   d'invocation explicite. `contracts/subagent-and-skill.md` corrigé en conséquence.
3. **Exemple YAML du contrat** (T005). Dans `contracts/research-files.md`, les listes en ligne
   `verified`/`toVerify` contenaient « : » sans guillemets, ce que YAML lit comme un objet. Les
   textes sont désormais entre guillemets, et le skill (§14) en fait une règle d'écriture.
4. **`researchDir` d'un corpus direct** (T006). Pour `--corpus <dossier de corpus>` (sans
   `corpus/` imbriqué), `researchDir` reste `data/recherche` du dépôt, comme le prévoit T006 ;
   pour un dossier de fixture, `<fixture>/recherche`.
5. **Fixtures de violation**. Chaque fixture `RECH-*` est une copie complète de la fixture
   minimale (`corpus/`, `cache/`, `published/`, `recherche/`) avec une seule faute. Quelques
   fautes entraînent une seconde violation qui en découle (par exemple `RECH-ID` : la preuve
   renommée en doublon laisse un renvoi `RECH-REF` vers l'ancien identifiant).
   `RECH-STATUS` ajoute un signalement `CANDIDATE_STATUS` pour isoler le contrôle n° 3 ;
   `RECH-SIGNAL` transforme le signalement de la fixture en `QUOTE_DISCREPANCY` pour que la
   preuve contraire ne soit couverte par aucun `POSITION_REVIEW`.
6. **Interprétations des contrôles**.
   - `RECH-EVIDENCE` n° 11 : la date de publication comparée est celle de la preuve
     (`publishedAt`) ou, à défaut, celle de la source du registre.
   - `RECH-EVIDENCE` n° 12 : une simple revérification (`verifiedAt`) doit aussi être historisée
     (`field: verifiedAt`) ; le skill le prescrit.
   - `RECH-EVIDENCE` n° 16 : une corroboration est « récente » si **sa source** a été publiée
     moins de 12 mois avant `verifiedAt` (la date de vérification d'une corroboration ne dit rien
     de l'actualité du propos).
   - `RECH-QUOTE` n° 3 : comme `FR-017`, l'avertissement `CACHE-MISSING` n'est émis par la règle
     que si le cache existe mais ne contient pas le texte ; sans cache (CI), l'avertissement global
     de chargement suffit.
   - `RECH-ID` n° 4 et `RECH-EVIDENCE` n° 9 comparent les noms sans accents, casse ni espaces
     superflues.
   - `RECH-REF` contrôle aussi `personality` des signalements et `duplicatesAvoided[].evidence`.
   - `RECH-SIGNAL` n° 2 refuse aussi un signalement `open` portant une résolution.
7. **Petites ouvertures de code existant** : `loadList`, `readYaml` et `pushIssues` de
   `scripts/data/lib/corpus.ts` et `words` de `scripts/data/lib/text.ts` sont désormais exportés
   (réutilisés par le chargeur et `RECH-EVIDENCE` n° 15) ; aucun comportement modifié.
8. **Avertissements attendus** : jusqu'à l'amorçage du registre (T048), `pnpm data:validate`
   émet 18 avertissements `RECH-STATUS` n° 6 (un par candidat publié absent du registre), moins
   ceux des personnalités enregistrées par les tests de mission.
9. **Preuve sur une question sans position** (constaté par la mission T029). `POSITION_REVIEW`
   et `QUOTE_DISCREPANCY` exigent une position existante (`RECH-REF` n° 8). Une preuve
   pertinente sur une question où le candidat n'a **aucune** position enregistrée n'a donc pas
   de type de signalement : le sous-agent l'a portée, à juste titre, dans la rubrique 13 de son
   compte rendu (`immigration-regroupement-familial-ressources`, `immigration-ame-soins-urgents`).
   Piste pour une spec ultérieure : un type `POSITION_GAP` (ou `position` facultative pour
   `POSITION_REVIEW`). Rien n'est changé ici, conformément au contrat.
10. **Coût des missions de validation**. Aucune API payante : les missions tournent sur
    l'abonnement Claude Code. À titre indicatif, la mission T029 (9 preuves, 17 recherches et
    lectures web, environ 16 minutes) a été estimée par le CLI à 7,3 $ d'équivalent API.
