# Livrable — 008 Dispositif de recherche de sources politiques

**Date** : 2026-11-22 · **Spec** : [spec.md](./spec.md) · **Tâches** : [tasks.md](./tasks.md)
(écarts en fin de fichier) · **Demande d'origine** : [demande.md](./demande.md), section 20.

## 1. Architecture mise en place

Trois volets, tous au niveau du projet (rien dans `~/.claude/`) :

1. **Outillage Claude Code** : un sous-agent `french-political-source-researcher` (Opus, tous les
   outils de la session hérités) qui précharge le skill `french-political-source-research` ; le
   skill porte à lui seul toute la méthodologie (19 sections) et peut être sélectionné seul.
2. **Corpus de preuves** `data/recherche/`, jamais publié ni scoré : registre des personnalités
   avec l'historique daté de leurs huit statuts de candidature, preuves qualifiées par
   personnalité, journaux de mission et comptes rendus en 13 rubriques, signalements pour revue
   humaine. Les sources restent dans le registre commun `data/corpus/sources/`
   (`pnpm data:source fetch`).
3. **Validation** : sept règles `RECH-*` dans `pnpm data:validate` (déjà en CI), plus
   l'élargissement de `REF-EXISTS` (une source peut viser une personnalité du registre de
   recherche absente de `candidates.yaml`). C'est la seule modification de code.

La collecte des preuves et l'évaluation des candidats restent séparées : une preuve qui pourrait
changer une position produit un signalement, jamais une modification.

## 2. Fichiers

**Créés**

- `.claude/agents/french-political-source-researcher.md`
- `scripts/data/lib/schema/research.ts`, `scripts/data/lib/research.ts` (+ `research.test.ts`)
- `scripts/data/lib/rules/RECH-{ID,REF,STATUS,EVIDENCE,QUOTE,JOURNAL,SIGNAL}.ts` (+ tests)
- `data/recherche/` : `README.md`, `personnalites.yaml`, `signalements.yaml` (vides),
  `preuves/.gitkeep`, `journaux/.gitkeep`
- `data/fixtures/minimal/recherche/` (fixture conforme) ; 12 fixtures de violation
  `data/fixtures/violations/RECH-*` et `REF-EXISTS-research`
- `specs/008-recherche-sources-politiques/demande.md`, `livrable.md`

**Modifiés**

- `.claude/skills/french-political-source-research/SKILL.md` (réécrit en français)
- `scripts/data/lib/{cli,context,corpus,text}.ts`, `rules/{types,index,testing,REF-EXISTS}.ts`,
  `schema/index.ts` et leurs tests
- `data/README.md` (section « Corpus de recherche (spec 008) »)
- `specs/008-recherche-sources-politiques/` : `tasks.md`, `quickstart.md`,
  `contracts/research-files.md`, `contracts/subagent-and-skill.md`

**Supprimé** : `.claude/agents/political-source-researcher.md` (jamais suivi par git).

**Inchangés** (vérifié par empreintes et `git diff`) : `candidates.yaml`, thèmes, questions,
positions, gouvernance, `src/`, `public/data/`, `data:publish`, `data:source`, schéma des sources.

## 3. Sous-agent

- **Nom** : `french-political-source-researcher` (affiché « French Political Source Researcher »)
- **Modèle** : `opus` (constaté à l'exécution : Opus pour le sous-agent, alors que la session
  appelante tournait sur Sonnet)
- **Description** : « French Political Source Researcher. Agent spécialisé dans la recherche
  approfondie, la vérification et la documentation des citations et positions politiques de
  personnalités françaises liées à l'élection présidentielle de 2027. Recherche les sources
  primaires, vérifie les citations, distingue les positions individuelles des positions
  collectives et enrichit le corpus du projet. Utilise systématiquement le skill
  french-political-source-research. À utiliser lorsque l'utilisateur demande explicitement son
  intervention. Ne l'employer que lorsque la demande le nomme, jamais pour les tâches ordinaires
  du projet. »
- **Outils** : tous ceux de la session (aucun champ `tools`) ; écrit seulement `data/recherche/**`
  et, via `pnpm data:source fetch`, `data/corpus/sources/` ; ni commit, ni push, ni PR.

## 4. Skill

- **Nom** : `french-political-source-research`
- **Fonction** : méthodologie complète de recherche, de vérification, de qualification et
  d'enregistrement des preuves : cinq modes, huit statuts de candidature, hiérarchie des sources
  A/B/C, passes de recherche A à H sur 21 catégories, quatre statuts de citation, neuf
  attributions, huit qualifications relatives à l'énoncé, appréciations séparées, dates et
  actualité, doublons et corroborations, dix lacunes, enregistrement YAML pas à pas,
  signalements, contrôle final, gabarit du compte rendu en 13 rubriques, interdits.

## 5. Utilisation

**Lancer le sous-agent** (dans une session ouverte dans le dépôt) : le nommer dans la demande,
par exemple « Utilise le sous-agent french-political-source-researcher pour… », ou le mentionner
avec `@agent-french-political-source-researcher`. S'il n'apparaît pas dans `/agents` juste après
une installation ou une mise à jour, ouvrir une nouvelle session.

**Sélectionner le skill seul** : `/french-political-source-research` dans une session ordinaire,
ou le choisir dans la liste des skills.

## 6. Validations effectuées

| Validation | Résultat |
|---|---|
| Composants au niveau du projet (quickstart §2) | `.claude/agents/` ne contient que le nouveau sous-agent ; rien dans `~/.claude/agents` ni `~/.claude/skills` (SC-007, SC-010) |
| En-têtes | conformes au contrat : `model: opus`, `skills: [french-political-source-research]`, sans `tools` ; skill sans `disable-model-invocation` ; description du skill 444 caractères |
| Découverte du skill, sélection manuelle (T027) | skill listé et chargé par `/french-political-source-research` ; règle du vote de groupe présente (§8) |
| Découverte du sous-agent (T028) | dans une session neuve : seul agent de recherche politique, tous outils ; dans la session d'installation : apparu après un délai (voir limitations) |
| Contre-épreuve (US1 scénario 4) | demande ordinaire dans une session neuve : aucun appel au sous-agent |
| Lancement explicite en langage naturel (T029) | délégation au sous-agent nommé ; skill présent dès le démarrage sans invocation ; mission menée par Opus |
| Test non destructif `bruno-retailleau` × `immigration` (T029) | 9 preuves, entrée `DECLARED` au registre, 1 source enregistrée ; seuls `data/recherche/**` et `sources/bruno-retailleau.yaml` modifiés ; empreintes SC-003 identiques |
| Contenu des preuves (T030, SC-004, SC-005) | `pnpm data:validate` à 0 violation ; deux citations `VERIFIED_QUOTE` rouvertes en ligne et retrouvées mot pour mot (à l'apostrophe typographique près, normalisée) |
| Compte rendu (SC-006) | 13 rubriques étiquetées, passages et URL, écrit dans `journaux/` et restitué |
| Idempotence (SC-008) | relance à l'identique : 0 doublon, 4 doublons évités, 1 preuve réellement nouvelle |
| Audit adversarial (T038) | 3 positions auditées, citations exactes, 2 signalements `POSITION_REVIEW` ouverts, aucune position modifiée |
| Comparaison (T040) | Retailleau / Tondelier sur une question : `categoriesExplored` identique, tableau des lacunes par personnalité, 0 violation |
| Recherche thématique (T041) | Philippe / Attal sur `immigration-supprimer-droit-du-sol` : requêtes des deux sens consignées pour chaque personnalité et annoncées en rubrique 1 ; 6 preuves ; 1 signalement `POSITION_REVIEW` (vote personnel d'Attal pour la restriction à Mayotte, face à une position −2 fondée sur un document du parti) ; questions, thèmes et positions inchangés |
| Tests (T042) | `pnpm vitest run scripts/data` vert (dont budget de performance), `pnpm lint` et `pnpm typecheck` verts |
| Fixture de violation (T043) | `pnpm data:validate --corpus data/fixtures/violations/RECH-QUOTE` : violation `RECH-QUOTE`, code 1 ; une fixture au moins par règle |
| Intégrité finale (T044) | empreintes identiques ; `git diff origin/main` vide sur les fichiers interdits |

## 7. Limitations

- **Invocation explicite** : aucun réglage de Claude Code ne réserve un sous-agent aux demandes
  qui le nomment ; seule sa description en dissuade la délégation automatique (R1). La
  contre-épreuve n'a montré aucune délégation indue.
- **Découverte différée** : un sous-agent créé pendant une session n'y apparaît qu'après un délai
  (ou dans une nouvelle session) ; le skill, lui, est rechargé à chaud.
- **Transcriptions automatiques** : l'agent n'écoute pas l'audio ; une citation issue de
  sous-titres générés reste `UNVERIFIED_QUOTE`.
- **Réseaux sociaux sous authentification, paywalls, pages anti-robot** (Légifrance pendant les
  tests) : jamais contournés ; preuve `SOURCE_INACCESSIBLE` ou source secondaire qualifiée.
- **Absence de cache en CI** : sans `.cache/sources/`, la validation n'y vérifie pas les
  citations (`CACHE-MISSING`) ; le contrôle mot pour mot se fait en local.
- **Question sans position** : une preuve sur une question où le candidat n'a aucune position n'a
  pas de type de signalement (`POSITION_REVIEW` exige une position existante) ; elle est portée
  dans la rubrique 13 du compte rendu.
- **Registre non amorcé** : jusqu'à l'amorçage (T048, sur accord d'adrien), `pnpm data:validate`
  émet un avertissement `RECH-STATUS` n° 6 par candidat publié absent du registre.
- Les preuves produites par les tests ne sont ni commitées ni poussées (R12) : elles restent en
  local (5 journaux, 22 preuves, 4 personnalités, 3 signalements `open`, sources ajoutées à
  `sources/{bruno-retailleau,edouard-philippe,gabriel-attal}.yaml`). La mission T041 a laissé une
  source inutilisée (`gabriel-attal-scrutin-public-n-738-sur-l-ensemble-de-la-proposition-de-loi`,
  premier essai tronqué) à écarter si ces données partent en PR.

## 8. Exemple de demande

> Utilise le sous-agent french-political-source-researcher pour rechercher les positions de
> Marine Le Pen sur l'énergie : limite-toi aux questions du thème `energie`, cherche dans les deux
> sens de chaque énoncé, enregistre les preuves vérifiées et signale toute preuve qui
> contredirait une position publiée. Pas de commit.
