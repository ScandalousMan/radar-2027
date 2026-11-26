// @vitest-environment node
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { readGlossaryAtBuild } from './load.server';

const dir = mkdtempSync(join(tmpdir(), 'glossaire-'));

describe('readGlossaryAtBuild', () => {
  it('fichier absent → null', () => {
    expect(readGlossaryAtBuild(join(dir, 'absent.json'))).toBeNull();
  });

  it('fichier illisible ou invalide → null', () => {
    const broken = join(dir, 'broken.json');
    writeFileSync(broken, '{ pas du json');
    expect(readGlossaryAtBuild(broken)).toBeNull();
    const invalid = join(dir, 'invalid.json');
    writeFileSync(invalid, JSON.stringify({ updatedAt: '2026-11-22', terms: [{ id: 'x' }] }));
    expect(readGlossaryAtBuild(invalid)).toBeNull();
  });

  it('fichier valide → glossaire', () => {
    const file = join(dir, 'ok.json');
    const glossary = { updatedAt: '2026-11-22', terms: [] };
    writeFileSync(file, JSON.stringify(glossary));
    expect(readGlossaryAtBuild(file)).toEqual(glossary);
  });
});
