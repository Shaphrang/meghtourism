'use client';

import HeroSection from '@/components/sections/heroSection';
import CarouselBanner from '@/components/common/carouselBanner';
import DestinationsSection from '@/components/sections/destinationsSection';
import AccommodationsSection from '@/components/sections/homestaysSection';
import EventsSection from '@/components/sections/eventsSection';
import ThrillsSection from '@/components/sections/thrillsSection';
import CafesSection from '@/components/sections/cafesRestaurantsSection';
import BlogsSection from '@/components/sections/blogsSection';
import ItinerariesSection from '@/components/sections/itinerariesSection';

export default function HomePage() {
  return (
    <main className="w-full min-h-screen bg-gradient-to-b from-green-50 to-blue-50 text-gray-800">
      {/* Hero */}
      <HeroSection />
            <CarouselBanner id="homepage"/>

      {/* Destinations */}
      <section className="mt-4">
        <DestinationsSection />
      </section>
      <CarouselBanner id="destinations"/>


      {/* Accommodations */}
      <section className="mt-4">
        <AccommodationsSection />
      </section>
      <CarouselBanner id="homestays"/>


      {/* Events */}
      <section className="mt-4">
        <EventsSection />
      </section>

      <CarouselBanner id="events"/>

      {/* Thrills */}
      <section className="mt-4">
        <ThrillsSection />
      </section>

      {/* Cafes */}
      <section className="mt-4">
        <CafesSection />
      </section>


      {/* Itineraries */}
      <section className="mt-4">
        <ItinerariesSection />
      </section>
      <CarouselBanner id="business"/>

      {/* Blogs */}
      <section className="mt-4 pb-6">
        <BlogsSection />
      </section>

    </main>
  );
}
