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
- Revalidation du 2026-11-08 (fonctionnalité activée après la clôture de 002) : tous les points
  passent. Corrections apportées pour aligner la spec sur ce que la 002 a livré :
  - **Numérotation des versions** : la 002 publie des numéros contigus à partir de 1, alors
    que la spec parlait d'un « indice » commençant à 0. L'octet de version est désormais défini
    comme « numéro moins un » (FR-029, FR-033, entité, hypothèses, scénarios de l'histoire 4) ;
    les fragments d'exemple, recalculés, restent inchangés (version 1 codée 0).
  - **Couverture** : FR-007 distingue explicitement la couverture par répondant de la
    couverture de corpus publiée par la 002 (FR-033 de la 002).
  - **État de la banque** : 96 énoncés et aucune version publiée au 2026-11-08 ; les hypothèses
    précisent que le cas « banque < N » s'applique jusqu'à l'atteinte des 250 à 300 énoncés et
    que les tests reposent sur des banques fictives. SC-008 mentionne les 18 candidats déclarés.
  - **Sections ajoutées** : Scope Boundaries, Dependencies et un Constitution Check couvrant
    les sept principes (la conformité n'était énoncée que pour I à III, dans les hypothèses).
  - Les deux fragments d'exemple et leurs sommes de contrôle (`C3`, charge de 44 puis 16 octets)
    ont été recalculés indépendamment et vérifiés exacts.
