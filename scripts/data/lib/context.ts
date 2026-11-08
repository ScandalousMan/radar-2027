// Construction du contexte de validation : corpus, cache, versions publiées, extractions.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { MainDatasetSchema, VersionRegistrySchema, type MainDataset, type VersionRegistry } from '@/core/dataset';
import { hasCache, openCache } from './cache';
import type { DataPaths } from './cli';
import { loadCorpus } from './corpus';
import { AffirmationsFileSchema, DEFAULT_THRESHOLDS, type Affirmation } from './schema';
import { sha256 } from './text';
import { violation, warning, type ExtractionsView, type PublishedView, type RuleContext, type Violation } from './rules/types';

function walkJson(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return walkJson(full);
    return name.endsWith('.json') ? [full] : [];
  });
}

/** Lit `public/data` : registre, empreintes de tous les fichiers JSON, `main.json` courant. */
export function readPublished(publishedDir: string, out: Violation[]): PublishedView | undefined {
  const registryFile = join(publishedDir, 'versions.json');
  if (!existsSync(registryFile)) return undefined;
  const files = new Map<string, { bytes: number; hash: string }>();
  for (const file of walkJson(publishedDir)) {
    const text = readFileSync(file, 'utf8');
    files.set(relative(publishedDir, file).split('\\').join('/'), { bytes: Buffer.byteLength(text, 'utf8'), hash: sha256(text) });
  }
  let registry: VersionRegistry;
  try {
    const parsed = VersionRegistrySchema.safeParse(JSON.parse(readFileSync(registryFile, 'utf8')));
    if (!parsed.success) {
      for (const i of parsed.error.issues) out.push(violation('SCHEMA', 'file', `versions.json:${i.path.join('.')}`, i.message));
      return undefined;
    }
    registry = parsed.data;
  } catch (error) {
    out.push(violation('SCHEMA', 'file', 'versions.json', `JSON illisible : ${error instanceof Error ? error.message : String(error)}`));
    return undefined;
  }
  let current: MainDataset | null = null;
  if (registry.current > 0) {
    const mainFile = join(publishedDir, 'versions', String(registry.current), 'main.json');
    if (existsSync(mainFile)) {
      try {
        const parsed = MainDatasetSchema.safeParse(JSON.parse(readFileSync(mainFile, 'utf8')));
        if (parsed.success) current = parsed.data;
        else for (const i of parsed.error.issues) out.push(violation('SCHEMA', 'file', `versions/${registry.current}/main.json:${i.path.join('.')}`, i.message));
      } catch (error) {
        out.push(violation('SCHEMA', 'file', `versions/${registry.current}/main.json`, `JSON illisible : ${error instanceof Error ? error.message : String(error)}`));
      }
    }
  }
  return { registry, current, files };
}

/** Lit `data/extractions` (identifiants d'exécution, affirmations) s'il existe. */
export function readExtractions(extractionsDir: string, out: Violation[]): ExtractionsView | undefined {
  if (!existsSync(extractionsDir)) return undefined;
  const runsDir = join(extractionsDir, 'runs');
  const runs = new Set(existsSync(runsDir) ? readdirSync(runsDir).filter((f) => f.endsWith('.json')).map((f) => f.replace(/\.json$/, '')) : []);
  const affirmations = new Map<string, Affirmation[]>();
  const affDir = join(extractionsDir, 'affirmations');
  if (existsSync(affDir)) {
    for (const f of readdirSync(affDir).filter((x) => x.endsWith('.json'))) {
      try {
        const parsed = AffirmationsFileSchema.safeParse(JSON.parse(readFileSync(join(affDir, f), 'utf8')));
        if (parsed.success) affirmations.set(f.replace(/\.json$/, ''), parsed.data);
        else out.push(violation('SCHEMA', 'file', `extractions/affirmations/${f}`, parsed.error.issues[0]?.message ?? 'invalide'));
      } catch {
        out.push(violation('SCHEMA', 'file', `extractions/affirmations/${f}`, 'JSON illisible'));
      }
    }
  }
  return { runs, affirmations };
}

export type ContextOptions = { noCache?: boolean };

/** Contexte complet et violations de chargement (`SCHEMA`) ; avertissement `CACHE-MISSING` sans cache. */
export function buildContext(paths: DataPaths, options: ContextOptions = {}): { ctx: RuleContext; loadViolations: Violation[] } {
  const { corpus, violations } = loadCorpus(paths.corpusDir);
  const loadViolations = [...violations];
  const published = readPublished(paths.publishedDir, loadViolations);
  const extractions = readExtractions(paths.extractionsDir, loadViolations);
  const cacheAvailable = !options.noCache && hasCache(paths.cacheDir);
  if (!cacheAvailable)
    loadViolations.push(warning('CACHE-MISSING', 'file', 'cache', `cache des sources absent (${relative(process.cwd(), paths.cacheDir) || paths.cacheDir}) : citations et empreintes non vérifiées`));
  const ctx: RuleContext = {
    corpus,
    cache: cacheAvailable ? openCache(paths.cacheDir) : undefined,
    published,
    extractions,
    thresholds: corpus.governance?.thresholds ?? DEFAULT_THRESHOLDS,
  };
  return { ctx, loadViolations };
}
