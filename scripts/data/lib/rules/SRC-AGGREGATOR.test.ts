// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { aggregatorOf, SRC_AGGREGATOR } from './SRC-AGGREGATOR';
import { evidenceOf, researchContext } from './testing';

const DOMAINS = ['candidatspresidentielles2027.fr', 'monvote2027.fr', 'wikipedia.org'];

function ctxWith(domains: string[] | null = DOMAINS) {
  const ctx = researchContext();
  if (domains) ctx.corpus.governance!.aggregatorDomains = domains;
  else delete ctx.corpus.governance!.aggregatorDomains;
  return ctx;
}

const firstSource = (ctx: ReturnType<typeof ctxWith>) => [...ctx.corpus.sources.values()][0]![0]!;
const anyEvidence = (ctx: ReturnType<typeof ctxWith>) => [...ctx.research.evidence.values()].flat()[0]!;

describe('SRC-AGGREGATOR', () => {
  it('corpus de la fixture conforme', () => {
    expect(SRC_AGGREGATOR.run(ctxWith())).toEqual([]);
  });

  it('source sur un domaine agrégateur : erreur, entité source, URL et domaine cités', () => {
    const ctx = ctxWith();
    const s = firstSource(ctx);
    s.url = 'https://candidatspresidentielles2027.fr/candidat/dupont';
    const [v, ...rest] = SRC_AGGREGATOR.run(ctx);
    expect(rest).toEqual([]);
    expect(v).toMatchObject({ rule: 'SRC-AGGREGATOR', severity: 'error', entity: { kind: 'source', id: s.id } });
    expect(v!.message).toContain('https://candidatspresidentielles2027.fr/candidat/dupont');
    expect(v!.message).toContain('candidatspresidentielles2027.fr');
  });

  it('sous-domaine (www.monvote2027.fr) : erreur', () => {
    const ctx = ctxWith();
    firstSource(ctx).url = 'https://www.monvote2027.fr/x';
    expect(SRC_AGGREGATOR.run(ctx).map((v) => v.entity.kind)).toEqual(['source']);
  });

  it('preuve dont unregisteredSource est un agrégateur : erreur, entité evidence', () => {
    const ctx = ctxWith();
    const e = anyEvidence(ctx);
    e.unregisteredSource = { url: 'https://fr.wikipedia.org/wiki/X', title: 'X', publisher: 'Wikipédia', reason: 'test' };
    expect(SRC_AGGREGATOR.run(ctx)).toMatchObject([{ entity: { kind: 'evidence', id: e.id } }]);
  });

  it('lead agrégateur : aucune erreur', () => {
    const ctx = ctxWith();
    const e = evidenceOf(ctx, anyEvidence(ctx).id);
    e.lead = { url: 'https://candidatspresidentielles2027.fr/dupont', title: 'Piste' };
    expect(SRC_AGGREGATOR.run(ctx)).toEqual([]);
  });

  it('domaines voisins : aucune erreur', () => {
    for (const url of ['https://monvote2027.fr.example.org/a', 'https://notmonvote2027.fr/a', 'https://exemple.fr/monvote2027.fr']) {
      const ctx = ctxWith();
      firstSource(ctx).url = url;
      expect(SRC_AGGREGATOR.run(ctx), url).toEqual([]);
    }
  });

  it('aggregatorDomains absent : aucune vérification', () => {
    const ctx = ctxWith(null);
    firstSource(ctx).url = 'https://candidatspresidentielles2027.fr/x';
    expect(SRC_AGGREGATOR.run(ctx)).toEqual([]);
  });

  it('aggregatorOf : hôte exact, sous-domaine, URL invalide', () => {
    expect(aggregatorOf('https://WWW.Wikipedia.org./w', DOMAINS)).toBe('wikipedia.org');
    expect(aggregatorOf('pas une url', DOMAINS)).toBeNull();
  });
});
