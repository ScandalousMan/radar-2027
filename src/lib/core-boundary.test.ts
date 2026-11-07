// @vitest-environment node
import { join } from 'node:path';
import { ESLint } from 'eslint';
import { describe, expect, it } from 'vitest';

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
