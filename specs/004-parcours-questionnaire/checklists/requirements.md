# Specification Quality Checklist: Parcours questionnaire

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
- Validation du 2026-11-06 (itération 1, aucune correction nécessaire) :
  - Aucune mention de framework, de composant nommé ni de mécanisme de stockage précis ; la
    reprise est décrite comme « mémorisée sur l'appareil du répondant » (FR-020 à FR-026).
  - Aucun marqueur `[NEEDS CLARIFICATION]` : les points ouverts (seuil d'avertissement, expiration
    de la mémorisation, un seul questionnaire par appareil, navigation arrière du navigateur,
    contenu du mode court hors sujets clés) sont tranchés et consignés dans « Assumptions ».
  - 4 user stories (P1 à P4) testables indépendamment, 26 scénarios Given/When/Then,
    34 exigences fonctionnelles, 11 critères de succès mesurables (temps de complétion, taux
    d'achèvement, 320 px, clavier et lecteur d'écran, absence de trafic réseau, déterminisme).
  - Périmètre borné par la section « Out of Scope » (specs 002, 003 et 005) et dépendances
    listées dans « Assumptions ».
  - Section « Constitution Alignment » couvrant les principes I à VII, comme l'exige la
    gouvernance de la constitution.
- Revalidation du 2026-11-08 (itération 2, après fusion des spécifications 002 et 003 dans `main`) :
  - FR-016, FR-017, SC-009 et l'hypothèse sur la liste de questions reformulés : l'ordre de
    présentation (tourniquet) est produit par la sélection de la 003 (FR-024 à FR-027 de cette
    spécification), le parcours le respecte sans le recalculer ; la position dans cet ordre est
    l'index de la réponse dans l'état complet.
  - Vocabulaire des réponses (« passée », « non répondue »), seuil de fiabilité (« moins de 2
    réponses non passées »), bornes 3 à 5 sujets clés et cibles 25 / 100 questions vérifiés
    conformes au contrat `core-api` de la 003.
  - Hypothèse ajoutée : la version de banque est celle servie au démarrage et reste figée pendant
    le questionnaire et sa reprise (FR-024 traite le cas où le site a changé de version).
  - Aucun autre écart ; tous les points de la checklist restent cochés.
