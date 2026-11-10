// Assemble la page de relecture (seconde passe) en un seul fichier HTML publiable.
// Usage : pnpm exec tsx scripts/relecture/build.ts <export.json> <dossier corpus> <sortie.html>
//   export.json   : data/relectures/2026-11-10-seconde-passe.json (audit des 96 énoncés, schéma @2)
//   dossier corpus : data/corpus (thèmes, grille de neutralité, énoncés gardés en 1re passe)
// La logique de `logic.ts` est transpilée par le compilateur TypeScript et intégrée telle quelle.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { parse } from 'yaml';

type Theme = { id: string; label: string; order: number; axis: { negative: string; positive: string } };
type Bank = { id: string; themes: string[]; polarity: '+' | '-'; neutralityChecklist?: Record<string, boolean> };
type Assignment = { theme: string; polarity: '+' | '-' };
type Audited = {
  id: string; finalId: string; originalText: string; finalText: string; finalTextBasis: string;
  firstReviewProposal: string | null; firstReviewMotif: string | null;
  fidelity: string; pFlag: boolean; axisOutcome: string; status: string; explanation: string; axisExplanation: string;
  originalAssignment: Assignment; previousClaudeProposal: Assignment | null; proposedAssignment: Assignment | null; secondaryTheme: string | null;
  criteria: Record<string, string>; c5Evidence: { note: string; evidence: unknown[] };
};

const here = dirname(fileURLToPath(import.meta.url));
const [exportPath, corpusDir, outPath] = process.argv.slice(2);
if (!exportPath || !corpusDir || !outPath) {
  console.error('Usage : pnpm exec tsx scripts/relecture/build.ts <export.json> <dossier corpus> <sortie.html>');
  process.exit(2);
}

const themes = (parse(readFileSync(join(corpusDir, 'themes.yaml'), 'utf8')) as Theme[]).sort((a, b) => a.order - b.order);
const governance = parse(readFileSync(join(corpusDir, 'governance.yaml'), 'utf8')) as { neutralityChecklist: { id: string; text: string }[] };
const exported = JSON.parse(readFileSync(exportPath, 'utf8')) as { schema: string; questions: Audited[] };
if (exported.schema !== 'radar-2027/relecture-seconde-passe@2') throw new Error(`schéma d'export inattendu : ${exported.schema} (@2 attendu, avec les preuves C5)`);
const audited = exported.questions;
const auditedIds = new Set(audited.flatMap((q) => [q.id, q.finalId]));
const checkIds = governance.neutralityChecklist.map((c) => c.id);

// Énoncés gardés en première passe : hors des 96, grille entièrement cochée.
const base: Record<string, { plus: number; minus: number }> = {};
for (const t of themes) {
  for (const q of parse(readFileSync(join(corpusDir, 'questions', `${t.id}.yaml`), 'utf8')) as Bank[]) {
    if (auditedIds.has(q.id)) continue;
    if (!checkIds.every((c) => q.neutralityChecklist?.[c] === true)) continue;
    const b = (base[q.themes[0]!] ??= { plus: 0, minus: 0 });
    if (q.polarity === '+') b.plus += 1;
    else b.minus += 1;
  }
}
const kept = Object.values(base).reduce((s, b) => s + b.plus + b.minus, 0);
if (kept !== 188) throw new Error(`188 énoncés gardés attendus en première passe, ${kept} trouvés`);

const data = {
  themes: themes.map((t) => ({ id: t.id, label: t.label, neg: t.axis.negative, pos: t.axis.positive })),
  checks: governance.neutralityChecklist,
  base,
  // Forme `Question` de logic.ts : toutes les métadonnées d'audit, pour l'affichage et l'export.
  questions: audited.map((q) => ({
    id: q.id, finalId: q.finalId, originalText: q.originalText, finalText: q.finalText, finalTextBasis: q.finalTextBasis,
    firstReviewProposal: q.firstReviewProposal, firstReviewMotif: q.firstReviewMotif, fidelity: q.fidelity, explanation: q.explanation,
    originalAssignment: q.originalAssignment, previousClaudeProposal: q.previousClaudeProposal, proposedAssignment: q.proposedAssignment,
    secondaryTheme: q.secondaryTheme, axisOutcome: q.axisOutcome, axisExplanation: q.axisExplanation, pFlag: q.pFlag, status: q.status,
    auditCriteria: q.criteria, evidence: q.c5Evidence.evidence, c5Note: q.c5Evidence.note,
  })),
};

const logicJs = ts
  .transpileModule(readFileSync(join(here, 'logic.ts'), 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ESNext, removeComments: true } })
  .outputText.replace(/^export /gm, '')
  .replace(/^export \{\};?\s*$/gm, '');
const page = readFileSync(join(here, 'page.html'), 'utf8')
  .replace('__LOGIC__', () => logicJs)
  .replace('__DATA__', () => JSON.stringify(data).replace(/</g, '\\u003c'));
writeFileSync(outPath, page);
console.log(`Page écrite : ${outPath} (${audited.length} énoncés, ${kept} gardés en première passe, ${(page.length / 1024).toFixed(0)} Ko).`);
