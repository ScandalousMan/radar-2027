// @vitest-environment node
// SC-010 : durée de data:validate sur un corpus de taille réelle (22 candidats, 16 thèmes,
// 300 questions, 6 600 positions relues, cache). Lancé seulement avec RADAR_PERF=1.
import { cpSync, mkdirSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { writeCached } from './lib/cache';
import { resolvePaths } from './lib/cli';
import { writeYaml } from './lib/corpus';
import { positionHash } from './lib/positions';
import { normalize } from './lib/text';
import { validate } from './validate';

const THEMES = 16;
const PER_THEME = 19; // 304 questions
const CANDIDATES = 22;

function buildCorpus(): string {
  const root = mkdtempSync(join(tmpdir(), 'radar-perf-'));
  const corpus = join(root, 'corpus');
  for (const d of ['questions', 'sources', 'positions']) mkdirSync(join(corpus, d), { recursive: true });
  cpSync(join(process.cwd(), 'data', 'corpus', 'governance.yaml'), join(corpus, 'governance.yaml'));
  writeYaml(join(corpus, 'contributors.yaml'), [{ id: 'adrien', github: 'a' }, { id: 'relecteur-1', github: 'b' }]);
  const themes = Array.from({ length: THEMES }, (_, i) => `theme-${i}`);
  writeYaml(
    join(corpus, 'themes.yaml'),
    themes.map((id, order) => ({ id, label: `Thème ${order}`, description: 'd', axis: { negative: 'moins', positive: 'plus' }, order, status: 'active' })),
  );
  const checklist = { 'no-loaded-term': true, 'no-presupposition': true, 'no-person-or-party': true, 'single-claim': true, 'both-ends-defensible': true };
  const questions: string[] = [];
  for (const t of themes) {
    const qs = Array.from({ length: PER_THEME }, (_, i) => ({
      id: `${t}-q${i}`,
      text: `Énoncé ${i} du ${t}.`,
      themes: [t],
      polarity: i % 2 === 0 ? '+' : '-',
      status: 'active',
      author: 'adrien',
      reviewer: 'relecteur-1',
      reviewedAt: '2026-11-08',
      neutralityChecklist: checklist,
    }));
    questions.push(...qs.slice(0, 300 / THEMES + 1).map((q) => q.id));
    writeYaml(join(corpus, 'questions', `${t}.yaml`), qs);
  }
  const candidates = Array.from({ length: CANDIDATES }, (_, i) => `candidat-${i}`);
  writeYaml(
    join(corpus, 'candidates.yaml'),
    candidates.map((id) => ({
      id,
      name: id,
      party: 'Parti',
      status: 'declared',
      statusChangedAt: '2026-09-01',
      statusSource: `${id}-programme`,
      statusCriterion: 'declaration-publique-personnelle',
      history: [{ status: 'declared', at: '2026-09-01', source: `${id}-programme`, criterion: 'declaration-publique-personnelle' }],
    })),
  );
  for (const c of candidates) {
    const sentences = questions.slice(0, 300).map((q, i) => `Phrase ${i} sur ${q} du programme de ${c}.`);
    const hash = writeCached(join(root, 'cache'), normalize(sentences.join(' ')));
    writeYaml(join(corpus, 'sources', `${c}.yaml`), [
      { id: `${c}-programme`, url: `https://exemple.fr/${c}`, title: 'Programme', kind: 'programme', publishedAt: { date: '2026-09', precision: 'month' }, accessedAt: '2026-11-07', candidates: [c], contentHash: hash },
    ]);
    writeYaml(
      join(corpus, 'positions', `${c}.yaml`),
      questions.slice(0, 300).map((q, i) => {
        const p = { question: q, value: ((i % 5) - 2) as number, evidence: 'programme', sources: [`${c}-programme`], quote: sentences[i]!, quoteSource: `${c}-programme`, justification: 'J.', status: 'reviewed', provenance: { kind: 'manual' }, author: 'adrien', authoredAt: '2026-11-08' };
        return { ...p, reviewer: 'relecteur-1', reviewedAt: '2026-11-09', reviewedHash: positionHash(p as never) };
      }),
    );
  }
  return root;
}

describe('performance de data:validate (SC-010)', () => {
  it.skipIf(!process.env.RADAR_PERF)('corpus complet validé en moins de 2 minutes', { timeout: 300_000 }, async () => {
    const root = buildCorpus();
    const started = performance.now();
    const report = await validate(resolvePaths({ corpus: root }));
    const seconds = (performance.now() - started) / 1000;
    console.log(`data:validate sur ${CANDIDATES} candidats × 300 positions : ${seconds.toFixed(2)} s`);
    expect(report.violations).toEqual([]);
    expect(report.stats.coverageByCandidate?.[0]?.known).toBe(300);
    expect(seconds).toBeLessThan(120);
  });
});
