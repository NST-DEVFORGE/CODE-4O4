import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
    ],
  },
  // Empty turbopack config to silence the warning
  // Service workers work fine without special configuration
  turbopack: {},

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self';  script-src 'self' 'nonce-...' https://www.gstatic.com https://www.googletagmanager.com; connect-src 'self' https://*.firebaseio.com https://*.firebaseapp.com; img-src 'self' https://*.gstatic.com; style-src 'self' 'unsafe-inline';"
          }
        ],
      },
    ];
  },
  // Redirect legacy hackathon admin path to current admin
  async redirects() {
    return [
      {
        source: '/hackathon/admin',
        destination: '/admin',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
