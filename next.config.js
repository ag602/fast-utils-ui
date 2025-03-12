/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  trailingSlash: true,
  generateEtags: true,
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  images: {
    domains: [],
  },
  experimental: {
    instrumentationHook: false, // Disable trace generation that's causing permission issues
  },
  // Preserve existing API routes
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://fastutils.com/:path*',
      },
    ]
  },
  // Add headers for better SEO and security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
