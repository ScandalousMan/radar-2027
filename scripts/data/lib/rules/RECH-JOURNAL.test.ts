// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { RECH_JOURNAL } from './RECH-JOURNAL';
import { evidenceOf, journalOf, minimalContext, researchContext } from './testing';

const codes = (ctx: ReturnType<typeof researchContext>) =>
  RECH_JOURNAL.run(ctx)
    .filter((v) => v.severity === 'error')
    .map((v) => /^\(\d+\)/.exec(v.message)?.[0]);

describe('RECH-JOURNAL', () => {
  it('fixture minimale conforme', () => expect(codes(researchContext())).toEqual([]));
  it('muette sans corpus de preuves', () => expect(RECH_JOURNAL.run(minimalContext())).toEqual([]));

  it('mission terminée sans fin ou finie avant de commencer ; interrompue sans description (1)', () => {
    const ctx = researchContext();
    const j = journalOf(ctx);
    j.completedAt = '2026-11-21';
    expect(codes(ctx)).toEqual(['(1)']);
    delete j.completedAt;
    expect(codes(ctx)).toEqual(['(1)']);
    j.state = 'interrupted';
    expect(codes(ctx)).toEqual(['(1)']);
    j.interruption = 'Réseaux sociaux non consultés : limite de contexte.';
    expect(codes(ctx)).toEqual([]);
  });

  it('aucune requête, aucune catégorie (2)', () => {
    const ctx = researchContext();
    const j = journalOf(ctx);
    j.queries = [];
    j.categoriesExplored = [];
    expect(codes(ctx)).toEqual(['(2)', '(2)']);
  });

  it('exhaustivité prétendue (3)', () => {
    const ctx = researchContext();
    const j = journalOf(ctx);
    j.exhaustive = true;
    expect(codes(ctx)).toEqual(['(3)']);
    j.categoriesNotExplored = [];
    expect(codes(ctx)).toEqual([]);
    j.state = 'interrupted';
    j.interruption = 'x';
    expect(codes(ctx)).toEqual(['(3)']);
  });

  it('NOT_FOUND sans recherche significative (4)', () => {
    const ctx = researchContext();
    const j = journalOf(ctx);
    j.gaps!.push({ kind: 'NOT_FOUND', personality: 'martin', theme: 'sante', note: 'Aucune déclaration trouvée.' });
    expect(codes(ctx)).toEqual(['(4)']);
    for (let i = 0; i < 3; i++) j.queries.push({ at: '2026-11-22', query: `Martin santé ${i}`, category: 'NATIONAL_MEDIA' });
    expect(codes(ctx)).toEqual(['(4)']);
    j.categoriesExplored.push('NATIONAL_MEDIA');
    expect(codes(ctx)).toEqual([]);
  });

  it('source retenue sans identifiant du registre (5)', () => {
    const ctx = researchContext();
    delete journalOf(ctx).sourcesConsulted[0]!.source;
    expect(codes(ctx)).toEqual(['(5)']);
  });

  it('compte rendu absent ou incomplet (6)', () => {
    const ctx = researchContext();
    const headings = ctx.research.reports.get('2026-11-22-fixture-minimale')!;
    ctx.research.reports.set('2026-11-22-fixture-minimale', headings.filter((h) => !h.startsWith('13.')));
    expect(RECH_JOURNAL.run(ctx).map((v) => v.message)).toEqual(['(6) compte rendu sans rubrique « ## 13. »']);
    ctx.research.reports.delete('2026-11-22-fixture-minimale');
    expect(codes(ctx)).toEqual(['(6)']);
  });

  it('preuve ajoutée rattachée à un autre journal (7)', () => {
    const ctx = researchContext();
    evidenceOf(ctx, 'martin-candidature-001').journal = '2026-11-01-autre';
    expect(codes(ctx)).toEqual(['(7)']);
  });
});
