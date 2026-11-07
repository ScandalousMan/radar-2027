import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

// next-intl « sans routage i18n » : la configuration de requête fixe la locale `fr` (R2).
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // Export statique : aucun serveur, aucune fonction, `out/` servable tel quel (FR-002, R1).
  output: 'export',
  trailingSlash: false,
  images: { unoptimized: true },
  cacheComponents: false,
  reactStrictMode: true,
  // Les en-têtes de sécurité ne peuvent pas être définis ici en export : voir vercel.json (R8).
};

export default withNextIntl(nextConfig);
