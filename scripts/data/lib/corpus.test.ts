// @vitest-environment node
import { cp, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { allPositions, allQuestions, loadCorpus, writeYaml } from './corpus';

const MINIMAL = join(process.cwd(), 'data', 'fixtures', 'minimal', 'corpus');

async function copyMinimal() {
  const dir = await mkdtemp(join(tmpdir(), 'radar-corpus-'));
  await cp(MINIMAL, dir, { recursive: true });
  return dir;
}

describe('loadCorpus', () => {
  it('charge la fixture minimale sans violation', () => {
    const { corpus, violations } = loadCorpus(MINIMAL);
    expect(violations).toEqual([]);
    expect(corpus.themes).toHaveLength(3);
    expect(corpus.candidates.map((c) => c.id)).toEqual(['dupont', 'martin']);
    expect(allQuestions(corpus)).toHaveLength(30);
    expect(allPositions(corpus).length).toBeGreaterThanOrEqual(5);
    expect(corpus.governance?.thresholds.minQuestionsPerTheme).toBe(10);
  });

  it('transforme une erreur de forme en violation SCHEMA sans bloquer le reste', async () => {
    const dir = await copyMinimal();
    await writeFile(join(dir, 'themes.yaml'), (await readFile(join(dir, 'themes.yaml'), 'utf8')).replace('order: 1', 'order: un'));
    const { corpus, violations } = loadCorpus(dir);
    expect(violations).toHaveLength(1);
    expect(violations[0]).toMatchObject({ rule: 'SCHEMA', entity: { id: 'themes.yaml:[1].order' } });
    expect(corpus.themes).toHaveLength(2);
  });

  it('signale un YAML illisible et un fichier absent', async () => {
    const dir = await copyMinimal();
    await writeFile(join(dir, 'contributors.yaml'), '- id: [non fermé');
    await writeFile(join(dir, 'candidates.yaml'), '');
    const { violations } = loadCorpus(dir);
    expect(violations.some((v) => v.entity.id === 'contributors.yaml' && v.message.startsWith('YAML illisible'))).toBe(true);
    const empty = loadCorpus(join(dir, 'absent'));
    expect(empty.violations.map((v) => v.entity.id)).toEqual(['themes.yaml', 'contributors.yaml', 'candidates.yaml', 'governance.yaml']);
  });

  it('conserve une position hors échelle pour la règle SCALE', async () => {
    const dir = await copyMinimal();
    const file = join(dir, 'positions', 'martin.yaml');
    await writeFile(file, (await readFile(file, 'utf8')).replace('value: 2', 'value: 3'));
    const { corpus, violations } = loadCorpus(dir);
    expect(violations.map((v) => v.rule)).toEqual(['SCHEMA']);
    expect(corpus.positions.get('martin')?.[0]?.value).toBe(3);
  });

  it('writeYaml écrit un YAML stable relu à l’identique', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'radar-yaml-'));
    const value = [{ id: 'a', polarity: '+', other: '-', date: '2026', day: '2026-11-08', nested: { b: 1 } }];
    writeYaml(join(dir, 'x.yaml'), value);
    const text = await readFile(join(dir, 'x.yaml'), 'utf8');
    expect(parse(text)).toEqual(value);
    expect(text.startsWith('- id: a\n  polarity:')).toBe(true);
  });
});
