import bundleAnalyzer from '@next/bundle-analyzer';

!process.env.SKIP_ENV_VALIDATION && (await import('./src/env.mjs'));

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  i18n: {
    locales: ['en-US', 'fr-FR'],
    defaultLocale: 'en-US',
  },
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },
};
export default withBundleAnalyzer(config);
