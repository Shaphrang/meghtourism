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
      <main className="pt-20 px-6 py-10 font-sans">
        <HeroSection />
        <DestinationsSection />
        <HomestaysSection />
        <EventsSection />
        <ThrillsSection />
      </main>
      <Footer />
    </>
  );
}
