import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd21y75miwcfqoq.cloudfront.net'
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com'
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com'
      },
      {
        protocol: 'https',
        hostname: 'assets.getcuebox.com'
      }
    ],
    formats: ['image/avif', 'image/webp'],
    qualities: [50, 60, 75]
  },
  async redirects() {
    return [{ source: '/connect-with-us', destination: '/subscribe', permanent: true }]
  }
}

export default nextConfig
