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

// Spec 006 (contracts/corpus-delta.md) : axe à dimensions.
describe('dimensions du thème et dimension de la question (006)', () => {
  const dim = (id: string) => ({ id, label: `Dimension ${id}`, negative: 'Moins', positive: 'Plus' });
  const theme = themes[0];

  it('acceptent 2 ou 3 dimensions', () => {
    expect(ThemeSchema.safeParse({ ...theme, dimensions: [dim('a'), dim('b')] }).error).toBeUndefined();
    expect(ThemeSchema.safeParse({ ...theme, dimensions: [dim('a'), dim('b'), dim('c')] }).error).toBeUndefined();
  });

  it('refusent une seule dimension', () => {
    expect(ThemeSchema.safeParse({ ...theme, dimensions: [dim('a')] }).success).toBe(false);
  });

  it('refusent des identifiants de dimension en double', () => {
    expect(ThemeSchema.safeParse({ ...theme, dimensions: [dim('a'), dim('a')] }).success).toBe(false);
  });

  it('refusent une clé inconnue dans une dimension', () => {
    expect(ThemeSchema.safeParse({ ...theme, dimensions: [{ ...dim('a'), couleur: 'rouge' }, dim('b')] }).success).toBe(false);
  });

  it('refusent un libellé de plus de 60 caractères', () => {
    expect(ThemeSchema.safeParse({ ...theme, dimensions: [{ ...dim('a'), label: 'x'.repeat(61) }, dim('b')] }).success).toBe(false);
  });

  it('acceptent une question avec ou sans dimension', () => {
    expect(QuestionSchema.safeParse({ ...questions[0], dimension: 'choix' }).error).toBeUndefined();
    expect(QuestionSchema.safeParse(questions[0]).error).toBeUndefined();
  });

  it('acceptent une question avec ou sans enjeu, et refusent un enjeu mal formé (007)', () => {
    expect(QuestionSchema.safeParse({ ...questions[0], subject: 'salaire-minimum' }).error).toBeUndefined();
    expect(QuestionSchema.safeParse(questions[0]).error).toBeUndefined();
    expect(QuestionSchema.safeParse({ ...questions[0], subject: 'Salaire minimum' }).success).toBe(false);
  });
});

// ── Corpus de preuves (spec 008, contracts/research-files.md) ────────────────
import {
  AttributionConfidenceSchema,
  AttributionSchema,
  CandidacyStatusValueSchema,
  EvidenceSchema,
  GapKindSchema,
  JournalSchema,
  JournalStateSchema,
  LocatorKindSchema,
  PersonalitySchema,
  QualificationSchema,
  QuoteStatusSchema,
  ResearchModeSchema,
  SignalKindSchema,
  SignalSchema,
  SignalStateSchema,
  SourceCategorySchema,
  SourceQualitySchema,
  TemporalRelevanceSchema,
  TranscriptSchema,
} from './index';

const personalities = parse(`
- id: bruno-retailleau
  name: Bruno Retailleau
  party: Les Républicains
  statuses:
    - status: DECLARED
      at: { date: 2026-05-12, precision: day }
      observedAt: 2026-11-22
      evidence:
        - bruno-retailleau-candidature-001
  createdAt: 2026-11-22
  updatedAt: 2026-11-22
- id: jean-exemple
  name: Jean Exemple
  party: Parti exemple
  aliases: [J. Exemple]
  statuses:
    - status: REPORTED_UNCONFIRMED
      at: { date: 2026-09, precision: month }
      observedAt: 2026-11-22
      evidence:
        - jean-exemple-candidature-001
      note: Candidature prêtée par un hebdomadaire, non confirmée par l'intéressé.
  createdAt: 2026-11-22
  updatedAt: 2026-11-22
`);

const evidenceItems = parse(`
- id: bruno-retailleau-immigration-001
  personality: bruno-retailleau
  kind: POSITION
  theme: immigration
  question: immigration-exemple-question
  qualification: QUALIFIED_SUPPORT
  candidacyStatus: DECLARED
  quoteStatus: VERIFIED_QUOTE
  quote: "texte exact retrouvé mot pour mot dans la transcription officielle"
  speaker: Bruno Retailleau
  transcript: official
  context: Entretien intégral, réponse à une question sur le regroupement familial.
  source: bruno-retailleau-entretien-exemple-2026-10
  publisher: Média exemple
  locator: { kind: timestamp, value: "00:12:34" }
  sourceQuality: A_PRIMARY_VERIFIED
  attribution: PERSONAL_DIRECT
  attributionConfidence: HIGH
  temporalRelevance: CURRENT
  period: campagne présidentielle 2027
  statedAt: { date: 2026-10-05, precision: day }
  researchedAt: 2026-11-22
  verifiedAt: 2026-11-22
  journal: 2026-11-22-bruno-retailleau-immigration
  corroborations:
    - source: bruno-retailleau-depeche-exemple-2026-10
      quoteStatus: VERIFIED_QUOTE
      verifiedAt: 2026-11-22
      journal: 2026-11-22-bruno-retailleau-immigration
      note: Dépêche reprenant la même phrase ; non indépendante du média d'origine.
  history:
    - at: 2026-12-03
      field: qualification
      previous: EXPLICIT_SUPPORT
      reason: La suite de l'entretien (00:13:10) pose une condition omise lors de la première lecture.
      journal: 2026-12-03-audit-immigration
  createdAt: 2026-11-22
  updatedAt: 2026-12-03
- id: bruno-retailleau-immigration-002
  personality: bruno-retailleau
  kind: POSITION
  theme: immigration
  quoteStatus: SOURCE_INACCESSIBLE
  speaker: Bruno Retailleau
  context: Tribune signalée par une revue de presse ; article réservé aux abonnés.
  unregisteredSource:
    url: https://exemple.fr/tribune
    title: Tribune exemple
    publisher: Quotidien exemple
    reason: page derrière un paywall, non contournée (FR-049)
  publisher: Quotidien exemple
  sourceQuality: D_UNVERIFIED_OR_INACCESSIBLE
  attribution: UNKNOWN_ATTRIBUTION
  attributionConfidence: UNCONFIRMED
  temporalRelevance: UNDETERMINED
  statedAt: unknown
  researchedAt: 2026-11-22
  verifiedAt: 2026-11-22
  journal: 2026-11-22-bruno-retailleau-immigration
  createdAt: 2026-11-22
  updatedAt: 2026-11-22
`);

const journal = parse(`
id: 2026-11-22-bruno-retailleau-immigration
mode: PERSONALITY
author: claude
model: opus
request: Rechercher les positions de Bruno Retailleau sur l'immigration (test d'installation).
startedAt: 2026-11-22
completedAt: 2026-11-22
state: completed
scope:
  personalities: [bruno-retailleau]
  themes: [immigration]
  questions: []
queries:
  - { at: 2026-11-22, query: '"Bruno Retailleau" "regroupement familial"', category: NATIONAL_MEDIA, tool: web_search }
  - { at: 2026-11-22, query: 'site:senat.fr Retailleau immigration amendement', category: SENAT, tool: web_search }
categoriesExplored: [EXISTING_CORPUS, CAMPAIGN_SITE, SENAT, FULL_INTERVIEWS, NATIONAL_MEDIA]
categoriesNotExplored:
  - { category: SOCIAL_MEDIA, reason: comptes non consultables sans authentification }
exhaustive: false
sourcesConsulted:
  - { url: https://exemple.fr/entretien, title: Entretien exemple, outcome: retained, source: bruno-retailleau-entretien-exemple-2026-10 }
  - { url: https://exemple.fr/agregateur, title: Site de citations, outcome: rejected, reason: agrégateur sans source d'origine }
evidenceAdded: [bruno-retailleau-immigration-001, bruno-retailleau-immigration-002]
verified: ["Citation 001 retrouvée dans la transcription officielle à 00:12:34."]
toVerify: ["Tribune 002 : texte original inaccessible."]
gaps:
  - kind: PRIMARY_INACCESSIBLE
    personality: bruno-retailleau
    theme: immigration
    evidence: [bruno-retailleau-immigration-002]
    note: Tribune réservée aux abonnés ; aucune reprise intégrale trouvée.
signals: []
`);

const signals = parse(`
- id: sig-2026-11-22-retailleau-immigration-exemple
  kind: POSITION_REVIEW
  raisedAt: 2026-11-22
  journal: 2026-11-22-bruno-retailleau-immigration
  personality: bruno-retailleau
  position: { candidate: bruno-retailleau, question: immigration-exemple-question }
  evidence: [bruno-retailleau-immigration-001]
  reason: "Position relue à -1 ; l'entretien du 2026-10-05 (00:12:34) dit « … » : soutien explicite."
  state: resolved
  resolution: { at: 2026-11-25, by: adrien, decision: Position corrigée par la PR de données. }
`);

describe('schémas du corpus de preuves (spec 008)', () => {
  it('acceptent les exemples du contrat', () => {
    for (const p of personalities) expect(PersonalitySchema.safeParse(p).success).toBe(true);
    for (const e of evidenceItems) expect(EvidenceSchema.safeParse(e).error).toBeUndefined();
    expect(JournalSchema.safeParse(journal).error).toBeUndefined();
    for (const s of signals) expect(SignalSchema.safeParse(s).error).toBeUndefined();
  });

  it.each([
    ['statut de candidature', CandidacyStatusValueSchema],
    ['statut de citation', QuoteStatusSchema],
    ['qualité de source', SourceQualitySchema],
    ['attribution', AttributionSchema],
    ['confiance', AttributionConfidenceSchema],
    ['qualification', QualificationSchema],
    ['pertinence temporelle', TemporalRelevanceSchema],
    ['transcription', TranscriptSchema],
    ['localisation', LocatorKindSchema],
    ['mode', ResearchModeSchema],
    ['catégorie', SourceCategorySchema],
    ['lacune', GapKindSchema],
    ['signalement', SignalKindSchema],
    ['état du journal', JournalStateSchema],
    ['état du signalement', SignalStateSchema],
  ])('liste fermée (%s) : valeur hors liste refusée', (_, schema) => {
    expect(schema.safeParse('HORS_LISTE').success).toBe(false);
  });

  it('tailles des listes fermées', () => {
    expect(CandidacyStatusValueSchema.options).toHaveLength(8);
    expect(QuoteStatusSchema.options).toHaveLength(4);
    expect(SourceQualitySchema.options).toHaveLength(4);
    expect(AttributionSchema.options).toHaveLength(9);
    expect(AttributionConfidenceSchema.options).toHaveLength(4);
    expect(QualificationSchema.options).toHaveLength(8);
    expect(TemporalRelevanceSchema.options).toHaveLength(4);
    expect(LocatorKindSchema.options).toHaveLength(6);
    expect(ResearchModeSchema.options).toHaveLength(5);
    expect(SourceCategorySchema.options).toHaveLength(21);
    expect(GapKindSchema.options).toHaveLength(10);
    expect(SignalKindSchema.options).toHaveLength(5);
  });

  it('rejettent une clé inconnue sur chaque objet', () => {
    expect(PersonalitySchema.safeParse({ ...personalities[0], extra: 1 }).success).toBe(false);
    expect(PersonalitySchema.safeParse({ ...personalities[0], statuses: [{ ...personalities[0].statuses[0], extra: 1 }] }).success).toBe(false);
    const e = evidenceItems[0];
    expect(EvidenceSchema.safeParse({ ...e, extra: 1 }).success).toBe(false);
    expect(EvidenceSchema.safeParse({ ...e, locator: { ...e.locator, extra: 1 } }).success).toBe(false);
    expect(EvidenceSchema.safeParse({ ...e, corroborations: [{ ...e.corroborations[0], extra: 1 }] }).success).toBe(false);
    expect(EvidenceSchema.safeParse({ ...e, history: [{ ...e.history[0], extra: 1 }] }).success).toBe(false);
    expect(EvidenceSchema.safeParse({ ...e, rationale: { autre: 'x' } }).success).toBe(false);
    expect(EvidenceSchema.safeParse({ ...evidenceItems[1], unregisteredSource: { ...evidenceItems[1].unregisteredSource, extra: 1 } }).success).toBe(false);
    expect(JournalSchema.safeParse({ ...journal, extra: 1 }).success).toBe(false);
    expect(JournalSchema.safeParse({ ...journal, scope: { ...journal.scope, extra: [] } }).success).toBe(false);
    expect(JournalSchema.safeParse({ ...journal, gaps: [{ ...journal.gaps[0], extra: 1 }] }).success).toBe(false);
    expect(SignalSchema.safeParse({ ...signals[0], extra: 1 }).success).toBe(false);
    expect(SignalSchema.safeParse({ ...signals[0], resolution: { ...signals[0].resolution, extra: 1 } }).success).toBe(false);
  });

  it('009 : lead facultatif { url, title } strict sur une preuve', () => {
    const lead = { url: 'https://candidatspresidentielles2027.fr/dupont', title: 'Fiche agrégateur' };
    expect(EvidenceSchema.safeParse({ ...evidenceItems[0], lead }).success).toBe(true);
    expect(EvidenceSchema.safeParse({ ...evidenceItems[0], lead: { ...lead, extra: 1 } }).success).toBe(false);
    expect(EvidenceSchema.safeParse({ ...evidenceItems[0], lead: { url: 'pas une url', title: 'x' } }).success).toBe(false);
  });

  it('statedAt : unknown ou date avec précision, jamais une autre chaîne', () => {
    expect(EvidenceSchema.safeParse({ ...evidenceItems[1], statedAt: 'inconnue' }).success).toBe(false);
    expect(EvidenceSchema.safeParse({ ...evidenceItems[1], statedAt: { date: 2026, precision: 'year' } }).success).toBe(true);
  });

  it('personnalité sans statut refusée', () => {
    expect(PersonalitySchema.safeParse({ ...personalities[0], statuses: [] }).success).toBe(false);
  });
});
