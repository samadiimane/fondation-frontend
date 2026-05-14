const withNextIntl = require('next-intl/plugin')('./src/i18n/request.js');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const SILENCED_SASS_DEPRECATIONS = ['legacy-js-api', 'import'];
process.env.SASS_SILENCE_DEPRECATIONS = SILENCED_SASS_DEPRECATIONS.join(',');

const isProduction = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  distDir: isProduction ? '.next' : '.next-dev',
  output: isProduction ? 'standalone' : undefined,
  sassOptions: {
    silenceDeprecations: SILENCED_SASS_DEPRECATIONS,
  },
};

module.exports = withBundleAnalyzer(withNextIntl(nextConfig));
