// @vitest-environment node
// Test d'intégration SC-001 : chaque fixture de violation est refusée avec son code de règle,
// la fixture minimale et le corpus réel sont conformes.
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { resolvePaths } from './lib/cli';
import { RULES } from './lib/rules';
import { validate } from './validate';

const VIOLATIONS = join(process.cwd(), 'data', 'fixtures', 'violations');
const fixtures = readdirSync(VIOLATIONS, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

/** Code de règle d'un dossier de fixture ; un suffixe est permis (`FR-017-quote`). */
function codeOf(dir: string): string | undefined {
  return RULES.map((r) => r.code)
    .filter((c) => dir === c || dir.startsWith(`${c}-`))
    .sort((a, b) => b.length - a.length)[0];
}

describe('data:validate (SC-001)', () => {
  it('au moins dix fixtures de violation, chacune nommée d’après une règle', () => {
    expect(fixtures.length).toBeGreaterThanOrEqual(10);
    for (const f of fixtures) expect(codeOf(f), f).toBeDefined();
  });

  it.each(fixtures)('%s est refusée avec son code', async (dir) => {
    const report = await validate(resolvePaths({ corpus: join(VIOLATIONS, dir) }));
    const code = codeOf(dir)!;
    expect(report.violations.map((v) => v.rule)).toContain(code);
    for (const v of report.violations) expect(v.entity.id.length).toBeGreaterThan(0);
  });

  it('la fixture minimale est conforme', async () => {
    const report = await validate(resolvePaths({ corpus: join(process.cwd(), 'data', 'fixtures', 'minimal') }));
    expect(report.violations).toEqual([]);
  });

  it('inconnue explicite et position contestée acceptées, traitées comme inconnues (US2 scénarios 5 et 7)', async () => {
    const report = await validate(resolvePaths({ corpus: join(process.cwd(), 'data', 'fixtures', 'minimal') }));
    const dupont = report.ctx.corpus.positions.get('dupont')!;
    expect(dupont.find((p) => p.question === 'sante-q02')).toMatchObject({ value: 'unknown', status: 'reviewed' });
    expect(dupont.find((p) => p.question === 'sante-q01')).toMatchObject({ status: 'contested' });
    expect(report.violations).toEqual([]);
    // Seules economie-q01 et economie-q02 comptent pour dupont : inconnue, contestée et brouillon exclues.
    expect(report.stats.coverageByCandidate?.find((c) => c.id === 'dupont')?.known).toBe(2);
  });

  it('le corpus du dépôt est conforme', async () => {
    const report = await validate(resolvePaths({}, {}), { noCache: true });
    expect(report.violations).toEqual([]);
  });
});
