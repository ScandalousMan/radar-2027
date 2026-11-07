# Contrat : commandes du pipeline (`pnpm data:*`)

Toutes les commandes sont des scripts TypeScript de `scripts/data/` exécutés par `tsx`, sans
dépendance CLI (`node:util` `parseArgs`). Elles lisent et écrivent uniquement sous `data/`,
`public/data/` et le cache (`RADAR_SOURCE_CACHE_DIR`, défaut `.cache/sources`). Sortie
standard en français ; code de sortie `0` succès, `1` violation ou refus métier, `2` erreur
d'usage. Aucune commande ne lit de secret autre que `ANTHROPIC_API_KEY` (extraction seule).

| Commande | Rôle | Effets | FR |
|---|---|---|---|
| `pnpm data:validate [--corpus <dir>] [--no-cache] [--json <out>]` | valide le corpus entier, calcule couverture et pouvoir discriminant, écrit le rapport | `data/reports/validation.{md,json}` | FR-031 à FR-035 |
| `pnpm data:source fetch <url> --candidate <id> --kind <k> --title <t> --published <date> [--from-file <txt>]` | télécharge ou lit le texte, normalise, empreinte, écrit le cache et ajoute l'entrée YAML | cache + `sources/<candidat>.yaml` | FR-013, FR-014 |
| `pnpm data:source check [--online]` | recalcule les empreintes du cache ; avec `--online`, teste les adresses | avertissements, `unreachableSince` | cas limites sources |
| `pnpm data:extract --candidate <id> [--sources a,b] [--max-cost <usd>] [--model <id>] [--dry-run]` | exécute l'extraction assistée sur les sources en cache | `runs/<id>.json`, `affirmations/<candidat>.json`, `costs.json` | FR-023 à FR-030 |
| `pnpm data:affirmation list --candidate <id> [--state verifiable]` | liste les affirmations à relire avec citation et question | lecture seule | FR-028 |
| `pnpm data:affirmation accept <id> --by <contrib> [--value n] [--question q]` | crée une position `draft` depuis une affirmation vérifiable | `positions/<candidat>.yaml`, état `accepted` | FR-028 |
| `pnpm data:affirmation reject <id> --by <contrib> --reason <texte>` | rejette avec motif | état `rejected` | FR-028 |
| `pnpm data:review <candidate> <question> --by <contrib> [--contest]` | passe une position `draft` en `reviewed` (ou `contested`) en posant relecteur, date, empreinte ; refuse si `by` = auteur | `positions/<candidat>.yaml` | FR-018 à FR-020 |
| `pnpm data:publish [--next] [--dry-run]` | construit le jeu principal et les détails ; refuse d'écraser une version ; `--next` requis dès qu'un changement existe | `public/data/versions.json`, `versions/<n>/**` | FR-036 à FR-040 |
| `pnpm data:costs` | affiche le cumul des coûts d'extraction par modèle et par candidat | lecture seule | SC-006 |

Scripts npm ajoutés : `data:validate`, `data:source`, `data:extract`, `data:affirmation`,
`data:review`, `data:publish`, `data:costs` ; `verify` devient
`lint && typecheck && data:validate && test && storybook:build && build && e2e`.

## Comportements contractuels

- **`data:validate`** sans cache (CI) : les règles dépendant du cache (`FR-014` sur l'égalité,
  `FR-017` sur la citation) passent en avertissement `CACHE-MISSING` ; toutes les autres
  restent bloquantes. Avec `--corpus data/fixtures/violations/<code>` la commande doit
  échouer avec exactement ce code parmi les violations (test d'intégration SC-001).
- **`data:extract`** : refuse de démarrer sans `ANTHROPIC_API_KEY` résolu par le SDK, sans
  cache pour une des sources demandées, ou si la banque active est vide. Avant chaque requête :
  si `coût cumulé + estimation > --max-cost`, arrêt propre, état `interrupted`. Jamais
  d'écriture dans `positions/`. `--dry-run` affiche les tranches, le nombre de jetons estimé et
  le coût estimé sans appeler l'API. Un `stop_reason` `refusal` ou `max_tokens` sur une tranche
  la marque `failed` et continue.
- **`data:affirmation accept`** : refuse `unverifiable`, `question = null`, et toute
  affirmation déjà `accepted`/`rejected` ; la position créée porte `status: draft`,
  `provenance.kind: extraction` et reprend `quote`, `quoteSource`, `sources: [source]`,
  `evidence` = type de la source.
- **`data:review`** : refuse si `--by` est l'auteur, si la position n'est pas `draft` (ou
  `contested` pour un arbitrage), ou si la validation de cette position échoue (source,
  citation, niveau). Pose `reviewedHash`.
- **`data:publish`** : lance d'abord `validate` (échec ⇒ pas de publication). Compare le
  contenu candidat (questions actives, candidats déclarés, positions connues) à la version
  courante : identique ⇒ refus « rien à publier » ; différent sans `--next` ⇒ refus en listant
  les différences ; avec `--next` ⇒ crée `n+1`, pose `introducedIn`/`retiredIn` sur les
  questions concernées, met à jour le registre, échoue au-delà de 256 versions.

## Interface du client d'extraction (pour les tests)

```ts
// scripts/data/lib/extraction/client.ts
export type ExtractionClient = {
  countTokens(req: ExtractionRequest): Promise<number>;
  extract(req: ExtractionRequest): Promise<{ output: ExtractionOutput | null; usage: Usage; stopReason: string }>;
};
// Implémentations : anthropicClient(model) (SDK, production) et fakeClient(fixtures) (tests, CI).
```

Le schéma `ExtractionOutput` (Zod) est celui transmis à `zodOutputFormat` :

```ts
z.object({
  affirmations: z.array(z.object({
    quote: z.string().max(300),
    summary: z.string(),
    themes: z.array(ThemeId).min(1).max(2),
    question: QuestionId.nullable(),
    proposedValue: z.union([z.literal(-2), z.literal(-1), z.literal(0), z.literal(1), z.literal(2)]),
    confidence: z.enum(['low', 'medium', 'high']),
  })),
})
```

La localisation (`location`) n'est **pas** demandée au modèle : elle est recalculée par la
recherche de la citation normalisée dans le texte (R5, R8).
