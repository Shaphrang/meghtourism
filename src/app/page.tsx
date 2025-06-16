'use client';

import Header from '@/components/common/header';
import Footer from '@/components/common/footer';
import HeroSection from '@/components/sections/heroSection';
import { DestinationsSection } from '@/components/sections/destinationsSection';
import { HomestaysSection } from '@/components/sections/homestaysSection';
import { EventsSection } from '@/components/sections/eventsSection';
import { ThrillsSection } from '@/components/sections/thrillsSection';

export default function HomePage() {
  return (
    <>
      <Header />

      {/* Full-width, responsive layout*/}
      <main className="w-full px-2 sm:px-6 pt-16 pb-24 bg-white font-sans">
        <HeroSection />

        <section className="mt-4">
          <DestinationsSection />
        </section>

        <section className="mt-4">
          <HomestaysSection />
        </section>

        <section className="mt-4">
          <EventsSection />
        </section>

        <section className="mt-4">
          <ThrillsSection />
        </section>
      </main>

      <Footer />
    </>
  );
}

