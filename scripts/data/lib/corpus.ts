// Chargement du corpus YAML (data/corpus) en objet typé, et écriture YAML stable.
// Chaque élément de liste est validé séparément : une erreur n'empêche pas de charger le reste,
// et chaque erreur Zod devient une violation `SCHEMA` désignant `<fichier>:<chemin>`.
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, join, relative } from 'node:path';
import { isMap, isScalar, isSeq, parse, parseDocument, stringify, type Document, type YAMLMap } from 'yaml';
import type { z } from 'zod';
import {
  CandidateSchema,
  ContributorSchema,
  GovernanceFileSchema,
  PositionSchema,
  QuestionSchema,
  SourceSchema,
  ThemeSchema,
  type Corpus,
  type Position,
} from './schema';
import { violation, type Violation } from './rules/types';

function issuePath(path: ReadonlyArray<PropertyKey>): string {
  return path.map((p) => (typeof p === 'number' ? `[${p}]` : `.${String(p)}`)).join('');
}

/** Lit un fichier YAML brut ; `undefined` si absent, violation si illisible. */
export function readYamlRaw(file: string): unknown {
  return parse(readFileSync(file, 'utf8'));
}

function readYaml(file: string, label: string, violations: Violation[]): unknown {
  try {
    return readYamlRaw(file) ?? null;
  } catch (error) {
    violations.push(violation('SCHEMA', 'file', label, `YAML illisible : ${error instanceof Error ? error.message.split('\n')[0] : String(error)}`));
    return undefined;
  }
}

function pushIssues(error: z.ZodError, label: string, prefix: string, violations: Violation[]): void {
  for (const issue of error.issues) {
    violations.push(violation('SCHEMA', 'file', `${label}:${prefix}${issuePath(issue.path)}`, issue.message));
  }
}

function loadList<T>(file: string, label: string, schema: z.ZodType<T>, violations: Violation[], onInvalid?: (raw: unknown, error: z.ZodError) => T | null): T[] {
  const raw = readYaml(file, label, violations);
  if (raw === undefined || raw === null) return [];
  if (!Array.isArray(raw)) {
    violations.push(violation('SCHEMA', 'file', label, 'liste YAML attendue'));
    return [];
  }
  const items: T[] = [];
  raw.forEach((item, i) => {
    const parsed = schema.safeParse(item);
    if (parsed.success) {
      items.push(parsed.data);
      return;
    }
    pushIssues(parsed.error, label, `[${i}]`, violations);
    const kept = onInvalid?.(item, parsed.error);
    if (kept) items.push(kept);
  });
  return items;
}

/**
 * Une position dont seule la valeur est hors échelle est conservée avec sa valeur brute,
 * pour que la règle `SCALE` la désigne (défense en profondeur, T054).
 */
function keepOutOfScalePosition(raw: unknown, error: z.ZodError): Position | null {
  if (!raw || typeof raw !== 'object') return null;
  const onlyValue = error.issues.every((i) => i.path[0] === 'value');
  const value = (raw as { value?: unknown }).value;
  if (!onlyValue || typeof value !== 'number') return null;
  const parsed = PositionSchema.safeParse({ ...raw, value: 0 });
  if (!parsed.success) return null;
  return { ...parsed.data, value: value as Position['value'] };
}

function yamlFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith('.yaml'))
    .sort();
}

export type LoadedCorpus = { corpus: Corpus; violations: Violation[] };

export function loadCorpus(corpusDir: string): LoadedCorpus {
  const violations: Violation[] = [];
  const label = (file: string) => relative(corpusDir, file) || basename(file);

  const required = (name: string) => {
    const file = join(corpusDir, name);
    if (!existsSync(file)) violations.push(violation('SCHEMA', 'file', name, 'fichier absent'));
    return file;
  };

  const themesFile = required('themes.yaml');
  const contributorsFile = required('contributors.yaml');
  const candidatesFile = required('candidates.yaml');
  const governanceFile = required('governance.yaml');

  const themes = existsSync(themesFile) ? loadList(themesFile, 'themes.yaml', ThemeSchema, violations) : [];
  const contributors = existsSync(contributorsFile) ? loadList(contributorsFile, 'contributors.yaml', ContributorSchema, violations) : [];
  const candidates = existsSync(candidatesFile) ? loadList(candidatesFile, 'candidates.yaml', CandidateSchema, violations) : [];

  let governance: Corpus['governance'] = null;
  if (existsSync(governanceFile)) {
    const raw = readYaml(governanceFile, 'governance.yaml', violations);
    if (raw !== undefined) {
      const parsed = GovernanceFileSchema.safeParse(raw);
      if (parsed.success) governance = parsed.data;
      else pushIssues(parsed.error, 'governance.yaml', '', violations);
    }
  }

  const group = <T>(sub: string, schema: z.ZodType<T>, onInvalid?: (raw: unknown, e: z.ZodError) => T | null) => {
    const map = new Map<string, T[]>();
    const dir = join(corpusDir, sub);
    for (const f of yamlFiles(dir)) {
      const file = join(dir, f);
      map.set(f.replace(/\.yaml$/, ''), loadList(file, label(file), schema, violations, onInvalid));
    }
    return map;
  };

  const corpus: Corpus = {
    themes,
    contributors,
    candidates,
    governance,
    questions: group('questions', QuestionSchema),
    sources: group('sources', SourceSchema),
    positions: group('positions', PositionSchema, keepOutOfScalePosition),
  };
  return { corpus, violations };
}

/** Écrit un YAML stable pour des diffs lisibles : ordre des clés conservé, 2 espaces, pas de repli. */
export function writeYaml(file: string, value: unknown): void {
  writeFileSync(file, stringify(value, { indent: 2, lineWidth: 0, aliasDuplicateObjects: false }), 'utf8');
}

/**
 * Modifie sur place les éléments (mappings) d'un fichier YAML liste en conservant commentaires,
 * guillemets, lignes vides et fin de fichier : seules les clés touchées par `edit` changent dans le texte.
 * `edit` renvoie `true` s'il a modifié l'élément ; le fichier n'est réécrit que dans ce cas.
 */
export function editYamlListItems(file: string, edit: (item: YAMLMap<unknown, unknown>) => boolean): boolean {
  const text = readFileSync(file, 'utf8');
  const doc: Document = parseDocument(text);
  if (doc.errors.length > 0) throw doc.errors[0];
  if (!isSeq(doc.contents)) throw new Error(`${file} : liste YAML attendue.`);
  let changed = false;
  for (const item of doc.contents.items) if (isMap(item) && edit(item)) changed = true;
  if (changed) {
    const tail = /\s*$/.exec(text)?.[0] ?? '';
    writeFileSync(file, doc.toString({ lineWidth: 0 }).replace(/\s*$/, '') + tail, 'utf8');
  }
  return changed;
}

/**
 * Affecte des clés scalaires d'un élément YAML : valeur remplacée en place si la clé existe
 * (commentaire de ligne conservé), clé ajoutée en fin d'élément sinon (comme `Object.assign`).
 */
export function setYamlKeys(item: YAMLMap<unknown, unknown>, values: Record<string, string | number | boolean>): void {
  for (const [key, value] of Object.entries(values)) {
    const node = item.get(key, true);
    if (isScalar(node)) node.value = value;
    else item.set(key, value);
  }
}

/** Toutes les questions du corpus, tous fichiers confondus, avec leur fichier. */
export function allQuestions(corpus: Corpus) {
  return [...corpus.questions].flatMap(([file, qs]) => qs.map((q) => ({ file, question: q })));
}

export function allSources(corpus: Corpus) {
  return [...corpus.sources].flatMap(([file, ss]) => ss.map((s) => ({ file, source: s })));
}

export function allPositions(corpus: Corpus) {
  return [...corpus.positions].flatMap(([candidate, ps]) => ps.map((p) => ({ candidate, position: p })));
}

/** Identifiant de position désigné par les règles : `<candidat>/<question>`. */
export function positionId(candidate: string, question: string): string {
  return `${candidate}/${question}`;
}
