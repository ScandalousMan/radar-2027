# Contrat : commandes et règles de données (delta 009)

**Recherche** : [../research.md](../research.md) R4 à R8, R11, R12. **Modèle** : [../data-model.md](../data-model.md).

## `pnpm data:publish` (étendu)

```text
pnpm data:publish [--next] [--dry-run] [--date <YYYY-MM-DD>] [--corpus <dossier>] [--min-coverage <k>]
```

- Calcule la banque active (R4) et émet `selectionRules: 3`, `minQuestionCoverage` et `coverage`.
- `--min-coverage <k>` : refus (code 1) si `k` est plus petit que le minimum calculé, ou si le total dépasse 120.
- Écrit `data/reports/couverture-v<n>.{md,json}`, y compris en `--dry-run`.
- Sortie console : `k`, les nombres de questions actives et en réserve, un avertissement par thème complété, les classés min/médiane/max par mode, et un avertissement si SC-001 ou SC-002 n'est pas atteint (sans échec).
- Inchangé : comparaison avec la version courante, `--next` obligatoire si le contenu change, immutabilité, budgets.

## `pnpm data:gaps` (nouveau)

```text
pnpm data:gaps [--date <YYYY-MM-DD>] [--candidate <id>]… [--theme <id>]… [--limit <n>] [--corpus <dossier>]
```

- Lit le corpus (positions connues, questions `active`) et les journaux `data/recherche/journaux/*.yaml`.
- Simule la banque active de la prochaine version (R4) et calcule le gain attendu (R6).
- Écrit `data/reports/trous/<date>.json` (toutes les lignes) et `data/reports/trous/<date>.md` (missions candidat × thème, triées par gain cumulé ; `--limit` borne le nombre de lignes du `.md`).
- Résumé console : nombre de trous, nombre de trous déjà cherchés, les 10 premières missions.
- Lecture seule sur le corpus ; déterministe à corpus et date égaux.

Extrait illustratif du `.md` :

```markdown
## Mission 1 — Marine Tondelier × sécurité (gain cumulé 41,2)

| # | Question | Banque | Couv. question | Couv. candidat | Gain |
|---|---|---|---|---|---|
| 3 | securite-videoprotection-… | active | 6/18 | 59 % | 14,5 |
```

## `pnpm data:glossary` (nouveau)

```text
pnpm data:glossary [--check] [--date <YYYY-MM-DD>]
```

- Valide le glossaire (règle `GLOSS`) puis écrit `public/data/glossary.json` (termes `reviewed`).
- `--check` n'écrit rien. Code 1 si le fichier publié diffère de ce que la commande produirait, en ignorant `updatedAt`.

## Règle `SRC-AGGREGATOR`

| Cas | Résultat |
|---|---|
| Source de `data/corpus/sources/*.yaml` dont l'hôte est un domaine de `aggregatorDomains` ou un sous-domaine | **erreur**, entité `source`, message citant l'URL et le domaine |
| Preuve dont `unregisteredSource.url` est un agrégateur | **erreur**, entité `evidence` |
| `lead.url` d'une preuve, `sourcesConsulted[].url` d'un journal | non contrôlés (pistes) |
| `aggregatorDomains` absent | aucune vérification (fixtures historiques) |

Fixture `data/fixtures/violations/SRC-AGGREGATOR/` : une source `https://candidatspresidentielles2027.fr/…` référencée par une position.

## Règle `GLOSS`

Ne s'exécute que si `data/corpus/glossaire.yaml` existe.

| Cas | Résultat |
|---|---|
| Identifiant en double ; aucune forme ; forme en double après normalisation (dans un terme ou entre termes) | erreur |
| Définition vide ou > 280 caractères | erreur |
| Aucune source ; URL invalide | erreur |
| `reviewed` sans `reviewedBy`/`reviewedAt`, ou `reviewedBy = author` ; `author`/`reviewedBy` inconnu de `contributors.yaml` | erreur |
| `public/data/glossary.json` présent et désynchronisé (hors `updatedAt`) | erreur |
| Terme `reviewed` absent de tout énoncé de question `active` (repérage R10) | avertissement |
| Hôte d'une source hors `institutionalDomains` | avertissement |

Fixtures : `data/fixtures/violations/GLOSS/` (définition trop longue et conflit de forme) ; `data/fixtures/minimal/corpus/glossaire.yaml` (deux termes valides).

## Skill et sous-agent

- `french-political-source-research` gagne une section « Mission issue de `data:gaps` ». Elle dit de lire les lignes, de chercher en sources primaires, de consigner `lead` quand une piste vient d'un agrégateur, et de consigner une lacune `NOT_FOUND` ou `NO_PERSONAL_POSITION` avec `question` en cas d'absence. Elle interdit de déduire une position du parti ou d'un soutien.
- Le sous-agent n'a pas d'autres droits que ceux du contrat 008.
