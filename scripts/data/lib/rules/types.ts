// Types partagés des règles de validation (research.md R4, contracts/corpus-files.md).
import type { MainDataset, VersionRegistry } from '@/core/dataset';
import type { Affirmation, Corpus, Research, Thresholds } from '../schema';

export type Severity = 'error' | 'warning';

export type EntityKind = 'file' | 'theme' | 'contributor' | 'candidate' | 'question' | 'source' | 'position' | 'criterion' | 'version' | 'bank' | 'personality' | 'evidence' | 'journal' | 'signal' | 'term';

/** Une faute désigne toujours l'identifiant de l'élément fautif. */
export type Violation = {
  rule: string;
  severity: Severity;
  entity: { kind: EntityKind; id: string };
  message: string;
};

export type Warning = Violation & { severity: 'warning' };

/** Accès en lecture au cache des textes de sources (texte normalisé par empreinte). */
export type SourceCache = {
  dir: string;
  /** Texte en cache pour l'empreinte `sha256:<hex>`, `null` si absent. */
  read(hash: string): string | null;
};

/** Fichiers publiés sous `public/data` (chemins relatifs, taille et empreinte précalculées). */
export type PublishedView = {
  registry: VersionRegistry;
  /** `main.json` de la version courante, `null` si aucune version. */
  current: MainDataset | null;
  /** `versions/<n>/main.json` → { taille, empreinte } ; `versions.json` inclus. */
  files: Map<string, { bytes: number; hash: string }>;
};

/** Provenance de l'extraction, si `data/extractions/` est présent. */
export type ExtractionsView = {
  runs: Set<string>;
  affirmations: Map<string, Affirmation[]>;
};

export type RuleContext = {
  corpus: Corpus;
  cache?: SourceCache;
  published?: PublishedView;
  extractions?: ExtractionsView;
  thresholds: Thresholds;
  /** Corpus de preuves `data/recherche/` (spec 008) ; absent ⇒ les règles `RECH-*` ne contrôlent rien. */
  research?: Research;
  /** Texte de `public/data/glossary.json` s'il existe (spec 009) : la règle GLOSS vérifie qu'il suit le corpus. */
  publishedGlossary?: string;
};

export type Rule = { code: string; run: (ctx: RuleContext) => Violation[] };

export function violation(rule: string, kind: EntityKind, id: string, message: string): Violation {
  return { rule, severity: 'error', entity: { kind, id }, message };
}

export function warning(rule: string, kind: EntityKind, id: string, message: string): Warning {
  return { rule, severity: 'warning', entity: { kind, id }, message };
}
