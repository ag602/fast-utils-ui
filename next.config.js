/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://fastutils.com/:path*',
      },
    ]
  },
}

module.exports = nextConfig
