'use client';

import { useEffect, useState } from 'react';
import { fetchData } from '@/lib/fetchData';
import DestinationCard from '@/components/cards/destinationCard';
import { Destination } from '@/types/destination';
import HorizontalScroll from '@/components/common/horizontalScoll';

export function DestinationsSection() {
  const [destinations, setDestinations] = useState<Destination[]>([]);

  useEffect(() => {
    fetchData('destinations.json').then(setDestinations);
  }, []);

  return (
    <section className="py-6 px-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Popular Destinations</h2>
        <a href="/destinations" className="text-blue-500 text-sm">More →</a>
      </div>

      <HorizontalScroll>
        {destinations.map((destination, i) => (
          <DestinationCard
            key={i}
            destination={destination}
            className="min-w-[220px] max-w-[220px]"
          />
        ))}
      </HorizontalScroll>
    </section>
  );
}
