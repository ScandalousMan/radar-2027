# Contrat CI, commandes et déploiement

## Commandes pnpm (FR-003)

| Commande | Effet |
|---|---|
| `pnpm dev` | serveur de développement Next.js |
| `pnpm build` | export statique dans `out/` |
| `pnpm start:static` | sert `out/` localement (port 3000) pour vérification et e2e |
| `pnpm lint` | ESLint (règles Next, a11y, Storybook, interdictions projet) |
| `pnpm typecheck` | `tsc --noEmit` sur app, ui, stories, tests, e2e |
| `pnpm test` | Vitest : tests unitaires de composants, tests de tokens, stories en tant que tests avec vérification d'accessibilité |
| `pnpm e2e` | Playwright contre `out/` servi par `webServer` |
| `pnpm storybook` | Storybook en développement |
| `pnpm storybook:build` | build statique de Storybook dans `storybook-static/` |
| `pnpm verify` | lint → typecheck → test → storybook:build → build → e2e, même ordre que la CI |

## Workflow GitHub Actions (`.github/workflows/ci.yml`)

- Déclencheurs : `pull_request` vers `main`, `push` sur `main`.
- Un job `ci` sur `ubuntu-latest`, Node 24 (lu depuis `.nvmrc`), pnpm via `pnpm/action-setup`
  (version lue depuis `packageManager`), cache pnpm.
- Étapes, dans l'ordre, chacune en `run` séparé pour un statut lisible : install (frozen
  lockfile) → lint → typecheck → test → storybook:build → build → installation de Chromium
  Playwright → e2e. Les rapports Playwright sont publiés en artefact en cas d'échec.
- Le job `ci` est la vérification requise par la protection de branche de `main` (action manuelle
  du propriétaire, documentée dans le README).
- Budget : moins de 10 minutes (SC-008).

## Playwright

- Projet unique Chromium ; `retries: 1` ; `webServer` lance `pnpm start:static` et attend
  `http://localhost:3000`.
- Test `e2e/home.spec.ts` : `html[lang="fr"]`, titre `home.title` lu depuis `fr.json`, aucune
  requête vers un hôte autre que `localhost`, aucun cookie.

## Vercel (plan Hobby)

- Projet relié au dépôt GitHub par le propriétaire ; framework détecté : Next.js ; `output:
  'export'` → Vercel sert `out/` en statique, aucune fonction déployée.
- Production = `main` ; prévisualisation = chaque pull request (sauf forks externes).
- Aucune variable d'environnement requise.

### En-têtes de sécurité (`vercel.json`, appliqués à `/(.*)`)

| En-tête | Valeur |
|---|---|
| `Content-Security-Policy` | `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |
| `X-Frame-Options` | `DENY` |

`'unsafe-inline'` sur les scripts est nécessaire au rendu statique de Next.js (données
d'hydratation en ligne) et au script de thème initial ; aucune origine tierce n'est autorisée.
Un durcissement par hachages pourra être traité plus tard.

## `.env.example`

```text
# radar-2027 — variables d'environnement
# Aucune variable n'est requise pour construire ou servir le site.
# Les variables du pipeline de données (fonctionnalité 002) seront documentées ici, par exemple :
# ANTHROPIC_API_KEY=sk-ant-xxx   # clé locale, jamais commitée
```
