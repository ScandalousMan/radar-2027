# Specification Quality Checklist: Corpus, ontologie et pipeline d'extraction des positions

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
- Le marqueur de **FR-006** a été tranché par le propriétaire le 2026-11-06 : inclusion sur déclaration publique de candidature uniquement, pas de statut « pressenti ». Le même jour, la décision « positions figées par version » a conduit à réécrire FR-039 et FR-040 (une mise à jour de positions ou de candidats crée une nouvelle version de banque) et les hypothèses correspondantes.
- Itération 1 : FR-009 (« aucun terme connoté ») jugé non testable en l'état ; corrigé en exigeant une grille de neutralité écrite, publiée et cochée par le relecteur avant activation.
- Les mentions de « dépôt », « cache local hors du dépôt », « empreinte » et « intégration continue » décrivent des règles de gouvernance imposées par la constitution (principes I et V), pas des choix de technologie ; aucun langage, format de fichier, bibliothèque ou service nommé.
- Le terme « modèle de langage » est employé sans nommer de fournisseur ni d'interface, conformément à la constitution.
- Revalidation du 2026-11-07 (fonctionnalité activée après la clôture de 001) : tous les points passent. Une seule correction : la section « Constitution Check » omettait le principe IV, désormais couvert par la page Méthodologie. Rien dans la mise en œuvre de 001 ne contredit la spec ; la CI y réserve déjà l'étape `data:validate` attendue par FR-031 et le dossier `scripts/` prévu par le plan 001 existe.
