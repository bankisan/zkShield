/** @type {import('next').NextConfig} */

const nextConfig = {
  experimental: {
    appDir: true,
  },
  transpilePackages: ['common'],
  webpack: function (config, options) {
    if (!options.isServer) {
      config.resolve.fallback = { fs: false, net: false, tls: false };
    }
    return config;
  },
}

module.exports = nextConfig
