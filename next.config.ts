
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dsvndsiallxdncdkcagj.supabase.co', // ✅ Your Supabase domain
        pathname: '/storage/v1/object/public/**',     // ✅ Matches all image paths in Storage
      },
    ],
  },
};

export default nextConfig;
