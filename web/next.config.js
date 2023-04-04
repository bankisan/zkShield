/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    externalDir: false,
    esmExternals: true,
    externals: true,
    asyncWebAssembly: true,
  },
  transpilePackages: ['common'],
  webpack: function (config, options) {
    if (!options.isServer) {
      config.resolve.fallback.fs = false;
    }
    return config;
  },
}

module.exports = nextConfig
