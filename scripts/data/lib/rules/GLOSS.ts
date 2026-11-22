// GLOSS (spec 009, FR-013 à FR-015, R12) : termes du glossaire `data/corpus/glossaire.yaml`.
// Ne s'exécute que si le fichier existe.
// Erreurs : identifiant en double ; aucune forme ; forme en double après normalisation (dans un
// terme ou entre termes) ; définition vide ou de plus de 280 caractères ; aucune source ; URL
// invalide ; aucune source sur un domaine institutionnel (si `institutionalDomains` est déclaré) ;
// relecture incomplète ou par l'auteur ; contributeur inconnu ; `glossary.json` désynchronisé.
// Avertissements : terme relu absent des énoncés des questions actives du corpus ; source
// supplémentaire hors des domaines institutionnels.
// La neutralité d'une définition relève de la relecture du propriétaire, pas de cette règle.
import { MAX_DEFINITION_LENGTH } from '@/core/dataset';
import { annotate, compileGlossary, normalizeForm } from '@/lib/glossary/annotate';
import { allQuestions } from '../corpus';
import { buildPublishedGlossary, parsePublishedGlossary, sameGlossaryContent } from '../glossary';
import { violation, warning, type Rule, type Violation } from './types';

const CODE = 'GLOSS';

function hostOf(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return null;
    return parsed.hostname.toLowerCase();
  } catch {
    return null;
  }
}

/** Hôte relevant d'un domaine déclaré : hôte exact ou sous-domaine ; `*.x` : sous-domaine de `x`. */
export function matchesDomain(host: string, domain: string): boolean {
  if (domain.startsWith('*.')) return host.endsWith(domain.slice(1));
  return host === domain || host.endsWith(`.${domain}`);
}

export const GLOSS: Rule = {
  code: CODE,
  run({ corpus, publishedGlossary }) {
    const entries = corpus.glossary;
    if (!entries) return [];
    const out: Violation[] = [];
    const contributors = new Set(corpus.contributors.map((c) => c.id));
    const domains = corpus.governance?.institutionalDomains;

    const seenIds = new Set<string>();
    const formOwner = new Map<string, string>();
    for (const term of entries) {
      const err = (message: string) => out.push(violation(CODE, 'term', term.id, `${term.id} : ${message}`));
      if (seenIds.has(term.id)) err('identifiant en double');
      seenIds.add(term.id);

      if (term.forms.length === 0) err('aucune forme');
      const ownForms = new Set<string>();
      for (const form of term.forms) {
        const key = normalizeForm(form);
        if (key === '') {
          err('forme vide');
          continue;
        }
        if (ownForms.has(key)) {
          err(`forme « ${form} » en double dans le terme`);
          continue;
        }
        ownForms.add(key);
        const owner = formOwner.get(key);
        if (owner !== undefined && owner !== term.id) err(`forme « ${form} » déjà déclarée par ${owner}`);
        else formOwner.set(key, term.id);
      }

      const length = [...term.definition.trim()].length;
      if (length === 0) err('définition vide');
      else if (length > MAX_DEFINITION_LENGTH) err(`définition de ${length} caractères (au plus ${MAX_DEFINITION_LENGTH})`);

      if (term.sources.length === 0) err('aucune source');
      const hosts: Array<string | null> = term.sources.map((s) => hostOf(s.url));
      term.sources.forEach((s, i) => {
        if (hosts[i] === null) err(`URL de source invalide : ${s.url}`);
      });
      if (domains && term.sources.length > 0) {
        const institutional = hosts.map((h) => h !== null && domains.some((d) => matchesDomain(h, d)));
        if (!institutional.some(Boolean)) err('aucune source sur un domaine institutionnel ou juridique (institutionalDomains)');
        else
          term.sources.forEach((s, i) => {
            if (!institutional[i] && hosts[i] !== null) out.push(warning(CODE, 'term', term.id, `${term.id} : source supplémentaire hors des domaines institutionnels : ${s.url}`));
          });
      }

      if (!contributors.has(term.author)) err(`auteur inconnu : ${term.author}`);
      if (term.status === 'reviewed') {
        if (!term.reviewedBy || !term.reviewedAt) err('terme relu sans reviewedBy ni reviewedAt');
        if (term.reviewedBy !== undefined && term.reviewedBy === term.author) err(`relu par son auteur (${term.author})`);
      }
      if (term.reviewedBy !== undefined && !contributors.has(term.reviewedBy)) err(`relecteur inconnu : ${term.reviewedBy}`);
    }

    // Terme relu absent des énoncés des questions actives du corpus (repérage R10).
    const index = compileGlossary(entries);
    const found = new Set<string>();
    for (const { question } of allQuestions(corpus)) {
      if (question.status !== 'active') continue;
      for (const segment of annotate(question.text, index)) if (segment.kind === 'term') found.add(segment.termId);
    }
    for (const term of entries) {
      if (term.status === 'reviewed' && !found.has(term.id)) out.push(warning(CODE, 'term', term.id, `${term.id} : absent des énoncés des questions actives`));
    }

    // Fichier publié : identique, hors `updatedAt`, à ce que produirait `pnpm data:glossary`.
    if (publishedGlossary !== undefined) {
      const published = parsePublishedGlossary(publishedGlossary);
      if (!published) out.push(violation(CODE, 'file', 'glossary.json', 'glossary.json illisible ou invalide'));
      else if (!sameGlossaryContent(published, buildPublishedGlossary(entries, published.updatedAt)))
        out.push(violation(CODE, 'file', 'glossary.json', 'glossary.json ne suit pas glossaire.yaml : relancer pnpm data:glossary'));
    }
    return out;
  },
};
