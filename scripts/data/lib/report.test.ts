// @vitest-environment node
import { existsSync } from 'node:fs';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { renderMarkdown, writeReport, type Report } from './report';
import { violation } from './rules/types';

describe('rapport de validation', () => {
  it('rend un rapport vide', () => {
    const md = renderMarkdown({ violations: [], warnings: [], stats: {} });
    expect(md).toContain('conforme');
    expect(md).not.toContain('Thèmes et polarités');
  });

  it('désigne l’identifiant de chaque violation', async () => {
    const report: Report = {
      violations: [
        violation('FR-010', 'question', 'economie-smic-hausse', 'énoncé actif auto-relu'),
        violation('FR-013', 'source', 'dupont-programme-2027', 'url dupliquée'),
      ],
      warnings: [],
      stats: {},
    };
    const md = renderMarkdown(report);
    const lines = md.split('\n').filter((l) => l.startsWith('| FR-'));
    expect(lines).toHaveLength(2);
    expect(lines[0]).toContain('economie-smic-hausse');
    expect(lines[1]).toContain('dupont-programme-2027');
    const dir = await mkdtemp(join(tmpdir(), 'radar-report-'));
    const files = writeReport(dir, report);
    expect(existsSync(files.markdown) && existsSync(files.json)).toBe(true);
  });
});
