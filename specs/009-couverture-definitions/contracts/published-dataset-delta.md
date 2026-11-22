# Contrat : jeux publiés (delta 009)

**Base** : contrat 002 `published-dataset.md`, delta 007 `published-dataset-delta.md`. **Modèle** : [../data-model.md](../data-model.md) § 2, 8.

## `public/data/versions/<n>/main.json`, règles 3 (n ≥ 5)

Champs ajoutés ou modifiés :

```jsonc
{
  "version": 5,
  "selectionRules": 3,              // nouveau littéral admis (absent | 2 | 3)
  "minQuestionCoverage": 7,         // présent ⇔ selectionRules = 3
  "questions": [
    { "id": "…", "text": "…", "themes": ["securite"], "polarity": "+",
      "discriminant": 0.8123, "subject": "…",
      "coverage": 9 }               // présent ⇔ selectionRules = 3 ; = cases non nulles de la colonne
  ],
  "candidates": [ { "id": "…", "coverage": 0.71 } ]   // calculée sur la banque active (inchangé dans la forme)
  // themes, withdrawn, positions, governance : inchangés dans la forme
}
```

Le schéma `MainDatasetSchema` refuse :

- `selectionRules: 3` sans `minQuestionCoverage`, ou avec une question sans `coverage` ou sans `subject` ;
- `minQuestionCoverage` ou `coverage` présents hors règles 3 ;
- `coverage` différente du nombre de cases non nulles de la colonne ;
- en règles 3, plus de 120 questions.

Les versions 1 à 4 sont inchangées, octet pour octet (PUB-IMMUTABLE), et toujours acceptées par le schéma.

## `public/data/versions/<n>/candidates/<id>.json`

Forme inchangée. Ne contient que les positions des questions de la banque active de la version.

## `public/data/versions.json`

Forme inchangée (`questionCount` = taille de la banque active).

## `public/data/glossary.json` (nouveau, hors versions)

```jsonc
{
  "updatedAt": "2026-11-23",
  "terms": [
    {
      "id": "aide-medicale-etat",
      "label": "aide médicale de l'État",
      "forms": ["aide médicale de l'État", "AME"],
      "definition": "…",                     // ≤ 280 caractères
      "sources": [ { "url": "https://…", "title": "…", "publisher": "…" } ]
    }
  ]
}
```

- Seuls les termes `reviewed`, triés par `label` (`localeCompare` fr, base).
- JSON compact avec fin de ligne finale, comme les autres fichiers publiés ; ≤ 30 Kio.
- Mutable : le corriger n'impose pas de nouvelle version. Il est lu au build par `/glossaire` et récupéré par le client au questionnaire et aux résultats.
- Absent ou invalide : le site s'affiche sans repère de terme, et `/glossaire` affiche « aucun terme publié ».
