// @vitest-environment node
import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { annotate, compileGlossary, normalizeForm, type GlossaryTermForms, type Segment } from './annotate';

const WORD = /[\p{L}\p{N}]/u;

const terms = (list: Array<[string, string[]]>): GlossaryTermForms[] => list.map(([id, forms]) => ({ id, forms }));
const termTexts = (segments: readonly Segment[]) => segments.filter((s) => s.kind === 'term').map((s) => [s.text, (s as { termId: string }).termId]);

/** Correspondance de référence, écrite indépendamment : comparaison caractère par caractère. */
function refMatches(text: string, pos: number, rawForm: string): boolean {
  const form = normalizeForm(rawForm);
  if (form === '' || pos + form.length > text.length) return false;
  const span = text.slice(pos, pos + form.length).replace(/’/g, "'").replace(/[  ]/g, ' ');
  const spanKey = span.charAt(0).toLocaleLowerCase('fr') + span.slice(1);
  if (spanKey !== form) return false;
  const before = pos === 0 ? '' : text.charAt(pos - 1);
  const after = text.charAt(pos + form.length);
  return !WORD.test(before) && !WORD.test(after);
}

// Petit alphabet pour que formes et textes se recouvrent souvent.
const unit = fc.constantFrom('a', 'b', 'A', ' ', "'", '’', ' ', '-', 'é', '1');
const formArb = fc.string({ unit: fc.constantFrom('a', 'b', 'A', ' ', "'", 'é'), minLength: 1, maxLength: 5 }).filter((f) => normalizeForm(f) !== '' && WORD.test(f.trim().charAt(0)) && WORD.test(f.trim().slice(-1)));
const glossaryArb = fc
  .array(fc.array(formArb, { minLength: 1, maxLength: 3 }), { maxLength: 5 })
  .map((groups) => {
    const seen = new Set<string>();
    return groups
      .map((forms, i) => ({ id: `t${i}`, forms: forms.filter((f) => !seen.has(normalizeForm(f)) && (seen.add(normalizeForm(f)), true)) }))
      .filter((t) => t.forms.length > 0);
  });
const textArb = fc.string({ unit, maxLength: 40 });

describe('annotate — propriétés', () => {
  it('la concaténation des segments redonne le texte', () => {
    fc.assert(
      fc.property(glossaryArb, textArb, (g, text) => {
        expect(annotate(text, compileGlossary(g)).map((s) => s.text).join('')).toBe(text);
      }),
    );
  });

  it('chaque terme est signalé au plus une fois', () => {
    fc.assert(
      fc.property(glossaryArb, textArb, (g, text) => {
        const ids = annotate(text, compileGlossary(g)).flatMap((s) => (s.kind === 'term' ? [s.termId] : []));
        expect(new Set(ids).size).toBe(ids.length);
      }),
    );
  });

  it('aucun terme n’est bordé par une lettre ou un chiffre, et chaque terme correspond à une de ses formes', () => {
    fc.assert(
      fc.property(glossaryArb, textArb, (g, text) => {
        let pos = 0;
        for (const s of annotate(text, compileGlossary(g))) {
          if (s.kind === 'term') {
            expect(WORD.test(text.charAt(pos - 1) || ' ')).toBe(false);
            expect(WORD.test(text.charAt(pos + s.text.length) || ' ')).toBe(false);
            const term = g.find((t) => t.id === s.termId)!;
            expect(term.forms.some((f) => normalizeForm(f).length === s.text.length && refMatches(text, pos, f))).toBe(true);
          }
          pos += s.text.length;
        }
      }),
    );
  });

  it('à la position d’un terme, aucune forme plus longue ne correspond', () => {
    fc.assert(
      fc.property(glossaryArb, textArb, (g, text) => {
        const forms = g.flatMap((t) => t.forms);
        let pos = 0;
        for (const s of annotate(text, compileGlossary(g))) {
          if (s.kind === 'term') {
            const longer = forms.filter((f) => normalizeForm(f).length > s.text.length && refMatches(text, pos, f));
            expect(longer).toEqual([]);
          }
          pos += s.text.length;
        }
      }),
    );
  });

  it('glossaire vide → un seul segment texte', () => {
    fc.assert(
      fc.property(textArb, (text) => {
        expect(annotate(text, compileGlossary([]))).toEqual([{ kind: 'text', text }]);
      }),
    );
  });
});

describe('annotate — cas fixes', () => {
  const index = compileGlossary(
    terms([
      ['droit-du-sol', ['droit du sol']],
      ['droit', ['droit']],
      ['aide-medicale-etat', ["aide médicale de l'État", 'AME']],
      ['quarante-neuf-trois', ['49.3']],
    ]),
  );

  it('« droit du sol » l’emporte sur « droit »', () => {
    expect(termTexts(annotate('Faut-il supprimer le droit du sol ?', index))).toEqual([['droit du sol', 'droit-du-sol']]);
  });

  it('« droit » seul est signalé hors de « droit du sol »', () => {
    expect(termTexts(annotate('Le droit du sol et le droit d’asile', index))).toEqual([
      ['droit du sol', 'droit-du-sol'],
      ['droit', 'droit'],
    ]);
  });

  it('« AME » ne correspond pas à « âme » ni à « Ame »', () => {
    expect(termTexts(annotate('Une âme bien née, Ame, AME.', index))).toEqual([['AME', 'aide-medicale-etat']]);
  });

  it('« Droit du sol » en début de phrase', () => {
    const segments = annotate('Droit du sol : faut-il le restreindre ?', index);
    expect(segments[0]).toEqual({ kind: 'term', text: 'Droit du sol', termId: 'droit-du-sol' });
  });

  it('apostrophes typographique et droite', () => {
    expect(termTexts(annotate('Supprimer l’aide médicale de l’État ?', index))).toEqual([['aide médicale de l’État', 'aide-medicale-etat']]);
    expect(termTexts(annotate("Supprimer l'aide médicale de l'État ?", index))).toEqual([["aide médicale de l'État", 'aide-medicale-etat']]);
  });

  it('seule la première occurrence est signalée', () => {
    const segments = annotate('L’AME coûte ; réformer l’AME ?', index);
    expect(termTexts(segments)).toEqual([['AME', 'aide-medicale-etat']]);
    expect(segments.map((s) => s.text).join('')).toBe('L’AME coûte ; réformer l’AME ?');
  });

  it('une seconde occurrence d’un terme déjà signalé ne laisse pas passer une forme plus courte', () => {
    expect(termTexts(annotate('droit du sol, droit du sol', index))).toEqual([['droit du sol', 'droit-du-sol']]);
  });

  it('espace insécable dans l’énoncé', () => {
    expect(termTexts(annotate('Le droit du sol ?', index))).toEqual([['droit du sol', 'droit-du-sol']]);
  });

  it('sigle avec chiffres et ponctuation interne', () => {
    expect(termTexts(annotate('Limiter le 49.3 ?', index))).toEqual([['49.3', 'quarante-neuf-trois']]);
    expect(termTexts(annotate('Limiter le 149.3 ?', index))).toEqual([]);
  });

  it('pas de correspondance à l’intérieur d’un mot', () => {
    expect(termTexts(annotate('Les droits acquis, AMELIORER', index))).toEqual([]);
  });

  it('reste rapide avec 60 termes', () => {
    const many = compileGlossary(Array.from({ length: 60 }, (_, i) => ({ id: `t${i}`, forms: [`terme numéro ${i}`, `T${i}X`] })));
    const text = 'Faut-il instaurer le terme numéro 42 et le T7X dans toutes les communes de plus de dix mille habitants, y compris outre-mer ?';
    const start = performance.now();
    for (let k = 0; k < 1000; k++) annotate(text, many);
    expect((performance.now() - start) / 1000).toBeLessThan(1);
  });
});

describe('normalizeForm', () => {
  it('ramène apostrophes, espaces et première lettre', () => {
    expect(normalizeForm('  Aide médicale de l’État ')).toBe("aide médicale de l'État");
    expect(normalizeForm('AME')).toBe('aME');
    expect(normalizeForm('droit du sol')).toBe('droit du sol');
  });
});
