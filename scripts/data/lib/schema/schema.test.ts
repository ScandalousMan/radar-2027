// @vitest-environment node
import { parse } from 'yaml';
import { describe, expect, it } from 'vitest';
import { GovernanceFileSchema, PositionSchema, QuestionSchema, SourceSchema, ThemeSchema } from './index';

const H = `sha256:${'3f1a'.repeat(16)}`;

// Exemples de contracts/corpus-files.md (empreintes complétées).
const themes = parse(`
- id: economie
  label: Économie
  description: Rôle de l'État dans l'activité, dépense publique, entreprises.
  axis:
    negative: Moins d'intervention publique dans l'économie
    positive: Plus d'intervention publique dans l'économie
  order: 2
  status: active
`);

const questions = parse(`
- id: economie-smic-hausse
  text: Le SMIC doit être augmenté nettement au-delà de l'inflation.
  themes: [economie, travail]
  polarity: '+'
  status: active
  author: adrien
  reviewer: relecteur-1
  reviewedAt: 2026-11-20
  neutralityChecklist:
    no-loaded-term: true
    no-presupposition: true
    no-person-or-party: true
    single-claim: true
    both-ends-defensible: true
`);

const sources = parse(`
- id: dupont-programme-2027
  url: https://exemple.fr/programme.pdf
  title: Programme présidentiel 2027
  kind: programme
  publishedAt: { date: 2026-10, precision: month }
  accessedAt: 2026-11-07
  candidates: [dupont]
  contentHash: ${H}
`);

const positions = parse(`
- question: economie-smic-hausse
  value: 1
  evidence: programme
  sources: [dupont-programme-2027]
  quote: "Nous revaloriserons le SMIC de 10 % dès l'été 2027."
  quoteSource: dupont-programme-2027
  justification: Hausse chiffrée mais ponctuelle.
  status: reviewed
  provenance: { kind: extraction, run: 20261108T101500Z-9c2e1f0a, affirmation: 7b1d2c3e4f506172, model: claude-opus-5-5 }
  author: adrien
  authoredAt: 2026-11-08
  reviewer: relecteur-1
  reviewedAt: 2026-11-09
  reviewedHash: ${H}

- question: sante-deserts-medicaux-obligation
  value: unknown
  sources: [dupont-programme-2027, dupont-interview-rtl]
  justification: Aucune prise de position trouvée dans les sources consultées.
  status: reviewed
  provenance: { kind: manual }
  author: adrien
  authoredAt: 2026-11-08
  reviewer: relecteur-1
  reviewedAt: 2026-11-09
`);

describe('schémas du corpus (contracts/corpus-files.md)', () => {
  it('acceptent les exemples du contrat', () => {
    expect(ThemeSchema.safeParse(themes[0]).error).toBeUndefined();
    expect(QuestionSchema.safeParse(questions[0]).error).toBeUndefined();
    expect(SourceSchema.safeParse(sources[0]).error).toBeUndefined();
    for (const p of positions) expect(PositionSchema.safeParse(p).error).toBeUndefined();
  });

  it('rejettent une clé inconnue', () => {
    expect(ThemeSchema.safeParse({ ...themes[0], couleur: 'rouge' }).success).toBe(false);
  });

  it('rejettent publishedAt sans précision', () => {
    expect(SourceSchema.safeParse({ ...sources[0], publishedAt: '2026-10' }).success).toBe(false);
    expect(SourceSchema.safeParse({ ...sources[0], publishedAt: { date: '2026-10' } }).success).toBe(false);
  });

  it('acceptent une année lue comme nombre par YAML', () => {
    const s = SourceSchema.parse({ ...sources[0], publishedAt: { date: 2021, precision: 'year' } });
    expect(s.publishedAt.date).toBe('2021');
  });

  it('rejettent value: 3', () => {
    expect(PositionSchema.safeParse({ ...positions[0], value: 3 }).success).toBe(false);
  });

  it('gouvernance : seuils par défaut', () => {
    const g = GovernanceFileSchema.parse({
      inclusionCriteria: [],
      neutralityChecklist: [],
      evidenceLevels: [],
      reportIssueUrl: 'https://github.com/x/y/issues/new?title={title}',
    });
    expect(g.thresholds).toMatchObject({ polarityMin: 0.4, minQuestionsPerTheme: 10, oldSourceBefore: '2022-01-01', mainBudgetBytes: 307200 });
  });
});
