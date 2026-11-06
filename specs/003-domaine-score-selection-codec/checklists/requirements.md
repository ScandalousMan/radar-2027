# Specification Quality Checklist: Moteur de score, sélection déterministe des questions et codec URL

**Purpose**: Validate specification completeness and quality before proceeding to planning
**Created**: 2026-11-06
**Feature**: [spec.md](../spec.md)

## Content Quality

- [x] No implementation details (languages, frameworks, APIs)
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed

## Requirement Completeness

- [x] No [NEEDS CLARIFICATION] markers remain
- [x] Requirements are testable and unambiguous
- [x] Success criteria are measurable
- [x] Success criteria are technology-agnostic (no implementation details)
- [x] All acceptance scenarios are defined
- [x] Edge cases are identified
- [x] Scope is clearly bounded
- [x] Dependencies and assumptions identified

## Feature Readiness

- [x] All functional requirements have clear acceptance criteria
- [x] User scenarios cover primary flows
- [x] Feature meets measurable outcomes defined in Success Criteria
- [x] No implementation details leak into specification

## Notes

- Items marked incomplete require spec updates before `/speckit-clarify` or `/speckit-plan`
- Évaluation du 2026-11-06 (première itération) :
  - **Implementation details** : la spécification ne nomme ni langage, ni bibliothèque, ni
    structure de code. Les formules de score, les règles de quotas, le format logique de la
    charge (3 bits par réponse, base64url, CRC-8 avec son polynôme) sont des exigences
    fonctionnelles indispensables à la bijection et à la reproductibilité, pas des choix
    d'implémentation. Item validé.
  - **Written for non-technical stakeholders** : le sujet est intrinsèquement mathématique ;
    chaque formule est accompagnée d'un exemple chiffré (exemples A et B, quotas 14/5/4 et
    3/3/3/3/2, fragments d'exemple) et d'une justification en langage courant. Item validé.
  - **No [NEEDS CLARIFICATION] markers remain** : les deux marqueurs ont été tranchés par le
    propriétaire le 2026-11-06 : FR-010 plafond strict `G = min(W %, P %)` ; FR-040 positions
    figées par version de banque (un ancien lien reproduit exactement le résultat du jour du
    partage). Les scénarios, entités et SC-009 ont été alignés en conséquence.
  - **Testable and unambiguous** : chaque FR fixe une règle vérifiable (formule, seuil inclusif
    ou strict, ordre de départage, ordre des vérifications du décodeur, motif de rejet).
    Une relecture a précisé le scénario 5 de l'histoire 3 (motifs de rejet possibles après
    substitution d'un caractère) et reformulé un cas limite du mode court. Item validé.
  - **Success criteria** : SC-001 à SC-009 sont chiffrés (exemples reproduits, 10 000 états,
    13 496 combinaisons, 59 / 22 caractères, 100 ms) et ne nomment aucune technologie.
  - **Scope** : la présentation (spec 005), le parcours (spec 004) et la production des données
    et de `D_q` (spec 002) sont explicitement hors périmètre (Assumptions).
