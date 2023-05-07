import bundleAnalyzer from '@next/bundle-analyzer';
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

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  i18n: {
    locales: ['en-US', 'fr-FR'],
    defaultLocale: 'en-US',
  },
  images: {
    domains: [new URL(env.S3_PUBLIC_URL).hostname],
  },
  typescript: {
    ignoreBuildErrors: process.env.SKIP_LINT === 'true',
  },
};

export default withBundleAnalyzer(withPlausible(withPWA(config)));
