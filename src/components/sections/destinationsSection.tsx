'use client';

import { Destination } from '@/types/destination';
import DestinationCard from '@/components/cards/destinationCard';
import useSupabaseList from '@/hooks/useSupabaseList';
import HorizontalSection from '@/components/sections/horizontalSection';
import Link from 'next/link';

export function DestinationsSection() {
  const { data: destinations = [], loading, error } = useSupabaseList<Destination>('destinations', {
    sortBy: 'name',
    ascending: true,
    page: 1,
    pageSize: 6,
  });

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

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
