import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const policySlugPattern =
  'terms-and-conditions|terms-of-service|privacy-policy|risk-disclosure|cookie-policy|refund-policy|aml-and-kyc-policy';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bitvera-cms.vercel.app',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: `/:slug(${policySlugPattern})`,
        destination: '/en/legal/:slug',
      },
      {
        source: `/:locale(en|de|it)/:slug(${policySlugPattern})`,
        destination: '/:locale/legal/:slug',
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
