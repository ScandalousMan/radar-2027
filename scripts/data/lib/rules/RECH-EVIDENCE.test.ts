// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { RECH_EVIDENCE } from './RECH-EVIDENCE';
import { evidenceOf, ids, minimalContext, researchContext } from './testing';

const messages = (ctx: ReturnType<typeof researchContext>, severity: 'error' | 'warning' = 'error') =>
  RECH_EVIDENCE.run(ctx)
    .filter((v) => v.severity === severity)
    .map((v) => `${v.entity.id} ${/^\(\d+\)/.exec(v.message)?.[0]}`);

const J = '2026-11-22-fixture-minimale';

describe('RECH-EVIDENCE', () => {
  it('fixture minimale conforme, sans avertissement', () => {
    const ctx = researchContext();
    expect(ids(RECH_EVIDENCE, ctx)).toEqual([]);
    expect(ids(RECH_EVIDENCE, ctx, 'warning')).toEqual([]);
  });
  it('muette sans corpus de preuves', () => expect(ids(RECH_EVIDENCE, minimalContext())).toEqual([]));

  it('type : POSITION sans thème, CANDIDACY avec thème (1)', () => {
    const ctx = researchContext();
    delete evidenceOf(ctx, 'dupont-sante-001').theme;
    evidenceOf(ctx, 'martin-candidature-001').theme = 'economie';
    expect(messages(ctx).sort()).toEqual(['dupont-sante-001 (1)', 'martin-candidature-001 (1)']);
  });

  it('question sans qualification (2)', () => {
    const ctx = researchContext();
    delete evidenceOf(ctx, 'dupont-economie-001').qualification;
    expect(messages(ctx)).toEqual(['dupont-economie-001 (2)']);
  });

  it('citation absente, trop longue ; paraphrase absente ou doublée d’une citation (3)', () => {
    const ctx = researchContext();
    delete evidenceOf(ctx, 'martin-candidature-001').quote;
    evidenceOf(ctx, 'dupont-candidature-001').quote = 'x'.repeat(ctx.thresholds.maxQuoteLength + 1);
    const para = evidenceOf(ctx, 'dupont-sante-001');
    para.quote = 'texte entre guillemets';
    delete para.paraphrase;
    expect(messages(ctx).sort()).toEqual(['dupont-candidature-001 (3)', 'dupont-sante-001 (3)', 'dupont-sante-001 (3)', 'martin-candidature-001 (3)']);
  });

  it('citation vérifiée sans localisation, de qualité C, sur transcription automatique (4)', () => {
    const ctx = researchContext();
    const e = evidenceOf(ctx, 'martin-candidature-001');
    e.sourceQuality = 'C_CONTEXTUAL_ONLY';
    e.transcript = 'automatic';
    expect(messages(ctx)).toEqual(['martin-candidature-001 (4)', 'martin-candidature-001 (4)']);
    delete e.locator;
    expect(messages(ctx).filter((m) => m.endsWith('(4)'))).toHaveLength(3);
  });

  it('qualité A avec citation non vérifiée (5)', () => {
    const ctx = researchContext();
    evidenceOf(ctx, 'martin-candidature-001').quoteStatus = 'UNVERIFIED_QUOTE';
    expect(messages(ctx)).toEqual(['martin-candidature-001 (5)']);
  });

  it('source non enregistrée hors cas admis, ou sans aucune source (6)', () => {
    const ctx = researchContext();
    const e = evidenceOf(ctx, 'dupont-sante-002');
    e.sourceQuality = 'C_CONTEXTUAL_ONLY';
    const f = evidenceOf(ctx, 'dupont-sante-001');
    delete f.source;
    expect(messages(ctx).sort()).toEqual(['dupont-sante-001 (6)', 'dupont-sante-002 (6)']);
  });

  it('localisation absente ou horodatage mal formé (7)', () => {
    const ctx = researchContext();
    delete evidenceOf(ctx, 'dupont-sante-001').locator;
    evidenceOf(ctx, 'martin-candidature-001').locator = { kind: 'timestamp', value: '1h10' };
    expect(messages(ctx).sort()).toEqual(['dupont-sante-001 (7)', 'martin-candidature-001 (7)']);
    evidenceOf(ctx, 'martin-candidature-001').locator = { kind: 'timestamp', value: '01:10' };
    expect(messages(ctx)).toEqual(['dupont-sante-001 (7)']);
  });

  it('action personnelle sans portée (8)', () => {
    const ctx = researchContext();
    evidenceOf(ctx, 'dupont-sante-001').attribution = 'PERSONAL_ACTION';
    expect(messages(ctx)).toEqual(['dupont-sante-001 (8)']);
  });

  it('propos d’un tiers attribués personnellement (9) ; accents, casse et alias tolérés', () => {
    const ctx = researchContext();
    evidenceOf(ctx, 'dupont-sante-001').speaker = 'Porte-parole du Parti A';
    evidenceOf(ctx, 'dupont-candidature-001').speaker = 'JEANNE  DUPONT';
    evidenceOf(ctx, 'martin-candidature-001').speaker = 'Paul Mârtin';
    expect(messages(ctx)).toEqual(['dupont-sante-001 (9)']);
    const j = evidenceOf(ctx, 'jean-exemple-candidature-001');
    j.speaker = 'J. Exemple';
    j.attribution = 'PERSONAL_DIRECT';
    expect(messages(ctx).filter((m) => m.startsWith('jean-exemple'))).toEqual([]);
  });

  it('date inconnue et actualité incohérentes (10)', () => {
    const ctx = researchContext();
    evidenceOf(ctx, 'dupont-sante-002').temporalRelevance = 'DATED';
    evidenceOf(ctx, 'dupont-sante-001').temporalRelevance = 'UNDETERMINED';
    expect(messages(ctx).sort()).toEqual(['dupont-sante-001 (10)', 'dupont-sante-002 (10)']);
  });

  it('ordre des dates, au préfixe de précision (11)', () => {
    const ctx = researchContext();
    evidenceOf(ctx, 'dupont-economie-001').statedAt = { date: '2026-10-15', precision: 'day' }; // source publiée en 2026-10 : admis
    evidenceOf(ctx, 'martin-candidature-001').statedAt = { date: '2026-10-04', precision: 'day' }; // après la publication
    evidenceOf(ctx, 'dupont-sante-001').researchedAt = '2026-11-23';
    const c = evidenceOf(ctx, 'dupont-candidature-001');
    c.createdAt = '2026-11-23';
    expect(messages(ctx).sort()).toEqual(['dupont-candidature-001 (11)', 'dupont-sante-001 (11)', 'martin-candidature-001 (11)']);
  });

  it('mise à jour non tracée (12), tracée par l’historique ou une corroboration', () => {
    const ctx = researchContext();
    const e = evidenceOf(ctx, 'dupont-sante-001');
    e.updatedAt = '2026-11-25';
    e.verifiedAt = '2026-11-25';
    expect(messages(ctx)).toEqual(['dupont-sante-001 (12)']);
    e.history = [{ at: '2026-11-25', field: 'verifiedAt', previous: '2026-11-22', reason: 'revérification', journal: J }];
    expect(messages(ctx)).toEqual([]);
  });

  it('corroboration par la même source (13)', () => {
    const ctx = researchContext();
    evidenceOf(ctx, 'dupont-economie-001').corroborations = [
      { source: 'dupont-declaration-candidature', quoteStatus: 'UNVERIFIED_QUOTE', verifiedAt: '2026-11-22', journal: J },
      { source: 'dupont-programme-2027', quoteStatus: 'VERIFIED_QUOTE', verifiedAt: '2026-11-22', journal: J },
    ];
    expect(messages(ctx)).toEqual(['dupont-economie-001 (13)']);
  });

  it('doublon exact : même source, même citation normalisée (14)', () => {
    const ctx = researchContext();
    const list = ctx.research.evidence.get('dupont')!;
    list.push({ ...evidenceOf(ctx, 'dupont-economie-001'), id: 'dupont-economie-002', quote: 'Nous revaloriserons le SMIC de 10 % dès l’été 2027.' });
    expect(messages(ctx)).toEqual(['dupont-economie-002 (14)']);
  });

  it('doublon possible sur deux sources (15), levé par un signalement POSSIBLE_DUPLICATE', () => {
    const ctx = researchContext();
    const list = ctx.research.evidence.get('dupont')!;
    list.push({ ...evidenceOf(ctx, 'dupont-economie-001'), id: 'dupont-economie-002', source: 'dupont-declaration-candidature', statedAt: { date: '2026-09', precision: 'month' }, quote: 'nous revaloriserons le SMIC de 10 % des l’ete 2027' });
    expect(messages(ctx)).toEqual([]);
    expect(messages(ctx, 'warning')).toEqual(['dupont-economie-002 (15)']);
    ctx.research.signals.push({ id: 'sig-x', kind: 'POSSIBLE_DUPLICATE', raisedAt: '2026-11-22', journal: J, personality: 'dupont', evidence: ['dupont-economie-001', 'dupont-economie-002'], reason: 'x', state: 'open' });
    expect(messages(ctx, 'warning')).toEqual([]);
  });

  it('propos de plus de 12 mois présenté comme actuel (16), levé par une corroboration récente', () => {
    const ctx = researchContext();
    const e = evidenceOf(ctx, 'dupont-sante-001');
    e.statedAt = { date: '2025-06', precision: 'month' };
    e.history = [];
    expect(messages(ctx, 'warning')).toEqual(['dupont-sante-001 (16)']);
    e.corroborations = [{ source: 'dupont-programme-2027', quoteStatus: 'PARAPHRASE', verifiedAt: '2026-11-22', journal: J }];
    expect(messages(ctx, 'warning')).toEqual([]);
  });
});
