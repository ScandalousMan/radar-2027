# Contrat : delta du jeu publié (`main.json`)

Ce document complète `specs/002-corpus-ontologie-pipeline/contracts/published-dataset.md`, dont toutes les règles restent valables.

## Ajouts

```jsonc
{
  "version": 3,
  "publishedAt": "2026-11-2x",
  "selectionRules": 2,              // nouveau, facultatif ; seule valeur admise : 2
  "themes": [ … ],
  "questions": [
    {
      "id": "travail-retraite-62-ans",
      "text": "…",
      "themes": ["travail"],
      "polarity": "+",
      "discriminant": 1.1277,
      "subject": "retraite-age-legal"   // nouveau ; obligatoire si selectionRules = 2, interdit sinon
    }
  ],
  …
}
```

## Compatibilité

| Version | `selectionRules` | `subject` | Règles de sélection |
|---|---|---|---|
| 1, 2 (publiées, immuables) | absent | absent | 003 FR-022 à FR-024 |
| ≥ 3 | `2` | sur chaque question | 007 FR-008 à FR-012 |

- Le lecteur (`MainDatasetSchema`) accepte les deux formes et refuse les formes mixtes.
- La projection de publication (`scripts/data/lib/publish/build.ts`) émet toujours la forme règles 2 pour une nouvelle version : `selectionRules: 2` et `subject` recopié du corpus. Elle échoue si une question active n'a pas d'enjeu (garantie par SUBJECT en amont).
- Les fichiers de détail candidat (`candidates/<id>.json`) et `versions.json` ne changent pas.
- Budget : environ +9 Kio sur `main.json` (≤ 300 Kio).
