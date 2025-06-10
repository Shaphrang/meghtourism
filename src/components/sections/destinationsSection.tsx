'use client';

import { useEffect, useState } from 'react';
import { Destination } from '@/types/destination';
import DestinationCard from '@/components/cards/destinationCard';
import { fetchData } from '@/lib/fetchData';
import HorizontalSection from '@/components/sections/horizontalSection';
import Link from 'next/link';

export function DestinationsSection() {
  const [destinations, setDestinations] = useState<Destination[]>([]);

  useEffect(() => {
    fetchData('destinations.json')
      .then(setDestinations)
      .catch(console.error);
  }, []);

  return (
    <section className="relative px-4 py-6">
      <HorizontalSection
        title="Top Destinations"
        items={destinations}
        renderCard={(destination, i) => (
          <DestinationCard
            key={i}
            destination={destination}
            className="min-w-[180px] max-w-[180px]"
          />
        )}
      />

      {/* View All Button */}
      <div className="mt-4 flex justify-end">
        <Link
          href="/listingPages/destinations"
          className="text-sm font-medium text-blue-600 px-4 py-2 rounded-md border border-blue-600 hover:bg-blue-50 transition"
        >
          View All →
        </Link>
      </div>
    </section>
  );
}
