'use client';

import Link from 'next/link';
import HomepageBannerAds from '../ads/homepageBannerAds';

export default function ThrillsSection() {

  return (
    <section className="w-full px-2 sm:px-4 mt-6">
      <div className="flex justify-between items-center px-1 mb-2">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Adventure & Thrills</h2>
        <Link
          href="/thrills"
          className="text-sm text-emerald-600 hover:underline font-medium"
        >
          View All
        </Link>
      </div>
      <HomepageBannerAds category="thrills" className="mt-2" />
    </section>
  );
}
