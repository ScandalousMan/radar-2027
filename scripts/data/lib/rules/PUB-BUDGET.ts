// PUB-BUDGET : tailles des fichiers publiés sous les budgets (SC-004).
import { violation, type Rule, type Violation } from './types';

export const REGISTRY_BUDGET_BYTES = 20_480;

export const PUB_BUDGET: Rule = {
  code: 'PUB-BUDGET',
  run({ published, thresholds }) {
    if (!published) return [];
    const out: Violation[] = [];
    for (const [path, { bytes }] of published.files) {
      const budget =
        path === 'versions.json'
          ? REGISTRY_BUDGET_BYTES - 1
          : /\/main\.json$/.test(path)
            ? thresholds.mainBudgetBytes
            : /\/candidates\/[^/]+\.json$/.test(path)
              ? thresholds.detailBudgetBytes
              : null;
      if (budget !== null && bytes > budget) out.push(violation('PUB-BUDGET', 'file', path, `${bytes} octets pour un budget de ${budget}`));
    }
    return out;
  },
};
