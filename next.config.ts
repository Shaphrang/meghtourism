const { NextPwa } = require('next-pwa');
const runtimeCaching = require('next-pwa/cache');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseHostname = supabaseUrl.replace(/^https?:\/\//, '');

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    ...runtimeCaching,
    {
      urlPattern: new RegExp(`^https://${supabaseHostname}/rest/v1/.*`),
      handler: 'NetworkFirst',
      options: {
        cacheName: 'supabase-rest-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60, // 1 hour
        },
        networkTimeoutSeconds: 10,
      },
    },
    {
      urlPattern: new RegExp(`^https://${supabaseHostname}/storage/v1/object/public/.*`),
      handler: 'NetworkFirst',
      options: {
        cacheName: 'supabase-storage-cache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24, // 24 hours
        },
        networkTimeoutSeconds: 10,
      },
    },
  ],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: supabaseHostname,
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

module.exports = withPWA(nextConfig);
