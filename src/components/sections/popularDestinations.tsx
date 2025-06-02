'use client';

import { useEffect, useState } from 'react';
import { fetchData } from '@/lib/fetchData';
import { Destination } from '@/types/destination';
import DestinationCard from '@/components/cards/destinationCard';

export default function PopularDestinations() {
  const [destinations, setDestinations] = useState<Destination[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await fetchData<Destination[]>('destinations.json');
      setDestinations(data);
    };
    load();
  }, []);

  return (
    <section className="py-8 px-4">
      <h2 className="text-2xl font-bold mb-6">Popular Destinations</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinations.map(dest => (
          <DestinationCard key={dest.id} destination={dest} />
        ))}
      </div>
    </section>
  );
}
