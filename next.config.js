const withNextIntl = require('next-intl/plugin')('./src/i18n/request.js');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const SILENCED_SASS_DEPRECATIONS = ['legacy-js-api', 'import'];
process.env.SASS_SILENCE_DEPRECATIONS = SILENCED_SASS_DEPRECATIONS.join(',');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: 'standalone',
  sassOptions: {
    silenceDeprecations: SILENCED_SASS_DEPRECATIONS,
  },
};

module.exports = withBundleAnalyzer(withNextIntl(nextConfig));
