// pnpm data:publish [--next] [--dry-run] [--date <YYYY-MM-DD>] [--min-coverage <k>] (FR-036 à FR-040,
// US3 scénario 2). 009 : banque active (R4), règles de sélection 3, rapport de couverture (R5).
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { MAX_VERSIONS } from '@/core/dataset';
import { fail, info, parseCli, resolvePaths, runCli, today, usage, warn, type DataPaths } from './lib/cli';
import { allPositions, editYamlListItems, setYamlKeys } from './lib/corpus';
import { isScaleValue, sourceIndex } from './lib/positions';
import { ActiveBankError, computeActiveBank, type ActiveBank } from './lib/publish/active-bank';
import { buildDetail, buildMain, serialize } from './lib/publish/build';
import { buildCoverageReport, writeCoverageReport, type CoverageReport } from './lib/publish/coverage-report';
import { diffAgainstCurrent } from './lib/publish/diff';
import { appendVersion, readRegistry } from './lib/publish/registry';
import { measure } from './lib/publish/sizes';
import { sha256 } from './lib/text';
import { validate } from './validate';

const HELP = 'Usage : pnpm data:publish [--next] [--dry-run] [--date <YYYY-MM-DD>] [--corpus <dossier>] [--min-coverage <k>]';

export type PublishOptions = { next?: boolean; dryRun?: boolean; date?: string; minCoverage?: number };

/** Résumé de la banque active et du rapport de couverture, commun aux deux issues. */
export type CoverageSummary = { activeBank: ActiveBank; report: CoverageReport; reportFiles: string[] };

export type PublishResult =
  | ({ kind: 'dry-run'; version: number; differences: string[]; sizes: { path: string; bytes: number }[] } & CoverageSummary)
  | ({ kind: 'published'; version: number; differences: string[]; files: string[]; warnings: string[] } & CoverageSummary);

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
  let activeBank: ActiveBank;
  try {
    activeBank = computeActiveBank(ctx, { minCoverage: opts.minCoverage });
  } catch (e) {
    if (e instanceof ActiveBankError) fail(`Publication refusée : ${e.message}`);
    throw e;
  }
  const build = { version, publishedAt, cache: ctx.cache, activeBank };
  const main = buildMain(corpus, build);
  const differences = diffAgainstCurrent(main, ctx.published?.current ?? null);
  if (!differences) fail('Rien à publier : le contenu est identique à la version courante.');

  // Rapport de couverture, écrit y compris en simulation (R5).
  const coverageReport = buildCoverageReport({
    main,
    generatedAt: publishedAt,
    reserve: activeBank.reserveQuestions.map((q) => ({ id: q.id, theme: q.themes[0]! })),
    completed: activeBank.completed,
    warnings: activeBank.warnings,
  });
  const labels = new Map<string, string>([...corpus.themes.map((t) => [t.id, t.label] as const), ...corpus.candidates.map((c) => [c.id, c.name] as const)]);
  const reportFiles = writeCoverageReport(paths.reportsDir, coverageReport, labels);
  const coverageSummary: CoverageSummary = { activeBank, report: coverageReport, reportFiles };

  const details = main.candidates.map((c) => ({ id: c.id, text: serialize(buildDetail(corpus, c.id, build)) }));
  const mainText = serialize(main);
  const dir = join(paths.publishedDir, 'versions', String(version));

  if (opts.dryRun) {
    return {
      kind: 'dry-run',
      version,
      differences,
      ...coverageSummary,
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

  // introducedIn (questions publiées pour la première fois) et retiredIn (questions sorties depuis la
  // version précédente parce qu'elles ne sont plus `active` au corpus). Une question mise en réserve
  // reste `active` au corpus et ne reçoit pas de retiredIn (009 FR-007).
  const previous = new Set(ctx.published?.current?.questions.map((q) => q.id) ?? []);
  const nowActive = new Set(main.questions.map((q) => q.id));
  const corpusActive = new Set(activeBank.coverage.keys());
  for (const [theme] of corpus.questions) {
    const file = join(paths.corpusDir, 'questions', `${theme}.yaml`);
    // Édition sur le document YAML : commentaires de relecture et mise en forme conservés.
    editYamlListItems(file, (q) => {
      const id = String(q.get('id'));
      let changed = false;
      if (nowActive.has(id) && !q.has('introducedIn')) {
        setYamlKeys(q, { introducedIn: version });
        changed = true;
      }
      if (previous.has(id) && !nowActive.has(id) && !corpusActive.has(id) && !q.has('retiredIn')) {
        setYamlKeys(q, { retiredIn: version });
        changed = true;
      }
      return changed;
    });
  }
  return { kind: 'published', version, differences, files, warnings, ...coverageSummary };
}

function printCoverage({ activeBank, report, reportFiles }: CoverageSummary): void {
  info(`Banque active : k = ${activeBank.k}, ${activeBank.active.length} questions actives, ${activeBank.reserve.length} en réserve.`);
  for (const w of activeBank.warnings) warn(w);
  for (const mode of ['short', 'full'] as const) {
    const s = report.ranked[mode];
    info(`Candidats classés (${mode === 'short' ? 'court' : 'complet'}) : min ${s.min}, médiane ${s.median}, max ${s.max}.`);
  }
  if (!report.successCriteria.sc001) warn('SC-001 non atteint (mode court : min ≥ 10 et médiane ≥ 12) : soumettre le rapport au propriétaire avant de publier.');
  if (!report.successCriteria.sc002) warn('SC-002 non atteint (mode complet : min ≥ 8 et médiane ≥ 10) : soumettre le rapport au propriétaire avant de publier.');
  info(`Rapport de couverture : ${reportFiles.join(', ')}.`);
}

async function main(argv: string[]): Promise<number> {
  const { values, positionals } = parseCli(
    argv,
    { next: { type: 'boolean' }, 'dry-run': { type: 'boolean' }, date: { type: 'string' }, corpus: { type: 'string' }, 'min-coverage': { type: 'string' } },
    HELP,
  );
  if (positionals.length > 0) usage(HELP);
  const raw = values['min-coverage'];
  if (raw !== undefined && !/^\d+$/.test(raw)) usage(`--min-coverage attend un entier : ${raw}.`);
  const r = await publish(resolvePaths({ corpus: values.corpus }), { next: values.next, dryRun: values['dry-run'], date: values.date, minCoverage: raw === undefined ? undefined : Number(raw) });
  info(`Différences pour la version ${r.version} :`);
  for (const d of r.differences) info(`  - ${d}`);
  printCoverage(r);
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
