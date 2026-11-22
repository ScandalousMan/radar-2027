# Quickstart : valider le dispositif de recherche (008)

**Spec** : [spec.md](./spec.md) · **Contrats** : [contracts/](./contracts/)

Guide de validation de bout en bout, à dérouler après `/speckit-implement`. Il couvre FR-051 à
FR-053 et SC-001 à SC-010. Toutes les commandes partent de la racine du dépôt.

## Prérequis

- Branche `008-recherche-sources-politiques`, dépendances installées (`pnpm install`).
- Cache des sources local présent (`.cache/sources/`) pour le contrôle des citations.
- Session Claude Code ouverte dans le dépôt (desktop ou CLI).

## 1. Empreintes de référence (SC-003)

Avant le test non destructif :

```bash
find data/corpus/candidates.yaml data/corpus/themes.yaml data/corpus/governance.yaml data/corpus/questions data/corpus/positions -type f -print0 | sort -z | xargs -0 shasum -a 256 > "$TMPDIR/radar-008-avant.sha"
```

## 2. Composants au niveau du projet (FR-001, FR-004, FR-006, SC-007, SC-010)

```bash
ls .claude/agents/ .claude/skills/french-political-source-research/
```

Attendu : `.claude/agents/` ne contient que `french-political-source-researcher.md` (plus
`political-source-researcher.md`) ; le skill contient `SKILL.md`.

```bash
ls ~/.claude/agents/ ~/.claude/skills/ 2>/dev/null | grep -i political
```

Attendu : aucune sortie (rien dans la configuration globale).

En-têtes : comparer à [contracts/subagent-and-skill.md](./contracts/subagent-and-skill.md) —
`name`, `model: opus`, `skills: [french-political-source-research]`, pas de `tools` ; skill sans
`disable-model-invocation`.

```bash
sed -n '1,/^---$/{p}' .claude/agents/french-political-source-researcher.md | head -20
```

## 3. Découverte (FR-051, SC-001, SC-002)

1. Dans la session : `/agents` (ou demander « Quels sous-agents peux-tu utiliser ? ») →
   `french-political-source-researcher` apparaît, seul agent de recherche politique.
2. `/skills` → `french-political-source-research` apparaît ; `/french-political-source-research`
   le charge dans une session ordinaire (US2) ; y chercher la règle « vote de groupe » →
   `PARLIAMENTARY_GROUP_POSITION` / `PERSONAL_ACTION`, interdiction d'en déduire l'argumentaire.
3. Si un composant n'apparaît pas : `/reload-skills`, puis redémarrage de la session.

## 4. Lancement explicite et préchargement (US1 scénario 1, FR-051)

Demande en langage naturel :

> Utilise le sous-agent french-political-source-researcher pour rechercher les positions de
> Bruno Retailleau sur l'immigration. Test d'installation : limite-toi à ce thème, pas
> d'enrichissement global, pas de commit.

Attendu : l'intervention est attribuée au sous-agent nommé ; sa première action cite la
méthodologie du skill (mode `PERSONALITY`, ouverture du journal) sans avoir eu à invoquer le
skill. Contre-épreuve (US1 scénario 4) : une demande ordinaire (« corrige une faute dans le
README ») n'appelle pas le sous-agent.

## 5. Test non destructif (FR-052, US1)

Périmètre : `bruno-retailleau` × `immigration` (R13). À la fin du test :

```bash
git status --short
```

Attendu : seuls `data/recherche/**` et, éventuellement, `data/corpus/sources/bruno-retailleau.yaml`
sont modifiés ou ajoutés.

```bash
shasum -a 256 -c "$TMPDIR/radar-008-avant.sha" | grep -v ': OK$'
```

Attendu : aucune sortie (questions, thèmes, positions, candidats, gouvernance identiques octet
pour octet — SC-003).

## 6. Contenu des preuves (SC-004, SC-005, SC-008)

```bash
pnpm data:validate
```

Attendu : `Corpus conforme : 0 violation.` ; aucun avertissement `RECH-*` autre que
`CACHE-MISSING` éventuel et, tant que le registre n'est pas amorcé (T048), un avertissement
`RECH-STATUS` n° 6 par candidat publié absent de `data/recherche/personnalites.yaml`
(« candidat publié absent du registre de recherche »). Ces avertissements sont attendus et ne
bloquent pas la CI ; ils disparaissent une fois les 18 candidats enregistrés.

Contrôles de lecture sur `data/recherche/preuves/bruno-retailleau.yaml` :

- chaque preuve : URL directe (via `source` ou `unregisteredSource`), `verifiedAt`,
  `attribution`, `quoteStatus`, `sourceQuality` (SC-004 — garanti par le schéma) ;
- chaque `VERIFIED_QUOTE` : `locator` précis et citation retrouvée dans le cache (SC-005 —
  garanti par `RECH-QUOTE` avec cache) ; en ouvrir deux à la main dans la source pour
  confirmer.

Idempotence (SC-008) : relancer la même demande ; `git diff --stat data/recherche/preuves/`
ne montre aucune nouvelle preuve de même source et même citation (au plus des corroborations
et des `verifiedAt` mis à jour), et `pnpm data:validate` reste conforme (`RECH-EVIDENCE` n° 14).

## 7. Compte rendu (FR-048, SC-006)

`data/recherche/journaux/<journal-id>.md` existe, contient les rubriques `## 1.` à `## 13.`
(vérifié par `RECH-JOURNAL`), et la réponse du sous-agent en reprend le texte. Vérifier à la
lecture que chaque constat important porte un passage exact et une URL, et l'étiquetage
faits / citations / paraphrases / interprétations / hypothèses.

## 8. Règles de validation (FR-045, SC-009)

```bash
pnpm vitest run scripts/data </dev/null
```

Attendu : tous les tests passent, dont une fixture `data/fixtures/violations/RECH-*` refusée
par règle et la fixture minimale (avec `recherche/`) conforme.

```bash
pnpm data:validate --corpus data/fixtures/violations/RECH-QUOTE; echo "code $?"
```

Attendu : violation `RECH-QUOTE`, code de sortie 1.

CI : `pnpm lint && pnpm typecheck` verts ; le job `data:validate` de `.github/workflows/ci.yml`
reste inchangé et couvre `data/recherche/`.

## 9. Livrable final (FR-053)

Le compte rendu d'installation remis à adrien contient : architecture mise en place, fichiers
créés et modifiés, nom / description / modèle du sous-agent, nom et fonction du skill,
lancement manuel du sous-agent, sélection manuelle du skill, validations effectuées (sections
2 à 8 ci-dessus, avec leurs résultats), limitations (transcriptions automatiques non
vérifiables, réseaux sociaux sous authentification, paywalls, absence de cache en CI), exemple
concret de demande. L'installation n'est pas déclarée terminée avant les sections 3, 4 et 5.

Les preuves du test ne sont ni commitées ni poussées sans demande ; si adrien les veut dans le
dépôt, elles partent dans une pull request de données distincte (R12).
