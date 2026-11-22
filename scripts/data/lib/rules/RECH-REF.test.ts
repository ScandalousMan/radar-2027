// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { RECH_REF } from './RECH-REF';
import { evidenceOf, ids, journalOf, minimalContext, personalityOf, researchContext } from './testing';

describe('RECH-REF', () => {
  it('fixture minimale conforme', () => expect(ids(RECH_REF, researchContext())).toEqual([]));
  it('muette sans corpus de preuves', () => expect(ids(RECH_REF, minimalContext())).toEqual([]));

  it('personnalité inconnue : preuve, périmètre, lacune (1)', () => {
    const ctx = researchContext();
    evidenceOf(ctx, 'dupont-sante-001').personality = 'fantome';
    const j = journalOf(ctx);
    j.scope.personalities.push('fantome');
    j.gaps![0]!.personality = 'fantome';
    expect(ids(RECH_REF, ctx).sort()).toEqual(['2026-11-22-fixture-minimale', '2026-11-22-fixture-minimale', 'dupont-sante-001']);
  });

  it('thème et question inconnus (2)', () => {
    const ctx = researchContext();
    evidenceOf(ctx, 'dupont-sante-001').theme = 'inexistant';
    journalOf(ctx).scope.questions.push('question-absente');
    expect(ids(RECH_REF, ctx).sort()).toEqual(['2026-11-22-fixture-minimale', 'dupont-sante-001']);
  });

  it('thème de la preuve absent des thèmes de la question (3)', () => {
    const ctx = researchContext();
    evidenceOf(ctx, 'dupont-economie-001').theme = 'sante';
    expect(ids(RECH_REF, ctx)).toEqual(['dupont-economie-001']);
  });

  it('sources inconnues : preuve, corroboration, source consultée (4)', () => {
    const ctx = researchContext();
    const e = evidenceOf(ctx, 'dupont-economie-001');
    e.source = 'absente';
    e.corroborations = [{ source: 'absente-2', quoteStatus: 'VERIFIED_QUOTE', verifiedAt: '2026-11-22', journal: '2026-11-22-fixture-minimale' }];
    journalOf(ctx).sourcesConsulted[0]!.source = 'absente-3';
    expect(ids(RECH_REF, ctx).sort()).toEqual(['2026-11-22-fixture-minimale', 'dupont-economie-001', 'dupont-economie-001']);
  });

  it('journal inconnu : preuve, historique, signalement (5)', () => {
    const ctx = researchContext();
    const e = evidenceOf(ctx, 'dupont-sante-001');
    e.journal = '2026-01-01-absent';
    e.history = [{ at: '2026-11-22', field: 'context', previous: 'x', reason: 'y', journal: '2026-01-02-absent' }];
    ctx.research.signals[0]!.journal = '2026-01-03-absent';
    expect(ids(RECH_REF, ctx).sort()).toEqual(['dupont-sante-001', 'dupont-sante-001', 'sig-2026-11-22-dupont-smic']);
  });

  it('preuves inconnues : statut, journal, signalement (6)', () => {
    const ctx = researchContext();
    personalityOf(ctx, 'martin').statuses[0]!.evidence.push('martin-absente');
    journalOf(ctx).evidenceCorroborated = ['dupont-absente'];
    ctx.research.signals[0]!.evidence.push('dupont-absente-2');
    expect(ids(RECH_REF, ctx).sort()).toEqual(['2026-11-22-fixture-minimale', 'martin', 'sig-2026-11-22-dupont-smic']);
  });

  it('auteur et résolveur inconnus (7)', () => {
    const ctx = researchContext();
    journalOf(ctx).author = 'inconnu';
    ctx.research.signals[0]!.resolution = { at: '2026-11-23', by: 'personne', decision: 'x' };
    expect(ids(RECH_REF, ctx).sort()).toEqual(['2026-11-22-fixture-minimale', 'sig-2026-11-22-dupont-smic']);
  });

  it('position inexistante (8) et signalement inconnu (9)', () => {
    const ctx = researchContext();
    ctx.research.signals[0]!.position = { candidate: 'martin', question: 'economie-q01' };
    journalOf(ctx).signals!.push('sig-absent');
    expect(ids(RECH_REF, ctx).sort()).toEqual(['2026-11-22-fixture-minimale', 'sig-2026-11-22-dupont-smic']);
  });
});
