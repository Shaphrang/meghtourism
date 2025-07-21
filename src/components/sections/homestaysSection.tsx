// src/components/sections/AccommodationsSection.tsx
'use client';

import Link from 'next/link';
import HomepageBannerAds from '../ads/homepageBannerAds';

export default function AccommodationsSection() {


  return (
    <section className="w-full px-2 sm:px-4 mt-4">
      <div className="flex justify-between items-center px-1 mb-2">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Stay with Comfort</h2>
        <Link href="/homestays" className="text-sm text-emerald-600 hover:underline font-medium">
          View All
        </Link>
      </div>
      <HomepageBannerAds category="homestays" className="mt-2" />
    </section>
  );
}
