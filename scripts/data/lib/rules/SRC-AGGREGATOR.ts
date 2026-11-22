// SRC-AGGREGATOR (spec 009 FR-011, SC-004, R8) : un agrégateur n'est jamais une source.
// Erreurs : une source du registre `corpus/sources/` dont l'hôte est un domaine de
// `aggregatorDomains` (ou un sous-domaine), et une preuve dont `unregisteredSource.url` en est un.
// Non contrôlés : `lead` d'une preuve et `sourcesConsulted` d'un journal (pistes).
// Muette si `aggregatorDomains` est absent de governance.yaml (fixtures historiques).
import { allSources } from '../corpus';
import { violation, type Rule, type Violation } from './types';

/** Domaine d'agrégateur correspondant à l'URL (hôte exact ou sous-domaine), sinon `null`. */
export function aggregatorOf(url: string, domains: readonly string[]): string | null {
  let host: string;
  try {
    host = new URL(url).hostname.toLowerCase().replace(/\.$/, '');
  } catch {
    return null;
  }
  return domains.find((d) => host === d || host.endsWith(`.${d}`)) ?? null;
}

export const SRC_AGGREGATOR: Rule = {
  code: 'SRC-AGGREGATOR',
  run({ corpus, research }) {
    const domains = corpus.governance?.aggregatorDomains;
    if (!domains || domains.length === 0) return [];
    const out: Violation[] = [];
    for (const { source } of allSources(corpus)) {
      const d = aggregatorOf(source.url, domains);
      if (d) out.push(violation('SRC-AGGREGATOR', 'source', source.id, `${source.id} : ${source.url} relève de l'agrégateur ${d}, jamais citable comme source (le consigner en piste, champ lead d'une preuve)`));
    }
    for (const list of research?.evidence.values() ?? []) {
      for (const e of list) {
        const url = e.unregisteredSource?.url;
        const d = url ? aggregatorOf(url, domains) : null;
        if (d) out.push(violation('SRC-AGGREGATOR', 'evidence', e.id, `${e.id} : source non enregistrée ${url} relevant de l'agrégateur ${d} ; chercher la source primaire`));
      }
    }
    return out;
  },
};
