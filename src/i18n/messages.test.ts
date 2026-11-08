import { describe, expect, it } from 'vitest';
import fr from './messages/fr.json';

/** Clés requises par le socle (contracts/i18n-messages.md). */
const REQUIRED_KEYS = [
  'common.siteName',
  'common.skipToContent',
  'common.appearance.toggle',
  'common.appearance.light',
  'common.appearance.dark',
  'common.footer.methodology',
  'common.footer.about',
  'home.title',
  'home.lead',
  'home.privacy',
  'home.cta',
  'home.ctaSoon',
  'ui.likert.stronglyDisagree',
  'ui.likert.disagree',
  'ui.likert.neutral',
  'ui.likert.agree',
  'ui.likert.stronglyAgree',
  'ui.likert.skip',
  'ui.themePicker.counter',
  'ui.themePicker.maxReached',
  'ui.themePicker.minNotReached',
  'ui.scoreBar.undefined',
  'ui.scoreBar.unavailable',
  'ui.evidence.programme',
  'ui.evidence.livrePlateforme',
  'ui.evidence.declarationVote',
  // Fonctionnalité 002 : page Méthodologie et composants PositionCard / CoverageList.
  'methodology.title',
  'methodology.description',
  'methodology.intro',
  'methodology.rules.title',
  'methodology.rules.traceability',
  'methodology.rules.review',
  'methodology.rules.draft',
  'methodology.rules.versioned',
  'methodology.evidenceLevels.title',
  'methodology.themes.title',
  'methodology.themes.axis',
  'methodology.neutrality.title',
  'methodology.inclusion.title',
  'methodology.candidates.title',
  'methodology.withdrawn.title',
  'methodology.withdrawn.item',
  'methodology.version.title',
  'methodology.version.summary',
  'methodology.noVersion',
  'methodology.report.cta',
  'methodology.report.positionTitle',
  'methodology.license',
  'methodology.backToList',
  'ui.positionCard.value.minus2',
  'ui.positionCard.value.minus1',
  'ui.positionCard.value.zero',
  'ui.positionCard.value.plus1',
  'ui.positionCard.value.plus2',
  'ui.positionCard.old',
  'ui.positionCard.quoteLabel',
  'ui.positionCard.justificationLabel',
  'ui.positionCard.sources',
  'ui.positionCard.publishedOn.day',
  'ui.positionCard.publishedOn.month',
  'ui.positionCard.publishedOn.year',
  'ui.positionCard.accessedOn',
  'ui.positionCard.report',
  'ui.positionCard.scaleLabel',
  'ui.coverageList.coverage',
  'ui.coverageList.coverageLabel',
  'ui.coverageList.status.declared',
  'ui.coverageList.viewPositions',
];

type Tree = { [key: string]: string | Tree };

function flatten(tree: Tree, prefix = ''): Array<[string, string]> {
  return Object.entries(tree).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof value === 'string' ? [[path, value] as [string, string]] : flatten(value, path);
  });
}

const entries = flatten(fr as Tree);
const byKey = new Map(entries);

// Espace insécable (U+00A0) ou fine insécable (U+202F) attendue devant la ponctuation haute.
const NBSP = '[  ]';
const HIGH_PUNCTUATION = /[?!:;]/g;

describe('messages fr', () => {
  it('contient toutes les clés requises par le socle, non vides', () => {
    for (const key of REQUIRED_KEYS) {
      expect(byKey.has(key), `clé manquante : ${key}`).toBe(true);
      expect(byKey.get(key)?.trim().length, `valeur vide : ${key}`).toBeGreaterThan(0);
    }
  });

  it('n’a aucune valeur vide', () => {
    for (const [key, value] of entries) {
      expect(value.trim().length, `valeur vide : ${key}`).toBeGreaterThan(0);
    }
  });

  it('respecte la typographie française (insécable devant ? ! : ;)', () => {
    for (const [key, value] of entries) {
      for (const match of value.matchAll(HIGH_PUNCTUATION)) {
        const index = match.index ?? 0;
        const previous = value[index - 1] ?? '';
        const isAfterSpace = previous === ' ';
        const isAfterNbsp = new RegExp(`^${NBSP}$`).test(previous);
        expect(isAfterSpace, `${key} : espace sécable devant « ${match[0]} »`).toBe(false);
        if (index > 0 && !/[\w\d)}]/.test(previous)) {
          expect(isAfterNbsp, `${key} : « ${match[0]} » sans insécable`).toBe(true);
        }
      }
      // Une ponctuation haute précédée d'un caractère (ex. « vous ? ») doit avoir l'insécable.
      expect(value, `${key} : ponctuation haute collée ou mal espacée`).not.toMatch(
        new RegExp(`[A-Za-zÀ-ÿ][?!;]|[A-Za-zÀ-ÿ]:\\s`),
      );
    }
  });

  it('utilise les guillemets français et l’apostrophe typographique (sûre pour ICU)', () => {
    for (const [key, value] of entries) {
      expect(value, `${key} : guillemet droit`).not.toMatch(/"/);
      expect(value, `${key} : apostrophe droite (ambiguë en ICU MessageFormat)`).not.toMatch(/'/);
    }
  });
});
