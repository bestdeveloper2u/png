import type { NextConfig } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:5000";
let siteHostname = "localhost";
try {
  siteHostname = new URL(siteUrl).hostname;
} catch {}

const isDev = process.env.NODE_ENV === 'development';
const internalApiHost = process.env.INTERNAL_API_HOST || "backend:8000";

const cspDirectives = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: https://imagedelivery.net https://${siteHostname} https://www.${siteHostname} https://via.placeholder.com https://*.replit.dev https://*.riker.replit.dev http://127.0.0.1 http://localhost`,
  `connect-src 'self' http://127.0.0.1:8000 http://localhost:8000 https://${siteHostname} https://www.${siteHostname} https://imagedelivery.net https://*.replit.dev https://*.riker.replit.dev`,
  "font-src 'self' data:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self' https://*.replit.dev https://*.riker.replit.dev",
  "media-src 'self'",
  "worker-src 'self' blob:",
  isDev ? "" : "upgrade-insecure-requests",
].filter(Boolean).join('; ');

const permissionsPolicy = [
  "accelerometer=()",
  "camera=()",
  "geolocation=()",
  "gyroscope=()",
  "magnetometer=()",
  "microphone=()",
  "payment=()",
  "usb=()",
  "interest-cohort=()",
].join(', ');

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspDirectives,
          },
          {
            key: 'Permissions-Policy',
            value: permissionsPolicy,
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/(.*\\.(?:ico|png|jpg|jpeg|gif|webp|svg|woff|woff2|ttf|eot)$)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "imagedelivery.net",
      },
      {
        protocol: "https",
        hostname: siteHostname,
      },
      {
        protocol: "https",
        hostname: `www.${siteHostname}`,
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "*.replit.dev",
      },
      {
        protocol: "https",
        hostname: "*.riker.replit.dev",
      },
    ],
  },
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "*.replit.dev",
    "*.janeway.replit.dev",
    "*.picard.replit.dev",
    "*.riker.replit.dev",
    "*.spock.replit.dev",
    "*.kirk.replit.dev",
  ],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `http://${internalApiHost}/api/:path*`,
      },
      {
        source: '/admin/:path*',
        destination: `http://${internalApiHost}/admin/:path*`,
      },
      {
        source: '/media/:path*',
        destination: `http://${internalApiHost}/media/:path*`,
      },
    ];
  },
};

export default nextConfig;
