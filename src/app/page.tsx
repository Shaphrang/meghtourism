// app/page.tsx (Next.js 13+ App Router)
'use client';

import HeroSection from '@/components/sections/heroSection';
import BannerAd from '@/components/common/bannerAd';
import DestinationsSection from '@/components/sections/destinationsSection';
import AccommodationsSection from '@/components/sections/homestaysSection';
import EventsSection from '@/components/sections/eventsSection';
import ThrillsSection from '@/components/sections/thrillsSection';
import CafesSection from '@/components/sections/cafesRestaurantsSection';
import BlogsSection from '@/components/sections/blogsSection';

export default function HomePage() {
  return (
    <main className="w-full min-h-screen bg-gradient-to-b from-green-50 to-blue-50 text-gray-800">
      {/* Hero */}
      <HeroSection />

      {/* Banner Ad */}
      <BannerAd />

      {/* Destinations */}
      <DestinationsSection />

      {/* Banner Ad */}
      <BannerAd />

      {/* Accommodations */}
      <AccommodationsSection />

      {/* Accommodations */}
      <EventsSection />

      {/* Banner Ad */}
      <BannerAd />

      {/* Banner Ad */}
      <ThrillsSection />
      
      {/* Banner Ad */}
      <CafesSection />

      {/* Banner Ad */}
      <BlogsSection />
    </main>
  );
}