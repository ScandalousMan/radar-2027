// @vitest-environment node
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ESLint } from 'eslint';
import { describe, expect, it, vi } from 'vitest';

// Le premier appel à ESLint charge toute la configuration (plusieurs secondes sous charge).
vi.setConfig({ testTimeout: 30_000 });

const root = join(__dirname, '..', '..');

async function lintVirtualFile(relativePath: string, code: string) {
  const eslint = new ESLint({ cwd: root });
  const [result] = await eslint.lintText(code, { filePath: join(root, relativePath) });
  return result?.messages ?? [];
}

describe('frontière src/core (FR-018, principe III)', () => {
  it('un import de react sous src/core est rejeté par no-restricted-imports', async () => {
    const messages = await lintVirtualFile('src/core/exemple.ts', "import React from 'react';\nexport const x = React;\n");
    const restricted = messages.filter((m) => m.ruleId === 'no-restricted-imports');
    expect(restricted.length).toBeGreaterThan(0);
    expect(restricted[0]?.severity).toBe(2);
    expect(restricted[0]?.line).toBe(1);
  });

  it.each([
    "import { useState } from 'react';",
    "import { createRoot } from 'react-dom/client';",
    "import Link from 'next/link';",
    "import { Button } from '@/ui/Button';",
    "import Page from '@/app/page';",
  ])('rejette « %s »', async (statement) => {
    const messages = await lintVirtualFile('src/core/exemple.ts', `${statement}\nexport const x = 1;\n`);
    expect(messages.some((m) => m.ruleId === 'no-restricted-imports')).toBe(true);
  });

  it('un module pur sous src/core passe le lint', async () => {
    const messages = await lintVirtualFile('src/core/score.ts', 'export function clamp(n: number): number {\n  return Math.min(1, Math.max(0, n));\n}\n');
    expect(messages.filter((m) => m.severity === 2)).toEqual([]);
  });

  it('le même import est accepté hors de src/core', async () => {
    const messages = await lintVirtualFile('src/lib/exemple.ts', "import { useState } from 'react';\nexport const x = useState;\n");
    expect(messages.some((m) => m.ruleId === 'no-restricted-imports')).toBe(false);
  });
});

// Fonctionnalité 004 : le parcours dépend du cœur, jamais l'inverse ; l'état du parcours ne
// dépend ni du routeur Next ni des composants (lecture des sources par node:fs).
describe('frontières du parcours questionnaire (004)', () => {
  const sourcesUnder = (dir: string): Array<[string, string]> =>
    readdirSync(join(root, dir), { recursive: true, withFileTypes: true })
      .filter((entry) => entry.isFile() && /\.(ts|tsx)$/.test(entry.name))
      .map((entry) => {
        const file = join(entry.parentPath, entry.name);
        return [file, readFileSync(file, 'utf8')] as [string, string];
      });
  const importsOf = (code: string) => [...code.matchAll(/(?:from|import)\s*\(?\s*['"]([^'"]+)['"]/g)].map((m) => m[1]!);

  it('aucun fichier de src/core n’importe @/lib/questionnaire ni @/lib/dataset-client', () => {
    for (const [file, code] of sourcesUnder('src/core')) {
      const bad = importsOf(code).filter((s) => /lib\/(questionnaire|dataset-client)/.test(s));
      expect(bad, file).toEqual([]);
    }
  });

  it('src/lib/questionnaire n’importe ni next/navigation ni @/ui', () => {
    const files = sourcesUnder('src/lib/questionnaire');
    expect(files.length).toBeGreaterThan(0);
    for (const [file, code] of files) {
      const bad = importsOf(code).filter((s) => s === 'next/navigation' || s.startsWith('next/') || s === '@/ui' || s.startsWith('@/ui/'));
      expect(bad, file).toEqual([]);
    }
  });
});
