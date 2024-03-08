import bundleAnalyzer from '@next/bundle-analyzer';
import { withPlausibleProxy } from 'next-plausible';

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

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  images: {
    domains: [new URL(process.env.NEXT_PUBLIC_S3_PUBLIC_URL).hostname],
  },
  typescript: {
    ignoreBuildErrors: process.env.SKIP_LINT === 'true',
  },
  output: 'standalone',
};

export default withBundleAnalyzer(withPlausible(config));
