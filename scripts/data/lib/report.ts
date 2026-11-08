// Rapport de validation (data-model.md § 13) : Markdown lisible sans ouvrir les fichiers (SC-010)
// et JSON pour les outils. Les sections de statistiques ne sont rendues que si elles sont fournies.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Violation, Warning } from './rules/types';

export type ThemeStat = {
  id: string;
  order: number;
  status: 'active' | 'retired';
  active: number;
  plus: number;
  minus: number;
  plusShare: number;
  minusShare: number;
  draft: number;
  retired: number;
};

export type Distribution = { min: number; median: number; max: number; deciles: number[] };

export type Stats = {
  themes?: ThemeStat[];
  bank?: { active: number; draft: number; retired: number; targetMin: number; targetMax: number };
  positions?: { byStatus: Record<string, number>; byEvidence: Record<string, number>; unknown: number };
  coverageByCandidate?: { id: string; known: number; active: number; coverage: number }[];
  coverageByTheme?: { id: string; known: number; cells: number; coverage: number }[];
  discriminant?: Distribution & { questions: number };
  unreachableSources?: { id: string; since: string }[];
  publishedSizes?: { version: number; files: { path: string; bytes: number; budget: number }[] };
  durationMs?: number;
};

export type Report = { violations: Violation[]; warnings: Warning[]; stats: Stats };

const pct = (n: number) => `${Math.round(n * 100)} %`;
const cell = (s: string) => s.replace(/\|/g, '\\|').replace(/\n/g, ' ');

export function renderMarkdown(report: Report): string {
  const out: string[] = ['# Rapport de validation du corpus', ''];
  const { violations, warnings, stats } = report;
  out.push(
    violations.length === 0 ? '**Résultat : conforme** (0 violation).' : `**Résultat : non conforme** (${violations.length} violation${violations.length > 1 ? 's' : ''}).`,
    '',
    `Avertissements : ${warnings.length}.`,
    '',
  );

  const table = (title: string, rows: Violation[]) => {
    out.push(`## ${title}`, '');
    if (rows.length === 0) {
      out.push('Aucun.', '');
      return;
    }
    out.push('| Règle | Élément | Message |', '|---|---|---|');
    const sorted = [...rows].sort((a, b) => a.rule.localeCompare(b.rule) || a.entity.id.localeCompare(b.entity.id));
    for (const v of sorted) out.push(`| ${v.rule} | \`${cell(v.entity.id)}\` (${v.entity.kind}) | ${cell(v.message)} |`);
    out.push('');
  };
  table('Violations', violations);
  table('Avertissements', warnings);

  if (stats.themes) {
    out.push('## Thèmes et polarités', '', '| Ordre | Thème | Statut | Actives | + | − | Parts | Brouillons | Retirées |', '|---|---|---|---|---|---|---|---|---|');
    for (const t of stats.themes)
      out.push(`| ${t.order} | ${t.id} | ${t.status} | ${t.active} | ${t.plus} | ${t.minus} | ${pct(t.plusShare)} / ${pct(t.minusShare)} | ${t.draft} | ${t.retired} |`);
    out.push('');
  }
  if (stats.bank) {
    const b = stats.bank;
    out.push('## Banque de questions', '', `${b.active} actives (cible ${b.targetMin}–${b.targetMax}), ${b.draft} brouillons, ${b.retired} retirées.`, '');
  }
  if (stats.positions) {
    const p = stats.positions;
    out.push('## Positions', '');
    out.push(`Par statut : ${Object.entries(p.byStatus).map(([k, v]) => `${k} ${v}`).join(', ') || 'aucune'}.`);
    out.push(`Par niveau (connues) : ${Object.entries(p.byEvidence).map(([k, v]) => `${k} ${v}`).join(', ') || 'aucune'}.`);
    out.push(`Inconnues explicites : ${p.unknown}.`, '');
  }
  if (stats.coverageByCandidate) {
    out.push('## Couverture par candidat', '', '| Candidat | Connues | Actives | Couverture |', '|---|---|---|---|');
    for (const c of stats.coverageByCandidate) out.push(`| ${c.id} | ${c.known} | ${c.active} | ${pct(c.coverage)} |`);
    out.push('');
  }
  if (stats.coverageByTheme) {
    out.push('## Couverture par thème', '', '| Thème | Connues | Cases | Couverture |', '|---|---|---|---|');
    for (const t of stats.coverageByTheme) out.push(`| ${t.id} | ${t.known} | ${t.cells} | ${pct(t.coverage)} |`);
    out.push('');
  }
  if (stats.discriminant) {
    const d = stats.discriminant;
    out.push(
      '## Pouvoir discriminant',
      '',
      `${d.questions} questions actives : min ${d.min.toFixed(3)}, médiane ${d.median.toFixed(3)}, max ${d.max.toFixed(3)}.`,
      `Déciles : ${d.deciles.map((x) => x.toFixed(3)).join(' · ')}.`,
      '',
    );
  }
  if (stats.unreachableSources && stats.unreachableSources.length > 0) {
    out.push('## Sources inaccessibles', '');
    for (const s of stats.unreachableSources) out.push(`- \`${s.id}\` depuis le ${s.since}`);
    out.push('');
  }
  if (stats.publishedSizes) {
    const s = stats.publishedSizes;
    out.push(`## Tailles des fichiers publiés (version ${s.version})`, '', '| Fichier | Octets | Budget |', '|---|---|---|');
    for (const f of s.files) out.push(`| ${f.path} | ${f.bytes} | ${f.budget} |`);
    out.push('');
  }
  if (stats.durationMs !== undefined) out.push(`Durée : ${(stats.durationMs / 1000).toFixed(2)} s.`, '');
  return out.join('\n');
}

/** Écrit `validation.md` et `validation.json` dans `dir`. */
export function writeReport(dir: string, report: Report): { markdown: string; json: string } {
  mkdirSync(dir, { recursive: true });
  const markdown = join(dir, 'validation.md');
  const json = join(dir, 'validation.json');
  writeFileSync(markdown, renderMarkdown(report), 'utf8');
  writeFileSync(json, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  return { markdown, json };
}
