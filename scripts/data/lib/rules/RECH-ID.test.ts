// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { RECH_ID } from './RECH-ID';
import { evidenceOf, ids, journalOf, minimalContext, personalityOf, researchContext } from './testing';

describe('RECH-ID', () => {
  it('fixture minimale conforme', () => expect(ids(RECH_ID, researchContext())).toEqual([]));
  it('muette sans corpus de preuves', () => expect(ids(RECH_ID, minimalContext())).toEqual([]));

  it('identifiants en double (1)', () => {
    const ctx = researchContext();
    evidenceOf(ctx, 'dupont-sante-002').id = 'dupont-sante-001';
    ctx.research.personalities.push({ ...personalityOf(ctx, 'martin') });
    ctx.research.signals.push({ ...ctx.research.signals[0]! });
    expect(ids(RECH_ID, ctx).sort()).toEqual(['dupont-sante-001', 'martin', 'sig-2026-11-22-dupont-smic']);
  });

  it('journal en double sous deux fichiers (1) et nom de fichier différent (3)', () => {
    const ctx = researchContext();
    ctx.research.journals.set('2026-11-23-copie', journalOf(ctx));
    expect(ids(RECH_ID, ctx)).toEqual(['2026-11-22-fixture-minimale', '2026-11-22-fixture-minimale']);
  });

  it('preuve mal préfixée ou dans le fichier d’une autre personnalité (2)', () => {
    const ctx = researchContext();
    evidenceOf(ctx, 'dupont-sante-001').id = 'sante-001';
    evidenceOf(ctx, 'dupont-sante-002').personality = 'martin';
    expect(ids(RECH_ID, ctx).sort()).toEqual(['dupont-sante-002', 'dupont-sante-002', 'sante-001']);
  });

  it('identifiant de journal mal formé (3)', () => {
    const ctx = researchContext();
    const j = journalOf(ctx);
    ctx.research.journals.delete(j.id);
    j.id = 'fixture-minimale';
    ctx.research.journals.set('fixture-minimale', j);
    expect(ids(RECH_ID, ctx)).toEqual(['fixture-minimale']);
  });

  it('personnalité portant le nom d’un candidat publié sous un autre identifiant (4)', () => {
    const ctx = researchContext();
    personalityOf(ctx, 'jean-exemple').name = 'JEANNE DUPONT';
    expect(ids(RECH_ID, ctx)).toEqual(['jean-exemple']);
  });
});
