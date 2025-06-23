'use client';

import useSupabaseList from '@/hooks/useSupabaseList';
import ThrillCard from '@/components/cards/thrillsCard';
import { Thrill } from '@/types/thrill';
import HorizontalScroll from '@/components/common/horizontalScroll';
import Link from 'next/link';

export function ThrillsSection() {
  const { data: thrills = [], loading, error } = useSupabaseList<Thrill>('thrills', {
    sortBy: 'created_at',
    ascending: false,
    page: 1,
    pageSize: 6,
  });

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <section className="py-6 px-4 bg-gradient-to-r from-blue-50 to-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Adventure & Thrill</h2>
          <Link href="/listingPages/thrills" className="text-blue-500 text-sm">
            More →
          </Link>
      </div>

      <HorizontalScroll>
        {thrills.map((thrill, i) => (
          <ThrillCard
            key={i}
            thrill={thrill}
            className="min-w-[250px] max-w-[250px]"
          />
        ))}
      </HorizontalScroll>
    </section>
  );
}
