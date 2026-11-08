// @vitest-environment node
import { cp, mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { acceptAffirmation, listAffirmations, rejectAffirmation } from './affirmation';
import { resolvePaths } from './lib/cli';
import { loadCorpus } from './lib/corpus';
import { fakeClient } from './lib/extraction/client';
import { runExtraction } from './lib/extraction/run';
import { reviewPosition } from './review';
import { validate } from './validate';

async function setup() {
  const dir = await mkdtemp(join(tmpdir(), 'radar-aff-'));
  await cp(join(process.cwd(), 'data', 'fixtures', 'minimal'), dir, { recursive: true });
  const paths = resolvePaths({ corpus: dir });
  await runExtraction({
    corpus: loadCorpus(paths.corpusDir).corpus,
    cacheDir: paths.cacheDir,
    extractionsDir: paths.extractionsDir,
    candidateId: 'dupont',
    model: 'claude-opus-5-5',
    now: new Date('2026-11-08T10:00:00Z'),
    client: fakeClient({
      'dupont-programme-2027:0': {
        output: {
          affirmations: [
            { quote: "L'hôpital public recevra cinq milliards d'euros supplémentaires par an.", summary: "Hausse du budget de l'hôpital.", themes: ['sante'], question: 'sante-q03', proposedValue: 2, confidence: 'high' },
            { quote: 'Programme 2027.', summary: 'Titre.', themes: ['economie'], question: null, proposedValue: 0, confidence: 'low' },
            { quote: 'Citation inventée.', summary: 'x', themes: ['economie'], question: 'economie-q05', proposedValue: 1, confidence: 'low' },
          ],
        },
      },
    }),
  });
  const all = listAffirmations(paths, 'dupont');
  return { paths, verified: all[0]!, noQuestion: all[1]!, unverifiable: all[2]! };
}

describe('data:affirmation', () => {
  it('liste par état', async () => {
    const { paths } = await setup();
    expect(listAffirmations(paths, 'dupont', 'verifiable')).toHaveLength(2);
    expect(listAffirmations(paths, 'dupont', 'unverifiable')).toHaveLength(1);
  });

  it('refuse non vérifiable, sans question, contributeur inconnu', async () => {
    const { paths, noQuestion, unverifiable, verified } = await setup();
    expect(() => acceptAffirmation(paths, { id: unverifiable.id, by: 'adrien' })).toThrow(/non vérifiable/);
    expect(() => acceptAffirmation(paths, { id: noQuestion.id, by: 'adrien' })).toThrow(/--question/);
    expect(() => acceptAffirmation(paths, { id: verified.id, by: 'inconnu' })).toThrow(/Contributeur inconnu/);
  });

  it('accept crée un brouillon tracé, que son auteur ne peut pas relire (US4 scénarios 5 et 6)', async () => {
    const { paths, verified } = await setup();
    const r = acceptAffirmation(paths, { id: verified.id, by: 'adrien', now: new Date('2026-11-09T00:00:00Z') });
    expect(r.position).toBe('dupont/sante-q03');
    const positions = parse(await readFile(join(paths.corpusDir, 'positions', 'dupont.yaml'), 'utf8'));
    expect(positions.at(-1)).toMatchObject({
      question: 'sante-q03',
      value: 2,
      evidence: 'programme',
      sources: ['dupont-programme-2027'],
      quoteSource: 'dupont-programme-2027',
      status: 'draft',
      provenance: { kind: 'extraction', affirmation: verified.id, model: 'claude-opus-5-5' },
      author: 'adrien',
      authoredAt: '2026-11-09',
    });
    expect(listAffirmations(paths, 'dupont', 'accepted')[0]?.decision).toEqual({ by: 'adrien', at: '2026-11-09', position: 'dupont/sante-q03' });
    expect((await validate(paths)).violations).toEqual([]);
    expect(() => reviewPosition(paths, { candidate: 'dupont', question: 'sante-q03', by: 'adrien' })).toThrow(/ne peut pas être l'auteur/);
    expect(() => acceptAffirmation(paths, { id: verified.id, by: 'adrien' })).toThrow(/déjà acceptée/);
  });

  it('accept refuse un couple déjà présent ; reject trace le motif', async () => {
    const { paths, noQuestion } = await setup();
    expect(() => acceptAffirmation(paths, { id: noQuestion.id, by: 'adrien', question: 'economie-q01' })).toThrow(/existe déjà/);
    rejectAffirmation(paths, { id: noQuestion.id, by: 'relecteur-1', reason: 'Titre de document, pas une prise de position.', now: new Date('2026-11-09T00:00:00Z') });
    expect(listAffirmations(paths, 'dupont', 'rejected')[0]?.decision).toEqual({ by: 'relecteur-1', at: '2026-11-09', reason: 'Titre de document, pas une prise de position.' });
  });
});
