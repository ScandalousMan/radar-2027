// pnpm data:publish [--next] [--dry-run] [--date <YYYY-MM-DD>] (FR-036 à FR-040, US3 scénario 2).
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { MAX_VERSIONS } from '@/core/dataset';
import { fail, info, parseCli, resolvePaths, runCli, today, usage, warn, type DataPaths } from './lib/cli';
import { allPositions, readYamlRaw, writeYaml } from './lib/corpus';
import { isScaleValue, sourceIndex } from './lib/positions';
import { buildDetail, buildMain, serialize } from './lib/publish/build';
import { diffAgainstCurrent } from './lib/publish/diff';
import { appendVersion, readRegistry } from './lib/publish/registry';
import { measure } from './lib/publish/sizes';
import { sha256 } from './lib/text';
import { validate } from './validate';

const HELP = 'Usage : pnpm data:publish [--next] [--dry-run] [--date <YYYY-MM-DD>] [--corpus <dossier>]';

export type PublishOptions = { next?: boolean; dryRun?: boolean; date?: string };

export type PublishResult =
  | { kind: 'dry-run'; version: number; differences: string[]; sizes: { path: string; bytes: number }[] }
  | { kind: 'published'; version: number; differences: string[]; files: string[]; warnings: string[] };

export async function publish(paths: DataPaths, opts: PublishOptions = {}): Promise<PublishResult> {
  const publishedAt = opts.date ?? today();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(publishedAt)) usage(`Date invalide : ${publishedAt}.`);

  const report = await validate(paths);
  if (report.violations.length > 0)
    fail(`Publication refusée : ${report.violations.length} violation(s). Lancer pnpm data:validate pour le détail.`);
  const { ctx } = report;
  const corpus = ctx.corpus;

  // « Connue » exige la citation vérifiée (FR-022) : le cache doit couvrir toutes les citations relues.
  if (!ctx.cache) fail(`Publication refusée : cache des sources absent (${paths.cacheDir}).`);
  const index = sourceIndex(corpus);
  const missing = new Set<string>();
  for (const { position: p } of allPositions(corpus)) {
    if (p.status !== 'reviewed' || !isScaleValue(p.value) || !p.quoteSource) continue;
    const s = index.get(p.quoteSource);
    if (!s?.contentHash || ctx.cache.read(s.contentHash) === null) missing.add(p.quoteSource);
  }
  if (missing.size > 0) fail(`Publication refusée : texte absent du cache pour ${[...missing].sort().join(', ')}.`);

  const empty = report.warnings.filter((w) => w.rule === 'THEME-EMPTY').map((w) => w.entity.id);
  if (empty.length > 0) fail(`Publication refusée : thème(s) actif(s) sans question active : ${empty.join(', ')}.`);

  const registry = readRegistry(paths.publishedDir);
  const version = registry.current + 1;
  if (version > MAX_VERSIONS) fail(`Publication refusée : limite de ${MAX_VERSIONS} versions atteinte.`);
  const build = { version, publishedAt, cache: ctx.cache };
  const main = buildMain(corpus, build);
  const differences = diffAgainstCurrent(main, ctx.published?.current ?? null);
  if (!differences) fail('Rien à publier : le contenu est identique à la version courante.');

  const details = main.candidates.map((c) => ({ id: c.id, text: serialize(buildDetail(corpus, c.id, build)) }));
  const mainText = serialize(main);
  const dir = join(paths.publishedDir, 'versions', String(version));

  if (opts.dryRun) {
    return {
      kind: 'dry-run',
      version,
      differences,
      sizes: [{ path: `versions/${version}/main.json`, bytes: measure(mainText) }, ...details.map((d) => ({ path: `versions/${version}/candidates/${d.id}.json`, bytes: measure(d.text) }))],
    };
  }
  if (!opts.next) fail(`Le contenu a changé depuis la version ${registry.current} ; relancer avec --next pour créer la version ${version} :\n${differences.map((d) => `  - ${d}`).join('\n')}`);
  if (existsSync(dir)) fail(`Publication refusée : ${dir} existe déjà (une version publiée est immuable).`);

  // Budgets vérifiés avant toute écriture.
  const t = ctx.thresholds;
  const over = [
    ...(measure(mainText) > t.mainBudgetBytes ? [`main.json : ${measure(mainText)} > ${t.mainBudgetBytes}`] : []),
    ...details.filter((d) => measure(d.text) > t.detailBudgetBytes).map((d) => `${d.id}.json : ${measure(d.text)} > ${t.detailBudgetBytes}`),
  ];
  if (over.length > 0) fail(`Publication refusée, budget dépassé : ${over.join(' ; ')}.`);

  mkdirSync(join(dir, 'candidates'), { recursive: true });
  const files: string[] = [];
  writeFileSync(join(dir, 'main.json'), mainText, { encoding: 'utf8', flag: 'wx' });
  files.push(join(dir, 'main.json'));
  const detailHashes: Record<string, string> = {};
  for (const d of details) {
    const file = join(dir, 'candidates', `${d.id}.json`);
    writeFileSync(file, d.text, { encoding: 'utf8', flag: 'wx' });
    detailHashes[d.id] = sha256(d.text);
    files.push(file);
  }
  const { registry: next, warnings } = appendVersion(registry, {
    publishedAt,
    questionCount: main.questions.length,
    candidateCount: main.candidates.length,
    mainHash: sha256(mainText),
    detailHashes,
  });
  mkdirSync(paths.publishedDir, { recursive: true });
  writeFileSync(join(paths.publishedDir, 'versions.json'), `${JSON.stringify(next, null, 2)}\n`, 'utf8');

  // introducedIn (questions nouvelles) et retiredIn (questions sorties depuis la version précédente).
  const previous = new Set(ctx.published?.current?.questions.map((q) => q.id) ?? []);
  const nowActive = new Set(main.questions.map((q) => q.id));
  for (const [theme] of corpus.questions) {
    const file = join(paths.corpusDir, 'questions', `${theme}.yaml`);
    const raw = readYamlRaw(file) as Record<string, unknown>[];
    let changed = false;
    for (const q of raw) {
      const id = String(q.id);
      if (nowActive.has(id) && q.introducedIn === undefined) {
        q.introducedIn = version;
        changed = true;
      }
      if (previous.has(id) && !nowActive.has(id) && q.retiredIn === undefined) {
        q.retiredIn = version;
        changed = true;
      }
    }
    if (changed) writeYaml(file, raw);
  }
  return { kind: 'published', version, differences, files, warnings };
}

async function main(argv: string[]): Promise<number> {
  const { values, positionals } = parseCli(
    argv,
    { next: { type: 'boolean' }, 'dry-run': { type: 'boolean' }, date: { type: 'string' }, corpus: { type: 'string' } },
    HELP,
  );
  if (positionals.length > 0) usage(HELP);
  const r = await publish(resolvePaths({ corpus: values.corpus }), { next: values.next, dryRun: values['dry-run'], date: values.date });
  info(`Différences pour la version ${r.version} :`);
  for (const d of r.differences) info(`  - ${d}`);
  if (r.kind === 'dry-run') {
    info('Simulation (--dry-run) : aucun fichier écrit. Tailles estimées :');
    for (const s of r.sizes) info(`  ${s.path} : ${s.bytes} octets`);
    return 0;
  }
  for (const w of r.warnings) warn(w);
  info(`Version ${r.version} publiée (${r.files.length} fichiers) ; registre mis à jour.`);
  return 0;
}

if (process.argv[1] && /publish\.ts$/.test(process.argv[1])) void runCli(() => main(process.argv.slice(2)));
