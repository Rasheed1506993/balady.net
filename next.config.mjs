/** @type {import('next').NextConfig} */
const nextConfig = {
  // تحسينات الأداء والتنقل
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@/components', '@/lib'],
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },

  // تحسين الصور
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // سنة واحدة
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // تحسين الخطوط
  optimizeFonts: true,

  // تحسين CSS
  swcMinify: true,

  // تحسين الـ Bundle
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Headers للتحسين
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      },
      {
        source: '/fonts/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ]
  },

  // تحسين الضغط
  compress: true,

  // تحسين الـ Webpack
  webpack: (config, { dev, isServer }) => {
    // تحسين الإنتاج
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all',
          },
        },
      }
    }

    return config
  },

  // تحسين الـ Output
  output: 'standalone',

  // تحسين الـ Redirects
  async redirects() {
    return []
  },

  // تحسين الـ Rewrites
  async rewrites() {
    return []
  },

  // تحسين الـ ESLint
  eslint: {
    ignoreDuringBuilds: true,
  },

  // تحسين TypeScript
  typescript: {
    ignoreBuildErrors: false,
  },

  // تحسين الـ Trailing Slash
  trailingSlash: false,

  // تحسين الـ PoweredBy
  poweredByHeader: false,

  // تحسين الـ React Strict Mode
  reactStrictMode: true,
}

export default nextConfig
