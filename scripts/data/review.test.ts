// @vitest-environment node
import { cp, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { resolvePaths } from './lib/cli';
import { reviewPosition } from './review';
import { validate } from './validate';

async function tempFixture() {
  const dir = await mkdtemp(join(tmpdir(), 'radar-review-'));
  await cp(join(process.cwd(), 'data', 'fixtures', 'minimal'), dir, { recursive: true });
  return resolvePaths({ corpus: dir });
}

const readPositions = async (paths: Awaited<ReturnType<typeof tempFixture>>) =>
  parse(await readFile(join(paths.corpusDir, 'positions', 'dupont.yaml'), 'utf8')) as Record<string, unknown>[];

describe('data:review', () => {
  it('refuse l’auteur comme relecteur', async () => {
    const paths = await tempFixture();
    expect(() => reviewPosition(paths, { candidate: 'dupont', question: 'economie-q03', by: 'adrien' })).toThrow(/ne peut pas être l'auteur/);
  });

  it('refuse un contributeur inconnu, une position déjà relue ou absente', async () => {
    const paths = await tempFixture();
    expect(() => reviewPosition(paths, { candidate: 'dupont', question: 'economie-q03', by: 'inconnu' })).toThrow(/Contributeur inconnu/);
    expect(() => reviewPosition(paths, { candidate: 'dupont', question: 'economie-q01', by: 'relecteur-1' })).toThrow(/déjà relue/);
    expect(() => reviewPosition(paths, { candidate: 'dupont', question: 'absente', by: 'relecteur-1' })).toThrow(/introuvable/);
  });

  it('un relecteur distinct passe le brouillon en reviewed, puis une modification déclenche FR-019', async () => {
    const paths = await tempFixture();
    const r = reviewPosition(paths, { candidate: 'dupont', question: 'economie-q03', by: 'relecteur-1', date: '2026-11-10' });
    expect(r.status).toBe('reviewed');
    const entry = (await readPositions(paths)).find((p) => p.question === 'economie-q03')!;
    expect(entry).toMatchObject({ status: 'reviewed', reviewer: 'relecteur-1', reviewedAt: '2026-11-10' });
    expect(String(entry.reviewedHash)).toMatch(/^sha256:/);
    expect((await validate(paths)).violations).toEqual([]);

    const file = join(paths.corpusDir, 'positions', 'dupont.yaml');
    const raw = await readPositions(paths);
    raw.find((p) => p.question === 'economie-q03')!.value = 1;
    const { stringify } = await import('yaml');
    await writeFile(file, stringify(raw));
    expect((await validate(paths)).violations.map((v) => [v.rule, v.entity.id])).toEqual([['FR-019', 'dupont/economie-q03']]);
  });

  it('refuse une position dont la citation est introuvable', async () => {
    const paths = await tempFixture();
    const file = join(paths.corpusDir, 'positions', 'dupont.yaml');
    const raw = await readPositions(paths);
    raw.find((p) => p.question === 'economie-q03')!.quote = 'Citation absente du texte.';
    const { stringify } = await import('yaml');
    await writeFile(file, stringify(raw));
    expect(() => reviewPosition(paths, { candidate: 'dupont', question: 'economie-q03', by: 'relecteur-1' })).toThrow(/FR-017/);
  });

  it('--contest marque contestée ; un arbitrage sans --contest la passe en reviewed', async () => {
    const paths = await tempFixture();
    expect(() => reviewPosition(paths, { candidate: 'dupont', question: 'sante-q01', by: 'relecteur-1', contest: true })).toThrow(/déjà contestée/);
    const r = reviewPosition(paths, { candidate: 'dupont', question: 'sante-q01', by: 'relecteur-1' });
    expect(r.status).toBe('reviewed');
  });
});
