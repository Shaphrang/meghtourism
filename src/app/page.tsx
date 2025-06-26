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

      {/* Destinations */}
      <section className="mt-4">
        <DestinationsSection />
      </section>

      <BannerAd />

      {/* Accommodations */}
      <section className="mt-4">
        <AccommodationsSection />
      </section>

      <BannerAd />

      {/* Events */}
      <section className="mt-4">
        <EventsSection />
      </section>

      <BannerAd />

      {/* Thrills */}
      <section className="mt-4">
        <ThrillsSection />
      </section>

      {/* Cafes */}
      <section className="mt-4">
        <CafesSection />
      </section>

      {/* Blogs */}
      <section className="mt-4 pb-6">
        <BlogsSection />
      </section>
    </main>
  );
}
