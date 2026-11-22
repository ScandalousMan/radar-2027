// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { RECH_QUOTE } from './RECH-QUOTE';
import { evidenceOf, ids, minimalContext, researchContext } from './testing';

const J = '2026-11-22-fixture-minimale';

describe('RECH-QUOTE', () => {
  it('fixture minimale conforme : citations retrouvées dans le cache', () => {
    const ctx = researchContext();
    expect(ids(RECH_QUOTE, ctx)).toEqual([]);
    expect(ids(RECH_QUOTE, ctx, 'warning')).toEqual([]);
  });
  it('muette sans corpus de preuves', () => expect(ids(RECH_QUOTE, minimalContext())).toEqual([]));

  it('source sans empreinte (1)', () => {
    const ctx = researchContext();
    delete ctx.corpus.sources.get('martin')![0]!.contentHash;
    expect(ids(RECH_QUOTE, ctx)).toEqual(['martin-candidature-001']);
  });

  it('citation absente du texte en cache (2), normalisation des apostrophes et espaces tolérée', () => {
    const ctx = researchContext();
    evidenceOf(ctx, 'dupont-candidature-001').quote = 'J’annonce  aujourd’hui ma candidature à l’élection présidentielle de 2027.';
    evidenceOf(ctx, 'martin-candidature-001').quote = 'Oui, je suis candidat à la présidentielle.';
    expect(ids(RECH_QUOTE, ctx)).toEqual(['martin-candidature-001']);
  });

  it('citation non vérifiée ou paraphrase : non contrôlées', () => {
    const ctx = researchContext();
    const e = evidenceOf(ctx, 'martin-candidature-001');
    e.quote = 'phrase absente';
    e.quoteStatus = 'UNVERIFIED_QUOTE';
    expect(ids(RECH_QUOTE, ctx)).toEqual([]);
  });

  it('texte absent du cache (3) : avertissement CACHE-MISSING ; cache indisponible : silence', () => {
    const ctx = researchContext();
    ctx.corpus.sources.get('martin')![0]!.contentHash = `sha256:${'0'.repeat(64)}`;
    const found = RECH_QUOTE.run(ctx);
    expect(found.map((v) => [v.rule, v.severity, v.entity.id])).toEqual([['CACHE-MISSING', 'warning', 'martin-candidature-001']]);
    expect(RECH_QUOTE.run(researchContext({ cache: false }))).toEqual([]);
  });

  it('corroboration VERIFIED_QUOTE contrôlée sur la source corroborante (4)', () => {
    const ctx = researchContext();
    evidenceOf(ctx, 'dupont-economie-001').corroborations = [
      { source: 'dupont-declaration-candidature', quoteStatus: 'VERIFIED_QUOTE', verifiedAt: '2026-11-22', journal: J },
    ];
    expect(ids(RECH_QUOTE, ctx)).toEqual(['dupont-economie-001']);
    evidenceOf(ctx, 'dupont-economie-001').corroborations![0]!.quoteStatus = 'UNVERIFIED_QUOTE';
    expect(ids(RECH_QUOTE, ctx)).toEqual([]);
  });
});
