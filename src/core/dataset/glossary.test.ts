// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { GlossarySchema, type Glossary } from './glossary';

const valid = (): Glossary => ({
  updatedAt: '2026-11-22',
  terms: [
    {
      id: 'droit-du-sol',
      label: 'droit du sol',
      forms: ['droit du sol'],
      definition: 'Règle qui attribue une nationalité en raison de la naissance sur le territoire.',
      sources: [{ url: 'https://www.vie-publique.fr/', title: 'Nationalité', publisher: 'Vie-publique.fr' }],
    },
  ],
});

describe('GlossarySchema', () => {
  it('accepte un glossaire conforme', () => {
    expect(GlossarySchema.safeParse(valid()).error).toBeUndefined();
  });

  it('accepte un glossaire vide', () => {
    expect(GlossarySchema.safeParse({ updatedAt: '2026-11-22', terms: [] }).success).toBe(true);
  });

  it('accepte exactement 280 caractères', () => {
    const g = valid();
    g.terms[0]!.definition = 'a'.repeat(280);
    expect(GlossarySchema.safeParse(g).success).toBe(true);
  });

  it.each<[string, (g: Glossary) => void]>([
    ['aucune forme', (g) => void (g.terms[0]!.forms = [])],
    ['définition vide', (g) => void (g.terms[0]!.definition = '')],
    ['définition de plus de 280 caractères', (g) => void (g.terms[0]!.definition = 'a'.repeat(281))],
    ['aucune source', (g) => void (g.terms[0]!.sources = [])],
    ['URL invalide', (g) => void (g.terms[0]!.sources[0]!.url = 'pas une url')],
    ['identifiant non kebab-case', (g) => void (g.terms[0]!.id = 'Droit du sol')],
    ['identifiant en double', (g) => void g.terms.push({ ...g.terms[0]! })],
    ['clé inconnue', (g) => void ((g.terms[0] as Record<string, unknown>).status = 'reviewed')],
    ['date invalide', (g) => void (g.updatedAt = '22/11/2026')],
  ])('refuse : %s', (_, mutate) => {
    const g = valid();
    mutate(g);
    expect(GlossarySchema.safeParse(g).success).toBe(false);
  });
});
