// src/components/sections/DestinationsSection.tsx
'use client';

import Link from 'next/link';
import HomepageBannerAds from '../ads/homepageBannerAds';

export default function DestinationsSection() {

  return (
    <section className="w-full px-2 sm:px-4 mt-6">
      <div className="flex justify-between items-center px-1 mb-2">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Explore Destinations</h2>
        <Link href="/destinations" className="text-sm text-emerald-600 hover:underline font-medium">
          View All
        </Link>
      </div>
      <HomepageBannerAds category="destinations" className="mt-2" />
    </section>
  );
}
