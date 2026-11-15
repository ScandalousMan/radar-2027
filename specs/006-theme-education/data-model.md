# Data Model: Thème Éducation

Les entités sont celles de la 002 ([data-model.md](../002-corpus-ontologie-pipeline/data-model.md)).
Ce document ne décrit que ce que la 006 **ajoute ou précise**. Forme sur disque :
[contracts/corpus-delta.md](contracts/corpus-delta.md) et
[contracts/campagne-files.md](contracts/campagne-files.md).

## Thème (extension)

| Champ | Type | Règle |
|---|---|---|
| `dimensions` | liste facultative de `Dimension`, ≥ 2 | Identifiants uniques dans le thème. Absent pour les 17 thèmes existants. |

**Dimension** : `id` (kebab-case), `label` (≤ 60 caractères), `negative` et `positive`
(libellés des deux pôles, non vides). Les pôles d'une dimension sont une déclinaison des pôles
de l'axe du thème : le pôle négatif d'une dimension est du côté du pôle négatif de l'axe.

**Instance `education`** (FR-001 à FR-003) :

- `id: education`, `label: Éducation`, description de FR-001, `order: 17` (dernier),
  `status: active` ;
- axe et dimensions `choix`, `moyens`, `pedagogie` selon [research.md R5](research.md#r5-formulation-de-laxe-et-des-dimensions),
  à valider par adrien.

## Question (extension)

| Champ | Type | Règle |
|---|---|---|
| `dimension` | identifiant facultatif | Obligatoire si la question est active et que son thème **principal** (`themes[0]`) déclare des `dimensions` ; doit être l'une d'elles. Interdit si le thème principal n'en déclare pas. |

Une question dont Éducation est thème **secondaire** n'a pas de dimension ; sa polarité se lit
sur l'axe de son thème principal (cas limite de la spec).

**Contraintes du thème `education`** (FR-002a, FR-005, FR-007, vérifiées par `AXIS-DIM` et
`FR-012`) :

- questions actives de thème principal `education` : au moins `maxPriorityQuota` (13 avec 18
  thèmes), au plus 17 (le maximum de 17 est vérifié à la relecture, voir quickstart) ;
- au moins 3 questions actives par dimension ;
- part de chaque polarité dans [40 %, 60 %] sur le thème entier ;
- aucun sous-thème du périmètre au-delà du quart des énoncés (vérifié sur le dossier de
  rédaction, le sous-thème n'étant pas un champ).

**Cycle de vie** inchangé : `draft` (rédigée par `claude`) → `active` (relue par adrien, grille
cochée, `reviewedAt`) ; `introducedIn: 2` posé par la publication ; énoncé figé ensuite
(002 FR-011).

## Source (précision, sans champ nouveau)

- **Source écrite** : inchangée ; `kind` selon la nature (programme, livre/plateforme,
  déclaration).
- **Source vidéo** (R3) : `kind: declaration_vote` ; `url` de la vidéo **avec le paramètre de
  début du passage** (`&t=<secondes>s` pour YouTube, `?start=<secondes>` pour Dailymotion) ;
  `title` du type « Entretien franceinfo « Nos services publics », passage de Bruno Retailleau
  (04:15:55–04:23:50) » ; `publishedAt` = date de diffusion ; `candidates` = le seul candidat
  qui parle dans le passage ; texte en cache = transcription du passage déposée par
  `--from-file`, précédée d'un en-tête (vidéo, passage, orateur, origine des sous-titres).
- **Provenance de la découverte** (« recherche de l'agent » ou « proposition ChatGPT vérifiée »,
  entité Source éducation de la spec) : consignée dans le journal de campagne, pas dans le YAML
  (le schéma des sources reste inchangé et la provenance n'est pas publiée).

## Position (précision, sans champ nouveau)

- Une position tirée d'une transcription cite dans sa `justification` le timecode de la
  citation (« à 04:18:02 ») ; adrien confirme la citation à l'écoute avant `data:review`.
- Si l'écoute corrige la transcription, le texte en cache et le `contentHash` de la source
  sont mis à jour **avant** la relecture ; `reviewedHash` porte sur l'état corrigé.
- Conventions du 2026-11-09 inchangées : mesure plus large que l'énoncé → ±1 ; renvoi à un
  référendum ou une convention → pas de position ; phrase vague → inconnue.

## Journal de campagne (nouveau, Markdown versionné)

`data/campagnes/education/sources.md` — une section par candidat déclaré (18) :

- sources examinées, chacune avec origine (ChatGPT, agent, corpus existant), URL, décision
  (`retenue` → identifiant de source ; `écartée` → motif parmi : inaccessible, non attribuable
  FR-013a, doublon d'URL, doublon de contenu, citation introuvable, hors sujet, sans mesure) ;
- sources du corpus relues pour l'éducation (FR-011) ;
- conclusion : nombre de sources retenues, ou « cherché sans résultat » avec la liste des
  sources consultées (SC-003).

## Dossier de rédaction (nouveau, Markdown versionné)

`data/campagnes/education/enonces.md` :

- **Inventaire des mesures** : tableau candidat × mesure (source, citation courte, dimension,
  sens attendu sur l'axe, sous-thème du périmètre) ;
- **Fiche par énoncé** : identifiant, texte, dimension, polarité, sous-thème, sources et
  citations qui l'ont motivé, au moins un candidat attendu de chaque côté (FR-008), décision de
  la revue adverse, décision d'adrien ;
- **Bilan** : effectifs par dimension, par polarité et par sous-thème ; énoncés écartés et
  motif ; après les positions, liste des énoncés non discriminants signalés (US3 scénario 5).

## Version de banque 2

Produite par `pnpm data:publish` : 18 thèmes, banque v1 + énoncés Éducation (aucun retrait),
positions relues, candidats déclarés. La version 1 reste servie telle quelle pour les liens qui
la désignent.
