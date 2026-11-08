// pnpm data:source fetch|check (contracts/cli.md, FR-013, FR-014, cas limite « source inaccessible »).
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { readCached, writeCached } from './lib/cache';
import { fail, info, parseCli, resolvePaths, runCli, today, usage, warn, type DataPaths } from './lib/cli';
import { allSources, loadCorpus, readYamlRaw, writeYaml } from './lib/corpus';
import { textFromBuffer } from './lib/extract-text';
import { EvidenceKindSchema, ID_PATTERN, type EvidenceKind } from './lib/schema';
import { normalize, sha256 } from './lib/text';

const HELP = `Usage :
  pnpm data:source fetch <url> --candidate <id> [--candidate <id> …] --kind <programme|livre_plateforme|declaration_vote>
                         --title <titre> --published <YYYY|YYYY-MM|YYYY-MM-DD> [--from-file <fichier.txt>] [--id <id>] [--corpus <dir>]
  pnpm data:source check [--online] [--corpus <dir>]`;

export type FetchLike = (url: string, init?: { method?: string; signal?: AbortSignal; redirect?: 'follow' }) => Promise<{
  ok: boolean;
  status: number;
  headers: { get(name: string): string | null };
  arrayBuffer(): Promise<ArrayBuffer>;
}>;

export type AddSourceOptions = {
  url: string;
  candidates: string[];
  kind: EvidenceKind;
  title: string;
  published: string;
  fromFile?: string;
  id?: string;
  now?: Date;
};

/** Précision déduite du format de la date de publication. */
export function precisionOf(published: string): 'day' | 'month' | 'year' {
  if (/^\d{4}-\d{2}-\d{2}$/.test(published)) return 'day';
  if (/^\d{4}-\d{2}$/.test(published)) return 'month';
  if (/^\d{4}$/.test(published)) return 'year';
  return usage(`Date de publication invalide « ${published} » : YYYY, YYYY-MM ou YYYY-MM-DD attendu.`);
}

/** `Programme présidentiel 2027` → `programme-presidentiel-2027`. */
export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Mn}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
    .replace(/-+$/, '');
}

function readList(file: string): Record<string, unknown>[] {
  if (!existsSync(file)) return [];
  const raw = readYamlRaw(file);
  return Array.isArray(raw) ? (raw as Record<string, unknown>[]) : [];
}

/** Télécharge (ou lit) une source, écrit le texte normalisé en cache et ajoute l'entrée YAML. */
export async function addSource(paths: DataPaths, opts: AddSourceOptions, fetchImpl: FetchLike = fetch as unknown as FetchLike) {
  if (opts.candidates.length === 0) usage(`--candidate est obligatoire.\n\n${HELP}`);
  const { corpus } = loadCorpus(paths.corpusDir);
  const existing = allSources(corpus);
  const sameUrl = existing.find(({ source }) => source.url === opts.url);
  if (sameUrl) fail(`Source déjà enregistrée pour cette adresse : ${sameUrl.source.id} (sources/${sameUrl.file}.yaml).`);
  const known = new Set(corpus.candidates.map((c) => c.id));
  for (const c of opts.candidates) if (!known.has(c)) warn(`Avertissement : candidat « ${c} » absent de candidates.yaml (à ajouter avant validation).`);

  let text: string;
  if (opts.fromFile) {
    text = readFileSync(opts.fromFile, 'utf8');
  } else {
    const response = await fetchImpl(opts.url, { signal: AbortSignal.timeout(30_000), redirect: 'follow' });
    if (!response.ok) fail(`Téléchargement impossible (${response.status}) : utiliser --from-file avec le texte copié à la main.`);
    const bytes = new Uint8Array(await response.arrayBuffer());
    text = await textFromBuffer(bytes, response.headers.get('content-type'), opts.url);
  }
  const normalized = normalize(text);
  if (normalized.length < 20) fail('Texte extrait vide ou inexploitable : fournir le texte avec --from-file.');
  const contentHash = writeCached(paths.cacheDir, normalized);

  const ids = new Set(existing.map(({ source }) => source.id));
  let id = opts.id ?? `${opts.candidates[0]}-${slugify(opts.title)}`;
  if (!ID_PATTERN.test(id)) usage(`Identifiant invalide « ${id} » : kebab-case ASCII attendu.`);
  if (opts.id && ids.has(id)) fail(`Identifiant de source déjà utilisé : ${id}.`);
  for (let n = 2; ids.has(id); n++) id = `${opts.candidates[0]}-${slugify(opts.title)}-${n}`;

  const fileName = opts.candidates.length === 1 ? `${opts.candidates[0]}.yaml` : 'commun.yaml';
  const file = join(paths.corpusDir, 'sources', fileName);
  const list = readList(file);
  const entry = {
    id,
    url: opts.url,
    title: opts.title,
    kind: opts.kind,
    publishedAt: { date: opts.published, precision: precisionOf(opts.published) },
    accessedAt: today(opts.now),
    candidates: opts.candidates,
    contentHash,
  };
  list.push(entry);
  writeYaml(file, list);
  return { id, file, contentHash, characters: normalized.length };
}

export type CheckResult = {
  mismatches: { id: string; expected: string; actual: string }[];
  missing: string[];
  unreachable: string[];
  recovered: string[];
};

/** Recalcule les empreintes du cache et, en ligne, teste les adresses (pose `unreachableSince`). */
export async function checkSources(
  paths: DataPaths,
  opts: { online?: boolean; now?: Date } = {},
  fetchImpl: FetchLike = fetch as unknown as FetchLike,
): Promise<CheckResult> {
  const { corpus } = loadCorpus(paths.corpusDir);
  const result: CheckResult = { mismatches: [], missing: [], unreachable: [], recovered: [] };
  for (const { source } of allSources(corpus)) {
    if (!source.contentHash) continue;
    const text = readCached(paths.cacheDir, source.contentHash);
    if (text === null) result.missing.push(source.id);
    else if (sha256(text) !== source.contentHash) result.mismatches.push({ id: source.id, expected: source.contentHash, actual: sha256(text) });
  }
  if (!opts.online) return result;

  const dir = join(paths.corpusDir, 'sources');
  for (const [name] of corpus.sources) {
    const file = join(dir, `${name}.yaml`);
    const list = readList(file);
    let changed = false;
    for (const entry of list) {
      const url = String(entry.url ?? '');
      let ok = false;
      try {
        let res = await fetchImpl(url, { method: 'HEAD', signal: AbortSignal.timeout(15_000), redirect: 'follow' });
        if (!res.ok && (res.status === 405 || res.status === 403)) res = await fetchImpl(url, { signal: AbortSignal.timeout(15_000), redirect: 'follow' });
        ok = res.ok;
      } catch {
        ok = false;
      }
      if (!ok) {
        result.unreachable.push(String(entry.id));
        if (!entry.unreachableSince) {
          entry.unreachableSince = today(opts.now);
          changed = true;
        }
      } else if (entry.unreachableSince) {
        result.recovered.push(String(entry.id));
      }
    }
    if (changed) writeYaml(file, list);
  }
  return result;
}

async function main(argv: string[]): Promise<number> {
  const [sub, ...rest] = argv;
  if (sub === 'fetch') {
    const { values, positionals } = parseCli(
      rest,
      {
        candidate: { type: 'string', multiple: true },
        kind: { type: 'string' },
        title: { type: 'string' },
        published: { type: 'string' },
        'from-file': { type: 'string' },
        id: { type: 'string' },
        corpus: { type: 'string' },
      },
      HELP,
    );
    const url = positionals[0];
    if (!url || !values.kind || !values.title || !values.published) usage(HELP);
    if (!URL.canParse(url)) usage(`Adresse invalide : ${url}`);
    const kind = EvidenceKindSchema.safeParse(values.kind);
    if (!kind.success) usage(`Type de source inconnu « ${values.kind} ».\n\n${HELP}`);
    const added = await addSource(resolvePaths({ corpus: values.corpus }), {
      url,
      candidates: values.candidate ?? [],
      kind: kind.data,
      title: values.title,
      published: values.published,
      fromFile: values['from-file'],
      id: values.id,
    });
    info(`Source « ${added.id} » ajoutée à ${added.file} (${added.characters} caractères, ${added.contentHash}).`);
    return 0;
  }
  if (sub === 'check') {
    const { values } = parseCli(rest, { online: { type: 'boolean' }, corpus: { type: 'string' } }, HELP);
    const r = await checkSources(resolvePaths({ corpus: values.corpus }), { online: values.online });
    for (const m of r.mismatches) warn(`Empreinte différente pour ${m.id} : attendu ${m.expected}, cache ${m.actual}.`);
    for (const id of r.missing) warn(`Texte absent du cache : ${id}.`);
    for (const id of r.unreachable) warn(`Adresse inaccessible : ${id} (unreachableSince posé si absent).`);
    for (const id of r.recovered) info(`Adresse de nouveau accessible : ${id} (unreachableSince conservé, à retirer à la main).`);
    info(`${r.mismatches.length} empreinte(s) différente(s), ${r.missing.length} texte(s) absent(s)${values.online ? `, ${r.unreachable.length} adresse(s) inaccessible(s)` : ''}.`);
    return r.mismatches.length > 0 ? 1 : 0;
  }
  return usage(HELP);
}

if (process.argv[1] && /source\.ts$/.test(process.argv[1])) void runCli(() => main(process.argv.slice(2)));
