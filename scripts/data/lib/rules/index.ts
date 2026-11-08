// Liste ordonnée des règles (ordre du tableau de contracts/corpus-files.md).
import { FR_003 } from './FR-003';
import { FR_004 } from './FR-004';
import { FR_005 } from './FR-005';
import { FR_008 } from './FR-008';
import { FR_009 } from './FR-009';
import { FR_010 } from './FR-010';
import { FR_011 } from './FR-011';
import { FR_012 } from './FR-012';
import { ID_UNIQUE } from './ID-UNIQUE';
import { REF_EXISTS } from './REF-EXISTS';
import type { Rule, RuleContext, Violation, Warning } from './types';

export const RULES: Rule[] = [ID_UNIQUE, REF_EXISTS, FR_003, FR_004, FR_005, FR_008, FR_009, FR_010, FR_011, FR_012];

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
