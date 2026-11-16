// Instantané comparable d'un classement (T040–T044, SC-006) : rang, bande, scores globaux et par
// thème en rationnels exacts sérialisés « num/den ». Partagé par le générateur de la fixture de
// rejeu v1 et par son test ; volontairement indépendant de `versionCount`/`priorVersion`, qui
// changent légitimement après la publication d'une version suivante.
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { CandidateScore, Score, Scoreboard } from '@/core/score/types';

export type ScoreSnapshot = string | null;

export type CandidateSnapshot = {
  readonly id: string;
  readonly status: CandidateScore['status'];
  readonly rank: number | null;
  readonly band: CandidateScore['band'];
  readonly global: ScoreSnapshot;
  readonly priority: ScoreSnapshot;
  readonly weighted: ScoreSnapshot;
  readonly coverage: string | null;
  readonly themes: readonly { readonly theme: string; readonly count: number; readonly score: ScoreSnapshot }[];
};

export type BoardSnapshot = { readonly answeredCount: number; readonly bankPublishedAt: string; readonly ranked: readonly CandidateSnapshot[]; readonly insufficient: readonly CandidateSnapshot[] };

const score = (s: Score | null): ScoreSnapshot => (s ? `${s.ratio.num}/${s.ratio.den}` : null);

function candidate(c: CandidateScore): CandidateSnapshot {
  return {
    id: c.candidate.id,
    status: c.status,
    rank: c.rank,
    band: c.band,
    global: score(c.global),
    priority: score(c.priority),
    weighted: score(c.weighted),
    coverage: c.coverage ? `${c.coverage.known}/${c.coverage.answered}` : null,
    themes: c.themes.map((t) => ({ theme: t.kind === 'theme' ? t.themeId : 'others', count: t.count, score: score(t.score) })),
  };
}

export function snapshotBoard(board: Scoreboard): BoardSnapshot {
  return { answeredCount: board.answeredCount, bankPublishedAt: board.bankPublishedAt, ranked: board.ranked.map(candidate), insufficient: board.insufficient.map(candidate) };
}

/** `fetch` lisant `public/` sur le disque : `/data/…` ⇒ `<root>/public/data/…`, 404 sinon. */
export function diskFetcher(root: string): typeof fetch {
  const publicDir = path.join(root, 'public');
  return (async (input: Parameters<typeof fetch>[0]) => {
    const url = String(input);
    if (!/^\/data\/[a-z0-9/.-]+\.json$/.test(url) || url.includes('..')) return new Response('', { status: 404 });
    try {
      return new Response(await readFile(path.join(publicDir, url), 'utf8'), { headers: { 'content-type': 'application/json' } });
    } catch {
      return new Response('', { status: 404 });
    }
  }) as typeof fetch;
}
