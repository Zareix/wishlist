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
    domains: [new URL(env.S3_PUBLIC_URL).hostname],
  },
  typescript: {
    ignoreBuildErrors: process.env.SKIP_LINT === 'true',
  },
};

export default withBundleAnalyzer(withPlausible(config));
