# `data/recherche/` : corpus de preuves (spec 008)

Preuves recueillies sur les positions et les statuts de candidature des personnalités politiques
françaises liées à la présidentielle 2027. Ce dossier n'est **jamais publié** (`data:publish` et le
site ne le lisent pas) et n'entre dans **aucun score**. La collecte des preuves et l'évaluation des
candidats restent deux opérations distinctes : une preuve qui pourrait changer une position donne
lieu à un signalement, jamais à une modification.

## Arborescence

```text
data/recherche/
├── personnalites.yaml               # personnalités suivies et historique daté des statuts de candidature
├── preuves/<personnalite-id>.yaml   # preuves d'une personnalité (citations, paraphrases, actes)
├── journaux/<journal-id>.yaml       # journal d'une mission : requêtes, sources consultées, lacunes
├── journaux/<journal-id>.md         # compte rendu de la mission, 13 rubriques obligatoires
└── signalements.yaml                # demandes de revue humaine
```

`journal-id` : `YYYY-MM-DD-<slug>` (date de début de mission). L'identifiant d'une personnalité
reprend celui de `data/corpus/candidates.yaml` quand elle y figure ; sinon `prenom-nom`.

## Règles d'écriture

- Chaque fichier garde son en-tête de commentaire.
- Ajout **en fin de liste**. Un élément existant n'est modifié que pour ajouter une corroboration,
  ajouter une entrée d'historique avec la correction correspondante, mettre à jour
  `verifiedAt`/`updatedAt` (avec une entrée d'historique datée), ou ajouter un statut en fin
  d'historique.
- **Aucune suppression** : une preuve reconnue fausse est requalifiée, avec une entrée d'historique.
- Les sources vivent dans le registre commun `data/corpus/sources/` (`pnpm data:source fetch`) ;
  `unregisteredSource` est réservé aux sources inaccessibles (paywall, authentification, page retirée).
- Les signalements restent `open` tant qu'un humain ne les a pas traités.

## Outils

- Méthodologie complète : skill [`french-political-source-research`](../../.claude/skills/french-political-source-research/SKILL.md),
  préchargé par le sous-agent [`french-political-source-researcher`](../../.claude/agents/french-political-source-researcher.md)
  (Sonnet, exécution) et par [`french-political-research-orchestrator`](../../.claude/agents/french-political-research-orchestrator.md)
  (Opus, missions larges : plan, délégation, contrôle, synthèse).
- Format des fichiers et exemples : [`contracts/research-files.md`](../../specs/008-recherche-sources-politiques/contracts/research-files.md).
- Champs et listes fermées : [`data-model.md`](../../specs/008-recherche-sources-politiques/data-model.md).
- Contrôle : `pnpm data:validate` (règles `RECH-ID`, `RECH-REF`, `RECH-STATUS`, `RECH-EVIDENCE`,
  `RECH-QUOTE`, `RECH-JOURNAL`, `RECH-SIGNAL` ; détail dans
  [`contracts/validation-rules.md`](../../specs/008-recherche-sources-politiques/contracts/validation-rules.md)).
