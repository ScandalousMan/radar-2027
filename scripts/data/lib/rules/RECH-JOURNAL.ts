// RECH-JOURNAL (spec 008, FR-029, FR-030, FR-038, FR-048) : journaux de mission complets, aucune
// exhaustivité prétendue à tort, NOT_FOUND seulement après une recherche significative (R11),
// compte rendu en 13 rubriques.
import { evidenceIndex } from '../research';
import { violation, type Rule, type Violation } from './types';

/** Seuil d'une recherche significative pour une lacune NOT_FOUND (R11). */
export const NOT_FOUND_MIN_QUERIES = 5;
export const NOT_FOUND_MIN_CATEGORIES = 3;
export const REPORT_SECTIONS = 13;

export const RECH_JOURNAL: Rule = {
  code: 'RECH-JOURNAL',
  run({ research }) {
    if (!research) return [];
    const out: Violation[] = [];
    const evidence = evidenceIndex(research);

    for (const j of research.journals.values()) {
      const v = (n: number, message: string) => out.push(violation('RECH-JOURNAL', 'journal', j.id, `(${n}) ${message}`));
      // 1. État.
      if (j.state === 'completed') {
        if (!j.completedAt) v(1, 'mission terminée sans date de fin (completedAt)');
        else if (j.completedAt < j.startedAt) v(1, `fin (${j.completedAt}) antérieure au début (${j.startedAt})`);
      }
      if (j.state === 'interrupted' && !j.interruption?.trim()) v(1, 'mission interrompue sans description de ce qui n’a pas été exploré (interruption)');
      // 2. Requêtes et catégories.
      if (j.queries.length === 0) v(2, 'aucune requête journalisée');
      if (j.categoriesExplored.length === 0) v(2, 'aucune catégorie de sources explorée');
      // 3. Exhaustivité.
      if (j.exhaustive && (j.categoriesNotExplored?.length ?? 0) > 0) v(3, 'déclaré exhaustif alors que des catégories n’ont pas été explorées');
      if (j.exhaustive && j.state === 'interrupted') v(3, 'déclaré exhaustif alors que la mission est interrompue');
      // 4. NOT_FOUND après une recherche significative.
      const categories = new Set(j.categoriesExplored).size;
      for (const g of j.gaps ?? []) {
        if (g.kind === 'NOT_FOUND' && (j.queries.length < NOT_FOUND_MIN_QUERIES || categories < NOT_FOUND_MIN_CATEGORIES))
          v(4, `NOT_FOUND (${g.personality}) après ${j.queries.length} requête(s) et ${categories} catégorie(s) : au moins ${NOT_FOUND_MIN_QUERIES} et ${NOT_FOUND_MIN_CATEGORIES} attendues`);
      }
      // 5. Source retenue enregistrée.
      for (const s of j.sourcesConsulted) if (s.outcome === 'retained' && !s.source) v(5, `source retenue sans identifiant du registre : ${s.url}`);
      // 6. Compte rendu en 13 rubriques.
      const headings = research.reports.get(j.id);
      if (!headings) v(6, `compte rendu journaux/${j.id}.md absent`);
      else {
        const missing = Array.from({ length: REPORT_SECTIONS }, (_, i) => i + 1).filter((n) => !headings.some((h) => new RegExp(`^${n}\\.(\\s|$)`).test(h)));
        if (missing.length > 0) v(6, `compte rendu sans rubrique ${missing.map((n) => `« ## ${n}. »`).join(', ')}`);
      }
      // 7. Preuves ajoutées par ce journal.
      for (const id of j.evidenceAdded ?? []) {
        const e = evidence.get(id);
        if (e && e.journal !== j.id) v(7, `preuve ${id} déclarée ajoutée mais rattachée au journal ${e.journal}`);
      }
    }
    return out;
  },
};
