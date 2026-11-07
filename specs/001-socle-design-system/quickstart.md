# Quickstart : valider le socle de bout en bout

Guide de vérification de la fonctionnalité `001-socle-design-system`. Chaque scénario renvoie à
une user story de [spec.md](spec.md) ; les contrats détaillés sont dans [contracts/](contracts/).

## Prérequis

- Node.js 24 (`node --version` ; `.nvmrc` est fourni, `nvm use` suffit).
- pnpm à la version indiquée par `packageManager` dans `package.json` (Corepack ou installation
  globale).
- Aucun fichier `.env` n'est nécessaire.

## 1. Installation et accueil en français (US1)

```bash
pnpm install --frozen-lockfile
```

```bash
pnpm dev
```

Attendu : <http://localhost:3000> affiche la page d'accueil en français en moins de deux minutes
de manipulation ; `document.documentElement.lang === "fr"` ; l'onglet Réseau ne montre aucune
requête hors `localhost` ; aucun cookie.

Modifier `home.title` dans `src/i18n/messages/fr.json`, recharger : le titre change sans
modification de composant.

```bash
pnpm lint
```

Recherche automatisée de texte en dur (règle `react/jsx-no-literals` et sélecteurs
d'attributs textuels de `eslint.config.mjs`, SC-002). **Résultat attendu et constaté le
2026-11-07 : 0 violation.** Contre-épreuve : remplacer `{t('cta')}` par `Commencer` dans
`src/app/page.tsx` fait échouer le lint en désignant la ligne.

```bash
pnpm build
```

```bash
pnpm start:static
```

Attendu : `out/` contient uniquement des fichiers statiques (aucun dossier de fonctions) et la
page servie est identique au mode développement.

## 2. Design system dans Storybook (US2)

```bash
pnpm storybook
```

Attendu : <http://localhost:6006> expose `Fondations/Tokens` (liste des variables CSS avec
valeur claire et sombre) et `UI/<Nom>` pour les 9 composants, chaque état de
[contracts/components.md](contracts/components.md) ayant sa story ; la bascule de thème de la
barre d'outils change les couleurs sans rechargement.

Vérifications ciblées :

- `UI/LikertChoice` : cinq niveaux ordonnés + « Passer cette question » visuellement distinct.
- `UI/ThemePicker` : un sixième sujet est refusé avec message ; deux sujets affichent le message
  de minimum.
- `UI/ScoreBar` : la story « Score indéfini » affiche « — » et un libellé accessible.

Ajouter `className="bg-[#ff0000]"` dans un composant, puis :

```bash
pnpm lint
```

Attendu : échec désignant la ligne fautive. Retirer la modification.

## 3. Accessibilité et mobile (US3)

```bash
pnpm test
```

Attendu : les stories s'exécutent comme tests et la vérification d'accessibilité ne remonte
aucune violation `critical` ni `serious` ; `tokens.test.ts` confirme les contrastes.

Manuellement dans Storybook : Tab atteint le groupe LikertChoice, flèches déplacent le focus
entre les six options, Espace sélectionne ; chaque ThemeChip annonce son état ; le compteur
« n / max » est lu par le lecteur d'écran ; indicateur de focus visible dans les deux thèmes.

Réduire la fenêtre à 320 px (outil « responsive » du navigateur), puis zoom texte 200 % :
aucun défilement horizontal sur l'accueil ni sur les stories.

## 4. CI bloquante (US4)

```bash
pnpm verify
```

Attendu : les six étapes passent dans l'ordre lint → typecheck → test → storybook:build →
build → e2e ; le test e2e tourne contre `out/` servi automatiquement.

Introduire successivement une erreur de type, une erreur de lint et une assertion e2e fausse,
pousser une pull request : chaque cas rend le job `ci` rouge et la fusion est refusée par la
protection de branche ; corriger, la CI repasse au vert. Un import de `react` dans
`src/core/exemple.ts` fait échouer le lint.

## 5. Prévisualisation et production Vercel (US5)

Action manuelle du propriétaire : importer le dépôt dans Vercel (plan Hobby), framework Next.js,
aucune variable d'environnement.

Ouvrir une pull request triviale : une URL de prévisualisation apparaît sur la pull request en
moins de cinq minutes. Fusionner : la production reflète `main` en moins de cinq minutes.

```bash
curl -sI https://<domaine-de-production>/ | grep -iE 'content-security-policy|x-content-type-options|referrer-policy|permissions-policy|x-frame-options'
```

Attendu : les cinq en-têtes de [contracts/ci-and-deploy.md](contracts/ci-and-deploy.md) avec
les valeurs spécifiées ; le tableau de bord Vercel ne liste aucune fonction.

## Résumé des critères mesurables couverts

| Critère | Scénario |
|---|---|
| SC-001, SC-002 | 1 |
| SC-003 | 2 |
| SC-004 à SC-007 | 3 |
| SC-008 | 4 |
| SC-009 à SC-012 | 5 et 1 (build sans variable) |
