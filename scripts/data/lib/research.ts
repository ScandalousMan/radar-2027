// Chargement du corpus de preuves `data/recherche/` (spec 008, contracts/validation-rules.md).
// Même principe que `corpus.ts` : chaque élément est validé séparément, et chaque erreur Zod
// devient une violation `SCHEMA` désignant `recherche/<fichier>:<chemin>`. Un fichier absent
// vaut une liste vide. Le chargement ne modifie jamais aucun fichier.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { z } from 'zod';
import { loadList, pushIssues, readYaml } from './corpus';
import { EvidenceSchema, JournalSchema, PersonalitySchema, SignalSchema, type Evidence, type Journal, type Research } from './schema';
import type { Violation } from './rules/types';

const PREFIX = 'recherche';

function filesWith(dir: string, extension: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(extension))
    .sort();
}

/** Titres de niveau 2 (`## …`) d'un compte rendu Markdown, dans l'ordre. */
export function level2Headings(markdown: string): string[] {
  return markdown
    .split(/\r?\n/)
    .filter((line) => /^## /.test(line))
    .map((line) => line.slice(3).trim());
}

export type LoadedResearch = { research: Research; violations: Violation[] };

export function loadResearch(researchDir: string): LoadedResearch {
  const violations: Violation[] = [];
  const list = <T>(name: string, schema: z.ZodType<T>) => {
    const file = join(researchDir, name);
    return existsSync(file) ? loadList(file, `${PREFIX}/${name}`, schema, violations) : [];
  };

  const personalities = list('personnalites.yaml', PersonalitySchema);
  const signals = list('signalements.yaml', SignalSchema);

  const evidence = new Map<string, Evidence[]>();
  const evidenceDir = join(researchDir, 'preuves');
  for (const f of filesWith(evidenceDir, '.yaml')) {
    evidence.set(f.replace(/\.yaml$/, ''), loadList(join(evidenceDir, f), `${PREFIX}/preuves/${f}`, EvidenceSchema, violations));
  }

  const journals = new Map<string, Journal>();
  const reports = new Map<string, string[]>();
  const journalDir = join(researchDir, 'journaux');
  for (const f of filesWith(journalDir, '.yaml')) {
    const label = `${PREFIX}/journaux/${f}`;
    const raw = readYaml(join(journalDir, f), label, violations);
    if (raw === undefined || raw === null) continue;
    const parsed = JournalSchema.safeParse(raw);
    if (parsed.success) journals.set(f.replace(/\.yaml$/, ''), parsed.data);
    else pushIssues(parsed.error, label, '', violations);
  }
  for (const f of filesWith(journalDir, '.md')) {
    reports.set(f.replace(/\.md$/, ''), level2Headings(readFileSync(join(journalDir, f), 'utf8')));
  }

  return { research: { personalities, evidence, journals, reports, signals }, violations };
}

/** Toutes les preuves, tous fichiers confondus, avec leur fichier (nom sans extension). */
export function allEvidence(research: Research) {
  return [...research.evidence].flatMap(([file, list]) => list.map((evidence) => ({ file, evidence })));
}

/** Index des preuves par identifiant (la première l'emporte en cas de doublon, signalé par RECH-ID). */
export function evidenceIndex(research: Research): Map<string, Evidence> {
  const index = new Map<string, Evidence>();
  for (const { evidence } of allEvidence(research)) if (!index.has(evidence.id)) index.set(evidence.id, evidence);
  return index;
}

/** Nom comparé sans accents, casse ni espaces superflues (repérage des homonymes et des porte-parole). */
export function comparableName(name: string): string {
  return name.normalize('NFD').replace(/\p{Mn}/gu, '').toLowerCase().replace(/\s+/g, ' ').trim();
}

/**
 * Compare deux dates de précisions éventuellement différentes au préfixe commun (comme FR-013) :
 * négatif si `a` est strictement antérieure à `b`, 0 si elles sont indiscernables, positif sinon.
 */
export function compareDates(a: string, b: string): number {
  const n = Math.min(a.length, b.length);
  const pa = a.slice(0, n);
  const pb = b.slice(0, n);
  return pa < pb ? -1 : pa > pb ? 1 : 0;
}

/** Dernier jour possible d'une date de précision jour, mois ou année (`2026-09` → `2026-09-31`). */
export function latestDay(date: string): string {
  if (date.length === 4) return `${date}-12-31`;
  if (date.length === 7) return `${date}-31`;
  return date;
}

/** Vrai si `later` tombe plus de 12 mois après la date (au plus tard) `earlier`. */
export function moreThanTwelveMonths(earlier: string, later: string): boolean {
  const end = latestDay(earlier);
  const anniversary = `${String(Number(end.slice(0, 4)) + 1).padStart(4, '0')}${end.slice(4)}`;
  return later > anniversary;
}
