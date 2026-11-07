'use client';

import { useState } from 'react';
import { parseTokens, tokenFamily, type TokenFamily } from '@/lib/design-tokens';
import tokensCss from '../tokens.css?raw';

const FAMILY_ORDER: TokenFamily[] = [
  'color',
  'spacing',
  'container',
  'font',
  'font-size',
  'line-height',
  'font-weight',
  'radius',
  'shadow',
  'other',
];

type Row = { name: string; family: TokenFamily; light: string; dark: string };

/** Lit la valeur calculée d'une variable CSS sur un élément portant l'apparence demandée. */
function readComputed(name: string, theme: 'light' | 'dark'): string {
  const probe = document.createElement('div');
  probe.setAttribute('data-theme', theme);
  probe.style.position = 'absolute';
  probe.style.visibility = 'hidden';
  document.body.append(probe);
  const value = getComputedStyle(probe).getPropertyValue(name).trim();
  probe.remove();
  return value;
}

/**
 * Page « Fondations/Tokens » : les noms et familles viennent du fichier `tokens.css` (source
 * unique), les valeurs sont lues au rendu dans les deux apparences pour ne jamais diverger.
 */
export function TokensTable({ family, title }: { family: TokenFamily; title: string }) {
  const [rows] = useState<Row[]>(() => {
    if (typeof document === 'undefined') return [];
    return Object.keys(parseTokens(tokensCss).light)
      .filter((name) => tokenFamily(name) === family)
      .map((name) => ({ name, family, light: readComputed(name, 'light'), dark: readComputed(name, 'dark') }));
  });

  return (
    <table className="w-full border-collapse text-sm">
      <caption className="mb-2 text-left text-lg font-semibold">{title}</caption>
      <thead>
        <tr className="border-b border-border text-left text-fg-muted">
          <th className="py-2 pr-4 font-medium">{'Token'}</th>
          <th className="py-2 pr-4 font-medium">{'Clair'}</th>
          <th className="py-2 pr-4 font-medium">{'Sombre'}</th>
          <th className="py-2 font-medium">{'Aperçu'}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.name} className="border-b border-border align-top">
            <td className="py-2 pr-4 font-mono">{row.name}</td>
            <td className="py-2 pr-4 font-mono text-fg-muted">{row.light}</td>
            <td className="py-2 pr-4 font-mono text-fg-muted">{row.dark}</td>
            <td className="py-2">
              <Preview row={row} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Preview({ row }: { row: Row }) {
  const variable = `var(${row.name})`;
  switch (row.family) {
    case 'color':
      return (
        <span className="flex gap-2">
          <span data-theme="light" className="inline-block size-6 rounded-sm border border-border" style={{ background: variable }} />
          <span data-theme="dark" className="inline-block size-6 rounded-sm border border-border" style={{ background: variable }} />
        </span>
      );
    case 'spacing':
    case 'container':
      return <span className="inline-block h-3 max-w-full bg-accent" style={{ width: variable }} />;
    case 'font-size':
      return <span style={{ fontSize: variable }}>{'Aa'}</span>;
    case 'font-weight':
      return <span style={{ fontWeight: variable }}>{'Aa'}</span>;
    case 'font':
      return <span style={{ fontFamily: variable }}>{'Aa'}</span>;
    case 'radius':
      return <span className="inline-block size-8 bg-accent" style={{ borderRadius: variable }} />;
    case 'shadow':
      return <span className="inline-block size-8 rounded-md bg-surface" style={{ boxShadow: variable }} />;
    default:
      return null;
  }
}

export { FAMILY_ORDER };
