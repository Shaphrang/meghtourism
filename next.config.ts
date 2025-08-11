// next.config.js (CommonJS)
const runtimeCaching = require('next-pwa/cache');

// Read Supabase host once, safely
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseHostname = supabaseUrl ? supabaseUrl.replace(/^https?:\/\//, '') : '';

// Build extra Workbox rules conditionally so dev builds without envs don’t break
const extraCaching = [];

// Next Image optimized route (what the browser actually hits)
extraCaching.push({
  urlPattern: /^https?:\/\/[^/]+\/_next\/image\?url=.*$/i,
  handler: 'StaleWhileRevalidate',
  options: {
    cacheName: 'next-image',
    expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 7 }, // 7 days
  },
});

// Supabase REST + Storage (only if env is present)
if (supabaseHostname) {
  extraCaching.push(
    {
      urlPattern: new RegExp(`^https://${supabaseHostname}/rest/v1/.*`),
      handler: 'NetworkFirst',
      options: {
        cacheName: 'supabase-rest-cache',
        expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 }, // 1 hour
        networkTimeoutSeconds: 10,
      },
    },
    {
      // cache both public and signed object URLs
      urlPattern: new RegExp(`^https://${supabaseHostname}/storage/v1/object/(public|sign)/.*`),
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'supabase-storage-cache',
        expiration: { maxEntries: 300, maxAgeSeconds: 60 * 60 * 24 * 7 }, // 7 days
      },
    }
  );
}

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // keep SW off in dev
  runtimeCaching: [...runtimeCaching, ...extraCaching],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Allow both Supabase Storage and Unsplash (used in your homepage cards)
    remotePatterns: [
      // Unsplash (your mock/homepage images)
      { protocol: 'https', hostname: 'images.unsplash.com' },

      // Supabase storage for this project (public buckets)
      ...(supabaseHostname
        ? [{ protocol: 'https', hostname: supabaseHostname, pathname: '/storage/v1/object/public/**' }]
        : []),

      // If you use signed URLs at any point, uncomment:
      // ...(supabaseHostname
      //   ? [{ protocol: 'https', hostname: supabaseHostname, pathname: '/storage/v1/object/sign/**' }]
      //   : []),
    ],
    formats: ['image/avif', 'image/webp'], // smaller, faster
  },
};

module.exports = withPWA(nextConfig);
