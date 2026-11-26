// @vitest-environment node
import { cp, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { GlossarySchema } from '@/core/dataset';
import { resolvePaths } from './lib/cli';
import { publishGlossary } from './glossary';
import { validate } from './validate';

async function tempFixture() {
  const dir = await mkdtemp(join(tmpdir(), 'radar-glossary-'));
  await cp(join(process.cwd(), 'data', 'fixtures', 'minimal'), dir, { recursive: true });
  return resolvePaths({ corpus: dir });
}

describe('data:glossary', () => {
  it('écrit glossary.json (termes relus, triés, compact), puis --check vert et GLOSS conforme', async () => {
    const paths = await tempFixture();
    const file = join(paths.publishedDir, 'glossary.json');
    expect(publishGlossary(paths, { check: true }).kind).toBe('out-of-sync');
    expect(existsSync(file)).toBe(false);

    expect(publishGlossary(paths, { date: '2026-11-22' })).toMatchObject({ kind: 'written', terms: 2 });
    const text = await readFile(file, 'utf8');
    expect(text.endsWith('}\n')).toBe(true);
    expect(text).not.toContain('\n  ');
    const g = GlossarySchema.parse(JSON.parse(text));
    expect(g.updatedAt).toBe('2026-11-22');
    expect(g.terms.map((t) => t.id)).toEqual(['theme-economie', 'theme-sante']);
    expect(Buffer.byteLength(text)).toBeLessThanOrEqual(30_720);

    expect(publishGlossary(paths, { check: true }).kind).toBe('in-sync');
    expect((await validate(paths)).violations).toEqual([]);

    // Contenu inchangé : la date n'est pas réécrite.
    expect(publishGlossary(paths, { date: '2026-12-01' }).kind).toBe('unchanged');
    expect(GlossarySchema.parse(JSON.parse(await readFile(file, 'utf8'))).updatedAt).toBe('2026-11-22');
  });

  it('--check échoue si le corpus a changé ; GLOSS le signale aussi', async () => {
    const paths = await tempFixture();
    publishGlossary(paths, { date: '2026-11-22' });
    const yaml = join(paths.corpusDir, 'glossaire.yaml');
    await writeFile(yaml, (await readFile(yaml, 'utf8')).replace('présent dans les énoncés du thème Santé', 'définition corrigée'));
    expect(publishGlossary(paths, { check: true }).kind).toBe('out-of-sync');
    expect((await validate(paths)).violations.map((v) => v.rule)).toContain('GLOSS');
  });

  it('refuse un glossaire non conforme sans rien écrire', async () => {
    const paths = await tempFixture();
    const yaml = join(paths.corpusDir, 'glossaire.yaml');
    await writeFile(yaml, (await readFile(yaml, 'utf8')).replace('reviewedBy: relecteur-1', 'reviewedBy: adrien'));
    expect(() => publishGlossary(paths, { date: '2026-11-22' })).toThrow(/relu par son auteur/);
    expect(existsSync(join(paths.publishedDir, 'glossary.json'))).toBe(false);
  });
});
