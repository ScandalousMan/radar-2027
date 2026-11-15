# Contrat : journal de campagne et dossier de rédaction

Deux fichiers Markdown versionnés, relus dans la PR de données. Ils ne sont lus par aucun
script : leur forme est fixée pour la relecture et pour vérifier SC-002 et SC-003 à la main.
Aucune donnée personnelle hors des candidats ; les contributeurs sont désignés par leur
identifiant court (`claude`, `adrien`).

## `data/campagnes/education/sources.md`

```markdown
# Campagne de sources Éducation (006)

Entrées : réponse ChatGPT du 2026-11-15 (`.cache/education/reponse-chatgpt-2026-11-15.md`,
hors git), recherche de l'agent, sources du corpus v1.

## Bruno Retailleau

| Origine | URL | Décision | Source / motif |
|---|---|---|---|
| ChatGPT | https://www.youtube.com/watch?v=lxUYRSdmSQw&t=15355s | retenue | `bruno-retailleau-franceinfo-services-publics-education` (transcription automatique, à confirmer à l'écoute) |
| agent | https://… | écartée | non attribuable (FR-013a) : article de presse sans citation directe |
| corpus | `bruno-retailleau-…` | relue | 1 passage éducation → inventaire M12 |

Conclusion : 1 source retenue.

## Juan Branco

| Origine | URL | Décision | Source / motif |
|---|---|---|---|
| corpus | `juan-branco-projet` | relue | aucun passage éducation précis |
| agent | https://… | écartée | agrégateur |

Conclusion : cherché sans résultat. Sources consultées : … (liste).
```

Règles :

- une section par candidat déclaré, dans l'ordre de `candidates.yaml` ; les 18 présentes ;
- motifs d'écart : `inaccessible`, `non attribuable (FR-013a)`, `doublon d'URL`, `doublon de
  contenu`, `citation introuvable`, `hors sujet`, `sans mesure` ;
- une correction apportée à une proposition de ChatGPT (citation, titre, date, attribution) est
  écrite dans la colonne « Source / motif ».

## `data/campagnes/education/enonces.md`

```markdown
# Dossier de rédaction des énoncés Éducation (006)

## Inventaire des mesures

| # | Candidat | Source | Citation (courte) | Dimension | Sens | Sous-thème |
|---|---|---|---|---|---|---|
| M01 | David Lisnard | `david-lisnard-programme-education` | « … » | choix | − | privé et choix |

## Énoncés

### education-financement-suit-choix-familles

- Texte : « … » (n caractères)
- Dimension : choix · Polarité : − · Sous-thème : privé et choix
- Motivé par : M01, M07
- Accord attendu : David Lisnard (M01) · Désaccord attendu : Fabien Roussel (M07)
- Revue adverse : … · Relecture adrien : …

## Bilan

| Dimension | Actifs | + | − |
|---|---|---|---|
| choix | | | |
| moyens | | | |
| pedagogie | | | |
| **Total** | 13–17 | 40–60 % | 40–60 % |

Sous-thèmes (aucun > 25 %) : …

Énoncés écartés : … (motif).

Énoncés non discriminants après relecture des positions : … (décision d'adrien).
```

Règles :

- chaque énoncé actif a une fiche avec au moins une mesure de chaque côté (FR-008) ;
- les identifiants `M..` de l'inventaire renvoient à une source enregistrée au corpus ;
- le bilan est mis à jour à chaque changement de statut d'un énoncé.
