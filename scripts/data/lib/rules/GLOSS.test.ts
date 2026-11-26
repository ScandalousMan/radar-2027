// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { buildPublishedGlossary, serializeGlossary } from '../glossary';
import type { GlossaryEntry } from '../schema';
import { GLOSS, matchesDomain } from './GLOSS';
import { minimalContext } from './testing';
import type { RuleContext } from './types';

function ctx(): RuleContext & { corpus: { glossary: GlossaryEntry[] } } {
  const c = minimalContext({ cache: false });
  if (!c.corpus.glossary) throw new Error('glossaire de la fixture minimale absent');
  return c as RuleContext & { corpus: { glossary: GlossaryEntry[] } };
}

const errors = (c: RuleContext) => GLOSS.run(c).filter((v) => v.severity === 'error');
const warnings = (c: RuleContext) => GLOSS.run(c).filter((v) => v.severity === 'warning');
const term = (c: ReturnType<typeof ctx>, id: string) => c.corpus.glossary.find((t) => t.id === id)!;

describe('GLOSS', () => {
  it('fixture minimale : aucune erreur, aucun avertissement', () => {
    expect(GLOSS.run(ctx())).toEqual([]);
  });

  it('glossaire absent : aucune vérification', () => {
    const c = ctx();
    delete (c.corpus as { glossary?: unknown }).glossary;
    expect(GLOSS.run(c)).toEqual([]);
  });

  it.each<[string, (c: ReturnType<typeof ctx>) => void, RegExp]>([
    ['identifiant en double', (c) => void c.corpus.glossary.push({ ...term(c, 'theme-sante'), forms: ['autre forme'] }), /identifiant en double/],
    ['aucune forme', (c) => void (term(c, 'theme-sante').forms = []), /aucune forme/],
    ['forme en double dans un terme (après normalisation)', (c) => void (term(c, 'theme-sante').forms = ['thème Santé', 'Thème Santé']), /en double dans le terme/],
    ['forme en double entre deux termes', (c) => void term(c, 'theme-economie').forms.push('Thème Santé'), /déjà déclarée par theme-/],
    ['définition vide', (c) => void (term(c, 'theme-sante').definition = '  '), /définition vide/],
    ['définition de plus de 280 caractères', (c) => void (term(c, 'theme-sante').definition = 'a'.repeat(281)), /281 caractères/],
    ['aucune source', (c) => void (term(c, 'theme-sante').sources = []), /aucune source$/],
    ['URL invalide', (c) => void (term(c, 'theme-sante').sources[0]!.url = 'legifrance.gouv.fr/x'), /URL de source invalide/],
    ['relu sans reviewedAt', (c) => void delete term(c, 'theme-sante').reviewedAt, /sans reviewedBy ni reviewedAt/],
    ['relu sans reviewedBy', (c) => void delete term(c, 'theme-sante').reviewedBy, /sans reviewedBy ni reviewedAt/],
    ['relu par son auteur', (c) => void (term(c, 'theme-sante').reviewedBy = 'adrien'), /relu par son auteur/],
    ['auteur inconnu', (c) => void (term(c, 'theme-sante').author = 'inconnu'), /auteur inconnu/],
    ['relecteur inconnu', (c) => void (term(c, 'theme-sante').reviewedBy = 'inconnu'), /relecteur inconnu/],
    [
      'aucune source institutionnelle',
      (c) => void (term(c, 'theme-sante').sources = [{ url: 'https://www.exemple-militant.org/x', title: 'T', publisher: 'P', accessedAt: '2026-11-22' }]),
      /aucune source sur un domaine institutionnel/,
    ],
  ])('erreur : %s, qui nomme le terme', (_, mutate, message) => {
    const c = ctx();
    mutate(c);
    const vs = errors(c);
    expect(vs.length).toBeGreaterThan(0);
    expect(vs.some((v) => v.entity.kind === 'term' && message.test(v.message))).toBe(true);
    for (const v of vs) expect(v.message.startsWith(`${v.entity.id} : `)).toBe(true);
  });

  it('« droit » et « droit du sol » ne sont pas en conflit', () => {
    const c = ctx();
    term(c, 'theme-sante').forms = ['droit du sol'];
    term(c, 'theme-economie').forms = ['droit'];
    expect(errors(c)).toEqual([]);
  });

  it('*.gouv.fr reconnu pour un sous-domaine', () => {
    const c = ctx();
    term(c, 'theme-sante').sources[0]!.url = 'https://www.interieur.gouv.fr/exemple';
    expect(errors(c)).toEqual([]);
    expect(matchesDomain('www.interieur.gouv.fr', '*.gouv.fr')).toBe(true);
    expect(matchesDomain('gouv.fr.exemple.org', '*.gouv.fr')).toBe(false);
    expect(matchesDomain('www.service-public.fr', 'service-public.fr')).toBe(true);
    expect(matchesDomain('notservice-public.fr', 'service-public.fr')).toBe(false);
  });

  it('institutionalDomains absent : contrôle institutionnel ignoré', () => {
    const c = ctx();
    delete c.corpus.governance!.institutionalDomains;
    term(c, 'theme-sante').sources = [{ url: 'https://www.exemple.org/x', title: 'T', publisher: 'P', accessedAt: '2026-11-22' }];
    expect(GLOSS.run(c)).toEqual([]);
  });

  it('avertissement : source supplémentaire hors des domaines institutionnels', () => {
    const c = ctx();
    term(c, 'theme-sante').sources.push({ url: 'https://www.exemple-recherche.org/x', title: 'T', publisher: 'P', accessedAt: '2026-11-22' });
    expect(errors(c)).toEqual([]);
    expect(warnings(c)).toEqual([expect.objectContaining({ entity: { kind: 'term', id: 'theme-sante' }, message: expect.stringMatching(/source supplémentaire/) })]);
  });

  it('avertissement : terme relu absent des énoncés des questions actives du corpus', () => {
    const c = ctx();
    term(c, 'theme-sante').forms = ['forme introuvable'];
    expect(warnings(c).map((w) => w.entity.id)).toEqual(['theme-sante']);
    // Un terme en brouillon n'est pas signalé.
    term(c, 'theme-sante').status = 'draft';
    expect(warnings(c)).toEqual([]);
  });

  it('les questions non actives ne comptent pas pour la présence du terme', () => {
    const c = ctx();
    for (const qs of c.corpus.questions.values()) for (const q of qs) if (q.text.includes('thème Santé')) q.status = 'draft';
    expect(warnings(c).map((w) => w.entity.id)).toEqual(['theme-sante']);
  });

  describe('glossary.json publié', () => {
    it('synchronisé (updatedAt différent) : aucune erreur', () => {
      const c = ctx();
      c.publishedGlossary = serializeGlossary(buildPublishedGlossary(c.corpus.glossary, '2020-01-01'));
      expect(errors(c)).toEqual([]);
    });

    it('désynchronisé : erreur sur le fichier', () => {
      const c = ctx();
      c.publishedGlossary = serializeGlossary(buildPublishedGlossary(c.corpus.glossary, '2026-11-22'));
      term(c, 'theme-sante').definition = 'Définition modifiée après publication.';
      expect(errors(c)).toEqual([expect.objectContaining({ entity: { kind: 'file', id: 'glossary.json' } })]);
    });

    it('illisible : erreur sur le fichier', () => {
      const c = ctx();
      c.publishedGlossary = '{';
      expect(errors(c).map((v) => v.entity.id)).toEqual(['glossary.json']);
    });
  });
});

describe('buildPublishedGlossary', () => {
  it('ne publie que les termes relus, triés par libellé, sans champs de relecture', () => {
    const c = ctx();
    c.corpus.glossary.push({ ...term(c, 'theme-sante'), id: 'brouillon', label: 'a brouillon', forms: ['a brouillon'], status: 'draft' });
    c.corpus.glossary.push({ ...term(c, 'theme-sante'), id: 'aide', label: 'Âge légal', forms: ['âge légal'] });
    const g = buildPublishedGlossary(c.corpus.glossary, '2026-11-22');
    expect(g.terms.map((t) => t.id)).toEqual(['aide', 'theme-economie', 'theme-sante']);
    expect(Object.keys(g.terms[0]!)).toEqual(['id', 'label', 'forms', 'definition', 'sources']);
    expect(Object.keys(g.terms[0]!.sources[0]!)).toEqual(['url', 'title', 'publisher']);
  });
});
