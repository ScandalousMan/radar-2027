# Contrat : fichiers du corpus de preuves (`data/recherche/`)

**Spec** : [../spec.md](../spec.md) · **Modèle** : [../data-model.md](../data-model.md)

Champs, types et contraintes : [data-model.md](../data-model.md). Ce contrat fixe la forme des
fichiers et donne un exemple conforme de chacun. Les exemples sont **illustratifs** : URL,
dates et citations y sont fictives et ne doivent pas être recopiées dans le corpus.

## Règles d'écriture

- Chaque fichier est une **liste YAML** (sauf les journaux : un objet par fichier ; et les
  comptes rendus : Markdown).
- Un en-tête de commentaire `#` décrit le fichier ; il est conservé à chaque édition.
- Ajout en **fin de liste** ; un élément existant n'est modifié que pour : ajouter une
  corroboration, ajouter une entrée d'historique avec la correction correspondante, mettre à
  jour `verifiedAt`/`updatedAt`, ajouter un statut en fin d'historique.
- Aucune suppression d'élément (FR-043, FR-050).
- Absence de `data/recherche/` : la validation n'a rien à contrôler (fixtures existantes).

## `personnalites.yaml`

```yaml
# Personnalités suivies par la recherche (spec 008, FR-007 à FR-012). Jamais publié.
# L'identifiant reprend celui de data/corpus/candidates.yaml quand la personne y figure.

- id: bruno-retailleau
  name: Bruno Retailleau
  party: Les Républicains
  statuses:
    - status: DECLARED
      at: { date: 2026-05-12, precision: day }
      observedAt: 2026-11-22
      evidence:
        - bruno-retailleau-candidature-001
  createdAt: 2026-11-22
  updatedAt: 2026-11-22

- id: jean-exemple
  name: Jean Exemple
  party: Parti exemple
  aliases: [J. Exemple]
  statuses:
    - status: REPORTED_UNCONFIRMED
      at: { date: 2026-09, precision: month }
      observedAt: 2026-11-22
      evidence:
        - jean-exemple-candidature-001
      note: Candidature prêtée par un hebdomadaire, non confirmée par l'intéressé.
  createdAt: 2026-11-22
  updatedAt: 2026-11-22
```

## `preuves/<personnalite-id>.yaml`

```yaml
# Preuves de Bruno Retailleau (spec 008). Corpus de recherche : jamais publié, jamais scoré.

- id: bruno-retailleau-immigration-001
  personality: bruno-retailleau
  kind: POSITION
  theme: immigration
  question: immigration-exemple-question
  qualification: EXPLICIT_SUPPORT
  candidacyStatus: DECLARED
  quoteStatus: VERIFIED_QUOTE
  quote: "texte exact retrouvé mot pour mot dans la transcription officielle"
  speaker: Bruno Retailleau
  transcript: official
  context: Entretien intégral, réponse à une question sur le regroupement familial.
  source: bruno-retailleau-entretien-exemple-2026-10
  publisher: Média exemple
  locator: { kind: timestamp, value: "00:12:34" }
  sourceQuality: A_PRIMARY_VERIFIED
  attribution: PERSONAL_DIRECT
  attributionConfidence: HIGH
  temporalRelevance: CURRENT
  period: campagne présidentielle 2027
  statedAt: { date: 2026-10-05, precision: day }
  researchedAt: 2026-11-22
  verifiedAt: 2026-11-22
  journal: 2026-11-22-bruno-retailleau-immigration
  corroborations:
    - source: bruno-retailleau-depeche-exemple-2026-10
      quoteStatus: VERIFIED_QUOTE
      verifiedAt: 2026-11-22
      journal: 2026-11-22-bruno-retailleau-immigration
      note: Dépêche reprenant la même phrase ; non indépendante du média d'origine.
  createdAt: 2026-11-22
  updatedAt: 2026-11-22

- id: bruno-retailleau-immigration-002
  personality: bruno-retailleau
  kind: POSITION
  theme: immigration
  quoteStatus: SOURCE_INACCESSIBLE
  speaker: Bruno Retailleau
  context: Tribune signalée par une revue de presse ; article réservé aux abonnés.
  unregisteredSource:
    url: https://exemple.fr/tribune
    title: Tribune exemple
    publisher: Quotidien exemple
    reason: page derrière un paywall, non contournée (FR-049)
  publisher: Quotidien exemple
  sourceQuality: D_UNVERIFIED_OR_INACCESSIBLE
  attribution: UNKNOWN_ATTRIBUTION
  attributionConfidence: UNCONFIRMED
  temporalRelevance: UNDETERMINED
  statedAt: unknown
  researchedAt: 2026-11-22
  verifiedAt: 2026-11-22
  journal: 2026-11-22-bruno-retailleau-immigration
  createdAt: 2026-11-22
  updatedAt: 2026-11-22
```

Correction ultérieure (jamais silencieuse) :

```yaml
  qualification: QUALIFIED_SUPPORT
  history:
    - at: 2026-12-03
      field: qualification
      previous: EXPLICIT_SUPPORT
      reason: La suite de l'entretien (00:13:10) pose une condition omise lors de la première lecture.
      journal: 2026-12-03-audit-immigration
  updatedAt: 2026-12-03
```

## `journaux/<journal-id>.yaml`

```yaml
# Journal de mission (spec 008, FR-029). Requêtes et sources effectivement consultées.
id: 2026-11-22-bruno-retailleau-immigration
mode: PERSONALITY
author: claude
request: Rechercher les positions de Bruno Retailleau sur l'immigration (test d'installation).
startedAt: 2026-11-22
completedAt: 2026-11-22
state: completed
scope:
  personalities: [bruno-retailleau]
  themes: [immigration]
  questions: []
queries:
  - { at: 2026-11-22, query: '"Bruno Retailleau" "regroupement familial"', category: NATIONAL_MEDIA, tool: web_search }
  - { at: 2026-11-22, query: 'site:senat.fr Retailleau immigration amendement', category: SENAT, tool: web_search }
categoriesExplored: [EXISTING_CORPUS, CAMPAIGN_SITE, SENAT, FULL_INTERVIEWS, NATIONAL_MEDIA]
categoriesNotExplored:
  - { category: SOCIAL_MEDIA, reason: comptes non consultables sans authentification }
exhaustive: false
sourcesConsulted:
  - { url: https://exemple.fr/entretien, title: Entretien exemple, outcome: retained, source: bruno-retailleau-entretien-exemple-2026-10 }
  - { url: https://exemple.fr/agregateur, title: Site de citations, outcome: rejected, reason: agrégateur sans source d'origine }
evidenceAdded: [bruno-retailleau-immigration-001, bruno-retailleau-immigration-002]
verified: ["Citation 001 retrouvée dans la transcription officielle à 00:12:34."]
toVerify: ["Tribune 002 : texte original inaccessible."]
gaps:
  - kind: PRIMARY_INACCESSIBLE
    personality: bruno-retailleau
    theme: immigration
    evidence: [bruno-retailleau-immigration-002]
    note: Tribune réservée aux abonnés ; aucune reprise intégrale trouvée.
signals: []
```

## `journaux/<journal-id>.md`

Compte rendu en 13 rubriques ; gabarit dans
[subagent-and-skill.md](./subagent-and-skill.md#gabarit-du-compte-rendu). Les titres de niveau 2
`## 1.` à `## 13.` sont obligatoires (contrôlés par `RECH-JOURNAL`).

## `signalements.yaml`

```yaml
# Demandes de revue humaine (spec 008, FR-012, FR-033, FR-036, FR-044). Ne modifient rien.

- id: sig-2026-11-22-retailleau-immigration-exemple
  kind: POSITION_REVIEW
  raisedAt: 2026-11-22
  journal: 2026-11-22-bruno-retailleau-immigration
  personality: bruno-retailleau
  position: { candidate: bruno-retailleau, question: immigration-exemple-question }
  evidence: [bruno-retailleau-immigration-001]
  reason: "Position relue à -1 ; l'entretien du 2026-10-05 (00:12:34) dit « … » : soutien explicite."
  state: open
```

Résolution par un humain :

```yaml
  state: resolved
  resolution: { at: 2026-11-25, by: adrien, decision: Position corrigée par la PR de données #NN. }
```

## Sources des personnalités (registre existant)

Enregistrement inchangé :

```bash
pnpm data:source fetch <url> --candidate <personnalite-id> --kind declaration_vote --title "<titre>" --published <date>
```

Pour une vidéo, `--from-file <transcription.txt>` enregistre la transcription utilisée comme
texte de la source (R6). Pour une personnalité absente de `candidates.yaml`, l'avertissement
« candidat absent de candidates.yaml » est attendu ; la validation accepte l'identifiant s'il
figure dans `personnalites.yaml` (R4).
