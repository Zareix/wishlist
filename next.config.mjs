import bundleAnalyzer from '@next/bundle-analyzer';
import nextIntl from 'next-intl/plugin';
import { withPlausibleProxy } from 'next-plausible';
import nextPWA from 'next-pwa';

import { env } from './src/env.mjs';

!process.env.SKIP_ENV_VALIDATION && (await import('./src/env.mjs'));

const withPlausible = withPlausibleProxy({
  subdirectory: 'events',
  scriptName: 'script',
  customDomain: 'https://plausible.raphael-catarino.fr',
});

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const withPWA = nextPWA({
  disable: process.env.NODE_ENV === 'development',
  dest: 'public',
  cacheStartUrl: false,
});

const withNextIntl = nextIntl('./src/i18n/index.ts');

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  // i18n: {
  //   locales: ['en-US', 'fr-FR'],
  //   defaultLocale: 'en-US',
  // },
  images: {
    domains: [new URL(env.S3_PUBLIC_URL).hostname],
  },
  typescript: {
    ignoreBuildErrors: process.env.SKIP_LINT === 'true',
  },
  experimental: { serverActions: true },
};

export default withBundleAnalyzer(withPlausible(withPWA(withNextIntl(config))));
