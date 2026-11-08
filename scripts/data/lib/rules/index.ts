// Liste ordonnée des règles (ordre du tableau de contracts/corpus-files.md).
import type { Rule, RuleContext, Violation, Warning } from './types';

export const RULES: Rule[] = [];

/** Exécute toutes les règles et sépare violations (bloquantes) et avertissements. */
export function runRules(ctx: RuleContext, rules: Rule[] = RULES): { violations: Violation[]; warnings: Warning[] } {
  const violations: Violation[] = [];
  const warnings: Warning[] = [];
  for (const rule of rules) {
    for (const v of rule.run(ctx)) {
      if (v.severity === 'warning') warnings.push(v as Warning);
      else violations.push(v);
    }
  }
  return { violations, warnings };
}
