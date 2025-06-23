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

  if (!loading && !error && destinations.length === 0) {
    return <p className="text-sm text-gray-500 px-3">No destinations found.</p>;
  }

  if (loading) return <p className="text-sm px-3">Loading...</p>;
  if (error) return <p className="text-sm text-red-500 px-3">{error}</p>;

  return (
    <section>
      <HorizontalSection
        title="Top Destinations"
        titleClassName="px-3 text-base sm:text-lg font-semibold text-gray-800"
        containerClassName="px-3"
        gapClassName="gap-3"
        items={destinations}
        renderCard={(destination, i) => (
          <DestinationCard
            key={i}
            destination={destination}
            className="min-w-[160px] max-w-[160px]"
          />
        )}
      />

      {/* View All Button */}
      <div className="flex justify-end px-3 pt-2">
        <Link
          href="/listingPages/destinations"
          className="text-sm font-medium text-emerald-600 px-3 py-1.5 rounded-md border border-emerald-600 hover:bg-emerald-50 transition"
        >
          View All →
        </Link>
      </div>
    </section>
  );
}
