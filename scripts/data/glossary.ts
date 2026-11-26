// pnpm data:glossary [--check] [--date <YYYY-MM-DD>] [--corpus <dossier>] (spec 009, R11).
// Valide le glossaire (règle GLOSS) puis écrit `public/data/glossary.json` (termes relus, ordre
// alphabétique). `--check` n'écrit rien et échoue si le fichier publié ne suit pas le corpus.
// Le glossaire est hors versions : le publier n'impose pas de nouvelle version de banque.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { EXIT_FAILURE, EXIT_OK, fail, info, parseCli, resolvePaths, runCli, today, usage, warn, type DataPaths } from './lib/cli';
import { loadCorpus } from './lib/corpus';
import { buildPublishedGlossary, GLOSSARY_FILE_NAME, parsePublishedGlossary, sameGlossaryContent, serializeGlossary } from './lib/glossary';
import { GLOSS } from './lib/rules/GLOSS';
import { DEFAULT_THRESHOLDS } from './lib/schema';

const HELP = 'Usage : pnpm data:glossary [--check] [--date <YYYY-MM-DD>] [--corpus <dossier>]';

export type GlossaryResult = { kind: 'written' | 'unchanged' | 'in-sync'; file: string; terms: number } | { kind: 'out-of-sync'; file: string; terms: number };

export function publishGlossary(paths: DataPaths, options: { check?: boolean; date?: string } = {}): GlossaryResult {
  const { corpus, violations } = loadCorpus(paths.corpusDir);
  const schemaErrors = violations.filter((v) => v.entity.id.startsWith('glossaire.yaml'));
  if (schemaErrors.length > 0) fail(schemaErrors.map((v) => `✗ ${v.rule} ${v.entity.id} : ${v.message}`).join('\n'));
  if (!corpus.glossary) fail(`glossaire absent : ${relative(process.cwd(), join(paths.corpusDir, 'glossaire.yaml'))}`);

  // GLOSS sans le contrôle de synchronisation, que cette commande sert justement à rétablir.
  const errors = GLOSS.run({ corpus, thresholds: corpus.governance?.thresholds ?? DEFAULT_THRESHOLDS }).filter((v) => v.severity === 'error');
  if (errors.length > 0) fail(['Glossaire non conforme :', ...errors.map((v) => `✗ ${v.rule} ${v.entity.id} : ${v.message}`)].join('\n'));

  const file = join(paths.publishedDir, GLOSSARY_FILE_NAME);
  const existing = existsSync(file) ? parsePublishedGlossary(readFileSync(file, 'utf8')) : null;
  const next = buildPublishedGlossary(corpus.glossary, options.date ?? today());
  const inSync = existing !== null && sameGlossaryContent(existing, next);

  if (options.check) return { kind: inSync ? 'in-sync' : 'out-of-sync', file, terms: next.terms.length };
  // Contenu inchangé : la date de mise à jour n'est pas réécrite (aucun diff inutile).
  if (inSync) return { kind: 'unchanged', file, terms: next.terms.length };
  mkdirSync(paths.publishedDir, { recursive: true });
  writeFileSync(file, serializeGlossary(next), 'utf8');
  return { kind: 'written', file, terms: next.terms.length };
}

async function main(argv: string[]): Promise<number> {
  const { values, positionals } = parseCli(argv, { check: { type: 'boolean' }, date: { type: 'string' }, corpus: { type: 'string' } }, HELP);
  if (positionals.length > 0) usage(HELP);
  if (values.date !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(values.date)) usage(`date YYYY-MM-DD attendue\n\n${HELP}`);
  const result = publishGlossary(resolvePaths({ corpus: values.corpus }), { check: values.check, date: values.date });
  const shown = relative(process.cwd(), result.file);
  switch (result.kind) {
    case 'in-sync':
      info(`${shown} suit le glossaire (${result.terms} terme(s) relu(s)).`);
      return EXIT_OK;
    case 'out-of-sync':
      warn(`${shown} ne suit pas glossaire.yaml : lancer pnpm data:glossary.`);
      return EXIT_FAILURE;
    case 'unchanged':
      info(`${shown} déjà à jour (${result.terms} terme(s) relu(s)).`);
      return EXIT_OK;
    case 'written':
      info(`${shown} écrit : ${result.terms} terme(s) relu(s).`);
      return EXIT_OK;
  }
}

if (process.argv[1] && /glossary\.ts$/.test(process.argv[1])) void runCli(() => main(process.argv.slice(2)));
