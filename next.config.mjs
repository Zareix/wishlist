import bundleAnalyzer from '@next/bundle-analyzer';
import nextPWA from 'next-pwa';

!process.env.SKIP_ENV_VALIDATION && (await import('./src/env.mjs'));

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const withPWA = nextPWA({
  dest: 'public',
  cacheStartUrl: false,
});

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  i18n: {
    locales: ['en-US', 'fr-FR'],
    defaultLocale: 'en-US',
  },
  typescript: {
    ignoreBuildErrors: process.env.SKIP_LINT === 'true',
  },
};

export default withBundleAnalyzer(withPWA(config));
