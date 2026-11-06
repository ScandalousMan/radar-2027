<!--
Sync Impact Report
- Version change: 1.0.0 → 1.0.1 (2026-11-06)
- Modified principles: aucun ; correctif de libellé dans « Contraintes techniques » :
  « Storybook 9 » → « Storybook (version stable courante, 10 au 2026-11-06) », la 9 n'étant plus
  la version stable (constat du plan de la fonctionnalité 001)
- Added sections: aucune (1.0.0 : Principes I à VII, Contraintes techniques et d'hébergement,
  Flux de travail et portes de qualité, Gouvernance)
- Removed sections: aucune
- Templates reviewed: plan-template.md ✅ (Constitution Check lit ce fichier à l'exécution),
  spec-template.md ✅, tasks-template.md ✅ — aucune modification requise
- Follow-up TODOs: aucun
-->

# Constitution de radar-2027

radar-2027 est une application web citoyenne, gratuite et sans publicité, qui aide un électeur
à mesurer son affinité avec chacun des candidats à l'élection présidentielle française de 2027.
Sa particularité : le répondant désigne les sujets qui comptent le plus pour lui, et un candidat
ne peut lui être présenté comme « très aligné » que s'il l'est d'abord sur ces sujets.

## Principes fondamentaux

### I. Neutralité et traçabilité des données (NON NÉGOCIABLE)

- Toute position attribuée à un candidat DOIT être reliée à au moins une source vérifiable
  (URL, titre, date de publication, date de consultation) et porter un niveau de preuve parmi,
  du plus fort au plus faible : programme officiel, livre ou plateforme écrite, déclaration
  publique ou vote.
- Une position sans source, ou dont la relecture humaine n'est pas achevée (statut `draft`),
  ne DOIT jamais entrer dans un calcul de score ni dans un bundle publié. Elle est traitée comme
  « inconnue ».
- Les critères d'inclusion et de retrait d'un candidat DOIVENT être écrits, publics et appliqués
  de manière identique à tous les candidats.
- L'énoncé d'une question DOIT être formulé de façon neutre : aucun terme connoté, aucune
  présupposition, et un équilibre des polarités par thème vérifié à la rédaction.
- Les données (thèmes, questions, candidats, sources, positions) sont versionnées dans le dépôt
  et modifiées uniquement par revue de code.

Justification : la valeur de l'outil repose entièrement sur la confiance ; une seule position
inventée ou orientée discrédite l'ensemble.

### II. Vie privée par construction (NON NÉGOCIABLE)

- Aucune réponse au questionnaire, aucun choix de sujet et aucun résultat ne DOIT être envoyé
  à un serveur ni stocké côté serveur. Tout calcul s'exécute dans le navigateur.
- L'état complet d'un résultat (version de banque, mode, sujets clés, réponse à chaque question
  y compris « passée » et « non répondue ») DOIT tenir dans le **fragment** de l'URL (`#…`),
  jamais dans la query string, afin de ne jamais apparaître dans les journaux d'un hébergeur.
- L'encodage URL ↔ état DOIT être une bijection : deux états distincts produisent deux URL
  distinctes et toute URL valide se décode en exactement un état.
- Aucun traceur tiers, aucun cookie non strictement nécessaire. Toute mesure d'audience
  éventuelle DOIT être sans cookie, agrégée, et ne jamais recevoir le fragment d'URL.
- La reprise d'un questionnaire en cours peut utiliser le stockage local du navigateur, qui
  reste sur l'appareil de l'utilisateur.

### III. Cœur métier pur et testé par propriétés

- Le moteur de score, l'algorithme de sélection des questions et le codec d'URL DOIVENT vivre
  dans un module de domaine (`src/core`) sans aucun import React, DOM ou Next.js ; cette
  frontière est imposée par une règle de lint.
- Ces fonctions DOIVENT être pures et déterministes : mêmes entrées, mêmes sorties, sans horloge,
  sans aléatoire et sans accès réseau.
- Chaque fonction du cœur DOIT être couverte par des tests unitaires incluant des tests de
  propriétés (par exemple : `decode(encode(état)) = état` pour tout état valide ; la somme des
  quotas de sélection égale le nombre de questions demandé ; le score global ne dépasse jamais
  le plafond défini par les sujets clés).
- Les formules de score publiées sur la page « Méthodologie » DOIVENT être celles du code, et
  des exemples chiffrés servent de fixtures de test.

### IV. Design system d'abord

- Tout composant d'interface DOIT vivre dans la bibliothèque de composants (`src/ui`), avoir une
  story Storybook couvrant ses états, et n'utiliser que des tokens de design (couleurs,
  espacements, typographie, rayons, ombres). Aucune valeur de style en dur dans l'application.
- Chaque composant DOIT être utilisable au clavier, exposer des rôles et libellés accessibles,
  et passer la vérification d'accessibilité automatisée de Storybook sans violation critique.
- L'interface est conçue mobile d'abord et DOIT rester utilisable à 320 px de large ; les
  thèmes clair et sombre sont tous deux supportés via les tokens.
- La palette et les visuels NE DOIVENT PAS reprendre les couleurs ou codes d'un parti ; les
  couleurs associées aux candidats servent uniquement à les distinguer dans les graphiques.

### V. Tests comme contrat et intégration continue bloquante

- Chaque parcours utilisateur (choix des sujets, questionnaire court, questionnaire complet,
  résultats, ouverture d'un lien partagé) DOIT disposer d'un test de bout en bout Playwright.
- La CI DOIT exécuter lint, vérification de types, tests unitaires, build Storybook, build de
  l'application et tests de bout en bout ; aucune fusion sur `main` sans CI verte.
- Une validation de schéma des données DOIT s'exécuter en CI et échouer si une position viole
  le principe I (source manquante, statut `draft`, valeur hors échelle).

### VI. Internationalisation dès le premier écran

- Aucune chaîne destinée à l'utilisateur ne DOIT être écrite en dur dans un composant ou une
  page ; toutes passent par le mécanisme d'i18n avec des clés nommées.
- La seule locale livrée est `fr` ; la structure DOIT permettre d'ajouter une seconde locale
  sans modifier les composants (fichiers de messages, formats de date et de nombre localisés).
- Les contenus de données (énoncés de questions, libellés de thèmes, citations) sont en
  français et stockés séparément des chaînes d'interface.

### VII. Simplicité, statique et sobriété

- L'application est exportée en site statique ; aucun backend, aucune fonction serveur, aucun
  cron ni stockage hébergé ne DOIT être introduit sans une exigence explicite inscrite dans une
  spécification approuvée.
- Un seul projet d'application (pas d'espace de travail multi-paquets) tant qu'il n'existe pas
  de second consommateur du cœur métier ; toute complexité ajoutée DOIT être justifiée dans le
  plan de la fonctionnalité qui l'introduit.
- Les données embarquées dans le site DOIVENT rester légères : le bundle de positions et de
  questions chargé par un visiteur ne dépasse pas quelques centaines de kilo-octets.

## Contraintes techniques et d'hébergement

- Pile imposée : Next.js (App Router) avec export statique, React, TypeScript strict,
  Tailwind CSS v4 avec tokens en variables CSS, composants maison, Storybook (version stable courante, 10 au 2026-11-06) avec addon
  d'accessibilité, Vitest, Playwright, next-intl, pnpm, Node.js 24.
- Hébergement : Vercel, plan Hobby. Conséquences : usage non commercial, un seul compte
  propriétaire, pas de fonctions serveur ni de stockage Vercel, production déployée depuis
  `main`, prévisualisation automatique par pull request, en-têtes de sécurité définis dans la
  configuration du projet.
- Pipeline de données : scripts TypeScript hors du bundle applicatif, utilisant l'API Anthropic
  pour l'extraction des positions à partir des sources collectées ; la clé d'API vit dans une
  variable d'environnement locale et n'est jamais commitée ; chaque exécution journalise le
  modèle, la date et le coût.
- Ontologie : liste plate de thèmes reprise de monvote2027.fr (identifiants stables en
  français), chaque question portant un ou deux thèmes ; échelle de réponse à cinq niveaux
  (−2 à +2) plus « passer ».
- Langue de travail : spécifications, constitution, commentaires de données et interface en
  français ; les identifiants de code et les en-têtes de modèles Spec Kit restent en anglais.

## Flux de travail et portes de qualité

- Chaque fonctionnalité suit le cycle Spec Kit : `/speckit-specify` → `/speckit-clarify` si
  des points restent ouverts → relecture humaine de la spécification → `/speckit-plan` →
  `/speckit-tasks` → `/speckit-implement`. Aucun plan technique n'est écrit avant la validation
  de la spécification par le propriétaire du projet.
- Toute pull request DOIT indiquer la fonctionnalité (`specs/NNN-…`) qu'elle sert et cocher la
  conformité aux principes I à VII ; une dérogation DOIT être justifiée dans le plan de la
  fonctionnalité, section « Complexity Tracking ».
- Les modifications de données candidates (positions, sources) passent par une pull request
  distincte des modifications de code, relue par une personne différente de l'auteur de
  l'extraction.
- Les secrets ne transitent jamais par le dépôt ; un fichier `.env.example` documente les
  variables attendues.

## Gouvernance

- La présente constitution prévaut sur toute autre pratique du dépôt. En cas de conflit entre un
  plan, une tâche ou une habitude et la constitution, la constitution s'applique.
- Amendement : proposition par pull request modifiant ce fichier, avec rapport d'impact en
  tête de fichier (version, principes modifiés, sections ajoutées ou retirées, suivis).
  Approbation par le propriétaire du projet.
- Versionnage sémantique : MAJEUR pour le retrait ou la redéfinition d'un principe ; MINEUR
  pour l'ajout d'un principe ou d'une section, ou une extension substantielle ; CORRECTIF pour
  les clarifications et reformulations.
- Revue de conformité : chaque spécification et chaque plan DOIT comporter une vérification
  explicite par rapport aux principes ; `/speckit-analyze` est exécuté avant toute
  implémentation pour détecter les contradictions.

**Version**: 1.0.1 | **Ratified**: 2026-11-06 | **Last Amended**: 2026-11-06
