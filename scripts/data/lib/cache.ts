// Cache local des textes de sources : `<dossier>/<hex>.txt`, texte normalisé (research.md R2, R6).
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { SourceCache } from './rules/types';
import { sha256 } from './text';

function hex(hash: string): string {
  return hash.startsWith('sha256:') ? hash.slice('sha256:'.length) : hash;
}

export function cachePath(cacheDir: string, hash: string): string {
  return join(cacheDir, `${hex(hash)}.txt`);
}

export function readCached(cacheDir: string, hash: string): string | null {
  const file = cachePath(cacheDir, hash);
  return existsSync(file) ? readFileSync(file, 'utf8') : null;
}

/** Écrit un texte déjà normalisé et retourne son empreinte. */
export function writeCached(cacheDir: string, normalizedText: string): string {
  const hash = sha256(normalizedText);
  mkdirSync(cacheDir, { recursive: true });
  writeFileSync(cachePath(cacheDir, hash), normalizedText, 'utf8');
  return hash;
}

export function hasCache(cacheDir: string): boolean {
  return existsSync(cacheDir) && statSync(cacheDir).isDirectory();
}

/** Vue en lecture mémorisée, pour les règles. */
export function openCache(cacheDir: string): SourceCache {
  const memo = new Map<string, string | null>();
  return {
    dir: cacheDir,
    read(hash) {
      if (!memo.has(hash)) memo.set(hash, readCached(cacheDir, hash));
      return memo.get(hash) ?? null;
    },
  };
}
