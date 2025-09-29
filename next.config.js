const withNextIntl = require('next-intl/plugin')('./src/i18n/request.js');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false
};

module.exports = withNextIntl(nextConfig);

