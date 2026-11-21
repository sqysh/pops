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
    return [
      { source: '/connect-with-us', destination: '/subscribe', permanent: true },
      // the page moved when it came back for 2027; old links and shares still land on it
      { source: '/bubble-bash', destination: '/bubbles-bash', permanent: true },
      // the admin used to live under /v2, and links to it are in emails already sent
      { source: '/v2/:path*', destination: '/admin/:path*', permanent: true }
    ]
  }
}

export default nextConfig
