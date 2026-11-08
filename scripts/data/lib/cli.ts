// Outils communs aux commandes `pnpm data:*` (contracts/cli.md) : analyse des arguments,
// sortie en français, codes de sortie (0 succès, 1 refus métier, 2 erreur d'usage) et
// résolution des chemins (dépôt ou dossier de fixture).
import { existsSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { parseArgs, type ParseArgsConfig } from 'node:util';

export const EXIT_OK = 0;
export const EXIT_FAILURE = 1;
export const EXIT_USAGE = 2;

/** Erreur portant un code de sortie ; levée par `usage` et `fail`, interceptée par `runCli`. */
export class CliError extends Error {
  constructor(
    message: string,
    readonly exitCode: number,
  ) {
    super(message);
    this.name = 'CliError';
  }
}

/** Erreur d'usage (option inconnue, argument manquant) : sortie 2. */
export function usage(text: string): never {
  throw new CliError(text, EXIT_USAGE);
}

/** Refus métier ou violation : sortie 1. */
export function fail(message: string): never {
  throw new CliError(message, EXIT_FAILURE);
}

export function info(message: string): void {
  process.stdout.write(`${message}\n`);
}

export function warn(message: string): void {
  process.stderr.write(`${message}\n`);
}

/** `parseArgs` strict ; toute erreur d'analyse devient une erreur d'usage (sortie 2). */
export function parseCli<T extends ParseArgsConfig['options']>(
  args: string[],
  options: T,
  help: string,
) {
  try {
    return parseArgs({ args, options, strict: true, allowPositionals: true });
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    return usage(`${detail}\n\n${help}`);
  }
}

export type DataPaths = {
  /** Racine du dépôt (ou du dossier de fixture). */
  rootDir: string;
  corpusDir: string;
  publishedDir: string;
  cacheDir: string;
  extractionsDir: string;
  reportsDir: string;
  /** `true` si les chemins désignent un dossier de fixture (`corpus/`, `published/`, `cache/`). */
  fixture: boolean;
};

/**
 * Résout les dossiers utilisés par les commandes.
 * - sans `corpus` : dossiers du dépôt (`data/corpus`, `public/data`, `RADAR_SOURCE_CACHE_DIR`
 *   ou `.cache/sources`, `data/extractions`, `data/reports`) ;
 * - `corpus` désignant un dossier de fixture (qui contient `corpus/`) : `corpus/`,
 *   `published/`, `cache/`, `extractions/` de ce dossier, rapports dans `reports/` ;
 * - `corpus` désignant directement un dossier de corpus : ce dossier, le reste par défaut.
 */
export function resolvePaths(
  options: { corpus?: string } = {},
  env: NodeJS.ProcessEnv = process.env,
  cwd: string = process.cwd(),
): DataPaths {
  const repoCache = env.RADAR_SOURCE_CACHE_DIR ? resolve(cwd, env.RADAR_SOURCE_CACHE_DIR) : join(cwd, '.cache', 'sources');
  const repo: DataPaths = {
    rootDir: cwd,
    corpusDir: join(cwd, 'data', 'corpus'),
    publishedDir: join(cwd, 'public', 'data'),
    cacheDir: repoCache,
    extractionsDir: join(cwd, 'data', 'extractions'),
    reportsDir: join(cwd, 'data', 'reports'),
    fixture: false,
  };
  if (!options.corpus) return repo;

  const dir = resolve(cwd, options.corpus);
  const nested = join(dir, 'corpus');
  if (existsSync(nested) && statSync(nested).isDirectory()) {
    return {
      rootDir: dir,
      corpusDir: nested,
      publishedDir: join(dir, 'published'),
      cacheDir: join(dir, 'cache'),
      extractionsDir: join(dir, 'extractions'),
      reportsDir: join(dir, 'reports'),
      fixture: true,
    };
  }
  return { ...repo, corpusDir: dir };
}

/** Exécute une commande et traduit ses erreurs en code de sortie. */
export async function runCli(main: () => Promise<number | void>): Promise<void> {
  try {
    const code = await main();
    process.exitCode = code ?? EXIT_OK;
  } catch (error) {
    if (error instanceof CliError) {
      warn(error.message);
      process.exitCode = error.exitCode;
      return;
    }
    // Message seul : jamais d'objet brut (qui pourrait contenir une requête ou un en-tête).
    warn(`Erreur inattendue : ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = EXIT_FAILURE;
  }
}

/** Date du jour au format `YYYY-MM-DD` (UTC). */
export function today(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}
