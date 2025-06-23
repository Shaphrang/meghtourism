'use client';

import { useEffect, useState, useRef } from 'react';
import useSupabaseList from '@/hooks/useSupabaseList';
import { Event } from '@/types/event';
import EventCard from '@/components/cards/eventCard';
import PromoBanner from '@/components/common/promoBanner';

const PAGE_SIZE = 6;

export default function EventsList() {
  const [location, setLocation] = useState('');
  const [sort, setSort] = useState<'date' | 'az'>('date');
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const { data: events = [], loading, error } = useSupabaseList<Event>('events', {
    filter: location ? { field: 'location', value: location } : undefined,
    sortBy: sort === 'az' ? 'name' : 'date',
    ascending: sort === 'az',
    page,
    pageSize: PAGE_SIZE,
  });

  // Infinite scroll effect
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setLoadingMore(true);
        setTimeout(() => {
          setPage((prev) => prev + 1);
          setLoadingMore(false);
        }, 600);
      }
    });
    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, []);

  // Unique locations for dropdown
  const locations = Array.from(
    new Set(events.map((e) => e.location).filter(Boolean))
  ) as string[];

  if (loading && page === 1) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <>
      {/* Filters */}
      <div className="sticky top-[64px] z-10 bg-white pb-3 pt-2 mb-4 flex flex-wrap gap-3 px-2 border-b">
        <select
          className="border border-gray-300 px-3 py-1.5 text-sm rounded shadow-sm focus:outline-none"
          value={location}
          onChange={(e) => {
            setLocation(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Locations</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>

        <select
          className="border border-gray-300 px-3 py-1.5 text-sm rounded shadow-sm focus:outline-none"
          value={sort}
          onChange={(e) => setSort(e.target.value as 'date' | 'az')}
        >
          <option value="date">Date</option>
          <option value="az">A-Z</option>
        </select>
      </div>

      {/* Grid of cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 transition-all px-2">
        {events.map((event) => (
          <EventCard key={event.id} event={event} className="w-full" />
        ))}

        {/* Show promo banner after every full page */}
        {events.length % PAGE_SIZE === 0 && events.length > 0 && (
          <div className="sm:col-span-2 lg:col-span-3" key={`banner-${page}`}>
            <PromoBanner />
          </div>
        )}
      </div>

      {/* Load more trigger */}
      <div ref={loadMoreRef} className="h-10 mt-6 flex justify-center items-center text-sm text-gray-500">
        {loadingMore && <span>Loading more...</span>}
      </div>
    </>
  );
}
