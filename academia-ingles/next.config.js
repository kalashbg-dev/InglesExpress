const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: process.env.NODE_ENV === 'development',
  workboxOptions: {
    disableDevLogs: true,
  },
});

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  // Optimizaciones de Build
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,

  // Disable Turbopack error if using webpack plugins (like PWA)
  turbopack: false,

  // Configuración de Imágenes
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'academiaingles.com', // Tu dominio de WordPress
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.academiaingles.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'inglesexpress.com', // Dominio final Guía 2
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.inglesexpress.com', // Subdominios (staging, dev)
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'secure.gravatar.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i0.wp.com', // Jetpack/Photon CDN
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com', // Placeholders
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.academiaingles.com', // Subdominios
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  // Headers de Seguridad y Caché
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
          // Caché para Assets Estáticos (Guía 2)
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/static/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/favicon.ico',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400' }],
      },
    ];
  },

  // Redirects
  async redirects() {
    return [
      { source: '/admin', destination: '/', permanent: false },
      { source: '/wp-admin', destination: '/', permanent: false },
      { source: '/login', destination: '/', permanent: false },
      { source: '/home', destination: '/', permanent: true },
      { source: '/courses', destination: '/niveles', permanent: true },
    ];
  },

  // Rewrites para Proxy de API
  async rewrites() {
    return [
      {
        source: '/api/graphql',
        destination: process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://academiaingles.com/graphql',
      },
    ];
  },

  // Environment variables
  env: {
    SITE_VERSION: '1.0.0',
  },

  // Configuración del Compilador
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
};

module.exports = withSentryConfig(
  withBundleAnalyzer(withPWA(nextConfig)),
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: true,

    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
    tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors.
    automaticVercelMonitors: true,
  }
);
