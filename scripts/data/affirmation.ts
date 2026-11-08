// pnpm data:affirmation list|accept|reject (FR-028, US4 scénarios 5 et 6).
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fail, info, parseCli, resolvePaths, runCli, today, usage, type DataPaths } from './lib/cli';
import { loadCorpus, positionId, readYamlRaw, writeYaml } from './lib/corpus';
import { isScaleValue, sourceIndex } from './lib/positions';
import { AffirmationsFileSchema, EvidenceKindSchema, RunSchema, type Affirmation } from './lib/schema';

const HELP = `Usage :
  pnpm data:affirmation list --candidate <id> [--state verifiable|unverifiable|accepted|rejected]
  pnpm data:affirmation accept <id> --by <contributeur> [--value <-2…2>] [--question <id>] [--evidence <type>]
  pnpm data:affirmation reject <id> --by <contributeur> --reason <texte>
  (toutes : [--corpus <dossier>])`;

const affDir = (paths: DataPaths) => join(paths.extractionsDir, 'affirmations');

function readAffirmations(file: string): Affirmation[] {
  return AffirmationsFileSchema.parse(JSON.parse(readFileSync(file, 'utf8')));
}

/** Retrouve une affirmation par identifiant dans tous les fichiers de candidats. */
function findAffirmation(paths: DataPaths, id: string) {
  const dir = affDir(paths);
  if (!existsSync(dir)) fail('Aucune affirmation : lancer pnpm data:extract.');
  for (const f of readdirSync(dir).filter((x) => x.endsWith('.json'))) {
    const file = join(dir, f);
    const list = readAffirmations(file);
    const index = list.findIndex((a) => a.id === id);
    if (index >= 0) return { candidate: f.replace(/\.json$/, ''), file, list, affirmation: list[index]! };
  }
  return fail(`Affirmation introuvable : ${id}.`);
}

const save = (file: string, list: Affirmation[]) => writeFileSync(file, `${JSON.stringify(list, null, 2)}\n`, 'utf8');

export function listAffirmations(paths: DataPaths, candidate: string, state?: Affirmation['state']): Affirmation[] {
  const file = join(affDir(paths), `${candidate}.json`);
  if (!existsSync(file)) return [];
  return readAffirmations(file).filter((a) => !state || a.state === state);
}

export type AcceptOptions = { id: string; by: string; value?: number; question?: string; evidence?: string; now?: Date };

/** Crée une position `draft` depuis une affirmation vérifiable et trace la décision. */
export function acceptAffirmation(paths: DataPaths, opts: AcceptOptions): { position: string } {
  const { corpus } = loadCorpus(paths.corpusDir);
  const found = findAffirmation(paths, opts.id);
  const a = found.affirmation;
  if (!corpus.contributors.some((c) => c.id === opts.by)) fail(`Contributeur inconnu : ${opts.by}.`);
  if (a.state === 'unverifiable') fail(`Affirmation ${a.id} non vérifiable : sa citation est introuvable dans la source.`);
  if (a.state === 'accepted' || a.state === 'rejected') fail(`Affirmation ${a.id} déjà ${a.state === 'accepted' ? 'acceptée' : 'rejetée'}.`);
  const question = opts.question ?? a.question;
  if (!question) fail(`Affirmation ${a.id} sans question rattachée : préciser --question.`);
  const questionExists = [...corpus.questions.values()].some((qs) => qs.some((q) => q.id === question));
  if (!questionExists) fail(`Question inconnue : ${question}.`);
  const value = opts.value ?? a.proposedValue;
  if (!isScaleValue(value)) usage(`Valeur hors échelle : ${value}.`);
  const source = sourceIndex(corpus).get(a.source);
  if (!source) fail(`Source inconnue : ${a.source}.`);
  const evidence = opts.evidence ? EvidenceKindSchema.safeParse(opts.evidence) : { success: true as const, data: source.kind };
  if (!evidence.success) usage(`Niveau de preuve inconnu : ${opts.evidence}.`);
  const posFile = join(paths.corpusDir, 'positions', `${found.candidate}.yaml`);
  const positions = existsSync(posFile) ? ((readYamlRaw(posFile) as Record<string, unknown>[] | null) ?? []) : [];
  const id = positionId(found.candidate, question);
  if (positions.some((p) => p.question === question)) fail(`Une position existe déjà pour ${id} : la compléter à la main.`);

  const runFile = join(paths.extractionsDir, 'runs', `${a.run}.json`);
  const model = existsSync(runFile) ? RunSchema.parse(JSON.parse(readFileSync(runFile, 'utf8'))).model : 'inconnu';
  const at = today(opts.now);
  positions.push({
    question,
    value,
    evidence: evidence.data,
    sources: [a.source],
    quote: a.quote,
    quoteSource: a.source,
    justification: a.summary,
    status: 'draft',
    provenance: { kind: 'extraction', run: a.run, affirmation: a.id, model },
    author: opts.by,
    authoredAt: at,
  });
  writeYaml(posFile, positions);
  found.list[found.list.indexOf(a)] = { ...a, state: 'accepted', decision: { by: opts.by, at, position: id } };
  save(found.file, found.list);
  return { position: id };
}

export function rejectAffirmation(paths: DataPaths, opts: { id: string; by: string; reason: string; now?: Date }): void {
  const { corpus } = loadCorpus(paths.corpusDir);
  const found = findAffirmation(paths, opts.id);
  const a = found.affirmation;
  if (!corpus.contributors.some((c) => c.id === opts.by)) fail(`Contributeur inconnu : ${opts.by}.`);
  if (a.state === 'accepted' || a.state === 'rejected') fail(`Affirmation ${a.id} déjà ${a.state === 'accepted' ? 'acceptée' : 'rejetée'}.`);
  if (!opts.reason.trim()) usage('--reason est obligatoire.');
  found.list[found.list.indexOf(a)] = { ...a, state: 'rejected', decision: { by: opts.by, at: today(opts.now), reason: opts.reason } };
  save(found.file, found.list);
}

async function main(argv: string[]): Promise<number> {
  const [sub, ...rest] = argv;
  const { values, positionals } = parseCli(
    rest,
    {
      candidate: { type: 'string' },
      state: { type: 'string' },
      by: { type: 'string' },
      value: { type: 'string' },
      question: { type: 'string' },
      evidence: { type: 'string' },
      reason: { type: 'string' },
      corpus: { type: 'string' },
    },
    HELP,
  );
  const paths = resolvePaths({ corpus: values.corpus });
  if (sub === 'list') {
    if (!values.candidate) usage(HELP);
    const states = ['verifiable', 'unverifiable', 'accepted', 'rejected'] as const;
    const state = values.state as Affirmation['state'] | undefined;
    if (state && !states.includes(state)) usage(`État inconnu : ${state}.`);
    const list = listAffirmations(paths, values.candidate, state);
    info('id               | question | valeur | confiance | localisation | citation');
    for (const a of list) {
      const quote = a.quote.length > 80 ? `${a.quote.slice(0, 79)}…` : a.quote;
      info(`${a.id} | ${a.question ?? 'aucune'} | ${a.proposedValue} | ${a.confidence} | ${a.location ? `${a.source}@${a.location.start}` : 'introuvable'} | ${quote}`);
    }
    info(`${list.length} affirmation(s).`);
    return 0;
  }
  const id = positionals[0];
  if (!id || !values.by) usage(HELP);
  if (sub === 'accept') {
    const value = values.value !== undefined ? Number(values.value) : undefined;
    const r = acceptAffirmation(paths, { id, by: values.by, value, question: values.question, evidence: values.evidence });
    info(`Position ${r.position} créée en draft ; à relire par une autre personne (pnpm data:review).`);
    return 0;
  }
  if (sub === 'reject') {
    if (!values.reason) usage(HELP);
    rejectAffirmation(paths, { id, by: values.by, reason: values.reason });
    info(`Affirmation ${id} rejetée.`);
    return 0;
  }
  return usage(HELP);
}

if (process.argv[1] && /affirmation\.ts$/.test(process.argv[1])) void runCli(() => main(process.argv.slice(2)));
